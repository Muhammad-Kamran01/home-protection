
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { supabase } from '../../supabase';

// Admin Modules
import AdminStats from './AdminStats';
import ServiceManagement from './ServiceManagement';
import CategoryManagement from './CategoryManagement';
import BookingManagement from './BookingManagement';
import CareersManagement from './CareersManagement';
import ContactMessages from './ContactMessages';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: 'fa-chart-pie' },
    { name: 'Bookings', path: '/admin/bookings', icon: 'fa-calendar-alt' },
    { name: 'Services', path: '/admin/services', icon: 'fa-cog' },
    { name: 'Categories', path: '/admin/categories', icon: 'fa-tags' },
    { name: 'Careers', path: '/admin/careers', icon: 'fa-briefcase' },
    { name: 'Contact Messages', path: '/admin/contact-messages', icon: 'fa-envelope' },
    { name: 'Feedback', path: '/admin/feedback', icon: 'fa-comment-dots' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-[#0b1b35] text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fas fa-shield-alt"></i>
          </div>
          {isSidebarOpen && <span className="font-bold text-xl whitespace-nowrap">Admin Panel</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full py-2 rounded-xl text-gray-400 hover:bg-white/5 flex justify-center"
          >
            <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white h-20 shadow-sm flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">
              {menuItems.find(m => m.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-blue-600">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-10 w-[1px] bg-gray-100"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{user?.full_name}</p>
                <p className="text-[10px] text-blue-600 uppercase font-bold tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {user?.full_name[0]}
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 p-2">
                <i className="fas fa-power-off"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <Routes>
            <Route index element={<AdminStats />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="careers" element={<CareersManagement />} />
            <Route path="contact-messages" element={<ContactMessages />} />
            <Route path="feedback" element={<div className="bg-white p-12 rounded-3xl text-center"><i className="fas fa-tools text-6xl text-gray-100 mb-6"></i><p className="text-gray-400">Feedback Module Coming Soon</p></div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
