const CACHE_NAME = "af-beta20-v11";

const PRECACHE = [
  "./",
  "./index.html",

  "./AF LOGO 1.jpeg",
  "./AF LOGO 2.jpeg",

  "./banner1.png",
  "./banner2.png",
  "./Banner3.png",

  "./Course 1.jpeg",
  "./Course 2.jpeg",
  "./Course 3.jpeg",
  "./Course 4.jpeg",
  "./Course 5.jpeg",

  "./founder-profile.jpeg",

  "./About/",
  "./About/index.html"
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
