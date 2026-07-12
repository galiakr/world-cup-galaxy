// World Cup Galaxy — minimal service worker.
//
// Deliberately simple: this app's whole point is showing live scores and
// predictions, so aggressively caching API responses would show stale
// data to a kid mid-match. This worker exists mainly to satisfy Chrome's
// PWA installability requirement (a fetch handler + a controlled page),
// with a network-first/cache-fallback strategy that only helps when the
// network is actually down.
//
// Bump this on every deploy that changes cached assets, so old caches
// get cleaned up in activate() below.
const CACHE_NAME = 'wcg-shell-v1';

// A small, safe set of static assets to pre-cache — the app shell, not
// any page HTML or API data (Next.js's own build hashes and this app's
// two-layer data cache already handle the rest).
const PRECACHE_URLS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GETs — let API calls to Supabase,
  // football-data.org, worldcup26.ir, Wikipedia, and OpenWeatherMap go
  // straight to the network untouched.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful, basic (same-origin, non-opaque) responses.
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        // Offline fallback: serve whatever we have cached for this exact
        // request; for a navigation with nothing cached, fall back to the
        // shell so the app still opens instead of showing a browser error.
        caches.match(request).then((cached) => cached || caches.match('/'))
      )
  );
});
