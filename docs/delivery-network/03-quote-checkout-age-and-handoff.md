# Quote, Checkout, Age, and Handoff

## Governing principle

A quote is a time-bounded service and price offer, not legal approval, capacity forever, payment, or permission to leave an order unattended. Checkout composes independent versioned results and commits only when every material gate is current.

## Address, route, and quote sequence

1. **Address input.** Collect the minimum destination fields needed for serviceability. Preserve the customer-entered form separately from a normalized candidate. Never silently select among ambiguous addresses.
2. **Address validation/geocoding boundary.** A replaceable adapter returns a normalized address reference, coordinates at approved precision, match quality, deliverability hints, and `MATCHED`, `AMBIGUOUS`, `NOT_FOUND`, or `SERVICE_ERROR`. A match is not proof of legal/service eligibility.
3. **Routing boundary.** A replaceable adapter evaluates the active York origin to the selected destination and returns routed road distance/duration and route reference. `NO_ROUTE` and `SERVICE_ERROR` remain distinct; neither falls back to Haversine authorization.
4. **Zone assignment.** The unrounded routed distance is compared to the effective zone version. Display rounding cannot move an order across a boundary. No active zone returns a localized unavailable result.
5. **Transaction eligibility.** Evaluate exact product/variant, destination, customer/age context available at this stage, requested fulfillment, package, and current rule versions. `UNKNOWN` and `SERVICE_ERROR` block the material decision without being mislabeled illegal.
6. **Package-class evaluation.** Aggregate declared package weight. Standard is at most 30 pounds; unknown or overweight cannot silently pass.
7. **Merchandise-minimum evaluation.** Compare the governed qualifying merchandise subtotal to the zone minimum version. Return the explicit shortfall when known.
8. **Service window and capacity.** Confirm that the requested context is currently offerable. A future time option appears only from authoritative policy.
9. **Rate evaluation.** Calculate the customer fee from the effective BSDN rate version and record every component/override.
10. **Quote issuance.** Issue a stable quote ID with cart version, input/result references, calculation snapshot, currency, issued time, expiry, and status.

### Quote lifecycle

```text
DRAFT → CALCULATING → OFFERED → SELECTED
                    ↘ FAILED
OFFERED → EXPIRED | INVALIDATED | SUPERSEDED
SELECTED → COMMITTED_TO_DELIVERY | INVALIDATED | EXPIRED
```

Valid transitions require the current version and authorized actor. `OFFERED → SELECTED` binds the exact cart, destination, zone, package, rate, capacity, and eligibility versions. It does not itself capture payment. `SELECTED → COMMITTED_TO_DELIVERY` occurs once through an idempotent order/fulfillment command.

Invalid transitions include selecting an expired/invalid quote, editing an issued calculation, switching its destination/cart, committing a failed quote, or reusing it for another customer/order. Recalculation creates a successor quote.

Quote expiration duration, capacity-hold behavior, grace period, fee-honoring rules, and customer promise language are **OPEN**. Expiration is always explicit and server-evaluated.

## Checkout composition

The selected same-day path enters checkout with an exact quote reference. Before payment commitment, the server revalidates:

- cart/order-line identity, quantity, availability, price, and qualifying subtotal;
- destination normalization and current route/zone;
- product/destination/method eligibility;
- package class and declared weight status;
- service window and capacity;
- zone minimum and rate version;
- quote currency, expiry, selection, and currentness;
- second delivery-age result status;
- effective handoff authorization and required customer inputs.

The totals model keeps merchandise, discounts, credits, tax, customer delivery fee, and tip separate. Payment owns authorization/capture outcomes. BSDN supplies the delivery fee and tip instructions by stable references; it cannot mark an Order paid. A payment timeout or unknown outcome enters reconciliation and never triggers a blind second charge or false delivery.

After `PAID`, delivery orchestration consumes the accepted Order, fulfillment selection, inventory allocation, payment outcome, quote snapshot, age result, and handoff records exactly once. Capture/refund/cancellation timing remains governed outside this specification.

## Second delivery-specific age gate

The website's initial age qualification does not satisfy DN-01 by itself. Selecting Same-Day Delivery starts a distinct delivery-age record before the customer finalizes a handoff preference.

### Method and result are separate

Potential method values can include `DRIVERS_LICENSE`, `GOVERNMENT_ID`, `PASSPORT`, `DATE_OF_BIRTH_ASSERTION`, `APPROVED_ELECTRONIC_SERVICE`, or a future approved method. These are inputs/methods, not outcomes. Self-entered DOB remains an assertion unless authoritative rules establish otherwise.

Required result states:

| State | Meaning |
|---|---|
| `PENDING` | Required attempt has not reached an authoritative result |
| `VERIFIED_21_PLUS` | The approved process returned the governed positive result for this context |
| `UNVERIFIED` | Sufficient verification was not established; not necessarily misconduct |
| `FAILED` | The governed attempt returned a negative/failure result |
| `SERVICE_ERROR` | The verification capability did not complete; not a negative age determination |

```text
PENDING → VERIFIED_21_PLUS | UNVERIFIED | FAILED | SERVICE_ERROR
UNVERIFIED | FAILED | SERVICE_ERROR → PENDING (new governed attempt only)
VERIFIED_21_PLUS → PENDING (expiry, material context change, or authorized recheck)
```

Terminal attempts are immutable. A retry creates a linked attempt/version; it does not edit the old result. Invalid transitions include client-authored `VERIFIED_21_PLUS`, method-to-result inference, converting `SERVICE_ERROR` to `FAILED`, or reusing a result outside its approved subject/order/purpose/validity scope.

Store minimum provider/process reference, method category, result, authority/rule version, attempt/effective/expiry times, and correlation. Do not store raw identity-document images/numbers unless a future qualified requirement explicitly authorizes the collection, protection, purpose, and retention.

## Handoff preference and authorization

Age completion unlocks the preference step, but the customer only requests a method. The server derives the effective handoff using current age result, exact order/product/destination context, and authoritative handoff policy.

```text
Customer request: HAND_TO_ME | LEAVE_AT_DOOR_REQUESTED
Server result:    HAND_TO_ME | LEAVE_AT_DOOR_AUTHORIZED
                  | LEAVE_AT_DOOR_DENIED | DIRECT_HANDOFF_REQUIRED
```

Conceptual handoff lifecycle:

```text
PREFERENCE_PENDING
  → HAND_TO_ME
  → LEAVE_AT_DOOR_REQUESTED
       → LEAVE_AT_DOOR_AUTHORIZED
       → LEAVE_AT_DOOR_DENIED
       → DIRECT_HANDOFF_REQUIRED

Any effective result → PREFERENCE_PENDING / reevaluation
  only after an allowed customer change, age expiry, or material rule/order change
```

The customer and driver see the same authorization ID/version and friendly consequence. Neither client may upgrade `REQUESTED` to `AUTHORIZED`, suppress `DIRECT_HANDOFF_REQUIRED`, or complete a different handoff. `UNKNOWN` or `SERVICE_ERROR` in material authorization blocks unattended handoff.

### Leave at Door

When authorized, the customer may choose `FRONT_DOOR`, `SIDE_DOOR`, `BACK_DOOR`, or `OTHER_GOVERNED_LOCATION` and add governed instructions. The system records preference and authorization separately; request/authorization timestamps; every change; instruction version; driver acknowledgment; arrival; actual drop location; proof; and completion.

No liability waiver is implied. Permitted locations, instruction rules, proof requirements, age sufficiency, and change cutoff remain **OPEN** pending qualified policy.

### Hand to Me

Direct handoff records arrival, applicable identity/age requirement, recipient/handoff result category, timestamp, location/evidence references, and completion or exception. The package cannot be marked delivered merely because the driver arrived or location suggests proximity.

## Instruction changes

Instructions are versioned customer commands, not free-floating text. Before the governed cutoff, a change records old/new versions and notifies dispatch/driver. After assignment or arrival, the system may require dispatcher acknowledgment or reject the change according to future policy. It never silently edits the driver's already-displayed instruction.

A location-changing instruction can invalidate route, zone, price, eligibility, or capacity and must be treated as an address change—not a note. Unsafe, unlawful, impossible, or unsupported requests create an exception; the architecture does not invent the content policy.

## Revalidation triggers

Requote and re-evaluate all affected gates after any material change to:

- destination, origin, route availability/distance, zone activation/bounds, or service ceiling;
- cart line, quantity, discount, qualifying subtotal, price, product eligibility, or inventory;
- package count, weight, class, or handling status;
- rate version, override, service time/window, or capacity;
- customer/age result, validity, handoff preference/authorization, or instructions that alter location;
- fulfillment mode, payment state, order cancellation, or quote expiry.

Historical quote and decision snapshots remain unchanged. A changed customer fee, zone, minimum, handoff consequence, or availability requires explicit presentation and acknowledgment; it cannot be silently accepted.

## Customer-visible failure and recovery

| Failure class | Customer treatment | Canonical consequence |
|---|---|---|
| Address ambiguous/not found | Ask customer to select/correct; preserve cart | No route/zone authorization |
| Routing service error | Explain same-day could not be confirmed; permit retry/other valid mode | `SERVICE_ERROR`, not out-of-zone |
| Outside active ceiling/inactive zone | State same-day unavailable for this destination | Negative serviceability result with policy version |
| Below minimum | Show governed qualifying amount and shortfall | Quote not offerable until cart changes |
| Package unknown/overweight | Explain standard same-day unavailable; do not force standard class | Package-class result blocks |
| Capacity/service window unavailable | State current availability only; do not invent reopening | Quote unavailable/invalidated |
| Eligibility unknown/error | Explain that delivery eligibility could not be confirmed | Fail-safe decision; other mode only after its own evaluation |
| Age unverified/failed/error | Offer governed retry/support path; preserve cart | No permissive handoff or final commitment |
| Leave at Door denied/direct required | Keep same-day only if direct handoff remains valid and customer accepts | Authoritative result displayed on both surfaces |
| Quote expired/materially changed | Recalculate; disclose changed consequence | Successor quote and new acknowledgment |
| Payment uncertain | Reconcile original attempt; no duplicate submit | Delivery does not falsely enter paid state |

Recovery never promises a refund, credit, delivery time, or alternative fulfillment until the owning policy/domain authorizes it.
