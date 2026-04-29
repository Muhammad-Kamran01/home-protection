/**
 * Manual Testing Guide for Site Name Meta Tag Updates
 * Run these checks in your browser console after deploying
 */

// STEP 1: Verify initial meta tags on home page
console.log("=== HOME PAGE META TAGS ===");
console.log("Title:", document.title);
console.log("og:site_name:", document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'));
console.log("og:title:", document.querySelector('meta[property="og:title"]')?.getAttribute('content'));
console.log("Description:", document.querySelector('meta[name="description"]')?.getAttribute('content'));

// STEP 2: Function to check meta tags after navigation
window.checkMetaTags = function() {
  const currentPath = window.location.hash || '/';
  console.log(`\n=== METADATA FOR PATH: ${currentPath} ===`);
  console.log("Title:", document.title);
  console.log("og:site_name:", document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'));
  console.log("og:title:", document.querySelector('meta[property="og:title"]')?.getAttribute('content'));
  console.log("Description:", document.querySelector('meta[name="description"]')?.getAttribute('content'));
  console.log("Canonical:", document.querySelector('link[rel="canonical"]')?.getAttribute('href'));
  return true;
};

// STEP 3: Expected values for each page
const expectedMetadata = {
  '/': {
    title: 'Home Protection - Professional Home Maintenance Services in Pakistan',
    siteTitle: 'Home Protection - Professional Home Maintenance Services in Pakistan'
  },
  '#/services': {
    title: 'Our Services - Home Protection',
    siteTitle: 'Our Services - Home Protection'
  },
  '#/about': {
    title: 'About Us - Home Protection',
    siteTitle: 'About Us - Home Protection'
  },
  '#/contact': {
    title: 'Contact Us - Home Protection',
    siteTitle: 'Contact Us - Home Protection'
  },
  '#/booking': {
    title: 'Book Your Service - Home Protection',
    siteTitle: 'Book Your Service - Home Protection'
  },
  '#/careers': {
    title: 'Careers - Home Protection',
    siteTitle: 'Careers - Home Protection'
  },
  '#/login': {
    title: 'Login - Home Protection',
    siteTitle: 'Login - Home Protection'
  },
  '#/privacy-policy': {
    title: 'Privacy Policy - Home Protection',
    siteTitle: 'Privacy Policy - Home Protection'
  }
};

// STEP 4: Automated verification function
window.verifyMetadata = function() {
  const path = window.location.hash || '/';
  const expected = expectedMetadata[path];
  
  if (!expected) {
    console.log(`⚠️  No expected metadata for path: ${path}`);
    return false;
  }
  
  const actualTitle = document.title;
  const actualOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const actualSiteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
  
  const isTitleCorrect = actualTitle === expected.title;
  const isOgTitleCorrect = actualOgTitle === expected.siteTitle;
  const isSiteNameCorrect = actualSiteName === expected.siteTitle;
  
  console.log(`\n✓ Page Path: ${path}`);
  console.log(`${isTitleCorrect ? '✅' : '❌'} document.title: "${actualTitle}"`);
  console.log(`${isOgTitleCorrect ? '✅' : '❌'} og:title: "${actualOgTitle}"`);
  console.log(`${isSiteNameCorrect ? '✅' : '❌'} og:site_name: "${actualSiteName}"`);
  
  return isTitleCorrect && isOgTitleCorrect && isSiteNameCorrect;
};

console.log("\n📋 TESTING INSTRUCTIONS:");
console.log("1. Call checkMetaTags() after navigating to any page");
console.log("2. Call verifyMetadata() to auto-check current page");
console.log("3. Compare output with expectedMetadata object");
console.log("\nExample:");
console.log("  1. Go to Services page (https://www.homeprotection.pk/#/services)");
console.log("  2. Run: checkMetaTags()");
console.log("  3. Run: verifyMetadata()");
console.log("  4. All should show ✅ if working correctly");
console.log("\n✓ Test Console Ready. Use checkMetaTags() or verifyMetadata() functions.");
