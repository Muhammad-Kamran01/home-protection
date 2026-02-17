import React, {useState, useEffect, createContext, useContext, useCallback, useRef} from "react";
// Fix: Import from 'react-router' instead of 'react-router-dom' for compatibility with modern environments/v7
import {HashRouter as Router, Routes, Route, Navigate, Link, useLocation, } from "react-router";
import { supabase } from "./supabase";
import { User, UserRole } from "./types";

// Pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Whatsapp from './components/Whatsapp';

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initializationLock = useRef(false);

  // Deep profile fetch from DB
  const fetchProfile = useCallback(async (sessionUser: any) => {
    if (!sessionUser?.id) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (error) throw error;
      return data;

    } catch (err) {
      console.error("Profile fetch failed:", err);
      // On profile fetch failure, we clear user to prevent stuck state
      return null;
    } 
  }, []);

  // The Master Auth Re-validator
  const validateAuth = useCallback(async () => {
    try {
      // 1. Get the current user from Supabase (this checks the token validity)
      const { data: { user: sbUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !sbUser) {
        // If there's an error but we have something in localStorage, it's a stale/poisoned session
        if (localStorage.getItem('hp_maintenance_auth')) {
          console.warn("Poisoned session detected. Clearing storage...");
          localStorage.removeItem('hp_maintenance_auth');
        }
        setUser(null);
      } else {
        // User is valid, now get the profile
        const profile = await fetchProfile(sbUser);
        if (profile) {
          setUser({
            id: profile.id,

            full_name: profile.full_name || '',
            phone: profile.phone || '',
            role: profile.role as UserRole,
            created_at: profile.created_at
          });
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Critical Auth Sync Error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (initializationLock.current) return;
    initializationLock.current = true;

    // Run initial validation
    validateAuth();

    // Event 1: Auth State Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event Fired:", event);
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setUser(null);
        setLoading(false);
      } else if (session?.user) {
        validateAuth();
      }
    });

    // Event 2: Tab Focus / Visibility (The fix for ChatGPT/Gemini tab switching)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        console.log("Tab Active: Re-verifying session integrity...");
        validateAuth();
      }
    };

    // Event 3: Cross-Tab Sync (If you logout in Tab A, Tab B should logout too)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hp_maintenance_auth') {
        console.log("Auth Storage changed in another tab. Syncing...");
        validateAuth();
      }
    };

    window.addEventListener('focus', handleVisibility);
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('storage', handleStorageChange);

    // Safety Valve: Force loading to false after 4 seconds no matter what
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out. Forcing UI load.");
        setLoading(false);
      }
    }, 4000);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timeout);
    };
  }, [validateAuth]);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('hp_maintenance_auth');
    setUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    await validateAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-lock text-blue-600 animate-pulse text-xl"></i>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-sm font-black text-blue-900 uppercase tracking-[0.3em]">Secure Session</h2>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Verifying Connection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if role doesn't match
    const dashboardMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: "/admin",
      [UserRole.STAFF]: "/staff",
      [UserRole.CUSTOMER]: "/dashboard",
    };
    return <Navigate to={dashboardMap[user.role]} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public Layout */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/services"
              element={
                <>
                  <Navbar />
                  <ServicesPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <AboutPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <ContactPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/careers"
              element={
                <>
                  <Navbar />
                  <CareersPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/booking"
              element={
                <>
                  <Navbar />
                  <BookingPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout"
              element={
                <>
                  <Navbar />
                  <CheckoutPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <LoginPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Navbar />
                  <SignupPage />
                  <Footer />
                </>
              }
            />

            {/* Protected Roles */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute allowedRoles={[UserRole.STAFF]}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Whatsapp/>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
