import { describe, it, expect } from 'vitest';
import { generateSizes, getOptimizedImagePath } from '../utils/imageOptimization';
import { generateGoogleFontsUrl } from '../utils/fontOptimization';
import { assetConfig } from '../config/assets';

describe('Asset Optimization', () => {
  describe('Image Optimization', () => {
    it('should generate responsive image sizes', () => {
      const sizes = generateSizes();
      expect(sizes).toContain('(max-width: 768px) 375px');
      expect(sizes).toContain('(max-width: 1200px) 768px');
      expect(sizes).toContain('1200px');
    });

    it('should generate custom responsive sizes', () => {
      const sizes = generateSizes({ mobile: 320, tablet: 640, desktop: 1024 });
      expect(sizes).toContain('(max-width: 768px) 320px');
      expect(sizes).toContain('(max-width: 1200px) 640px');
      expect(sizes).toContain('1024px');
    });

    it('should return optimized image path', () => {
      const path = getOptimizedImagePath('/images/test.jpg', 800);
      expect(path).toBe('/images/test.jpg');
    });
  });

  describe('Font Optimization', () => {
    it('should generate Google Fonts URL', () => {
      const fonts = [
        {
          family: 'Inter',
          weights: [400, 600, 700],
          display: 'swap' as const,
        },
      ];
      
      const url = generateGoogleFontsUrl(fonts);
      expect(url).toContain('fonts.googleapis.com');
      expect(url).toContain('Inter');
      expect(url).toContain('400%3B600%3B700'); // URL encoded
      expect(url).toContain('display=swap');
    });
  });

  describe('Asset Configuration', () => {
    it('should have valid image quality settings', () => {
      expect(assetConfig.images.quality.high).toBe(90);
      expect(assetConfig.images.quality.medium).toBe(80);
      expect(assetConfig.images.quality.low).toBe(60);
    });

    it('should have valid cache settings', () => {
      expect(assetConfig.cache.static.maxAge).toBe(31536000); // 1 year
      expect(assetConfig.cache.pages.maxAge).toBe(3600); // 1 hour
    });

    it('should have performance budgets', () => {
      expect(assetConfig.performance.budgets.javascript).toBe(250);
      expect(assetConfig.performance.budgets.css).toBe(100);
    });
  });
});