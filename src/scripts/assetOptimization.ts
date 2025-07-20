/**
 * Asset optimization initialization script
 * This script should be loaded early to optimize asset loading
 */

import { initLazyLoading, preloadCriticalImages } from '../utils/imageOptimization';
import { initFontLoading } from '../utils/fontOptimization';

/**
 * Critical images that should be preloaded
 */
const criticalImages = [
  '/images/profile/CR__9822.webp', // Main profile image
  '/images/backgrounds/cyber-background.webp', // Hero background
];

/**
 * Initialize all asset optimizations
 */
function initAssetOptimization(): void {
  // Initialize font loading optimization
  initFontLoading();
  
  // Preload critical images
  preloadCriticalImages(criticalImages);
  
  // Initialize lazy loading for non-critical images
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
  } else {
    initLazyLoading();
  }
  
  // Optimize image loading based on connection speed
  if ('connection' in navigator) {
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    if (connection && connection.effectiveType) {
      // Adjust image quality based on connection speed
      const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
      if (isSlowConnection) {
        document.documentElement.classList.add('slow-connection');
      }
    }
  }
  
  // Prefetch next page resources on hover
  initPrefetchOnHover();
}

/**
 * Prefetch resources when user hovers over links
 */
function initPrefetchOnHover(): void {
  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach((link) => {
    let prefetched = false;
    
    const prefetch = () => {
      if (prefetched) return;
      prefetched = true;
      
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = (link as HTMLAnchorElement).href;
      document.head.appendChild(prefetchLink);
    };
    
    // Prefetch on hover (desktop) or touchstart (mobile)
    link.addEventListener('mouseenter', prefetch, { once: true });
    link.addEventListener('touchstart', prefetch, { once: true });
  });
}

/**
 * Performance monitoring
 */
function initPerformanceMonitoring(): void {
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      // LCP not supported
    }
    
    // Monitor Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & { 
          hadRecentInput?: boolean; 
          value?: number; 
        };
        if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
          clsValue += layoutShiftEntry.value;
        }
      }
      if (clsValue > 0) {
        console.log('CLS:', clsValue);
      }
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch {
      // CLS not supported
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAssetOptimization();
    initPerformanceMonitoring();
  });
} else {
  initAssetOptimization();
  initPerformanceMonitoring();
}

export { initAssetOptimization, initPerformanceMonitoring };