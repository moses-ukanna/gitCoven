// GitCoven Service Worker — enables offline + installable PWA
const CACHE_NAME = 'gitcoven-v2';
const URLS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/phases.js',
  '/js/phases/fundamentals.js',
  '/js/phases/core-workflow.js',
  '/js/phases/recovery.js',
  '/js/phases/advanced-techniques.js',
  '/js/phases/professional.js',
  '/js/phases/enterprise.js',
  '/js/phases/platforms.js',
  '/js/state.js',
  '/js/render.js',
  '/js/auth.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(URLS); }));
});

self.addEventListener('fetch', function(e) {
  // Network first, cache fallback
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); }));
    })
  );
});