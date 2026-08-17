const CACHE_NAME =
  "hirebuilders-pwa-v1";

const APP_SHELL = [
  "/",
  "/connexion",
  "/employes",
  "/site.webmanifest",
];


// =========================================================
// INSTALL
// =========================================================

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) =>
          cache.addAll(
            APP_SHELL
          )
        )
        .then(() =>
          self.skipWaiting()
        )
    );
  }
);


// =========================================================
// ACTIVATE
// =========================================================

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter(
                (key) =>
                  key !==
                  CACHE_NAME
              )
              .map((key) =>
                caches.delete(
                  key
                )
              )
          )
        )
        .then(() =>
          self.clients.claim()
        )
    );
  }
);


// =========================================================
// FETCH
// =========================================================

self.addEventListener(
  "fetch",
  (event) => {
    const request =
      event.request;

    if (
      request.method !==
      "GET"
    ) {
      return;
    }

    const url =
      new URL(
        request.url
      );

    // Ne jamais mettre en cache
    // les API ou l'authentification.
    if (
      url.pathname.startsWith(
        "/api/"
      )
    ) {
      return;
    }

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (
            response.ok &&
            response.type ===
              "basic"
          ) {
            const clone =
              response.clone();

            caches
              .open(
                CACHE_NAME
              )
              .then((cache) =>
                cache.put(
                  request,
                  clone
                )
              )
              .catch(() => {});
          }

          return response;
        })
        .catch(() =>
          caches.match(
            request
          )
        )
    );
  }
);