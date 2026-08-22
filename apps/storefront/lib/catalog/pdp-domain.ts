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

export type PdpDisclosure = Readonly<{
  key:
    | "details"
    | "proof"
    | "compatibility"
    | "materials"
    | "dimensions"
    | "fit-dimensions";
  label:
    | "Details"
    | "Proof / COA"
    | "Compatibility"
    | "Materials"
    | "Dimensions"
    | "Fit / Dimensions";
  facts: readonly PdpFact[];
  body?: string;
}>;

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
  disclosures: readonly PdpDisclosure[];
  purchase: Readonly<{
    disabled: true;
    actionLabel:
      | "Sold out"
      | "Unavailable"
      | "Proof unavailable"
      | "Compatibility not specified"
      | "Fit not specified";
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
  /\b(?:batch(?: code| id| number)?|certificate of analysis|coa|lab[- ]tested|lot(?: code| id| number)?|potency|proof(?: verified| available)?|eligible|eligibility|approved for|compatib(?:le|ility)|incompatible|fits?|requires?|replacement for|works only with|comes with|includes?|contents?|care instructions?|recommended|recommendation)\b|\bthca\s*:?[\s-]*\d+(?:\.\d+)?\s*%/i;

const VAPE_RELATIONSHIP_AISLES = new Set([
  "pods",
  "coils",
  "parts-accessories",
  "e-liquid",
]);

const FITTED_GLASS_AISLES = new Set([
  "bowls",
  "bangers",
  "downstems",
  "ash-catchers",
  "adapters",
  "replacement-parts",
]);

const DIMENSION_FACT_LABELS = new Set([
  "Connection",
  "Height",
  "Length",
  "Diameter",
  "Dimensions",
  "Angle",
]);

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

function factKey(fact: PdpFact): string {
  return `${fact.label.toLocaleLowerCase()}:${fact.value.toLocaleLowerCase()}`;
}

function prioritizedFacts(
  facts: readonly PdpFact[],
  adaptation: PdpAdaptation,
): readonly PdpFact[] {
  const priority =
    adaptation === "thca"
      ? new Map([
          ["Profile", 0],
          ["Amount", 1],
          ["Format", 2],
        ])
      : adaptation === "vape" &&
          facts.some((fact) => fact.label === "Strength")
        ? new Map([
            ["Flavor", 0],
            ["Strength", 1],
            ["Capacity", 2],
          ])
        : null;
  if (!priority) return facts;

  return facts
    .map((fact, index) => ({ fact, index }))
    .sort(
      (left, right) =>
        (priority.get(left.fact.label) ?? Number.MAX_SAFE_INTEGER) -
          (priority.get(right.fact.label) ?? Number.MAX_SAFE_INTEGER) ||
        left.index - right.index,
    )
    .map(({ fact }) => fact);
}

function detailsDisclosure(
  body: string | null,
  facts: readonly PdpFact[],
): PdpDisclosure | null {
  return body || facts.length > 0
    ? {
        key: "details",
        label: "Details",
        facts,
        ...(body ? { body } : {}),
      }
    : null;
}

function domainDisclosures(
  product: StorefrontProduct,
  adaptation: PdpAdaptation,
  safeDescription: string | null,
  facts: readonly PdpFact[],
  supportingFacts: readonly PdpFact[],
): readonly PdpDisclosure[] {
  if (adaptation === "thca") {
    const details = detailsDisclosure(safeDescription, supportingFacts);
    return [
      ...(details ? [details] : []),
      {
        key: "proof",
        label: "Proof / COA",
        facts: [
          { label: "Batch", value: "Not available online" },
          { label: "Potency", value: "Not available online" },
          { label: "COA", value: "Not available online" },
          { label: "Eligibility", value: "Not specified" },
        ],
      },
    ];
  }

  if (adaptation === "vape") {
    const aisles = new Set(
      vapeAislesForProduct(product).map((aisle) => aisle.slug),
    );
    const details = detailsDisclosure(safeDescription, supportingFacts);
    const relationshipAisle = [...aisles].find((aisle) =>
      VAPE_RELATIONSHIP_AISLES.has(aisle),
    );
    const compatibility = relationshipAisle
      ? {
          key: "compatibility" as const,
          label: "Compatibility" as const,
          facts: [
            {
              label: relationshipAisle === "e-liquid" ? "Hardware" : "Status",
              value: "Not specified",
            },
          ],
        }
      : null;
    return [
      ...(details ? [details] : []),
      ...(compatibility ? [compatibility] : []),
    ];
  }

  const materialFacts = supportingFacts.filter(
    (fact) => fact.label === "Material",
  );
  const materialKeys = new Set(materialFacts.map(factKey));

  if (adaptation === "merch") {
    const details = detailsDisclosure(
      safeDescription,
      supportingFacts.filter((fact) => !materialKeys.has(factKey(fact))),
    );
    return [
      ...(details ? [details] : []),
      ...(materialFacts.length > 0
        ? [
            {
              key: "materials" as const,
              label: "Materials" as const,
              facts: materialFacts,
            },
          ]
        : []),
    ];
  }

  const aisles = new Set(
    glassAislesForProduct(product).map((aisle) => aisle.slug),
  );
  const fitted = [...aisles].some((aisle) =>
    FITTED_GLASS_AISLES.has(aisle),
  );
  const exactDimensionFacts = facts.filter((fact) =>
    DIMENSION_FACT_LABELS.has(fact.label),
  );
  const disclosedDimensionFacts = fitted
    ? exactDimensionFacts
    : supportingFacts.filter((fact) =>
        DIMENSION_FACT_LABELS.has(fact.label),
      );
  const dimensionKeys = new Set(disclosedDimensionFacts.map(factKey));
  const details = detailsDisclosure(
    safeDescription,
    supportingFacts.filter(
      (fact) =>
        !materialKeys.has(factKey(fact)) &&
        !dimensionKeys.has(factKey(fact)),
    ),
  );
  const dimensions: PdpDisclosure | null = fitted
    ? {
        key: "fit-dimensions",
        label: "Fit / Dimensions",
        facts: [
          { label: "Fit", value: "Not specified" },
          ...disclosedDimensionFacts,
        ],
      }
    : disclosedDimensionFacts.length > 0
      ? {
          key: "dimensions",
          label: "Dimensions",
          facts: disclosedDimensionFacts,
        }
      : null;

  return [
    ...(details ? [details] : []),
    ...(materialFacts.length > 0
      ? [
          {
            key: "materials" as const,
            label: "Materials" as const,
            facts: materialFacts,
          },
        ]
      : []),
    ...(dimensions ? [dimensions] : []),
  ];
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
      recovery: { label: "Search the house", href: "/search" },
    };
  }
  if (selectedAvailability === "Availability unknown") {
    return {
      disabled: true,
      actionLabel: "Unavailable",
      recovery: { label: "Get product help", href: "/support" },
    };
  }

  if (adaptation === "thca") {
    return {
      disabled: true,
      actionLabel: "Proof unavailable",
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
      slugs.has("parts-accessories") ||
      slugs.has("e-liquid")
    ) {
      return {
        disabled: true,
        actionLabel: "Compatibility not specified",
        recovery: {
          label: "Identify what you own",
          href: "/learn/device-identification",
        },
      };
    }
    return {
      disabled: true,
      actionLabel: "Unavailable",
      recovery: { label: "Get product help", href: "/support" },
    };
  }

  if (adaptation === "merch") {
    return {
      disabled: true,
      actionLabel: "Unavailable",
      recovery: { label: "Get product help", href: "/support" },
    };
  }

  const slugs = new Set(
    glassAislesForProduct(product).map((aisle) => aisle.slug),
  );
  if ([...slugs].some((slug) => FITTED_GLASS_AISLES.has(slug))) {
    return {
      disabled: true,
      actionLabel: "Fit not specified",
      recovery: {
        label: "Measure a connection",
        href: "/learn/measure-a-connection",
      },
    };
  }
  return {
    disabled: true,
    actionLabel: "Unavailable",
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
  const facts = prioritizedFacts(
    exactFacts(product, selection.variant, adaptation, identifiers),
    adaptation,
  );
  const immediateFacts = facts.slice(0, 2);
  const immediateFactKeys = new Set(immediateFacts.map(factKey));
  const supportingFacts = facts.filter(
    (fact) => !immediateFactKeys.has(factKey(fact)),
  );
  const safeDescription = safePublicCopy(product.description, identifiers, {
    rejectUnsupportedClaims: true,
  });
  const disclosures = domainDisclosures(
    product,
    adaptation,
    safeDescription,
    facts,
    supportingFacts,
  );

  return {
    name,
    description: null,
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
