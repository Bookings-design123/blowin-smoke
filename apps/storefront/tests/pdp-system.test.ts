import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPdpViewModel,
  type PdpViewModel,
} from "../lib/catalog/pdp-domain";
import type {
  DivisionKey,
  StorefrontProduct,
  StorefrontVariant,
} from "../lib/catalog/types";

function variant(
  name: string,
  sku: string,
  attributes: Readonly<Record<string, unknown>> = {},
  options: Readonly<{
    amountCents?: number;
    availableQuantity?: number;
    id?: string;
  }> = {},
): StorefrontVariant {
  return {
    id: options.id ?? `${sku}-VARIANT-ID`,
    name,
    attributes,
    skus: [
      {
        id: `${sku}-INTERNAL-ID`,
        sku,
        retailPrice: {
          amountCents: options.amountCents ?? 2_000,
          currency: "USD",
        },
        availableQuantity: options.availableQuantity ?? 3,
      },
    ],
  };
}

function product(
  division: DivisionKey,
  variants: readonly StorefrontVariant[],
  options: Readonly<{
    id?: string;
    name?: string;
    description?: string;
    mediaIds?: readonly string[];
  }> = {},
): StorefrontProduct {
  return {
    id: options.id ?? "PRODUCT-INTERNAL-001",
    name: options.name ?? "House product",
    description: options.description ?? "A concise published description.",
    division,
    publicationState: "PUBLISHED",
    variants,
    images: (options.mediaIds ?? []).map((id, index) => ({
      id,
      filename: `product-${index}.webp`,
      contentType: "image/webp",
      byteLength: 1_024,
      checksum: `CHECKSUM-${index}`,
      url: `/api/media/${id}`,
    })),
  };
}

function requireModel(model: PdpViewModel | null): PdpViewModel {
  assert.ok(model);
  return model;
}

test("requires one exact route SKU and never substitutes a default", () => {
  const base = product("THCA", [
    variant("Eighth", "FLOWER-3G", { format: "flower", amount: "3.5 g" }),
    variant("Quarter", "FLOWER-7G", { format: "flower", amount: "7 g" }),
  ]);

  assert.equal(buildPdpViewModel(base, "MISSING-SKU"), null);

  const duplicate = product("THCA", [
    variant("First", "DUPLICATE-SKU", { format: "flower" }),
    variant("Second", "DUPLICATE-SKU", { format: "flower" }),
  ]);
  assert.equal(buildPdpViewModel(duplicate, "DUPLICATE-SKU"), null);
});

test("THCA uses exact selected facts, exact commerce state, and safe options", () => {
  const fixture = product(
    "THCA",
    [
      variant(
        "Eighth ounce",
        "THCA-FLOWER-3G",
        { format: "flower", amount: "3.5 g", strain: "Citrus" },
        { amountCents: 2_400, availableQuantity: 2 },
      ),
      variant(
        "Quarter ounce",
        "THCA-FLOWER-7G",
        { format: "flower", amount: "7 g", strain: "Pine" },
        { amountCents: 4_200, availableQuantity: 5 },
      ),
    ],
    { mediaIds: ["MEDIA-PRIMARY", "MEDIA-DETAIL"] },
  );

  const model = requireModel(buildPdpViewModel(fixture, "THCA-FLOWER-7G"));
  assert.equal(model.adaptation, "thca");
  assert.equal(model.categoryLabel, "Flower");
  assert.equal(model.selectedOptionLabel, "Quarter ounce");
  assert.deepEqual(model.price, {
    amountCents: 4_200,
    currency: "USD",
    formatted: "$42.00",
  });
  assert.equal(model.availability, "Available");
  assert.deepEqual(model.immediateFacts, [
    { label: "Format", value: "Flower" },
    { label: "Amount", value: "7 g" },
  ]);
  assert.deepEqual(model.disclosures, [
    {
      key: "specifications",
      label: "Specifications",
      facts: [{ label: "Profile", value: "Pine" }],
    },
  ]);
  assert.deepEqual(model.mediaIds, ["MEDIA-PRIMARY", "MEDIA-DETAIL"]);
  assert.equal(model.optionGroup?.label, "Variation");
  assert.equal(model.optionGroup?.choices.length, 2);
  assert.equal(model.optionGroup?.choices[1]?.selected, true);
  assert.equal(model.optionGroup?.choices[1]?.price, "$42.00");
  assert.equal(model.purchase.disabled, true);
  assert.equal(
    model.purchase.blockerLabel,
    "Proof and eligibility can’t be confirmed",
  );
  assert.equal(model.purchase.recovery.href, "/learn/thca-proof");
  assert.deepEqual(JSON.parse(JSON.stringify(model)), model);
});

test("Vape adaptation uses governed type facts and an aisle-specific blocker", () => {
  const fixture = product("VAPE_NICOTINE", [
    variant("30 mL · 3 mg", "VAPE-LIQUID-30", {
      customerFacingProductType: "e-liquid",
      flavor: "Orchard",
      capacity: "30 mL",
      nicotineStrength: "3 mg/mL",
      nicotineType: "freebase",
      vgPgRatio: "70/30",
      arbitraryInternalField: "must never render",
    }),
  ]);

  const model = requireModel(buildPdpViewModel(fixture, "VAPE-LIQUID-30"));
  assert.equal(model.adaptation, "vape");
  assert.equal(model.categoryLabel, "E-liquid");
  assert.deepEqual(model.immediateFacts, [
    { label: "Flavor", value: "Orchard" },
    { label: "Capacity", value: "30 mL" },
  ]);
  assert.deepEqual(model.disclosures[0]?.facts, [
    { label: "Strength", value: "3 mg/mL" },
    { label: "Nicotine", value: "Freebase" },
    { label: "VG / PG", value: "70/30" },
  ]);
  assert.equal(
    model.purchase.blockerLabel,
    "Hardware suitability can’t be confirmed",
  );
  assert.equal(model.purchase.recovery.href, "/learn/device-identification");
  assert.doesNotMatch(JSON.stringify(model), /must never render/i);
});

test("Glass exposes selected measurements but never asserts physical fit", () => {
  const fixture = product("GLASS_ACCESSORIES", [
    variant("Clear", "GLASS-BOWL-CLEAR", {
      customerFacingProductType: "bowl",
      jointSize: "14 mm",
      jointGender: "male",
      material: "Borosilicate glass",
      fitRelationship: "Fits every piece",
    }),
  ]);

  const model = requireModel(buildPdpViewModel(fixture, "GLASS-BOWL-CLEAR"));
  assert.equal(model.adaptation, "glass");
  assert.equal(model.categoryLabel, "Bowls");
  assert.deepEqual(model.immediateFacts, [
    { label: "Connection", value: "14 mm · Male" },
    { label: "Material", value: "Borosilicate glass" },
  ]);
  assert.equal(model.purchase.blockerLabel, "Fit can’t be confirmed");
  assert.equal(model.purchase.recovery.href, "/learn/measure-a-connection");
  assert.doesNotMatch(JSON.stringify(model), /Fits every piece/i);
});

test("Merch is adapted only through the governed Glass division classification", () => {
  const merch = product("GLASS_ACCESSORIES", [
    variant("Medium", "MERCH-TEE-M", {
      customerFacingProductType: "apparel",
      apparelSize: "M",
      color: "Black",
      material: "Cotton",
    }),
  ]);
  const merelyNamedMerch = product(
    "GLASS_ACCESSORIES",
    [variant("Default", "UNCLASSIFIED-MERCH", { color: "Black" })],
    { name: "House merch shirt" },
  );

  const model = requireModel(buildPdpViewModel(merch, "MERCH-TEE-M"));
  assert.equal(model.adaptation, "merch");
  assert.equal(model.categoryLabel, "Apparel");
  assert.deepEqual(model.immediateFacts, [
    { label: "Size", value: "M" },
    { label: "Color", value: "Black" },
  ]);
  assert.deepEqual(model.disclosures[0]?.facts, [
    { label: "Material", value: "Cotton" },
  ]);
  assert.equal(
    model.purchase.blockerLabel,
    "Online purchase unavailable",
  );
  assert.doesNotMatch(model.purchase.blockerLabel, /fit/i);

  assert.equal(
    requireModel(buildPdpViewModel(merelyNamedMerch, "UNCLASSIFIED-MERCH"))
      .adaptation,
    "glass",
  );
});

test("sold-out and unknown availability override division readiness without a notify claim", () => {
  const soldOut = product("THCA", [
    variant(
      "Sold selection",
      "THCA-SOLD",
      { format: "flower" },
      { availableQuantity: 0 },
    ),
  ]);
  const unknown = product("VAPE_NICOTINE", [
    variant(
      "Unknown selection",
      "VAPE-UNKNOWN",
      { customerFacingProductType: "disposable" },
      { availableQuantity: -1 },
    ),
  ]);

  const soldModel = requireModel(buildPdpViewModel(soldOut, "THCA-SOLD"));
  const unknownModel = requireModel(
    buildPdpViewModel(unknown, "VAPE-UNKNOWN"),
  );
  assert.equal(soldModel.availability, "Sold out");
  assert.equal(soldModel.purchase.actionLabel, "Sold out");
  assert.equal(soldModel.purchase.recovery.href, "/search");
  assert.doesNotMatch(JSON.stringify(soldModel.purchase), /notify|restock alert/i);
  assert.equal(unknownModel.availability, "Availability unknown");
  assert.equal(
    unknownModel.purchase.blockerLabel,
    "Availability can’t be confirmed",
  );
  assert.equal(unknownModel.purchase.recovery.href, "/support");
  assert.equal(unknownModel.purchase.disabled, true);
});

test("ambiguous option topology fails closed while preserving a safe selected label", () => {
  const multipleSkus = variant("Pack", "PACK-FIRST", { format: "pre-roll" });
  const ambiguousSkuVariant: StorefrontVariant = {
    ...multipleSkus,
    skus: [
      ...multipleSkus.skus,
      {
        id: "PACK-SECOND-INTERNAL-ID",
        sku: "PACK-SECOND",
        retailPrice: { amountCents: 3_000, currency: "USD" },
        availableQuantity: 2,
      },
    ],
  };
  const multipleSkuModel = requireModel(
    buildPdpViewModel(
      product("THCA", [ambiguousSkuVariant]),
      "PACK-SECOND",
    ),
  );
  assert.equal(multipleSkuModel.optionGroup, null);
  assert.equal(multipleSkuModel.selectedOptionLabel, "Pack");
  assert.equal(multipleSkuModel.price.amountCents, 3_000);

  const duplicateLabels = product("THCA", [
    variant("Same label", "DUP-LABEL-A", { format: "flower" }),
    variant(" same label ", "DUP-LABEL-B", { format: "flower" }),
  ]);
  assert.equal(
    requireModel(buildPdpViewModel(duplicateLabels, "DUP-LABEL-A"))
      .optionGroup,
    null,
  );
});

test("option vocabulary follows one unambiguous governed category axis", () => {
  const thca = product("THCA", [
    variant("Eighth", "THCA-AMOUNT-A", {
      format: "flower",
      amount: "3.5 g",
      strain: "Citrus",
    }),
    variant("Quarter", "THCA-AMOUNT-B", {
      format: "flower",
      amount: "7 g",
      strain: "Citrus",
    }),
  ]);
  assert.equal(
    requireModel(buildPdpViewModel(thca, "THCA-AMOUNT-A")).optionGroup
      ?.label,
    "Amount",
  );

  const vape = product("VAPE_NICOTINE", [
    variant("3 mg", "VAPE-STRENGTH-A", {
      customerFacingProductType: "e-liquid",
      flavor: "Orchard",
      nicotineStrength: "3 mg/mL",
    }),
    variant("6 mg", "VAPE-STRENGTH-B", {
      customerFacingProductType: "e-liquid",
      flavor: "Orchard",
      nicotineStrength: "6 mg/mL",
    }),
  ]);
  assert.equal(
    requireModel(buildPdpViewModel(vape, "VAPE-STRENGTH-A")).optionGroup
      ?.label,
    "Nicotine strength",
  );

  const glass = product("GLASS_ACCESSORIES", [
    variant("14 mm", "GLASS-JOINT-A", {
      customerFacingProductType: "bowl",
      jointSize: "14 mm",
      color: "Clear",
    }),
    variant("18 mm", "GLASS-JOINT-B", {
      customerFacingProductType: "bowl",
      jointSize: "18 mm",
      color: "Clear",
    }),
  ]);
  assert.equal(
    requireModel(buildPdpViewModel(glass, "GLASS-JOINT-A")).optionGroup
      ?.label,
    "Joint size",
  );

  const merch = product("GLASS_ACCESSORIES", [
    variant("Medium", "MERCH-SIZE-A", {
      customerFacingProductType: "apparel",
      apparelSize: "M",
      color: "Black",
    }),
    variant("Large", "MERCH-SIZE-B", {
      customerFacingProductType: "apparel",
      apparelSize: "L",
      color: "Black",
    }),
  ]);
  assert.equal(
    requireModel(buildPdpViewModel(merch, "MERCH-SIZE-A")).optionGroup?.label,
    "Size",
  );

  const incompleteAxis = product("VAPE_NICOTINE", [
    variant("First", "VAPE-VARIATION-A", {
      customerFacingProductType: "disposable",
      flavor: "Berry",
    }),
    variant("Second", "VAPE-VARIATION-B", {
      customerFacingProductType: "disposable",
    }),
  ]);
  assert.equal(
    requireModel(buildPdpViewModel(incompleteAxis, "VAPE-VARIATION-A"))
      .optionGroup?.label,
    "Variation",
  );
});

test("unsafe copy, raw identifiers, and research states never become PDP content", () => {
  const fixture = product(
    "THCA",
    [
      variant("stock candidate", "SAFE-ROUTE-A", {
        format: "flower",
        amount: "3.5 g",
        strain: "watch",
        researchNote: "test-buy candidate",
        compatibility: "Compatible with every device",
      }),
      variant("PRODUCT-INTERNAL-001", "SAFE-ROUTE-B", {
        format: "flower",
        amount: "7 g",
      }),
    ],
    {
      description:
        "Internal-only research status: test-buy candidate for PRODUCT-INTERNAL-001.",
    },
  );

  const model = requireModel(buildPdpViewModel(fixture, "SAFE-ROUTE-A"));
  assert.equal(model.description, null);
  assert.equal(model.selectedOptionLabel, "Selected configuration");
  assert.equal(model.optionGroup, null);
  assert.deepEqual(model.immediateFacts, [
    { label: "Format", value: "Flower" },
    { label: "Amount", value: "3.5 g" },
  ]);
  assert.deepEqual(model.disclosures, []);
  const serialized = JSON.stringify(model);
  assert.doesNotMatch(
    serialized,
    /stock candidate|test-buy candidate|internal-only|Compatible with every device|PRODUCT-INTERNAL-001/i,
  );

  const unsupportedClaim = product(
    "VAPE_NICOTINE",
    [variant("Default", "CLAIM-SAFE-ROUTE", {
      customerFacingProductType: "disposable",
    })],
    { description: "Compatible with every device and recommended for beginners." },
  );
  assert.equal(
    requireModel(buildPdpViewModel(unsupportedClaim, "CLAIM-SAFE-ROUTE"))
      .description,
    null,
  );
});

test("empty canonical detail stays empty and no relationships are invented", () => {
  const fixture = product(
    "GLASS_ACCESSORIES",
    [variant("Default", "GLASS-UNCLASSIFIED", {
      undocumentedField: "Opaque value",
    })],
    { description: "" },
  );
  const model = requireModel(
    buildPdpViewModel(fixture, "GLASS-UNCLASSIFIED"),
  );

  assert.equal(model.description, null);
  assert.equal(model.categoryLabel, null);
  assert.deepEqual(model.immediateFacts, []);
  assert.deepEqual(model.disclosures, []);
  assert.deepEqual(model.relatedProducts, []);
  assert.equal(model.purchase.disabled, true);
  assert.doesNotMatch(JSON.stringify(model), /Opaque value/);
  assert.ok(
    !Object.keys(model).some((key) =>
      /^(?:id|sku|productId|variantId|skuId)$/i.test(key),
    ),
  );
});

test("long safe description moves intact into a nonempty Details disclosure", () => {
  const longDescription = "A carefully published product description. ".repeat(7).trim();
  assert.ok(longDescription.length > 240);
  const fixture = product(
    "GLASS_ACCESSORIES",
    [variant("Default", "LONG-DESCRIPTION-ROUTE", {})],
    { description: longDescription },
  );
  const model = requireModel(
    buildPdpViewModel(fixture, "LONG-DESCRIPTION-ROUTE"),
  );

  assert.equal(model.description, null);
  assert.deepEqual(model.disclosures, [
    {
      key: "details",
      label: "Details",
      facts: [],
      body: longDescription,
    },
  ]);
});

test("negative and conditional relationship copy is not treated as description truth", () => {
  const descriptions = [
    "Incompatible with other devices.",
    "Does not fit the standard connection.",
    "Requires a separate component.",
    "Replacement for another model.",
    "Works only with one platform.",
  ];

  for (const [index, description] of descriptions.entries()) {
    const routeSku = `RELATIONSHIP-COPY-${index}`;
    const fixture = product(
      "VAPE_NICOTINE",
      [variant("Default", routeSku, {})],
      { description },
    );
    assert.equal(
      requireModel(buildPdpViewModel(fixture, routeSku)).description,
      null,
    );
  }
});

test("an unsafe product identity suppresses the whole PDP model", () => {
  const fixture = product(
    "THCA",
    [variant("Default", "SAFE-IDENTITY-ROUTE", { format: "flower" })],
    { name: "Insufficient evidence" },
  );
  assert.equal(buildPdpViewModel(fixture, "SAFE-IDENTITY-ROUTE"), null);
});
