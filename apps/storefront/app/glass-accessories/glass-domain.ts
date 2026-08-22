import { formatMoney } from "@/lib/catalog/domain";
import type {
  StorefrontProduct,
  StorefrontVariant,
} from "@/lib/catalog/types";

export const GLASS_DEPARTMENTS = [
  { slug: "glass", label: "Glass" },
  { slug: "accessories", label: "Accessories" },
  { slug: "merch", label: "Merch" },
] as const;

export type GlassDepartmentSlug = (typeof GLASS_DEPARTMENTS)[number]["slug"];

export const GLASS_AISLES = [
  {
    slug: "water-pipes",
    label: "Water pipes",
    department: "glass",
    aliases: ["bong", "bongs", "water pipe", "water pipes"],
  },
  {
    slug: "hand-pipes",
    label: "Hand pipes",
    department: "glass",
    aliases: ["hand pipe", "hand pipes"],
  },
  {
    slug: "bubblers",
    label: "Bubblers",
    department: "glass",
    aliases: ["bubbler", "bubblers"],
  },
  {
    slug: "rigs",
    label: "Rigs",
    department: "glass",
    aliases: ["dab rig", "dab rigs", "rig", "rigs"],
  },
  {
    slug: "bowls",
    label: "Bowls",
    department: "glass",
    aliases: ["bowl", "bowls", "slide", "slides", "bowl slide"],
  },
  {
    slug: "bangers",
    label: "Bangers",
    department: "glass",
    aliases: ["banger", "bangers", "nail", "nails", "banger nail"],
  },
  {
    slug: "downstems",
    label: "Downstems",
    department: "accessories",
    aliases: ["downstem", "downstems"],
  },
  {
    slug: "ash-catchers",
    label: "Ash catchers",
    department: "accessories",
    aliases: [
      "ash catcher",
      "ash catchers",
      "reclaim catcher",
      "reclaim catchers",
    ],
  },
  {
    slug: "adapters",
    label: "Adapters",
    department: "accessories",
    aliases: ["adapter", "adapters"],
  },
  {
    slug: "replacement-parts",
    label: "Replacement parts",
    department: "accessories",
    aliases: ["replacement component", "replacement part"],
  },
  {
    slug: "cleaning-care",
    label: "Cleaning / care",
    department: "accessories",
    aliases: ["cleaner", "cleaners"],
  },
  {
    slug: "storage-cases",
    label: "Storage / cases",
    department: "accessories",
    aliases: [
      "storage",
      "storage case",
      "storage cases",
      "case",
      "cases",
      "jar",
      "jars",
    ],
  },
  {
    slug: "grinders",
    label: "Grinders",
    department: "accessories",
    aliases: ["grinder", "grinders"],
  },
  {
    slug: "torches-lighters",
    label: "Torches / lighters",
    department: "accessories",
    aliases: [
      "torch",
      "torches",
      "lighter",
      "lighters",
      "torch lighter",
    ],
  },
  {
    slug: "other-accessories",
    label: "Other accessories",
    department: "accessories",
    aliases: [],
  },
  {
    slug: "apparel",
    label: "Apparel",
    department: "merch",
    aliases: ["apparel"],
  },
  {
    slug: "hats",
    label: "Hats",
    department: "merch",
    aliases: ["hat", "hats"],
  },
  {
    slug: "bags",
    label: "Bags",
    department: "merch",
    aliases: ["bag", "bags"],
  },
  {
    slug: "stickers",
    label: "Stickers",
    department: "merch",
    aliases: ["sticker", "stickers"],
  },
  {
    slug: "branded-goods",
    label: "Branded goods",
    department: "merch",
    aliases: ["branded good", "branded goods"],
  },
] as const satisfies readonly Readonly<{
  slug: string;
  label: string;
  department: GlassDepartmentSlug;
  aliases: readonly string[];
}>[];

export type GlassAisleSlug = (typeof GLASS_AISLES)[number]["slug"];

export type GlassProductOption = Readonly<{
  id: string;
  name: string;
  href: string;
  price: string;
  amountCents: number;
  currency: string;
  availability: "Available" | "Sold out" | "Availability unknown";
}>;

export type GlassCardModel = Readonly<{
  typeLabel: string | null;
  aisles: readonly (typeof GLASS_AISLES)[number][];
  options: readonly GlassProductOption[];
  facts: readonly Readonly<{ label: string; value: string }>[];
  fitCue: Readonly<{ label: "Fit"; value: "Fit not specified" }> | null;
  price: string;
  availability:
    | "Available"
    | "Sold out"
    | "Options vary"
    | "Availability unknown";
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

const KNOWN_ROLES = new Set([
  "complete product",
  "consumable",
  "replacement",
  "fitted component",
  "accessory",
  "care product",
  "session tool",
  "service enabling object",
  "maker / artist object",
]);

const FITTED_AISLES = new Set<GlassAisleSlug>([
  "bowls",
  "bangers",
  "downstems",
  "ash-catchers",
  "adapters",
  "replacement-parts",
]);

const MATERIAL_ATTRIBUTE_KEYS = new Set([
  "material",
  "primarymaterial",
]);
const HEIGHT_ATTRIBUTE_KEYS = new Set([
  "height",
  "overallheight",
]);
const LENGTH_ATTRIBUTE_KEYS = new Set([
  "effectivelength",
  "insertionlength",
  "length",
  "overalllength",
  "downstemlength",
]);
const DIAMETER_ATTRIBUTE_KEYS = new Set([
  "diameter",
  "grinderdiameter",
]);
const DIMENSION_ATTRIBUTE_KEYS = new Set([
  "dimensions",
  "externaldimensions",
  "size",
]);
const JOINT_SIZE_ATTRIBUTE_KEYS = new Set([
  "connectionsize",
  "jointdiameter",
  "jointsize",
]);
const JOINT_GENDER_ATTRIBUTE_KEYS = new Set([
  "connectiongender",
  "gender",
  "jointgender",
]);
const ANGLE_ATTRIBUTE_KEYS = new Set([
  "angle",
  "jointangle",
]);
const COUNT_ATTRIBUTE_KEYS = new Set([
  "count",
  "packagecount",
  "packagequantity",
  "quantity",
  "unitcount",
]);
const CAPACITY_ATTRIBUTE_KEYS = new Set([
  "capacity",
  "packagesize",
  "volume",
]);
const STAGE_COUNT_ATTRIBUTE_KEYS = new Set([
  "stagecount",
  "stages",
]);
const COLOR_ATTRIBUTE_KEYS = new Set([
  "color",
  "colour",
]);
const APPAREL_SIZE_ATTRIBUTE_KEYS = new Set([
  "apparelsize",
  "clothingsize",
  "merchsize",
  "size",
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
  return normalizeValue(value).replace(/[_-]+/g, " ").replace(/\s+/g, " ");
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

function exactAisle(value: string): GlassAisleSlug | null {
  const aisle = GLASS_AISLES.find((candidate) =>
    candidate.aliases.some((alias) => alias === value),
  );
  return aisle?.slug ?? null;
}

type VariantClassification = Readonly<{
  valid: boolean;
  primaryAisle: GlassAisleSlug | null;
  replacement: boolean;
}>;

function variantClassification(variant: StorefrontVariant): VariantClassification {
  const typeValues = normalizedAttributeText(variant, TYPE_ATTRIBUTE_KEYS);
  if (typeValues === null) {
    return { valid: false, primaryAisle: null, replacement: false };
  }

  const roleValues = normalizedAttributeText(variant, ROLE_ATTRIBUTE_KEYS);
  const controlledRoles =
    roleValues !== null && roleValues.every((role) => KNOWN_ROLES.has(role))
      ? roleValues
      : [];
  const replacement =
    controlledRoles.length > 0 &&
    controlledRoles.every((role) => role === "replacement");

  if (typeValues.length > 0) {
    const matches = typeValues.map(exactAisle);
    if (matches.some((match) => match === null)) {
      return { valid: false, primaryAisle: null, replacement: false };
    }
    const unique = [...new Set(matches as GlassAisleSlug[])];
    return unique.length === 1
      ? { valid: true, primaryAisle: unique[0]!, replacement }
      : { valid: false, primaryAisle: null, replacement: false };
  }

  if (roleValues === null || controlledRoles.length !== roleValues.length) {
    return { valid: false, primaryAisle: null, replacement: false };
  }
  const uniqueRoles = [...new Set(controlledRoles)];
  if (uniqueRoles.length !== 1) {
    return { valid: true, primaryAisle: null, replacement: false };
  }

  const role = uniqueRoles[0];
  if (role === "replacement") {
    return { valid: true, primaryAisle: "replacement-parts", replacement: true };
  }
  if (role === "care product") {
    return { valid: true, primaryAisle: "cleaning-care", replacement: false };
  }
  if (role === "accessory" || role === "session tool") {
    return { valid: true, primaryAisle: "other-accessories", replacement: false };
  }
  return { valid: true, primaryAisle: null, replacement: false };
}

export function glassAislesForProduct(
  product: StorefrontProduct,
): readonly (typeof GLASS_AISLES)[number][] {
  const classifications = product.variants.map(variantClassification);
  if (
    classifications.length === 0 ||
    classifications.some((classification) => !classification.valid)
  ) {
    return [];
  }

  const primaryAisles = classifications.map(
    (classification) => classification.primaryAisle,
  );
  if (primaryAisles.some((aisle) => aisle === null)) return [];
  const uniquePrimaryAisles = new Set(primaryAisles as GlassAisleSlug[]);
  if (uniquePrimaryAisles.size !== 1) return [];

  const matched = new Set<GlassAisleSlug>(uniquePrimaryAisles);
  if (classifications.every((classification) => classification.replacement)) {
    matched.add("replacement-parts");
  }
  return GLASS_AISLES.filter((aisle) => matched.has(aisle.slug));
}

export function availableGlassAisles(products: readonly StorefrontProduct[]) {
  return GLASS_AISLES.map((aisle) => ({
    ...aisle,
    count: products.filter((product) =>
      glassAislesForProduct(product).some(
        (candidate) => candidate.slug === aisle.slug,
      ),
    ).length,
  })).filter((aisle) => aisle.count > 0);
}

export function availableGlassDepartments(
  products: readonly StorefrontProduct[],
) {
  const availableAisles = availableGlassAisles(products);
  return GLASS_DEPARTMENTS.map((department) => {
    const aisles = availableAisles.filter(
      (aisle) => aisle.department === department.slug,
    );
    const aisleSlugs = new Set(aisles.map((aisle) => aisle.slug));
    return {
      ...department,
      aisles,
      count: products.filter((product) =>
        glassAislesForProduct(product).some((aisle) =>
          aisleSlugs.has(aisle.slug),
        ),
      ).length,
    };
  }).filter((department) => department.count > 0);
}

export function parseGlassAisle(
  value: string | string[] | undefined,
): GlassAisleSlug | null {
  if (typeof value !== "string") return null;
  return GLASS_AISLES.some((aisle) => aisle.slug === value)
    ? (value as GlassAisleSlug)
    : null;
}

export function filterGlassProducts(
  products: readonly StorefrontProduct[],
  aisle: GlassAisleSlug | null,
): readonly StorefrontProduct[] {
  if (!aisle) return products;
  return products.filter((product) =>
    glassAislesForProduct(product).some(
      (candidate) => candidate.slug === aisle,
    ),
  );
}

function shortText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && text.length <= 64 && !/[\n\r{}<>]/.test(text) ? text : null;
}

function plainCustomerLabel(value: unknown): string | null {
  const text = shortText(value);
  if (
    !text ||
    /^(?:watch|unknown|unverified|not supplied|not specified|n\/?a)$/i.test(text) ||
    /\b(?:stock candidate|test[- ]buy candidate|insufficient evidence|research only|internal only)\b|failed\s*\/\s*do not stock/i.test(
      text,
    )
  ) {
    return null;
  }
  return text;
}

function positiveMeasurement(value: unknown): string | null {
  const text = shortText(value);
  const match = text?.match(
    /^(\d+(?:\.\d+)?)(?:\s*[x×]\s*(\d+(?:\.\d+)?)){0,2}\s*(mm|cm|m|in|inches?|\")$/i,
  );
  if (!match) return null;
  const magnitudes = text!.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return magnitudes.length > 0 &&
    magnitudes.every((magnitude) => Number.isFinite(magnitude) && magnitude > 0)
    ? text!
    : null;
}

function jointSize(value: unknown): string | null {
  const text = shortText(value);
  const match = text?.match(/^(\d+(?:\.\d+)?)\s*mm$/i);
  const size = match ? Number(match[1]) : Number.NaN;
  return Number.isFinite(size) && size > 0 ? text : null;
}

function jointGender(value: unknown): string | null {
  const text = shortText(value);
  if (!text) return null;
  const normalized = normalizeValue(text);
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return null;
}

function angle(value: unknown): string | null {
  const text = shortText(value);
  const match = text?.match(/^(\d+(?:\.\d+)?)\s*(?:°|degrees?)$/i);
  const degrees = match ? Number(match[1]) : Number.NaN;
  return Number.isFinite(degrees) && degrees > 0 && degrees < 180 ? text : null;
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

function positiveCapacity(value: unknown): string | null {
  const text = shortText(value);
  const match = text?.match(/^(\d+(?:\.\d+)?)\s*(m[lL]|[lL]|fl\.?\s*oz)$/i);
  const capacity = match ? Number(match[1]) : Number.NaN;
  return Number.isFinite(capacity) && capacity > 0 ? text : null;
}

const FACT_RULES = {
  material: {
    label: "Material",
    keys: MATERIAL_ATTRIBUTE_KEYS,
    format: plainCustomerLabel,
  },
  height: {
    label: "Height",
    keys: HEIGHT_ATTRIBUTE_KEYS,
    format: positiveMeasurement,
  },
  length: {
    label: "Length",
    keys: LENGTH_ATTRIBUTE_KEYS,
    format: positiveMeasurement,
  },
  diameter: {
    label: "Diameter",
    keys: DIAMETER_ATTRIBUTE_KEYS,
    format: positiveMeasurement,
  },
  dimensions: {
    label: "Dimensions",
    keys: DIMENSION_ATTRIBUTE_KEYS,
    format: positiveMeasurement,
  },
  jointSize: {
    label: "Joint size",
    keys: JOINT_SIZE_ATTRIBUTE_KEYS,
    format: jointSize,
  },
  jointGender: {
    label: "Joint gender",
    keys: JOINT_GENDER_ATTRIBUTE_KEYS,
    format: jointGender,
  },
  angle: {
    label: "Angle",
    keys: ANGLE_ATTRIBUTE_KEYS,
    format: angle,
  },
  count: {
    label: "Count",
    keys: COUNT_ATTRIBUTE_KEYS,
    format: positiveCount,
  },
  capacity: {
    label: "Quantity",
    keys: CAPACITY_ATTRIBUTE_KEYS,
    format: positiveCapacity,
  },
  stages: {
    label: "Stages",
    keys: STAGE_COUNT_ATTRIBUTE_KEYS,
    format: positiveCount,
  },
  color: {
    label: "Color",
    keys: COLOR_ATTRIBUTE_KEYS,
    format: plainCustomerLabel,
  },
  apparelSize: {
    label: "Size",
    keys: APPAREL_SIZE_ATTRIBUTE_KEYS,
    format: plainCustomerLabel,
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
  if (values.length === 0 || values.some((value) => value === null)) return null;
  const unique = [...new Set(values as string[])];
  return {
    label: rule.label,
    value: unique.length === 1 ? unique[0]! : "Varies by option",
  };
}

function connectionFact(product: StorefrontProduct) {
  const size = productFact(product, FACT_RULES.jointSize);
  const gender = productFact(product, FACT_RULES.jointGender);
  if (!size && !gender) return null;
  if (size?.value === "Varies by option" || gender?.value === "Varies by option") {
    return { label: "Connection", value: "Varies by option" };
  }
  return {
    label: "Connection",
    value: [size?.value, gender?.value].filter(Boolean).join(" · "),
  };
}

type FactCandidate = FactRule | "connection";

function primaryProductAisle(
  aisles: readonly (typeof GLASS_AISLES)[number][],
) {
  return (
    aisles.find((aisle) => aisle.slug !== "replacement-parts") ??
    aisles[0] ??
    null
  );
}

function factOrder(
  aisles: readonly (typeof GLASS_AISLES)[number][],
): readonly FactCandidate[] {
  const primary = primaryProductAisle(aisles)?.slug;
  switch (primary) {
    case "water-pipes":
    case "bubblers":
    case "rigs":
      return [FACT_RULES.material, FACT_RULES.height, "connection"];
    case "hand-pipes":
      return [FACT_RULES.material, FACT_RULES.length, FACT_RULES.dimensions];
    case "bowls":
      return ["connection", FACT_RULES.material, FACT_RULES.count];
    case "bangers":
      return ["connection", FACT_RULES.angle, FACT_RULES.material];
    case "downstems":
      return ["connection", FACT_RULES.length, FACT_RULES.material];
    case "ash-catchers":
      return ["connection", FACT_RULES.angle, FACT_RULES.height];
    case "adapters":
    case "replacement-parts":
      return ["connection", FACT_RULES.angle, FACT_RULES.dimensions];
    case "cleaning-care":
      return [FACT_RULES.capacity, FACT_RULES.count];
    case "storage-cases":
      return [FACT_RULES.dimensions, FACT_RULES.material, FACT_RULES.color];
    case "grinders":
      return [FACT_RULES.material, FACT_RULES.diameter, FACT_RULES.stages];
    case "torches-lighters":
    case "other-accessories":
      return [FACT_RULES.material, FACT_RULES.count, FACT_RULES.color];
    case "apparel":
    case "hats":
      return [FACT_RULES.apparelSize, FACT_RULES.color, FACT_RULES.material];
    case "bags":
    case "branded-goods":
      return [FACT_RULES.dimensions, FACT_RULES.color, FACT_RULES.material];
    case "stickers":
      return [FACT_RULES.dimensions, FACT_RULES.count, FACT_RULES.color];
    default:
      return [];
  }
}

function optionAvailability(
  quantity: number,
): GlassProductOption["availability"] {
  if (quantity < 0) return "Availability unknown";
  if (quantity === 0) return "Sold out";
  return "Available";
}

function productAvailability(
  options: readonly GlassProductOption[],
): GlassCardModel["availability"] {
  const states = new Set(options.map((option) => option.availability));
  if (states.has("Availability unknown")) return "Availability unknown";
  if (states.size > 1) return "Options vary";
  return options[0]?.availability ?? "Availability unknown";
}

function cardPrice(options: readonly GlassProductOption[]): string {
  const available = options.filter((option) => option.availability === "Available");
  const candidates = available.length > 0 ? available : options;
  if (candidates.length === 0) return "Price unavailable";
  const currency = candidates[0]!.currency;
  if (!candidates.every((option) => option.currency === currency)) {
    return "Price varies by currency";
  }
  const minimum = Math.min(...candidates.map((option) => option.amountCents));
  const exact = candidates.every((option) => option.amountCents === minimum);
  return `${exact ? "" : "From "}${formatMoney(minimum, currency)}`;
}

export function glassProductFacts(
  product: StorefrontProduct,
): readonly Readonly<{ label: string; value: string }>[] {
  const aisles = glassAislesForProduct(product);
  return factOrder(aisles)
    .map((candidate) =>
      candidate === "connection"
        ? connectionFact(product)
        : productFact(product, candidate),
    )
    .filter((fact): fact is { label: string; value: string } => fact !== null);
}

export function glassCardModel(product: StorefrontProduct): GlassCardModel {
  const variantNames = product.variants.map((variant) =>
    normalizeValue(variant.name),
  );
  const aisles = glassAislesForProduct(product);
  const merchandisable =
    aisles.length > 0 &&
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
          price: formatMoney(
            sku.retailPrice.amountCents,
            sku.retailPrice.currency,
          ),
          amountCents: sku.retailPrice.amountCents,
          currency: sku.retailPrice.currency,
          availability: optionAvailability(sku.availableQuantity),
        } as const;
      })
    : [];
  const facts = glassProductFacts(product).slice(0, 3);
  const primaryAisle = primaryProductAisle(aisles);
  const fitCue = primaryAisle && FITTED_AISLES.has(primaryAisle.slug)
    ? ({ label: "Fit", value: "Fit not specified" } as const)
    : null;
  const availability = productAvailability(options);
  const exactDetailHref =
    merchandisable && options.length === 1 ? options[0]?.href ?? null : null;

  return {
    typeLabel: primaryAisle?.label ?? null,
    aisles,
    options,
    facts,
    fitCue,
    price: cardPrice(options),
    availability,
    exactDetailHref,
    actionLabel:
      exactDetailHref && availability === "Available" && fitCue === null
        ? "View product"
        : "View details",
    merchandisable,
  };
}

export function glassEmptyShelfCopy(
  aisleLabel: string | null,
): Readonly<{ title: string; message: string }> {
  return {
    title: aisleLabel
      ? `No ${aisleLabel.toLocaleLowerCase()} are on the shelf right now.`
      : "No Glass / Accessories / Merch products are on the shelf right now.",
    message: "Check again later.",
  };
}
