
/**
 * @fileOverview Cracklix Institutional Service Worker.
 * Handles offline detection and PWA install requirements.
 */

const CACHE_NAME = 'cracklix-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Standard network-first strategy for dynamic study content
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
