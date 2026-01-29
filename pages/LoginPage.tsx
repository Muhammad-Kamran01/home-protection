
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('1. Starting login...');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('2. Sign in response:', { success: !signInError, error: signInError });
      if (signInError) throw signInError;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      console.log('3. Fetching profile for user:', data.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      console.log('4. Profile response:', { success: !profileError, profile, error: profileError });
      
      if (profileError) {
        throw new Error(`Failed to load user profile: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('Profile not found for this user');
      }

      // Navigate based on role
      const role = profile.role as UserRole;
      console.log('5. Navigating with role:', role);
      
      if (role === UserRole.ADMIN) {
        navigate('/admin', { replace: true });
      } else if (role === UserRole.STAFF) {
        navigate('/staff', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      
      console.log('6. Navigation complete');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <Link to="/" className="mb-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <i className="fas fa-shield-alt text-2xl"></i>
        </div>
        <span className="text-2xl font-bold text-blue-900">Home Protection</span>
      </Link>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-blue-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to manage your bookings</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" title="Coming soon" className="text-sm text-blue-600 font-bold hover:underline">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create one now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
