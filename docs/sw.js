// Service Worker for GitHub Pages static version
const CACHE = 'tracklife-v3';
const STATIC = [
  './',
  './index.html',
  './manifest.json',
  './styles/base.css',
  './styles/components.css',
  './styles/views.css',
  './src/main.js',
  './src/state.js',
  './src/storage.js',
  './src/api.js',
  './src/workoutData.js',
  './src/mealData.js',
  './src/components/toast.js',
  './src/components/modal.js',
  './src/views/auth.js',
  './src/views/workout.js',
  './src/views/food.js',
  './src/views/progress.js',
  './src/views/profile.js',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/brand.webp',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Network-only for Anthropic API and Supabase
  if (url.hostname.includes('anthropic') || url.hostname.includes('supabase')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Network-only for external CDN resources (fonts, chart.js)
  if (url.hostname !== self.location.hostname) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }
  // Cache-first for same-origin assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok && e.request.method === 'GET') {
          caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        }
        return resp;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
