import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const root=new URL("../../poc/v6-map-a1/",import.meta.url);
const manifest=JSON.parse(readFileSync(new URL("manifest.json",root),"utf8"));
async function openPoc(page){await page.goto("/poc/v6-map-a1/index.html");await expect(page.locator("#viewport")).toHaveAttribute("data-ready","true");await expect(page.locator("#tile-0-0-0")).toBeVisible();}
async function diagnostic(page){return page.evaluate(()=>globalThis.__ATLAS_A1_DIAGNOSTICS__());}
test("A1 manifest and tiles share reproducible neutral geometry",()=>{
 expect(manifest.poc).toBe(true);expect(manifest.map_id).toBe("ardera");
 expect(manifest.coordinate_system.extent_on_ardera).toEqual({x_min:20,x_max:40,y_min:34,y_max:54});
 expect(manifest.levels.map(l=>[l.z,l.columns,l.rows,l.tiles.length])).toEqual([[0,1,1,1],[1,2,1,2],[2,4,2,8]]);
 const all=manifest.levels.flatMap(l=>l.tiles.map(t=>t.src));expect(new Set(all).size).toBe(11);
 for(const path of all)expect(readFileSync(new URL(path,root),"utf8")).toMatch(/A1 NEUTRAL POC/);
 const result=execFileSync(process.execPath,[new URL("generate-tiles.mjs",root).pathname,"--check"],{encoding:"utf8"});
 expect(result).toContain("verified: 11 neutral tiles");
});
test("POC alone loads fallback, creates no IndexedDB and does not change the app entrypoint",async({page})=>{
 await openPoc(page);expect(await diagnostic(page)).toMatchObject({ready:true,manifest:"a1-neutral-1",lowerFallbackReady:true});
 expect(await page.evaluate(async()=> (await indexedDB.databases()).map(db=>db.name))).toEqual([]);
 expect(await page.evaluate(async()=> (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
 await page.goto("/");await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.gargottexReady)).toBe("true");
 expect(await page.evaluate(()=>globalThis.__ATLAS_A1_DIAGNOSTICS__)).toBeUndefined();
});
test("Names are independently hidden and noninteractive while Chope stays selectable",async({page})=>{
 await openPoc(page);const label=page.getByRole("button",{name:"Saint-Fût-le-Petit",exact:true});
 await expect(label).toBeVisible();await page.getByRole("button",{name:"Masquer les noms"}).click();
 await expect(label).toBeHidden();expect(await page.locator("#names").evaluate(el=>el.inert)).toBe(true);
 await page.getByRole("button",{name:"La Chope Qui Colle"}).click();await expect(page.locator("#preview")).toContainText("Berthold");
 await page.getByRole("button",{name:"Afficher les noms"}).click();await expect(label).toBeVisible();
});
test("Two-pointer zoom, pan, clamps, and Chope reset retain normalized location",async({page})=>{
 await page.setViewportSize({width:834,height:1112});await openPoc(page);const before=await diagnostic(page);
 expect(before.center.x).toBeCloseTo(512,4);expect(before.center.y).toBeCloseTo(256,4);
 await page.locator("#viewport").evaluate(el=>{
 const evt=(kind,id,x,y)=>el.dispatchEvent(new PointerEvent(kind,{bubbles:true,pointerType:"touch",pointerId:id,clientX:x,clientY:y}));
 const b=el.getBoundingClientRect(),mx=b.left+b.width/2,my=b.top+b.height/2;
 evt("pointerdown",1,mx-80,my);evt("pointerdown",2,mx+80,my);
 evt("pointermove",1,mx-135,my);evt("pointermove",2,mx+135,my);
 evt("pointerup",1,mx-135,my);evt("pointerup",2,mx+135,my);
 });
 const pinched=await diagnostic(page);expect(pinched.zoom).toBeGreaterThan(1.4);
 expect(pinched.center.x).toBeGreaterThanOrEqual(0);expect(pinched.center.x).toBeLessThanOrEqual(1024);
 expect(pinched.center.y).toBeGreaterThanOrEqual(0);expect(pinched.center.y).toBeLessThanOrEqual(512);
 await page.locator("#viewport").evaluate(el=>{
 const b=el.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2;
 el.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true,pointerId:3,pointerType:"touch",clientX:x,clientY:y}));
 el.dispatchEvent(new PointerEvent("pointermove",{bubbles:true,pointerId:3,pointerType:"touch",clientX:x-190,clientY:y-20}));
 el.dispatchEvent(new PointerEvent("pointerup",{bubbles:true,pointerId:3,pointerType:"touch",clientX:x-190,clientY:y-20}));
 });
 expect((await diagnostic(page)).center.x).not.toBeCloseTo(pinched.center.x,0);
 await page.getByRole("button",{name:"Revenir à la Chope"}).click();const reset=await diagnostic(page);
 expect(reset.zoom).toBe(1);expect(reset.center.x).toBeCloseTo(512,4);expect(reset.center.y).toBeCloseTo(256,4);
});
test("Absent detail tile keeps fallback, and levels are evicted when leaving zoom",async({page})=>{
 await page.route("**/poc/v6-map-a1/tiles/z2/2-1.svg",route=>route.abort());await openPoc(page);
 for(let i=0;i<4;i++)await page.locator("#zoom-in").click();
 await expect.poll(async()=> (await diagnostic(page)).failed).toBeGreaterThan(0);
 const high=await diagnostic(page);expect(high.lowerFallbackReady).toBe(true);
 expect(high.active).toBeLessThanOrEqual(11);expect(high.peak).toBeLessThanOrEqual(11);
 await page.getByRole("button",{name:"Revenir à la Chope"}).click();
 const reset=await diagnostic(page);expect(reset.evicted).toBeGreaterThan(0);
 expect(reset.active).toBe(1);expect(reset.lowerFallbackReady).toBe(true);
});
