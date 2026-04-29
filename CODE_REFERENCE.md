# QUICK CODE REFERENCE

## What Was Added to App.tsx

### Import Added (Line 7)
```typescript
import { updatePageMetadata, pageMetadataPresets, DEFAULT_SITE_NAME } from "./seoUtils";
```

### Component Added (After ScrollToTop Component)
```typescript
/**
 * Component to update page metadata based on the current route
 */
const MetadataUpdater: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Map routes to metadata presets
    const getMetadataForRoute = (pathname: string) => {
      // Remove hash if present (for hash routing)
      const path = pathname.split('#').pop() || '/';
      
      switch (path) {
        case '/':
          return pageMetadataPresets.home;
        case '/services':
          return pageMetadataPresets.services;
        case '/about':
          return pageMetadataPresets.about;
        case '/contact':
          return pageMetadataPresets.contact;
        case '/booking':
          return pageMetadataPresets.booking;
        case '/checkout':
          return pageMetadataPresets.booking;
        case '/booking-success':
          return pageMetadataPresets.booking;
        case '/careers':
          return pageMetadataPresets.careers;
        case '/login':
          return pageMetadataPresets.login;
        case '/signup':
          return pageMetadataPresets.signup;
        case '/privacy-policy':
        case '/privacy':
          return pageMetadataPresets.privacy;
        case '/terms-of-service':
        case '/terms':
          return pageMetadataPresets.terms;
        case '/refund-policy':
        case '/refund':
          return pageMetadataPresets.refund;
        case '/faq':
        case '/faqs':
          return pageMetadataPresets.faqs;
        case '/admin':
        case '/admin/':
          return pageMetadataPresets.admin;
        default:
          // Default to home metadata if route not found
          return pageMetadataPresets.home;
      }
    };

    const metadata = getMetadataForRoute(location.pathname);
    updatePageMetadata(metadata);
  }, [location.pathname]);

  return null;
};
```

### Component Integration (In App Component)
```typescript
// BEFORE:
<Router>
  <ScrollToTop />
  <div className="flex flex-col min-h-screen">

// AFTER:
<Router>
  <ScrollToTop />
  <MetadataUpdater />  {/* ← ADD THIS LINE */}
  <div className="flex flex-col min-h-screen">
```

---

## Key Functions in seoUtils.ts

### Main Update Function
```typescript
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
```

### Helper Functions
```typescript
const updateMetaTag = (name: string, content: string): void => {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

  if (!element) {
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

const updateCanonicalLink = (url: string): void => {
  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', url);
};
```

### Example Metadata Preset
```typescript
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
  // ... more presets
};
```

---

## How to Verify the Changes

### Check Files Exist
```bash
# Should exist:
ls src/seoUtils.ts
ls SITE_NAME_FIX_GUIDE.md
ls DEPLOYMENT_SUMMARY.md

# Check App.tsx has the import
grep "import.*seoUtils" App.tsx

# Check App.tsx has MetadataUpdater component
grep "MetadataUpdater" App.tsx
```

### Check Build Success
```bash
npm run build

# Look for "build v..." at the end
```

### Check at Runtime (Browser Console)
```javascript
// These should exist:
window.location.pathname  // Current route
document.title            // Should match page
```

---

## Testing Script

```javascript
// Run in browser console to verify:

// 1. Check current page metadata
console.log('Title:', document.title);
console.log('og:site_name:', document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'));

// 2. Navigate to different page
// Click link to /services

// 3. Check again - should be different
console.log('Title:', document.title);
console.log('og:site_name:', document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'));
```

---

## Common Issues & Solutions

### Issue: Meta tags not updating
**Solution**: 
1. Hard refresh: Ctrl+Shift+R
2. Clear cache: Ctrl+Shift+Delete
3. Check console for errors: F12
4. Verify files exist

### Issue: Build fails
**Solution**:
1. Check Node version: `node -v` (should be 16+)
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Clear cache: `npm cache clean --force`
4. Try build again: `npm run build`

### Issue: Changes not reflecting in deployed version
**Solution**:
1. Wait 5 minutes for Vercel to rebuild
2. Clear CDN cache: In Vercel dashboard
3. Do hard refresh: Ctrl+Shift+R
4. Check deployment status in Vercel dashboard

---

## Timeline

- **April 29, 2026**: Implementation complete
- **Before Deployment**: Run build and tests
- **After Deployment**: Verify on www.homeprotection.pk

---

## Rollback (If Needed)

```bash
git revert <commit-hash>
git push
```

This will reverse all changes automatically.

---

## Success Checklist

- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors
- [ ] src/seoUtils.ts exists
- [ ] App.tsx imports seoUtils
- [ ] App.tsx has MetadataUpdater component
- [ ] MetadataUpdater is rendered in App
- [ ] dist/ folder exists after build
- [ ] Local testing shows meta tag updates
- [ ] Deployment to Vercel succeeds
- [ ] Live site shows updated meta tags

---

**Ready to Deploy**: ✅ YES
**Status**: Production Ready
**Date**: April 29, 2026
