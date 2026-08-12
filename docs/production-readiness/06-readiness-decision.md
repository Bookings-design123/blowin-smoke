# Blowin' Smoke — Production Readiness Decision

## Decision

# CONDITIONALLY READY FOR VENDOR-NEUTRAL TECHNICAL ARCHITECTURE

This decision authorizes only the next specification phase described below. It does not authorize final provider selection, production implementation, deployment, catalog population, checkout activation, or launch.

## Readiness classifications

| Phase | Status |
|---|---|
| Brand, commerce, information, data, and page architecture | Complete as governing specifications |
| Static customer-facing architecture | Closed |
| Operating-model direction | Partially settled |
| Vendor-neutral technical architecture | **Conditionally ready** |
| Final commerce platform and provider selection | **Not ready** |
| Production coding | **Not authorized** |
| Launch | **Not ready** |

## Why vendor-neutral architecture may proceed

The repository and owner decisions are sufficient to define stable boundaries without pretending the missing suppliers, products, providers, policies, or rules are known. The next phase may specify:

- system boundaries and responsibilities;
- canonical contracts for product, variant, price, inventory, media, proof, compatibility, physical fit, eligibility, cart, order, fulfillment, support, privacy, and audit;
- systems-of-record interfaces and ownership requirements;
- state and event models;
- receiving, reservation, shipping allocation, York pickup allocation, York delivery allocation, quarantine, correction, and restock events;
- provenance, staleness, refresh, outage, retry, invalidation, and correction behavior;
- provider-selection criteria and architecture decision records;
- explicit vendor extension points and replaceable adapters;
- failure-safe behavior when authoritative inputs are missing or unavailable.

The architecture must remain provider-neutral and must not encode unverified laws, policies, products, prices, inventory, compatibility, fit, proof, or service promises.

## Scope that remains prohibited

The next phase may not:

- select the final commerce platform;
- select or integrate payment, age-verification, tax, carrier, eligibility, support, analytics, or inventory providers;
- write production application code;
- create live integrations or deployment infrastructure;
- populate a real catalog;
- activate search, account, cart, checkout, payments, notifications, or analytics;
- make legal/compliance conclusions;
- authorize launch.

## Settled owner direction

- Launch intent includes THCA, Vape & Nicotine, and Glass & Accessories.
- Fulfillment includes nationwide shipping wherever eligible, York-only pickup, and York-only local delivery.
- Inventory will be purchased and held by Blowin' Smoke; dropshipping is not the default.
- No supplier accounts or physical inventory currently exist.
- Age verification is required.
- No payment processor or age-verification provider is selected.
- Competitor policies will be benchmarked, but Blowin' Smoke will need original approved policies.
- The owner believes a master logo file exists outside the repository; it remains unlocated and uninspected.

## Strongest verified inputs

1. The governing system defines the one-house/three-division model, product roles, state precedence, provenance, proof, compatibility, fit, cart, support, and uncertainty boundaries.
2. Iteration 05.1 closes the static customer-facing architecture.
3. Owner decisions establish the intended launch divisions, fulfillment modes, owned-inventory model, and age-verification requirement.
4. Customer intelligence supplies eight bounded Vape & Nicotine sourcing leads.
5. Domain research defines the evidence problems for THCA proof, vape compatibility, and glass physical fit.

## Highest-priority blockers

1. No approved cross-division pilot catalog or supplier-backed SKU/variant truth.
2. No wholesale/distributor accounts, costs, minimums, authenticity records, or inventory.
3. No feasible approved merchant/payment path.
4. No qualified, versioned age/destination/product/proof rule set or selected verification provider.
5. No production product media, rights package, real COA mapping, compatibility corpus, or physical-fit corpus.
6. No final shipping, York pickup/delivery, returns/damage, support, privacy, tax, or data-governance procedures.

## Decisions that may remain open during vendor-neutral architecture

- Final vendor names and integration protocols.
- Final assortment breadth beyond the pilot.
- Exact category/filter/merchandising detail.
- Full compatibility and fit coverage beyond the pilot, provided Unknown remains explicit.
- Reviews, memberships, subscriptions, profiles, personalization, automated matching, dynamic bundles, and nonessential analytics, because they remain deferred or conditional.

## Media and typography

A production real-media audition remains blocked by the absence of rights-cleared representative assets. Typography may continue only as provisional internal evaluation until approved builds and licensing exist. The owner-reported logo master should be located and inspected before final brand delivery.

## Production coding

**Production coding may not begin.**

## Exact recommended next business task

# Supplier, Merchant, Compliance, and Pilot Catalog Feasibility Intake

Resolve, in this order:

1. distributor/wholesale account options and approval requirements;
2. payment and merchant-account feasibility for the intended product mix;
3. exact pilot products across all three divisions;
4. supplier/manufacturer product data, costs, minimums, package contents, and authenticity;
5. COAs and batch mapping for THCA;
6. compatibility data for exact vape ecosystems;
7. measurements and fit validation for Glass & Accessories;
8. product media and commercial rights;
9. age, destination, shipping, York pickup, York delivery, returns/damage, tax, privacy, and support requirements;
10. named systems of record and accountable owners.

Vendor-neutral technical architecture may proceed in parallel. Provider-specific commitment and production implementation may not.
