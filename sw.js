const CACHE_NAME = 'axansh-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {

  // ✅ Ignore Vite Dev Server files
  if (
    event.request.url.includes('/@vite/') ||
    event.request.url.includes('/@react-refresh') ||
    event.request.url.includes('/src/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return new Response('Offline', {
            status: 503,
            statusText: 'Offline'
          });
        })
      );
    })
  );
});