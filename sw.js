const CACHE_NAME = "rusmouth-v0.1.2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js"
];

const AUDIO_ASSETS = [
  "./audio/p001.mp3",
  "./audio/p002.mp3",
  "./audio/p003.mp3",
  "./audio/p004.mp3",
  "./audio/p005.mp3",
  "./audio/p006.mp3",
  "./audio/p007.mp3",
  "./audio/p008.mp3",
  "./audio/p009.mp3",
  "./audio/p010.mp3",
  "./audio/p011.mp3",
  "./audio/p012.mp3",
  "./audio/p013.mp3",
  "./audio/p014.mp3",
  "./audio/p015.mp3",
  "./audio/p016.mp3",
  "./audio/p017.mp3",
  "./audio/p018.mp3",
  "./audio/p019.mp3",
  "./audio/p020.mp3",
  "./audio/p021.mp3",
  "./audio/p022.mp3",
  "./audio/p023.mp3",
  "./audio/p024.mp3",
  "./audio/p025.mp3",
  "./audio/p026.mp3",
  "./audio/p027.mp3",
  "./audio/p028.mp3",
  "./audio/p029.mp3",
  "./audio/p030.mp3",
  "./audio/p031.mp3",
  "./audio/p032.mp3",
  "./audio/p033.mp3",
  "./audio/p034.mp3",
  "./audio/p035.mp3",
  "./audio/p036.mp3",
  "./audio/p037.mp3",
  "./audio/p038.mp3",
  "./audio/p039.mp3",
  "./audio/p040.mp3",

  "./audio/extra001.mp3",
  "./audio/extra002.mp3",
  "./audio/extra003.mp3",
  "./audio/extra004.mp3",
  "./audio/extra005.mp3",
  "./audio/extra006.mp3",
  "./audio/extra007.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(CORE_ASSETS);

      await Promise.allSettled(
        AUDIO_ASSETS.map(asset =>
          cache.add(asset).catch(err => {
            console.warn("音频缓存失败，但不阻止安装：", asset, err);
          })
        )
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.pathname.includes("/audio/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (err) {
    return new Response("Audio not available offline.", {
      status: 503,
      statusText: "Service Unavailable"
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(response => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}