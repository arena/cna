const CACHE_NAME = 'cna-skills-v6';
const urlsToCache = [
 './',
 './index.html',
 './skills_data.json',
 './manifest.json',
 './icon-192.png',
 './icon-512.png'
];

// Install event - cache all files
self.addEventListener('install', event => {
 event.waitUntil(
   caches.open(CACHE_NAME)
     .then(cache => cache.addAll(urlsToCache))
 );
});

// Fetch event - serve from cache
self.addEventListener('fetch', event => {
 event.respondWith(
   caches.match(event.request)
     .then(response => {
       // Return cached version or fetch from network
       return response || fetch(event.request);
     })
 );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
 event.waitUntil(
   caches.keys().then(cacheNames => {
     return Promise.all(
       cacheNames.map(cacheName => {
         if (cacheName !== CACHE_NAME) {
           return caches.delete(cacheName);
         }
       })
     );
   })
 );
});
