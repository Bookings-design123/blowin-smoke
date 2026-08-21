import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  DIVISION_META,
  allSkus,
  comparisonFacts,
  deriveDecisionState,
  findSelection,
  formatMoney,
  productPriceLabel,
} from "@/lib/catalog/domain";
import type { StorefrontProduct, StorefrontSku } from "@/lib/catalog/types";

import {
  ViewportMedia,
  type AuthoredMediaSet,
} from "./ViewportMedia";

type ApprovedProductMedia = Readonly<{
  imageId: string;
  alt: string;
  rightsStatus: "APPROVED";
}>;

type ApprovedAlternateProductMedia = Readonly<{
  imageId: string;
  rightsStatus: "APPROVED";
  presentation: "DECORATIVE_ALTERNATE";
}>;

type ApprovedMerchandisingBadge = Readonly<{
  label: string;
  approvalState: "APPROVED";
  source: "CANONICAL_COMMERCE" | "GOVERNED_HOME_CURATION";
}>;

type HomeProductReadinessBase = Readonly<{
  source: "CANONICAL_COMMERCE";
  detailHref: string;
}>;

export type HomeProductReadiness =
  | (HomeProductReadinessBase &
      Readonly<{
        state: "DIRECTLY_PURCHASABLE";
        purchaseEndpoint: string;
      }>)
  | (HomeProductReadinessBase &
      Readonly<{
        state: "CONFIGURATION_REQUIRED";
      }>)
  | (HomeProductReadinessBase &
      Readonly<{
        state: "UNAVAILABLE";
      }>)
  | (HomeProductReadinessBase &
      Readonly<{
        state: "COMING_SOON";
      }>)
  | (HomeProductReadinessBase &
      Readonly<{
        state: "NOTIFY";
        notificationHref: string;
      }>)
  | (HomeProductReadinessBase &
      Readonly<{
        state: "REVIEW_REQUIRED";
      }>);

export type HomeProductMerchandise = Readonly<{
  kind: "product";
  product: StorefrontProduct;
  selectedSku: string | null;
  readiness: HomeProductReadiness;
  media: ApprovedProductMedia;
  alternateMedia?: ApprovedAlternateProductMedia;
  badge?: ApprovedMerchandisingBadge;
  curationRationale: string;
}>;

export type HomeEditorialMerchandise = Readonly<{
  kind: "editorial";
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  media: AuthoredMediaSet;
  publicationState: "PUBLISHED";
  rightsStatus: "APPROVED";
  curationRationale: string;
}>;

export type HomeMerchandiseEntry =
  | HomeProductMerchandise
  | HomeEditorialMerchandise;

export type HomeMerchandisingContract = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  layout: "four-up" | "horizontal" | "mixed";
  authority: Readonly<{
    membershipSource: "GOVERNED_HOME_CURATION";
    productSource: "CANONICAL_COMMERCE";
    orderApproved: true;
    mediaRightsReviewed: true;
    rationale: string;
    effectiveAt: string;
  }>;
  entries: readonly HomeMerchandiseEntry[];
}>;

export type HomeEditorialFeatureContract = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  media: AuthoredMediaSet;
  layout: "media-first" | "split";
  publicationState: "PUBLISHED";
  rightsStatus: "APPROVED";
  curationRationale: string;
}>;

export type HomeRetailModule =
  | Readonly<{
      kind: "product-row";
      section: HomeMerchandisingContract;
    }>
  | Readonly<{
      kind: "editorial-feature";
      feature: HomeEditorialFeatureContract;
    }>;

function hasText(value: string) {
  return value.trim().length > 0;
}

function isInternalHref(value: string) {
  return value.startsWith("/") && !value.startsWith("//");
}

function authoredMediaIsReady(media: AuthoredMediaSet) {
  const sources = [media.wide, media.tablet, media.narrow].filter(
    (source) => source !== undefined,
  );

  return (
    hasText(media.alt) &&
    sources.every(
      (source) =>
        hasText(source.src) && source.width > 0 && source.height > 0,
    )
  );
}

function mediaRecordBelongsToProduct(
  product: StorefrontProduct,
  media: Readonly<{ imageId: string; rightsStatus: "APPROVED" }>,
) {
  return (
    media.rightsStatus === "APPROVED" &&
    product.images.some((image) => image.id === media.imageId)
  );
}

function primaryMediaBelongsToProduct(
  product: StorefrontProduct,
  media: ApprovedProductMedia,
) {
  return hasText(media.alt) && mediaRecordBelongsToProduct(product, media);
}

function readinessIsReady(
  entry: HomeProductMerchandise,
  selectedSku: StorefrontSku | null,
) {
  const readiness = entry.readiness;
  const selectedProductHref = selectedSku
    ? `/products/${encodeURIComponent(selectedSku.sku)}`
    : null;

  if (
    readiness.source !== "CANONICAL_COMMERCE" ||
    !isInternalHref(readiness.detailHref) ||
    (selectedProductHref && readiness.detailHref !== selectedProductHref)
  ) {
    return false;
  }

  switch (readiness.state) {
    case "DIRECTLY_PURCHASABLE":
      return Boolean(
        selectedSku &&
          selectedSku.availableQuantity > 0 &&
          deriveDecisionState(entry.product, selectedSku).tone === "quiet" &&
          isInternalHref(readiness.purchaseEndpoint),
      );
    case "CONFIGURATION_REQUIRED":
      return entry.selectedSku === null;
    case "UNAVAILABLE":
      return selectedSku
        ? selectedSku.availableQuantity === 0
        : allSkus(entry.product).every((sku) => sku.availableQuantity === 0);
    case "COMING_SOON":
      // The current public catalog projection has no canonical coming-soon field.
      return false;
    case "NOTIFY":
      return (
        Boolean(selectedSku && selectedSku.availableQuantity === 0) &&
        isInternalHref(readiness.notificationHref)
      );
    case "REVIEW_REQUIRED":
      return Boolean(
        selectedSku &&
          deriveDecisionState(entry.product, selectedSku).tone !== "quiet",
      );
  }
}

export function homeProductEntryIsReady(entry: HomeProductMerchandise) {
  const selection = entry.selectedSku
    ? findSelection(entry.product, entry.selectedSku)
    : null;
  const badgeIsReady = entry.badge
    ? entry.badge.approvalState === "APPROVED" &&
      (entry.badge.source === "CANONICAL_COMMERCE" ||
        entry.badge.source === "GOVERNED_HOME_CURATION") &&
      hasText(entry.badge.label)
    : true;

  return (
    entry.product.publicationState === "PUBLISHED" &&
    Boolean(
      entry.selectedSku === null ||
        (selection && selection.sku.sku === entry.selectedSku),
    ) &&
    readinessIsReady(entry, selection?.sku ?? null) &&
    primaryMediaBelongsToProduct(entry.product, entry.media) &&
    (!entry.alternateMedia ||
      (entry.alternateMedia.presentation === "DECORATIVE_ALTERNATE" &&
        mediaRecordBelongsToProduct(entry.product, entry.alternateMedia))) &&
    badgeIsReady &&
    hasText(entry.product.name) &&
    hasText(entry.product.description) &&
    hasText(entry.curationRationale)
  );
}

function editorialEntryIsReady(entry: HomeEditorialMerchandise) {
  return (
    entry.publicationState === "PUBLISHED" &&
    entry.rightsStatus === "APPROVED" &&
    hasText(entry.title) &&
    hasText(entry.description) &&
    hasText(entry.href) &&
    hasText(entry.actionLabel) &&
    authoredMediaIsReady(entry.media) &&
    hasText(entry.curationRationale)
  );
}

function entryIsReady(entry: HomeMerchandiseEntry) {
  return entry.kind === "product"
    ? homeProductEntryIsReady(entry)
    : editorialEntryIsReady(entry);
}

function simpleProductOptions(product: StorefrontProduct) {
  if (
    product.variants.length < 2 ||
    product.variants.length > 4 ||
    product.variants.some((variant) => variant.skus.length !== 1)
  ) {
    return [];
  }

  const names = product.variants.map((variant) => variant.name.trim());
  if (names.some((name) => !name) || new Set(names).size !== names.length) {
    return [];
  }

  return product.variants.map((variant) => ({
    label: variant.name,
    sku: variant.skus[0].sku,
  }));
}

function HomeProductCard({ entry }: Readonly<{ entry: HomeProductMerchandise }>) {
  const selection = entry.selectedSku
    ? findSelection(entry.product, entry.selectedSku)
    : null;
  if (
    (entry.selectedSku &&
      (!selection || selection.sku.sku !== entry.selectedSku)) ||
    !readinessIsReady(entry, selection?.sku ?? null)
  ) {
    return null;
  }

  const href = entry.readiness.detailHref;
  const decision = selection
    ? deriveDecisionState(entry.product, selection.sku)
    : null;
  const facts = comparisonFacts(entry.product);
  const options = selection ? simpleProductOptions(entry.product) : [];
  const readinessStateLabel = {
    CONFIGURATION_REQUIRED: "Selection required",
    UNAVAILABLE: "Unavailable",
    COMING_SOON: "Coming soon",
    NOTIFY: "Notification available",
    DIRECTLY_PURCHASABLE: "Ready",
    REVIEW_REQUIRED: "Review required",
  }[entry.readiness.state];
  const readinessAvailability = {
    CONFIGURATION_REQUIRED: "Selection required",
    UNAVAILABLE: "Unavailable",
    COMING_SOON: "Coming soon",
    NOTIFY: "Unavailable",
    DIRECTLY_PURCHASABLE: "Available",
    REVIEW_REQUIRED: "Unknown",
  }[entry.readiness.state];
  const stateLabel =
    entry.readiness.state === "COMING_SOON"
      ? readinessStateLabel
      : (decision?.label ?? readinessStateLabel);
  const availability =
    entry.readiness.state === "COMING_SOON"
      ? readinessAvailability
      : (decision?.availability ?? readinessAvailability);
  const stateTone =
    decision?.tone ??
    (entry.readiness.state === "COMING_SOON" ? "quiet" : "blocked");

  let primaryAction: ReactNode = null;
  let primaryHref: string | null = null;

  switch (entry.readiness.state) {
    case "DIRECTLY_PURCHASABLE":
      primaryAction = selection ? (
        <form action={entry.readiness.purchaseEndpoint} method="post">
          <input type="hidden" name="sku" value={selection.sku.sku} />
          <button className="home-product-card__action" type="submit">
            Add to cart
          </button>
        </form>
      ) : null;
      break;
    case "CONFIGURATION_REQUIRED":
      primaryHref = href;
      primaryAction = (
        <Link className="home-product-card__action" href={href}>
          Choose options
        </Link>
      );
      break;
    case "UNAVAILABLE":
      break;
    case "COMING_SOON":
      primaryHref = href;
      primaryAction = (
        <Link className="home-product-card__action" href={href}>
          View details
        </Link>
      );
      break;
    case "NOTIFY":
      primaryHref = entry.readiness.notificationHref;
      primaryAction = (
        <Link
          className="home-product-card__action"
          href={entry.readiness.notificationHref}
        >
          Notify me
        </Link>
      );
      break;
    case "REVIEW_REQUIRED":
      if (decision) {
        primaryHref = decision.recoveryHref;
        primaryAction = (
          <Link
            className="home-product-card__action"
            href={decision.recoveryHref}
          >
            {decision.recoveryLabel}
          </Link>
        );
      }
      break;
  }

  return (
    <article
      className="home-product-card"
      data-decision-tone={stateTone}
    >
      <Link className="home-product-card__media" href={href} tabIndex={-1}>
        <Image
          className="home-product-card__image home-product-card__image--primary"
          src={`/media/${encodeURIComponent(entry.media.imageId)}`}
          alt={entry.media.alt}
          fill
          sizes="(max-width: 680px) 72vw, (max-width: 1024px) 42vw, 24vw"
        />
        {entry.alternateMedia ? (
          <Image
            className="home-product-card__image home-product-card__image--alternate"
            src={`/media/${encodeURIComponent(entry.alternateMedia.imageId)}`}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 680px) 72vw, (max-width: 1024px) 42vw, 24vw"
          />
        ) : null}
      </Link>

      <p className="home-product-card__division">
        {DIVISION_META[entry.product.division].label}
      </p>
      <h3>
        <Link href={href}>{entry.product.name}</Link>
      </h3>
      {selection ? (
        <p className="home-product-card__role">{selection.variant.name}</p>
      ) : null}
      <p className="home-product-card__description">
        {entry.product.description}
      </p>

      {options.length > 0 ? (
        <div
          className="home-product-card__options"
          aria-label={`Choose ${entry.product.name} option`}
        >
          {options.map((option) => (
            <Link
              href={`/products/${encodeURIComponent(option.sku)}`}
              key={option.sku}
              aria-current={
                option.sku === selection?.sku.sku ? "true" : undefined
              }
            >
              {option.label}
            </Link>
          ))}
        </div>
      ) : null}

      {facts.length > 0 ? (
        <dl className="home-product-card__facts">
          {facts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <p className="home-product-card__state" data-tone={stateTone}>
        {stateLabel}
      </p>
      <p className="home-product-card__price">
        {selection
          ? formatMoney(
              selection.sku.retailPrice.amountCents,
              selection.sku.retailPrice.currency,
            )
          : productPriceLabel(entry.product)}
      </p>
      {entry.badge ? (
        <p className="home-product-card__badge">{entry.badge.label}</p>
      ) : null}
      <p className="home-product-card__availability">
        Availability · {availability}
      </p>
      <p className="home-product-card__rationale">
        <span>Why it’s here</span>
        {entry.curationRationale}
      </p>

      <div className="home-product-card__actions">
        {primaryAction}
        {primaryHref !== href ? (
          <Link className="home-product-card__detail" href={href}>
            View product
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function HomeEditorialCard({
  entry,
}: Readonly<{ entry: HomeEditorialMerchandise }>) {
  return (
    <article className="home-editorial-card">
      <Link className="home-editorial-card__media" href={entry.href} tabIndex={-1}>
        <ViewportMedia
          className="authored-media"
          media={entry.media}
          sizes="(max-width: 680px) 84vw, (max-width: 1024px) 76vw, 48vw"
        />
      </Link>
      <div className="home-editorial-card__copy">
        <h3>
          <Link href={entry.href}>{entry.title}</Link>
        </h3>
        <p>{entry.description}</p>
        <p className="home-editorial-card__rationale">
          {entry.curationRationale}
        </p>
        <Link className="home-product-card__action" href={entry.href}>
          {entry.actionLabel}
        </Link>
      </div>
    </article>
  );
}

function sectionIsGoverned(section: HomeMerchandisingContract) {
  return (
    section.authority.membershipSource === "GOVERNED_HOME_CURATION" &&
    section.authority.productSource === "CANONICAL_COMMERCE" &&
    section.authority.orderApproved &&
    section.authority.mediaRightsReviewed &&
    hasText(section.authority.rationale) &&
    hasText(section.authority.effectiveAt) &&
    section.entries.length > 0 &&
    section.entries.every(entryIsReady)
  );
}

export function HomeMerchandising({
  section,
}: Readonly<{ section: HomeMerchandisingContract | null }>) {
  if (!section || !sectionIsGoverned(section)) return null;

  return (
    <section
      className="home-merchandising-section"
      aria-labelledby={`${section.id}-title`}
    >
      <header className="home-merchandising-heading shell">
        <p className="eyebrow">{section.eyebrow}</p>
        <h2 id={`${section.id}-title`}>{section.title}</h2>
      </header>
      <div
        className="home-merchandising-grid shell"
        data-layout={section.layout}
      >
        {section.entries.map((entry) =>
          entry.kind === "product" ? (
            <HomeProductCard
              entry={entry}
              key={`${entry.product.id}-${entry.selectedSku ?? entry.readiness.state}`}
            />
          ) : (
            <HomeEditorialCard entry={entry} key={`${entry.href}-${entry.title}`} />
          ),
        )}
      </div>
    </section>
  );
}

function editorialFeatureIsReady(feature: HomeEditorialFeatureContract) {
  return (
    feature.publicationState === "PUBLISHED" &&
    feature.rightsStatus === "APPROVED" &&
    hasText(feature.id) &&
    hasText(feature.eyebrow) &&
    hasText(feature.title) &&
    hasText(feature.description) &&
    hasText(feature.href) &&
    hasText(feature.actionLabel) &&
    authoredMediaIsReady(feature.media) &&
    hasText(feature.curationRationale)
  );
}

function HomeEditorialFeature({
  feature,
}: Readonly<{ feature: HomeEditorialFeatureContract }>) {
  if (!editorialFeatureIsReady(feature)) return null;

  return (
    <section
      className="home-editorial-feature"
      data-layout={feature.layout}
      aria-labelledby={`${feature.id}-title`}
    >
      <div className="home-editorial-feature__inner shell">
        <Link
          className="home-editorial-feature__media"
          href={feature.href}
          tabIndex={-1}
        >
          <ViewportMedia
            className="authored-media"
            media={feature.media}
            sizes="(max-width: 680px) 100vw, (max-width: 1024px) 64vw, 70vw"
          />
        </Link>
        <div className="home-editorial-feature__copy">
          <p className="eyebrow">{feature.eyebrow}</p>
          <h2 id={`${feature.id}-title`}>{feature.title}</h2>
          <p>{feature.description}</p>
          <p className="home-editorial-feature__rationale">
            {feature.curationRationale}
          </p>
          <Link className="button" href={feature.href}>
            {feature.actionLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeRetailSequence({
  modules,
}: Readonly<{ modules: readonly HomeRetailModule[] }>) {
  if (modules.length === 0) return null;

  return (
    <div className="home-retail-sequence">
      {modules.map((module) =>
        module.kind === "product-row" ? (
          <HomeMerchandising
            section={module.section}
            key={`product-${module.section.id}`}
          />
        ) : (
          <HomeEditorialFeature
            feature={module.feature}
            key={`editorial-${module.feature.id}`}
          />
        ),
      )}
    </div>
  );
}
