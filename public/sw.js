/**
 * @fileOverview Institutional Service Worker v1.0.
 * Mandatory for PWA installability.
 */

const CACHE_NAME = 'cracklix-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 1. Install Event - Pre-cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event - Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event - MANDATORY for PWA installability
// Even a simple pass-through satisfies the browser's requirement
self.addEventListener('fetch', (event) => {
  // Simple "Cache First, then Network" strategy for static icons/assets
  if (event.request.url.includes('/icons/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }
  
  // Normal network request for everything else
  event.respondWith(fetch(event.request));
});
