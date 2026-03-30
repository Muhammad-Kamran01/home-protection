
import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using Home Protection website and services, you agree to these Terms of Service. If you do not agree, please do not use the platform.',
        'These terms apply to all users, including visitors, registered customers, and applicants submitting employment forms.',
      ],
    },
    {
      id: 'services',
      title: '2. Nature of Services',
      content: [
        'Home Protection provides maintenance and related support services including AC, electrical, plumbing, security, painting, and property care services.',
        'Service availability, response times, and pricing may vary by location, workload, and the assessed scope at the service site.',
      ],
    },
    {
      id: 'accounts',
      title: '3. Account and User Responsibilities',
      content: [
        'You are responsible for maintaining accurate account information and protecting login credentials. Activity under your account is considered your responsibility.',
        'You agree to provide safe and lawful site access conditions for technicians and to communicate relevant hazards before service begins.',
      ],
    },
    {
      id: 'booking',
      title: '4. Booking, Pricing, and Payment',
      content: [
        'Bookings are confirmed based on slot and team availability. Prices shown online may be adjusted if on-site inspection identifies additional required work.',
        'Payment terms are shared during booking or checkout. Unpaid or disputed balances may delay or suspend future service scheduling.',
      ],
    },
    {
      id: 'conduct',
      title: '5. Acceptable Use',
      content: [
        'Users must not misuse the platform, submit false data, attempt unauthorized access, or interfere with platform security and operations.',
        'Abusive conduct toward staff, technicians, or support teams may result in account suspension or service refusal.',
      ],
    },
    {
      id: 'liability',
      title: '6. Warranty and Liability Limits',
      content: [
        'Services are provided with professional care; however, except where required by law, Home Protection disclaims implied warranties not expressly stated.',
        'To the maximum extent permitted by law, total liability for any direct claim is limited to the amount paid for the specific service giving rise to the claim.',
      ],
    },
    {
      id: 'law',
      title: '7. Governing Law and Disputes',
      content: [
        'These terms are governed by the laws of the Islamic Republic of Pakistan. Disputes are subject to the competent courts in Lahore, Punjab.',
      ],
    },
    {
      id: 'changes',
      title: '8. Changes to These Terms',
      content: [
        'We may revise these terms as services evolve. Material updates are published on this page with a revised date. Continued use means acceptance of the updated terms.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 text-white">
        <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-300/20 blur-2xl" />
        <div className="absolute right-0 bottom-0 h-52 w-52 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em]">Legal Agreement</p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
            <p className="mt-4 mx-auto max-w-3xl text-blue-100 text-sm sm:text-base leading-relaxed text-center">
              These terms define the rules for using Home Protection website, accounts, bookings, and service workflows. They help keep expectations transparent for everyone.
            </p>
            <p className="mt-5 text-xs sm:text-sm font-semibold text-blue-100">Last Updated: March 30, 2026</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{textAlign: 'center'}}>
          {[
            { title: 'Who It Applies To', value: 'Visitors, registered users, and applicants' },
            { title: 'Core Areas', value: 'Accounts, bookings, payments, platform conduct' },
            { title: 'Jurisdiction', value: 'Courts of Lahore, Punjab, Pakistan' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">{item.title}</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">On This Page</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-slate-600 hover:text-blue-700 transition-colors font-medium">{section.title}</a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Related Legal</h3>
                <div className="mt-3 space-y-2">
                  <Link to="/privacy-policy" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Privacy Policy</Link>
                  <Link to="/refund-policy" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Refund Policy</Link>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-5">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                <div className="mt-4 space-y-3 text-slate-700 leading-relaxed">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-7">
              <h2 className="text-xl font-black text-blue-900">Questions About These Terms</h2>
              <p className="mt-3 text-slate-700">Reach out if you need clarification before booking or creating an account.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <p><span className="font-bold text-slate-900">Email:</span> info@homeprotection.pk</p>
                <p><span className="font-bold text-slate-900">Phone:</span> +92 321 4605210</p>
                <p className="sm:col-span-2"><span className="font-bold text-slate-900">Address:</span> 132-1-D1, Town Ship, Lahore, Punjab, Pakistan</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors">Contact Support</Link>
                <Link to="/booking" className="rounded-xl border border-blue-300 bg-white px-5 py-2.5 text-sm font-bold text-blue-800 hover:bg-blue-100 transition-colors">Book a Service</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
