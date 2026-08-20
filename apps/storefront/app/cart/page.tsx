import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Current Blowin’ Smoke cart connection status and safe routes back to the three divisions.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <section className="section shell">
        <p className="eyebrow">Cart · service unavailable</p>
        <h1 className="quiet-h1">The cart is not connected yet.</h1>
        <p className="lede measure">
          No cart lines, selected options, quantities, totals, reservations, or
          checkout state are stored by this storefront. Nothing has been added or
          silently substituted.
        </p>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <div className="state-panel state-blocked" role="status">
            <p className="data-label">Cart service unavailable</p>
            <h2>Canonical cart and readiness services are not connected.</h2>
            <p className="measure">
              A real cart must preserve the exact product, SKU, option, quantity,
              price, availability, evidence, eligibility, compatibility, fit, and
              blocker state returned by canonical services. This page will not
              fabricate that continuity, show invented totals, or offer checkout
              without it.
            </p>
          </div>

          <h2>Continue with a valid route</h2>
          <dl className="standard-ledger">
            <div>
              <dt>THCA</dt>
              <dd>
                Start with format and keep proof, eligibility, and availability as
                separate states. <Link href="/thca">Enter THCA</Link>.
              </dd>
            </div>
            <div>
              <dt>Vape / Nicotine</dt>
              <dd>
                Start with the job, exact device, or replacement role. <Link href="/vape-nicotine">Enter Vape / Nicotine</Link>.
              </dd>
            </div>
            <div>
              <dt>Glass / Accessories / Merch</dt>
              <dd>
                Start with the object, then preserve fit, material, and care facts.
                {" "}<Link href="/glass-accessories">Enter Glass / Accessories / Merch</Link>.
              </dd>
            </div>
          </dl>

          <div className="button-row">
            <Link className="button" href="/">
              Return home
            </Link>
            <Link className="button secondary" href="/support">
              Review support guidance
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
