# Delivery Domain and Record Model

## Ownership model

BSDN remains inside the parent modular-monolith topology as a bounded first-party delivery capability. Cross-domain writes occur through versioned commands; changes propagate through an outbox; customer, driver, dispatcher, support, and analytics views are non-authoritative projections. Order owns purchase truth, Payment owns money movement, Inventory owns allocation, Eligibility owns legal/product/destination decisions, Identity/Consent own customer permissions, and BSDN owns delivery execution truth.

Every canonical record has a stable Blowin' Smoke ID, monotonic version where mutable, owner, source/provenance, created/observed/effective times, lifecycle state, sensitivity class, actor/service authority, correlation/causation references, and correction history. External IDs are aliases. Unknown values are explicit.

## Sensitivity classes

| Class | Meaning |
|---|---|
| D0 Public/operational | Non-personal policy or public-safe state |
| D1 Internal business | Rates, capacity, economics, vehicle and operational details |
| D2 Personal/precise location | Customer/driver references, addresses, instructions, live/history location |
| D3 Restricted identity/age/financial evidence | Age references, identity-document context, payment/tip and high-risk proof |

Retention periods are not invented. `OPEN—schedule required` means the record must support policy-based retention, deletion/anonymization where permitted, holds, export, and access audit before launch.

## Canonical record register

| Canonical record | Stable ID; logical owner | Source and lifecycle | Mutation model | Sensitivity; retention | Audit requirements and unresolved gates |
|---|---|---|---|---|---|
| **Delivery** | `deliveryId`; Delivery Orchestration | Accepted same-day Fulfillment Selection/Order; follows the delivery lifecycle | Mutable current state/version; identity, order link, and historical milestones immutable after creation; corrections supersede | D2; OPEN—schedule required | Audit every transition, actor, source version, failure and correction. Gates: promise authority, cancellation, completion, multi-stop policy |
| **Delivery Quote** | `deliveryQuoteId`; Quote and Serviceability | Exact cart/address/route/zone/package/capacity/rate inputs; `DRAFT → OFFERED → SELECTED`, then `EXPIRED/SUPERSEDED/REJECTED` | Calculation snapshot append-only; status and selection reference mutable by valid transition | D2 + D1; OPEN—financial/diagnostic schedule | Preserve breakdown, input versions, expiry, eligibility outcomes and selection. Gates: quote TTL, honor/reprice policy, tax/payment timing |
| **Delivery Zone** | `deliveryZoneId`; Service Policy | Authorized owner policy; `DRAFT → ACTIVE → PAUSED → RETIRED/SUPERSEDED` | Published versions append-only; activation state controlled | D0/D1; retain historical versions with quote/order needs; exact period OPEN | Audit bounds, inclusivity, origin, minimum/rate refs and authority. Gates: exact origin, active dates, operating approval |
| **Delivery Rate Version** | `deliveryRateVersionId`; Service Economics | Approved finance/operations policy; `DRAFT → APPROVED → ACTIVE → SUPERSEDED/RETIRED` | Published calculation and amounts immutable; successor required | D1; financial retention OPEN | Audit inputs/formula/rounding/overrides/effective dates. Gates: all dollar values, costs, margin/override authorities |
| **Delivery Package** | `deliveryPackageId`; Package and Custody | Packing/receiving operation linked to exact order lines; `PLANNED → PACKED → VERIFIED → RELEASED`, with exception/return states | Description/version mutable before release; custody facts append-only after release | D1, possibly D2/D3 by contents/rules; OPEN | Audit packer/verifier, count, declared weight/class, seals/refs, custody and corrections. Gates: packaging/weight procedure, prohibited/special handling |
| **Driver** | `driverId`; Driver Administration | Approved workforce process; `PENDING → ACTIVE → SUSPENDED/INACTIVE` | Profile/status versioned; historical identity and authorization evidence not overwritten | D2/D3; employment/contract retention OPEN | Audit onboarding, authorization, role/access, suspension, corrections. Gates: workforce/insurance/license/background/compensation policy |
| **Driver Availability** | `driverAvailabilityId`; Driver Operations | Driver and approved schedule/dispatch action; lifecycle follows driver availability states | Current availability mutable with timestamp/version; changes append to audit | D2 + D1; OPEN, minimize precise history | Audit actor, device/session, location-permission state and change reason. Gates: shifts, breaks, decline rules, location consent |
| **Driver Assignment** | `driverAssignmentId`; Dispatch | Dispatcher/assignment policy links delivery, driver, vehicle; `PROPOSED/OFFERED → ACCEPTED → ACTIVE → COMPLETED`, or declined/canceled/reassigned | Assignment terms snapshot; status versioned; attempts retained | D2 + D1; operational retention OPEN | Audit every offer/decision/reassignment, authority, timing, reason. Gates: auto/manual assignment, acceptance SLA, pay input |
| **Vehicle** | `vehicleId`; Fleet/Driver Administration | Approved vehicle registration/inspection process; `PENDING → ACTIVE → UNAVAILABLE/RETIRED` | Profile and eligibility versioned; inspection history append-only | D2 + D1; fleet retention OPEN | Audit ownership/authorization/status/change; do not expose to customer except approved descriptors. Gates: vehicle standards, insurance, inspections, cost method |
| **GPS Tracking Session** | `gpsTrackingSessionId`; Tracking | Starts only for authorized assignment/purpose; `PENDING_PERMISSION → ACTIVE → PAUSED/STALE → ENDED/REVOKED/FAILED` | Session state mutable; purpose/scope/driver/delivery binding immutable; observations separate | D2 high risk; shortest approved duration, OPEN | Audit consent/permission, token/device binding, start/end/revoke, access. Gates: lawful basis, retention, sampling, background behavior |
| **Location Observation** | `locationObservationId`; Tracking | Authorized driver device observation within active session; accepted/rejected/quality-classified | Append-only; correction adds annotation/new observation, never edits raw evidence | D2 high risk; minimized retention OPEN | Audit session, observed/received time, accuracy/quality, sequence, source, access; customer sees reduced projection. Gates: sampling, precision, off-route policy |
| **ETA Estimate** | `etaEstimateId`; Routing and ETA | Route/tracking/status inputs; `CURRENT → STALE/SUPERSEDED/FAILED` | Each estimate append-only; current pointer mutable | D2 + D1; operational/analytics retention OPEN | Audit model/adapter version, inputs, range/confidence, generated time and supersession. Gates: customer promise semantics, refresh thresholds |
| **Age Verification** | `ageVerificationId`; Delivery Age Qualification | Second delivery-specific process; `PENDING → VERIFIED_21_PLUS/UNVERIFIED/FAILED/SERVICE_ERROR`, with expiry/recheck | Attempt/result append-only; current result reference changes; raw documents not canonical | D3 restricted; minimum lawful/approved retention OPEN | Audit method separately from result, authority/version, timestamps, provider ref, access and expiry. Gates: legal sufficiency, accepted methods, retry, retention/deletion |
| **Handoff Authorization** | `handoffAuthorizationId`; Delivery Eligibility/Handoff Policy | Server evaluation of exact order, age result, product/destination and policy; authorized/denied/direct-required/unknown/error | Evaluation snapshot append-only; re-evaluation creates new version | D3/D2; policy/evidence retention OPEN | Audit all inputs/rule versions/result/reason; no client-authored authorization. Gates: authoritative handoff rules and exceptions |
| **Handoff Preference** | `handoffPreferenceId`; Customer Delivery Experience | Customer request after required age step; requested → effective/changed/superseded | Preference changes append as versions; current pointer mutable | D2; customer/order retention OPEN | Audit actor/session/time/request and displayed authorization. Gates: change cutoff and post-dispatch change procedure |
| **Delivery Instruction** | `deliveryInstructionId`; Customer Delivery Experience | Customer/authorized support input; `DRAFT → ACTIVE → ACKNOWLEDGED`, then changed/superseded/expired | Text/location choice versioned; acknowledgment append-only | D2; minimize after operational need, schedule OPEN | Audit author, time, sanitization, visibility, driver acknowledgment and changes. Gates: permitted locations/content, cutoff, accessibility/language |
| **Tip** | `tipId`; Tip Accounting | Customer intent plus Payment outcome; follows tip lifecycle | Monetary attempts/ledger facts append-only; selected amount may change through governed new version | D3 financial + D2 linkage; financial retention OPEN | Audit currency, basis, selection channel, payment refs, adjustment/refund/payable/paid. Gates: payment/payroll/tax/adjustment windows and suggested values |
| **Proof of Delivery** | `proofOfDeliveryId`; Handoff and Proof | Driver device at attempted/completed handoff; `PENDING → CAPTURED → VERIFIED/REJECTED`, with correction/hold | Original evidence and metadata append-only; access/redaction/verification state controlled | D3/D2; evidence retention OPEN | Audit capture actor/time/location/session, handoff type, asset rights/access, verification, viewing, corrections. Gates: required media/signature/ID evidence and retention |
| **Delivery Feedback** | `deliveryFeedbackId`; Customer Experience | Customer after delivery; submitted/amended/withdrawn under future policy | Submission append-only; governed amendment/suppression preserves history | D2; research/support retention OPEN | Audit scale/version, issue/positive labels, comment, contact request, channel and consent. Gates: collection window, moderation, customer rights |
| **Driver Feedback** | `driverFeedbackId`; Driver Experience | Optional customer input distinct from delivery score; submitted/amended/withdrawn | Append-only submissions; interpretation/performance linkage separately governed | D2/D3 employment impact; restricted retention OPEN | Audit question version, score/recognition, delivery context, access/use. Gates: workforce use, fairness/appeal, minimum sample |
| **Recovery Case** | `recoveryCaseId`; Delivery Support/Recovery | Feedback/exception/support action; `OPEN → TRIAGED → IN_PROGRESS → WAITING → RESOLVED/CLOSED`, with reopen | Case state/assignment mutable; timeline/actions/evidence append-only | D2/D3; support/financial retention OPEN | Audit trigger, context snapshot, access, actions, authorization, compensation reference, resolution. Gates: SLAs, roles, refund/credit authority, channels |
| **Delivery Exception** | `deliveryExceptionId`; Delivery Orchestration | System/driver/dispatcher/customer event; `OPEN → ACKNOWLEDGED → MITIGATING → RESOLVED`, or return/escalation | Original exception append-only; status/actions appended/versioned | D2 + D1; safety/operations retention OPEN | Audit category, severity, source, evidence, state impact, resolution and correction. Gates: taxonomy, escalation matrix, cancellation/refund consequence |
| **Return-to-Store** | `returnToStoreId`; Package and Custody | `RETURN_REQUIRED → RETURNING_TO_STORE → RETURNED_TO_STORE`, then receiving disposition | Custody milestones append-only; current state controlled; disposition owned by Inventory/Receiving | D2/D1, possibly D3; inventory/custody retention OPEN | Audit authority/reason, driver/package, route, custody, receipt verifier, condition, inventory handoff. Gates: return triggers, receiving hours, disposition/refund policy |
| **Delivery Audit Event** | `deliveryAuditEventId`; Audit, Provenance, and Corrections | Any high-risk command, transition, access, decision, correction, adapter result | Append-only and tamper-evident; correction references original and adds event | Class follows target, access most restricted; audit retention OPEN | Required actor/service, authority, target/version, before/after or outcome, reason, times, correlation, sensitivity/access. Gates: retention, legal hold, export, immutability controls |

## Record relationships

```text
ORDER + FULFILLMENT SELECTION
  └─ DELIVERY
      ├─ DELIVERY QUOTE ─ ZONE + RATE VERSION + ROUTE/CAPACITY REFERENCES
      ├─ DELIVERY PACKAGE ─ PROOF / CUSTODY / RETURN-TO-STORE
      ├─ DRIVER ASSIGNMENT ─ DRIVER + AVAILABILITY + VEHICLE
      ├─ GPS TRACKING SESSION ─ LOCATION OBSERVATIONS ─ ETA ESTIMATES
      ├─ AGE VERIFICATION ─ HANDOFF AUTHORIZATION
      │                         ├─ HANDOFF PREFERENCE
      │                         └─ DELIVERY INSTRUCTION
      ├─ TIP
      ├─ DELIVERY FEEDBACK + DRIVER FEEDBACK
      ├─ DELIVERY EXCEPTION ─ RECOVERY CASE
      └─ DELIVERY AUDIT EVENTS
```

## Write and projection rules

- Delivery orchestration may reference but never rewrite Order payment, Inventory allocation, or Eligibility truth.
- Dispatch cannot forge Age Verification or Handoff Authorization; driver/customer surfaces only acknowledge the current result.
- Location observations are evidence, not automatic delivery completion.
- Proof cannot alter the actual state without an authorized transition.
- Tip accounting cannot alter merchandise subtotal or zone-minimum satisfaction.
- Feedback cannot directly change driver employment/performance state or trigger automatic compensation.
- Corrections preserve prior evidence and publish invalidation/rebuild events to all projections.
- No provider identifier, address string, driver name, or order number substitutes for a stable canonical ID.
