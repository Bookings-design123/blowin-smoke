# Supplier, Receiving, and Location Model

## Status and governing boundary

This document defines future operational capability. It does not represent current stock, supplier relationships, purchase orders, locations, or integrations.

Current owner state is explicit:

- Blowin' Smoke has no physical inventory recorded by this architecture package.
- Blowin' Smoke has no verified wholesale or distributor accounts recorded by this architecture package.
- No supplier, product availability, expected quantity, unit cost, lead time, or delivery date may be fabricated.
- Repository content is architecture and schema guidance, never live supplier, purchasing, receiving, or inventory truth.

Routine supplier, receiving, discrepancy, quarantine, and location work must eventually occur through Blowin' Smoke Admin and the canonical Commerce API. It must not require GitHub, a commit, a deployment, Codex, or developer intervention.

## Ownership and separation of truth

| Record | Canonical owner | Governing meaning |
|---|---|---|
| Supplier | Supplier and Purchasing | A vetted commercial counterparty record. Current collection is empty. External identifiers are aliases, never canonical identity. |
| Supplier Product Reference | Supplier and Purchasing | A versioned mapping from a supplier's item reference to an exact Blowin' Smoke product, variant, or SKU candidate. It is not product approval or inventory. |
| Purchase Order | Supplier and Purchasing | Authorized intent to purchase under recorded commercial terms. It is not physical stock, a receipt, or sellability. |
| Purchase Order Line | Supplier and Purchasing | The exact requested item reference, canonical mapping if established, quantity semantics, unit cost basis, and expected evidence. |
| Expected Receipt | Supplier and Purchasing | A forecast of what may arrive, when, and where. It cannot increase physical on hand or available-to-promise. |
| Receiving Session | Inventory and Receiving | A controlled intake session at one receiving location, with actor, source, times, and command/idempotency context. |
| Receiving Line | Inventory and Receiving | The observed item, exact accepted/rejected quantity, condition, discrepancy, lot/batch and evidence references recorded during a session. |
| Discrepancy | Inventory and Receiving | An explicit difference between ordered, expected, labeled, and physically observed truth. It never disappears through silent editing. |
| Lot / Batch | Inventory and Receiving | Provenance identity for received units and the scope anchor for Catalog and Evidence references. Catalog and Evidence consume the canonical lot/batch identity; they do not co-own or rewrite it. Similar names do not establish equivalence. |
| Inventory Ledger Entry | Inventory and Receiving | The immutable or append-only quantity mutation that establishes inventory accounting truth. |
| Inventory Location | Inventory and Receiving | A stable owned-location identity with versioned operational capabilities. A name or address string is not the identity. |
| Stock Position | Inventory and Receiving | The canonical quantity state for an exact SKU or variant, lot/batch where applicable, and location. |
| Transfer | Inventory and Receiving | A governed movement between two canonical locations. It does not create stock and is supported for future use. |
| Location Availability | Inventory and Receiving | A derived, versioned view of what a location may allocate for a mode; it is not an independent stock balance. |

Catalog owns canonical product, variant, SKU, and descriptive identity. Supplier and Purchasing owns supplier relationships, purchase orders, and expected receipts. Inventory and Receiving owns physical intake, receiving sessions/lines, discrepancies, lots/batches, and the inventory ledger. Evidence owns verification status and applicability. Pricing owns sell prices. Purchase-order unit cost does not establish a retail, wholesale reference, promotional, or negotiated price.

No source or adapter may write another domain's records directly. A supplier feed may propose a reference or expected receipt, but it cannot approve a product, verify a COA, create sellable inventory, set channel eligibility, or publish a product.

## Relationship model

    SUPPLIER
      └─ SUPPLIER PRODUCT REFERENCE
           └─ PURCHASE ORDER
                └─ PURCHASE ORDER LINE
                     └─ EXPECTED RECEIPT

    RECEIVING SESSION + INVENTORY LOCATION
      └─ RECEIVING LINE
           ├─ PURCHASE ORDER LINE / EXPECTED RECEIPT reference, when present
           ├─ DISCREPANCY
           ├─ LOT / BATCH
           ├─ EVIDENCE RECEIVED reference
           └─ INVENTORY LEDGER ENTRY
                └─ STOCK POSITION
                     └─ LOCATION AVAILABILITY projections

A receipt may be entered without a purchase-order reference only through an explicitly authorized exception workflow with a reason and audit record. That exception does not reduce identity, condition, lot/batch, evidence, or quantity requirements.

## Supplier and purchasing lifecycle

Supplier records must be versioned and retain provenance, review state, operational status, and external aliases. Creating or activating one requires the relevant capability and does not prove any product fact.

Purchase-order state must distinguish, at minimum:

- DRAFT: editable purchasing intent that has not been authorized.
- APPROVED: authorized intent under a recorded approval; still not inventory.
- ISSUED: transmitted or otherwise provided to the supplier.
- PARTIALLY_RECEIVED: one or more accepted receiving lines exist, with an outstanding balance.
- FULLY_RECEIVED: governed line reconciliation is complete.
- CLOSED: operational reconciliation is complete under approved policy.
- CANCELED: future receipt is no longer expected under an authorized decision.

Changing an issued purchase order creates a new version or an explicit amendment. It does not rewrite received history. Cancellation does not reverse a receipt. A supplier acknowledgment, invoice, shipping notice, or expected-receipt update remains documentary or forecast evidence until physical receiving creates ledger truth.

Expected receipts carry stable identity, source, purchase-order line, expected destination, exact quantity semantics, expected window if known, status, and source version. Unknown values remain unknown. They may support planning views but never stock or customer availability.

## Receiving workflow and ledger truth

The governing workflow is:

1. An authorized actor opens a Receiving Session for one canonical location.
2. The actor identifies the purchase-order line or records an authorized unmatched-receipt exception.
3. Each Receiving Line records the exact observed item, count or exact weight, packaging/condition, supplier identifiers as aliases, lot/batch, and evidence received.
4. The system compares ordered, expected, labeled, and observed facts without assuming they agree.
5. Discrepancies are classified and retained. Material identity, condition, provenance, proof, or quantity uncertainty routes the units to inspection pending or quarantine.
6. An accepted receiving command atomically records the finalized receiving line, lot/batch reference, inventory ledger receipt entry, resulting stock-position version, audit context, and outbox event.
7. Downstream projections refresh from the outbox. No projection creates stock.

Receipt creates PHYSICAL_ON_HAND only for accepted observed quantity. It does not automatically create AVAILABLE_TO_PROMISE. Received units may remain INSPECTION_PENDING, QUARANTINED, DAMAGED, or otherwise UNSELLABLE until the applicable governed checks pass.

Evidence received during intake is only a document/intake fact. Uploading or attaching it does not establish CURRENT or verified evidence, does not validate a customer-facing claim, and does not make a COA for one lot apply to another.

## Discrepancy, quarantine, and correction

The model must preserve differences such as:

- ordered versus physically received quantity;
- expected versus actual SKU, variant, package, unit, or lot;
- supplier label versus canonical identity;
- damaged, opened, missing, substituted, recalled, or otherwise suspect units;
- missing, unmatched, conflicting, stale, or unverified evidence;
- exact-weight or count mismatch;
- unexpected item or receipt without a mapped purchase-order line.

Discrepancy resolution is a separate authorized command with actor, reason, evidence, prior version, result, and audit context. Resolution may accept, reject, return, quarantine, or correct inventory only through the owning domain's valid transitions.

Quarantine excludes the exact affected quantity from available-to-promise and channel allocation. Unquarantine requires a new authorized decision and supporting reference; it is not deletion of the quarantine event. Damage, loss, shrinkage, stocktake correction, and manual correction create compensating ledger entries where appropriate. Historical events are never silently overwritten.

## Exact quantity and cost semantics

Receiving supports both discrete-count and weight-based stock without coercing one into the other:

- count quantities use exact integral unit semantics;
- weight uses an exact canonical base-unit representation with recorded display unit and conversion rule;
- lb, oz, and g inputs are converted without floating-point inventory arithmetic;
- package size, partial-quantity permission, conversion source/version, and lot/batch provenance remain explicit;
- incompatible quantity dimensions cannot be combined.

Received quantity, rejected quantity, damaged quantity, and discrepancy quantity are recorded separately. For THCA wholesale, the 1+ lb qualification remains one particular authoritative canonical strain; receiving similarly must not aggregate similarly named or distinct strains to fabricate equivalence.

Unit cost uses exact money semantics, a recorded currency, basis, and effective commercial context. Unit cost may inform accounting or margin projections but never mutates customer-facing price records. Accounting treatment, landed-cost allocation, and financial integration remain open.

## Inventory location model

The architecture permits an initial York, Pennsylvania operating location without hard-coding the system to one location. The exact York origin, inventory-serving location, pickup location, BSDN origin, and return receiving point remain authoritative owner/operations inputs.

An Inventory Location must include:

- stable location ID and version;
- approved name and address reference;
- lifecycle status;
- receiving, stocking, shipping, York pickup, BSDN-origin, and return-receiving capabilities as independent effective-dated properties;
- operational and policy references rather than invented hours, promises, or procedures;
- sensitivity, access, audit, and correction context.

Stock position identity is at least exact SKU or variant plus location, and includes lot/batch where material. Physical on hand, reserved, committed, damaged, quarantined, unsellable, safety reserve, and channel allocations remain distinguishable. Location availability is derived from canonical positions and current eligibility/policy; it cannot be edited as an unrelated quantity.

Channel allocations constrain use of shared physical stock and never duplicate it. Retail, Private Wholesale, Shipping, York Pickup, and BSDN Same-Day may receive separate allocation or offer rules while resolving against the same canonical stock positions.

## Future transfer model

Multi-location transfer is an architectural capability, not a claim that multiple locations exist. A Transfer binds:

- transfer ID and idempotency key;
- source and destination location IDs;
- exact SKU/variant, lot/batch where applicable, and quantity semantics;
- initiating actor, reason, policy, current source-position version, and audit context;
- states such as REQUESTED, AUTHORIZED, IN_TRANSIT, RECEIVED, CANCELED, or EXCEPTION.

Authorization must verify that source and destination are distinct, active for the required purpose, and that the source can allocate the exact quantity. Dispatching a transfer records the source-side movement without creating destination stock. Destination stock changes only after an authorized receiving event. In-transit custody is explicit. Canceling or correcting a transfer uses governed compensation; it never restores or duplicates quantity by assumption.

When a transfer is executed inside one supported transactional inventory boundary, each accepted source/destination ledger mutation, transfer version, audit context, and outbox event must be atomic. If a future topology cannot support one transaction, the transfer uses an explicit state machine and idempotent compensation; it must never rely on distributed last-write-wins.

## Fulfillment-mode ownership

Canonical Commerce Inventory owns stock, reservations, commitments, fulfillment deductions, and location allocation. The three fulfillment modes remain distinct:

| Mode | Inventory input | Governing boundary |
|---|---|---|
| Eligible shipping | Approved shippable location, exact line eligibility, current reservation/commitment | Shipping consumes allocation and order truth through commands/events; it does not own stock or invent universal shipping eligibility. |
| York pickup | Approved pickup location, exact reserved/committed line, current release rules | The exact location, hours, readiness promise, and release procedure remain gated. Pickup does not silently substitute for shipping or delivery. |
| BSDN Same-Day | Committed order lines, exact quantity, fulfillment eligibility, serving location | BSDN consumes canonical order and committed-inventory truth. It does not own, adjust, quarantine, restock, or reallocate inventory. |

Admin may govern channel-offer eligibility for SHIPPING, YORK_PICKUP, and BSDN_SAME_DAY through owning-domain commands. A fulfillment-mode change invalidates affected eligibility, allocation, fees, tax, promise, and readiness and requires revalidation.

This package does not redesign BSDN. Its routed-road-mile zones, versioned rates and minimums, standard-package rule, age/handoff gates, custody, proof, return, extended-range wholesale policy references, and any governed free-delivery logic remain owned by their existing policies. Catalog items are merely same-day candidates until the exact BSDN transaction is eligible. Return-to-store does not imply refund, restock, or availability; Inventory and Receiving must inspect and authorize any later disposition.

## Administrative commands and queries

Supplier/Purchasing and Inventory/Receiving command families must support, subject to capability and policy:

- create, amend, suspend, archive, and restore a supplier record;
- map, correct, or invalidate a supplier product reference;
- draft, approve, issue, amend, cancel, close, and reconcile a purchase order;
- record or supersede an expected receipt;
- open, finalize, abandon, or recover a receiving session;
- record, correct, accept, reject, quarantine, or reconcile a receiving line;
- create or link a lot/batch without inferring equivalence;
- record discrepancy and authorized resolution;
- initiate, authorize, dispatch, receive, cancel, or correct a transfer;
- activate, pause, or retire an approved location capability.

Each command includes authenticated actor, capability, stable target, expected version, command/idempotency key, source/provenance, reason when material, observed/effective time, and correlation context. Consequential concurrent edits return a conflict and current version, not silent last-write-wins.

Administrative queries may retrieve suppliers, mappings, purchase orders, expected receipts, receiving work, discrepancies, quarantine, lots/batches, locations, transfers, stock histories, and projection health. Queries clearly label canonical versus projected state and unknown/stale/error conditions. They never mutate state.

## Audit, archive, import, and export

Every material mutation records who, what, when, why, target, prior/new version or ledger effect, related supplier/PO/SKU/lot/location, session/request, source, and result. Sensitive supplier, financial, location, and evidence data are minimized and access-controlled.

Used suppliers, purchase orders, receiving sessions, lots, locations, discrepancies, transfers, and ledger entries are retained or archived according to future approved policy; they are not casually hard-deleted. Draft-only records may be eligible for deletion under a later policy. Historical orders, stock, and audit trails must remain interpretable after a supplier, mapping, SKU, or location is archived.

Future CSV or supplier-adapter imports are proposals through the same command boundary. They require schema and unit validation, canonical-ID mapping, preview, per-record domain validation, an explicit reject path, idempotency where practical, and audit. No import may bypass product approval, receiving, evidence, quarantine, quantity, or location rules.

Exports may provide purchase-order, receiving, discrepancy, cost, stock-history, and accounting-support snapshots with source versions, generated time, scope, actor, and sensitivity controls. Export does not transfer canonical ownership.

## Open gates

### Owner and operations decisions required

- actual supplier and wholesale/distributor accounts;
- launch inventory, initial supplier mappings, purchase-order and receiving procedures;
- exact York inventory, receiving, pickup, BSDN-origin, and return locations;
- location days, hours, cutoffs, blackouts, and capability activation;
- purchase-order approval and amendment authority;
- receiving discrepancy, quarantine, unquarantine, damage, loss, shrinkage, stocktake, and transfer procedures;
- exact adjustment/exception approval thresholds and second-approval rules;
- reservation durations and the operational effect of expected arrivals;
- inventory count/weight verification tolerances and specialized package handling;
- retention schedules and access authority for procurement, cost, location, and receiving evidence.

### Legal, compliance, finance, and policy decisions required

- supplier due diligence and regulated product documentation requirements;
- qualified evidence/COA verification and lot-applicability policy;
- product, destination, age, handoff, proof, and channel-eligibility rules;
- accounting treatment, landed cost, tax, reconciliation, and record retention;
- workforce, safety, vehicle, insurance, custody, damage, return, and disposal rules where applicable.

### Provider and technology selection required

- transactional database and exact concurrency mechanism;
- supplier import, EDI, or other integration capability;
- accounting/export integration;
- barcode, measurement, scanning, label, and receiving-device support;
- identity/authentication, object/evidence storage, search, analytics, and observability systems;
- platform support for multi-location transfer, offline receiving, outbox, replay, and portability.

### Implementation required but not authorized

- live supplier/purchasing records and workflows;
- live inventory database and ledger;
- receiving, discrepancy, quarantine, and transfer interfaces;
- location setup and operational integrations;
- automated imports, exports, alerts, and reconciliations;
- testing, migration, deployment, pilot, and launch.

No provider is selected here. No supplier is represented as active. No inventory is represented as received or available. Production implementation remains not authorized.
