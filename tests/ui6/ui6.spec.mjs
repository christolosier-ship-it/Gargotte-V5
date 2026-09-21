import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page, path = "/index.html") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await page.waitForLoadState("networkidle");
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

test("polished home keeps Berthold advice stable and session actions intact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  await expect(page.locator(".home-polish-v6")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ici, même les habitués ne savent plus pourquoi ils sont venus." })).toBeVisible();
  await expect(page.locator(".home-berthold-note")).toBeVisible();
  await expect(page.locator(".home-quick-links > button")).toHaveCount(4);

  const advice = (await page.locator(".home-berthold-note strong").innerText()).trim();
  expect(advice.startsWith("«")).toBe(true);
  expect(advice.endsWith("»")).toBe(true);
  expect(advice.length).toBeGreaterThan(30);

  await gotoView(page, "codex");
  await gotoView(page, "home");
  await expect(page.locator(".home-berthold-note strong")).toHaveText(advice);

  const dungeonSelect = page.locator('[data-action="session-start-dungeon"]');
  await expect(dungeonSelect).toBeVisible();
  await page.locator('[data-action="session-start"]').click();

  await expect(page.locator(".home-session-board")).toBeVisible();
  await expect(page.locator(".home-session-object")).toHaveCount(3);
  await expect(page.locator('[data-action="session-set-dungeon"]')).toBeVisible();
  await expect(page.locator('[data-action="session-set-floor"]')).toBeVisible();
  await expect(page.locator('[data-action="session-end"]')).toBeVisible();
  await expect(page.locator(".home-berthold-note strong")).toHaveText(advice);
  await assertNoHorizontalOverflow(page);
});

test("home cleanup removes crossed copy and sidebar navigation is Lucide-only", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);

  await expect(page.getByText("Gargotte & Va-Nu-Pieds", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Une encyclopédie visuelle et un compagnon de partie local-first/)).toHaveCount(0);
  await expect(page.getByText(/Ouvre le Codex, choisis ton Donjon ou lance une partie/)).toHaveCount(0);
  await expect(page.getByText(/Choisis un Donjon pour créer un contexte de partie partagé/)).toHaveCount(0);

  const sidebar = page.locator(".v6-sidebar .v6-nav");
  await expect(sidebar.locator("img")).toHaveCount(0);
  await expect(sidebar.locator("svg.ui-icon")).toHaveCount(8);

  const expectedLabels = ["Accueil","Codex","Générateur","Brouhaha","Quêtes","Atelier","Médias","Import / Export"];
  for (const label of expectedLabels) {
    await expect(page.locator(".v6-sidebar .navbtn").filter({ hasText: label })).toBeVisible();
  }
});

test("Codex polish removes helper copy, applies dungeon accents and keeps creature gallery dense on iPad", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await ready(page);

  await expect(page.getByText("Comptoir de départ", { exact: true })).toHaveCount(0);

  await gotoView(page, "codex");
  await expect(page.getByRole("heading", { name: "Bestiaire" })).toBeVisible();
  await expect(page.getByText("Codex · Créatures", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Galerie pour explorer. Liste pour arbitrer.", { exact: true })).toHaveCount(0);
  await expect(page.locator('[data-action="bestiary-search"]')).toHaveAttribute("aria-label", "Rechercher une créature");

  const galleryLayout = await page.locator(".bestiary-gallery-grid").evaluate(el => {
    const style = getComputedStyle(el);
    const cards = Array.from(el.querySelectorAll(".bestiary-gallery-card")).slice(0, 3);
    const rects = cards.map(card => {
      const rect = card.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width };
    });
    const firstStyle = cards[0] ? getComputedStyle(cards[0]) : null;
    return {
      columns: style.gridTemplateColumns.split(" ").filter(Boolean).length,
      accent: firstStyle?.getPropertyValue("--dungeon-accent").trim() || "",
      cat: firstStyle?.getPropertyValue("--cat").trim() || "",
      background: firstStyle?.backgroundImage || "",
      rects
    };
  });
  expect(galleryLayout.columns).toBeGreaterThanOrEqual(3);
  expect(galleryLayout.accent).not.toBe("");
  expect(galleryLayout.cat).not.toBe("");
  expect(galleryLayout.background).not.toBe("none");
  expect(galleryLayout.rects).toHaveLength(3);
  expect(Math.abs(galleryLayout.rects[0].top - galleryLayout.rects[1].top)).toBeLessThanOrEqual(2);
  expect(Math.abs(galleryLayout.rects[1].top - galleryLayout.rects[2].top)).toBeLessThanOrEqual(2);
  expect(galleryLayout.rects[1].left).toBeGreaterThanOrEqual(galleryLayout.rects[0].right - 1);
  expect(galleryLayout.rects[2].left).toBeGreaterThanOrEqual(galleryLayout.rects[1].right - 1);

  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();
  await expect(page.getByRole("heading", { name: "Donjons" })).toBeVisible();
  await expect(page.locator(".codex-family-heading .eyebrow")).toHaveCount(0);
  await expect(page.locator('[data-action="family-search"][data-type="dungeons"]')).toHaveAttribute("aria-label", "Rechercher dans donjons");
  const dungeonAccent = await page.locator(".dungeon-collection-card").first().evaluate(el => {
    const style = getComputedStyle(el);
    const media = el.querySelector(".dungeon-collection-media");
    const mediaStyle = media ? getComputedStyle(media) : null;
    return {
      accent: style.getPropertyValue("--dungeon-accent").trim(),
      shadow: style.boxShadow,
      mediaBackground: mediaStyle?.backgroundImage || ""
    };
  });
  expect(dungeonAccent.accent).not.toBe("");
  expect(dungeonAccent.shadow).not.toBe("none");
  expect(dungeonAccent.mediaBackground).not.toBe("none");

  for (const type of ["heroes","npcs","quests","loot_items","interactables","brouhaha_effects"]) {
    await page.locator(`[data-action="set-codex-type"][data-type="${type}"]`).first().click();
    await expect(page.locator(".codex-family-heading .eyebrow")).toHaveCount(0);
    const search = page.locator(`[data-action="family-search"][data-type="${type}"]`);
    if (await search.count()) await expect(search).toHaveAttribute("aria-label", /Rechercher dans /);
  }

  await assertNoHorizontalOverflow(page);
});

test("detail polish reproduces V3 dungeon cinematic, linked media and compact creature art", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await ready(page);
  await gotoView(page, "codex");

  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();
  const firstDungeon = page.locator('.dungeon-collection-card[data-action="select-family-codex"]').first();
  await expect(firstDungeon).toBeVisible();
  await firstDungeon.click();

  const cinematic = page.locator("#gargotte-cinematic");
  await expect(cinematic).toHaveClass(/show/);
  await expect(cinematic.getByText("NOUVEAU LIEU", { exact: true })).toBeVisible();
  const dungeonTitle = (await page.locator(".dungeon-cover-copy-v6 h1").innerText()).trim();
  await expect(cinematic.getByRole("heading", { name: dungeonTitle })).toBeVisible();
  await expect(cinematic.locator(".cinematic-curtain")).toHaveCount(2);
  await expect(cinematic.locator(".cinematic-sparks i")).toHaveCount(9);
  await cinematic.getByRole("button", { name: "Continuer" }).click();
  await expect(cinematic).not.toHaveClass(/show/);

  await expect(page.locator(".dungeon-cover-copy-v6 .eyebrow")).toHaveCount(0);
  await expect(page.locator(".dungeon-cover-copy-v6 > span")).toHaveCount(0);
  await expect(page.locator(".dungeon-progression-v6 .eyebrow")).toHaveCount(0);
  await expect(page.locator(".dungeon-boss-v6 .eyebrow")).toHaveCount(0);
  await expect(page.locator(".dungeon-linked-v6 .eyebrow")).toHaveCount(0);

  const description = page.locator(".dungeon-description-v6");
  if (await description.count()) {
    await expect(description.locator(".dungeon-section-head h2")).toHaveText("Description");
    const typography = await page.evaluate(() => {
      const a = document.querySelector(".dungeon-description-v6 .dungeon-section-head h2");
      const b = document.querySelector(".dungeon-progression-v6 .dungeon-section-head h2");
      const sa = a ? getComputedStyle(a) : null;
      const sb = b ? getComputedStyle(b) : null;
      return sa && sb ? {
        a: [sa.fontFamily, sa.fontSize, sa.fontWeight, sa.lineHeight],
        b: [sb.fontFamily, sb.fontSize, sb.fontWeight, sb.lineHeight]
      } : null;
    });
    expect(typography).not.toBeNull();
    expect(typography.a).toEqual(typography.b);
  }

  const dungeonAccent = await page.locator(".dungeon-sheet-v6").evaluate(el => getComputedStyle(el).getPropertyValue("--dungeon-accent").trim());
  expect(dungeonAccent).toMatch(/^#/);

  const linkedMediaButtons = page.locator(".dungeon-linked-items button.has-media");
  const linkedMediaCount = await linkedMediaButtons.count();
  for (let index = 0; index < linkedMediaCount; index += 1) {
    const button = linkedMediaButtons.nth(index);
    await expect(button.locator(".dungeon-linked-thumb img")).toBeVisible();
  }

  // La découverte V3 ne se rejoue pas quand le même Donjon est rouvert.
  await page.locator('[data-action="codex-family-back"][data-type="dungeons"]').click();
  await expect(page.locator(".dungeon-collection-card")).toBeVisible();
  await page.locator('.dungeon-collection-card[data-action="select-family-codex"]').first().click();
  await page.waitForTimeout(180);
  await expect(page.locator("#gargotte-cinematic.show")).toHaveCount(0);

  // La fiche Créature est testée indépendamment de la richesse média du Donjon de fixture.
  await page.locator('[data-action="set-codex-type"][data-type="creatures"]').first().click();
  const firstCreature = page.locator('[data-action="select-codex"][data-type="creatures"]').first();
  await expect(firstCreature).toBeVisible();
  await firstCreature.click();
  await expect(page.locator(".creature-sheet-v6")).toBeVisible();

  const creatureAccent = await page.locator(".creature-sheet-v6").evaluate(el => getComputedStyle(el).getPropertyValue("--dungeon-accent").trim());
  expect(creatureAccent).toMatch(/^#/);

  const artHeight = await page.locator(".creature-art-v6").evaluate(el => el.getBoundingClientRect().height);
  expect(artHeight).toBeLessThanOrEqual(570);
  expect(artHeight).toBeGreaterThanOrEqual(400);

  const dungeonLink = page.locator(".creature-dungeon-link").first();
  await expect(dungeonLink).toBeVisible();
  await dungeonLink.click();
  const relatedCinematic = page.locator("#gargotte-cinematic.show");
  if (await relatedCinematic.count()) {
    await page.locator("#gargotte-cinematic .cinematic-skip").click();
  }
  await expect(page.locator(".dungeon-sheet-v6")).toBeVisible();
  const creatureDungeonAccent = await page.locator(".dungeon-sheet-v6").evaluate(el => getComputedStyle(el).getPropertyValue("--dungeon-accent").trim());
  expect(creatureDungeonAccent).toBe(creatureAccent);

  await assertNoHorizontalOverflow(page);
});




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

test("Bestiary filters, sorting, display mode and persistence", async ({ page }) => {
  await ready(page);
  await gotoView(page, "codex");

  await page.locator('[data-action="bestiary-search"]').fill("gobelin");
  await expect(page.locator(".bestiary-result-label")).toContainText("résultat");
  await page.locator('[data-action="bestiary-category"]').selectOption("basique");
  await page.locator('[data-action="bestiary-sort"]').selectOption("menace");
  await page.locator('[data-action="bestiary-toggle-direction"]').click();
  await page.locator('[data-action="bestiary-mode"][data-mode="list"]').click();
  await expect(page.locator(".bestiary-results.list")).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[data-action="bestiary-search"]')).toHaveValue("gobelin");
  await expect(page.locator('[data-action="bestiary-category"]')).toHaveValue("basique");
  await expect(page.locator('[data-action="bestiary-sort"]')).toHaveValue("menace");
  await expect(page.locator('[data-action="bestiary-mode"][data-mode="list"]')).toHaveAttribute("aria-pressed", "true");
});

test("Codex cross-family navigation covers dungeon context, hero levels, NPC quest and global search", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await gotoView(page, "codex");

  await page.locator('[data-action="set-codex-type"][data-type="dungeons"]').first().click();
  await page.locator('[data-action="select-family-codex"][data-type="dungeons"][data-id="dungeon_le-cabaret-des-joyeuses"]').first().click();
  await expect(page.getByRole("heading", { name: "Le Cabaret des Joyeuses" })).toBeVisible();

  const seeAll = page.locator('[data-action="dungeon-see-all"][data-type="creatures"]').first();
  await expect(seeAll).toBeVisible();
  await seeAll.click();
  await expect(page.getByRole("heading", { name: "Bestiaire" })).toBeVisible();
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

test("session Generator, Brouhaha and Quest flows remain coherent", async ({ page }) => {
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

test("Media library opens detail without altering originals", async ({ page }) => {
  await ready(page);
  await gotoView(page, "media");
  const before = await page.evaluate(async () => {
    const db = await new Promise((resolve,reject) => { const req=indexedDB.open("gargottex-v5-offline"); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    const tx=db.transaction("media_assets","readonly"), req=tx.objectStore("media_assets").getAll();
    const rows=await new Promise((resolve,reject)=>{ req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    db.close();
    return rows.map(row=>({id:row.id,size:row.blob?.size||0,type:row.blob?.type||"",path:row.path||""}));
  });
  const card = page.locator('[data-action="media-select"]').first();
  await card.click();
  await expect(page.locator(".media-detail-v6")).toBeVisible();
  await expect(page.locator(".media-variant-card.original")).toBeVisible();
  const after = await page.evaluate(async () => {
    const db = await new Promise((resolve,reject) => { const req=indexedDB.open("gargottex-v5-offline"); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    const tx=db.transaction("media_assets","readonly"), req=tx.objectStore("media_assets").getAll();
    const rows=await new Promise((resolve,reject)=>{ req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); });
    db.close();
    return rows.map(row=>({id:row.id,size:row.blob?.size||0,type:row.blob?.type||"",path:row.path||""}));
  });
  expect(after).toEqual(before);
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


test("Service Worker cache and update control preserve local data", async ({ page }) => {
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
    const cacheName = names.find(name => name === "gargottex-v6-polish-details-v1");
    if (!cacheName) return { cacheName: null, missing: ["cache"] };
    const cache = await caches.open(cacheName);
    const core = ["./index.html","./styles.css","./manifest.webmanifest","./src/app.js","./src/storage/idb.js","./assets/fonts/Inter-Variable.ttf","./assets/fonts/Alegreya-Variable.ttf"];
    const missing=[];
    for (const path of core) if (!(await cache.match(path,{ignoreSearch:true}))) missing.push(path);
    return { cacheName, missing };
  });
  expect(cacheState.cacheName).toBe("gargottex-v6-polish-details-v1");
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

test("zoom and reflow proxy covers 100 125 150 and 200 percent", async ({ page }) => {
  const cases = [
    [100, 1280],
    [125, 1024],
    [150, 853],
    [200, 640]
  ];
  for (const [zoom, width] of cases) {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    await assertNoHorizontalOverflow(page);
    await gotoView(page, "codex");
    await expect(page.getByRole("heading", { name: "Bestiaire" })).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
    await expect(page.locator(".creature-sheet-v6")).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await test.info().attach(`reflow-${zoom}-percent.txt`, { body: Buffer.from(`1280 CSS px baseline / ${zoom}% -> ${width}px effective layout width`) });
  }
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
  await expect(page.locator('[data-action="bestiary-search"]')).toBeVisible();
  const latency = await page.locator('[data-action="bestiary-search"]').evaluate(async input => {
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
