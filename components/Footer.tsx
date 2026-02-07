
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1b35] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-white">Home Protection</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Leading maintenance service provider in Pakistan. Providing top-tier solutions for AC, Electrical, Plumbing, and Real Estate since 2005.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-800 transition-colors text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">All Services</Link></li>
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Our Team</Link></li>
              <li><Link to="/careers" className="hover:text-blue-500 transition-colors">Join Our Team</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Our Services</h3>
            <ul className="space-y-4">
              <li><Link to="/services?cat=ac" className="hover:text-blue-500 transition-colors">AC Maintenance</Link></li>
              <li><Link to="/services?cat=electrical" className="hover:text-blue-500 transition-colors">Electrical Works</Link></li>
              <li><Link to="/services?cat=plumbing" className="hover:text-blue-500 transition-colors">Plumbing Services</Link></li>
              <li><Link to="/services?cat=security" className="hover:text-blue-500 transition-colors">Painting Services</Link></li>
              <li><Link to="/services?cat=janitorial" className="hover:text-blue-500 transition-colors">Real Estate Services</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Details</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <i className="fas fa-map-marker-alt text-blue-500 mt-1"></i>
                <span>Town Ship, Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-phone-alt text-blue-500 mt-1"></i>
                <span>+92-316-1455160</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-envelope text-blue-500 mt-1"></i>
                <span>latestservicesprovider@gmail.com</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-clock text-blue-500 mt-1"></i>
                <span>Mon - Sat: 09:00 AM - 06:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2025 Home Protection. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
