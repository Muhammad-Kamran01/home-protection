
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case UserRole.ADMIN: return '/admin';
      case UserRole.STAFF: return '/staff';
      case UserRole.CUSTOMER: return '/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <i className="fas fa-shield-alt text-2xl"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-900 leading-tight">Home Protection</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Maintenance Experts</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  location.pathname === link.path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                } hover:text-blue-600 px-1 py-2 text-sm font-medium transition-colors`}
              >
                {link.name}
              </Link>
            ))}
            
            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to={getDashboardPath()} className="bg-gray-100 text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                  My Dashboard
                </Link>
                <button onClick={signOut} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              {link.name}
            </Link>
          ))}
          {!user ? (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-2 text-gray-600 font-medium">Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center bg-blue-600 text-white py-2 rounded-md font-bold">Register</Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} className="block w-full text-center bg-gray-100 text-blue-900 py-2 rounded-md font-semibold">Dashboard</Link>
              <button onClick={() => { signOut(); setIsOpen(false); }} className="block w-full text-center text-red-500 py-2">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
