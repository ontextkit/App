// public/sw.js
const CACHE_NAME = 'contextkit-v2';
const ASSETS = [
  '/App/',
  '/App/index.html',
  '/App/manifest.json',
  '/App/icon-192.png',
  '/App/icon-512.png'
];

// Установка: кэшируем базовые файлы
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Активация: чистим старые кэши
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

// Fetch: отдаём из кэша, если офлайн
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});