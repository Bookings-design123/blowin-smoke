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
        description:
          model.disclosures.find((disclosure) => disclosure.key === "details")
            ?.body || undefined,
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
  const requiresConfigurationSummary =
    !model.optionGroup &&
    (lookup.product.variants.length > 1 ||
      lookup.product.variants.some((variant) => variant.skus.length > 1));

  return (
    <div className={styles.page} data-pdp-adaptation={model.adaptation}>
      <section className={styles.opening} aria-labelledby="product-title">
        <ProductGallery
          productName={model.name}
          images={model.mediaIds.map((id) => ({ id }))}
        />

        <article className={styles.decision}>
          <h1 className={styles.title} id="product-title">
            {model.name}
          </h1>

          <div className={styles.commercial}>
            <p className={styles.price}>{model.price.formatted}</p>
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
                  const optionState =
                    choice.availability === "Available"
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
          ) : requiresConfigurationSummary ? (
            <p className={styles.configuration}>
              <span>Option</span>
              <strong>{model.selectedOptionLabel}</strong>
            </p>
          ) : null}

          <section className={styles.purchase} aria-label="Purchase status">
            <button
              className={`button ${styles.purchaseAction}`}
              type="button"
              disabled={model.purchase.disabled}
            >
              {model.purchase.actionLabel}
            </button>
            <Link
              className={styles.purchaseRecovery}
              href={model.purchase.recovery.href}
            >
              {model.purchase.recovery.label}
            </Link>
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

          <div className={styles.breadcrumbs}>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: division.label, href: division.route },
                { label: model.name },
              ]}
            />
          </div>
        </article>
      </section>

      {model.disclosures.length > 0 ? (
        <section className={styles.detailsSection} aria-label="Product details">
          <div className={styles.detailsInner}>
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
