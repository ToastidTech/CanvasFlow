// ===============================
// CanvasFlow Service Worker (CLEAN)
// Isolated cache, no cross-app bleed
// ===============================

const CACHE_NAME = "canvasflow-v3";
const ASSETS = [
  "/",
  "/index.html",
  "/app.js",
  "/templates.js",
  "/manifest.json",
  "/icons/"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
});

// Activate (hard cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch strategy (safe cache-first for static assets)
self.addEventListener("fetch", (event) => {
  const req = event.request;

  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, res.clone());
            return res;
          });
        })
      );
    })
  );
});
