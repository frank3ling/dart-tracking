// Service Worker: Offline-Fähigkeit + Auto-Update
// CACHE_VERSION wird bei jedem Release erhöht (siehe Release-Workflow),
// dadurch erkennt der Browser den neuen Worker und aktualisiert den Cache.
const CACHE_VERSION = 'v1.8.0';
const CACHE_NAME = `dart-tracker-${CACHE_VERSION}`;

const CORE_ASSETS = [
    './',
    './index.html',
    './stats.html',
    './data.html',
    './styles.css',
    './shared.js',
    './input.js',
    './stats.js',
    './data.js',
    './manifest.json',
    './icon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Network-first mit Cache-Fallback: online immer die aktuelle Version,
// offline die zuletzt gecachte.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
});
