# Inventory Ledger and Reservations

**Phase:** COM-ADM-01

**Status:** Governing commerce-administration architecture

**Implementation status:** Architecture only; no production implementation is authorized

## Purpose and current boundary

This document defines the canonical inventory ledger, exact quantity semantics, stock positions, reservations, channel allocation, concurrency controls, and recovery behavior for Blowin' Smoke Admin. It specializes [Inventory, Cart, Order, and Fulfillment](../technical-architecture/04-inventory-cart-order-and-fulfillment.md) without inventing actual stock, locations, providers, procedures, or timeout values.

Current owner state is **NO PHYSICAL INVENTORY** and **NO WHOLESALE / DISTRIBUTOR ACCOUNTS**. No inventory service, accounting system, receiving system, or persistent provider has been selected. These facts are launch blockers, not permission to use sample quantities as live truth.

Routine inventory operations must ultimately be possible for authorized owner/staff through Blowin' Smoke Admin. They must not require GitHub edits, repository commits, code changes, deployments, Codex, or developer intervention.

## Non-negotiable invariants

1. Inventory is an auditable ledger. It is not an unaudited mutable number on Product or Variant.
2. A Stock Position is scoped to the exact Sellable Variant / SKU configuration, owned Inventory Location, quantity unit, and Lot / Batch where traceability is material.
3. Blowin' Smoke owns purchased physical inventory. A supplier record, purchase order, expected receipt, storefront listing, or channel offer is not physical stock.
4. Physical stock is received only through an authorized Receiving Event. Receipt does not automatically make it sellable.
5. `PHYSICAL_ON_HAND`, `RESERVED`, `COMMITTED`, `DAMAGED`, `QUARANTINED`, `UNSELLABLE`, `SAFETY_RESERVE`, and `AVAILABLE_TO_PROMISE` have distinct meanings and exact units.
6. Reserved and Committed are mutually exclusive encumbrance states for the same quantity; conversion between them is atomic.
7. No command may make `AVAILABLE_TO_PROMISE` or any constituent quantity negative.
8. A channel allocation constrains access to canonical stock. It never clones or duplicates physical stock.
9. A stale storefront, search index, cache, or admin read model cannot authorize an oversell. The canonical Inventory domain decides every consequential reservation and commitment.
10. Every mutation is idempotent, version-checked, attributed, reasoned, timestamped, and represented by one or more immutable ledger events.
11. Historical events are not overwritten. Corrections use new authorized entries, including compensating entries where appropriate.
12. Unknown, service failure, and version conflict never default to Available.
13. Price, eligibility, proof, fit, and publication remain separate domains. Stock does not establish any of them.

## Canonical inventory objects

| Object | Responsibility | Required scope / invariants |
|---|---|---|
| `Inventory Location` | Owned physical or explicitly governed in-transit custody context | Stable ID, status, operational modes, authority; actual locations remain OPEN except settled York service geography |
| `Stock Position` | Current folded balance for one exact stock identity | Variant, SKU/package configuration, location, quantity semantics, optional required Lot / Batch, monotonic ledger version |
| `Inventory Ledger Entry` | Immutable effect of one inventory mutation | Event type, exact signed quantities, before/after position version, actor/authority, reason, source, command/idempotency/correlation IDs, occurred/effective time |
| `Reservation` | Time-bounded, idempotent hold for cart, quote, or order context | Exact position(s), channel, fulfillment mode, quantity, policy reference, state, created/expiry context, owner context |
| `Channel Allocation` | Governed partition or access rule over free canonical stock | Exact position or governed pool, channel, quantity/rule, effective state, version; never a new physical position |
| `Inventory Transfer` | Future movement between owned locations | Source, in-transit custody, destination, exact quantity, dispatch/receipt states, paired ledger references |
| `Receiving Event` | Authorized observation and acceptance of physically received goods | Supplier/PO references where present, exact receiving lines, quantities, discrepancies, Lot / Batch, inspection and evidence states |
| `Stocktake` | Count/measurement observation compared with canonical position | Method, actor, time, expected/observed exact quantities, discrepancy and authorized correction references |

The current folded Stock Position is a performance/read model over the immutable ledger within the Inventory system of record. It may be transactionally maintained, but the event/audit history remains authoritative for how the balance changed.

## Exact quantity contract

Inventory must support both `WEIGHT_BASED` and `DISCRETE_COUNT` quantities without binary floating-point arithmetic.

### Canonical representation

Every quantity records:

- quantity kind: `MASS` or `COUNT`;
- signed integer count of a governed canonical quantum;
- controlled canonical unit and unit-family identity;
- quantum/scale definition and its version;
- exact variant/SKU/package scope;
- optional Lot / Batch scope where required;
- original entered value, entered unit, source/method, and measurement precision where operationally necessary.

The canonical quantum and permitted precision are product-type/operations decisions and are not selected here. The rule is exact: a value must convert to an integral number of its governed canonical quanta. If it does not, the command is rejected or routed to an explicitly approved measurement/rounding workflow. The application must never silently round inventory.

Unit conversion uses a versioned controlled registry and exact integer or rational arithmetic. No IEEE-754 `float` or `double` may be used for canonical quantity, conversion, comparison, reservation, aggregation, or ledger effects. Display formatting is a projection and cannot alter the stored quantity.

### Weight-based inventory

Weight inventory may accept governed units such as `lb`, `oz`, and `g`. Conversion to the position's canonical mass quantum must be exact and traceable. Partial quantities are permitted only when the Variant / SKU configuration, package state, receiving method, and owner-approved operations allow them.

A package size is a structured Variant / SKU fact, not an informal suffix. Opening, splitting, repackaging, or combining packages can affect identity, Lot / Batch traceability, proof applicability, and sellability; those workflows remain **OPEN — OPERATIONS / COMPLIANCE DECISION REQUIRED** and cannot be implied by arithmetic alone.

### Discrete-count inventory

Count-based inventory uses an integer count with quantum `1` of the controlled counting unit. Fractional count is invalid. Case, pack, box, and each are configuration or conversion records whose exact contents must be verified; a supplier label or image does not establish them.

Mass and count never aggregate or convert to each other merely because they concern the same Product.

## Stock classifications and equations

All terms below are evaluated for one compatible Stock Position scope and one common exact quantity unit. Aggregation across positions is permitted only when identity, unit, Lot / Batch, location, channel, and provenance rules authorize it.

### Definitions

- `PHYSICAL_ON_HAND`: units physically in the recorded owned location/custody, including sellable, Reserved, Committed-but-not-fulfilled, Damaged, Quarantined, and Unsellable units still physically present.
- `DAMAGED`: physically present units isolated due to recorded damage.
- `QUARANTINED`: physically present units withheld because identity, proof, condition, authenticity, recall, discrepancy, or another material truth is unresolved.
- `UNSELLABLE`: physically present units definitively excluded from sale under an authorized disposition state; it is not a synonym for Quarantined.
- `SELLABLE_ON_HAND`: physically present units that passed the applicable receiving/inspection gates before encumbrance.
- `RESERVED`: sellable units temporarily held by a live reservation.
- `COMMITTED`: sellable units allocated to an accepted order and unavailable to other demand, but not yet Fulfilled.
- `SAFETY_RESERVE`: owner-governed sellable quantity withheld from promise; its policy and values are OPEN.
- `AVAILABLE_TO_PROMISE`: unencumbered sellable quantity the canonical system can still allocate before channel and eligibility checks.

`DAMAGED`, `QUARANTINED`, and `UNSELLABLE` are mutually exclusive quantity classifications for equation purposes at a given position version. Moving quantity between them requires an explicit reclassification event. A unit may carry multiple descriptive reasons in its evidence, but its canonical quantity cannot be subtracted twice.

### Required equations

```text
SELLABLE_ON_HAND
  = PHYSICAL_ON_HAND
  - DAMAGED
  - QUARANTINED
  - UNSELLABLE

ENCUMBERED
  = RESERVED
  + COMMITTED

AVAILABLE_TO_PROMISE
  = SELLABLE_ON_HAND
  - RESERVED
  - COMMITTED
  - SAFETY_RESERVE
```

Each term must be greater than or equal to zero. `DAMAGED + QUARANTINED + UNSELLABLE` must not exceed `PHYSICAL_ON_HAND`. `RESERVED + COMMITTED + SAFETY_RESERVE` must not exceed `SELLABLE_ON_HAND`. Reserved and Committed sets cannot contain the same unit/quantity claim twice.

`DAMAGED`, `QUARANTINED`, and `UNSELLABLE` are mutually exclusive accounting classifications for each quantity quantum at a point in time. A unit may retain multiple descriptive conditions or evidence references, but only one of these buckets can remove it from `SELLABLE_ON_HAND`. Moving between classifications creates an auditable reclassification entry rather than double subtraction.

The ledger reconciles physical quantity by exact effects:

```text
ending PHYSICAL_ON_HAND
  = beginning PHYSICAL_ON_HAND
  + accepted RECEIPT
  + accepted RETURN_TO_STOCK
  + TRANSFER_IN
  - FULFILLMENT
  - TRANSFER_OUT
  - LOSS
  - SHRINKAGE
  + authorized signed CORRECTION / REVERSAL effects
```

`DAMAGE`, `QUARANTINE`, and `UNSELLABLE` reclassify physically present quantity; they do not by themselves reduce `PHYSICAL_ON_HAND`. A later destruction, loss, return-to-supplier, or other disposition requires its own authorized event. `RESTOCKED` is a derived availability transition after an accepted receipt or approved return-to-stock; it is not an unexplained quantity increase.

If any proposed mutation violates an equation, the whole command fails, no success event is emitted, and the caller receives the current version and localized reason. An already-discovered historical discrepancy is repaired through an authorized correction or stocktake correction, never by hiding a negative balance.

## Channel allocation without duplicate stock

Retail and Private Wholesale, and the shipping, York pickup, and BSDN fulfillment modes, all consume the same canonical physical positions.

For a hard-partitioned free-stock policy:

```text
sum(FREE_CHANNEL_ALLOCATION for all channels)
  + UNALLOCATED_FREE_POOL
  = AVAILABLE_TO_PROMISE
```

For a shared-pool policy, multiple offers may reference the same pool, but the pool quantity is counted once and each reservation competes atomically against the same position version. A shared pool must not be summed across channel projections or presented as independently guaranteed stock.

For either model:

```text
sum(RESERVED across channels) = canonical RESERVED
sum(COMMITTED across channels) = canonical COMMITTED
```

`CHANNEL_REALLOCATION` moves free allocation authority or an explicitly authorized reservation context; it does not change `PHYSICAL_ON_HAND`. It cannot steal Committed quantity, invalidate an accepted order, or bypass a protected quote without an approved compensating workflow. The allocation policy, priority rules, buffers, and approval thresholds remain OPEN.

Customer-facing Availability is a derived projection. `Available`, objectively governed `Low/Limited`, `Unavailable`, `Sold Out`, `Backorder/Preorder` when operationally supported, `Discontinued`, `Not Yet Available`, and `Unknown` are commerce states—not ledger buckets. In particular, derived `Unavailable` is not the same as zero physical count, Quarantined, Ineligible, or Discontinued.

## Inventory mutation catalog

Every mutation below creates immutable ledger and audit records. Where an original event already committed, its correction is represented by a linked compensating entry; it is never erased.

| Mutation | Canonical effect and invariants |
|---|---|
| `RECEIPT` | Increases Physical On Hand only after physical receiving observation; units begin in the applicable inspection/classification state and are not automatically sellable |
| `RESERVATION` | Atomically moves exact quantity from Available to Promise into Reserved for one cart/quote/order/channel/mode context |
| `RESERVATION_RELEASE` | Moves a live Reserved quantity back to the eligible free pool when policy permits |
| `SALE_COMMITMENT` | Atomically moves exact quantity from Reserved to Committed for an accepted order; it does not reduce Physical On Hand |
| `FULFILLMENT` | Consumes Committed quantity at verified shipment/pickup/delivery handoff and reduces Physical On Hand exactly once |
| `ORDER_CANCELLATION` | Releases Reserved quantity or compensates an eligible Committed state under an approved cancellation policy; it cannot reverse completed fulfillment silently |
| `VOID` | Cancels an uncommitted erroneous command/event attempt under strict authority; committed ledger effects require Reversal rather than deletion |
| `REVERSAL` | New linked compensating effect that neutralizes all or part of an eligible prior entry while preserving both records |
| `DAMAGE` | Reclassifies physically present quantity to Damaged and removes it from Sellable On Hand |
| `LOSS` | Removes known physically absent quantity from Physical On Hand with reason and authority |
| `SHRINKAGE` | Records reconciled unexplained shortage under an approved stocktake/investigation workflow; never a generic hiding place |
| `QUARANTINE` | Reclassifies quantity to Quarantined and removes it from promise/allocation; affected reservations/orders require explicit recovery |
| `UNQUARANTINE` | Returns exact quantity only after the blocking truth is resolved and authorized inspection permits its next state |
| `MANUAL_CORRECTION` | Authorized signed compensating adjustment with before/after, evidence, reason, actor, approval, and no silent overwrite |
| `STOCKTAKE_CORRECTION` | Reconciles expected and physically observed exact quantities from a governed stocktake; retains count method and discrepancy |
| `CHANNEL_REALLOCATION` | Changes free-stock allocation or authorized pool membership without changing physical quantity |
| `TRANSFER` | Future paired location movement through source, in-transit, and destination receiving states; stock cannot appear at both locations |

Return-to-stock, return-to-supplier, destruction/disposal, and package-split/repack operations require approved operational/compliance policy before they can become production mutation types. They must not be approximated with a generic Manual Correction.

## Receiving and Lot / Batch integrity

A Purchase Order and Expected Receipt are planning records. They do not create Physical On Hand, Available to Promise, or a customer-facing promise.

An authorized Receiving Session records each line's expected identity, observed exact Variant/SKU, received quantity, unit, supplier reference, Lot / Batch where applicable, discrepancies, condition, evidence received, and inspection state. Receiving creates ledger truth only from physical observation. Unexpected, damaged, unmatched, proof-deficient, or otherwise unresolved units enter Inspection Pending or Quarantine rather than Available.

Receiving may propose product facts, contents, measurements, proof applicability, or fit evidence, but those facts enter their owning verification workflows. An inventory operator cannot make them Verified merely by receiving stock.

## Reservation state machine

The inventory-eligibility state `AVAILABLE` and reservation lifecycle are separate concepts. The full conceptual reservation flow is:

```text
REQUESTED
  -> RESERVED
      -> COMMITTED
          -> FULFILLED
      -> RELEASED
      -> EXPIRED
  -> FAILED
```

- `REQUESTED`: idempotent command received with exact position, channel/mode, quantity, expected version, and policy reference.
- `RESERVED`: quantity is atomically encumbered and no longer Available to Promise.
- `COMMITTED`: a valid accepted-order transition atomically replaces the Reserved encumbrance.
- `FULFILLED`: verified fulfillment consumes Committed stock exactly once.
- `RELEASED`: live Reserved quantity is returned under an approved release transition.
- `EXPIRED`: a time-bounded Reserved hold expires under its referenced owner policy and is released exactly once.
- `FAILED`: no encumbrance was created; the attempt and reason remain auditable.

Reservation duration, extension, expiry, warning, and renewal policy are **OPEN — OWNER / OPERATIONS DECISION REQUIRED**. No timeout number is defined here. A reservation cannot expire merely because a worker or projection is late; expiry is an idempotent canonical transition using the policy and authoritative time.

## Required reservation behavior

| Scenario | Governing behavior |
|---|---|
| Checkout reservation | Revalidate exact variant, position, channel/mode, current quantity, and expected version; atomically reserve or return current failure state |
| Abandoned cart | Preserve the cart; release/expire only under the approved reservation policy and emit one canonical transition |
| Failed payment | Do not infer release from timeout; reconcile payment outcome and apply approved release policy using the original references |
| Successful payment | Payment outcome alone does not allocate stock; Order orchestrates the idempotent Reserved-to-Committed transition |
| Order cancellation | Release or compensate according to the actual reservation/commit/fulfillment state and approved cancellation policy |
| Negotiated wholesale quantity | Reserve the exact quoted/approved quantity against Wholesale allocation or shared canonical pool; quote does not itself create stock |
| Reservation expiration | Expire once, release exact quantity, preserve reason/policy/version, and revalidate cart/quote/order |
| Competing customers | Only one transaction can succeed against final quantity/version; loser receives current state with no phantom reservation |
| Staff adjustment during checkout | Version conflict or reduced canonical capacity blocks/revalidates affected reservation; admin intent does not overwrite the customer hold silently |
| Final available quantity | Determined only within canonical Inventory transaction; no read projection can guarantee it |

## Wholesale mass qualification

Private Wholesale qualification remains:

```text
1 lb or more of ONE PARTICULAR CANONICAL STRAIN
```

The calculation:

1. resolves every candidate line to a verified `canonicalStrainId`;
2. converts exact mass quantities through the governed rational unit registry;
3. groups only by the same canonical strain identity;
4. requires at least one group to meet or exceed the exact canonical equivalent of `1 lb`;
5. never combines unlike strains or uses name similarity, aliases without authoritative mapping, or cross-family marketing names.

Multiple Lots / Batches of the same canonical strain may be arithmetically grouped only if the wholesale offer, fulfillment, proof, and operations policies authorize such fulfillment and retain each Lot / Batch's provenance. That policy remains OPEN. Qualification does not establish eligibility, availability, evidence currentness, a negotiated price, or order acceptance.

## Atomic transaction boundaries

Each consequential command executes within the canonical Inventory boundary with a stable command/idempotency key and expected position/reservation version. The atomic write set includes the ledger entry/entries, folded position balances, reservation state where applicable, audit reference, and transactional outbox record.

| Command boundary | Must be atomic |
|---|---|
| `RESERVE` | Verify expected version and channel capacity; decrement Available to Promise; increment Reserved; create reservation and outbox event |
| `COMMIT` | Verify live Reserved state and order authority; decrement Reserved; increment Committed; update reservation; emit commitment event |
| `RELEASE` / `EXPIRE` | Verify eligible live state; decrement Reserved; restore governed free capacity; transition reservation once; emit release event |
| `FULFILL` | Verify exact Committed allocation and handoff authority; decrement Committed and Physical On Hand once; transition to Fulfilled |
| `CANCEL` | Evaluate current reservation/order/fulfillment state; apply only the authorized release or compensating entries; retain original outcome |
| `ADJUST` | Verify expected position version, authority, reason/evidence, approval threshold, and invariant equations; append exact correction and outbox event |
| `QUARANTINE` | Reclassify exact quantity, reduce sellable/available capacity, and identify affected allocations/reservations for recovery |
| `CHANNEL_REALLOCATE` | Verify free eligible capacity and allocations; move access without changing Physical On Hand |

Cross-domain order, payment, tax, and fulfillment orchestration is recoverable and idempotent; it is not one distributed database transaction. The transactional outbox publishes committed domain events after the local transaction. Replays rebuild projections but do not repeat external side effects without explicit deduplication.

A future location Transfer is not a distributed atomic move. Source dispatch, in-transit custody, and destination receipt are ordered, linked states. Destination stock cannot become sellable before receipt and inspection, and source/destination balances cannot count the same physical units simultaneously.

## Concurrency cases

- **Two customers request final stock:** compare expected position version and reserve within one atomic transaction. One succeeds; the other receives `Changed/Unavailable` and current context.
- **Wholesale reservation versus retail purchase:** both compete against the same physical position and allocation rules. Channel priority is owner policy, not last-write-wins.
- **Two staff adjust one position:** the stale expected version is rejected. The admin must reload, compare, and issue a reasoned new command.
- **Owner changes stock during checkout:** the canonical mutation increments position version and triggers cart revalidation. It cannot silently erase a valid reservation.
- **Receiving during reservations:** new receipt creates a new ledger version/position effect; it does not mutate or duplicate existing holds.
- **Quarantine after reservation/commit:** quarantine records truth immediately, suppresses affected availability, and raises explicit reservation/order recovery; it never continues fulfillment by hiding the state.
- **Price or media change during reservation:** those domains version independently. Inventory remains reserved, while Cart/PDP consumes current Price/Media and applies their own acknowledgment/fallback rules.

## Events and projections

Relevant canonical events include `Inventory Received`, `Inventory Reserved`, `Inventory Released`, `Inventory Corrected`, `Inventory Quarantined`, and `Inventory Restocked`. Additional event versions may represent commitment, fulfillment, damage, loss, stocktake, reallocation, and transfer without changing these governing semantics.

Events carry stable ID/type/version, producer, position aggregate/version, occurred/effective time, causation/correlation, actor/authority, source, sensitivity, and exact quantity effects. Delivery is at least once; consumers are idempotent and ordered per position/reservation where required.

Storefront, admin lists, search, alerts, and analytics use rebuildable projections that carry canonical source versions and observed time. A projection may display low stock only under an objective owner-defined rule. Projection lag is observable. Purchase authorization always rechecks canonical Inventory.

## Administrative authority and audit

Eventually authorized roles/capabilities must distinguish receiving, reserve/release/commit/fulfill, adjustment, quarantine, unquarantine, damage/loss, stocktake, allocation, transfer, approval, and audit review. High-risk thresholds, dual approval, and role assignments are OPEN and will be governed in [Admin Roles, Security, and Audit](./06-admin-roles-security-and-audit.md).

Every event records who acted, which capability and authority were used, source interface/device where governed, reason code and note, before/after version and exact quantities, related supplier/receipt/cart/order/quote/location/Lot references, approval when required, and the resulting propagation state. Restricted operational evidence is not copied into public projections.

## Failure and recovery rules

- Conflict returns the current version and state; it does not apply last-write-wins.
- Duplicate command returns the original canonical outcome; it does not repeat the quantity effect.
- Inventory service failure is `SERVICE_ERROR`; it is not zero stock, Sold Out, or success.
- Failed event propagation retries through the outbox and raises a durable operational signal. High-risk consumers suppress stale positive availability.
- Cart lines remain present with localized recovery. No silent removal, quantity reduction, product substitution, channel switch, or option reselection is permitted.
- An unknown payment outcome is reconciled against the original attempt before any inventory release or repeat charge.
- An invalid negative or overallocated position raises a reconciliation incident; it is never normalized away.

## Open gates

- operational inventory database/provider and persistence topology;
- actual Inventory Locations and initial stock;
- launch SKUs, quantity quanta, canonical unit/precision registry, measurement tools, and acceptable tolerances;
- supplier accounts, purchase-order and expected-receipt workflows;
- receiving, inspection, damage, quarantine, discrepancy, and evidence procedures;
- reservation duration, renewal, extension, expiry, and abandoned-cart rules;
- channel-allocation model, priority, free pools, safety-reserve values, and reallocation approvals;
- staff roles, high-risk adjustment thresholds, dual-control, stocktake cadence, and shrinkage investigation;
- partial mass sale, package opening/splitting/repacking, cross-lot fulfillment, returns, destruction, and return-to-stock rules;
- cancellation, release, capture timing, partial fulfillment, refunds, and returns policies;
- transfer locations, custody, dispatch/receipt, and in-transit loss procedure;
- accounting integration and cost/valuation ownership;
- exact alert thresholds and operational service levels.

No open gate may be filled with a guessed value, provider, timeout, quantity, or procedure.

## Related package documents

- [Catalog, Product, Variant, SKU, and Lot Model](./02-catalog-product-variant-sku-lot-model.md)
- [Pricing and Channel Offers](./04-pricing-and-channel-offers.md)
- [Supplier, Receiving, and Location Model](./08-supplier-receiving-and-location-model.md)
- [Integrations, Projections, and Transaction Boundaries](./09-integrations-projections-and-transaction-boundaries.md)
- [Decisions, Open Gates, and Next Step](./10-decisions-open-gates-and-next-step.md)

No live ledger, reservation engine, inventory value, operational provider, or production implementation is created or authorized by this document.
