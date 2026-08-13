# Architecture Decisions and Next Gate

## ADR-01 — Provisional application topology

- **Status:** Accepted provisionally for provider-neutral architecture.
- **Context:** Cross-domain cart/order consistency is substantial while catalog, providers, traffic and operating team are unresolved.
- **Decision:** Use a modular monolith with explicit bounded modules, transactional core/outbox, asynchronous projections and logical isolation at sensitive/provider boundaries.
- **Alternatives considered:** Premature distributed services; provider-owned all-in-one data model; undifferentiated monolith.
- **Reason:** Lowest justified operational complexity while preserving domain ownership and later extraction seams.
- **Consequences:** Module boundaries and cross-domain commands/events are mandatory; independent deployment is deferred.
- **Unresolved validation:** Platform fit, traffic, team capability, scaling and provider constraints.
- **Reopen when:** A module has proven independent scale, security, availability, team ownership or provider-boundary needs that outweigh distribution cost.

## ADR-02 — Canonical ownership and stable identifiers

- **Status:** Accepted.
- **Context:** Suppliers/providers are absent and future external identifiers may change.
- **Decision:** Blowin' Smoke stable IDs and owning domains are canonical; external IDs are versioned aliases with provenance/effective time.
- **Alternatives considered:** Provider IDs as primary keys; shared mutable records; title/SKU strings as identity.
- **Reason:** Preserves portability, corrections, historical order context and one truth per domain.
- **Consequences:** Mapping/import work is required; providers cannot directly overwrite canonical truth.
- **Unresolved validation:** Identifier conventions, collision/migration policy and actual supplier fields.
- **Reopen when:** Never for provider convenience; only if a regulated/authoritative identifier must be canonical in a clearly bounded scope.

## ADR-03 — Replaceable provider-adapter boundary

- **Status:** Accepted.
- **Context:** No commerce, payment, age, tax, shipping, inventory, identity, support, search or analytics provider is selected.
- **Decision:** Each external capability uses a canonical adapter contract with mapping, timeout, retry, idempotency, audit, portability and fail-mode requirements.
- **Alternatives considered:** Direct provider types throughout domains; selecting providers before requirements; lowest-common-denominator abstractions.
- **Reason:** Provider choice remains replaceable without weakening specific business semantics.
- **Consequences:** Translation/reconciliation layers are explicit; provider-only features require architecture review.
- **Unresolved validation:** Provider feasibility and exact capabilities after business intake.
- **Reopen when:** A selected capability cannot satisfy the canonical contract and the business requirement—not vendor convenience—has changed.

## ADR-04 — Transactional outbox and correction propagation

- **Status:** Accepted provisionally.
- **Context:** Canonical writes must update many projections without distributed transactions or lost corrections.
- **Decision:** Commit canonical change, audit and outbox event atomically; deliver at least once; consumers are idempotent; corrections invalidate/rebuild and revalidate active commerce.
- **Alternatives considered:** Synchronous fan-out; best-effort callbacks; direct shared-table reads; full event sourcing.
- **Reason:** Provides reliable propagation and replay without requiring full event sourcing or services.
- **Consequences:** Event schema/version, lag monitoring, dead-letter/replay and idempotency stores are required.
- **Unresolved validation:** Selected platform transaction/event support and operational tooling.
- **Reopen when:** Platform constraints or proven scale make the outbox unsafe, or regulated audit needs justify event sourcing for a bounded domain.

## ADR-05 — Fail-safe composed purchase readiness

- **Status:** Accepted.
- **Context:** Positive stock, price or provider response cannot override higher-priority uncertainty.
- **Decision:** Derive progression using the exact eleven-step precedence; Unknown and Service Error remain distinct and cannot default to success.
- **Alternatives considered:** Single purchasable boolean; optimistic allow; provider-specific checkout rules.
- **Reason:** Prevents restricted, unusable, unproven or unresolved purchases and preserves honest recovery.
- **Consequences:** Every input is version-referenced; carts revalidate; CTA is derived; outages may block progression.
- **Unresolved validation:** Qualified rule outcomes and which material proof/fit unknowns block versus warn.
- **Reopen when:** A qualified owner changes a domain consequence; the global precedence cannot be reordered by merchandising or provider behavior.

## ADR-06 — Owned inventory and three-mode fulfillment

- **Status:** Accepted.
- **Context:** Blowin' Smoke will purchase/hold inventory and intends nationwide-where-eligible shipping, York pickup and York local delivery.
- **Decision:** Maintain an owned inventory ledger with receiving, inspection, available/reserved/committed/damaged/quarantined/corrected states; model each fulfillment mode separately with re-evaluation and allocation.
- **Alternatives considered:** Dropshipping default; one generic delivery method; provider inventory as unqualified truth.
- **Reason:** Matches owner direction and preserves materially different eligibility, allocation and handoff behavior.
- **Consequences:** Receiving/reconciliation operations are required; method changes invalidate affected decisions; no universal shipping claim.
- **Unresolved validation:** Inventory system, locations, reservation rules, carrier/payment feasibility, York procedures and original policies.
- **Reopen when:** Owner changes the inventory operating model or a new fulfillment mode has a materially distinct customer/operational contract.

## Final architecture-phase decision

| Classification | Decision |
|---|---|
| VENDOR-NEUTRAL ARCHITECTURE SPECIFICATION | **COMPLETE** |
| SUPPLIER / PILOT CATALOG FEASIBILITY | **NOT RESOLVED** |
| FINAL PLATFORM / PROVIDER SELECTION | **NOT AUTHORIZED** |
| PRODUCTION IMPLEMENTATION | **NOT AUTHORIZED** |
| LAUNCH | **NOT READY** |

## Exact next gate

# Supplier, Merchant, Compliance, and Pilot Catalog Feasibility Intake

This is the next business workstream, not another internal architecture document. It must obtain supplier/account feasibility and authoritative cross-division pilot records; merchant/payment underwriting feasibility; qualified age/destination/product/proof/privacy requirements; owned-inventory/fulfillment/support operating inputs; and enough real media, proof, compatibility and fit evidence to test provider candidates against this architecture.

Only after that intake may a separate gate authorize provider evaluation/selection. Provider selection does not itself authorize production implementation, and implementation does not authorize launch.
