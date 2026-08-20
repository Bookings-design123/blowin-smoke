import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Publication status for Blowin’ Smoke shipping, returns, privacy, terms, age and eligibility, accessibility, warnings, and authenticity policies.",
};

const policies = [
  { slug: "shipping", title: "Shipping" },
  { slug: "returns", title: "Returns & damage" },
  { slug: "privacy", title: "Privacy" },
  { slug: "terms", title: "Terms" },
  { slug: "age-eligibility", title: "Age & eligibility" },
  { slug: "accessibility", title: "Accessibility" },
  { slug: "product-warnings", title: "Product warnings" },
  { slug: "authenticity-proof", title: "Authenticity & proof" },
] as const;

export default function PoliciesPage() {
  return (
    <>
      <section className="section shell">
        <p className="eyebrow">Policies</p>
        <h1 className="quiet-h1">No unpublished term becomes a promise.</h1>
        <p className="lede measure">
          These routes make policy gaps visible. They do not borrow competitor
          terms, infer legal rules, or turn an intended operating direction into a
          customer commitment.
        </p>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <div className="state-panel state-blocked" role="status">
            <p className="data-label">Policy publication unavailable</p>
            <h2>Customer-facing policies are not yet governed and published.</h2>
            <p className="measure">
              Each route below states the unresolved boundary for that subject. No
              shipping destination, fee, timeline, return window, age threshold,
              privacy term, legal agreement, or operational guarantee is created
              here.
            </p>
          </div>

          <dl className="standard-ledger">
            {policies.map((policy) => (
              <div key={policy.slug}>
                <dt>{policy.title}</dt>
                <dd>
                  Not published. <Link href={`/policies/${policy.slug}`}>Review the current boundary</Link>.
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-compact deep">
        <div className="shell">
          <p className="data-label">Until publication</p>
          <h2>Do not rely on an unstated condition.</h2>
          <p className="measure">
            A governed policy needs accountable authority, an effective version,
            clear scope, and operational support. Until those records exist, this
            storefront keeps the absence visible and withholds affected promises
            and actions.
          </p>
          <Link className="button secondary" href="/support">
            Review available guidance
          </Link>
        </div>
      </section>
    </>
  );
}
