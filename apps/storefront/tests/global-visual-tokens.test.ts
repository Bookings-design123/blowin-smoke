import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const globals = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
const layout = readFileSync(
  new URL("../app/layout.tsx", import.meta.url),
  "utf8",
);
const home = readFileSync(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);
const primitives = readFileSync(
  new URL("../components/Primitives.tsx", import.meta.url),
  "utf8",
);
const thcaStyles = readFileSync(
  new URL("../app/thca/thca.module.css", import.meta.url),
  "utf8",
);
const thcaMedia = readFileSync(
  new URL("../app/thca/ThcaProductMedia.tsx", import.meta.url),
  "utf8",
);
const vapeStyles = readFileSync(
  new URL("../app/vape-nicotine/vape.module.css", import.meta.url),
  "utf8",
);
const vapeMedia = readFileSync(
  new URL("../app/vape-nicotine/VapeProductMedia.tsx", import.meta.url),
  "utf8",
);
const pdpStyles = readFileSync(
  new URL("../app/products/[sku]/pdp.module.css", import.meta.url),
  "utf8",
);
const galleryStyles = readFileSync(
  new URL("../app/products/[sku]/ProductGallery.module.css", import.meta.url),
  "utf8",
);
const pdpPage = readFileSync(
  new URL("../app/products/[sku]/page.tsx", import.meta.url),
  "utf8",
);
const productGallery = readFileSync(
  new URL("../app/products/[sku]/ProductGallery.tsx", import.meta.url),
  "utf8",
);

test("the storefront installs the documented Apercu and Gill Sans fallback model", () => {
  assert.match(layout, /import \{ Cabin, DM_Sans \} from "next\/font\/google"/);
  assert.match(layout, /variable: "--font-dm-sans"/);
  assert.match(layout, /variable: "--font-cabin"/);
  assert.doesNotMatch(layout, /\bArchivo\b|font-archivo/);
  assert.match(globals, /--font-body: var\(--font-dm-sans, "DM Sans"\)/);
  assert.match(globals, /--font-heading: "Gill Sans", "Gill Sans MT", var\(--font-cabin, "Cabin"\)/);
  assert.match(globals, /--font-data: var\(--font-body\)/);
});

test("the branding scrape is encoded as the permanent global retail token baseline", () => {
  for (const token of [
    "--retail-background: #ffffff",
    "--retail-text: #000000",
    "--retail-border: #e8e8e8",
    "--retail-control-primary: #e8e8e8",
    "--retail-control-secondary: #f7f7f7",
    "--retail-radius: 0px",
    "--retail-shadow: none",
  ]) {
    assert.ok(globals.includes(token), `missing hard token: ${token}`);
  }

  for (const step of [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96]) {
    assert.ok(
      globals.includes(`--space-${step}: ${step}px`),
      `missing 4px-derived spacing token: ${step}`,
    );
  }

  const spacingUses = `${globals}\n${thcaStyles}\n${vapeStyles}\n${pdpStyles}\n${galleryStyles}`.match(
    /var\(--space-(?:4|8|12|16|20|24|28|32|40|48|56|64|80|96)\)/g,
  );
  assert.ok(
    (spacingUses?.length ?? 0) >= 100,
    "the spacing ladder must govern shared and THCA component anatomy, not exist as unused declarations",
  );
  assert.match(
    globals,
    /\.button,[\s\S]*?padding: var\(--space-12\) var\(--space-20\);/,
  );
  assert.match(
    thcaStyles,
    /\.productAction,[\s\S]*?padding: var\(--space-12\) var\(--space-16\);/,
  );
  assert.match(
    vapeStyles,
    /\.productAction,[\s\S]*?padding: var\(--space-12\) var\(--space-16\);/,
  );

  assert.match(globals, /body \{[\s\S]*?font-size: 14px;/);
  assert.match(globals, /h1 \{[\s\S]*?font-size: clamp\(28px, 3\.6vw, 44px\);/);
  assert.match(globals, /h2 \{[\s\S]*?font-size: clamp\(20px, 2\.2vw, 28px\);/);
});

test("shared controls, inputs, geometry, and elevation cannot drift by route", () => {
  assert.match(
    globals,
    /\.button,[\s\S]*?background: var\(--retail-control-primary\);[\s\S]*?box-shadow: var\(--retail-shadow\);[\s\S]*?color: var\(--retail-text\);/,
  );
  assert.match(
    globals,
    /\.button\.secondary,[\s\S]*?\.button\.button--secondary,[\s\S]*?background: var\(--retail-control-secondary\);/,
  );
  assert.match(
    globals,
    /input\[type="search"\],[\s\S]*?border: 1px solid var\(--retail-border\);[\s\S]*?background: transparent;[\s\S]*?box-shadow: var\(--retail-shadow\);/,
  );
  for (const type of [
    "email",
    "tel",
    "url",
    "password",
    "number",
    "date",
    "time",
    "datetime-local",
  ]) {
    assert.ok(
      globals.includes(`input[type="${type}"]`),
      `global input contract does not cover ${type}`,
    );
  }

  for (const source of [
    globals,
    thcaStyles,
    vapeStyles,
    pdpStyles,
    galleryStyles,
  ]) {
    for (const match of source.matchAll(/border-radius:\s*([^;]+);/g)) {
      assert.ok(
        match[1] === "0" || match[1] === "var(--retail-radius)",
        `non-global radius found: ${match[1]}`,
      );
    }
    for (const match of source.matchAll(/box-shadow:\s*([^;]+);/g)) {
      assert.equal(match[1], "var(--retail-shadow)");
    }
  }
});

test("cream legacy tokens and explanatory missing-media fills are removed", () => {
  const visualSources = `${globals}\n${thcaStyles}\n${vapeStyles}\n${pdpStyles}\n${galleryStyles}`;
  for (const legacy of [
    "#f3efe7",
    "#fffdf8",
    "#e5dfd4",
    "#aaa297",
    "#8c877e",
    "#f4f2ed",
    "#eef1ef",
    "#ece9e3",
    "#eee9df",
  ]) {
    assert.equal(
      visualSources.toLowerCase().includes(legacy),
      false,
      `legacy visual token remains: ${legacy}`,
    );
  }

  assert.doesNotMatch(primitives, /Media pending|Exact identity and decision facts/);
  assert.doesNotMatch(thcaMedia, />THCA<|>Image unavailable</);
  assert.doesNotMatch(vapeMedia, />Vape<|>Image unavailable/);
  assert.match(home, /className="button button--contrast"/);
});

test("the shared PDP stays media-first, ID-free, and inside the retail token lock", () => {
  assert.match(
    pdpPage,
    /<ProductGallery[\s\S]*?<article className=\{styles\.decision\}>/,
  );
  assert.doesNotMatch(pdpPage, />\s*SKU\b|SKU\s*\{/);
  assert.match(pdpStyles, /font-size: clamp\(28px, 3\.6vw, 44px\);/);
  assert.doesNotMatch(pdpStyles, /font-size:\s*(?:4[5-9]|[5-9]\d)px/);
  assert.match(productGallery, /case "ArrowLeft"/);
  assert.match(productGallery, /case "ArrowRight"/);
  assert.match(productGallery, /aria-live="polite"/);
  assert.match(productGallery, /aria-label="Previous image"/);
  assert.match(productGallery, /aria-label="Next image"/);
  assert.doesNotMatch(productGallery, />\s*First\s*</);
  assert.doesNotMatch(productGallery, />\s*Previous\s*</);
  assert.doesNotMatch(productGallery, />\s*Next\s*</);
  assert.match(
    pdpStyles,
    /@media \(max-width: 680px\)[\s\S]*?\.loadingMedia\s*\{[\s\S]*?aspect-ratio: 1 \/ 1;/,
  );
  assert.doesNotMatch(pdpPage, /CatalogState|Catalog service error|Catalog unavailable/);
  assert.match(pdpPage, /className="catalog-state__label">Product unavailable/);
  assert.doesNotMatch(
    pdpPage,
    /Product information|blockerLabel|blockerReason|purchaseState|purchaseReason|Selected option/,
  );
  assert.match(pdpPage, /aria-label="Purchase status"/);
  assert.match(pdpPage, /aria-label="Product details"/);
  assert.match(
    pdpStyles,
    /\.purchaseRecovery\s*\{[\s\S]*?min-height: calc\(var\(--space-40\) \+ var\(--space-4\)\);/,
  );
  assert.match(pdpPage, /requiresConfigurationSummary[\s\S]*?<span>Option<\/span>/);
});
