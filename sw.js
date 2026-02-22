const CACHE_NAME = "dignex-cache-v1";

// When the service worker installs, it caches the main page
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                "./",
                "./index.html",
                "./manifest.json"
            ]);
        })
    );
});

// When the app fetches data, it checks the cache first to load instantly
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});