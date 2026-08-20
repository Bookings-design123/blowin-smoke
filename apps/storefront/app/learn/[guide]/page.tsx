import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  SourceDisclosure,
  StatePanel,
} from "@/components/Primitives";
import { guideBySlug, GUIDES } from "@/lib/guides";

type GuidePageProps = Readonly<{ params: Promise<{ guide: string }> }>;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ guide: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = guideBySlug((await params).guide);
  return { title: guide?.title ?? "Guide" };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = guideBySlug((await params).guide);
  if (!guide) notFound();

  return (
    <article>
      <header className="section-compact shell guide-opening">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: guide.title },
          ]}
        />
        <p className="eyebrow">{guide.eyebrow}</p>
        <h1 className="quiet-h1">{guide.title}</h1>
        <p className="lede">{guide.outcome}</p>
        <dl className="guide-meta">
          <div><dt>For</dt><dd>{guide.forWhom}</dd></div>
          <div><dt>Review status</dt><dd>{guide.reviewed}</dd></div>
        </dl>
      </header>

      <section className="section bright" aria-labelledby="guide-limits-title">
        <div className="shell reading-measure">
          <StatePanel
            state="Scope and limits"
            title="Know what this guide cannot decide."
            reason={guide.limits}
            consequence="Unknown stays unknown until the correct authoritative record resolves it."
            tone="information"
            headingLevel={2}
            headingId="guide-limits-title"
          />
        </div>
      </section>

      <section className="section shell reading-measure" aria-labelledby="guide-steps-title">
        <p className="eyebrow">The route</p>
        <h2 id="guide-steps-title">Work from identity to verification.</h2>
        <ol className="guide-steps">
          {guide.steps.map((step, index) => (
            <li key={step.title}>
              <span className="guide-step__number">0{index + 1}</span>
              <div><h3>{step.title}</h3><p>{step.body}</p></div>
            </li>
          ))}
        </ol>
        <SourceDisclosure
          owner={guide.owner}
          evidenceBasis={guide.sourceBasis}
          reviewStatus={guide.reviewed}
          limitation="This Phase 1 guide exposes the system method and its limits; it is not a product, policy, proof, compatibility, fit, or eligibility record."
        />
      </section>

      <section className="section deep">
        <div className="shell split split-balanced">
          <div>
            <p className="eyebrow">Verify the result</p>
            <h2>Make the conclusion inspectable.</h2>
            <p>{guide.verify}</p>
          </div>
          <div>
            <p className="eyebrow">When the answer stays open</p>
            <h2>Keep the recovery beside the unknown.</h2>
            <p>{guide.recovery}</p>
            <div className="button-row">
              <Link className="button" href="/support">Go to Support</Link>
              <Link className="button button--secondary" href="/search">Search the house</Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
