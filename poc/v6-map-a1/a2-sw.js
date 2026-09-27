/* A2 isolated public/neutral cache experiment; scoped to poc/v6-map-a1/ only.
 * Deliberately no ignoreSearch, no root app shell, no personal/Atlas secrets. */
const REV = "a2-neutral-r1";
const PREFIX = "atlas-a2-public-neutral-";
const CACHE = PREFIX + REV;
const ROOT = new URL("./", self.registration.scope);
const PUBLIC = [
  "index.html", "poc.css", "poc.mjs", "manifest.json", "tiles/z0/0-0.svg",
  "a2-validation.html", "a2-validation.mjs", "a2-benchmark.mjs",
  "a2-neutral/ardera.svg", "a2-neutral/trame-astrale.svg",
  "a2-neutral/hautes-fermentations.svg", "a2-neutral/royaume-soifs-eteintes.svg"
].map(p=>new URL(p,ROOT).href);
const allowed = new Set(PUBLIC);
const DETAIL = /^tiles\/z[12]\/[0-9]+-[0-9]+\.svg$/;
const DETAIL_LIMIT = 16;
const unavailable = () => new Response("A2 neutral fixture not available offline",{status:503,headers:{"Content-Type":"text/plain"}});
self.addEventListener("install", event => {
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   await cache.addAll(PUBLIC); // fail installation atomically: never declare incomplete offline base ready
   await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
   await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==ROOT.origin||!url.href.startsWith(ROOT.href))return;
 // A query variant is NOT the immutable key: never return another version by ignoring search.
 if(url.search){event.respondWith(fetch(req).catch(unavailable));return;}
 const relative=url.href.slice(ROOT.href.length);
 const isPublic=allowed.has(url.href);
 const isDetail=DETAIL.test(relative);
 if(!isPublic&&!isDetail)return;
 event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const cached=await cache.match(req); // exact URL, exact search
   if(cached)return cached;
   try{
     const fresh=await fetch(req);
     if(fresh.ok&&fresh.type!=="opaque"){
       await cache.put(req,fresh.clone());
       if(isDetail){
         const keys=(await cache.keys()).filter(k=>DETAIL.test(new URL(k.url).href.slice(ROOT.href.length)));
         for(const key of keys.slice(0,Math.max(0,keys.length-DETAIL_LIMIT)))await cache.delete(key);
       }
     }
     return fresh;
   }catch{return unavailable();}
 })());
});

/* In WebKit automation, page CacheStorage enumeration can differ from SW context.
   Report from the actual cache owner. Offline fetch is still the decisive proof. */
self.addEventListener("message",event=>{
 if(event.data?.type!=="A2_CACHE_STATUS"||!event.ports?.[0])return;
 const port=event.ports[0];
 event.waitUntil((async()=>{
  const keys=await caches.keys();const cache=await caches.open(CACHE);
  const base=PUBLIC.filter(u=>u.includes("/a2-neutral/"));
  const checks=await Promise.all(base.map(async u=>Boolean(await cache.match(u))));
  port.postMessage({cache:CACHE,keys,base,checks,all:checks.length===4&&checks.every(Boolean),
   stored:(await cache.keys()).map(r=>r.url)});
 })().catch(error=>port.postMessage({error:String(error)})));
});
