# Blowin' Smoke — Static Visual Prototype Iteration 02 Evaluation

**Status:** Iteration evaluation; non-production

**Baseline:** `docs/prototypes/pressure-proof/`

**Iteration package:** `docs/prototypes/pressure-proof-iteration-02/`

**Governing direction:** Pressure & Proof

**Implementation authorization:** Not granted

## Evaluation basis

Iteration 02 is a focused refinement of the approved Pressure & Proof direction. It does not reopen brand philosophy, research, information architecture, page-family architecture, product-truth concepts, or the selected visual direction. Iteration 01 remains intact as comparison evidence and is not superseded as governing authority.

This evaluation records inspected export evidence. A generated file, declared CSS value, or intended correction was not treated as proof until the rendered result was opened and reviewed.

### Render manifest

| Evidence | Required | Inspected result |
|---|---:|---|
| HTML compositions | 14 | 14 present and structurally checked |
| 1440 CSS-pixel PNGs | 14 | 14 opened and inspected |
| 390 CSS-pixel PNGs | 14 | 14 opened and inspected |
| 320 CSS-pixel PNGs | 14 | 14 opened and inspected |
| Wide comparison boards | 6 | 6 opened and inspected |
| Narrow comparison boards | 6 | 6 opened and inspected |

The test canvases are evaluation conditions, not production breakpoints. Every exported PNG must be opened and inspected. The six required comparison subjects are Home, Shared Category, Universal PDP, THCA PDP, Quick Cart, and Full Cart.

### Typeface evidence

- **Display stack declared:** Archivo condensed/variable candidate → Arial Narrow → sans-serif.
- **Interface/body stack declared:** Archivo normal-width candidate → Arial → Helvetica → sans-serif.
- **Data stack declared:** Archivo normal-width candidate → Arial → Helvetica → sans-serif.
- **Computed display family/weight:** `Archivo, "Arial Narrow", Arial, sans-serif` at `800`.
- **Computed product-title family/weight:** `Archivo, Arial, "Helvetica Neue", sans-serif` at `700`; `46.8px` wide, `34px` at 390, `30px` at 320.
- **Computed body/interface family/weights:** `Archivo, Arial, "Helvetica Neue", sans-serif`; body `400`, controls and labels `600–700`.
- **Computed data/state/cart family/weights:** `Archivo, Arial, "Helvetica Neue", sans-serif`; data `600`, state titles/prices `700–800`.
- **Archivo availability check:** `document.fonts.check()` returned `true` for 400, 500, 600, 700, 800, and 900.
- **Rendered supported weights:** environment reported all six requested Archivo weights available; package CSS uses only 400, 600, 700, and 800.
- **Fallback result:** no fallback activation was observed; no font binary is bundled and glyph-level file identity was not exposed.
- **Font packaging:** no font binary may be downloaded or committed.

Arial Narrow must not appear in the body, interface, form, error, proof, compatibility, cart, or data fallback paths. Unsupported intermediate weights such as 650, 750, and 850 are not accepted merely because a browser synthesizes them.

### Red and palette evidence

Iteration 02 selects **Approach B**: near-black is the large Home Pressure field; observed logo red remains confined to the source logo and a non-text witness bar. The observed logo red is an asset observation, not an approved interface token. The unjustified circular arc is removed.

| Pair | Measured ratio | Evaluation |
|---|---:|---|
| White / near-black Pressure | 17.928:1 | PASS |
| Near-black / warm-neutral canvas | 17.155:1 | PASS |
| Secondary text / canvas | 8.431:1 | PASS |
| White / near-black primary action | 17.928:1 | PASS |
| Focus boundary / canvas | 5.215:1 | PASS |
| Inverse focus / near-black | 9.821:1 | PASS |
| Current Proof foreground/background | 8.258:1 | PASS |
| All remaining semantic pairs | 7.284:1–9.366:1; disabled copy 7.865:1 | PASS |

Near-black Pressure and observed logo red are governed by scale and role, not treated as competing interface reds. `#ED2925` measures 4.221:1 against the field and is used only as a non-text bar/source-logo observation. Brand red is never reused for error, restriction, proof status, compatibility, or cart consequence. Exact production red remains blocked by the authoritative brand-asset package.

### Responsive, zoom, and environment evidence

- **1440 overflow:** all 14 pages reported `scrollWidth === clientWidth`; no horizontal overflow.
- **390 overflow:** all 14 pages reported `scrollWidth === clientWidth`; no horizontal overflow.
- **320 overflow:** all 14 pages reported `scrollWidth === clientWidth`; no horizontal overflow.
- **Search visible and named at 320:** visible and named “Search” on all 14 pages.
- **Quick Cart viewport containment:** drawer height `695px` at 1440, `641px` at 390, and `537px` at 320; bottom remained within each viewport, middle region scrolled internally, and both actions remained visible.
- **44 × 44 target hypotheses:** discrete controls/links represent at least 44px; primary controls/options represent 48px. This is not a functional audit.
- **Reduced-motion static equivalence:** all information exists in static state; CSS suppresses nonessential transition/animation duration.
- **Forced-colors representation:** selected, focused, Unknown, status, evidence, and control boundaries have explicit forced-colors rules; not OS-render tested.
- **200% zoom:** unsupported by the exposed browser capability; not inferred from narrow reflow.
- **400% zoom:** unsupported by the exposed browser capability; not inferred from narrow reflow.

Narrow reflow is not a substitute for controlled browser zoom. No functional target audit or complete accessibility-conformance claim is made.

## Outcome standard

- **PASS:** the required visual correction is demonstrated at every relevant inspected canvas, comparison evidence shows improvement, and no material visual-system defect remains.
- **CONDITIONAL PASS:** the visual correction is demonstrated, but an external brand, real-data, measurement, operations/compliance, or unsupported-environment gate prevents a final production conclusion.
- **FAIL:** a required correction is absent, regresses, hides truth/action/search/blocker context, or leaves a material visual-system defect.

## 1. Home

- **What changed from Iteration 01:** The decorative arc is removed, a purposeful witness rule replaces it, the selected red relationship is made explicit, card statuses use inline density, and Search remains reachable at 320.
- **Baseline / comparison evidence:** Wide and narrow boards show the red field/arc replaced by a near-black field and red witness bar; card panels collapse to inline cues and maintain aligned prices/actions.
- **Wide result:** Remains the most expressive commerce page while avoiding adjacent competing red fields.
- **Narrow result:** Preserves logo context, Pressure-to-Proof order, division routes, and card identity before state.
- **320 result:** Search remains visibly reachable; the witness rule, logo, routes, and product actions reflow without loss.
- **Typography result:** Display treatment remains appropriate here; interface/body text uses the normal-width stack.
- **Red / palette result:** Approach B confines the large field to near-black and observed red to the source logo/non-text witness bar.
- **Status-density result:** Curated card states become Inline Status and no longer outrank names.
- **Action / recovery result:** Product links retain truthful record/recovery language without imitating working commerce.
- **Card or data-density result:** Shared rows stabilize identity, facts, status, price, and action across the four-card composition.
- **Accessibility observation:** White/Pressure contrast is 17.928:1; controls retain single focus boundaries and 44px hypotheses; all three canvases reflow without overflow.
- **Remaining failure:** The production compact brand asset and exact red remain unresolved.
- **Gate or proposed correction:** Keep live-text header identity and block production palette approval pending the authoritative brand package.
- **Result:** **CONDITIONAL PASS** — the visual correction passes; the brand asset remains externally gated.

## 2. THCA Division Landing

- **What changed from Iteration 01:** Role-specific package, batch, source, and proof-document notation differentiate the division; Current Proof receives documentary rather than generic Success treatment.
- **Baseline / comparison evidence:** Direct inspection at all three canvases confirms package/batch/proof labels, blue Current Proof, and compact card cues inside the shared division shell.
- **Wide result:** Remains in the shared division family while exposing THCA evidence roles visually.
- **Narrow result:** Format, proof, eligibility, and curated records retain hierarchy without full-panel dominance.
- **320 result:** Search, job routes, exact proof cues, and actions remain reachable.
- **Typography result:** Display stack remains upstream; body and evidence records use the normal-width stack.
- **Red / palette result:** No brand red is used as proof, success, or restriction meaning.
- **Status-density result:** Cards use Inline Status; documentary proof detail uses Full Evidence only where warranted.
- **Action / recovery result:** Proof and eligibility routes remain enabled independently of purchase readiness.
- **Card or data-density result:** Curated row alignment remains stable across proof-message lengths.
- **Accessibility observation:** Current Proof, stale, missing, unmatched, restriction, and error remain distinguishable without color.
- **Remaining failure:** Real proof scope/currentness and eligibility data are absent by design.
- **Gate or proposed correction:** Preserve placeholders until authoritative proof and compliance records exist.
- **Result:** **PASS** for the visual refinement; no page-specific system defect remains.

## 3. Vape & Nicotine Division Landing

- **What changed from Iteration 01:** Device/component separation, connection notation, and platform lifecycle geometry create controlled differentiation.
- **Baseline / comparison evidence:** All three canvases preserve device/platform, pod/component, replacement, and lifecycle endpoints with no overflow or image-based compatibility inference.
- **Wide result:** Remains one house while making electronic roles visually legible before products.
- **Narrow result:** Lifecycle endpoints and role-specific media stack in complete text order.
- **320 result:** Search remains present; relationship endpoints retain names, direction, and state.
- **Typography result:** Technical records use normal-width interface/data roles rather than condensed fallback.
- **Red / palette result:** Compatibility never uses brand-red emphasis.
- **Status-density result:** Compact relationship and product states use Inline Status; evidence remains deeper.
- **Action / recovery result:** Compatibility entry remains an enabled discovery/recovery route.
- **Card or data-density result:** Device, consumable, replacement, and accessory records align as one result set.
- **Accessibility observation:** Endpoint identity, icons, and text preserve meaning without color or image inference.
- **Remaining failure:** Real compatibility relationships and platform imagery are absent.
- **Gate or proposed correction:** Hold production relationship claims for authoritative manufacturer/SKU data.
- **Result:** **PASS** for the visual refinement.

## 4. Glass & Accessories Division Landing

- **What changed from Iteration 01:** Scale, connection geometry, material/maker notation, and included/required relationships provide controlled differentiation.
- **Baseline / comparison evidence:** All three canvases preserve scale, geometry, maker, material, fragile-handling, and measurement routes; 320 remains one readable column.
- **Wide result:** Remains within the shared division shell while presenting physical truth as its distinctive evidence grammar.
- **Narrow result:** Complete piece, fitted component, care, maker, and support modules retain decision order.
- **320 result:** Search and measurement/fit routes remain reachable; records wrap without horizontal loss.
- **Typography result:** Technical dimensions and maker records use the normal-width data stack.
- **Red / palette result:** Warnings and unknown fit use semantic roles, not brand red.
- **Status-density result:** Product cues use Inline Status; geometry and fragile-support evidence use deeper variants only when needed.
- **Action / recovery result:** Measurement and fit guidance remain enabled recovery routes.
- **Card or data-density result:** Role-specific records align without turning every state into a large panel.
- **Accessibility observation:** Geometry is textual and state distinctions do not depend on shape or color.
- **Remaining failure:** Real measurements, media, maker truth, and fragile operations remain unavailable.
- **Gate or proposed correction:** Re-test with authoritative physical records and approved support policy.
- **Result:** **CONDITIONAL PASS** — visual refinement passes; data and operations remain gated.

## 5. Shared Category

- **What changed from Iteration 01:** Inline card status, stable shared-row alignment, and both Compact Comparison and Full-width Evidence card modes are introduced.
- **Baseline / comparison evidence:** Boards show lower card-state weight and steadier price/action rows. At 390 two low-consequence browse cards share a row while four evidence records span full width; 320 collapses all records.
- **Wide result:** Identity outranks state while price and action baselines remain stable.
- **Narrow result:** Fully resolved low-consequence records may use two-column compact cards; blocked, stale, unknown, incompatible, long-name, or missing-media records remain full width.
- **320 result:** Content-driven collapse returns evidence-heavy and compact records to one column where required.
- **Typography result:** Product identity remains normal-width and stronger than inline state copy.
- **Red / palette result:** State semantics remain separate from house red.
- **Status-density result:** Inline Status is the card default; large Full Evidence panels are removed from result cards.
- **Action / recovery result:** Truthful product or recovery links remain enabled; unavailable/blocked commerce is not mislabeled as recovery.
- **Card or data-density result:** Explicit shared rows align identity, facts, state, price, and action without clipping.
- **Accessibility observation:** The explicit focus specimen has one blue boundary, selected controls use pressed state/border, and every consequential action retains at least a 44px hypothesis.
- **Remaining failure:** Real catalog-name and state distributions are unavailable.
- **Gate or proposed correction:** Validate the compact-mode eligibility rule against real catalog stress data before production.
- **Result:** **PASS** for the static correction.

## 6. Search Results

- **What changed from Iteration 01:** Search Results becomes an independent page family rather than reusing Shared Category.
- **Baseline / comparison evidence:** No Iteration 01 Search Results page existed. The new family visibly preserves the submitted query, declared interpretation/correction/ambiguity, typed results, and distinct recovery states at all canvases.
- **Wide result:** Query interpretation precedes product, category, guide, support, replacement-intent, and recovery results.
- **Narrow result:** Submitted query, interpreted scope, suggested correction, ambiguity choices, constraints, and results retain their order.
- **320 result:** Search remains visible and explicitly named; no correction is silently applied.
- **Typography result:** Query and interpretation hierarchy use interface roles, with results subordinate to what the system understood.
- **Red / palette result:** Search errors/restrictions use semantic color, not brand red.
- **Status-density result:** Results use Inline Status; no-result and service-error recovery use Decision Summary; full metadata remains exceptional.
- **Action / recovery result:** Suggested correction, ambiguity choice, query reset, device identification, and support routes remain enabled and explicit.
- **Card or data-density result:** Search intent/context receives its own structure rather than a category-filter clone.
- **Accessibility observation:** Query, suggestion, result type, missing media, restriction, and unknown compatibility remain textual and ordered.
- **Remaining failure:** Search interpretation and service behavior are static specimens only.
- **Gate or proposed correction:** Interactive search semantics and live data remain future work.
- **Result:** **PASS** for the independent static page-family correction.

## 7. Universal PDP

- **What changed from Iteration 01:** Product title is quieter; opening uses one Decision Summary, a contributing-state list, a blocked Add to Cart, an enabled option-selection recovery, and deeper Full Evidence below.
- **Baseline / comparison evidence:** Boards show the opening reduced from five equal-weight panels to one summary, four concise contributors, a disabled action, active recovery, and deeper evidence.
- **Wide result:** Exact identity and highest blocker outrank media and secondary states without reading like a campaign.
- **Narrow result:** Decision precedes media; active recovery stays adjacent to the blocked purchase action.
- **320 result:** Long identity, blocker, contributing states, purchase action, and recovery wrap without clipping.
- **Typography result:** Product title is upright normal-width Archivo at weight 700; computed `46.8px` wide, `34px` at 390, and `30px` at 320 with `1.08/1.12` line-height.
- **Red / palette result:** No brand red enters the decision surface.
- **Status-density result:** One Decision Summary plus concise contributing states replaces equally dominant panels; Full Evidence remains below.
- **Action / recovery result:** “Add to cart unavailable” is disabled; “Choose an exact option” is enabled and names the resolution.
- **Card or data-density result:** Dense exact records remain label/value units and no longer compete with opening blockers.
- **Accessibility observation:** The disabled purchase action, textual reason, and enabled recovery are adjacent; links/buttons retain single focus treatment and minimum target hypotheses.
- **Remaining failure:** Real option, price, availability, eligibility, and component data are absent.
- **Gate or proposed correction:** Keep the universal composition candidate conditional only on real domain data, not on visual hierarchy.
- **Result:** **PASS** for the static hierarchy correction.

## 8. THCA PDP

- **What changed from Iteration 01:** Quieter product title, dedicated Current Proof alias, composed opening hierarchy, blocked purchase, and enabled proof/destination recovery replace generic Success and equal-weight panels.
- **Baseline / comparison evidence:** Boards show a quieter title, one opening restriction summary, contributor list, enabled recovery, and a blue documentary Current Proof panel below.
- **Wide result:** Selected batch, highest consequence, action state, and recovery lead; proof comparison remains deeper.
- **Narrow result:** Independent strain/quantity, price basis, blocker, action, and recovery retain proximity.
- **320 result:** Options remain readable without line-through dependence; proof scopes and recoveries wrap fully.
- **Typography result:** Product identity is normal-width Archivo 700 at `46.8px` wide, `34px` at 390, and `30px` at 320—visibly quieter than the oblique display heading.
- **Red / palette result:** Current Proof uses documentary/informational treatment; it is not green Success or brand red.
- **Status-density result:** Opening uses one Decision Summary and contributing-state list; proof records below use Full Evidence.
- **Action / recovery result:** Add to Cart is blocked with nearby reason; destination/proof recovery remains enabled.
- **Card or data-density result:** Proof metadata remains complete without dominating the purchase opening.
- **Accessibility observation:** Current, stale, missing, not supplied, unmatched, service error, and restriction remain distinct without color.
- **Remaining failure:** Real batch proof, currentness, inventory, and eligibility rules remain unavailable.
- **Gate or proposed correction:** Require authoritative proof/catalog data and compliance ownership before production.
- **Result:** **CONDITIONAL PASS** — visual correction passes; real data/compliance remain gated.

## 9. Refillable Device / Kit PDP

- **What changed from Iteration 01:** Quieter title, composed state hierarchy, blocked Add to Cart, and enabled “Find verified compatible pod” recovery separate commerce from resolution.
- **Baseline / comparison evidence:** All three canvases preserve exact platform, included/required package roles, one requirement summary, concise relationship contributors, disabled purchase, and active compatibility recovery.
- **Wide result:** Exact platform, included/required roles, and highest requirement dominate before price/action.
- **Narrow result:** Decision precedes media; compatible and unknown relationships remain scoped to exact endpoints.
- **320 result:** Required-component summary, blocked purchase, and active recovery remain visible and reachable.
- **Typography result:** Product identity uses the normal-width PDP role; body/data fallbacks exclude Arial Narrow.
- **Red / palette result:** Compatibility and unknown use semantic roles, never brand red.
- **Status-density result:** Requirement becomes a Decision Summary; relationship evidence moves below; contributing states remain concise.
- **Action / recovery result:** Blocked Add to Cart and enabled compatible-pod recovery are visually and semantically distinct.
- **Card or data-density result:** Package contents and technical records remain scannable without full-panel repetition.
- **Accessibility observation:** Disabled purchase and enabled relationship link are visually distinct; Compatible and Unknown are textually named, and controls retain target/focus hypotheses.
- **Remaining failure:** Real package and platform/component relationships are unavailable.
- **Gate or proposed correction:** Validate with manufacturer/SKU truth before production.
- **Result:** **CONDITIONAL PASS** — visual correction passes; real compatibility data remains gated.

## 10. Pod / Coil / Replacement PDP

- **What changed from Iteration 01:** Quieter title, readable incompatible/unavailable options, blocked purchase, and enabled “Identify my device” recovery refine relationship-first commerce.
- **Baseline / comparison evidence:** All three canvases keep owned-device context first, preserve readable incompatible options, separate blocked purchase from device-identification recovery, and disclose successor differences.
- **Wide result:** Owned-device context and compatibility remain dominant without becoming promotion.
- **Narrow result:** Endpoint identity, relationship state, action, recovery, and successor disclosure retain order.
- **320 result:** Option values remain readable; incompatible meaning does not depend on line-through.
- **Typography result:** Exact part identity uses the normal-width PDP role.
- **Red / palette result:** Compatible, incompatible, conditional, and unknown remain independent from brand red.
- **Status-density result:** Highest compatibility issue uses Decision Summary; matrix/successor details use deeper evidence.
- **Action / recovery result:** Add to Cart is unavailable until exact context resolves; device identification remains active.
- **Card or data-density result:** Relationship states remain separated without repeating complete evidence in the opening.
- **Accessibility observation:** Disabled incompatible values remain readable without line-through; symbols, labels, border styles, single focus, and 44/48px hypotheses carry meaning beyond color.
- **Remaining failure:** Real revisions, compatibility evidence, and successor truth remain unavailable.
- **Gate or proposed correction:** Require authoritative bidirectional relationship data.
- **Result:** **CONDITIONAL PASS** — visual correction passes; relationship data remains gated.

## 11. Complete Glass Piece PDP

- **What changed from Iteration 01:** Quieter title and restrained status densities reduce opening competition while preserving dimensions, package roles, maker, care, and fragile support.
- **Baseline / comparison evidence:** All three canvases show one clearance summary, concise fragile/requirement contributors, active physical-record recovery, textual dimensions, maker record, and missing scale media.
- **Wide result:** Exact physical identity and measurable truth lead before provenance narrative.
- **Narrow result:** Media boundary, dimensions, contents, maker, care, and support retain causal order.
- **320 result:** Units and labels remain readable without horizontal scrolling.
- **Typography result:** Long object identity uses the normal-width PDP role; dimension data remains normal width.
- **Red / palette result:** Unknown fit and fragile support use semantic roles, not brand red.
- **Status-density result:** Small media/availability cues use Inline Status; material blockers use Decision Summary; physical/operational records use Full Evidence below.
- **Action / recovery result:** Purchase readiness and physical/support recovery remain distinct.
- **Card or data-density result:** Repeated physical records remain scannable without large-panel default treatment.
- **Accessibility observation:** Measurements, units, included/required roles, missing media, and support state remain textual.
- **Remaining failure:** Real physical, provenance, media, packaging, and fragile-support data are unavailable.
- **Gate or proposed correction:** Validate with receiving measurements, maker records, scale media, and approved operations.
- **Result:** **CONDITIONAL PASS** — visual correction passes; data and operations remain gated.

## 12. Fitted Component PDP

- **What changed from Iteration 01:** Quieter title, composed opening, readable incompatible option/state, blocked purchase, and enabled measurement/fit recovery replace equal-weight panels.
- **Baseline / comparison evidence:** All three canvases retain the direct mismatch as the single summary, move adapter/clearance to contributors, keep purchase blocked, and expose active geometry recovery plus deeper records.
- **Wide result:** Direct mismatch remains dominant; adapter condition and unknown clearance become contributing states with deeper evidence below.
- **Narrow result:** Source/target geometry, consequence, action, and recovery retain their causal order.
- **320 result:** Nominal size, gender/type, angle, clearance, and action labels remain readable without line-through dependence.
- **Typography result:** Product identity is quieter than division display type and uses the normal-width stack.
- **Red / palette result:** Incompatible, conditional, and unknown remain semantically distinct from brand red.
- **Status-density result:** One direct-fit Decision Summary, concise contributors, and deeper geometry/adapter Full Evidence demonstrate composed hierarchy.
- **Action / recovery result:** Add to Cart is unavailable; “Enter measurements” or “Get fit help” remains enabled.
- **Card or data-density result:** Geometry records remain complete while the opening loses redundant panel weight.
- **Accessibility observation:** Named source/target endpoints, mismatch symbol/text, readable values, single focus treatment, 44px hypotheses, and adjacent recovery preserve the decision without color reliance.
- **Remaining failure:** Authoritative geometry, tolerances, and pair-testing evidence remain absent.
- **Gate or proposed correction:** Re-test against verified measurements and difficult assemblies.
- **Result:** **CONDITIONAL PASS** — visual correction passes; physical-data validation remains gated.

## 13. Quick Cart

- **What changed from Iteration 01:** Four full issue panels become one highest Decision Summary plus “3 additional issues require Full Cart review,” with compact subtotal and persistent actions.
- **Baseline / comparison evidence:** Boards show four full issue panels removed. Wide is dramatically shorter; at 390/320 the contained drawer exposes both persistent actions while its content region scrolls internally.
- **Wide result:** The drawer fits within the test viewport and reads as confirmation/routing rather than miniature Full Cart.
- **Narrow result:** Full-height treatment remains materially shorter and less detailed than Full Cart.
- **320 result:** Header/close and action region remain reachable; internal content scrolls when required.
- **Typography result:** Exact line identity remains prominent but normal width; issue summary is subordinate.
- **Red / palette result:** No brand red or urgency treatment appears.
- **Status-density result:** One Decision Summary and one compact additional-issue count replace repeated Full Evidence panels.
- **Action / recovery result:** View Full Cart and Continue Shopping remain reachable; no checkout-readiness claim is made.
- **Card or data-density result:** Exact line, selected options, price, highest issue, count, subtotal, and actions are the complete drawer payload.
- **Accessibility observation:** Drawer measured `641px` at 390 and `537px` at 320 with its bottom inside each viewport; both actions remain visible. Focus containment, inertness, Escape, and return are documented contracts only.
- **Remaining failure:** Functional inertness, focus trap, Escape, focus return, and error retention are contracts only.
- **Gate or proposed correction:** Reserve behavioral validation for a future interactive prototype.
- **Result:** **PASS** for the static layer correction.

## 14. Full Cart

- **What changed from Iteration 01:** Order issues are categorized and counted; cart lines use compact summaries/direct recovery; one line demonstrates expanded evidence; sidebar repetition is removed.
- **Baseline / comparison evidence:** Boards show a large reduction in page height and panel repetition while retaining eight categorized issue counts, eight exact lines, one expanded conflict, totals, and direct recovery.
- **Wide result:** The ledger remains complete but is materially shorter and less repetitive.
- **Narrow result:** Categorized summary, compact lines, one expanded issue, totals, and blocked progression retain order.
- **320 result:** Summary navigation, line recovery, totals, and blocked action remain reachable without duplicated anatomy.
- **Typography result:** Line identity, compact issue labels, counts, and totals use the normal-width interface/data stacks.
- **Red / palette result:** Consequence remains P0; brand red and promotion are absent.
- **Status-density result:** Order summary uses categorized counts, lines use Inline Status, one blocker may use Full Evidence, and sidebar does not repeat the register.
- **Action / recovery result:** Each line has direct recovery; one truthful blocked progression action follows line consequences.
- **Card or data-density result:** Repetition is reduced without hiding any blocker or exact affected line.
- **Accessibility observation:** Summary and direct links reach named lines, compact rows remain readable at 320, the blocked progression reason remains adjacent, and no sidebar repeats the issue register.
- **Remaining failure:** Real revalidation, acknowledgment, notification, eligibility, fulfillment, and checkout behavior remain absent.
- **Gate or proposed correction:** Preserve the compact ledger and defer functional orchestration to later phases.
- **Result:** **PASS** for the static compression correction.

## Package accessibility and contrast review

| Area | Expected result | Inspected evidence |
|---|---|---|
| Semantic text contrast | Every used foreground/background pair meets its applicable hypothesis. | PASS — semantic pairs measure 7.284:1–9.366:1; full register is in the package review note. |
| Pressure-field contrast | White normal text passes on the near-black field; observed logo red is not normal interface text. | PASS — white/near-black 17.928:1; observed-red bar/near-black 4.221:1. |
| Focus visibility | One clear focus boundary; no card/link double ring or clipping. | PASS — card `focus-within` perimeter removed; link/control owns focus. |
| State without color | Symbols, explicit labels, consequence, and recovery remain present. | PASS — inspected in proof, compatibility, search, PDP, and cart specimens. |
| Incompatible versus unavailable | Both values remain readable and explicitly named. | PASS — no line-through dependence; reason and consequence differ. |
| Current Proof versus Success | Documentary alias is visually and semantically distinct from generic success. | PASS — Current Proof is blue information/provenance at 8.258:1 and names exact scope. |
| 44-pixel targets | Consequential controls represent at least 44 × 44 CSS pixels. | PASS as a static hypothesis; functional measurement remains a gate. |
| Reading order | Query interpretation, decisions, blockers, recoveries, and cart consequences retain semantic order. | PASS in semantic HTML and inspected reflow. |
| Search at 320 | A visibly labeled Search control remains present. | PASS on all 14 pages. |
| 320/390 reflow | No material overflow or loss of critical truth/action. | PASS — `scrollWidth === clientWidth` on all 28 narrow captures. |
| Missing media | Exact textual identity and consequence survive. | PASS across product cards, Search, PDP, and cart fixtures. |
| Table-to-record reflow | Dense facts remain readable label/value records. | PASS — data grids become single-column records. |
| Blocker/action proximity | Blocked purchase reason and enabled recovery remain adjacent. | PASS on Universal, THCA, Kit, Replacement, Glass, and Fitted PDPs. |
| Quick Cart containment | Drawer is viewport-contained with reachable header/actions. | PASS — 695px at 1440, 641px at 390, and 537px at 320; both actions visible. |
| Full Cart navigation | Categorized issues lead to exact affected lines without triplicate detail. | PASS — eight counts/lines, one expanded record, no repeated sidebar register. |
| Reduced motion | Essential state is present in static outcomes. | PASS — no truth depends on motion; reduction CSS is present. |
| Forced colors | Boundaries, focus, selected, blocked, and status distinctions are represented. | CONDITIONAL PASS — CSS contract present; no OS forced-colors render was available. |
| 200%/400% zoom | Controlled zoom was not exposed. | NOT DETERMINABLE in this environment; narrow reflow is not substituted as proof. |

No result in this document establishes complete accessibility conformance.

## Mandatory correction matrix

| # | Mandatory correction | Iteration 02 evidence | Result | Remaining defect or gate |
|---:|---|---|---|---|
| 1 | Three status densities exist and are used correctly. | Inline Status governs cards/compact lines; Decision Summary governs purchase/form blockers; Full Evidence is reserved for detailed records; all three are visible in Search and across PDP/cart evidence. | PASS | Real-content density testing remains. |
| 2 | Current Proof no longer uses generic Success. | Dedicated documentary Current Proof alias names scope, source, date, and non-authorization boundary. | PASS | Real proof data remains gated. |
| 3 | Body/interface fallback cannot become Arial Narrow. | Computed interface/data stack is `Archivo, Arial, "Helvetica Neue", sans-serif`; Arial Narrow appears only in display fallback. | PASS | Actual production font delivery remains open. |
| 4 | PDP product title is visibly quieter. | Upright normal-width title computes to 46.8px wide, 34px at 390, and 30px at 320, weight 700. | PASS | None in the static system. |
| 5 | Red relationship is intentional and documented. | Approach B uses near-black Pressure, observed red only for logo/non-text bar, and independent semantic status families; 17.928:1 text contrast and 4.221:1 bar contrast. | CONDITIONAL PASS | Exact production red is blocked by authoritative brand assets. |
| 6 | Unjustified Home arc is removed or given a real structural job. | Before/after boards show the arc removed and a thin boundary witness bar substituted. | PASS | None. |
| 7 | Card states no longer visually overpower identity. | Card states use low-background Inline Status after identity/facts. | PASS | Validate with real catalog distributions. |
| 8 | Price and action alignment is more stable. | Explicit shared card rows align identity, facts, status, price, and action across wide collections without clipping. | PASS | Real catalog distributions remain a future stress test. |
| 9 | Compact and full-width narrow card modes are demonstrated. | Shared Category shows two-column compact resolved cards and full-width evidence cards at 390; 320 collapses by content. | PASS | Real-content mode eligibility remains a data test. |
| 10 | Search remains available at 320. | Browser metrics and screenshots confirm visible, named “Search” controls on all 14 pages. | PASS | Future mobile-layer behavior remains unimplemented. |
| 11 | Dedicated Search Results exists. | `pages/06-search-results.html` exposes interpretation before distinct result/recovery groups. | PASS | Live query interpretation remains future work. |
| 12 | Blocked purchase and recovery are distinct. | Consequential PDPs show disabled Add to Cart plus enabled, named recovery. | PASS | Recovery behavior remains static. |
| 13 | Incompatible options remain readable without line-through dependence. | Full option values, explicit label/symbol, semantic boundary, disabled state, and reason remain visible. | PASS | None. |
| 14 | Quick Cart is viewport-contained and materially shorter. | One highest issue plus additional count replaces four panels; drawer is 695px at 1440, 641px at 390, and 537px at 320 with both actions visible. | PASS | Functional focus/layer behavior remains open. |
| 15 | Full Cart reduces repetitive issue anatomy. | Boards show eight categorized compact lines, one expanded line, and a nonduplicative summary at materially reduced height. | PASS | Live progressive disclosure remains open. |
| 16 | Division differentiation comes through role-specific evidence/media. | THCA document/package, Vape interface/lifecycle, and Glass scale/geometry notation remain one synthetic media family. | PASS | Final media is blocked by real assets/data. |
| 17 | Focus treatment no longer creates a double boundary. | Product-card `focus-within` outline is removed; the target link/control owns one 3px focus perimeter with separation. | PASS | Functional keyboard audit remains future work. |
| 18 | Composed PDP state hierarchy is demonstrated. | Universal, THCA, Kit, and Fitted PDPs show one Decision Summary, contributing states, enabled recovery, and deeper evidence. | PASS | Real-state combinations remain data-gated. |
| 19 | Unknown remains non-affirmative. | Unknown always names missing input/consequence and never unlocks Add to Cart or implies fit/proof. | PASS | None. |
| 20 | Pressure & Proof remains one coherent system. | All 42 inspected canvases show one shell: Home concentrates expression, divisions differentiate through evidence notation, and decision/transaction surfaces progressively quiet to P0. | PASS | Production token values are not yet specified. |

## Governing gates

### Brand asset

- A production compact persistent-navigation mark remains unavailable; live text remains the only authorized prototype identity there.
- Observed logo red is not an approved production interface color.
- Exact red values and final contrast pairings remain blocked by the authoritative brand package.

### Real data

- Exact product, variant, batch, platform, component, and cart-line identities.
- Price, inventory, availability, units, and package contents.
- Proof records, scope, currentness, source, and dates.
- Compatibility, condition, replacement, and successor relationships.
- Physical dimensions, gender/type, angle, orientation, length, clearance, tolerances, and pair tests.
- Product, package, label, interface, maker, scale, and editorial media.

Unknown information remains Unknown / Unverified until an authoritative source exists.

### Operations / compliance

- Eligibility and restriction rules, ownership, scope, failure, and explanation.
- Proof-currentness policy and operating owner.
- Price acknowledgment and order revalidation.
- Notification consent/authorization.
- Fragile packaging, inspection, damaged-arrival evidence, replacement eligibility, and support ownership.
- Checkout progression, fulfillment, error recovery, and contextual support workflows.

### Testing and interaction

- Controlled 200%/400% zoom if unsupported in the export environment.
- Assistive-technology testing.
- Functional target-size and keyboard audit.
- Focus containment/return, inertness, Escape, disclosure, and exact-line retention.
- Motion timing, interruption, and live reduced-motion behavior.

## Outcome summary

### Pages passed

- 02 — THCA Division Landing
- 03 — Vape & Nicotine Division Landing
- 05 — Shared Category
- 06 — Search Results
- 07 — Universal PDP
- 13 — Quick Cart
- 14 — Full Cart

### Pages conditionally passed

- 01 — Home: compact brand asset and exact red remain gated.
- 04 — Glass & Accessories Division Landing: real physical media/data and fragile-support policy remain gated.
- 08 — THCA PDP: real proof/catalog truth and eligibility policy remain gated.
- 09 — Refillable Device / Kit PDP: package and compatibility truth remain gated.
- 10 — Pod / Coil / Replacement PDP: compatibility and successor truth remain gated.
- 11 — Complete Glass Piece PDP: real physical/provenance data and fragile operations remain gated.
- 12 — Fitted Component PDP: verified geometry and pair-testing data remain gated.

### Pages failed

- None.

### Mandatory corrections

- **PASS:** 19.
- **CONDITIONAL PASS:** 1 — the red relationship, because production red remains externally brand-asset gated.
- **FAIL:** 0.

### Most important unresolved gates

1. Authoritative compact identity and production palette.
2. Real proof, compatibility, physical measurement, package, inventory, price, and media truth.
3. Compliance-owned eligibility/restriction rules.
4. Operations-owned notification, fragile support, price acknowledgment, fulfillment, and order progression.
5. Controlled zoom, assistive-technology, functional focus/layer, target, and motion testing.

## Selected next phase

Options considered:

- A. DESIGN TOKEN SPECIFICATION
- B. ITERATE STATIC VISUAL PROTOTYPES AGAIN
- C. CONTENT & VOICE SYSTEM
- D. INTERACTIVE PROTOTYPE
- E. TECHNICAL IMPLEMENTATION ARCHITECTURE
- F. OTHER — explain

**A. DESIGN TOKEN SPECIFICATION**

The correction matrix has no material unresolved visual-system defect: 19 corrections pass and the red decision conditionally passes only because authoritative brand assets remain external to this prototype phase. The refined hierarchy is sufficiently stable to specify shared type, color, spacing, state-density, focus, card, action, and responsive tokens.

The selected next phase was **not started**. Production implementation remains unauthorized.
