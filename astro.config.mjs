// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots';

// https://astro.build/config
export default defineConfig({
  site: 'https://dragosvictor.tech',
  integrations: [sitemap(), robotsTxt()],
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // ~16K x 16K pixels
      },
    },
  },
  build: {
    // Asset optimization
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Asset optimization
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB
      rollupOptions: {
        output: {
          // Asset hashing for cache busting
          assetFileNames: (assetInfo) => {
            if (!assetInfo.names || assetInfo.names.length === 0) {
              return `assets/[name]-[hash][extname]`;
            }
            const name = assetInfo.names[0];
            const info = name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `styles/[name]-[hash][extname]`;
            }
            if (/js/i.test(ext)) {
              return `scripts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
    },
  },
});
