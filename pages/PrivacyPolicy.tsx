
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      id: 'scope',
      title: '1. Scope and Consent',
      content: [
        'This Privacy Policy explains how Home Protection Maintenance Services collects, uses, shares, and protects your personal data when you browse our website, create an account, submit forms, or request services.',
        'By using our website and services, you agree to this policy. If you do not agree, please discontinue use of the platform.',
      ],
    },
    {
      id: 'collect',
      title: '2. Data We Collect',
      content: [
        'We collect details you provide directly, including full name, phone number, email address, service address, booking preferences, and account credentials.',
        'For hiring purposes, we may collect profile details submitted through careers forms, such as CV data, experience, and role preferences.',
        'We may also collect technical information such as browser type, session identifiers, and usage metrics to improve reliability and security.',
      ],
    },
    {
      id: 'usage',
      title: '3. How We Use Your Information',
      content: [
        'Your data is used to create and manage accounts, confirm bookings, coordinate technicians, provide support, and share status updates.',
        'We also use limited analytics data to improve user experience, monitor platform quality, and prevent misuse or unauthorized access.',
      ],
    },
    {
      id: 'sharing',
      title: '4. Data Sharing and Disclosure',
      content: [
        'We do not sell personal data. Information is shared only when required to deliver services, process bookings, or comply with legal obligations.',
        'Authorized team members, field staff, and technical providers receive only the data needed for their role, under confidentiality expectations.',
      ],
    },
    {
      id: 'retention',
      title: '5. Data Retention and Security',
      content: [
        'We retain personal data only for as long as necessary to deliver services, resolve disputes, fulfill legal requirements, and maintain records.',
        'Reasonable technical and organizational safeguards are used to protect your information. No internet system is completely risk free, but we continuously improve controls.',
      ],
    },
    {
      id: 'rights',
      title: '6. Your Rights and Choices',
      content: [
        'You may request access, correction, or deletion of your personal information, subject to legal and operational requirements.',
        'You may also request updates to contact preferences or object to certain communications by contacting our support team.',
      ],
    },
    {
      id: 'updates',
      title: '7. Policy Updates',
      content: [
        'We may update this policy to reflect service improvements, legal updates, or operational changes. The updated date on this page indicates the latest revision.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em]">
              Privacy and Data
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
            <p className="mt-4 mx-auto max-w-3xl text-blue-100 text-sm sm:text-base leading-relaxed text-center">
              Your trust is core to our service. This policy explains what data we collect, why we need it, and the controls available to you when using Home Protection.
            </p>
            <p className="mt-5 text-xs sm:text-sm font-semibold text-blue-100">Last Updated: March 30, 2026</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{textAlign: 'center'}}>
          {[
            { title: 'Collected Data', value: 'Identity, contact, booking, usage signals' },
            { title: 'Primary Purpose', value: 'Service delivery, support, and protection' },
            { title: 'Your Control', value: 'Access, correction, deletion requests' },
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
                    <a href={`#${section.id}`} className="text-slate-600 hover:text-blue-700 transition-colors font-medium">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Related Legal</h3>
                <div className="mt-3 space-y-2">
                  <Link to="/terms-of-service" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Terms of Service</Link>
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
              <h2 className="text-xl font-black text-blue-900">Contact for Privacy Requests</h2>
              <p className="mt-3 text-slate-700">For data access, correction, or deletion requests, contact us through our official support channels.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <p><span className="font-bold text-slate-900">Email:</span> info@homeprotection.pk</p>
                <p><span className="font-bold text-slate-900">Phone:</span> +92 316 1455160</p>
                <p className="sm:col-span-2"><span className="font-bold text-slate-900">Address:</span> 132-1-D1, Town Ship, Lahore, Punjab, Pakistan</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors">Contact Support</Link>
                <Link to="/services" className="rounded-xl border border-blue-300 bg-white px-5 py-2.5 text-sm font-bold text-blue-800 hover:bg-blue-100 transition-colors">Browse Services</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
