const CACHE_NAME = 'luminary-pwa-v4';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './offline.html',
  './LuminaryEngine/index.html',
  './LuminaryEngine/public/logo.png',
  './LuminaryData/config.js',
  './LuminaryData/landing.css',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;700&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Skip OpenRouter API calls
  if (event.request.url.includes('openrouter.ai')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) return response;

      // Otherwise try network
      return fetch(event.request).then((fetchResponse) => {
        // Cache the new resource if valid
        if (fetchResponse.ok && (
             event.request.url.startsWith(self.location.origin) || 
             event.request.url.includes('fonts.googleapis.com') ||
             event.request.url.includes('fonts.gstatic.com')
        )) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // IF NETWORK FAILS AND IT'S A NAVIGATION REQUEST, SHOW OFFLINE PAGE
      if (event.request.mode === 'navigate') {
        return caches.match('./offline.html');
      }
    })
  );
});
