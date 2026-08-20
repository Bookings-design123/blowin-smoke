import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Preserve exact product, proof, device, fit, and cart context while direct Blowin’ Smoke support intake remains unavailable.",
};

const contextChecklist = [
  "The exact product, variant, SKU, or package record",
  "The device model and revision, when compatibility is involved",
  "Both objects and known measurements, when physical fit is involved",
  "The proof document and batch or lot scope, when applicable",
  "The state you saw and the step that could not be completed",
] as const;

export default function SupportPage() {
  return (
    <>
      <section className="section shell">
        <p className="eyebrow">Support</p>
        <h1 className="quiet-h1">Keep the exact question with you.</h1>
        <p className="lede measure">
          Good recovery preserves product identity, selected state, the known
          facts, and the unresolved point. Start with a guide now; carry the same
          context forward when a governed support intake becomes available.
        </p>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <p className="data-label">Start with the task</p>
          <h2>Three guides keep the decision grounded.</h2>
          <dl className="standard-ledger">
            <div>
              <dt>THCA proof</dt>
              <dd>
                Keep product, option, batch or lot, document scope, and eligibility
                as separate questions. <Link href="/learn/thca-proof">Read the guide</Link>.
              </dd>
            </div>
            <div>
              <dt>Device identity</dt>
              <dd>
                Capture the exact model, revision, platform, and needed role before
                asking about compatibility. <Link href="/learn/device-identification">Read the guide</Link>.
              </dd>
            </div>
            <div>
              <dt>Physical fit</dt>
              <dd>
                Name both objects and preserve connection, angle, orientation, and
                clearance unknowns. <Link href="/learn/measure-a-connection">Read the guide</Link>.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section-compact deep">
        <div className="shell">
          <p className="data-label">Preserve the record</p>
          <h2>Bring what can change the answer.</h2>
          <ul>
            {contextChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <div className="state-panel state-blocked" role="status">
            <p className="data-label">Support intake unavailable</p>
            <h2>A direct support channel is not connected.</h2>
            <p className="measure">
              No contact method, staffed hours, response time, service level,
              warranty authority, or case workflow is promised by this storefront.
              The guides above remain available without implying that an unresolved
              product decision has been answered.
            </p>
          </div>
          <div className="button-row">
            <Link className="button" href="/learn">
              Browse all guides
            </Link>
            <Link className="button secondary" href="/search">
              Search the whole house
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
