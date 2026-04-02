const CACHE_NAME = 'gilbert-portfolio-v2';
const APP_SHELL_CACHE = [
  '/',
  '/manifest.json',
  '/robots.txt',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  '/images/gilbert-tuyambaze-dark.jpeg',
  '/images/gilbert-tuyambaze-light.jpeg',
  '/images/Screenshot-dark.png',
  '/images/Screenshot-light.png',
  '/assets/marketplacepro.png',
  '/assets/nss.png',
  '/assets/ur-academic-resource-hub.png',
  '/assets/privatecouplechat.png',
  '/assets/tour.png',
  '/assets/bright.png',
  '/assets/twigane-class.png',
  '/assets/tresor.png',
  '/assets/orangeflix.png',
  '/assets/aimable.png',
  '/assets/akimana.png',
  '/assets/archive.png',
  '/assets/Gilbert-TUYAMBAZE-CV1.pdf',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }

        const responseCopy = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        return networkResponse;
      });
    })
  );
});
