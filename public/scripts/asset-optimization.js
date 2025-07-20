/**
 * Client-side asset optimization script
 * This runs in the browser after page load
 */

// Initialize lazy loading for images
function initLazyLoading() {
  if (typeof window === 'undefined') return;

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // Remove loading class and add loaded class
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  // Observe all images with lazy loading
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach((img) => {
    img.classList.add('lazy-loading');
    imageObserver.observe(img);
  });
}

// Initialize font loading
function initFontLoading() {
  if (typeof document === 'undefined') return;

  // Add font-loading class to body
  document.body.classList.add('font-loading');

  // Remove font-loading class when fonts are loaded
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.remove('font-loading');
      document.body.classList.add('fonts-loaded');
    });
  } else {
    // Fallback for older browsers
    setTimeout(() => {
      document.body.classList.remove('font-loading');
      document.body.classList.add('fonts-loaded');
    }, 3000);
  }
}

// Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    '/images/profile/CR__9822.webp',
    '/images/backgrounds/cyber-background.webp',
  ];

  criticalImages.forEach((path) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
}

// Initialize prefetch on hover
function initPrefetchOnHover() {
  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach((link) => {
    let prefetched = false;
    
    const prefetch = () => {
      if (prefetched) return;
      prefetched = true;
      
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = link.href;
      document.head.appendChild(prefetchLink);
    };
    
    // Prefetch on hover (desktop) or touchstart (mobile)
    link.addEventListener('mouseenter', prefetch, { once: true });
    link.addEventListener('touchstart', prefetch, { once: true });
  });
}

// Initialize all optimizations
function initAssetOptimization() {
  initFontLoading();
  preloadCriticalImages();
  initLazyLoading();
  initPrefetchOnHover();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAssetOptimization);
} else {
  initAssetOptimization();
}