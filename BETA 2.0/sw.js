const CACHE_NAME = "academeforge-v4";

const PRECACHE = [
  "./",
  "./index.html",
  "./Y.html",
  "./manifest.json",

  "./account/index.html",
  "./backup%201/index.html",
  "./core/index.html",
  "./sudoku-master/index.html",

  "./AF%20LOGO%201.jpeg",
  "./AF%20LOGO%202.jpeg",

  "./banner1.png",
  "./banner2.png",
  "./Banner3.png",

  "./Course%201.jpeg",
  "./Course%202.jpeg",
  "./Course%203.jpeg",
  "./Course%204.jpeg",
  "./Course%205.jpeg"
];

/* =========================
   INSTALL
========================= */

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of PRECACHE) {
        try {
          await cache.add(url);
          console.log("[AF CACHE]", url);
        } catch (err) {
          console.warn("[AF CACHE FAILED]", url, err);
        }
      }
    })()
  );
});

/* =========================
   ACTIVATE
========================= */

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );

      await self.clients.claim();
    })()
  );
});

/* =========================
   FETCH
========================= */

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {

      const cachedResponse =
        await caches.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse =
          await fetch(event.request);

        if (
          networkResponse &&
          networkResponse.status === 200
        ) {
          const cache =
            await caches.open(CACHE_NAME);

          cache.put(
            event.request,
            networkResponse.clone()
          );
        }

        return networkResponse;

      } catch (err) {

        const fallback =
          await caches.match("./index.html");

        if (fallback) {
          return fallback;
        }

        throw err;
      }
    })()
  );
});

/* =========================
   MESSAGE
========================= */

self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
