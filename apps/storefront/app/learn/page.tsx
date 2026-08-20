import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, SectionIntro } from "@/components/Primitives";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <>
      <section className="section-compact shell">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn" }]} />
        <p className="eyebrow">Choose · verify · replace · care</p>
        <h1 className="quiet-h1">Knowledge should change the next decision.</h1>
        <p className="lede">
          These guides start with a customer job, state their limits, show how to verify the result, and keep a recovery route open.
        </p>
      </section>

      <section className="section bright" aria-labelledby="guide-index-title">
        <div className="shell">
          <SectionIntro
            id="guide-index-title"
            eyebrow="Task-based guides"
            title="Bring the exact context."
            description="Education can reduce uncertainty. It cannot create inventory, policy, proof, eligibility, compatibility, or fit."
          />
          <div className="guide-grid">
            {GUIDES.map((guide, index) => (
              <article className="guide-card" key={guide.slug}>
                <p className="data-label">0{index + 1} · {guide.eyebrow}</p>
                <h2>{guide.title}</h2>
                <p>{guide.outcome}</p>
                <Link className="text-action" href={`/learn/${guide.slug}`}>Open the guide</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell split split-balanced">
        <div>
          <p className="eyebrow">House method</p>
          <h2>Facts, claims, reports, and interpretation do not share a label.</h2>
        </div>
        <div>
          <p>
            The evidence firewall keeps verified product facts, maker claims, measured records, reviewer observations, customer testimony, policy, house interpretation, and unknown information visibly separate.
          </p>
          <Link className="button" href="/standards">Read the standards</Link>
        </div>
      </section>
    </>
  );
}
