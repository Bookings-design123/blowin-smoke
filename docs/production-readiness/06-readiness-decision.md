# Blowin' Smoke — Production Readiness Decision

## Decision

# NOT READY FOR TECHNICAL ARCHITECTURE

This decision concerns the next production specification phase only. It does not reopen design research, alter the closed static architecture, or authorize implementation.

## Decision rationale

Blowin' Smoke has a strong governing foundation: brand philosophy, page responsibilities, product-role schemas, state precedence, provenance, proof, compatibility, fit, accessibility, cart behavior, and uncertainty handling are already specified. What is absent is the authoritative truth that a production architecture must connect, govern, refresh, and enforce.

The repository contains no approved cross-division catalog, stable SKU/variant records, supplier authorization, current price or inventory sources, real COA/batch mappings, verified electronic relationships, verified physical measurements/fit records, production product media, current operating policies, qualified eligibility rules, payment/tax decisions, or named systems of record. Eight Vape & Nicotine customer-intelligence leads are useful for intake testing, but none is a production catalog record, and no supported THCA or Glass candidate set exists.

Selecting platforms, service boundaries, integrations, identity/payment flows, eligibility enforcement, fulfillment, proof storage, relationship validation, or data refresh behavior now would encode guesses about architecture-shaping requirements.

## Strongest verified inputs

1. `docs/constitution/01-brand-philosophy.md` supplies a clear decision test: independence, substance, respect, cultural credibility, discovery, and performance.
2. `docs/system/01-master-design-commerce-system.md` through `04-page-by-page-architecture-specifications.md` govern the one-house/three-division model, product roles, page jobs, state precedence, proof, compatibility, fit, cart, and support boundaries.
3. `docs/system/05-visual-design-system.md`, `06-high-fidelity-page-design-specifications.md`, and the closed Iteration 05.1 package establish a coherent customer-facing design direction with explicit provisional and blocked states.
4. The VaporDNA and Smoke Cartel closure decisions establish domain problems and authoritative-source discipline while reserving the solution for Blowin' Smoke.
5. Customer intelligence identifies eight bounded Vape & Nicotine leads and explicitly states the sourcing, economics, compliance, availability, version, replacement, and support gates that remain.

## Most important missing inputs

1. An owner-approved, supplier-supported pilot catalog across intended launch divisions, with exact product, variant/SKU, contents, specifications, and role.
2. Named systems of record and owners for catalog, price, inventory, fulfillment, proof, compatibility/fit, policies, media, support, and corrections.
3. Qualified age, destination, product-restriction, warning, proof-currentness, privacy, consent, and retention decisions.
4. Payment/merchant feasibility, tax ownership, price/promotion authority, refund behavior, and checkout progression rules.
5. Shipping, restricted-product fulfillment, returns/warranty, fragile damage, support staffing/authority, and service commitments.
6. Rights-cleared production identity, typography, product media, editorial media, and exact asset-to-product assignments.

## Minimum decisions needed before technical architecture

The following must be recorded before a production technical-architecture phase starts:

| Minimum decision | Required output |
|---|---|
| Launch and pilot catalog authority | Owner-approved cross-division pilot records, exact variants/SKUs, supplier/manufacturer sources, and explicit division launch boundary |
| Systems-of-record ownership | Named owner and source for catalog, price, inventory, fulfillment, proof, relationships, policies, media, support and corrections |
| Compliance rule boundary | Qualified scope for age, destination, product restrictions/warnings, proof currentness and failure behavior, with effective/version ownership |
| Commerce/finance boundary | Feasible payment/merchant path, tax authority/service requirement, price/promotion source, refund lifecycle and checkout constraints |
| Operations/support boundary | Fulfillment/shipping, returns/warranty, fragile damage, unavailable-product, support channels/staffing/authority and update responsibilities |
| Privacy/data boundary | Purpose, consent, retention, processor, identity, support-attachment, notification and analytics rules sufficient to constrain service selection |

These are not requests for finished legal prose or final UI copy. They are the smallest accountable decisions needed to avoid designing production services around unsupported assumptions.

## Decisions that may remain open during architecture

- Final assortment breadth beyond the approved representative pilot.
- Exact category count, filter order, merchandising cadence, and campaign calendar.
- Reviews, memberships, subscriptions, persistent owned-product profiles, personalization, automated matching, and dynamic bundles, because they should remain excluded or conditional.
- Exact production motion timing, final division accents, and non-semantic visual tuning.
- Final long-term analytics dashboards and optimization targets, provided deployment remains off until privacy approval.
- Full compatibility/fit coverage beyond the approved pilot, provided unknown remains explicit and affected purchase paths are not falsely enabled.
- Final promotional creative, provided no promotion is implemented without approved price basis and terms.

## Media and typography audition

**A combined real-media and typography audition cannot begin.** The repository contains no production product/editorial media and no documented product-media rights. Archivo remains a provisional typography direction with no committed font binary or license record. Typography testing may continue only as provisional internal evaluation; a real audition requires rights-cleared representative media for the intended product families plus authorized font builds and license evidence.

## Production coding

**Production coding may not begin.** The current repository authorizes governing specifications and static design evidence only. No production component, catalog service, search service, eligibility service, checkout, account, support case, inventory, payment, analytics, or application integration is authorized by this gate.

## Five highest-priority blockers

1. No authoritative cross-division pilot catalog or supplier-backed SKU/variant truth.
2. No qualified, versioned age/destination/product-restriction/proof rule set.
3. No commerce/finance authority for payment feasibility, taxes, price/promotion, refunds, and checkout constraints.
4. No operations systems or approved rules for inventory, fulfillment/shipping, returns/warranty, fragile damage, unavailable items, and support.
5. No named systems of record/data owners, privacy/consent/retention rules, or production media/rights package.

## Exact recommended next task

### Launch Authority & Systems-of-Record Intake

Run one owner-led evidence intake—not more competitor research and not a build—to produce:

1. an approved representative catalog across the intended launch divisions using `02-representative-catalog-candidates.json` only as a field/gap test;
2. supplier/manufacturer/package, COA/batch, compatibility, measurement/fit, media and rights evidence for those exact records;
3. a named RACI and system-of-record map for every blocking data class;
4. qualified decision records for eligibility/proof/privacy and finance/payment/tax;
5. operating decision records for inventory, fulfillment, shipping, returns/damage, support and correction/update responsibility.

Re-run this readiness gate after those records are committed. Only a new explicit readiness decision may authorize the technical-architecture phase; only a later separate authorization may permit production implementation.
