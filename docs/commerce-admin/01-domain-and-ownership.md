# COM-ADM-01 — Domain and Ownership

**Status:** Governing vendor-neutral commerce-administration architecture
**Implementation authorization:** Not granted

## 1. One operational authority, bounded owners

Blowin' Smoke requires one canonical commerce application boundary. “One source of truth” means every fact has exactly one accountable write owner and one current canonical record within that boundary. It does not mean a single database table or giant product object. Catalog, inventory, pricing, media, evidence, receiving, and audit retain separate invariants and permissions.

Authorized admin clients issue commands to the canonical commerce API. They never write storage directly. Retail, protected wholesale, search, cart, fulfillment, shipping, York pickup, BSDN, support, and operations consume authoritative queries or rebuildable projections. None owns an independent inventory count.

```text
Authorized human / trusted adapter
              |
    authenticated admin client
              |
      canonical commerce API
              |
   owning bounded domain validates
 identity + capability + object scope
 version + provenance + invariants
              |
 canonical state + audit + outbox
       committed atomically
              |
 projections and downstream consumers
```

## 2. Repository and operational-state boundary

| Repository responsibility | Canonical operational responsibility |
|---|---|
| Source code and reviewed configuration schemas | Products and variants in operation |
| Architecture and documentation | Exact stock, lots, reservations, corrections |
| Database migrations | Prices, promotions, negotiated quotes |
| Releases and deployment definitions | Media objects, roles, rights, and publication state |
| Test fixtures explicitly labeled synthetic | Evidence/COA records and applicability |
| Machine-readable architecture registry | Suppliers, purchase orders, receipts, discrepancies |
| No live stock or business edit workflow | Orders, fulfillment, staff authority, audit events |

The operator must never need to edit GitHub, create a commit, change code, run a deployment, ask Codex, or involve a developer to perform a routine authorized commerce operation. The live application and persistent operational stores—not this package—will own operational records after implementation.

## 3. Canonical entity ownership

Every record carries a stable Blowin' Smoke identifier, owning domain, monotonic version, status/currentness, source/provenance, created/observed/effective time as applicable, actor or service authority, and correction lineage. External/provider identifiers are aliases, not canonical identity.

| Entity | Canonical owner | Governing responsibility | Explicitly does not own |
|---|---|---|---|
| Product | Catalog | Durable commercial identity, division, type, role, invariant facts, lifecycle | Options, stock, price, proof outcome |
| Variant | Variant and Option | Exact valid sellable configuration and variant-scoped truth | Current stock, price, eligibility |
| SKU | Variant and Option | Unique operational sellable-unit identifier/alias policy for one variant | Product truth or batch identity |
| Lot / Batch | Inventory and Receiving, with Proof applicability | Traceable received/produced grouping linked to exact inventory | Variant identity; generic proof validity |
| Inventory Location | Inventory and Receiving | Owned custody point and operational capabilities | BSDN service zone or customer destination |
| Stock Position | Inventory and Receiving | Exact quantity position for variant, location, quantity dimension, and lot scope when required | Customer-facing availability claim |
| Inventory Ledger Entry | Inventory and Receiving | Immutable quantity movement/reclassification/correction | Product or eligibility truth |
| Reservation | Inventory and Receiving | Time-bounded claim against allocatable quantity for an exact demand context | Order, payment, or fulfillment success |
| Channel Allocation | Inventory and Receiving | Constraint/partition against canonical available-to-promise quantity | Additional physical stock |
| Channel Offer | Pricing and Channel Commerce | Channel visibility, qualification, quantity bounds, price reference, fulfillment eligibility | Physical quantity or proof truth |
| Price | Pricing | Exact effective money record for one sellable/channel context | Tax, inventory, payment authorization |
| Negotiated Quote | Wholesale Commerce | Customer/inquiry-specific proposed terms, expiry, quantity, conversion status | Reference price or physical reservation unless explicitly linked |
| Media Asset | Media and Rights | Immutable master identity, source, rights, metadata, status | Product facts or evidence applicability |
| Media Derivative | Media and Rights | Versioned rendition derived from a master for an approved purpose | Independent truth or new rights |
| Evidence Record | Evidence / Proof | Source, issuer, subject, type, versions, status, provenance | Automatic verified product claim |
| COA / Proof Record | Evidence / Proof | Exact document and applicability to product, variant, lot/sample, and time | Batch-independent approval, legal conclusion, eligibility |
| Supplier | Supplier and Purchasing | Verified counterparty identity and operational relationship metadata | Product truth or sellability |
| Purchase Order | Supplier and Purchasing | Intended procurement commitment and line expectations | On-hand or available stock |
| Expected Receipt | Supplier and Purchasing | Anticipated quantity/date/location against a PO | Physical receipt or ATP |
| Receiving Event | Inventory and Receiving | Observed physical arrival, inspection, discrepancy, lot/evidence intake | Automatic availability |
| Order | Order | Submitted commercial record and immutable line/decision snapshots | Live product, stock, or delivery state |
| Fulfillment | Fulfillment | Selected shipping, York pickup, or local-delivery workflow and promise references | Payment, eligibility, or inventory ledger |
| Admin Actor | Identity and Access | Staff identity, status, authentication and role assignments | Business-domain authority by identity alone |
| Permission / Capability | Identity and Access | Named action authority constrained by role, object, division/channel, state, and risk | Universal database access |
| Audit Event | Audit, Provenance, and Corrections | Tamper-evident record of sensitive read or consequential command/result | The business record itself |

## 4. Domain write authorities

| Domain | Normal write authority | Required cross-domain behavior |
|---|---|---|
| Catalog / Variant | Authorized catalog authority; specialized verifier for governed technical relationships | Publishing reads price/media/evidence/readiness but does not rewrite them |
| Inventory / Receiving | Authorized receiving or inventory authority | Variant and location must exist; eligibility is not inferred |
| Pricing / Promotions | Authorized finance/commerce pricing authority | Stock and tax remain external dependencies |
| Wholesale Offers / Quotes | Wholesale sales with scoped authority; high-risk price actions may require step-up/approval | Quote conversion uses canonical price/inventory/order commands |
| Media / Rights | Media operator with documented source/rights; verifier where evidence media is involved | Asset publication is separate from product publication |
| Evidence / Proof | Qualified proof/evidence authority | Applicability and claim verification are explicit decisions |
| Supplier / PO | Authorized procurement/receiving authority | PO and expected receipts never increment on-hand |
| Order / Fulfillment | Order orchestration and authorized operations | Inventory, payment, eligibility, BSDN remain bounded owners |
| Identity / Roles | Owner or narrowly authorized role administrator | Cannot grant beyond governing capability policy |
| Audit / Correction | Append by every owning domain; narrow auditor reads | Cannot edit canonical business truth directly |

There is no universal administrator role. An administrator may coordinate operational work while still lacking specialist authority to verify evidence, change restricted wholesale visibility, alter roles, or make financial corrections.

## 5. Command boundary

Commands express intent to change one owning domain. Every consequential command includes:

- authenticated actor or trusted adapter identity;
- named capability and purpose;
- target canonical identifier and expected current version;
- complete validated input in canonical units;
- reason/source/evidence where required;
- idempotency key for retryable work;
- correlation and causation references;
- requested effective time where authorized.

The owner validates authority, object scope, version, state transition, provenance, and domain invariants. Accepted commands atomically persist the canonical change, immutable audit evidence, and an outbox event. Rejected commands leave no partial canonical change and return an explicit conflict, validation, authorization, or dependency result. Silent last-write-wins is prohibited.

Command families are:

- Catalog: create/edit/archive/restore, variants/SKUs, classify, review, publish/unpublish.
- Inventory: receive, reserve/release/commit/fulfill, adjust/correct, damage/loss, quarantine/unquarantine, reallocate, transfer.
- Pricing: create/schedule/end price, promotion, wholesale reference, quote.
- Media: initiate upload, validate, assign role, publish/protect, replace, archive.
- Evidence: register document, attach scope, review, change state, supersede/correct.
- Supplier/Purchasing: supplier record, supplier-product reference, PO/line, and expected receipt. Inventory/Receiving: receiving session/line, discrepancy, lot/batch, and receipt event.
- Wholesale: visibility/profile/status, allocation request, protected presentation eligibility, quote conversion.
- Administration: role assignment/revocation, approved high-risk override, import/export, correction.

## 6. Query boundary

Administrative query services may compose bounded records for human work but cannot become write authority. Queries include product detail, exact stock and ledger history, reservation history, pricing/history, wholesale offer/quote, media/evidence status, receiving reconciliation, operational signals, and audit search. A response identifies source versions, projection time, staleness, and service errors.

Decision-critical actions re-read the canonical owner. A dashboard count, search result, exported report, cached page, or provider record cannot authorize a reservation, stock correction, publication, price commitment, protected-media release, or role change.

## 7. Cross-domain invariants

- Product is not variant; variant is not SKU; SKU is not lot/batch.
- Lot provenance does not create a proof claim without exact applicability.
- Inventory position is not customer-facing availability.
- Physical on-hand is not available to promise.
- Channel allocation limits a single stock pool and cannot mint quantity.
- Price is not stock; stock is not eligibility; proof is not approval.
- Media appearance, filename, supplier text, or URL cannot establish product fact, included contents, compatibility, fit, or scale.
- Retail publication never exposes wholesale price, count, profile, evidence, media, or sales status.
- Provider success is not canonical success until the owning domain validates and records it.
- Unknown, unverified, stale, conflicting, not supplied, not applicable, and service error remain distinct.

## 8. Current state

The logical owners and command/query boundaries are decided. No physical database, admin framework, commerce provider, identity provider, object store, search service, inventory system, supplier account, or live product dataset has been selected or created. This document authorizes none of them.
