import { cache } from "react";

import {
  DIVISION_KEYS,
  type CatalogSnapshot,
  type DivisionKey,
  type Money,
  type ProductLookup,
  type StorefrontImage,
  type StorefrontProduct,
  type StorefrontSku,
  type StorefrontVariant,
} from "./types";

const REQUEST_TIMEOUT_MS = 6_000;
const UNCONFIGURED_MESSAGE =
  "Published catalog data is not connected to this storefront deployment yet.";
const ERROR_MESSAGE =
  "Published catalog data is temporarily unavailable. House routes and guides remain available.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function safeInteger(value: unknown, { minimum }: { minimum?: number } = {}): number | null {
  if (!Number.isSafeInteger(value)) return null;
  const result = value as number;
  if (minimum !== undefined && result < minimum) return null;
  return result;
}

function normalizeMoney(value: unknown): Money | null {
  if (!isRecord(value)) return null;
  const amountCents = safeInteger(value.amountCents, { minimum: 0 });
  const currency = text(value.currency)?.toUpperCase() ?? null;
  if (amountCents === null || !currency || !/^[A-Z]{3}$/.test(currency)) return null;
  return { amountCents, currency };
}

function normalizeSku(value: unknown): StorefrontSku | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const sku = text(value.sku);
  const retailPrice = normalizeMoney(value.retailPrice);
  const availableQuantity = safeInteger(value.availableQuantity);
  if (!id || !sku || !retailPrice || availableQuantity === null) return null;
  return { id, sku, retailPrice, availableQuantity };
}

function normalizeVariant(value: unknown): StorefrontVariant | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const name = text(value.name);
  const attributes = isRecord(value.attributes) ? value.attributes : {};
  const skus = Array.isArray(value.skus)
    ? value.skus.map(normalizeSku).filter((sku): sku is StorefrontSku => sku !== null)
    : [];
  if (!id || !name || skus.length === 0) return null;
  return { id, name, attributes, skus };
}

function normalizeImage(value: unknown): StorefrontImage | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const filename = text(value.filename);
  const contentType = text(value.contentType);
  const byteLength = safeInteger(value.byteLength, { minimum: 1 });
  const checksum = text(value.checksum);
  const url = text(value.url);
  if (!id || !filename || !contentType || byteLength === null || !checksum || !url) return null;
  return { id, filename, contentType, byteLength, checksum, url };
}

function isDivision(value: unknown): value is DivisionKey {
  return typeof value === "string" && DIVISION_KEYS.includes(value as DivisionKey);
}

export function normalizePublicProduct(value: unknown): StorefrontProduct | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const name = text(value.name);
  const description = typeof value.description === "string" ? value.description.trim() : "";
  const publicationState = value.publicationState;
  if (!id || !name || !isDivision(value.division) || publicationState !== "PUBLISHED") {
    return null;
  }
  const variants = Array.isArray(value.variants)
    ? value.variants
        .map(normalizeVariant)
        .filter((variant): variant is StorefrontVariant => variant !== null)
    : [];
  if (variants.length === 0) return null;
  const images = Array.isArray(value.images)
    ? value.images.map(normalizeImage).filter((image): image is StorefrontImage => image !== null)
    : [];
  return {
    id,
    name,
    description,
    division: value.division,
    publicationState,
    variants,
    images,
  };
}

export function normalizeCatalogPayload(value: unknown): CatalogSnapshot {
  if (!isRecord(value) || !Array.isArray(value.products)) {
    return { status: "error", products: [], suppressedRecords: 0, message: ERROR_MESSAGE };
  }
  const products = value.products
    .map(normalizePublicProduct)
    .filter((product): product is StorefrontProduct => product !== null);
  return {
    status: "ready",
    products,
    suppressedRecords: value.products.length - products.length,
  };
}

function commerceOrigin(): string | null {
  const configured = process.env.STOREFRONT_COMMERCE_API_ORIGIN?.trim();
  if (!configured) return null;
  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

async function canonicalFetch(pathname: string): Promise<Response | null> {
  const origin = commerceOrigin();
  if (!origin) return null;
  return fetch(new URL(pathname, origin), {
    cache: "no-store",
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

export const getPublishedCatalog = cache(async (): Promise<CatalogSnapshot> => {
  if (!commerceOrigin()) {
    return {
      status: "unconfigured",
      products: [],
      suppressedRecords: 0,
      message: UNCONFIGURED_MESSAGE,
    };
  }
  try {
    const response = await canonicalFetch("/api/products");
    if (!response?.ok) {
      return { status: "error", products: [], suppressedRecords: 0, message: ERROR_MESSAGE };
    }
    return normalizeCatalogPayload(await response.json());
  } catch {
    return { status: "error", products: [], suppressedRecords: 0, message: ERROR_MESSAGE };
  }
});

export const getPublishedProductBySku = cache(async (sku: string): Promise<ProductLookup> => {
  if (!commerceOrigin()) return { status: "unconfigured", message: UNCONFIGURED_MESSAGE };
  try {
    const response = await canonicalFetch(`/api/products/${encodeURIComponent(sku)}`);
    if (response?.status === 404) return { status: "not-found" };
    if (!response?.ok) return { status: "error", message: ERROR_MESSAGE };
    const payload: unknown = await response.json();
    if (!isRecord(payload)) return { status: "error", message: ERROR_MESSAGE };
    const product = normalizePublicProduct(payload.product);
    return product ? { status: "found", product } : { status: "not-found" };
  } catch {
    return { status: "error", message: ERROR_MESSAGE };
  }
});

export function getCommerceMediaUrl(mediaId: string): string | null {
  const origin = commerceOrigin();
  if (!origin || !mediaId.trim()) return null;
  return new URL(`/api/media/${encodeURIComponent(mediaId)}`, origin).toString();
}
