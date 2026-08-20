import Image from "next/image";
import Link from "next/link";

import { CatalogState, SectionIntro } from "@/components/Primitives";

export const dynamic = "force-dynamic";

const divisionRoutes = [
  {
    code: "01 · Format + proof",
    label: "THCA",
    href: "/thca",
    facts: "Format · selected record · proof · eligibility",
    body: "Choose the exact product form while keeping proof, availability, and eligibility as separate states.",
  },
  {
    code: "02 · Setup + replacement",
    label: "Vape & Nicotine",
    href: "/vape-nicotine",
    facts: "Device · consumable · replacement · compatibility",
    body: "Start with what you want, what you own, or the exact part you need next.",
  },
  {
    code: "03 · Piece + fit + care",
    label: "Glass / Accessories / Merch",
    href: "/glass-accessories",
    facts: "Complete piece · fitted part · care · merch",
    body: "Name the object, measure the connection, and keep non-applicable fit fields out of merch.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="home-opening" aria-labelledby="home-title">
        <div className="home-opening-grid">
          <div className="home-opening-copy">
            <p className="challenge-line"><span className="witness-rule" aria-hidden="true" />Who wants that smoke?</p>
            <h1 id="home-title">The shelf answers to judgment.</h1>
            <p className="opening-lede">
              Built for people making something out of nothing. Three divisions, chosen by an independent house that knows when to say yes, no, or not yet.
            </p>
            <Link className="button button--light" href="#shop-by-division">Choose a division</Link>
            <nav className="opening-route-strip" aria-label="Choose a Blowin’ Smoke division">
              {divisionRoutes.map((division) => (
                <Link key={division.href} href={division.href}>
                  <small>{division.code}</small>
                  <span>{division.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <figure className="house-witness">
            <div className="house-witness__logo">
              <Image
                src="/blowin-smoke-logo.png"
                alt="Blowin’ Smoke"
                width={8000}
                height={4500}
                priority
                sizes="(max-width: 680px) calc(100vw - 56px), 38vw"
              />
            </div>
            <div className="house-witness__media" role="img" aria-label="Reserved media field for approved operator and exact-product context">
              <span>Original operator media pending</span>
            </div>
            <figcaption>Across the counter, the exact product stays in the conversation.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section division-routes" id="shop-by-division" aria-labelledby="division-title">
        <div className="shell">
          <SectionIntro
            id="division-title"
            eyebrow="One house. Three ways in."
            title="Start with what you came to solve."
            description="Each room keeps the facts that matter to its products. The standard stays the same: identity first, honest limits, useful recovery."
          />
          <div className="division-route-list">
            {divisionRoutes.map((division, index) => (
              <article className="division-route" key={division.href}>
                <p className="route-number">0{index + 1}</p>
                <p className="route-scope">{division.facts}</p>
                <h3>{division.label}</h3>
                <p>{division.body}</p>
                <Link className="text-action" href={division.href}>Enter {division.label}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section deep" aria-labelledby="house-standard-title">
        <div className="house-standard shell">
          <div>
            <p className="eyebrow">The house standard</p>
            <h2 id="house-standard-title">Pressure gets attention. Proof earns the decision.</h2>
          </div>
          <dl className="standard-ledger">
            <div><dt>Known</dt><dd>The exact identity and the reason it matters stay attached.</dd></div>
            <div><dt>Unknown</dt><dd>The answer stays open instead of being dressed up as a guess.</dd></div>
            <div><dt>Blocked</dt><dd>The consequence and recovery appear before another ask.</dd></div>
            <div><dt>Next move</dt><dd>A valid route stays open without inventing readiness.</dd></div>
          </dl>
        </div>
      </section>

      <section className="section bright" aria-labelledby="curation-title">
        <div className="shell">
          <SectionIntro
            id="curation-title"
            eyebrow="Picked for a reason"
            title="Curation begins only when the reason is governed."
            description="The current public projection has published catalog state, but no approved curation membership, rationale, evidence scope, or review date."
          />
          <CatalogState
            state="empty"
            title="No qualified house curation is published."
            reason="Prototype fixtures and research candidates do not become a live shelf. The module stays honest until a canonical curation record exists."
            recovery={{ href: "/search", label: "Search published records" }}
          />
        </div>
      </section>

      <section className="section shell learning-route" id="learn" aria-labelledby="learn-title">
        <div>
          <p className="eyebrow">Know what you have</p>
          <h2 id="learn-title">Bring the label. Bring the measurement. Keep your judgment.</h2>
        </div>
        <p>
          Match a THCA proof record, identify a device, or measure a glass connection before the next product enters the picture.
        </p>
        <div className="button-row">
          <Link className="button" href="/learn">Open decision guides</Link>
          <Link className="button button--secondary" href="/standards">See how the house judges</Link>
        </div>
      </section>

      <section className="section dark support-route" id="support" aria-labelledby="support-title">
        <div className="shell split split-balanced">
          <div>
            <p className="eyebrow">Still need a person?</p>
            <h2 id="support-title">Keep the exact question with you.</h2>
          </div>
          <div>
            <p>
              Product name, selected option, owned context, and the missing fact should travel together. No response time or policy outcome is promised before those operations are approved.
            </p>
            <Link className="button button--light" href="/support">Go to Support</Link>
          </div>
        </div>
      </section>
    </>
  );
}
