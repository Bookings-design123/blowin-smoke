# Contracts, Events, and State Machines

## Contract envelope

Every canonical contract has a stable Blowin' Smoke identifier, monotonic record version, owning domain, source/provenance reference, observed and effective times, verification/publication status, currentness state, dependencies by stable ID/version, and audit context (actor/service, authority, command, correlation, reason and prior version). External/provider IDs are aliases. Unknown, stale, invalidated and service error are represented—not omitted.

## Canonical contract families

| Contract | Stable identity and owner | Required technical semantics | Dependencies / stale and unknown behavior |
|---|---|---|---|
| Product | `productId`; Product and Catalog | Division, type, role, identities, publication/version/provenance | Entity/taxonomy refs; unapproved/stale identity is not publishable |
| Variant | `variantId`; Variant and Option | Exact sellable configuration, identifiers, option values, status | Product/options; missing exact identity blocks commerce |
| Option | `optionId`; Variant and Option | Dimension/value, dependency, valid combination and selection status | Product/variant; incomplete required options produce Selection Required |
| Price | `priceId`; Price and Promotion | Variant scope, currency, basis, amount, effective interval and promotion reference | Variant/policy; stale/unknown blocks final price resolution |
| Inventory Position | `inventoryPositionId`; Inventory and Receiving | Variant, owned location, on-hand/reserved/committed/quarantined/damaged/available states and ledger version | Variant/location/receipts; conflict returns changed/unavailable |
| Inventory Reservation | `reservationId`; Inventory and Receiving | Cart/order reference, exact variant/location/quantity, state and policy reference | Position/cart/order; expiry duration remains OPEN; retry is idempotent |
| Media Assignment | `mediaAssignmentId`; Media and Rights | Asset, subject and variant/batch scope, role, order, rights, alt/crop intent and validity | Product/variant/batch/rights; invalid media falls back without changing identity |
| Proof Document and Applicability | `proofApplicabilityId` plus `proofDocumentId`; THCA Proof | Document/version/source/rights and exact product/variant/batch/sample applicability/currentness | Product/variant/batch/lab; missing, not supplied, unmatched, stale and superseded stay distinct |
| Compatibility Relationship | `compatibilityId`; Electronic Compatibility | Exact endpoints/revisions, direction, state, conditions, intermediary, evidence/verifier/review | Variants/components; absent evidence is Unknown, not Compatible |
| Physical-Fit Relationship | `physicalFitId`; Physical Fit | Exact endpoints, geometry, tolerance, intermediary, state and measurement/pair-test evidence | Variants/measurement records; incomplete material geometry is Unknown |
| Eligibility Evaluation | `eligibilityEvaluationId`; Age Qualification or Destination and Product Eligibility by scope | Evaluation type, exact context references, rule/effective version, result, reason category and service outcome | Customer context/product/destination/fulfillment; error is not Ineligible and unknown is not Eligible |
| Cart | `cartId`; Cart | Customer/session reference, line IDs, acknowledgments, fulfillment context, composed state/version | Current line evaluations; stale cart must revalidate |
| Cart Line | `cartLineId`; Cart | Exact variant, quantity, selected options, relationship context, source page and localized states | Variant/current decision contracts; never silently removed/reselected/substituted |
| Order | `orderId`; Order | Submit key, customer reference, immutable line snapshots, totals basis, decision/rule refs and lifecycle states | Cart, price, tax, payment and fulfillment outcomes; uncertain submit is reconciled |
| Order Line | `orderLineId`; Order | Exact purchased variant snapshot, quantity, price basis, proof/relationship references and fulfillment allocation | Variant and decision snapshots; history never claims current truth |
| Fulfillment Selection | `fulfillmentSelectionId`; Fulfillment | Shipping, York pickup or York delivery; context, eligibility result, fees/promises references and allocation state | Order/address/location/inventory/rules; incomplete selection blocks readiness |
| Shipment | `shipmentId`; Fulfillment | Carrier-adapter reference, package/order lines, status and events | Fulfillment selection/order; carrier error remains operational error |
| Pickup | `pickupId`; Fulfillment | York pickup location reference, allocation, readiness, release/verification state | Order/inventory/policy; exact location/hours/procedure remain gated |
| Local Delivery | `localDeliveryId`; Fulfillment | York delivery zone reference, schedule/routing state, allocation and handoff | Order/address/inventory/policy; radius/fee/promise remain gated |
| Support Context Bundle | `supportContextId`; Customer Support | Intent, source surface, exact record/version refs, known/unknown states, consented attachments and case link | Product/cart/order/proof/fit/policy; stale context labeled, customer assertion not catalog truth |
| Consent Record | `consentId`; Customer Identity and Consent | Subject, purpose, scope, status, effective/revoked time, source and policy version | Identity/policy; absence never implies consent |
| Audit and Correction Record | `auditRecordId`/`correctionId`; Audit, Provenance, and Corrections | Actor, authority, source, before/after versions, reason, effective time, propagation and access context | Any canonical record; immutable history and retryable propagation |

## Event envelope

Every event has `eventId`, event type/version, producer, aggregate ID/version, occurred/effective time, correlation/causation IDs, actor/authority class, payload categories, provenance reference and sensitivity classification. Delivery is at least once; consumers are idempotent. Per-aggregate ordering is required where stated. Replay rebuilds projections and audit views, not external side effects without explicit deduplication.

## Event catalog

| Event | Producer → consumers | Required payload categories | Idempotency / ordering / replay | Failure consequence |
|---|---|---|---|---|
| Catalog Record Approved | Catalog → Variant, Search, Media, Audit | product ID/version, division/type/role, source, approval | Required; product order; replay projections | Product remains unpublished downstream until consumed |
| Variant Changed | Variant → Price, Inventory, Search, Cart, Proof, Relationships | variant/product IDs, prior/new version, changed option/identifier fields | Required; variant order | Affected commerce revalidates; stale projection cannot authorize |
| Price Changed | Price → Search, PDP, Cart, Order, Audit | variant, prior/current price refs, effective time/basis | Required; variant-price order | Cart flags change; final total blocked until acknowledged/resolved |
| Inventory Received | Inventory → projections, Fulfillment, Audit | receipt/location/variant/quantity/status/source | Required; position order | Stock not available until receipt commits/inspection permits |
| Inventory Reserved | Inventory → Cart, Order, Fulfillment | reservation/position/cart-or-order, quantity/state | Required; reservation/position order | Progression waits or shows conflict; no oversell assumption |
| Inventory Released | Inventory → Cart, Order, Fulfillment | reservation/reason/quantity/position version | Required; reservation order | Capacity may remain held until retry/reconciliation |
| Inventory Corrected | Inventory → all stock consumers, Audit | position, prior/new ledger, reason/authority | Required; position order; replay audit/projections | Affected carts/orders revalidate; durable alert on propagation failure |
| Inventory Quarantined | Inventory → PDP, Cart, Fulfillment, Support | variant/location/quantity/reason category | Required; position order | Units excluded from available; allocations re-evaluated |
| Inventory Restocked | Inventory → Search, PDP, Cart, Notifications | variant/location/available-state reference | Required; position order | Projection/notification may lag; canonical check governs purchase |
| Media Assigned | Media → Search, Storefront, Support | assignment/asset/subject/role/rights/version | Required; assignment order | Textual fallback remains; no similar image substitution |
| Media Invalidated | Media → Search, Storefront, Support | assignment/asset/reason/effective time | Required; assignment order | Purge/invalidate caches; preserve identity without image |
| Proof Linked | Proof → PDP, Cart, Order, Search, Support | document/applicability/product/variant/batch/status/version | Required; applicability order | Claim stays suppressed until usable projection/current access |
| Proof Became Stale | Proof → PDP, Cart, Order, Support | applicability, prior/current status, rule version | Required; applicability order | Claims suppressed; affected purchase paths revalidate |
| Proof Unmatched | Proof → PDP, Cart, Support | document, attempted scope, unresolved identifiers/reason | Required; document order | Never apply by name similarity; route to owner/support |
| Compatibility Verified | Electronic Compatibility → Search, PDP, Cart, Support | relationship/endpoints/revisions/state/conditions/evidence version | Required; relationship order | Until consumed, affected positive claim remains unavailable |
| Compatibility Invalidated | Electronic Compatibility → Search, PDP, Cart, Support | relationship/prior state/reason/effective time | Required; relationship order | Active carts revalidate; cache/index invalidated |
| Physical Fit Verified | Physical Fit → Search, PDP, Cart, Support | relationship/endpoints/geometry/state/conditions/evidence | Required; relationship order | Positive fit unavailable until canonical/read path current |
| Physical Fit Invalidated | Physical Fit → Search, PDP, Cart, Support | relationship/prior state/reason | Required; relationship order | Active carts revalidate; fit becomes Unknown/invalidated as recorded |
| Eligibility Evaluated | Qualification/Eligibility → Cart, Order, Fulfillment, Audit | scope, context refs, rule version, result/reason/expiry | Required; evaluation order | Missing consumption blocks progression; no default allowed |
| Eligibility Evaluation Failed | Qualification/Eligibility → Cart, Order, Support, Ops | scope, context refs, error class, retryability, correlation | Required; attempt order | Service Error; never recorded/displayed as Ineligible |
| Cart Revalidated | Cart → Storefront, Order, Support, Audit | cart/version, line outcomes, precedence result, source versions | Required; cart order | Prior readiness expires; progression blocked until resolved |
| Cart Line Blocked | Cart → Storefront, Support, Audit | line, blocker type, reason refs, recovery and cart version | Required; cart-line order | Line preserved; customer receives localized recovery |
| Order Submitted | Order → Payment, Inventory, Tax, Fulfillment, Support | order/version, idempotency key, line snapshots, totals/decision refs | Required; order order; replay never duplicates side effects | Outcome reconciled; duplicate submit returns same order/outcome |
| Payment Authorized | Payment Boundary → Order, Inventory, Fulfillment, Audit | order/attempt/provider ref, amount/currency, outcome time | Required; attempt order | Order waits; never infer authorization from timeout |
| Payment Failed | Payment Boundary → Order, Cart, Support | attempt/order, failure category, retryability | Required; attempt order | Order not captured; safe recovery without duplicate order |
| Payment Captured | Payment Boundary → Order, Fulfillment, Finance Audit | order/attempt/capture ref, amount/time | Required; attempt order | Fulfillment does not infer capture until recorded |
| Payment Refunded | Payment Boundary → Order, Support, Finance Audit | order/attempt/refund ref, amount/reason/status | Required; refund order | Reconciliation alert; no duplicate refund on replay |
| Fulfillment Method Selected | Fulfillment → Eligibility, Inventory, Tax, Order | mode/context/allocation request, policy/rule refs | Required; selection order | Re-evaluate readiness; prior mode promises invalidated |
| Shipment Created | Fulfillment → Order, Account, Support | shipment/order/lines, carrier ref, status | Required; shipment order | Order shows pending/error; no invented carrier promise |
| Pickup Ready | Fulfillment → Order, Account, Support, Notifications | pickup/order/location ref, readiness/release-policy ref | Required; pickup order | Do not notify ready until committed; retry notification separately |
| Local Delivery Scheduled | Fulfillment → Order, Account, Support, Notifications | delivery/order/zone/schedule ref/status | Required; delivery order | Preserve unscheduled state; no invented time promise |
| Support Case Context Created | Support → Account, Operations, Audit | context/case/intent, record refs, consent/attachment refs | Required; case order | Safe draft/retry; no duplicate case or lost context |
| Correction Published | Audit/owning domain → every affected consumer | correction, target/version, authority, reason, effective time, impact set | Required; target order; replay propagation | Retry/alert; affected high-risk current state suppressed or revalidated |

## Purchase-readiness state machine

The evaluation order is exact and immutable:

1. age qualification;
2. destination eligibility;
3. product-specific eligibility;
4. product and selected-variant availability;
5. required-option completeness;
6. compatibility;
7. required components;
8. material proof requirements;
9. price resolution;
10. purchase-method completeness;
11. CTA or progression readiness.

Each step returns `PASS`, `BLOCK`, `ACTION_REQUIRED`, `UNKNOWN`, `NOT_APPLICABLE`, or `SERVICE_ERROR` as permitted by its domain. Evaluation stops progression at the highest-priority unresolved result while retaining all lower-level context for explanation and recovery. A positive lower state cannot override an unresolved higher state. The CTA/progression result is derived and versioned with every input reference; it is never independently authored.

## Key state machines

| Machine | States / transitions | Invariants |
|---|---|---|
| Catalog publication | Draft → In Review → Approved → Published; Published → Suspended/Corrected/Superseded | Supplier data never self-approves; missing required truth blocks publication |
| Inventory reservation | Requested → Reserved → Committed or Released; any pre-commit → Failed/Expired; position → Quarantined/Corrected | No negative available quantity; transitions idempotent; duration OPEN |
| Cart | Active → Revalidating → Ready or Action Required/Blocked/Service Error → Submitted/Abandoned | Lines persist through errors; changes require acknowledgment; submit key prevents duplicates |
| Order | Submission Pending → Submitted → Payment Pending → Authorized/Failed/Uncertain → Accepted → Fulfillment In Progress → Completed; cancellation/refund branches by approved policy | No false confirmation; historical snapshots immutable; policy details OPEN |
| Fulfillment | Unselected → Mode Selected → Eligibility/Allocation Pending → Ready for Handoff → In Progress → Completed; Failed/Exception with recovery | Shipping, pickup and delivery are distinct; mode change re-evaluates all affected inputs |
| Proof | Not Supplied/Missing/Unmatched → Current; Current → Stale/Superseded/Invalidated; history archived | Current means applicable/current, not favorable or eligible |
| Compatibility/Fit | Unknown → Verified state; verified state → Invalidated/Unknown; corrected → new version | Universal is bounded; successor/related separate; evidence required |
| Eligibility | Not Evaluated → Evaluating → Eligible/Ineligible/Unknown or Service Error; eligible result expires/re-evaluates | Error is not Ineligible; Unknown is not Eligible; exact context and rule version required |
