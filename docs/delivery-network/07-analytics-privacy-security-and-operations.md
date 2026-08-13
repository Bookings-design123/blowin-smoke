# Analytics, Privacy, Security, and Operations

## Measurement principles

BSDN analytics derives from versioned canonical milestones and ledgers. It never becomes delivery, financial, eligibility, custody, or driver-performance truth. Definitions carry a metric version, time zone, inclusion/exclusion rules, source fields, correction behavior, and data-quality status. Missing data is `UNKNOWN`/`NOT_CALCULABLE`, never zero.

No KPI target, SLA, sample threshold, attribution window, profitability formula, retention period, or performance standard is invented in DN-01.

## Required analytic questions and measures

| Measure family | Definition contract |
|---|---|
| Delivery count | Count unique `deliveryId` by explicit lifecycle/outcome; do not report attempts as deliveries without label |
| Delivery revenue / average fee | Captured/recognized customer delivery fee under approved accounting; gross, adjusted, refunded, and net kept distinct |
| Average merchandise subtotal | Governed qualifying or ordered merchandise basis named by metric version; non-merchandise excluded |
| Tips | Selected, authorized, captured, payable, paid, adjusted, and refunded reported separately; never delivery revenue by default |
| Delivery miles | Quoted route, actual attributable outbound, expected/actual deadhead/return, and total vehicle miles kept distinct |
| On-time rate | Requires approved promise/ETA basis, tolerance, terminal population, and clock; remains not calculable until defined |
| Quoted versus actual ETA | Preserve issued quote estimate/range/version and actual completion milestone; do not overwrite forecast with latest ETA |
| Preparation time | Governed interval between paid/accepted and ready milestones; exact start rule versioned |
| Dispatch delay | Governed interval between ready and accepted assignment/pickup progression; exact end rule versioned |
| Travel time | Pickup/en-route to arrival/handoff interval under named definition; excludes/labels return separately |
| Overall satisfaction | Delivery Feedback 1–5 distribution/average with sample and question version |
| Driver satisfaction | Separate Driver Feedback measure; never inferred from overall score |
| Issues | Feedback/exception/recovery frequency and category, with multiple-category and denominator rules |
| Zone/distance performance | Volume, time, outcome, fees, cost completeness, satisfaction, and contribution by effective zone/distance band |
| Repeat delivery usage | Same governed customer/pseudonymous subject with later BSDN order inside approved window |
| Customer retention after delivery | Approved cohort/attribution definition and lawful purpose required; association is not causation |
| Delivery contribution/margin | Only when approved delivery revenue/cost allocations are complete; failures/returns included |

Required dimensions include zone and version, unrounded governed distance/distance band, driver/assignment segment, day, local time/time zone, fulfillment state/outcome, handoff method, order-size band, package class/weight band, product division (`THCA`, `VAPE_NICOTINE`, `GLASS_ACCESSORIES`, or mixed), issue category, rate version, and service-window/capacity state. Sensitive small cohorts require suppression/aggregation policy.

### Financial/economic facts

Keep quote-time forecast and completion-time actual separately:

- routed outbound miles/duration;
- expected and actual attributable return/deadhead;
- separately labeled approved reposition/multi-stop allocations if ever used;
- total attributable vehicle miles;
- driver active/labor duration and approved cost;
- vehicle variable/fixed allocation and source version;
- customer delivery revenue and adjustments;
- merchandise gross margin under Finance's authoritative basis;
- tip states/amounts outside contribution;
- delivery and combined order contribution under named formula versions.

Failed, canceled after operational work, and returned deliveries retain their miles, labor, vehicle cost, and operational outcome. A profitable-zone result cannot be published if material cost inputs are absent.

## Event and projection model

Business events include quote offered/selected/invalidated; delivery paid/ready/unassigned/assigned/pickup/en-route/approaching/arrived/completed/failed/canceled; assignment offered/accepted/declined/reassigned; custody transferred; tracking currentness changed; ETA updated; age result recorded; handoff evaluated/changed; instruction acknowledged; tip state changed; proof recorded; feedback submitted; recovery opened/resolved; return required/started/received; and correction published.

Each event contains stable event/type version, producer, aggregate ID/version, occurred/effective time, correlation/causation, actor/authority class, sensitivity, and minimized payload/reference. Delivery is at least once; consumers deduplicate and respect per-aggregate ordering. Replay rebuilds projections and aggregates but never repeats payment, payout, notification, or other external side effects without explicit idempotency.

High-volume raw location observations are not broadcast as general business events. Tracking publishes minimized currentness/current-location projection changes or references. General analytics uses derived distance/time facts, not unrestricted coordinate streams.

Corrections invalidate/recompute affected facts while preserving prior reported version and lineage. Dashboards expose data freshness/completeness and metric version.

## Privacy and data minimization

### Purpose boundaries

| Data | Permitted architectural purpose | Default constraint |
|---|---|---|
| Delivery address/instructions | Quote, route, handoff, support | Exact details limited to active authorized roles; free text treated sensitive |
| Driver live location | Active assignment, customer tracking, safety/dispatch | No silent off-duty collection; customer gets reduced projection only |
| Raw location history | Operational evidence, approved incident analysis | Restricted, short approved retention; excluded from general analytics |
| Age-verification data | Delivery-specific 21+ decision | Store result/method/reference; raw ID/DOB/document minimized by default |
| Proof of delivery | Handoff/custody evidence and disputes | Controlled object access; no raw media in logs/events |
| Customer/driver contact | Active service and approved support | Minimized/masked channel; no unnecessary reciprocal details |
| Tip/payment refs | Tip accounting and reconciliation | No prohibited payment credentials in BSDN records/logs |
| Feedback/comments | Experience improvement and requested recovery | Comments restricted; contact request explicit; no automatic workforce action |
| Audit/access logs | Security, correction, accountability | Tamper-evident, role-restricted, governed retention/hold |

Exact retention, deletion/anonymization, legal/operational hold, customer/driver access rights, purpose/lawful basis, consent, and cross-system propagation are **OPEN qualified-policy gates**. Every adapter/store must support scoped export, deletion where authorized, hold, and confirmation. Deletion cannot destroy evidence subject to a valid hold, but a hold must be explicit and authorized.

## Trust contexts and authorization

Customer, driver, dispatcher, origin staff, support/recovery manager, finance/payroll, policy administrator, security/auditor, and service identities are distinct trust contexts. Roles grant the minimum action and record scope:

- customers access only their authorized delivery and governed commands;
- drivers access only current offers/assignments and minimum customer/package context, ending after closeout;
- dispatch manages assignments/exceptions but cannot alter payment, age results, handoff rules, proof, tips, or inventory;
- origin staff verify package release/return receipt, not customer payment or delivery eligibility;
- support sees only case-required context and invokes authorized owner-domain remedies;
- finance/payroll handles tip/fee/payable facts without raw route/proof/identity data;
- policy administrators publish versioned zones/rates/rules through dual or explicit authority where approved;
- auditors receive read-only, logged access; no audit mutation.

High-risk commands require authenticated actor/service, role and object-scope authorization, current aggregate version, idempotency key, reason/authority, and complete audit. Sensitive reads are access-audited.

## Security requirements

- Secure transport and appropriate at-rest encryption for canonical stores, location evidence, proof, age references, backups, and exports; exact key custody/rotation awaits platform selection.
- Secrets remain in isolated adapter/environment boundaries, never source, client configuration, URLs, logs, events, proof metadata, or canonical business fields.
- Customer tracking grants are opaque, high entropy, purpose/delivery scoped, expiring/revocable, anti-enumeration protected, and excluded from logs/referrers/analytics.
- Driver sessions bind approved account/device/session context, support revocation and reauthentication, and do not trust client time/state as authority.
- External callbacks/adapter responses are authenticated, replay-protected, correlated to known attempts, schema/version validated, and idempotent.
- Optimistic concurrency and server-side state guards prevent stale/client-forged transitions.
- Logs redact coordinates, addresses, contact data, instructions, raw documents/proof, payment data, tracking tokens, and secrets.
- Rate limiting, abuse detection, anomaly review, and alerting protect public quote/tracking and staff/driver actions; exact thresholds are **OPEN**.
- Location spoof/plausibility signals open review/exception; they do not automatically accuse a driver, authorize completion, or alter pay.
- Backups/exports preserve encryption, access scope, audit lineage, and deletion/hold obligations.
- Accessibility and reduced-motion obligations apply to Delivery Hub, driver, dispatch, and support surfaces; no safety/status meaning depends only on color, animation, or sound.

Threat modeling before implementation must cover tracking-link leakage/enumeration, account/device takeover, location spoofing/replay, proof tampering, state-transition forgery, duplicate payment/tip/payout, dispatcher privilege misuse, sensitive logs/exports, adapter callback forgery, address/instruction abuse, and denial of route/tracking/verification capability.

## Provider-neutral capability boundaries

| Boundary | Canonical role and failure behavior | Selection status |
|---|---|---|
| Geocoding | Normalize/locate destination with quality/ambiguity; error cannot authorize | NOT SELECTED |
| Routing/distance/ETA | Routed road miles, route and estimate evidence; no Haversine success fallback | NOT SELECTED |
| Driver navigation | Presents authorized endpoints; cannot mutate delivery state | NOT SELECTED |
| Age verification | Minimal method/result/reference; service error remains error | NOT SELECTED |
| Payment/tip processing | Attempts/outcomes/reconciliation; no blind retry or provider-owned Tip truth | NOT SELECTED |
| Identity/authentication | Customer/driver/staff subjects and sessions; canonical IDs remain Blowin' Smoke-owned | NOT SELECTED |
| Notifications/minimized contact | Operational messages/contact relay with consent/purpose and deduplication; state never depends on message delivery | NOT SELECTED |
| Proof/media storage | Immutable object/version/integrity/access reference; no provider ID as canonical proof | NOT SELECTED |
| Analytics/observability | Minimized events/metrics/traces and alerts; outage does not block commerce | NOT SELECTED |
| Optional overflow courier | Future translation of a specifically authorized assignment; no authority over BSDN rate, delivery, custody, eligibility, or customer experience | FUTURE OPTIONAL; NOT SELECTED; NOT A BSDN DEPENDENCY |

All adapters require versioned mappings, bounded timeout, categorized errors, retry/idempotency rules, redacted audit, health/lag, export, contract tests, replacement procedure, and an outage/reconciliation path.

## Operational controls

| Area | Required architecture behavior | OPEN input |
|---|---|---|
| Service policy | Effective-dated origin/zones/minimums/rates/classes/windows with validation and rollback successor | Exact address, values, hours, authority |
| Capacity/dispatch | Durable queues, current workload, driver/vehicle/package constraints, manual escalation | Staffing, shifts, offer/capacity rules |
| Monitoring | Quote/routing/verification/payment errors; event lag; tracking freshness; assignment queue; proof/return/recovery exceptions | Quantitative thresholds and ownership rota |
| Incident response | Contain by capability, preserve custody/evidence, communicate honest state, reconcile uncertain side effects | Runbooks, contacts, severity/SLA |
| Offline continuity | Driver queued evidence with idempotent reconcile; dispatcher durable state; no fabricated success | Device/network operating procedure |
| Reconciliation | Payment/tip, assignment, custody, tracking-session, proof, return, event/projection and analytics checks | Frequency/owners/tolerance |
| Backup/recovery | Restorable canonical records, ledgers, proof refs and policy versions with consistency verification | RPO/RTO and selected platform |
| Change management | Contract/version compatibility, migration/rollback, policy preview/approval, audit | Environments, approval roles, cadence |
| Support/recovery | Linked cases, minimum evidence, authorized actions, no automatic compensation | Staffing, hours, channels, SLAs, remedies |
| Driver/fleet safety | Availability/vehicle state and stop/escalation capability | Workforce, vehicle, insurance, safety policies |

Production SLOs for quote latency, tracking freshness, ETA availability, dispatch response, location ingest, recovery, uptime, event lag, RPO/RTO, and customer support remain **OPEN** until real operating, platform, and risk evidence exists.

## Launch-blocking operational evidence

Before implementation/launch authorization, qualified owners must establish the exact origin, service hours, driver/fleet and safety model, authoritative product/destination/age/handoff rules, rate/minimum/cost policy, capacity and promise method, package verification, proof requirements, failure/contact/wait/return procedures, tip/payment/payroll treatment, support/recovery authority, privacy/retention/deletion/hold rules, security roles, and incident/reconciliation ownership.
