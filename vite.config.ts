// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      
      // 🔹 ВАЖНО: добавь logo.svg сюда
      includeAssets: ['icon-192.png', 'icon-512.png', 'logo.svg', 'vector.svg'],
      
      manifest: {
        name: 'ContextKit',
        short_name: 'ContextKit',
        description: 'Ваш контекст — только ваш. Мета-промпты для контент-мейкеров.',
        theme_color: '#7b67a9',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/App/',
        scope: '/App/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/App/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/App/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  base: '/App/'
});