# Tipping, Feedback, and Service Recovery

## Separation of concerns

Tip intent, money movement, driver payable/payout, overall delivery feedback, driver feedback, and recovery are separate records with separate authorities. No one signal silently changes another:

- a selected tip is not captured money;
- a captured tip is not automatically payable or paid;
- tip is not merchandise, tax, fee, discount, credit, delivery revenue, or zone-minimum value;
- a low delivery score is not automatically a low driver score;
- feedback may open a recovery case but cannot authorize compensation;
- an exception does not invent a refund outcome.

## Tip entry points

The customer can choose `NO_TIP`, a configurable suggested amount/percentage, or a custom amount:

1. **Checkout** — before the delivery begins, composed into the payment request as a separate line/accounting component.
2. **Active Delivery Hub** — only if the selected payment and adjustment policy supports safe authorization/change while active.
3. **Post-delivery Delivery Hub** — only during a governed eligibility window and through an approved payment path.

Suggested values, minimum/maximum custom values, adjustment windows, payment method reuse, capture timing, payout timing, and tax/payroll treatment are **OPEN**. The interface must not say “100% goes to your driver” unless the future compensation model and actual accounting guarantee it.

## Tip lifecycle and ledger

Required states:

```text
NO_TIP
TIP_SELECTED → TIP_AUTHORIZED → TIP_CAPTURED → TIP_PAYABLE → TIP_PAID
      ↘ TIP_CHANGED ↗              ↘ TIP_ADJUSTED | TIP_REFUNDED
TIP_AUTHORIZED → TIP_CHANGED → reauthorization or governed cancellation
TIP_CAPTURED → TIP_ADJUSTED | TIP_REFUNDED
TIP_PAYABLE → TIP_ADJUSTED | TIP_REFUNDED
TIP_PAID → TIP_ADJUSTED | TIP_REFUNDED (only through governed financial correction)
```

Each command requires the current tip version, customer/authorized actor, eligible delivery/time context, currency, and idempotency key. `TIP_CHANGED` records prior and requested amounts and the resulting payment action; it never mutates a capture. Adjustments/refunds are compensating ledger entries with authority/reason and do not erase history.

Invalid transitions include `TIP_SELECTED → TIP_PAID`, `TIP_AUTHORIZED → TIP_PAYABLE`, payable/paid before capture, duplicate capture/payout on retry, silent amount change, tip inclusion in M1–M6, tip reclassification as delivery revenue, or a driver/dispatcher editing customer intent.

The append-only tip ledger records tip/order/delivery/driver references, source moment, suggestion/configuration reference when applicable, amount/currency, state, payment attempt/authorization/capture/refund references, payable and payout references, adjustment reason/authority, event/effective times, and audit correlation. General delivery views use a minimized current balance/status projection.

## Overall delivery satisfaction

After an operationally completed delivery, the Delivery Hub may offer a provider-neutral overall delivery-experience score from 1 through 5. It evaluates the whole BSDN experience—not automatically the driver. The prompt/question version, collection window, feedback eligibility, amendment/withdrawal, identity/session requirement, and use consent are **OPEN**.

For low or neutral experiences, support these structured issue categories:

- delivery took too long;
- ETA inaccurate;
- driver experience;
- instructions not followed;
- wrong drop location;
- package damaged;
- order/item problem;
- tracking inaccurate;
- age-verification friction;
- delivery fee/value;
- other.

The exact threshold for “low/neutral” is configurable and remains **OPEN**. Structured issues may be selected regardless of score where future experience policy permits. Optional comments are treated as potentially sensitive free text. `CUSTOMER_REQUESTS_CONTACT` is an explicit `YES` or `NO`; absence is not consent to contact beyond existing service/support authority.

For positive experiences, the provisional structured signals are:

- fast delivery;
- accurate ETA;
- great driver;
- easy tracking;
- instructions followed;
- smooth verification;
- careful handling;
- easy overall experience.

These labels are content candidates, not final approved copy. Their identifiers and question version remain stable even if display language changes.

## Driver feedback

An optional driver score and recognition set is a distinct `Driver Feedback` record. It is presented as a separate question and linked to the exact assignment segment. Recognition may include future approved categories such as professional, communicative, careful, helpful, or followed instructions; final content is **OPEN**.

Driver feedback cannot be inferred from overall delivery satisfaction. A low system score or issue involving prep, routing, price, tracking, verification, packaging, or policy cannot automatically create a negative driver-performance event. Any workforce use requires a separately approved fairness, access, review, appeal, retention, and minimum-evidence policy.

## Feedback lifecycle

```text
ELIGIBLE → OFFERED → SUBMITTED | DECLINED | EXPIRED
SUBMITTED → REVIEWED | RECOVERY_CASE_CREATED
SUBMITTED → AMENDED | WITHDRAWN only under approved policy
RECOVERY_CASE_CREATED → RECOVERY_IN_PROGRESS → RESOLVED | CLOSED | REOPENED
```

Submission is idempotent by delivery/question version/customer context. Amendment or withdrawal creates history; it never destroys the original audit record. Invalid transitions include feedback before an eligible outcome, another customer's submission, rewriting a score without history, or feedback directly changing payment, delivery, proof, or driver records.

## Recovery-case creation

A versioned trigger policy can open one `DELIVERY_RECOVERY_CASE` for the same qualifying feedback/exception and trigger version. Candidate triggers include future-approved low/neutral thresholds, serious categories, `CUSTOMER_REQUESTS_CONTACT=YES`, or an authorized support escalation. Trigger values remain **OPEN** and case creation is idempotent.

The case snapshot preserves:

- order, delivery, customer/feedback, driver/assignment, zone, and rate/quote references;
- quoted ETA/range and each actual milestone;
- preparation time, dispatch delay, travel time, arrival/handoff/completion context;
- handoff method, current instruction version, proof reference, package/exception state;
- issue categories, optional comment, driver feedback as separately permissioned, and contact request;
- tracking/age/handoff service-error context needed for diagnosis, without unnecessary raw sensitive evidence.

## Manager recovery workflow

```text
OPEN → TRIAGED → IN_PROGRESS → WAITING_FOR_CUSTOMER | WAITING_INTERNAL
  → RESOLVED → CLOSED
RESOLVED/CLOSED → REOPENED (new evidence or authorized customer response)
Any active state → ESCALATED
```

Authorized future actions may include contacting the customer, refunding the delivery fee, issuing an approved credit, escalating, or resolving without compensation. These are capabilities, not current promises. Each action requires role authority, reason, amount/reference where applicable, owning Payment/Order command, and outcome reconciliation. DN-01 does not automate compensation or establish refund/credit policy.

The customer receives accurate case/contact status only when an approved service policy supports it. A case cannot mark delivery facts false, alter proof, blame a driver, or set inventory disposition.

## Root-cause model

Root cause is a reviewed, evidence-linked classification, not a customer comment copied into an operational conclusion. Candidate domains include:

| Domain | Evidence examples |
|---|---|
| Preparation | Paid/preparing/ready milestones, package readiness |
| Dispatch/capacity | Ready-to-assignment interval, offer/decline/reassignment history |
| Route/travel | Route/ETA versions, accepted location milestones, road/unreachable exceptions |
| Tracking/ETA | Session freshness, adapter errors, estimate history |
| Age verification | Method/result/service status and timing, minimized references |
| Handoff/instructions | Preference/auth versions, acknowledgment, arrival/proof |
| Package/order | Condition, count, custody, item/order support context |
| Driver segment | Assignment-specific verified actions only |
| Service economics/value | Zone/rate/fee version and customer feedback |
| Unknown/multiple | Evidence insufficient or more than one material contributor |

Root-cause assignment and correction preserve reviewer, evidence refs, confidence/status, and history. `UNKNOWN` is valid; analytics never converts correlation into fault.

## Retention and reorder analysis

Feedback and recovery events may support repeat-delivery, retention, and reorder analysis only with approved purpose, consent/lawful basis, minimization, access, attribution window, and retention. Analytic joins use pseudonymous/canonical references; comments and precise location are excluded from general datasets. Current product/eligibility/availability is revalidated for every reorder—prior delivery success is not current purchase approval.

No KPI target, feedback-response rate, satisfaction threshold, recovery SLA, compensation rate, churn definition, or retention window is established in this phase.
