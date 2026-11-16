import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const faqData: FAQItem[] = [
  {
    id: 'faq-01',
    category: 'General',
    question: 'What is Home Protection?',
    answer:
      'Home Protection is a maintenance services platform in Pakistan that helps customers book trusted AC, electrical, plumbing, painting, and real estate-related services through one website.',
  },
  {
    id: 'faq-02',
    category: 'General',
    question: 'Which cities do you currently serve?',
    answer:
      'Service coverage is focused around Lahore and nearby serviceable zones. Final availability depends on technician coverage and service type in your exact location.',
  },
  {
    id: 'faq-03',
    category: 'General',
    question: 'What are your working hours?',
    answer:
      'Standard support and operations run Monday to Saturday, 09:00 AM to 06:00 PM. Special cases may be handled outside regular hours based on availability.',
  },
  {
    id: 'faq-04',
    category: 'General',
    question: 'Is this website only for home maintenance?',
    answer:
      'No. In addition to household needs, the platform supports selected commercial and property-related service requests depending on scope and location.',
  },
  {
    id: 'faq-05',
    category: 'General',
    question: 'How do I contact support quickly?',
    answer:
      'Use the Contact page, phone details in the footer, or WhatsApp chat option on the site for the fastest response during business hours.',
  },
  {
    id: 'faq-06',
    category: 'Accounts',
    question: 'Do I need an account to book a service?',
    answer:
      'Creating an account is recommended because it helps track bookings, status updates, and future service history. Some interactions may still be available without full account setup.',
  },
  {
    id: 'faq-07',
    category: 'Accounts',
    question: 'How do I create an account?',
    answer:
      'Use the Signup page, provide your details, and submit the registration form. Once registered, you can sign in to manage bookings and profile data.',
  },
  {
    id: 'faq-08',
    category: 'Accounts',
    question: 'I forgot my password. What should I do?',
    answer:
      'Open the Forgot Password page, enter your account email, and follow the reset instructions sent to you. Then create a new secure password on the Reset Password page.',
  },
  {
    id: 'faq-09',
    category: 'Accounts',
    question: 'Can I update my phone number or profile details?',
    answer:
      'Yes. You can request profile updates through your dashboard or by contacting support if a direct profile edit option is not available for your account role.',
  },
  {
    id: 'faq-10',
    category: 'Accounts',
    question: 'How many user roles exist on this platform?',
    answer:
      'The platform supports customer, staff, and admin roles with separate dashboards and permissions for secure operations.',
  },
  {
    id: 'faq-11',
    category: 'Bookings',
    question: 'How do I book a service?',
    answer:
      'Go to Services, choose the required category or specific offering, then proceed to the booking flow and provide your address, schedule, and contact details.',
  },
  {
    id: 'faq-12',
    category: 'Bookings',
    question: 'Can I select a preferred date and time?',
    answer:
      'Yes. You can submit preferred scheduling details during booking. Final confirmation depends on technician availability and route planning.',
  },
  {
    id: 'faq-13',
    category: 'Bookings',
    question: 'How do I know my booking is confirmed?',
    answer:
      'After submission, your request is reviewed and you receive confirmation through the platform flow and support communication channels.',
  },
  {
    id: 'faq-14',
    category: 'Bookings',
    question: 'Can I reschedule an existing booking?',
    answer:
      'Yes. Contact support as soon as possible with your booking ID. Reschedule options depend on notice period and slot availability.',
  },
  {
    id: 'faq-15',
    category: 'Bookings',
    question: 'Can I cancel a booking?',
    answer:
      'Yes. Cancellations are allowed, but charges may apply depending on how close the cancellation is to the scheduled visit. See the Refund Policy for details.',
  },
  {
    id: 'faq-16',
    category: 'Bookings',
    question: 'What details should I include while booking?',
    answer:
      'Provide accurate address, landmark, phone number, issue description, and access notes. Correct details help reduce delays and repeat visits.',
  },
  {
    id: 'faq-17',
    category: 'Pricing and Payments',
    question: 'Are your prices fixed?',
    answer:
      'Some services have starting rates while final charges can vary by site conditions, material needs, complexity, and job duration.',
  },
  {
    id: 'faq-18',
    category: 'Pricing and Payments',
    question: 'Will I receive a cost estimate before work starts?',
    answer:
      'Yes. For variable-scope tasks, a technician or support team provides an estimate after initial assessment before major work proceeds.',
  },
  {
    id: 'faq-19',
    category: 'Pricing and Payments',
    question: 'What payment methods are supported?',
    answer:
      'Payment options may include direct transfer and other methods shared during checkout or booking confirmation based on your order type.',
  },
  {
    id: 'faq-20',
    category: 'Pricing and Payments',
    question: 'Do you require advance payment?',
    answer:
      'Certain bookings may require partial or full advance payment depending on service category, travel effort, materials, or scheduling constraints.',
  },
  {
    id: 'faq-21',
    category: 'Pricing and Payments',
    question: 'Can I get an invoice or payment proof?',
    answer:
      'Yes. You can request invoice or proof details through support by sharing your booking reference and payment information.',
  },
  {
    id: 'faq-22',
    category: 'Refunds',
    question: 'When am I eligible for a refund?',
    answer:
      'Refunds are generally considered for non-delivery due to operational issues, unresolved quality disputes, or duplicate/excess payments.',
  },
  {
    id: 'faq-23',
    category: 'Refunds',
    question: 'What cases are usually non-refundable?',
    answer:
      'Used materials, installed parts, accepted completed service, and customer-side access or condition issues are typically not refundable.',
  },
  {
    id: 'faq-24',
    category: 'Refunds',
    question: 'How long do refunds take?',
    answer:
      'Approved refunds are usually processed within 7 to 10 business days through the original payment route or approved transfer method.',
  },
  {
    id: 'faq-25',
    category: 'Refunds',
    question: 'How soon should I submit a refund request?',
    answer:
      'Submit within 7 calendar days of service completion or cancellation event for timely review under policy timelines.',
  },
  {
    id: 'faq-26',
    category: 'Services',
    question: 'Which service categories are available?',
    answer:
      'Key categories include AC maintenance, electrical work, plumbing, painting, and real estate-related support services.',
  },
  {
    id: 'faq-27',
    category: 'Services',
    question: 'Do you provide emergency repairs?',
    answer:
      'Urgent requests are handled based on team availability, travel distance, safety requirements, and workload at the time of contact.',
  },
  {
    id: 'faq-28',
    category: 'Services',
    question: 'Do technicians bring tools and materials?',
    answer:
      'Technicians bring standard tools. Required materials or replacement parts may be arranged separately and reflected in the final cost.',
  },
  {
    id: 'faq-29',
    category: 'Services',
    question: 'Can I request recurring maintenance?',
    answer:
      'Yes. You can discuss recurring plans with support for periodic inspection and preventive maintenance schedules.',
  },
  {
    id: 'faq-30',
    category: 'Services',
    question: 'Can one booking include multiple issues?',
    answer:
      'Yes. Mention all known issues in the booking notes so the team can prepare better and reduce repeated visits.',
  },
  {
    id: 'faq-31',
    category: 'Quality and Safety',
    question: 'Are your technicians verified?',
    answer:
      'Team assignment is managed by internal operations with role-based controls and service workflow checks to maintain reliability and accountability.',
  },
  {
    id: 'faq-32',
    category: 'Quality and Safety',
    question: 'What if the issue is not resolved on first visit?',
    answer:
      'Report the problem quickly with your booking ID and photos if possible. The team will review and arrange a follow-up action when applicable.',
  },
  {
    id: 'faq-33',
    category: 'Quality and Safety',
    question: 'How do I report poor service quality?',
    answer:
      'Use Contact support and share booking details, issue summary, and any evidence. Quality reviews are prioritized for fair resolution.',
  },
  {
    id: 'faq-34',
    category: 'Quality and Safety',
    question: 'Do you offer any service warranty?',
    answer:
      'Warranty or revisit commitments vary by service type and materials used. Exact terms are clarified during quote and job finalization.',
  },
  {
    id: 'faq-35',
    category: 'Website and Technical',
    question: 'The website is not loading properly. What should I do?',
    answer:
      'Refresh the page, clear browser cache, and try again. If the issue continues, contact support with your browser and device details.',
  },
  {
    id: 'faq-36',
    category: 'Website and Technical',
    question: 'Is my account session secure?',
    answer:
      'The platform uses authenticated sessions and role-based access checks. For best security, avoid sharing passwords and always log out on shared devices.',
  },
  {
    id: 'faq-37',
    category: 'Website and Technical',
    question: 'How do I reach the legal pages?',
    answer:
      'Legal pages are available from the footer links, including Privacy Policy, Terms of Service, Refund Policy, and this FAQs page.',
  },
  {
    id: 'faq-38',
    category: 'Privacy and Data',
    question: 'What personal data do you collect?',
    answer:
      'Data may include name, contact details, service address, account credentials, booking preferences, and limited technical usage information.',
  },
  {
    id: 'faq-39',
    category: 'Privacy and Data',
    question: 'Do you sell customer data?',
    answer:
      'No. Personal data is not sold. Data is used for service delivery, support, compliance, and operational improvement.',
  },
  {
    id: 'faq-40',
    category: 'Privacy and Data',
    question: 'How can I request data correction or deletion?',
    answer:
      'Submit a request via support with your registered details. Requests are processed based on legal and operational obligations.',
  },
  {
    id: 'faq-41',
    category: 'Careers',
    question: 'How do I apply for a job?',
    answer:
      'Visit the Careers page and submit the required information. Recruitment status depends on role demand and candidate fit.',
  },
  {
    id: 'faq-42',
    category: 'Careers',
    question: 'What details should I provide in a careers application?',
    answer:
      'Share accurate contact details, relevant experience, skills, and role preference to help the team evaluate your profile quickly.',
  },
  {
    id: 'faq-43',
    category: 'Business and Partnerships',
    question: 'Can businesses partner with Home Protection?',
    answer:
      'Yes. For bulk maintenance, recurring facility support, or partnership discussions, contact the business support team through the Contact page.',
  },
  {
    id: 'faq-44',
    category: 'Business and Partnerships',
    question: 'Do you handle apartment complexes or offices?',
    answer:
      'Yes, subject to scope and location. Multi-unit and commercial service requests are reviewed case by case for staffing and scheduling feasibility.',
  },
  {
    id: 'faq-45',
    category: 'Support',
    question: 'What information should I share when contacting support?',
    answer:
      'Always include your name, registered phone/email, booking ID (if available), service address, and a clear issue summary for faster assistance.',
  },
  {
    id: 'faq-46',
    category: 'Support',
    question: 'How quickly does support usually respond?',
    answer:
      'Response times vary by channel and workload, but requests received during business hours are generally handled with priority.',
  },
  {
    id: 'faq-47',
    category: 'Support',
    question: 'Can I get updates on my booking status?',
    answer:
      'Yes. You can request status updates through support channels and track service progress through your account workflow where available.',
  },
  {
    id: 'faq-48',
    category: 'Legal and Compliance',
    question: 'Which policy should I read first?',
    answer:
      'Start with Terms of Service for usage rules, then review Privacy Policy for data handling and Refund Policy for cancellation and refund scenarios.',
  },
  {
    id: 'faq-49',
    category: 'Legal and Compliance',
    question: 'Can policies change over time?',
    answer:
      'Yes. Policies may be updated to reflect legal requirements, service improvements, or operational changes. Always check the latest update date on each page.',
  },
  {
    id: 'faq-50',
    category: 'Legal and Compliance',
    question: 'How can I ask a question that is not listed here?',
    answer:
      'Reach out through the Contact page with your question and context. The team can provide case-specific guidance and may add new FAQs over time.',
  },
];

const FAQsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>('faq-01');

  const categories = useMemo(
    () => Array.from(new Set(faqData.map((item) => item.category))),
    []
  );

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return faqData;

    return faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(normalized) ||
        item.answer.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-700 text-white">
        <div className="absolute -left-20 -top-16 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em]">
              Help Center
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 mx-auto max-w-3xl text-blue-100 text-sm sm:text-base leading-relaxed text-center">
              A complete FAQ guide covering account access, bookings, services, payments, refunds, privacy, careers, technical support, and legal topics for Home Protection.
            </p>
            <p className="mt-5 text-xs sm:text-sm font-semibold text-blue-100">Last Updated: March 30, 2026</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Total FAQs</p>
            <p className="mt-2 text-xl font-black text-slate-900">{faqData.length}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Categories</p>
            <p className="mt-2 text-xl font-black text-slate-900">{categories.length}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Matching Results</p>
            <p className="mt-2 text-xl font-black text-slate-900">{filteredFaqs.length}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <label htmlFor="faq-search" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Search FAQs
          </label>
          <input
            id="faq-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by question, answer, or category"
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">FAQ Categories</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {categories.map((category) => {
                  const total = faqData.filter((item) => item.category === category).length;
                  return (
                    <li key={category} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                      <span className="font-medium text-slate-700">{category}</span>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">{total}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Related Pages</h3>
                <div className="mt-3 space-y-2">
                  <Link to="/privacy-policy" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Privacy Policy</Link>
                  <Link to="/terms-of-service" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Terms of Service</Link>
                  <Link to="/refund-policy" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Refund Policy</Link>
                  <Link to="/contact" className="block text-sm font-semibold text-blue-700 hover:text-blue-800">Contact Support</Link>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <h2 className="text-lg font-black text-amber-900">No FAQ matched your search</h2>
                <p className="mt-2 text-sm text-amber-900/80">
                  Try broader keywords like booking, refund, password, support, privacy, or payment.
                </p>
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <section key={item.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full text-left px-5 sm:px-6 py-5"
                      aria-expanded={isOpen}
                      aria-controls={`${item.id}-content`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-700">{item.category}</p>
                          <h2 className="mt-2 text-base sm:text-lg font-black text-slate-900 leading-snug">{item.question}</h2>
                        </div>
                        <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 text-sm font-bold">
                          {isOpen ? '-' : '+'}
                        </span>
                      </div>
                    </button>
                    {isOpen && (
                      <div id={`${item.id}-content`} className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-slate-700 leading-relaxed border-t border-slate-100">
                        <p className="pt-4">{item.answer}</p>
                      </div>
                    )}
                  </section>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
