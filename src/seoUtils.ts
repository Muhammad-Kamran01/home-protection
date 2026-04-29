/**
 * SEO Utility for updating page metadata dynamically
 * This ensures that title, meta tags, and OG tags are updated on every page navigation
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

/**
 * Update page metadata dynamically
 * @param metadata - The metadata object containing title, description, etc.
 */
export const updatePageMetadata = (metadata: PageMetadata): void => {
  // Update document title
  document.title = metadata.title;

  // Update or create meta description tag
  updateMetaTag('description', metadata.description);
  updateMetaTag('og:description', metadata.description);
  updateMetaTag('twitter:description', metadata.description);

  // Update title tags
  updateMetaTag('og:title', metadata.title);
  updateMetaTag('twitter:title', metadata.title);

  // Update site name tags (keep consistent with title for this page)
  updateMetaTag('site_name', metadata.title);
  updateMetaTag('og:site_name', metadata.title);

  // Update application name
  updateMetaTag('application-name', metadata.title);
  updateMetaTag('apple-mobile-web-app-title', metadata.title);

  // Update keywords if provided
  if (metadata.keywords) {
    updateMetaTag('keywords', metadata.keywords);
  }

  // Update OG image
  if (metadata.ogImage) {
    updateMetaTag('og:image', metadata.ogImage);
    updateMetaTag('twitter:image', metadata.ogImage);
  }

  // Update OG URL and canonical URL
  if (metadata.ogUrl) {
    updateMetaTag('og:url', metadata.ogUrl);
  }

  if (metadata.canonicalUrl) {
    updateCanonicalLink(metadata.canonicalUrl);
  }
};

/**
 * Helper function to update or create a meta tag
 */
const updateMetaTag = (name: string, content: string): void => {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

  if (!element) {
    // Create new meta tag if it doesn't exist
    element = document.createElement('meta');
    if (name.startsWith('og:') || name === 'twitter:card') {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

/**
 * Helper function to update or create canonical link
 */
const updateCanonicalLink = (url: string): void => {
  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', url);
};

/**
 * Default page metadata for the website
 */
export const DEFAULT_SITE_NAME = 'Home Protection';
export const DEFAULT_SITE_DESCRIPTION = 'Home Protection provides trusted AC, electrical, plumbing, painting, and maintenance services in Pakistan.';
export const DEFAULT_SITE_IMAGE = 'https://www.homeprotection.pk/siteicon-circle-512.png';
export const DEFAULT_SITE_URL = 'https://www.homeprotection.pk';

/**
 * Preset metadata for common pages
 */
export const pageMetadataPresets = {
  home: {
    title: 'Home Protection - Professional Home Maintenance Services in Pakistan',
    description: 'Home Protection provides trusted AC, electrical, plumbing, painting, and maintenance services in Pakistan.',
    keywords: 'home services, AC repair, electrical services, plumbing, painting, maintenance Pakistan',
    ogUrl: `${DEFAULT_SITE_URL}/`,
    canonicalUrl: `${DEFAULT_SITE_URL}/`,
  },
  services: {
    title: 'Our Services - Home Protection',
    description: 'Explore our comprehensive range of professional home maintenance services including AC repair, electrical work, plumbing, and more.',
    keywords: 'home services, AC repair, electrical services, plumbing, painting, carpentry, CCTV, cleaning',
    ogUrl: `${DEFAULT_SITE_URL}/#/services`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/services`,
  },
  about: {
    title: 'About Us - Home Protection',
    description: 'Learn about Home Protection, your trusted partner for professional home maintenance services with 150+ expert technicians.',
    keywords: 'about us, home services, professional technicians, quality assurance',
    ogUrl: `${DEFAULT_SITE_URL}/#/about`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/about`,
  },
  contact: {
    title: 'Contact Us - Home Protection',
    description: 'Get in touch with Home Protection. We are here to help with your home maintenance needs.',
    keywords: 'contact us, home services, customer support',
    ogUrl: `${DEFAULT_SITE_URL}/#/contact`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/contact`,
  },
  booking: {
    title: 'Book Your Service - Home Protection',
    description: 'Book professional home maintenance services from Home Protection. Choose from AC repair, electrical, plumbing, and more.',
    keywords: 'book service, home services, scheduling',
    ogUrl: `${DEFAULT_SITE_URL}/#/booking`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/booking`,
  },
  careers: {
    title: 'Careers - Home Protection',
    description: 'Join our team at Home Protection. We are looking for skilled technicians and professionals.',
    keywords: 'careers, jobs, technician jobs, home services career',
    ogUrl: `${DEFAULT_SITE_URL}/#/careers`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/careers`,
  },
  login: {
    title: 'Login - Home Protection',
    description: 'Login to your Home Protection account to manage bookings and services.',
    keywords: 'login, account, customer portal',
    ogUrl: `${DEFAULT_SITE_URL}/#/login`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/login`,
  },
  signup: {
    title: 'Sign Up - Home Protection',
    description: 'Create your Home Protection account to book services and manage your home maintenance.',
    keywords: 'sign up, register, create account',
    ogUrl: `${DEFAULT_SITE_URL}/#/signup`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/signup`,
  },
  admin: {
    title: 'Admin Dashboard - Home Protection',
    description: 'Admin dashboard for managing bookings, services, and customer interactions.',
    keywords: 'admin, dashboard, management',
    ogUrl: `${DEFAULT_SITE_URL}/#/admin`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/admin`,
  },
  privacy: {
    title: 'Privacy Policy - Home Protection',
    description: 'Read our privacy policy to understand how Home Protection protects your data.',
    keywords: 'privacy policy, data protection, terms',
    ogUrl: `${DEFAULT_SITE_URL}/#/privacy-policy`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/privacy-policy`,
  },
  terms: {
    title: 'Terms of Service - Home Protection',
    description: 'Read our terms of service for using Home Protection services.',
    keywords: 'terms of service, conditions, agreement',
    ogUrl: `${DEFAULT_SITE_URL}/#/terms-of-service`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/terms-of-service`,
  },
  refund: {
    title: 'Refund Policy - Home Protection',
    description: 'Learn about our refund policy and guarantees for Home Protection services.',
    keywords: 'refund policy, guarantees, money back',
    ogUrl: `${DEFAULT_SITE_URL}/#/refund-policy`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/refund-policy`,
  },
  faqs: {
    title: 'FAQs - Home Protection',
    description: 'Frequently asked questions about Home Protection services and bookings.',
    keywords: 'FAQs, frequently asked questions, help, support',
    ogUrl: `${DEFAULT_SITE_URL}/#/faqs`,
    canonicalUrl: `${DEFAULT_SITE_URL}/#/faqs`,
  },
};
