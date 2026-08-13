# Delivery Network Decisions and Next Gate

## Decision record format

These decisions specialize the completed vendor-neutral technical architecture. They govern BSDN logical design but do not authorize provider selection, implementation, legal conclusions, operating spend, a pilot, or launch.

## DN-ADR-01 — First-party canonical delivery network

- **Status:** Accepted.
- **Context:** Blowin' Smoke intends to operate proprietary same-day last-mile delivery through its website.
- **Decision:** BSDN owns canonical delivery, quote, dispatch, tracking projection, custody, handoff, tip, feedback, return, and recovery records. A future third-party courier can exist only behind an optional adapter/overflow boundary and cannot be a dependency for the first-party core.
- **Alternatives rejected:** Courier marketplace as system of record; provider-owned customer tracking/rates/custody; selecting a courier in DN-01.
- **Consequences:** First-party operational responsibilities, staffing, safety, economics, and support must be proven. Provider IDs remain aliases.
- **Reopen when:** Owner changes the operating model or an approved overflow use has requirements that cannot satisfy canonical BSDN contracts.

## DN-ADR-02 — Routed road distance governs service zones

- **Status:** Accepted.
- **Decision:** Provider-neutral routed road miles from the active York origin assign the zone. The initial configurable ceiling is 120 miles with Z1–Z6 as approved. Haversine may not authorize or price service.
- **Reason:** Customer/operating effort follows usable road routes, not straight-line geometry.
- **Consequences:** Geocoding/routing outage or ambiguity is `SERVICE_ERROR`/unavailable quote, not an out-of-zone or positive default. Unrounded governed distance controls boundaries.
- **Open validation:** Exact origin, routing quality/rounding, route constraints, and outage procedure.

## DN-ADR-03 — Zones, minimums, rates, and package classes are versioned policy

- **Status:** Accepted.
- **Decision:** Zone bounds/activation, M1–M6, rate components, service windows, capacity references, and package classes are effective-dated records, not code constants. Publication validates coverage, non-overlap, `M1 < … < M6`, and referenced policy completeness.
- **Consequences:** Historical quotes/deliveries preserve the original versions; changes publish successors and revalidate active commerce.
- **Open validation:** Dollar values, hours, capacity, standard-weight procedure, specialized classes, authority, and effective dates.

## DN-ADR-04 — Quotes are expiring snapshots with mandatory revalidation

- **Status:** Accepted.
- **Decision:** A quote binds exact cart, destination, route, zone, package, eligibility, minimum, capacity, and rate versions for a governed time. Material change/expiry creates a successor; checkout commits only the current acknowledged version.
- **Consequences:** No silent repricing or reuse. Quote selection does not imply payment, permanent capacity, or handoff permission.
- **Open validation:** TTL, capacity hold, quote-honoring/reprice, promise, and cutoff policy.

## DN-ADR-05 — Second delivery-age gate and server-authoritative handoff

- **Status:** Accepted subject to qualified rule definition.
- **Decision:** Same-Day Delivery has a second 21+ process. Method is separate from result; DOB entry is an assertion unless approved otherwise. The customer requests handoff, while a server evaluation returns the effective Leave at Door/direct-handoff result for the exact order.
- **Consequences:** Customer and driver surfaces share one result/version; Unknown/Service Error cannot authorize unattended handoff; raw identity data is minimized.
- **Open validation:** Legal sufficiency, accepted methods/provider, timing/expiry/retry, Leave at Door/direct rules, proof, privacy and retention.

## DN-ADR-06 — Telemetry does not equal custody or completion

- **Status:** Accepted.
- **Decision:** GPS observations, geofences, navigation, ETA, and photos are inputs/evidence. Pickup, custody transfer, arrival, handoff, proof, completion, and return require explicit guarded server transitions.
- **Consequences:** Stale/offline tracking degrades the view but does not fabricate failure/success; every custody transfer is append-only and reassignment after pickup requires a transfer/return.
- **Open validation:** Sampling/precision/stale thresholds, proof types, manual fallback, location/proof retention, and safety procedure.

## DN-ADR-07 — Tips are a separate financial lifecycle

- **Status:** Accepted.
- **Decision:** Tips have separate selection, authorization, capture, payable, payout, adjustment, and refund facts. They never satisfy merchandise minimums or silently become delivery revenue/driver pay.
- **Consequences:** Checkout/active/post-delivery entry depends on future payment/payroll policy; retries are idempotent and ledger history is append-only.
- **Open validation:** Suggested/custom values, payment capabilities, capture/change/refund window, compensation/payroll/tax, payout and customer language.

## DN-ADR-08 — Delivery feedback, driver feedback, and recovery remain distinct

- **Status:** Accepted.
- **Decision:** Overall delivery satisfaction is a 1–5 system-experience signal; optional driver feedback is separate. Versioned triggers can create a human-authorized recovery case, but no score automatically penalizes a driver or compensates a customer.
- **Consequences:** Root cause is evidence-reviewed; manager remedies use owner-domain commands; comments and driver-impact data receive restricted access.
- **Open validation:** Content, thresholds, collection window, fairness/workforce use, support roles/SLAs, refund/credit authority, and retention.

## DN-ADR-09 — Forecast and actual economics remain separate

- **Status:** Accepted.
- **Decision:** Quotes preserve forecast mileage/time/cost/contribution inputs; completed/failed/returned operations preserve actual milestones and approved allocations. Failures and return/deadhead remain in zone economics. Tips are separate.
- **Consequences:** Missing costs yield `NOT_CALCULABLE`; no fabricated margin. Formula/version lineage is required.
- **Open validation:** Rates, costs, labor/compensation, vehicle allocation, deadhead/multi-stop method, Finance definitions, and KPI targets.

## Governed decisions now fixed

- York, Pennsylvania is the initial origin concept; exact address remains open.
- Catalog items are same-day candidates, never automatically legally/operationally deliverable.
- Six initial routed-distance zones cover 0–120 miles with explicit boundaries.
- Merchandise minimums strictly increase by zone; amounts remain open and non-merchandise does not satisfy them.
- BSDN owns a configurable, versioned rate table and does not depend on a competitor runtime price.
- Standard combined delivery weight is at most 30 pounds; unknown/overweight fails the standard class safely.
- One initial driver does not create a single-driver architecture.
- The Delivery Hub, driver surface, and dispatch console project the same canonical state.
- Second age verification precedes final handoff preference; server authorization controls Leave at Door.
- Chain of custody, proof, failures, returns, feedback, tips, and corrections are explicit/auditable.

## Unresolved gates

| Gate | Authoritative output required |
|---|---|
| Origin and operations | Exact York address/location, serving inventory location, return receiving point, days/hours/cutoffs/blackouts |
| Qualified compliance | Exact product/destination/customer eligibility; delivery-age methods/sufficiency; handoff/Leave at Door/direct rules; required evidence |
| Service economics | M1–M6 amounts/basis, BSDN rates/rounding/overrides, customer fee, deadhead method, labor/vehicle/driver compensation and contribution definitions |
| Capacity and promise | Driver/vehicle staffing, shifts/breaks, simultaneous work, offer rules, quote hold/TTL, ETA/promise/cutoff and closure rules |
| Package/custody | Weight source/tolerance, packaging/class rules, pickup/transfer/proof/damage/return/receiving/inspection procedures |
| Driver/fleet | Operating relationship, authorization/training, compensation/payroll/tax, vehicle/insurance/inspection and safety rules |
| Payment/tip | Underwriting/capabilities, authorization/capture/refund/adjustment/payout/reconciliation and customer language |
| Support/recovery | Channels, staffing/hours/SLA, contact/wait/escalation, refund/credit authority and case closure |
| Privacy/security | Purpose/lawful basis/consent, precise location/age/proof/comment retention/deletion/hold/access; roles, threat model and incident ownership |
| Technology feasibility | Provider-neutral adapter candidate fit, platform constraints, offline/device needs, observability/SLO/RPO/RTO and portability tests |
| Analytics | Metric formulas/denominators, cost completeness, attribution, cohort/privacy suppression, targets and access |

An unknown legal, identity, location, payment, custody, financial, or operational rule may not be filled from competitor behavior or engineering preference.

## Final DN-01 phase decision

| Classification | Decision |
|---|---|
| PROPRIETARY DELIVERY-NETWORK LOGICAL ARCHITECTURE | **COMPLETE** |
| FIRST-PARTY BSDN AS CANONICAL MODEL | **APPROVED DIRECTION** |
| ZONE / DISTANCE / PACKAGE-CLASS DIRECTION | **APPROVED; ACTIVATION INPUTS OPEN** |
| SERVICE ECONOMICS AND OPERATING POLICY | **NOT RESOLVED** |
| QUALIFIED DELIVERY COMPLIANCE / PRIVACY POLICY | **NOT RESOLVED** |
| PROVIDER / PLATFORM / FRAMEWORK SELECTION | **NOT AUTHORIZED** |
| PRODUCTION IMPLEMENTATION | **NOT AUTHORIZED** |
| PILOT / LAUNCH | **NOT READY** |

## Exact next gate

# BSDN Business, Compliance, Operations, and Pilot Feasibility Intake

This is a cross-functional evidence-and-owner-decision gate, not more competitor research and not production implementation.

It must deliver:

1. the authoritative York origin/return location and owned-inventory operating relationship;
2. qualified product/destination/delivery-age/handoff/Leave at Door/proof/privacy rules for representative THCA, Vape & Nicotine, Glass & Accessories, and mixed orders;
3. approved M1–M6, rate inputs, standard-package verification, driver/labor/vehicle/deadhead economics, and formula ownership using real operating evidence;
4. service hours, staffing, vehicle/safety/insurance, capacity, promises, cutoffs, contact/wait, failure, damage, return, and receiving procedures;
5. payment/merchant and tip/compensation/payroll feasibility without selecting a provider by assumption;
6. support/recovery roles, channels, authority, and original refund/credit decisions;
7. privacy/security/retention/access/incident requirements for age, location, proof, instructions, feedback, and workforce data;
8. a representative pilot scenario matrix and acceptance evidence spanning zone boundaries, under/over minimum, ≤30/overweight/unknown, age results, both handoffs, no-driver/offline/stale GPS, damage/unavailable customer, return, tip, feedback, and recovery;
9. approved quantitative acceptance criteria for a later provider/platform feasibility evaluation.

### Gate exit criteria

The intake closes only when every launch-material item above has a named authoritative owner, decision/evidence reference, effective scope/date, and explicit `APPROVED`, `REJECTED`, or `DEFERRED WITH SAFE CONSEQUENCE` outcome. “TBD” may remain only where the architecture blocks affected behavior safely and the pilot excludes it explicitly.

After this gate, a separate authorization may permit provider/platform evaluation against the canonical contracts. Provider selection will not itself authorize implementation. Implementation will not authorize pilot or launch.
