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

test("extended responsive matrix covers phone iPad and desktop", async ({ page }) => {
  const representativeViewports = [
    ["phone-320", 320, 720],
    ["phone-390", 390, 844],
    ["tablet-portrait-834", 834, 1112],
    ["tablet-landscape-1194", 1194, 834],
    ["desktop-1440", 1440, 900],
    ["desktop-wide-1920", 1920, 1080]
  ];

  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  for (const [name, width, height] of representativeViewports) {
    await test.step(name, async () => {
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
      const firstCreature = page.locator('[data-action="select-codex"][data-type="creatures"]').first();
      await expect(firstCreature).toBeVisible();
      await firstCreature.click();
      await expect(page.locator(".creature-sheet-v6")).toBeVisible();
      await assertNoHorizontalOverflow(page);

      if (width < 1200) {
        await expect(page.locator(".bestiary-master-rail")).toBeHidden();
        await expect(page.locator(".creature-detail-back")).toBeVisible();
      }
      if (width >= 1480) {
        await expect(page.locator(".bestiary-master-rail")).toBeVisible();
        await expect(page.locator(".creature-detail-back")).toBeHidden();
      }
    });
  }
});

test("Atelier tablet portrait and landscape rules remain valid", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await ready(page);
  await gotoView(page, "atelier");
  await expect(page.locator(".workshop-list-pane")).toBeVisible();
  await expect(page.locator(".workshop-editor-pane")).toBeHidden();
  await page.locator('[data-action="select-workshop"]').first().click();
  await expect(page.locator(".workshop-list-pane")).toBeHidden();
  await expect(page.locator(".workshop-editor-pane")).toBeVisible();

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".workshop-list-pane")).toBeVisible();
  await expect(page.locator(".workshop-editor-pane")).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test("extended axe coverage checks detail Atelier and Import", async ({ page }) => {
  await ready(page);
  await gotoView(page, "codex");
  await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
  await runAxe(page, "Fiche Créature");
  await gotoView(page, "atelier");
  await runAxe(page, "Atelier");
  await gotoView(page, "import");
  await runAxe(page, "Import/Export");
});

test("reduced motion keeps interactions usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);

  await gotoView(page, "codex");
  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();
  await page.locator('[data-action="select-family-codex"][data-type="dungeons"]').first().click();
  await expect(page.locator(".dungeon-sheet-v6")).toBeVisible();
  await expect(page.locator(".gargotte-cinematic.show")).toHaveCount(0);

  await page.locator('[data-action="set-codex-type"][data-type="creatures"]').first().click();
  await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
  await expect(page.locator(".creature-sheet-v6")).toBeVisible();

  await gotoView(page, "brouhaha");
  const timings = await page.locator("body").evaluate(() => {
    const parse = value => value.split(",").map(part => {
      const text = part.trim();
      return text.endsWith("ms") ? parseFloat(text) : parseFloat(text) * 1000;
    }).filter(Number.isFinite);
    return Array.from(document.querySelectorAll("body *")).filter(el => {
      const style = getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    }).flatMap(el => {
      const style = getComputedStyle(el);
      return [...parse(style.animationDuration), ...parse(style.transitionDuration)];
    });
  });
  expect(Math.max(0, ...timings)).toBeLessThanOrEqual(20);
});

test("large structured datasets long text and missing relations remain usable", async ({ page }) => {
  await ready(page);
  const start = Date.now();
  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const stores = ["dungeons", "creatures", "heroes", "quests", "media_assets"];
    const tx = db.transaction(stores, "readwrite");
    const dungeons = tx.objectStore("dungeons");
    const creatures = tx.objectStore("creatures");
    const heroes = tx.objectStore("heroes");
    const quests = tx.objectStore("quests");
    const media = tx.objectStore("media_assets");

    for (let i = 0; i < 50; i++) {
      dungeons.put({ id: "ui6-d-" + i, name: "Donjon volume " + i, slug: "d-" + i, floor_budgets: [3,5,7,9,11], tags: [] });
    }
    for (let i = 0; i < 420; i++) {
      creatures.put({
        id: "ui6-c-" + i,
        name: i === 0 ? "Créature au nom volontairement gigantesque pour éprouver le reflow sans provoquer de débordement horizontal" : "Créature volume " + i,
        slug: "c-" + i,
        dungeon_id: i === 1 ? "missing-relation" : "ui6-d-" + (i % 50),
        dungeon_name: i === 1 ? "Donjon manquant" : "Donjon volume " + (i % 50),
        category: ["basique","tactique","speciale","brute","mini_boss","boss"][i % 6],
        menace: (i % 6) + 1,
        pv: 3 + (i % 20), atk: 1 + (i % 6), def: i % 5, zone: 1, actions: 2,
        lore: i === 0 ? "Très long lore ".repeat(500) : "",
        tags: ["volume", "tag-" + (i % 10)],
        image_path: ""
      });
    }
    for (let h = 0; h < 60; h++) {
      for (let level = 1; level <= 4; level++) {
        heroes.put({ id: `ui6-h-${h}-${level}`, hero_base_name: "Héros volume " + h, level, name: `Héros volume ${h} N${level}`, role: "Test", pv: 5 + level, atk: level, def: level, zone: 1, actions: 3, ability_text: "Compétence " + level, tags: [] });
      }
    }
    for (let i = 0; i < 180; i++) {
      quests.put({ id: "ui6-q-" + i, name: "Quête volume " + i, slug: "q-" + i, dungeon_id: "ui6-d-" + (i % 50), dungeon_name: "Donjon volume " + (i % 50), objective: "Objectif " + i, reward: "Récompense", difficulty: (i % 6) + 1, tags: [] });
    }
    for (let i = 0; i < 160; i++) {
      media.put({ id: "ui6-m-" + i, label: "Média volume " + i, file_name: "m-" + i + ".png", path: "", mime_type: "image/png", entity_type: i % 2 ? "creatures" : "gallery", entity_id: i % 2 ? "ui6-c-" + i : "" });
    }
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  const loadMs = Date.now() - start;
  expect(loadMs).toBeLessThan(15_000);

  await gotoView(page, "codex");
  await expect(page.locator(".bestiary-counter strong")).toHaveText(/4\d\d|5\d\d/);
  const search = page.locator('[data-action="bestiary-search"]');
  const t0 = Date.now();
  await search.fill("gigantesque");
  await expect(page.locator(".bestiary-result-label")).toContainText("1 résultat");
  expect(Date.now() - t0).toBeLessThan(2_000);
  await assertNoHorizontalOverflow(page);

  await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
  await assertNoHorizontalOverflow(page);
  await expect(page.locator(".creature-sheet-v6")).toBeVisible();
});

test("large transparent Blob library keeps DOM URLs and viewer renders bounded", async ({ page }) => {
  await ready(page);
  const created = await page.evaluate(async count => {
    const db = await new Promise((resolve,reject) => {
      const req=indexedDB.open("gargottex-v5-offline");
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });

    const canvas=document.createElement("canvas");
    canvas.width=768;
    canvas.height=768;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,768,768);
    ctx.fillStyle="rgba(132, 82, 214, 0.84)";
    ctx.beginPath();
    ctx.arc(384,384,244,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.38)";
    ctx.fillRect(246,246,276,276);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("PNG blob failed")),"image/png"));

    await new Promise((resolve,reject)=>{
      const tx=db.transaction("media_assets","readwrite");
      const store=tx.objectStore("media_assets");
      for (let i=0;i<count;i++) {
        store.put({
          id:`v6fast-bounded-media-${String(i).padStart(3,"0")}`,
          label:`Bounded transparent ${String(i).padStart(3,"0")}`,
          file_name:`bounded-transparent-${i}.png`,
          path:`local-media/gallery/bounded-${i}.png`,
          mime_type:"image/png",
          entity_type:"gallery",
          entity_id:"",
          transparent_blob:blob,
          transparent_path:`local-media/gallery/transparent/bounded-${i}.png`,
          transparent_mime_type:"image/png",
          transparent_width:768,
          transparent_height:768,
          transparent_review_status:"approved",
          transparent_audit:{pass:true,has_alpha_channel:true,width:768,height:768},
          created_at:new Date().toISOString(),
          updated_at:new Date().toISOString()
        });
      }
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
    db.close();
    return {count,blobSize:blob.size};
  }, 420);

  expect(created.count).toBe(420);
  expect(created.blobSize).toBeGreaterThan(0);

  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"codex");
  await page.locator('[data-action="set-codex-type"][data-type="media_assets"]').first().click();

  const cards=page.locator(".codex-media-card-v6");
  await expect(cards).toHaveCount(48);
  await expect(page.locator(".media-pager-v6")).toContainText("sur");
  let snapshot=await page.evaluate(() => globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
  expect(snapshot.mountedMediaCards).toBeLessThanOrEqual(48);
  expect(snapshot.liveObjectUrls).toBeLessThanOrEqual(48);

  for (let pageIndex=1;pageIndex<=5;pageIndex++) {
    await cards.last().scrollIntoViewIfNeeded();
    await page.locator('[data-action="media-codex-page"]').filter({hasText:"Suivant"}).click();
    await expect(page.locator(".codex-media-card-v6")).toHaveCount(48);
    snapshot=await page.evaluate(() => globalThis.__GARGOTTEX_MEDIA_DEBUG__?.());
    expect(snapshot.mountedMediaCards).toBeLessThanOrEqual(48);
    expect(snapshot.liveObjectUrls).toBeLessThanOrEqual(48);
  }

  await page.locator(".codex-media-card-v6").first().scrollIntoViewIfNeeded();
  const before=await page.evaluate(() => {
    globalThis.__v6fastMediaGridNode=document.querySelector(".codex-media-grid-v6");
    return {
      renderCalls:globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().renderCalls,
      partial:globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().mediaPartialRenders
    };
  });

  for (let i=0;i<12;i++) {
    const card=page.locator(".codex-media-card-v6").nth(i % 12);
    await card.scrollIntoViewIfNeeded();
    const scrollBeforeViewer=await page.evaluate(() => window.scrollY);
    await card.locator(".codex-media-open-v6").click();
    await expect(page.locator(".image-viewer-overlay")).toBeVisible();
    await expect(page.locator(".image-viewer-panel img")).toHaveAttribute("src", /^blob:/);
    await page.locator(".image-viewer-close").click();
    await expect(page.locator(".image-viewer-overlay")).toHaveCount(0);
    const scrollAfterViewer=await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfterViewer-scrollBeforeViewer)).toBeLessThanOrEqual(2);
  }

  const after=await page.evaluate(() => ({
    sameGrid:globalThis.__v6fastMediaGridNode===document.querySelector(".codex-media-grid-v6"),
    renderCalls:globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().renderCalls,
    partial:globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().mediaPartialRenders,
    mounted:globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().mountedMediaCards,
    live:globalThis.__GARGOTTEX_MEDIA_DEBUG__?.().liveObjectUrls
  }));

  expect(after.sameGrid).toBe(true);
  expect(after.renderCalls).toBe(before.renderCalls);
  expect(after.partial).toBe(before.partial);
  expect(after.mounted).toBeLessThanOrEqual(48);
  expect(after.live).toBeLessThanOrEqual(48);
  await assertNoHorizontalOverflow(page);
});

test("log reads stay truly limited and newest-first", async ({ page }) => {
  await ready(page);
  const result=await page.evaluate(async () => {
    const idb=await import("./src/storage/idb.js");
    for(let i=0;i<40;i++){
      await idb.appendLog({
        id:`v6fast-log-${String(i).padStart(2,"0")}`,
        level:i%3===0?"error":"info",
        message:`Log ${i}`,
        created_at:new Date(Date.UTC(2026,8,25,6,0,i)).toISOString()
      });
    }
    const rows=await idb.getLogs(7);
    return rows.map(row=>({id:row.id,message:row.message,created_at:row.created_at}));
  });

  expect(result).toHaveLength(7);
  expect(result.map(row=>row.message)).toEqual(["Log 39","Log 38","Log 37","Log 36","Log 35","Log 34","Log 33"]);
  expect(result.every((row,index,array)=>index===0 || array[index-1].created_at >= row.created_at)).toBe(true);
});

test("Service Worker update preserves local data and core cache", async ({ page }) => {
  await ready(page);
  const controlled = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) return false;
    await reg.update();
    return true;
  });
  if (!controlled) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".v6-app")).toBeVisible();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 10_000 });
  }

  const before = await page.evaluate(async () => {
    const db = await new Promise((resolve,reject) => { const req=indexedDB.open("gargottex-v5-offline"); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    const names=["dungeons","creatures","heroes","npcs","quests","loot_items","interactables","brouhaha_effects","media_assets"];
    const tx=db.transaction(names,"readonly");
    const counts={};
    for (const name of names) counts[name]=await new Promise((resolve,reject)=>{ const req=tx.objectStore(name).count(); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    db.close();
    return counts;
  });

  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    const cacheName = names.find(name => name.startsWith("gargottex-v6-"));
    if (!cacheName) return { cacheName: null, missing: ["cache"] };
    const cache = await caches.open(cacheName);
    const core = ["./index.html","./styles.css","./manifest.webmanifest","./src/app.js","./src/storage/idb.js","./assets/fonts/Inter-Variable.ttf","./assets/fonts/Alegreya-Variable.ttf"];
    const missing=[];
    for (const path of core) if (!(await cache.match(path,{ignoreSearch:true}))) missing.push(path);
    return { cacheName, missing };
  });
  expect(cacheState.cacheName).toMatch(/^gargottex-v6-/);
  expect(cacheState.missing).toEqual([]);

  await gotoView(page, "import");
  await page.locator('[data-action="pwa-update"]').click();
  await expect(page.locator(".toast-stack")).toContainText("Service Worker");

  const after = await page.evaluate(async () => {
    const db = await new Promise((resolve,reject) => { const req=indexedDB.open("gargottex-v5-offline"); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    const names=["dungeons","creatures","heroes","npcs","quests","loot_items","interactables","brouhaha_effects","media_assets"];
    const tx=db.transaction(names,"readonly");
    const counts={};
    for (const name of names) counts[name]=await new Promise((resolve,reject)=>{ const req=tx.objectStore(name).count(); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    db.close();
    return counts;
  });
  expect(after).toEqual(before);
});

test("iPad WebKit media fullscreen smoke @webkit", async ({ page }) => {
  await ready(page);
  await page.evaluate(async () => {
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open("gargottex-v5-offline");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
    const dungeon=await new Promise((resolve,reject)=>{
      const tx=db.transaction("dungeons","readonly"),req=tx.objectStore("dungeons").openCursor();
      req.onsuccess=()=>resolve(req.result?.value||null);req.onerror=()=>reject(req.error);
    });
    if(!dungeon){db.close();throw new Error("Donjon fixture absent");}
    await new Promise((resolve,reject)=>{
      const tx=db.transaction("media_assets","readwrite");
      tx.objectStore("media_assets").put({
        id:"v6fast-webkit-dungeon",
        label:"WebKit dungeon",
        file_name:"logo-192.png",
        path:"assets/images/logo-192.png",
        entity_type:"dungeons",
        entity_id:dungeon.id,
        mime_type:"image/png"
      });
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
    db.close();
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(() => document.documentElement.dataset.gargottexReady === "true");
  await gotoView(page,"codex");
  await page.locator('[data-action="set-codex-type"][data-type="media_assets"]').first().click();
  const open=page.locator('[data-action="open-image"][data-media-id="v6fast-webkit-dungeon"]');
  await expect(open).toBeVisible();
  await expect(open.locator("img")).toHaveAttribute("src", /assets\/images\/logo-192\.png/);
  for (let i=0;i<3;i++) {
    await open.click();
    await expect(page.locator(".image-viewer-overlay")).toBeVisible();
    await expect(page.locator(".image-viewer-panel img")).toBeVisible();
    await page.locator(".image-viewer-close").click();
    await expect(page.locator(".image-viewer-overlay")).toHaveCount(0);
  }
  await assertNoHorizontalOverflow(page);
});
