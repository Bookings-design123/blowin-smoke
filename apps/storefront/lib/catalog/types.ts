export const DIVISION_KEYS = [
  "THCA",
  "VAPE_NICOTINE",
  "GLASS_ACCESSORIES",
] as const;

export type DivisionKey = (typeof DIVISION_KEYS)[number];

export type Money = Readonly<{
  amountCents: number;
  currency: string;
}>;

export type StorefrontSku = Readonly<{
  id: string;
  sku: string;
  retailPrice: Money;
  availableQuantity: number;
}>;

export type StorefrontVariant = Readonly<{
  id: string;
  name: string;
  attributes: Readonly<Record<string, unknown>>;
  skus: readonly StorefrontSku[];
}>;

export type StorefrontImage = Readonly<{
  id: string;
  filename: string;
  contentType: string;
  byteLength: number;
  checksum: string;
  url: string;
}>;

export type StorefrontProduct = Readonly<{
  id: string;
  name: string;
  description: string;
  division: DivisionKey;
  publicationState: "PUBLISHED";
  variants: readonly StorefrontVariant[];
  images: readonly StorefrontImage[];
}>;

export type CatalogSnapshot = Readonly<{
  status: "ready" | "unconfigured" | "error";
  products: readonly StorefrontProduct[];
  suppressedRecords: number;
  message?: string;
}>;

export type ProductLookup =
  | Readonly<{ status: "found"; product: StorefrontProduct }>
  | Readonly<{ status: "not-found" }>
  | Readonly<{ status: "unconfigured" | "error"; message: string }>;

export type DecisionState = Readonly<{
  tone: "quiet" | "caution" | "blocked";
  label: string;
  availability: "Available" | "Sold out" | "Unknown";
  reason: string;
  recoveryLabel: string;
  recoveryHref: string;
}>;
