import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About the house",
  description:
    "Why Blowin’ Smoke is building one independent house around knowledge, careful selection, honest recommendations, and customer respect.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section shell">
        <p className="eyebrow">About the house</p>
        <h1 className="quiet-h1">
          Independent by conviction. Exact by practice.
        </h1>
        <p className="lede measure">
          Blowin’ Smoke exists because too many smoke shops and storefronts feel
          interchangeable. This house is being built around knowledge, careful
          selection, honest recommendations, and design that respects the
          customer’s attention.
        </p>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <p className="data-label">The mission</p>
          <h2>Earn respect without becoming generic or corporate.</h2>
          <p className="measure">
            The ambition is to build a respected independent smoke shop brand—not
            by being the largest or the cheapest, but by making thoughtful choices
            and standing behind them with substance.
          </p>

          <dl className="standard-ledger">
            <div>
              <dt>Independence</dt>
              <dd>
                Decisions answer to customers and the quality of the experience,
                not trend cycles or borrowed retail formulas.
              </dd>
            </div>
            <div>
              <dt>Authenticity</dt>
              <dd>
                Credibility has to be earned through honest language, continued
                learning, and recommendations with a visible reason.
              </dd>
            </div>
            <div>
              <dt>Design</dt>
              <dd>
                Beautiful design is treated as respect and communication. Every
                element should help the customer orient, understand, or act.
              </dd>
            </div>
            <div>
              <dt>Knowledge</dt>
              <dd>
                Knowledge is part of the product. A useful experience should leave
                the customer better equipped to make the next decision.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section-compact deep">
        <div className="shell">
          <p className="data-label">The challenge</p>
          <h2>“Who Wants That Smoke?” starts with us.</h2>
          <p className="measure">
            It is a challenge to work harder, build better, resist complacency,
            and keep betting on independent judgment. It is not an invitation to
            violence and not empty bravado.
          </p>
          <div className="button-row">
            <Link className="button" href="/standards">
              Read the house standards
            </Link>
            <Link className="button secondary" href="/#shop-by-division">
              Enter the three divisions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
