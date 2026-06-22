const CACHE = 'zivplan-v3';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/base.css',
  '/styles/components.css',
  '/styles/views.css',
  '/src/main.js',
  '/src/state.js',
  '/src/storage.js',
  '/src/api.js',
  '/src/workoutData.js',
  '/src/mealData.js',
  '/src/components/toast.js',
  '/src/components/modal.js',
  '/src/views/auth.js',
  '/src/views/workout.js',
  '/src/views/food.js',
  '/src/views/progress.js',
  '/src/views/profile.js',
  '/assets/icon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/apple-touch-icon.png',
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

  // Network-only for API and Supabase
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    e.respondWith(fetch(e.request).catch(() => new Response(
      JSON.stringify({ error: 'Sin conexión a internet.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )));
    return;
  }

  // Cache-first for static assets, network fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok && e.request.method === 'GET') {
          caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        }
        return resp;
      }).catch(() => {
        // Offline fallback for navigation
        if (e.request.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const options = {
    body: data.body || 'Tienes una actualización.',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Abrir app' },
      { action: 'dismiss', title: 'Cerrar' }
    ]
  };
  e.waitUntil(self.registration.showNotification(data.title || 'Ziv Plan', options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
    const existing = wins.find(w => w.url.includes(self.location.origin));
    if (existing) { existing.focus(); existing.navigate(url); }
    else clients.openWindow(url);
  }));
});
