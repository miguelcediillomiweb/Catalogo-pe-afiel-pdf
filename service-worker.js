/* Catálogo Peñafiel — service worker v2
   - No guarda en caché el manifest ni los iconos (así los cambios se ven al instante).
   - Borra los cachés de versiones anteriores.
   - Listo para OneSignal (notificaciones). */

try { importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js"); } catch (e) {}

const CACHE_NAME = "catalogo-penafiel-v2";

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("catalogo-penafiel-") && key !== CACHE_NAME)
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

/* Siempre intenta la red primero; solo si no hay internet usa la última copia guardada. */
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || request.mode !== "navigate") return;
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
        }
        return response;
      })
      .catch(() => caches.match("./index.html"))
  );
});
