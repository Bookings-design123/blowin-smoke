import Link from "next/link";

import { Breadcrumbs } from "@/components/Primitives";
import type { CatalogSnapshot, StorefrontProduct } from "@/lib/catalog/types";

import { VapeProductMedia } from "./VapeProductMedia";
import { VapeProductRail } from "./VapeProductRail";
import styles from "./vape.module.css";
import {
  availableVapeAisles,
  filterVapeProducts,
  vapeCardModel,
  vapeEmptyShelfCopy,
  type VapeAisleSlug,
} from "./vape-domain";

function ProductAction({
  model,
  disclosureId,
}: Readonly<{
  model: ReturnType<typeof vapeCardModel>;
  disclosureId: string;
}>) {
  if (model.exactDetailHref) {
    return (
      <Link className={styles.productAction} href={model.exactDetailHref}>
        {model.actionLabel}
      </Link>
    );
  }

  return (
    <details className={styles.optionDisclosure} id={disclosureId}>
      <summary>View options</summary>
      <ul>
        {model.options.map((option) => (
          <li key={option.id}>
            <Link href={option.href}>
              <span>{option.name}</span>
              <small>
                {option.price} · {option.availability}
              </small>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

function VapeProductCard({
  product,
  model,
  position,
}: Readonly<{
  product: StorefrontProduct;
  model: ReturnType<typeof vapeCardModel>;
  position: number;
}>) {
  const primaryMediaId = product.images[0]?.id ?? null;
  const alternateMediaId = product.images[1]?.id ?? null;
  const disclosureId = `vape-product-options-${position}`;

  return (
    <article className={styles.productCard}>
      <div className={styles.productStage}>
        <VapeProductMedia
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
        <p className={styles.productMeta}>{model.typeLabel}</p>

        {model.facts.length > 0 || model.compatibilityCue ? (
          <dl className={styles.productFacts}>
            {model.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
            {model.compatibilityCue ? (
              <div className={styles.compatibilityFact}>
                <dt>{model.compatibilityCue.label}</dt>
                <dd>{model.compatibilityCue.value}</dd>
              </div>
            ) : null}
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
  clearAisle = false,
}: Readonly<{ title: string; message: string; clearAisle?: boolean }>) {
  return (
    <div className={styles.shelfState} role="status">
      <h3>{title}</h3>
      <p>{message}</p>
      {clearAisle ? (
        <Link className={styles.textAction} href="/vape-nicotine#vape-shelf">
          View all Vape / Nicotine
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
      <h2 id="vape-shelf-title">{title}</h2>
      {count === null ? null : (
        <p aria-live="polite">
          {count} {count === 1 ? "product" : "products"}
        </p>
      )}
    </header>
  );
}

export function VapeDivisionLanding({
  catalog,
  requestedAisle,
}: Readonly<{ catalog: CatalogSnapshot; requestedAisle: VapeAisleSlug | null }>) {
  const publishedProducts = catalog.products.filter(
    (product) => product.division === "VAPE_NICOTINE",
  );
  const publishedEntries = publishedProducts.map((product) => ({
    product,
    model: vapeCardModel(product),
  }));
  const merchandisableProducts = publishedEntries
    .filter((entry) => entry.model.merchandisable)
    .map((entry) => entry.product);
  const aisles = availableVapeAisles(merchandisableProducts);
  const activeDefinition = aisles.find((aisle) => aisle.slug === requestedAisle) ?? null;
  const activeAisle = activeDefinition?.slug ?? null;
  const scopedProducts = filterVapeProducts(publishedProducts, activeAisle);
  const products = filterVapeProducts(merchandisableProducts, activeAisle);
  const productEntries = products.map((product) => ({
    product,
    model: vapeCardModel(product),
  }));
  const hiddenProductCount = scopedProducts.length - productEntries.length;
  const emptyShelfCopy = vapeEmptyShelfCopy(activeDefinition?.label ?? null);
  const shelfTitle = activeDefinition?.label ?? "All Vape / Nicotine";

  return (
    <>
      <section className={styles.opening} aria-labelledby="vape-title">
        <div className={`shell ${styles.openingInner}`}>
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Vape / Nicotine" }]}
          />
          <div className={styles.categoryStage} data-media-role="category-art-direction-safe">
            <h1 id="vape-title">Vape / Nicotine</h1>
          </div>
        </div>
      </section>

      {aisles.length > 0 ? (
        <section className={styles.aisleSection} aria-labelledby="vape-aisles-title">
          <div className="shell">
            <header className={styles.sectionHeading}>
              <h2 id="vape-aisles-title">Shop by aisle</h2>
              <Link
                className={styles.allProductsLink}
                href="/vape-nicotine#vape-shelf"
                aria-current={activeAisle === null ? "page" : undefined}
              >
                <strong>All Vape / Nicotine</strong>
                <span>
                  {merchandisableProducts.length}{" "}
                  {merchandisableProducts.length === 1 ? "product" : "products"}
                </span>
              </Link>
            </header>
            <nav className={styles.aisleGrid} aria-label="Vape / Nicotine aisles">
              {aisles.map((aisle) => (
                <Link
                  key={aisle.slug}
                  href={`/vape-nicotine?aisle=${aisle.slug}#vape-shelf`}
                  aria-current={activeAisle === aisle.slug ? "page" : undefined}
                >
                  <strong>{aisle.label}</strong>
                  <span>
                    {aisle.count} {aisle.count === 1 ? "product" : "products"}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      ) : null}

      <section className={styles.shelfSection} id="vape-shelf" aria-labelledby="vape-shelf-title">
        <div className="shell">
          {catalog.status !== "ready" ? (
            <>
              <ShelfHeading title={shelfTitle} count={null} />
              <ShelfState
                title="The Vape / Nicotine shelf is unavailable right now."
                message="Products and prices can’t be confirmed for this visit."
              />
            </>
          ) : productEntries.length === 0 ? (
            <>
              <ShelfHeading title={shelfTitle} count={0} />
              <ShelfState
                title={
                  hiddenProductCount > 0
                    ? "These products can’t be shown right now."
                    : emptyShelfCopy.title
                }
                message={
                  hiddenProductCount > 0
                    ? "Their exact options could not be confirmed."
                    : emptyShelfCopy.message
                }
                clearAisle={activeDefinition !== null}
              />
            </>
          ) : (
            <VapeProductRail
              heading={shelfTitle}
              itemCount={productEntries.length}
              scopeKey={activeAisle ?? "all"}
            >
              {productEntries.map((entry, index) => (
                <VapeProductCard
                  key={entry.product.id}
                  product={entry.product}
                  model={entry.model}
                  position={index}
                />
              ))}
            </VapeProductRail>
          )}

          {hiddenProductCount > 0 && productEntries.length > 0 ? (
            <p className={styles.projectionNotice} role="status">
              Some products are not shown because their exact options could not be confirmed.
            </p>
          ) : null}
        </div>
      </section>

      <section className={styles.supportSection} aria-labelledby="vape-support-title">
        <div className={`shell ${styles.supportInner}`}>
          <h2 id="vape-support-title">Vape / Nicotine support</h2>
          <nav aria-label="Vape / Nicotine support links">
            <Link href="/search?scope=vape-nicotine">Search exact model</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>
      </section>
    </>
  );
}
