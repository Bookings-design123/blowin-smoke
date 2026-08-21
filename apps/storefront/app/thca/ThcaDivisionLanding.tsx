import Link from "next/link";

import { Breadcrumbs } from "@/components/Primitives";
import type { CatalogSnapshot, StorefrontProduct } from "@/lib/catalog/types";

import styles from "./thca.module.css";
import { ThcaProductMedia } from "./ThcaProductMedia";
import {
  availableThcaFormats,
  filterThcaProducts,
  thcaCardModel,
  thcaEmptyShelfCopy,
  type ThcaFormatSlug,
} from "./thca-domain";

function ProductAction({
  model,
}: Readonly<{
  model: ReturnType<typeof thcaCardModel>;
}>) {
  if (model.exactDetailHref) {
    return (
      <Link className={styles.productAction} href={model.exactDetailHref}>
        View product
      </Link>
    );
  }

  return (
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
  );
}

function ThcaProductCard({ product }: Readonly<{ product: StorefrontProduct }>) {
  const model = thcaCardModel(product);
  const primaryMediaId = product.images[0]?.id ?? null;
  const alternateMediaId = product.images[1]?.id ?? null;

  return (
    <article className={styles.productCard}>
      <div className={styles.productStage}>
        <ThcaProductMedia
          key={`${primaryMediaId ?? "missing"}:${alternateMediaId ?? "missing"}`}
          productName={product.name}
          primaryMediaId={primaryMediaId}
          alternateMediaId={alternateMediaId}
          detailHref={model.exactDetailHref}
        />

        <div className={styles.productIdentity}>
          <h3 className={styles.productName}>
            {model.exactDetailHref ? (
              <Link href={model.exactDetailHref}>{product.name}</Link>
            ) : (
              product.name
            )}
          </h3>
          <div className={styles.productIdentityLine}>
            <p className={styles.productPrice}>{model.price}</p>
            <span>{model.availability}</span>
          </div>
        </div>

        <div className={styles.productReveal}>
          <div className={styles.productMeta}>
            <span>{model.formatLabel}</span>
            <span>{model.availability}</span>
          </div>
          <strong className={styles.revealName}>{product.name}</strong>

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

          <p className={styles.revealPrice}>{model.price}</p>
          <ProductAction model={model} />
        </div>
      </div>
    </article>
  );
}

function ShelfState({
  title,
  message,
  clearFormat = false,
}: Readonly<{ title: string; message: string; clearFormat?: boolean }>) {
  return (
    <div className={styles.shelfState} role="status">
      <h3>{title}</h3>
      <p>{message}</p>
      {clearFormat ? (
        <Link className={styles.textAction} href="/thca#thca-shelf">
          View all THCA
        </Link>
      ) : null}
    </div>
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
      <section className={styles.opening} aria-labelledby="thca-title">
        <div className={`shell ${styles.openingInner}`}>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "THCA" }]} />
          <div className={styles.categoryStage} data-media-role="category-art-direction-safe">
            <h1 id="thca-title">THCA</h1>
          </div>
        </div>
      </section>

      {formats.length > 0 ? (
        <section className={styles.formatSection} aria-labelledby="thca-formats-title">
          <div className="shell">
            <header className={styles.sectionHeading}>
              <h2 id="thca-formats-title">Shop by format</h2>
            </header>
            <nav className={styles.formatGrid} aria-label="THCA formats">
              <Link href="/thca#thca-shelf" aria-current={activeFormat === null ? "page" : undefined}>
                <strong>All THCA</strong>
                <span>{publishedProducts.length}</span>
              </Link>
              {formats.map((format) => (
                <Link
                  key={format.slug}
                  href={`/thca?format=${format.slug}#thca-shelf`}
                  aria-current={activeFormat === format.slug ? "page" : undefined}
                >
                  <strong>{format.label}</strong>
                  <span>{format.count}</span>
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
              <p className="eyebrow">THCA</p>
              <h2 id="thca-shelf-title">{activeDefinition?.label ?? "Shop THCA"}</h2>
            </div>
            {catalog.status === "ready" ? (
              <p aria-live="polite">
                {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            ) : null}
          </header>

          {catalog.status !== "ready" ? (
            <ShelfState
              title="The THCA shelf is unavailable right now."
              message="Products and prices can’t be confirmed for this visit."
            />
          ) : products.length === 0 ? (
            <ShelfState
              title={emptyShelfCopy.title}
              message={emptyShelfCopy.message}
              clearFormat={Boolean(activeDefinition)}
            />
          ) : (
            <div className={styles.productRail} role="region" aria-label="THCA products" tabIndex={0}>
              {products.map((product) => <ThcaProductCard key={product.id} product={product} />)}
            </div>
          )}

          {partialProjection && products.length > 0 ? (
            <p className={styles.projectionNotice} role="status">
              Some THCA products could not be confirmed and are not shown.
            </p>
          ) : null}
        </div>
      </section>

      <section className={styles.supportSection} aria-labelledby="thca-support-title">
        <div className={`shell ${styles.supportInner}`}>
          <h2 id="thca-support-title">THCA support</h2>
          <nav aria-label="THCA support links">
            <Link href="/learn/thca-proof">Proof guide</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>
      </section>
    </>
  );
}
