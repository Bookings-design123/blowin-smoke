import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  availableThcaFormats,
  filterThcaProducts,
  parseThcaFormat,
  thcaCardModel,
  thcaEmptyShelfCopy,
  thcaFormatsForProduct,
} from "../app/thca/thca-domain";
import type { StorefrontProduct } from "../lib/catalog/types";

function product({
  id,
  name = "Canonical THCA product",
  attributes = {},
  secondAttributes,
  firstQuantity = 4,
  secondQuantity,
}: Readonly<{
  id: string;
  name?: string;
  attributes?: Readonly<Record<string, unknown>>;
  secondAttributes?: Readonly<Record<string, unknown>>;
  firstQuantity?: number;
  secondQuantity?: number;
}>): StorefrontProduct {
  const variants = [
    {
      id: `${id}-variant-one`,
      name: "Option one",
      attributes,
      skus: [
        {
          id: `${id}-sku-one-id`,
          sku: `${id}-SKU-ONE`,
          retailPrice: { amountCents: 2_400, currency: "USD" },
          availableQuantity: firstQuantity,
        },
      ],
    },
  ];

  if (secondAttributes || secondQuantity !== undefined) {
    variants.push({
      id: `${id}-variant-two`,
      name: "Option two",
      attributes: secondAttributes ?? {},
      skus: [
        {
          id: `${id}-sku-two-id`,
          sku: `${id}-SKU-TWO`,
          retailPrice: { amountCents: 3_600, currency: "USD" },
          availableQuantity: secondQuantity ?? 4,
        },
      ],
    });
  }

  return {
    id,
    name,
    description: "Canonical test-only THCA record.",
    division: "THCA",
    publicationState: "PUBLISHED",
    variants,
    images: [],
  };
}

test("format routes come only from explicit controlled canonical attributes", () => {
  const namedOnly = product({ id: "named-only", name: "Flower product without a format field" });
  const explicitFlower = product({
    id: "explicit-flower",
    attributes: { product_format: "Smalls" },
  });
  const unsupportedFormat = product({
    id: "unsupported-format",
    attributes: { format: "Beverage" },
  });

  assert.deepEqual(thcaFormatsForProduct(namedOnly), []);
  assert.deepEqual(thcaFormatsForProduct(unsupportedFormat), []);
  assert.deepEqual(thcaFormatsForProduct(explicitFlower).map((format) => format.slug), ["flower"]);
  assert.deepEqual(
    availableThcaFormats([namedOnly, explicitFlower, unsupportedFormat]).map((format) => [format.slug, format.count]),
    [["flower", 1]],
  );
});

test("format filtering never manufactures membership from a title or description", () => {
  const flower = product({ id: "flower", attributes: { format: "Flower" } });
  const preRoll = product({ id: "pre-roll", attributes: { productType: "Pre-roll" } });
  const namedOnly = product({ id: "named", name: "Flower in the product name" });

  assert.deepEqual(filterThcaProducts([flower, preRoll, namedOnly], "flower").map((item) => item.id), ["flower"]);
  assert.deepEqual(filterThcaProducts([flower, preRoll, namedOnly], "pre-rolls").map((item) => item.id), ["pre-roll"]);
  assert.equal(parseThcaFormat("vapes"), "vapes");
  assert.equal(parseThcaFormat("sale"), null);
  assert.equal(parseThcaFormat(["flower"]), null);
});

test("multi-option cards do not silently select the first SKU", () => {
  const record = product({
    id: "multi",
    attributes: { format: "Flower", weight: "3.5 g", strain: "Profile one", potency: "99%" },
    secondAttributes: { format: "Flower", weight: "7 g", strain: "Profile two", potency: "98%" },
  });

  const model = thcaCardModel(record);
  assert.equal(model.exactDetailHref, null);
  assert.equal(model.options.length, 2);
  assert.deepEqual(model.facts, [
    { label: "Amount", value: "Varies by option" },
    { label: "Profile", value: "Varies by option" },
  ]);
  assert.equal(model.options[0]?.price, "$24.00");
  assert.equal(model.price, "From $24.00");
  assert.equal(model.merchandisable, true);
  assert.equal(model.facts.some((fact) => fact.label === "Potency"), false);
});

test("THCA cards fail closed when customer variants cannot resolve to one exact SKU", () => {
  const record = product({ id: "ambiguous", attributes: { format: "Flower" } });
  const variant = record.variants[0];
  assert.ok(variant);
  const ambiguous: StorefrontProduct = {
    ...record,
    variants: [{
      ...variant,
      skus: [
        ...variant.skus,
        {
          id: "ambiguous-second-id",
          sku: "ambiguous-SECOND",
          retailPrice: { amountCents: 2_900, currency: "USD" },
          availableQuantity: 2,
        },
      ],
    }],
  };

  const model = thcaCardModel(ambiguous);
  assert.equal(model.merchandisable, false);
  assert.equal(model.exactDetailHref, null);
  assert.deepEqual(model.options, []);
  assert.equal(model.price, "Price unavailable");
});

test("quantity facts require an explicit customer-facing unit or count basis", () => {
  const bareNumber = thcaCardModel(product({
    id: "bare-quantity",
    attributes: { format: "Flower", weight: 3.5, strain: "Profile one" },
  }));
  const unitQuantity = thcaCardModel(product({
    id: "unit-quantity",
    attributes: { format: "Flower", weight: "3.5 g", strain: "Profile one" },
  }));

  assert.equal(bareNumber.facts.some((fact) => fact.label === "Amount"), false);
  assert.deepEqual(unitQuantity.facts[0], { label: "Amount", value: "3.5 g" });
});

test("single-option and mixed availability states remain distinct", () => {
  const exact = thcaCardModel(product({
    id: "single",
    attributes: { format: "Gummy", quantity: "10 count", profile: "Unflavored" },
    firstQuantity: 0,
  }));
  const mixed = thcaCardModel(product({
    id: "mixed",
    attributes: { format: "Concentrate" },
    secondAttributes: { format: "Concentrate" },
    firstQuantity: 0,
    secondQuantity: 3,
  }));

  assert.equal(exact.exactDetailHref, "/products/single-SKU-ONE");
  assert.equal(exact.availability, "Out of stock");
  assert.equal(mixed.availability, "Options vary");
});

test("an empty canonical projection never becomes a claim that no records exist", () => {
  assert.deepEqual(thcaEmptyShelfCopy(null), {
    title: "No confirmed THCA products are on the shelf right now.",
    message: "Check again later.",
  });
  assert.equal(
    thcaEmptyShelfCopy("Flower").title,
    "No confirmed flower products are on the shelf right now.",
  );
});

test("the THCA collection surface stays retail-first", () => {
  const landing = readFileSync(
    new URL("../app/thca/ThcaDivisionLanding.tsx", import.meta.url),
    "utf8",
  );

  for (const manualCopy of [
    "Choose the format. Check the record.",
    "Start with form and amount",
    "Start with the facts that change.",
    "Proof follows the exact batch.",
  ]) {
    assert.doesNotMatch(landing, new RegExp(manualCopy.replaceAll(".", "\\.")));
  }

  assert.match(landing, /data-media-role="category-art-direction-safe"/);
  assert.match(landing, /Shop by format/);
  assert.match(landing, /const activeFormat = requestedFormat/);
  assert.doesNotMatch(landing, /option\.sku\.sku/);
  assert.doesNotMatch(landing, /THCA_PROOF_KEY|compareSection|proofRoute/);
});

test("THCA product detail reveal has hover, focus, and touch-complete states", () => {
  const styles = readFileSync(
    new URL("../app/thca/thca.module.css", import.meta.url),
    "utf8",
  );
  const media = readFileSync(
    new URL("../app/thca/ThcaProductMedia.tsx", import.meta.url),
    "utf8",
  );
  const rail = readFileSync(
    new URL("../app/thca/ThcaProductRail.tsx", import.meta.url),
    "utf8",
  );
  const shopRoute = readFileSync(
    new URL("../app/thca/shop/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(styles, /\.productReveal\s*\{[\s\S]*?position: absolute;/);
  assert.match(styles, /\.productCard:hover \.productReveal,[\s\S]*?\.productCard:focus-within \.productReveal/);
  assert.match(styles, /\.productCard:hover \.productImageSwapSource/);
  assert.doesNotMatch(styles, /\.productCard:hover \.productImage:not/);
  assert.match(styles, /@media \(min-width: 901px\) and \(hover: hover\) and \(pointer: fine\)/);
  assert.doesNotMatch(styles, /rgba\(17, 17, 15, 0\.94\)/);
  assert.match(media, /const hasAlternate = Boolean/);
  assert.match(media, /hasAlternate \? styles\.productImageSwapSource/);
  assert.match(rail, /scopeKey/);
  assert.match(rail, /aria-disabled=/);
  assert.doesNotMatch(rail, /\sdisabled=/);
  assert.match(shopRoute, /redirect\("\/thca"\)/);
});
