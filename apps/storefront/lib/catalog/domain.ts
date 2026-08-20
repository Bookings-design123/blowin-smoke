import type {
  DecisionState,
  DivisionKey,
  StorefrontProduct,
  StorefrontSku,
  StorefrontVariant,
} from "./types";

export const DIVISION_META: Readonly<
  Record<DivisionKey, { label: string; route: string; shopRoute: string }>
> = {
  THCA: { label: "THCA", route: "/thca", shopRoute: "/thca/shop" },
  VAPE_NICOTINE: {
    label: "Vape & Nicotine",
    route: "/vape-nicotine",
    shopRoute: "/vape-nicotine/shop",
  },
  GLASS_ACCESSORIES: {
    label: "Glass / Accessories / Merch",
    route: "/glass-accessories",
    shopRoute: "/glass-accessories/shop",
  },
};

export function allSkus(product: StorefrontProduct): readonly StorefrontSku[] {
  return product.variants.flatMap((variant) => variant.skus);
}

export function findSelection(
  product: StorefrontProduct,
  skuCode?: string,
): { variant: StorefrontVariant; sku: StorefrontSku } | null {
  for (const variant of product.variants) {
    const sku = variant.skus.find((candidate) => candidate.sku === skuCode) ??
      (skuCode ? undefined : variant.skus[0]);
    if (sku) return { variant, sku };
  }
  return null;
}

export function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

export function productPriceLabel(product: StorefrontProduct): string {
  const prices = allSkus(product).map((sku) => sku.retailPrice);
  if (prices.length === 0) return "Price unavailable";
  const currency = prices[0].currency;
  if (!prices.every((price) => price.currency === currency)) return "Price varies by currency";
  const minimum = Math.min(...prices.map((price) => price.amountCents));
  const exact = prices.every((price) => price.amountCents === minimum);
  return `${exact ? "" : "From "}${formatMoney(minimum, currency)}`;
}

export function deriveDecisionState(
  product: StorefrontProduct,
  selectedSku?: StorefrontSku,
): DecisionState {
  const sku = selectedSku ?? allSkus(product)[0];
  if (!sku) {
    return {
      tone: "blocked",
      label: "Selection unavailable",
      availability: "Unknown",
      reason: "No complete priced sellable selection was returned by the canonical catalog.",
      recoveryLabel: "Get product help",
      recoveryHref: "/support",
    };
  }
  if (sku.availableQuantity === 0) {
    return {
      tone: "blocked",
      label: "Sold out",
      availability: "Sold out",
      reason: "The exact published selection has no available quantity. No restock promise is published.",
      recoveryLabel: "Search the house",
      recoveryHref: "/search",
    };
  }
  if (sku.availableQuantity < 0) {
    return {
      tone: "blocked",
      label: "Availability unknown",
      availability: "Unknown",
      reason: "The returned availability record could not support a customer-facing conclusion.",
      recoveryLabel: "Get product help",
      recoveryHref: "/support",
    };
  }

  const divisionState: Record<DivisionKey, Pick<DecisionState, "label" | "reason" | "recoveryLabel" | "recoveryHref">> = {
    THCA: {
      label: "Proof and eligibility unresolved",
      reason:
        "This public catalog record does not include exact proof applicability or an eligibility result. Availability alone cannot authorize purchase.",
      recoveryLabel: "Understand THCA proof",
      recoveryHref: "/learn/thca-proof",
    },
    VAPE_NICOTINE: {
      label: "Role and compatibility unresolved",
      reason:
        "This public catalog record does not include a verified device, platform, or component relationship. Availability alone cannot prove fit.",
      recoveryLabel: "Identify what you own",
      recoveryHref: "/learn/device-identification",
    },
    GLASS_ACCESSORIES: {
      label: "Physical fit and requirements unresolved",
      reason:
        "This public catalog record does not include a verified physical-fit relationship or complete required-part record.",
      recoveryLabel: "Measure a connection",
      recoveryHref: "/learn/measure-a-connection",
    },
  };

  return {
    tone: "caution",
    availability: "Available",
    ...divisionState[product.division],
  };
}

export function humanizeAttributeName(name: string): string {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function displayAttributeValue(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return null;
}

export function comparisonFacts(product: StorefrontProduct): readonly { label: string; value: string }[] {
  const firstVariant = product.variants[0];
  if (!firstVariant) return [];
  return Object.entries(firstVariant.attributes)
    .map(([label, value]) => ({ label: humanizeAttributeName(label), value: displayAttributeValue(value) }))
    .filter((fact): fact is { label: string; value: string } => fact.value !== null)
    .slice(0, 3);
}

export function filterAndSortProducts(
  products: readonly StorefrontProduct[],
  options: { query?: string; availability?: string; sort?: string } = {},
): readonly StorefrontProduct[] {
  const query = options.query?.trim().toLocaleLowerCase() ?? "";
  const filtered = products.filter((product) => {
    const skus = allSkus(product);
    const matchesQuery =
      !query ||
      product.name.toLocaleLowerCase().includes(query) ||
      product.description.toLocaleLowerCase().includes(query) ||
      skus.some((sku) => sku.sku.toLocaleLowerCase().includes(query));
    const matchesAvailability =
      !options.availability ||
      options.availability === "all" ||
      (options.availability === "available" && skus.some((sku) => sku.availableQuantity > 0)) ||
      (options.availability === "sold-out" && skus.every((sku) => sku.availableQuantity === 0));
    return matchesQuery && matchesAvailability;
  });

  return [...filtered].sort((left, right) => {
    if (options.sort === "price-asc") {
      const leftPrice = Math.min(...allSkus(left).map((sku) => sku.retailPrice.amountCents));
      const rightPrice = Math.min(...allSkus(right).map((sku) => sku.retailPrice.amountCents));
      return leftPrice - rightPrice || left.name.localeCompare(right.name);
    }
    if (options.sort === "price-desc") {
      const leftPrice = Math.max(...allSkus(left).map((sku) => sku.retailPrice.amountCents));
      const rightPrice = Math.max(...allSkus(right).map((sku) => sku.retailPrice.amountCents));
      return rightPrice - leftPrice || left.name.localeCompare(right.name);
    }
    return left.name.localeCompare(right.name);
  });
}
