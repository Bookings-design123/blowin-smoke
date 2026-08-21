import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  availableVapeAisles,
  filterVapeProducts,
  parseVapeAisle,
  vapeAislesForProduct,
  vapeCardModel,
  vapeEmptyShelfCopy,
} from "../app/vape-nicotine/vape-domain";
import type { StorefrontProduct } from "../lib/catalog/types";

function product({
  id,
  name = "Canonical Vape / Nicotine product",
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
    description: "Canonical test-only Vape / Nicotine record.",
    division: "VAPE_NICOTINE",
    publicationState: "PUBLISHED",
    variants,
    images: [],
  };
}

test("aisles activate only from explicit controlled canonical attributes", () => {
  const namedOnly = product({
    id: "named-only",
    name: "Disposable pod coil e-liquid device kit",
  });
  const genericCategory = product({
    id: "generic-category",
    attributes: { category: "DISPOSABLE_DEVICE", role: "ACCESSORY" },
  });
  const records = [
    product({ id: "disposable", attributes: { productType: "DISPOSABLE_DEVICE" } }),
    product({ id: "pod-system", attributes: { productType: "POD_SYSTEM" } }),
    product({ id: "pod", attributes: { customerFacingProductType: "PREFILLED_POD" } }),
    product({ id: "coil", attributes: { productType: "COIL", productRole: "REPLACEMENT" } }),
    product({ id: "device", attributes: { productType: "KIT" } }),
    product({ id: "e-liquid", attributes: { productType: "E_LIQUID", nicotineType: "Nic salt" } }),
    product({ id: "part", attributes: { productType: "CHARGING_CABLE" } }),
  ];

  assert.deepEqual(vapeAislesForProduct(namedOnly), []);
  assert.deepEqual(vapeAislesForProduct(genericCategory), []);
  assert.deepEqual(
    records.flatMap((record) => vapeAislesForProduct(record).map((aisle) => aisle.slug)),
    [
      "disposables",
      "pod-systems",
      "pods",
      "coils",
      "devices-kits",
      "e-liquid",
      "parts-accessories",
    ],
  );
  assert.deepEqual(
    availableVapeAisles([namedOnly, genericCategory, ...records]).map((aisle) => [
      aisle.slug,
      aisle.count,
    ]),
    [
      ["disposables", 1],
      ["pod-systems", 1],
      ["pods", 1],
      ["coils", 1],
      ["devices-kits", 1],
      ["e-liquid", 1],
      ["parts-accessories", 1],
    ],
  );
});

test("controlled repository enum values map without broad role inference", () => {
  const refillableDevice = product({
    id: "refillable-device",
    attributes: { productType: "REFILLABLE_DEVICE", productRole: "COMPLETE_PRODUCT" },
  });
  const sleeve = product({
    id: "sleeve",
    attributes: { productType: "PROTECTIVE_SLEEVE", productRole: "ACCESSORY" },
  });
  const roleOnlyReplacement = product({
    id: "role-only-replacement",
    attributes: { productRole: "REPLACEMENT" },
  });
  const roleOnlyAccessory = product({
    id: "role-only-accessory",
    attributes: { productRole: "ACCESSORY" },
  });
  const unsupportedTypeWithAccessoryRole = product({
    id: "unsupported-type-with-accessory-role",
    attributes: { productType: "NICOTINE_POUCH", productRole: "ACCESSORY" },
  });

  assert.deepEqual(vapeAislesForProduct(refillableDevice).map((aisle) => aisle.slug), [
    "devices-kits",
  ]);
  assert.deepEqual(vapeAislesForProduct(sleeve).map((aisle) => aisle.slug), [
    "parts-accessories",
  ]);
  assert.deepEqual(vapeAislesForProduct(roleOnlyReplacement), []);
  assert.deepEqual(vapeAislesForProduct(roleOnlyAccessory).map((aisle) => aisle.slug), [
    "parts-accessories",
  ]);
  assert.deepEqual(vapeAislesForProduct(unsupportedTypeWithAccessoryRole), []);
});

test("conflicting or cross-variant product types fail closed", () => {
  const conflictingFields = product({
    id: "conflicting-fields",
    attributes: {
      customerFacingProductType: "DISPOSABLE_DEVICE",
      productType: "E_LIQUID",
    },
  });
  const conflictingVariants = product({
    id: "conflicting-variants",
    attributes: { productType: "POD" },
    secondAttributes: { productType: "COIL" },
  });
  const recognizedAndUnsupported = product({
    id: "recognized-and-unsupported",
    attributes: {
      customerFacingProductType: "POD",
      productType: "NICOTINE_POUCH",
    },
  });
  const malformedAndRecognized = product({
    id: "malformed-and-recognized",
    attributes: {
      customerFacingProductType: { internal: "NICOTINE_POUCH" },
      productType: "POD",
    },
  });
  const malformedWithAccessoryRole = product({
    id: "malformed-with-accessory-role",
    attributes: {
      productType: {},
      productRole: "ACCESSORY",
    },
  });

  assert.deepEqual(vapeAislesForProduct(conflictingFields), []);
  assert.deepEqual(vapeAislesForProduct(conflictingVariants), []);
  assert.deepEqual(vapeAislesForProduct(recognizedAndUnsupported), []);
  assert.deepEqual(vapeAislesForProduct(malformedAndRecognized), []);
  assert.deepEqual(vapeAislesForProduct(malformedWithAccessoryRole), []);
});

test("nicotine format is an e-liquid fact, not a manufactured standalone aisle", () => {
  const saltOnly = product({ id: "salt-only", attributes: { nicotineFormat: "Nic salt" } });
  const saltLiquid = product({
    id: "salt-liquid",
    attributes: {
      productType: "E-liquid",
      nicotineFormat: "Nicotine salt",
      nicotineStrength: "20mg/mL",
      flavor: "Mint",
      volume: "30mL",
    },
  });

  assert.deepEqual(vapeAislesForProduct(saltOnly), []);
  assert.deepEqual(vapeAislesForProduct(saltLiquid).map((aisle) => aisle.slug), ["e-liquid"]);
  assert.equal(vapeCardModel(saltLiquid).typeLabel, "Nic salt e-liquid");
  assert.deepEqual(vapeCardModel(saltLiquid).facts, [
    { label: "Flavor", value: "Mint" },
    { label: "Nicotine", value: "Nic salt" },
    { label: "Strength", value: "20mg/mL" },
  ]);
});

test("aisle filtering never infers membership from product prose", () => {
  const disposable = product({ id: "disposable", attributes: { productType: "DISPOSABLE" } });
  const namedOnly = product({ id: "named", name: "Disposable in the product name" });

  assert.deepEqual(
    filterVapeProducts([disposable, namedOnly], "disposables").map((item) => item.id),
    ["disposable"],
  );
  assert.equal(parseVapeAisle("pods"), "pods");
  assert.equal(parseVapeAisle("nic-salts"), null);
  assert.equal(parseVapeAisle(["pods"]), null);
});

test("cards expose a maximum of three useful role-specific facts", () => {
  const disposable = vapeCardModel(
    product({
      id: "facts",
      attributes: {
        productType: "DISPOSABLE_DEVICE",
        flavor: "Mint",
        nicotineStrength: "5%",
        puffCount: "10,000 puffs",
        capacity: "18mL",
        rechargeable: true,
        compatibleWith: "Unverified platform ID must remain hidden",
      },
    }),
  );

  assert.deepEqual(disposable.facts, [
    { label: "Flavor", value: "Mint" },
    { label: "Strength", value: "5%" },
    { label: "Puff claim", value: "10,000" },
  ]);
  assert.equal(disposable.compatibilityCue, null);
  assert.equal(JSON.stringify(disposable).includes("platform ID"), false);
});

test("annotated measurements and ambiguous internal keys never become retail facts", () => {
  const model = vapeCardModel(
    product({
      id: "annotated",
      attributes: {
        productType: "DISPOSABLE_DEVICE",
        nicotineStrength: "5% — test-buy candidate",
        batteryCapacity: "1000mAh (unverified)",
        capacity: "30mL / research only",
        profile: "Internal profile",
        quantity: "999 units",
      },
    }),
  );
  const mixedAliases = vapeCardModel(
    product({
      id: "mixed-aliases",
      attributes: {
        productType: "DISPOSABLE_DEVICE",
        nicotineStrength: "5%",
        strength: "5% — test-buy candidate",
        capacity: "research only",
        volume: "30mL",
      },
    }),
  );

  assert.deepEqual(model.facts, []);
  assert.deepEqual(mixedAliases.facts, []);
  assert.equal(JSON.stringify(model).includes("test-buy"), false);
  assert.equal(JSON.stringify(model).includes("Internal profile"), false);
});

test("quantitative product claims must be positive and well formed", () => {
  const zeroPuffs = vapeCardModel(
    product({
      id: "zero-puffs",
      attributes: { productType: "DISPOSABLE_DEVICE", puffCount: "0 puffs" },
    }),
  );
  const malformedPuffs = vapeCardModel(
    product({
      id: "malformed-puffs",
      attributes: { productType: "DISPOSABLE_DEVICE", puffCount: "1,,000 puffs" },
    }),
  );
  const zeroCount = vapeCardModel(
    product({
      id: "zero-count",
      attributes: { productType: "POD", packageCount: "0 pack" },
    }),
  );
  const fractionalPuffs = vapeCardModel(
    product({
      id: "fractional-puffs",
      attributes: { productType: "DISPOSABLE_DEVICE", puffCount: "1.5 puffs" },
    }),
  );
  const decimalThousands = vapeCardModel(
    product({
      id: "decimal-thousands",
      attributes: { productType: "DISPOSABLE_DEVICE", puffCount: "1.5K puffs" },
    }),
  );
  const unsafeCount = vapeCardModel(
    product({
      id: "unsafe-count",
      attributes: {
        productType: "POD",
        packageCount: "999999999999999999999 pack",
      },
    }),
  );

  assert.deepEqual(zeroPuffs.facts, []);
  assert.deepEqual(malformedPuffs.facts, []);
  assert.deepEqual(zeroCount.facts, []);
  assert.deepEqual(fractionalPuffs.facts, []);
  assert.deepEqual(decimalThousands.facts, [{ label: "Puff claim", value: "1.5K" }]);
  assert.deepEqual(unsafeCount.facts, []);
});

test("malformed role facts never become customer-facing claims", () => {
  const records = [
    product({
      id: "numeric-flavor",
      attributes: { productType: "DISPOSABLE_DEVICE", flavor: 42 },
    }),
    product({
      id: "boolean-flavor",
      attributes: { productType: "DISPOSABLE_DEVICE", flavor: false },
    }),
    product({
      id: "internal-flavor",
      attributes: { productType: "DISPOSABLE_DEVICE", flavor: "Test-buy candidate" },
    }),
    product({
      id: "watch-flavor",
      attributes: { productType: "DISPOSABLE_DEVICE", flavor: "Watch" },
    }),
    product({
      id: "zero-capacity",
      attributes: { productType: "DISPOSABLE_DEVICE", capacity: "0mL" },
    }),
    product({
      id: "zero-battery",
      attributes: { productType: "POD_SYSTEM", batteryCapacity: "0mAh" },
    }),
    product({
      id: "zero-resistance",
      attributes: { productType: "COIL", resistance: "0Ω" },
    }),
    product({
      id: "zero-power",
      attributes: { productType: "DEVICE", wattage: "0W" },
    }),
    product({
      id: "descending-power",
      attributes: { productType: "DEVICE", powerRange: "80-20W" },
    }),
    product({
      id: "impossible-strength",
      attributes: { productType: "DISPOSABLE_DEVICE", nicotineStrength: "101%" },
    }),
    product({
      id: "ambiguous-composition",
      attributes: { productType: "E_LIQUID", composition: "70/30" },
    }),
    product({
      id: "impossible-composition",
      attributes: { productType: "E_LIQUID", vgPgRatio: "999/999" },
    }),
  ];

  records.forEach((record) => assert.deepEqual(vapeCardModel(record).facts, []));
  assert.deepEqual(
    vapeCardModel(
      product({
        id: "valid-composition",
        attributes: { productType: "E_LIQUID", vgPgRatio: "70/30" },
      }),
    ).facts,
    [{ label: "VG / PG", value: "70/30" }],
  );
});

test("compatibility stays concise and never becomes an inferred positive fit claim", () => {
  const pod = vapeCardModel(
    product({
      id: "pod-fit",
      attributes: {
        productType: "POD",
        compatibleWith: "Device family from an ungoverned attribute",
        capacity: "2mL",
        resistance: "0.8 ohm",
        packageCount: "2 pack",
      },
    }),
  );
  const device = vapeCardModel(
    product({ id: "device-fit", attributes: { productType: "Pod system" } }),
  );

  assert.deepEqual(pod.compatibilityCue, { label: "Fit", value: "Unverified" });
  assert.deepEqual(device.compatibilityCue, {
    label: "Replacements",
    value: "Unverified",
  });
  assert.equal(JSON.stringify(pod).includes("Device family"), false);
});

test("multi-option cards do not silently select a SKU", () => {
  const record = product({
    id: "multi",
    attributes: { productType: "E-liquid", flavor: "Mint", nicotineStrength: "20mg/mL" },
    secondAttributes: {
      productType: "E-liquid",
      flavor: "Berry",
      nicotineStrength: "35mg/mL",
    },
  });
  const model = vapeCardModel(record);

  assert.equal(model.exactDetailHref, null);
  assert.equal(model.options.length, 2);
  assert.equal(model.price, "From $24.00");
  assert.equal(model.availability, "Available");
  assert.equal(model.merchandisable, true);
  assert.deepEqual(model.facts, [
    { label: "Flavor", value: "Varies by option" },
    { label: "Strength", value: "Varies by option" },
  ]);
});

test("cards fail closed when a customer option cannot resolve to one exact SKU", () => {
  const record = product({ id: "ambiguous", attributes: { productType: "Coil" } });
  const variant = record.variants[0];
  assert.ok(variant);
  const ambiguous: StorefrontProduct = {
    ...record,
    variants: [
      {
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
      },
    ],
  };

  const model = vapeCardModel(ambiguous);
  assert.equal(model.merchandisable, false);
  assert.equal(model.exactDetailHref, null);
  assert.deepEqual(model.options, []);
  assert.equal(model.price, "Price unavailable");
});

test("availability and actions preserve exact operational states", () => {
  const available = vapeCardModel(product({ id: "available", firstQuantity: 2 }));
  const soldOut = vapeCardModel(product({ id: "sold-out", firstQuantity: 0 }));
  const unknown = vapeCardModel(product({ id: "unknown", firstQuantity: -1 }));
  const mixed = vapeCardModel(
    product({ id: "mixed", secondAttributes: {}, firstQuantity: 0, secondQuantity: 3 }),
  );

  assert.equal(available.actionLabel, "View product");
  assert.equal(soldOut.availability, "Sold out");
  assert.equal(soldOut.actionLabel, "View details");
  assert.equal(unknown.availability, "Availability unknown");
  assert.equal(unknown.actionLabel, "View details");
  assert.equal(mixed.availability, "Options vary");
});

test("empty states report only what the canonical projection supports", () => {
  assert.deepEqual(vapeEmptyShelfCopy(null), {
    title: "No confirmed Vape / Nicotine products are on the shelf right now.",
    message: "Check again later.",
  });
  assert.equal(
    vapeEmptyShelfCopy("Pods").title,
    "No confirmed pods are on the shelf right now.",
  );
});

test("the Vape / Nicotine collection remains retail-first and touch-complete", () => {
  const landing = readFileSync(
    new URL("../app/vape-nicotine/VapeDivisionLanding.tsx", import.meta.url),
    "utf8",
  );
  const styles = readFileSync(
    new URL("../app/vape-nicotine/vape.module.css", import.meta.url),
    "utf8",
  );
  const media = readFileSync(
    new URL("../app/vape-nicotine/VapeProductMedia.tsx", import.meta.url),
    "utf8",
  );
  const rail = readFileSync(
    new URL("../app/vape-nicotine/VapeProductRail.tsx", import.meta.url),
    "utf8",
  );
  const shopRoute = readFileSync(
    new URL("../app/vape-nicotine/shop/page.tsx", import.meta.url),
    "utf8",
  );

  for (const manualCopy of [
    "system architecture",
    "replacement pathway",
    "vape ecosystem",
    "how vaping works",
  ]) {
    assert.doesNotMatch(landing, new RegExp(manualCopy, "i"));
  }

  assert.match(landing, /data-media-role="category-art-direction-safe"/);
  assert.match(landing, /Shop by aisle/);
  assert.match(landing, /availableVapeAisles/);
  assert.doesNotMatch(landing, /Add to cart|Notify me|Shop now/);
  assert.doesNotMatch(landing, /option\.sku\.sku/);
  assert.match(styles, /@media \(min-width: 901px\) and \(hover: hover\) and \(pointer: fine\)/);
  assert.match(styles, /\.productCard:hover \.productReveal,[\s\S]*?\.productCard:focus-within \.productReveal/);
  assert.match(styles, /@media \(max-width: 680px\)[\s\S]*?flex-basis: max\(244px, 78vw\)/);
  assert.match(media, /aria-label={`Product image unavailable for \$\{productName\}`}/);
  assert.match(rail, /scopeKey/);
  assert.match(rail, /aria-disabled=/);
  assert.doesNotMatch(rail, /\sdisabled=/);
  assert.match(shopRoute, /redirect\("\/vape-nicotine"\)/);
});
