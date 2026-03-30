
import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy: React.FC = () => {
  const sections = [
    {
      id: 'overview',
      title: '1. Refund Policy Overview',
      content: [
        'Our goal is to resolve issues quickly and fairly. This policy explains when refunds can be requested and how requests are reviewed.',
        'We encourage customers to report service concerns as early as possible so corrective action can be taken before a refund is needed.',
      ],
    },
    {
      id: 'cancellation',
      title: '2. Cancellation Rules',
      content: [
        'More than 24 hours before scheduled service: full refund of advance payment, if any.',
        'Within 24 hours of scheduled service: 20% cancellation fee or PKR 500, whichever is higher.',
        'After technician arrival or completed inspection visit: initial visit and inspection fees are non-refundable.',
      ],
    },
    {
      id: 'eligible',
      title: '3. Eligible Refund Scenarios',
      content: [
        'Service not delivered due to our confirmed scheduling or operational failure.',
        'Significant service quality issue that cannot be corrected in a reasonable follow-up.',
        'Accidental duplicate or excess payment for the same booking.',
      ],
    },
    {
      id: 'not-eligible',
      title: '4. Non-Refundable Cases',
      content: [
        'Consumable materials, installed spare parts, or components already used during service.',
        'Completed service accepted or signed off by customer unless a verified quality dispute is raised in the review window.',
        'Service delays or constraints caused by customer inaccessibility, unsafe site conditions, or withheld information.',
      ],
    },
    {
      id: 'process',
      title: '5. How to Request a Refund',
      content: [
        'Submit a request through support with booking ID, service date, and reason.',
        'Our team may request evidence or schedule a verification call/visit before final decision.',
        'Approved refunds are processed to the original payment method or bank transfer within 7 to 10 business days.',
      ],
    },
    {
      id: 'timeline',
      title: '6. Request Timeline',
      content: [
        'Refund requests should be submitted within 7 calendar days of service completion or cancellation event.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-700 text-white">
        <div className="absolute -left-16 top-2 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-8 -bottom-8 h-48 w-48 rounded-full bg-yellow-400/20 blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em]">Cancellations and Refunds</p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">Refund Policy</h1>
            <p className="mt-4 mx-auto max-w-3xl text-blue-100 text-sm sm:text-base leading-relaxed text-center">
              This policy outlines cancellation windows, eligibility conditions, and the refund workflow to keep outcomes transparent and predictable.
            </p>
            <p className="mt-5 text-xs sm:text-sm font-semibold text-blue-100">Last Updated: March 30, 2026</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{textAlign: 'center'}}>
          {[
            { title: 'Request Window', value: 'Within 7 calendar days' },
            { title: 'Standard Processing', value: '7 to 10 business days' },
            { title: 'Best First Step', value: 'Contact support with booking ID' },
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
                  <Link to="/terms-of-service" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Terms of Service</Link>
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
              <h2 className="text-xl font-black text-blue-900">Need Refund Assistance?</h2>
              <p className="mt-3 text-slate-700">Submit your booking details and our support team will guide you through review and next steps.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <p><span className="font-bold text-slate-900">Email:</span> info@homeprotection.pk</p>
                <p><span className="font-bold text-slate-900">Phone:</span> +92 321 4605210</p>
                <p className="sm:col-span-2"><span className="font-bold text-slate-900">Address:</span> 132-1-D1, Town Ship, Lahore, Punjab, Pakistan</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors">Contact Support</Link>
                <Link to="/booking" className="rounded-xl border border-blue-300 bg-white px-5 py-2.5 text-sm font-bold text-blue-800 hover:bg-blue-100 transition-colors">Create Booking</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
