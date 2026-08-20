import Image from "next/image";
import Link from "next/link";

import {
  DIVISION_META,
  findSelection,
  productPriceLabel,
} from "@/lib/catalog/domain";
import type { StorefrontProduct } from "@/lib/catalog/types";

import {
  ViewportMedia,
  type AuthoredMediaSet,
} from "./ViewportMedia";

type ApprovedProductMedia = Readonly<{
  imageId: string;
  alt: string;
  rightsStatus: "APPROVED";
}>;

export type HomeProductMerchandise = Readonly<{
  kind: "product";
  product: StorefrontProduct;
  selectedSku?: string;
  media: ApprovedProductMedia;
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

function hasText(value: string) {
  return value.trim().length > 0;
}

function productEntryIsReady(entry: HomeProductMerchandise) {
  const selection = findSelection(entry.product, entry.selectedSku);

  return (
    entry.product.publicationState === "PUBLISHED" &&
    entry.media.rightsStatus === "APPROVED" &&
    Boolean(selection) &&
    hasText(entry.product.name) &&
    hasText(entry.product.description) &&
    hasText(entry.curationRationale) &&
    entry.product.images.some((image) => image.id === entry.media.imageId)
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
    hasText(entry.curationRationale)
  );
}

function entryIsReady(entry: HomeMerchandiseEntry) {
  return entry.kind === "product"
    ? productEntryIsReady(entry)
    : editorialEntryIsReady(entry);
}

function HomeProductCard({ entry }: Readonly<{ entry: HomeProductMerchandise }>) {
  const selection = findSelection(entry.product, entry.selectedSku);
  const href = selection
    ? `/products/${encodeURIComponent(selection.sku.sku)}`
    : "/support";
  const availability = selection
    ? selection.sku.availableQuantity > 0
      ? "Available"
      : selection.sku.availableQuantity === 0
        ? "Sold out"
        : "Availability unknown"
    : "Selection unavailable";

  return (
    <article className="home-product-card">
      <Link className="home-product-card__media" href={href} tabIndex={-1}>
        <Image
          src={`/media/${encodeURIComponent(entry.media.imageId)}`}
          alt={entry.media.alt}
          fill
          sizes="(max-width: 680px) 72vw, (max-width: 1024px) 42vw, 24vw"
        />
      </Link>
      <p className="home-product-card__meta">
        <span>{DIVISION_META[entry.product.division].label}</span>
        <span>{availability}</span>
      </p>
      <h3>
        <Link href={href}>{entry.product.name}</Link>
      </h3>
      <p className="home-product-card__description">{entry.product.description}</p>
      <p className="home-product-card__price">
        {productPriceLabel(entry.product)}
      </p>
      <Link className="home-product-card__action" href={href}>
        {selection ? "View exact product" : "Get product help"}
      </Link>
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
        <Link className="home-product-card__action" href={entry.href}>
          {entry.actionLabel}
        </Link>
      </div>
    </article>
  );
}

export function HomeMerchandising({
  section,
}: Readonly<{ section: HomeMerchandisingContract | null }>) {
  const isGoverned =
    section?.authority.membershipSource === "GOVERNED_HOME_CURATION" &&
    section.authority.productSource === "CANONICAL_COMMERCE" &&
    section.authority.orderApproved &&
    section.authority.mediaRightsReviewed &&
    hasText(section.authority.rationale) &&
    hasText(section.authority.effectiveAt) &&
    section.entries.length > 0 &&
    section.entries.every(entryIsReady);

  if (!section || !isGoverned) return null;

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
            <HomeProductCard entry={entry} key={entry.product.id} />
          ) : (
            <HomeEditorialCard entry={entry} key={`${entry.href}-${entry.title}`} />
          ),
        )}
      </div>
    </section>
  );
}
