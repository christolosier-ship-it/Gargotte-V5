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
  } else if (["generator", "brouhaha", "map"].includes(view)) {
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

test("V6-WHAOU final shell keeps motion finite and offline assets coherent", async ({ page }) => {
  await ready(page);

  const audit=await page.evaluate(async()=>{
    const [cssText,appText,swText]=await Promise.all([
      fetch("./styles.css",{cache:"no-store"}).then(r=>r.text()),
      fetch("./src/app.js",{cache:"no-store"}).then(r=>r.text()),
      fetch("./service-worker.js",{cache:"no-store"}).then(r=>r.text())
    ]);

    const appVersion=appText.match(/const APP_VERSION = "([^"]+)"/)?.[1] || "";
    const appCache=appText.match(/const PWA_CACHE_NAME = "([^"]+)"/)?.[1] || "";
    const swCache=swText.match(/const CACHE = "([^"]+)"/)?.[1] || "";
    const swAssets=[...swText.matchAll(/"(\.\/[^"]+)"/g)].map(match=>match[1].replace(/^\.\//,""));
    const cssAssets=[...new Set(
      [...cssText.matchAll(/url\((["']?)([^)"']+)\1\)/g)]
        .map(match=>match[2])
        .filter(value=>!value.startsWith("data:")&&!/^https?:/i.test(value))
        .map(value=>value.replace(/^\.\//,""))
    )];
    const missingCssAssets=cssAssets.filter(value=>!swAssets.includes(value));
    const externalVisualUrls=[...cssText.matchAll(/https?:\/\/[^)"'\s]+/g)].map(match=>match[0]);
    const infiniteAnimations=[...cssText.matchAll(/animation\s*:\s*([^;}]+)/g)]
      .map(match=>match[1].trim())
      .filter(value=>/\binfinite\b/.test(value))
      .map(value=>value.split(/\s+/)[0]);

    return{
      appVersion,
      appCache,
      swCache,
      missingCssAssets,
      externalVisualUrls,
      infiniteAnimations:[...new Set(infiniteAnimations)].sort(),
      permanentHomePulse:cssText.includes("home-local-pulse")
    };
  });

  expect(audit.appVersion).toBe("5.6.5");
  expect(audit.appCache).toBe("gargottex-v6-whaou-final-v1");
  expect(audit.swCache).toBe(audit.appCache);
  expect(audit.missingCssAssets).toEqual([]);
  expect(audit.externalVisualUrls).toEqual([]);
  expect(audit.infiniteAnimations).toEqual(["cinematic-spark","v6-skeleton"]);
  expect(audit.permanentHomePulse).toBe(false);
});

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

test("Dungeon order and optional arc metadata persist across Codex and Atelier", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  await page.evaluate(async () => {
    const db = await new Promise((resolve,reject) => {
      const req=indexedDB.open("gargottex-v5-offline");
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    await new Promise((resolve,reject) => {
      const tx=db.transaction("dungeons","readwrite");
      const store=tx.objectStore("dungeons");
      store.put({id:"whaou-dungeon-order-2",slug:"whaou-dungeon-order-2",name:"WHAOU Donjon Deux",sort_order:2,arc_name:"Arc WHAOU",floor_budgets:[3],boss_name:"",tags:[]});
      store.put({id:"whaou-dungeon-order-7",slug:"whaou-dungeon-order-7",name:"WHAOU Donjon Sept",sort_order:7,arc_name:"",floor_budgets:[3],boss_name:"",tags:[]});
      store.put({id:"whaou-dungeon-order-none",slug:"whaou-dungeon-order-none",name:"WHAOU Donjon Sans Ordre",floor_budgets:[3],boss_name:"",tags:[]});
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
  });

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page, "codex");
  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();

  const cards=page.locator('[data-action="select-family-codex"][data-type="dungeons"]');
  await expect(cards.first()).toBeVisible();
  await expect.poll(() => cards.evaluateAll(nodes=>nodes.slice(0,2).map(node=>node.dataset.id))).toEqual([
    "whaou-dungeon-order-2",
    "whaou-dungeon-order-7"
  ]);
  const ordered=page.locator('[data-id="whaou-dungeon-order-2"][data-type="dungeons"]').first();
  await expect(ordered.locator(".dungeon-collection-copy small")).toContainText("D2");
  await expect(ordered.locator(".dungeon-collection-copy em")).toHaveText("Arc WHAOU");
  const unnumbered=page.locator('[data-id="whaou-dungeon-order-none"][data-type="dungeons"]').first();
  await expect(unnumbered.locator(".dungeon-collection-copy small")).toContainText("Donjon");
  await expect(unnumbered.locator(".dungeon-collection-copy em")).toHaveCount(0);

  await gotoView(page, "atelier");
  await page.locator('[data-action="set-workshop-type"][data-type="dungeons"]').click();
  await page.locator('[data-action="select-workshop"][data-type="dungeons"][data-id="whaou-dungeon-order-none"]').click();
  const form=page.locator('form[data-workshop-form="true"][data-id="whaou-dungeon-order-none"]');
  await expect(form.locator('[name="sort_order"]')).toBeVisible();
  await expect(form.locator('[name="arc_name"]')).toBeVisible();
  await form.locator('[name="sort_order"]').fill("5");
  await form.locator('[name="arc_name"]').fill("Arc Atelier");
  await form.locator('[data-workshop-save]').click();

  await expect.poll(() => page.evaluate(async () => {
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const row=await new Promise((resolve,reject)=>{const tx=db.transaction("dungeons","readonly"),req=tx.objectStore("dungeons").get("whaou-dungeon-order-none");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    db.close();
    return row ? {sort_order:row.sort_order,arc_name:row.arc_name} : null;
  })).toEqual({sort_order:5,arc_name:"Arc Atelier"});

  const workshopCards=page.locator('[data-action="select-workshop"][data-type="dungeons"]');
  await expect(workshopCards.first()).toBeVisible();
  await expect.poll(() => workshopCards.evaluateAll(nodes=>nodes.slice(0,3).map(node=>node.dataset.id))).toEqual([
    "whaou-dungeon-order-2",
    "whaou-dungeon-order-none",
    "whaou-dungeon-order-7"
  ]);
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

test("Secondary Codex WHAOU keeps four personalities coherent and lazy", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await ready(page);

  const fixture = await page.evaluate(async () => {
    const raw=atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
    const transparent=new Blob([bytes],{type:"image/png"});
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const readFirst=storeName=>new Promise((resolve,reject)=>{
      const tx=db.transaction(storeName,"readonly"),req=tx.objectStore(storeName).openCursor();
      req.onsuccess=()=>resolve(req.result?.value||null);req.onerror=()=>reject(req.error);
    });
    const dungeon=await readFirst("dungeons");
    const creature=await readFirst("creatures");
    if(!dungeon||!creature){db.close();throw new Error("Fixtures Codex absentes");}

    await new Promise((resolve,reject)=>{
      const tx=db.transaction(["npcs","quests","loot_items","interactables","brouhaha_effects","media_assets"],"readwrite");
      const npcs=tx.objectStore("npcs"),quests=tx.objectStore("quests"),loot=tx.objectStore("loot_items");
      const interactables=tx.objectStore("interactables"),brouhaha=tx.objectStore("brouhaha_effects"),media=tx.objectStore("media_assets");

      npcs.put({id:"whaou5-npc",name:"WHAOU5 Commanditaire",slug:"whaou5-commanditaire",race:"Gobelin",role:"Client exigeant",tone:"Pressé",lore:"Attend son contrat.",tags:["whaou5"]});

      for(let difficulty=1;difficulty<=6;difficulty++){
        quests.put({
          id:"whaou5-quest-"+difficulty,name:"WHAOU5 Contrat "+difficulty,slug:"whaou5-contrat-"+difficulty,
          description:"Description contrat "+difficulty,objective:"Objectif majeur "+difficulty,reward:"Récompense "+difficulty,
          difficulty,npc_id:"whaou5-npc",npc_name:"WHAOU5 Commanditaire",
          dungeon_id:dungeon.id,dungeon_name:dungeon.name,tags:["whaou5"]
        });
      }

      for(let rarity=1;rarity<=6;rarity++){
        const id="whaou5-loot-"+rarity;
        loot.put({
          id,creature_id:creature.id,creature_name:creature.name,name:"WHAOU5 Loot "+rarity,
          type:"Trophée",effect:"Effet prioritaire "+rarity,gold_value:rarity*11,rarity,tags:["whaou5"]
        });
        if(rarity===1){
          media.put({
            id:"whaou5-loot-media",label:"WHAOU5 loot",file_name:"whaou5-loot.png",
            path:"local-media/loot_items/whaou5-loot.png",entity_type:"loot_items",entity_id:id,
            transparent_blob:transparent,transparent_path:"local-media/loot_items/transparent/whaou5-loot.png",
            transparent_review_status:"approved",transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
          });
        }
      }

      interactables.put({
        id:"whaou5-interactable-full",name:"WHAOU5 Levier à bière",slug:"whaou5-levier-a-biere",
        dungeon_id:dungeon.id,dungeon_name:dungeon.name,type:"Levier",hp:7,
        actions_allowed:"tirer; pousser; casser",effect:"Ouvre la trappe et renverse une chope.",tags:["whaou5"]
      });
      interactables.put({
        id:"whaou5-interactable-min",name:"WHAOU5 Objet muet",slug:"whaou5-objet-muet",
        dungeon_id:dungeon.id,dungeon_name:dungeon.name,type:"Décor",actions_allowed:"",effect:"",tags:["whaou5"]
      });

      for(const [level,effect] of [[0,"Calme plat"],[5,"Ça monte"],[8,"Ça chauffe"],[12,"Catastrophe réglementaire"]]){
        brouhaha.put({
          id:"whaou5-brouhaha-"+level,level,dungeon_id:level===12?dungeon.id:"",dungeon_name:level===12?dungeon.name:"",
          effect_text:effect
        });
      }

      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
    return {dungeonId:dungeon.id,creatureId:creature.id,creatureName:creature.name};
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"codex");

  await page.locator('[data-action="set-codex-type"][data-type="quests"]').first().click();
  for(const cls of ["basique","tactique","speciale","brute","mini_boss","boss"]){
    await expect(page.locator(".quest-codex-card."+cls).filter({hasText:"WHAOU5"}).first()).toBeVisible();
  }
  const questCard=page.locator('.quest-codex-card[data-id="whaou5-quest-6"]');
  await expect(questCard).toContainText("Objectif");
  await questCard.click();
  await expect(page.locator(".quest-sheet-v6.boss")).toBeVisible();
  await expect(page.locator(".quest-objective-v6")).toContainText("Objectif majeur 6");
  await expect(page.locator(".quest-reward-v6")).toContainText("Récompense 6");
  await page.locator('[data-action="codex-family-back"][data-type="quests"]').click();

  await page.locator('[data-action="set-codex-type"][data-type="loot_items"]').first().click();
  for(const cls of ["basique","tactique","speciale","brute","mini_boss","boss"]){
    await expect(page.locator(".loot-codex-card."+cls).filter({hasText:"WHAOU5"}).first()).toBeVisible();
  }
  const lootWithImage=page.locator('.loot-codex-card[data-id="whaou5-loot-1"]');
  await expect(lootWithImage.locator(".loot-card-gold")).toContainText("11");
  await expect(lootWithImage.locator(".loot-card-media>img")).toHaveAttribute("src",/^blob:/);
  await lootWithImage.click();
  await expect(page.locator(".loot-sheet-v6.basique")).toBeVisible();
  await expect(page.locator(".loot-effect-v6")).toContainText("Effet prioritaire 1");
  await expect(page.locator(".loot-source-v6")).toContainText(fixture.creatureName);
  await page.locator('[data-action="codex-family-back"][data-type="loot_items"]').click();
  await expect(page.locator('.loot-codex-card[data-id="whaou5-loot-2"] .loot-media-fallback')).toBeVisible();

  await page.locator('[data-action="set-codex-type"][data-type="interactables"]').first().click();
  const interactable=page.locator('.interactable-codex-card[data-id="whaou5-interactable-full"]');
  await expect(interactable.locator(".interactable-card-facts i")).toHaveCount(2);
  await expect(interactable).toContainText("PV 7");
  await interactable.click();
  await expect(page.locator(".interactable-blueprint-arrows i")).toHaveCount(3);
  await expect(page.locator(".interactable-actions-v6 b")).toHaveCount(3);
  await expect(page.locator(".interactable-effect-v6")).toContainText("renverse une chope");
  await page.locator('[data-action="codex-family-back"][data-type="interactables"]').click();
  await expect(page.locator('.interactable-codex-card[data-id="whaou5-interactable-min"] .interactable-card-facts i')).toHaveCount(0);

  await page.locator('[data-action="set-codex-type"][data-type="brouhaha_effects"]').first().click();
  await expect(page.locator('.brouhaha-ref-card.calm[data-id="whaou5-brouhaha-0"]')).toBeVisible();
  await expect(page.locator('.brouhaha-ref-card.rising[data-id="whaou5-brouhaha-5"]')).toBeVisible();
  await expect(page.locator('.brouhaha-ref-card.hot[data-id="whaou5-brouhaha-8"]')).toBeVisible();
  const critical=page.locator('.brouhaha-ref-card.critical.level-12[data-id="whaou5-brouhaha-12"]');
  await expect(critical).toBeVisible();
  await critical.click();
  await expect(page.locator(".brouhaha-reference-sheet-v6.critical.level-12")).toBeVisible();
  await expect(page.locator(".brouhaha-reference-note")).toContainText("ne modifie");
  await expect(page.locator('[data-action^="session-brouhaha"]')).toHaveCount(0);

  const mediaDebug=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(mediaDebug.catalogScans).toBe(0);
  await assertNoHorizontalOverflow(page);

  await page.setViewportSize({width:390,height:844});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"codex");
  for(const [type,id,root] of [
    ["quests","whaou5-quest-1",".quest-sheet-v6"],
    ["loot_items","whaou5-loot-1",".loot-sheet-v6"],
    ["interactables","whaou5-interactable-full",".interactable-sheet-v6"],
    ["brouhaha_effects","whaou5-brouhaha-12",".brouhaha-reference-sheet-v6"]
  ]){
    await page.locator('[data-action="set-codex-type"][data-type="'+type+'"]').first().click();
    await page.locator('[data-action="select-family-codex"][data-type="'+type+'"][data-id="'+id+'"]').click();
    await expect(page.locator(root)).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.locator('[data-action="codex-family-back"][data-type="'+type+'"]').click();
  }
});

test("Encounter WHAOU preserves generation rules while staging the table", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  page.on("dialog", dialog => dialog.accept());

  await page.evaluate(async () => {
    const raw=atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
    const transparent=new Blob([bytes],{type:"image/png"});
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});

    await new Promise((resolve,reject)=>{
      const tx=db.transaction(["dungeons","creatures","loot_items","interactables","media_assets"],"readwrite");
      const dungeons=tx.objectStore("dungeons"),creatures=tx.objectStore("creatures"),loot=tx.objectStore("loot_items");
      const interactables=tx.objectStore("interactables"),media=tx.objectStore("media_assets");

      dungeons.put({
        id:"whaou6-dungeon",name:"WHAOU6 Arène des Chopes",slug:"whaou6-arene-des-chopes",
        description:"Salle de test du générateur.",floor_budgets:[4,5,6,3],base_floor_count:4,boss_name:"WHAOU6 Patron",
        tags:["whaou6"],image_path:""
      });
      dungeons.put({
        id:"whaou6-missing-budget",name:"WHAOU6 Sans Budget",slug:"whaou6-sans-budget",
        description:"Budget absent.",floor_budgets:[null],base_floor_count:1,boss_name:"",tags:["whaou6"],image_path:""
      });

      const common={dungeon_id:"whaou6-dungeon",dungeon_name:"WHAOU6 Arène des Chopes",zone:1,actions:2,tags:["whaou6"],image_path:""};
      creatures.put({...common,id:"whaou6-normal",name:"WHAOU6 Gobelin Double",slug:"whaou6-gobelin-double",category:"basique",menace:2,pv:5,atk:2,def:1,special_attack_name:"Coup de chope"});
      creatures.put({...common,id:"whaou6-mini",name:"WHAOU6 Mini Patron",slug:"whaou6-mini-patron",category:"mini_boss",menace:3,pv:12,atk:4,def:2,special_attack_name:"Addition salée"});
      creatures.put({...common,id:"whaou6-boss",name:"WHAOU6 Patron",slug:"whaou6-patron",category:"boss",menace:4,pv:20,atk:5,def:3,special_attack_name:"Dernière tournée"});

      loot.put({
        id:"whaou6-loot",creature_id:"whaou6-normal",creature_name:"WHAOU6 Gobelin Double",
        name:"WHAOU6 Trophée",type:"Trophée",effect:"Brille vaguement",gold_value:4,tags:["whaou6"],image_path:""
      });
      interactables.put({
        id:"whaou6-object",name:"WHAOU6 Tonneau à levier",slug:"whaou6-tonneau-a-levier",
        dungeon_id:"whaou6-dungeon",dungeon_name:"WHAOU6 Arène des Chopes",type:"Tonneau",hp:6,
        actions_allowed:"ouvrir; pousser; casser",effect:"Répand la bière sur deux cases.",tags:["whaou6"],image_path:""
      });

      for(const [id,type] of [["whaou6-normal","creatures"],["whaou6-mini","creatures"],["whaou6-boss","creatures"]]){
        media.put({
          id:"media-"+id,label:id,file_name:id+".png",path:"local-media/"+type+"/"+id+".png",
          entity_type:type,entity_id:id,transparent_blob:transparent,
          transparent_path:"local-media/"+type+"/transparent/"+id+".png",
          transparent_review_status:"approved",transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
        });
      }

      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"generator");

  await expect(page.locator(".session-start-card")).toBeVisible();
  await page.locator('[data-action="session-start-dungeon"]').selectOption("whaou6-dungeon");
  await page.locator('[data-action="session-start"]').click();
  await expect(page.locator(".generator-config-v6")).toBeVisible();
  await expect(page.locator(".generator-order-v6")).toContainText("1 · Donjon");
  await expect(page.locator(".generator-order-v6")).toContainText("5 · Générer");

  await page.evaluate(() => { Math.random = () => 0.85; });
  await page.locator('[data-action="generate-session-encounter"]').click();
  await expect(page.locator(".session-encounter-v6.mode-normal")).toBeVisible();
  await expect(page.locator('.encounter-creature-v6[data-creature-id="whaou6-normal"]')).toHaveCount(1);
  await expect(page.locator('.encounter-creature-v6[data-creature-id="whaou6-normal"] .encounter-quantity-v6 b')).toHaveText("2");
  await expect(page.locator('.encounter-creature-v6[data-creature-id="whaou6-normal"] .encounter-creature-media>img:not(.encounter-creature-sigil)')).toHaveAttribute("src",/^blob:/);
  await expect(page.locator(".encounter-object-v6")).toContainText("WHAOU6 Tonneau à levier");
  await expect(page.locator(".encounter-object-actions-v6 b")).toHaveCount(3);
  await expect(page.locator(".generator-v6.has-result .generator-config-v6")).toBeVisible();

  const normalEliminate=page.locator('[data-action="session-eliminate-creature"][data-id="whaou6-normal"]');
  await normalEliminate.click();
  await expect.poll(async()=>page.locator('.encounter-creature-v6[data-creature-id="whaou6-normal"] .encounter-quantity-v6 b').innerText()).toBe("1");
  await expect(page.locator(".session-loot-row.has-loot")).toHaveCount(1);
  await expect(page.locator(".session-loot-row.has-loot")).toContainText("WHAOU6 Trophée");

  await page.locator('[data-action="session-eliminate-creature"][data-id="whaou6-normal"]').click();
  await expect(page.locator('.encounter-creature-v6[data-creature-id="whaou6-normal"]')).toHaveCount(0);
  await expect(page.locator(".encounter-complete-v6")).toBeVisible();
  await expect(page.locator(".session-encounter-v6.is-complete")).toBeVisible();
  await expect(page.locator(".session-loot-row")).toHaveCount(2);

  await page.locator('[data-action="session-set-floor"]').selectOption("1");
  await page.locator('[data-action="session-set-mode"][data-mode="mini_boss"]').click();
  await page.locator('[data-action="generate-session-encounter"]').click();
  await expect(page.locator(".session-encounter-v6.mode-mini_boss")).toBeVisible();
  await expect(page.locator('.encounter-creature-v6.mini_boss[data-creature-id="whaou6-mini"]')).toBeVisible();
  await expect(page.locator('.encounter-creature-v6[data-creature-id="whaou6-normal"]')).toBeVisible();

  await page.locator('[data-action="session-set-floor"]').selectOption("2");
  await page.locator('[data-action="session-set-mode"][data-mode="boss"]').click();
  await page.locator('[data-action="generate-session-encounter"]').click();
  await expect(page.locator(".session-encounter-v6.mode-boss")).toBeVisible();
  await expect(page.locator('.encounter-creature-v6.boss[data-creature-id="whaou6-boss"]')).toBeVisible();

  await page.setViewportSize({width:834,height:1112});
  await assertNoHorizontalOverflow(page);
  await expect(page.locator(".encounter-remaining-v6")).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await assertNoHorizontalOverflow(page);
  await expect(page.locator('.encounter-creature-v6.boss[data-creature-id="whaou6-boss"]')).toBeVisible();

  await page.setViewportSize({width:1440,height:900});
  await page.locator('[data-action="session-set-floor"]').selectOption("3");
  await page.locator('[data-action="session-set-mode"][data-mode="normal"]').click();
  await page.locator('[data-action="generate-session-encounter"]').click();
  await expect(page.locator(".session-encounter-v6")).toHaveCount(0);
  await expect(page.getByText("Impossible de composer une rencontre exacte", {exact:false})).toBeVisible();

  await page.locator('[data-action="session-set-dungeon"]').selectOption("whaou6-missing-budget");
  await expect(page.locator(".generator-budget-v6.missing")).toBeVisible();
  await expect(page.locator('[data-action="generate-session-encounter"]')).toBeDisabled();

  await page.locator('[data-action="session-end"]').click();
  await gotoView(page,"generator");
  await expect(page.locator(".session-start-card")).toBeVisible();

  const mediaDebug=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(mediaDebug.catalogScans).toBe(0);
});

test("Media WHAOU keeps active visuals lazy while comparison stays explicitly bounded", async ({ page }) => {
  await page.setViewportSize({width:834,height:1112});
  await ready(page);

  const seeded=await page.evaluate(async()=>{
    const raw=atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
    const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
    const original=new Blob([bytes],{type:"image/png"});
    const transparent=new Blob([bytes],{type:"image/png"});
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const readFirst=storeName=>new Promise((resolve,reject)=>{
      const tx=db.transaction(storeName,"readonly"),req=tx.objectStore(storeName).openCursor();
      req.onsuccess=()=>resolve(req.result?.value||null);req.onerror=()=>reject(req.error);
    });
    const npc=await readFirst("npcs"),dungeon=await readFirst("dungeons");
    if(!npc||!dungeon){db.close();throw new Error("Fixtures média absentes");}
    await new Promise((resolve,reject)=>{
      const tx=db.transaction("media_assets","readwrite"),store=tx.objectStore("media_assets");
      store.put({
        id:"whaou8-compare",label:"WHAOU8 Compare",file_name:"whaou8-compare.png",
        path:"local-media/gallery/whaou8-compare.png",mime_type:"image/png",entity_type:"gallery",entity_id:"",
        blob:original,transparent_blob:transparent,transparent_path:"local-media/gallery/transparent/whaou8-compare.png",
        transparent_review_status:"approved",transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
      });
      store.put({
        id:"whaou8-no-original",label:"WHAOU8 Sans Original",file_name:"whaou8-no-original.png",
        path:"local-media/gallery/whaou8-no-original.png",mime_type:"image/png",entity_type:"gallery",entity_id:"",
        transparent_blob:transparent,transparent_path:"local-media/gallery/transparent/whaou8-no-original.png",
        transparent_review_status:"approved",transparent_audit:{pass:true,has_alpha_channel:true,width:1,height:1}
      });
      store.put({
        id:"whaou8-dungeon",label:"WHAOU8 Donjon",file_name:"logo-192.png",
        path:"assets/images/logo-192.png",mime_type:"image/png",entity_type:"dungeons",entity_id:dungeon.id
      });
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
    return{npcId:npc.id,dungeonId:dungeon.id};
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>document.documentElement.dataset.gargottexReady==="true");
  let debug=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(debug.catalogScans).toBe(0);

  await gotoView(page,"media");
  const search=page.locator('[data-action="media-search"]');
  await search.fill("WHAOU8");
  await expect(page.locator(".media-card-v6")).toHaveCount(3);
  await expect(page.locator(".media-count-v6")).toContainText("3 média");

  await page.locator('[data-action="media-scope"][data-scope="orphan"]').click();
  await expect(page.locator(".media-card-v6.orphan")).toHaveCount(2);
  await page.locator('[data-action="media-scope"][data-scope="linked"]').click();
  await expect(page.locator('.media-card-v6[data-id="whaou8-dungeon"]')).toBeVisible();
  await page.locator('[data-action="media-scope"][data-scope="all"]').click();

  const compareCard=page.locator('.media-card-v6[data-id="whaou8-compare"]');
  await compareCard.click();
  await expect(page.locator(".media-detail-v6")).toContainText("WHAOU8 Compare");
  await expect(page.locator('.media-preview-switch-v6 [data-media-preview-mode="active"]')).toHaveAttribute("aria-pressed","true");
  await expect(page.locator('.media-preview-switch-v6 [data-media-preview-mode="original"]')).toBeEnabled();
  const activeSrc=await page.locator("[data-media-detail-preview] img").getAttribute("src");
  expect(activeSrc).toMatch(/^blob:/);

  const beforeCompare=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  await page.locator('[data-action="media-detail-preview"][data-media-preview-mode="original"]').click();
  await expect(page.locator('[data-media-detail-preview][data-preview-mode="original"]')).toBeVisible();
  const originalSrc=await page.locator("[data-media-detail-preview] img").getAttribute("src");
  expect(originalSrc).toMatch(/^blob:/);
  expect(originalSrc).not.toBe(activeSrc);
  const duringCompare=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(duringCompare.fullRecordReads).toBe(beforeCompare.fullRecordReads+1);
  expect(duringCompare.liveObjectUrls).toBe(beforeCompare.liveObjectUrls+1);
  expect(duringCompare.renderCalls).toBe(beforeCompare.renderCalls);
  expect(duringCompare.mediaPartialRenders).toBe(beforeCompare.mediaPartialRenders);

  await page.locator('[data-action="media-detail-preview"][data-media-preview-mode="original"]').click();
  const repeated=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(repeated.fullRecordReads).toBe(duringCompare.fullRecordReads);
  expect(repeated.liveObjectUrls).toBe(duringCompare.liveObjectUrls);

  await page.locator('[data-action="media-detail-preview"][data-media-preview-mode="active"]').click();
  await expect(page.locator('[data-media-detail-preview][data-preview-mode="active"]')).toBeVisible();
  await expect(page.locator("[data-media-detail-preview] img")).toHaveAttribute("src",activeSrc);
  const afterActive=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(afterActive.liveObjectUrls).toBe(beforeCompare.liveObjectUrls);
  expect(afterActive.renderCalls).toBe(beforeCompare.renderCalls);

  await page.locator('.media-card-v6[data-id="whaou8-no-original"]').click();
  await expect(page.locator('.media-preview-switch-v6 [data-media-preview-mode="original"]')).toBeDisabled();

  await page.locator('.media-card-v6[data-id="whaou8-dungeon"]').click();
  await expect(page.locator(".media-preview-note-v6")).toContainText("original du Donjon");
  await expect(page.locator(".media-preview-switch-v6")).toHaveCount(0);

  await page.locator('.media-card-v6[data-id="whaou8-compare"]').click();
  await page.locator('[data-action="media-link-type"]').selectOption("npcs");
  await page.locator('[data-action="media-link-entity"]').selectOption(seeded.npcId);
  await page.locator('[data-action="media-attach"]').click();
  await expect(page.locator(".media-detail-head-v6")).toContainText("PNJ");
  await expect(page.locator('.media-card-v6[data-id="whaou8-compare"]')).toHaveClass(/linked/);

  await gotoView(page,"codex");
  await page.locator('[data-action="set-codex-type"][data-type="media_assets"]').first().click();
  const codexSearch=page.locator('[data-action="family-search"][data-type="media_assets"]');
  await codexSearch.fill("WHAOU8 Compare");
  const codexCard=page.locator('.codex-media-card-v6.variant-transparent').filter({has:page.locator('[data-media-id="whaou8-compare"]')});
  await expect(codexCard).toBeVisible();
  await expect(codexCard.locator(".codex-media-active-mark")).toHaveText("Actif");
  const renderBeforeViewer=await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().renderCalls);
  await codexCard.locator(".codex-media-open-v6").click();
  await expect(page.locator(".image-viewer-overlay.viewer-transparent")).toBeVisible();
  await expect(page.locator(".image-viewer-stage img")).toHaveAttribute("src",/^blob:/);
  await page.locator(".image-viewer-close").click();
  await expect(page.locator(".image-viewer-overlay")).toHaveCount(0);
  expect(await page.evaluate(()=>globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().renderCalls)).toBe(renderBeforeViewer);

  await codexSearch.fill("WHAOU8 Donjon");
  const dungeonCard=page.locator('.codex-media-card-v6.variant-dungeon').filter({has:page.locator('[data-media-id="whaou8-dungeon"]')});
  await expect(dungeonCard).toBeVisible();
  await dungeonCard.locator(".codex-media-open-v6").click();
  await expect(page.locator(".image-viewer-overlay.viewer-dungeon")).toBeVisible();
  await page.locator(".image-viewer-overlay").click({position:{x:5,y:5}});
  await expect(page.locator(".image-viewer-overlay")).toHaveCount(0);

  await page.setViewportSize({width:390,height:844});
  await assertNoHorizontalOverflow(page);
});

test("Brouhaha WHAOU stages pressure without coupling level and draw, and Quest stays temporary", async ({ page }) => {
  await page.setViewportSize({width:834,height:1112});
  await ready(page);

  await page.evaluate(async () => {
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(["dungeons","brouhaha_effects","quests","npcs"],"readwrite");
      const dungeons=tx.objectStore("dungeons"),effects=tx.objectStore("brouhaha_effects"),quests=tx.objectStore("quests"),npcs=tx.objectStore("npcs");
      dungeons.put({
        id:"whaou7-dungeon",name:"WHAOU7 Taverne Sous Pression",slug:"whaou7-taverne-sous-pression",
        description:"Fixture Brouhaha.",floor_budgets:[4],base_floor_count:1,boss_name:"",tags:["whaou7"],image_path:""
      });
      npcs.put({id:"whaou7-npc",name:"WHAOU7 Berthold Bis",slug:"whaou7-berthold-bis",race:"Humain",role:"Commanditaire",tone:"Sec",lore:"Fixture",tags:["whaou7"],image_path:""});
      for(const level of [0,4,7,10,12]){
        effects.put({
          id:"whaou7-effect-"+level,level,dungeon_id:"whaou7-dungeon",dungeon_name:"WHAOU7 Taverne Sous Pression",
          effect_text:"WHAOU7 incident niveau "+level
        });
      }
      for(const index of [1,2]){
        quests.put({
          id:"whaou7-quest-"+index,name:"WHAOU7 Quête "+index,slug:"whaou7-quete-"+index,
          description:"Description temporaire "+index,objective:"Objectif WHAOU7 "+index,reward:"Récompense WHAOU7 "+index,
          difficulty:index,dungeon_id:"whaou7-dungeon",dungeon_name:"WHAOU7 Taverne Sous Pression",
          npc_id:"whaou7-npc",npc_name:"WHAOU7 Berthold Bis",tags:["whaou7"],image_path:""
        });
      }
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
  });

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"brouhaha");

  await page.locator('[data-action="session-start-dungeon"]').selectOption("whaou7-dungeon");
  await page.locator('[data-action="session-start"]').click();
  await expect(page.locator(".brouhaha-session-stage.calm")).toHaveAttribute("data-brouhaha-level","0");
  await expect(page.locator(".brouhaha-current-ticket")).toHaveCount(0);
  await expect(page.locator(".brouhaha-history-row")).toHaveCount(0);

  const plus=page.locator('[data-action="session-brouhaha-plus"]');
  const minus=page.locator('[data-action="session-brouhaha-minus"]');

  for(let i=0;i<4;i++) await plus.click();
  await expect(page.locator(".brouhaha-session-stage.rising")).toHaveAttribute("data-brouhaha-level","4");
  await expect(page.locator(".brouhaha-current-ticket")).toHaveCount(0);

  for(let i=0;i<3;i++) await plus.click();
  await expect(page.locator(".brouhaha-session-stage.hot")).toHaveAttribute("data-brouhaha-level","7");
  await expect(page.locator(".brouhaha-current-ticket")).toHaveCount(0);

  for(let i=0;i<3;i++) await plus.click();
  await expect(page.locator(".brouhaha-session-stage.critical")).toHaveAttribute("data-brouhaha-level","10");
  await expect(page.locator(".brouhaha-current-ticket")).toHaveCount(0);

  await page.locator('[data-action="session-brouhaha-draw"]').click();
  await expect(page.locator(".brouhaha-current-ticket")).toContainText("WHAOU7 incident niveau 10");
  await expect(page.locator(".brouhaha-current-ticket .brouhaha-ticket-level")).toHaveText("10");
  await expect(page.locator(".brouhaha-history-row.current")).toHaveCount(1);

  await plus.click();
  await expect(page.locator(".brouhaha-session-stage.critical")).toHaveAttribute("data-brouhaha-level","11");
  await expect(page.locator(".brouhaha-current-ticket")).toContainText("WHAOU7 incident niveau 10");

  await page.evaluate(() => {
    globalThis.__lot7Classes=[];
    const root=document.querySelector("#app");
    if(!root)return;
    const observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==="attributes"&&record.attributeName==="class"&&record.target instanceof HTMLElement&&record.target.matches(".brouhaha-session-stage")){
          globalThis.__lot7Classes.push(record.target.className);
        }
      }
    });
    observer.observe(root,{subtree:true,attributes:true,attributeFilter:["class"]});
    globalThis.__lot7Observer=observer;
  });
  await plus.click();
  await expect(page.locator(".brouhaha-session-stage.critical.level-12")).toHaveAttribute("data-brouhaha-level","12");
  await expect.poll(async()=>page.evaluate(()=>globalThis.__lot7Classes.some(value=>value.includes("level-12-impact")))).toBe(true);
  await expect(page.locator(".brouhaha-current-ticket")).toContainText("WHAOU7 incident niveau 10");

  await minus.click();
  await expect(page.locator(".brouhaha-session-stage.critical")).toHaveAttribute("data-brouhaha-level","11");
  await expect(page.locator(".brouhaha-session-stage.level-12")).toHaveCount(0);

  await minus.click();
  await expect(page.locator(".brouhaha-session-stage.critical")).toHaveAttribute("data-brouhaha-level","10");
  await page.locator('[data-action="session-brouhaha-draw"]').click();
  await expect(page.locator(".brouhaha-history-row")).toHaveCount(2);
  await expect(page.locator(".brouhaha-history-row.current")).toHaveCount(1);

  await page.locator('[data-action="session-brouhaha-reset"]').click();
  await expect(page.locator(".brouhaha-session-stage.calm")).toHaveAttribute("data-brouhaha-level","0");
  await expect(page.locator(".brouhaha-current-ticket")).toHaveCount(0);
  await expect(page.locator(".brouhaha-history-row")).toHaveCount(0);

  await gotoView(page,"home");
  await expect(page.locator(".home-session-object.noise.calm")).toBeVisible();

  await gotoView(page,"quests");
  await expect(page.locator(".session-quest-card.no-quest")).toBeVisible();
  await expect(page.locator(".session-quest-card")).toContainText("Aucune quête temporaire");

  await page.evaluate(() => { Math.random=()=>0; });
  await page.locator('[data-action="session-quest-reroll"]').click();
  await expect(page.locator(".session-quest-card.has-quest")).toBeVisible();
  const firstQuest=await page.locator(".session-quest-card h2").innerText();
  await expect(page.locator(".session-quest-objective")).toContainText("Objectif WHAOU7");
  await expect(page.locator(".session-quest-reward")).toContainText("Récompense WHAOU7");
  await expect(page.locator(".session-quest-meta")).toContainText("WHAOU7 Berthold Bis");

  await page.locator('[data-action="session-quest-reroll"]').click();
  await expect.poll(async()=>page.locator(".session-quest-card h2").innerText()).not.toBe(firstQuest);
  const secondQuest=await page.locator(".session-quest-card h2").innerText();

  await page.locator('[data-action="jump-codex"][data-type="quests"]').click();
  await expect(page.locator(".quest-sheet-v6")).toBeVisible();
  await expect(page.locator(".quest-sheet-v6")).toContainText(secondQuest);

  await page.setViewportSize({width:390,height:844});
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
  const dirtyBadges=page.locator("[data-workshop-status]");
  const badgeCount=await dirtyBadges.count();
  expect(badgeCount).toBeGreaterThanOrEqual(2);
  for(let i=0;i<badgeCount;i++){
    await expect(dirtyBadges.nth(i)).toHaveAttribute("data-state","dirty");
    await expect(dirtyBadges.nth(i)).toContainText("Modifications non enregistrées");
  }
  await form.locator("[data-workshop-save]").click();
  const savedBadges=page.locator("[data-workshop-status]");
  const savedCount=await savedBadges.count();
  expect(savedCount).toBeGreaterThanOrEqual(2);
  for(let i=0;i<savedCount;i++){
    await expect(savedBadges.nth(i)).toHaveAttribute("data-state","saved");
    await expect(savedBadges.nth(i)).toContainText("Enregistré localement");
  }

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
  await expect(page.locator(".import-family-band")).toBeVisible();
  await expect(page.locator(".import-preview-empty")).toContainText("Aucune écriture avant confirmation");
  await expect(page.locator(".export-level")).toHaveCount(3);
  await expect(page.locator(".backup-card-v6")).toContainText("Backup ZIP complet");

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
    buffer: Buffer.from(JSON.stringify([
      { name: "Créature V6Fast", dungeon_name: "" },
      { name: "", dungeon_name: "", category: "categorie-inconnue" }
    ]))
  });

  await expect(page.locator(".import-preview-v6")).toBeVisible();
  await expect(page.getByText("Aucune donnée métier écrite")).toBeVisible();
  const metrics=page.locator(".import-metrics-v6 .metric");
  await expect(metrics).toHaveCount(4);
  await expect(metrics.nth(0).locator("b")).toHaveText("2");
  await expect(metrics.nth(1).locator("b")).toHaveText("1");
  await expect(metrics.nth(2).locator("b")).toHaveText("2");
  await expect(metrics.nth(3).locator("b")).toHaveText("1");
  await expect(page.locator(".import-plan-row .warning").first()).toContainText("Warning");
  await expect(page.locator(".import-plan-row .warning")).toHaveCount(2);
  await expect(page.locator(".import-plan-row .error").first()).toContainText("Erreur bloquante");
  await expect(page.locator(".import-effect-plan")).toContainText("1 écriture(s) autorisée(s)");

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
  await expect(page.locator(".import-final-report")).toContainText("Import terminé");
  await expect(page.locator(".import-final-seal")).toHaveText("✓");
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



test("Map V2 navigates the hierarchy and preserves dungeon controls and destination navigation", async ({ page }) => {
  await ready(page);
  await gotoView(page, "map");
  await expect(page.locator("#map-page-title")).toHaveText("L’Entrevers");
  await expect(page.locator(".map-toponym")).toHaveCount(0);

  await expect(page.locator(".map-v2-frame.is-image-ready")).toHaveCount(1);
  await page.locator('[data-map-action="open"][data-map-id="ardera"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("Ardéra");
  await expect(page.locator(".map-hotspot-continent")).toHaveCount(7);

  await page.locator('[data-map-action="open"][data-map-id="valdorie"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("Valdorie");
  await expect(page.locator('img[src^="assets/sprites/"]')).toHaveCount(0);
  await expect(page.locator('.map-dungeon-dot')).toHaveCount(8);
  await expect(page.locator('.map-dungeon-label')).toHaveCount(9);
  await page.locator('[data-map-action=toggle-detail]').click();
  await page.locator('[data-map-action="toggle-dungeons"]').click();
  await expect(page.locator('[data-map-action="toggle-dungeons"]')).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".map-dungeon-pin").first()).toHaveCSS("display", "none");
  await page.locator('[data-map-action="toggle-dungeons"]').click();
  await expect(page.locator('img[src^="assets/sprites/"]')).toHaveCount(0);
  await page.locator('[data-map-action="toggle-toponyms"]').click();
  await expect(page.locator(".map-mj-label")).toHaveCount(0);
  await expect(page.locator('.map-dungeon-label').first()).toBeVisible();
  await page.locator('[data-map-action="toggle-toponyms"]').click();
  await expect(page.locator(".map-mj-label[data-mj-kind=place]").first()).toBeVisible();

  await page.locator('[data-map-action="back"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("Ardéra");
  await page.locator('[data-map-action="open"][data-map-id="pelagreve"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("Pélagrève");
  await page.locator('[data-map-action="open"][data-map-id="cite_sous_marine"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("Cité sous-marine de Pélagrève");
});

test("Map V2 offers both dimensions and groups the mobile entry with Brouhaha", async ({ page }) => {
  await ready(page);
  await gotoView(page, "map");
  await expect(page.locator(".map-v2-frame.is-image-ready")).toHaveCount(1);
  await page.locator('[data-map-action="open"][data-map-id="brasserie"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("La Brasserie Céleste");
  await expect(page.locator(".map-toponym")).toHaveCount(16);
  await expect(page.locator('[data-map-action="toggle-dungeons"]')).toHaveCount(0);
  await page.locator('[data-map-action="back"]').click();
  await expect(page.locator(".map-v2-frame.is-image-ready")).toHaveCount(1);
  await page.locator('[data-map-action="open"][data-map-id="enfer"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("L’Enfer de la Sobriété Éternelle");

  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const gameMenu = page.locator(".mobile-nav-group").filter({ hasText: "Jeu" });
  await gameMenu.locator("summary").click();
  await expect(gameMenu.locator('[data-action="set-view"][data-view="map"]')).toBeVisible();
  await expect(gameMenu.locator('[data-action="set-view"][data-view="brouhaha"]')).toBeVisible();
});


test("Map V2 caches only the active map and evicts the cache on exit", async ({ page }) => {
  await ready(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

  const cachedMapPaths = async () => page.evaluate(async () => {
    const cacheName = "map-v2-active-v1";
    if (!(await caches.keys()).includes(cacheName)) return [];
    const cache = await caches.open(cacheName);
    return (await cache.keys()).map(request => new URL(request.url).pathname);
  });

  await gotoView(page, "map");
  await expect(page.locator(".map-v2-frame.is-image-ready")).toHaveCount(1);
  await expect.poll(cachedMapPaths).toContainEqual(expect.stringContaining("Entrevers"));

  await page.locator('[data-map-action="open"][data-map-id="ardera"]').click();
  await expect(page.locator("#map-page-title")).toHaveText("Ardéra");
  await expect(page.locator(".map-v2-frame.is-image-ready")).toHaveCount(1);
  await expect.poll(cachedMapPaths).toContainEqual(expect.stringContaining("Ardera.webp"));
  await expect.poll(cachedMapPaths).not.toContainEqual(expect.stringContaining("Entrevers"));

  await gotoView(page, "home");
  await expect(page.locator(".map-v2-page")).toHaveCount(0);
  await expect.poll(cachedMapPaths).toEqual([]);
});

test("Map V2 artistic correction separates painted hit areas, labels and dungeon points", async ({ page }) => {
  await ready(page);
  await gotoView(page, "map");
  await expect(page.locator('.map-v2-frame.is-image-ready')).toHaveCount(1);
  await expect(page.locator('.map-v2-frame button, .map-v2-frame span')).toHaveCount(0);
  // The violet scene is decor, not a fourth dimension or a nearest-point fallback.
  const frame=await page.locator('.map-v2-frame').boundingBox();
  await page.mouse.click(frame.x+frame.width*.60,frame.y+frame.height*.27);
  await expect(page.locator('#map-page-title')).toHaveText('L’Entrevers');
  const brasserie=page.locator('.map-hotspot[data-map-id="brasserie"]');
  await brasserie.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#map-page-title')).toHaveText('La Brasserie Céleste');
  await page.locator('[data-map-action="back"]').click();
  await expect(page.locator('#map-page-title')).toHaveText('L’Entrevers');
  await page.locator('.map-hotspot[data-map-id="ardera"]').click();
  await expect(page.locator('#map-page-title')).toHaveText('Ardéra');
  await expect(page.locator('.map-v2-frame.is-image-ready')).toHaveCount(1);
  const world=await page.locator('.map-v2-frame').boundingBox();
  // Clicking the NW painted landmass must open Valdorie, not Austrébrume.
  await page.mouse.click(world.x+world.width*.30,world.y+world.height*.31);
  await expect(page.locator('#map-page-title')).toHaveText('Valdorie');
  // Owner's MJ reference: the hamlet, inn and stream are in the eastern sector,
  // not the central farming settlement. Check local label centres, not screen pixels.
  const recalage=await page.evaluate(async()=>{
    const {MAPS}=await import('./src/map-v2-data.js');
    const {DUNGEON_MARKERS}=await import('./src/map-v2-cartography.js');
    return {
      places:MAPS.valdorie.toponyms.filter(([name])=>['Saint-Fût-le-Petit','La Chope Qui Colle','Ruisseau des Saules'].includes(name)).map(([name,x,y])=>[name,x,y]),
      marker:DUNGEON_MARKERS.D01.anchor
    };
  });
  expect(recalage.places).toEqual([
    ['Saint-Fût-le-Petit',77,39],['La Chope Qui Colle',83,47],['Ruisseau des Saules',87,38]
  ]);
  expect(recalage.marker).toEqual([74.5,45.7]);
  await expect(page.locator('.map-v2-frame [data-placement-id="D06"]')).toHaveCount(0);
  await expect(page.locator('[data-placement-id="D05"] .map-dungeon-label')).toHaveCount(2);
  await expect(page.locator('.map-underground')).toHaveCount(0);
  await page.evaluate(()=>{ window.mapReviewImage=document.querySelector('.map-v2-image'); });
  await page.locator('[data-map-action="toggle-dungeons"]').click();
  await expect(page.locator('[data-placement-id="D05"]')).toBeHidden();
  await page.locator('[data-map-action="toggle-dungeons"]').click();
  await page.locator('[data-map-action="toggle-toponyms"]').click();
  await page.locator('[data-map-action="toggle-toponyms"]').click();
  expect(await page.evaluate(()=>window.mapReviewImage===document.querySelector('.map-v2-image'))).toBe(true);
  await page.locator('[data-map-action=toggle-detail]').click();
  const anchors=await page.evaluate(async()=>{
    const { DUNGEON_MARKERS }=await import('/src/map-v2-cartography.js');
    const frame=document.querySelector('.map-v2-frame').getBoundingClientRect();
    return [...document.querySelectorAll('.map-dungeon-pin')].map(pin=>{
      const p=DUNGEON_MARKERS[pin.dataset.placementId].anchor, r=pin.querySelector('.map-dungeon-dot').getBoundingClientRect();
      return Math.max(Math.abs(r.left+r.width/2-frame.left-frame.width*p[0]/100),Math.abs(r.top+r.height/2-frame.top-frame.height*p[1]/100));
    });
  });
  expect(Math.max(...anchors)).toBeLessThan(2);
  await page.locator('[data-map-action=toggle-detail]').click();
  const text=page.locator('.map-mj-label').first();
  await expect(text).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await expect(text).toHaveCSS('border-top-width','0px');
  await expect(text).toHaveCSS('font-weight','400');
  await expect(text).toHaveAttribute('data-mj-kind','region');
  await expect(text.locator('.map-mj-text')).toHaveCSS('font-weight','700');
});

test("Map V2 Valdorie reproduces approved parchment, water and organic sea labels", async ({page})=>{
  await ready(page);
  await page.evaluate(async()=>{
    const map=await import('./src/map-v2.js');map.openMap('valdorie');
    const main=document.querySelector('#main-content');main.innerHTML=map.renderMapView();map.bindMapViewActions(main);
    await document.fonts.load('23px "IM Fell English"');
  });
  const labels=page.locator('.map-mj-label');
  await expect(labels).toHaveCount(18);
  await expect(page.locator('[data-mj-kind=region]')).toHaveCount(6);
  await expect(page.locator('[data-mj-kind=river]')).toHaveCount(4);
  await expect(page.locator('[data-mj-kind=ocean]')).toHaveAttribute('aria-label','Mer des Trois Couronnes');
  await expect(page.locator('[data-mj-kind=ocean] .map-mj-ornament')).toHaveCount(2);
  await expect(page.locator('[data-mj-kind=region]').first().locator('.map-mj-text')).toHaveCSS('color','rgb(48, 22, 8)');
  await page.locator('[data-map-action=toggle-detail]').click();
  await expect(page.locator('[data-mj-kind=river]').first().locator('.map-mj-text')).toHaveCSS('color','rgb(255, 243, 214)');
  await page.locator('[data-map-action=toggle-detail]').click();
  await expect.poll(()=>labels.first().locator('.map-mj-text span').count()).toBeGreaterThan(0);
  const immutableImage=await page.locator('.map-v2-image').evaluate(img=>{window.mjImage=img;return img.src;});
  await page.locator('[data-map-action="toggle-toponyms"]').click();
  await expect(labels).toHaveCount(0);
  await page.locator('[data-map-action="toggle-toponyms"]').click();
  await expect(labels).toHaveCount(18);
  await page.locator('[data-map-action="toggle-dungeons"]').click();
  await expect(page.locator('.map-dungeon-pin').first()).toBeHidden();
  await expect(labels).toHaveCount(18);
  expect(await page.evaluate(()=>window.mjImage===document.querySelector('.map-v2-image'))).toBe(true);
  await expect(page.locator('.map-v2-image')).toHaveAttribute('src',immutableImage.replace(new URL(immutableImage).origin+'/',''));
  await page.locator('[data-map-action="back"]').click();
  await expect(page.locator('#map-page-title')).toHaveText('Ardéra');
  await expect(labels).toHaveCount(16);
  await expect(page.locator('[data-mj-kind=ocean]')).toHaveCount(9);
  await expect(page.locator('[data-mj-kind=region]')).toHaveCount(7);
  await expect(page.locator('.map-mj-probe')).toHaveCount(1);
});

test("Map V2 approved MJ lettering covers atlas, dimensions have places only, Entrevers stays empty", async ({page})=>{
  await ready(page);
  await page.setViewportSize({width:390,height:844});
  const results=await page.evaluate(async()=>{
    const {MAPS}=await import('./src/map-v2-data.js');
    const {DESTINATIONS}=await import('./src/map-v2-cartography.js');
    const m=await import('./src/map-v2.js'),main=document.querySelector('#main-content'),results=[];
    await document.fonts.load('23px "IM Fell English"');
    for(const [id,map] of Object.entries(MAPS)){
      m.openMap(id);main.innerHTML=m.renderMapView();m.bindMapViewActions(main);
      const labels=[...main.querySelectorAll('.map-mj-label')];
      const expectedVisible=map.type==='continent'?labels.filter(el=>['region','ocean'].includes(el.dataset.mjKind)).length:labels.length;
      results.push({id,expected:id==='entrevers'?0:map.toponyms.length+(DESTINATIONS[id]||[]).length,
        count:labels.length,expectedVisible,visible:labels.filter(el=>el.getClientRects().length).length,
        kinds:labels.map(el=>el.dataset.mjKind),names:labels.map(el=>el.dataset.mjText),
        catalogue:map.toponyms.map(([name])=>name),probe:main.querySelectorAll('.map-mj-probe').length});
    }
    return results;
  });
  for(const r of results){
    expect(r.count,r.id).toBe(r.expected);expect(r.visible,r.id).toBe(r.expectedVisible);
    expect(r.probe,r.id).toBe(r.expected?1:0);
    for(const name of r.catalogue)expect(r.names).toContain(name);
    if(['brasserie','enfer'].includes(r.id))expect(r.kinds).toEqual(Array(16).fill('place'));
    if(r.id==='entrevers')expect(r.names).toEqual([]);
  }
});

test("Map V2 integrates all 48 owner-approved places while preserving regions and display controls", async ({page})=>{
  const approved={"austrebrume":["Escale de Brumegarde","Lac de Sombreverre","Le Géant à la Petite Chope","Col de Veillebrume","Banquise du Retour Tardif","Halte du Banc Trop Court","Îlot de Nacregivre","Passe des Lanternes Éteintes"],"boreclat":["Port Cuivregivre","Hameau de Clairpin","Bains de la Buée Douce","Lac de Longueveille","Chutes du Fût Échappé","Col de Pierre-Sourde","Relais du Traîneau Sans Frein","Île des Trois Feux"],"ferrecime":["Pont du Pas-de-Panique","Foire de la Belle Étape","Lac d’Émeraude-Froide","Col des Veilleurs","Corniche du Héros Assis","Gué des Bottes Pleines","Coulées de Rougecendre","Îlot du Tonneau Couronné"],"pelagreve":["Port des Lanternes d’Écume","Fort de la Voile Noire","Crique du Dernier Toast","Phare de Jadebrume","Bassin de Perlebleue","Îlots des Sept Rubans","Passe du Capitaine Perdu","Dent de Cendrelune"],"sahaldune":["Ambrefleuve","Olvarane","Port de la Pluie Tiède","Pont des Comptes Ronds","Oasis de la Chope Miraculeuse","Défilé des Longues Ombres","Phare des Moussons","Chutes du Banquet Retardé"],"sylvaronde":["La Chope sous la Souche","Hameau de Liseronce","Gué du Tonneau Têtu","Jetée des Rameurs du Dimanche","Îlot de Brumefeuille","Clairière de la Belle Rencontre","Dent de Pierreveille","Col du Tonnerre Distrait"]};
  await ready(page);
  await page.setViewportSize({width:390,height:844});
  for(const [id,names] of Object.entries(approved)){
    await page.evaluate(async id=>{
      const m=await import('./src/map-v2.js');m.openMap(id);
      const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);
    },id);
    await expect(page.locator('[data-mj-kind=region]')).toHaveCount(6);
    await page.locator('[data-map-action=zoom-in]').click();
    for(const name of names){
      const label=page.getByRole('img',{name,exact:true});
      await expect(label).toBeVisible();
      await expect(label).not.toHaveAttribute('data-mj-kind','region');
    }
    const index=await page.locator('.map-name-index li').allTextContents();
    for(const name of names)expect(index).toContain(name);
    await page.locator('.map-v2-image').evaluate(img=>window.placesImage=img);
    await page.locator('[data-map-action=toggle-toponyms]').click();
    await expect(page.locator('.map-mj-label')).toHaveCount(0);
    await page.locator('[data-map-action=toggle-toponyms]').click();
    for(const name of names)await expect(page.getByRole('img',{name,exact:true})).toBeVisible();
    expect(await page.evaluate(()=>window.placesImage===document.querySelector('.map-v2-image'))).toBe(true);
  }
});

test("Map V2 uses named cartouches on every registered dungeon without fetching sprites", async ({page})=>{
  await ready(page);
  const spriteRequests=[];
  page.on('request',r=>{if(r.url().includes('/assets/sprites/'))spriteRequests.push(r.url());});
  const registry=await page.evaluate(async()=>{
    const {MAPS,DUNGEONS}=await import('./src/map-v2-data.js');
    const {DUNGEON_MARKERS}=await import('./src/map-v2-cartography.js');
    return {ids:Object.keys(MAPS),dungeons:DUNGEONS,markers:DUNGEON_MARKERS};
  });
  expect(Object.keys(registry.markers)).toHaveLength(13);
  expect(registry.markers.D05.anchor).toEqual(registry.markers.D06.anchor);
  expect(registry.markers.D12.anchor).toEqual([21.3,38.1]);
  expect(registry.markers.D14.anchor).toEqual([53.2,55.2]);
  expect(registry.markers.D15.anchor).toEqual([67.8,78.6]);
  for(const id of registry.ids){
    await page.evaluate(async id=>{const m=await import('./src/map-v2.js');m.openMap(id);const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);},id);
    const list=registry.dungeons[id]||[];
    if(list.length)await page.locator('[data-map-action=toggle-detail]').click();
    await expect(page.locator('.map-dungeon-label')).toHaveCount(list.length);
    await expect(page.locator('img[src*="/sprites/"]')).toHaveCount(0);
    for(const [d,name] of list){
      const label=page.locator('[data-dungeon-id="'+d+'"]');
      await expect(label).toHaveText(name);
      await expect(label).toHaveAttribute('aria-label',name);
      await expect(label).toBeVisible();
      await label.click();
      await expect(page.getByRole('dialog').getByRole('heading')).toHaveText(name);
      await page.getByRole('dialog').getByRole('button',{name:'Fermer la fenêtre du donjon'}).click();
    }
    if(list.length){
      const colors=await page.locator('.map-dungeon-pin').evaluateAll(pins=>pins.map(p=>p.style.getPropertyValue('--dungeon-accent')));
      if(list.length>2)expect(new Set(colors).size).toBeGreaterThan(2);
      await page.locator('[data-map-action=toggle-dungeons]').click();
      await expect(page.locator('.map-dungeon-pin').first()).toBeHidden();
      await page.locator('[data-map-action=toggle-dungeons]').click();
      expect(await page.locator('.map-dungeon-pin').evaluateAll(pins=>pins.map(p=>p.style.getPropertyValue('--dungeon-accent')))).toEqual(colors);
    }
  }
  expect(spriteRequests).toEqual([]);
});

test("Map V2 continental progressive zoom preserves image and scales all lettering by 25 percent", async ({page,browserName})=>{
  await ready(page);await page.setViewportSize({width:834,height:1112});
  const ids=['valdorie','ferrecime','sylvaronde','pelagreve','boreclat','sahaldune','austrebrume'];
  for(const id of ids){
    await page.evaluate(async id=>{const m=await import('./src/map-v2.js');m.openMap(id);const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);},id);
    await expect(page.locator('.map-zoom-range')).toHaveValue('100');
    await expect(page.locator('.map-status-note')).toBeHidden();
    await page.locator('.map-v2-image').evaluate(async img=>{await img.decode();window.zoomImage=img;});
    const oldWidth=await page.locator('.map-v2-frame').evaluate(e=>e.clientWidth);
    await page.getByRole('button',{name:'Augmenter le zoom',exact:true}).click();
    await expect(page.locator('.map-zoom-range')).toHaveValue('125');
    expect(await page.locator('.map-v2-frame').evaluate(e=>e.clientWidth)).toBeGreaterThan(oldWidth);
    await page.locator('.map-zoom-range').evaluate(e=>{e.value='400';e.dispatchEvent(new Event('input',{bubbles:true}));});
    await expect(page.getByRole('button',{name:'Augmenter le zoom',exact:true})).toBeDisabled();
    await page.locator('[data-map-action=toggle-detail]').click();
    await expect(page.locator('.map-zoom-range')).toHaveValue('100');
    expect(await page.evaluate(()=>window.zoomImage===document.querySelector('.map-v2-image'))).toBe(true);
    await assertNoHorizontalOverflow(page);
  }
  // Compare against the prior responsive formula at the SAME map width.
  await page.evaluate(async()=>{const m=await import('./src/map-v2.js');m.openMap('valdorie');const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);await document.fonts.ready;});
  await page.locator('[data-map-action=zoom-in]').click();
  const fonts=await page.evaluate(async()=>{
    const {MAP_TEXT_SCALE}=await import('./src/map-v2-toponyms.js');const w=document.querySelector('.map-v2-frame').clientWidth;
    return {scale:MAP_TEXT_SCALE,place:Number(document.querySelector('[data-mj-text="Brassefort"]').dataset.fontSize),expectedPlace:.75*Math.min(23,w*.0136),dungeon:parseFloat(getComputedStyle(document.querySelector('.map-dungeon-label')).fontSize),expectedDungeon:.75*Math.max(4.5,Math.min(16,document.querySelector('.map-v2-frame').getBoundingClientRect().width*.0155))};
  });
  expect(fonts.scale).toBe(.75);expect(fonts.place).toBeCloseTo(fonts.expectedPlace,1);expect(fonts.dungeon).toBeCloseTo(fonts.expectedDungeon,2);
  if(browserName==='chromium'){
    const cdp=await page.context().newCDPSession(page),r=await page.locator('.map-v2-viewport').boundingBox();
    const x=r.x+r.width/2,y=r.y+Math.min(100,r.height/2);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-30,y,id:1},{x:x+30,y,id:2}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-60,y,id:1},{x:x+60,y,id:2}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    expect(Number(await page.locator('.map-zoom-range').inputValue())).toBeGreaterThan(100);
    await cdp.detach();
  }
});

test("Map V2 detail reading is bounded and does not reload map assets on mobile @webkit", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await ready(page); await gotoView(page,'map');
  await expect(page.locator('.map-v2-frame.is-image-ready')).toHaveCount(1);
  await page.locator('.map-hotspot[data-map-id="ardera"]').click();
  await page.locator('.map-hotspot[data-map-id="valdorie"]').click();
  await expect(page.locator('#map-page-title')).toHaveText('Valdorie');
  await expect(page.locator('.map-v2-frame.is-image-ready')).toHaveCount(1);
  await page.locator('.map-v2-page img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  const requests=[];
  page.on('request',request=>{if(/assets\/(maps|sprites)\//.test(request.url())) requests.push(request.url());});
  await page.locator('[data-map-action="toggle-detail"]').click();
  await expect(page.locator('.map-v2-page')).toHaveClass(/is-detail-view/);
  await expect(page.locator('.map-toponym-secondary').first()).toBeVisible();
  await assertNoHorizontalOverflow(page);
  const dimensions=await page.locator('.map-v2-frame').boundingBox();
  expect(dimensions.width).toBeGreaterThan(850);
  await page.locator('[data-map-action="toggle-detail"]').click();
  // Regions/seas appear at 100%; places/inland waters/dungeons require detail.
  for(const width of [320,390,834]){
    await page.setViewportSize({width,height:844});
    await page.locator('[data-map-action=zoom-in]').click();
    for(const name of ['Arbres-Colosses','Saint-Fût-le-Petit','La Chope Qui Colle','L’Avelorne','La Rivombre','Ruisseau des Saules','Lac d’Ysambre','Collines de la Vieille Lande','Monts d’Escarbelle','Brassefort','Port-Rivombre']){
      await expect(page.getByRole('img',{name,exact:true})).toBeVisible();
    }
    await expect(page.locator('[data-mj-kind=region]')).toHaveCount(6);
    await expect(page.locator('.map-dungeon-label').first()).toBeVisible();
    await page.locator('[data-map-action=toggle-detail]').click();
    await expect(page.locator('[data-mj-kind=region]').first()).toBeVisible();
    await expect(page.locator('[data-mj-kind=ocean]')).toBeVisible();
    await expect(page.locator('.map-dungeon-label').first()).toBeHidden();
  }
  await assertNoHorizontalOverflow(page);
  expect(requests).toEqual([]);
  await page.locator('.map-name-index summary').click();
  await expect(page.locator('.map-name-index')).toContainText('La Chope Qui Colle');
});



test("Map V2 zoom switches continental layers exactly and keeps independent display preferences", async ({page})=>{
  await ready(page);
  for(const id of ['valdorie','ferrecime','sylvaronde','pelagreve','boreclat','sahaldune','austrebrume']){
    await page.evaluate(async id=>{const m=await import('./src/map-v2.js');m.openMap(id);const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);},id);
    const state=()=>page.evaluate(()=>[...document.querySelectorAll('.map-mj-label')].map(el=>({kind:el.dataset.mjKind,visible:!!el.getClientRects().length})));
    for(const zoom of [100,101,125,400,100]){
      await page.locator('.map-zoom-range').evaluate((e,value)=>{e.value=String(value);e.dispatchEvent(new Event('input',{bubbles:true}));},zoom);
      await expect(page.locator('.map-zoom-value')).toHaveText(zoom+' %');
      for(const label of await state())expect(label.visible,id+'/'+zoom+'/'+label.kind).toBe(zoom===100?['region','ocean'].includes(label.kind):['place','river'].includes(label.kind));
      for(const pin of await page.locator('.map-dungeon-pin').all()){
        if(zoom===100)await expect(pin).toBeHidden();else await expect(pin).toBeVisible();
      }
    }
  }
  await page.evaluate(async()=>{const m=await import('./src/map-v2.js');m.openMap('valdorie');const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);});
  await page.locator('[data-map-action=toggle-dungeons]').click();
  await page.locator('[data-map-action=zoom-in]').click();
  await expect(page.locator('.map-dungeon-label').first()).toBeHidden();
  await page.locator('[data-map-action=toggle-detail]').click();
  await page.locator('[data-map-action=toggle-detail]').click();
  await expect(page.locator('[data-map-action=toggle-dungeons]')).toHaveAttribute('aria-pressed','false');
  await page.locator('[data-map-action=toggle-dungeons]').click();
  await expect(page.locator('.map-dungeon-label').first()).toBeVisible();
  await page.locator('[data-map-action=toggle-toponyms]').click();
  await page.locator('[data-map-action=toggle-detail]').click();
  await page.locator('[data-map-action=toggle-detail]').click();
  await expect(page.locator('.map-mj-label')).toHaveCount(0);
  await expect(page.locator('.map-dungeon-label').first()).toBeVisible();
});

test("Map V2 compact dungeon paper keeps unchanged type, complete names and separate touch targets @webkit", async ({page})=>{
  await ready(page);
  for(const width of [390,834,1440]){
    await page.setViewportSize({width,height:1112});
    for(const id of ['valdorie','ferrecime','sylvaronde']){
      await page.evaluate(async id=>{const m=await import('./src/map-v2.js');m.openMap(id);const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);},id);
      await page.locator('[data-map-action=zoom-in]').click();
      await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
      const metrics=await page.evaluate(()=>{
        const w=document.querySelector('.map-v2-frame').getBoundingClientRect().width;
        const labels=[...document.querySelectorAll('.map-dungeon-label')].map(el=>{
          const css=getComputedStyle(el),hit=getComputedStyle(el,'::after'),r=el.getBoundingClientRect();
          const extra=parseFloat(css.paddingTop)+parseFloat(css.paddingBottom)+parseFloat(css.borderTopWidth)+parseFloat(css.borderBottomWidth);
          const hw=Math.max(44,r.width),hh=Math.max(44,r.height);
          return {font:parseFloat(css.fontSize),expected:.75*Math.max(4.5,Math.min(16,w*.0155)),height:r.height,maxHeight:2*parseFloat(css.lineHeight)+extra+1,minHeight:css.minHeight,hitWidth:parseFloat(hit.width),hitHeight:parseFloat(hit.height),text:el.textContent,name:el.getAttribute('aria-label'),rect:{x:r.x+(r.width-hw)/2,y:r.y+(r.height-hh)/2,w:hw,h:hh}};
        });
        const overlaps=[];
        for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
          const a=labels[i].rect,b=labels[j].rect;
          if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)overlaps.push([labels[i].name,labels[j].name]);
        }
        return {labels,overlaps};
      });
      expect(metrics.overlaps,id+'/'+width).toEqual([]);
      for(const label of metrics.labels){
        expect(label.font).toBeCloseTo(label.expected,2);expect(label.minHeight).toBe('0px');
        expect(label.height,label.name).toBeLessThanOrEqual(label.maxHeight);
        expect(label.hitWidth).toBeGreaterThanOrEqual(44);expect(label.hitHeight).toBeGreaterThanOrEqual(44);
        expect(label.text).toBe(label.name);
      }
      const trigger=page.locator('.map-dungeon-label').first();await trigger.scrollIntoViewIfNeeded();
      const r=await trigger.boundingBox(),x=r.x+r.width/2,y=r.y-2;
      expect(await page.evaluate(({x,y})=>!!document.elementFromPoint(x,y)?.closest('.map-dungeon-label'),{x,y})).toBe(true);
      await page.mouse.click(x,y);await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('dialog').getByRole('button',{name:'Fermer la fenêtre du donjon'}).click();
    }
  }
});

test("Map V2 dungeon dialogs preserve map, zoom, cache and focus, including shared anchors @webkit", async ({page})=>{
  await ready(page);await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.reload();await page.waitForFunction(()=>document.documentElement.dataset.gargottexReady==='true'&&!!navigator.serviceWorker.controller);
  await gotoView(page,'map');
  await page.evaluate(async()=>{const m=await import('./src/map-v2.js');m.openMap('valdorie');const main=document.querySelector('#main-content');main.innerHTML=m.renderMapView();m.bindMapViewActions(main);});
  await page.locator('.map-v2-image').evaluate(img=>img.decode());
  await expect.poll(()=>page.evaluate(async()=>{const c=await caches.open('map-v2-active-v1');return (await c.keys()).length;})).toBeGreaterThan(0);
  await page.locator('[data-map-action=zoom-in]').click();
  await page.evaluate(()=>{window.dialogImage=document.querySelector('.map-v2-image');});
  const cached=()=>page.evaluate(async()=>{const c=await caches.open('map-v2-active-v1');return (await c.keys()).map(r=>r.url).sort();});
  const cacheBefore=await cached();const requests=[];
  page.on('request',r=>{if(r.url().includes('/assets/maps/'))requests.push(r.url());});
  for(const [id,close] of [['D01','button'],['D05','escape'],['D06','backdrop']]){
    const trigger=page.locator('.map-dungeon-label[data-dungeon-id="'+id+'"]');
    await trigger.scrollIntoViewIfNeeded();
    const before=await page.locator('.map-v2-viewport').evaluate(el=>({left:el.scrollLeft,top:el.scrollTop}));
    const name=await trigger.textContent();
    if(close==='button')await trigger.click();else{await trigger.focus();await page.keyboard.press('Enter');}
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();await expect(dialog).toHaveAttribute('data-dungeon-id',id);
    await expect(dialog.getByRole('heading')).toHaveText(name);
    await page.keyboard.press('Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
    if(close==='button')await dialog.getByRole('button',{name:'Fermer la fenêtre du donjon'}).click();
    else if(close==='escape')await page.keyboard.press('Escape');
    else await page.mouse.click(2,2);
    await expect(dialog).toBeHidden();await expect(trigger).toBeFocused();
    expect(await page.locator('.map-v2-viewport').evaluate(el=>({left:el.scrollLeft,top:el.scrollTop}))).toEqual(before);
    await expect(page.locator('.map-zoom-range')).toHaveValue('125');
    expect(await page.evaluate(()=>window.dialogImage===document.querySelector('.map-v2-image'))).toBe(true);
    expect(await cached()).toEqual(cacheBefore);
  }
  expect(requests).toEqual([]);
  // A pan starting on a cartouche must not open a modal.
  const trigger=page.locator('.map-dungeon-label[data-dungeon-id=D01]');await trigger.scrollIntoViewIfNeeded();
  const r=await trigger.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(r.x+r.width/2-40,r.y+r.height/2,{steps:5});await page.mouse.up();
  await expect(page.getByRole('dialog')).toBeHidden();
  await gotoView(page,'home');
  await expect.poll(cached).toEqual([]);
});
