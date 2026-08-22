import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Primitives";
import { getPublishedProductBySku } from "@/lib/catalog/api";
import { DIVISION_META } from "@/lib/catalog/domain";
import { buildPdpViewModel } from "@/lib/catalog/pdp-domain";

import { ProductGallery } from "./ProductGallery";
import styles from "./pdp.module.css";

type ProductPageProps = Readonly<{ params: Promise<{ sku: string }> }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { sku } = await params;
  const lookup = await getPublishedProductBySku(sku);
  const model =
    lookup.status === "found" ? buildPdpViewModel(lookup.product, sku) : null;

  return model
    ? {
        title: model.name,
        description: model.description || undefined,
      }
    : { title: "Product unavailable" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { sku: routeSku } = await params;
  const lookup = await getPublishedProductBySku(routeSku);

  if (lookup.status === "not-found") notFound();

  if (lookup.status !== "found") {
    const isError = lookup.status === "error";

    return (
      <section className={styles.serviceState}>
        <h1 className="visually-hidden">Product unavailable</h1>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Product" }]}
        />
        <div
          className={`catalog-state catalog-state--${
            isError ? "error" : "unavailable"
          }`}
          role={isError ? "alert" : "status"}
          aria-live={isError ? "assertive" : "polite"}
        >
          <p className="catalog-state__label">Product unavailable</p>
          <h2>This product cannot be shown right now.</h2>
          <p>
            {isError
              ? "Product details could not be loaded. Try again or continue through the house."
              : "Product details are not available right now."}
          </p>
          <Link className="button button--secondary" href="/search">
            Search the house
          </Link>
        </div>
      </section>
    );
  }

  const model = buildPdpViewModel(lookup.product, routeSku);
  if (!model) notFound();

  const division = DIVISION_META[lookup.product.division];

  return (
    <div className={styles.page} data-pdp-adaptation={model.adaptation}>
      <section className={styles.opening} aria-labelledby="product-title">
        <ProductGallery
          productName={model.name}
          images={model.mediaIds.map((id) => ({ id }))}
        />

        <article className={styles.decision}>
          <div className={styles.breadcrumbs}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: division.label, href: division.route },
                { label: model.name },
              ]}
            />
          </div>

          <p className={styles.context}>
            {model.divisionLabel}
            {model.categoryLabel ? ` · ${model.categoryLabel}` : ""}
          </p>
          <h1 className={styles.title} id="product-title">
            {model.name}
          </h1>
          {model.description ? (
            <p className={styles.descriptor}>{model.description}</p>
          ) : null}

          <div className={styles.commercial}>
            <p className={styles.price}>{model.price.formatted}</p>
            <p className={styles.availability}>{model.availability}</p>
          </div>

          {model.optionGroup ? (
            <section
              className={styles.selection}
              aria-labelledby="product-options-title"
            >
              <h2 className={styles.selectionHeading} id="product-options-title">
                Choose {model.optionGroup.label.toLocaleLowerCase()}
              </h2>
              <nav className={styles.optionGrid} aria-label="Product options">
                {model.optionGroup.choices.map((choice) => {
                  const optionState = choice.selected
                    ? choice.availability === "Available"
                      ? "Selected"
                      : `Selected · ${choice.availability}`
                    : choice.availability === "Available"
                      ? null
                      : choice.availability;

                  return (
                    <Link
                      className={styles.option}
                      href={choice.href}
                      key={choice.href}
                      aria-current={choice.selected ? "page" : undefined}
                      aria-label={`${choice.label}, ${choice.price}, ${choice.availability}${
                        choice.selected ? ", selected" : ""
                      }`}
                      scroll={false}
                    >
                      <span>{choice.label}</span>
                      {optionState ? (
                        <span className={styles.optionState}>{optionState}</span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </section>
          ) : (
            <p className={styles.exactOption}>
              <span className={styles.exactOptionLabel}>Selected option</span>
              <strong>{model.selectedOptionLabel}</strong>
            </p>
          )}

          <section
            className={styles.purchase}
            aria-labelledby="purchase-state-title"
          >
            <p className={styles.purchaseState}>{model.purchase.blockerLabel}</p>
            <h2 className={styles.purchaseTitle} id="purchase-state-title">
              {model.purchase.actionLabel}
            </h2>
            <p className={styles.purchaseReason} id="purchase-state-reason">
              {model.purchase.blockerReason}
            </p>
            <div className={styles.purchaseActions}>
              <button
                className="button"
                type="button"
                disabled={model.purchase.disabled}
                aria-describedby="purchase-state-reason"
              >
                {model.purchase.actionLabel}
              </button>
              <Link
                className="button button--secondary"
                href={model.purchase.recovery.href}
              >
                {model.purchase.recovery.label}
              </Link>
            </div>
          </section>

          {model.immediateFacts.length > 0 ? (
            <dl className={styles.facts} aria-label="Essential product facts">
              {model.immediateFacts.map((fact) => (
                <div key={`${fact.label}:${fact.value}`}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </article>
      </section>

      {model.disclosures.length > 0 ? (
        <section
          className={styles.detailsSection}
          aria-labelledby="product-information-title"
        >
          <div className={styles.detailsInner}>
            <header className={styles.detailsIntro}>
              <h2 id="product-information-title">Product information</h2>
            </header>

            <div className={styles.disclosures}>
              {model.disclosures.map((disclosure) => (
                <details className={styles.disclosure} key={disclosure.key}>
                  <summary>{disclosure.label}</summary>
                  <div className={styles.disclosureBody}>
                    {disclosure.body ? <p>{disclosure.body}</p> : null}
                    {disclosure.facts.length > 0 ? (
                      <dl className={styles.detailFacts}>
                        {disclosure.facts.map((fact) => (
                          <div key={`${fact.label}:${fact.value}`}>
                            <dt>{fact.label}</dt>
                            <dd>{fact.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
