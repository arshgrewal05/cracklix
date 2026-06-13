const CACHE_NAME = 'cracklix-v1';
const OFFLINE_URL = '/';

// The install event: prepares the cache
self.addEventListener('install', (event) => {
  console.log('[SW] SW registered');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

// The activate event: takes control of the clients
self.addEventListener('activate', (event) => {
  console.log('[SW] SW controlling page');
  event.waitUntil(self.clients.claim());
});

// MANDATORY: The fetch handler is required for PWA installability
self.addEventListener('fetch', (event) => {
  // Basic pass-through strategy with offline fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
