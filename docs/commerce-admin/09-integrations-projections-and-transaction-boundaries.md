# Integrations, Projections, and Transaction Boundaries

## Governing topology

This document defines vendor-neutral administrative application boundaries. It does not select a framework, database, cloud, search service, media platform, identity provider, payment provider, supplier integration, inventory system, or accounting system, and it does not authorize implementation.

    OWNER / AUTHORIZED STAFF
               |
      BLOWIN' SMOKE ADMIN
        /              \
    WEB ADMIN     AUTHORIZED ADMIN APP
               |
      CANONICAL COMMERCE API
               |
      CANONICAL DOMAIN MODULES
               |
      OUTBOX + READ PROJECTIONS + ADAPTERS
               |
      CUSTOMER AND OPERATIONS SURFACES

The Admin surfaces are governed command/query clients. They do not contain an independent product, price, inventory, media, evidence, supplier, wholesale, order, or delivery database. Retail, Private Wholesale, Shipping, York Pickup, and BSDN Same-Day consume one canonical operational source of truth through domain-owned contracts.

GitHub owns source code, architecture, schemas, migrations, releases, and documentation. GitHub is not a live operational datastore. Routine product, inventory, price, media, evidence, channel, supplier, or receiving changes must require neither GitHub nor Codex nor a deployment.

## Command/query boundary

Commands express an authorized intent to change canonical state. Queries return canonical records or labeled projections without gaining write authority. Every command must carry, as applicable:

- authenticated admin actor and effective capability;
- stable Blowin' Smoke target ID;
- expected record or ledger version;
- command/idempotency key;
- reason and approval context for material actions;
- source/provenance and observed/effective time;
- correlation/causation and session/request context.

Commands are handled only by the owning domain. A client or adapter cannot assert success, skip a state transition, set a derived readiness boolean, or directly change another domain's tables. A query never becomes authorization merely because it was recently refreshed.

| Boundary | Representative commands | Representative queries | Non-negotiable invariant |
|---|---|---|---|
| Catalog | create/edit/archive/restore product; create/edit/activate/deactivate variant or SKU; publish/unpublish | products, variants, SKUs, drafts, publication history, provenance | Supplier data and copy never self-approve product truth; consequential updates use expected versions. |
| Inventory | receive, reserve, release, commit, fulfill, correct, quarantine, unquarantine, damage, loss/shrink, stocktake, reallocate, transfer | canonical stock position/history, reservations, quarantine, lots, location availability | Every quantity mutation creates a ledger event; physical stock is shared, not duplicated by channel. |
| Pricing | publish retail, wholesale reference, promotion, or successor price; create negotiated quote | current/effective/history by variant, channel, customer quote | Exact money only; one customer's negotiated price cannot rewrite the wholesale reference price. |
| Media | register upload, validate, assign role, reorder, replace, archive, publish/protect derivative | asset, derivative, rights, processing and assignment status | Object storage holds binaries; canonical metadata/assignment governs use; replacement does not rewrite history. |
| Evidence | register document, attach scope, submit for review, verify, mark stale/conflicting/unmatched, replace | document, applicability, provenance, currentness | Upload is not verification; applicability is exact to product/variant/lot or batch. |
| Supplier / Receiving | manage supplier reference, PO, expected receipt, receiving session/line, discrepancy, quarantine, transfer | purchasing, expected/actual receipt, discrepancies, location and stock history | PO/expected receipt never creates on-hand; finalized receipt creates ledger truth. |
| Channels / Wholesale | set visibility, eligibility, allocation, reference price/profile/media/evidence links; create negotiated quote | retail/wholesale offer and qualification status | Retail publication never exposes private wholesale fields; offer/allocation never duplicates physical stock. |
| Order / Fulfillment | submit/reconcile order, select mode, request allocation, perform authorized operational transition | order snapshots, allocations, attempts, fulfillment state | Order owns purchase truth; Payment money outcome; Inventory allocation; Fulfillment cannot mark paid. |
| Administration | grant/revoke capabilities, approve high-risk command, initiate export, publish correction | audit, actor, permission, job and projection health | No universal admin; least privilege and immutable/tamper-evident audit apply. |

Administrative query services must support retrieval by product, SKU, variant, strain, lot/batch, category, division, availability, stock state, channel, price state, evidence state, publication state, and fulfillment eligibility. Search and filters are projections; an operator choosing a result still submits a version-checked canonical command.

Bulk actions are command batches, not direct database updates. A batch must be previewable, independently validate each record, report partial rejection explicitly, preserve per-record audit, and be safely repeatable where practical. Atomicity is defined at the governed batch or record boundary before execution; there is no silent best-effort mutation.

## Canonical write sequence

The default write sequence is:

1. Authenticate the actor and resolve current capabilities and any step-up/approval requirement.
2. Validate command shape, source, target identity, expected version, idempotency key, and domain invariants.
3. Lock or compare the minimum canonical records required for the command.
4. Atomically write the canonical successor or ledger entry, immutable audit context, idempotency outcome, and transactional-outbox event when they share a consistency boundary.
5. Commit once or fail without a partial canonical result.
6. Publish the outbox record at least once.
7. Consumers process idempotently, preserve required per-aggregate ordering, and update rebuildable projections.
8. Decision paths re-read canonical state when a stale projection could authorize an invalid purchase, reservation, fulfillment, publication, or sensitive disclosure.

External side effects are not replayed merely because an event is replayed. Provider calls require their own attempt identity, deduplication, outcome reconciliation, timeout handling, and explicit compensation.

## Atomic inventory boundaries

The exact ledger mathematics are governed by the canonical inventory model. The following boundaries are mandatory regardless of storage technology:

| Command | Atomic canonical work | Conflict/failure result | Compensation boundary |
|---|---|---|---|
| RESERVE | Verify exact SKU/variant, lot/location where material, eligibility-to-allocate, available-to-promise, expected position version and quantity; create reservation; record reserve ledger effect; update position version; store idempotency outcome, audit and outbox | No negative availability. Competing request receives current changed/unavailable state and preserves cart context. | Later RELEASE or EXPIRE is a new idempotent command; never delete reservation history. |
| COMMIT | Verify active reservation, order/line identity, exact quantity and state; transition reservation/position from held to committed; record order reference, audit and outbox | Unknown/stale reservation or version conflict cannot become committed. Duplicate command returns original outcome. | Authorized cancellation or failure invokes a separate release/reversal transition under current policy. |
| RELEASE | Verify a live `RESERVED` state and authority; move only that exact reserved quantity back to governed free capacity; record release ledger effect; update position and reservation; audit and outbox | A `COMMITTED` quantity is not releasable through this command and must follow `CANCEL` plus its approved reversal/compensation policy. Already released/expired returns its recorded idempotent outcome; every other state conflict is explicit. | If an erroneous release was committed, restore only through an authorized compensating entry, never history editing. |
| FULFILL | Verify accepted order, committed exact line/location/lot quantity and fulfillment authority; record fulfillment ledger effect and immutable fulfillment reference; update position; audit and outbox | Cannot fulfill uncommitted, wrong-location, wrong-lot, or insufficient quantity. | Return, void, or reversal follows separately approved states; return-to-store never auto-restocks. |
| CANCEL | Order records its authorized cancellation transition; Inventory receives an idempotent compensation command referencing the exact reservation/commitment and current state | Cancellation policy, custody, capture, and fulfillment state may block or route recovery. No automatic inventory or financial outcome is inferred. | Inventory release/reversal and payment refund are separate owner-domain transitions coordinated by order orchestration. |
| ADJUST | Validate actor capability, reason, approval when required, exact quantity dimension, position version and resulting invariant; append correction ledger entry; update position; audit and outbox | No silent last-write-wins, negative quantity, unit mismatch, or unexplained overwrite. | Correct a bad adjustment with a linked compensating entry and retained prior event. |

RECEIVE follows the same standard: finalized receiving line, accepted exact quantity, lot/location references, receipt ledger entry, position version, audit, idempotency result, and outbox are atomic. QUARANTINE and UNQUARANTINE atomically move only the exact governed quantity between availability categories without changing physical-on-hand truth. CHANNEL_REALLOCATION changes bounded allocation against shared stock and cannot manufacture inventory. A TRANSFER records custody and source/destination ledger effects under the explicit transfer state model; cross-boundary execution uses idempotent steps and compensation rather than a distributed last-write-wins update.

Inventory position and reservation mutations are atomic within Inventory. Order creation, immutable line snapshots, audit, idempotency, and outbox are atomic within Order. Payment attempt/outcome is atomic within Payment. Fulfillment selection and allocation request are coordinated through explicit success/failure outcomes, not a distributed transaction.

## Concurrency behavior

| Concurrent scenario | Required behavior |
|---|---|
| Two customers request the final quantity | Both may see a projection, but only one version-checked atomic reservation can consume the final available quantity. The other receives current changed/unavailable state. |
| Wholesale reservation competes with retail purchase | Current channel policy/allocation and the same physical position are evaluated inside the reservation boundary. No channel database can oversell shared stock. |
| Two staff edit one product or price | Optimistic version conflict returns current record and a field-level recovery path; consequential changes never use silent last-write-wins. |
| Owner changes stock during checkout | Cart/read projection becomes advisory; reservation/submit revalidates canonical inventory and returns an explicit line-level change. |
| Price changes during an active cart | Price event invalidates cart price input; old/new references remain; owner-defined acknowledgment policy is still open. Checkout cannot silently commit a stale price. |
| Receiving occurs while reservations exist | Receipt appends new ledger truth against the current position version. It does not rewrite reservations; downstream availability derives from the new canonical position. |
| Media is replaced during a customer session | Assignment creates a successor and invalidation event. Existing projections may show a labeled fallback; no similar asset is silently substituted and media changes do not change product identity. |

## Transactional outbox and event discipline

Canonical write, record version or ledger effect, audit context, idempotency outcome, and outbox event must commit together where they share a transactional boundary. Delivery is at least once, so every consumer requires an idempotency record. Event envelopes include stable event ID, type/schema version, producer, aggregate ID/version, occurred/effective time, correlation/causation, actor/authority class, provenance, payload categories, and sensitivity.

Per-aggregate ordering is required for product, variant, price, position, reservation, proof applicability, relationship, cart, order, shipment/pickup/delivery, supplier/PO/receipt, and media-assignment streams where reordering could misstate current truth. Event schema evolution, dead-letter handling, retry, lag monitoring, replay, and correction propagation are mandatory operational capabilities; exact technology and SLOs remain open.

Existing commerce events remain governing, including Catalog Record Approved, Variant Changed, Price Changed, Inventory Received/Reserved/Released/Corrected/Quarantined/Restocked, Media Assigned/Invalidated, Proof Linked/Became Stale/Unmatched, Cart Revalidated/Line Blocked, Order Submitted, payment outcomes, Fulfillment Method Selected, shipment/pickup/local-delivery events, and Correction Published.

Supplier and receiving implementation may add versioned event contracts for supplier mapping, purchase-order state, expected receipt, receiving-session result, discrepancy, and transfer. Those contracts must follow the same envelope and cannot grant downstream authority. A purchase-order event never substitutes for Inventory Received.

Corrections publish target, prior/new version, authority, reason, effective time, and affected capabilities. Consumers idempotently invalidate or rebuild retail/wholesale/search/admin/cart/BSDN/support projections. Active carts and nonfinal orders revalidate. Historical orders retain labeled snapshots; reorder uses current truth.

## Projection register

Every projection records source aggregate IDs/versions, projection time, consumer/schema version, and material staleness/error state. It is rebuildable and cannot be corrected independently.

| Projection | Canonical sources | Operational purpose | Stale/error rule |
|---|---|---|---|
| Retail Catalog | approved product/variant, retail offer/price, public media/evidence, channel and fulfillment eligibility | Retail browse, PDP and merchandising | Suppress invalidated decision claims; retail publication cannot expose wholesale-only fields. |
| Wholesale Catalog | wholesale-visible offer, reference price, allocation, protected-media/evidence/profile and qualification refs | Authorized private inventory menu | Access and protected-client gates remain mandatory. Stale/failed projection cannot expose protected data or claim availability. |
| Search | approved identities/taxonomy, channel visibility, safe card facts | Retrieval and admin/customer discovery | Search is never catalog or inventory truth; no result authorizes publish, price, stock, or checkout. |
| Admin Inventory | position, lot/location, reservation, commitment, quarantine, damage, safety reserve and allocation events | Operational stock view and work queues | Display source version, lag, and failure. Adjustment/reservation actions re-read the canonical position. |
| Admin Product Detail | product/variant/SKU, offers/prices, media/evidence, stock/location, supplier mappings and audit summaries | Governed cross-domain operational context | Sections remain domain-owned; query composition does not permit cross-domain mutation. |
| Cart Availability | exact line, selection, canonical availability/reservation and current decision references | Explain current cart line state | Advisory until canonical reserve/submit. Stale data cannot authorize oversell. |
| BSDN Availability | exact order/line quantity, committed location stock, same-day eligibility and policy refs | Delivery Hub, driver/dispatch/support readiness views | BSDN cannot own or mutate stock. Missing/stale commitment or eligibility blocks progression, not defaults positive. |
| Low-Stock Dashboard | canonical position and approved configurable signal policy | Internal prioritization | LOW_STOCK is an internal signal, not customer claim; no threshold is invented here. |
| Evidence Status | evidence document/applicability/currentness and affected product/variant/lot | Review queues and claim suppression | Missing, not supplied, unmatched, conflicting, pending, stale and service error remain distinct. |

Operational signals such as LOW_STOCK, OUT_OF_STOCK, RESERVATION_AGING, EVIDENCE_STALE, EVIDENCE_MISSING, MEDIA_MISSING, PRICE_MISSING, UNPUBLISHED, QUARANTINED, FAILED_PROJECTION, and FULFILLMENT_BLOCKER are derived internal signals. Thresholds and escalation routes require owner policy; they are not customer-facing facts.

Projection health must expose last successful event/source version, lag, retry/dead-letter state, rebuild status, and impacted capabilities. A decision-critical known stale value is suppressed or labeled and cannot silently authorize progression. Search or analytics failure does not mutate canonical records. Event-consumer failure does not roll back a committed write; it is retried and audited.

## BSDN, shipping, pickup, and order integration

Order owns purchase truth and immutable line snapshots. Payment owns money outcome. Inventory owns reservation, allocation, commitment, fulfillment deductions, quarantine, and location stock. Eligibility owns legal/product/destination decisions. Fulfillment owns mode selection and operational handoff. BSDN owns delivery execution records, not inventory.

BSDN consumes the exact order, item, quantity, fulfillment-eligibility result, committed inventory/location reference, and applicable policy versions. Its Delivery Hub, driver surface, and dispatch console project the same canonical delivery state. BSDN cannot turn GPS, an ETA, a photo, or a customer preference into custody, completion, handoff authorization, or stock truth. Return-to-store does not imply refund, restock, or availability.

Shipping and York Pickup consume the same canonical order and inventory contracts. Carrier, routing, and delivery adapters return outcomes to their owning boundaries; they cannot directly set order payment, stock, eligibility, or customer truth. A fulfillment-method change invalidates affected eligibility, allocation, fees, tax, promise, and readiness and requires re-evaluation. No method silently substitutes for another.

This document preserves, and does not redesign, BSDN routed-road-mile zones, versioned service policy, package class, age/handoff, custody/proof, extended-range wholesale, or any governed free-delivery logic. Exact York locations, hours, rates, minimums, promises, capacity, and operating procedures remain open.

## Storage responsibility

| Storage class | Responsibility | Explicit non-responsibility |
|---|---|---|
| Transactional database | Canonical operational identities, versions, product/variant/SKU/lot metadata, supplier/PO/receiving records, price/offer metadata, inventory ledger/positions/reservations, media/evidence metadata, order/fulfillment records, permissions, idempotency and outbox | Does not make object binaries public and is not selected by this phase. |
| Object / media storage | Media/evidence master binaries and generated derivatives under controlled references, rights, integrity and access policy | Never inventory, price, availability, product approval, evidence applicability, or channel truth. |
| Search index | Rebuildable retrieval documents for authorized retail, wholesale, and admin search | Never canonical identity, publication, inventory, eligibility, or transaction authorization. |
| Cache | Disposable bounded performance copies with version and invalidation behavior | Never durable truth; loss cannot lose a canonical write. |
| Audit storage | Immutable or tamper-evident material admin/domain events with minimized sensitive content, retention/hold/export controls | General logs are not the sole audit record and must not absorb raw protected media or unnecessary sensitive evidence. |
| Analytics / projections | Rebuildable operational and analytical views with lineage, source version, lag, and privacy rules | Never writes canonical commerce state or invents missing cost, eligibility, availability, or evidence truth. |
| GitHub repository | Source code, architecture, schemas, migrations, releases, and documentation | Never live products, stock balances, prices, reservations, supplier accounts, private wholesale inventory, or routine operational state. |

The final physical deployment and isolation of these responsibilities depend on provider, security, scale, and compliance evidence. Logical ownership remains required even if several responsibilities initially share one selected platform.

## Adapter and integration rules

All external capabilities use replaceable canonical adapters with mapping, authentication, timeout, retry, idempotency, audit, portability, reconciliation, and explicit failure semantics. Provider IDs are aliases. Provider data cannot overwrite stable Blowin' Smoke IDs or bypass domain validation.

| Adapter class | Permitted role | Required safe failure |
|---|---|---|
| Supplier/import | Propose supplier references, PO acknowledgments, expected receipts, or import rows | Reject/hold unknown mappings and invalid units; never create sellable stock before receiving. |
| Payment/accounting | Return attempt/outcome or consume authorized financial exports | Timeout remains unknown and reconciled; no blind retry, price rewrite, stock allocation, or provider ownership. |
| Age/eligibility/tax | Evaluate exact versioned context | SERVICE_ERROR/UNKNOWN never defaults to eligible or successful. |
| Carrier/routing/BSDN support | Return operational route/rate/status evidence | Cannot mark paid, allocate stock, change eligibility, or fabricate custody/completion. |
| Media storage/transcoding/scanning | Store/inspect/process controlled binary assets | Failure preserves identity and blocks unsafe publication; never silently substitutes a similar asset. |
| Search/analytics/notifications/support | Consume outbox and build projections or deliver nonauthoritative messages | Outage does not mutate canonical truth; notification delivery never becomes state. |
| Identity/authentication | Establish actor/session and current assurance signals | User agent or client assertion alone never grants capability; stale/revoked state fails closed. |

Private Wholesale media remains behind its governing protected-content architecture: no durable public original URL, short-lived authorization, anti-enumeration, revocation, protected-client gate, watermarking where governed, no ordinary save/download, and capture-output requirements. This phase only connects canonical media/offer/access references; it does not weaken, redesign, or implement that security system.

## Import and export boundary

Potential CSV catalog, inventory-receipt, and supplier imports follow a staged flow:

    INGEST -> SCHEMA/UNIT VALIDATION -> CANONICAL MAPPING
      -> PREVIEW -> AUTHORIZED COMMIT -> PER-RECORD AUDIT/OUTBOX
      -> RESULT + REJECT REPORT

An import cannot directly write tables. Each accepted row becomes the appropriate owner-domain command and is subject to the same version, provenance, evidence, quantity, permission, and audit rules as manual Admin work. Batch identity and row identity support safe retry. Atomicity is explicit; invalid rows are rejected, not silently coerced.

Inventory reports, stock history, price history, accounting-support data, and purchase-order exports are versioned snapshots with actor, purpose, generated time, scope, source version, and sensitivity. Export authorization, step-up, minimization, retention, delivery, and revocation policies remain open. An export does not become a second system of record.

## Open gates

### Owner decisions required

- launch products, inventory, suppliers/accounts, mappings, lots and locations;
- stock-adjustment, manual override, bulk action, export, and second-approval thresholds;
- reservation, abandonment, extension, expiry, cancellation, and price-change acknowledgment policies;
- channel allocations, safety reserves, low-stock and operational-signal thresholds;
- purchase-order, receiving, discrepancy, quarantine, transfer, return, and reconciliation procedures;
- exact York shipping, pickup, BSDN, receiving, and return locations and hours;
- staff roles, capability assignments, support/recovery authority, and operational SLO targets.

### Legal, compliance, finance, and security decisions required

- qualified product, destination, age, handoff, evidence, proof, privacy, and retention rules;
- supplier documentation/due diligence and final evidence-verification policy;
- accounting, landed-cost, tax, payment, refund, tip, reconciliation, and records policy;
- admin authentication assurance, MFA/step-up, session, incident, access-review, export, and data-minimization requirements;
- media/evidence rights, retention, deletion, protected-wholesale access, and security acceptance.

### Provider and technology selection required

- application platform and transactional database;
- exact optimistic-concurrency, locking, idempotency, outbox, replay, dead-letter, migration, backup, RPO/RTO, and observability mechanisms;
- admin authentication/identity provider;
- object/media storage, security scanning, image/video transcoding, protected delivery, and CDN boundary;
- search/indexing, cache, analytics/projection, notification, and support systems;
- supplier/import/EDI, accounting, payment, tax, carrier/routing, age/eligibility, and other adapter candidates;
- device/offline requirements, portability tests, quantitative projection-lag thresholds, and provider exit procedures.

### Implementation required but not authorized

- Admin web/app and canonical Commerce API;
- live database, inventory ledger, supplier/receiving system, media pipeline, evidence workflow, and projections;
- adapter integrations, imports/exports, projection rebuilds, dashboards, alerts, and operational runbooks;
- schema migrations, security controls, monitoring, testing, reconciliation exercises, pilot, and launch.

Until the relevant gate closes, unknown or stale decision-critical state remains explicit and fails safe. No provider or platform is chosen in this document. Live Admin, live inventory, live media processing, live supplier integration, production implementation, pilot, and launch remain unimplemented and unauthorized.
