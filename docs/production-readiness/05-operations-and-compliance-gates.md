# Blowin' Smoke — Operations and Compliance Gates

**Purpose:** Separate settled owner direction from unresolved procedures, qualified rules, and technical dependencies  
**Legal boundary:** This document makes no legal conclusion

## Classification

| Classification | Meaning |
|---|---|
| Settled owner direction | The owner has chosen the business direction for this phase |
| Unresolved business procedure | Operations must define the workflow or commitment |
| Unresolved compliance decision | A qualified source must define current rules and scope |
| Technical dependency | A system, service, data source, or integration required after authority exists |
| Research observation | Competitor/customer evidence identifies a problem only |

## Owner-decision register

| Area | Settled owner direction | Unresolved procedure or rule | Technical dependency |
|---|---|---|---|
| Launch model | All three divisions are intended for launch | Each division needs a supportable assortment before public launch | Catalog and route availability by division |
| Shipping | Nationwide wherever the exact transaction is eligible | Jurisdictions, products, carriers, services, rates, packaging, timelines | Eligibility, rate/service lookup, routing, tracking |
| Local pickup | York, Pennsylvania only | Location, hours, verification, release, failed pickup | Pickup inventory allocation and order state |
| Local delivery | York, Pennsylvania only | Radius, schedule, fee, routing, verification, exceptions | Delivery-zone and routing service |
| Inventory | Purchase and hold owned stock | Receiving, reservations, allocation, quarantine, counts, corrections | Inventory system of record and events |
| Suppliers | No accounts or inventory currently exist | Supplier selection, account approval, costs, minimums, authenticity | Catalog intake and supplier data interfaces |
| Payment | No processor selected | Merchant feasibility, underwriting, methods, fraud/refund/dispute rules | Payment provider integration after approval |
| Shipping/returns strategy | Benchmark competitors and write original policies | Exact commitments, exceptions, warranty, damage, RMA | Policy store, support/RMA, refund integration |
| Age verification | Required | Provider, rule scope, timing, retry/failure, privacy, retention | Qualification service and audit trail |
| Support | No final model selected | Channels, hours, staffing, service levels, authority, escalation | Case system and context transfer |
| Brand master | Owner believes a master exists externally | Locate, inspect, verify rights and suitability | Asset pipeline after approval |

## Gate register

| Decision area | Settled direction | Unresolved authoritative decision | Smallest authoritative source | Technical dependency | Gate effect |
|---|---|---|---|---|---|
| Age qualification | Verification required | Exact age/product/surface scope, provider, failure, privacy, retention | Qualified compliance/privacy decision | Versioned qualification service | Blocks provider selection, implementation, launch |
| Destination/product eligibility | Ship only where eligible | Jurisdictions, product/format/quantity interactions, exceptions, outage behavior | Qualified current rule set | Address/product evaluation and cart enforcement | Blocks provider selection, implementation, launch |
| THCA proof currentness | Exact-scope proof required when THCA is sold | Required tests, currentness, claims, archive/access, rights | Qualified proof/compliance owner plus real COAs | Document store, batch mapping, currentness evaluator | Blocks THCA implementation/launch |
| Shipping | Nationwide-where-eligible model decided | Carriers, services, rates, thresholds, processing/delivery promises | Operations-approved carrier/service matrix | Rates, labels, routing, tracking, policy version | Blocks implementation/launch |
| York pickup | York-only decided | Location, hours, release and verification | Operations decision record | Pickup allocation and order state | Blocks implementation/launch |
| York delivery | York-only decided | Radius, service levels, fees, verification, exceptions | Operations decision record | Zone/routing and delivery state | Blocks implementation/launch |
| Returns/warranty | Competitor benchmarking strategy decided | Original windows, conditions, exclusions, refunds, warranty | Owner-approved operations/policy matrix | RMA/case/refund workflow | Blocks implementation/launch |
| Fragile damage | Separate workflow required | Packaging, evidence window, defect/damage/missing-part distinctions | Operations/support procedure | Attachment intake, disposition, replacement/refund | Blocks affected Glass launch |
| Inventory | Owned-stock model decided | Receiving, reservations, allocations, quantity limits, outage/correction | Inventory operating contract | Inventory system and event stream | Blocks provider selection, implementation, launch |
| Price changes | Truthful prior/current handling required | Source, authority, acknowledgment, checkout consequence | Finance/commerce decision | Price history and cart revalidation | Blocks implementation/launch |
| Payments | No provider selected | Merchant acceptance, methods, capture/refund/dispute/fraud | Merchant/provider approval | Tokenization, idempotency, refund integration | Blocks implementation/launch |
| Taxes | No provider/rule selected | Treatment, coverage, presentation, reporting, failure | Qualified finance/tax decision | Tax calculation/reporting | Blocks implementation/launch |
| Privacy/consent | No final policy | Purpose, collection, processors, retention, access/deletion, sensitive contexts | Qualified privacy/security decision | Consent, retention, deletion, access, audit | Blocks provider selection, implementation, launch |
| Support escalation | No final support model | Channels, hours, staffing, authority, warranty/returns escalation | Support operating model | Case system and RBAC | Blocks implementation/launch |
| Notifications | Optional | Channel, purpose, consent, frequency, expiry, unsubscribe | Privacy/marketing/operations decision | Consent ledger and inventory events | May defer |
| Analytics | Optional | Minimum questions, consent, provider, retention | Product/privacy decision | Consent-aware event contract | May defer |
| Promotions | Optional | Basis, terms, dates, stacking, limits | Merchandising/finance decision | Promotion source and cart revalidation | Defer unless approved |
| Memberships/subscriptions | Deferred | Future economics, terms, consent, cancellation, substitution | Owner/finance/privacy/operations/compliance | Mature account/order/payment/inventory systems | Does not block core launch when excluded |
| Record ownership/updates | Canonical ownership is required | Named owners, systems of record, refresh intervals, correction authority | Owner-approved governance map | RBAC, versioning, invalidation, audit | Architecture can define interfaces; provider selection and implementation remain blocked |

## Research boundary

Competitor age gates, shipping thresholds, returns, loyalty, notifications, and support promises are benchmarks only. Customer testimony may support a decision problem or sourcing lead; it cannot establish current product truth, eligibility, inventory, or policy.

## Gate conclusion

The owner has supplied enough operating direction for vendor-neutral architecture to model fulfillment modes, owned inventory, qualification, policy, support, and service boundaries. Qualified rules, procedures, systems of record, and providers still block provider-specific architecture, implementation, and launch.
