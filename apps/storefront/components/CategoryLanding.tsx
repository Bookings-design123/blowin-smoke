import Link from "next/link";

import {
  Breadcrumbs,
  CatalogState,
  HouseRead,
  ProductCard,
} from "@/components/Primitives";
import { getPublishedCatalog } from "@/lib/catalog/api";
import { filterAndSortProducts } from "@/lib/catalog/domain";
import type { DivisionContent } from "@/lib/divisions";

type CategorySearchParams = Readonly<{
  q?: string | string[];
  availability?: string | string[];
  sort?: string | string[];
}>;

function one(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export async function CategoryLanding({
  content,
  searchParams,
}: Readonly<{ content: DivisionContent; searchParams: Promise<CategorySearchParams> }>) {
  const params = await searchParams;
  const query = one(params.q).slice(0, 120);
  const availability = ["all", "available", "sold-out"].includes(one(params.availability))
    ? one(params.availability)
    : "all";
  const sort = ["name", "price-asc", "price-desc"].includes(one(params.sort))
    ? one(params.sort)
    : "name";
  const catalog = await getPublishedCatalog();
  const scoped = catalog.products.filter((product) => product.division === content.key);
  const products = filterAndSortProducts(scoped, { query, availability, sort });
  const filterContext = [query ? `query “${query}”` : "", availability !== "all" ? availability : ""]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <section className="section-compact shell category-opening">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: content.label, href: `/${content.slug}` },
            { label: "Published shelf" },
          ]}
        />
        <p className="eyebrow">{content.label} · canonical published records</p>
        <h1 className="quiet-h1">Browse, then qualify.</h1>
        <p className="lede">
          This category reflects the division field in the current customer projection. It does not invent unapproved subcategories, compatibility, proof, fit, or eligibility.
        </p>
      </section>

      <section className="section-compact bright" aria-labelledby="category-controls-title">
        <div className="shell">
          <div className="category-context">
            <div>
              <p className="data-label">Scope</p>
              <h2 id="category-controls-title">{content.label}</h2>
            </div>
            <p className="result-count" aria-live="polite">
              {catalog.status === "ready" ? `${products.length} qualified result${products.length === 1 ? "" : "s"}` : "Results unavailable"}
            </p>
          </div>

          <form className="category-tools" method="get" role="search">
            <label className="field">
              <span>Search within {content.label}</span>
              <input name="q" type="search" defaultValue={query} maxLength={120} />
            </label>
            <label className="field">
              <span>Availability</span>
              <select name="availability" defaultValue={availability}>
                <option value="all">All published states</option>
                <option value="available">Available</option>
                <option value="sold-out">Sold out</option>
              </select>
            </label>
            <label className="field">
              <span>Sort</span>
              <select name="sort" defaultValue={sort}>
                <option value="name">Product name</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
            </label>
            <div className="category-tools__actions">
              <button className="button" type="submit">Apply</button>
              <Link className="button button--secondary" href={`/${content.slug}/shop`}>Reset</Link>
            </div>
          </form>
          <p className="filter-summary">
            <strong>Active context:</strong> {filterContext || `All published ${content.label} records`}
          </p>
        </div>
      </section>

      <section className="section shell" aria-labelledby="category-results-title">
        <h2 className="visually-hidden" id="category-results-title">Qualified results</h2>
        {catalog.status !== "ready" ? (
          <CatalogState
            state={catalog.status === "error" ? "error" : "unavailable"}
            title="The category cannot retrieve published records."
            reason={catalog.message ?? "The canonical customer-read boundary did not return a usable result."}
            preservedContext={filterContext || content.label}
            recovery={{ href: "/support", label: "Keep the context with Support" }}
          />
        ) : products.length === 0 ? (
          <CatalogState
            state="empty"
            title="No qualified result matches this context."
            reason="Your filters stay visible. No incompatible, unpublished, or research-only record has been inserted to fill the grid."
            preservedContext={filterContext || content.label}
            recovery={{ href: `/${content.slug}/shop`, label: "Clear category filters" }}
          />
        ) : (
          <div className="catalog-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {catalog.status === "ready" && catalog.suppressedRecords > 0 ? (
          <CatalogState
            state="partial"
            title="The projection contains incomplete records."
            reason="Records missing the minimum storefront contract are withheld rather than repaired with inferred facts."
            preservedContext={filterContext || content.label}
            recovery={{ href: "/support", label: "Ask about a missing record" }}
          />
        ) : null}
      </section>

      <section className="section deep">
        <div className="shell split split-balanced">
          <div>
            <p className="eyebrow">Qualification before pressure</p>
            <h2>The shelf can answer only what its records support.</h2>
            <p>
              Whole-house Search can broaden the query. A guide can clarify the decision. Support can carry an unresolved exact context forward.
            </p>
            <div className="button-row">
              <Link className="button" href="/search">Search the whole house</Link>
              <Link className="button button--secondary" href="/support">Go to Support</Link>
            </div>
          </div>
          <HouseRead
            conclusion={content.houseRead.conclusion}
            rationale={content.houseRead.rationale}
            limits={content.houseRead.limitation}
          />
        </div>
      </section>
    </>
  );
}
