// ===============================
// CanvasFlow Service Worker
// Isolated cache, no cross-app bleed
// Bump CACHE_NAME every time index.html/unlock.html/manifest.json changes
// ===============================

const CACHE_NAME = "canvasflow-v1"; // rebuild — reset from prior broken repo's v7
const ASSETS = [
  "./",
  "./index.html",
  "./unlock.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

// Fresh app code first (falls back to cache if offline); cache-first for static assets
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const isAppCode = req.url.includes("index.html") || req.url.includes("unlock.html") || req.url.endsWith("/");

  if (isAppCode) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
      )
    );
  }
});
