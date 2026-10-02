
const CACHE = "gargottex-v6-whaou-final-v1";
const CACHE_PREFIX = "gargottex-";
const MAP_CACHE = "map-v2-active-v1";
let mapCacheGeneration = 0;
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./seed-data.js",
  "./src/app.js",
  "./src/map-v2.js",
  "./src/map-v2-data.js",
  "./src/map-v2-cartography.js",
  "./src/map-v2-toponyms.js",
  "./src/vendor/circletype-2.3.1.js",
  "./assets/map-labels/IM-Fell-English.ttf",
  "./assets/map-labels/parchment.webp",
  "./src/utils/common.js",
  "./src/utils/zip.js",
  "./src/utils/xlsx.js",
  "./src/storage/idb.js",
  "./src/storage/media-repository.js",
  "./assets/fonts/Inter-Variable.ttf",
  "./assets/fonts/Alegreya-Variable.ttf",
  "./assets/ui-v6/icons/Icone_Entite_HEROS.webp",
  "./assets/ui-v6/icons/Icone_Entite_OBJET_BROUHAHA.webp",
  "./assets/ui-v6/icons/Icone_Entite_OBJET_INTERACTIF.webp",
  "./assets/ui-v6/icons/Icone_Entite_PNJ.webp",
  "./assets/ui-v6/icons/Icone_Entite_QUETE.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_ACTION.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_ATK.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_BUTIN.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_COMPETENCE.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_COMPORTEMENT.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_DEF.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_DONJON.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_LORE.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_MENACE.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_PV.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_SOCLE.webp",
  "./assets/ui-v6/icons/Icone_Gameplay_ZONE.webp",
  "./assets/ui-v6/icons/Sigil_Basique.webp",
  "./assets/ui-v6/icons/Sigil_Boss.webp",
  "./assets/ui-v6/icons/Sigil_Brute.webp",
  "./assets/ui-v6/icons/Sigil_MiniBoss.webp",
  "./assets/ui-v6/icons/Sigil_Speciale.webp",
  "./assets/ui-v6/icons/Sigil_Tactique.webp",
  "./assets/ui-v6/icons/premium-symbols.svg",
  "./assets/ui-v6/textures/brass-aged.svg",
  "./assets/ui-v6/textures/grain-dark.svg",
  "./assets/ui-v6/textures/leather-dark.svg",
  "./assets/ui-v6/textures/paper-aged-light.svg",
  "./assets/ui-v6/textures/paper-warm.svg",
  "./assets/ui-v6/textures/wood-charred.svg",
  "./assets/ui-v6/ornaments/corner-brass.svg",
  "./assets/images/logo-192.png",
  "./assets/images/logo-512.png",
  "./assets/images/logo-source.jpeg",
  "./assets/images/bard.png",
  "./assets/images/berthold.png",
  "./assets/images/bruna.jpeg",
  "./assets/images/centoria.jpeg",
  "./assets/images/demon.png",
  "./assets/images/gundrade.jpeg",
  "./assets/images/rainette.jpeg",
  "./assets/images/sigrune.jpeg",
  "./assets/images/trixie.jpeg",
  "./assets/images/veloria.jpeg",
  "./assets/images/waitress.jpeg",
  "./templates/brouhaha.csv",
  "./templates/brouhaha.xlsx",
  "./templates/creatures.csv",
  "./templates/creatures.xlsx",
  "./templates/dungeons.csv",
  "./templates/dungeons.xlsx",
  "./templates/heroes.csv",
  "./templates/heroes.xlsx",
  "./templates/loot.csv",
  "./templates/loot.xlsx",
  "./templates/interactables.csv",
  "./templates/npcs.csv",
  "./templates/npcs.xlsx",
  "./templates/quests.csv",
  "./templates/quests.xlsx"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE && k.startsWith(CACHE_PREFIX)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isMapAsset(req) {
  const url = new URL(req.url);
  const scopePath = new URL(self.registration.scope).pathname;
  if (url.origin !== self.location.origin || !url.pathname.startsWith(scopePath)) return false;
  const assetPath = url.pathname.slice(scopePath.length);
  return assetPath.startsWith("assets/maps/") || assetPath.startsWith("assets/sprites/");
}

async function fetchMapAsset(req) {
  const generation = mapCacheGeneration;
  const fresh = await fetch(req);
  if (fresh && fresh.ok && generation === mapCacheGeneration) {
    const cache = await caches.open(MAP_CACHE);
    if (generation === mapCacheGeneration) await cache.put(req, fresh.clone());
  }
  return fresh;
}

async function fetchAndRefreshCache(req) {
  const fresh = await fetch(req, { cache: "no-cache" });
  if (fresh && fresh.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(req, fresh.clone());
  }
  return fresh;
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (isMapAsset(req)) {
    const response = fetchMapAsset(req).catch(async () => {
      const cache = await caches.open(MAP_CACHE);
      return await cache.match(req, { ignoreSearch: true }) || new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" }
      });
    });
    event.respondWith(response);
    return;
  }

  const refreshPromise = fetchAndRefreshCache(req);
  event.waitUntil(refreshPromise.then(() => undefined).catch(() => undefined));

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    try {
      return await refreshPromise;
    } catch (_) {
      if (req.mode === "navigate") {
        const shell = await caches.match("./index.html", { ignoreSearch: true });
        if (shell) return shell;
      }
      return new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" }
      });
    }
  })());
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (event.data?.type === "MAP_V2_EVICT") {
    event.waitUntil((async () => {
      mapCacheGeneration += 1;
      await caches.delete(MAP_CACHE);
      event.ports?.[0]?.postMessage({ ok: true });
    })());
  }
});
