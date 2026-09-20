import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page, path = "/index.html") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
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

const viewports = [
  ["phone-320", 320, 720],
  ["phone-360", 360, 800],
  ["phone-390", 390, 844],
  ["phone-430", 430, 932],
  ["tablet-portrait-768", 768, 1024],
  ["tablet-portrait-834", 834, 1112],
  ["tablet-landscape-1024", 1024, 768],
  ["tablet-landscape-1194", 1194, 834],
  ["desktop-narrow-1280", 1280, 800],
  ["desktop-1440", 1440, 900],
  ["desktop-wide-1920", 1920, 1080]
];

for (const [name, width, height] of viewports) {
  test(`responsive matrix ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await ready(page);
    await assertNoHorizontalOverflow(page);

    if (width <= 767) {
      await expect(page.locator(".mobile-bottom")).toBeVisible();
      await expect(page.locator(".v6-sidebar")).toBeHidden();
    } else {
      await expect(page.locator(".v6-sidebar")).toBeVisible();
    }

    await gotoView(page, "codex");
    await expect(page.getByRole("heading", { name: "Bestiaire" })).toBeVisible();
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

test("Atelier respects its own tablet portrait/landscape rules", async ({ page }) => {
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

test("keyboard focus, Escape and modal focus restoration", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await gotoView(page, "atelier");
  await page.locator('[data-action="select-workshop"]').first().click();

  const nameInput = page.locator('form[data-workshop-form="true"] [name="name"]').first();
  await expect(nameInput).toBeVisible();
  const original = await nameInput.inputValue();
  await nameInput.fill(original + " UI6");

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

test("structured import preview is write-free until confirmation", async ({ page }) => {
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
    name: "ui6-import.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify([{ name: "Créature UI6", dungeon_name: "" }]))
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

test("axe WCAG 2.2 AA essential surfaces", async ({ page }) => {
  await ready(page);
  await runAxe(page, "Accueil");

  await gotoView(page, "codex");
  await runAxe(page, "Bestiaire collection");
  await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
  await runAxe(page, "Fiche Créature");

  await gotoView(page, "atelier");
  await runAxe(page, "Atelier");

  await gotoView(page, "import");
  await runAxe(page, "Import/Export");
});

test("reduced motion leaves no long visible animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
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

test("large datasets, long text and missing relations remain usable", async ({ page }) => {
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

test("mobile WebKit critical navigation smoke @webkit", async ({ page }) => {
  await ready(page);
  await expect(page.locator(".mobile-bottom")).toBeVisible();
  await gotoView(page, "codex");
  await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
  await expect(page.locator(".creature-detail-back")).toBeVisible();
  await page.locator(".creature-detail-back").click();
  await expect(page.getByRole("heading", { name: "Bestiaire" })).toBeVisible();
  await gotoView(page, "atelier");
  await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
  await assertNoHorizontalOverflow(page);
});


test("core web vitals stay inside UI-6 vigilance thresholds", async ({ page }) => {
  await page.addInitScript(() => {
    window.__ui6Vitals = { cls: 0, lcp: 0 };
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__ui6Vitals.cls += entry.value || 0;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch (_) {}
    try {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__ui6Vitals.lcp = last.startTime || 0;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch (_) {}
  });
  await ready(page);
  await page.waitForLoadState("load");
  await page.waitForTimeout(1200);
  const vitals = await page.evaluate(() => window.__ui6Vitals);
  expect(vitals.cls).toBeLessThanOrEqual(0.10);
  expect(vitals.lcp).toBeGreaterThan(0);
  expect(vitals.lcp).toBeLessThanOrEqual(2500);
});

test("cutout audit keeps originals and transparent derivatives valid", async ({ page }) => {
  await page.goto("/docs/mockup-assets/generated-data/cutout-audit.json");
  const audit = JSON.parse(await page.locator("body").innerText());
  expect(audit.model).toBe("isnet-general-use");
  expect(audit.originals_preserved).toBe(true);
  const rows = [...Object.values(audit.creatures || {}), ...Object.values(audit.heroes || {})];
  expect(rows.length).toBeGreaterThanOrEqual(50);
  for (const row of rows) {
    expect(row.source_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(row.alpha_bbox).toBeTruthy();
    expect(row.transparent_ratio).toBeGreaterThan(0.01);
    expect(row.transparent_ratio).toBeLessThan(0.99);
    expect(row.width).toBeGreaterThan(0);
    expect(row.height).toBeGreaterThan(0);
  }

  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await gotoView(page, "codex");
  await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
  const figure = page.locator(".creature-figure-v6 img").first();
  if (await figure.count()) {
    const style = await figure.evaluate(el => {
      const own = getComputedStyle(el);
      const parent = getComputedStyle(el.parentElement);
      return { objectFit: own.objectFit, ownBackground: own.backgroundColor, parentBackground: parent.backgroundColor };
    });
    expect(style.objectFit).toBe("contain");
    expect(style.ownBackground).not.toBe("rgb(255, 255, 255)");
  }
});

test("reflow proxy and critical interactions stay responsive", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await ready(page);
  await assertNoHorizontalOverflow(page);

  await gotoView(page, "codex");
  const latency = await page.evaluate(async () => {
    const input = document.querySelector('[data-action="bestiary-search"]');
    const start = performance.now();
    input.value = "gob";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return performance.now() - start;
  });
  expect(latency).toBeLessThan(200);
  await assertNoHorizontalOverflow(page);

  const nav = await page.evaluate(() => {
    const entry = performance.getEntriesByType("navigation")[0];
    return entry ? {
      dom: entry.domContentLoadedEventEnd,
      load: entry.loadEventEnd || performance.now()
    } : null;
  });
  expect(nav).not.toBeNull();
  expect(nav.dom).toBeLessThan(2500);
});
