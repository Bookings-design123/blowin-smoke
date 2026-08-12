const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const BASE = "http://127.0.0.1:8765/docs/prototypes/pressure-proof-constructed-signal-iteration-05/";
const BROWSER = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const surfaces = [
  ["01-home", "pages/01-home.html"],
  ["02-vape-nicotine-division", "pages/02-vape-nicotine-division.html"],
  ["03-shared-category", "pages/03-shared-category.html"],
  ["04-universal-pdp", "pages/04-universal-pdp.html"],
  ["05-fitted-component-pdp", "pages/05-fitted-component-pdp.html"],
  ["06-quick-cart", "pages/06-quick-cart.html"],
  ["07-full-cart", "pages/07-full-cart.html"],
];

const viewports = [
  { dir: "wide", width: 1440, height: 900, suffix: "1440x900" },
  { dir: "narrow", width: 390, height: 844, suffix: "390x844" },
  { dir: "320", width: 320, height: 760, suffix: "320x760" },
];

async function pageMetrics(page) {
  return page.evaluate(() => {
    const controls = [...document.querySelectorAll("button, summary, select, input, .button, .filter-chip")]
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden" && element.getBoundingClientRect().height > 0;
      })
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        label: (element.getAttribute("aria-label") || element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
        height: Number(element.getBoundingClientRect().height.toFixed(2)),
      }));
    return {
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      h1Count: document.querySelectorAll("h1").length,
      noticeCount: [...document.querySelectorAll(".prototype-notice")]
        .filter((element) => getComputedStyle(element).display !== "none").length,
      brokenImages: [...document.images]
        .filter((image) => !image.complete || !image.naturalWidth).length,
      defaultOpenDetails: document.querySelectorAll("details[open]").length,
      controls: {
        count: controls.length,
        minimumHeight: controls.length ? Math.min(...controls.map((control) => control.height)) : null,
        below44: controls.filter((control) => control.height < 44),
      },
    };
  });
}

async function main() {
  const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
  const record = { engine: "Headless Google Chrome via Playwright", core: [], intermediate: [], states: [] };

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    for (const [stem, relativeUrl] of surfaces) {
      await page.goto(BASE + relativeUrl, { waitUntil: "load" });
      const target = path.join(ROOT, "screenshots", viewport.dir, `${stem}-${viewport.suffix}.png`);
      await page.screenshot({ path: target, fullPage: true });
      record.core.push({ surface: stem, viewport: viewport.suffix, ...(await pageMetrics(page)) });
    }
    await context.close();
  }

  for (const width of [1024, 901]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const [stem, relativeUrl] of surfaces) {
      await page.goto(BASE + relativeUrl, { waitUntil: "load" });
      record.intermediate.push({ surface: stem, viewport: `${width}x900`, ...(await pageMetrics(page)) });
    }
    await context.close();
  }

  const context390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page390 = await context390.newPage();

  await page390.goto(BASE + "pages/01-home.html", { waitUntil: "load" });
  await page390.screenshot({ path: path.join(ROOT, "screenshots/states/08-mobile-navigation-closed-390x844.png") });
  record.states.push({ state: "compact-navigation-closed-390", ...(await pageMetrics(page390)) });

  await page390.goto(BASE + "pages/01-home.html", { waitUntil: "load" });
  await page390.locator("details.mobile-menu > summary").click();
  await page390.screenshot({ path: path.join(ROOT, "screenshots/states/08-mobile-navigation-open-390x844.png") });
  record.states.push({ state: "compact-navigation-open-390", openDetails: await page390.locator("details[open]").count(), ...(await pageMetrics(page390)) });

  await page390.goto(BASE + "pages/04-universal-pdp.html", { waitUntil: "load" });
  await page390.locator("details.disclosure").evaluateAll((details) => details.forEach((detail) => { detail.open = true; }));
  await page390.evaluate(() => window.scrollTo(0, 0));
  await page390.screenshot({ path: path.join(ROOT, "screenshots/states/04-universal-pdp-details-open-390x844.png"), fullPage: true });
  record.states.push({ state: "universal-secondary-details-open-390", openDetails: await page390.locator("details[open]").count(), ...(await pageMetrics(page390)) });

  await page390.goto(BASE + "pages/05-fitted-component-pdp.html", { waitUntil: "load" });
  await page390.locator("details.disclosure").evaluateAll((details) => details.forEach((detail) => { detail.open = true; }));
  await page390.evaluate(() => window.scrollTo(0, 0));
  await page390.screenshot({ path: path.join(ROOT, "screenshots/states/05-fitted-pdp-geometry-evidence-open-390x844.png"), fullPage: true });
  record.states.push({ state: "fitted-geometry-evidence-open-390", openDetails: await page390.locator("details[open]").count(), ...(await pageMetrics(page390)) });

  await page390.goto(BASE + "pages/07-full-cart.html", { waitUntil: "load" });
  await page390.locator("details.order-line:not([open])").first().evaluate((detail) => { detail.open = true; });
  await page390.evaluate(() => window.scrollTo(0, 0));
  await page390.screenshot({ path: path.join(ROOT, "screenshots/states/07-full-cart-secondary-open-390x844.png"), fullPage: true });
  record.states.push({ state: "full-cart-secondary-open-390", openDetails: await page390.locator("details[open]").count(), ...(await pageMetrics(page390)) });
  await context390.close();

  const context320 = await browser.newContext({ viewport: { width: 320, height: 760 } });
  const page320 = await context320.newPage();
  await page320.goto(BASE + "pages/01-home.html", { waitUntil: "load" });
  await page320.locator("details.mobile-menu > summary").click();
  await page320.screenshot({ path: path.join(ROOT, "screenshots/states/08-mobile-navigation-open-320x760.png") });
  record.states.push({ state: "compact-navigation-open-320", openDetails: await page320.locator("details[open]").count(), ...(await pageMetrics(page320)) });
  await context320.close();

  const typeContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const typePage = await typeContext.newPage();
  await typePage.goto(BASE + "studies/09-typography-audition.html", { waitUntil: "load" });
  await typePage.screenshot({ path: "/private/tmp/i05-type-viewport.jpg", type: "jpeg" });
  record.typography = await typePage.locator('[data-type-candidate="a"] [data-type-role]').evaluateAll((elements) =>
    elements.map((element) => ({
      role: element.dataset.typeRole,
      family: getComputedStyle(element).fontFamily,
      weight: getComputedStyle(element).fontWeight,
    })),
  );
  record.typographyCandidates = await typePage.locator(".type-candidate").evaluateAll((candidates) =>
    candidates.map((candidate) => ({
      candidate: candidate.dataset.typeCandidate,
      name: candidate.dataset.candidateName,
      declaredStack: candidate.dataset.declaredStack,
      declaredBodyStack: candidate.dataset.bodyStack || null,
      declaredDataStack: candidate.dataset.dataStack || "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      provisionalSelection: candidate.dataset.provisionalSelection === "true",
      roles: [...candidate.querySelectorAll("[data-type-role]")].map((element) => ({
        role: element.dataset.typeRole,
        family: getComputedStyle(element).fontFamily,
        weight: getComputedStyle(element).fontWeight,
      })),
    })),
  );
  record.fontAvailability = await typePage.evaluate(() => ({
    helveticaNeue: document.fonts.check('16px "Helvetica Neue"'),
    helvetica: document.fonts.check("16px Helvetica"),
    arial: document.fonts.check("16px Arial"),
    trebuchet: document.fonts.check('16px "Trebuchet MS"'),
    georgia: document.fonts.check("16px Georgia"),
    monospace: document.fonts.check("16px monospace"),
  }));
  await typeContext.close();

  fs.writeFileSync("/private/tmp/i05-headless-render-record.json", JSON.stringify(record, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
