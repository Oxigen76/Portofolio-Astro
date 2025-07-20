/**
 * Font loading optimization utilities
 */

export interface FontConfig {
  family: string;
  weights: number[];
  display: 'swap' | 'fallback' | 'optional' | 'auto';
  preload?: boolean;
}

/**
 * Generate Google Fonts URL with optimization
 */
export function generateGoogleFontsUrl(fonts: FontConfig[]): string {
  const baseUrl = 'https://fonts.googleapis.com/css2';
  const families = fonts.map((font) => {
    const weights = font.weights.join(';');
    return `family=${font.family.replace(/\s+/g, '+')}:wght@${weights}`;
  });
  
  const params = new URLSearchParams({
    family: families.join('&'),
    display: fonts[0]?.display || 'swap',
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Preload critical fonts
 */
export function preloadFonts(fontUrls: string[]): void {
  if (typeof document === 'undefined') return;

  fontUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Initialize font loading with fallbacks
 */
export function initFontLoading(): void {
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