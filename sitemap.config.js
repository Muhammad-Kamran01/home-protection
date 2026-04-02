export const siteUrl = 'https://www.homeprotection.pk';

export const sitemapSections = [
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

export const sitemapEntries = [
  { path: '/', changeFreq: 'daily', priority: 1.0 },
  { path: '/services', changeFreq: 'weekly', priority: 0.9 },
  { path: '/service-details', changeFreq: 'monthly', priority: 0.8 },
  { path: '/about', changeFreq: 'monthly', priority: 0.8 },
  { path: '/contact', changeFreq: 'monthly', priority: 0.8 },
  { path: '/careers', changeFreq: 'monthly', priority: 0.6 },
  { path: '/booking', changeFreq: 'monthly', priority: 0.6 },
  { path: '/privacy-policy', changeFreq: 'yearly', priority: 0.3 },
  { path: '/terms-of-service', changeFreq: 'yearly', priority: 0.3 },
  { path: '/refund-policy', changeFreq: 'yearly', priority: 0.3 },
  { path: '/faq', changeFreq: 'monthly', priority: 0.6 },
  { path: '/site-map', changeFreq: 'monthly', priority: 0.2 },
];