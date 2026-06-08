const CACHE_NAME = "ya-v17";

const PRECACHE = [
  "./",
  "./index.html",
  "./offline.html",

  "./AF LOGO 1.jpeg",

  "./banner1.png",
  "./banner2.png",
  "./Banner3.png",

  "./Course 1.jpeg",
  "./Course 2.jpeg",
  "./Course 3.jpeg",
  "./Course 4.jpeg",
  "./Course 5.jpeg",

  "./founder-profile.jpeg",

  "./BETA%202.0/",
  "./NotesAF/",
  "./SM/",
  "./T/",
  "./official/",
  "./verify/"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of PRECACHE) {
        try {
          await cache.add(url);
          console.log("[YA CACHE]", url);
        } catch (err) {
          console.warn("[YA CACHE FAILED]", url);
        }
      }
    })()
  );
});

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

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {

      const cached =
        await caches.match(event.request);

      if (cached) {
        return cached;
      }

      try {

        const response =
          await fetch(event.request);

        if (response.ok) {

          const cache =
            await caches.open(CACHE_NAME);

          cache.put(
            event.request,
            response.clone()
          );
        }

        return response;

      } catch (err) {

        const offline =
          await caches.match("./offline.html");

        if (offline) {
          return offline;
        }

        return new Response(
          "Offline",
          {
            status: 503,
            headers: {
              "Content-Type": "text/plain"
            }
          }
        );
      }

    })()
  );
});
