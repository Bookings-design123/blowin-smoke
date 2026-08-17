# Catalog, Product, Variant, SKU, and Lot Model

**Phase:** COM-ADM-01

**Status:** Governing commerce-administration architecture

**Implementation status:** Architecture only; no production implementation is authorized

## Purpose and authority

This document defines the operational catalog identities, ownership boundaries, workflows, and invariants that Blowin' Smoke Admin must preserve. It specializes the governing [Data Model & Catalog Schema](../system/03-data-model-catalog-schema.md) and [Domain Boundaries and Record Ownership](../technical-architecture/02-domain-boundaries-and-record-ownership.md); it does not replace either source.

The model supports one canonical catalog across THCA, Vape & Nicotine, and Glass & Accessories. Retail, Private Wholesale, shipping, York pickup, and BSDN same-day delivery consume that catalog through separately governed offers and eligibility. They do not own duplicate product records.

This is a provider-neutral logical specification. It does not select tables, a database, a commerce platform, an admin framework, supplier formats, identifiers, or actual products.

## Governing invariants

1. `Product`, `Sellable Variant`, `SKU`, and `Lot / Batch` are different objects with different jobs.
2. Every object has a stable Blowin' Smoke canonical identifier. Supplier, platform, barcode, and other external identifiers are aliases, never canonical ownership.
3. Product-level truth may be inherited only when it is explicitly invariant for every variant.
4. Variant-dependent truth remains variant-scoped. A variant value never rewrites the product-level fact.
5. A complete valid option combination resolves to exactly one Sellable Variant before commerce may progress.
6. Price, physical stock, channel allocation, proof, eligibility, compatibility, media, and publication permission remain independently owned records.
7. Every material fact carries source, scope, status, owner, observed/effective time, version, and audit context.
8. Unknown, Unverified, Not Supplied, Not Applicable, Stale, Conflicting, Pending Verification, Superseded, Invalidated, and Service Error are explicit states. A blank is not a state.
9. Supplier data can propose a record but cannot self-approve it.
10. Titles, descriptions, URLs, filenames, images, co-purchase, reviews, and competitor material cannot establish product truth, proof, contents, or fit.
11. Routine catalog administration occurs through authorized admin commands and canonical operational storage—not GitHub, a deployment, code changes, Codex, or developer intervention.
12. Corrections preserve history and propagate to every affected projection and decision surface.

## Canonical object distinctions

| Object | Canonical responsibility | Must not own or imply |
|---|---|---|
| `Product` | Durable customer-facing identity; primary division; governed type and role; stable description; accountable entities; invariant attributes; shared education | Exact option selection, a current SKU, price, stock, lot proof, eligibility outcome, or channel offer |
| `Sellable Variant` | Exact purchasable configuration; complete option-value set; variant attributes; identifiers; variant media/contents/proof/fit references | Physical quantity, a customer-specific quote, or a fulfillment promise |
| `SKU` | Merchant operational stock-keeping identity for an exact sellable/package/unit configuration | Product identity, marketing title, supplier identity, or permission to sell |
| `Lot / Batch` | Traceable produced, packaged, or received grouping tied to an exact applicable product/variant and inventory | Variant configuration, price, generic proof applicability, or availability |
| `Option Dimension` | Governed customer-selectable axis, such as quantity, color, strength, resistance, joint size, or angle | A free-form title token or independent product identity |
| `Option Value` | Controlled value within one Option Dimension, including normalized value and attribute linkage | A sellable configuration by itself |
| `Valid Combination` | Complete option-value set mapped to exactly one Sellable Variant | Compatibility or current stock |
| `Commercial Identifier` | Typed alias such as supplier reference, barcode, or platform ID, with issuer, scope, and effective state | Canonical ownership |
| `Source / Provenance` | Accountable origin, authority class, reference, permissions, scope, and time context | Universal authority over unrelated fields |
| `Claim` | Classified statement/value with evidence, scope, status, restrictions, and owner | An unclassified copy string that silently becomes fact |

### Product-to-variant relationship

- A Product has one or more Sellable Variants.
- A Sellable Variant belongs to exactly one Product.
- The Product owns facts proven invariant for all its variants.
- The Sellable Variant owns exact option configuration and all facts that can vary with that configuration.
- A product summary such as `from price`, option count, or overall availability is a timestamped derived projection from currently valid variants. It is never manually authored truth.
- If a supposedly invariant fact becomes variant-dependent, the correction moves it to the correct scope, preserves the prior record, and invalidates affected projections.

### SKU relationship and unresolved convention

A SKU record must resolve to exactly one Sellable Variant and the exact package/unit configuration stocked under it. A SKU has its own stable record identity, identifier value, issuer/owner, status, effective period, and audit history. An active SKU value cannot resolve to multiple variants. Retired values remain reserved in history and are not silently reused.

The final rule for how many active SKUs may represent one variant, barcode coexistence, supplier alias mapping, and human-readable format is **OPEN — OWNER / PLATFORM DECISION REQUIRED**. Until resolved, no design may assume a permanent one-to-one Variant-to-SKU relationship. `variantId` remains the canonical commerce reference; a SKU is an operational identity and lookup key.

### Lot / Batch relationship

- A variant may be supplied by many Lots / Batches over time.
- A Lot / Batch links only to the product and exact variant that its evidence supports.
- Inventory positions and ledger entries retain Lot / Batch when traceability is required.
- Proof applicability is an explicit relationship from the exact Product / Variant / Lot / Batch / sample scope to a versioned Proof Document. Similar names do not create applicability.
- One proof document may cover multiple lots only when the evidence explicitly names or otherwise authoritatively supports that scope.
- Divisions and product types that do not require lot traceability use `Not Applicable`; they do not receive fabricated batch records.
- Receiving or expected receipt does not make a Lot / Batch sellable. Applicable inspection, evidence, quarantine, publication, offer, and eligibility gates remain independent.

## Type, role, division, and taxonomy

`Product Type` answers **what is it?** `Product Role` answers **how does it participate in use?** They remain independent controlled vocabularies. Initial roles are:

- `COMPLETE PRODUCT`
- `CONSUMABLE`
- `REPLACEMENT`
- `FITTED COMPONENT`
- `ACCESSORY`
- `CARE PRODUCT`
- `SESSION TOOL`
- `SERVICE-ENABLING OBJECT`
- `MAKER / ARTIST OBJECT`

Each Product has one primary Division: THCA, Vape & Nicotine, or Glass & Accessories. Cross-division utility is expressed through a typed relationship, never a duplicate Product. Category and Subcategory are durable browse taxonomy. Collection, Curated Edit, Featured Set, and Promotional Collection are governed groupings that never redefine type or category. Promotional state is bounded by effective time and cannot become taxonomy.

## Option and configuration contract

An Option Dimension defines a selectable axis and allowed values. A Valid Combination resolves a complete set of required values to one and only one Sellable Variant. Dependencies express when one value constrains another.

The admin must support creation, correction, activation, and retirement of dimensions, values, dependencies, combinations, and variants while enforcing:

- a represented-as-purchasable combination cannot map to zero or multiple variants;
- absence from the sellable set is not evidence of incompatibility;
- an unresolved required dimension produces `Selection Required`;
- a default must be owner-approved, valid, display-eligible, and unable to conceal a required decision;
- changes revalidate price, inventory references, media, proof, compatibility/fit, offers, search, carts, and bundles;
- no archive or option edit may orphan historical order-line references.

## Division-sensitive scope

One shared model supports conditional extensions:

- **THCA:** strain and quantity pattern, exact Lot / Batch, composition/potency result scope, Proof / COA applicability, and versioned eligibility inputs remain separable.
- **Vape & Nicotine:** model/platform, strength, resistance, device/component role, contents, and Electronic Compatibility attach at exact product, variant, or relationship scope according to real variability.
- **Glass & Accessories:** material, measurements, geometry, included/required components, maker provenance, and Physical Fit attach only where applicable and verified.

Unknown and Not Applicable are never interchangeable. Product-type contracts decide which fields are required; one division's fields cannot become mandatory blanks for another.

## Content and truth layers

The admin must show and preserve these separate concepts:

| Layer | Meaning |
|---|---|
| `VERIFIED_FACT` | Accepted field-specific source, scope, evidence, and currency requirements are met |
| `STRUCTURED_ATTRIBUTE` | Value governed by an Attribute Definition, unit, allowed scope, and validation rules |
| `MERCHANDISING_DESCRIPTION` | Approved sales-oriented description that cannot establish a fact |
| `EDITORIAL_COPY` | Authored brand or educational presentation copy |
| `STAFF_NOTE` | Restricted operational context, never public by default |
| `CUSTOMER_FACING_CLAIM` | Classified, sourced, scoped, approved statement with display restrictions |

Supported Claim classes remain `Product Fact`, `Measured Fact`, `Manufacturer Claim`, `Laboratory Result`, `Legal/Policy Statement`, `Operational Promise`, `Marketing Opinion`, `Customer Testimony`, `Compatibility Evidence`, and `Maker/Provenance Claim`. Changing class requires a new audited decision and evidence while preserving the prior classification.

No operator may invent potency, genetics, effects, source, cultivation, composition, availability, compatibility, contents, dimensions, maker provenance, or proof. A manufacturer claim does not become a measured fact. A customer statement does not become catalog truth without an authorized verification workflow.

## Source, verification, and correction

Every fact or relationship records:

- canonical subject and exact product/variant/lot/relationship scope;
- source type, responsible party, reference, received/accessed time, and permissions;
- verification state and authorized verifier;
- observed time, effective time, optional expiry/review trigger, and currentness;
- monotonic record version and dependency versions;
- previous/new value or status, actor, authority, reason, command, correlation, and audit event for change.

Source authority is field-specific. A laboratory can govern its result, not price. Inventory can govern stock, not compatibility. Manufacturer documentation can support intended fit; documented Blowin' Smoke pair testing can govern only its measured scope. Competitor research has zero catalog-authority status.

Accepted sources that conflict remain present as `Conflicting` until an accountable owner resolves them. A system may flag staleness or conflict but cannot silently choose truth. A correction is a new version; it does not overwrite the prior record. Material corrections publish a `Correction Published` event and identify all affected projections, carts, offers, evidence views, recommendations, and support contexts.

## Publication as independent dimensions

The existing governing documents use conceptual stage names for different responsibilities. COM-ADM preserves them as separate dimensions rather than collapsing them into one ambiguous status.

| Dimension | Governing states / permissions | Invariant |
|---|---|---|
| Authoring and source workflow | `Draft`, `Source Collection`, `Pending Verification`, `Verified for Review`, plus `In Review` | Describes work state; it grants no visibility or sale permission |
| Approval | `Approved`, `Corrected`, `Superseded` as version outcomes | Supplier input cannot self-approve; approval belongs to the accountable catalog/truth owner |
| Merchandising readiness | `Ready for Merchandising` or not ready | Requires approved identity and safe display content; it does not imply price, stock, or eligibility |
| Sale readiness | `Ready for Sale` or not ready | Derived from exact variant and current purchase-readiness inputs; never a manual marketing flag |
| Visibility | `Published` or unpublished; a published record may become `Suspended` | Determines approved discovery/PDP visibility only; Published is not synonymous with purchasable |
| Lifecycle / retention | Active, `Restricted/Held`, `Discontinued`, `Archived` | History, order references, proof, fit, and support value survive discontinuation/archive as governed |

An implementation may rename labels only if it preserves these distinct permissions and meanings. The storefront-facing `Unavailable`, `Sold Out`, `Discontinued`, `Unknown`, and eligibility `Restricted` conditions are not publication workflow synonyms.

### Administrative lifecycle commands

| Command | Required behavior |
|---|---|
| Add Product | Create Draft canonical identity with source and owner; never auto-publish |
| Edit Product | Require expected version, field authority, reason, and validation; publish a new version |
| Create / Edit Variant or SKU | Enforce exact Product, option, package/unit, identifier, and dependency integrity |
| Activate / Deactivate Variant or SKU | Change operational eligibility only within exact scope; preserve history and revalidate dependants |
| Publish | Verify capability-specific minimum truth, approval, visibility scope, and current dependencies |
| Unpublish / Suspend | Remove ordinary discovery as governed without deleting identity or order history |
| Archive | Remove from ordinary active workflows while retaining required historical/support records |
| Restore | Return to an appropriate review state; never auto-publish, restore stock, restore an expired price, or make sale-ready |
| Correct | Create a governed version with before/after, evidence, reason, authority, and propagation |

All consequential writes use optimistic concurrency. A stale expected version returns a conflict and current record; it never silently overwrites another staff member's work.

## Capability-specific publication checks

| Capability | Minimum architecture-level truth |
|---|---|
| Search display | Approved identity/type/role/division, safe searchable fields, route/readiness, and honest price/availability display state |
| Category display | Approved membership, card-critical facts, media or honest fallback, and price/availability state |
| PDP publication | Identity, valid variants, critical facts/statuses, sources, media/fallback, policies/support routes, and explicit unknowns |
| Purchase enablement | Exact variant; complete options; current price and availability; applicable eligibility; material proof, fit, and required components resolved under approved rules |
| Compatibility claim | Exact relationship scope, adequate evidence, verification, conditions, and review rule |
| Proof claim | Exact current document/applicability relationship and honest status |
| Curated recommendation | Typed rationale, owner, validation, current target state, and bounded effective period when applicable |

Failures block only the affected capability where safe. A PDP may remain published for documentation or support while purchase is disabled. A discontinued record remains retrievable when it supports proof, order history, compatibility, replacement, successor comparison, education, or support.

## Purchase-readiness dependency

Admin publication controls cannot override the exact derived purchase-readiness sequence defined in [Contracts, Events, and State Machines](../technical-architecture/03-contracts-events-and-state-machines.md): age qualification; destination eligibility; product-specific eligibility; product and selected-variant availability; required options; compatibility; required components; material proof; price; purchase method; progression readiness.

Each input returns its domain result. Lower positive states never override a higher blocker. CTA text and readiness are derived, versioned outputs—not editable Product fields.

## Required commands and events

The canonical admin boundary must eventually support idempotent, authorized commands for product add/edit/archive/restore/publish/unpublish; variant and SKU create/edit/archive/activate/deactivate; taxonomy and option management; source attachment; verification; claim review; and correction.

At minimum, catalog changes produce or cause consumption of `Catalog Record Approved`, `Variant Changed`, and `Correction Published`. Consumers include Price, Inventory, Search, Media, Proof, Relationships, Cart, and Audit according to affected scope. Event delivery is at least once, consumers are idempotent, per-record order is preserved, and replay rebuilds projections rather than duplicating external side effects.

## Explicit anti-patterns

The following are forbidden:

- one giant mutable product record containing price, stock, proof, fit, and channel visibility;
- one product copy per sales or fulfillment channel;
- a SKU, barcode, supplier ID, title, or URL used as the canonical Product ID;
- a variant fact stored only at Product scope;
- a blank interpreted as Unknown;
- a media object interpreted as proof, scale, contents, or fit;
- supplier content promoted to Verified without accountable review;
- old proof attached to a new Lot / Batch without evidence;
- promotion used as category;
- archive implemented as destructive deletion;
- publication treated as permission to sell;
- an admin override that fabricates a positive eligibility, compatibility, proof, availability, or price state.

## Open gates

The architecture is decided; these operational inputs remain unresolved:

- actual assortment, product types, categories, depth, option patterns, and launch records;
- canonical SKU, barcode, and external-identifier conventions;
- whether and when multiple active SKUs may map to one variant;
- supplier accounts, feeds, source acceptance rules, and catalog approval authority assignments;
- Lot / Batch granularity by product type and receiving workflow;
- attribute units, precision, measurement methods, instruments, and tolerances;
- actual COA corpus, formats, rights, applicability rules, archive, and verification authority;
- compatibility/fit corpus, verification coverage, reviewers, and staleness intervals;
- final publication approval roles, dual-control thresholds, and correction escalation;
- commerce platform, database, admin UI, and implementation technology.

No unresolved gate may be filled with invented data. Synthetic records may demonstrate structure only when visibly labeled non-production.

## Boundary and related documents

Catalog identity is administered through the canonical commerce boundary defined in [Domain and Ownership](./01-domain-and-ownership.md). Physical quantity and reservations are governed by [Inventory Ledger and Reservations](./03-inventory-ledger-and-reservations.md). Prices, offers, wholesale qualification, and channel visibility are governed by [Pricing and Channel Offers](./04-pricing-and-channel-offers.md). Media and evidence binaries remain separate governed objects described in [Media and Evidence Management](./05-media-and-evidence-management.md). Integration, projection, and transaction rules are defined in [Integrations, Projections, and Transaction Boundaries](./09-integrations-projections-and-transaction-boundaries.md).

No production code, operational database, real catalog, or implementation authorization is created by this specification.
