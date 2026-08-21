import assert from "node:assert/strict";
import test from "node:test";

import {
  getPublishedProductBySku,
  normalizeCatalogPayload,
  normalizePublicProduct,
} from "../lib/catalog/api";
import {
  deriveDecisionState,
  filterAndSortProducts,
  productPriceLabel,
} from "../lib/catalog/domain";
import type { DivisionKey, StorefrontProduct } from "../lib/catalog/types";

function testProductRecord({
  id,
  division = "THCA",
  name = "TEST PUBLISHED PRODUCT",
  description = "TEST-ONLY catalog fixture",
  sku = `${id}-SKU`,
  amountCents = 1_900,
  availableQuantity = 4,
}: {
  id: string;
  division?: DivisionKey;
  name?: string;
  description?: string;
  sku?: string;
  amountCents?: number;
  availableQuantity?: number;
}) {
  return {
    id,
    name,
    description,
    division,
    publicationState: "PUBLISHED",
    variants: [
      {
        id: `${id}-VARIANT`,
        name: "TEST VARIANT",
        attributes: { format: "TEST FORMAT" },
        skus: [
          {
            id: `${id}-SKU-ID`,
            sku,
            retailPrice: { amountCents, currency: "USD" },
            availableQuantity,
          },
        ],
      },
    ],
    images: [],
  };
}

function normalizedTestProduct(
  options: Parameters<typeof testProductRecord>[0],
): StorefrontProduct {
  const product = normalizePublicProduct(testProductRecord(options));
  assert.ok(product, "the test fixture must satisfy the public product contract");
  return product;
}

test("normalizePublicProduct accepts the modern published public projection", () => {
  const product = normalizePublicProduct({
    ...testProductRecord({
      id: "TEST-MODERN-001",
      name: "  TEST MODERN PRODUCT  ",
      description: "  TEST description  ",
      sku: "TEST-MODERN-SKU-001",
      amountCents: 2_499,
      availableQuantity: 7,
    }),
    images: [
      {
        id: "TEST-MEDIA-001",
        filename: "test-product.webp",
        contentType: "image/webp",
        byteLength: 2_048,
        checksum: "TEST-CHECKSUM-001",
        url: "/api/media/TEST-MEDIA-001",
      },
    ],
  });

  assert.ok(product);
  assert.equal(product.name, "TEST MODERN PRODUCT");
  assert.equal(product.description, "TEST description");
  assert.equal(product.publicationState, "PUBLISHED");
  assert.equal(product.variants[0]?.skus[0]?.sku, "TEST-MODERN-SKU-001");
  assert.deepEqual(product.variants[0]?.skus[0]?.retailPrice, {
    amountCents: 2_499,
    currency: "USD",
  });
  assert.equal(product.variants[0]?.skus[0]?.availableQuantity, 7);
  assert.equal(product.images[0]?.id, "TEST-MEDIA-001");
});

test("normalizeCatalogPayload suppresses legacy, unpublished, and malformed records", () => {
  const modern = testProductRecord({ id: "TEST-VALID-001" });
  const legacyFlatRecord = {
    id: "TEST-LEGACY-001",
    name: "TEST LEGACY FLAT PRODUCT",
    description: "TEST-ONLY legacy fixture",
    division: "THCA",
    publicationState: "PUBLISHED",
    sku: "TEST-LEGACY-SKU-001",
    retailPrice: { amountCents: 1_500, currency: "USD" },
    availableQuantity: 9,
  };
  const unpublished = {
    ...testProductRecord({ id: "TEST-DRAFT-001" }),
    publicationState: "DRAFT",
  };
  const malformed = {
    ...testProductRecord({ id: "TEST-MALFORMED-001" }),
    variants: [],
  };

  const snapshot = normalizeCatalogPayload({
    products: [modern, legacyFlatRecord, unpublished, malformed, null],
  });

  assert.equal(snapshot.status, "ready");
  assert.deepEqual(snapshot.products.map((product) => product.id), ["TEST-VALID-001"]);
  assert.equal(snapshot.suppressedRecords, 4);

  assert.deepEqual(normalizeCatalogPayload({ items: [modern] }), {
    status: "error",
    products: [],
    suppressedRecords: 0,
    message:
      "Published catalog data is temporarily unavailable. House routes and guides remain available.",
  });
});

test("normalization suppresses a whole product instead of publishing a partial option set", () => {
  const base = testProductRecord({ id: "TEST-NESTED-PARTIAL" });
  const validVariant = base.variants[0];
  assert.ok(validVariant);

  const malformedSkuProduct = {
    ...base,
    variants: [{
      ...validVariant,
      skus: [...validVariant.skus, { id: "BROKEN-SKU" }],
    }],
  };
  const malformedVariantProduct = {
    ...base,
    id: "TEST-NESTED-VARIANT",
    variants: [...base.variants, { id: "BROKEN-VARIANT", name: "Broken", skus: [] }],
  };

  assert.equal(normalizePublicProduct(malformedSkuProduct), null);
  assert.equal(normalizePublicProduct(malformedVariantProduct), null);
  const snapshot = normalizeCatalogPayload({
    products: [base, malformedSkuProduct, malformedVariantProduct],
  });
  assert.equal(snapshot.status, "ready");
  assert.deepEqual(snapshot.products.map((product) => product.id), ["TEST-NESTED-PARTIAL"]);
  assert.equal(snapshot.suppressedRecords, 2);
});

test("a 2xx product lookup fails unavailable rather than inventing a 404", async () => {
  const previousOrigin = process.env.STOREFRONT_COMMERCE_API_ORIGIN;
  const previousFetch = globalThis.fetch;
  process.env.STOREFRONT_COMMERCE_API_ORIGIN = "https://canonical.test";

  try {
    let response = new Response(JSON.stringify({
      product: {
        ...testProductRecord({ id: "TEST-LOOKUP-MALFORMED" }),
        variants: [{ id: "BROKEN", name: "Broken", skus: [] }],
      },
    }), { status: 200, headers: { "content-type": "application/json" } });
    globalThis.fetch = (async () => response.clone()) as typeof fetch;

    assert.deepEqual(await getPublishedProductBySku("TEST-LOOKUP-MALFORMED-SKU"), {
      status: "error",
      message: "Published catalog data is temporarily unavailable. House routes and guides remain available.",
    });

    response = new Response(JSON.stringify({
      product: testProductRecord({
        id: "TEST-LOOKUP-MISMATCH",
        sku: "TEST-CANONICAL-OTHER-SKU",
      }),
    }), { status: 200, headers: { "content-type": "application/json" } });

    assert.deepEqual(await getPublishedProductBySku("TEST-LOOKUP-MISSING-SKU"), {
      status: "error",
      message: "Published catalog data is temporarily unavailable. House routes and guides remain available.",
    });

    response = new Response(null, { status: 404 });
    assert.deepEqual(await getPublishedProductBySku("TEST-LOOKUP-CANONICAL-404"), {
      status: "not-found",
    });
  } finally {
    globalThis.fetch = previousFetch;
    if (previousOrigin === undefined) {
      delete process.env.STOREFRONT_COMMERCE_API_ORIGIN;
    } else {
      process.env.STOREFRONT_COMMERCE_API_ORIGIN = previousOrigin;
    }
  }
});

test("productPriceLabel derives exact, range, and mixed-currency labels from SKUs", () => {
  const exact = normalizedTestProduct({
    id: "TEST-PRICE-EXACT",
    amountCents: 950,
  });
  const range = normalizePublicProduct({
    ...testProductRecord({ id: "TEST-PRICE-RANGE", amountCents: 1_250 }),
    variants: [
      {
        id: "TEST-PRICE-RANGE-VARIANT",
        name: "TEST RANGE VARIANT",
        attributes: {},
        skus: [
          {
            id: "TEST-PRICE-RANGE-LOW-ID",
            sku: "TEST-PRICE-RANGE-LOW",
            retailPrice: { amountCents: 1_250, currency: "USD" },
            availableQuantity: 1,
          },
          {
            id: "TEST-PRICE-RANGE-HIGH-ID",
            sku: "TEST-PRICE-RANGE-HIGH",
            retailPrice: { amountCents: 2_500, currency: "USD" },
            availableQuantity: 1,
          },
        ],
      },
    ],
  });
  const mixedCurrency = normalizePublicProduct({
    ...testProductRecord({ id: "TEST-PRICE-MIXED" }),
    variants: [
      {
        id: "TEST-PRICE-MIXED-VARIANT",
        name: "TEST MIXED VARIANT",
        attributes: {},
        skus: [
          {
            id: "TEST-PRICE-MIXED-USD-ID",
            sku: "TEST-PRICE-MIXED-USD",
            retailPrice: { amountCents: 1_900, currency: "USD" },
            availableQuantity: 1,
          },
          {
            id: "TEST-PRICE-MIXED-CAD-ID",
            sku: "TEST-PRICE-MIXED-CAD",
            retailPrice: { amountCents: 2_100, currency: "CAD" },
            availableQuantity: 1,
          },
        ],
      },
    ],
  });

  assert.ok(range);
  assert.ok(mixedCurrency);
  assert.equal(productPriceLabel(exact), "$9.50");
  assert.equal(productPriceLabel(range), "From $12.50");
  assert.equal(productPriceLabel(mixedCurrency), "Price varies by currency");
});

test("filterAndSortProducts applies query, availability, and price ordering", () => {
  const products = [
    normalizedTestProduct({
      id: "TEST-FILTER-ALPHA",
      name: "TEST ALPHA",
      description: "TEST floral profile",
      sku: "TEST-ALPHA-SKU",
      amountCents: 3_000,
      availableQuantity: 3,
    }),
    normalizedTestProduct({
      id: "TEST-FILTER-BETA",
      name: "TEST BETA",
      description: "TEST neutral profile",
      sku: "TEST-NEEDLE-SKU",
      amountCents: 1_000,
      availableQuantity: 0,
    }),
    normalizedTestProduct({
      id: "TEST-FILTER-GAMMA",
      name: "TEST GAMMA",
      description: "TEST floral profile",
      sku: "TEST-GAMMA-SKU",
      amountCents: 2_000,
      availableQuantity: 5,
    }),
  ];

  assert.deepEqual(
    filterAndSortProducts(products, { query: "needle" }).map((product) => product.id),
    ["TEST-FILTER-BETA"],
  );
  assert.deepEqual(
    filterAndSortProducts(products, { availability: "available", sort: "price-asc" }).map(
      (product) => product.id,
    ),
    ["TEST-FILTER-GAMMA", "TEST-FILTER-ALPHA"],
  );
  assert.deepEqual(
    filterAndSortProducts(products, { availability: "sold-out" }).map((product) => product.id),
    ["TEST-FILTER-BETA"],
  );
  assert.deepEqual(
    filterAndSortProducts(products, { query: "floral", sort: "price-desc" }).map(
      (product) => product.id,
    ),
    ["TEST-FILTER-ALPHA", "TEST-FILTER-GAMMA"],
  );
});

test("positive inventory remains non-purchasable when division evidence is absent", () => {
  const expectations: ReadonlyArray<{
    division: DivisionKey;
    label: string;
    reason: RegExp;
  }> = [
    {
      division: "THCA",
      label: "Proof and eligibility unresolved",
      reason: /proof applicability or an eligibility result/i,
    },
    {
      division: "VAPE_NICOTINE",
      label: "Role and compatibility unresolved",
      reason: /verified device, platform, or component relationship/i,
    },
    {
      division: "GLASS_ACCESSORIES",
      label: "Physical fit and requirements unresolved",
      reason: /verified physical-fit relationship/i,
    },
  ];

  for (const { division, label, reason } of expectations) {
    const product = normalizedTestProduct({
      id: `TEST-READINESS-${division}`,
      division,
      availableQuantity: 12,
    });
    const sku = product.variants[0]?.skus[0];
    assert.ok(sku);
    const decision = deriveDecisionState(product, sku);

    assert.equal(decision.availability, "Available");
    assert.equal(decision.tone, "caution");
    assert.equal(decision.label, label);
    assert.match(decision.reason, reason);
    assert.doesNotMatch(decision.label, /\b(?:add|ready)\b/i);
  }
});
