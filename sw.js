const CACHE_NAME = "rusmouth-v0.1.3";

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
  "./audio/extra007.mp3",
  "./audio/training001.mp3",
  "./audio/training002.mp3",
  "./audio/training003.mp3",
  "./audio/training004.mp3",
  "./audio/training005.mp3",
  "./audio/training006.mp3",
  "./audio/training007.mp3",
  "./audio/training008.mp3",
  "./audio/training009.mp3",
  "./audio/training010.mp3",
  "./audio/training011.mp3",
  "./audio/training012.mp3",
  "./audio/training013.mp3",
  "./audio/training014.mp3",
  "./audio/training015.mp3",
  "./audio/training016.mp3",
  "./audio/training017.mp3",
  "./audio/training018.mp3",
  "./audio/training019.mp3",
  "./audio/training020.mp3",
  "./audio/training021.mp3",
  "./audio/training022.mp3",
  "./audio/training023.mp3",
  "./audio/training024.mp3",
  "./audio/training025.mp3",
  "./audio/training026.mp3",
  "./audio/training027.mp3",
  "./audio/training028.mp3",
  "./audio/training029.mp3",
  "./audio/training030.mp3",
  "./audio/training031.mp3",
  "./audio/training032.mp3",
  "./audio/training033.mp3",
  "./audio/training034.mp3",
  "./audio/training035.mp3",
  "./audio/training036.mp3",
  "./audio/training037.mp3",
  "./audio/training038.mp3",
  "./audio/training039.mp3",
  "./audio/training040.mp3",
  "./audio/training041.mp3",
  "./audio/training042.mp3",
  "./audio/training043.mp3",
  "./audio/training044.mp3",
  "./audio/training045.mp3",
  "./audio/training046.mp3",
  "./audio/training047.mp3",
  "./audio/training048.mp3",
  "./audio/training049.mp3",
  "./audio/training050.mp3",
  "./audio/training051.mp3",
  "./audio/training052.mp3",
  "./audio/training053.mp3",
  "./audio/training054.mp3",
  "./audio/training055.mp3",
  "./audio/training056.mp3",
  "./audio/training057.mp3",
  "./audio/training058.mp3",
  "./audio/training059.mp3",
  "./audio/training060.mp3",
  "./audio/training061.mp3",
  "./audio/training062.mp3",
  "./audio/training063.mp3",
  "./audio/training064.mp3",
  "./audio/training065.mp3",
  "./audio/training066.mp3",
  "./audio/training067.mp3",
  "./audio/training068.mp3",
  "./audio/training069.mp3",
  "./audio/training070.mp3",
  "./audio/training071.mp3",
  "./audio/training072.mp3",
  "./audio/training073.mp3"
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