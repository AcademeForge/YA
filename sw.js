const AF_CACHE_NAME = "academeforge-ya-cache-v11";

const AF_FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./offline.html",
   "./SM",
 "./NotesAF",
   "./Official",
   "./verify",
  "./YA/BETA%202.0/",
  
  "./AF%20LOGO%201.jpeg",
  "./Banner3.png",

  "./Course%201.jpeg",
  "./Course%202.jpeg",
  "./Course%203.jpeg",
  "./Course%204.jpeg",
  "./Course%205.jpeg",

  "./banner1.jpg",
  "./banner1.png",
  "./banner2.jpg",
  "./banner2.png",
  "./banner3.jpg",

  "./founder-profile.jpeg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(AF_CACHE_NAME).then(function (cache) {
      return cache.addAll(AF_FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== AF_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        var copy = response.clone();

        caches.open(AF_CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(function () {
        return caches.match(event.request).then(function (cached) {
          if (cached) return cached;

          if (event.request.mode === "navigate") {
            return caches.match("./offline.html")
              .then(function (offlinePage) {
                return offlinePage || caches.match("./index.html");
              });
          }

          return caches.match("./index.html");
        });
      })
  );
});
