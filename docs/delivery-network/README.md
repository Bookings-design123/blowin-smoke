# Blowin' Smoke Delivery Network — Architecture Specification

**Package version:** 1.0

**Working name:** Blowin' Smoke Delivery Network (`BSDN`)

**Source commit:** `dac0a51edf23cc034825ee5572be849aa82794f4`

**Scope:** Proprietary, first-party same-day delivery architecture; documentation only

## Current phase status

| Classification | Status |
|---|---|
| BSDN PROPRIETARY DELIVERY ARCHITECTURE | **SPECIFIED** |
| SERVICE-ZONE DIRECTION | **OWNER-APPROVED; VALUES PARTLY OPEN** |
| FINAL RATES, MINIMUMS, HOURS, CAPACITY, AND COSTS | **OPEN** |
| LEGAL / COMPLIANCE RULES | **NOT ESTABLISHED HERE** |
| EXTERNAL PROVIDER SELECTION | **NOT AUTHORIZED** |
| PRODUCTION IMPLEMENTATION | **NOT AUTHORIZED** |
| PILOT / LAUNCH | **NOT READY** |

The final decision and exact next gate are in `08-delivery-network-decisions-and-next-gate.md`.

## Purpose

This package defines the logical architecture for a proprietary same-day delivery capability operated through Blowin' Smoke. It covers serviceability, quotes, checkout, a second delivery-specific age step, dispatch, driver operations, live tracking, handoff, tips, custody, failures, returns, feedback, recovery, analytics, privacy, and operational control.

BSDN is a Blowin' Smoke capability. A future third-party courier may be attached through an optional adapter for overflow or another approved use, but no courier network owns BSDN's customer promise, rate policy, delivery record, state, custody history, or operating data. The first-party path must function without an external courier marketplace.

## Authority and relationship to the parent architecture

Authority descends in this order:

1. `docs/constitution/01-brand-philosophy.md`;
2. the governing system, information-architecture, data-model, and page-architecture specifications under `docs/system/`;
3. the production-readiness package under `docs/production-readiness/`;
4. the completed vendor-neutral architecture under `docs/technical-architecture/`;
5. the settled DN-01 owner decisions;
6. this subordinate package.

This package specializes the parent architecture's `Local Delivery` fulfillment contract and `York delivery operations` adapter boundary. It does not reopen that completed architecture. It reuses canonical Order, Order Line, Fulfillment Selection, Inventory Reservation, Payment Attempt, Eligibility Evaluation, Consent Record, Customer Identity, Support Context, and Audit/Correction responsibilities. It adds delivery-network records only where same-day operations require their own durable truth.

The parent architecture's invariants still govern: stable Blowin' Smoke IDs; explicit ownership; versioned contracts; idempotent commands; transactional outbox propagation; rebuildable projections; provider-neutral adapters; Unknown distinct from Service Error; no positive default for unresolved material eligibility; and immutable audit of high-risk changes.

## Settled owner decisions

1. Initial origin is York, Pennsylvania; the exact store address remains an authoritative operational input if absent.
2. Every legitimately sellable catalog item is a same-day candidate by default, not automatically deliverable. Exact transaction eligibility controls the result.
3. The initial configurable ceiling is 120 routed road miles from the active origin.
4. Initial zones are Z1 `0–20`, Z2 `>20–40`, Z3 `>40–60`, Z4 `>60–80`, Z5 `>80–100`, and Z6 `>100–120` routed miles.
5. Merchandise minimums are progressive: `M1 < M2 < M3 < M4 < M5 < M6`; dollar values remain open. Non-merchandise amounts do not satisfy them.
6. BSDN owns versioned rates. The commercial objective is competitiveness with comparable package-delivery pricing, without copying another company or calling one at runtime for the BSDN price.
7. The initial standard package class has a maximum combined declared weight of 30 pounds. Heavier/specialized classes require future policy.
8. Economics must expose outbound, expected return/deadhead, total vehicle miles, labor, vehicle cost, delivery revenue, merchandise gross margin, tip, contribution, and zone profitability without invented assumptions.
9. Same-Day Delivery requires a second, delivery-specific 21+ age process. Verification method and result are separate; raw identity data is minimized.
10. Customers request `HAND_TO_ME` or `LEAVE_AT_DOOR`; server-side authorization decides the effective handoff requirement for the exact order.
11. Authorized Leave at Door records governed location, instructions, arrival, proof, and completion without invented waiver language.
12. The branded Delivery Hub is the first-party customer surface for state, live position, ETA, age status, handoff, instructions, tips, completion, and recovery.
13. A secure mobile driver surface supports availability through completion and return; no implementation framework is selected.
14. Dispatch supports one initial driver but has no single-driver invariant.
15. Tips remain financially separate from merchandise, fee, tax, credits, and discounts and never satisfy the merchandise minimum.
16. Overall delivery satisfaction and driver feedback are distinct signals.
17. Low satisfaction or a serious issue may create a governed recovery case; no compensation is automatic.
18. Custody, exceptions, returns, corrections, and access are auditable.

## Scope

- first-party service zones, rates, minimums, package classes, capacity, and quotes;
- exact transaction-level delivery eligibility and checkout composition;
- second age verification and server-authoritative handoff;
- dispatch, assignment, driver availability, driver workflow, and multi-driver readiness;
- replaceable geocoding, routing, navigation, verification, payment, messaging, and telemetry boundaries;
- live location, ETA, customer tracking, privacy, and tracking access;
- tips, driver-payable accounting inputs, feedback, recovery, and root-cause context;
- chain of custody, proof of delivery, exceptions, failures, and return to store;
- operational and financial analytics with no fabricated targets;
- state machines, events, audit, security, retention gates, and next-gate decisions.

## Exclusions

This package does not select a courier, map, routing, payment, age-verification, messaging, mobile, web, database, cloud, payroll, or analytics provider. It does not create application code, APIs, schemas, UI designs, legal rules, waiver language, prices, minimum dollar amounts, suggested tip values, cost assumptions, service hours, staffing commitments, refund rules, automatic credits, retention durations, exact store address, or launch authorization. It does not conduct or encode competitor research.

## Package map

| File | Responsibility |
|---|---|
| `01-service-model-zones-and-economics.md` | Origin, zones, minimums, package class, rates, capacity, and unit economics |
| `02-delivery-domain-and-record-model.md` | Twenty-four canonical delivery-network records and ownership |
| `03-quote-checkout-age-and-handoff.md` | Quote-to-payment flow, second age gate, handoff, instructions, and revalidation |
| `04-dispatch-driver-and-live-tracking.md` | Dispatch, driver app, assignment, live location, ETA, tracking, and reconnect |
| `05-tipping-feedback-and-service-recovery.md` | Tip lifecycle/accounting, satisfaction, driver feedback, and recovery cases |
| `06-chain-of-custody-failures-and-returns.md` | Custody ledger, proof, exceptions, failed handoff, and return-to-store |
| `07-analytics-privacy-security-and-operations.md` | Metrics, privacy, security, access, observability, incidents, and operations |
| `08-delivery-network-decisions-and-next-gate.md` | Decisions, unresolved inputs, phase status, and exact next gate |
| `delivery-network-registry.json` | Machine-readable documentation registry; not executable configuration |

## Terminology

| Term | Meaning |
|---|---|
| Same-day candidate | A legitimately sellable item that may be evaluated for BSDN; not a delivery approval |
| Transaction eligibility | Versioned result for exact product, destination, customer/age context, handoff, package, and policy inputs |
| Routed distance | Road-route mileage returned by the approved routing boundary; authoritative for zone assignment |
| Zone | Versioned service-policy band with distance bounds, activation, merchandise minimum reference, and rate inputs |
| Merchandise subtotal | Governed qualifying product amount; excludes tips, tax, delivery fee, credits, discounts, and other non-merchandise amounts unless future policy changes |
| Quote | Expiring, versioned offer derived from exact address/route/zone/cart/package/capacity/rate inputs |
| Delivery | Canonical operational aggregate linked one-to-one to the governed same-day fulfillment selection |
| Effective handoff | Server-authoritative outcome after customer preference, age result, product/destination rules, and exceptions are evaluated |
| Delivery Hub | Token-protected first-party customer view of the delivery and permitted actions |
| Custody event | Append-only evidence of package control, movement, handoff, exception, return, or correction |
| Unknown | Required truth has not been verified; never silently positive |
| Service Error | Required evaluation or capability did not complete; distinct from a negative business result |

## Governing formula

```text
WEBSITE PRODUCT
  → SAME-DAY CANDIDATE
  → EXACT TRANSACTION ELIGIBILITY
  → QUOTE + CAPACITY + SECOND AGE GATE + HANDOFF AUTHORIZATION
  → DELIVERY RESULT
```

All customer and operational projections derive from the same canonical records and state versions. No surface may manufacture a more permissive result.
