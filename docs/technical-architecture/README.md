# Blowin' Smoke — Vendor-Neutral Technical Architecture Phase 1

**Package version:** 1.0  
**Source commit:** `469e8ce128c6adf8764dcb356bc6a609f98bbaee`  
**Architecture scope:** Logical, provider-neutral specification only

## Status

| Classification | Status |
|---|---|
| VENDOR-NEUTRAL TECHNICAL ARCHITECTURE | SPECIFICATION PHASE IN PROGRESS |
| FINAL PLATFORM / PROVIDER SELECTION | NOT READY |
| PRODUCTION IMPLEMENTATION | NOT AUTHORIZED |
| LAUNCH | NOT READY |

The final phase classification is issued in `07-architecture-decisions-and-next-gate.md`. “Provider-neutral” does not mean vague: this package fixes logical ownership, canonical contracts, state precedence, event semantics, failure behavior, adapter duties, audit requirements, and replacement boundaries while leaving products and providers unnamed.

## Purpose and authority

This package translates the governing commerce system, closed page architecture, readiness findings, and settled owner decisions into a technical specification. Authority descends in this order:

1. `docs/constitution/01-brand-philosophy.md`
2. `docs/system/01-master-design-commerce-system.md`
3. `docs/system/02-information-architecture-page-system.md`
4. `docs/system/03-data-model-catalog-schema.md`
5. `docs/system/04-page-by-page-architecture-specifications.md`
6. `docs/production-readiness/README.md`
7. `docs/production-readiness/01-launch-scope-candidate.md`
8. `docs/production-readiness/02-representative-catalog-candidates.json`
9. `docs/production-readiness/03-media-and-brand-asset-manifest.md`
10. `docs/production-readiness/04-data-gap-register.md`
11. `docs/production-readiness/05-operations-and-compliance-gates.md`
12. `docs/production-readiness/06-readiness-decision.md`
13. This package, which may specialize but never weaken those sources

## Permitted scope

- logical system context and modular boundaries;
- canonical record ownership and stable identifiers;
- write paths, read projections, state machines, events, audit and correction behavior;
- owned-inventory, cart, order, and three-mode fulfillment composition;
- proof, compatibility, fit, age and eligibility boundaries;
- replaceable provider adapters and selection criteria;
- privacy, security, observability, recovery, accessibility and exit requirements;
- architecture decisions and the gate before provider selection.

## Prohibited scope

This package does not select a platform, provider, programming language, framework, cloud, database or infrastructure. It creates no API route, schema migration, component, deployment file, environment variable, integration, catalog record, price, stock quantity, legal rule, shipping rate, return term, compatibility result, fit result or proof claim. It does not authorize implementation, purchasing or launch.

## Settled owner decisions

1. Launch intent includes THCA, Vape & Nicotine, and Glass & Accessories as one house.
2. Fulfillment modes are nationwide shipping wherever the exact context is eligible, York Pennsylvania pickup only, and York Pennsylvania local delivery only.
3. Blowin' Smoke purchases and holds owned inventory; dropshipping is not the default; no inventory has been purchased and no inventory system is selected.
4. No wholesale/distributor account, authoritative supplier catalog, launch assortment or purchase order exists.
5. Age verification is required; provider, scope, timing, failure, privacy, retention and ownership remain unresolved.
6. No payment processor is selected; merchant feasibility and underwriting remain unresolved.
7. Shipping and return policies must be original and operationally feasible; no competitor policy is adopted.
8. An owner-reported master logo may exist outside the repository but is unlocated and uninspected; this does not block logical architecture.
9. No final support channel, staffing, hours, service level, case system or escalation authority is selected.

## Unresolved gates

- supplier accounts, authenticity, authoritative catalog and cross-division pilot assortment;
- merchant underwriting and payment feasibility;
- qualified age, destination, product, proof, privacy and retention rules;
- inventory, receiving, reservation and fulfillment operating system/ownership;
- original shipping, pickup, delivery, returns, damage, warranty and support procedures;
- tax authority and calculation requirements;
- real COAs, compatibility evidence, measurements, fit tests, product media and rights;
- final providers, platform, quantitative SLOs and implementation authorization.

## Package map

| File | Responsibility |
|---|---|
| `01-system-context-and-topology.md` | Context, modular topology, paths, consistency and failure containment |
| `02-domain-boundaries-and-record-ownership.md` | Twenty bounded domains and canonical ownership |
| `03-contracts-events-and-state-machines.md` | Twenty-two contract families, thirty-three events and governing state order |
| `04-inventory-cart-order-and-fulfillment.md` | Purchase-and-hold inventory, cart/order states and three fulfillment modes |
| `05-proof-compatibility-fit-and-eligibility.md` | Separate trust and decision-service architectures |
| `06-provider-adapters-security-and-operations.md` | Seventeen replaceable adapters plus cross-cutting controls |
| `07-architecture-decisions-and-next-gate.md` | Six ADRs and the exact next gate |
| `architecture-registry.json` | Machine-readable documentation registry; not executable configuration |

## Terminology

| Term | Meaning |
|---|---|
| Canonical record | The owned source representation for one business fact class, with identity, version, provenance and effective time |
| Logical system of record | The domain with authority to accept and version writes, independent of future vendor or storage |
| Adapter | Replaceable translation and failure boundary between canonical contracts and an external capability |
| Read projection | Rebuildable, non-authoritative view optimized for storefront, search, support or operations reads |
| Composed readiness | Derived result of the exact purchase-precedence evaluation; never an independently authored field |
| Unknown | No reliable determination exists |
| Service error | A required evaluation failed to complete; it is not a negative decision |
| Correction | Authorized supersession or invalidation that preserves history and propagates to consumers |

## Current package status

The specification is intentionally provider-neutral and implementation-inactive. Supplier/pilot feasibility remains the parallel business gate; provider selection, production implementation and launch remain unauthorized.
