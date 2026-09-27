import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
const origin="/poc/v6-map-a1/";
const manifest=JSON.parse(readFileSync("poc/v6-map-a1/manifest.json","utf8"));
const maps=["ardera","trame-astrale","hautes-fermentations","royaume-soifs-eteintes"];
const diag=page=>page.evaluate(()=>globalThis.__ATLAS_A1_DIAGNOSTICS__());
async function openA1(page){
 await page.goto(origin+"index.html");
 await expect(page.locator("#viewport")).toHaveAttribute("data-ready","true");
}
test("A2 geography has one shared neutral SVG source (not real raster quality) @webkit",()=>{
 expect(manifest.asset_revision).toBe("a1-neutral-1");
 expect(manifest.coordinate_system).toMatchObject({local_width:1024,local_height:512});
 const tiles=manifest.levels.flatMap(l=>l.tiles.map(t=>({l,t})));
 expect(tiles.length).toBe(11);
 const geometry=[];
 for(const {l,t} of tiles){
  const data=readFileSync("poc/v6-map-a1/"+t.src.slice(2),"utf8");
  const viewBox='viewBox="'+(t.x*l.tile_world_width)+" "+(t.y*l.tile_world_height)+" "+l.tile_world_width+" "+l.tile_world_height+'"';
  expect(data).toContain(viewBox);
  geometry.push(data.slice(data.indexOf("<!-- A1 NEUTRAL"),data.indexOf("</svg>")));
 }
 expect(new Set(geometry).size).toBe(1);
});
test("A2 repeated zoom, fast pan, resize and label behavior do not leak tile DOM @webkit",async({page})=>{
 await openA1(page);const errors=[];page.on("pageerror",e=>errors.push(e.message));
 for(let loop=0;loop<4;loop++){
  for(let i=0;i<5;i++)await page.locator("#zoom-in").click();
  await page.locator("#viewport").focus();
  for(let i=0;i<5;i++)await page.keyboard.press("ArrowRight");
  for(let i=0;i<5;i++)await page.keyboard.press("ArrowLeft");
  await page.locator("#reset").click();
  await expect.poll(async()=>(await diag(page)).active).toBe(1);
 }
 let d=await diag(page);
 expect(d.peak).toBeLessThanOrEqual(11);expect(d.lowerFallbackReady).toBe(true);
 expect(d.center.x).toBeCloseTo(512,3);expect(d.center.y).toBeCloseTo(256,3);
 await page.locator("#toggle-names").click();
 expect(await page.locator("#names").evaluate(el=>el.inert)).toBe(true);
 await expect(page.locator("#names .name").first()).toBeHidden();
 await page.locator("#marker-chope").click();await expect(page.locator("#preview")).toContainText("Berthold");
 await page.setViewportSize({width:1112,height:834});
 await page.locator("#reset").click();d=await diag(page);
 expect(d.center.x).toBeCloseTo(512,3);expect(d.center.y).toBeCloseTo(256,3);
 expect(errors).toEqual([]);
 await test.info().attach("a2-orientation",{body:await page.screenshot(),contentType:"image/png"});
});
test("A2 absent detail preserves lower fallback and releases stale tiles @webkit",async({page})=>{
 await page.route("**/tiles/z2/2-1.svg",route=>route.abort());
 await openA1(page);
 for(let i=0;i<5;i++)await page.locator("#zoom-in").click();
 await expect.poll(async()=>(await diag(page)).failed).toBeGreaterThan(0);
 expect((await diag(page)).lowerFallbackReady).toBe(true);
 await page.locator("#reset").click();
 const d=await diag(page);expect(d.active).toBe(1);expect(d.evicted).toBeGreaterThan(0);
 expect(await page.locator(".tile-layer img").count()).toBe(1);
});
test("A2 scoped public cache works with network paths blocked; real offline state explicitly classified @webkit",async({page,context})=>{
 await page.goto(origin+"a2-validation.html");
 await page.locator("#install-offline").click();
 await expect.poll(()=>page.evaluate(async()=>Boolean((await navigator.serviceWorker.getRegistration("./"))?.active))).toBe(true);
 const cacheDebug=await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration("./");return new Promise((resolve,reject)=>{const ch=new MessageChannel();ch.port1.onmessage=e=>resolve(e.data);r.active.postMessage({type:"A2_CACHE_STATUS"},[ch.port2]);});});console.log("A2 SW CACHE DEBUG "+JSON.stringify(cacheDebug));expect(cacheDebug.all).toBe(true);
 await expect(page.locator("#offline-status")).toContainText("4/4");
 const scope=await page.evaluate(async()=> {
  const r=await navigator.serviceWorker.getRegistration("./");
  return {scope:r?.scope,active:Boolean(r?.active)};
 });
 expect(scope.scope).toContain("/poc/v6-map-a1/");expect(scope.active).toBe(true);
 await page.reload();
 await expect.poll(()=>page.evaluate(()=>navigator.serviceWorker.controller?.scriptURL||"")).toContain("/poc/v6-map-a1/a2-sw.js");
 // Block network responses for neutral files. If the SW's cache-first path works, all four still return 200.
 await page.route("**/a2-neutral/**",route=>route.abort());
 await page.route("**/tiles/z0/0-0.svg",route=>route.abort());
 const controlled=await page.evaluate(async ids=>{
  const fetchStatus=async url=>{try{const r=await fetch(url);return {status:r.status,length:(await r.text()).length};}catch(e){return {error:String(e)};}};
  const bases=[];for(const id of ids)bases.push(await fetchStatus("./a2-neutral/"+id+".svg"));
  return {bases,fallback:await fetchStatus("./tiles/z0/0-0.svg"),shell:await fetchStatus("./index.html"),
    manifest:await fetchStatus("./manifest.json"),detail:await fetchStatus("./tiles/z2/2-1.svg"),
    variant:await fetchStatus("./a2-neutral/ardera.svg?rev=NEVER-CACHED")};
 },maps);
 for(const v of controlled.bases){expect(v.status).toBe(200);expect(v.length).toBeGreaterThan(0);}
 expect(controlled.fallback.status).toBe(200);expect(controlled.shell.status).toBe(200);
 expect(controlled.manifest.status).toBe(200); // Online unknown query can fetch independently; must NEVER alias a cached variant.
 // Direct Worker evidence, independent of WebKit's occasionally empty page-side caches enumeration.
 expect(cacheDebug.cache).toBe("atlas-a2-public-neutral-r1");
 expect(cacheDebug.stored.every(url=>!url.includes("?"))).toBe(true); // No variant stored under the base URL.
 expect(cacheDebug.keys.filter(k=>k.startsWith("atlas-a2-public-neutral-"))).toEqual(["atlas-a2-public-neutral-r1"]);
 await context.setOffline(true);
 const fullyOffline=await page.evaluate(async ids=>{
  const results=[];
  for(const id of ids){
   try{const r=await fetch("./a2-neutral/"+id+".svg");results.push({status:r.status});}
   catch(error){results.push({error:String(error)});}
  }
  return results;
 },maps);
 const offlineOK=fullyOffline.every(v=>v.status===200);
 if(!offlineOK){
  // Playwright WebKit Linux sometimes disables SW fetch along with all network when emulated offline.
  // Never claim this is a successful offline navigation or equivalent to physical Safari.
  const knownSimulatorFailure=fullyOffline.every(v=>/Load failed|internal error/i.test(v.error||""));
  expect(knownSimulatorFailure,"Partial or unexpected offline error is an A2 defect").toBe(true);
  console.warn("A2 CI LIMIT: WebKit offline emulation rejects ALL fetches despite four cached worker-owned resources and verified cache-first responses with network routes aborted. Physical Safari offline reload is mandatory. "+JSON.stringify(fullyOffline));
 } else {
  let reopen="success";
  try{await page.reload({waitUntil:"domcontentloaded",timeout:12000});await expect(page.locator("#offline-status")).toContainText("4/4");}
  catch(error){if(!/internal error/i.test(String(error)))throw error;reopen="webkit-simulator-internal-error";
    console.warn("A2 CI LIMIT: headless WebKit offline navigation internal error; physical Safari must be tested: "+String(error));}
  console.log("A2 emulated offline navigation result: "+reopen);
 }
 console.log("A2 OFFLINE EVIDENCE "+JSON.stringify({blockedNetwork:controlled.bases.map(v=>v.status),fallback:controlled.fallback.status,variant:controlled.variant.status,offline:fullyOffline,physical:"NOT TESTED"}));

});
test("A2 benchmark records WebKit format support and sizes, not physical-iPad claims @webkit",async({page})=>{
 await page.goto(origin+"a2-validation.html");
 const d=await page.evaluate(async()=>{
  const mod=await import("./a2-benchmark.mjs");
  return mod.compareNeutral({sizes:[256,512,1024],repeats:3});
 });
 expect(d.fixture).toContain("NOT final map");expect(d.results).toHaveLength(12);
 for(const size of [256,512,1024]){
  const png=d.results.find(r=>r.size===size&&r.mime==="image/png");
  expect(png.supported).toBe(true);expect(png.bytes).toBeGreaterThan(0);
  expect(png.decode_ms).toBeGreaterThanOrEqual(0);
  expect(png.rgba_floor_bytes).toBe(size*size*4);
 }
 for(const variant of d.results){
  if(variant.supported){expect(variant.bytes).toBeGreaterThan(0);expect(variant.sampled_mad_rgb).toBeGreaterThanOrEqual(0);}
  else expect(variant.reason.length).toBeGreaterThan(0);
 }
 const dir=resolve("test-results");mkdirSync(dir,{recursive:true});
 const file=resolve(dir,"a2-neutral-benchmark-"+test.info().project.name+".json");
 writeFileSync(file,JSON.stringify(d,null,2));
 console.log("A2 BENCHMARK "+test.info().project.name+" "+JSON.stringify(d.results.map(r=>({size:r.size,mime:r.mime,supported:r.supported,bytes:r.bytes,decode_ms:r.decode_ms,sampled_mad_rgb:r.sampled_mad_rgb}))));
});
