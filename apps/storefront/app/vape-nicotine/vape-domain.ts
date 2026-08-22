import { formatMoney } from "@/lib/catalog/domain";
import type {
  StorefrontProduct,
  StorefrontVariant,
} from "@/lib/catalog/types";

export const VAPE_AISLES = [
  {
    slug: "disposables",
    label: "Disposables",
    aliases: [
      "disposable",
      "disposable device",
      "prefilled disposable",
    ],
  },
  {
    slug: "pod-systems",
    label: "Pod systems",
    aliases: [
      "pod system",
      "refillable pod device",
      "refillable pod system",
      "open pod system",
      "closed pod system",
    ],
  },
  {
    slug: "pods",
    label: "Pods",
    aliases: [
      "pod",
      "prefilled pod",
      "pod cartridge",
    ],
  },
  {
    slug: "coils",
    label: "Coils",
    aliases: ["coil", "coil head"],
  },
  {
    slug: "devices-kits",
    label: "Devices / kits",
    aliases: [
      "device",
      "refillable device",
      "vape kit",
      "starter kit",
      "kit",
    ],
  },
  {
    slug: "e-liquid",
    label: "E-liquid",
    aliases: [
      "e-liquid",
      "e liquid",
    ],
  },
  {
    slug: "parts-accessories",
    label: "Parts / accessories",
    aliases: [
      "replacement component",
      "replacement part",
      "part",
      "accessory",
      "adapter",
      "charging cable",
      "protective sleeve",
      "tank",
      "cartridge",
    ],
  },
] as const;

export type VapeAisleSlug = (typeof VAPE_AISLES)[number]["slug"];

export type VapeProductOption = Readonly<{
  id: string;
  name: string;
  href: string;
  price: string;
  amountCents: number;
  currency: string;
  availability: "Available" | "Sold out" | "Availability unknown";
}>;

export type VapeCardModel = Readonly<{
  typeLabel: string | null;
  aisles: readonly (typeof VAPE_AISLES)[number][];
  options: readonly VapeProductOption[];
  facts: readonly Readonly<{ label: string; value: string }>[];
  compatibilityCue: Readonly<{ label: string; value: string }> | null;
  price: string;
  availability: "Available" | "Sold out" | "Options vary" | "Availability unknown";
  exactDetailHref: string | null;
  actionLabel: "View product" | "View details";
  merchandisable: boolean;
}>;

const TYPE_ATTRIBUTE_KEYS = new Set([
  "customerfacingproducttype",
  "producttype",
]);
const ROLE_ATTRIBUTE_KEYS = new Set([
  "customerfacingproductrole",
  "productrole",
]);

const FLAVOR_ATTRIBUTE_KEYS = new Set(["flavor", "flavorname"]);
const NICOTINE_FORMAT_ATTRIBUTE_KEYS = new Set([
  "eliquidtype",
  "nicotineformat",
  "nicotinetype",
]);
const NICOTINE_STRENGTH_ATTRIBUTE_KEYS = new Set([
  "nicotine",
  "nicotinecontent",
  "nicotinestrength",
  "strength",
]);
const PUFF_ATTRIBUTE_KEYS = new Set([
  "manufacturerpuffclaim",
  "puffclaim",
  "puffcount",
  "puffs",
]);
const LIQUID_CAPACITY_ATTRIBUTE_KEYS = new Set([
  "bottlesize",
  "capacity",
  "eliquidcapacity",
  "liquidcapacity",
  "podcapacity",
  "volume",
]);
const BATTERY_ATTRIBUTE_KEYS = new Set([
  "battery",
  "batterycapacity",
]);
const POWER_ATTRIBUTE_KEYS = new Set([
  "operatingrange",
  "power",
  "powerrange",
  "wattage",
]);
const RESISTANCE_ATTRIBUTE_KEYS = new Set([
  "coilresistance",
  "resistance",
]);
const COUNT_ATTRIBUTE_KEYS = new Set([
  "packagecount",
  "packagequantity",
  "unitcount",
]);
const COMPOSITION_ATTRIBUTE_KEYS = new Set([
  "vgpg",
  "vgpgratio",
]);
const RECHARGEABLE_ATTRIBUTE_KEYS = new Set([
  "rechargeable",
  "rechargeability",
]);

type FactRule = Readonly<{
  label: string;
  keys: ReadonlySet<string>;
  format: (value: unknown) => string | null;
}>;

function normalizeKey(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeValue(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function normalizeControlledValue(value: string): string {
  return normalizeValue(value).replace(/_+/g, " ");
}

function scalarText(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return null;
}

function attributeValues(
  variant: StorefrontVariant,
  allowedKeys: ReadonlySet<string>,
): readonly unknown[] {
  return Object.entries(variant.attributes)
    .filter(([key]) => allowedKeys.has(normalizeKey(key)))
    .map(([, value]) => value);
}

function normalizedAttributeText(
  variant: StorefrontVariant,
  allowedKeys: ReadonlySet<string>,
): readonly string[] | null {
  const values = attributeValues(variant, allowedKeys);
  const normalized = values.map((value) =>
    typeof value === "string" && value.trim()
      ? normalizeControlledValue(value)
      : null,
  );
  return normalized.some((value) => value === null)
    ? null
    : (normalized as string[]);
}

function aisleMatches(values: readonly string[]) {
  return new Set<VapeAisleSlug>(
    VAPE_AISLES.filter((aisle) =>
      values.some((value) => aisle.aliases.some((alias) => alias === value)),
    ).map((aisle) => aisle.slug),
  );
}

function variantAisles(variant: StorefrontVariant): ReadonlySet<VapeAisleSlug> {
  const typeValues = normalizedAttributeText(variant, TYPE_ATTRIBUTE_KEYS);
  if (typeValues === null) return new Set();
  if (typeValues.length > 0) {
    const matchesByValue = typeValues.map((value) => aisleMatches([value]));
    if (matchesByValue.some((matches) => matches.size !== 1)) return new Set();
    const typeMatches = new Set(
      matchesByValue.flatMap((matches) => [...matches]),
    );
    return typeMatches.size === 1 ? typeMatches : new Set();
  }

  const roleValues = normalizedAttributeText(variant, ROLE_ATTRIBUTE_KEYS);
  return roleValues !== null &&
    roleValues.length > 0 &&
    roleValues.every((value) => value === "accessory")
    ? new Set<VapeAisleSlug>(["parts-accessories"])
    : new Set();
}

export function vapeAislesForProduct(product: StorefrontProduct) {
  const variantSets = product.variants.map(variantAisles);
  if (variantSets.length === 0) return [];
  return VAPE_AISLES.filter((aisle) =>
    variantSets.every((matches) => matches.has(aisle.slug)),
  );
}

export function availableVapeAisles(products: readonly StorefrontProduct[]) {
  return VAPE_AISLES.map((aisle) => ({
    ...aisle,
    count: products.filter((product) =>
      vapeAislesForProduct(product).some((candidate) => candidate.slug === aisle.slug),
    ).length,
  })).filter((aisle) => aisle.count > 0);
}

export function parseVapeAisle(value: string | string[] | undefined): VapeAisleSlug | null {
  if (typeof value !== "string") return null;
  return VAPE_AISLES.some((aisle) => aisle.slug === value)
    ? (value as VapeAisleSlug)
    : null;
}

export function filterVapeProducts(
  products: readonly StorefrontProduct[],
  aisle: VapeAisleSlug | null,
): readonly StorefrontProduct[] {
  if (!aisle) return products;
  return products.filter((product) =>
    vapeAislesForProduct(product).some((candidate) => candidate.slug === aisle),
  );
}

function shortText(value: unknown): string | null {
  const text = scalarText(value);
  return text && text.length <= 64 && !/[\n\r{}<>]/.test(text) ? text : null;
}

function plainCustomerLabel(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = shortText(value);
  if (
    !text ||
    normalizeValue(text) === "watch" ||
    /\b(?:stock candidate|test[- ]buy candidate|insufficient evidence|research only)\b|failed\s*\/\s*do not stock/i.test(
      text,
    )
  ) {
    return null;
  }
  return text;
}

function nicotineFormat(value: unknown): string | null {
  const text = shortText(value);
  if (!text) return null;
  const normalized = normalizeValue(text);
  if (["nic salt", "nic salts", "nicotine salt", "salt nicotine"].includes(normalized)) {
    return "Nic salt";
  }
  if (["freebase", "freebase nicotine"].includes(normalized)) return "Freebase";
  if (["nicotine free", "nicotine-free", "zero nicotine"].includes(normalized)) {
    return "Nicotine-free";
  }
  return null;
}

function nicotineStrength(value: unknown): string | null {
  const text = shortText(value);
  if (!text) return null;
  const match = text.match(/^(\d+(?:\.\d+)?)\s*(%|mg(?:\/m[lL])?)$/i);
  if (!match) return null;
  const amount = Number(match[1]);
  return Number.isFinite(amount) && (match[2] !== "%" || amount <= 100)
    ? text
    : null;
}

function puffClaim(value: unknown): string | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return new Intl.NumberFormat("en-US").format(value);
  }
  const text = shortText(value);
  const match = text?.match(
    /^((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)\s*([kK])?(?:\s*puffs?)?$/,
  );
  if (!match) return null;
  const amount = Number(match[1]!.replaceAll(",", "")) * (match[2] ? 1_000 : 1);
  if (
    (!match[2] && match[1]!.includes(".")) ||
    !Number.isSafeInteger(amount) ||
    amount <= 0
  ) {
    return null;
  }
  return `${match[1]}${match[2]?.toUpperCase() ?? ""}`;
}

function positiveUnitValue(pattern: RegExp) {
  return (value: unknown): string | null => {
    const text = shortText(value);
    if (!text || !pattern.test(text)) return null;
    const magnitudes = text.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    return magnitudes.length > 0 &&
      magnitudes.every((magnitude) => Number.isFinite(magnitude) && magnitude > 0)
      ? text
      : null;
  };
}

function positiveCount(value: unknown): string | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return String(value);
  }
  const text = shortText(value);
  const match = text?.match(/^(\d+)\s*(?:ct|count|pack|pieces?|units?)?$/i);
  const count = match ? Number(match[1]) : Number.NaN;
  return Number.isSafeInteger(count) && count > 0 ? text : null;
}

function powerRange(value: unknown): string | null {
  const text = shortText(value);
  const match = text?.match(
    /^(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?\s*(?:W|watts?)$/i,
  );
  if (!match) return null;
  const minimum = Number(match[1]);
  const maximum = match[2] ? Number(match[2]) : minimum;
  return Number.isFinite(minimum) &&
    Number.isFinite(maximum) &&
    minimum > 0 &&
    maximum >= minimum
    ? text
    : null;
}

function compositionRatio(value: unknown): string | null {
  const text = shortText(value);
  const match = text?.match(/^(\d{1,3})\s*\/\s*(\d{1,3})$/);
  if (!match) return null;
  const vg = Number(match[1]);
  const pg = Number(match[2]);
  return vg <= 100 && pg <= 100 && vg + pg === 100 ? text : null;
}

function rechargeable(value: unknown): string | null {
  if (typeof value === "boolean") return value ? "Rechargeable" : "Not rechargeable";
  const text = shortText(value);
  if (!text) return null;
  const normalized = normalizeValue(text);
  if (["yes", "rechargeable"].includes(normalized)) return "Rechargeable";
  if (["no", "not rechargeable", "non-rechargeable"].includes(normalized)) {
    return "Not rechargeable";
  }
  return null;
}

const FACT_RULES = {
  flavor: {
    label: "Flavor",
    keys: FLAVOR_ATTRIBUTE_KEYS,
    format: plainCustomerLabel,
  },
  nicotineFormat: {
    label: "Nicotine",
    keys: NICOTINE_FORMAT_ATTRIBUTE_KEYS,
    format: nicotineFormat,
  },
  nicotineStrength: {
    label: "Strength",
    keys: NICOTINE_STRENGTH_ATTRIBUTE_KEYS,
    format: nicotineStrength,
  },
  puffClaim: { label: "Puff claim", keys: PUFF_ATTRIBUTE_KEYS, format: puffClaim },
  capacity: {
    label: "Capacity",
    keys: LIQUID_CAPACITY_ATTRIBUTE_KEYS,
    format: positiveUnitValue(/^\d+(?:\.\d+)?\s*(?:m[lL]|[lL])$/),
  },
  battery: {
    label: "Battery",
    keys: BATTERY_ATTRIBUTE_KEYS,
    format: positiveUnitValue(/^\d+(?:\.\d+)?\s*(?:mAh|Ah|Wh)$/i),
  },
  power: {
    label: "Power",
    keys: POWER_ATTRIBUTE_KEYS,
    format: powerRange,
  },
  resistance: {
    label: "Resistance",
    keys: RESISTANCE_ATTRIBUTE_KEYS,
    format: positiveUnitValue(/^\d+(?:\.\d+)?\s*(?:ohms?|Ω)$/i),
  },
  count: { label: "Count", keys: COUNT_ATTRIBUTE_KEYS, format: positiveCount },
  composition: {
    label: "VG / PG",
    keys: COMPOSITION_ATTRIBUTE_KEYS,
    format: compositionRatio,
  },
  rechargeable: {
    label: "Charging",
    keys: RECHARGEABLE_ATTRIBUTE_KEYS,
    format: rechargeable,
  },
} as const satisfies Readonly<Record<string, FactRule>>;

function productFact(product: StorefrontProduct, rule: FactRule) {
  const values = product.variants.map((variant) => {
    const sourceValues = attributeValues(variant, rule.keys);
    const formatted = sourceValues.map(rule.format);
    if (formatted.length === 0 || formatted.some((value) => value === null)) {
      return null;
    }
    const unique = [...new Set(formatted as string[])];
    return unique.length === 1 ? unique[0] : null;
  });
  if (values.length === 0) return null;
  if (values.some((value) => value === null)) return null;
  const unique = [...new Set(values as string[])];
  return {
    label: rule.label,
    value: unique.length === 1 ? unique[0]! : "Varies by option",
  };
}

function factOrder(aisles: readonly (typeof VAPE_AISLES)[number][]): readonly FactRule[] {
  const slugs = new Set(aisles.map((aisle) => aisle.slug));
  if (slugs.has("disposables")) {
    return [
      FACT_RULES.flavor,
      FACT_RULES.nicotineStrength,
      FACT_RULES.puffClaim,
      FACT_RULES.capacity,
      FACT_RULES.rechargeable,
    ];
  }
  if (slugs.has("pod-systems") || slugs.has("devices-kits")) {
    return [FACT_RULES.battery, FACT_RULES.capacity, FACT_RULES.power];
  }
  if (slugs.has("pods")) {
    return [FACT_RULES.count, FACT_RULES.resistance, FACT_RULES.capacity];
  }
  if (slugs.has("coils")) {
    return [FACT_RULES.count, FACT_RULES.resistance, FACT_RULES.power];
  }
  if (slugs.has("e-liquid")) {
    return [
      FACT_RULES.flavor,
      FACT_RULES.capacity,
      FACT_RULES.nicotineStrength,
      FACT_RULES.nicotineFormat,
      FACT_RULES.composition,
    ];
  }
  return [FACT_RULES.count, FACT_RULES.capacity];
}

function compatibilityCue(
  aisles: readonly (typeof VAPE_AISLES)[number][],
): VapeCardModel["compatibilityCue"] {
  const slugs = new Set(aisles.map((aisle) => aisle.slug));
  if (slugs.has("pods") || slugs.has("coils") || slugs.has("parts-accessories")) {
    return { label: "Fit", value: "Unverified" };
  }
  if (slugs.has("pod-systems") || slugs.has("devices-kits")) {
    return { label: "Replacements", value: "Unverified" };
  }
  if (slugs.has("e-liquid")) return { label: "Hardware", value: "Unverified" };
  return null;
}

function optionAvailability(quantity: number): VapeProductOption["availability"] {
  if (quantity < 0) return "Availability unknown";
  if (quantity === 0) return "Sold out";
  return "Available";
}

function productAvailability(options: readonly VapeProductOption[]): VapeCardModel["availability"] {
  const states = new Set(options.map((option) => option.availability));
  if (states.has("Availability unknown")) return "Availability unknown";
  if (states.size > 1) return "Options vary";
  return options[0]?.availability ?? "Availability unknown";
}

function cardPrice(options: readonly VapeProductOption[]): string {
  const available = options.filter((option) => option.availability === "Available");
  const candidates = available.length > 0 ? available : options;
  if (candidates.length === 0) return "Price unavailable";
  const currency = candidates[0].currency;
  if (!candidates.every((option) => option.currency === currency)) {
    return "Price varies by currency";
  }
  const minimum = Math.min(...candidates.map((option) => option.amountCents));
  const exact = candidates.every((option) => option.amountCents === minimum);
  return `${exact ? "" : "From "}${formatMoney(minimum, currency)}`;
}

function typeLabel(
  product: StorefrontProduct,
  aisles: readonly (typeof VAPE_AISLES)[number][],
): string | null {
  const eLiquid = aisles.some((aisle) => aisle.slug === "e-liquid");
  if (eLiquid) {
    const format = productFact(product, FACT_RULES.nicotineFormat)?.value;
    if (format && format !== "Varies by option") return `${format} e-liquid`;
  }
  return aisles[0]?.label ?? null;
}

export function vapeProductFacts(
  product: StorefrontProduct,
): readonly Readonly<{ label: string; value: string }>[] {
  const aisles = vapeAislesForProduct(product);
  return factOrder(aisles)
    .map((rule) => productFact(product, rule))
    .filter((fact): fact is { label: string; value: string } => fact !== null);
}

export function vapeCardModel(product: StorefrontProduct): VapeCardModel {
  const variantNames = product.variants.map((variant) => normalizeValue(variant.name));
  const merchandisable =
    product.variants.length > 0 &&
    product.variants.every((variant) => variant.skus.length === 1) &&
    new Set(variantNames).size === variantNames.length;
  const options = merchandisable
    ? product.variants.map((variant) => {
        const sku = variant.skus[0]!;
        return {
          id: variant.id,
          name: variant.name,
          href: `/products/${encodeURIComponent(sku.sku)}`,
          price: formatMoney(sku.retailPrice.amountCents, sku.retailPrice.currency),
          amountCents: sku.retailPrice.amountCents,
          currency: sku.retailPrice.currency,
          availability: optionAvailability(sku.availableQuantity),
        } as const;
      })
    : [];
  const aisles = vapeAislesForProduct(product);
  const facts = vapeProductFacts(product).slice(0, 3);
  const availability = productAvailability(options);
  const exactDetailHref = merchandisable && options.length === 1 ? options[0]?.href ?? null : null;

  return {
    typeLabel: typeLabel(product, aisles),
    aisles,
    options,
    facts,
    compatibilityCue: compatibilityCue(aisles),
    price: cardPrice(options),
    availability,
    exactDetailHref,
    actionLabel:
      exactDetailHref && availability === "Available" ? "View product" : "View details",
    merchandisable,
  };
}

export function vapeEmptyShelfCopy(
  aisleLabel: string | null,
): Readonly<{ title: string; message: string }> {
  return {
    title: aisleLabel
      ? `No ${aisleLabel.toLocaleLowerCase()} are on the shelf right now.`
      : "No Vape / Nicotine products are on the shelf right now.",
    message: "Check again later.",
  };
}
