# Chain of Custody, Failures, and Returns

## Custody principle

Package custody is explicit from verified release at the York origin through authorized handoff or verified return receipt. GPS, ETA, a driver tap, customer feedback, or payment state cannot substitute for custody evidence. Every transfer is append-only, correlated to the exact package, delivery, assignment, actor, time, location reference, condition, and proof/correction lineage.

The customer receives an appropriate summary, not the full internal ledger.

## Delivery lifecycle

### Normal path

```text
DRAFT
  → QUOTED
  → SELECTED
  → AWAITING_PAYMENT
  → PAID
  → PREPARING
  → READY_FOR_DISPATCH
  → UNASSIGNED
  → ASSIGNED
  → DRIVER_EN_ROUTE_TO_PICKUP
  → PICKED_UP
  → EN_ROUTE_TO_CUSTOMER
  → APPROACHING
  → ARRIVED
  → DELIVERED
```

### Exceptional states

```text
FAILED
CANCELED
RETURN_REQUIRED
RETURNING_TO_STORE
RETURNED_TO_STORE
```

### Transition guards

| Transition | Required guard/evidence |
|---|---|
| `DRAFT → QUOTED` | Current offerable quote and exact input versions |
| `QUOTED → SELECTED` | Customer selection before expiry; cart/destination binding |
| `SELECTED → AWAITING_PAYMENT` | Checkout validation, second age flow initiated/completed as required, handoff inputs ready |
| `AWAITING_PAYMENT → PAID` | Canonical Payment outcome; no timeout inference |
| `PAID → PREPARING → READY_FOR_DISPATCH` | Inventory allocation and verified package-preparation milestones |
| `READY_FOR_DISPATCH → UNASSIGNED` | Delivery admitted to active dispatch queue |
| `UNASSIGNED → ASSIGNED` | One accepted/authorized current assignment |
| `ASSIGNED → DRIVER_EN_ROUTE_TO_PICKUP` | Authenticated assigned driver command |
| `DRIVER_EN_ROUTE_TO_PICKUP → PICKED_UP` | Driver at origin, exact package verification, store-to-driver custody transfer, tracking/assignment context |
| `PICKED_UP → EN_ROUTE_TO_CUSTOMER` | Package remains in assigned custody and route is active |
| `EN_ROUTE_TO_CUSTOMER → APPROACHING` | Approved proximity/status evidence; optional operational milestone |
| `APPROACHING → ARRIVED` | Authenticated explicit arrival with current assignment |
| `EN_ROUTE_TO_CUSTOMER → ARRIVED` | Allowed when approaching telemetry is unavailable but explicit arrival is verified |
| `ARRIVED → DELIVERED` | Current age/handoff result, instructions, governed proof, actual handoff/drop timestamp/location, custody release |

### Exceptional transition register

| Source state(s) | Target state | Required guard/evidence |
|---|---|---|
| `ASSIGNED`, `DRIVER_EN_ROUTE_TO_PICKUP` | `UNASSIGNED` | Assignment released before pickup/custody after decline, cancellation, expiry, or vehicle exception; attempt and reason retained |
| `DRAFT`, `QUOTED`, `SELECTED`, `AWAITING_PAYMENT`, `PAID`, `PREPARING`, `READY_FOR_DISPATCH`, `UNASSIGNED`, `ASSIGNED`, `DRIVER_EN_ROUTE_TO_PICKUP` | `FAILED` | Authorized nonrecoverable pre-custody failure with reason; use a recoverable exception without changing to `FAILED` when retry remains active |
| `PICKED_UP`, `EN_ROUTE_TO_CUSTOMER`, `APPROACHING`, `ARRIVED` | `FAILED` | Authorized inability to complete after pickup; current custodian/package/condition and exception recorded |
| `SELECTED`, `AWAITING_PAYMENT`, `PAID`, `PREPARING`, `READY_FOR_DISPATCH`, `UNASSIGNED`, `ASSIGNED`, `DRIVER_EN_ROUTE_TO_PICKUP` | `CANCELED` | Future approved cancellation authority and package still in origin custody; financial consequence remains separate and OPEN |
| `FAILED` | `RETURN_REQUIRED` | Package remains outside authorized origin custody; return authority/reason recorded |
| `RETURN_REQUIRED` | `RETURNING_TO_STORE` | Driver/custodian begins governed return with package count/condition and route/tracking context |
| `RETURNING_TO_STORE` | `RETURNED_TO_STORE` | Authorized origin actor verifies receipt, count, condition, timestamp, and proof |

One failed driver offer does not fail or cancel the delivery. A recoverable delay, temporary tracking outage, or active reassignment remains in the current lifecycle state with an exception record; `FAILED` is used only when the delivery cannot continue to handoff on that lifecycle.

An authorized cancellation may enter `CANCELED` only under future policy and normally before driver custody. Exact authority and financial consequence remain **OPEN**. After `PICKED_UP`, inability to complete does not jump to cancellation; it creates a reasoned failure/exception and, while goods remain in driver custody, proceeds through `RETURN_REQUIRED → RETURNING_TO_STORE → RETURNED_TO_STORE` or an explicitly governed custody transfer.

`DELIVERED`, `CANCELED`, and `RETURNED_TO_STORE` are terminal operational outcomes. `FAILED` may be terminal before custody, or must lead to `RETURN_REQUIRED` when the package remains outside origin custody. A later correction appends audit/proof records and projections; it never rolls the lifecycle backward.

### Invalid transitions

- `DRAFT/QUOTED/UNASSIGNED → PICKED_UP`;
- `ASSIGNED/EN_ROUTE_TO_CUSTOMER → DELIVERED` without arrival/handoff/proof guards;
- `AWAITING_PAYMENT → PAID` from a driver, dispatcher, or client assertion;
- `PICKED_UP → CANCELED` while custody is unresolved;
- `ARRIVED → DELIVERED` when required verification failed, is pending, or is a service error;
- Leave at Door completion from `REQUESTED`, `DENIED`, or `DIRECT_HANDOFF_REQUIRED`;
- `FAILED/RETURN_REQUIRED/RETURNING_TO_STORE → DELIVERED`;
- `RETURNING_TO_STORE → RETURNED_TO_STORE` without authorized origin receipt;
- `RETURNED_TO_STORE → AVAILABLE` inventory by inference;
- telemetry, geofence, ETA, photo upload, or customer rating directly causing `DELIVERED`;
- `DELIVERED →` any active, failed, canceled, or return state.

## Pickup verification and package custody

At origin, the authorized store actor and driver verify:

- delivery/order/package IDs and current assignment/driver/vehicle references;
- origin, package count, declared combined weight, package class, and applicable seal/reference;
- exact order/package identity without exposing unnecessary product detail;
- visible condition and any discrepancy/damage;
- pickup timestamp, actors, device/session, and proof references required by future policy.

The store-to-driver custody transfer commits before `PICKED_UP`. A count/identity/condition mismatch blocks release and raises a Package/Custody exception. The package description may be corrected before release under authority; after release, corrections append and preserve what was originally verified.

Each custody entry includes stable event ID, package/delivery/order, prior and new custodian, assignment/driver/vehicle, reason/type, observed and recorded times, origin/location reference, count/condition, evidence reference/hash/metadata, state versions, actor/authority, and correction reference.

## GPS context

The custody ledger references the authorized tracking session and material location milestones but does not copy the full coordinate stream. A location observation can corroborate context; it cannot prove custody transfer, recipient identity, or completion alone. Missing/revoked/stale GPS creates a tracking exception and operational recovery without deleting custody or fabricating a route.

## Handoff and proof

### Authorized Leave at Door

Completion requires:

- current `LEAVE_AT_DOOR_AUTHORIZED` result for the exact delivery;
- current customer preference and governed location (`FRONT_DOOR`, `SIDE_DOOR`, `BACK_DOOR`, or approved other);
- current instruction version and driver acknowledgment where required;
- explicit arrival;
- actual drop location category/reference and timestamp;
- proof type/reference and capture metadata required by approved policy;
- driver custody release and delivery completion committed together.

### Direct handoff

Completion requires current `HAND_TO_ME` or `DIRECT_HANDOFF_REQUIRED`, the applicable delivery-age/handoff result/reference, explicit arrival, governed recipient/handoff proof category, handoff timestamp/location, and custody release. DN-01 does not declare signature, ID scan, photo, name, or raw document universally required; those remain qualified-policy inputs.

Proof is immutable evidence in controlled storage with stable reference, integrity metadata, capture actor/time/session, purpose, access control, verification status, and correction/addendum history. General logs/events contain references, not raw proof. A failed upload leaves proof pending/error and does not silently complete.

## Auditable chain-of-custody ledger

Every delivery preserves, where applicable:

- delivery and order IDs;
- driver, assignment, and vehicle references;
- pickup origin and timestamp;
- package count, declared weight, package class, and condition;
- routed distance, zone, quote/rate versions, and customer delivery fee;
- GPS session and permitted material tracking milestones;
- second age-verification result/reference;
- handoff authorization, preference, instructions, and change history;
- arrival, actual handoff/drop location and timestamp;
- proof-of-delivery reference;
- exception/failure reason and evidence;
- return-to-store lifecycle and receiving proof;
- completion/outcome timestamp;
- actor/authority, correlation, access, and correction history.

## Failure and recovery matrix

| Condition | Operational state/recovery | Prohibited inference |
|---|---|---|
| No driver available | Remain `UNASSIGNED`; record capacity/dispatch exception; disclose revised/unavailable promise only when authoritative; escalate under policy | No automatic cancellation, refund, or invented ETA |
| Driver declines/offer expires | Close assignment attempt; return to `UNASSIGNED`; offer another eligible driver if available | No customer/driver blame or Delivery failure from one decline |
| Driver cancels pre-pickup | Release assignment; preserve attempt/reason; reassign or fail under policy | No custody or customer cancellation assumed |
| Driver cancels/vehicle issue after pickup | Preserve current custodian; dispatch escalation; explicit replacement custody transfer or return | Driver cannot go available while package custody is unresolved |
| Vehicle issue pre-pickup | Driver/vehicle unavailable; release/reassign | No delivery completion or package damage inferred |
| Customer changes instructions | Version and acknowledge; if location/material context changes, re-geocode/re-route/reprice/re-evaluate | No silent route or authorization change |
| Customer unavailable | Perform approved contact/wait workflow (**OPEN**); Leave at Door only if already authorized; otherwise fail and return if in custody | No unattended drop from convenience |
| Verification fails/unverified/error | Do not hand off; allow governed retry if available; fail/return when unresolved in custody | No conversion to Leave at Door or positive age result |
| Tracking unavailable/stale | Show degraded/stale state and last update; alert dispatch; recover session/manual milestones under policy | No fabricated position, ETA, arrival, failure, or success |
| GPS permission revoked | Stop collection; mark session revoked; retain custody; operational escalation | No off-duty/unauthorized collection or automatic driver penalty |
| Destination unreachable | Record route/safety exception; do not improvise another destination; return if unresolved in custody | No proof based only on proximity |
| Wrong/ambiguous address | Require corrected authoritative destination and full material revalidation; otherwise return | Instructions do not secretly replace address |
| Package damaged before pickup | Block release, record proof/condition, route to origin operations | No delivery or inventory disposition inferred |
| Package damaged after pickup | Preserve custody, record evidence/exception, escalate and return or follow approved safety procedure | No automatic refund, delivery, disposal, or restock |
| Delivery cannot be completed | `FAILED`; if package in custody, `RETURN_REQUIRED` | No silent “delivered” or abandoned package |
| Customer cancellation where permitted | Apply approved authority/cutoff; pre-custody may cancel, in-custody follows return | No financial outcome invented |
| Support escalation | Create/link recovery/support case with evidence refs | Support does not rewrite custody/payment/eligibility truth |

## Return-to-store workflow

```text
RETURN_REQUIRED
  → RETURNING_TO_STORE
  → ARRIVED_AT_ORIGIN
  → RETURNED_TO_STORE
  → RECEIVING / INSPECTION / QUARANTINE / DISPOSITION in owning domains
```

The canonical Delivery lifecycle uses `RETURNING_TO_STORE` and `RETURNED_TO_STORE`; `ARRIVED_AT_ORIGIN` is a Return-to-Store milestone, not an extra Delivery state. Required evidence includes initiating exception/authority, current package count/condition, driver/custody, return route/tracking context, origin arrival, authorized receiving actor, receipt timestamp, condition/proof, and discrepancy/correction history.

`RETURNED_TO_STORE` means origin accepted custody. It does not mean refunded, credited, canceled, restocked, available, undamaged, or closed financially. Inventory inspection/disposition, Payment consequences, customer communication, and support recovery occur through their owning records and **OPEN** approved policies.

## Corrections and disputes

Original milestones, proof, location evidence, and custody transfers are never destructively edited. An authorized correction names the target, before/new interpretation, evidence, reason, authority, effective time, customer/operational impact, and propagation status. Disputed evidence may be access-restricted or held but not silently deleted. All affected customer/support/analytics projections are invalidated or rebuilt from the corrected canonical history.
