const CACHE_VERSION = 'v' + Date.now();

self.addEventListener('install', (e) => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response('オフラインです。', {
        status: 503,
        headers: {'Content-Type': 'text/plain; charset=utf-8'}
      });
    })
  );
});
