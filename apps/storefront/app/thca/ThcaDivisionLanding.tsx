import Link from "next/link";

import { Breadcrumbs } from "@/components/Primitives";
import type { CatalogSnapshot, StorefrontProduct } from "@/lib/catalog/types";

import styles from "./thca.module.css";
import { ThcaProductMedia } from "./ThcaProductMedia";
import { ThcaProductRail } from "./ThcaProductRail";
import {
  THCA_FORMATS,
  availableThcaFormats,
  filterThcaProducts,
  thcaCardModel,
  thcaEmptyShelfCopy,
  type ThcaFormatSlug,
} from "./thca-domain";

function ProductAction({
  model,
  disclosureId,
}: Readonly<{
  model: ReturnType<typeof thcaCardModel>;
  disclosureId: string;
}>) {
  if (model.exactDetailHref) {
    return (
      <Link className={styles.productAction} href={model.exactDetailHref}>
        View product
      </Link>
    );
  }

  return (
    <details className={styles.optionDisclosure} id={disclosureId}>
      <summary>View options</summary>
      <ul>
        {model.options.map((option) => (
          <li key={option.variant.id}>
            <Link href={option.href}>
              <span>{option.variant.name}</span>
              <small>{option.price} · {option.availability}</small>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

function ThcaProductCard({
  product,
  model,
  position,
}: Readonly<{
  product: StorefrontProduct;
  model: ReturnType<typeof thcaCardModel>;
  position: number;
}>) {
  const primaryMediaId = product.images[0]?.id ?? null;
  const alternateMediaId = product.images[1]?.id ?? null;
  const disclosureId = `thca-product-options-${position}`;

  return (
    <article className={styles.productCard}>
      <div className={styles.productStage}>
        <ThcaProductMedia
          key={`${primaryMediaId ?? "missing"}:${alternateMediaId ?? "missing"}`}
          productName={product.name}
          primaryMediaId={primaryMediaId}
          alternateMediaId={alternateMediaId}
          detailHref={model.exactDetailHref}
          optionDisclosureId={model.exactDetailHref ? null : disclosureId}
        />
      </div>

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
        <p className={styles.productMeta}>{model.formatLabel}</p>

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

        <ProductAction model={model} disclosureId={disclosureId} />
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

function ShelfHeading({
  title,
  count,
}: Readonly<{ title: string; count: number | null }>) {
  return (
    <header className={styles.shelfHeading}>
      <h2 id="thca-shelf-title">{title}</h2>
      {count === null ? null : (
        <p aria-live="polite">
          {count} {count === 1 ? "product" : "products"}
        </p>
      )}
    </header>
  );
}

export function ThcaDivisionLanding({
  catalog,
  requestedFormat,
}: Readonly<{ catalog: CatalogSnapshot; requestedFormat: ThcaFormatSlug | null }>) {
  const publishedProducts = catalog.products.filter((product) => product.division === "THCA");
  const publishedEntries = publishedProducts.map((product) => ({
    product,
    model: thcaCardModel(product),
  }));
  const merchandisableProducts = publishedEntries
    .filter((entry) => entry.model.merchandisable)
    .map((entry) => entry.product);
  const formats = availableThcaFormats(merchandisableProducts);
  const activeFormat = requestedFormat;
  const activeDefinition = THCA_FORMATS.find((format) => format.slug === activeFormat);
  const scopedProducts = filterThcaProducts(publishedProducts, activeFormat);
  const products = filterThcaProducts(merchandisableProducts, activeFormat);
  const productEntries = products.map((product) => ({ product, model: thcaCardModel(product) }));
  const hiddenProductCount = scopedProducts.length - productEntries.length;
  const emptyShelfCopy = thcaEmptyShelfCopy(activeDefinition?.label ?? null);
  const shelfTitle = activeDefinition?.label ?? "Shop THCA";

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
              <Link
                className={styles.allProductsLink}
                href="/thca#thca-shelf"
                aria-current={activeFormat === null ? "page" : undefined}
              >
                <strong>All THCA</strong>
                <span>{merchandisableProducts.length} {merchandisableProducts.length === 1 ? "product" : "products"}</span>
              </Link>
            </header>
            <nav className={styles.formatGrid} aria-label="THCA formats">
              {formats.map((format) => (
                <Link
                  key={format.slug}
                  href={`/thca?format=${format.slug}#thca-shelf`}
                  aria-current={activeFormat === format.slug ? "page" : undefined}
                >
                  <strong>{format.label}</strong>
                  <span>{format.count} {format.count === 1 ? "product" : "products"}</span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      ) : null}

      <section className={styles.shelfSection} id="thca-shelf" aria-labelledby="thca-shelf-title">
        <div className="shell">
          {catalog.status !== "ready" ? (
            <>
              <ShelfHeading title={shelfTitle} count={null} />
              <ShelfState
                title="The THCA shelf is unavailable right now."
                message="Products and prices can’t be confirmed for this visit."
              />
            </>
          ) : productEntries.length === 0 ? (
            <>
              <ShelfHeading title={shelfTitle} count={0} />
              <ShelfState
                title={hiddenProductCount > 0 ? "These products can’t be shown right now." : emptyShelfCopy.title}
                message={hiddenProductCount > 0 ? "Their exact options could not be confirmed." : emptyShelfCopy.message}
                clearFormat={Boolean(activeDefinition)}
              />
            </>
          ) : (
            <ThcaProductRail
              heading={shelfTitle}
              itemCount={productEntries.length}
              scopeKey={activeFormat ?? "all"}
            >
              {productEntries.map((entry, index) => (
                <ThcaProductCard
                  key={entry.product.id}
                  product={entry.product}
                  model={entry.model}
                  position={index}
                />
              ))}
            </ThcaProductRail>
          )}

          {hiddenProductCount > 0 && productEntries.length > 0 ? (
            <p className={styles.projectionNotice} role="status">
              Some products are not shown because their exact options could not be confirmed.
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
