/**
 * @fileOverview Institutional Service Worker v1.0.
 * Satisfies PWA installation criteria for offline readiness.
 */

const CACHE_NAME = 'cracklix-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Basic fetch listener to allow browser installation prompts
  // and provide a basis for future offline caching strategies.
});
