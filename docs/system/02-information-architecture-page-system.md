# Blowin' Smoke — Information Architecture & Page System

**Status:** Governing information-architecture specification

**Master system:** `docs/system/01-master-design-commerce-system.md`

**Implementation authorization:** Not granted

## Authority and evidence discipline

This document translates the Master Design & Commerce System into page responsibilities, routes, transitions, content ownership, states, and dependencies. It does not define visual layout, production behavior, legal rules, catalog facts, or implementation technology.

Authority resolves in this order: Article I, the Master Design & Commerce System, the four research-closure decisions, final intelligence only when the first three sources do not resolve a domain question, and original Blowin' Smoke architecture judgment.

Evidence labels used where they materially clarify authority:

- **MASTER-SYSTEM REQUIREMENT** — a direct consequence of the governing master system.
- **DOMAIN REQUIREMENT** — a product or customer truth established by completed research.
- **ORIGINAL BLOWIN' SMOKE ARCHITECTURE DECISION** — an original IA resolution; it is not competitor behavior.
- **OPEN DECISION** — a question that requires real catalog, operational, compliance, or customer evidence.

Competitor research remains closed. No route, taxonomy, interaction, or compatibility behavior in this document is attributed to a reference retailer.

---

## Part I — Site Model

### One house, three expert divisions

**MASTER-SYSTEM REQUIREMENT:** Blowin' Smoke is one house with three divisions: THCA, Vape & Nicotine, and Glass & Accessories. The site has one identity, shell, search, account, cart, trust language, accessibility standard, support system, and governed product language.

The divisions are expert contexts, not separate storefronts. They change the vocabulary, decision support, normalized attributes, proof or fit emphasis, and merchandising judgment. They do not change the fundamental navigation, page-state, action, or support grammar.

### Surface model

| SURFACE | SCOPE | PRIMARY JOB |
|---|---|---|
| Home | Global | Establish the house, orient to divisions, and expose selective discovery |
| Division landing | Division-aware | Translate a division into customer jobs, durable routes, and decision guidance |
| Category/subcategory | Division- and product-role-aware | Support durable browse, comparison, filtering, and contextual education |
| Collection/curated edit | Global or division-aware | Present a bounded selection with an explicit rationale |
| Search/results | Global with optional division context | Resolve known-item, need, educational, replacement, and fit intent |
| Product detail | Product-type-aware | Resolve whether the exact sellable state is right, usable, eligible, and actionable |
| Learn/guide/glossary | Educational and context-aware | Teach a real decision or task and return the customer to relevant commerce |
| Compatibility/fit help | Division- and relationship-aware | Resolve or honestly escalate electronic compatibility and physical fit |
| Brand/maker/artist | Entity-aware | Establish verified identity, provenance, curation rationale, and relevant work |
| Cart | Transactional | Revalidate the intended purchase and expose material blockers or dependencies |
| Account/orders | Transactional and private | Preserve order, documentation, proof, support, and optional owned-product continuity |
| Support | Supporting and context-aware | Resolve uncertainty without discarding product, cart, fit, proof, or order context |
| Policy/trust | Global with contextual links | Publish governed legal, operational, accessibility, and evidence information |
| Post-purchase | Order- and product-aware | Continue setup, proof, care, replacement, and recovery after purchase |

### Relationship among surfaces

Home routes to divisions and global tasks. Division landings route by customer job before demanding expert taxonomy. Categories enable comparison within durable product roles. Search cuts across the hierarchy without replacing it. PDPs are the authoritative purchase-decision surface. Learn, proof, fit, maker, policy, and support surfaces answer specialized questions and return context to the decision. Cart revalidates rather than introducing product truth for the first time. Account and post-purchase surfaces retain exact order and variant context.

**ORIGINAL BLOWIN' SMOKE ARCHITECTURE DECISION:** Every page belongs to one coherent graph. A division route must always retain a clear route back to the whole house, and no page may create a division-specific account, cart, trust model, or interaction system.

---

## Part II — Complete Sitemap

The tree is conceptual. Slugs illustrate durable meaning and do not finalize framework syntax.

```text
/
├── /thca
│   ├── /thca/{category}
│   └── /collections/{curated-thca-edit}
├── /vape-nicotine
│   ├── /vape-nicotine/{category}
│   └── /collections/{curated-vape-edit}
├── /glass-accessories
│   ├── /glass-accessories/{category}
│   └── /collections/{curated-glass-edit}
├── /collections/{curated-cross-house-edit}
├── /products/{product-slug}
├── /search
├── /compatibility
│   ├── electronic compatibility mode
│   └── physical fit mode
├── /learn
│   ├── /learn/guides/{guide-slug}
│   └── /learn/glossary/{term-slug}
├── /proof
│   └── /proof/{stable-proof-reference}
├── /makers
│   └── /makers/{entity-slug}
├── /cart
├── /account
│   ├── /account/orders
│   └── /account/orders/{order-reference}
├── /support
│   └── contextual support-intent and case state
├── /about
└── /policies
    ├── /policies/shipping
    ├── /policies/returns-damage
    ├── /policies/privacy
    ├── /policies/terms
    ├── /policies/accessibility
    ├── /policies/age-eligibility
    ├── /policies/product-warnings
    └── /policies/authenticity-proof
```

Non-page surfaces include the global search entry, search suggestions, division navigation layer, quick-cart drawer, contextual glossary disclosure, PDP proof module, PDP fit module, eligibility explanation, notification request, and modal/dialog states. They do not receive independent routes merely because they exist as components.

### Page-type disposition

| PAGE TYPE | DISPOSITION | JOB |
|---|---|---|
| Home, division landings, durable categories, PDPs, search, cart, account/orders, support, core policies | REQUIRED | The minimum coherent commerce and trust system |
| Curated collections, substantive maker pages, proof routes, guides/glossary, compatibility resolver | REQUIRED when governed content/data exists; otherwise CONDITIONAL at launch | Distinct discovery, evidence, or decision jobs |
| Saved owned-product profiles, replacement history, personalized discovery | FUTURE | Valuable only with consent, authoritative relationships, and operating support |
| Generic blog, thin filter pages, empty entity pages, location-page farms, campaign-derived permanent taxonomy | REJECTED / UNNECESSARY | No distinct durable customer job |

---

## Part III — URL & Routing Philosophy

### Governing principles

1. Stable routes represent durable customer intent or stable shareable evidence.
2. Human-readable language reflects Blowin' Smoke taxonomy, not supplier strings or temporary campaigns.
3. Product identity has one canonical route regardless of where discovery began.
4. Division context is preserved in breadcrumbs, navigation, and return paths; it need not duplicate the product URL.
5. Meaningful product configuration may be addressable only when it is non-sensitive, valid, and stable enough to share.
6. Search, filter, and resolver state must not create uncontrolled indexable URL combinations.
7. Discontinued product routes remain useful when they support documentation, proof, compatibility, successor, replacement, or support needs.

### State location

| STATE LOCATION | USE | DO NOT USE FOR |
|---|---|---|
| Path | Stable entity, durable category, guide, proof record, or distinct customer intent | Ephemeral promotion, sort, temporary inventory, or every attribute combination |
| Query parameter | Search terms, filters, sort, pagination, shareable non-sensitive resolver inputs, valid variant selection | Canonical identity or private customer context |
| Session/client state | Open drawer/dialog, temporary comparison, recent scope, in-progress anonymous resolver choices | Sole storage of a meaningful selected variant or required support context |
| Account context | Consented saved device/piece, order, proof history, preferences, support case | Undisclosed personalization or facts not verified by the catalog |

Filters refine a category; they do not automatically become categories. Collections use durable editorial identifiers but are not allowed to redefine product type. Compatibility results expose the selected owned object or measurements and verification state, but private context stays out of public URLs.

Renames use redirects from prior canonical routes. Merged products redirect only when identity and customer intent genuinely match. Discontinued products remain at their canonical route when documentation, proof, successor differences, fit history, or support value remains; otherwise they redirect to the closest durable category, never an arbitrary product.

**OPEN DECISION:** Final slug conventions, locale behavior, pagination syntax, canonical query policy, and retention period for discontinued routes require the actual platform, catalog, and search design.

---

## Part IV — Global Navigation

### Primary navigation

Always-visible primary destinations are:

1. THCA
2. Vape & Nicotine
3. Glass & Accessories

The house identity returns to Home. Search, account, and cart are persistent utilities. Learn and Support receive durable utility access; their exact prominence may change by viewport without changing availability.

### Division navigation contract

Each division layer contains a restrained set of:

- customer-job entrances;
- durable product-role/category entrances;
- one education or help entrance relevant to high-risk confusion;
- at most a small, clearly labeled current curation area;
- a route to the full division landing.

THCA emphasizes product formats and proof. Vape & Nicotine separates devices, consumables, replacements, and accessories. Glass & Accessories separates complete pieces, fitted/replacement components, universal/session accessories, care, and makers.

Temporary campaigns appear as bounded editorial links inside a division or collection area. They do not become permanent primary items. Deep attributes such as strain, nicotine strength, resistance, joint size, angle, and material remain contextual filters, search concepts, or fit inputs rather than global navigation.

### Orientation rules

- The active division is explicit without making the customer feel trapped inside a separate store.
- Breadcrumbs restore category and division context on deep pages.
- Search can be global or scoped, and the active scope is always visible and removable.
- Account and cart span all divisions.
- Utility destinations never compete with the three core division choices through a catalog-length menu.

**ORIGINAL BLOWIN' SMOKE ARCHITECTURE DECISION:** The navigation first asks “Which expert area or customer job?” It does not expose the full attribute model or require technical vocabulary at the top level.

---

## Part V — Homepage Information Architecture

### Responsibility sequence

1. **House identity:** state who Blowin' Smoke serves and the independent standard it represents.
2. **Three-division entry:** explain the distinct job of each division and route clearly.
3. **Why it matters:** demonstrate judgment through product truth, fit, proof, education, and service rather than generic claims.
4. **Selective discovery:** expose a small number of current products or edits with an explicit reason for attention.
5. **Knowledge entry:** route to a timely guide, glossary concept, proof explanation, or fit task.
6. **Trust and operation:** expose the most consequential shared trust commitments and the route to governed detail.
7. **Independent story and service:** connect the house's point of view to About and Support without repeating the opening message.

The homepage's primary conversion is correct orientation. Product conversion is secondary and must follow sufficient context.

### Exclusions

The homepage must not contain a full category tree, three mini-homepages, every promotional state, long specification or policy blocks, an unbounded product grid, deep compatibility forms, repetitive trust icons, generic corporate filler, or parallel CTAs that lead to the same destination.

Current merchandising earns space only when it is bounded, truthful, cross-house relevant or clearly division-labeled, and subordinate to identity and routing.

---

## Part VI — Division Landing: THCA

### Page job and sequence

1. Orient to THCA using factual product and eligibility language.
2. Route by durable product type/format before strain, quantity, or promotion.
3. Explain the consequential choices: format, strain context, quantity/value basis, composition/potency semantics, and proof scope.
4. Expose product-linked COA/proof access and current eligibility context without writing legal conclusions.
5. Present selective curation with a defensible rationale.
6. Offer strain, value, format, or need-based discovery as governed filters or edits.
7. Connect to responsible education and support.

### Placement contract

| CONTENT | OWNER SURFACE |
|---|---|
| Division definition and durable format orientation | THCA landing |
| Full browsable assortment and normalized filters | Category |
| Exact variant, price, proof, eligibility, and purchase state | PDP |
| Full COA/batch evidence and document status | Proof surface |
| Complex composition, proof, storage, or responsible-use teaching | Guide |

The landing may summarize proof expectations but cannot imply every product has current proof. It may identify quantity/value routes but cannot invent value claims or turn a sale into taxonomy.

---

## Part VII — Division Landing: Vape & Nicotine

### Page job

The landing explains product roles before expert terms. Its first decision is whether the customer wants a complete device, a consumable, a replacement for something owned, a disposable, a nicotine format, or help identifying the need.

### Intent entrances and destinations

| CUSTOMER LANGUAGE | ROUTE |
|---|---|
| I want a device | Refillable device/kit category with role guidance |
| I need something for my device | Compatibility resolver in device-first mode |
| I need a replacement | Replacement search/resolver preserving model or part context |
| I want a disposable | Disposable category |
| I want e-liquid | E-liquid category with nicotine and hardware-suitability guidance |
| I want nicotine pouches | Nicotine pouch category |
| I don't know what I need | Guided education, then contextual search or support |

### Information sequence

1. Division and product-role orientation.
2. Plain-language intent entrances.
3. Durable role categories: disposables; refillable devices/kits; e-liquid; nicotine pouches; pods/cartridges; coils; tanks; replacements; accessories.
4. Platform and lifecycle explanation.
5. Original compatibility help entry.
6. Curated discovery with relationship reasons.
7. Technical education, responsible information, and support.
8. Bounded current merchandising.

**DOMAIN REQUIREMENT:** A legitimate available component can still be unusable because it does not fit the customer's platform. Pods, coils, tanks, and cartridges therefore cannot be presented as isolated inventory lists without a route to supported devices and conditions.

---

## Part VIII — Division Landing: Glass & Accessories

### Intent entrances

| CUSTOMER LANGUAGE | ROUTE |
|---|---|
| I want a complete piece | Complete-piece category with type and scale orientation |
| I need a part for something I own | Physical-fit resolver in owned-piece mode |
| I need a replacement | Replacement search/resolver with component role and measurements |
| I need cleaning or care | Maintenance category filtered by verified material applicability |
| I want to shop by maker | Substantive maker index/entity routes |
| I don't know my size or fit | Measurement help, resolver, then support if unresolved |

### Information sequence

1. Division orientation and complete-versus-component distinction.
2. Plain-language customer-job entrances.
3. Durable roles: complete pieces, fitted components, replacement components, universal accessories, maintenance, and session tools.
4. Physical fit explanation: size, gender/type, angle, length, orientation, and clearance as applicable.
5. Maker/artisan and craftsmanship discovery grounded in verified provenance.
6. Care and fragile-product support.
7. Curated discovery and bounded current merchandising.

Complete-piece categories may include bongs/water pipes, dab rigs, and hand pipes/bubblers. Fitted components may include bowls, bangers/nails, ash or reclaim catchers, downstems, and adapters. Grinders, storage, and lighters/torches belong according to actual product role. No item is called universal without verified scope.

---

## Part IX — Category & Collection Architecture

### Definitions

| OBJECT | DEFINITION | DURABILITY |
|---|---|---|
| Category | Stable product-type or customer-job grouping | Durable |
| Subcategory | A stable, meaningful child whose intent differs from its parent | Durable when catalog depth supports it |
| Collection | Governed group assembled around a durable or editorial rationale | Durable or bounded, but not taxonomy |
| Curated edit | Small opinionated selection with a named reason | Bounded editorial surface |
| Promotion | Time- and rule-bounded merchandising state | Temporary; never taxonomy |
| Search result | Query interpretation across normalized objects | Stateful, not a category |
| Compatibility result | Verified relationship output for supplied context | Stateful and evidence-dependent |

### Category page contract

A category page provides concise orientation, valid sub-routes, normalized filters, explicit sort, stable product cards, optional comparison, contextual education, eligibility or fit context, and zero-result recovery. Education above the grid is limited to information needed to understand the category and first choices. Inline help explains a field when used. Deeper teaching and long guides follow the product set or open in context without displacing it.

Filters appear only when normalized data coverage and decision value justify them. Unknown values remain honest. Curated modules obey active constraints. Support appears at likely failure points rather than as a generic footer-only escape.

---

## Part X — THCA Category System

### Conceptual hierarchy

```text
THCA
├── product type / format categories
│   ├── flower
│   ├── pre-rolls
│   ├── concentrates
│   └── other verified catalog-supported formats
├── curated collections
└── filters and search dimensions
    ├── strain
    ├── quantity
    ├── composition/potency where properly scoped
    ├── proof state
    ├── availability
    └── bounded promotion
```

These are candidate concepts, not a claim that every listed format will be stocked.

Product type and format can earn category routes when they represent durable intent and sufficient assortment. Strain, quantity, composition, potency, proof, availability, and price/value generally remain filters, product options, search concepts, or curated edits. A strain may receive a stable educational/entity route only if governed information beyond a product grid exists. “Sale,” “best seller,” package size, and potency bands do not become permanent taxonomy by default.

---

## Part XI — Vape & Nicotine Category System

### Conceptual hierarchy

```text
Vape & Nicotine
├── disposables
├── refillable devices and kits
├── consumables
│   ├── e-liquid
│   └── nicotine pouches
├── components and replacements
│   ├── pods and cartridges
│   ├── coils
│   ├── tanks
│   └── other verified replacements
└── accessories
```

Device type, complete-product role, consumable format, and replacement job can earn routes. Platform and brand may earn navigation or entity routes only when catalog depth and customer intent support them. Nicotine strength/format, capacity, resistance, power, flavor, model version, connection, and availability are normalized filters or search fields. Compatibility is a verified relationship, never a title-derived filter.

Every component/replacement category supplies a route to “works with” context. A component result identifies role, platform/model, critical option, fit state, and supported-device route when verified. Unknown fit is visible and cannot be filtered into “compatible.”

---

## Part XII — Glass & Accessories Category System

### Conceptual hierarchy

```text
Glass & Accessories
├── complete pieces
│   ├── bongs / water pipes
│   ├── dab rigs
│   └── hand pipes / bubblers
├── fitted and replacement components
│   ├── bowls
│   ├── bangers / nails
│   ├── ash / reclaim catchers
│   ├── downstems
│   └── adapters
├── universal accessories, where scope is verified
├── maintenance and care
├── session tools
└── makers / artists
```

Complete-piece type, fitted-component role, replacement intent, maintenance, and session-tool intent can earn routes. Material, height, joint size, joint gender/type, angle, effective length, other dimensions, and fit status remain normalized filters, comparison fields, or resolver inputs. “14 mm,” “45 degree,” and material names are not standalone categories by default.

**DOMAIN REQUIREMENT:** Nominal joint size alone is insufficient. Category and result architecture must preserve gender/type, angle, orientation, length, clearance, material, included/required components, and handmade tolerance when applicable.

---

## Part XIII — Search Architecture

### Search surfaces

- **Global search** interprets the whole house and labels division and product role.
- **Division-scoped search** applies an explicit removable scope; it never silently hides other divisions.
- **Suggestions/autocomplete** distinguish products, categories, makers, guides, model/part concepts, and recent consented context.
- **Results** group or rank by interpreted intent, not raw marketing-string frequency.
- **Compatibility and replacement modes** require relationship context and show verification state.

### Query interpretation

| CONCEPTUAL QUERY | INTERPRETATION DUTY |
|---|---|
| Blue Dream | Disambiguate strain, product identity, guide, or other governed entity; do not invent the intended product |
| Geek Bar | Recognize a brand/product identity concept and expose relevant product roles |
| Caliburn G4 pod | Treat model plus component role as a likely compatibility/replacement query |
| 0.8 ohm coil | Treat resistance as a component attribute; require platform context before claiming fit |
| 14mm bowl | Interpret component type plus nominal size; retain gender/type and fit as unresolved inputs |
| 45 degree ash catcher | Interpret component, angle, and likely physical-fit intent; request remaining geometry |
| how do I know my joint size | Route education/measurement help ahead of product results |

These examples define interpretation behavior, not actual results or inventory.

### Result contract

Each product result communicates division when mixed, role/type, identity, critical facts, selected or representative price basis, availability, material eligibility state when known, proof or compatibility state when material, and a truthful action. Entity and guide results use distinct labels so education is not disguised as product inventory.

Ambiguous queries ask for the smallest useful refinement: division, product role, owned product, model, measurement, or task. No results preserve the query and constraints, identify what failed, offer safe relaxation, link to a relevant guide, or escalate with context. Search never removes an eligibility or compatibility constraint without disclosure.

**OPEN DECISION:** Ranking weights, synonym governance, index coverage, typo tolerance, and privacy limits require the real catalog, search platform, and analytics policy.

---

## Part XIV — Product Detail Page Families

### Architecture decision

**ORIGINAL BLOWIN' SMOKE ARCHITECTURE DECISION:** Use one universal PDP shell with governed product-type families. A separate template exists only when the customer job, required evidence, configuration, media, or state cannot be expressed through shared modules.

### Shared PDP skeleton

All families follow: orientation; identity and maker/brand; essential facts; configuration; price; availability; eligibility; proof and/or fit; state-derived action; decision-oriented media; detailed facts/specifications; contents and requirements; education/setup/care; reviews; reasoned recommendations; policy and support.

Above the primary action, every family must resolve the exact sellable state, decision-critical facts, required options, price, availability, material eligibility, fit/proof, included or required component issues, and the truthful next action. Deep detail may use progressive disclosure but blockers may not.

### Family contracts

| FAMILY | CUSTOMER JOB | ABOVE-ACTION / OPTIONS | PROOF OR FIT | MEDIA JOBS | DEEP INFORMATION, EDUCATION, RECOMMENDATIONS, SUPPORT |
|---|---|---|---|---|---|
| THCA product | Choose the right format, strain, quantity, and verified product state | Format, strain and quantity as separate dimensions; scoped composition/potency; price, stock, eligibility | Current product/batch proof state and direct access | Exact format/package/quantity and variant identity | COA, composition semantics, storage, responsible guidance; reasoned complements or replenishment; proof/eligibility support |
| Disposable | Choose a complete-use product with understood configuration and lifecycle | Model, flavor, nicotine configuration, capacity, battery/charging, selected price and stock | Technical claims carry source; compatibility only when another object governs use | Exact device, controls/ports, scale, selected variant | Full specifications, charging, disposal/lifecycle; contextual care or successor; technical support |
| Refillable device/kit | Choose a platform and understand what is included and required | Platform/model, power/battery, included components, required pod/tank/coil, options | Verified supported components and conditions | Device, controls, ports, contents, assembly, scale | Setup, operating constraints, replacement lifecycle; compatible components only; device support |
| E-liquid | Choose a consumable suitable for preference and hardware class | Volume, nicotine format/strength, flavor, suitability context, price and eligibility | Hardware suitability must be sourced; unknown is disclosed | Exact package and option differentiation | Composition where governed, use/storage guidance; compatible consumables/accessories only when valid; support |
| Nicotine pouch | Choose format, strength basis, count, and flavor | Strength basis, count, flavor, selected price, eligibility/warnings | Product claims and composition use governed sources; compatibility usually not applicable | Package, count/format, exact option | Ingredients/composition where required, responsible information; contextual alternatives; support |
| Pod/coil/replacement | Restore or maintain a known device/platform | Part/model, platform, resistance/capacity/count, exact variant, required conditions | Bidirectional compatibility state is central | Part recognition, connector, packaging/count, variant | Supported devices, operating range, replacement steps; verified replacements/successors; unknown-fit support |
| Complete glass piece | Choose a usable complete object with understood scale and contents | Type, material, essential dimensions, connections, included/required parts, fragility context | Physical relationships and provenance where relevant | Identity, standardized scale, joints, contents, assembly, craft | Full measurements, care, tolerances, maker context; verified fitted parts/care; damage/fit support |
| Fitted component | Find a part that physically fits an owned piece | Role, size, gender/type, angle, length/clearance as applicable, selected variant | Bidirectional physical-fit state and conditions are central | Connection, orientation, measurement, scale, contents | Measurement method, tolerances, adapters/requirements; verified fits/replacements; unknown-fit support |
| Care/maintenance | Choose a method/product safe for the owned material or device | Applicable materials/products, prohibited use, format/quantity, required steps | Applicability is a verified relationship; never assumed universal | Product identity, quantity, method/contents | Instructions, handling, material limitations; applicable care complements; support |
| Maker/artist object | Evaluate a specific work whose authorship or craft affects value | Object identity, maker/studio role, verified material/dimensions, uniqueness/variant, fulfillment | Provenance and claim status; fit if functional | Exact object, scale, craft/detail, signature/contents where verified | Maker provenance, method, care, unique variation; related work by rationale; fragile-product support |

Reviews remain contextual testimony. They never establish proof, compatibility, measured specifications, or eligibility. Recommendations follow a typed reason and appear only after the primary product decision is understandable.

---

## Part XV — Compatibility & Fit Page System

### One governed resolver, multiple task modes

**ORIGINAL BLOWIN' SMOKE ARCHITECTURE DECISION:** Blowin' Smoke uses one conceptual Compatibility & Fit resolver framework with electronic and physical domains. “Find parts,” “check compatibility,” and “find a replacement” are modes of the same governed relationship system, not disconnected tools.

| CUSTOMER TASK | PRIMARY SURFACE | SUPPORTING SURFACES | STATUS |
|---|---|---|---|
| Find parts for my device | Dedicated resolver, device-first mode | Search mode, PDP module, support | Conditional core capability |
| Check device compatibility | PDP inline check or resolver | Cart validation | Core wherever relationship is material |
| Find a replacement | Search/resolver replacement mode | Sold-out PDP, order detail | Core relationship pattern; data-dependent |
| Find parts for my piece | Dedicated resolver, owned-piece or measurement mode | PDP, search, support | Conditional core capability |
| Check physical fit | PDP inline check or resolver | Cart validation | Core wherever fit is material |
| Measure my joint | Contextual help and dedicated guide | Resolver input help | Supporting |
| I don't know what I own | Guided identification followed by support | Future account profile | Core escalation; automated matching is future |
| Save my device or piece | Account feature | Resolver recall | Future |

### Resolver contract

The resolver accepts a verified catalog object, model/part identity, or relevant normalized measurements; distinguishes electronic and physical schemas; displays the supplied context; returns Compatible, Incompatible, Conditionally Compatible, Universal, Unknown/Unverified, or Not Applicable; explains evidence and conditions; and preserves context into product, cart, or support.

Electronic relationships may connect device/platform, pod/tank/cartridge, coil/replacement, compatible consumable, and accessory. Physical relationships may connect complete piece, bowl/banger/nail, catcher, adapter, downstem/replacement, and care product. Relationships are bidirectional where meaningful.

Unknown fit never becomes positive. Customer images, names, appearance, co-purchase history, or competitor information are not fit evidence. Actual matches cannot become functional until authoritative manufacturer, maker, receiving, measurement, or product-pair verification data exists.

---

## Part XVI — Education / Learn Architecture

### Content system

| TYPE | DISTINCT JOB | ROUTE BEHAVIOR |
|---|---|---|
| Guide | Teach a multi-step or consequential decision | Stable public route; linked contextually |
| Glossary | Define one governed term and its decision consequence | Stable term route when substantive; inline excerpt elsewhere |
| Comparison | Explain meaningful differences among roles/options | Guide or contextual comparison, not auto-generated pages |
| How-to | Complete a setup, care, measurement, or post-purchase task | Guide route when reusable; inline when short |
| Measurement help | Teach verified measurement procedure | Guide plus resolver/PDP excerpt |
| Compatibility help | Explain relationship states and required inputs | Guide plus resolver/PDP excerpt |
| Product-proof explainer | Explain proof scope, status, batch, and limitations | Guide plus proof/PDP excerpt |
| Care/post-purchase guide | Support safe setup, storage, cleaning, or replacement | Public guide linked from exact order/product context |

`/learn` is a task-oriented index organized by division, decision, and customer need—not publication chronology. Education returns to relevant categories, products, proof, fit, or support, but product placement never becomes the reason a guide exists.

Short definitions and one-step help remain inline or in disclosure. Dedicated pages require depth, reuse, and a stable shareable need. There is no generic blog, keyword calendar, or duplicate FAQ architecture.

---

## Part XVII — COA / Proof Architecture

### Access paths

- Product cards may expose a concise applicable proof status and route to the PDP.
- The PDP owns current selected-product or batch context and links to the proof record.
- Order detail preserves the exact purchased variant/batch relationship when available.
- `/proof` provides a lookup or explanation entry; it does not imply universal proof coverage.
- A stable direct proof route supports sharing, document retrieval, status, and archival continuity.
- Support receives product, order, batch/document, and encountered state.

### Proof states and surfaces

| STATE | REQUIRED RESPONSE |
|---|---|
| Current product proof | Identify product/batch scope, issuer, date/status, and accessible document |
| Batch document | Preserve exact batch/sample/method relationship and source |
| Stale document | Label stale, retain date/history, avoid current-proof claim, route to current evidence/support |
| Missing document | State absence without substituting marketing language; suppress unsupported claim |
| Unmatched batch | Explain that the document cannot be applied to the selected batch; seek exact context/support |
| Archived proof | Keep status and historical scope visible; never present it as current |

**DOMAIN REQUIREMENT:** Proof is product- and batch-scoped. A generic lab page or badge cannot substitute for the applicable record. No actual COA, result, eligibility claim, or batch relationship may be invented.

---

## Part XVIII — Brand / Maker / Artist Architecture

### Entity distinctions

Brand, manufacturer, maker, artist/studio, house product, and collaboration are separate roles. A product can reference more than one, but the page must not merge authorship, manufacturing, ownership, or curation into a vague brand label.

An entity earns a page only when there is verified identity and enough substantive material to answer at least two jobs beyond filtering: provenance, relationship to Blowin' Smoke, methods/materials, accountable claims, education/context, collaboration detail, or a meaningful body of products.

The page contains verified identity, role, provenance, why Blowin' Smoke carries the work, relevant products, useful context, claim sources/status, and support where authenticity or care questions arise. A bare logo, generic biography, or product grid does not qualify.

House products and collaborations disclose all relevant roles. Thin pages are rejected; simple brand filtering stays within search/category until substance exists.

---

## Part XIX — Cart Information Architecture

### Quick cart versus full cart

| QUICK CART / DRAWER | FULL CART PAGE |
|---|---|
| Confirm the recent add and show concise line identity, variant, quantity, price, and immediate state | Revalidate every line and relationship before checkout |
| Permit simple quantity/remove actions when state remains valid | Explain eligibility, compatibility, missing components, bundles, proof issues, fulfillment, price and availability changes |
| Show the highest-priority blocker and route to resolution | Support block, warn, inform, confirm, or contextual escalation |
| Link to full cart; never hide a material problem | Preserve changes, affected scope, and recovery across all items |

The quick cart is not a substitute for a complex validation surface. If an issue cannot be understood safely in the drawer, the action routes to the full cart with state preserved.

Verified restriction, unavailable state, invalid price, unresolved mandatory selection, or verified incompatibility in a claimed setup blocks progression. Unknown fit is never shown as compatible and is warned, blocked, or escalated according to risk. A required missing component is named. Price changes identify prior and current state. Sold-out or changed items offer only verified replacements, successors, or alternatives with relationship reasons.

Checkout remains outside this document.

---

## Part XX — Account & Owned-Product Architecture

| CAPABILITY | CLASSIFICATION | CUSTOMER JOB |
|---|---|---|
| Account overview | CORE | Orient to orders, support, and current account state |
| Profile/contact basics | CORE | Maintain information required for legitimate account service |
| Orders | CORE | Find transactions and exact purchased configurations |
| Order detail | CORE | Access status, items, documents, proof, care, replacement, and support context |
| Consent/preferences | CORE where collected | Understand and change permissions without dark patterns |
| Saved products | SUPPORTING | Retain deliberate product interest without implying ownership |
| Support cases | SUPPORTING | Continue a case without restating context, if the support operation supports cases |
| Saved device | FUTURE | Reuse a consented owned-platform context for fit and replacement |
| Saved glass piece | FUTURE | Reuse consented identity/measurements for physical fit |
| Proof/COA history | FUTURE as aggregate; exact order access is CORE | Retrieve historical evidence across orders |
| Replacement history | FUTURE | Recall prior verified replacements and lifecycle context |
| Personalization profile unrelated to a clear service job | REJECTED | No respectful customer job |

Saved context is opt-in, editable, removable, and separate from marketing consent. Customer-supplied ownership is not automatically catalog truth.

---

## Part XXI — Post-Purchase Page System

Order confirmation states the confirmed transaction, exact items/configurations, immediate fulfillment context, and routes to order detail, documents, guidance, or support. It must not become a cross-sell wall.

Order detail is the private continuity hub. It owns purchased variant identity, order state, applicable proof links, included-content references, and case linkage. Public guides own reusable setup, care, measurement, and responsible-use instruction; order detail deep-links to the relevant sections with purchased context.

THCA post-purchase emphasizes applicable proof, storage/handling, and fulfillment. Vape emphasizes setup, charging, included parts, verified consumables/replacements, and maintenance. Glass emphasizes contents check, assembly, care, retained measurements when consented, replacements, and damage/breakage support.

Reorder or replacement actions revalidate current price, availability, eligibility, proof, compatibility, and successor differences. Past purchase is not proof that the current state remains valid.

---

## Part XXII — Support Architecture

### Intent model

Support begins with customer intent: order issue, shipping, return, damage, missing component, product question, THCA proof, eligibility, device compatibility, glass fit, technical help, or care.

| SUPPORT LAYER | JOB |
|---|---|
| Self-service | Resolve stable policy, guide, proof, order, setup, measurement, or known-state questions |
| Contextual help | Explain a term or state without abandoning product, resolver, cart, or order context |
| Human escalation | Transfer an unresolved material question and known evidence to an accountable person |
| Case/ticket state | Preserve progress, attachments, decisions, and a case reference when the operating model supports it |

The handoff package may include, with necessity and consent: selected product/variant, division, role, platform, measurements, fit or eligibility state, proof record, cart/order context, customer input, attachments, and prior steps. Service channel, hours, response time, warranty authority, and case tooling remain open operational decisions.

Support answers do not silently become catalog facts. Corrections enter governed data workflows.

---

## Part XXIII — Trust / Policy Architecture

| SURFACE | CLASS | RESPONSIBILITY |
|---|---|---|
| Shipping | Operational/policy | Current fulfillment commitments and constraints from accountable owners |
| Returns and damage/breakage | Operational/policy | Current eligibility, process, exceptions, and fragile-product recovery |
| Warranty | Operational/policy | Applicable scope and responsible party when a real program exists |
| Privacy | Legal/policy | Collection, use, choice, retention, and rights as supplied by qualified owners |
| Terms | Legal/policy | Governing terms from qualified owners |
| Accessibility | Trust/operational | Accessibility commitment and support route |
| Age and eligibility | Legal/policy plus education | Explain qualification categories and current governed rules without improvising advice |
| Product/nicotine warnings | Legal/product-specific | Governed warnings surfaced contextually and in full policy context |
| Authenticity and proof | Trust/educational | Explain provenance, claim classes, proof states, and correction practice |
| Contact/support | Operational | Route real customer intents into the support system |

Product-specific warnings, eligibility outcomes, COA status, technical constraints, and fit belong on the relevant product or transaction surface, consuming governed sources. Pages link to full policy rather than manually copying text. This document defines locations only; it does not write legal or operating policy.

---

## Part XXIV — Footer Architecture

The footer supports retrieval after the primary task and provides durable fallback access.

| GROUP | CONTENT |
|---|---|
| Shop | Three division landings and, at most, their highest-value durable category entrances |
| Learn | Learn index, guides, glossary, compatibility/fit help, proof explanation |
| Support | Support hub, order help, shipping, returns/damage, contact route |
| About | House story and substantive maker/partnership context where applicable |
| Policies | Privacy, terms, accessibility, age/eligibility, warnings, authenticity/proof |
| Account | Account, orders, and cart where these are not already persistently obvious |

The footer does not repeat the complete category tree, all active filters, temporary campaigns, every maker, every guide, or the same link under multiple headings. Required legal and accessibility access remains durable even when also available contextually.

---

## Part XXV — Cross-Division Journeys

| JOURNEY | ENTRY | DECISION | PAGE TRANSITION | STATE | FAILURE PATH | RECOVERY |
|---|---|---|---|---|---|---|
| New customer → THCA → proof → cart | Home or external landing | Choose THCA, format, product, then verify selected proof/eligibility | Home → THCA landing → category/search → THCA PDP → proof route → PDP/cart | Division context; selected variant; current proof; eligibility; readiness | Missing/stale proof, restricted destination, unavailable variant | Explain state; preserve product/variant; route current evidence, eligible recovery, valid alternative, or support |
| Returning vape customer → part | Search or order detail | Identify owned device and exact replacement need | Search/order detail → compatibility resolver → component PDP → cart | Device/platform; part option; verified fit; stock | Ambiguous model, unknown relationship, sold-out exact part, changed successor | Request smallest refinement; show unknown honestly; verified replacement/successor with differences; contextual support |
| Glass customer needs a bowl | Glass landing, search, or owned product | Identify piece/joint measurements and candidate component | Glass landing → fit help/resolver → fitted-component PDP → cart | Owned piece or measurements; size; gender/type; fit state | Joint size alone supplied, clearance unknown, relationship unverified | Measurement guide; retain inputs; conditionally compatible explanation; support handoff with context |
| Customer does not know what they need | Home, division landing, or search | Clarify job before product vocabulary | Division landing → guided education/search → category/PDP | Stated task; division; known constraints | Jargon mismatch, ambiguous task, no safe recommendation | Plain-language choices; guide; query refinement; support without restarting |
| Customer finds ineligible product | Search, category, or PDP | Understand restriction and whether another valid path exists | Discovery surface → restricted explanation → safe recovery | Age/destination/product rule category; product context | Qualification service error mistaken for restriction; arbitrary substitute | Distinguish error from ineligibility; preserve non-sensitive context; retry, policy explanation, or support; never invent legal advice |
| Product sold out | Category, PDP, cart, or order history | Decide whether to wait, replace, or choose a validated alternative | Sold-out surface → restock request or relationship-qualified alternative → PDP/cart | Exact variant unavailable; relationship type and validation | Similar product presented as exact; old fit/proof assumed current | Label exact replacement, successor, compatible alternative, or merely similar; disclose differences; suppress unsafe modules |
| Unknown fit → support | Search, resolver, PDP, or cart | Determine whether authoritative fit can be established | Current surface → contextual support intake → case state | Unknown/Unverified; known object/measurements; candidate product; attempted steps | Customer loses context or unsupported assurance is given | Transfer context and evidence; issue reference; accountable verification workflow; preserve unknown until verified |

Across every journey, Back and return paths preserve valid non-sensitive selections, failure states name the affected object, and recovery never silently weakens a compatibility or eligibility constraint.

---

## Part XXVI — Page Responsibility Matrix

| PAGE TYPE | PRIMARY CUSTOMER JOB | PRIMARY INFORMATION | SECONDARY INFORMATION | TRANSACTIONAL? | DIVISION-AWARE? | PRODUCT-TYPE-AWARE? | REQUIRES REAL DATA BEFORE IMPLEMENTATION? | WHAT MUST NOT BE DUPLICATED HERE? |
|---|---|---|---|---|---|---|---|---|
| Home | Understand house and choose direction | Identity, divisions, standards, selected discovery | Story, learn, support | No | Yes | No | Content and curation do | Full taxonomy, policies, deep product facts |
| Division landing | Translate need into durable route | Roles, categories, decisions, trust model | Curation, guides, support | No | Yes | Moderately | Catalog depth and governed content do | PDP facts, full guides, complete category grid |
| Category/subcategory | Browse and compare a durable class | Orientation, filters, sort, products, state | Inline education, curation, support | Yes, discovery | Yes | Yes | Products, normalized fields, states | Product master facts, glossary definitions, policy text |
| Collection/curated edit | Explore a reasoned selection | Rationale, scope, eligible products | Education and related durable routes | Yes, discovery | Sometimes | Sometimes | Active membership/rationale do | Category definition or temporary promo as taxonomy |
| Search results | Resolve an expressed query | Interpretation, scope, mixed result types, constraints | Suggestions, education, support | Yes, discovery | Yes | Yes | Search index and catalog do | Canonical entity/product content |
| PDP shared shell | Decide on exact sellable state | Identity, options, facts, price, stock, eligibility, proof/fit, CTA | Media, depth, education, reviews, recommendations | Yes | Yes | Yes | Yes | Manually copied facts, proof, policies, compatibility |
| Compatibility/fit resolver | Find or verify a relationship | Input context, relationship status, conditions, evidence | Measurement help, product routes, support | Decision-enabling | Yes | Yes | Authoritative relationships do | Relationship truth from titles/images/reviews |
| Learn index | Find decision help | Task- and division-based guide routes | Glossary and commerce return paths | No | Yes | Sometimes | Governed content does | Generic blog chronology or product-grid filler |
| Guide/glossary | Learn a durable decision or term | Governed explanation, process, limits | Relevant products, proof, fit, support | No | Yes | Sometimes | Subject authority does | Divergent definitions or unsupported advice |
| Proof lookup/detail | Verify applicable evidence | Product/batch scope, issuer, status, date, document | Explanation, archive, support | No | THCA primarily | Yes | Actual proof mapping does | Lab claims, product facts, or files detached from scope |
| Maker/entity | Understand authorship/provenance | Verified identity, role, provenance, curation rationale | Relevant work and education | Discovery | Yes | Sometimes | Verified substance/permissions do | Thin biography or duplicate product grid |
| Quick cart | Confirm add and immediate state | Line identity, configuration, quantity, price, top blocker | Simple edit and full-cart route | Yes | Yes | Yes | Price/stock/state do | Full issue resolution or checkout |
| Full cart | Revalidate intended purchase | All line states, relationships, totals, interventions | Fulfillment context, support | Yes | Yes | Yes | Yes | New unsupported product claims or checkout design |
| Account overview | Reach private continuity tasks | Orders, support, account/consent status | Saved products where enabled | No | Cross-division | No | Identity/operations do | Marketing profile without service purpose |
| Orders/order detail | Retrieve exact transaction context | Order state, purchased variants, documents, support | Setup, care, replacement routes | Post-transaction | Yes | Yes | Order and product records do | Public guide text or current-state assumptions |
| Order confirmation | Confirm completed transaction | Confirmation, items, immediate next steps | Order detail, support, docs | Post-transaction | Yes | Yes | Transaction does | Promotional wall or invented fulfillment promises |
| Support hub/intake | Resolve or escalate a problem | Intent, contextual help, handoff data, case state | Policies/guides | Supporting | Yes | Yes | Operating model does | Product truth or channel/time promises |
| Policy/trust | Retrieve governed rule or commitment | Legal/operational statement and owner/effective context | Contextual support | No | Usually global | Sometimes | Qualified policy does | Manually replicated PDP/cart wording |
| About/house story | Understand identity and independence | Mission, point of view, accountable story | Curation standards and support | No | Global | No | Approved brand content does | Generic corporate filler or copied culture |

---

## Part XXVII — Content Ownership & Single-Source Rules

| CONTENT | CANONICAL OWNER | CONSUMING SURFACES |
|---|---|---|
| Product fact and identity | Verified product record | Card, PDP, search, cart, order, support |
| Sellable variant/specification | Variant/specification record | PDP, card where appropriate, cart, order, comparison |
| COA/proof | Proof document plus product/batch relationship | Card status, PDP, proof route, order, support |
| Compatibility/fit | Verified relationship record and evidence | Search, category, resolver, PDP, recommendation, cart, order/support |
| Eligibility | Versioned qualified compliance/policy rule source | Discovery context, PDP, cart, qualification, support |
| Price | Commerce price source of record | Card, PDP, cart, order confirmation |
| Availability | Inventory/fulfillment source of record | Search, card, PDP, cart, alternatives |
| Category definition | Taxonomy governance record | Navigation, category, breadcrumbs, search |
| Glossary term | Governed glossary entry | Inline help, category, PDP, guides, support |
| Guide | Governed education record | Learn, PDP/category excerpts, post-purchase, support |
| Maker biography/provenance | Verified entity record and permissions | Entity page, PDP, collection, guide |
| Shipping | Operations/policy owner | Policy page, PDP/cart contextual summary, support |
| Return/damage policy | Operations/policy owner | Policy, product/cart exception summary, order/support |
| Warnings | Qualified warning/policy or product source | PDP, cart, guide, policy |
| Support information | Support operations record | Support, policy, account, contextual handoffs |

Pages render scoped summaries and link to the canonical source. They do not keep private copies. Corrections propagate to every consumer, preserve source/status/effective context, and invalidate derived claims where necessary. Derived labels such as “fits your device” retain traceability to the underlying relationship and consented context.

---

## Part XXVIII — Page State Requirements

Legend: **R** required; **C** contextual when the page can encounter the state; **—** generally not applicable.

| PAGE FAMILY | LOADING | EMPTY / NO RESULTS | ERROR | UNKNOWN | RESTRICTED | UNAVAILABLE | STALE | MISSING MEDIA | MISSING PROOF | UNKNOWN COMPATIBILITY |
|---|---|---|---|---|---|---|---|---|---|---|
| Home/division landing | R | C | R | C | C | C | C | R | C | C |
| Category/collection | R | R | R | R | R | R | C | R | C | R |
| Search/results | R | R | R | R | R | R | C | R | C | R |
| PDP | R | — | R | R | R | R | R | R | R | R |
| Compatibility resolver | R | R | R | R | C | R | R | C | C | R |
| Learn/guide/glossary | R | C | R | C | C | C | R | R | C | C |
| Proof | R | R | R | R | C | C | R | C | R | — |
| Entity page | R | R | R | R | — | C | C | R | C | C |
| Quick/full cart | R | R | R | R | R | R | R | R | R | R |
| Account/orders | R | R | R | R | C | C | R | R | R | C |
| Support | R | R | R | R | C | C | C | C | C | C |
| Policy/trust | R | C | R | C | C | — | R | C | C | — |

Loading preserves structure, names the pending object, exposes accessible busy state, and prevents duplicate actions. Empty and no-results states distinguish absence from failure. Errors preserve valid inputs and provide retry or escalation. Restricted is not the same as a failed eligibility service. Unavailable preserves useful facts and valid recovery. Stale retains dates and scope. Missing media never removes textual truth. Missing proof and unknown compatibility suppress unsupported positive claims and name the consequence.

---

## Part XXIX — SEO & Discoverability Without Filler

Discoverability follows useful IA: stable taxonomy, canonical products, substantive category orientation, structured relationships, real guides, useful entity pages, and durable proof/document access.

| CONCEPTUAL PAGE TYPE | INDEXABILITY |
|---|---|
| Home, division landings, durable populated categories | INDEXABLE |
| Canonical available product pages | INDEXABLE |
| Discontinued PDPs with continuing documentation, proof, successor, fit, or support value | INDEXABLE or CONDITIONALLY INDEXABLE based on unique utility |
| Substantive guides, glossary entries, proof explainers, maker/entity pages | INDEXABLE |
| Curated collections with durable unique rationale and sufficient content | CONDITIONALLY INDEXABLE |
| Direct proof records | CONDITIONALLY INDEXABLE according to privacy, document rights, and customer utility |
| Filter/facet combinations, sort, pagination variants | NON-INDEXABLE by default; canonicalize to durable intent |
| Search results and autocomplete | NON-INDEXABLE / STATEFUL |
| Compatibility results containing customer context | NON-INDEXABLE / STATEFUL |
| Cart, account, orders, support cases, qualification | NON-INDEXABLE / PRIVATE |
| Temporary promotions/campaign states | NON-INDEXABLE unless separately approved as a substantive bounded destination |

Pagination must preserve access to the full category set without creating competing canonical intent. Search-result indexing is rejected. Structured product, entity, guide, proof, and relationship information reflects governed content, not keyword stuffing. Renamed and consolidated routes redirect intentionally. Duplicate division/category routes for the same intent are prohibited.

---

## Part XXX — Page Creation Rules

A page exists only when it serves a distinct intent, information need, navigation need, transaction, educational task, support task, or stable shareable destination. The need must be durable enough to justify ownership, state handling, and maintenance.

| USE INSTEAD | WHEN APPROPRIATE |
|---|---|
| Inline content | Essential context is short and belongs at the decision point |
| Disclosure | Supporting detail is optional but must remain accessible in context |
| Modal/dialog | A bounded interrupting decision requires focus and completion; never for routine navigation |
| Drawer | A temporary adjacent task such as quick cart preserves the underlying page |
| Filter | An attribute refines a durable category without creating a new intent |
| Search mode | A query or relationship task is stateful and not durable taxonomy |
| PDP module | Information applies to one product/variant relationship |
| Account state | Information is private, consented, order-linked, or personally reusable |
| Support flow | Judgment or verification cannot safely be automated |

Data existence, a filter, campaign, competitor precedent, keyword demand, or possible URL is insufficient. Every proposed page must name its job, owner, canonical content, states, entry paths, exit paths, and maintenance rule before approval.

---

## Part XXXI — First-Version Page Inventory

The inventory classifies **40 page or surface families**: 5 Foundational, 25 Core Launch, 4 Supporting, 3 Future, and 3 Rejected/Not Needed. “First version” includes Foundational and Core Launch; Supporting capabilities may follow only after their dependencies are sound.

| # | PAGE / SURFACE FAMILY | CLASSIFICATION | FIRST-VERSION RATIONALE |
|---:|---|---|---|
| 1 | Global shell and navigation | FOUNDATIONAL | Keeps one house coherent across all routes |
| 2 | Home | FOUNDATIONAL | Establishes identity and three-division orientation |
| 3 | Division landing family | FOUNDATIONAL | Provides one shared architecture with three expert instances |
| 4 | Category/subcategory family | FOUNDATIONAL | Creates durable browse and comparison |
| 5 | Universal PDP shell and state contract | FOUNDATIONAL | Governs every product-type extension |
| 6 | Search/results | CORE LAUNCH | Supports known-item, need, and educational discovery |
| 7 | Curated collection/edit | CORE LAUNCH | Expresses independent judgment without corrupting taxonomy |
| 8 | THCA PDP family | CORE LAUNCH | Resolves format, variant, proof, eligibility, and action |
| 9 | Disposable PDP family | CORE LAUNCH | Resolves complete-product configuration and lifecycle |
| 10 | Refillable device/kit PDP family | CORE LAUNCH | Resolves platform, contents, requirements, and fit |
| 11 | E-liquid PDP family | CORE LAUNCH | Resolves nicotine, volume, flavor, and suitability context |
| 12 | Nicotine pouch PDP family | CORE LAUNCH | Resolves strength basis, count, warnings, and eligibility |
| 13 | Pod/coil/replacement PDP family | CORE LAUNCH | Prevents platform/part purchase errors |
| 14 | Complete glass piece PDP family | CORE LAUNCH | Resolves scale, connections, contents, provenance, and care |
| 15 | Fitted component PDP family | CORE LAUNCH | Resolves geometry and physical fit |
| 16 | Care/maintenance PDP family | CORE LAUNCH | Resolves material or device applicability |
| 17 | Maker/artist object PDP extension | CORE LAUNCH | Preserves object-level provenance when stocked |
| 18 | Learn index | CORE LAUNCH | Makes knowledge findable by task, not chronology |
| 19 | Guide/how-to family | CORE LAUNCH | Supports consequential discovery and post-purchase jobs |
| 20 | Glossary term family | CORE LAUNCH | Creates one governed definition source |
| 21 | Proof lookup/detail family | CORE LAUNCH | Connects THCA product/batch evidence to decisions |
| 22 | Brand/maker/artist entity family | CORE LAUNCH | Supports verified provenance when substantive; otherwise no instance is created |
| 23 | Quick-cart drawer | CORE LAUNCH | Confirms add and highest-priority state |
| 24 | Full cart | CORE LAUNCH | Revalidates the complete intended purchase |
| 25 | Account overview/profile/consent family | CORE LAUNCH | Supports legitimate private continuity and control |
| 26 | Orders list/detail family | CORE LAUNCH | Preserves exact transaction, proof, care, and support context |
| 27 | Order confirmation | CORE LAUNCH | Confirms transaction and immediate next steps |
| 28 | Support hub/contextual intake | CORE LAUNCH | Provides recovery without lost context |
| 29 | Policy/trust family | CORE LAUNCH | Makes governed legal and operational information retrievable |
| 30 | About/house story | CORE LAUNCH | Grounds independent identity beyond merchandising |
| 31 | Dedicated compatibility/fit resolver | SUPPORTING | Structure is core; full dedicated experience follows normalized relationships |
| 32 | Product comparison | SUPPORTING | Valuable after schema coverage permits honest comparison |
| 33 | Saved products | SUPPORTING | Clear customer job but not required to buy or retrieve orders |
| 34 | Support case history | SUPPORTING | Depends on actual case-based support operations |
| 35 | Saved device/saved piece profiles | FUTURE | Requires consent, authoritative matching, and editing/removal controls |
| 36 | Proof and replacement history aggregation | FUTURE | Exact order access launches first; aggregation needs mature data |
| 37 | Personalized/guided discovery profile | FUTURE | Requires evidence of value and privacy governance |
| 38 | Generic blog / SEO article factory | REJECTED / NOT NEEDED | Learn is task-based and governed |
| 39 | Thin faceted, filter, or location pages | REJECTED / NOT NEEDED | No distinct customer job; creates duplication |
| 40 | Duplicate division taxonomy or thin entity pages | REJECTED / NOT NEEDED | Fragments the house and manufactures empty destinations |

Foundational plus Core Launch equals **30 classified families** in the minimum coherent first-version system. A listed family may have multiple routes or product-type instances without becoming a new architecture.

---

## Part XXXII — Page Dependency Graph

```text
ARTICLE I + MASTER SYSTEM
        ↓
SHARED ONTOLOGY + STATE + PROVENANCE + ACCESSIBILITY
        ├── TAXONOMY + CATALOG → navigation → division/category → search
        ├── PRODUCT + VARIANT + PRICE + STOCK → cards → PDP → cart → order
        ├── BATCH + COA + PROOF STATUS → proof module → proof route → order history
        ├── NORMALIZED SPECS + VERIFIED RELATIONSHIPS → resolver → recommendations → cart validation
        ├── GOVERNED EDUCATION → inline help → Learn → post-purchase → support
        └── POLICY + OPERATIONS → eligibility → fulfillment → returns/damage → escalation
```

| PAGE SYSTEM | FOUNDATIONAL DEPENDENCIES | CAN SPECIFY NOW? | FUNCTIONAL DATA GATE |
|---|---|---|---|
| Navigation/division/category | Site model, ontology, taxonomy rules | Yes | Actual catalog ownership, category depth, normalized coverage |
| Search | Ontology, intent model, result contract | Yes | Search index, aliases, products, guides, relationships, ranking governance |
| PDP families | Shared shell, type schemas, state precedence | Yes | SKUs, variants, facts, media, price, stock, policy, proof/fit |
| THCA proof | Proof model and states | Yes | Real product/batch relationships and COA documents |
| Electronic compatibility | Relationship graph and six states | Yes | Authoritative manufacturer data or documented validation |
| Physical fit | Relationship graph, measurement schema, six states | Yes | Measurements, tolerances, receiving inspection, pair tests |
| Recommendations/bundles | Typed relationships and validation rules | Yes | Verified relationships, current states, rationale ownership |
| Cart validation | Intervention modes and state precedence | Yes | Current price, inventory, eligibility, relationships, requirements |
| Learn | Content types and ownership | Yes | Approved subject matter, sources, accountable authors |
| Entity pages | Role model and page threshold | Yes | Verified provenance, permissions, substantive content |
| Account/orders | Private continuity model | Yes | Identity, order, consent, support, retention systems |
| Support | Intent and context-transfer contract | Yes | Channels, staffing, case workflow, authority, privacy rules |
| Policies/eligibility | Placement and state interfaces | Yes | Qualified legal, compliance, operations content and effective dates |

---

## Part XXXIII — Architecture Decisions That Must Remain Open

| DECISION | WHY IT REMAINS OPEN | WHAT INFORMATION WILL RESOLVE IT | WHEN IT SHOULD BE DECIDED |
|---|---|---|---|
| Exact category count and depth | Catalog is not supplied | Product inventory, role distribution, merchandising ownership | During catalog schema/taxonomy work before page specs freeze |
| Exact filter inventory | Coverage and customer value are unknown | Normalized fields, completeness audit, search behavior | After data model and sample catalog mapping |
| Exact product-family coverage | Actual stocked roles and variant structures are unknown | SKU catalog and option audit | Data-model phase, before detailed PDP specs |
| Dedicated resolver launch scope | Functional value depends on verified relationships | Compatibility coverage, support load, validation workflow | Before first-version scope approval |
| Saved device/piece launch | Consent, identity accuracy, and lifecycle value are unresolved | Privacy policy, customer research, relationship coverage | After core resolver proves value |
| Proof archive structure/indexability | Document volume, rights, batch model, and retention are unknown | COA inventory, compliance, privacy, operations | During proof data/service specification |
| Account feature depth | Support and retention operations are undefined | Identity platform, support workflows, consent/retention policy | Before account page specifications |
| Support channels and case history | Staffing and systems are not established | Support operating model and service authority | Before support implementation planning |
| Policy page granularity | Actual policies and responsible owners are not supplied | Legal/compliance/operations review | Before content production and launch |
| Promotional collection strategy | Campaign cadence and merchandising ownership are unknown | Merchandising calendar and maintenance capacity | Content/merchandising planning |
| Brand/maker index and URL structure | Entity volume and content substance are unknown | Catalog entity audit and permissions | After entity schema and content audit |
| Discontinued-product retention rules | Documentation, proof, fit, and support value varies | Catalog lifecycle and legal/operations retention rules | During catalog lifecycle design |
| Search ranking and cross-division defaults | Query mix and catalog shape are unknown | Search logs or usability tests, inventory, business rules | Search specification and validation |
| Exact age/destination qualification flow | Current legal and operational rules are not supplied | Qualified compliance/legal owner and platform constraints | Before any eligibility implementation |

---

## Part XXXIV — Architectural Anti-Patterns

Blowin' Smoke rejects:

1. three separate storefront architectures;
2. a homepage used as a catalog dump;
3. mega-navigation containing every SKU attribute;
4. campaign pages becoming permanent taxonomy;
5. duplicate category, collection, and search routes for the same intent;
6. isolated replacement-part catalogs without compatibility context;
7. PDPs overloaded with every possible fact above the action;
8. proof hidden only in a generic lab page;
9. compatibility hidden only in long descriptions;
10. a generic blog created for SEO volume;
11. thin maker, brand, artist, filter, or location pages;
12. redundant FAQ content that diverges from canonical guidance;
13. policy text manually duplicated across product pages;
14. support flows that discard product, resolver, cart, or order context;
15. unknown or unverified fit represented as positive compatibility;
16. dead-end sold-out pages without truthful recovery;
17. arbitrary cross-sell or co-purchase presented as a relationship;
18. account features without a clear customer job and consent model;
19. URLs tied to temporary campaigns or inventory states;
20. inaccessible state hidden inside hover or overlays;
21. page proliferation without distinct customer intent;
22. title strings acting as taxonomy, specifications, proof, or compatibility;
23. search silently dropping fit or eligibility constraints;
24. order history implying past eligibility, price, proof, or compatibility is current;
25. visual distinction that turns divisions into incompatible systems.

---

## Part XXXV — Architecture Decision Matrix

| ARCHITECTURE AREA | DECISION | RATIONALE | GOVERNING MASTER-SYSTEM PRINCIPLE | DIVISION IMPACT | FIRST-VERSION STATUS | REQUIRES REAL DATA? | ORIGINAL BLOWIN' SMOKE ARCHITECTURE DECISION? |
|---|---|---|---|---|---|---|---|
| House model | One shell with three division contexts | Preserves identity and shared trust while supporting expertise | One House, Three Divisions | All | Foundational | Catalog context, not structure | Yes, as integrated IA |
| Navigation | Three divisions primary; jobs and durable roles beneath | Prevents catalog dumping and jargon-first entry | Durable taxonomy; shared shell | All | Foundational | Category labels/depth | Yes |
| Product routes | One canonical product URL with contextual breadcrumbs | Avoids duplicate division/product identity | Shared product ontology | All | Foundational | Product identities | Yes |
| Category vs collection | Category is durable type/job; collection is reasoned grouping | Prevents promotion from becoming taxonomy | Category/Collection System | All | Foundational | Membership and taxonomy | Yes |
| PDPs | Universal shell with ten governed family contracts | Consistency without suppressing domain truth | Shared PDP plus extensions | All | Foundational/Core | Yes | Yes |
| Search | One semantic system with visible optional scope | Supports known-item, need, education, and relationships | Search & Discovery | All | Core | Yes | Yes |
| Compatibility | One resolver framework with electronic and physical modes | Avoids disconnected tools and preserves six states | Original fit architectures | Vape, Glass | Supporting surface; core inline states | Yes, materially | Yes |
| Proof | Product/batch-linked status plus stable proof route | Evidence must be applicable and retrievable | Trust, Proof & Claim Governance | THCA primarily | Core | Yes | Yes |
| Education | Task-based Learn, contextual excerpts, no generic blog | Knowledge supports decisions without filler | Education System | All | Core | Governed content | Yes |
| Entity pages | Publish only when identity/provenance content is substantive | Prevents thin SEO pages and false authorship | Provenance governance | All, strongest in Glass | Conditional Core | Yes | Yes |
| Cart | Quick confirmation plus full validation page | Complexity and blockers need a dedicated checkpoint | Cart System | All | Core | Yes | Yes |
| Account | Orders and consent first; owned profiles later | Service continuity precedes speculative personalization | Privacy and Post-Purchase | All | Core/Future | Yes | Yes |
| Support | Intent-based, context-preserving escalation | Respect requires honest uncertainty and continuity | Support & Human Escalation | All | Core | Operating data | Yes |
| Policies | Canonical governed pages with contextual summaries | Prevents divergent rules and invented promises | Provenance; Eligibility | All | Core | Qualified policy | Yes |
| Discoverability | Index useful stable pages; suppress stateful/thin combinations | Useful IA creates discovery | Failure-mode rejection of SEO filler | All | Core | Some | Yes |
| Page creation | Distinct durable job required | Restraint and maintainability | One dominant job; knowledge at point of need | All | Foundational | No | Yes |

---

## Part XXXVI — Implementation-Readiness Boundary

### Can specify now

- Page families, responsibilities, relationships, conceptual routes, information hierarchy, state requirements, support handoffs, content ownership, indexability classes, and accessibility obligations.
- The structure and task modes of compatibility and fit resolution.
- The structure and states of THCA proof access.
- Product-type PDP contracts and category/filter governance.

### Can visually design with placeholder structure

- Global shell, home, division landings, category/search states, shared PDP skeleton, resolver inputs/results, proof states, cart interventions, account/order continuity, Learn, support, and policy templates.
- Placeholders must be visibly synthetic, structurally representative, and never presented as product, legal, proof, price, eligibility, or compatibility truth.

### Requires real data before functional implementation

- Actual categories, filters, products, variants, prices, inventory, proof/batch links, compatibility results, measurements, contents, technical specifications, media, maker provenance, recommendations, and successor/replacement relationships.
- Electronic compatibility requires authoritative manufacturer records or documented validation.
- Physical fit requires verified measurements, receiving procedures, tolerances, and product-pair tests where needed.
- THCA proof requires real documents and applicable product/batch relationships.

### Requires operational or compliance decision

- Eligibility rules, age/destination qualification, warnings, shipping, returns, breakage, warranty, support channels/service commitments, privacy, consent, retention, payment methods, and analytics scope.

### Future capability

- Saved device/piece profiles, replacement/proof history aggregation, proactive replenishment, personalized discovery, automated matching/confidence, customer-photo assistance, and dynamic relationship bundles.

This specification authorizes later architecture and design work only. It does not authorize production implementation or the invention of missing truth.

---

## Part XXXVII — Next Phase Recommendation

### Selected phase: D. Data Model / Catalog Schema

**ORIGINAL BLOWIN' SMOKE ARCHITECTURE DECISION:** The single correct next phase is the conceptual and logical Data Model / Catalog Schema.

It should come next because the Master System and this IA now define the shared language, page jobs, states, and relationships, while the largest blockers to honest page specifications are structural data questions: product versus variant, product role, normalized attributes, proof/batch scope, entity roles, contents, relationship evidence, availability, and provenance. Page-by-page specifications created before those contracts would either repeat unresolved questions or quietly invent a catalog.

The next phase should produce:

- conceptual entity and relationship schemas;
- product-type and variant field contracts;
- taxonomy and normalized-attribute governance;
- proof, compatibility, contents, claim, media, and provenance records;
- canonical source, status, scope, and staleness fields;
- page-consumption mappings and validation requirements;
- unknown, unverified, not-applicable, stale, and conflicting-data handling.

It can use Article I, the Master System, this IA, the closure decisions, and the cleaned final intelligence reports where the governing documents explicitly leave a domain field unresolved. It must not reopen competitor research.

Actual catalog values, legal rules, prices, stock, compatibility claims, COAs, measurements, policy text, support operations, platform technology, and final filter inventories must remain unresolved until supplied by accountable authoritative owners. The next phase is a schema specification, not database code or implementation.

---

## Validation Record

| # | REQUIREMENT | RESULT |
|---:|---|---|
| 1 | One house with three divisions | PASS |
| 2 | Complete conceptual sitemap | PASS |
| 3 | Global navigation without catalog dumping | PASS |
| 4 | Homepage role without visual layout | PASS |
| 5 | All three division landing responsibilities | PASS |
| 6 | Category, collection, promotion, search, and compatibility distinctions | PASS |
| 7 | PDP families without unnecessary proliferation | PASS |
| 8 | Electronic compatibility architecture | PASS |
| 9 | Physical fit architecture | PASS |
| 10 | THCA proof/COA architecture | PASS |
| 11 | Education without generic blog | PASS |
| 12 | Search and semantic discovery | PASS |
| 13 | Cart, account, post-purchase, support, and policy | PASS |
| 14 | Content ownership and single-source rules | PASS |
| 15 | Loading, empty, error, restricted, unavailable, stale, proof, and compatibility states | PASS |
| 16 | Discoverability without SEO filler | PASS |
| 17 | Disciplined first-version inventory | PASS — 40 classified; 30 Foundational/Core Launch |
| 18 | Page dependencies | PASS |
| 19 | Decisions kept open | PASS |
| 20 | One next design phase identified | PASS — Data Model / Catalog Schema |
| 21 | No production code | PASS |
| 22 | Implementation not authorized | PASS |
| 23 | Competitor research not reopened | PASS |

The validation record confirms specification completeness, not implementation readiness. Functional readiness remains subject to Part XXXVI and the open decisions above.
