import { test, expect } from "@playwright/test";

async function attachShot(locator, name, testInfo) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    await expect(locator).toBeVisible();
    try {
      const buffer = await locator.screenshot({ animations: "disabled" });
      await testInfo.attach(name, { body: buffer, contentType: "image/png" });
      return;
    } catch (error) {
      lastError = error;
      if (!String(error?.message || error).includes("not attached")) throw error;
      await new Promise(resolve => setTimeout(resolve, 120));
    }
  }
  throw lastError;
}

async function ready(page) {
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v6-app")).toBeVisible();
  await page.waitForLoadState("networkidle");
}

test("V3 visual comparison pack: production and reference sections", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page);

  await attachShot(page.locator("#main-content"), "prod-01-home", testInfo);

  await page.locator('.v6-sidebar [data-view="codex"]').click();
  await attachShot(page.locator("#main-content"), "prod-02-bestiary", testInfo);
  await page.locator('[data-action="select-codex"][data-type="creatures"]').first().click();
  await attachShot(page.locator("#main-content"), "prod-03-creature", testInfo);
  await page.locator('[data-action="codex-back"]').first().click();

  const families = [
    ["dungeons", "prod-04-dungeon"],
    ["heroes", "prod-05-hero"],
    ["npcs", "prod-06-npc"],
    ["quests", "prod-07-quest"],
    ["loot_items", "prod-08-loot"]
  ];
  for (const [type, name] of families) {
    await page.locator(`[data-action="set-codex-type"][data-type="${type}"]`).first().click();
    const card = page.locator(`[data-action="select-family-codex"][data-type="${type}"]`).first();
    if (await card.count()) await card.click();
    await attachShot(page.locator("#main-content"), name, testInfo);
    const back = page.locator('[data-action="codex-family-back"]');
    if (await back.count() && await back.first().isVisible()) await back.first().click();
  }

  for (const [view, name] of [
    ["generator", "prod-09-generator"],
    ["brouhaha", "prod-10-brouhaha"],
    ["atelier", "prod-11-atelier"],
    ["media", "prod-12-media"],
    ["import", "prod-13-import-export"]
  ]) {
    await page.locator(`.v6-sidebar [data-view="${view}"]`).click();
    await attachShot(page.locator("#main-content"), name, testInfo);
  }

  await page.goto("/docs/GARGOTTEX-V6-MAQUETTE-PREMIUM-V3.html", { waitUntil: "domcontentloaded" });
  const refs = [
    ["#home", "v3-01-home"],
    ["#bestiary-collection", "v3-02-bestiary"],
    ["#creature-detail", "v3-03-creature"],
    ["#dungeons-browser", "v3-04-dungeon"],
    ["#heroes-browser", "v3-05-hero"],
    ["#npcs-browser", "v3-06-npc"],
    ["#quests-browser", "v3-07-quest"],
    ["#loot-browser", "v3-08-loot"],
    ["#generator", "v3-09-generator"],
    ["#brouhaha", "v3-10-brouhaha"],
    ["#atelier", "v3-11-atelier"],
    ["#media", "v3-12-media"],
    ["#importexport", "v3-13-import-export"]
  ];
  for (const [selector, name] of refs) {
    await page.evaluate(targetSelector => {
      const familyBySelector = {
        "#dungeons-browser": "dungeons",
        "#heroes-browser": "heroes",
        "#npcs-browser": "npcs",
        "#quests-browser": "quests",
        "#loot-browser": "loot"
      };
      if (familyBySelector[targetSelector] && typeof renderCodexType === "function") {
        show?.("codex");
        renderCodexType(familyBySelector[targetSelector]);
      }
      const target = document.querySelector(targetSelector);
      if (!target) throw new Error("Référence V3 absente : " + targetSelector);
      document.querySelectorAll(".page").forEach(node => node.classList.remove("active"));
      document.querySelectorAll(".entity-demo").forEach(node => node.classList.remove("active"));
      const ownerPage = target.matches(".page") ? target : target.closest(".page");
      ownerPage?.classList.add("active");
      const ownerDemo = target.matches(".entity-demo") ? target : target.closest(".entity-demo");
      ownerDemo?.classList.add("active");
      target.scrollIntoView({ block: "start", behavior: "auto" });
    }, selector);
    await attachShot(page.locator(selector), name, testInfo);
  }
});

test("production keeps V3 premium resources and typography hierarchy", async ({ page }) => {
  await ready(page);
  const result = await page.evaluate(() => {
    const css = Array.from(document.styleSheets).flatMap(sheet => {
      try { return Array.from(sheet.cssRules || []).map(rule => rule.cssText); } catch { return []; }
    }).join("\n");
    return {
      alegreya: css.includes("Alegreya"),
      inter: css.includes("Inter"),
      grain: css.includes("grain-dark.svg"),
      wood: css.includes("wood-charred.svg"),
      paper: css.includes("paper-warm.svg"),
      focus: css.includes(":focus-visible"),
      reducedMotion: css.includes("prefers-reduced-motion")
    };
  });
  expect(result).toEqual({
    alegreya: true,
    inter: true,
    grain: true,
    wood: true,
    paper: true,
    focus: true,
    reducedMotion: true
  });
});
