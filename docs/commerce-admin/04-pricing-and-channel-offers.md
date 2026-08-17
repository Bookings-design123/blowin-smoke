# Pricing and Channel Offers

**Phase:** COM-ADM-01

**Status:** Governing commerce-administration architecture

**Implementation status:** Architecture only; no production implementation is authorized

## Purpose and authority

This document defines exact money semantics, price ownership, channel offers, Private Wholesale reference pricing and negotiated quotes, promotion/history rules, and admin concurrency for Blowin' Smoke. It specializes the Price model in the governing [Data Model & Catalog Schema](../system/03-data-model-catalog-schema.md) and keeps Price separate from Inventory, Tax, Payment, Eligibility, and fulfillment promises.

The same canonical Product and Sellable Variant may be offered through Retail or Private Wholesale and may be eligible for shipping, York pickup, or BSDN same-day delivery. An offer is a governed commercialization record; it is never a duplicate Product, Variant, SKU, or physical Stock Position.

No actual price, currency policy, discount, promotion, fee, supplier cost, quote, provider, or sale term is established here.

## Governing invariants

1. Price is owned by the `Price and Promotion` domain. It does not own inventory, tax, payment authorization, customer eligibility, or fulfillment.
2. Every price has exact Sellable Variant or defined Bundle scope, currency, basis, source owner, status, effective interval, record version, and audit history.
3. Canonical money and price arithmetic never use binary floating point.
4. Retail Price, Wholesale Reference Price, Negotiated Quote Price, Promotional Price, and Historical Price remain distinct records and meanings.
5. Negotiating one customer's price never rewrites the Wholesale Reference Price or another customer's quote.
6. A Channel Offer controls presentation and commercialization in one governed context. It does not create stock or bypass purchase readiness.
7. Retail visibility, Wholesale visibility, and fulfillment-method eligibility are independent permissions.
8. Wholesale-only price, inventory, evidence, profile, media, and sales state remain access-controlled even when the Product is publicly published for Retail.
9. Price changes are new effective-dated versions. History is never overwritten.
10. An expired, stale, unknown, conflicting, invalid, or service-error price cannot authorize final price resolution.
11. `From Price` and displayed savings are derived from valid records; they are not manually authored facts.
12. A stale cache, search result, product page, cart, or quote projection cannot authorize a price. The canonical Price domain and exact accepted quote decide.
13. Routine price and offer changes occur through authorized Blowin' Smoke Admin commands, not GitHub, code, deployment, Codex, or developer intervention.

## Canonical pricing and offer objects

| Object | Responsibility | Explicitly does not own |
|---|---|---|
| `Price` | Exact monetary amount or unit-price basis for one sellable scope, currency, price class, effective interval, and context | Stock, tax law, payment outcome, eligibility, or visibility |
| `Channel Offer` | Governs whether and how a canonical Variant/Bundle is presented in a channel, including price reference, quantity bounds, allocation reference, qualification, copy, visibility, and fulfillment-method permissions | Product truth or duplicate physical inventory |
| `Promotion` | Time- and rule-bounded pricing/merchandising context that may select a Promotional Price | Category/type identity, permanent compare-at basis, or arbitrary urgency |
| `Negotiated Quote` | Confidential customer/inquiry-specific commercial proposal with exact items, quantities, price basis, effective/expiry state, representative authority, and conversion references | Reference price, stock ownership, reservation, payment, or accepted Order by itself |
| `Quote Line` | Exact Variant, quantity/unit, optional exact Lot / Batch scope when intentionally offered, unit/extended price basis, and conditions | Generic product-name promise or inferred availability |
| `Price History Record` | Immutable prior version and context retained for audit/reconciliation | Automatically displayable compare-at price or active selling price |
| `Channel Allocation Reference` | Link to the same canonical Inventory pool/partition used by the offer | Independent stock count |

## Exact money contract

### Money representation

Canonical Money records:

- integer `minorAmount` in the governed minor unit;
- controlled currency code;
- currency exponent/scale definition and registry version;
- sign only where the specific accounting/adjustment concept permits it;
- exact source and effective context.

No canonical amount, comparison, discount, quote calculation, order line, or ledger effect may use IEEE-754 `float` or `double`. Display formatting is a projection and cannot alter the stored amount. Amounts in different currencies never compare, add, subtract, rank, or aggregate without an explicit governed conversion record; no exchange-rate architecture is approved here.

The currency set, exponent registry, supported rounding rules, tax rounding, and display conventions are **OPEN — FINANCE / PLATFORM DECISION REQUIRED**. The architecture must not assume a single currency merely because initial operations may be domestic.

### Quantity-based price representation

When a Price is per unit of mass or count, store the rate as an exact rational relationship:

```text
unit price = integer minorAmount / exact canonical quantity denominator
```

The quantity denominator uses the exact no-float semantics in [Inventory Ledger and Reservations](./03-inventory-ledger-and-reservations.md). An extended amount is computed with integer/rational arithmetic. If the result is not an integral minor currency amount, the system applies only an approved, versioned rounding rule at the approved stage and records the rule and resulting amount. No hidden repeated rounding is permitted.

Package price and per-unit display are separate concepts. A per-unit display may be derived from a package price but must disclose its basis and cannot become the charged amount unless the offer explicitly sells that exact quantity basis.

### Price validity

A price is usable only when all of the following hold:

- exact Variant/Bundle and purchase basis resolve;
- currency and amount are valid;
- price class and channel/purchase context apply;
- source owner and approval are current;
- effective start has been reached and optional end has not passed;
- record is not stale, conflicting, superseded, withdrawn, or invalidated;
- required promotion or accepted-quote conditions are satisfied;
- canonical version can be referenced by Cart and Order.

An amount of zero is a deliberate exact value requiring the same authority; it is not a substitute for Missing/Unknown. Negative selling price is invalid unless a separate approved credit/adjustment domain expressly permits it.

## Price classes

| Price class | Meaning and use | Required protections |
|---|---|---|
| `RETAIL_PRICE` | Standard current retail selling basis for an exact sellable scope and active Retail offer | Cannot apply to Wholesale merely because the same Variant is referenced |
| `WHOLESALE_REFERENCE_PRICE` | Private reference amount shown to qualified/authorized Wholesale context before individual negotiation where governed | Must not be exposed publicly; does not promise final price, stock, or acceptance |
| `NEGOTIATED_QUOTE_PRICE` | Customer/inquiry-specific agreed proposal for exact quote lines, quantities, conditions, and effective window | Confidential scope; cannot rewrite a reference price or another quote; requires quote conversion/revalidation |
| `PROMOTIONAL_PRICE` | Bounded price selected under an approved Promotion and exact eligibility/stacking conditions | Start/end, rule, owner, basis, channel, and precedence required; expiration restores resolution from other valid records rather than mutating history |
| `HISTORICAL_PRICE` | Prior governed price/version retained for audit, order support, analysis, or allowed historical context | Not an active price and not automatically a lawful/valid Compare-at Price |

These classes coexist with the governing concepts `Current Price`, `Compare-at Price`, `Sale`, `From Price`, `Option-dependent Price`, `Bundle Price`, and future conditional `Recurring Price`:

- `Current Price` is the valid price selected for the exact context at evaluation time.
- `Compare-at Price` requires a valid owner-approved reference basis; Historical Price alone does not establish that basis.
- `Sale` is the relation between a current Promotional Price and its bounded promotion; it is not taxonomy.
- `From Price` is the derived minimum across the disclosed set of currently valid sellable states.
- `Option-dependent Price` resolves only after the exact Variant is selected.
- `Bundle Price` applies to defined member Variants/quantities and current bundle conditions.
- `Recurring Price` remains future-only until the recurring purchase, term, cancellation, and authorization model is approved.

No discount policy, promotion-stacking rule, markdown authority, price-match promise, or recurring commerce model is defined here.

## Channel model

### Independent visibility and fulfillment dimensions

A canonical Product/Variant may independently hold:

- `RETAIL_VISIBLE` or not Retail-visible;
- `WHOLESALE_VISIBLE` or `WHOLESALE_HIDDEN`;
- `SHIPPING` eligible, ineligible, unknown, or service error for the exact context;
- `YORK_PICKUP` eligible, ineligible, unknown, or service error;
- `BSDN_SAME_DAY` eligible, ineligible, unknown, or service error.

Visibility does not establish eligibility, and eligibility does not establish stock. A public Product may have no Retail offer. A Wholesale offer may exist while public Retail visibility is off. Publishing a Product or Retail offer never exposes protected Wholesale fields.

The three fulfillment modes remain separate. Changing mode re-evaluates destination/product eligibility, inventory allocation, fee/tax inputs, promise, and purchase readiness. No mode silently substitutes for another.

### Channel Offer contract

Every Channel Offer records, as applicable:

- stable `channelOfferId`, version, owner, status, and audit context;
- exact Product/Variant/Bundle identity and channel;
- access classification and visibility state;
- active Price reference or price-resolution policy reference;
- exact minimum/maximum quantity and quantity unit;
- canonical Channel Allocation or shared-pool reference;
- qualification rule references, never hard-coded descriptive copy;
- permitted fulfillment modes and their eligibility-rule references;
- approved merchandising copy separate from Product facts;
- effective start/end, publication state, and currentness;
- recovery/support route for unavailable, unresolved, or restricted states.

A Channel Offer may narrow access to canonical stock but cannot increase Physical On Hand or Available to Promise. Retail and Wholesale offers referencing the same shared pool compete through canonical Inventory reservation. Hard allocations sum to no more than the eligible free pool. See [Inventory Ledger and Reservations](./03-inventory-ledger-and-reservations.md).

Offer copy cannot redefine price, product truth, proof, fit, or eligibility. A minimum order label must derive from the exact governed quantity rule. A manually entered `Only N left`, fake deadline, or invented Compare-at Price is prohibited.

## Private Wholesale offer architecture

Private Wholesale must preserve discreet/private access, lightweight account handling, pseudonymous inquiry where approved, private inventory/menu, private reference prices, case-by-case negotiation by sales representative/phone, formal quote-to-order conversion, protected media, detailed product/strain profiles, exact current availability, and applicable evidence.

Admin must treat these as independently governed Wholesale fields or references:

- `WHOLESALE_VISIBLE` / `WHOLESALE_HIDDEN`;
- `WHOLESALE_REFERENCE_PRICE`;
- `WHOLESALE_ALLOCATION`;
- `WHOLESALE_MEDIA`;
- `WHOLESALE_PROFILE`;
- `WHOLESALE_EVIDENCE`;
- `WHOLESALE_SALES_STATUS`.

They require authorization and appropriate protected-client/content controls. A Retail publication, Retail role, public API, search projection, object URL, or cache must not disclose them. This document defines commerce semantics only; client security remains governed by the security architecture/assurance package.

### Same-strain qualification

Wholesale quantity qualification is exactly:

```text
1 lb or more of ONE PARTICULAR CANONICAL STRAIN
```

Qualification evaluation groups exact requested quantities by verified `canonicalStrainId`, converts mass using governed exact rational units, and tests whether at least one individual strain group is greater than or equal to the canonical equivalent of `1 lb`. Quantities from different strains never combine. Similar names, marketing aliases, or visual resemblance cannot establish strain equivalence.

Count products and unrelated weight products are not forced into this rule. Multiple Lots / Batches of the same strain may contribute only if the current Wholesale Offer and approved proof/fulfillment policy allow that composition while preserving every Lot's provenance. That operational policy remains OPEN.

Qualification is not authorization, age/destination/product eligibility, availability, reservation, current proof, price acceptance, or order acceptance. Each remains a separate input to purchase readiness.

## Negotiated quote model

A Negotiated Quote is a private, versioned commercial proposal—not a price mutation or inventory state.

It records:

- stable quote identity and idempotent creation/conversion references;
- customer account or approved pseudonymous inquiry reference with minimum private data;
- authorized sales representative/actor;
- exact Quote Lines with Variant, quantity/unit, optional Lot / Batch specificity, and conditions;
- Wholesale Reference Price version used for context when applicable;
- exact Negotiated Quote Price, currency, unit/extended basis, and calculation/rounding rule;
- offer, channel, fulfillment, proof, and qualification references;
- created/effective/expiry context without an invented duration;
- status, version, approvals, notes/access classification, and complete audit history.

Conceptual states are `Draft`, `Issued`, `Accepted`, `Declined`, `Withdrawn`, `Expired`, `Superseded`, and `Converted`, subject to future owner workflow. Only an authorized current accepted version may enter conversion. The specific approval thresholds and state authorities remain OPEN.

### Quote-to-order conversion

Conversion is an idempotent command over an exact accepted quote version. It must revalidate:

1. customer/inquiry authorization and Wholesale access;
2. same-strain quantity qualification where applicable;
3. exact lines/options and current product/variant state;
4. active quote terms and negotiated price version;
5. canonical inventory reservation/allocation;
6. age, destination, product, and fulfillment eligibility;
7. material proof, compatibility/fit, and required components;
8. tax, payment, and fulfillment inputs;
9. purchase-method completeness.

An accepted quote does not reserve inventory unless a distinct canonical Reservation exists. A Reservation does not accept a quote. Expiry or withdrawal does not silently release a reservation unless the approved reservation policy explicitly links and executes that transition.

Successful conversion creates or references one Order exactly once and records the quote/version on immutable Order lines. It does not rewrite the Retail Price, Wholesale Reference Price, or current catalog record. A later reorder re-evaluates current truth and cannot reuse the historical negotiated price without a new valid governing record.

## Promotion and price-resolution architecture

Every Promotion requires identity, owner, price/offer/channel scope, exact conditions, effective start/end, status, source, audit, and precedence/stacking policy reference. Promotion expiration disables its current applicability but preserves the record and order history.

The price resolver receives exact Variant/Bundle, channel, customer/quote context, quantity, purchase method, and evaluation time. It returns the selected `priceId`/version, exact amount or unit basis, currency, applied promotion/quote references, effective context, and explanation metadata. It returns `Unknown`, `Action Required`, or `Service Error` rather than choosing an ambiguous positive price.

The final precedence among Retail, Promotional, Wholesale Reference, Negotiated Quote, Bundle, and any future recurring price is **OPEN — FINANCE / MERCHANDISING DECISION REQUIRED**. Until an approved precedence/stacking rule exists, overlapping candidates that cannot be unambiguously resolved block final price resolution.

## Cart and order behavior

Cart lines reference exact Price and Channel Offer versions. Full Cart revalidates price against current canonical records. A change retains prior/current references and requires acknowledgment under an **OPEN owner policy**. No price change silently changes quantity, option, product, channel, or fulfillment method.

Quick Cart may show the current price and highest material issue but cannot claim final checkout readiness. Order submission operates on a revalidated cart/version and snapshots the exact selected price basis, offer, promotion/quote references, currency, quantity, and decision/rule versions. Later price corrections do not rewrite immutable Order history; support views label historical versus current truth.

An unknown or failed price service blocks final total resolution. It is not zero, free, a discount, or permission to use a cached amount. Tax and fees remain their own adapter outcomes and are not folded into Product Price without an explicit totals contract.

## Administrative commands

The canonical Admin boundary must eventually support authorized, idempotent commands to:

- create/change/end Retail Price;
- create/change/end Wholesale Reference Price;
- create/change/end Promotional Price and Promotion;
- create/version/issue/withdraw/supersede Negotiated Quote;
- create/edit/publish/unpublish/suspend Channel Offer;
- change Retail/Wholesale visibility independently;
- change shipping/York pickup/BSDN offer eligibility references independently;
- attach or reallocate a Channel Allocation reference through Inventory authority;
- correct a Price/Offer with reason, evidence, before/after, and propagation;
- review effective, future, stale, conflicting, missing, and historical records.

An admin may propose related changes across domains, but Price cannot directly mutate Inventory, Eligibility, Product, Media, Evidence, or Order. Cross-domain workflows orchestrate authorized commands and report partial failure without fabricating completion.

## Concurrency and atomic boundaries

Consequential Price, Promotion, Channel Offer, and Quote writes require expected record version and idempotency key. A stale version returns a conflict and the current record; there is no silent last-write-wins.

Within the Price domain, creating a new effective Price version, superseding the prior version where applicable, writing audit context, and recording a transactional outbox event are atomic. Within the Quote boundary, a version transition, exact lines/terms, approvals, audit, and outbox event are atomic. Cross-domain inventory reservation, cart revalidation, and order conversion remain explicit idempotent orchestration—not a distributed database transaction.

Required race behavior:

- two staff editing the same Price/Offer: one versioned write succeeds; the stale writer must compare and retry intentionally;
- price update during active cart: the current Price changes, affected carts revalidate, and acknowledgment policy applies;
- Promotion starts/ends while checkout is active: canonical evaluation time/version decides; no stale projection authorizes it;
- customer accepts a quote while staff supersedes it: only one valid version transition succeeds; conversion checks the exact accepted version;
- channel allocation changes during offer view: the offer remains a presentation record, while canonical Inventory decides reservation;
- Product/Variant is archived or suspended: Price history remains, active offers are suppressed/revalidated, and historical orders retain references.

## Events, audit, and correction

At minimum, a current Price change emits `Price Changed` with exact Variant, prior/current Price references, basis, effective time, actor/authority, and record versions. Offer, Promotion, Quote, and visibility changes require versioned domain events or `Correction Published` with equivalent audit/propagation semantics.

Consumers include Search, PDP, Cart, Order, Wholesale, Support, Analytics projections, and Audit. Event delivery is at least once, consumers are idempotent, and ordering is preserved per price/offer/quote aggregate. Replay rebuilds read models and never reissues a quote, duplicates an order, or repeats a payment side effect.

Every material history entry includes:

- before/after values and statuses;
- exact scope, currency, quantity/price basis, and effective times;
- actor, capability, authority, source, reason, and optional approval;
- command/idempotency/correlation and causation IDs;
- affected Price/Offer/Quote/Product/Variant records;
- propagation status and unresolved consumers.

A correction never deletes the prior price. A mistaken committed record uses a corrected/superseding version. Public price history, Compare-at display, and analytics access are separate permissions; audit retention does not authorize customer display.

## Projections and operational signals

Retail website, protected Wholesale client, Search, Cart, Admin lists, and Analytics consume projections with source record/version and observed time. Search is not price truth. Cache is disposable. A projection can display a value only under its access classification and currency/currentness rules.

Operational signals should distinguish, at minimum, missing active price, overlapping/unresolvable prices, approaching/end-of-effectivity where governed, stale price projection, quote awaiting action, quote expiry, hidden offer with stock allocation, offer without current price, and unauthorized Wholesale access attempt. Thresholds, recipients, and service levels remain OPEN.

## Mandatory semantic separations

| A | Is not B |
|---|---|
| Price | Stock, tax, payment authorization, eligibility, or fulfillment promise |
| Wholesale Reference Price | Negotiated Quote Price |
| Negotiated Quote | Accepted Order or Inventory Reservation |
| Historical Price | Valid Compare-at Price or current price |
| Supplier unit cost | Retail, Wholesale Reference, Promotional, or Negotiated Quote Price |
| Promotional Price | Category, permanent price, or fake urgency |
| Channel Offer | Product/Variant duplicate or physical inventory position |
| Visibility | Eligibility or availability |
| Channel Allocation | Duplicate stock |
| Same-strain quantity qualification | Legal eligibility, proof, availability, price acceptance, or wholesale approval |
| Published Product | Retail-visible offer, Wholesale-visible offer, or Ready for Sale |
| Service Error / Unknown | Free, zero, eligible, or current |

## Open gates

- currency/currency-exponent registry, supported currencies, formatting, and rounding rules;
- finance/commerce price authority, staff capabilities, approval thresholds, and dual control;
- actual Retail, Wholesale Reference, promotional, bundle, and quote prices;
- precedence, stacking, markdown, Compare-at, discount, price-match, and promotion policies;
- quote workflow, approval thresholds, validity/expiry, customer identity/pseudonymous inquiry handling, and representative authority;
- price-change cart acknowledgment and customer communication policy;
- wholesale cross-lot fulfillment and exact qualification/offer rules;
- channel-allocation policy, Wholesale/Retail priority, and safety reserve;
- shipping, York pickup, and BSDN zones, fees, schedules, promises, and eligibility rules;
- tax, accounting, payment, and reconciliation providers/integrations;
- recurring purchase terms and whether recurring commerce will exist;
- public price-history, analytics, and retention policy;
- database, cache, search, admin framework, and commerce provider.

No open gate may be replaced with an invented amount, discount, timer, priority, currency assumption, provider, or policy.

## Related package documents

- [Domain and Ownership](./01-domain-and-ownership.md)
- [Catalog, Product, Variant, SKU, and Lot Model](./02-catalog-product-variant-sku-lot-model.md)
- [Inventory Ledger and Reservations](./03-inventory-ledger-and-reservations.md)
- [Admin Roles, Security, and Audit](./06-admin-roles-security-and-audit.md)
- [Admin Workflows and Information Architecture](./07-admin-workflows-and-information-architecture.md)
- [Integrations, Projections, and Transaction Boundaries](./09-integrations-projections-and-transaction-boundaries.md)
- [Decisions, Open Gates, and Next Step](./10-decisions-open-gates-and-next-step.md)

No live price, quote, promotion, channel offer, wholesale entitlement, provider integration, or production implementation is created or authorized by this document.
