# Manifest, Dispute, Sales Policy, and Fulfillment Assurance

**Document role:** Feasibility semantics for the final wholesale manifest, independent time windows, transaction policy, qualification, negotiation, and fulfillment
**Implementation authority:** None

## 1. The manifest is a controlled presentation of canonical truth

The final wholesale manifest is not a disappearing chat message and not the order system of record. It is a D3 restricted, versioned projection of authoritative records owned by Product/Catalog, Price, Inventory, Eligibility, Order, Payment, Fulfillment, BSDN, Customer Identity/Consent, and Audit as applicable.

The customer presentation may expire. That expiration never authorizes deletion of canonical order, accounting, payment, fulfillment, delivery, consent, correction, dispute, support, security, or audit records that remain required under approved policy.

Manifest source fields must include enough current, authoritative information to verify:

- exact strain/SKU and variant identity;
- exact line quantity and unit;
- agreed unit price and price/quote version;
- line totals and order merchandise subtotal;
- tax/fee/delivery charge and total where applicable;
- selected fulfillment mode;
- material shipping, York pickup, or BSDN details appropriate to the customer's role;
- correction/version status and material conditions;
- final-sale policy wording and qualified exceptions applicable to the exact context.

Unsupported product facts, unavailable price/inventory, unresolved eligibility, or contradictory source versions block final presentation rather than becoming a persuasive guess.

## 2. Server-authoritative clock semantics

The original SEC-02 brief ended mid-formula. The complete correction brief now confirms the following exact governing semantics:

```text
FIRST_VIEW_AT = immutable server acceptance time of first explicit reveal
EXPIRES_VIEW_AT = FIRST_VIEW_AT + 5 minutes
DISPUTE_BEGIN_BY = FIRST_VIEW_AT + 30 minutes
```

`FIRST_VIEW_AT` does not mean a human saw, understood, or rendered every field. It means the server accepted an explicit authenticated reveal and began issuing the authorized response.

### Required first-view behavior

1. A normal link navigation, GET, HEAD, preview, prefetch, prerender, link scanner, notification delivery, or asset request must not start either clock.
2. The authenticated customer sees a pre-reveal summary explaining the two clocks, capture limits, and dispute route.
3. An explicit `Reveal manifest` action submits a fresh, purpose-bound, anti-CSRF request.
4. Server validates current account/session, signed approved client, supported platform/capture-control state, trusted endpoint, exact manifest/order/version, authorization, state, revocation, and policy. A browser, PWA, unsupported client, stale integrity result, or unknown control state receives no manifest data.
5. In one consistency boundary, server sets `FIRST_VIEW_AT` only if absent and derives both deadlines from the same authoritative clock; retry/concurrent requests return the same values.
6. The response receives an immutable view event/audit reference without sensitive payload duplication.
7. Refresh, focus, reconnect, another tab, another device, replay, or customer clock change never extends the deadlines.
8. Server clock health is monitored. Material clock uncertainty fails closed or enters explicit review, never silently grants/denies based on an untrusted client time.

### Transmission failure after clock start

A response can fail after the server has committed `FIRST_VIEW_AT`. Automatically resetting the clock would make the deadline replayable; never resetting could be unfair when no usable response arrived. This remains an owner/qualified-policy decision.

Required options for the next gate:

- one auditable staff reissue creates a new manifest presentation version under a documented failure reason, never edits the original timestamp;
- a narrowly proved “no substantive response delivered” recovery event, if the chosen delivery stack can demonstrate it reliably;
- staff-assisted dispute initiation without reopening the full manifest.

The system must not pretend that transport success proves human perception.

## 3. Five-minute access enforcement

**Future server access cutoff:** `PASS`.
**Whole feature:** `CONDITIONAL`.
**Guaranteed endpoint disappearance:** `FAIL`.

Required controlled-system behavior:

- online-only reveal; no offline manifest or service-worker/Cache Storage persistence;
- reveal only in a signed approved protected client; browser/PWA manifest delivery fails closed;
- object-level authorization for text, image, playlist, media segment/key, captions, and accessible alternatives;
- opaque high-entropy manifest-view grant scoped to exact account/session/manifest/version/purpose;
- grant verifier protected server-side; no customer/order IDs in the value; no value in navigation URL;
- strict no-store/private/referrer and third-party-resource boundary;
- no plaintext manifest details in email/SMS/push notification or browser title;
- server denies every new/refresh/range/segment/key request at or after `EXPIRES_VIEW_AT`;
- active client uses monotonic countdown and best-effort redaction, then clears controlled transient state;
- client revalidates on focus, visibility change, pageshow/back-forward restoration, online/reconnect, wake/resume, and refresh;
- expired, revoked, unknown, or service-error state fails closed with a route to the dispute/support process.

[RFC 9111](https://www.rfc-editor.org/rfc/rfc9111) makes clear that `no-store` is a best-effort cache directive and not a sufficient privacy guarantee. [Clear-Site-Data](https://www.w3.org/TR/clear-site-data/) cannot promise complete disk erasure. The client cannot guarantee redaction while JavaScript is frozen, the device is offline, the page is modified, or pixels are captured.

### Exact endpoint outcomes

| Situation | Server behavior | Active client behavior | Honest assurance |
|---|---|---|---|
| Tab open and online at +5m | Deny all subsequent protected requests | Timer redacts/removes view; recheck confirms expiry | `BEST-EFFORT` UI + enforceable future server denial |
| Tab backgrounded/suspended | Requests expire on server | Redact on resume/visibility event | Cannot promise exact local moment |
| Device goes offline after reveal | Server lease still expires | Timer may redact if running; reconnect denied | Cannot remove already rendered offline pixels |
| App restart/crash restore | Protected data must not be served from app cache; server denies refresh after expiry | Restore only after complete current reauthorization | OS/app remnants remain possible |
| Screenshot/recording through supported approved-client paths | No recall authority for prior output | OS exclusion plus app restrictions must pass before reveal | `NOT YET VERIFIED`; client remains conditional |
| Print/copy/save/forward/drag/export | Server denies owned actions and reusable resources | Approved client exposes no ordinary action | Application-enforced path; compromised endpoint remains |
| Assistive technology consumed output | Server access expires | Accessible view/timing must remain operable | Cannot retract remembered/externalized output |
| External camera | No control | None beyond visible individualized mark | Prevention `FAIL` |

## 4. Accessibility decision gate

A fixed five-minute timer for reading and verifying dense commercial content is likely subject to WCAG 2.2 [Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable). Unless the timing is adjustable/extendable, disabled, or qualifies as essential, the design may fail accessibility requirements.

Therefore:

- server five-minute access expiration is technically feasible;
- a fixed, non-extendable five-minute customer presentation is `BLOCKED` pending accessibility and qualified policy review;
- security intent alone does not establish the WCAG essential exception;
- assistive alternatives must receive equivalent protected information and not start a hidden earlier clock;
- any extension/reissue must be explicit, server-authoritative, auditable, and cannot silently turn five minutes into an arbitrary session.

Potential owner choices:

1. authorize a bounded customer extension before expiry under the accessibility rule;
2. make the five-minute high-detail reveal supplemental while a minimal accessible protected reference remains until the dispute deadline;
3. establish, with qualified evidence, that exact timing is essential and provide an equivalent staff-assisted verification route.

The correction adopts option 2 as the feasibility direction, combined with staff assistance. Exact accessible content, timing accommodation, transmission-failure/reissue, and qualified policy remain release blockers.

## 5. Thirty-minute dispute-initiation assurance

**Status:** `PASS` technically; policy details `CONDITIONAL`.

“Begin” means the server accepted an idempotent dispute-initiation request at or before `DISPUTE_BEGIN_BY` and returned a durable receipt. Opening a form, drafting text, calling without answer, or clicking while offline does not prove server acceptance unless the owner adopts an explicit outage/grace/manual policy.

The dispute-start path must:

- remain available after the full manifest view expires;
- require the same account and manifest/order reference without exposing the full manifest;
- offer structured reasons including wrong strain/SKU, quantity, price/total, fulfillment detail, access/transmission problem, and “other—requires protected support”;
- require only the minimum initial information to preserve the case;
- timestamp once, return a receipt, tolerate safe retries, and never extend the deadline;
- preserve original and corrected manifest/order versions; corrections append/supersede;
- route to the governing domain; the dispute system cannot rewrite canonical truth;
- retain outcome, authority, reasons, and evidence according to qualified policy.

### Five-minute/30-minute product tension

After the full manifest expires at five minutes, the customer has 25 minutes in which they may not remember enough detail to identify an error. The following models were evaluated before selecting the governing direction:

| Option | Behavior | Security/privacy tradeoff | Customer tradeoff |
|---|---|---|---|
| A — Minimal protected reference surface | Keep only manifest/version reference, concise line identity and quantity, issue categories, dispute deadline, receipt state, and action—without photos, video, private unit prices/totals, broader inventory, negotiation history, or full fulfillment detail—until +30m | More limited protected data remains visible | Customer can identify the line/reason |
| B — Initiate within five, complete within thirty | Customer must preserve a case during full view; details can be completed until +30m | Shortest full-detail exposure | High time pressure; accessibility burden |
| C — Staff-assisted initiation | Customer calls/requests callback before +30m; server receipt preserves time | Staff sees necessary canonical context under role | Availability/hold-time risk; auditable call workflow needed |

The full manifest must not remain visible for 30 minutes by accident. Option A plus staff fallback is the governing feasibility direction, subject to privacy/accessibility/policy approval. The minimal surface is available only in the same approved protected client and expires at `DISPUTE_BEGIN_BY`; after that, only a nonsensitive receipt/status route may remain under records policy.

## 6. Wholesale qualification and pricing

### One-strain threshold

**Status:** `PASS` as exact business logic; activation remains compliance/commerce-gated.

Qualification is evaluated by authoritative canonical strain identity using approved SKU/package mappings, variant-equivalence rules, and unit conversion:

```text
16 oz equivalent of Strain A across one or more eligible packages -> qualifies
8 oz Strain A package 1 + 8 oz Strain A package 2 -> qualifies only when both map to the same canonical strain and policy verifies variant equivalence
8 oz Strain A + 8 oz Strain B -> does not qualify
Unknown or undecided cross-SKU variant equivalence -> blocks that aggregation pending owner policy
```

No cross-strain aggregate, customer-facing bundle label, message statement, or representative preference can change this rule. Same-strain quantities may aggregate only through an authoritative canonical strain mapping and approved variant-equivalence policy. Variant/strain identity, unit basis, product eligibility, availability, and current policy version must be known. `UNKNOWN`, stale, unavailable, undecided equivalence, or conflicting evidence blocks wholesale classification.

### Private starting price and phone negotiation

The room may show a private starting/unit price from the Price owner. A sales representative may discuss quantity and propose a volume discount by phone within a documented authority. The phone call is not automatically E2EE and is not a canonical quote.

To become purchasable, agreed terms require deliberate declassification:

1. representative selects exact fields/terms and authority;
2. disclosure identifies what leaves private conversation and why;
3. customer confirms the exact proposed line/quantity/unit price;
4. Price/Inventory/Eligibility/Order owners revalidate current state;
5. canonical quote/order command is idempotent and versioned;
6. outcome and declassification receipt are durable and correctable;
7. message/call content is not copied wholesale into CRM, analytics, or order notes.

Open owner decisions: representative limits/dual approval, quote validity, call recording/consent, after-hours coverage, disagreement evidence, and whether a customer can request a text-only accessible negotiation alternative without weakening E2EE.

## 7. “All wholesale sales final” qualification

**Status:** `BLOCKED` pending qualified legal/compliance/payment/product/fulfillment review.

Owner commercial intent and authorized fulfillment-error exception can be represented, but no architecture may override mandatory statutory rights, payment-network/fraud rules, defective or nonconforming product duties, regulatory requirements, or another non-waivable obligation.

Policy outcomes must distinguish at least:

- pre-finalization manifest correction begun within the approved window;
- Blowin' Smoke wrong strain/SKU;
- Blowin' Smoke wrong quantity;
- price/total/manifest system error;
- missing/damaged/nonconforming/defective product context if applicable;
- payment fraud/unauthorized transaction/chargeback process;
- shipping/pickup/BSDN loss, custody, failed handoff, or return-to-origin;
- mandatory jurisdiction/product-specific right;
- customer preference/remorse subject to an approved final-sale policy;
- `UNKNOWN` or qualified escalation.

Customer copy cannot become an unqualified “no exceptions” promise. Every result carries policy version, authority, exact context, reason, evidence, correction, and appeal/escalation where required.

## 8. Wholesale fulfillment modes

Private conversation or room display never establishes that inventory, shipping, pickup, payment, or BSDN capacity exists. Approved modes are only candidates until the exact order passes current authority:

### Shipping

Requires exact product/destination eligibility, age/identity as applicable, carrier/provider capability, package/custody/proof/return rules, service/cost, and current policy. No provider or shipping program is selected.

### York pickup

Requires current pickup site/hours/capacity, order readiness, identity/age/handoff, custody/proof, exception and no-show/return policy. A private room cannot promise pickup merely because the mode exists in architecture.

### BSDN same-day delivery

Retail BSDN retains the owner-approved initial 120-routed-mile envelope. Wholesale high-value service may extend beyond it only through an independently versioned wholesale service envelope. It is not a hardcoded enlargement of retail M1–M6.

Required wholesale-zone inputs:

- routed origin-to-destination distance and route confidence;
- order product/destination eligibility and delivery-specific age/handoff;
- package weight/custody/safety and vehicle/driver capability;
- available operating hours, driver/dispatcher capacity, weather/route risk;
- wholesale zone/rate version and quote expiry;
- internal cost, expected duration, mileage, labor/driver economics and exception exposure;
- high-value security/custody/communication controls;
- audit, correction, cancellation, return-to-origin and recovery.

Above-120 service remains `CONDITIONAL/BLOCKED FOR ACTIVATION` until owners approve the exact envelope and operations evidence.

## 9. Free same-day delivery over $1,000

**Rule feasibility:** `PASS`.
**Activation:** `CONDITIONAL` on eligible BSDN service and financial/operations approval.

The owner-intended threshold uses authoritative wholesale merchandise subtotal before tax/fees unless a later governing policy changes it:

```text
if WHOLESALE_MERCHANDISE_SUBTOTAL > $1,000
and exact order is eligible and serviceable for approved WHOLESALE_BSDN:
    CUSTOMER_DELIVERY_CHARGE = $0
    INTERNAL_DELIVERY_COST remains recorded
```

“Over” means strictly greater than $1,000, not equal, unless the owner changes the policy. Corrections/refunds must recalculate through a versioned policy, not mutate history.

Separate measures:

- merchandise subtotal and price/quote version;
- customer delivery charge;
- internal route/labor/vehicle/exception cost;
- promotion/subsidy amount and authority;
- retail versus wholesale attribution;
- margin/contribution projection and actual;
- quote versus final actual;
- corrected/cancelled/returned outcomes.

The customer may see “free same-day delivery” only when current serviceability is proven. `$0` charge must never erase the real delivery cost or imply every address/order qualifies.

## 10. Required owner decisions before implementation authorization

1. Exact meaning of first authorized view and transmission-failure/reissue handling.
2. Accessible timing model or qualified essential exception.
3. Exact fields, accessibility behavior, outage/grace, and staff coverage for the governing minimal protected reference plus staff fallback.
4. Wholesale account/qualification policy owner, review, suspension, and appeal.
5. Approved strain/SKU identity and quantity conversion rule authority.
6. Representative negotiation/discount limits, dual approval, quote expiry, and call documentation/consent.
7. Qualified final-sale and mandatory-exception policy by product/jurisdiction/payment/fulfillment context.
8. Shipping/pickup methods, providers, age/handoff/custody/returns, and operating readiness.
9. Wholesale BSDN service envelope beyond 120 miles, capacity, driver safety, high-value custody, hours and exception handling.
10. `$1,000` threshold activation, exclusions, strict `>` interpretation, promotion authority, and financial guardrails.

## 11. Final outcomes

| Capability | Outcome |
|---|---|
| Explicit server-set first-view event | `PASS` |
| Separate immutable +5m and +30m deadlines | `PASS` |
| Deny future manifest requests after +5m | `PASS` |
| Guarantee removal from an offline/open/compromised endpoint | `FAIL` |
| Fixed five-minute presentation accessibility | `BLOCKED` pending qualified review |
| Server-received dispute start by +30m | `PASS` |
| Minimal protected line/dispute reference during remaining 25 minutes | `CONDITIONAL`; governing direction selected, exact accessible fields/outage/staff policy blocked |
| One-strain one-pound threshold | `PASS` as business rule |
| Phone-negotiated price becomes order automatically | `FAIL` |
| Deliberate canonical quote/order conversion | `CONDITIONAL` |
| Unqualified “all wholesale sales final” | `BLOCKED` and unsafe as absolute copy |
| Shipping/York pickup/BSDN as governed modes | `CONDITIONAL` |
| Wholesale BSDN beyond retail 120 miles | `CONDITIONAL`, activation blocked pending operations evidence |
| `$0` same-day charge above $1,000 while preserving cost | `PASS` as model; activation conditional |
