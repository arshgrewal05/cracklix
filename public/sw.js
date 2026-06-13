/**
 * @fileOverview Official Cracklix Service Worker v2.0.
 * Required for PWA Installability on Chrome/Android.
 */

const CACHE_NAME = 'cracklix-v1';

self.addEventListener('install', (event) => {
  console.log('[PWA] Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[PWA] Service Worker: Activated');
});

// Fetch event handler is MANDATORY for PWA installability
self.addEventListener('fetch', (event) => {
  // Pass-through strategy to ensure the app works online
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
