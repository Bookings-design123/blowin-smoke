import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, CatalogState, MediaPlaceholder, StatePanel } from "@/components/Primitives";
import { getPublishedProductBySku } from "@/lib/catalog/api";
import {
  DIVISION_META,
  deriveDecisionState,
  displayAttributeValue,
  findSelection,
  formatMoney,
  humanizeAttributeName,
} from "@/lib/catalog/domain";

type ProductPageProps = Readonly<{ params: Promise<{ sku: string }> }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { sku } = await params;
  const lookup = await getPublishedProductBySku(sku);
  return lookup.status === "found"
    ? { title: lookup.product.name, description: lookup.product.description || "Published product record." }
    : { title: "Product record" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { sku: routeSku } = await params;
  const lookup = await getPublishedProductBySku(routeSku);
  if (lookup.status === "not-found") notFound();
  if (lookup.status !== "found") {
    return (
      <section className="section shell">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Product record" }]} />
        <CatalogState
          state={lookup.status === "error" ? "error" : "unavailable"}
          title="The exact product record is not available."
          reason={lookup.message}
          preservedContext={`SKU ${routeSku}`}
          recovery={{ href: "/search", label: "Search the house" }}
        />
      </section>
    );
  }

  const product = lookup.product;
  const selection = findSelection(product, routeSku);
  if (!selection) notFound();
  const { variant, sku } = selection;
  const decision = deriveDecisionState(product, sku);
  const division = DIVISION_META[product.division];
  const image = product.images[0];
  const attributes = Object.entries(variant.attributes)
    .map(([key, value]) => ({ label: humanizeAttributeName(key), value: displayAttributeValue(value) }))
    .filter((attribute): attribute is { label: string; value: string } => attribute.value !== null);
  const readinessByDivision = {
    THCA: [
      ["Evidence", "Unknown — exact proof applicability is not present in this projection"],
      ["Eligibility", "Unresolved — no customer or destination result is present"],
      ["Availability", decision.availability],
    ],
    VAPE_NICOTINE: [
      ["Product role", "Unknown — no governed role is present in this projection"],
      ["Compatibility", "Unknown / unverified"],
      ["Availability", decision.availability],
    ],
    GLASS_ACCESSORIES: [
      ["Physical relationship", "Unknown / unverified"],
      ["Required components", "Unknown — no governed contents relationship is present"],
      ["Availability", decision.availability],
    ],
  } as const;

  return (
    <>
      <section className="section-compact shell pdp-heading">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: division.label, href: division.route },
            { label: product.name },
          ]}
        />
        <p className="eyebrow">Published product · exact SKU route</p>
      </section>

      <section className="pdp-opening bright">
        <div className="shell pdp-grid">
          <article className="purchase-panel" aria-labelledby="product-title">
            <p className="product-division">{division.label}</p>
            <h1 className="product-title" id="product-title">{product.name}</h1>
            <p>{product.description || "A public product description has not been supplied."}</p>

            <div className="selection-summary">
              <p className="data-label">Exact selected state</p>
              <p><strong>{variant.name}</strong></p>
              <p className="data">SKU {sku.sku}</p>
            </div>

            <div className="selection-rail" aria-label="Published product selections">
              {product.variants.flatMap((candidateVariant) =>
                candidateVariant.skus.map((candidateSku) => (
                  <Link
                    key={candidateSku.id}
                    href={`/products/${encodeURIComponent(candidateSku.sku)}`}
                    aria-current={candidateSku.sku === sku.sku ? "page" : undefined}
                  >
                    <span>{candidateVariant.name}</span>
                    <small className="data">{candidateSku.sku}</small>
                  </Link>
                )),
              )}
            </div>

            <p className="price">{formatMoney(sku.retailPrice.amountCents, sku.retailPrice.currency)}</p>
            <p className="availability-line"><strong>Availability:</strong> {decision.availability}</p>

            <StatePanel
              state={decision.label}
              title="This exact selection is not purchase-ready."
              reason={decision.reason}
              consequence="No Add to Cart or checkout action is presented until every material readiness input resolves."
              recovery={{ href: decision.recoveryHref, label: decision.recoveryLabel }}
              tone={decision.tone}
              headingLevel={2}
            />

            <div className="button-row" id="purchase-actions">
              <button className="button" type="button" disabled aria-describedby="purchase-disabled-reason">
                Purchase unavailable
              </button>
              <Link className="button button--secondary" href={decision.recoveryHref}>Resolve the open question</Link>
            </div>
            <p className="micro" id="purchase-disabled-reason">
              Publication and availability are not substitutes for eligibility, proof, compatibility, fit, requirements, or cart readiness.
            </p>
          </article>

          <div className="pdp-media">
            {image ? (
              <figure className="product-media-frame">
                <Image
                  src={`/media/${encodeURIComponent(image.id)}`}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) calc(100vw - 40px), 55vw"
                />
                <figcaption>Canonical product media · exact alt-text record not supplied; identity is adjacent.</figcaption>
              </figure>
            ) : (
              <MediaPlaceholder
                productName={product.name}
                title="Exact product media unavailable"
                message="No neighboring or research image has been substituted. Product identity and selected state remain textual."
              />
            )}
          </div>
        </div>
      </section>

      <section className="section shell" aria-labelledby="readiness-title">
        <div className="split split-balanced">
          <div>
            <p className="eyebrow">Decision record</p>
            <h2 id="readiness-title">Exact state before extended detail.</h2>
            <dl className="facts">
              {readinessByDivision[product.division].map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </div>
          <StatePanel
            state="Evidence firewall"
            title="Available facts stay in their own lane."
            reason="This page labels canonical identity, selected SKU, price, and availability as catalog facts. Missing proof, eligibility, compatibility, fit, curation, and policy remain unknown."
            consequence="No image, title, stock count, or description is used to fill a missing decision record."
            recovery={{ href: "/standards", label: "See the house evidence standard" }}
            tone="information"
            headingLevel={2}
          />
        </div>
      </section>

      <section className="section deep" aria-labelledby="specifications-title">
        <div className="shell">
          <h2 id="specifications-title">Selected record details</h2>
          <details className="disclosure">
            <summary>Canonical variant attributes</summary>
            {attributes.length > 0 ? (
              <dl className="facts">
                {attributes.map((attribute) => (
                  <div key={attribute.label}><dt>{attribute.label}</dt><dd>{attribute.value}</dd></div>
                ))}
              </dl>
            ) : <p>No public variant attributes were supplied.</p>}
          </details>
          <details className="disclosure">
            <summary>Evidence, fit, and eligibility scope</summary>
            <p>
              The current customer projection does not expose governed proof applicability, destination eligibility, compatibility, physical fit, required components, or their source and review records.
            </p>
          </details>
          <details className="disclosure">
            <summary>Curation and House Read</summary>
            <p>
              No product-specific curation rationale or House Read is published through the canonical projection. No research candidate status is shown as merchandise truth.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
