import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, CatalogState, ProductCard, SectionIntro } from "@/components/Primitives";
import { getPublishedCatalog } from "@/lib/catalog/api";
import { filterAndSortProducts } from "@/lib/catalog/domain";
import type { DivisionKey } from "@/lib/catalog/types";
import { DIVISIONS } from "@/lib/divisions";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = { title: "Search" };
export const dynamic = "force-dynamic";

type SearchParams = Readonly<{ q?: string | string[]; scope?: string | string[] }>;

function one(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

const scopeMap: Readonly<Record<string, DivisionKey>> = {
  thca: "THCA",
  "vape-nicotine": "VAPE_NICOTINE",
  "glass-accessories": "GLASS_ACCESSORIES",
};

export default async function SearchPage({ searchParams }: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const params = await searchParams;
  const query = one(params.q).trim().slice(0, 120);
  const scope = scopeMap[one(params.scope)] ? one(params.scope) : "whole-house";
  const catalog = await getPublishedCatalog();
  const scopedProducts = scope === "whole-house"
    ? catalog.products
    : catalog.products.filter((product) => product.division === scopeMap[scope]);
  const products = query ? filterAndSortProducts(scopedProducts, { query }) : [];
  const normalizedQuery = query.toLocaleLowerCase();
  const guides = query
    ? GUIDES.filter((guide) => `${guide.title} ${guide.outcome}`.toLocaleLowerCase().includes(normalizedQuery))
    : GUIDES;
  const divisionResults = Object.values(DIVISIONS).filter((division) =>
    query
      ? `${division.label} ${division.title} ${division.lede}`.toLocaleLowerCase().includes(normalizedQuery)
      : true,
  );
  const interpretedScope = scope === "whole-house" ? "Whole house" : DIVISIONS[scope].label;

  return (
    <>
      <section className="section-compact shell search-opening">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <p className="eyebrow">Whole-house discovery</p>
        <h1 className="quiet-h1">Search the exact thing you know.</h1>
        <p className="lede">
          Names, model numbers, and SKUs can retrieve records. Similar words never create compatibility, fit, proof, or eligibility.
        </p>
        <form className="search-form" method="get" role="search">
          <label className="field search-form__query">
            <span>Search products, divisions, and guides</span>
            <input name="q" type="search" defaultValue={query} maxLength={120} autoComplete="off" />
          </label>
          <label className="field">
            <span>Scope</span>
            <select name="scope" defaultValue={scope}>
              <option value="whole-house">Whole house</option>
              <option value="thca">THCA</option>
              <option value="vape-nicotine">Vape & Nicotine</option>
              <option value="glass-accessories">Glass / Accessories / Merch</option>
            </select>
          </label>
          <button className="button" type="submit">Search</button>
        </form>
        <p className="filter-summary"><strong>Interpreted scope:</strong> {interpretedScope}{query ? ` · exact query “${query}”` : ""}</p>
      </section>

      {query ? (
        <section className="section bright" aria-labelledby="product-results-title">
          <div className="shell">
            <SectionIntro
              id="product-results-title"
              eyebrow="Products"
              title={`Published records for “${query}”`}
              description={`${products.length} product result${products.length === 1 ? "" : "s"}. Product identity appears before consequential state.`}
            />
            {catalog.status !== "ready" ? (
              <CatalogState
                state={catalog.status === "error" ? "error" : "unavailable"}
                title="Product Search cannot reach the published catalog."
                reason={catalog.message ?? "The canonical customer-read boundary did not return a usable result."}
                preservedContext={`“${query}” in ${interpretedScope}`}
                recovery={{ href: "/support", label: "Keep the query with Support" }}
              />
            ) : products.length > 0 ? (
              <div className="catalog-grid">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <CatalogState
                state="empty"
                title="No published product matches that exact query."
                reason="The query and scope remain visible. No lexical similarity has been converted into a product or compatibility match."
                preservedContext={`“${query}” in ${interpretedScope}`}
                recovery={{ href: "/search", label: "Start a new search" }}
              />
            )}
          </div>
        </section>
      ) : (
        <section className="section bright">
          <div className="shell">
            <CatalogState
              state="empty"
              title="Start with an exact label, model, SKU, or customer job."
              reason="Search stays quiet until you provide a query. The routes below remain available without catalog access."
              recovery={{ href: "/learn", label: "Start with a guide" }}
            />
          </div>
        </section>
      )}

      <section className="section shell" aria-labelledby="other-results-title">
        <SectionIntro
          id="other-results-title"
          eyebrow="Other result types"
          title="Divisions and guidance stay separately named."
          description="A guide is not a product. A division route is not a relationship result. Support is the recovery path when the record cannot answer."
        />
        <div className="search-result-groups">
          <section aria-labelledby="division-results-title">
            <p className="data-label">Category / division</p>
            <h3 id="division-results-title">Rooms</h3>
            {divisionResults.length > 0 ? (
              <ul className="route-list">
                {divisionResults.map((division) => (
                  <li key={division.slug}>
                    <Link href={`/${division.slug}`}><strong>{division.label}</strong><span>{division.title}</span></Link>
                  </li>
                ))}
              </ul>
            ) : <p>No division label matches this query.</p>}
          </section>
          <section aria-labelledby="guide-results-title">
            <p className="data-label">Guidance</p>
            <h3 id="guide-results-title">Decision guides</h3>
            {guides.length > 0 ? (
              <ul className="route-list">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/learn/${guide.slug}`}><strong>{guide.title}</strong><span>{guide.outcome}</span></Link>
                  </li>
                ))}
              </ul>
            ) : <p>No guide title matches this query.</p>}
          </section>
          <section aria-labelledby="support-result-title">
            <p className="data-label">Support</p>
            <h3 id="support-result-title">Keep the unresolved context.</h3>
            <p>Carry the exact query, known product or owned object, and missing fact without turning the question into catalog truth.</p>
            <Link className="text-action" href="/support">Go to Support</Link>
          </section>
        </div>
      </section>
    </>
  );
}
