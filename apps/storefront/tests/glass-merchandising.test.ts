import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  GLASS_AISLES,
  GLASS_DEPARTMENTS,
  availableGlassAisles,
  availableGlassDepartments,
  filterGlassProducts,
  glassAislesForProduct,
  glassCardModel,
  glassEmptyShelfCopy,
  parseGlassAisle,
} from "../app/glass-accessories/glass-domain";
import type { StorefrontProduct } from "../lib/catalog/types";

function product({
  id,
  name = "Canonical Glass / Accessories / Merch product",
  attributes = {},
  secondAttributes,
  firstQuantity = 4,
  secondQuantity,
  firstPrice = 2_400,
  secondPrice = 3_600,
  firstCurrency = "USD",
  secondCurrency = "USD",
  secondName = "Option two",
}: Readonly<{
  id: string;
  name?: string;
  attributes?: Readonly<Record<string, unknown>>;
  secondAttributes?: Readonly<Record<string, unknown>>;
  firstQuantity?: number;
  secondQuantity?: number;
  firstPrice?: number;
  secondPrice?: number;
  firstCurrency?: string;
  secondCurrency?: string;
  secondName?: string;
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
          retailPrice: { amountCents: firstPrice, currency: firstCurrency },
          availableQuantity: firstQuantity,
        },
      ],
    },
  ];

  if (secondAttributes || secondQuantity !== undefined) {
    variants.push({
      id: `${id}-variant-two`,
      name: secondName,
      attributes: secondAttributes ?? {},
      skus: [
        {
          id: `${id}-sku-two-id`,
          sku: `${id}-SKU-TWO`,
          retailPrice: { amountCents: secondPrice, currency: secondCurrency },
          availableQuantity: secondQuantity ?? 4,
        },
      ],
    });
  }

  return {
    id,
    name,
    description:
      "Canonical test-only Glass / Accessories / Merch catalog record.",
    division: "GLASS_ACCESSORIES",
    publicationState: "PUBLISHED",
    variants,
    images: [],
  };
}

function slugs(record: StorefrontProduct) {
  return glassAislesForProduct(record).map((aisle) => aisle.slug);
}

test("the locked departments and aisle order preserve the three-room retail taxonomy", () => {
  assert.deepEqual(
    GLASS_DEPARTMENTS.map((department) => [department.slug, department.label]),
    [
      ["glass", "Glass"],
      ["accessories", "Accessories"],
      ["merch", "Merch"],
    ],
  );
  assert.deepEqual(
    GLASS_AISLES.map((aisle) => [aisle.slug, aisle.department]),
    [
      ["water-pipes", "glass"],
      ["hand-pipes", "glass"],
      ["bubblers", "glass"],
      ["rigs", "glass"],
      ["bowls", "glass"],
      ["bangers", "glass"],
      ["downstems", "accessories"],
      ["ash-catchers", "accessories"],
      ["adapters", "accessories"],
      ["replacement-parts", "accessories"],
      ["cleaning-care", "accessories"],
      ["storage-cases", "accessories"],
      ["grinders", "accessories"],
      ["torches-lighters", "accessories"],
      ["other-accessories", "accessories"],
      ["apparel", "merch"],
      ["hats", "merch"],
      ["bags", "merch"],
      ["stickers", "merch"],
      ["branded-goods", "merch"],
    ],
  );
});

test("every governed product-type alias maps exactly to its aisle", () => {
  for (const aisle of GLASS_AISLES) {
    if (aisle.slug === "other-accessories") continue;
    for (const alias of aisle.aliases) {
      const record = product({
        id: `${aisle.slug}-${alias.replaceAll(" ", "-")}`,
        attributes: { productType: alias },
      });
      assert.deepEqual(slugs(record), [aisle.slug], `${alias} must map exactly`);
    }
  }

  assert.deepEqual(
    slugs(product({ id: "underscored", attributes: { productType: "WATER_PIPE" } })),
    ["water-pipes"],
  );
  assert.deepEqual(
    slugs(product({ id: "hyphenated", attributes: { productType: "ASH-CATCHER" } })),
    ["ash-catchers"],
  );
  assert.deepEqual(
    slugs(
      product({
        id: "customer-facing-key",
        attributes: { customerFacingProductType: "  BRANDED_GOODS  " },
      }),
    ),
    ["branded-goods"],
  );
});

test("classification never comes from names, descriptions, categories, or broad prose", () => {
  const namedOnly = product({
    id: "named-only",
    name: "Bong water pipe bowl banger grinder hat",
    attributes: {
      category: "BONG",
      subcategory: "BANGER",
      style: "Water pipe",
      compatibleWith: "Every 14 mm piece",
    },
  });
  const unsupportedWithFallbackRole = product({
    id: "unsupported-with-role",
    attributes: { productType: "ROLLING_TRAY", productRole: "ACCESSORY" },
  });

  assert.deepEqual(slugs(namedOnly), []);
  assert.deepEqual(slugs(unsupportedWithFallbackRole), []);
  assert.deepEqual(
    availableGlassAisles([namedOnly, unsupportedWithFallbackRole]),
    [],
  );
});

test("role-only fallback is narrow and replacement is the only additive role", () => {
  const roleCases = [
    ["REPLACEMENT", ["replacement-parts"]],
    ["CARE_PRODUCT", ["cleaning-care"]],
    ["ACCESSORY", ["other-accessories"]],
    ["SESSION_TOOL", ["other-accessories"]],
    ["COMPLETE_PRODUCT", []],
    ["FITTED_COMPONENT", []],
    ["MAKER / ARTIST OBJECT", []],
  ] as const;

  for (const [role, expected] of roleCases) {
    assert.deepEqual(
      slugs(product({ id: role, attributes: { productRole: role } })),
      expected,
    );
  }

  assert.deepEqual(
    slugs(
      product({
        id: "replacement-bowl",
        attributes: { productType: "BOWL", productRole: "REPLACEMENT" },
      }),
    ),
    ["bowls", "replacement-parts"],
  );
  assert.deepEqual(
    slugs(
      product({
        id: "care-cleaner",
        attributes: { productType: "CLEANER", productRole: "CARE_PRODUCT" },
      }),
    ),
    ["cleaning-care"],
  );
  assert.deepEqual(
    slugs(
      product({
        id: "accessory-case",
        attributes: { productType: "CASE", productRole: "ACCESSORY" },
      }),
    ),
    ["storage-cases"],
  );
});

test("malformed, conflicting, or cross-variant classifications fail closed", () => {
  const records = [
    product({
      id: "conflicting-fields",
      attributes: {
        customerFacingProductType: "BOWL",
        productType: "BANGER",
      },
    }),
    product({
      id: "recognized-and-unsupported",
      attributes: {
        customerFacingProductType: "BOWL",
        productType: "ROLLING_TRAY",
      },
    }),
    product({
      id: "malformed-type",
      attributes: {
        customerFacingProductType: { internal: "BOWL" },
        productType: "BOWL",
      },
    }),
    product({
      id: "cross-variant-types",
      attributes: { productType: "BOWL" },
      secondAttributes: { productType: "BANGER" },
    }),
    product({
      id: "cross-variant-role-fallback",
      attributes: { productRole: "ACCESSORY" },
      secondAttributes: { productRole: "CARE_PRODUCT" },
    }),
    product({
      id: "ambiguous-role-only",
      attributes: {
        customerFacingProductRole: "ACCESSORY",
        productRole: "SESSION_TOOL",
      },
    }),
    product({
      id: "malformed-role-only",
      attributes: { productRole: { role: "ACCESSORY" } },
    }),
  ];

  records.forEach((record) => assert.deepEqual(slugs(record), []));
});

test("active departments and aisles derive only from classified canonical merchandise", () => {
  const waterPipe = product({
    id: "water-pipe",
    attributes: { productType: "WATER_PIPE" },
  });
  const replacementBowl = product({
    id: "replacement-bowl",
    attributes: { productType: "BOWL", productRole: "REPLACEMENT" },
  });
  const hat = product({ id: "hat", attributes: { productType: "HAT" } });
  const unclassified = product({ id: "unclassified" });

  assert.deepEqual(
    availableGlassAisles([waterPipe, replacementBowl, hat, unclassified]).map(
      (aisle) => [aisle.slug, aisle.count],
    ),
    [
      ["water-pipes", 1],
      ["bowls", 1],
      ["replacement-parts", 1],
      ["hats", 1],
    ],
  );
  assert.deepEqual(
    availableGlassDepartments([waterPipe, replacementBowl, hat, unclassified]).map(
      (department) => [
        department.slug,
        department.count,
        department.aisles.map((aisle) => aisle.slug),
      ],
    ),
    [
      ["glass", 2, ["water-pipes", "bowls"]],
      ["accessories", 1, ["replacement-parts"]],
      ["merch", 1, ["hats"]],
    ],
  );
});

test("unclassified products fail closed without invented aisle, facts, or fit", () => {
  const classified = product({
    id: "classified",
    attributes: { productType: "BOWL", material: "Borosilicate glass" },
  });
  const unclassified = product({
    id: "unclassified",
    attributes: {
      material: "Borosilicate glass",
      jointSize: "14 mm",
      jointGender: "Female",
      compatibleWith: "Unverified relationship",
    },
  });
  const model = glassCardModel(unclassified);

  assert.deepEqual(
    filterGlassProducts([classified, unclassified], null).map((item) => item.id),
    ["classified", "unclassified"],
  );
  assert.deepEqual(
    filterGlassProducts([classified, unclassified], "bowls").map(
      (item) => item.id,
    ),
    ["classified"],
  );
  assert.equal(model.typeLabel, null);
  assert.deepEqual(model.aisles, []);
  assert.deepEqual(model.facts, []);
  assert.equal(model.fitCue, null);
  assert.equal(model.merchandisable, false);
  assert.deepEqual(model.options, []);
  assert.equal(model.exactDetailHref, null);
  assert.equal(JSON.stringify(model).includes("Unverified relationship"), false);
});

test("glass cards expose no more than three concise role-specific facts", () => {
  const waterPipe = glassCardModel(
    product({
      id: "water-pipe-facts",
      attributes: {
        productType: "WATER_PIPE",
        material: "Borosilicate glass",
        height: "12 in",
        jointSize: "14 mm",
        jointGender: "Female",
        angle: "45°",
        count: "2 pieces",
      },
    }),
  );
  const banger = glassCardModel(
    product({
      id: "banger-facts",
      attributes: {
        productType: "BANGER",
        jointSize: "14 mm",
        jointGender: "Male",
        jointAngle: "90 degrees",
        material: "Quartz",
        compatibleWith: "Unverified piece ID",
      },
    }),
  );
  const apparel = glassCardModel(
    product({
      id: "apparel-facts",
      attributes: {
        productType: "APPAREL",
        size: "Large",
        color: "Black",
        material: "100% cotton",
        jointSize: "14 mm",
      },
    }),
  );

  assert.deepEqual(waterPipe.facts, [
    { label: "Material", value: "Borosilicate glass" },
    { label: "Height", value: "12 in" },
    { label: "Connection", value: "14 mm · Female" },
  ]);
  assert.deepEqual(banger.facts, [
    { label: "Connection", value: "14 mm · Male" },
    { label: "Angle", value: "90 degrees" },
    { label: "Material", value: "Quartz" },
  ]);
  assert.deepEqual(apparel.facts, [
    { label: "Size", value: "Large" },
    { label: "Color", value: "Black" },
    { label: "Material", value: "100% cotton" },
  ]);
  assert.equal(waterPipe.facts.length, 3);
  assert.equal(banger.facts.length, 3);
  assert.equal(JSON.stringify(banger).includes("piece ID"), false);
});

test("fitted aisles disclose missing fit and never turn attributes into a positive claim", () => {
  const fittedTypes = [
    "BOWL",
    "BANGER",
    "DOWNSTEM",
    "ASH_CATCHER",
    "ADAPTER",
    "REPLACEMENT_PART",
  ];
  for (const type of fittedTypes) {
    const model = glassCardModel(
      product({
        id: type,
        attributes: {
          productType: type,
          jointSize: "14 mm",
          jointGender: "Female",
          fits: "All 14 mm pieces",
          compatibleWith: "Verified-looking but ungoverned product ID",
          fitStatus: "COMPATIBLE",
        },
      }),
    );
    assert.deepEqual(model.fitCue, {
      label: "Fit",
      value: "Fit not specified",
    });
    assert.equal(model.actionLabel, "View details");
    assert.doesNotMatch(
      JSON.stringify(model),
      /All 14 mm pieces|product ID|COMPATIBLE/,
    );
  }

  assert.equal(
    glassCardModel(
      product({ id: "water-pipe", attributes: { productType: "WATER_PIPE" } }),
    ).fitCue,
    null,
  );
  assert.equal(
    glassCardModel(
      product({ id: "apparel", attributes: { productType: "APPAREL" } }),
    ).fitCue,
    null,
  );
  const replacementApparel = glassCardModel(
    product({
      id: "replacement-apparel",
      attributes: { productType: "APPAREL", productRole: "REPLACEMENT" },
    }),
  );
  assert.equal(replacementApparel.typeLabel, "Apparel");
  assert.equal(replacementApparel.fitCue, null);
});

test("measurements, counts, and customer labels reject malformed or internal claims", () => {
  const malformed = [
    product({
      id: "zero-measurement",
      attributes: { productType: "WATER_PIPE", height: "0 in" },
    }),
    product({
      id: "missing-unit",
      attributes: { productType: "WATER_PIPE", height: "12" },
    }),
    product({
      id: "zero-joint",
      attributes: { productType: "BOWL", jointSize: "0 mm" },
    }),
    product({
      id: "unsupported-gender",
      attributes: { productType: "BOWL", jointGender: "Universal" },
    }),
    product({
      id: "invalid-angle",
      attributes: { productType: "BANGER", angle: "180°" },
    }),
    product({
      id: "zero-count",
      attributes: { productType: "STICKER", count: "0 pack" },
    }),
    product({
      id: "internal-material",
      attributes: { productType: "WATER_PIPE", material: "Test-buy candidate" },
    }),
    product({
      id: "watch-color",
      attributes: { productType: "HAT", color: "Watch" },
    }),
    product({
      id: "unverified-material",
      attributes: { productType: "WATER_PIPE", material: "Unverified" },
    }),
    product({
      id: "unknown-size",
      attributes: { productType: "APPAREL", size: "Unknown" },
    }),
  ];

  malformed.forEach((record) =>
    assert.deepEqual(glassCardModel(record).facts, []),
  );

  const conflictingAliases = glassCardModel(
    product({
      id: "conflicting-aliases",
      attributes: {
        productType: "BOWL",
        jointSize: "14 mm",
        connectionSize: "18 mm",
        jointGender: "Female",
      },
    }),
  );
  assert.deepEqual(conflictingAliases.facts, [
    { label: "Connection", value: "Female" },
  ]);
});

test("multi-option products preserve option choice and variant-level differences", () => {
  const record = product({
    id: "multi-option",
    attributes: {
      productType: "APPAREL",
      size: "Small",
      color: "Black",
      material: "Cotton",
    },
    secondAttributes: {
      productType: "APPAREL",
      size: "Large",
      color: "Black",
      material: "Cotton",
    },
    firstPrice: 2_400,
    secondPrice: 3_600,
  });
  const model = glassCardModel(record);

  assert.equal(model.merchandisable, true);
  assert.equal(model.options.length, 2);
  assert.equal(model.exactDetailHref, null);
  assert.equal(model.price, "From $24.00");
  assert.equal(model.availability, "Available");
  assert.equal(model.actionLabel, "View details");
  assert.deepEqual(model.facts, [
    { label: "Size", value: "Varies by option" },
    { label: "Color", value: "Black" },
    { label: "Material", value: "Cotton" },
  ]);
});

test("cards fail closed when a customer option cannot resolve to one exact SKU", () => {
  const record = product({
    id: "ambiguous",
    attributes: { productType: "BOWL" },
  });
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
  const duplicateNames = product({
    id: "duplicate-names",
    attributes: { productType: "HAT" },
    secondAttributes: { productType: "HAT" },
    secondName: " option ONE ",
  });

  for (const blocked of [ambiguous, duplicateNames]) {
    const model = glassCardModel(blocked);
    assert.equal(model.merchandisable, false);
    assert.equal(model.exactDetailHref, null);
    assert.deepEqual(model.options, []);
    assert.equal(model.price, "Price unavailable");
    assert.equal(model.availability, "Availability unknown");
  }
});

test("availability, price, exact links, and actions preserve operational states", () => {
  const available = glassCardModel(
    product({ id: "available", attributes: { productType: "BAG" }, firstQuantity: 2 }),
  );
  const soldOut = glassCardModel(
    product({ id: "sold-out", attributes: { productType: "BAG" }, firstQuantity: 0 }),
  );
  const unknown = glassCardModel(
    product({ id: "unknown", attributes: { productType: "BAG" }, firstQuantity: -1 }),
  );
  const mixed = glassCardModel(
    product({
      id: "mixed",
      attributes: { productType: "BAG" },
      secondAttributes: { productType: "BAG" },
      firstQuantity: 0,
      secondQuantity: 3,
      firstPrice: 1_200,
      secondPrice: 3_600,
    }),
  );
  const unknownOption = glassCardModel(
    product({
      id: "unknown-option",
      attributes: { productType: "BAG" },
      secondAttributes: { productType: "BAG" },
      firstQuantity: -1,
      secondQuantity: 3,
    }),
  );
  const mixedCurrency = glassCardModel(
    product({
      id: "mixed-currency",
      attributes: { productType: "BAG" },
      secondAttributes: { productType: "BAG" },
      firstCurrency: "USD",
      secondCurrency: "CAD",
    }),
  );

  assert.equal(available.price, "$24.00");
  assert.equal(available.availability, "Available");
  assert.equal(available.exactDetailHref, "/products/available-SKU-ONE");
  assert.equal(available.actionLabel, "View product");
  assert.equal(soldOut.availability, "Sold out");
  assert.equal(soldOut.actionLabel, "View details");
  assert.equal(unknown.availability, "Availability unknown");
  assert.equal(unknown.actionLabel, "View details");
  assert.equal(mixed.availability, "Options vary");
  assert.equal(mixed.price, "$36.00");
  assert.equal(unknownOption.availability, "Availability unknown");
  assert.equal(mixedCurrency.price, "Price varies by currency");
});

test("aisle parsing, filtering, and honest empty copy remain bounded", () => {
  const bowl = product({ id: "bowl", attributes: { productType: "BOWL" } });
  const hat = product({ id: "hat", attributes: { productType: "HAT" } });

  assert.equal(parseGlassAisle("bowls"), "bowls");
  assert.equal(parseGlassAisle("14-mm"), null);
  assert.equal(parseGlassAisle(["bowls"]), null);
  assert.deepEqual(
    filterGlassProducts([bowl, hat], "hats").map((item) => item.id),
    ["hat"],
  );
  assert.deepEqual(glassEmptyShelfCopy(null), {
    title: "No Glass / Accessories / Merch products are on the shelf right now.",
    message: "Check again later.",
  });
  assert.deepEqual(glassEmptyShelfCopy("Bowls"), {
    title: "No bowls are on the shelf right now.",
    message: "Check again later.",
  });
});

test("the Glass collection remains retail-first, touch-complete, and route-local", () => {
  const landing = readFileSync(
    new URL("../app/glass-accessories/GlassDivisionLanding.tsx", import.meta.url),
    "utf8",
  );
  const styles = readFileSync(
    new URL("../app/glass-accessories/glass.module.css", import.meta.url),
    "utf8",
  );
  const media = readFileSync(
    new URL("../app/glass-accessories/GlassProductMedia.tsx", import.meta.url),
    "utf8",
  );
  const route = readFileSync(
    new URL("../app/glass-accessories/page.tsx", import.meta.url),
    "utf8",
  );
  const shopRoute = readFileSync(
    new URL("../app/glass-accessories/shop/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(landing, /Shop by department/);
  assert.match(landing, /availableGlassDepartments/);
  assert.match(landing, /department\.label/);
  assert.match(landing, /data-media-role="category-art-direction-safe"/);
  assert.match(landing, /model\.availability === "Available" \? null/);
  assert.doesNotMatch(
    landing,
    /Add to cart|Shop now|compatibility graph|joint architecture|fit methodology/i,
  );
  assert.doesNotMatch(
    route,
    /@\/components\/(?:DivisionLanding|CategoryLanding)|DIVISIONS/,
  );
  assert.match(shopRoute, /redirect\("\/glass-accessories"\)/);
  assert.match(styles, /aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(
    styles,
    /@media \(min-width: 901px\) and \(hover: hover\) and \(pointer: fine\)/,
  );
  assert.match(
    styles,
    /\.productCard:hover \.productReveal,[\s\S]*?\.productCard:focus-within \.productReveal/,
  );
  assert.match(styles, /@media \(max-width: 680px\)[\s\S]*?\.productReveal/);
  assert.doesNotMatch(styles, /linear-gradient|color-mix/);
  assert.match(media, /Product image unavailable for/);
  assert.doesNotMatch(media, /placeholder|stock photo/i);
});
