const AF_OFFLINE_CACHE = "af-offline-cache-v1";

const AF_OFFLINE_FILES = [
  "./",
  "./index.html",
  "./offline.html"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(AF_OFFLINE_CACHE).then(function(cache) {
      return cache.addAll(AF_OFFLINE_FILES);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== AF_OFFLINE_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(function() {
      if (event.request.mode === "navigate") {
        return caches.match("./offline.html");
      }

      return caches.match(event.request);
    })
  );
});
