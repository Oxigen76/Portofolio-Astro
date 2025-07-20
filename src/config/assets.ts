/**
 * Asset configuration for optimization and caching
 */

export const assetConfig = {
  // Image optimization settings
  images: {
    quality: {
      high: 90,
      medium: 80,
      low: 60,
    },
    formats: ['webp', 'avif', 'jpg'] as const,
    sizes: {
      thumbnail: 150,
      small: 300,
      medium: 600,
      large: 1200,
      xlarge: 1920,
    },
    lazyLoading: {
      rootMargin: '50px 0px',
      threshold: 0.01,
    },
  },
  
  // Font optimization settings
  fonts: {
    preload: [
      // Add critical font URLs here when using custom fonts
    ],
    display: 'swap' as const,
    fallbacks: {
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    },
  },
  
  // Cache control settings
  cache: {
    // Static assets (images, fonts, etc.)
    static: {
      maxAge: 31536000, // 1 year
      staleWhileRevalidate: 86400, // 1 day
      immutable: true,
    },
    // HTML pages
    pages: {
      maxAge: 3600, // 1 hour
      staleWhileRevalidate: 86400, // 1 day
      immutable: false,
    },
    // API responses
    api: {
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: 3600, // 1 hour
      immutable: false,
    },
  },
  
  // Performance budgets
  performance: {
    // Bundle size limits (in KB)
    budgets: {
      javascript: 250,
      css: 100,
      images: 500,
      fonts: 100,
    },
    // Core Web Vitals targets
    vitals: {
      lcp: 2500, // Largest Contentful Paint (ms)
      fid: 100,  // First Input Delay (ms)
      cls: 0.1,  // Cumulative Layout Shift
    },
  },
} as const;

export type AssetConfig = typeof assetConfig;