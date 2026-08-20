import Link from "next/link";

import {
  Breadcrumbs,
  CatalogState,
  HouseRead,
  MediaPlaceholder,
  ProductCard,
  SectionIntro,
} from "@/components/Primitives";
import { getPublishedCatalog } from "@/lib/catalog/api";
import type { DivisionContent } from "@/lib/divisions";

export async function DivisionLanding({ content }: Readonly<{ content: DivisionContent }>) {
  const catalog = await getPublishedCatalog();
  const divisionProducts = catalog.products.filter((product) => product.division === content.key);

  return (
    <>
      <section className={`division-opening division-opening--${content.slug}`}>
        <div>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: content.label }]} />
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="lede">{content.lede}</p>
        </div>
        <MediaPlaceholder
          title="Editorial media not assigned"
          message={content.mediaLabel}
          aspect="wide"
        />
      </section>

      <section className="section-compact customer-jobs" aria-labelledby={`${content.slug}-jobs-title`}>
        <div className="shell">
          <SectionIntro
            id={`${content.slug}-jobs-title`}
            eyebrow="Start with the job"
            title="What did you come to solve?"
            description="The room changes its facts, not its standards. Pick the question that matches where you are now."
          />
          <div className="customer-job-list">
            {content.jobs.map((job) => (
              <article className="customer-job" key={job.code}>
                <p className="data-label">{job.code}</p>
                <h3>{job.title}</h3>
                <p>{job.body}</p>
                <Link className="text-action" href={job.href}>
                  {job.action}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section deep" aria-labelledby={`${content.slug}-decisions-title`}>
        <div className="shell split split-balanced">
          <div>
            <p className="eyebrow">The room keeps its own facts</p>
            <h2 id={`${content.slug}-decisions-title`}>Identify first. Consequence where it matters.</h2>
            <dl className="standard-ledger">
              {content.decisions.map((decision) => (
                <div key={decision.label}>
                  <dt>{decision.label}</dt>
                  <dd>{decision.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HouseRead
            conclusion={content.houseRead.conclusion}
            rationale={content.houseRead.rationale}
            evidenceBasis="Canonical storefront system and current public projection boundary."
            limits={content.houseRead.limitation}
          />
        </div>
      </section>

      <section className="section bright" aria-labelledby={`${content.slug}-shelf-title`}>
        <div className="shell">
          <SectionIntro
            id={`${content.slug}-shelf-title`}
            eyebrow="Published shelf"
            title="Current records, without invented fill."
            description="Only active records returned by the existing canonical customer API can appear here. Purchase actions stay closed when decision-critical state is absent."
            aside={
              <Link className="button button--secondary" href={`/${content.slug}/shop`}>
                Open the full category
              </Link>
            }
          />

          {catalog.status === "ready" && divisionProducts.length > 0 ? (
            <div className="catalog-grid">
              {divisionProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : catalog.status === "ready" ? (
            <CatalogState
              state="empty"
              title={`No qualified ${content.label} records are published.`}
              reason="An empty shelf is shown as empty. Research candidates and prototype fixtures are not substituted."
              recovery={{ href: "/learn", label: "Use a decision guide" }}
            />
          ) : (
            <CatalogState
              state={catalog.status === "error" ? "error" : "unavailable"}
              title="The published shelf is not available here yet."
              reason={catalog.message ?? "The canonical customer-read boundary did not return a usable catalog."}
              recovery={{ href: "/support", label: "Keep the question with Support" }}
            />
          )}

          {catalog.status === "ready" && catalog.suppressedRecords > 0 ? (
            <CatalogState
              state="partial"
              title="Some published records are withheld from this view."
              reason="Records without the required division, variant, SKU, price, or availability shape are not converted into plausible storefront products."
              preservedContext={content.label}
              recovery={{ href: "/support", label: "Ask about a missing record" }}
            />
          ) : null}
        </div>
      </section>

      <section className="section shell split split-balanced" aria-labelledby={`${content.slug}-help-title`}>
        <div>
          <p className="eyebrow">Keep the exact question</p>
          <h2 id={`${content.slug}-help-title`}>Learn before the next product enters the picture.</h2>
        </div>
        <div>
          <p>
            Guides teach a repeatable decision. Support receives the product, selected record, owned context, and missing fact without turning customer input into catalog truth.
          </p>
          <div className="button-row">
            <Link className="button" href={content.jobs[1]?.href ?? "/learn"}>
              Open the guide
            </Link>
            <Link className="button button--secondary" href="/support">
              Go to Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
