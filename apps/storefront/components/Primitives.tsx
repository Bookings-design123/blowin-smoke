import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { deriveDecisionState } from "@/lib/catalog/domain";
import type { StorefrontProduct } from "@/lib/catalog/types";

export type RecoveryAction = Readonly<{
  href: string;
  label: string;
}>;

export type BreadcrumbItem = Readonly<{
  label: string;
  href?: string;
}>;

export function Breadcrumbs({
  items,
}: Readonly<{ items: readonly BreadcrumbItem[] }>) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !current ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={current ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function MediaPlaceholder({
  productName,
  title = "Product media unavailable",
  message = "Exact identity and decision facts remain available without an image.",
  aspect = "portrait",
  compact = false,
}: Readonly<{
  productName?: string;
  title?: string;
  message?: string;
  aspect?: "portrait" | "square" | "wide";
  compact?: boolean;
}>) {
  return (
    <figure
      className={`media-placeholder${compact ? " media-placeholder--compact" : ""}`}
      data-aspect={aspect}
    >
      <div className="media-placeholder__field" aria-hidden="true">
        <span>Media pending</span>
      </div>
      <figcaption>
        <strong>{productName ? `${productName} — ${title}` : title}</strong>
        <span>{message}</span>
      </figcaption>
    </figure>
  );
}

export type StateTone = "quiet" | "information" | "caution" | "blocked";

export function StatePanel({
  state,
  title,
  reason,
  consequence,
  recovery,
  tone = "information",
  headingLevel = 3,
  headingId,
  compact = false,
  children,
}: Readonly<{
  state: string;
  title: string;
  reason: string;
  consequence?: string;
  recovery?: RecoveryAction;
  tone?: StateTone;
  headingLevel?: 2 | 3 | 4;
  headingId?: string;
  compact?: boolean;
  children?: ReactNode;
}>) {
  const Heading = headingLevel === 2 ? "h2" : headingLevel === 4 ? "h4" : "h3";

  return (
    <section
      className={`state-panel state-panel--${tone}${compact ? " state-panel--compact" : ""}`}
      data-state={state.toLowerCase().replaceAll(" ", "-")}
    >
      <p className="state-panel__label">{state}</p>
      <Heading id={headingId}>{title}</Heading>
      <p className="state-panel__reason">
        <strong>Why:</strong> {reason}
      </p>
      {consequence ? (
        <p className="state-panel__consequence">
          <strong>What this changes:</strong> {consequence}
        </p>
      ) : null}
      {children}
      {recovery ? (
        <p className="state-panel__recovery">
          <span>Next move</span>
          <Link href={recovery.href}>{recovery.label}</Link>
        </p>
      ) : null}
    </section>
  );
}

export type CatalogStateName =
  | "loading"
  | "empty"
  | "unavailable"
  | "partial"
  | "stale"
  | "error";

const catalogStateLabels: Readonly<Record<CatalogStateName, string>> = {
  loading: "Loading",
  empty: "No qualified products",
  unavailable: "Catalog unavailable",
  partial: "Partial catalog",
  stale: "Catalog may be out of date",
  error: "Catalog service error",
};

export function CatalogState({
  state,
  title,
  reason,
  preservedContext,
  recovery,
  children,
}: Readonly<{
  state: CatalogStateName;
  title: string;
  reason: string;
  preservedContext?: string;
  recovery?: RecoveryAction;
  children?: ReactNode;
}>) {
  const isLoading = state === "loading";
  const isError = state === "error";

  return (
    <section
      className={`catalog-state catalog-state--${state}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-busy={isLoading || undefined}
    >
      <p className="catalog-state__label">{catalogStateLabels[state]}</p>
      <h2>{title}</h2>
      <p>{reason}</p>
      {preservedContext ? (
        <p className="catalog-state__context">
          <strong>Your context is preserved:</strong> {preservedContext}
        </p>
      ) : null}
      {children}
      {recovery ? (
        <Link className="button button--secondary" href={recovery.href}>
          {recovery.label}
        </Link>
      ) : null}
    </section>
  );
}

function isScalarAttribute(
  entry: [string, unknown],
): entry is [string, string | number | boolean] {
  const [key, value] = entry;
  return (
    !key.startsWith("_") &&
    (typeof value === "string" ||
      typeof value === "boolean" ||
      (typeof value === "number" && Number.isFinite(value)))
  );
}

function humanizeAttributeName(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (character) => character.toUpperCase());
}

function formatAttributeValue(value: string | number | boolean) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function formatMoney(amountCents: number, currency: string) {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0) {
    return "Price unavailable";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currency || "USD"}`;
  }
}

const divisionLabels = {
  THCA: "THCA",
  VAPE_NICOTINE: "Vape / Nicotine",
  GLASS_ACCESSORIES: "Glass / Accessories / Merch",
} as const;

export function ProductCard({
  product,
  selectedSku,
}: Readonly<{
  product: StorefrontProduct;
  selectedSku?: string;
}>) {
  const records = product.variants.flatMap((variant) =>
    variant.skus.map((sku) => ({
      sku,
      variant,
    })),
  );
  const selectedRecord = records.find(
    (record) => record.sku.sku === selectedSku,
  );
  const record = selectedRecord ?? records.at(0);
  const sku = record?.sku;
  const variant = record?.variant;
  const productHref = sku
    ? `/products/${encodeURIComponent(sku.sku)}`
    : "/support";
  const image = product.images.at(0);
  const facts = variant
    ? Object.entries(variant.attributes).filter(isScalarAttribute).slice(0, 3)
    : [];

  const decision = deriveDecisionState(product, sku);
  const consequence =
    decision.availability === "Sold out"
      ? "Purchase is unavailable for this exact SKU. No restock date is promised."
      : decision.availability === "Unknown"
        ? "No purchase action is presented until availability resolves."
        : "Availability alone does not establish proof, eligibility, compatibility, fit, or purchase readiness.";
  const recovery: RecoveryAction = sku
    ? { href: productHref, label: "Review exact product" }
    : { href: "/support", label: "Get product help" };

  return (
    <article
      className={`product-card product-card--${decision.tone}`}
      data-division={product.division}
    >
      <div className="product-card__media">
        {image ? (
          <Image
            src={`/media/${encodeURIComponent(image.id)}`}
            alt=""
            fill
            sizes="(max-width: 680px) calc(100vw - 28px), (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <MediaPlaceholder productName={product.name} compact />
        )}
      </div>

      <p className="product-card__record">
        <span>{divisionLabels[product.division]}</span>
        <span>{sku?.sku ?? "SKU unavailable"}</span>
      </p>
      <h3>{product.name}</h3>
      <p className="product-card__selection">
        <strong>Selected record:</strong> {variant?.name ?? "No canonical variant"}
      </p>
      <p className="product-card__description">
        {product.description || "Description not supplied for this product."}
      </p>

      {facts.length > 0 ? (
        <dl className="product-card__facts">
          {facts.map(([key, value]) => (
            <div key={key}>
              <dt>{humanizeAttributeName(key)}</dt>
              <dd>{formatAttributeValue(value)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="product-card__facts-empty">
          Variant comparison facts are not supplied.
        </p>
      )}

      <p className="product-card__price">
        {sku
          ? formatMoney(sku.retailPrice.amountCents, sku.retailPrice.currency)
          : "Price unavailable"}
      </p>

      <StatePanel
        state={`Availability · ${decision.availability}`}
        title={decision.label}
        reason={decision.reason}
        consequence={consequence}
        recovery={recovery}
        tone={decision.tone}
        headingLevel={4}
        compact
      />
    </article>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  aside,
  headingLevel = 2,
  id,
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  aside?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  id?: string;
}>) {
  const Heading = headingLevel === 1 ? "h1" : headingLevel === 3 ? "h3" : "h2";

  return (
    <header className="section-intro">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Heading id={id}>{title}</Heading>
        {description ? <p className="section-intro__description">{description}</p> : null}
      </div>
      {aside ? <div className="section-intro__aside">{aside}</div> : null}
    </header>
  );
}

export function HouseRead({
  conclusion,
  rationale,
  bestFor,
  tradeoff,
  evidenceBasis,
  limits,
  reviewedAt,
}: Readonly<{
  conclusion: string;
  rationale: string;
  bestFor?: string;
  tradeoff?: string;
  evidenceBasis?: string;
  limits?: string;
  reviewedAt?: string;
}>) {
  return (
    <aside className="house-read">
      <p className="eyebrow">House Read</p>
      <h3>{conclusion}</h3>
      <p>{rationale}</p>
      <dl>
        {bestFor ? (
          <div>
            <dt>Best for</dt>
            <dd>{bestFor}</dd>
          </div>
        ) : null}
        {tradeoff ? (
          <div>
            <dt>Know before buying</dt>
            <dd>{tradeoff}</dd>
          </div>
        ) : null}
        {evidenceBasis ? (
          <div>
            <dt>Evidence basis</dt>
            <dd>{evidenceBasis}</dd>
          </div>
        ) : null}
        {limits ? (
          <div>
            <dt>What this does not prove</dt>
            <dd>{limits}</dd>
          </div>
        ) : null}
        {reviewedAt ? (
          <div>
            <dt>Reviewed</dt>
            <dd>{reviewedAt}</dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}

export function SourceDisclosure({
  owner,
  evidenceBasis,
  reviewStatus,
  limitation,
  status = "partial",
}: Readonly<{
  owner: string;
  evidenceBasis: string;
  reviewStatus: string;
  limitation: string;
  status?: "complete" | "partial";
}>) {
  return (
    <aside className="source-disclosure" data-source-status={status}>
      <p className="source-disclosure__status">
        Source disclosure · {status}
      </p>
      <dl>
        <div>
          <dt>Content owner</dt>
          <dd>{owner}</dd>
        </div>
        <div>
          <dt>Evidence basis</dt>
          <dd>{evidenceBasis}</dd>
        </div>
        <div>
          <dt>Review status</dt>
          <dd>{reviewStatus}</dd>
        </div>
        <div>
          <dt>Limit</dt>
          <dd>{limitation}</dd>
        </div>
      </dl>
    </aside>
  );
}

export const LITMUS_STATUSES = [
  "stock candidate",
  "test-buy candidate",
  "watch",
  "failed / do not stock",
  "insufficient evidence",
] as const;

export type LitmusStatus = (typeof LITMUS_STATUSES)[number];

const litmusQualifications: Readonly<Record<LitmusStatus, string>> = {
  "stock candidate":
    "Research qualification only. It does not establish publication, inventory, compliance, or availability.",
  "test-buy candidate":
    "This is a limited evaluation step, not a customer recommendation or live assortment claim.",
  watch:
    "The reason for watching and the next evidence need remain part of this record.",
  "failed / do not stock":
    "This is an internal selection conclusion, not a live catalog, inventory, or universal quality claim.",
  "insufficient evidence":
    "Evidence is incomplete. No positive product, fit, eligibility, or availability claim is implied.",
};

export function LitmusRecord({
  status,
  scope,
  evidenceBasis,
  tradeoff,
  reviewedAt,
  nextEvidence,
}: Readonly<{
  status: LitmusStatus;
  scope: string;
  evidenceBasis: string;
  tradeoff: string;
  reviewedAt: string;
  nextEvidence?: string;
}>) {
  return (
    <article className="litmus-record" data-litmus-status={status}>
      <p className="litmus-record__status">Research status · {status}</p>
      <h3>{scope}</h3>
      <p className="litmus-record__qualification">
        {litmusQualifications[status]}
      </p>
      <dl>
        <div>
          <dt>Current evidence basis</dt>
          <dd>{evidenceBasis}</dd>
        </div>
        <div>
          <dt>Known tradeoff</dt>
          <dd>{tradeoff}</dd>
        </div>
        {nextEvidence ? (
          <div>
            <dt>Next evidence needed</dt>
            <dd>{nextEvidence}</dd>
          </div>
        ) : null}
        <div>
          <dt>Reviewed</dt>
          <dd>{reviewedAt}</dd>
        </div>
      </dl>
    </article>
  );
}
