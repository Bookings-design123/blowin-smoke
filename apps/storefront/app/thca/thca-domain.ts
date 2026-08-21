import { formatMoney } from "@/lib/catalog/domain";
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

export type ThcaProductOption = Readonly<{
  variant: StorefrontVariant;
  sku: StorefrontSku;
  href: string;
  price: string;
  availability: "Available" | "Out of stock" | "Availability unresolved";
}>;

export type ThcaCardModel = Readonly<{
  formatLabel: string;
  options: readonly ThcaProductOption[];
  facts: readonly Readonly<{ label: string; value: string }>[];
  price: string;
  availability: "Available" | "Out of stock" | "Options vary" | "Availability unresolved";
  exactDetailHref: string | null;
  merchandisable: boolean;
}>;

export function thcaEmptyShelfCopy(
  formatLabel: string | null,
): Readonly<{ title: string; message: string }> {
  return {
    title: formatLabel
      ? `No confirmed ${formatLabel.toLocaleLowerCase()} products are on the shelf right now.`
      : "No confirmed THCA products are on the shelf right now.",
    message: "Check again later.",
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

const QUANTITY_BASIS =
  /(?:\d\s*(?:mg|g|kg|ml|oz)\b|\b(?:gram|grams|ounce|ounces|count|ct|piece|pieces|pack|packs|unit|units)\b)/i;

function quantityValue(variant: StorefrontVariant): string | null {
  const value = attributeValue(variant, QUANTITY_ATTRIBUTE_KEYS);
  return value && QUANTITY_BASIS.test(value) ? value : null;
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

function optionPrice(sku: StorefrontSku): string {
  return formatMoney(sku.retailPrice.amountCents, sku.retailPrice.currency);
}

function cardPrice(options: readonly ThcaProductOption[]): string {
  const available = options.filter((option) => option.availability === "Available");
  const candidates = available.length > 0 ? available : options;
  if (candidates.length === 0) return "Price unavailable";

  const currency = candidates[0].sku.retailPrice.currency;
  if (!candidates.every((option) => option.sku.retailPrice.currency === currency)) {
    return "Price varies by currency";
  }

  const minimum = Math.min(...candidates.map((option) => option.sku.retailPrice.amountCents));
  const exact = candidates.every((option) => option.sku.retailPrice.amountCents === minimum);
  return `${exact ? "" : "From "}${formatMoney(minimum, currency)}`;
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
  const variantNames = product.variants.map((variant) => normalizeValue(variant.name));
  const merchandisable =
    product.variants.every((variant) => variant.skus.length === 1) &&
    new Set(variantNames).size === variantNames.length;
  const options = merchandisable
    ? product.variants.map((variant) => {
        const sku = variant.skus[0]!;
        return {
          variant,
          sku,
          href: `/products/${encodeURIComponent(sku.sku)}`,
          price: optionPrice(sku),
          availability: optionAvailability(sku.availableQuantity),
        } as const;
      })
    : [];
  const formats = thcaFormatsForProduct(product);
  const quantities = uniqueValues(
    product.variants.map(quantityValue),
  );
  const profiles = uniqueValues(
    product.variants.map((variant) => attributeValue(variant, PROFILE_ATTRIBUTE_KEYS)),
  );
  const facts: Array<{ label: string; value: string }> = [];

  if (quantities.length === 1 && product.variants.every((variant) => quantityValue(variant))) {
    facts.push({ label: "Amount", value: quantities[0] });
  } else if (quantities.length > 1) {
    facts.push({ label: "Amount", value: "Varies by option" });
  }
  if (profiles.length === 1 && product.variants.every((variant) => attributeValue(variant, PROFILE_ATTRIBUTE_KEYS))) {
    facts.push({ label: "Profile", value: profiles[0] });
  } else if (profiles.length > 1) {
    facts.push({ label: "Profile", value: "Varies by option" });
  }
  if (options.length > 1 && facts.length < 2) {
    facts.push({ label: "Options", value: String(options.length) });
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
    price: cardPrice(options),
    availability: productAvailability(options),
    exactDetailHref: merchandisable && options.length === 1 ? options[0]?.href ?? null : null,
    merchandisable,
  };
}
