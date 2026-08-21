import Link from "next/link";

import { Breadcrumbs } from "@/components/Primitives";
import type { CatalogSnapshot, StorefrontProduct } from "@/lib/catalog/types";

import styles from "./thca.module.css";
import { ThcaProductMedia } from "./ThcaProductMedia";
import {
  availableThcaFormats,
  filterThcaProducts,
  THCA_PROOF_KEY,
  thcaCardModel,
  thcaEmptyShelfCopy,
  type ThcaFormatSlug,
} from "./thca-domain";

function ThcaProductCard({ product }: Readonly<{ product: StorefrontProduct }>) {
  const model = thcaCardModel(product);
  const primaryMediaId = product.images[0]?.id ?? null;
  const alternateMediaId = product.images[1]?.id ?? null;

  return (
    <article className={styles.productCard}>
      <ThcaProductMedia
        key={`${primaryMediaId ?? "missing"}:${alternateMediaId ?? "missing"}`}
        productName={product.name}
        primaryMediaId={primaryMediaId}
        alternateMediaId={alternateMediaId}
        detailHref={model.exactDetailHref}
      />
      <div className={styles.productMeta}>
        <span>{model.formatLabel}</span>
        <span>{model.availability}</span>
      </div>
      <h3 className={styles.productName}>
        {model.exactDetailHref ? (
          <Link href={model.exactDetailHref}>{product.name}</Link>
        ) : (
          product.name
        )}
      </h3>

      {model.facts.length > 0 ? (
        <dl className={styles.productFacts}>
          {model.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <p className={styles.productPrice}>{model.price}</p>
      <div className={styles.productState} data-state="unresolved">
        <strong>Proof unresolved</strong>
        <span>Exact batch proof and eligibility are not included in this public record.</span>
      </div>

      {model.exactDetailHref ? (
        <Link className={styles.productAction} href={model.exactDetailHref}>
          View details
        </Link>
      ) : (
        <details className={styles.optionDisclosure}>
          <summary>Choose an option</summary>
          <ul>
            {model.options.map((option) => (
              <li key={option.sku.id}>
                <Link href={option.href}>
                  <span>{option.variant.name}</span>
                  <small>{option.sku.sku} · {option.availability}</small>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

function ShelfState({
  title,
  message,
  clearFormat = false,
}: Readonly<{ title: string; message: string; clearFormat?: boolean }>) {
  return (
    <section className={styles.shelfState} role="status">
      <p className={styles.dataLabel}>Published THCA</p>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className={styles.actionRow}>
        {clearFormat ? (
          <Link className={styles.primaryAction} href="/thca#thca-shelf">
            View all THCA
          </Link>
        ) : null}
        <Link className={clearFormat ? styles.secondaryAction : styles.primaryAction} href="/learn/thca-proof">
          How proof works
        </Link>
      </div>
    </section>
  );
}

export function ThcaDivisionLanding({
  catalog,
  requestedFormat,
}: Readonly<{ catalog: CatalogSnapshot; requestedFormat: ThcaFormatSlug | null }>) {
  const publishedProducts = catalog.products.filter((product) => product.division === "THCA");
  const formats = availableThcaFormats(publishedProducts);
  const activeFormat = formats.some((format) => format.slug === requestedFormat)
    ? requestedFormat
    : null;
  const products = filterThcaProducts(publishedProducts, activeFormat);
  const activeDefinition = formats.find((format) => format.slug === activeFormat);
  const partialProjection = catalog.status === "ready" && catalog.suppressedRecords > 0;
  const emptyShelfCopy = thcaEmptyShelfCopy(activeDefinition?.label ?? null, partialProjection);

  return (
    <>
      <section className={styles.opening}>
        <div className={`shell ${styles.openingInner}`}>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "THCA" }]} />
          <div className={styles.openingGrid}>
            <div className={styles.openingCopy}>
              <p className="eyebrow">THCA</p>
              <h1>Choose the format. Check the record.</h1>
              <p className={styles.openingLede}>
                Start with form and amount. Price, availability, proof, and eligibility stay tied to the exact published option.
              </p>
              <div className={styles.actionRow}>
                {catalog.status === "ready" && publishedProducts.length > 0 ? (
                  <a className={styles.primaryAction} href="#thca-shelf">Shop published THCA</a>
                ) : (
                  <Link className={styles.primaryAction} href="/learn/thca-proof">How proof works</Link>
                )}
                <Link className={styles.secondaryAction} href="/support">Ask Support</Link>
              </div>
            </div>

            <figure className={styles.openingSignal} aria-hidden="true">
              <div className={styles.signalHead}><span>THCA</span><span>01—03</span></div>
              <strong>FORM</strong>
              <ol>
                <li><span>01</span> Form</li>
                <li><span>02</span> Amount</li>
                <li><span>03</span> Record</li>
              </ol>
            </figure>
          </div>
        </div>
      </section>

      {formats.length > 0 ? (
        <section className={styles.formatSection} aria-labelledby="thca-formats-title">
          <div className="shell">
            <header className={styles.sectionHeading}>
              <div>
                <p className="eyebrow">Shop by format</p>
                <h2 id="thca-formats-title">Choose a published format.</h2>
              </div>
              <p>Only formats named by live canonical product records appear here.</p>
            </header>
            <nav className={styles.formatGrid} aria-label="Published THCA formats">
              <Link href="/thca#thca-shelf" aria-current={activeFormat === null ? "page" : undefined}>
                <span className={styles.formatIndex}>All</span>
                <strong>All THCA</strong>
                <small>{publishedProducts.length} published {publishedProducts.length === 1 ? "product" : "products"}</small>
              </Link>
              {formats.map((format, index) => (
                <Link
                  key={format.slug}
                  href={`/thca?format=${format.slug}#thca-shelf`}
                  aria-current={activeFormat === format.slug ? "page" : undefined}
                >
                  <span className={styles.formatIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{format.label}</strong>
                  <small>{format.description} · {format.count} published</small>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      ) : null}

      <section className={styles.shelfSection} id="thca-shelf" aria-labelledby="thca-shelf-title">
        <div className="shell">
          <header className={styles.shelfHeading}>
            <div>
              <p className="eyebrow">Published THCA</p>
              <h2 id="thca-shelf-title">{activeDefinition?.label ?? "What’s live now."}</h2>
            </div>
            {catalog.status === "ready" ? (
              <p aria-live="polite">
                {products.length} published {products.length === 1 ? "record" : "records"} shown
              </p>
            ) : null}
          </header>

          {catalog.status !== "ready" ? (
            <ShelfState
              title="The published THCA shelf is unavailable right now."
              message="Products, prices, and availability cannot be confirmed on this visit, so no substitute listings are shown."
            />
          ) : products.length === 0 ? (
            <ShelfState
              title={emptyShelfCopy.title}
              message={emptyShelfCopy.message}
              clearFormat={Boolean(activeDefinition)}
            />
          ) : (
            <div className={styles.productRail} role="region" aria-label="Published THCA products" tabIndex={0}>
              {products.map((product) => <ThcaProductCard key={product.id} product={product} />)}
            </div>
          )}

          {partialProjection && products.length > 0 ? (
            <p className={styles.projectionNotice} role="status">
              Some catalog records could not be confirmed and are excluded from storefront results.
            </p>
          ) : null}
        </div>
      </section>

      <section className={styles.compareSection} aria-labelledby="thca-compare-title">
        <div className={`shell ${styles.compareGrid}`}>
          <header>
            <p className="eyebrow">Compare</p>
            <h2 id="thca-compare-title">Start with the facts that change.</h2>
          </header>
          <dl className={styles.compareList}>
            <div><dt>Form</dt><dd>Flower, pre-roll, vape, concentrate, or edible only when the product record names it.</dd></div>
            <div><dt>Amount</dt><dd>Weight, count, and price basis belong to the exact option.</dd></div>
            <div><dt>Profile</dt><dd>Strain or profile language appears only when it is supplied for that option.</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.proofSection} aria-labelledby="thca-proof-title">
        <div className={`shell ${styles.proofGrid}`}>
          <div className={styles.proofRoute} aria-hidden="true">
            <span>Product</span><i>→</i><span>Option</span><i>→</i><span>Batch</span><i>→</i><span>Document</span>
          </div>
          <div className={styles.proofCopy}>
            <p className="eyebrow">Proof and eligibility</p>
            <h2 id="thca-proof-title">Proof follows the exact batch.</h2>
            <p>
              Availability is a stock state. It does not show whether a document matches or whether a customer and destination are eligible.
            </p>
            <details className={styles.proofDisclosure}>
              <summary>Read the proof-status key</summary>
              <dl>
                {THCA_PROOF_KEY.map((item) => (
                  <div key={item.state}>
                    <dt>{item.label}</dt>
                    <dd>{item.description}</dd>
                  </div>
                ))}
              </dl>
            </details>
            <div className={styles.actionRow}>
              <Link className={styles.primaryAction} href="/learn/thca-proof">Open the proof guide</Link>
              <Link className={styles.secondaryAction} href="/support">Ask about a record</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
