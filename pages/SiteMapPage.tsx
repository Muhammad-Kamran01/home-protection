import React from 'react';
import { Link } from 'react-router-dom';

type SiteLink = {
  label: string;
  to: string;
  note: string;
};

type SiteSection = {
  title: string;
  description: string;
  links: SiteLink[];
};

const sections: SiteSection[] = [
  {
    title: 'Main Website Pages',
    description: 'Core navigation pages users visit most often.',
    links: [
      { label: 'Home', to: '/', note: 'Landing page with highlights and key call to actions.' },
      { label: 'Services', to: '/services', note: 'Browse all available maintenance services.' },
      { label: 'Service Details', to: '/service-details', note: 'Detailed view for selected service information.' },
      { label: 'About Us', to: '/about', note: 'Company profile and mission details.' },
      { label: 'Contact', to: '/contact', note: 'Support channels, message form, and contact data.' },
      { label: 'Careers', to: '/careers', note: 'Hiring and application opportunities.' },
    ],
  },
  {
    title: 'Booking and Checkout',
    description: 'Conversion and transaction-related user journeys.',
    links: [
      { label: 'Book a Service', to: '/booking', note: 'Create a service booking request.' },
      { label: 'Checkout', to: '/checkout', note: 'Review and complete booking payment flow.' },
    ],
  },
  {
    title: 'Account and Authentication',
    description: 'User sign-in, registration, and password recovery pages.',
    links: [
      { label: 'Login', to: '/login', note: 'Customer and role-based account login page.' },
      { label: 'Signup', to: '/signup', note: 'Create a new customer account.' },
      { label: 'Forgot Password', to: '/forgot-password', note: 'Start password reset flow.' },
      { label: 'Reset Password', to: '/reset-password', note: 'Set new credentials after verification.' },
    ],
  },
  {
    title: 'Legal and Trust Pages',
    description: 'Compliance, policies, and trust-related information.',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy', note: 'How personal data is collected and used.' },
      { label: 'Terms of Service', to: '/terms-of-service', note: 'Website usage terms and conditions.' },
      { label: 'Refund Policy', to: '/refund-policy', note: 'Refund, cancellation, and processing rules.' },
      { label: 'FAQs', to: '/faq', note: 'Comprehensive user help and common questions.' },
      { label: 'Site Map', to: '/site-map', note: 'This complete internal page index.' },
    ],
  },
  {
    title: 'Service Category Quick Links',
    description: 'Common category filters available from the footer.',
    links: [
      { label: 'AC Maintenance Category', to: '/services?cat=ac', note: 'Air conditioning service listings.' },
      { label: 'Electrical Works Category', to: '/services?cat=electrical', note: 'Electrical inspection and repair listings.' },
      { label: 'Plumbing Category', to: '/services?cat=plumbing', note: 'Plumbing service requests and support.' },
      { label: 'Painting Category', to: '/services?cat=security', note: 'Painting service offerings.' },
      { label: 'Real Estate Category', to: '/services?cat=janitorial', note: 'Real estate related service listings.' },
    ],
  },
  {
    title: 'Role Based Dashboards',
    description: 'Protected routes available after role authentication.',
    links: [
      { label: 'Customer Dashboard', to: '/dashboard', note: 'Customer booking and account operations.' },
      { label: 'Staff Dashboard', to: '/staff', note: 'Assigned operations and workflow tasks.' },
      { label: 'Admin Dashboard', to: '/admin', note: 'System-wide management and controls.' },
    ],
  },
];

const SiteMapPage: React.FC = () => {
  const totalLinks = sections.reduce((acc, section) => acc + section.links.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-700 text-white">
        <div className="absolute -left-20 -top-16 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em]">
              Search and Navigation
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">Site Map</h1>
            <p className="mt-4 mx-auto max-w-3xl text-blue-100 text-sm sm:text-base leading-relaxed text-center">
              This is a user-friendly sitemap page that lists important website URLs to improve discoverability for users and search engines.
            </p>
            <p className="mt-5 text-xs sm:text-sm font-semibold text-blue-100">Last Updated: March 30, 2026</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Sections</p>
            <p className="mt-2 text-xl font-black text-slate-900">{sections.length}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Indexed Links</p>
            <p className="mt-2 text-xl font-black text-slate-900">{totalLinks}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Format</p>
            <p className="mt-2 text-xl font-black text-slate-900">HTML Site Map</p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{section.title}</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">{section.description}</p>

              <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.links.map((entry) => (
                  <li key={`${section.title}-${entry.to}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Link to={entry.to} className="text-base font-bold text-blue-700 hover:text-blue-800 transition-colors">
                      {entry.label}
                    </Link>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{entry.note}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">Path: {entry.to}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-7">
          <h2 className="text-xl font-black text-blue-900">Why This Helps SEO</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            A structured HTML sitemap improves internal linking and helps crawlers discover important URLs faster. Keep this page updated whenever new pages are added.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/faq" className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors">
              Read FAQs
            </Link>
            <Link to="/contact" className="rounded-xl border border-blue-300 bg-white px-5 py-2.5 text-sm font-bold text-blue-800 hover:bg-blue-100 transition-colors">
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SiteMapPage;
