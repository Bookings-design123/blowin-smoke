# Blowin' Smoke — Data Model & Catalog Schema

**Status:** Governing conceptual and logical data specification

**Master system:** `docs/system/01-master-design-commerce-system.md`

**Information architecture:** `docs/system/02-information-architecture-page-system.md`

**Implementation authorization:** Not granted

## Authority and use

This specification defines the meaning, ownership, scope, relationships, quality states, and page-consumption rules for Blowin' Smoke catalog truth. It does not define tables, APIs, code, platform configuration, or actual catalog values.

Authority resolves in this order: Article I; the Master Design & Commerce System; the Information Architecture & Page System; research-closure decisions; final intelligence only where governing documents leave a domain field unresolved; and original Blowin' Smoke data-model judgment.

Evidence labels used where materially useful:

- **MASTER-SYSTEM REQUIREMENT** — required by the governing commerce system.
- **IA REQUIREMENT** — required by an approved page responsibility or state.
- **DOMAIN REQUIREMENT** — a product-truth problem established by completed research.
- **ORIGINAL BLOWIN' SMOKE DATA MODEL DECISION** — an original schema resolution, not competitor behavior.
- **OPEN DECISION** — requires real catalog, operations, compliance, or platform inputs.

Competitor research remains closed and has zero catalog-authority status.

---

## Part I — Modeling Principles

1. Normalized truth outranks overloaded titles, descriptions, URLs, filenames, and marketing strings.
2. Each fact has one authoritative owner and may be consumed by many surfaces.
3. Product and sellable variant are distinct; variant-dependent truth never leaks across options.
4. Material facts retain field-level source, scope, status, owner, and time context.
5. Unknown, unverified, not supplied, not applicable, stale, conflicting, and pending are explicit—not blanks.
6. Relationships are typed, scoped, directional where necessary, and evidenced.
7. One universal catalog supports governed division and product-type extensions; there are not three catalogs.
8. Units, vocabularies, identifiers, and status meanings are controlled and reusable.
9. Competitor content is never implementation or catalog truth.
10. Images, appearance, URLs, filenames, reviews, and co-purchase do not establish facts, contents, proof, or fit.
11. Time-sensitive facts carry effective, expiration, refresh, or review context.
12. Corrections are auditable and propagate to dependent outputs.
13. Derived values retain traceability to inputs, formula/rule identity, scope, and calculation time.
14. A concept exists only when it solves a governance, decision, or product-truth problem.

### Concept vocabulary

| TERM | MEANING |
|---|---|
| Entity | A durable thing with identity, such as a product, batch, source, or proof document |
| Record | A governed representation of an entity, state, fact, or relationship at a defined scope |
| Attribute | A named characteristic governed by a reusable definition |
| State | A condition true for an object within a scope and time, such as availability or verification |
| Relationship | A typed connection between two governed objects |
| Claim | A publishable statement/value with class, subject, scope, authority, and status |
| Evidence | Material that supports or challenges a fact, claim, or relationship |
| Source | The accountable origin from which information or evidence came |
| Derived value | A calculated or summarized output whose inputs and governing rule remain traceable |

---

## Part II — Core Catalog Entities

The core registry contains **26 conceptual entity classes**. A conceptual class does not imply a dedicated database table.

| # | ENTITY | CONCEPTUAL RESPONSIBILITY |
|---:|---|---|
| 1 | Product | Durable customer-facing concept grouping valid sellable configurations |
| 2 | Sellable Variant | Exact purchasable configuration and its own scoped commerce truth |
| 3 | Product Type | What the product is within a governed vocabulary |
| 4 | Product Role | How the object participates in use and lifecycle |
| 5 | Division | Primary expert context within the one-house catalog |
| 6 | Category | Durable navigational/taxonomic grouping |
| 7 | Collection | Governed durable or editorial grouping with rationale |
| 8 | Brand | Customer-facing commercial identity role |
| 9 | Manufacturer | Entity responsible for manufacturing where verified |
| 10 | Maker | Accountable craft or production entity where distinct |
| 11 | Artist / Studio | Authorship or studio role where verified |
| 12 | Attribute Definition | Reusable meaning, type, unit, scope, validation, and display governance |
| 13 | Attribute Value | Scoped observation or assertion using an attribute definition |
| 14 | Option Dimension | Customer-selectable configuration axis |
| 15 | Option Value | Governed value within an option dimension |
| 16 | Price | Money amount/state for a sellable scope and effective context |
| 17 | Availability | Supply/fulfillment state for a product or variant scope |
| 18 | Media Asset | Authored media object independent of catalog assignment |
| 19 | Education Resource | Governed guide, term, how-to, comparison, or help object |
| 20 | Claim | Classified statement/value with source, scope, status, and restrictions |
| 21 | Source / Provenance | Origin and authority context for a fact, asset, claim, or relationship |
| 22 | Relationship | Typed, scoped, evidenced connection among governed objects |
| 23 | Batch / Lot | Traceable production or received grouping where the domain requires it |
| 24 | Proof Document | Versioned evidence object tied to an applicable subject/batch |
| 25 | Eligibility Rule Interface | Versioned rule input supplied by qualified compliance owners |
| 26 | Recommendation | Governed presentation relationship with rationale and suppression rules |

Promotional state, media assignment, collection membership, composition result, bundle membership, and publication readiness are governed records built from these concepts. They remain distinct even if a future implementation combines storage.

---

## Part III — Product vs Sellable Variant

**Product** owns stable identity, primary division, product type/role, durable description, accountable entities, invariant attributes, shared education, and relationships that truly apply to every sellable configuration.

**Sellable Variant** owns the exact option combination, commercial identifiers, variant-scoped attributes, current price, availability, variant media, eligibility scope where different, applicable batch/proof links, contents, and compatibility relationships.

| CHANGE | CORRECT SCOPE |
|---|---|
| Price changes by quantity | Variant price; quantity option maps to distinct valid variant where sellable identity changes |
| Color changes | Option/variant; media and attributes may vary by variant |
| Strain changes | Variant when selectable within one product; separate product when identity/merchandising governance requires—OPEN DECISION by catalog pattern |
| Nicotine strength changes | Variant-scoped option and attribute |
| Resistance changes | Variant-scoped option, technical attribute, and compatibility scope |
| Joint size changes | Variant-scoped option, physical attribute, and fit scope |
| Included contents change | Variant-scoped typed contents relationships |
| COA/batch changes | Batch/proof relationship to exact applicable product/variant inventory |
| Availability changes | Variant and fulfillment scope; product summary is derived |
| Media changes | Assignment scoped to product, variant, or batch as applicable |
| Compatibility changes | Relationship scoped to exact source/target variants and conditions |

### Inheritance and override

A variant may inherit only a product-level fact explicitly declared invariant for all variants. A variant-specific value overrides the display of an inherited value only within its exact scope; it does not rewrite the product fact. If applicability is uncertain, the variant holds Unknown/Unverified rather than inheriting. Derived product summaries such as “from price” or “available in three options” are recalculated from valid variants and retain traceability.

---

## Part IV — Product Type & Product Role

Product Type answers **what is it?** Product Role answers **how does it participate in use?** They are independent controlled vocabularies.

Initial role vocabulary:

- COMPLETE PRODUCT
- CONSUMABLE
- REPLACEMENT
- FITTED COMPONENT
- ACCESSORY
- CARE PRODUCT
- SESSION TOOL
- SERVICE-ENABLING OBJECT
- MAKER / ARTIST OBJECT

A coil may be type Coil and role Replacement. A cleaner may be type Cleaner and role Care Product. A bong may be type Bong and role Complete Product. Roles may be extended through governance when a new lifecycle or decision behavior cannot be expressed by existing terms. Synonyms and marketing labels do not create roles.

---

## Part V — Taxonomy Model

| CONCEPT | JOB |
|---|---|
| Division | Primary expert context: THCA, Vape & Nicotine, or Glass & Accessories |
| Category | Durable browse intent grounded in type/role/customer job |
| Subcategory | Durable child intent justified by catalog depth |
| Collection | Governed group that does not redefine product type |
| Curated Edit | Bounded human/house selection with explicit rationale |
| Promotional State | Time- and rule-bounded merchandising label, never taxonomy |

Each product has one primary division. Cross-division use is expressed through relationships, not duplicate products. A product may belong to multiple categories when each membership serves a real intent, but one primary category governs canonical orientation. Category membership records carry owner, rationale/rule, status, and effective context. Collections may use governed rules or explicit members; editorial membership carries rationale and owner. Temporary campaigns expire without changing type, role, or category identity.

**ORIGINAL BLOWIN' SMOKE DATA MODEL DECISION:** Title parsing may suggest intake review but can never assign authoritative taxonomy.

---

## Part VI — Attribute System

Every Attribute Definition supports:

| FIELD | PURPOSE |
|---|---|
| Name and machine-stable identity | Human meaning and durable reference |
| Description | Scope and interpretation |
| Data type | Text, number, boolean, controlled term, range, date, reference, or structured measurement conceptually |
| Unit/unit family | Compatible measurement family and canonical unit |
| Allowed values/range | Valid controlled values and bounds where authoritative |
| Applies to | Product types/roles/divisions and product, variant, batch, or relationship level |
| Requirement | Required, optional, or conditional with stated condition |
| Use permissions | Searchable, filterable, facetable, comparable, rankable, or display-only |
| Display priority | Critical, supporting, deep, or internal-only by context |
| Source/verification requirement | Minimum accepted authority and evidence |
| Unknown allowed | Whether uncertainty is representable and its commerce consequence |
| Staleness rule | Stable, periodic, event-driven, or real-time owner-defined behavior |

Attribute Values carry subject, scope, value, unit, source, verification status, effective context, and optional tolerance/method. Product-type schemas select relevant definitions; they do not require every possible field.

---

## Part VII — Units & Measurements

Measurements use controlled unit families for weight, volume, length/height/width/diameter, capacity, power, voltage, resistance, battery capacity, nicotine strength, potency, angle, count, and puff claim.

Each measured or claimed value can carry canonical unit, display unit, precision, range, tolerance, method, basis, source class, subject/variant/batch scope, and verification status. Canonical units enable comparison; display units may change without changing truth. Conversion must preserve precision and must not imply accuracy beyond the source.

Manufacturer-stated measurements remain Manufacturer Claims unless accepted as product facts under governance. Blowin' Smoke measurements are Measured Facts only when method, instrument/process, actor, date, and scope are recorded. Puff count is explicitly a manufacturer claim unless measured under a documented method. Potency and nicotine strength require a basis as well as a unit. Incompatible unit families never compare or aggregate.

---

## Part VIII — Option & Configuration Model

An Option Dimension is a selectable axis such as strain, quantity, color, nicotine strength, flavor, resistance, pod capacity, joint size, or angle. An Option Value belongs to one dimension and may carry display label, normalized value, availability, attribute linkage, and source.

A **Valid Combination** maps a complete set of option values to exactly one sellable variant. An **Invalid Combination** is explicitly unavailable by configuration logic or absent from the sellable set; absence alone must not be described as a known incompatibility. Dependencies state when one choice constrains another. Selection Required is a customer state when a necessary dimension is unresolved.

Defaults may be set only by an accountable merchandising or product rule and must point to a valid, eligible-to-display configuration; they cannot hide a required decision. Not every cross-product of values exists. Variant identity, price, stock, media, proof, compatibility, and CTA update from the resolved combination.

---

## Part IX — Price Model

| PRICE CONCEPT | RULE |
|---|---|
| Current Price | Exact amount for a sellable scope, currency, and effective time |
| Compare-at Price | Governed reference amount with valid basis |
| Sale | Current price related to a bounded promotion; not a separate taxonomy |
| From Price | Derived minimum across currently valid sellable states with disclosed basis |
| Option-dependent Price | Exact price resolved from selected variant |
| Bundle Price | Price for defined members/quantities and effective scope |
| Recurring Price | Conditional future model only if approved terms exist |

Every price record identifies sellable scope, currency, amount, source owner, status, effective period, and promotion/purchase-method relation where applicable. No model here defines discount policy. “From” is derived, never manually authored marketing copy.

---

## Part X — Availability & Inventory State

Controlled conceptual states include Available, Low/Limited only under an objective owner-defined rule, Unavailable, Sold Out, Backorder/Preorder only when operationally supported, Discontinued, Not Yet Available, and Unknown.

Product availability is a derived summary across variants. Variant availability describes an exact configuration. Fulfillment/location availability adds destination, channel, location, and time context. Inventory quantity, threshold, lead time, and restock date are operational inputs and are not invented here.

Sold Out means a previously sellable state lacks available supply; Unavailable is broader; Discontinued indicates no intended future sale; Not Yet Available indicates approved future intent; Unknown indicates no reliable determination. These states never substitute for eligibility or compatibility.

---

## Part XI — THCA Product Model

| CONCEPT | PRIMARY SCOPE | RULE |
|---|---|---|
| Product type / format | Product; variant only if truly selectable | Identifies what is sold; not encoded only in title |
| Strain | Product or variant by approved catalog pattern | Separate identity/option from marketing description |
| Quantity | Variant | Own option, price basis, inventory, and proof applicability where relevant |
| Cannabinoid/composition | Batch/result or scoped product fact | Value, unit, basis, method/source, sample, and status required |
| Potency | Batch/result unless another accepted scope exists | Never unscoped or inferred |
| Batch/lot | Batch | Links traceable inventory to evidence |
| Proof/COA | Proof document plus applicability relationship | Never applied by product-name similarity |
| Eligibility | Rule evaluation for exact product/variant/destination context | Supplied by qualified owner, not catalog copy |
| Fulfillment condition | Variant/order/operational scope | Governed operations fact |
| Claim | Claim object | Class, subject, scope, source, status, and restrictions required |

**DOMAIN REQUIREMENT:** THCA truth requires product, variant, strain, quantity, batch, proof, eligibility, price, availability, and claim scopes to remain separable.

---

## Part XII — Batch / Lot Model

Batch/Lot represents a traceable production, packaging, or received grouping only where the product and operations require it. It carries stable identity, related product, optional exact variant, inventory/fulfillment relationship, production/received dates when supplied, status, source, and proof relationships.

A batch does not replace a variant: variant describes what can be selected; batch describes which traceable unit supplied it. One variant may have multiple batches over time. One proof document may relate to one or more batches only when the evidence explicitly supports that scope. Divisions and product types that do not require batch traceability use Not Applicable rather than fabricated batch records.

---

## Part XIII — Proof / COA Model

Conceptual objects:

- **Proof Document:** original evidence asset and metadata.
- **Laboratory:** accountable issuing/testing entity.
- **Test / Result Group:** method/sample/analyte results within the document.
- **Applicability Relationship:** exact product, variant, batch, sample, and time scope.
- **Document Version:** immutable identifiable edition linked to predecessor/successor.
- **Document Status:** Current, Stale, Missing, Not Supplied, Unmatched, Superseded, Archived, or Unknown.

Current means applicable and within the governing currency rule; it does not mean favorable. Missing means no accessible expected record is present; Not Supplied identifies source failure; Unmatched means evidence exists but cannot be tied to the selected batch; Superseded retains history while a newer version governs.

| CONSUMER | ALLOWED CONSUMPTION |
|---|---|
| Card | Concise applicable status derived from selected/representative scope |
| PDP | Selected product/variant/batch status and direct proof access |
| Proof route | Document, issuer, version, applicability, status, and archive context |
| Order detail | Exact purchased variant/batch proof relationship where recorded |
| Support | Product, batch, document, status, and unresolved-match context |

---

## Part XIV — Cannabinoid / Composition & Potency

A normalized result contains analyte/component identity, numeric or categorical value, unit, basis, method/source, sample/batch, test or effective date, verification status, and applicable scope. Detection limits, ranges, qualifiers, and uncertainty may be represented when supplied and meaningful.

Laboratory Result and Manufacturer Claim are separate claim classes even when their displayed values look similar. A product description cannot populate laboratory results. The model carries evidence without producing legal, medical, effect, or safety interpretations.

---

## Part XV — Vape & Nicotine Product Model

| TYPE / ROLE | CONDITIONAL FIELD FAMILY |
|---|---|
| Disposable | model/platform, nicotine format/strength, flavor, liquid capacity, battery/charging, sourced puff claim, coil technology, lifecycle |
| Refillable device | model/platform, battery, charging, power range, interface, required/supported components |
| Kit | exact included variants/quantities, requirements, platform, compatibility, kit sellable identity |
| E-liquid | volume, nicotine format/strength/basis, flavor, composition where governed, suitable hardware class |
| Nicotine pouch | strength/basis, count, format, flavor, composition where required |
| Pod / cartridge | supported platform, capacity, refillability, included coil, resistance options |
| Coil | supported platform/tank, resistance, operating range, material/technology, unit/count |
| Tank | connection, capacity, supported coils, operating range, included parts |
| Replacement | restored function, supported object, lifecycle, exact/successor relationship |
| Accessory | optional/required role, supported platform/scope, constraints |

Fields attach at product, variant, or relationship scope according to actual variability. Irrelevant fields are Not Applicable, not mandatory blanks. Technical claims identify units, source class, variant scope, and verification status.

---

## Part XVI — Electronic Compatibility Data Model

**ORIGINAL BLOWIN' SMOKE DATA MODEL DECISION:** Electronic compatibility is a specialized Relationship record, not a tag or inferred text match.

Each record supports source object, target object, relationship type, direction, source/target variant scope, compatibility state, conditions, required intermediary, operating constraints, evidence source, verification status, verifier, verification date, effective date, and owner-defined review/staleness rule.

States are Compatible, Incompatible, Conditionally Compatible, Universal, Unknown/Unverified, and Not Applicable. Universal always names a bounded class. Conditional compatibility identifies every material condition. Bidirectional retrieval does not imply the same wording or logic in both directions.

Co-purchase, name similarity, shared brand, connector appearance, customer review, or competitor content cannot establish compatibility.

---

## Part XVII — Glass & Accessories Product Model

| TYPE / ROLE | CONDITIONAL FIELD FAMILY |
|---|---|
| Complete piece | material, height, width/footprint, weight, connections, included components, thickness where verified, perc/type, handmade variation |
| Bowl | joint size, gender/type, material, capacity/style, handle/screen requirements |
| Banger / nail | joint size, gender/type, angle, material, bucket dimensions, heating method, cap/insert fit |
| Ash / reclaim catcher | input/output connections, angle, height, clearance, weight/load, function |
| Downstem | outer/inner connection, total/effective length, material, diffusion, method |
| Adapter | source/target connection, conversion, angle, added height, clearance |
| Grinder | material, diameter, stages, chambers, screen, included tool |
| Cleaner | applicable/incompatible materials, format, quantity, method, handling |
| Storage | internal/external dimensions, protection/seal behavior, size class |
| Torch / lighter | fuel/power type, refillability, ignition, intended use, safety features, included-fuel state |

Material, geometry, contents, tolerance, care, and provenance fields are conditional by role. Handmade variation is a governed range or condition, not an excuse for unspecified dimensions.

---

## Part XVIII — Physical Fit Data Model

A Physical Fit Relationship supports source and target objects/variants, connection point, nominal size, source and target gender/type, angle, length, orientation, clearance, adapter requirement, tolerance, load/weight condition where relevant, fit state, conditions, evidence, test method, verifier, verification date, and review rule.

It uses the same six states as electronic compatibility. A nominal-size match is merely one input. Compatible requires sufficient verified geometry and scope; Conditionally Compatible names the adapter, orientation, tolerance, clearance, or other condition; Unknown remains unresolved.

Manufacturer/maker documentation, standardized receiving measurements, and documented pair testing may be authoritative within their scope. Photographic resemblance is not.

---

## Part XIX — Component & Contents Model

Typed product-to-product or variant-to-variant relationships include Included, Required, Optional, Replacement, Compatible, Successor, Care, Consumable, Complementary, and Bundle Member. Each carries source/target, direction, quantity where material, variant scope, conditions, source, evidence/status, and effective context.

Included means supplied within the exact sellable configuration. Required means necessary for intended function but not necessarily included. Optional adds use value. Replacement restores a defined function. Photographed objects do not become Included.

If an unresolved or absent required component prevents intended use, Required Component State becomes Additional Component Required and purchase readiness cannot be represented as fully ready. The model may identify a verified required target but cannot auto-add or recommend an unevidenced substitute.

---

## Part XX — Brand / Maker / Manufacturer / Artist Model

Brand, Manufacturer, Maker, Artist/Studio, Distributor/Supplier, Blowin' Smoke House Product, and Collaboration are distinct roles. A shared underlying organization/person may hold several roles, but each product relationship is explicit.

Verified entity data may include name, role, description, origin where supplied, website/reference, permissions, authorship, manufacturing responsibility, source/status, and Blowin' Smoke curation rationale. House product records disclose responsible manufacturing/making entities where known. Collaboration identifies every participant and responsibility.

Brand never defaults to Manufacturer. Supplier never becomes Maker. Biography, origin, and authorship remain Unknown/Not Supplied unless verified.

---

## Part XXI — Media Model

Media Asset owns asset identity, media type, creator/source, permissions, capture date, accessibility support, and technical identity independent of any product. Media Assignment connects an asset to a subject with role, product/variant/batch scope, alt text, caption, sort/order, responsive-crop intent, status, and effective context.

Roles include Identity, Scale, Connection, Contents, Assembly, Material/Craft, Use Context, Variant, Packaging, and Proof Support where appropriate. One asset can have multiple governed assignments only when each is truthful. Alt text describes the assigned media job and does not carry hidden specifications. Media never establishes included contents, scale, proof, material, or fit by itself.

---

## Part XXII — Education & Glossary Model

Education Resource types include Guide, Glossary Term, How-to, Comparison, Measurement Help, Compatibility Help, Proof Explainer, and Care Guide. Each has identity, type, title, purpose, canonical content owner, source references, review status, audience/task, and effective context.

Relationships may connect resources to division, category, product type, product, attribute, customer task, compatibility state, or post-purchase context. One canonical glossary definition supplies inline excerpts and guide references. Page-specific copies are prohibited. Product relationships are secondary and typed; a guide cannot exist solely to place inventory.

---

## Part XXIII — Claim Model

Claim is a first-class governed object with identity, class, statement/value, subject, product/variant/batch/relationship scope, source, evidence, owner, verification status, verifier, effective date, expiration, last-reviewed date, superseded-by link, and display restrictions.

Supported classes are Product Fact, Measured Fact, Manufacturer Claim, Laboratory Result, Legal/Policy Statement, Operational Promise, Marketing Opinion, Customer Testimony, Compatibility Evidence, and Maker/Provenance Claim.

A claim cannot silently change class. Manufacturer Claim does not become Measured Fact; Customer Testimony does not become compatibility evidence; Marketing Opinion does not become Product Fact. Reclassification creates an audited decision with new evidence and preserves history.

---

## Part XXIV — Source / Provenance Model

Source types include Blowin' Smoke Verified Record, qualified Legal/Compliance Owner, Laboratory, Manufacturer, Maker/Artist, Blowin' Smoke Receiving Inspection, Blowin' Smoke Measurement/Test, Distributor/Supplier, Customer-Supplied Context, Third-Party Platform, Customer Review, Marketing, and Competitor Research.

Source records identify origin, responsible party, reference, source type, received/accessed date, permissions, scope, status, and retention/availability context. Authority is field- and scope-specific: a lab governs its test result, not retail price; an inventory system governs stock, not compatibility; a manufacturer may govern intended fit while Blowin' Smoke validation may govern a documented pair test.

Competitor Research has **zero catalog-authority status** and cannot source product facts, relationships, proof, or implementation data.

---

## Part XXV — Verification & Data Quality Model

| STATUS | MEANING |
|---|---|
| Verified | Accepted source, scope, evidence, and currency requirements are met |
| Unverified | Candidate value exists but has not passed verification |
| Unknown | No reliable determination exists |
| Not Supplied | An expected source has not provided the value |
| Not Applicable | The concept does not govern this subject |
| Stale | Previously accepted value is outside its owner-defined currency rule |
| Conflicting | Relevant accepted/candidate sources disagree |
| Pending Verification | A defined verification workflow is active |
| Superseded | A newer governed record replaces this one for current use |

Every status transition records actor/authority, evidence, previous/new status, reason, timestamp, effective date, and affected scope. Only the accountable field owner or authorized verifier can accept truth; system processes may flag staleness/conflict but cannot resolve them without a governing rule. Conflicts retain all source values until resolved. Blank means absent storage, not a semantic status.

---

## Part XXVI — Eligibility Rule Interface

This model does not create legal rules. It defines the versioned interface qualified owners must eventually supply.

Concepts include Rule identity, Rule Type, Jurisdiction, Product/Division/Type/Format/Variant Scope, Age Requirement where supplied, Destination Condition, Effective and Expiration/Superseded Dates, Source Owner, Rule Status, and Customer-Facing Explanation reference.

Evaluation distinguishes:

- **Eligible:** applicable current rules affirm progression for supplied context.
- **Ineligible:** an applicable current rule fails.
- **Unknown Rule Coverage:** no reliable applicable determination can be made.
- **Failed Rule Service:** the evaluation mechanism failed; this is not an eligibility outcome.

Unknown and failure never default to Eligible. Customer inputs remain private context and do not become catalog truth.

---

## Part XXVII — Availability, Price & Eligibility Composition

Purchase readiness composes independently governed records for exact Sellable Variant, Price State, Availability State, Eligibility State, Option Completeness, Compatibility State, Required Component State, material Proof State, and Purchase Method.

Evaluation precedence is:

1. age qualification;
2. destination eligibility;
3. product-specific eligibility;
4. product/variant availability;
5. required option completeness;
6. compatibility;
7. required components;
8. material proof requirements;
9. price resolution;
10. purchase-method completeness;
11. CTA readiness.

Composite outputs include Ready to Purchase, Selection Required, Compatibility Check Required, Restricted, Unavailable, Notify Eligible, Unknown/Unverified, and Additional Component Required. The output retains every contributing state, the highest-priority blocker, affected scope, explanation reference, recovery routes, and evaluation time.

**MASTER-SYSTEM REQUIREMENT:** CTA readiness and label are derived outputs. They are never independently authored marketing fields.

---

## Part XXVIII — Relationship Model

Relationship is first-class and supports source object, target object, type, direction, subject/variant/batch scope, conditions, evidence, verification status, provenance source, owner, effective date, and expiration/staleness.

Types include Compatible With, Incompatible With, Conditionally Compatible With, Requires, Includes, Optional With, Replaces, Replaced By, Successor To, Predecessor To, Consumed By, Uses, Care Applies To, Complementary To, Bundle Member Of, Proof Applies To, Education Applies To, Made By, Manufactured By, Sold Under Brand, Curated By, and Belongs To Collection.

Inverse retrieval is defined where useful but never assumed semantically identical. A generic “related product” may be editorial display metadata but cannot drive compatibility, requirements, replacement, or recommendation truth.

---

## Part XXIX — Recommendation Data Model

Recommendation types are Complementary, Compatible, Replacement, Successor, Care, Curated, Bundle, and Replenishment. Each recommendation identifies source and target, type, rationale, typed relationship basis, validation status, variant scope, eligibility and availability requirements, editorial start/end when applicable, owner, and source.

Suppression occurs when fit is Unknown or incompatible for a fit-dependent recommendation; the target is unavailable without a valid recovery role; eligibility fails or cannot be established where required; evidence is stale; the relationship is superseded; variant scope no longer matches; or rationale/owner is absent.

Co-purchase frequency may inform investigation but never validates a recommendation or fit relationship.

---

## Part XXX — Bundle & Kit Model

A **Kit** is one sellable product/variant whose package contents are governed as Included and whose price/stock applies to that kit identity. A **Bundle** groups independently governed sellable variants under membership, validation, and pricing rules. Required and Optional Components describe dependencies outside or inside either form. A Promotional Bundle is a time-bounded bundle state, not a product type.

Bundle data supports identity, member variants, quantity, required/optional membership, bundle price and individual-price basis where used, compatibility and eligibility validation, member availability, effective dates, and replacement behavior. Every fit-dependent member passes independently. A failed member cannot be hidden by aggregate bundle readiness. Bundle economics remain an operational input.

---

## Part XXXI — Collection & Curation Model

Collection types include Durable Collection, Curated Edit, Featured Set, and Promotional Collection. Records carry identity, title, purpose, rationale, scope, division, governed membership rule or explicit members, owner, start/end dates where bounded, status, and indexability intent.

Durable Collections may persist but do not replace category/type. Curated Edits require named human/house rationale. Featured Sets express temporary editorial priority. Promotional Collections expire with their promotion. Collections cannot repair missing taxonomy, compatibility, or attributes.

---

## Part XXXII — Search Index Consumption Model

Search may consume governed product/variant identity, brand/maker/manufacturer, type, role, category, strain, format, platform/model, part number, joint size/gender/type, angle, material, flavor, nicotine strength, resistance, education resources, verified compatibility relationships, and governed synonyms/abbreviations/misspelling mappings.

| USE CLASS | RULE |
|---|---|
| Searchable | May match customer language when source/status permits |
| Filterable | May constrain results using normalized complete-enough values |
| Facetable | May expose counts with explicit unknown handling |
| Rankable | May influence order under governed relevance/business rules |
| Display-only | May be shown but not used for matching/filtering |
| Relationship-only | May support resolver/recommendation logic but not text matching |

Search consumes an approved projection; it does not become the source of truth. Text similarity cannot derive compatibility, proof, contents, or eligibility.

---

## Part XXXIII — Page Consumption Contracts

Pages consume governed objects; they do not own duplicate catalog records.

| PAGE / SURFACE | AUTHORITATIVE OBJECTS CONSUMED |
|---|---|
| Home | Division, Category, Collection/Recommendation, Product/Variant summaries, Media, Education, Claims with display permission |
| Division landing | Division, Category, Product Type/Role, Collection, Education, proof/fit summary policy |
| Category | Category membership, Product/Variant, Attribute Values, Price, Availability, Media, eligibility/fit summary |
| Search results | Search projection of Product/Variant, entities, Category, Education, verified relationships, Price/Availability |
| Product card | Product, representative/resolved Variant, critical Attributes, Price, Availability, Media, proof/fit summary |
| THCA PDP | Product, Variant, Batch, composition results, Proof, eligibility interface, Price, Availability, Media, Claims, relationships |
| Vape device PDP | Product, Variant, technical Attributes, components, electronic compatibility, Price/Availability/Eligibility, Media, Claims |
| Pod/coil/replacement PDP | Product, Variant, platform/part Attributes, bidirectional compatibility, replacements/successors, commerce states |
| Glass complete-piece PDP | Product, Variant, measurements/material, contents, fit relationships, entity provenance, Media, commerce states |
| Fitted-component PDP | Product, Variant, connection Attributes, Physical Fit, requirements/adapters, Price/Availability, Media |
| Care PDP | Product, Variant, material/device applicability relationships, instructions, restrictions, commerce states |
| Proof route | Proof Document/Version, Laboratory, Result Groups, applicability, Batch, Claims, status/source |
| Compatibility resolver | Product/Variant identity, Attributes, electronic/physical relationships, evidence/status, Education |
| Cart | Exact Variants, Price, Availability, Eligibility result, options, compatibility, requirements, proof, bundle membership |
| Order detail | Purchased Variant snapshot/reference, order context, Batch/Proof when recorded, Education, replacements, support |
| Support | Context references to product/variant/order/batch/proof/relationship and customer-supplied private context |

Page summaries are derived projections with source links and evaluation timestamps. A page-specific copy block may add presentation language but cannot redefine a fact.

---

## Part XXXIV — Product Intake Contract

Conceptual intake stages:

1. **Identity:** proposed product, commercial identifiers, accountable entities and sources.
2. **Division / Type / Role:** governed classification and rationale.
3. **Sellable Variants:** option dimensions, valid combinations, identifiers.
4. **Source Documents:** authoritative references, permissions, currency.
5. **Technical / Physical Facts:** role-conditional attributes, units, methods.
6. **Contents:** included, required, optional, and replacement relationships.
7. **Media:** role coverage, exact subject assignment, permissions, accessibility.
8. **Proof:** batch/document/result applicability where required.
9. **Compatibility / Fit:** relationship evidence, scope, state, conditions.
10. **Claims:** classification, evidence, owner, restrictions.
11. **Pricing:** source connection and valid sellable scope.
12. **Availability:** inventory/fulfillment source connection.
13. **Eligibility Scope:** rule-interface identifiers, not legal conclusions.
14. **Education:** terminology, setup, measurement, care, or responsible-use needs.
15. **Care / Support:** operational constraints and escalation context.
16. **Verification:** field-level status, conflicts, missing requirements.
17. **Publication Readiness:** approved display, merchandising, sale, proof, and fit permissions.

All products require identity, division, type, role, at least one valid variant, price/availability interfaces, sources/statuses, critical attributes, and media or honest missing-media state. Proof, batch, compatibility, contents, and care requirements are conditional by role. Title, image, and price alone never establish readiness.

---

## Part XXXV — Publication Readiness Model

Conceptual stages are Draft, Source Collection, Pending Verification, Verified for Review, Ready for Merchandising, Ready for Sale, Published, Restricted/Held, Discontinued, and Archived. Implementations may rename them but must preserve distinct permissions.

| CAPABILITY | MINIMUM TRUTH |
|---|---|
| Display in search | Verified identity/type/role/division, safe searchable fields, route/readiness, honest price/availability display state |
| Display on category | Approved membership, card-critical facts, media/fallback, price/availability state |
| Publish PDP | Identity, valid variants, critical facts/status, sources, media/fallback, policies/support routes, explicit unknowns |
| Enable purchase | Exact variant, options complete, current price, availability, applicable eligibility, material proof/fit/requirements resolved by risk rules |
| Enable compatibility claim | Scoped relationship, sufficient evidence, verification, conditions, review rule |
| Display proof claim | Applicable document/batch relationship and current honest status |
| Display curated recommendation | Typed rationale, owner, validation, current target state, effective period if bounded |

Published is not synonymous with purchasable. A discontinued PDP can remain Published for documentation and support while Ready for Sale is false.

---

## Part XXXVI — Correction, Versioning & Audit Model

Corrections cover product facts/specifications, price, availability, proof supersession, compatibility, eligibility rules, provenance, media assignments, and claim classification. Every material change retains prior value/status, new value/status, reason, source/evidence, authorized actor, timestamp, effective date, affected scope, and known derived consumers.

Current consumers invalidate or refresh according to the changed domain. Proof supersession does not delete the prior document. Compatibility correction re-evaluates recommendations, bundles, resolver outputs, carts, and support references. Eligibility update preserves the rule version that informed prior orders while current commerce uses the active rule. This is governance, not an event-sourcing implementation prescription.

---

## Part XXXVII — Staleness & Review Model

| REFRESH CLASS | EXAMPLES | GOVERNANCE |
|---|---|---|
| Stable Until Corrected | Product identity, controlled type/role, maker identity after verification | Owner corrects when evidence changes |
| Periodic Review | Technical specification, compatibility, maker description, policies/support commitments | Field owner defines review trigger/interval |
| Event-driven Refresh | COA/batch applicability, eligibility rule, promotion, proof version | Refresh on new batch/rule/document/campaign event |
| Real-time / Near-real-time | Price, inventory/availability, checkout eligibility evaluation | Source system defines currency and failure behavior |

No review interval is invented here. Each attribute/source domain owns its staleness rule, last-reviewed time, next review trigger if applicable, and consequence of staleness. Stale data remains visible only where history/context is useful and cannot support a current positive claim when currency is required.

---

## Part XXXVIII — Discontinued Product Model

Unavailable and Sold Out are supply states; Discontinued ends intended sale; Superseded identifies a governed successor; Archived removes an object from ordinary discovery while retaining governed history.

A discontinued record retains canonical identity, variants and identifiers, specifications and sources, proof/batch links, compatibility history/current replacement relevance, included/required components, media needed for recognition, successor differences, order references, education, and support routes. Price may remain historical only when clearly scoped; purchase is disabled.

Discontinued products remain retrievable when they support order history, proof, compatibility, replacement, successor comparison, documentation, or support. They do not automatically redirect to a category.

---

## Part XXXIX — Data Privacy Boundary

| CONTEXT | BOUNDARY |
|---|---|
| Public Product Record | Governed catalog facts suitable for public consumption |
| Private Account Context | Consented saved products/devices/pieces, orders, preferences, proof access |
| Temporary Resolver Context | Short-lived owned-object identity or measurements used for a current task |
| Support Case Context | Necessary customer input, attachments, troubleshooting, and case decisions |
| Analytics Event | Purpose-limited behavior/state signal with minimization and consent governance |

Customer-supplied device identity, piece measurements, ownership, photos, eligibility inputs, and preferences are context—not public truth. They may trigger a governed verification workflow, but only accepted evidence can update the catalog. Context has purpose, access, retention, correction, and deletion rules supplied by privacy/operations owners.

---

## Part XL — Data Quality Failure Modes

Blowin' Smoke rejects:

1. title string used as the data model;
2. variant facts stored only at product level;
3. blank interpreted as Unknown;
4. Unknown interpreted as Compatible;
5. proof attached only by product name;
6. old COA applied to a new batch without relationship evidence;
7. manufacturer claim treated as measured fact;
8. brand treated as manufacturer by default;
9. photographed component treated as Included;
10. co-purchase treated as compatibility;
11. nominal joint size treated as complete physical-fit evidence;
12. supplier description treated as verified without source status;
13. promotion stored as taxonomy;
14. temporary sale collection treated as category;
15. facts copied into page-specific records;
16. legal rules hard-coded into product descriptions;
17. customer review used as specification evidence;
18. stale compatibility left active silently;
19. conflicts overwritten without an audit record;
20. publication before decision-critical truth is ready;
21. competitor research imported into catalog data;
22. derived value detached from inputs or calculation context;
23. discontinued identity/proof/fit history deleted;
24. private customer context merged into public catalog truth;
25. generic Related used to drive authoritative commerce behavior.

---

## Part XLI — Shared vs Division-Specific Schema Matrix

| DATA AREA | UNIVERSAL CORE | THCA EXTENSION | VAPE & NICOTINE EXTENSION | GLASS & ACCESSORIES EXTENSION | PRODUCT-LEVEL? | VARIANT-LEVEL? | BATCH-LEVEL? | RELATIONSHIP-LEVEL? | SOURCE REQUIREMENT |
|---|---|---|---|---|---|---|---|---|---|
| Identity | Product, variant, identifiers | Format/strain pattern | Platform/model/part | Piece/component/maker object | Yes | Yes | Rare | Entity roles | Verified catalog + accountable source |
| Type and role | Controlled shared vocabularies | THCA formats/roles | Device/consumable/replacement | Complete/fitted/care/session | Yes | Conditional | No | No | Catalog governance |
| Options | Dimension/value/valid combination | Strain, quantity | Color, flavor, strength, resistance, capacity | Color, joint size, angle | Definition | Yes | No | Dependencies | Product/manufacturer + verified catalog |
| Attributes | Governed definitions/values/units | Composition/potency semantics | Power, battery, capacity, resistance, nicotine | Material, dimensions, geometry, tolerance | Yes | Yes | Conditional | Conditions | Field-appropriate authority |
| Price | Currency, scope, effective period | Quantity/variant basis | Variant/kit/bundle basis | Variant/object/bundle basis | Derived summary | Yes | No | Bundle/promotion | Commerce source of record |
| Availability | Product summary, variant/fulfillment state | Batch inventory where used | Exact device/component variant | Exact object/component variant | Derived | Yes | Conditional | Alternative/successor | Inventory/fulfillment owner |
| Eligibility | Versioned rule interface | THCA product/format scope | Nicotine/product scope | Applicable age/product scope | Scope | Result | Sometimes | Rule applicability | Qualified compliance owner |
| Proof | Evidence/status/version/applicability | Batch-linked COA/results | Technical claim evidence | Measurement/maker/receiving evidence | Summary | Conditional | Central | Proof applies to | Lab/manufacturer/maker/validation |
| Compatibility | Six states, evidence, scope | Usually Not Applicable | Electronic platform graph | Physical geometry graph | Sometimes | Central | No | Central | Authoritative docs or validation |
| Contents | Included/required/optional/quantity | Package/quantity facts | Kit, device, coil/pod contents | Bowl/downstem/banger/adapter contents | Conditional | Central | No | Central | SKU/package + receiving |
| Media | Asset + assignment + role | Product/package/variant | Device/port/contents/configuration | Scale/connection/contents/craft | Yes | Yes | Conditional | Assignment | Original asset/permissions |
| Entity/provenance | Brand/manufacturer/maker/artist roles | Producer/brand as supplied | Brand/manufacturer distinctions | Maker/artist/studio central | Yes | Conditional | No | Made/manufactured/sold under | Verified entity sources |
| Education | Resource/task relationships | Proof, format, responsible guidance | Setup, fit, replacement | Measurement, fit, care | No | No | No | Applies-to | Accountable content source |
| Claims | Class, scope, evidence, status | Composition/potency/proof | Manufacturer technical claims | Measured/provenance claims | Yes | Yes | Yes | Yes | Claim-class authority |

The matrix describes allowed scopes, not mandatory fields. Product-type contracts decide which scope is required.

---

## Part XLII — Field Priority & Launch Requirements

| PRIORITY | FIELD FAMILIES |
|---|---|
| FOUNDATIONAL | Product identity; division; type; role; valid sellable variant; source/provenance; verification status; attribute definitions; option/combination model; price and availability interfaces; eligibility-rule interface; relationship and compatibility models; publication state |
| CORE LAUNCH | Product-role critical attributes; variant price/stock; media identity/fallback; entity roles; contents/requirements; THCA batch/proof where applicable; electronic/physical fit where material; claims; page projections; cart-readiness inputs |
| SUPPORTING | Comparison fields; richer education links; maker depth; governed reviews; curated recommendations; successors; detailed care/lifecycle; support correction workflow |
| FUTURE | Saved-owned-product linkage; replenishment timing; personalized ranking; automated relationship confidence; dynamic bundles; customer-assisted matching |

Priority is conditional by product role. A coil's resistance and platform scope may be Core Launch; those fields are Not Applicable to a storage accessory. Not every technical field is Foundational, but the definition, source, uncertainty, and validation mechanisms are.

---

## Part XLIII — Schema Validation Rules

### Error — blocks publication or the affected capability

- A sellable variant does not belong to exactly one product.
- A selected option combination maps to zero or multiple sellable variants while represented as purchasable.
- A current price lacks sellable scope, currency, source, or effective state.
- A variant-dependent attribute exists only as an unscoped product fact.
- A compatibility claim lacks exact relationship scope, evidence/status, or conditions.
- A proof claim lacks applicable product/variant/batch relationship.
- A fitted component claims Universal without bounded verified scope.
- An Included relationship lacks exact variant scope or material quantity.
- Purchase is enabled with failed eligibility, unavailable variant, verified incompatibility, unresolved required option, or invalid price.

### Warning — may permit internal progress but requires visible handling

- Media coverage is incomplete but textual truth and honest fallback exist.
- Optional supporting attribute is Not Supplied.
- A current source approaches its owner-defined review trigger.
- A non-fit-dependent recommendation target becomes unavailable.
- Entity provenance is incomplete without affecting authorship claims.

### Review Required — accountable judgment needed

- Accepted sources conflict.
- A claim may need reclassification.
- Product/variant scope is ambiguous.
- A relationship is stale, superseded, or conditional without complete conditions.
- A new type/role/attribute cannot be expressed by existing vocabularies.
- An eligibility result encounters unknown rule coverage or failed service.

A published recommendation always has typed rationale, owner, scope, current validation, and active target state. Validation outcomes retain affected object, rule, severity, reason, and resolution status.

---

## Part XLIV — Data Model Decision Matrix

| DATA AREA | DECISION | RATIONALE | GOVERNING SYSTEM REQUIREMENT | PAGE IMPACT | REQUIRES AUTHORITATIVE INPUT? | FIRST-VERSION PRIORITY | ORIGINAL BLOWIN' SMOKE DATA MODEL DECISION? |
|---|---|---|---|---|---|---|---|
| Catalog core | One shared model with extensions | Preserves one house and common state language | Master Part II/III; IA Part I | All pages consume one truth system | Yes for values | Foundational | Yes |
| Product/variant | Durable product plus exact sellable variant | Prevents option truth leakage | Master shared ontology | Cards, PDP, cart, orders | Yes | Foundational | Yes |
| Type/role | Separate controlled dimensions | What it is differs from lifecycle job | Master Part III | Navigation, filters, PDP families | Yes | Foundational | Yes |
| Attributes/units | Governed reusable definitions and scoped values | Enables honest compare/search | Master provenance; IA category/search | Category, search, PDP, resolver | Yes | Foundational | Yes |
| Taxonomy/collections | Durable category separate from editorial grouping | Prevents promotion-based architecture | IA Part IX | Navigation/category/collections | Yes | Foundational | Yes |
| Batch/proof | Evidence linked through exact applicability | Prevents false COA claims | THCA domain/proof governance | Card, PDP, proof, order | Yes | Core where applicable | Yes |
| Compatibility | Typed evidenced relationship, six states | Prevents unusable purchases | Original master fit systems | Search, resolver, PDP, cart | Yes | Foundational model/Core data | Yes |
| Physical fit | Specialized geometry relationship | Size alone is insufficient | Glass domain requirement | Resolver/PDP/cart | Yes | Core where material | Yes |
| Contents | Typed Included/Required/etc. | Prevents incomplete purchase | Master ontology/cart | PDP, kit, bundle, cart | Yes | Core | Yes |
| Claims/sources | First-class class/scope/status/provenance | Authenticity must be auditable | Master trust/provenance | Every truth-bearing surface | Yes | Foundational | Yes |
| Purchase readiness | Derived precedence across independent domains | CTA cannot hide blockers | Master state architecture | PDP/card/cart | Yes | Foundational | Yes |
| Recommendations | Governed typed presentation relation | Co-purchase is not a reason | Master recommendation governance | Discovery/PDP/cart/post-purchase | Yes | Supporting/Core recoveries | Yes |
| Publication | Capability-specific readiness | Published need not mean purchasable | IA implementation boundary | Search/category/PDP/action | Yes | Foundational | Yes |
| Privacy | Public truth separated from customer context | Respect and accuracy | Master privacy; IA account/support | Resolver/account/support | Operational rules | Foundational boundary | Yes |

---

## Part XLV — Open Data Decisions

| DECISION | WHY OPEN | WHAT RESOLVES IT | WHEN TO DECIDE |
|---|---|---|---|
| Exact product types stocked | No real assortment supplied | Approved catalog and merchandising ownership | Before intake templates and page specs freeze |
| Actual categories and depth | Depends on assortment and intent | Catalog audit and taxonomy workshop | Early product-operations phase |
| Actual option dimensions | Depends on SKU/variant patterns | SKU/package/manufacturer records | During product-type intake design |
| SKU/identifier conventions | Commerce platform and operations unknown | Inventory/commerce owner | Technical architecture planning |
| Inventory/fulfillment source | No system selected/confirmed | Operations and platform decision | Before functional availability |
| Pricing source/promotion rules | Commerce ownership/tooling unknown | Finance/merchandising/platform owners | Before functional price integration |
| Supplier feeds and acceptance | Suppliers and data quality unknown | Supplier contracts and field audit | Intake/operations specification |
| Batch granularity | Varies by product and receiving process | Catalog, laboratory, compliance, operations | Before THCA inventory/proof implementation |
| COA formats and archive | Actual documents/rights unavailable | COA corpus and compliance owner | Proof service/page specification |
| Compatibility coverage | Authoritative relationship corpus absent | Manufacturer data and validation plan | Before resolver launch scope |
| Physical measurement workflow | Procedure/instruments/tolerances not approved | Operations and product validation owners | Product intake/operations phase |
| Exact units/precision | Source data and operating needs vary | Attribute audit and measurement standards | Before data-entry/intake tooling |
| Maker/provenance availability | Permissions and sources unknown | Maker agreements and content audit | Before entity page production |
| Promotion tooling | Campaign operations unknown | Merchandising/platform decision | Before promotional collections |
| Eligibility service and rules | Qualified rules/platform absent | Legal/compliance and technical owners | Before purchase enablement |
| Support/correction platform | Case workflow and authority undefined | Support operations decision | Before support implementation |
| Review/staleness intervals | Source-specific currency rules absent | Each accountable domain owner | During operational governance |

---

## Part XLVI — Implementation Boundary

### Model can be specified now

Entity meanings, ownership, scope, relationships, uncertainty, provenance, validation, readiness, page-consumption, and correction requirements are governed by this document.

### Sample / synthetic data may be used for design

Clearly labeled synthetic records may demonstrate option dependencies, cards, PDP families, proof states, compatibility states, units, cart composition, and failure recovery. Synthetic data must be structurally realistic but visibly non-production.

### Real data required before functional commerce

Products, SKUs/variants, prices, inventory, media, batches, COAs/results, compatibility/fit, measurements, contents, maker provenance, recommendations, and successor relationships require authoritative inputs.

### Operational owner required

Catalog intake, inventory, price, fulfillment, receiving, measurement, media permissions, support, returns/damage, corrections, and staleness processes require accountable operations owners.

### Compliance owner required

Eligibility rules, warnings, policy statements, proof requirements, privacy, consent, and retention require qualified owners.

### Future capability

Saved device/piece context, replacement history, proactive replenishment, personalized discovery, automated confidence, photo-assisted identification, and dynamic bundles remain future.

Synthetic data may demonstrate structure. It must never be mistaken for actual product, proof, compatibility, eligibility, price, inventory, policy, or operational truth. This document authorizes no implementation.

---

## Part XLVII — Next Phase Recommendation

### Selected phase: A. Page-by-Page Architecture Specifications

**ORIGINAL BLOWIN' SMOKE DATA MODEL DECISION:** Page-by-page architecture is the single correct next phase.

The Master System defines behavior and trust, the IA defines page responsibilities, and this model now defines the governed objects and states those pages consume. Detailed page contracts can therefore specify precise information hierarchy, module responsibilities, dependencies, transitions, and state coverage without inventing storage or catalog truth.

That phase should produce a prioritized specification for each Foundational and Core Launch page family: customer job; authoritative inputs; above-action information; modules; state transitions; cross-page handoffs; accessibility; responsive content priority; analytics questions; synthetic-data fixtures; and real-data gates.

It can use Article I, the Master System, the IA, this data model, and the research-closure boundaries. Synthetic placeholders may demonstrate product/variant options, proof and fit states, media roles, price/availability variations, and cart interventions when clearly labeled.

Actual products, categories, prices, stock, COAs, compatibility, measurements, policies, eligibility rules, maker facts, and operating commitments must remain real-data-dependent. The next phase must not begin visual styling, technical implementation, or catalog population.

---

## Validation Record

| # | REQUIREMENT | RESULT |
|---:|---|---|
| 1 | Product versus Sellable Variant | PASS |
| 2 | Product Type versus Product Role | PASS |
| 3 | Taxonomy versus collections | PASS |
| 4 | Governed attributes and units | PASS |
| 5 | Options and valid combinations | PASS |
| 6 | Price and availability | PASS |
| 7 | THCA product/batch/proof | PASS |
| 8 | Composition and potency scope | PASS |
| 9 | Vape & Nicotine schemas | PASS |
| 10 | Electronic compatibility | PASS |
| 11 | Glass & Accessories schemas | PASS |
| 12 | Physical fit relationships | PASS |
| 13 | Included/required/replacement relationships | PASS |
| 14 | Brand/Manufacturer/Maker/Artist separation | PASS |
| 15 | Media and education records | PASS |
| 16 | Claims and provenance | PASS |
| 17 | Verification and uncertainty | PASS |
| 18 | Eligibility interface without invented rules | PASS |
| 19 | Composed purchase readiness | PASS |
| 20 | Recommendation and bundle governance | PASS |
| 21 | Page-consumption mapping | PASS |
| 22 | Product intake and publication readiness | PASS |
| 23 | Correction, staleness, and discontinued handling | PASS |
| 24 | Public catalog/private context boundary | PASS |
| 25 | Data-quality anti-patterns | PASS |
| 26 | Shared/division schema matrix | PASS |
| 27 | Launch field priorities | PASS |
| 28 | Conceptual validation rules | PASS |
| 29 | Open data decisions | PASS |
| 30 | One next phase | PASS — Page-by-Page Architecture Specifications |
| 31 | No database/application code | PASS |
| 32 | No invented product/catalog/legal facts | PASS |
| 33 | Implementation not authorized | PASS |
| 34 | Competitor research not reopened | PASS |

The validation confirms specification completeness, not functional readiness. Real-data and accountable-owner gates remain those stated in Parts XLV and XLVI.
