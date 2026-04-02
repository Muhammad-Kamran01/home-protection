import React from 'react';
import { Link } from 'react-router-dom';
import { sitemapSections } from '../sitemap.config.js';

const SiteMapPage: React.FC = () => {
  const totalLinks = sitemapSections.reduce((acc, section) => acc + section.links.length, 0);

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
            <p className="mt-2 text-xl font-black text-slate-900">{sitemapSections.length}</p>
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
          {sitemapSections.map((section) => (
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
