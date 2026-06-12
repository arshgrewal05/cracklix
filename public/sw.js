
/**
 * @fileOverview Institutional Cracklix Service Worker v1.0.
 * Mandatory node for PWA installability and offline readiness.
 */

const CACHE_NAME = 'cracklix-registry-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  'https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png',
  'https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Simple network-first strategy for dynamic content, cache-fallback for assets
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
