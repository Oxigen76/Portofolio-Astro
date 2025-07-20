/**
 * Image optimization utilities for lazy loading and performance
 */

export interface ImageSizes {
  mobile: number;
  tablet: number;
  desktop: number;
}

export const defaultImageSizes: ImageSizes = {
  mobile: 375,
  tablet: 768,
  desktop: 1200,
};

/**
 * Generate responsive image sizes string
 */
export function generateSizes(sizes: Partial<ImageSizes> = {}): string {
  const finalSizes = { ...defaultImageSizes, ...sizes };
  
  return [
    `(max-width: 768px) ${finalSizes.mobile}px`,
    `(max-width: 1200px) ${finalSizes.tablet}px`,
    `${finalSizes.desktop}px`,
  ].join(', ');
}

/**
 * Initialize lazy loading for images using Intersection Observer
 */
export function initLazyLoading(): void {
  if (typeof window === 'undefined') return;

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
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
      // Start loading when image is 50px away from viewport
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

/**
 * Preload critical images
 */
export function preloadCriticalImages(imagePaths: string[]): void {
  if (typeof window === 'undefined') return;

  imagePaths.forEach((path) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
}

/**
 * Get optimized image path - Astro handles optimization automatically
 */
export function getOptimizedImagePath(basePath: string): string {
  // For local images, Astro will handle optimization automatically
  if (basePath.startsWith('/')) {
    return basePath;
  }
  
  // For external images, return as-is
  return basePath;
}