# Inventory, Cart, Order, and Fulfillment

## A. Purchase-and-hold inventory

Blowin' Smoke owns purchased inventory. No stock exists yet and no inventory provider/system is selected. The architecture therefore defines a canonical inventory ledger without inventing quantities, locations beyond the settled York service geography, reservation durations or procedures.

| State | Meaning and allowed transition |
|---|---|
| Received | Counted intake tied to exact variant, source, receiving event and location; not automatically sellable |
| Inspection Pending | Awaiting applicable identity, package, damage, proof, measurement or other receiving checks |
| Available | Owned units approved and allocatable for a specific location/mode subject to eligibility |
| Reserved | Temporarily held by an idempotent cart/order reservation; still owned, not committed |
| Committed | Allocated to an accepted order and unavailable to other demand |
| Damaged | Physically damaged units excluded from available stock pending disposition |
| Quarantined | Units withheld because identity, proof, condition, authenticity, recall or other material truth is unresolved |
| Unavailable | Derived inability to allocate the exact variant/location; not a legal or compatibility state |
| Corrected | Authorized ledger adjustment preserving prior quantity, reason, actor and audit |
| Restocked | Availability transition after new receipt or approved return-to-stock process; not a promise of future date |

Inventory position is tracked per exact variant and owned location. `available = eligible-to-allocate owned units`, not merely physical count. Reserved, committed, damaged and quarantined quantities are separately auditable. Receiving never infers package contents, proof, measurements or compatibility from title or imagery.

Allocation is conditional on the chosen fulfillment mode and the mode's operational location. A reservation command contains an idempotency key, position version and exact quantity. Conflicts return current state and preserve the cart line. Reservation duration, extension and expiry are **OPEN** policy/operations inputs.

## B. Three fulfillment modes

| Mode | Scope | Eligibility | Allocation/reservation | Price/fee and promise | Failure recovery / operational handoff |
|---|---|---|---|---|---|
| Nationwide eligible shipping | Shipping only where exact customer, product, destination and method are eligible; “nationwide” is intent, not universal eligibility | Age, destination, product and method evaluated with current rule version | Allocate from an approved shippable owned location; reserve before acceptance according to OPEN policy | Carrier/rate/tax inputs via adapters; no rate, carrier, timeline or packaging promise invented | Service/rule failure blocks progression; address/method recovery preserves cart; accepted order hands to shipping workflow |
| York, Pennsylvania pickup | York only | Age/product plus pickup-method and release rules; destination shipping eligibility does not substitute | Allocate/reserve at the selected York pickup location; exact location remains gated | Pickup fee, hours and ready promise are OPEN | Location/stock/release failure offers another valid method only after full revalidation; handoff ends at verified release |
| York, Pennsylvania local delivery | York only | Age/product plus entered destination within an approved York delivery scope and delivery method rules | Allocate/reserve from the delivery-serving York location | Radius, zone, fee, schedule, service level and verification procedure are OPEN | Out-of-scope/service failure is distinct from product ineligibility; preserve order/cart and permit re-selection/revalidation |

A fulfillment change invalidates affected eligibility, inventory allocation, fees, tax, promise and readiness. No method silently substitutes for another.

## C. Cart behavior

### Quick Cart

Quick Cart confirms an add or failure, exact line identity, selected options, quantity, current price/availability and highest material issue. It routes complex resolution to Full Cart and does not claim checkout readiness. Add/update/remove commands are idempotent. A failed add preserves attempted product/selection context and never creates a phantom line.

### Full Cart

Full Cart is the canonical revalidation checkpoint. It reads every exact line and current source version, evaluates purchase readiness in the governing order, exposes price/availability changes, validates cross-line relationships and fulfillment context, and derives progression. It preserves unavailable/blocked lines with recovery. No silent removal, substitution, option reselection, quantity change or product reinterpretation is allowed.

Price changes store prior/current references and require acknowledgment according to an OPEN owner policy. Compatibility and physical fit name both endpoints. Required components name exact verified requirements and never auto-add. Proof attaches only to exact product/variant/batch scope. Eligibility service error remains an error and cannot be converted to restriction or success.

## Cart state machine

```text
ACTIVE
  → REVALIDATING
    → READY
    → ACTION_REQUIRED (selection, acknowledgment, required component)
    → BLOCKED (restricted, unavailable, incompatible, material proof failure)
    → UNKNOWN (material decision truth unresolved)
    → SERVICE_ERROR (evaluation did not complete)
  → SUBMISSION_PENDING
    → SUBMITTED | ACTIVE_WITH_FAILURE
  → ABANDONED / EXPIRED under future approved policy
```

Every transition carries cart version and idempotency key. Concurrent mutation returns a version conflict and current cart, not last-write-wins loss.

## D. Order composition

Order submission is one idempotent command over a revalidated cart version. It creates an order identity, immutable line snapshots, decision/rule references and submission audit exactly once. It then orchestrates inventory, tax, payment and fulfillment using explicit attempts and compensations rather than a distributed transaction.

```text
SUBMISSION_PENDING
  → SUBMITTED
  → PAYMENT_PENDING
    → PAYMENT_AUTHORIZED | PAYMENT_FAILED | PAYMENT_OUTCOME_UNKNOWN
  → ACCEPTED
  → FULFILLMENT_IN_PROGRESS
  → COMPLETED
```

Cancellation, release, capture timing, refunds, partial fulfillment and returns require future approved rules. The architecture reserves explicit states but invents no transition authority. An unknown payment outcome never produces success or an automatic second charge; reconciliation uses the original attempt/idempotency reference.

Order lines preserve the exact purchased variant and relevant price, proof/batch, compatibility/fit, eligibility and fulfillment references as historical context. Current reorder/replacement paths revalidate current truth rather than copying historical approval.

## Operational consistency and recovery

- Inventory reservation/position updates are atomic within Inventory.
- Order creation/line snapshots/outbox are atomic within Order.
- Cross-domain orchestration is recoverable and idempotent; compensation releases reservations only under an approved state transition.
- Cart and order errors localize to the affected line or capability while preserving valid context.
- Fulfillment adapters cannot mark an Order paid; Payment cannot allocate inventory; Inventory cannot declare eligibility.
- Support receives exact cart/order/attempt/allocation context with consent and minimum private data.
- All promises remain references to approved effective policies; absent policies are displayed as unresolved and block any material commitment.
