import {
  thcaFormatsForProduct,
  thcaProductFacts,
} from "@/app/thca/thca-domain";
import {
  vapeAislesForProduct,
  vapeProductFacts,
} from "@/app/vape-nicotine/vape-domain";
import {
  glassAislesForProduct,
  glassProductFacts,
} from "@/app/glass-accessories/glass-domain";
import { DIVISION_META, formatMoney } from "./domain";
import type {
  StorefrontProduct,
  StorefrontSku,
  StorefrontVariant,
} from "./types";

export type PdpAdaptation = "thca" | "vape" | "glass" | "merch";

export type PdpFact = Readonly<{
  label: string;
  value: string;
}>;

export type PdpAvailability =
  | "Available"
  | "Sold out"
  | "Availability unknown";

export type PdpOptionGroupLabel =
  | "Variation"
  | "Amount"
  | "Strain / profile"
  | "Format"
  | "Flavor"
  | "Nicotine strength"
  | "Color"
  | "Capacity"
  | "Resistance"
  | "Pack quantity"
  | "Power"
  | "Size"
  | "Joint size"
  | "Joint gender"
  | "Angle"
  | "Material";

export type PdpViewModel = Readonly<{
  name: string;
  description: string | null;
  divisionLabel: string;
  categoryLabel: string | null;
  adaptation: PdpAdaptation;
  price: Readonly<{
    amountCents: number;
    currency: string;
    formatted: string;
  }>;
  availability: PdpAvailability;
  selectedOptionLabel: string;
  optionGroup: Readonly<{
    label: PdpOptionGroupLabel;
    choices: readonly Readonly<{
      label: string;
      href: string;
      selected: boolean;
      price: string;
      availability: PdpAvailability;
    }>[];
  }> | null;
  immediateFacts: readonly PdpFact[];
  disclosures: readonly Readonly<{
    key: "details" | "specifications";
    label: "Details" | "Specifications";
    facts: readonly PdpFact[];
    body?: string;
  }>[];
  purchase: Readonly<{
    disabled: true;
    actionLabel: "Sold out" | "Purchase unavailable";
    blockerLabel: string;
    blockerReason: string;
    recovery: Readonly<{
      label: string;
      href: string;
    }>;
  }>;
  mediaIds: readonly string[];
  relatedProducts: readonly [];
}>;

type Selection = Readonly<{
  variant: StorefrontVariant;
  sku: StorefrontSku;
}>;

const INTERNAL_RESEARCH_LANGUAGE =
  /\b(?:stock candidate|test[- ]buy candidate|insufficient evidence|research(?:[- ]only| candidate| status)?|internal[- ]only|litmus(?: test)?|prototype fixture|synthetic fixture)\b|failed\s*\/\s*do not stock/i;
const EXACT_INTERNAL_STATE =
  /^(?:watch|failed|do not stock|unknown|unverified|not supplied|not specified|n\/?a|varies by option)$/i;
const UNSUPPORTED_POSITIVE_CLAIM =
  /\b(?:coa|certificate of analysis|lab[- ]tested|proof(?: verified| available)?|eligible|eligibility|approved for|compatib(?:le|ility)|incompatible|fits?|requires?|replacement for|works only with|comes with|includes?|contents?|care instructions?|recommended|recommendation)\b/i;

type OptionAxis = Readonly<{
  label: PdpOptionGroupLabel;
  keys: ReadonlySet<string>;
}>;

const OPTION_AXES: Readonly<Record<PdpAdaptation, readonly OptionAxis[]>> = {
  thca: [
    {
      label: "Amount",
      keys: new Set([
        "amount",
        "count",
        "netweight",
        "packageamount",
        "packagesize",
        "quantity",
        "weight",
      ]),
    },
    {
      label: "Strain / profile",
      keys: new Set([
        "profile",
        "profiletype",
        "strain",
        "strainname",
        "straintype",
      ]),
    },
    {
      label: "Format",
      keys: new Set(["format", "productformat", "producttype"]),
    },
  ],
  vape: [
    { label: "Flavor", keys: new Set(["flavor", "flavorname"]) },
    {
      label: "Nicotine strength",
      keys: new Set([
        "nicotine",
        "nicotinecontent",
        "nicotinestrength",
        "strength",
      ]),
    },
    { label: "Color", keys: new Set(["color", "colour"]) },
    {
      label: "Capacity",
      keys: new Set([
        "bottlesize",
        "capacity",
        "eliquidcapacity",
        "liquidcapacity",
        "podcapacity",
        "volume",
      ]),
    },
    {
      label: "Resistance",
      keys: new Set(["coilresistance", "resistance"]),
    },
    {
      label: "Pack quantity",
      keys: new Set(["packagecount", "packagequantity", "unitcount"]),
    },
    {
      label: "Power",
      keys: new Set(["operatingrange", "power", "powerrange", "wattage"]),
    },
  ],
  glass: [
    {
      label: "Joint size",
      keys: new Set(["connectionsize", "jointdiameter", "jointsize"]),
    },
    {
      label: "Joint gender",
      keys: new Set(["connectiongender", "gender", "jointgender"]),
    },
    { label: "Angle", keys: new Set(["angle", "jointangle"]) },
    { label: "Color", keys: new Set(["color", "colour"]) },
    {
      label: "Size",
      keys: new Set([
        "diameter",
        "dimensions",
        "downstemlength",
        "effectivelength",
        "externaldimensions",
        "grinderdiameter",
        "height",
        "insertionlength",
        "length",
        "overallheight",
        "overalllength",
        "size",
      ]),
    },
    {
      label: "Pack quantity",
      keys: new Set([
        "count",
        "packagecount",
        "packagequantity",
        "quantity",
        "unitcount",
      ]),
    },
    { label: "Material", keys: new Set(["material", "primarymaterial"]) },
  ],
  merch: [
    {
      label: "Size",
      keys: new Set([
        "apparelsize",
        "clothingsize",
        "dimensions",
        "externaldimensions",
        "merchsize",
        "size",
      ]),
    },
    { label: "Color", keys: new Set(["color", "colour"]) },
    { label: "Material", keys: new Set(["material", "primarymaterial"]) },
    {
      label: "Pack quantity",
      keys: new Set([
        "count",
        "packagecount",
        "packagequantity",
        "quantity",
        "unitcount",
      ]),
    },
  ],
};

function exactSelection(
  product: StorefrontProduct,
  routeSku: string,
): Selection | null {
  const matches = product.variants.flatMap((variant) =>
    variant.skus
      .filter((sku) => sku.sku === routeSku)
      .map((sku) => ({ variant, sku })),
  );
  return matches.length === 1 ? matches[0]! : null;
}

function knownIdentifiers(product: StorefrontProduct): readonly string[] {
  return [
    product.id,
    ...product.variants.flatMap((variant) => [
      variant.id,
      ...variant.skus.flatMap((sku) => [sku.id, sku.sku]),
    ]),
  ].filter((identifier) => identifier.trim().length > 0);
}

function containsIdentifier(
  value: string,
  identifiers: readonly string[],
): boolean {
  const normalized = value.toLocaleLowerCase();
  return identifiers.some((identifier) => {
    const candidate = identifier.trim().toLocaleLowerCase();
    return candidate.length >= 4
      ? normalized.includes(candidate)
      : normalized === candidate;
  });
}

function safePublicCopy(
  value: string,
  identifiers: readonly string[],
  { rejectUnsupportedClaims = false } = {},
): string | null {
  const text = value.trim();
  if (
    !text ||
    INTERNAL_RESEARCH_LANGUAGE.test(text) ||
    EXACT_INTERNAL_STATE.test(text) ||
    containsIdentifier(text, identifiers) ||
    (rejectUnsupportedClaims && UNSUPPORTED_POSITIVE_CLAIM.test(text))
  ) {
    return null;
  }
  return text;
}

function safeOptionLabel(
  value: string,
  identifiers: readonly string[],
): string | null {
  const text = safePublicCopy(value, identifiers, {
    rejectUnsupportedClaims: true,
  });
  return text && text.length <= 64 && !/[\n\r{}<>]/.test(text) ? text : null;
}

function normalizeAttributeKey(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

function optionAxisValue(
  variant: StorefrontVariant,
  axis: OptionAxis,
  identifiers: readonly string[],
): string | null {
  const values = Object.entries(variant.attributes)
    .filter(([key]) => axis.keys.has(normalizeAttributeKey(key)))
    .map(([, value]) => {
      if (typeof value === "string") return value;
      if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
      }
      if (typeof value === "boolean") return value ? "Yes" : "No";
      return null;
    });

  if (values.length === 0 || values.some((value) => value === null)) {
    return null;
  }

  const safeValues = values.map((value) =>
    safeOptionLabel(value as string, identifiers),
  );
  if (safeValues.some((value) => value === null)) return null;

  const uniqueValues = [
    ...new Map(
      (safeValues as string[]).map((value) => [
        value.toLocaleLowerCase().replace(/\s+/g, " "),
        value,
      ]),
    ).values(),
  ];
  return uniqueValues.length === 1 ? uniqueValues[0]! : null;
}

function optionGroupLabel(
  product: StorefrontProduct,
  adaptation: PdpAdaptation,
  identifiers: readonly string[],
): PdpOptionGroupLabel {
  const varyingAxes = OPTION_AXES[adaptation].filter((axis) => {
    const values = product.variants.map((variant) =>
      optionAxisValue(variant, axis, identifiers),
    );
    return (
      values.every((value): value is string => value !== null) &&
      new Set(values.map((value) => value.toLocaleLowerCase())).size > 1
    );
  });

  return varyingAxes.length === 1 ? varyingAxes[0]!.label : "Variation";
}

function availability(quantity: number): PdpAvailability {
  if (quantity < 0) return "Availability unknown";
  if (quantity === 0) return "Sold out";
  return "Available";
}

function selectedProduct(
  product: StorefrontProduct,
  variant: StorefrontVariant,
): StorefrontProduct {
  return { ...product, variants: [variant] };
}

function categoryAndAdaptation(product: StorefrontProduct): Readonly<{
  adaptation: PdpAdaptation;
  categoryLabel: string | null;
}> {
  if (product.division === "THCA") {
    const formats = thcaFormatsForProduct(product);
    return {
      adaptation: "thca",
      categoryLabel: formats.length === 1 ? formats[0]!.label : null,
    };
  }

  if (product.division === "VAPE_NICOTINE") {
    const aisles = vapeAislesForProduct(product);
    return {
      adaptation: "vape",
      categoryLabel: aisles.length === 1 ? aisles[0]!.label : null,
    };
  }

  const aisles = glassAislesForProduct(product);
  const merchAisle = aisles.find((aisle) => aisle.department === "merch");
  const primaryAisle =
    merchAisle ??
    aisles.find((aisle) => aisle.slug !== "replacement-parts") ??
    aisles[0] ??
    null;
  return {
    adaptation: merchAisle ? "merch" : "glass",
    categoryLabel: primaryAisle?.label ?? null,
  };
}

function exactFacts(
  product: StorefrontProduct,
  selected: StorefrontVariant,
  adaptation: PdpAdaptation,
  identifiers: readonly string[],
): readonly PdpFact[] {
  const exactProduct = selectedProduct(product, selected);
  let candidates: readonly PdpFact[] = [];

  if (adaptation === "thca") {
    const formats = thcaFormatsForProduct(exactProduct);
    candidates = [
      ...(formats.length === 1
        ? [{ label: "Format", value: formats[0]!.label }]
        : []),
      ...thcaProductFacts(exactProduct),
    ];
  } else if (adaptation === "vape") {
    candidates = vapeAislesForProduct(product).length > 0
      ? vapeProductFacts(exactProduct)
      : [];
  } else {
    candidates = glassAislesForProduct(product).length > 0
      ? glassProductFacts(exactProduct)
      : [];
  }

  const seen = new Set<string>();
  return candidates.flatMap((fact) => {
    const label = safePublicCopy(fact.label, identifiers);
    const value = safePublicCopy(fact.value, identifiers, {
      rejectUnsupportedClaims: true,
    });
    if (!label || !value) return [];
    const key = label.toLocaleLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ label, value }];
  });
}

function optionGroup(
  product: StorefrontProduct,
  selectedSku: StorefrontSku,
  adaptation: PdpAdaptation,
  identifiers: readonly string[],
): PdpViewModel["optionGroup"] {
  if (
    product.variants.length < 2 ||
    !product.variants.every((variant) => variant.skus.length === 1)
  ) {
    return null;
  }

  const labels = product.variants.map((variant) =>
    safeOptionLabel(variant.name, identifiers),
  );
  if (labels.some((label) => label === null)) return null;
  const safeLabels = labels as string[];
  if (
    new Set(safeLabels.map((label) => label.toLocaleLowerCase())).size !==
    safeLabels.length
  ) {
    return null;
  }

  return {
    label: optionGroupLabel(product, adaptation, identifiers),
    choices: product.variants.map((variant, index) => {
      const sku = variant.skus[0]!;
      return {
        label: safeLabels[index]!,
        href: `/products/${encodeURIComponent(sku.sku)}`,
        selected: sku.sku === selectedSku.sku,
        price: formatMoney(
          sku.retailPrice.amountCents,
          sku.retailPrice.currency,
        ),
        availability: availability(sku.availableQuantity),
      };
    }),
  };
}

function purchaseState(
  product: StorefrontProduct,
  selectedSku: StorefrontSku,
  adaptation: PdpAdaptation,
): PdpViewModel["purchase"] {
  const selectedAvailability = availability(selectedSku.availableQuantity);
  if (selectedAvailability === "Sold out") {
    return {
      disabled: true,
      actionLabel: "Sold out",
      blockerLabel: "Sold out",
      blockerReason: "This exact selection is sold out.",
      recovery: { label: "Search the house", href: "/search" },
    };
  }
  if (selectedAvailability === "Availability unknown") {
    return {
      disabled: true,
      actionLabel: "Purchase unavailable",
      blockerLabel: "Availability can’t be confirmed",
      blockerReason: "We can’t confirm availability for this selection.",
      recovery: { label: "Get product help", href: "/support" },
    };
  }

  if (adaptation === "thca") {
    return {
      disabled: true,
      actionLabel: "Purchase unavailable",
      blockerLabel: "Proof and eligibility can’t be confirmed",
      blockerReason:
        "We can’t confirm the required proof and eligibility checks for this selection.",
      recovery: {
        label: "Understand THCA proof",
        href: "/learn/thca-proof",
      },
    };
  }

  if (adaptation === "vape") {
    const slugs = new Set(
      vapeAislesForProduct(product).map((aisle) => aisle.slug),
    );
    if (
      slugs.has("pods") ||
      slugs.has("coils") ||
      slugs.has("parts-accessories")
    ) {
      return {
        disabled: true,
        actionLabel: "Purchase unavailable",
        blockerLabel: "Compatibility can’t be confirmed",
        blockerReason:
          "We can’t confirm device or platform compatibility for this selection.",
        recovery: {
          label: "Identify what you own",
          href: "/learn/device-identification",
        },
      };
    }
    if (slugs.has("e-liquid")) {
      return {
        disabled: true,
        actionLabel: "Purchase unavailable",
        blockerLabel: "Hardware suitability can’t be confirmed",
        blockerReason:
          "We can’t confirm hardware suitability for this selection.",
        recovery: {
          label: "Identify what you own",
          href: "/learn/device-identification",
        },
      };
    }
    return {
      disabled: true,
      actionLabel: "Purchase unavailable",
      blockerLabel: "Online purchase unavailable",
      blockerReason: "Online purchase is unavailable for this item.",
      recovery: { label: "Get product help", href: "/support" },
    };
  }

  if (adaptation === "merch") {
    return {
      disabled: true,
      actionLabel: "Purchase unavailable",
      blockerLabel: "Online purchase unavailable",
      blockerReason: "Online purchase is unavailable for this item.",
      recovery: { label: "Get product help", href: "/support" },
    };
  }

  const slugs = new Set(
    glassAislesForProduct(product).map((aisle) => aisle.slug),
  );
  const fitted = [
    "bowls",
    "bangers",
    "downstems",
    "ash-catchers",
    "adapters",
    "replacement-parts",
  ] as const;
  if (fitted.some((slug) => slugs.has(slug))) {
    return {
      disabled: true,
      actionLabel: "Purchase unavailable",
      blockerLabel: "Fit can’t be confirmed",
      blockerReason: "We can’t confirm physical fit for this selection.",
      recovery: {
        label: "Measure a connection",
        href: "/learn/measure-a-connection",
      },
    };
  }
  return {
    disabled: true,
    actionLabel: "Purchase unavailable",
    blockerLabel: "Online purchase unavailable",
    blockerReason: "Online purchase is unavailable for this item.",
    recovery: { label: "Get product help", href: "/support" },
  };
}

export function buildPdpViewModel(
  product: StorefrontProduct,
  routeSku: string,
): PdpViewModel | null {
  const selection = exactSelection(product, routeSku);
  if (!selection) return null;

  const identifiers = knownIdentifiers(product);
  const name = safePublicCopy(product.name, identifiers);
  if (!name) return null;

  const { adaptation, categoryLabel } = categoryAndAdaptation(product);
  const selectedOptionLabel =
    safeOptionLabel(selection.variant.name, identifiers) ??
    "Selected configuration";
  const facts = exactFacts(
    product,
    selection.variant,
    adaptation,
    identifiers,
  );
  const immediateFacts = facts.slice(0, 2);
  const supportingFacts = facts.slice(2);
  const safeDescription = safePublicCopy(product.description, identifiers, {
    rejectUnsupportedClaims: true,
  });
  const description =
    safeDescription && safeDescription.length <= 240 ? safeDescription : null;
  const disclosures: PdpViewModel["disclosures"] = [
    ...(safeDescription && safeDescription.length > 240
      ? [
          {
            key: "details" as const,
            label: "Details" as const,
            facts: [],
            body: safeDescription,
          },
        ]
      : []),
    ...(supportingFacts.length > 0
      ? [
          {
            key: "specifications" as const,
            label: "Specifications" as const,
            facts: supportingFacts,
          },
        ]
      : []),
  ];

  return {
    name,
    description,
    divisionLabel: DIVISION_META[product.division].label,
    categoryLabel,
    adaptation,
    price: {
      ...selection.sku.retailPrice,
      formatted: formatMoney(
        selection.sku.retailPrice.amountCents,
        selection.sku.retailPrice.currency,
      ),
    },
    availability: availability(selection.sku.availableQuantity),
    selectedOptionLabel,
    optionGroup: optionGroup(
      product,
      selection.sku,
      adaptation,
      identifiers,
    ),
    immediateFacts,
    disclosures,
    purchase: purchaseState(product, selection.sku, adaptation),
    mediaIds: product.images.map((image) => image.id),
    relatedProducts: [],
  };
}
