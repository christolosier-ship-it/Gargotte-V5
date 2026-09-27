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
test("A2 scoped public cache keeps four neutral maps offline and rejects query alias @webkit",async({page,context})=>{
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
 await context.setOffline(true);
 const response=await page.evaluate(async ids=>{
  const values=[];
  for(const id of ids){const r=await fetch("./a2-neutral/"+id+".svg");values.push({status:r.status,length:(await r.text()).length});}
  const fallback=(await fetch("./tiles/z0/0-0.svg")).status;
  const offlineShell=(await fetch("./index.html")).status;
  const offlineManifest=(await fetch("./manifest.json")).status;
  const missingDetail=(await fetch("./tiles/z2/2-1.svg")).status;
  let variantStatus=null;
  try{const r=await fetch("./a2-neutral/ardera.svg?rev=NEVER-CACHED");variantStatus=r.status;}catch{variantStatus="network-failed";}
  const r=await navigator.serviceWorker.getRegistration("./");
  const workerStatus=await new Promise(resolve=>{const ch=new MessageChannel();ch.port1.onmessage=e=>resolve(e.data);r.active.postMessage({type:"A2_CACHE_STATUS"},[ch.port2]);});
  return {values,fallback,offlineShell,offlineManifest,missingDetail,variantStatus,workerStatus};
 },maps);
 expect(response.values).toHaveLength(4);
 for(const v of response.values){expect(v.status).toBe(200);expect(v.length).toBeGreaterThan(0);}
 expect(response.fallback).toBe(200);expect(response.offlineShell).toBe(200);
 expect(response.offlineManifest).toBe(200);expect(response.missingDetail).toBe(503);
 expect(response.variantStatus).not.toBe(200);
 expect(response.workerStatus.cache).toBe("atlas-a2-public-neutral-r1");expect(response.workerStatus.all).toBe(true);
 expect(response.workerStatus.keys.filter(k=>k.startsWith("atlas-a2-public-neutral-"))).toEqual(["atlas-a2-public-neutral-r1"]);
 // Some Playwright Linux WebKit builds throw an INTERNAL ERROR on offline navigation,
 // independently from actual SW-served offline fetch. Keep the genuine fetch assertions.
 // A physical Safari reopen is mandatory for the Gate (not silently marked as success).
 let reopen="success";
 try{await page.reload({waitUntil:"domcontentloaded",timeout:12000});await expect(page.locator("#offline-status")).toContainText("4/4");}
 catch(error){
   if(!/internal error/i.test(String(error)))throw error;
   reopen="webkit-simulator-internal-error";
   console.warn("A2 CI LIMIT: WebKit automation cannot prove offline document re-navigation; physical iPad required: "+String(error));
 }
 console.log("A2 OFFLINE RESULT "+JSON.stringify({fourBases:response.values.map(v=>v.status),fallback:response.fallback,offlineShell:response.offlineShell,missingDetail:response.missingDetail,reopen}));

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
