# Blowin' Smoke — Static Visual Prototype Evaluation

**Status:** Prototype evaluation; non-production

**Prototype package:** `docs/prototypes/pressure-proof/`

**Governing direction:** Pressure & Proof

**Implementation authorization:** Not granted

## Evaluation basis

This document evaluates the isolated static package against the governing Constitution and system specifications. It does not authorize production implementation, validate catalog truth, establish operating policy, or revise `docs/system/01` through `06`.

The reviewed package contains 13 representative HTML compositions, 13 inspected wide PNG exports at a 1440-CSS-pixel test canvas, and 13 inspected narrow PNG exports at a 390-CSS-pixel test canvas. These canvases are evaluation conditions, not production breakpoints. Every representative page was also inspected at 320 CSS pixels. No 320-pixel result exposed a materially different failure, so no additional 320 screenshots were required.

The export browser reported Archivo available and rendered through `document.fonts.check("16px Archivo")`. The CSS requests Archivo first, then `Arial Narrow`, `Arial`, and `sans-serif`. No font binary is bundled. The browser result supports this prototype evaluation only; it does not establish production font availability, licensing, loading performance, or fallback parity.

Controlled 200% and 400% browser-zoom testing was not supported by the rendering environment. The 390- and 320-pixel reflow tests exposed narrow composition and wrapping behavior, but they are not substitutes for browser zoom. No accessibility-conformance claim is made.

Outcome meanings:

- **PASS:** the static composition demonstrates its assigned visual and decision-hierarchy test without a material prototype failure.
- **CONDITIONAL PASS:** the composition demonstrates the intended direction, but a brand-asset, real-data, measurement, or operations/compliance gate prevents a final production conclusion.
- **FAIL:** a required prototype condition is not demonstrated. No page failed this evaluation.

## 1. Home

- **What was rendered:** P4 house expression, the unmodified full logo at editorial scale, live-text persistent identity, three division entrances, bounded synthetic curation, a Learn/trust transition, and progressive quieting toward P1/P0.
- **Wide result:** The split opening is the most expressive commerce composition in the set. The Pressure field, complete logo canvas, and division routes establish one house without turning downstream records into campaign art.
- **Narrow result:** Pressure, identity, and division routes stack in a coherent order. The full logo remains spacious and uncropped; curated records become a legible single-column sequence.
- **Pressure location:** Concentrated in the opening scale, red field, editorial typography, and asymmetric composition.
- **Proof / precision transition:** Standards and curated records replace the opening's atmosphere with exact role, state, scope, and recovery language.
- **Hierarchy result:** House identity leads, division choice follows, then trust standards, bounded curation, and Learn.
- **Typography result:** Archivo's condensed energy supports P4 without spreading display treatment into decision records. Long card names wrap without losing identity.
- **Spacing / density result:** Generous opening space contracts into comparable cards and quieter reading widths.
- **Color result:** Brand red is upstream only; near-black actions and neutral proof surfaces take over downstream.
- **State result:** Stale proof, a required component, missing scale media, and unavailable-state fixtures remain distinct from promotion.
- **Media result:** The existing padded logo is preserved exactly and used only here. CSS product stand-ins remain explicitly synthetic.
- **Accessibility observations:** Reading order is coherent; long text wraps; state panels use symbols and words in addition to color; focus treatment is visible. The logo's opaque padding is understood as part of the supplied asset.
- **320-pixel observation:** The opening and routes reflow without horizontal clipping. The page becomes long, but identity, division choice, blockers, and actions remain present.
- **Failures:** No material layout failure. A compact persistent-header brand asset still does not exist.
- **Proposed correction:** Keep live-text header identity until an approved compact asset is supplied; do not derive one from the padded logo.
- **Result:** **CONDITIONAL PASS** — blocked by the compact brand-asset gate, not by the Home composition.

## 2. THCA Division Landing

- **What was rendered:** Shared division composition, format and customer-job routes, proof and eligibility cues, reasoned curation, and a P3-to-P0 transition.
- **Wide result:** The dark division masthead establishes family identity while job routes and evidence panels quickly lower intensity.
- **Narrow result:** Route cards, proof anatomy, and curated cards stack without collapsing scope or recovery language.
- **Pressure location:** Limited to the division masthead and decisive orientation copy.
- **Proof / precision transition:** Format, strain, quantity, price basis, exact proof scope, and separate eligibility states move the page to P0.
- **Hierarchy result:** Customer job precedes taxonomy; evidence guidance precedes curated products.
- **Typography result:** Display weight is confined to orientation. Record labels and state anatomy use quieter, readable hierarchy.
- **Spacing / density result:** Spacious introduction gives way to compact fact and state groupings without crowding.
- **Color result:** Black orientation field transitions to warm-neutral proof surfaces; semantic states are not expressed through brand red.
- **State result:** Current, stale, missing/unmatched proof and restricted eligibility remain separate concepts.
- **Media result:** Synthetic identity and missing-media specimens do not stand in for batch proof.
- **Accessibility observations:** Status names, symbols, cause, consequence, and recovery provide color-independent meaning. Long labels wrap and controls retain visible boundaries.
- **320-pixel observation:** Job cards, facts, and product records form a stable single column with no material loss.
- **Failures:** None in the static composition.
- **Proposed correction:** No page-level correction; preserve this shared division grammar in the next specification.
- **Result:** **PASS**.

## 3. Vape & Nicotine Division Landing

- **What was rendered:** Job-first navigation, device/consumable/replacement/accessory distinctions, platform lifecycle, compatibility entry, and P3-to-P0 transition.
- **Wide result:** The page establishes the division without turning compatibility into a merchandising badge. Lifecycle relationships receive dedicated space before product curation.
- **Narrow result:** Job routes and bidirectional relationship records stack in complete text order.
- **Pressure location:** Confined to the division masthead and early decision cue.
- **Proof / precision transition:** Platform endpoints, component roles, relationship state, evidence, and service-error distinction quiet the composition.
- **Hierarchy result:** “What do you own or need?” leads; roles and relationships precede products.
- **Typography result:** Condensed headings orient; normal-width record typography carries technical distinctions.
- **Spacing / density result:** Relationship modules have sufficient separation to avoid reading as promotional bundles.
- **Color result:** Compatibility semantics use their own labeled anatomy; brand red does not signal fit.
- **State result:** Unknown relationship and relationship-service error remain visibly different.
- **Media result:** Synthetic device/component silhouettes indicate role only and disclaim compatibility evidence.
- **Accessibility observations:** Endpoint names and arrows have complete text equivalents; state meaning survives color; long platform labels wrap.
- **320-pixel observation:** Relationship endpoints stack without overlap and preserve direction and evidence text.
- **Failures:** None in the static composition.
- **Proposed correction:** No page-level correction; retain relationship-first navigation and evidence language.
- **Result:** **PASS**.

## 4. Glass & Accessories Division Landing

- **What was rendered:** Complete-piece versus fitted-component routes, fit and measurement entry, care, maker context, fragile-support state, and P3-to-P0 transition.
- **Wide result:** The shared division shell remains recognizable while geometry, measurement, provenance, and care distinguish the domain.
- **Narrow result:** Complete-piece, fitted-component, care, product, and support modules stack in a comprehensible sequence.
- **Pressure location:** The division masthead and “Know the piece. Prove the fit.” orientation carry P3.
- **Proof / precision transition:** Nominal size gives way to gender/type, angle, orientation, effective length, clearance, material, maker, and support ownership.
- **Hierarchy result:** Product-role choice precedes measurement and fit; fragile support appears as consequence rather than decoration.
- **Typography result:** Editorial division headings transition to restrained technical labels and record values.
- **Spacing / density result:** Dense measurement concepts remain separated into low-chrome modules.
- **Color result:** The page uses warm neutral and near-black as its base; warnings and unknowns remain semantic rather than branded.
- **State result:** Unknown measurements, fit warnings, and operational gates do not imply compatibility or service promises.
- **Media result:** CSS forms test scale and missing-reference behavior without asserting real geometry.
- **Accessibility observations:** State text is color-independent; long measurement labels wrap; complete-piece and fitted-part routes are named in text.
- **320-pixel observation:** Cards and measurement guidance stack successfully; long technical records remain readable.
- **Failures:** No material visual failure. Synthetic shapes cannot validate the density or comprehension of real object photography and measurements.
- **Proposed correction:** Re-test the retained composition with authoritative measurements, real media, and approved fragile-support language before production.
- **Result:** **CONDITIONAL PASS** — blocked by real physical data and operations/support policy.

## 5. Shared Category

- **What was rendered:** Filters, active constraints, explicit static control specimens, long names, missing media, unavailable product, zero-result recovery, and low-chrome THCA, electronic, and glass card adaptations.
- **Wide result:** Cards remain visually comparable while each division exposes the minimum decision-critical evidence appropriate to its domain.
- **Narrow result:** Filters, constraints, and cards collapse into a single readable stream; evidence panels do not detach from product identity or action.
- **Pressure location:** Limited to category orientation and active customer constraints.
- **Proof / precision transition:** Exact card role, evidence state, unknowns, price placeholder, and recovery dominate the product grid.
- **Hierarchy result:** Constraint context precedes results; identity precedes evidence; evidence precedes action.
- **Typography result:** Long product names wrap without forcing badges or truncating state explanations.
- **Spacing / density result:** One-column narrow cards trade page length for legibility and comparison integrity.
- **Color result:** Low-chrome neutral cards let semantic states communicate consequence without campaign color.
- **State result:** Hover, focus, selected, stale, unknown, incompatible, unavailable, zero-result, error, and changed specimens are explicitly labeled as static.
- **Media result:** Missing media remains a textual state; CSS shapes do not claim product truth.
- **Accessibility observations:** Focus has a non-color perimeter; state meaning uses words/symbols; filter and recovery labels wrap; record order survives reflow.
- **320-pixel observation:** Filters and cards become one column with no horizontal overflow; long names and recovery actions remain visible.
- **Failures:** None in the static composition.
- **Proposed correction:** No page-level correction; retain the one-column narrow rule for evidence-heavy cards.
- **Result:** **PASS**.

## 6. Universal PDP

- **What was rendered:** Exact identity, media region, required option, price basis, availability, eligibility, material state, required components, state-derived blocked action, dense specifications, education, and support.
- **Wide result:** Decision and media form a balanced opening while blocker priority remains clearer than the placeholder image.
- **Narrow result:** The decision column precedes media, keeping required selection, source states, and action consequence above secondary content.
- **Pressure location:** Restrained P1 identity and scale at the opening.
- **Proof / precision transition:** Selected-record anatomy, five state specimens, 18 exact records, and scoped guidance carry the page to P0.
- **Hierarchy result:** Identity and required choice precede derived price/readiness; specifications and guidance follow.
- **Typography result:** The deliberately long identity wraps without obscuring IDs, status, or action reasoning.
- **Spacing / density result:** Dense records remain scannable as repeated label/value units.
- **Color result:** Near-black action geometry and separate state colors support consequence; no brand red enters the decision surface.
- **State result:** Selection-required, loading, eligibility error, changed, and unknown requirement states remain distinct and non-substitutable.
- **Media result:** Missing media is explicit and does not erase exact textual identity.
- **Accessibility observations:** Decision-first semantic order, visible focus specimen, color-independent state anatomy, and record reflow are successful. Disabled action includes a nearby reason.
- **320-pixel observation:** Options, blockers, action, media, records, and guidance stack without clipping.
- **Failures:** None in the static skeleton.
- **Proposed correction:** No page-level correction; use this as the common PDP composition candidate, subject to domain data.
- **Result:** **PASS**.

## 7. THCA PDP

- **What was rendered:** Independent strain and quantity controls, a price-changing alternate variant specimen, exact selected scope, current/stale/missing/unmatched proof, restricted eligibility, proof-service error, missing batch media, and blocked action readiness.
- **Wide result:** Exact selection and consequence dominate; the proof comparison board is visibly separate from the selected record.
- **Narrow result:** Selection, restriction, service error, blocked action, media, and proof states retain order and proximity.
- **Pressure location:** Limited to product identity at P1.
- **Proof / precision transition:** Product, strain, quantity, variant, batch, proof record, date, source, eligibility, and action state resolve at P0.
- **Hierarchy result:** Exact selected scope and price basis appear before proof and eligibility consequences; proof-state comparison follows as education.
- **Typography result:** Long names and IDs wrap; proof labels remain quieter than blocker headings.
- **Spacing / density result:** Separate panels prevent proof currency, match, eligibility, and service status from collapsing into one badge.
- **Color result:** Restriction, error, warning, unknown, and mismatch use separate semantic treatment; brand red is absent.
- **State result:** A current matched record never implies purchase authorization; alternate variant pricing does not silently mutate the selected scope.
- **Media result:** Missing batch-label media is explicit; the package silhouette is not treated as evidence.
- **Accessibility observations:** State words and symbols supplement color; disabled purchase state has an adjacent explanation; long identifiers wrap at narrow widths.
- **320-pixel observation:** Independent option groups, blocker panels, and proof records stack without losing their exact scopes.
- **Failures:** No material visual failure. Real proof currency, batch matching, inventory, and eligibility rules remain unavailable.
- **Proposed correction:** Re-evaluate with authoritative record lengths and approved policy language before any implementation decision.
- **Result:** **CONDITIONAL PASS** — blocked by real proof/catalog data and compliance-owned eligibility rules.

## 8. Refillable Device / Kit PDP

- **What was rendered:** Exact platform identity, selected configuration, included contents, required external component, technical facts, verified compatibility summary, alternate unknown compatibility, price/availability, and blocked readiness.
- **Wide result:** Package completeness and relationship evidence lead before action; technical facts remain secondary.
- **Narrow result:** Decision content precedes media, and required/compatible/unknown states remain attached to the exact platform configuration.
- **Pressure location:** Confined to P1 product identity.
- **Proof / precision transition:** Package roles, endpoint revision, evidence, compatibility condition, availability, and requirement consequence move the page to P0.
- **Hierarchy result:** Included versus required is resolved before price/action; relationship facts precede lifecycle guidance.
- **Typography result:** Extended configuration name and component records wrap without hiding the selected ID.
- **Spacing / density result:** Included and required records are paired but remain distinguishable when stacked.
- **Color result:** Compatibility and unknown use semantic panels rather than promotional color.
- **State result:** A verified relationship and an alternate unknown revision coexist without generalizing one to the other.
- **Media result:** Synthetic device media is identity-only and explicitly cannot establish contents or compatibility.
- **Accessibility observations:** State titles name consequence; the blocked action references its requirement; reduced-motion-equivalent content is fully static.
- **320-pixel observation:** Requirement records, relationship states, and actions stack without clipping or detachment.
- **Failures:** No material layout failure. The static fixtures cannot verify real platform relationships or package records.
- **Proposed correction:** Validate future content density with authoritative manufacturer/SKU data and keep unknown non-affirmative.
- **Result:** **CONDITIONAL PASS** — blocked by real compatibility and package data.

## 9. Pod / Coil / Replacement PDP

- **What was rendered:** Owned-device context and compatible, incompatible, conditional, and unknown relationships; exact sold-out replacement; verified-successor specimen with disclosed differences; and relationship-derived blocked action.
- **Wide result:** Compatibility visibly dominates before price and purchase action, without resembling cross-sell promotion.
- **Narrow result:** Owned context, relationship state, price, action, matrix, and successor comparison stack in decision order.
- **Pressure location:** Restricted to P1 exact part identity.
- **Proof / precision transition:** Two named endpoints, revision, condition, evidence, consequence, and recovery carry the page to P0.
- **Hierarchy result:** Owned-device identification and compatibility precede commerce action; successor recovery remains a separate claim.
- **Typography result:** Extended revision names and endpoint labels wrap cleanly.
- **Spacing / density result:** Relationship states have sufficient separation to prevent a generalized compatibility impression.
- **Color result:** Semantic compatibility states remain independent from brand red and promotional styling.
- **State result:** Compatible, incompatible, conditional, unknown, sold-out, and successor states retain distinct meanings.
- **Media result:** Part media is identity-only and explicitly cannot prove compatibility.
- **Accessibility observations:** Symbols plus full labels provide non-color meaning; endpoint text survives reflow; blocker and recovery remain adjacent.
- **320-pixel observation:** Relationship endpoints and successor differences stack without losing pair identity.
- **Failures:** No material visual failure. Real device revisions, relationship evidence, and successor truth are absent.
- **Proposed correction:** Re-test with authoritative bidirectional relationship records and realistic long model names.
- **Result:** **CONDITIONAL PASS** — blocked by real manufacturer/product relationship data.

## 10. Complete Glass Piece PDP

- **What was rendered:** Exact piece identity, structured dimensions and scale, included bowl, unresolved required component, missing scale media, connection geometry, material and maker context, care, and fragile-item support.
- **Wide result:** Physical truth and package contents lead; maker context remains subordinate to measurable product facts.
- **Narrow result:** Decision, media boundary, dimension records, provenance, care, and support stack without making fit claims from images.
- **Pressure location:** Limited to P1 object identity.
- **Proof / precision transition:** Dimensions, units, connection direction, material source, included contents, unknown clearance, and operations ownership carry P0.
- **Hierarchy result:** Exact object and readiness constraints precede maker narrative and care.
- **Typography result:** Long identity and measurement labels wrap without obscuring values or units.
- **Spacing / density result:** Repeated records make dense physical data scannable.
- **Color result:** Unknown clearance and fragile support use restrained semantic treatment; brand red is absent.
- **State result:** Known dimensions do not resolve unknown accessory clearance, and fragile support is not presented as a warranty promise.
- **Media result:** Missing scale and contents media are explicit; CSS object form is not physical evidence.
- **Accessibility observations:** Measurement labels/units are textual; state meaning is color-independent; records reflow to a readable column.
- **320-pixel observation:** Dimension records, included/required roles, and support state remain readable without horizontal scrolling.
- **Failures:** No material visual failure. Real dimensions, material, provenance, packaging, and service policy are unavailable.
- **Proposed correction:** Validate with standardized receiving measurements, authoritative maker data, real scale media, and approved fragile-item operations.
- **Result:** **CONDITIONAL PASS** — blocked by real data and operations/support policy.

## 11. Fitted Component PDP

- **What was rendered:** Owned-piece context, matching nominal size with wrong gender/type, conditional adapter, unknown clearance, explicit source/target geometry, and blocked recovery action.
- **Wide result:** Physical fit dominates before purchase action; nominal size is visibly insufficient.
- **Narrow result:** Direct mismatch, adapter condition, unknown assembly, action, media boundary, and geometry records retain their causal order.
- **Pressure location:** Confined to P1 exact component identity.
- **Proof / precision transition:** Source/target size, gender/type, angle, orientation, effective length, clearance, tolerance, evidence, and adapter path carry P0.
- **Hierarchy result:** Verified conflict comes first, conditional path second, unresolved assembly third, and action consequence last.
- **Typography result:** Geometry-specific identity and long values wrap without losing endpoint association.
- **Spacing / density result:** Relationship modules remain separate enough to prevent the adapter from reading as a universal fix.
- **Color result:** Mismatch, conditional, and unknown states use distinct labeled semantics rather than brand color.
- **State result:** Matching nominal size never creates a compatible state; unresolved clearance keeps the final action blocked.
- **Media result:** CSS shapes and missing assembly media are explicitly excluded as fit evidence.
- **Accessibility observations:** State labels and symbols are non-color-only; relationship endpoints have text; blocker and recovery remain close.
- **320-pixel observation:** Three-object relationships and geometry records stack without hiding the unresolved input or action consequence.
- **Failures:** No material visual failure. Authoritative dimensions, tolerances, and pair-testing evidence are absent.
- **Proposed correction:** Re-test with verified measurements and representative edge-case assemblies before production architecture.
- **Result:** **CONDITIONAL PASS** — blocked by real measurement and compatibility-validation data.

## 12. Quick Cart

- **What was rendered:** Recent-add confirmation, exact line/options, changed price, a separate unavailable-line specimen, unknown compatibility, missing required component, layer/focus contract, and Full Cart handoff.
- **Wide result:** The drawer reads as a confirmation and routing layer, not as a miniature checkout or validation surface.
- **Narrow result:** The drawer becomes a full-width document; exact line, material issues, and Full Cart action remain visible in order.
- **Pressure location:** P0; only live-text identity remains.
- **Proof / precision transition:** Immediate line identity, state consequences, unresolved inputs, and Full Cart routing define the entire layer.
- **Hierarchy result:** Confirmation precedes exact line; material changes precede the Full Cart handoff.
- **Typography result:** Long exact-line identity and state anatomy wrap without clipping.
- **Spacing / density result:** Drawer grouping separates the line from each issue while preserving a compact transaction rhythm.
- **Color result:** Brand red is absent; semantic panels and near-black Full Cart action carry meaning.
- **State result:** Confirmation does not imply order validation. Changed, unavailable, unknown, and required-component states remain explicit.
- **Media result:** The small synthetic thumbnail is subordinate to exact textual identity.
- **Accessibility observations:** The static layer contract documents future focus entry, background inertness, Escape, and return focus. Color-independent state labels and action proximity are preserved.
- **320-pixel observation:** Full-width reflow keeps line identity, blockers, and the Full Cart action intact; no materially different issue appeared.
- **Failures:** None in the static layer composition.
- **Proposed correction:** No page-level correction; functional focus management remains future interactive work, not part of this phase.
- **Result:** **PASS**.

## 13. Full Cart

- **What was rendered:** Simultaneous price-changed, unavailable, restricted, incompatible, unknown electronic compatibility, unknown physical fit, missing required component, failed eligibility-check, and notify-authorization states with an order-level issue summary.
- **Wide result:** The page reads as a literal consequence ledger. Line identity, issue, source, consequence, and recovery precede the blocked order summary.
- **Narrow result:** Order-level blockers remain first; each affected line and its resolution stack before the blocked progression action.
- **Pressure location:** P0, the lowest practical brand intensity in the set.
- **Proof / precision transition:** The page begins and remains at exact-order consequence: line IDs, endpoints, quantities, state scope, and resolution.
- **Hierarchy result:** Order issue summary leads, affected lines follow, and totals/progression appear only after consequences.
- **Typography result:** Long line names and state anatomy wrap without obscuring quantities, prices, or resolution.
- **Spacing / density result:** The ledger is long but legible; repeated line geometry supports scan and comparison.
- **Color result:** Brand red is absent. Semantic colors support, but do not replace, explicit state language.
- **State result:** Eligibility error is not restriction; notification permission is not availability; unknown electronic fit is separate from unknown physical fit; no blocker is hidden by promotion.
- **Media result:** Small synthetic line thumbnails remain subordinate and missing media does not remove line identity.
- **Accessibility observations:** Issue-summary links create a useful reading path; state meanings are textual; disabled static controls do not imply working resolution; blocker/action proximity survives reflow.
- **320-pixel observation:** The ledger becomes a single column while preserving issue summary, line consequences, totals, and blocked progression action.
- **Failures:** None in the static consequence-ledger composition.
- **Proposed correction:** No page-level correction; real acknowledgment, notification, eligibility, inventory, and checkout rules remain gated outside this prototype.
- **Result:** **PASS**.

## Package accessibility review

| Area | Observation | Evaluation |
|---|---|---|
| Text contrast | Warm-neutral surfaces, near-black text/actions, and restrained upstream red were visually inspected. The adjusted dark red Home field uses white text. | Suitable for the visual hypothesis; formal production contrast audit remains required. |
| Focus visibility | The CSS and static specimens use a visible blue perimeter with surface separation. | Retain direction; validate across real components and forced-colors modes. |
| State distinction without color | State names, symbols, scope, consequence, and recovery accompany color. | Passes the static test. |
| Long-text wrapping | Long product, platform, component, proof, and cart-line identities wrap at 1440, 390, and 320. | Passes the static test. |
| Target-size representation | Primary actions and options present substantial visual targets; dense line controls remain secondary and are disabled as static specimens. | Adjust and measure in the next specification; no functional target audit was possible. |
| Semantic reading order | Narrow PDPs place decisions before media; Quick Cart and Full Cart preserve consequence before progression. | Passes the static structural test. |
| 390/320 reflow | No material horizontal overflow or loss of blocker/action context was observed. | Passes; canvas widths are not production breakpoints. |
| 200%/400% zoom | Controlled zoom was unsupported in the export environment. | Still open; narrow reflow is supporting evidence, not a substitute. |
| Reduced motion | Essential state and hierarchy are present in static outcomes; CSS includes a reduced-motion branch. | Passes the static-equivalence test; live transition behavior remains open. |
| Missing media | Placeholders name what is absent and retain exact textual identity and consequence. | Passes the static test. |
| Table-to-record reflow | Dense facts are represented as semantic label/value records that collapse into readable narrow sequences. | Passes the static test. |
| Blocker/action proximity | Blocked actions retain nearby reasons and recoveries at all inspected widths. | Passes the static test. |
| Conformance boundary | No automated or manual pass here establishes full accessibility conformance. | No conformance claim made. |

## Provisional token evaluation

Each decision receives one primary classification. A gate column may record an additional dependency without changing that classification.

| Provisional decision | Classification | Rendered evidence and next-specification implication | Gate |
|---|---|---|---|
| Archivo typography direction | RETAIN FOR NEXT SPECIFICATION | The export browser reported Archivo rendered; condensed display energy and normal-width records formed a useful hierarchy. Specify licensing/loading and fallback tests next. | Production font delivery remains unverified. |
| Provisional type scale | ADJUST | P4/P3/P1/P0 separation is clear, but long narrow pages require tighter responsive caps and line-length rules rather than page-specific exceptions. | None. |
| Spacing ladder | RETAIN FOR NEXT SPECIFICATION | Shared section, group, record, and control intervals create progressive quieting and readable state stacks. | Validate with real content. |
| Content widths | RETAIN FOR NEXT SPECIFICATION | House, commerce, decision, data, and reading widths visibly support different information densities. | Validate at additional viewports. |
| Grid behavior | ADJUST | Wide grids work; evidence-heavy cards correctly become one column at narrow widths. Next specification should codify content-driven collapse and avoid naming test canvases as breakpoints. | Real catalog-name distribution. |
| Neutral temperature | RETAIN FOR NEXT SPECIFICATION | Warm neutral separates the house from generic clinical commerce while keeping proof surfaces quiet. | Physical display/device testing. |
| Brand-red role | RETAIN FOR NEXT SPECIFICATION | Red is concentrated in Home Pressure and disappears from compatibility, fit, proof consequence, and cart. | Exact production palette values remain provisional. |
| Semantic colors | ADJUST | Separate families are legible with text/symbol anatomy; the next specification must formally test contrast, dark/forced-color behavior, and adjacent-state confusion. | Accessibility validation. |
| Focus treatment | ADJUST | The blue exterior ring is visible and color-independent in static specimens, but token offsets, contrast, clipping, and component coverage need formal definition. | Functional component states. |
| Radius | RETAIN FOR NEXT SPECIFICATION | Small controls, restrained surfaces, and a slightly larger layer radius avoid soft lifestyle-card trade dress. | None. |
| Borders | RETAIN FOR NEXT SPECIFICATION | Thin structural borders provide grouping without excessive card chrome. | Contrast validation. |
| Elevation | RETAIN FOR NEXT SPECIFICATION | Elevation is reserved for the Quick Cart layer; normal commerce surfaces remain flat. | Interactive layer behavior. |
| Card geometry | RETAIN FOR NEXT SPECIFICATION | Shared low-chrome anatomy supports cross-division comparison while allowing evidence adaptation. | Real media and content. |
| Action geometry | ADJUST | Near-black primary and outlined secondary actions are disciplined, but dense record/cart actions need target-size and disabled-state tokenization. | Accessibility and functional states. |
| Form density | ADJUST | Options and filters survive long labels, but exact row/stack thresholds and help/error spacing require real forms and validation content. | Real data and service errors. |
| Media ratios | BLOCKED BY REAL DATA | CSS stand-ins prove layout resilience and missing-media behavior but cannot select final ratios for products, labels, interfaces, or scale photography. | Authoritative product and editorial media. |
| Responsive composition | RETAIN FOR NEXT SPECIFICATION | Decision-first PDP reordering, one-column evidence cards, full-width Quick Cart, and consequence-ledger reflow preserve critical context at 390/320. | Zoom and broader device testing. |
| Motion categories | STILL OPEN | Static outcomes and reduced-motion equivalence are defined, but no timing, choreography, interruption, focus, or live-state transition was implemented or tested. | Interactive prototype required later. |

No provisional token decision is **REJECTED** in this pass. “Retain” means retain for the next specification, not authorize production values.

## Pass-condition matrix

| Required condition | Evidence | Result |
|---|---|---|
| Home is visibly the most expressive commerce page. | Home alone carries P4 red, scale, asymmetry, and the full editorial logo. | PASS |
| Division pages remain one visual family. | Shared masthead, job-route, evidence, curation, and quieting grammar is consistent across all three divisions. | PASS |
| Category cards remain low-chrome and comparable. | Shared geometry and hierarchy persist while evidence adapts by domain. | PASS |
| PDPs clearly prioritize exact product truth. | IDs, selected records, sources, unknowns, requirements, and consequence precede secondary content. | PASS |
| THCA proof is scoped and unmistakable. | Product/variant/batch match, currentness, source, and consequence are explicit and distinct from eligibility. | PASS |
| Electronic compatibility cannot be mistaken for promotion. | Named endpoints, conditions, evidence, consequence, and blockers precede action; no promotional badge or bundle treatment is used. | PASS |
| Physical fit cannot be inferred from nominal size alone. | Gender/type mismatch, angle, orientation, length, clearance, and adapter conditions remain independent. | PASS |
| Unknown/unverified remains visually non-affirmative. | Question marker, explicit label, missing input, consequence, and blocked action are consistently present. | PASS |
| Quick Cart confirms without pretending to validate the order. | “Cart updated” is followed by exact-line issues and a Full Cart handoff; checkout readiness is explicitly withheld. | PASS |
| Full Cart reads as a consequence ledger. | Order summary links to exact affected lines; each line names state, scope, consequence, and resolution before totals/progression. | PASS |
| Red retreats as decision consequence increases. | Brand red is upstream on Home and absent from PDP decision blockers and cart. | PASS |
| The current padded logo is not misused. | It appears only on Home, complete and spacious; headers use live text. | PASS |
| Narrow layouts preserve blockers and primary actions. | All 390 and 320 inspections retain state consequence and action context without material overflow. | PASS |
| Synthetic fixtures are unmistakably non-production. | Every representative page and screenshot carries the exact prototype notice; identities, prices, evidence, and services are explicitly synthetic/placeholders. | PASS |

## Governing gates

### Brand asset

- A production compact header identity does not exist. Continue using live text in prototypes; do not crop, mask, recolor, trace, or derive a compact mark from the padded logo.
- Final brand-red values and accessible pairings require a formal token specification and contrast validation.

### Real data

- Product, variant, batch, platform, component, and cart identifiers.
- Actual price, inventory, availability, unit, and package-content records.
- Current proof, exact proof scope, issuer/source, dates, and record matching.
- Bidirectional compatibility, conditions, replacements, and successor differences.
- Physical dimensions, gender/type, angle, orientation, length, clearance, tolerance, and verified pair tests.
- Material, maker/provenance, product photography, label/interface media, and scale media.
- These unknowns must remain unknown/unverified until an authoritative source exists.

### Operations / compliance

- Eligibility and restriction ownership, rule source, evaluation scope, failure behavior, and customer explanation.
- Proof currency rules and operational ownership.
- Inventory/price-change acknowledgment and order revalidation behavior.
- Notification authorization, consent scope, expiry, and contact-channel rules.
- Fragile packaging, receiving inspection, damaged-arrival evidence, replacement eligibility, and support ownership.
- Checkout progression, focus management, layer behavior, error recovery, and contextual support workflows.

## Outcome summary

### Pages passed

- 02 — THCA Division Landing
- 03 — Vape & Nicotine Division Landing
- 05 — Shared Category
- 06 — Universal PDP
- 12 — Quick Cart
- 13 — Full Cart

### Pages conditionally passed

- 01 — Home: compact brand asset remains gated.
- 04 — Glass & Accessories Division Landing: real measurements/media and fragile-support policy remain gated.
- 07 — THCA PDP: proof/catalog truth and eligibility rules remain gated.
- 08 — Refillable Device / Kit PDP: real package and compatibility records remain gated.
- 09 — Pod / Coil / Replacement PDP: real compatibility and successor records remain gated.
- 10 — Complete Glass Piece PDP: real physical/provenance data and fragile operations remain gated.
- 11 — Fitted Component PDP: verified geometry and pair-testing data remain gated.

### Pages failed

- None.

### Decisions retained

- Archivo direction.
- Spacing ladder.
- Content-width roles.
- Warm-neutral temperature.
- Restrained upstream brand-red role.
- Radius hierarchy.
- Structural borders.
- Layer-only elevation.
- Low-chrome card geometry.
- Responsive composition.

### Decisions adjusted or rejected

- Adjust type scale, grid rules, semantic-color validation, focus treatment, action geometry, and form density in the next specification.
- No decision was rejected.
- Media ratios are blocked by real data; motion categories remain open.

### Most important unresolved gates

1. Approved compact brand identity for persistent navigation.
2. Authoritative proof, compatibility, physical-measurement, package, inventory, price, and media records.
3. Compliance-owned eligibility and restriction rules.
4. Operations-owned price acknowledgment, notification permission, fragile support, fulfillment, and order-progression behavior.
5. Controlled zoom, broader assistive-technology, contrast, focus, and target-size validation.

## Selected next phase

**A. DESIGN TOKEN SPECIFICATION**

The rendered evidence is sufficiently coherent to specify the retained Pressure & Proof primitives and explicitly adjust the unresolved type, grid, semantic, focus, action, and form rules. Token specification is the appropriate next step because it can convert repeated visual evidence into shared, testable decisions without pretending that real catalog truth, compliance rules, motion behavior, or technical implementation has been resolved.

The selected next phase was **not started**. Production implementation remains unauthorized.
