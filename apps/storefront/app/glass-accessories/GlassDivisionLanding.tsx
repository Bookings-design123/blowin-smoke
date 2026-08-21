import Link from "next/link";

import { Breadcrumbs } from "@/components/Primitives";
import type { CatalogSnapshot, StorefrontProduct } from "@/lib/catalog/types";

import { GlassProductMedia } from "./GlassProductMedia";
import { GlassProductRail } from "./GlassProductRail";
import styles from "./glass.module.css";
import {
  availableGlassDepartments,
  filterGlassProducts,
  glassCardModel,
  glassEmptyShelfCopy,
  type GlassAisleSlug,
} from "./glass-domain";

function ProductAction({
  model,
  disclosureId,
}: Readonly<{
  model: ReturnType<typeof glassCardModel>;
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

function GlassProductCard({
  product,
  model,
  position,
  activeAisle,
}: Readonly<{
  product: StorefrontProduct;
  model: ReturnType<typeof glassCardModel>;
  position: number;
  activeAisle: GlassAisleSlug | null;
}>) {
  const primaryMediaId = product.images[0]?.id ?? null;
  const alternateMediaId = product.images[1]?.id ?? null;
  const disclosureId = `glass-product-options-${position}`;
  const activeAisleLabel =
    model.aisles.find((aisle) => aisle.slug === activeAisle)?.label ?? null;
  const showTypeLabel =
    model.typeLabel !== null && model.typeLabel !== activeAisleLabel;
  const factLimit = showTypeLabel ? 2 : 3;
  const visibleFacts = model.fitCue
    ? [
        ...model.facts.slice(0, Math.max(0, factLimit - 1)),
        model.fitCue,
      ]
    : model.facts.slice(0, factLimit);

  return (
    <article className={styles.productCard}>
      <div className={styles.productStage}>
        <GlassProductMedia
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
          {model.availability === "Available" ? null : (
            <span>{model.availability}</span>
          )}
        </div>
      </div>

      <div className={styles.productReveal}>
        <div className={styles.productRevealPanel}>
          {showTypeLabel ? (
            <p className={styles.productMeta}>{model.typeLabel}</p>
          ) : null}

          {visibleFacts.length > 0 ? (
            <dl className={styles.productFacts}>
              {visibleFacts.map((fact) => (
                <div
                  className={fact === model.fitCue ? styles.fitFact : undefined}
                  key={fact.label}
                >
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <ProductAction model={model} disclosureId={disclosureId} />
        </div>
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
        <Link className={styles.textAction} href="/glass-accessories#glass-shelf">
          View all Glass / Accessories / Merch
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
      <h2 id="glass-shelf-title">{title}</h2>
      {count === null ? null : (
        <p aria-live="polite">
          {count} {count === 1 ? "product" : "products"}
        </p>
      )}
    </header>
  );
}

export function GlassDivisionLanding({
  catalog,
  requestedAisle,
}: Readonly<{
  catalog: CatalogSnapshot;
  requestedAisle: GlassAisleSlug | null;
}>) {
  const publishedProducts = catalog.products.filter(
    (product) => product.division === "GLASS_ACCESSORIES",
  );
  const publishedEntries = publishedProducts.map((product) => ({
    product,
    model: glassCardModel(product),
  }));
  const merchandisableProducts = publishedEntries
    .filter((entry) => entry.model.merchandisable)
    .map((entry) => entry.product);
  const departments = availableGlassDepartments(merchandisableProducts);
  const activeAisles = departments.flatMap((department) => department.aisles);
  const activeDefinition =
    activeAisles.find((aisle) => aisle.slug === requestedAisle) ?? null;
  const activeAisle = activeDefinition?.slug ?? null;
  const scopedProducts = filterGlassProducts(publishedProducts, activeAisle);
  const products = filterGlassProducts(merchandisableProducts, activeAisle);
  const productEntries = products.map((product) => ({
    product,
    model: glassCardModel(product),
  }));
  const hiddenProductCount = scopedProducts.length - productEntries.length;
  const emptyShelfCopy = glassEmptyShelfCopy(activeDefinition?.label ?? null);
  const shelfTitle = activeDefinition?.label ?? "All Glass / Accessories / Merch";

  return (
    <>
      <section className={styles.opening} aria-labelledby="glass-title">
        <div className={`shell ${styles.openingInner}`}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Glass / Accessories / Merch" },
            ]}
          />
          <div
            className={styles.categoryStage}
            data-media-role="category-art-direction-safe"
          >
            <h1 id="glass-title">Glass / Accessories / Merch</h1>
          </div>
        </div>
      </section>

      {departments.length > 0 ? (
        <section
          className={styles.departmentSection}
          aria-labelledby="glass-departments-title"
        >
          <div className="shell">
            <header className={styles.sectionHeading}>
              <h2 id="glass-departments-title">Shop by department</h2>
              <Link
                className={styles.allProductsLink}
                href="/glass-accessories#glass-shelf"
                aria-current={activeAisle === null ? "page" : undefined}
              >
                <strong>All products</strong>
                <span>
                  {merchandisableProducts.length}{" "}
                  {merchandisableProducts.length === 1 ? "product" : "products"}
                </span>
              </Link>
            </header>

            <div className={styles.departmentGrid}>
              {departments.map((department) => (
                <section
                  className={styles.departmentGroup}
                  key={department.slug}
                  aria-labelledby={`glass-department-${department.slug}`}
                >
                  <h3 id={`glass-department-${department.slug}`}>
                    {department.label}
                  </h3>
                  <nav
                    className={styles.aisleGrid}
                    aria-label={`${department.label} aisles`}
                  >
                    {department.aisles.map((aisle) => (
                      <Link
                        key={aisle.slug}
                        href={`/glass-accessories?aisle=${aisle.slug}#glass-shelf`}
                        aria-current={
                          activeAisle === aisle.slug ? "page" : undefined
                        }
                      >
                        <strong>{aisle.label}</strong>
                        <span>
                          {aisle.count}{" "}
                          {aisle.count === 1 ? "product" : "products"}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section
        className={styles.shelfSection}
        id="glass-shelf"
        aria-labelledby="glass-shelf-title"
      >
        <div className="shell">
          {catalog.status !== "ready" ? (
            <>
              <ShelfHeading title={shelfTitle} count={null} />
              <ShelfState
                title="The Glass / Accessories / Merch shelf is unavailable right now."
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
            <GlassProductRail
              heading={shelfTitle}
              itemCount={productEntries.length}
              scopeKey={activeAisle ?? "all"}
            >
              {productEntries.map((entry, index) => (
                <GlassProductCard
                  key={entry.product.id}
                  product={entry.product}
                  model={entry.model}
                  position={index}
                  activeAisle={activeAisle}
                />
              ))}
            </GlassProductRail>
          )}

          {hiddenProductCount > 0 && productEntries.length > 0 ? (
            <p className={styles.projectionNotice} role="status">
              Some products are not shown because their exact options could not be confirmed.
            </p>
          ) : null}
        </div>
      </section>

      <section className={styles.supportSection} aria-labelledby="glass-support-title">
        <div className={`shell ${styles.supportInner}`}>
          <h2 id="glass-support-title">Glass / Accessories / Merch support</h2>
          <nav aria-label="Glass / Accessories / Merch support links">
            <Link href="/learn/measure-a-connection">Measure a connection</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>
      </section>
    </>
  );
}
