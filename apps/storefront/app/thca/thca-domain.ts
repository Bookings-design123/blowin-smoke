import { allSkus, productPriceLabel } from "@/lib/catalog/domain";
import type {
  StorefrontProduct,
  StorefrontSku,
  StorefrontVariant,
} from "@/lib/catalog/types";

export const THCA_FORMATS = [
  {
    slug: "flower",
    label: "Flower",
    description: "Compare strain, amount, and batch",
    aliases: ["flower", "thca flower", "smalls", "flower smalls", "shake", "trim"],
  },
  {
    slug: "pre-rolls",
    label: "Pre-rolls",
    description: "Compare count, package, and batch",
    aliases: ["pre-roll", "pre-rolls", "preroll", "prerolls", "pre roll", "pre rolls"],
  },
  {
    slug: "vapes",
    label: "Vapes",
    description: "Compare exact format, amount, and batch",
    aliases: [
      "vape",
      "vapes",
      "thca vape",
      "cartridge",
      "cartridges",
      "thca cartridge",
      "cart",
      "carts",
      "disposable",
      "disposable vape",
    ],
  },
  {
    slug: "concentrates",
    label: "Concentrates",
    description: "Compare exact form, weight, and batch",
    aliases: [
      "concentrate",
      "concentrates",
      "wax",
      "live resin",
      "resin",
      "rosin",
      "shatter",
      "badder",
      "crumble",
      "diamonds",
    ],
  },
  {
    slug: "edibles",
    label: "Edibles / Gummies",
    description: "Compare amount, package, and batch",
    aliases: ["edible", "edibles", "gummy", "gummies"],
  },
] as const;

export type ThcaFormatSlug = (typeof THCA_FORMATS)[number]["slug"];

export type ThcaProofState =
  | "available"
  | "stale"
  | "missing"
  | "unmatched"
  | "unresolved";

export const THCA_PROOF_KEY: ReadonlyArray<
  Readonly<{ state: ThcaProofState; label: string; description: string }>
> = [
  {
    state: "available",
    label: "Proof available",
    description: "A current document is tied to the exact product, option, and batch.",
  },
  {
    state: "stale",
    label: "Proof stale",
    description: "The matching document is outside its currentness rule.",
  },
  {
    state: "missing",
    label: "Proof missing",
    description: "An expected accessible record is not present.",
  },
  {
    state: "unmatched",
    label: "Batch mismatch",
    description: "A document exists, but it is not tied to this exact batch.",
  },
  {
    state: "unresolved",
    label: "Proof unresolved",
    description: "The published record does not support a proof conclusion yet.",
  },
];

export type ThcaProductOption = Readonly<{
  variant: StorefrontVariant;
  sku: StorefrontSku;
  href: string;
  availability: "Available" | "Out of stock" | "Availability unresolved";
}>;

export type ThcaCardModel = Readonly<{
  formatLabel: string;
  options: readonly ThcaProductOption[];
  facts: readonly Readonly<{ label: string; value: string }>[];
  price: string;
  availability: "Available" | "Out of stock" | "Options vary" | "Availability unresolved";
  exactDetailHref: string | null;
}>;

export function thcaEmptyShelfCopy(
  formatLabel: string | null,
  partialProjection: boolean,
): Readonly<{ title: string; message: string }> {
  if (partialProjection) {
    return {
      title: "No confirmed THCA product records are shown right now.",
      message: "Some catalog records could not be confirmed and are excluded. No substitute listings are shown.",
    };
  }

  return {
    title: formatLabel
      ? `No ${formatLabel.toLocaleLowerCase()} products are published right now.`
      : "No THCA products are published right now.",
    message: "Formats and products appear only when their published records are ready.",
  };
}

const FORMAT_ATTRIBUTE_KEYS = new Set(["format", "productformat", "producttype"]);
const QUANTITY_ATTRIBUTE_KEYS = new Set([
  "amount",
  "count",
  "netweight",
  "packageamount",
  "packagesize",
  "quantity",
  "weight",
]);
const PROFILE_ATTRIBUTE_KEYS = new Set([
  "profile",
  "profiletype",
  "strain",
  "strainname",
  "straintype",
]);

function normalizeKey(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeValue(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function scalarText(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function attributeValue(
  variant: StorefrontVariant,
  allowedKeys: ReadonlySet<string>,
): string | null {
  for (const [key, value] of Object.entries(variant.attributes)) {
    if (!allowedKeys.has(normalizeKey(key))) continue;
    const formatted = scalarText(value);
    if (formatted) return formatted;
  }
  return null;
}

function uniqueValues(values: readonly (string | null)[]): readonly string[] {
  return [...new Set(values.filter((value): value is string => value !== null))];
}

function optionAvailability(quantity: number): ThcaProductOption["availability"] {
  if (quantity < 0) return "Availability unresolved";
  if (quantity === 0) return "Out of stock";
  return "Available";
}

function productAvailability(options: readonly ThcaProductOption[]): ThcaCardModel["availability"] {
  const states = new Set(options.map((option) => option.availability));
  if (states.has("Availability unresolved")) return "Availability unresolved";
  if (states.size > 1) return "Options vary";
  return options[0]?.availability ?? "Availability unresolved";
}

export function thcaFormatsForProduct(
  product: StorefrontProduct,
): readonly (typeof THCA_FORMATS)[number][] {
  const matched = new Set<ThcaFormatSlug>();

  for (const variant of product.variants) {
    const rawFormat = attributeValue(variant, FORMAT_ATTRIBUTE_KEYS);
    if (!rawFormat) continue;
    const normalized = normalizeValue(rawFormat);
    const definition = THCA_FORMATS.find((format) =>
      format.aliases.some((alias) => alias === normalized),
    );
    if (definition) matched.add(definition.slug);
  }

  return THCA_FORMATS.filter((format) => matched.has(format.slug));
}

export function availableThcaFormats(products: readonly StorefrontProduct[]) {
  return THCA_FORMATS.map((format) => ({
    ...format,
    count: products.filter((product) =>
      thcaFormatsForProduct(product).some((candidate) => candidate.slug === format.slug),
    ).length,
  })).filter((format) => format.count > 0);
}

export function parseThcaFormat(value: string | string[] | undefined): ThcaFormatSlug | null {
  if (typeof value !== "string") return null;
  return THCA_FORMATS.some((format) => format.slug === value)
    ? (value as ThcaFormatSlug)
    : null;
}

export function filterThcaProducts(
  products: readonly StorefrontProduct[],
  format: ThcaFormatSlug | null,
): readonly StorefrontProduct[] {
  if (!format) return products;
  return products.filter((product) =>
    thcaFormatsForProduct(product).some((candidate) => candidate.slug === format),
  );
}

export function thcaCardModel(product: StorefrontProduct): ThcaCardModel {
  const options = product.variants.flatMap((variant) =>
    variant.skus.map((sku) => ({
      variant,
      sku,
      href: `/products/${encodeURIComponent(sku.sku)}`,
      availability: optionAvailability(sku.availableQuantity),
    })),
  );
  const formats = thcaFormatsForProduct(product);
  const quantities = uniqueValues(
    product.variants.map((variant) => attributeValue(variant, QUANTITY_ATTRIBUTE_KEYS)),
  );
  const profiles = uniqueValues(
    product.variants.map((variant) => attributeValue(variant, PROFILE_ATTRIBUTE_KEYS)),
  );
  const facts: Array<{ label: string; value: string }> = [];

  if (options.length > 1) {
    facts.push({ label: "Options", value: String(options.length) });
  }
  if (quantities.length === 1 && product.variants.every((variant) => attributeValue(variant, QUANTITY_ATTRIBUTE_KEYS))) {
    facts.push({ label: "Amount", value: quantities[0] });
  } else if (quantities.length > 1) {
    facts.push({ label: "Amount", value: "Varies by option" });
  }
  if (profiles.length === 1 && product.variants.every((variant) => attributeValue(variant, PROFILE_ATTRIBUTE_KEYS))) {
    facts.push({ label: "Profile", value: profiles[0] });
  } else if (profiles.length > 1) {
    facts.push({ label: "Profile", value: "Varies by option" });
  }

  return {
    formatLabel:
      formats.length === 0
        ? "Format not supplied"
        : formats.length === 1
          ? formats[0].label
          : "Multiple formats",
    options,
    facts: facts.slice(0, 2),
    price: productPriceLabel(product),
    availability: productAvailability(options),
    exactDetailHref: allSkus(product).length === 1 ? options[0]?.href ?? null : null,
  };
}
