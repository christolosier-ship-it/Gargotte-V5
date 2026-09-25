import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page, path = "/index.html") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function clickVisible(page, selector) {
  const items = page.locator(selector);
  const count = await items.count();
  for (let i = 0; i < count; i++) {
    if (await items.nth(i).isVisible()) {
      await items.nth(i).click();
      return;
    }
  }
  throw new Error("No visible element for " + selector);
}

async function gotoView(page, view) {
  const selector = `[data-action="set-view"][data-view="${view}"]`;
  const items = page.locator(selector);
  for (let i = 0; i < await items.count(); i++) {
    if (await items.nth(i).isVisible()) {
      await items.nth(i).click();
      return;
    }
  }
  if (["atelier", "media", "import"].includes(view)) {
    const more = page.locator(".mobile-nav-group").filter({ hasText: "Plus" }).locator("summary");
    if (await more.isVisible()) await more.click();
  } else if (["generator", "brouhaha"].includes(view)) {
    const game = page.locator(".mobile-nav-group").filter({ hasText: "Jeu" }).locator("summary");
    if (await game.isVisible()) await game.click();
  }
  await clickVisible(page, selector);
}

async function assertNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    html: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(Math.max(overflow.html, overflow.body), JSON.stringify(overflow)).toBeLessThanOrEqual(2);
}

async function runAxe(page, label) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const violations = results.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    targets: v.nodes.slice(0, 4).map(n => n.target)
  }));
  expect(violations, `${label} axe violations\n${JSON.stringify(violations, null, 2)}`).toEqual([]);
}

test("bootstrap defers seed diagnostics and heavy modules after first install", async ({ page }) => {
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");

  const cold = await page.evaluate(() => globalThis.__GARGOTTEX_BOOTSTRAP_DEBUG__?.());
  expect(cold).toBeTruthy();
  expect(cold.renderCalls).toBe(1);
  expect(cold.diagnosticRuns).toBe(0);
  expect(cold.seedLoads).toBe(1);
  expect(cold.xlsxModuleLoads).toBe(0);
  expect(cold.zipModuleLoads).toBe(0);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");

  const warm = await page.evaluate(() => {
    const debug=globalThis.__GARGOTTEX_BOOTSTRAP_DEBUG__?.();
    const paths=(debug?.resources||[]).map(value => {
      try { return new URL(value).pathname; } catch (_) { return value; }
    });
    return {...debug,paths};
  });

  expect(warm.renderCalls).toBe(1);
  expect(warm.diagnosticRuns).toBe(0);
  expect(warm.seedLoads).toBe(0);
  expect(warm.xlsxModuleLoads).toBe(0);
  expect(warm.zipModuleLoads).toBe(0);
  expect(warm.readyAtMs).toBeGreaterThan(0);
  expect(warm.paths.some(path => path.endsWith("/seed-data.js"))).toBe(false);
  expect(warm.paths.some(path => path.endsWith("/src/utils/xlsx.js"))).toBe(false);
  expect(warm.paths.some(path => path.endsWith("/src/utils/zip.js"))).toBe(false);

  console.log("[v6fast-bootstrap]", JSON.stringify({
    coldReadyMs:cold.readyAtMs,
    warmReadyMs:warm.readyAtMs,
    coldRenderCalls:cold.renderCalls,
    warmRenderCalls:warm.renderCalls,
    warmResourceCount:warm.paths.length,
    warmSeedLoads:warm.seedLoads,
    warmDiagnosticRuns:warm.diagnosticRuns,
    warmXlsxLoads:warm.xlsxModuleLoads,
    warmZipLoads:warm.zipModuleLoads
  }));

  await gotoView(page, "import");
  await expect(page.locator(".admin-io-v6")).toBeVisible();
  await expect(page.locator(".diagnostic-metrics-v6")).toBeVisible();
  await expect.poll(async () => page.evaluate(() => globalThis.__GARGOTTEX_BOOTSTRAP_DEBUG__?.().diagnosticRuns)).toBe(1);

  const afterDiagnostic=await page.evaluate(() => globalThis.__GARGOTTEX_BOOTSTRAP_DEBUG__?.());
  expect(afterDiagnostic.xlsxModuleLoads).toBe(0);
  expect(afterDiagnostic.zipModuleLoads).toBe(0);
});

test("home bootstrap and session actions remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await expect(page.locator(".home-polish-v6")).toBeVisible();
  await expect(page.locator(".v6-app")).toHaveClass(/whaou-home/);

  const berthold = page.locator('[data-action="home-berthold-refresh"]');
  const firstAdvice = await berthold.locator("strong").innerText();
  await berthold.click();
  await expect(berthold.locator("strong")).not.toHaveText(firstAdvice);

  await gotoView(page, "codex");
  await expect(page.locator(".bestiary-v6")).toBeVisible();
  await expect(page.locator(".v6-app")).toHaveClass(/whaou-codex/);
  await gotoView(page, "home");
  await expect(page.locator(".v6-app")).toHaveClass(/whaou-home/);

  await expect(page.locator('[data-action="session-start"]')).toBeVisible();
  await page.locator('[data-action="session-start"]').click();
  await expect(page.locator(".home-session-board")).toBeVisible();
  await expect(page.locator('[data-action="session-set-dungeon"]')).toBeVisible();
  await expect(page.locator('[data-action="session-set-floor"]')).toBeVisible();
  await expect(page.locator('[data-action="session-end"]')).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test("media runtime stays lazy and enforces active visual rules", async ({ page }) => {
  await ready(page);

  const initial = await page.evaluate(() => globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(initial).toBeTruthy();
  expect(initial.catalogScans).toBe(0);
  expect(initial.fullRecordReads).toBe(0);
  expect(initial.objectUrlsCreated).toBe(0);
  expect(initial.liveObjectUrls).toBe(0);

  const seeded = await page.evaluate(async () => {
    const raw = atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
    const transparent = new Blob([bytes], { type: "image/png" });
    const original = new Blob([bytes], { type: "image/png" });
    const db = await new Promise((resolve,reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    const readAll = storeName => new Promise((resolve,reject) => {
      const tx=db.transaction(storeName,"readonly");
      const req=tx.objectStore(storeName).getAll();
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    const [npcs,dungeons]=await Promise.all([readAll("npcs"),readAll("dungeons")]);
    const npc=npcs[0], dungeon=dungeons[0], staticDungeon=dungeons[1];
    if(!npc||!dungeon||!staticDungeon) throw new Error("Fixture métier absente");

    const legacyDungeonGhostPath="assets/images/dungeons/legacy-dungeon-missing.webp";
    await new Promise((resolve,reject) => {
      const tx=db.transaction(["media_assets","dungeons"],"readwrite");
      const store=tx.objectStore("media_assets");
      store.put({
        id:"v6fast-lazy-transparent",
        label:"Lazy transparent",
        file_name:"lazy-transparent.png",
        path:"local-media/npcs/lazy-transparent.png",
        entity_type:"npcs",
        entity_id:npc.id,
        transparent_blob:transparent,
        transparent_path:"local-media/npcs/transparent/lazy-transparent.png",
        transparent_review_status:"approved",
        transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
      });
      store.put({
        id:"v6fast-white-original",
        label:"Original blanc historique",
        file_name:"white-original.png",
        path:"local-media/gallery/white-original.png",
        mime_type:"image/png",
        entity_type:"gallery",
        entity_id:"",
        blob:original,
        original_size:original.size
      });
      store.put({
        id:"v6fast-dungeon-original",
        label:"Original Donjon",
        file_name:"logo-192.png",
        path:"assets/images/logo-192.png",
        mime_type:"image/png",
        entity_type:"dungeons",
        entity_id:staticDungeon.id
      });
      store.put({
        id:"v6fast-dungeon-legacy-original",
        label:"Donjon historique original",
        file_name:"legacy-dungeon.png",
        path:"local-media/dungeons/original/legacy-dungeon.png",
        mime_type:"image/png",
        entity_type:"dungeons",
        entity_id:dungeon.id,
        blob:original,
        original_size:original.size
      });
      tx.objectStore("dungeons").put({...dungeon,image_path:legacyDungeonGhostPath});
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
    db.close();
    return {npcId:npc.id,dungeonId:dungeon.id};
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");

  const afterReload = await page.evaluate(() => globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(afterReload.catalogScans).toBe(0);
  expect(afterReload.objectUrlsCreated).toBe(0);

  await gotoView(page,"codex");
  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();
  const dungeonCard=page.locator(`[data-action="select-family-codex"][data-type="dungeons"][data-id="${seeded.dungeonId}"]`).first();
  await expect(dungeonCard).toBeVisible();
  await expect(dungeonCard.locator("img").first()).toHaveAttribute("src", /^blob:/);
  const dungeonSrc=await dungeonCard.locator("img").first().getAttribute("src");
  expect(dungeonSrc).not.toContain("assets/images/dungeons/");

  await page.locator('[data-action="set-codex-type"][data-type="npcs"]').first().click();
  const npcCard=page.locator(`[data-action="select-family-codex"][data-type="npcs"][data-id="${seeded.npcId}"]`).first();
  await expect(npcCard).toBeVisible();
  await expect(npcCard.locator("img").first()).toHaveAttribute("src", /^blob:/);

  const targeted = await page.evaluate(() => globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(targeted.catalogScans).toBe(0);
  expect(targeted.entityLookups).toBeGreaterThan(0);
  expect(targeted.objectUrlsCreated).toBeGreaterThan(0);

  await gotoView(page,"home");
  const released = await page.evaluate(() => globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(released.liveObjectUrls).toBe(0);

  await gotoView(page,"media");
  const whiteCard=page.locator('[data-action="media-select"][data-id="v6fast-white-original"]');
  const dungeonMediaCard=page.locator('[data-action="media-select"][data-id="v6fast-dungeon-original"]');
  await expect(whiteCard).toHaveAttribute("data-card-variant","inactive-original");
  await expect(whiteCard.locator("img")).toHaveCount(0);
  await expect(dungeonMediaCard).toHaveAttribute("data-card-variant","dungeon-original");
  await expect(dungeonMediaCard.locator("img")).toHaveAttribute("src", /assets\/images\/logo-192\.png/);

  await whiteCard.click();
  await page.locator('[data-action="media-link-type"]').selectOption("dungeons");
  await page.locator('[data-action="media-link-entity"]').selectOption(seeded.dungeonId);
  const beforeAttach = await page.evaluate(() => {
    const debug=globalThis.__GARGOTTEX_MEDIA_DEBUG__?.();
    return {refreshDataCalls:debug?.refreshDataCalls,renderCalls:debug?.renderCalls,partial:debug?.mediaPartialRenders};
  });
  await page.locator('[data-action="media-attach"]').click();

  await expect.poll(async () => page.evaluate(async id => {
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const tx=db.transaction("media_assets","readonly"),req=tx.objectStore("media_assets").get(id);
    const row=await new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    db.close();
    return row ? `${row.entity_type}:${row.entity_id}` : "";
  },"v6fast-white-original")).toBe(`dungeons:${seeded.dungeonId}`);

  const afterAttach = await page.evaluate(() => {
    const debug=globalThis.__GARGOTTEX_MEDIA_DEBUG__?.();
    return {refreshDataCalls:debug?.refreshDataCalls,renderCalls:debug?.renderCalls,partial:debug?.mediaPartialRenders};
  });
  expect(afterAttach.refreshDataCalls).toBe(beforeAttach.refreshDataCalls);
  expect(afterAttach.renderCalls).toBe(beforeAttach.renderCalls);
  expect(afterAttach.partial).toBeGreaterThan(beforeAttach.partial);

  const persisted = await page.evaluate(async id => {
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const tx=db.transaction("media_assets","readonly"),req=tx.objectStore("media_assets").get(id);
    const row=await new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    db.close();
    return {entity_type:row.entity_type,entity_id:row.entity_id,blobSize:row.blob?.size||0};
  },"v6fast-white-original");
  expect(persisted.entity_type).toBe("dungeons");
  expect(persisted.entity_id).toBe(seeded.dungeonId);
  expect(persisted.blobSize).toBeGreaterThan(0);
});

test("Bestiary filters sorting display mode and persistence remain stable", async ({ page }) => {
  await ready(page);
  await gotoView(page, "codex");

  await page.locator('[data-action="bestiary-search"]').fill("gobelin");
  await expect(page.locator(".bestiary-result-label")).toContainText("résultat");
  const filters = page.locator(".bestiary-advanced-filters");
  if (!(await filters.getAttribute("open"))) await filters.locator(":scope > summary").click();
  await page.locator('[data-action="bestiary-category"]').selectOption("basique");
  await page.locator('[data-action="bestiary-sort"]').selectOption("menace");
  await page.locator('[data-action="bestiary-toggle-direction"]').click();
  await page.locator('[data-action="bestiary-mode"][data-mode="list"]').click();
  await expect(page.locator(".bestiary-results.list")).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await expect(page.locator('[data-action="bestiary-search"]')).toHaveValue("gobelin");
  await expect(page.locator(".bestiary-advanced-filters")).toHaveAttribute("open", "");
  await expect(page.locator('[data-action="bestiary-category"]')).toHaveValue("basique");
  await expect(page.locator('[data-action="bestiary-sort"]')).toHaveValue("menace");
  await expect(page.locator('[data-action="bestiary-mode"][data-mode="list"]')).toHaveAttribute("aria-pressed", "true");
});

test("Codex cross-family navigation remains coherent", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await gotoView(page, "codex");

  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();
  await page.locator('[data-action="select-family-codex"][data-type="dungeons"][data-id="dungeon_le-cabaret-des-joyeuses"]').first().click();
  await expect(page.getByRole("heading", { name: "Le Cabaret des Joyeuses" })).toBeVisible();

  const seeAll = page.locator('[data-action="dungeon-see-all"][data-type="creatures"]').first();
  await expect(seeAll).toBeVisible();
  await seeAll.click();
  await expect(page.locator(".bestiary-v6")).toBeVisible();
  await expect(page.locator('[data-action="bestiary-dungeon"]')).toHaveValue("dungeon_le-cabaret-des-joyeuses");
  await page.locator('[data-action="codex-context-back"]').click();
  await expect(page.getByRole("heading", { name: "Le Cabaret des Joyeuses" })).toBeVisible();

  await page.locator('[data-action="set-codex-type"][data-type="heroes"]').first().click();
  await page.locator('[data-action="select-family-codex"][data-type="heroes"]').first().click();
  const skillCounts = [];
  for (const level of [1,2,3,4]) {
    const button = page.locator(`[data-action="hero-level"][data-level="${level}"]`);
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    skillCounts.push(await page.locator(".hero-skill-v6").count());
  }
  for (let i = 1; i < skillCounts.length; i++) expect(skillCounts[i]).toBeGreaterThanOrEqual(skillCounts[i-1]);

  await page.locator('[data-action="set-codex-type"][data-type="npcs"]').first().click();
  await page.locator('[data-action="select-family-codex"][data-type="npcs"][data-id="npc_mirelda-trois-tentacules"]').click();
  await expect(page.getByRole("heading", { name: "Mirelda Trois-Tentacules" })).toBeVisible();
  const questLink = page.locator('[data-action="open-related"][data-type="quests"][data-id="quest_test_le-cabaret-des-joyeuses"]');
  await questLink.click();
  await expect(page.locator(".quest-sheet-v6")).toBeVisible();
  await page.locator('[data-action="codex-related-back"]').click();
  await expect(page.getByRole("heading", { name: "Mirelda Trois-Tentacules" })).toBeVisible();

  const globalSearch = page.locator('[data-action="search"]');
  await globalSearch.fill("Brünhilda");
  await expect(page.locator("#global-codex-search-results")).toBeVisible();
  const heroResult = page.locator('.global-search-result[data-type="heroes"]').first();
  await heroResult.click();
  await expect(page.locator(".hero-sheet-v6")).toBeVisible();
});

test("Dungeon WHAOU bounds collection markers and preserves a long expedition track", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  await page.evaluate(async () => {
    const db = await new Promise((resolve,reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    const tx=db.transaction("dungeons","readwrite");
    const store=tx.objectStore("dungeons");
    const id="dungeon_le-cabaret-des-joyeuses";
    const current=await new Promise((resolve,reject) => {
      const req=store.get(id);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    if(!current) throw new Error("Donjon test absent");
    store.put({...current,floor_budgets:Array.from({length:100},(_,index)=>(index%9)+1),base_floor_count:100});
    await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
    db.close();
  });

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page, "codex");
  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();

  const card = page.locator('[data-action="select-family-codex"][data-type="dungeons"][data-id="dungeon_le-cabaret-des-joyeuses"]').first();
  await expect(card).toBeVisible();
  await expect(card.locator(".dungeon-card-floor-dots i")).toHaveCount(7);
  await expect(card.locator(".dungeon-card-floor-more")).toHaveText("+93");
  expect(await page.locator(".dungeon-card-boss").count()).toBeGreaterThan(0);

  await card.click();
  const skip = page.locator(".gargotte-cinematic.show .cinematic-skip");
  await expect(skip).toBeVisible();
  await skip.click();
  await expect(page.locator(".dungeon-sheet-v6")).toBeVisible();
  await expect(page.locator(".dungeon-floor-stop")).toHaveCount(100);

  const track = await page.locator(".dungeon-floor-track").evaluate(el => ({
    scrollWidth:el.scrollWidth,
    clientWidth:el.clientWidth
  }));
  expect(track.scrollWidth).toBeGreaterThan(track.clientWidth);
  await assertNoHorizontalOverflow(page);
});

test("Creature WHAOU keeps tabletop staging lazy and readable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  const fixture = await page.evaluate(async () => {
    const pngRaw=atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    const bytes=Uint8Array.from(pngRaw,c=>c.charCodeAt(0));
    const transparent=new Blob([bytes],{type:"image/png"});
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const dungeon=await new Promise((resolve,reject)=>{
      const tx=db.transaction("dungeons","readonly"),req=tx.objectStore("dungeons").openCursor();
      req.onsuccess=()=>resolve(req.result?.value||null);req.onerror=()=>reject(req.error);
    });
    if(!dungeon){db.close();throw new Error("Donjon fixture absent");}
    const categories=["basique","tactique","speciale","brute","mini_boss"];
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(["creatures","loot_items","media_assets"],"readwrite");
      const creatures=tx.objectStore("creatures");
      const loot=tx.objectStore("loot_items");
      const media=tx.objectStore("media_assets");
      categories.forEach((category,index)=>creatures.put({
        id:"whaou-category-"+category,name:"WHAOU "+category,category,menace:index+1,
        dungeon_id:dungeon.id,dungeon_name:dungeon.name,pv:4,atk:2,def:1,zone:1,actions:2,tags:["whaou"]
      }));
      loot.put({id:"whaou-loot",creature_id:"whaou-boss-1",creature_name:"Boss WHAOU phase 1",name:"Trophée WHAOU",type:"Trophée",effect:"Test visuel",gold_value:12,tags:[]});
      const bossBase={
        category:"boss",menace:6,dungeon_id:dungeon.id,dungeon_name:dungeon.name,
        pv:30,atk:6,def:4,zone:2,actions:3,tags:["whaou"]
      };
      creatures.put({...bossBase,id:"whaou-boss-1",name:"Boss WHAOU phase 1",phase_number:1,phase_ids:["whaou-boss-2","whaou-boss-3"],special_attack_name:"Grand Fracas",special_attack_noise:3,ai_behavior:"Charge la cible la plus bruyante.",ai_target_priority:"Héros avec le plus de Brouhaha",loot_items:[{id:"whaou-loot",name:"Trophée WHAOU",type:"Trophée",effect:"Test visuel",gold_value:12}]});
      creatures.put({...bossBase,id:"whaou-boss-2",name:"Boss WHAOU phase 2",phase_number:2});
      creatures.put({...bossBase,id:"whaou-boss-3",name:"Boss WHAOU phase 3",phase_number:3});
      for(const [id,type,entityId] of [["whaou-creature-media","creatures","whaou-boss-1"],["whaou-loot-media","loot_items","whaou-loot"]]){
        media.put({
          id,label:id,file_name:id+".png",path:"local-media/"+type+"/"+id+".png",entity_type:type,entity_id:entityId,
          transparent_blob:transparent,transparent_path:"local-media/"+type+"/transparent/"+id+".png",
          transparent_review_status:"approved",transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
        });
      }
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
    return {bossId:"whaou-boss-1"};
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"codex");

  for (const category of ["basique","tactique","speciale","brute","mini_boss","boss"]) {
    await expect(page.locator(".bestiary-gallery-card."+category).first()).toBeVisible();
  }

  const bossCard=page.locator('[data-action="select-codex"][data-type="creatures"][data-id="'+fixture.bossId+'"]').first();
  await expect(bossCard.locator("img").first()).toHaveAttribute("src",/^blob:/);
  await expect(bossCard.locator(".bestiary-card-plinth")).toBeVisible();
  await bossCard.click();

  await expect(page.locator(".creature-sheet-v6.boss")).toBeVisible();
  await expect(page.locator(".creature-figure>img")).toHaveAttribute("src",/^blob:/);
  await expect(page.locator(".creature-identity-watermark")).toBeVisible();
  await expect(page.locator(".creature-ability-stamp")).toHaveText("Brouhaha +3");
  await expect(page.locator(".creature-target-priority")).toContainText("Héros avec le plus de Brouhaha");
  await expect(page.locator(".creature-loot-thumb img")).toHaveAttribute("src",/^blob:/);
  await expect(page.locator(".creature-phase-card")).toHaveCount(3);
  await expect(page.locator(".creature-phase-card.current")).toHaveCount(1);

  const mediaDebug=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(mediaDebug.catalogScans).toBe(0);

  await page.locator('[data-action="codex-back"]').first().click();
  await page.locator('[data-action="bestiary-mode"][data-mode="list"]').click();
  await expect(page.locator(".bestiary-results.list")).toBeVisible();
  await expect(page.locator(".bestiary-list-row.boss").first()).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test("Hero progression and NPC dossiers stay lazy distinct and complete", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  await page.evaluate(async () => {
    const raw=atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
    const transparent=new Blob([bytes],{type:"image/png"});
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const dungeon=await new Promise((resolve,reject)=>{
      const tx=db.transaction("dungeons","readonly"),req=tx.objectStore("dungeons").openCursor();
      req.onsuccess=()=>resolve(req.result?.value||null);req.onerror=()=>reject(req.error);
    });
    if(!dungeon){db.close();throw new Error("Donjon fixture absent");}

    await new Promise((resolve,reject)=>{
      const tx=db.transaction(["heroes","npcs","quests","media_assets"],"readwrite");
      const heroes=tx.objectStore("heroes"),npcs=tx.objectStore("npcs"),quests=tx.objectStore("quests"),media=tx.objectStore("media_assets");

      for(let level=1;level<=4;level++){
        const id="whaou-hero-complet-"+level;
        heroes.put({
          id,hero_base_name:"WHAOU Héros complet",level,name:"WHAOU Héros complet N"+level,
          role:"Franc-tireur",title:"Titre N"+level,pv:5+level,atk:level+1,def:level,zone:1+level,actions:3,
          ability_text:"Compétence WHAOU N"+level,effect_text:"Effet cumulé niveau "+level,brouhaha:String(level),tags:["whaou"]
        });
        media.put({
          id:"media-"+id,label:id,file_name:id+".png",path:"local-media/heroes/"+id+".png",entity_type:"heroes",entity_id:id,
          transparent_blob:transparent,transparent_path:"local-media/heroes/transparent/"+id+".png",
          transparent_review_status:"approved",transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
        });
      }
      for(const level of [1,3]){
        heroes.put({
          id:"whaou-hero-incomplet-"+level,hero_base_name:"WHAOU Héros incomplet",level,
          name:"WHAOU Héros incomplet N"+level,role:"Éclaireur",title:"Trou dans la progression",
          pv:4+level,atk:level,def:1,zone:2,actions:3,ability_text:"Compétence incomplète N"+level,
          effect_text:"Test niveau manquant",brouhaha:"",tags:["whaou"]
        });
      }

      npcs.put({
        id:"whaou-npc-complet",name:"WHAOU Mirette du Comptoir",slug:"whaou-mirette-du-comptoir",
        race:"Halfeline",role:"Tenancière suppléante",tone:"Aimable jusqu'au troisième pichet",
        lore:"Elle connaît chaque dette, chaque rumeur et la moitié des mensonges de la salle.",tags:["whaou"]
      });
      npcs.put({
        id:"whaou-npc-minimal",name:"WHAOU Silhouette Sans Dossier",slug:"whaou-silhouette-sans-dossier",
        race:"Humain",role:"Passant",tone:"",lore:"",tags:["whaou"]
      });
      quests.put({
        id:"whaou-quest-npc",name:"WHAOU Le Tonneau Disparu",slug:"whaou-le-tonneau-disparu",
        difficulty:4,npc_id:"whaou-npc-complet",npc_name:"WHAOU Mirette du Comptoir",
        dungeon_id:dungeon.id,dungeon_name:dungeon.name,objective:"Retrouver le tonneau avant Berthold.",reward:"Une tournée.",tags:["whaou"]
      });
      media.put({
        id:"media-whaou-npc",label:"whaou-npc",file_name:"whaou-npc.png",path:"local-media/npcs/whaou-npc.png",
        entity_type:"npcs",entity_id:"whaou-npc-complet",
        transparent_blob:transparent,transparent_path:"local-media/npcs/transparent/whaou-npc.png",
        transparent_review_status:"approved",transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
      });

      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"codex");

  await page.locator('[data-action="set-codex-type"][data-type="heroes"]').first().click();
  const completeCard=page.locator(".hero-collection-card").filter({hasText:"WHAOU Héros complet"}).first();
  await expect(completeCard).toBeVisible();
  await expect(completeCard.locator(".hero-card-level")).toHaveText("N1");
  await expect(completeCard.locator("img").first()).toHaveAttribute("src",/^blob:/);
  await completeCard.click();

  const counts=[];
  for(const level of [1,2,3,4]){
    const button=page.locator('[data-action="hero-level"][data-level="'+level+'"]');
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed","true");
    await expect(page.locator(".hero-portrait-level")).toHaveText("N"+level);
    await expect(page.locator(".hero-portrait-v6>img")).toHaveAttribute("src",/^blob:/);
    counts.push(await page.locator(".hero-skill-v6").count());
  }
  expect(counts).toEqual([1,2,3,4]);
  await expect(page.locator(".hero-skill-v6.current .hero-brouhaha-stamp")).toHaveText("Brouhaha +4");

  await page.locator('[data-action="codex-family-back"][data-type="heroes"]').click();
  const incompleteCard=page.locator(".hero-collection-card").filter({hasText:"WHAOU Héros incomplet"}).first();
  await incompleteCard.click();
  await expect(page.locator('[data-action="hero-level"][data-level="1"]')).toBeEnabled();
  await expect(page.locator('[data-action="hero-level"][data-level="2"]')).toBeDisabled();
  await expect(page.locator('[data-action="hero-level"][data-level="3"]')).toBeEnabled();
  await expect(page.locator('[data-action="hero-level"][data-level="4"]')).toBeDisabled();
  await page.locator('[data-action="hero-level"][data-level="3"]').click();
  await expect(page.locator(".hero-portrait-level")).toHaveText("N3");

  await page.locator('[data-action="set-codex-type"][data-type="npcs"]').first().click();
  const npcCard=page.locator('.npc-collection-card[data-id="whaou-npc-complet"]');
  await expect(npcCard).toBeVisible();
  await expect(npcCard.locator("img").first()).toHaveAttribute("src",/^blob:/);
  await npcCard.click();

  await expect(page.locator(".npc-sheet-v6")).toBeVisible();
  await expect(page.locator(".npc-tone-note")).toContainText("Aimable jusqu'au troisième pichet");
  await expect(page.locator(".npc-lore-v6")).toContainText("chaque dette");
  await expect(page.locator(".npc-quest-contract")).toHaveCount(1);
  await expect(page.locator(".npc-quest-contract")).toContainText("Difficile");
  await expect(page.locator(".npc-sheet-v6 .hero-stats-v6")).toHaveCount(0);

  await page.locator('[data-action="codex-family-back"][data-type="npcs"]').click();
  await page.locator('.npc-collection-card[data-id="whaou-npc-minimal"]').click();
  await expect(page.locator(".npc-media-fallback.large")).toBeVisible();
  await expect(page.locator(".npc-tone-note")).toHaveCount(0);
  await expect(page.locator(".npc-lore-v6")).toHaveCount(0);

  const mediaDebug=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(mediaDebug.catalogScans).toBe(0);
  await assertNoHorizontalOverflow(page);
});

test("session Generator Brouhaha and Quest flows remain coherent", async ({ page }) => {
  await ready(page);

  const dungeonSelect = page.locator('[data-action="session-start-dungeon"]');
  await dungeonSelect.selectOption("dungeon_le-cabaret-des-joyeuses");
  await page.locator('[data-action="session-start"]').click();
  await expect(page.getByText("Partie en cours")).toBeVisible();

  await gotoView(page, "generator");
  const generate = page.locator('[data-action="generate-session-encounter"]');
  await expect(generate).toBeEnabled();
  await generate.click();
  await expect(page.locator(".session-encounter-v6")).toBeVisible();
  const eliminate = page.locator('[data-action="session-eliminate-creature"]').first();
  const beforeRemaining = Number(await page.locator(".encounter-remaining-v6 b").innerText());
  await eliminate.click();
  await expect.poll(async () => Number(await page.locator(".encounter-remaining-v6 b").innerText())).toBeLessThan(beforeRemaining);

  await gotoView(page, "brouhaha");
  await page.locator('[data-action="session-brouhaha-plus"]').click();
  await page.locator('[data-action="session-brouhaha-plus"]').click();
  await expect(page.locator(".brouhaha-session-core strong")).toHaveText("2");
  await page.locator('[data-action="session-brouhaha-draw"]').click();
  await expect(page.locator(".brouhaha-current-ticket")).toContainText("Test");
  await expect(page.locator(".brouhaha-history-row")).toHaveCount(1);

  await gotoView(page, "quests");
  await page.locator('[data-action="session-quest-reroll"]').click();
  await expect(page.locator(".session-quest-card")).toContainText("test");
  const codexQuest = page.locator('[data-action="jump-codex"][data-type="quests"][data-id="quest_test_le-cabaret-des-joyeuses"]');
  await codexQuest.click();
  await expect(page.locator(".quest-sheet-v6")).toBeVisible();
});

test("Atelier saves an edit and restores it after reload", async ({ page }) => {
  await ready(page);
  await gotoView(page, "atelier");
  const item = page.locator('[data-action="select-workshop"]').first();
  await expect(item).toBeVisible();
  const id = await item.getAttribute("data-id");
  const type = await item.getAttribute("data-type");
  await item.click();

  const form = page.locator('form[data-workshop-form="true"]').first();
  const nameInput = form.locator('[name="name"]').first();
  await expect(nameInput).toBeVisible();
  const original = await nameInput.inputValue();
  const changed = original + " V6Fast";
  await nameInput.fill(changed);
  await form.locator("[data-workshop-save]").click();
  await expect(form.locator("[data-workshop-status]").last()).toContainText("Enregistré localement");

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page, "atelier");
  const same = page.locator(`[data-action="select-workshop"][data-type="${type}"][data-id="${id}"]`).first();
  await expect(same).toBeVisible();
  await same.click();
  await expect(page.locator('form[data-workshop-form="true"] [name="name"]').first()).toHaveValue(changed);
});

test("keyboard focus, Escape and modal focus restoration stay intact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await gotoView(page, "atelier");
  await page.locator('[data-action="select-workshop"]').first().click();

  const nameInput = page.locator('form[data-workshop-form="true"] [name="name"]').first();
  await expect(nameInput).toBeVisible();
  const original = await nameInput.inputValue();
  await nameInput.fill(original + " V6Fast");

  const codexButton = page.locator('.v6-sidebar [data-action="set-view"][data-view="codex"]');
  await codexButton.click();
  const guard = page.getByRole("dialog", { name: "Modifications non enregistrées" });
  await expect(guard).toBeVisible();
  await expect(guard.getByRole("button", { name: "Rester" })).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(guard.getByRole("button", { name: "Enregistrer", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(guard.getByRole("button", { name: "Rester" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(guard).toHaveCount(0);
  await expect(codexButton).toBeFocused();

  const deleteButton = page.locator('[data-action="delete-item"]').first();
  await deleteButton.click();
  const danger = page.getByRole("dialog", { name: /Supprimer/ });
  await expect(danger).toBeVisible();
  await expect(danger.getByRole("button", { name: "Annuler" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(danger).toHaveCount(0);
  await expect(deleteButton).toBeFocused();

  const journalButton = page.locator('.topbar [data-action="toggle-journal"]');
  await journalButton.click();
  const journal = page.getByRole("dialog", { name: "Journal d'erreurs" });
  await expect(journal).toBeVisible();
  await expect(journal.getByRole("button", { name: "Fermer le journal" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(journal).toHaveCount(0);
  await expect(journalButton).toBeFocused();
});

test("structured import preview stays write-free until confirmation", async ({ page }) => {
  await ready(page);
  await gotoView(page, "import");

  const before = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction("creatures", "readonly");
    const req = tx.objectStore("creatures").count();
    const count = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return count;
  });

  await page.locator('[data-action="import-json-file"]').setInputFiles({
    name: "v6fast-import.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify([{ name: "Créature V6Fast", dungeon_name: "" }]))
  });

  await expect(page.locator(".import-preview-v6")).toBeVisible();
  await expect(page.getByText("Aucune donnée métier écrite")).toBeVisible();

  const during = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction("creatures", "readonly");
    const req = tx.objectStore("creatures").count();
    const count = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return count;
  });
  expect(during).toBe(before);

  await page.locator('[data-action="import-apply"]').click();
  await expect(page.locator(".import-final-report")).toBeVisible();

  const after = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction("creatures", "readonly");
    const req = tx.objectStore("creatures").count();
    const count = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return count;
  });
  expect(after).toBe(before + 1);
});

test("Media admin inspection keeps the selected Blob unchanged", async ({ page }) => {
  await ready(page);
  await gotoView(page, "media");
  const card = page.locator('[data-action="media-select"]').first();
  await expect(card).toBeVisible();
  const id = await card.getAttribute("data-id");

  const snapshot = async () => page.evaluate(async mediaId => {
    const db = await new Promise((resolve,reject) => {
      const req=indexedDB.open("gargottex-v5-offline");
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    const tx=db.transaction("media_assets","readonly");
    const req=tx.objectStore("media_assets").get(mediaId);
    const row=await new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    db.close();
    return row ? {
      id: row.id,
      blobSize: row.blob?.size || 0,
      blobType: row.blob?.type || "",
      transparentSize: row.transparent_blob?.size || 0,
      path: row.path || ""
    } : null;
  }, id);

  const before = await snapshot();
  expect(before).not.toBeNull();
  await card.click();
  await expect(page.locator(".media-detail-v6")).toBeVisible();
  await expect(page.locator('[data-action="media-link-type"]')).toBeVisible();
  await expect(page.locator('[data-action="media-attach"]')).toBeVisible();
  await expect(page.locator('[data-action="media-download-original"]')).toBeVisible();
  const after = await snapshot();
  expect(after).toEqual(before);
});

test("approved cutouts stay active across Media and PNJ Codex", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  const linkedNpc = await page.evaluate(async () => {
    const readDb=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const npcTx=readDb.transaction("npcs","readonly"),npcReq=npcTx.objectStore("npcs").getAll();
    const npcs=await new Promise((resolve,reject)=>{npcReq.onsuccess=()=>resolve(npcReq.result);npcReq.onerror=()=>reject(npcReq.error);});
    readDb.close();
    const npc=npcs[0];
    if(!npc) throw new Error("PNJ test absent");

    const makePng = async (transparent) => {
      const canvas=document.createElement("canvas");
      canvas.width=64;canvas.height=64;
      const ctx=canvas.getContext("2d");
      if(!transparent){ctx.fillStyle="#fff";ctx.fillRect(0,0,64,64);}
      ctx.fillStyle="#8b5a2b";ctx.fillRect(16,8,32,48);
      return await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("blob")),"image/png"));
    };
    const original=await makePng(false);
    const cutout=await makePng(true);
    const digest=await crypto.subtle.digest("SHA-256",await original.arrayBuffer());
    const hash=Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,"0")).join("");

    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const tx=db.transaction("media_assets","readwrite");
    tx.objectStore("media_assets").put({
      id:"media-existing-transparent",
      label:"A0D7BFF3-3F23-4EF1-B111-F79EDE75A6AA.png",
      file_name:"A0D7BFF3-3F23-4EF1-B111-F79EDE75A6AA.png",
      path:"local-media/npcs/existing.png",
      mime_type:"image/png",
      entity_type:"npcs",
      entity_id:npc.id,
      blob:original,
      original_size:original.size,
      original_sha256:hash,
      transparent_blob:cutout,
      transparent_path:"local-media/npcs/transparent/existing.png",
      transparent_mime_type:"image/png",
      transparent_width:64,
      transparent_height:64,
      transparent_review_status:"approved",
      transparent_model:"isnet-general-use",
      transparent_processing:"rembg-web / IS-Net DIS",
      transparent_source_sha256:hash,
      transparent_audit:{pass:true,has_alpha_channel:true,width:64,height:64,transparent_ratio:0.625,soft_edge_ratio:0,opaque_ratio:0.375,alpha_bbox:[16,8,48,56]},
      created_at:new Date().toISOString(),
      updated_at:new Date().toISOString()
    });
    await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
    db.close();
    return {id:npc.id,name:npc.name || "PNJ"};
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");

  await gotoView(page,"media");
  const adminCard=page.locator('[data-action="media-select"][data-id="media-existing-transparent"]');
  await expect(adminCard).toHaveAttribute("data-card-variant","transparent");
  await expect(adminCard.locator("img")).toHaveAttribute("src", /^blob:/);
  const transparentSrc=await adminCard.locator("img").getAttribute("src");
  expect(transparentSrc).toBeTruthy();

  await adminCard.click();
  await expect(page.locator(".media-admin-preview-v6 img")).toHaveAttribute("src",transparentSrc);

  const persisted=await page.evaluate(async () => {
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const tx=db.transaction("media_assets","readonly"),req=tx.objectStore("media_assets").get("media-existing-transparent");
    const row=await new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    db.close();
    const digest=await crypto.subtle.digest("SHA-256",await row.blob.arrayBuffer());
    return {
      originalHash:Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,"0")).join(""),
      storedHash:row.original_sha256,
      transparent:Boolean(row.transparent_blob),
      review:row.transparent_review_status,
      model:row.transparent_model
    };
  });
  expect(persisted.originalHash).toBe(persisted.storedHash);
  expect(persisted.transparent).toBe(true);
  expect(persisted.review).toBe("approved");
  expect(persisted.model).toBe("isnet-general-use");

  await gotoView(page,"codex");
  await page.locator('[data-action="set-codex-type"][data-type="npcs"]').first().click();
  const npcCard=page.locator(`[data-action="select-family-codex"][data-type="npcs"][data-id="${linkedNpc.id}"]`).first();
  await expect(npcCard).toBeVisible();
  await expect(npcCard.locator("img").first()).toHaveAttribute("src", /^blob:/);
  const npcSrc = await npcCard.locator("img").first().getAttribute("src");
  expect(npcSrc).toBeTruthy();
  expect(npcSrc).not.toBe(transparentSrc);
  await npcCard.click();
  await expect(page.locator(".npc-sheet-v6 .npc-portrait-v6 img").first()).toHaveAttribute("src",npcSrc);

  await page.locator('[data-action="set-codex-type"][data-type="media_assets"]').first().click();
  await expect(page.locator(".codex-media-library-v6")).toBeVisible();
  await expect(page.locator('[data-action="family-mode"][data-type="media_assets"][data-mode="gallery"]')).toBeVisible();

  await page.locator('[data-action="family-mode"][data-type="media_assets"][data-mode="list"]').click();
  await expect(page.locator(".codex-media-grid-v6.list")).toBeVisible();
  await expect(page.locator(".codex-media-library-v6 .media-detail-v6")).toHaveCount(0);
  await expect(page.locator('[data-action="select-codex"][data-type="media_assets"]')).toHaveCount(0);

  const codexCard=page.locator(".codex-media-card-v6").filter({hasText:linkedNpc.name});
  await expect(codexCard).toBeVisible();
  await expect(codexCard.locator("img")).toHaveAttribute("src", /^blob:/);
});

test("representative phone iPad and desktop layouts remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  const cases = [
    [390, 844, "phone"],
    [834, 1112, "tablet"],
    [1440, 900, "desktop"]
  ];
  for (const [width,height,kind] of cases) {
    await test.step(kind, async () => {
      await page.setViewportSize({ width, height });
      await gotoView(page, "home");
      await assertNoHorizontalOverflow(page);
      if (width <= 767) {
        await expect(page.locator(".mobile-bottom")).toBeVisible();
        await expect(page.locator(".v6-sidebar")).toBeHidden();
      } else {
        await expect(page.locator(".v6-sidebar")).toBeVisible();
      }
      await gotoView(page, "codex");
      await expect(page.locator(".bestiary-v6")).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test("axe smoke covers home and Codex collection", async ({ page }) => {
  await ready(page);
  await runAxe(page, "Accueil");
  await gotoView(page, "codex");
  await runAxe(page, "Codex collection");
});

