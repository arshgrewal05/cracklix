/**
 * @fileOverview Institutional PWA Service Worker v1.0.
 * Enables offline caching and mandatory install prompts for Android/iOS.
 */

const CACHE_NAME = 'cracklix-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  'https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
