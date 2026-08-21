import assert from "node:assert/strict";
import test from "node:test";

import {
  homeProductEntryIsReady,
  type HomeProductMerchandise,
} from "../components/HomeMerchandising";
import type { StorefrontProduct } from "../lib/catalog/types";

function product(availableQuantity: number): StorefrontProduct {
  return {
    id: `product-${availableQuantity}`,
    name: "Canonical test product",
    description: "A concise canonical descriptor.",
    division: "VAPE_NICOTINE",
    publicationState: "PUBLISHED",
    variants: [
      {
        id: "variant-one",
        name: "Option one",
        attributes: { role: "Device" },
        skus: [
          {
            id: "sku-one-id",
            sku: "SKU-ONE",
            retailPrice: { amountCents: 4200, currency: "USD" },
            availableQuantity,
          },
        ],
      },
      {
        id: "variant-two",
        name: "Option two",
        attributes: { role: "Device" },
        skus: [
          {
            id: "sku-two-id",
            sku: "SKU-TWO",
            retailPrice: { amountCents: 4800, currency: "USD" },
            availableQuantity,
          },
        ],
      },
    ],
    images: [
      {
        id: "approved-media",
        filename: "product.png",
        contentType: "image/png",
        byteLength: 1200,
        checksum: "checksum",
        url: "https://commerce.invalid/product.png",
      },
    ],
  };
}

function entry(
  canonicalProduct: StorefrontProduct,
  overrides: Partial<HomeProductMerchandise>,
): HomeProductMerchandise {
  return {
    kind: "product",
    product: canonicalProduct,
    selectedSku: "SKU-ONE",
    readiness: {
      state: "REVIEW_REQUIRED",
      source: "CANONICAL_COMMERCE",
      detailHref: "/products/SKU-ONE",
    },
    media: {
      imageId: "approved-media",
      alt: "Canonical test product",
      rightsStatus: "APPROVED",
    },
    curationRationale: "Selected for a named customer job.",
    ...overrides,
  };
}

test("configuration state is explicit and never implies a selected SKU", () => {
  const canonicalProduct = product(4);
  const configuredEntry = entry(canonicalProduct, {
    selectedSku: null,
    readiness: {
      state: "CONFIGURATION_REQUIRED",
      source: "CANONICAL_COMMERCE",
      detailHref: "/products/configure",
    },
  });

  assert.equal(homeProductEntryIsReady(configuredEntry), true);
  assert.equal(
    homeProductEntryIsReady({ ...configuredEntry, selectedSku: "SKU-ONE" }),
    false,
  );
});

test("notification action appears only for a canonical zero-quantity selection", () => {
  const notificationReadiness = {
    state: "NOTIFY" as const,
    source: "CANONICAL_COMMERCE" as const,
    detailHref: "/products/SKU-ONE",
    notificationHref: "/support?intent=notify",
  };

  assert.equal(
    homeProductEntryIsReady(
      entry(product(0), { readiness: notificationReadiness }),
    ),
    true,
  );
  assert.equal(
    homeProductEntryIsReady(
      entry(product(4), { readiness: notificationReadiness }),
    ),
    false,
  );
});

test("positive quantity alone cannot authorize a direct purchase card", () => {
  const canonicalProduct = product(4);
  const directEntry = entry(canonicalProduct, {
    readiness: {
      state: "DIRECTLY_PURCHASABLE",
      source: "CANONICAL_COMMERCE",
      detailHref: "/products/SKU-ONE",
      purchaseEndpoint: "/api/cart/lines",
    },
  });

  assert.equal(homeProductEntryIsReady(directEntry), false);
});

test("coming soon fails closed until the canonical catalog exposes that state", () => {
  const comingSoonEntry = entry(product(0), {
    readiness: {
      state: "COMING_SOON",
      source: "CANONICAL_COMMERCE",
      detailHref: "/products/SKU-ONE",
    },
  });

  assert.equal(homeProductEntryIsReady(comingSoonEntry), false);
});
