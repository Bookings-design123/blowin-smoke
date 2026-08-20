import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "House standards",
  description:
    "How Blowin’ Smoke separates attention from proof, keeps evidence lanes distinct, and uses Litmus research states without turning them into commerce claims.",
};

const evidenceLanes = [
  "Verified product fact",
  "Manufacturer or maker claim",
  "Measured or inspected fact",
  "Compatibility or physical-fit validation",
  "Policy or eligibility rule",
  "Reviewer observation",
  "Customer testimony",
  "Blowin’ Smoke interpretation",
  "Unresolved or unknown information",
] as const;

const litmusStates = [
  {
    name: "stock candidate",
    meaning:
      "A research qualification only. It is not publication, inventory, compliance, eligibility, or availability.",
  },
  {
    name: "test-buy candidate",
    meaning:
      "A limited evaluation step. It is not a stocked product or a customer recommendation.",
  },
  {
    name: "watch",
    meaning:
      "A reason to keep observing while the missing evidence need remains visible.",
  },
  {
    name: "failed / do not stock",
    meaning:
      "An internal selection outcome, not permission to publish an unsupported claim about a product or maker.",
  },
  {
    name: "insufficient evidence",
    meaning:
      "The record cannot support a positive conclusion. Unknowns stay explicit.",
  },
] as const;

export default function StandardsPage() {
  return (
    <>
      <section className="section shell">
        <p className="eyebrow">House standards</p>
        <h1 className="quiet-h1">
          Pressure attracts attention. Proof earns action.
        </h1>
        <p className="lede measure">
          Blowin’ Smoke can speak with force when it establishes the house. As a
          decision becomes more consequential, the presentation gets calmer and
          the product, evidence, state, and next valid move take over.
        </p>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <p className="data-label">Pressure &amp; Proof</p>
          <h2>Expression upstream. Precision downstream.</h2>
          <dl className="standard-ledger">
            <div>
              <dt>Pressure</dt>
              <dd>
                Identity, hierarchy, and a point of view help a customer understand
                the house and choose the right division.
              </dd>
            </div>
            <div>
              <dt>Proof</dt>
              <dd>
                Exact selection, price basis, availability, evidence, fit,
                eligibility, blockers, and recovery govern consequential action.
              </dd>
            </div>
            <div>
              <dt>Unknown</dt>
              <dd>
                Missing or unresolved truth remains unknown. Visual confidence
                never turns it into a soft yes.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section-compact deep">
        <div className="shell">
          <p className="data-label">Evidence firewall</p>
          <h2>Different sources keep different authority.</h2>
          <p className="measure">
            A consistent visual system may connect evidence, but it must never
            collapse these lanes into one undifferentiated house claim.
          </p>
          <ul>
            {evidenceLanes.map((lane) => (
              <li key={lane}>{lane}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <p className="data-label">Litmus Test vocabulary</p>
          <h2>Research state is not commerce state.</h2>
          <p className="measure">
            The Litmus Test is primarily an internal selection discipline. No
            product is assigned a Litmus status on this page, and none of these
            labels establishes publication, stock, availability, compatibility,
            proof, compliance, or purchase readiness.
          </p>
          <dl className="standard-ledger">
            {litmusStates.map((state) => (
              <div key={state.name}>
                <dt>{state.name}</dt>
                <dd>{state.meaning}</dd>
              </div>
            ))}
          </dl>

          <details className="disclosure">
            <summary>What a Litmus record cannot replace</summary>
            <p className="measure">
              It cannot replace a product specification, COA, compatibility or fit
              record, eligibility decision, publication state, inventory position,
              price, or the composed readiness decision that governs an action.
            </p>
          </details>

          <div className="button-row">
            <Link className="button" href="/learn">
              Use a decision guide
            </Link>
            <Link className="button secondary" href="/support">
              Carry an unknown to Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
