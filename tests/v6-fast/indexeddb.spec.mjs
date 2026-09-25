import { test, expect } from "@playwright/test";

async function dbSnapshot(page) {
  return page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const stores = Array.from(db.objectStoreNames);
    const tx = db.transaction(["dungeons", "creatures", "media_assets"], "readonly");
    const get = (store, id) => new Promise((resolve, reject) => {
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const count = store => new Promise((resolve, reject) => {
      const req = tx.objectStore(store).count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const [dungeon, creature, media, dungeonCount, creatureCount, mediaCount] = await Promise.all([
      get("dungeons", "legacy-dungeon-1"),
      get("creatures", "legacy-creature-1"),
      get("media_assets", "legacy-media-1"),
      count("dungeons"),
      count("creatures"),
      count("media_assets")
    ]);
    const originalBytes = media?.blob ? Array.from(new Uint8Array(await media.blob.arrayBuffer())) : [];
    const thumbBytes = media?.thumb_blob ? Array.from(new Uint8Array(await media.thumb_blob.arrayBuffer())) : [];
    const result = {
      version: db.version,
      stores,
      dungeon,
      creature,
      media: media ? {
        id: media.id,
        unknown_media_field: media.unknown_media_field,
        type: media.blob?.type,
        size: media.blob?.size,
        thumbType: media.thumb_blob?.type,
        thumbSize: media.thumb_blob?.size
      } : null,
      originalBytes,
      thumbBytes,
      counts: { dungeonCount, creatureCount, mediaCount }
    };
    db.close();
    return result;
  });
}

test("IndexedDB v1 -> V6 v2 preserves IDs, unknown fields, relations and Blobs through edit/reopen/offline/export", async ({ page, context }) => {
  await page.goto("/tests/v6-fast/fixtures/legacy-v1.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");

  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();

  const upgraded = await dbSnapshot(page);
  expect(upgraded.version).toBe(2);
  expect(upgraded.stores).toContain("interactables");
  expect(upgraded.dungeon.id).toBe("legacy-dungeon-1");
  expect(upgraded.dungeon.unknown_legacy_field).toBe("KEEP-DUNGEON");
  expect(upgraded.creature.id).toBe("legacy-creature-1");
  expect(upgraded.creature.dungeon_id).toBe("legacy-dungeon-1");
  expect(upgraded.creature.unknown_legacy_field).toEqual({ preserve: true, value: 42 });
  expect(upgraded.media.id).toBe("legacy-media-1");
  expect(upgraded.media.unknown_media_field).toBe("KEEP-MEDIA");
  expect(upgraded.originalBytes).toEqual([137,80,78,71,13,10,26,10,1,2,3,4,5,6,7,8]);
  expect(upgraded.thumbBytes).toEqual([82,73,70,70,1,2,3,4]);

  await page.locator('.v6-sidebar [data-action="set-view"][data-view="atelier"]').click();
  await page.locator('[data-action="select-workshop"][data-type="creatures"][data-id="legacy-creature-1"]').click();
  const form = page.locator('form[data-workshop-form="true"][data-id="legacy-creature-1"]');
  await expect(form).toBeVisible();
  await form.locator('[name="name"]').fill("Gobelin Legacy édité UI6");
  await form.locator('[data-workshop-save]').click();
  await expect(form.locator('[data-workshop-status]').last()).toContainText("Enregistré localement");

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();

  const reopened = await dbSnapshot(page);
  expect(reopened.creature.name).toBe("Gobelin Legacy édité UI6");
  expect(reopened.creature.id).toBe("legacy-creature-1");
  expect(reopened.creature.unknown_legacy_field).toEqual({ preserve: true, value: 42 });
  expect(reopened.originalBytes).toEqual(upgraded.originalBytes);
  expect(reopened.thumbBytes).toEqual(upgraded.thumbBytes);
  expect(reopened.counts).toEqual(upgraded.counts);

  const controlled = await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  });
  if (!controlled) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".v6-app")).toBeVisible();
  }
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 10_000 });

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await expect(page.getByText("Gobelin Legacy édité UI6").first()).toBeVisible({ timeout: 10_000 }).catch(() => {});

  const offline = await dbSnapshot(page);
  expect(offline.creature.name).toBe("Gobelin Legacy édité UI6");
  expect(offline.originalBytes).toEqual(upgraded.originalBytes);

  await page.locator('.v6-sidebar [data-action="set-view"][data-view="import"]').click();
  await expect(page.locator(".admin-io-v6")).toBeVisible();

  const beforeTools=await page.evaluate(() => globalThis.__GARGOTTEX_BOOTSTRAP_DEBUG__?.());
  expect(beforeTools.xlsxModuleLoads).toBe(0);
  expect(beforeTools.zipModuleLoads).toBe(0);

  const offlineTools=await page.evaluate(async () => {
    const [xlsxCached,zipCached]=await Promise.all([
      caches.match("./src/utils/xlsx.js",{ignoreSearch:true}),
      caches.match("./src/utils/zip.js",{ignoreSearch:true})
    ]);
    const [xlsx,zip]=await Promise.all([
      import("./src/utils/xlsx.js"),
      import("./src/utils/zip.js")
    ]);
    return {
      xlsxCached:Boolean(xlsxCached),
      zipCached:Boolean(zipCached),
      xlsxReady:typeof xlsx.buildXlsxBlob==="function" && typeof xlsx.buildXlsxWorkbookBlob==="function",
      zipReady:typeof zip.makeZip==="function" && typeof zip.readZip==="function"
    };
  });
  expect(offlineTools).toEqual({xlsxCached:true,zipCached:true,xlsxReady:true,zipReady:true});

  await context.setOffline(false);

  const xlsxDownloadPromise = page.waitForEvent("download");
  await page.locator('[data-action="export-entity"][data-type="creatures"]').click();
  const xlsxDownload = await xlsxDownloadPromise;
  expect(xlsxDownload.suggestedFilename()).toMatch(/creatures.*\.xlsx$/i);

  const afterXlsx=await page.evaluate(() => globalThis.__GARGOTTEX_BOOTSTRAP_DEBUG__?.());
  expect(afterXlsx.xlsxModuleLoads).toBe(1);
  expect(afterXlsx.zipModuleLoads).toBe(0);

  const backupDownloadPromise = page.waitForEvent("download");
  await page.locator('[data-action="export-backup"]').click();
  const backupDownload = await backupDownloadPromise;
  expect(backupDownload.suggestedFilename()).toMatch(/gargottex_backup_.*\.zip$/);

  const afterBackup=await page.evaluate(() => globalThis.__GARGOTTEX_BOOTSTRAP_DEBUG__?.());
  expect(afterBackup.xlsxModuleLoads).toBe(1);
  expect(afterBackup.zipModuleLoads).toBe(1);

  const jsonDownloadPromise = page.waitForEvent("download");
  await page.locator('[data-action="export-structured-json"]').click();
  const jsonDownload = await jsonDownloadPromise;
  expect(jsonDownload.suggestedFilename()).toMatch(/gargottex_structured_.*\.json$/);
});

test("old incomplete records and broken relations render without rewriting them", async ({ page }) => {
  await page.goto("/tests/v6-fast/fixtures/legacy-v1.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();

  const before = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction("creatures", "readonly");
    const req = tx.objectStore("creatures").get("legacy-orphan-1");
    const row = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return row;
  });

  await page.locator('.v6-sidebar [data-action="set-view"][data-view="codex"]').click();
  await page.locator('[data-action="bestiary-search"]').fill("relation manquante");
  await expect(page.locator('[data-action="select-codex"][data-type="creatures"]')).toHaveCount(1);
  await page.locator('[data-action="select-codex"][data-type="creatures"]').click();
  await expect(page.locator(".creature-sheet-v6")).toBeVisible();

  const after = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("gargottex-v5-offline");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction("creatures", "readonly");
    const req = tx.objectStore("creatures").get("legacy-orphan-1");
    const row = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return row;
  });

  expect(after).toEqual(before);
});
