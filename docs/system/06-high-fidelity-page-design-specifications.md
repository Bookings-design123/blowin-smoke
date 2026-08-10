# Blowin' Smoke — High-Fidelity Page Design Specifications

**Status:** Governing high-fidelity design specification

**Visual direction:** Pressure & Proof

**Visual system:** `docs/system/05-visual-design-system.md`

**Page architecture:** `docs/system/04-page-by-page-architecture-specifications.md`

**Brand asset:** `docs/brand/assets/blowin-smoke-logo.png`

**Implementation authorization:** Not granted

## 1. Authority, Purpose, and Boundary

This document translates the approved **Pressure & Proof** direction into concrete, visually testable page compositions. It governs page geometry, visual priority, responsive reflow, component placement, state expression, and provisional design-test values. It is not a mockup, component implementation, catalog, policy source, or authorization to build production software.

Normative authority resolves in this order:

1. `docs/constitution/01-brand-philosophy.md`;
2. `docs/system/01-master-design-commerce-system.md`;
3. `docs/system/02-information-architecture-page-system.md`;
4. `docs/system/03-data-model-catalog-schema.md`;
5. `docs/system/04-page-by-page-architecture-specifications.md`;
6. `docs/system/05-visual-design-system.md`.

The directly inspected logo is an 8000 × 4500 opaque RGBA raster on a padded white canvas. It may be used only in sufficiently spacious editorial contexts. It cannot supply a compact production mark, transparent master, exact production red, interface font, or universal component shape.

Research remains closed. Glossier contributes only the already approved discipline of hierarchy, whitespace, low chrome, stable grammar, progressive disclosure, synchronized state, functional motion, and accessible control. No Glossier palette, typography, proportion, layout, imagery, effect, or trade dress is transferred.

## 2. Provisional-Test Notation

> **P\*** means **PROVISIONAL — REQUIRES VISUAL, CONTENT, ACCESSIBILITY, AND DEVICE TESTING.**

Every proposed quantified design-test value—typeface candidate, size, line height, tracking, spacing, width, grid, radius, border, shadow, color, focus treatment, timing, distance, media ratio, safe area, or responsive column test—is prefixed **P\*** or explicitly classified as open/blocked. Fixed semantic sequences, governing hierarchy rules, the required representative-set count, the three governing divisions, and technically observed source-asset facts are not design-token claims. A **P\*** value is a high-fidelity test fixture, not a production token or approval.

- No font files were downloaded, added, committed, or redistributed.
- No product, price, inventory, proof, compatibility, fit, eligibility, policy, or operational fixture is real.
- No fixture can authorize purchase readiness or populate a catalog.
- No CSS, application code, framework syntax, or production breakpoint is defined.

## 3. Page-Family Inheritance

The representative set uses seven visual families. An adaptation may specialize facts, evidence, media jobs, and recovery, but cannot remove inherited hierarchy, blockers, state precedence, accessibility, or data gates.

| FAMILY | INHERITING SPECIFICATIONS | IMMUTABLE GRAMMAR | CONTROLLED EXTENSION |
|---|---|---|---|
| Global shell | Global Shell; surrounds every public page | House/division orientation, utility placement, layer behavior, focus return | Current division, scope, cart/search/account state |
| Home | Home | House frame, editorial-to-commerce rhythm, shared cards/actions | Highest approved Pressure expression and cross-house story |
| Division landing | Shared Composition → THCA; Vape & Nicotine; Glass & Accessories | Job-first sequence, category entrances, guidance, evidence cue, curation, support | Vocabulary, evidence model, imagery job, educational emphasis |
| Category | Shared Category tested with all three evidence-slot adaptations | Filter/sort/result grammar, card anatomy, result state and recovery | Role-critical filters/facts, proof/fit/eligibility summaries |
| Search | Search Results | Query interpretation, typed result grammar, state-preserving refinement | Division, entity, education, compatibility, replacement intent |
| PDP | Universal PDP → five requested domain adaptations | Identity, selection, composed states, derived action, evidence, lifecycle, support | Options, facts, proof/fit, media roles, contents and requirements |
| Cart | Shared Cart grammar → Quick Cart + Full Cart | Exact line identity, state anatomy, price/quantity grammar, recovery | Confirmation depth versus complete revalidation depth |

### 3.1 Universal purchase-readiness inheritance

Every consequential surface preserves this semantic evaluation order:

1. age qualification;
2. destination eligibility;
3. product-specific eligibility;
4. product and selected-variant availability;
5. required-option completeness;
6. compatibility;
7. required components;
8. material proof requirements;
9. price resolution;
10. purchase-method completeness;
11. CTA readiness.

The CTA label and enabled state are derived outputs. Wide layouts may make media visually adjacent to decision content, but visual adjacency never changes this semantic dependency order. State changes update exact identity, media, facts, proof/fit, price, availability, eligibility, requirements, URL where appropriate, and action readiness as one atomic customer-visible change.

## 4. Pressure & Proof Composition Model

Pressure and Proof are not equal visual themes. Pressure establishes memory and route confidence; Proof governs decisions.

| INTENSITY | PRIMARY SURFACES | PRESSURE ALLOWED | PROOF / PRECISION BEHAVIOR | ELEMENTS REMOVED |
|---|---|---|---|---|
| P4 — House signal | Home opening only | Full existing logo at legible editorial scale; one red field; short condensed display; authored crop | Plain three-division labels and direct routes interrupt the expression immediately | Multiple campaigns, badge stacks, ambient UI red, decorative smoke repetition |
| P3 — Division/editorial | Division openings and bounded curation | One pressure field or cropped-volume gesture; display headline; division-relevant imagery | Job/category labels and early risk cue use normal-width type and neutral surfaces | Repeated logo, full-field red after opening, simultaneous graphic motifs |
| P2 — Discovery | Category and selected search orientation | Restrained heading cadence, one small red orientation cue | Stable filters/cards, literal result states, comparison alignment | Editorial overlap, oversized display, decorative outline, nonfunctional motion |
| P1 — Product decision | Universal and specialized PDP identity | House voice through copy and type weight; red limited to context | Options, price, availability, eligibility, proof/fit, requirements, and CTA use quiet neutral structure | Pressure fields, cloud geometry, lifestyle-first media, campaign messaging |
| P0 — Evidence/transaction | Proof, compatibility, fit, quick cart, full cart, support | No decorative Pressure; brand remains identifiable through shared grammar | Text-first state anatomy, data alignment, state-specific color, source/scope/consequence/recovery | Brand red, display typography, decorative media, promotion before resolution, ambient motion |

The transition stays one brand because typography roles, spacing rhythm, alignment anchors, actions, focus, status anatomy, and language remain continuous while expressive layers are progressively removed.

## 5. Typography Test

### 5.1 Candidates considered

| DIRECTION | EDITORIAL ROLE | COMMERCE ROLE | STRENGTH | RISK | DISPOSITION |
|---|---|---|---|---|---|
| Archivo single-family system | Archivo candidate at condensed width/high weight for short display | Archivo candidate at normal width/upright for all reading, identity, label, and data roles | Strong one-house continuity; long-name and numeric testing occur within one voice | Actual variable axes, license, glyph coverage, and rendering are unverified | **SELECTED FOR PROVISIONAL PAGE TESTING** |
| Barlow Condensed + Source Sans 3 | Barlow Condensed candidate | Source Sans 3 candidate | Clear Pressure/Proof separation and readable commerce | More industrial; visible two-family seam; display moves closer to logo energy | Not selected |
| IBM Plex Sans Condensed + IBM Plex Sans | Plex Condensed candidate | Plex Sans candidate | Strong technical and numerical behavior | Institutional tone can weaken cultural confidence | Not selected |

### 5.2 Selected provisional direction

**P\* Archivo single-family test direction:** use a condensed high-weight instance only for short editorial display and a normal-width upright instance for headlines, product identity, body, labels, controls, and data. The difference between Pressure and Proof comes from width, weight, scale, and placement—not a logo imitation or a switch to a beauty/editorial font.

The direction remains conditional on verifying that an approved build and license provide the needed widths, weights, italics if used, apostrophe, degree, multiplication, currency, unit, Greek, and tabular-numeral glyphs. If the candidate fails, the role model remains and a replacement family must be tested; no font choice in this document is final.

### 5.3 Provisional type scale

| ROLE | P\* WIDE SIZE / LINE HEIGHT (DESIGN PX) | P\* NARROW SIZE / LINE HEIGHT (DESIGN PX) | P\* WEIGHT / WIDTH | USE LIMIT |
|---|---|---|---|---|
| Display XL | P\* 72 / 68 design px | P\* 44 / 44 design px | P\* 800; 75–80% width | Home only; approximately P\* 8–10 words maximum |
| Display L | P\* 56 / 56 | P\* 36 / 40 | P\* 800; 80–85% width | Division opening or rare editorial transition |
| H1 | P\* 40 / 46 | P\* 32 / 38 | P\* 700; normal width | Page identity |
| H2 | P\* 32 / 38 | P\* 28 / 34 | P\* 700 | Major module |
| H3 | P\* 24 / 30 | P\* 22 / 28 | P\* 650–700 | Submodule/decision group |
| Product identity | P\* 20 / 26 | P\* 18 / 24 | P\* 600 | Wrap; never critical truncation |
| Price/data emphasis | P\* 24 / 30 | P\* 22 / 28 | P\* 700; tabular numerals | Exact selected scope only |
| Body lead | P\* 18 / 28 | P\* 18 / 28 | P\* 400–500 | Short orientation or explanation |
| Body | P\* 16 / 24 | P\* 16 / 24 | P\* 400–500 | Default reading and controls |
| Compact body | P\* 14 / 20 | P\* 14 / 20 | P\* 400–500 | Cards/data; not long prose |
| Label | P\* 14 / 18 | P\* 14 / 18 | P\* 600 | Mixed case default; short uppercase only |
| Data/specification | P\* 14 / 20 | P\* 14 / 20 | P\* 500; tabular numerals | Values, units, comparisons |
| Microcopy minimum | P\* 13 / 18 | P\* 13 / 18 | P\* 400–500 | Help/captions only; never critical truth alone |
| Inputs | P\* 16 / 24 | P\* 16 / 24 | P\* 400–600 | Test against device/browser mobile auto-zoom behavior while preserving legibility |

**P\* tracking tests:** display P\* −0.01 to −0.02 em; headings P\* −0.01 em; body/data P\* 0; short labels P\* 0 to +0.02 em. Body reading measure is P\* 65–72 characters. Monospace is not the default technical aesthetic.

## 6. Provisional Design-Test Token Set

Every value in this section carries the **P\*** status defined in Section 2.

### 6.1 Spacing and control rhythm

| ROLE | P\* VALUES (DESIGN PX UNLESS NOTED) | TEST APPLICATION |
|---|---|---|
| Base ladder | P\* 0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 design px | All page families; no ungoverned one-off gaps |
| Intra-control | P\* 4 or 8 | Icon/label/value binding |
| Dependent facts | P\* 8 or 12 | Price/basis, state/consequence, label/value |
| Component | P\* 12 or 16 | Controls and compact card anatomy |
| Module | P\* 24 or 32 | Separate decisions within one region |
| Section | P\* 48 or 64 | Major commerce/education shifts |
| House/editorial | P\* 96 or 128 | Home/division opening only |
| Compact control | P\* 44 high | Dense filters or secondary utilities; still a P\* 44 × 44 minimum target |
| Standard control/input | P\* 48 high | Default actions, inputs, selectors |
| Prominent action | P\* 56 high | One primary editorial or purchase action when hierarchy needs it |
| Icon | P\* 20 or 24 optical box | Function first; label ambiguity separately |

Narrow compositions may step section spacing down once. They may not shrink readable type, state anatomy, or target size to preserve a desktop rhythm.

### 6.2 Content measures and grid

| ROLE | P\* VALUE (DESIGN PX UNLESS NOTED) | TEST RULE |
|---|---|---|
| House shell maximum | P\* 1440 design px | Header, Home, major editorial alignment |
| Commerce maximum | P\* 1280 | Categories, search, cards |
| Decision maximum | P\* 1200 | PDP opening and cart |
| Data maximum | P\* 1040 | Proof, fit, specifications, cart interventions |
| Reading maximum | P\* 720 or 65–72 characters | Guides, explanations, policies |
| Compact form/support | P\* 640 or 45–55 characters | Qualification, support, focused recovery |
| Wide grid | P\* 12 columns; 24 gutter; 64 edge | Test at P\* 1280 and 1440 canvases |
| Middle grid | P\* 8 columns; 20 gutter; 32 edge | Test at P\* 768 and 1024 canvases |
| Narrow grid | P\* 4 columns; 16 gutter; 16 edge | Test at P\* 320 and 390 canvases |
| Product grid | P\* 4 wide; 3 middle; 2 narrow; 1 when content fails | Column count yields to readable card/state width |

P\* 1440, 1024, 768, 390, and 320 are test canvases, not approved breakpoints. Reflow is triggered by content failure, zoom, and input needs; critical horizontal overflow is prohibited.

### 6.3 Radius, borders, and elevation

| ROLE | P\* VALUE (DESIGN PX UNLESS NOTED) | TEST RULE |
|---|---|---|
| Radius zero | P\* 0 | Witness/data rules and deliberate editorial edges |
| Control radius | P\* 4 | Buttons, fields, option cells |
| Surface/media radius | P\* 8 | Media wells and bounded utility surfaces |
| Overlay radius | P\* 12 | Drawers/dialogs only |
| Fully rounded | P\* full | Short binary/filter/status chips only; never panels/cards by default |
| Quiet divider | P\* 1 at P\* #DEDCD6 | Alignment and grouping |
| Standard/control border | P\* 1 at P\* #8C8880 | Input/control boundary |
| Strong/selected border | P\* 2 at P\* #272522 | Selected state; not focus |
| Semantic border | P\* 2 in applicable state color | State field edge plus text/icon label |
| Base elevation | P\* none | Page, cards, evidence panels |
| Sticky/utility elevation | P\* x 0; y 6; blur 18; spread 0; P\* #171717 at P\* 8% | Sticky shell/utility topology only |
| Drawer elevation | P\* x 0; y 16; blur 48; spread 0; P\* #171717 at P\* 18% | Quick cart/navigation/search layer |
| Dialog elevation | P\* x 0; y 24; blur 64; spread 0; P\* #171717 at P\* 22% | True bounded modal decision |

Cards do not receive a hover shadow. Elevation communicates layer topology only.

### 6.4 Brand and neutral color tests

| ROLE | P\* VALUE | PERMITTED TEST USE |
|---|---|---|
| Asset-observed red | P\* #ED2925 | Editorial field, non-text accent, or large-text test only; not approved production red |
| Canvas | P\* #FAFAF8 | Slightly warm page ground |
| Surface | P\* #FFFFFF | Product truth, controls, evidence |
| Subtle surface | P\* #F3F2EE | Section pacing/media well |
| Inverse surface | P\* #171717 | Rare house/editorial field or neutral primary action |
| Primary text | P\* #171717 | Core reading and identity |
| Secondary text | P\* #4D4A46 | Supporting explanation |
| Muted text | P\* #67635E | Noncritical metadata after contrast validation |
| Quiet border | P\* #DEDCD6 | Dividers |
| Standard border | P\* #8C8880 | Controls |
| Strong border | P\* #272522 | Selection/structural emphasis |

The observed P\* #ED2925 is not safe as a default normal-text field: white and near-black normal text do not provide sufficient test contrast. It may not become the universal CTA, link, error, restricted, or compatibility color. Near-black remains the default primary commerce action. No division accent is provisionally assigned.

### 6.5 Semantic color tests

Every semantic field also requires an explicit state label, non-color icon/pattern, subject/scope, consequence, and recovery. Color never carries meaning alone.

| STATE | P\* FOREGROUND | P\* BACKGROUND | P\* BORDER | DISTINCTION |
|---|---:|---:|---:|---|
| Success | P\* #14532D | P\* #EDF8F1 | P\* #2E7D4F | Completed action/result only |
| Compatible | P\* #0F5B4E | P\* #EAF8F5 | P\* #198A75 | Verified relationship; endpoints named |
| Conditional | P\* #704B00 | P\* #FFF7E0 | P\* #A66B00 | Relationship condition; endpoints and condition listed |
| Warning | P\* #704B00 | P\* #FFF7E0 | P\* #A66B00 | Consequential caution; affected subject and recovery listed |
| Incompatible | P\* #7A271A | P\* #FFF2EE | P\* #B5472E | Verified conflict and blocked consequence |
| Error | P\* #8E1B1B | P\* #FFF1F1 | P\* #B42318 | Failed operation/input, not product relationship |
| Restricted | P\* #5B2A86 | P\* #F7F1FC | P\* #7A42A8 | Eligibility decision, separate from error/stock |
| Unknown / unverified | P\* #374151 | P\* #F3F4F6 | P\* #667085 | No affirmative implication |
| Information | P\* #0B4F6C | P\* #ECF8FC | P\* #147D9A | Neutral explanatory status; no verification implication |
| Current proof | P\* #0B4F6C | P\* #ECF8FC | P\* #147D9A | Scoped current evidence with subject, source, and date |
| Loading / pending | P\* #374151 | P\* #F8FAFC | P\* #667085 | Operation/dependency named; prior valid state retained |
| Unavailable | P\* #4D4A46 | P\* #F3F2EE | P\* #8C8880 | Exact item/variant and availability consequence named |
| Changed / price changed | P\* #704B00 | P\* #FFF7E0 | P\* #A66B00 | Previous/current state and affected scope shown |

Shared P\* color primitives do not merge semantic aliases: Conditional requires relationship endpoints and conditions; Warning requires affected scope and caution; Information carries no verification implication; Current Proof requires evidence scope/source/date; Changed requires previous/current state; Loading/Pending names the operation; Unavailable names the exact item/variant. Stale proof uses Warning grammar. Missing or unmatched proof uses Unknown/Unverified grammar. Semantic hues remain open pending color-vision, forced-colors, monochrome, contextual contrast, and device testing.

### 6.6 Focus test

- Light surfaces: P\* 3 design px P\* #005FCC outer focus with P\* 2 design px surface separation.
- Inverse surfaces: P\* 3 design px P\* #78C8FF with P\* 2 design px dark separation.
- Brand/photo surfaces: P\* two-tone ring with a P\* 2 design px white inner edge adjacent to the field and a P\* 3 design px P\* #005FCC outer edge. Where an arbitrary image or red field defeats reliable local contrast, place the ring on a solid P\* Surface or P\* Inverse Surface local halo/backplate selected through contextual testing.
- Forced-colors environments use the system focus indication. Focus is never removed and never doubles as selected state.

### 6.7 Motion tests

| CATEGORY | P\* DURATION (MS) | P\* TRAVEL (DESIGN PX UNLESS NONE) | USE |
|---|---|---|---|
| Immediate/blocker | P\* 0–80 ms | P\* none | Critical truth, error, restriction, derived action change |
| Selection/state | P\* 120 ms | P\* 0–4 px | Options, filters, disclosure |
| Feedback | P\* 160 ms | P\* 0–4 px | Added, saved, completed, failed acknowledgment |
| Media | P\* 180 ms | P\* none or minimal crossfade | Customer-controlled gallery change |
| Topology | P\* 220 ms | P\* 8–16 px | Drawer, menu, search layer |
| Editorial | P\* maximum 320 ms | P\* maximum 24 px | One upstream transition only |

Reduced motion removes translation, scale, parallax, loops, and autoplay. It uses an instant state change or P\* no more than 80 ms opacity transition only when tolerated. Content, focus, status, and announcements remain identical.

### 6.8 Media-ratio tests

| ROLE | P\* RATIO | TEST CONDITION |
|---|---|---|
| Standard product-card well | P\* 4:5 | Default across divisions; contain exact subject |
| Compact result/cart thumbnail | P\* 1:1 | Identity only; configuration stays textual |
| PDP identity | P\* 4:5 default | Permit P\* 1:1 for square/package truth and P\* 2:3 for tall glass |
| Alternate/context view | P\* 3:2 or P\* 4:3 | Role-specific evidence |
| Macro/detail | P\* 1:1 | Material, connector, label, craft |
| Included contents | P\* 3:2 | Every object also named in text |
| Relationship/fit diagram | P\* 3:2 wide; P\* 1:1 narrow | Labeled endpoints and conditions |
| Editorial hero | P\* 16:9 wide; independently authored P\* 4:5 narrow | No blind crop |
| Product evidence safe area | P\* 8% test inset | Protect connector, joint, control, label, scale reference |

Native video ratio is preserved. Product evidence is contained rather than cropped when critical detail would be lost.

## 7. Shared High-Fidelity Component Contracts

### 7.1 Low-chrome product card

The test card uses the P\* 4:5 media well above an unboxed aligned content stack. It follows the approved eleven-slot semantic order: media; mixed-context division; material maker/brand; product identity; role; two or three facts; material proof/fit/eligibility state; price; at most one promotion; availability; truthful action. A P\* 1 quiet divider may separate rows; shadow and full-card border are absent.

Long identity wraps to multiple lines. Card rows align identity, fact, price, state, and action baselines within one result set without reserving wasteful blank space. Quick Add appears only when the exact state is fully resolved and explicitly authorized by the governed action policy; otherwise the action names the unresolved job.

### 7.2 Action geometry

Primary commerce action uses the P\* inverse surface, P\* surface text, P\* 48 or 56 height, P\* 4 radius, and content-fit width up to the decision-column width. Editorial action may use the P\* red field only after its text contrast and size pass testing. Secondary actions use a quiet border or text treatment; destructive and semantic actions never inherit brand red automatically.

One bounded decision region has one dominant action. Disabled or blocked styling includes a visible reason and recovery; it does not rely on opacity.

### 7.3 Option selectors and forms

Option groups use a visible legend, P\* 48 minimum-height cells, P\* 1 standard border, P\* 2 selected border, and P\* 12–16 internal spacing. Text names the value; a swatch/image is supporting. Default, hover, focus, selected, unavailable, incompatible, conditional, unknown, loading, and error remain distinct. Long labels wrap; they do not reduce text below the compact-body role.

### 7.4 Evidence and state panel

The shared panel is flat, divider-led, and uses P\* surface or subtle surface without general elevation. Anatomy is: state label/icon → subject and scope → consequence → conditions/missing input → evidence/source/date when applicable → recovery/action. Proof, compatibility, physical fit, eligibility, availability, error, and unknown keep separate names and semantics even if layout is shared.

### 7.5 Media and data relationship

Media may lead visual attention only when it answers identity, scale, connection, contents, assembly, material/craft, or variant questions. Structured text repeats every critical fact. Missing media preserves the exact identity and all decision truth; no neighboring product image is substituted.

### 7.6 Responsive and accessibility inheritance

Wide screens add adjacency. Narrow screens preserve one semantic reading/action column in this order: identity/current selection → consequential state → required choices → price/availability/fulfillment → material proof/fit/eligibility/contents/requirements → derived action → depth → editorial/promotion. Tables recompose into labeled records; filters become a controlled layer; no blocker becomes hover-only or horizontally unreachable.

Keyboard focus follows this reading order. Menus, search, drawers, and dialogs manage focus, make backgrounds inert when required, support Escape, and restore focus to the initiating control. Variant, price, state, result, and cart changes receive restrained announcements. Zoom/reflow, keyboard-only use, touch, screen readers, reduced motion, forced colors, and high contrast are mandatory test modes.

## 8. Synthetic Fixture Pack

> **Every record in this section is SYNTHETIC / NON-PRODUCTION.** Identifiers, options, facts, states, relationships, prices, evidence, and operational situations exist only to test layout and behavior. They must never enter a live catalog or be presented as factual.

### 8.1 Shared stress fixtures

| ID | SYNTHETIC / NON-PRODUCTION FIXTURE | DESIGN JOB |
|---|---|---|
| SYN-SHARED-LONG-IDENTITY | P\* 80–100-character mixed-case identity with apostrophe, model/version string, and maker label | Wrap product identity without truncating critical distinction |
| SYN-SHARED-LONG-OPTION | P\* 45–65-character option and conditional-state labels | Stress selector, card, cart, and narrow reflow |
| SYN-SHARED-MULTI-UNIT | Clearly prefixed test strings for weight, volume, resistance, power, angle, length, and count | Test numerals, symbols, unit binding, and comparisons without asserting product facts |
| SYN-SHARED-MISSING-MEDIA | Exact identity and complete textual facts with every media assignment absent | Prove imagery is not the sole truth carrier |
| SYN-SHARED-DENSE-DATA | P\* 18 label/value/source records with mixed short and long labels | Stress data panels, tables, wrapping, and reading order |
| SYN-SHARED-FOUR-STATES | P\* four simultaneous contributing states with one highest blocker | Preserve precedence without badge piles |

### 8.2 THCA fixtures

| ID | SYNTHETIC / NON-PRODUCTION STATE | REQUIRED VISUAL TEST |
|---|---|---|
| SYN-THCA-OPTIONS | Synthetic Strain A / Strain B and Quantity A / Quantity B as independent dimensions | Selection order, long labels, atomic variant update |
| SYN-THCA-COA-CURRENT | Synthetic document linked to exact synthetic product/variant/batch and marked Current | Scope, issuer/date placeholder, direct evidence route |
| SYN-THCA-COA-STALE | Same structural record marked Stale with synthetic review/date placeholder | Warning grammar; no current-proof implication |
| SYN-THCA-COA-MISSING | Expected proof absent | Unknown grammar, unsupported claim suppression, recovery |
| SYN-THCA-COA-UNMATCHED | Synthetic document exists but does not map to selected synthetic batch | Exact mismatch consequence; no substitution |
| SYN-THCA-RESTRICTED | Synthetic eligibility evaluation returns Restricted | Separate restriction from stock/error and derive blocked action |
| SYN-THCA-PRICE-CHANGE | Selecting Quantity B changes `[SYNTHETIC PRICE A]` to `[SYNTHETIC PRICE B]` | Announce price and basis change without numeric production price |

### 8.3 Vape & Nicotine fixtures

| ID | SYNTHETIC / NON-PRODUCTION STATE | REQUIRED VISUAL TEST |
|---|---|---|
| SYN-VAPE-KIT | Synthetic refillable kit with named Included Components A/B and Required External Component C | Included versus required, readiness, contents media/text |
| SYN-VAPE-COMPATIBLE | Synthetic Replacement R verified Compatible with Synthetic Platform P | Named endpoints, evidence placeholder, positive relation |
| SYN-VAPE-INCOMPATIBLE | Synthetic Replacement R verified Incompatible with Synthetic Platform Q | Conflict reason, blocked action, alternative/help route |
| SYN-VAPE-CONDITIONAL | Synthetic Replacement R Conditionally Compatible with Synthetic Platform P under Condition C | Condition hierarchy and acknowledgment/recovery |
| SYN-VAPE-UNKNOWN | Relationship between Synthetic Replacement U and Platform P is Unknown/Unverified | No green/positive inference; request smallest useful input/support |
| SYN-VAPE-SUCCESSOR | Synthetic exact replacement is Sold Out; Synthetic Successor S has a verified successor relation and disclosed difference placeholder | Separate exact replacement, successor, and merely similar inventory |

### 8.4 Glass & Accessories fixtures

| ID | SYNTHETIC / NON-PRODUCTION STATE | REQUIRED VISUAL TEST |
|---|---|---|
| SYN-GLASS-COMPLETE | Synthetic Complete Piece P with Verified Included Bowl B | Contents relationship, text/media agreement, exact variant scope |
| SYN-GLASS-NO-SCALE-MEDIA | Synthetic Complete Piece P has structured dimensions but Scale Media is missing | Text survives; missing-media state does not imply unknown dimensions |
| SYN-GLASS-WRONG-GENDER | Synthetic Component C and Piece P share `[NOMINAL SIZE N]` but have opposing incompatible gender/type | Prove nominal size alone cannot pass fit |
| SYN-GLASS-ADAPTER | Synthetic Component C is Conditionally Compatible only through Verified Adapter A | Intermediary, added condition, requirement/action hierarchy |
| SYN-GLASS-UNKNOWN-CLEARANCE | Size/gender/angle known; clearance remains Unknown | Incomplete geometry, support/measurement route, no fit claim |
| SYN-GLASS-FRAGILE-SUPPORT | Synthetic complete piece carries a fragile-item support state without invented policy terms | Operational-state placement and context handoff |

### 8.5 Cart fixtures

| ID | SYNTHETIC / NON-PRODUCTION STATE | REQUIRED VISUAL TEST |
|---|---|---|
| SYN-CART-PRICE-CHANGED | One exact synthetic line changes from `[PRICE A]` to `[PRICE B]` | Prior/current relationship, acknowledgment, recomputed summary placeholder |
| SYN-CART-UNAVAILABLE | Exact selected synthetic variant becomes unavailable | Preserve identity/facts; valid recovery only |
| SYN-CART-RESTRICTED | Exact line becomes Restricted | Order- and line-level blocker; no legal improvisation |
| SYN-CART-INCOMPATIBLE | Two synthetic lines have a verified incompatible relationship | Cross-line endpoints, reason, blocked progression |
| SYN-CART-UNKNOWN | Two synthetic lines have Unknown compatibility | No compatibility implication; warn/block/escalate by synthetic risk rule |
| SYN-CART-MISSING-REQUIRED | Synthetic Kit K lacks Verified Required Component C | Name requirement, verified route, no arbitrary cross-sell |
| SYN-CART-FAILED-ELIGIBILITY-CHECK | Synthetic eligibility evaluation service fails without returning an eligibility outcome | Keep Error separate from Restricted; preserve lines and qualified retry/support |
| SYN-CART-NOTIFY-ELIGIBLE | Synthetic exact unavailable line is structurally marked eligible for a notification action, with no invented channel or commitment | Test the distinct authorization state without promising notification behavior |

## 9. Design-Stress Protocol

Every relevant page specification is tested with the fixture pack in these conditions:

1. P\* 80–100-character product identity and P\* 45–65-character option labels;
2. multiple units/symbols and paired value/basis labels;
3. missing identity, scale, contents, or connection media as applicable;
4. dense specifications and P\* 18-record data group;
5. P\* four simultaneous contributing states with one highest blocker;
6. Unknown/Unverified, Not Supplied, Not Applicable, Stale, Conflicting, and Pending Verification kept distinct;
7. P\* 320 and 390 narrow canvases plus content-driven single-column reflow;
8. P\* 200% and 400% zoom/reflow without critical horizontal loss;
9. complete keyboard path, visible focus, Escape/return focus, and restrained live announcements;
10. reduced motion with identical outcomes;
11. high contrast, forced colors, monochrome, and color-independent state reading;
12. touch/coarse-pointer targets and long translated-equivalent label stress, even though production localization is open.

## 10. Cross-Page Consistency Contract

| JOB | RECOGNIZABLE ACROSS PAGES | ALLOWED CONTEXT CHANGE | NEVER CHANGES |
|---|---|---|---|
| Header/division orientation | Same shell anchors, three division names, search/account/cart utilities | Active division and compact/persistent state | One house; utility access; focus behavior |
| Product card | Same eleven-slot semantic grammar and low-chrome stack | Role-critical fact/evidence slots and media role | Identity, price/state/action recognition |
| Buttons/actions | Same primary/secondary/tertiary/state geometry | Label and enabled state derived from consequence | One dominant action; neutral commerce primary |
| Option selectors | Same legend, state, border, focus, and dependency grammar | Dimension/value and product-specific condition | Text labels; atomic selected-state update |
| Price | Same value/basis/current/changed structure | Variant, bundle, or approved method scope | No guessed zero/placeholder; source scope |
| Availability | Same explicit state/consequence position | Variant/fulfillment context | Separate from eligibility/fit |
| Proof | Same source/scope/status/date/recovery anatomy | COA, technical, maker, or measured evidence class | No generic verification badge |
| Compatibility | Same endpoints/state/conditions/evidence/recovery anatomy | Electronic object roles | Unknown never Compatible |
| Physical fit | Same relationship anatomy plus geometry | Physical attributes/intermediary/tolerance | Nominal size never sufficient by itself |
| Eligibility | Same scope/state/consequence/recovery grammar | Qualified rule inputs by product/destination | Separate from service error, stock, and proof |
| Unknown/unverified | Same neutral unresolved field and missing-input explanation | Affected datum or relationship | No affirmative styling or omission |
| Errors | Same error label, affected scope, retained state, retry/support | Local operation and recovery | No blame, shake, or destructive reset |
| Cart line | Same exact identity/options/quantity/price/state record | Division facts and cross-line relationships | No silent removal/replacement/reinterpretation |
| Support handoff | Same carried-context summary and consent boundary | Product/order/proof/fit intent | Customer does not restart; input is not catalog truth |
| Typography | Selected test family and role scale | Display width/weight upstream only | Quiet upright commerce reading |
| Spacing | P\* shared rhythm and density modes | Editorial versus comparison/evidence density | Dependencies stay tighter than separate decisions |
| Surfaces | Flat base/evidence; elevation only for topology | Upstream editorial field | Cards do not float; state is not decorative badge |
| Motion | Shared semantic categories | Media role and layer distance | Functional job, immediate blocker, reduced-motion equivalence |

## 11. Specification 1 — Global Shell / Header / Navigation

**Family role:** Root visual and interaction shell. Every public page inherits this specification; page families may change current scope but not shell grammar.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Keep the house and its three divisions continuously understandable while exposing search, account, and cart without turning the header into a promotion surface. The shell supplies calm orientation around pages of different intensity. |
| Pressure & Proof intensity | **P1 at rest; P0 inside an open utility layer.** The shell carries confidence through proportion and type, not persistent graphic volume. |
| Top-to-bottom composition | Focus-only skip link → governed announcement region when valid → primary header → three-division navigation → contextual breadcrumb when the page depth requires it → page content. An open mega-menu, search layer, navigation layer, or quick cart occupies a separate topology above content; it never inserts as an ambiguous page section. |
| Wide-screen composition | Within the P\* house shell maximum and P\* wide grid, reserve a left identity zone, a centered or optically balanced three-division navigation zone, and a right utility zone. Division names remain literal. Utilities use icon plus accessible name where recognition would otherwise be weak. Mega-menu groups align to the same page columns and expose customer jobs before deep taxonomy. |
| Narrow-screen composition | Preserve a visible house identity fallback, search, menu, and cart on one restrained control line. The three divisions move into the controlled navigation layer and appear before deeper links. Account may enter that layer if the control line cannot hold it without collision. The current division remains named outside or at the opening of the layer. |
| Semantic reading order | Skip link → announcement and dismissal → house/home link → division navigation → search → account → cart → Learn → Support → breadcrumb. Visual rearrangement must not cause a conflicting screen-reader or keyboard order. |
| Grid and alignment behavior | Header edges follow the P\* house shell; breadcrumb and layer contents align with the receiving page’s P\* commerce or decision measure. Utility labels and icons share one baseline. Open panels align their trigger edge or the full shell—not arbitrary viewport offsets. |
| Content-width behavior | The shell may span the viewport, but meaningful content stays within P\* 1440. Search results and menu lists use readable subcolumns, not a single full-width text measure. Long labels wrap or recompose; the shell never scales type down to force one line. |
| Typography roles | Temporary text identity uses the P\* H3 or product-identity role at normal width, not simulated logo lettering. Division navigation and utilities use P\* label/body roles. Layer headings use P\* H3; links remain quiet body/compact-body roles. Announcement text uses no role below the P\* microcopy minimum. |
| Spacing and density mode | P\* compact-to-standard control density. The header uses P\* component spacing; menu groups use P\* module spacing. Announcement and breadcrumb remain compact. Touch targets preserve the P\* minimum target even when visible icons are smaller. |
| Surface treatment | Canvas or surface background with a P\* quiet divider. Base header has no card, pill container, or decorative shadow. A sticky state may use only the P\* utility elevation to explain separation. Open layers use the applicable P\* drawer elevation and P\* overlay radius only at detached edges. |
| Color-role usage | Neutral canvas, primary text, and quiet borders dominate. P\* observed asset red may appear only as a small non-semantic house orientation cue after contrast testing. It does not indicate cart count, error, active navigation, focus, or restricted state. |
| Media treatment | The current full padded logo is not used inside the compact shell. Reserve the compact-mark position conceptually within the standard control-height band. Until an approved compact asset exists, use accessible live text “Blowin' Smoke” or an explicitly temporary image treatment that preserves the source rectangle without cropping, masking, or recoloring it. |
| Component anatomy | Skip link; announcement message/dismiss; identity slot; primary division links; current-state indicator; search trigger/field; account trigger; cart trigger with text-equivalent count/status; durable Learn and Support utilities; breadcrumb; mega-menu/navigation-layer groups; scrim; close control; service-error region. Only one modal layer owns focus at a time. |
| Primary and secondary action hierarchy | Page content—not the header—owns the page primary action. In the shell, division choice and search are primary navigation jobs; Home, Learn, Support, account, cart, and close are secondary utilities; announcement action must not outshout destination orientation. |
| Proof / compatibility / fit / eligibility treatment | The global shell does not make product-level claims. It may carry a factual cart-state summary or a current division/destination scope. Material proof, compatibility, physical fit, and eligibility resolve on the relevant discovery, PDP, or cart surface. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** core orientation is loading-free; an opened service layer may reserve geometry and name progress. **Error/Unavailable:** preserve operable Home, division, Learn, and Support links; localize the affected search/account/cart service state without disabling unrelated navigation. **Unknown:** show unresolved cart or account state literally. **Restricted:** do not turn the header into a legal banner unless an authoritative order-level state requires it. **Changed:** announce cart count/status or scope change without moving unrelated controls. Also preserve explicit open/closed/focus, scoped-search, authenticated/anonymous, cart-changed, and announcement-dismissed states. |
| Responsive reflow | Change from distributed navigation to a controlled layer when labels, zoom, or targets collide—not at a production breakpoint asserted here. Preserve identity, search, current division, and cart before lower-priority account shortcuts. Breadcrumb may wrap and horizontally recompose; it may not become an unlabeled ellipsis trail. |
| Keyboard and focus behavior | Skip link becomes visible on focus. All triggers use native keyboard activation and the P\* focus treatment. Menus/layers disclose programmatic state, place initial focus deliberately, support Escape, contain or manage focus when modal, and restore focus to the initiating control. Opening one layer closes or hands off from another predictably. |
| Reduced-motion behavior | Sticky transitions and layers use the reduced-motion rule: no translation/scale; immediate state or P\* ≤80 ms opacity if tolerated. Focus, open/closed state, count changes, and error announcements remain identical. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** shell stress record with three long division-adjacent navigation groups, an active announcement, an anonymous account state, a changed cart count, a failed search service, and the compact asset missing. |
| Real-data gate | Approved compact logo asset and usage rules; authoritative announcement source/expiry; actual taxonomy and route labels; account/cart state contracts; destination and age-session behavior; service-error copy; analytics/privacy decisions. |
| What must remain visually quiet | Sticky shell, breadcrumb, utility icons, cart count, layer dividers, account status, service feedback, and every state that surrounds product evidence. |
| What the page must not do | It must not fabricate a compact mark, place the padded logo in a tiny slot, hide the three divisions behind vague lifestyle labels, use red for every active state, autoplay promotion, trap or lose focus, or let a mega-menu become an unstructured catalog dump. |
| **WHERE PRESSURE APPEARS** | In the confidence of the house identity, direct three-division naming, compact typographic weight, and—only when spacious enough—a bounded editorial encounter with the existing full logo outside the persistent header. |
| **WHERE PROOF / PRECISION TAKES OVER** | At every utility, active state, layer, breadcrumb, and scope label. Literal names, predictable placement, focus, and state continuity replace graphic expression. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | The asset red field, display type, full logo, decorative shape, promotional image, and editorial motion disappear when search, account, cart, error, or restricted state becomes active. |

### 11.1 Compact asset production gate

The reserved header position requires an approved transparent or vector compact asset with tight bounds, small-size legibility, light/dark and one-color behavior, clear-space guidance, minimum-use guidance, authoritative color values, and accessible fallback rules. The current file supplies none of those. Live text is the governing temporary fallback; it is not a logo redesign.

## 12. Specification 2 — Home

**Inheritance:** Global Shell + Home family + shared cards/actions/evidence/state panels. Home may reach P4 but cannot change downstream component grammar.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Make the independent house memorable, orient customers to THCA, Vape & Nicotine, and Glass & Accessories, demonstrate judgment, and convert curiosity into a confident division or curated-product route without presenting a generic department-store wall. |
| Pressure & Proof intensity | **P4 opening → P3 orientation → P2 curation → P1/P0 trust and operations.** Home is the most expressive commerce page and the only commerce page permitted the full P4 opening. |
| Top-to-bottom composition | House signal/hero → three-division orientation → proof of independent judgment and standards → bounded curation with reason → Learn entry → trust/operations → About and Support routes. Current merchandising may occupy P\* one bounded module only after both division orientation and the judgment/standards module; it does not replace the stable sequence. |
| Wide-screen composition | Use the P\* wide grid. The opening may pair a large editorial field with a clear route block rather than covering text over uncertain media. The three division entrances occupy equal structural weight even if their imagery differs. Later modules alternate full/contained width sparingly, then settle into the P\* commerce and data measures as consequence rises. |
| Narrow-screen composition | Use an independently authored P\* 4:5 opening media treatment or a typography-first field; never blind-crop the wide hero. Place the house statement before three full-width division routes. Curation becomes a readable P\* one- or two-column flow based on card-content survival. Trust and support become labeled stacked records. |
| Semantic reading order | House identity → short value/challenge statement → plain three-division definitions → direct division routes → standards/judgment evidence → reasoned product curation → learning route → operational trust → About/Support. Media captions follow the content they qualify. |
| Grid and alignment behavior | Opening uses P\* house width; division routes and curation use the P\* commerce grid; trust uses the P\* data measure; prose uses the P\* reading measure. A small set of repeated left anchors creates discipline across changing section widths. No free-floating collage alignment. |
| Content-width behavior | Display copy is bounded to a readable editorial line length and its P\* word limit. Division definitions stay scannable. Product rows never stretch cards merely to fill the shell. Long house or support text enters the P\* reading measure. |
| Typography roles | One P\* Display XL moment; division labels use P\* H2/H3 at normal width; product identity remains the shared product role; standards and support use P\* body/data roles. Condensed display is absent from proof/state detail. |
| Spacing and density mode | Opening may use P\* house/editorial spacing. Division orientation uses P\* section spacing. Curation uses P\* module/component rhythm. Trust and operations compress to P\* data density. The rhythm visibly tightens as the page moves from story to consequence. |
| Surface treatment | Permit one bounded red or inverse editorial field at the opening. Division routes use flat media/surface compositions, not floating cards. Product cards stay unboxed. Standards/trust panels use white or subtle neutral surfaces with dividers and no elevation. |
| Color-role usage | P\* observed red is tested as an upstream non-semantic field only. Warm canvas and near-black establish the house. Division routes do not receive invented permanent colors. Commerce and state content use shared neutral and semantic roles. |
| Media treatment | Opening media must be independently art-directed for wide and narrow ratios and must remain replaceable until production assets exist. Division imagery explains category difference rather than borrowing competitor aesthetics. Curation uses exact product media only when real. Missing media falls back to a labeled neutral identity well, never an invented package or stock smoke image. |
| Component anatomy | House hero; concise statement; three division-route modules; standards/judgment module; reasoned curation header; shared product cards; Learn route; trust/operations records; About/Support routes. Every curated row states why it exists rather than relying on “trending” theater. |
| Primary and secondary action hierarchy | The three division routes are the primary navigational choices and should be comparably discoverable. A single contextual hero action may point to the division chooser, not bypass it. Product actions inherit card readiness. Learn, About, and Support are secondary but persistent. |
| Proof / compatibility / fit / eligibility treatment | Home explains that proof, compatibility, physical fit, and eligibility are resolved from verified product context; it does not display universal “verified” promises. Featured items surface only scoped material states supported by real data. Eligibility is not generalized from category or destination assumptions. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** preserve section labels and stable skeleton geometry without fake content. **Empty Curation/Error:** keep division routes and localize the empty/failed product module with valid recovery. **Missing Media:** preserve exact labels and product truth in a neutral media well. **Unavailable:** retain a featured item only if a valid state/recovery is useful; otherwise remove it without collapsing orientation. **Unknown:** label missing evidence. **Restricted:** suppress transactional implication and route to qualified context. **Stale Promotion/Changed:** expire or identify stale governed merchandising without moving stable division routes. |
| Responsive reflow | Editorial adjacency becomes semantic stacking; division routes preserve equal recognition; cards change P\* column count only when identity/state/action remain readable. Media uses authored narrow roles. The trust region becomes records rather than a squeezed multi-column strip. |
| Keyboard and focus behavior | Hero, division routes, product cards/actions, Learn, and support links follow page order. Whole-card click targets must not create nested-control conflicts. Carousels, if later authorized, require explicit controls, no focus theft, and a non-carousel alternative; the default specification is a static bounded row. |
| Reduced-motion behavior | No autoplay, parallax, looping smoke, or scroll-scrub. One optional upstream entrance may use the P\* editorial category; reduced motion renders it immediately. Card, state, and navigation behavior stays functional and uses shared reduced-motion rules. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** one missing opening image; three division definitions with uneven label lengths; P\* one four-card curated row containing long identity, unavailable, restricted, and unknown-proof states; one failed curation service; one expired promotion placeholder. |
| Real-data gate | Approved home message and voice; production editorial/section media with rights and crops; real category definitions; reasoned merchandising inputs; authoritative product states; actual trust/operational commitments; approved About/Support content. |
| What must remain visually quiet | Division explanations, curated-card facts, proof/eligibility summaries, operations, support, unavailable/unknown states, footer transition, and all recovery actions. |
| What the page must not do | It must not behave as a campaign carousel, repeat the full logo, invent urgency, imply a universal proof guarantee, turn every section red, make divisions into unlabeled images, copy beauty-retail composition, or let expressive media displace navigation and product truth. |
| **WHERE PRESSURE APPEARS** | In the single house opening, authored headline scale, one red/inverse field, the existing full logo only when spacious and legible, and the decisive challenge of the house voice. |
| **WHERE PROOF / PRECISION TAKES OVER** | At the three division definitions, standards explanation, every curated card, evidence cue, operational record, and support route. Alignment and literal labels become increasingly strict downstream. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Full-logo repetition, red fields, condensed display, editorial cropping, large empty scale, expressive motion, and campaign voice are removed before product state, trust, restriction, support, and footer operations. |

## 13. Specification 3 — Division Landing: Shared Composition

**Family role:** Governing composition inherited by all three division adaptations. Adaptations replace jobs, evidence, and media roles—not shell, card, action, or state grammar.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Explain what a division is, provide job-first and category-first entry, surface the most consequential wrong-purchase risks, demonstrate division-specific judgment, and offer bounded curation plus help. |
| Pressure & Proof intensity | **P3 opening → P2 routes/curation → P1 guidance → P0 evidence/help.** |
| Top-to-bottom composition | Division definition → customer-job entrances → durable category entrances → consequential decision guidance with a concise evidence/relationship cue → reasoned curation → full trust/proof and guided-relationship module → bounded current merchandising → education/support. This follows the stronger Master System sequence while retaining the Page Architecture requirement that material risk be visible before curation. |
| Wide-screen composition | Division identity may occupy a P\* house-width split or bounded field. Jobs and categories align to the P\* commerce grid; guidance uses a stable comparison band; evidence uses the P\* data measure; curation uses shared product rows; support/prose contracts to the P\* reading measure. |
| Narrow-screen composition | Identity stacks before jobs. Job routes precede the full category list. Consequential guidance becomes labeled records in decision order. Curation follows P\* one/two-column card viability. Evidence and help stay inline rather than opening hover-dependent side panels. |
| Semantic reading order | Division name/definition → who/what job routes serve → durable categories → wrong-purchase guidance and concise evidence cue → reasoned products → full trust/proof and guided relationship → current module → learning/support. Image order never precedes the label and consequence it illustrates. |
| Grid and alignment behavior | Shared P\* 12/8/4 grid behavior; the division heading, job-route labels, category labels, and curation title reuse stable anchors. Adaptations may change the number of route cells only if they preserve balanced reading and shared edge alignment. |
| Content-width behavior | Opening copy stays within the P\* editorial/reading measure; category and job labels wrap; guidance and evidence use P\* data/reading measures. Product rows use P\* commerce width. No adaptation expands technical tables across the house maximum merely to look substantial. |
| Typography roles | One P\* Display L or H1 opening; normal-width H2/H3 for jobs/categories; body lead for definition; label/data roles for guidance and evidence; shared product roles for cards. Technical vocabulary is never set in condensed display. |
| Spacing and density mode | P\* editorial spacing at opening; P\* section spacing between major routes; P\* module spacing inside guidance; P\* data density for evidence; P\* component rhythm for curation. Every adaptation preserves this contraction. |
| Surface treatment | One upstream pressure field or expressive media edge. Job/category modules are flat and divider-led. Guidance may use subtle neutral bands. Evidence is a flat surface with borders/dividers. Curation cards remain unboxed. No adaptation invents a different card material. |
| Color-role usage | Shared house neutrals. P\* observed red can orient the opening but is not a division code. Evidence uses semantic roles by state. No permanent THCA/Vape/Glass accent is assigned until brand and accessibility testing resolves it. |
| Media treatment | Opening media establishes division context; job media explains use or object role; guidance media explains a decision; curation media identifies exact products. Adaptations declare the visual job and required shot, never a competitor look. Missing images keep literal labels and decision routes intact. |
| Component anatomy | Division masthead; definition; job-route group; durable category group; decision-guidance records with concise evidence cue; reasoned-curation header and shared cards; full trust/proof and guided-relationship module; bounded current module; Learn and Support handoff. |
| Primary and secondary action hierarchy | Job routes are primary for customers who know the outcome but not taxonomy. Durable category routes are co-primary for informed customers. Curation actions inherit product state. Learn and Support are secondary recoveries, never hidden beneath promotion. |
| Proof / compatibility / fit / eligibility treatment | The shared slot names the division’s material decision system and its limits. It does not flatten COA status, electronic compatibility, physical fit, and eligibility into one badge. Each adaptation supplies a precise state grammar and takes unresolved customers to the smallest useful next input. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** keep definition/jobs/categories available if their source is stable. **Empty Category/Error:** retain division orientation, explain the affected route/result, and offer valid recovery. **Missing Media:** preserve route labels and decision content. **Unavailable:** show truthful product recovery without removing the category. **Unknown:** expose unresolved data in guidance/cards. **Restricted:** distinguish eligibility from availability. **Stale Promotion/Changed:** identify or expire the bounded module while stable routes retain position. |
| Responsive reflow | Split opening stacks; route grids reduce columns based on content; comparisons become labeled records; evidence tables recompose; cards preserve shared anatomy. Adaptations may reorder only optional editorial media, not jobs, risks, blockers, or help. |
| Keyboard and focus behavior | Route groups use links with descriptive names. Disclosure controls expose state and preserve focus. Filter-like job selectors, if used, must not masquerade as navigation. All states and help routes are reachable without hover; focus follows semantic sequence. |
| Reduced-motion behavior | Optional opening transition uses P\* editorial motion once. Route feedback uses selection motion; evidence/state changes are immediate. Reduced motion removes the opening transition and all media transforms. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** a shared landing rendered three times with unequal job/category counts, a missing hero asset, one failed curated row, one long guidance record, one unknown evidence state, and one restricted product summary. |
| Real-data gate | Authoritative division definitions/taxonomy; customer-job research; real decision risks; verified evidence vocabulary; product/card records; production media; merchandising rationale; approved educational and support routes. |
| What must remain visually quiet | Category labels, guidance facts, evidence scope, card state, Learn/Support routes, missing/unknown data, and bounded current merchandising. |
| What the page must not do | It must not create three independent mini-brands, use color as the only division distinction, present jargon before customer jobs, imply universal compatibility/fit/proof, let promotion precede foundational routes, or use curation without a stated reason. |
| **WHERE PRESSURE APPEARS** | In the division name, one authored opening composition, one confident headline, and a bounded transition into the division’s cultural/product world. |
| **WHERE PROOF / PRECISION TAKES OVER** | At job definitions, durable categories, consequential guidance, evidence scope, product cards, unknowns, and help. The type becomes normal width and the grid more regular. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Opening field color, condensed display, decorative crop, large graphic volume, and editorial motion disappear before guidance, evidence, product state, and support. |

## 14. Specification 4 — THCA Division Adaptation

**Inheritance:** Global Shell + Division Landing Shared Composition. This adaptation adds THCA-specific orientation, scoped proof, and eligibility behavior; it does not introduce a THCA-only shell or trade dress.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Help customers distinguish format, strain, quantity, and value decisions; show that proof and eligibility are exact-scope states; curate with stated judgment; and route uncertainty to education/support without making legal or product claims in the layout itself. |
| Pressure & Proof intensity | **P3 definition → P2 format/job routes → P1 product guidance → P0 proof and eligibility.** |
| Top-to-bottom composition | Factual THCA orientation → format/job routes → durable categories → strain/quantity/value guidance → concise proof and eligibility scope cue → reasoned curation → full proof-method and eligibility explanation → responsible education/support. |
| Wide-screen composition | Inherit the division split opening. Follow with a P\* commerce-grid route set. Use a P\* data-width guidance/evidence band that aligns strain, quantity, value basis, and proof vocabulary without presenting synthetic values. Curation returns to the shared grid. |
| Narrow-screen composition | Place factual orientation and route labels before media. Strain, quantity, and price-basis guidance stack as distinct records. Proof/eligibility status never collapses into an unlabeled icon. Curated cards reflow by content survival. |
| Semantic reading order | THCA definition → format/job choices → categories → strain and quantity concepts → value-basis concept → exact-scope proof/eligibility cue → curation → full evidence explanation → education/support. |
| Grid and alignment behavior | Use inherited P\* grids. Align guidance labels and values in a consistent data column; curation shares category-card anchors. Proof records use the same source/scope/status/consequence alignment as THCA PDP and cart summaries. |
| Content-width behavior | Factual definitions use P\* reading width. Route/card systems use P\* commerce width. Proof and eligibility records use P\* data width. Dense method explanation never shares a line measure with the expressive opening. |
| Typography roles | P\* Display L/H1 for division name; body lead for factual definition; H3/label for routes; data/spec roles for proof vocabulary and value basis; shared product/price roles in curation. No potency or legal term is enlarged as promotional theater. |
| Spacing and density mode | Inherit the shared contraction: editorial → route → guidance → data. Proof status and scope remain tightly bound with P\* dependent-fact spacing. Separate eligibility and proof records use P\* module spacing. |
| Surface treatment | One shared upstream pressure field; flat route modules; subtle guidance surface; evidence uses white/neutral semantic panels with dividers; cards remain unboxed. No leaf, smoke, laboratory, or certification motif is invented. |
| Color-role usage | House neutrals and semantic states only. P\* observed red stays upstream and non-semantic. Current, stale, missing/unmatched, restricted, and error use distinct tested semantic roles plus text and icon—not green/red shorthand alone. |
| Media treatment | Required production roles are format orientation, exact product identity, package/label truth where authoritative, and evidence-document access—not potency spectacle. Any lifestyle/editorial media stays upstream. Missing media cannot suppress strain, quantity, proof scope, or eligibility state. |
| Component anatomy | Shared division masthead/routes/categories; strain/quantity/value guidance records; scoped proof cue; eligibility cue; reasoned curation cards with THCA evidence slot; proof-method explanation; education and support handoff. |
| Primary and secondary action hierarchy | Format/job and category routes are primary. Curated-product actions are derived from exact product state. “How proof works” and “check what applies” are contextual secondary routes; neither is styled as proof that an item is eligible. |
| Proof / compatibility / fit / eligibility treatment | Proof is shown as exact subject/scope/status/source/date/consequence/recovery. Current, Stale, Missing, Not Supplied, and Unmatched remain distinct. Eligibility names evaluated scope and outcome, remains separate from stock/proof/service error, and never claims universal legality. Compatibility/physical fit are not fabricated when not applicable. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** stable routes remain; affected curation/proof shows scoped progress. **Error:** eligibility-service failure is not Restricted; proof-fetch failure is not Missing. **Unavailable:** retain exact product state/recovery. **Unknown:** missing/unmatched proof is explicit. **Restricted:** product/destination scope and consequence are named. **Changed:** price/proof/eligibility updates stay scoped and announced. |
| Responsive reflow | Shared division reflow plus proof records that become stacked label/value/source/consequence groups. Long strain/quantity labels wrap. No horizontal “lab table” is required to discover missing or stale status. |
| Keyboard and focus behavior | All routes and disclosures use inherited behavior. Proof links identify exact scope. Eligibility input/status transitions receive restrained announcements and return focus to the result or first affected field. No legal or proof explanation is hover-only. |
| Reduced-motion behavior | Shared reduced-motion rules. Proof, restriction, and price changes are immediate; no count-up, pulse, shimmer, or animated certificate behavior. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-THCA-OPTIONS, SYN-THCA-COA-CURRENT, SYN-THCA-COA-STALE, SYN-THCA-COA-MISSING, SYN-THCA-COA-UNMATCHED, SYN-THCA-RESTRICTED, and SYN-THCA-PRICE-CHANGE rendered across guidance and curation. |
| Real-data gate | Approved THCA taxonomy and customer guidance; authoritative strain/quantity/value data; exact proof-document scope and source; applicable product/variant/batch mapping; approved eligibility rules/service states; real products, prices, availability, media, education, and claims review. |
| What must remain visually quiet | Proof metadata, eligibility scope, price basis, warnings, evidence retrieval, education, restricted recovery, unknown states, and curated-card commerce anatomy. |
| What the page must not do | It must not invent potency or effects, use a generic “lab tested” badge, equate document existence with current matching proof, imply eligibility from geography alone, promote around a restriction, or adopt cannabis-category cliché imagery as identity. |
| **WHERE PRESSURE APPEARS** | In one division statement, decisive job-first framing, and bounded editorial media/field consistent with the shared house. |
| **WHERE PROOF / PRECISION TAKES OVER** | At format distinctions, strain/quantity/value guidance, every evidence scope, eligibility state, curated-product fact, unknown, and support path. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Red field, condensed display, editorial crop, graphic attitude, and optional promotion disappear before proof, eligibility, price basis, restriction, and support. |


## 15. Specification 5 — Vape & Nicotine Division Adaptation

**Inheritance:** Global Shell + Division Landing Shared Composition. This adaptation adds platform, lifecycle, replacement, and compatibility decision logic without borrowing a competitor implementation.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Let customers begin with an outcome, an owned device/platform, or a needed part; distinguish devices, disposables, consumables, and replacements; and prevent a legitimate but unusable purchase by making verified compatibility and required-component state visible. |
| Pressure & Proof intensity | **P3 definition → P2 job/lifecycle routes → P1 platform guidance → P0 compatibility and replacement evidence.** |
| Top-to-bottom composition | “I want / I own / I need” job routes → devices, disposables, consumables, and replacements → platform and lifecycle explanation → concise compatibility cue/resolver route → verified curation → full technical/compatibility explanation → replacement and support routes. |
| Wide-screen composition | Use the inherited opening, then a P\* commerce-width job matrix with plain-language outcomes paired to taxonomy. A P\* data-width platform/lifecycle band shows object roles and directional relationships. Curation uses shared cards; compatibility help occupies a quiet decision-width panel. |
| Narrow-screen composition | Job routes become the first stacked choices. The owned-device route stays visible before deep taxonomy. Platform relationships recompose from a horizontal concept into labeled records: device/platform → pod/tank/cartridge → coil/replacement → compatible consumable → accessory. |
| Semantic reading order | Division definition → customer job → product-role definitions → durable categories → platform/lifecycle relationship → compatibility decision cue → curation → full resolver/education → support. |
| Grid and alignment behavior | Shared P\* grids. Job-route labels, object-role labels, and curation anchors reuse house alignment. Technical records align subject, relationship, state, condition, and recovery. Directional diagrams have an equivalent text list in the same semantic position. |
| Content-width behavior | Plain-language orientation uses P\* reading width; jobs/categories/cards use P\* commerce width; platform and compatibility records use P\* data/decision width. Part numbers and long model names wrap without truncating the distinguishing suffix. |
| Typography roles | P\* Display L/H1 at opening; H3/body for job definitions; label/data roles for platform/model/part relationships and technical facts; shared product/price/action roles in curation. Device codes never use condensed display or low-contrast microcopy. |
| Spacing and density mode | Editorial opening contracts to P\* route spacing, then P\* data density for lifecycle and compatibility. Relationship endpoints and state stay within P\* dependent-fact spacing. Separate platforms or decisions receive P\* module separation. |
| Surface treatment | One upstream pressure field; job routes flat; lifecycle explanation on subtle neutral surface; compatibility results use semantic evidence panels; shared cards remain low-chrome. Connector/technology motifs, glowing frames, and gamer-style surfaces are not introduced. |
| Color-role usage | House neutrals. Brand red remains upstream and non-semantic. Compatible, Incompatible, Conditional, Universal, and Unknown/Unverified use their explicit semantic system with label/icon/text; availability and error keep different colors and names. |
| Media treatment | Production roles include object identity, connection/interface detail, included contents, assembly/setup, and model/part label. Images do not establish compatibility. Critical connectors and labels use contained P\* macro/detail roles. Missing media leaves technical facts and relationship states intact. |
| Component anatomy | Shared division masthead; outcome/ownership/need route group; role/category group; platform-lifecycle record or diagram plus text; compatibility cue/resolver entry; reasoned product cards with compatibility slot; replacement education; support handoff carrying owned-device context. |
| Primary and secondary action hierarchy | “I own this device” and “I need this part” are primary alongside general shopping jobs. Category routes serve informed customers. Product actions derive from exact state. Resolver and support are contextual recovery actions; optional accessories follow required components and blockers. |
| Proof / compatibility / fit / eligibility treatment | Compatibility names both endpoints, exact state, conditions, evidence/source, consequence, and recovery. Unknown is never positive. Universal is bounded to an explicit interface/domain. Required external components are separate from Included. Eligibility remains distinct and exact-scope. Physical fit is used only if authoritative geometry actually applies. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** retain role/category routes and identify the relationship being checked. **Error:** service failure is not Unknown compatibility. **Unavailable:** exact replacement remains named; successor appears only with a verified relation and differences. **Unknown:** request the smallest useful owned-device input. **Restricted:** separate eligibility from compatibility. **Changed:** platform/part/price/state updates are scoped and announced. |
| Responsive reflow | Job matrix stacks before product rows. Relationship diagrams become ordered text records. Long model names wrap; comparison facts become labeled records. Any sticky compatibility or action summary carries both endpoints and current blocker or is omitted. |
| Keyboard and focus behavior | Resolver inputs have visible labels and exact-result focus. Typeahead, if later authorized, does not steal focus and exposes loading/no-result/selected state. Relationship changes receive restrained announcements. Every diagram has keyboard-independent text equivalence. |
| Reduced-motion behavior | No rotating device, animated vapor, connector snap, or looping technical diagram. Relationship and blocker changes are immediate. Optional opening/media transition follows inherited reduced-motion behavior. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-VAPE-KIT, SYN-VAPE-COMPATIBLE, SYN-VAPE-INCOMPATIBLE, SYN-VAPE-CONDITIONAL, SYN-VAPE-UNKNOWN, and SYN-VAPE-SUCCESSOR, plus one long synthetic model/part name and missing connection media. |
| Real-data gate | Manufacturer/verified SKU platform, model, connector, component, contents, and requirements; bidirectional relationship evidence; successor relation and disclosed differences; actual availability/price/media; approved eligibility and support behavior. |
| What must remain visually quiet | Model/part strings, compatibility evidence, conditions, required-component explanations, availability, resolver input, technical education, and support handoff. |
| What the page must not do | It must not infer compatibility from title/image/category, treat brand similarity as fit, call an unverified alternative a successor, hide a required component, make “Universal” unbounded, imitate VaporDNA behavior, or turn the page into a glowing technology aesthetic. |
| **WHERE PRESSURE APPEARS** | In one division opening, direct job language, and confident customer-led framing that respects people who know either the outcome or the part—not necessarily the taxonomy. |
| **WHERE PROOF / PRECISION TAKES OVER** | At every object role, platform/model/part identifier, endpoint relationship, included/required distinction, availability state, resolver result, and support payload. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Red field, display width, editorial image treatment, decorative device motifs, large spacing, and optional merchandising disappear at compatibility, replacement, restriction, and support decisions. |

## 16. Specification 6 — Glass & Accessories Division Adaptation

**Inheritance:** Global Shell + Division Landing Shared Composition. This adaptation adds scale, physical geometry, contents, material, maker/provenance, care, and fragile-item states without claiming a competitor’s compatibility system.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Distinguish complete pieces from fitted parts, help customers reason about scale and connection geometry, expose included/required/replacement components, communicate material and provenance, and route fragile-item or unknown-fit situations without guessing. |
| Pressure & Proof intensity | **P3 object/craft opening → P2 ownership/job routes → P1 scale/material guidance → P0 physical fit and fragile support.** |
| Top-to-bottom composition | Complete-piece route → “I own a piece / need a part” route → care/tools route → durable categories → measurement and fit guidance → concise maker/provenance and evidence cue → reasoned curation → full care/fit/fragile support. |
| Wide-screen composition | The opening may pair one authored object/craft image with a factual definition. Job routes use the P\* commerce grid. Measurement/fit guidance occupies a P\* decision/data band with structured dimensions beside decision-oriented media. Curation uses shared cards with glass-specific fact and fit slots. |
| Narrow-screen composition | Complete versus fitted role appears before category imagery. Structured scale facts precede optional scale media. Geometry fields stack in decision order: source/target connection, size, gender/type, angle, applicable length/orientation/clearance/tolerance, intermediary, state. |
| Semantic reading order | Division definition → complete/owned-piece/care jobs → categories → scale and connection guidance → material/maker/provenance cue → curation → measurement/fit details → care and fragile support. |
| Grid and alignment behavior | Shared P\* grids. Object identity and factual measurement anchors remain stable across cards, PDP, and cart. Fit records align endpoints, attributes, state, conditions, evidence, and recovery. Scale media aligns with—not instead of—structured dimensions. |
| Content-width behavior | Definition/provenance uses P\* reading width; routes/cards use P\* commerce width; measurements and fit use P\* data/decision width. Long maker names and multi-unit dimensions wrap while preserving value/unit binding. |
| Typography roles | P\* Display L/H1 for the division; body lead for role distinction; H3/label for jobs/categories; data/spec roles with tabular numerals for dimensions; shared identity/price/action roles for products. Maker/provenance is factual body copy, not decorative script. |
| Spacing and density mode | Upstream editorial spacing contracts to route and then data density. Measurement label/value/unit/source stay tightly grouped; distinct connection decisions use P\* module spacing. Fragile/support content remains calm and readable. |
| Surface treatment | One upstream pressure/media composition; routes and cards are flat; measurement/fit panels use quiet dividers and subtle backgrounds; fragile support uses a bounded operational panel without marketing decoration or elevated-card stacks. |
| Color-role usage | House neutrals and shared semantic states. Brand red is not a fragile warning, fit state, material code, or division color. Compatible/Incompatible/Conditional/Unknown and operational error/support remain textually distinct and color-independent. |
| Media treatment | Production roles: identity, independently useful scale/reference, connection macro, included contents, assembly/relationship, material/craft, maker mark when authoritative, and care. Tall pieces may use P\* 2:3 PDP identity. Media never supplies the only measurement, angle, gender/type, or included-item truth. |
| Component anatomy | Shared masthead; complete/owned/care job routes; categories; measurement-help record; physical-fit cue; maker/provenance cue; reasoned cards with scale/material/fit slot; care education; fragile-item support handoff. |
| Primary and secondary action hierarchy | Complete-piece, owned-piece/part, and care routes are primary customer jobs. Product actions derive from exact fit/contents/availability. “Measure what I own” and support are contextual secondary/recovery actions. Optional accessories never precede required components. |
| Proof / compatibility / fit / eligibility treatment | Physical fit names endpoints; source/target size and gender/type; angle; applicable orientation, length, clearance, or tolerance; intermediary; state; conditions; evidence; consequence; recovery. Nominal size alone cannot establish compatibility. Maker/material/provenance requires source. Eligibility is separate and only shown when applicable. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** retain object-role/category guidance. **Error:** measurement or relationship-service failure is not Unknown fit. **Unavailable:** preserve exact component identity and only verified alternatives. **Unknown:** name missing attribute such as clearance. **Restricted:** use only authoritative eligibility scope. **Changed:** dimension/contents/fit/price changes are scoped and announced. Fragile support remains operational, not a product defect claim. |
| Responsive reflow | Decision media and structured facts stack with facts first when needed. Measurement tables become labeled records. Fit endpoint names remain visible in sticky summaries. Tall media never forces the action below excessive scrolling without a truthful inline summary. |
| Keyboard and focus behavior | Measurement inputs and selectors have visible units/labels. Fit-result focus moves only on explicit submission or controlled update and names both endpoints. Galleries and diagrams are keyboard operable and have textual equivalents. Support handoff preserves entered context with consent. |
| Reduced-motion behavior | No spinning product, smoke, liquid simulation, fragile shake, or animated connection. Customer-controlled gallery changes use shared media motion; reduced motion makes them immediate. Fit and support states update without translation. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-GLASS-COMPLETE, SYN-GLASS-NO-SCALE-MEDIA, SYN-GLASS-WRONG-GENDER, SYN-GLASS-ADAPTER, SYN-GLASS-UNKNOWN-CLEARANCE, and SYN-GLASS-FRAGILE-SUPPORT, with long maker and multi-unit stress strings. |
| Real-data gate | Maker/manufacturer documentation; verified SKU/package contents; physical receiving inspection; standardized measurement data/method/source; verified pair testing where needed; production scale/connection/contents media; real material/care/provenance; approved fragile-item support operations. |
| What must remain visually quiet | Dimensions, units, fit conditions, maker/source, included/required records, missing scale media, care, fragile support, and unknown geometry. |
| What the page must not do | It must not infer fit from a URL/title/image, use joint size alone, invent scale from photography, obscure gender/type or angle, confuse Included with Required, present provenance as decorative lore, imitate Smoke Cartel, or dramatize fragile support. |
| **WHERE PRESSURE APPEARS** | In one object/craft-focused opening, confident complete-versus-part framing, and a restrained authored material image. |
| **WHERE PROOF / PRECISION TAKES OVER** | At every dimension, unit, connection attribute, included/required relationship, maker source, fit state, condition, care fact, and support handoff. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Red field, condensed display, editorial crop, atmospheric photography, oversized whitespace, and expressive motion disappear before measurements, fit, required components, price, fragile state, and support. |

## 17. Specification 7 — Shared Category

**Family role:** One discovery grammar for all divisions. The representative composition must be stress-tested with THCA proof/eligibility, Vape compatibility/role, and Glass physical-fit/scale slots.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Define the product set, expose active scope and consequential constraints, enable filter/sort/compare, preserve role-critical facts on cards, and provide recovery or education when the set cannot safely answer the customer’s intent. |
| Pressure & Proof intensity | **P2 orientation → P1 discovery controls/cards → P0 constraints, unknowns, comparison, and recovery.** |
| Top-to-bottom composition | Category definition → active division/destination/ownership context and constraints → result count/state → filter and sort controls → product grid → optional bounded comparison → contextual education → guide/support recovery. Stable category meaning appears before current merchandising. |
| Wide-screen composition | P\* commerce maximum. A compact definition/context header spans the grid. Filters may use a persistent rail only when its width preserves P\* viable card columns; otherwise use a controlled layer. Sort/result count align above the grid. Education uses the P\* reading/data measure below results or at a relevant interruption. |
| Narrow-screen composition | Category definition and active constraints precede a compact filter/sort control row. Filters open in a focus-managed layer; applied filters remain summarized outside it. Cards use P\* two columns only while full identity/fact/state/action survive, otherwise P\* one. Comparison becomes selected-item records, not a clipped table. |
| Semantic reading order | Category name/definition → active scope/constraints → result status → filter → sort → results in visible order → comparison → education/recovery. A visual filter rail cannot precede the category meaning semantically. |
| Grid and alignment behavior | P\* commerce grid with card columns derived from minimum viable anatomy, not viewport convention. Card media, identity, facts, price, state, and action anchors align within the result set. Filter labels and result summaries share a consistent leading edge. |
| Content-width behavior | Definition uses P\* reading measure; controls/results use P\* commerce width; comparison uses P\* data width or responsive records. Active-filter labels wrap or summarize with accessible expansion; they never produce critical sideways scrolling. |
| Typography roles | H1 for category; body lead for definition; label/body for filters; compact body/product identity/price/data roles for cards; H2/H3 for education. No P\* Display XL/L. Product names wrap; critical differentiators are not ellipsized. |
| Spacing and density mode | P\* section spacing after definition; P\* component spacing around controls/cards; P\* dependent-fact spacing inside cards; P\* module spacing around comparison/education. Density remains consistent across all divisions. |
| Surface treatment | Canvas/surface base with quiet dividers. Filter controls have explicit boundaries, not pill overload. Product cards are unboxed and shadowless. Comparison/evidence uses flat data panels. Filter layer may use drawer elevation only to express topology. |
| Color-role usage | Neutral discovery surface. One small orientation cue may use P\* observed red; active filters use neutral selected geometry. Semantic colors belong only to named states. Division adaptation is conveyed through labels/facts, not three unrelated palettes. |
| Media treatment | P\* 4:5 standard card well, with object-containment exceptions governed by shared media tokens. Media identifies exact product/variant where available. Hover/focus may reveal an approved alternate identity view but never swaps to a different variant without a label. Missing media uses the shared exact-identity placeholder. |
| Component anatomy | Breadcrumb/context; category title/definition; scope and constraint summary; count/status; filter groups and applied-filter summary; sort; low-chrome card grid; pagination or approved result continuation; selected comparison; education/guide/support recovery. Card uses the eleven-slot grammar. |
| Primary and secondary action hierarchy | Opening a product is the default result action. Quick Add appears only when the exact state is fully resolved and explicitly authorized by the governed action policy. “Choose options,” “Check compatibility,” “Check fit,” “View proof,” or “See details” replaces it when resolution is required. Filter/apply/clear are secondary controls; Support is recovery. |
| Proof / compatibility / fit / eligibility treatment | THCA cards use exact scoped proof/eligibility summary; Vape cards use product role plus owned-platform compatibility when resolved; Glass cards use role/scale plus physical-fit state only with named context. Unknown is visible. Filters do not promise compatibility/fit unless backed by verified relationships and current context. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** preserve title/context/controls and stable result geometry; no fake values. **Error:** retain query/filter state and offer retry/support. **Unavailable:** card remains factual with valid recovery. **Unknown:** explicit evidence/fit state. **Restricted:** scope and consequence visible before action. **Changed:** announce result count/order and keep focus stable; stale filters are identified, not silently dropped. |
| Responsive reflow | Filter rail becomes a layer when results lose viable width. Result cards reduce columns based on content. Sort and count recompose without hiding constraints. Comparison becomes labeled records. Pagination/continuation remains keyboard and URL/state coherent; no infinite-scroll requirement is invented. |
| Keyboard and focus behavior | Filters use fieldset/legend or equivalent semantics; applied states are programmatic; opening/closing layers restores focus; result updates are announced without moving focus. Cards avoid nested ambiguous click targets. Comparison selection and removal are fully keyboard operable. |
| Reduced-motion behavior | Filter/result changes use immediate or P\* selection motion without spatial reshuffling animation. Hover alternate-media effect has focus/touch equivalence and disappears under reduced motion. Loading does not rely on looping shimmer. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** render one shared set with SYN-SHARED-LONG-IDENTITY, SYN-SHARED-FOUR-STATES, missing media, no results, and failed filtering; then swap the material card slot among SYN-THCA-COA-STALE, SYN-VAPE-UNKNOWN, and SYN-GLASS-WRONG-GENDER. |
| Real-data gate | Actual taxonomy and category definition; filter facets and value governance; destination/eligibility context; exact products/variants/facts/media/prices/states; verified proof/relationship data; merchandising/sort rules; result indexing and pagination policy; education/support routes. |
| What must remain visually quiet | Result count, filters, sort, card facts, price basis, availability, proof/fit/eligibility state, pagination, no-results recovery, and education. |
| What the page must not do | It must not use hover-only truth, hide applied constraints, silently broaden scope, style cards as floating ads, place promotion before category meaning, imply fit from a filter label, truncate differentiating names, or change component grammar by division. |
| **WHERE PRESSURE APPEARS** | In the concise category title, assertive section rhythm, and one restrained orientation cue—not in every card. |
| **WHERE PROOF / PRECISION TAKES OVER** | At active scope, filters, sort, card facts, material state, price, availability, comparison, result changes, and recovery. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Division-opening field, full logo, large condensed display, editorial overlap, decorative crops, ambient motion, and promotional color are absent from the result grid, states, comparison, and recovery. |

## 18. Specification 8 — Search Results

**Inheritance:** Global Shell + Search family + Shared Category controls/cards where the result type is product. Search adds interpretation, mixed entity types, ambiguity, and replacement/compatibility intent.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Show what the system understood, keep scope visible, separate result types, let customers refine without losing intent, and safely route owned-product, replacement, proof, education, and support queries when exact product results are insufficient. |
| Pressure & Proof intensity | **P2 query orientation → P1 typed discovery → P0 ambiguity, compatibility/replacement, errors, and recovery.** |
| Top-to-bottom composition | Interpreted query and scope → correction/ambiguity resolution if needed → result-type navigation and refinements → typed results → active constraints → compatibility/replacement mode where relevant → no-result/education/support recovery. |
| Wide-screen composition | P\* commerce maximum. Query identity and scoped search field align at top. Result-type navigation and filters share a stable control row/rail. Products use shared grid; categories, guides, proof records, and support use distinct labeled sections rather than one visual soup. Compatibility/replacement results use P\* data width. |
| Narrow-screen composition | Keep query, interpretation, and scope above filters. Result-type navigation becomes a wrap-safe control/list. Filters use the shared controlled layer. Mixed types remain visibly labeled. Owned-device/part context appears before compatibility-sensitive product results. |
| Semantic reading order | Search heading → exact submitted query → interpreted scope/correction → ambiguity choices → result-type summary → refinements → result groups and items → constraints → compatibility/replacement result → recovery/support. |
| Grid and alignment behavior | Search/control anchors align to P\* commerce grid. Product results use shared card geometry; non-product results use their own stable row anatomy. Mixed result types share left alignment but not misleading identical cards. Relationship results align endpoints, state, evidence, and action. |
| Content-width behavior | Search input/control may span a useful portion of the commerce width, but interpretation copy uses P\* reading width. Product grids use commerce width; guide/support and relationship results use reading/data measures. Long queries wrap in a heading-safe presentation and remain editable. |
| Typography roles | H1 for “Search” or results identity; H2/H3 for typed groups; body/label for interpretation and controls; shared product roles for products; data roles for part/model/relationship fields. Query text is emphasized without P\* Display XL/L. |
| Spacing and density mode | P\* component density around query/refinements; P\* module spacing between result types; shared card density; P\* data density for compatibility/replacement results; P\* section space before recovery/help. |
| Surface treatment | Neutral page, explicit input/control borders, quiet group dividers, unboxed product cards, flat typed-result rows, semantic relationship/evidence panels. Search suggestion or filter layers use elevation only for topology. |
| Color-role usage | Neutral controls/results. Brand red only as a small orientation cue if approved. Query correction is informational, not error by default. Ambiguous/Unknown, Restricted, Unavailable, Error, and relationship states use distinct named semantic roles. |
| Media treatment | Product results inherit card media. Category/guide results use optional role-specific media only if it clarifies type. Compatibility and replacement records prioritize identifiers and relationship text over imagery. Missing media never removes a result or substitutes a neighboring product. |
| Component anatomy | Search heading/field; submitted query; scope selector/label; interpretation/correction; ambiguity choices; type tabs/links with counts; filters/sort; typed product/category/guide/proof/support result anatomies; compatibility/replacement context; no-result recovery; support handoff. |
| Primary and secondary action hierarchy | Primary action depends on intent: open exact product/category/guide, resolve ambiguity, or identify owned device/part. Quick Add follows category rules only. Refinement, correction, and scope are secondary controls. Support is the final recovery carrying the query and selections. |
| Proof / compatibility / fit / eligibility treatment | Search never produces affirmative material states from text similarity. Compatibility/fit requires identified endpoints and verified relationship data; ambiguous identity blocks the claim. Proof results name subject/scope/status. Eligibility stays scoped and cannot be silently broadened when the query broadens. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** preserve query/scope and label the group updating. **Error:** retain input/refinements and offer retry. **Unavailable:** exact result remains labeled with valid recovery. **Unknown:** identity or relationship ambiguity is explicit. **Restricted:** exact scope/consequence appears before action. **Changed:** announce counts/group changes and retain focus; spell correction never silently replaces intent. |
| Responsive reflow | Type groups stack in semantic order; filters layer; product cards follow shared viability; relationship tables become labeled records. The search field and submitted query remain visible enough to edit. Long result-type labels wrap rather than become icon-only. |
| Keyboard and focus behavior | Search suggestions, if used, follow combobox semantics and do not capture input unexpectedly. Submitting moves focus to a results heading/status by deliberate rule. Filter updates preserve focus. Ambiguity choices, result types, and recovery are keyboard reachable; changes use restrained live announcements. |
| Reduced-motion behavior | Suggestion, filter, and result updates use immediate or P\* selection/topology behavior. No animated reordering or scrolling to “best” result. Reduced motion removes layer travel and alternate-media transforms while preserving announcements. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** long ambiguous query; misspelled query with suggested correction; mixed product/category/guide/support results; zero results; search-service error; unavailable exact replacement; SYN-VAPE-UNKNOWN; SYN-GLASS-UNKNOWN-CLEARANCE; restricted synthetic product. |
| Real-data gate | Search index/entity types; query and synonym governance; scope rules; exact taxonomy/catalog/proof/relationship data; eligibility boundaries; correction and ranking policy; typed-result URLs; analytics/privacy; no-result and support workflows. |
| What must remain visually quiet | Query interpretation, corrections, counts, filters, type labels, product facts, relationship evidence, unknown/ambiguous state, no-result explanation, and support transfer. |
| What the page must not do | It must not silently rewrite the query, blend types without labels, imply compatibility from keyword match, broaden division/eligibility scope without notice, steal focus on update, bury zero-result recovery under promotion, or style sponsored/current merchandising as an organic exact result. |
| **WHERE PRESSURE APPEARS** | In the direct query heading, confident scope naming, and restrained house rhythm; search receives no campaign-scale art direction. |
| **WHERE PROOF / PRECISION TAKES OVER** | At interpretation, typed groups, identifiers, filters, relationship endpoints, result states, constraints, and recovery. Precision begins before the first result. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Full logo, red field, condensed display, editorial media, decorative result cards, hover theatrics, promotional interleaving, and ambient motion disappear around ambiguity, relationship claims, errors, and support. |

## 19. Specification 9 — Universal PDP Shell

**Family role:** Governing product-decision shell. All specialized PDPs inherit the same selection, state composition, action derivation, accessibility, and lifecycle grammar.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Let a customer identify the exact product and selected state, understand the facts and consequences needed for a correct purchase, resolve configuration and material blockers, inspect decision media/evidence, and take a truthful derived action. |
| Pressure & Proof intensity | **P1 identity and house voice → P0 configuration, evidence, state, action, and lifecycle.** A PDP is a decision surface, not a campaign surface. |
| Top-to-bottom composition | Orientation/breadcrumb → exact identity → essential facts → required configuration in dependency order → price and basis → availability/fulfillment consequence → eligibility → material proof/compatibility/fit/requirements → derived action → decision media/detail → specifications and included/required contents → education → reviews when governed → verified relationships/replacements → policy/support. |
| Wide-screen composition | Within the P\* decision maximum, use a media region adjacent to a purchase-readiness region. The visual split may be asymmetric by product-media role, but the semantic document order preserves identity and action dependencies. The decision region remains readable without sticky duplication. Below the fold, P\* data and reading measures align evidence, specifications, education, and support. |
| Narrow-screen composition | One primary reading/action column: identity/current selection → highest blocker → required choices → price/availability → material evidence/requirements → derived action → decision media and depth. A compact identity image may precede configuration only if it does not push material blockers out of context. Sticky action is allowed only when it carries exact selection, price/state, and blocker truth; otherwise omit it. |
| Semantic reading order | Breadcrumb/orientation → product/maker identity → selected variant and essential facts → required options → price/basis → availability → eligibility → proof/compatibility/fit/requirements → action readiness and action → gallery/media detail → specifications/contents → education/reviews/relationships/support. Visual media adjacency never changes this order. |
| Grid and alignment behavior | P\* decision grid for opening; P\* data grid for evidence/specifications; P\* reading measure for education/support. Identity, selected state, price, availability, blocker, and action share one decision-column anchor. Label/value records align within groups but recompose without critical horizontal scrolling. |
| Content-width behavior | Decision copy uses a bounded column that supports long product names and option labels. Media cannot consume width that makes state/action illegible. Data panels cap at P\* 1040; prose caps at P\* reading measure. Full-width bands are reserved for genuinely comparative media or records, not decoration. |
| Typography roles | H1 or product-decision identity role for exact product; compact maker/material context; P\* price/data emphasis; H3 for decision groups; label/data for options, states, specifications, and sources; body for consequence/recovery. Condensed display is absent from configuration, evidence, and CTA. |
| Spacing and density mode | P\* dependent-fact spacing binds identity/variant, price/basis, state/consequence, and requirement/recovery. Required option groups use P\* component/module rhythm. Distinct decisions use P\* module spacing. Evidence/data is dense but not compressed below legibility. |
| Surface treatment | Flat canvas/surface. Media well may use P\* subtle surface and media radius. Purchase region is not a floating card. Option cells have explicit borders. Evidence/state panels are divider-led. Elevation is reserved for gallery layer, selector layer, or sticky topology—not product importance. |
| Color-role usage | Near-black neutral primary action and shared neutrals. P\* observed red may provide a minute house cue but is removed from decision states. Proof, compatibility, fit, eligibility, error, restricted, unknown, warning, and success use named semantic roles with color-independent anatomy. |
| Media treatment | Exact identity, selected-variant, scale, connection, contents, and material media have declared jobs. Default P\* 4:5 PDP identity with governed P\* 1:1 or P\* 2:3 exceptions. Gallery controls name view roles. Missing media retains a neutral identity well and all textual facts. Images never establish package contents, proof, compatibility, fit, or eligibility by themselves. |
| Component anatomy | Breadcrumb; maker/material context; exact identity; selected-state summary; essential facts; option groups; price/value basis; availability/fulfillment; eligibility; composed state summary; material evidence/relationship panel; included/required contents; quantity/purchase method when approved; derived CTA; gallery; specifications; education; reviews; verified relationships; lifecycle/replacement; policy/support. |
| Primary and secondary action hierarchy | One primary CTA is derived from readiness, with a truthful state-specific label. Secondary actions resolve the next blocker, view material evidence, identify owned context, measure/check, save, or contact support. Optional recommendation and promotion follow blockers, requirements, price, and action. |
| Proof / compatibility / fit / eligibility treatment | The universal slot uses state → named subject/scope/endpoints → consequence → conditions/missing input → evidence/source/date → recovery. Specialized PDPs choose only applicable systems. Unknown is not affirmative; Not Applicable is not Unknown; service Error is not an evidence or relationship state. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** preserve identity/selection and identify the dependency updating. **Error:** localize failed operation and retain valid selections. **Unavailable:** exact variant remains named with valid recovery. **Unknown:** name unresolved fact/relationship and suppress unsupported action. **Restricted:** exact scope/consequence and recovery. **Changed:** atomically update identity, media, facts, evidence, price, availability, eligibility, requirements, URL where appropriate, and CTA; announce material changes. |
| Responsive reflow | Adjacency becomes dependency-preserving stacking. Gallery thumbnails become labeled controls without horizontal traps. Option grids become wrap-safe cells or labeled selects by content. Data tables become records. Sticky action cannot hide focused controls, errors, or mobile browser/assistive UI. |
| Keyboard and focus behavior | Gallery, options, quantity, disclosures, action, and evidence links follow semantic order. Option groups expose legend/current/unavailable/condition/error. State changes are announced without resetting focus. Failed Add localizes focus/error summary. Dialogs/layers manage focus and restore it. |
| Reduced-motion behavior | Variant and blocker changes are immediate or P\* selection motion; gallery uses customer-controlled P\* media behavior. No autoplay, product spin, parallax, zoom-on-hover dependency, CTA pulse, or animated price count. Reduced motion preserves every state and announcement. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-SHARED-LONG-IDENTITY, SYN-SHARED-LONG-OPTION, SYN-SHARED-MULTI-UNIT, SYN-SHARED-MISSING-MEDIA, SYN-SHARED-DENSE-DATA, and SYN-SHARED-FOUR-STATES; stress Selection Required, Restricted, Sold Out, Unknown Fit, Missing Component, Price Changed, and Failed Add. |
| Real-data gate | Exact product/variant model; option dependencies; product facts and sources; price/basis; inventory/fulfillment; eligibility; applicable evidence/relationship records; contents/requirements; media assignments; CTA and purchase-method policy; lifecycle/reviews/support operations. |
| What must remain visually quiet | Product identity detail, every option, price basis, availability, evidence source/scope/date, compatibility/fit conditions, eligibility, included/required contents, specifications, errors, and support. |
| What the page must not do | It must not lead with campaign copy over identity, make media the only truth source, enable an unresolved CTA, conflate state systems, hide blockers in accordions, infer Included from imagery, promote before requirements, use sticky action without context, or let reviews outrank product truth. |
| **WHERE PRESSURE APPEARS** | In the concise product identity voice, confident type weight, exact crop discipline, and a small inherited house cue—never a full campaign treatment. |
| **WHERE PROOF / PRECISION TAKES OVER** | Immediately after identity: selected configuration, price, availability, eligibility, evidence/relationship, requirements, derived action, media roles, specifications, and support. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Red field, full logo, condensed display, oversized headline, editorial overlap, atmospheric image, decorative card surface, ambient motion, and promotion are removed before configuration and remain absent through transaction. |

### 19.1 Universal composed-state rule

A product may hold multiple simultaneous states. The opening displays the highest-priority blocker with its direct recovery, then preserves contributing warnings/information in the same decision region. It never collapses different states into a badge count. The governing readiness evaluation remains: age → destination → product eligibility → availability → options → compatibility → required components → material proof → price → purchase method → CTA.

## 20. Specification 10 — THCA PDP

**Inheritance:** Universal PDP Shell. This adaptation specializes format, strain, quantity, composition/potency only when authoritative, scoped COA/evidence, and eligibility. Universal purchase readiness and state separation remain unchanged.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Resolve the exact THCA product/variant/batch context, let customers choose strain and quantity without losing price/proof scope, expose current or unresolved evidence and eligibility, and present only supported composition/product truth before a derived action. |
| Pressure & Proof intensity | **P1 exact identity → P0 options, scoped evidence, eligibility, price, and action.** |
| Top-to-bottom composition | Breadcrumb/orientation → exact product and format → selected strain/quantity → authoritative composition/potency facts where applicable → required options → price and basis → availability → eligibility → product/variant/batch proof state → included/required information → derived action → identity/label media → full COA/source/method records → specifications/education/support. |
| Wide-screen composition | Use universal media/decision adjacency. Decision column binds strain, quantity, price basis, eligibility, and proof state. A proof summary stays before action when material; the full document/method panel follows in the P\* data measure. Media may show exact label/package only when mapped to the selected state. |
| Narrow-screen composition | Exact format and selected strain/quantity appear before price. Highest restriction/proof blocker appears before action. Options stack in dependency order. Proof scope/status/source/date/recovery becomes a readable record before any sticky action. Full method details follow decision media. |
| Semantic reading order | Exact identity/format → selected strain → selected quantity → applicable composition/potency truth → options → price/basis → stock → eligibility → exact proof state/scope → contents/requirements → derived action → media → full evidence/method → education/support. |
| Grid and alignment behavior | Universal P\* decision grid. Strain and quantity groups share a common label/choice anchor but remain distinct dimensions. Price/basis and COA subject/scope/status align as dependent records. Full analyte/method data, if real and authorized, uses P\* data grid and responsive records. |
| Content-width behavior | Long strain/format/quantity labels wrap in the decision column. Evidence summaries use the full decision-column width; full records cap at P\* data measure. Education stays at P\* reading measure. No dense evidence is squeezed beside media solely to maintain a desktop split. |
| Typography roles | Universal identity roles; H3/label for strain and quantity; P\* price/data emphasis; data roles for composition, proof scope, issuer/date, and method; body for consequence/recovery. Potency is not automatically the largest type after price. |
| Spacing and density mode | P\* dependent-fact spacing binds selected option to affected price/proof. Distinct option dimensions use P\* module spacing. Proof summary stays compact; full evidence uses dense P\* data rhythm with strong section labels. |
| Surface treatment | Universal flat decision surface. Option cells use control borders. Proof and eligibility use separate semantic panels. Document access is a normal action/link, not a glossy certification tile. No leaf, smoke, lab-glow, or seal graphics. |
| Color-role usage | House neutrals; neutral primary CTA. Current proof uses information/current role, stale uses conditional, missing/unmatched uses Unknown, restriction uses Restricted, and service failure uses Error. All include text and scope; brand red is absent from these meanings. |
| Media treatment | Exact product, selected variant/label, package/contents, and authorized scale/context roles. COA access is a document record, not a fabricated certificate image. A variant change updates media atomically when assignments exist. Missing media never changes proof, composition, quantity, or eligibility truth. |
| Component anatomy | Universal identity/purchase structure; format; strain and quantity selectors; composition/product-fact group; price/basis; availability; eligibility panel; COA/proof summary; included/required record; derived CTA; selected media gallery; full evidence record/document action; methods/specifications; education/support. |
| Primary and secondary action hierarchy | Derived purchase CTA follows option, price, stock, eligibility, and material proof readiness. Secondary actions resolve selection, inspect exact COA, understand basis/method, or contact support. A proof action is not styled as “approved to buy.” |
| Proof / compatibility / fit / eligibility treatment | COA/evidence names exact product, variant, and batch scope where applicable, state, source/issuer, relevant date, consequence, and recovery. Current, Stale, Missing, Not Supplied, and Unmatched are distinct. Eligibility names evaluated inputs/outcome. Compatibility/physical fit show Not Applicable only when governed; they are not omitted ambiguously. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** exact prior selection remains while the named price/proof/eligibility dependency updates. **Error:** proof fetch and eligibility service errors remain operational. **Unavailable:** selected variant stays named. **Unknown:** missing/unmatched proof suppresses unsupported claims. **Restricted:** blocks applicable action with scope/recovery. **Changed:** strain/quantity change atomically updates variant, media, facts, price, stock, proof mapping, eligibility, URL, and CTA. |
| Responsive reflow | Decision dependencies stack before gallery depth. Evidence tables recompose as labeled analyte/method records. Long option labels stay legible. Any sticky summary contains exact strain, quantity, current price/basis, and blocker; otherwise it is omitted. |
| Keyboard and focus behavior | Strain and quantity are separate labeled groups; changing either announces exact selected state and material price/proof changes. COA action names scope. Restricted/error summary links to the affected decision. Focus is preserved on selection and returned from document/dialog layers. |
| Reduced-motion behavior | Options, proof, price, and restriction update immediately without number animation, badge pulse, or certificate reveal. Gallery follows universal customer-controlled behavior. Reduced motion removes crossfade/translation while keeping live state text. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** all seven SYN-THCA fixtures plus SYN-SHARED-LONG-IDENTITY, SYN-SHARED-LONG-OPTION, missing media, P\* four concurrent states, failed Add, and narrow/zoom stress. |
| Real-data gate | Real product/variant/batch identifiers; authoritative format/strain/quantity/composition data; actual prices/basis/inventory; exact COA documents and mappings; issuer/dates/methods; approved eligibility rules/service; claims review; production media; contents and support. |
| What must remain visually quiet | Composition facts, price basis, COA scope/source/date, stale/missing/unmatched state, eligibility, option dependencies, warnings, methods, and support. |
| What the page must not do | It must not invent effects/potency, use a universal “lab tested” badge, show a COA from another scope as matching, equate stale with current, treat service error as Restricted, use color alone, imply legality, or allow marketing media to outrank evidence. |
| **WHERE PRESSURE APPEARS** | In exact product naming, confident format identification, and one disciplined identity image—not in potency theater. |
| **WHERE PROOF / PRECISION TAKES OVER** | At strain, quantity, composition, price basis, availability, eligibility, exact COA scope/status/source/date, action readiness, methods, and support. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Condensed display, asset red, lifestyle framing, atmospheric crop, campaign copy, decorative badge/seal, animated numbers, and optional promotion are absent from the entire purchase/evidence region. |

## 21. Specification 11 — Refillable Device / Kit PDP

**Inheritance:** Universal PDP Shell. This adaptation specializes platform identity, configuration, included versus required components, operating constraints, compatibility, setup, and replenishment relationships.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Make the exact platform/model/configuration and package contents unmistakable, identify anything additionally required, expose material operating and compatibility constraints, and connect the purchase to setup and verified replacement lifecycle. |
| Pressure & Proof intensity | **P1 platform identity → P0 contents, requirements, technical constraints, compatibility, and action.** |
| Top-to-bottom composition | Platform/maker orientation → exact device/kit identity and selected configuration → Included versus Required External components → essential technical/operating constraints → verified compatibility summary → options → price/availability/eligibility → composed requirements/blocker state → derived action → identity/contents/connection media → setup/specifications → verified compatible replacements/consumables → support. |
| Wide-screen composition | Universal media/decision adjacency. Decision region gives Included/Required and compatibility equal structural visibility with price and stock before action. A contained contents view can align to the media region while the complete textual list stays in the decision region. Replacements use P\* data/commerce width below. |
| Narrow-screen composition | Platform/model/configuration first; Included and Required records before action; technical constraints and compatibility summary remain inline. Contents media follows textual contents. Verified replacements become labeled rows/cards after setup and cannot interrupt a blocker. |
| Semantic reading order | Platform/model identity → selected configuration → Included → Required External → operating constraints → compatibility → options → price → availability → eligibility → composed state → action → media → setup/specifications → verified replacements → support. |
| Grid and alignment behavior | Universal P\* decision grid. Included and Required use parallel but explicitly titled columns/records. Model/part identifiers align with compatibility endpoints. Technical label/value/unit records use P\* data grid. Replacement cards inherit shared product-card anchors. |
| Content-width behavior | Long platform/model/option labels wrap. Contents and requirement names use the full decision-column width. Technical data caps at P\* data measure. Setup prose uses P\* reading measure. Replacement grids never compress exact part identity to preserve a row count. |
| Typography roles | Product/H1 identity; maker/platform compact context; H3 for configuration, Included, Required, and compatibility; data roles for technical constraints/model strings; P\* price emphasis; body for condition/consequence. No code or required component is microcopy. |
| Spacing and density mode | P\* dependent-fact spacing within exact identity, Included/Required items, and relationship states. Separate configuration/contents/constraints/compatibility use P\* module spacing. Technical data is compact with dividers; setup is relaxed reading rhythm. |
| Surface treatment | Universal flat decision surface. Included/Required use quiet parallel panels or divided records, not green/red cards. Compatibility uses semantic panel. Media wells are neutral. Verified replacement cards remain unboxed. No luminous tech chassis or floating spec tiles. |
| Color-role usage | Shared neutrals and semantic relationship states. Included and Required differ through heading/structure rather than green/red. Brand red is not a compatibility or power-performance signal. Unknown, error, unavailable, restricted, and requirement warning remain distinct. |
| Media treatment | Exact model/configuration identity; labeled Included Contents view; connection/interface macro; controls/assembly/setup; package-label truth. Images cannot establish Included, Required, or Compatible. Missing contents image does not change text. Variant media changes atomically. |
| Component anatomy | Universal identity/decision stack; platform/model identifiers; configuration selectors; parallel Included and Required External records; technical constraint summary; compatibility panel; price/availability/eligibility; composed state; derived CTA; gallery; contents/setup/specification modules; verified replacements/consumables; support. |
| Primary and secondary action hierarchy | Derived purchase CTA follows configuration, requirements, compatibility, price, stock, and eligibility. If an external component is required, the primary consequence is named; any add/resolve route is secondary until readiness rules authorize composition. Setup and replacement routes follow purchase decision. |
| Proof / compatibility / fit / eligibility treatment | Compatibility identifies device/kit endpoint, target component/consumable/platform, state, conditions, evidence, consequence, and recovery. Operating constraints are facts, not compatibility claims. Included and Required are verified product relationships. Eligibility stays separate; physical fit is used only where relevant and authoritative. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** name the relationship/variant updating and retain prior exact state. **Error:** relationship service failure is not Unknown. **Unavailable:** exact configured kit remains named. **Unknown:** no positive relation or quick add. **Restricted:** scope/consequence separate from compatibility. **Changed:** configuration atomically updates model/variant, media, contents, requirements, facts, relationships, price, stock, eligibility, URL, and action. |
| Responsive reflow | Included/Required parallel columns become sequential titled records without merging. Technical table becomes records. Compatibility endpoints stay visible. Sticky summary includes platform/model, configuration, price, and highest blocker or is omitted. |
| Keyboard and focus behavior | Configuration groups expose dependencies. Included and Required headings are navigable. Relationship result changes are announced with both endpoints. Failed Add retains configuration and focuses the localized error/recovery. Gallery/contents layers restore focus. |
| Reduced-motion behavior | No device rotation, assembly autoplay, animated vapor, glowing control, or compatibility snap. Configuration and relationship changes are immediate; gallery/setup media remains user controlled. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-VAPE-KIT combined in separate runs with SYN-VAPE-COMPATIBLE, SYN-VAPE-CONDITIONAL, SYN-VAPE-UNKNOWN, long option/model labels, missing contents media, price change, sold out, restricted, and Failed Add. |
| Real-data gate | Manufacturer/verified SKU model and variant records; authoritative package contents; required external component relationships; technical constraints and units; verified compatibility endpoints/evidence; actual price/stock/eligibility; media; setup; replacements; support. |
| What must remain visually quiet | Platform/model, contents, requirements, technical data, conditions, price, availability, eligibility, relationship evidence, setup, replacement, and errors. |
| What the page must not do | It must not infer package contents from photography, bury required components, call unknown compatible, treat a kit as complete without data, recommend arbitrary parts, use technical decoration as evidence, or let accessories precede purchase readiness. |
| **WHERE PRESSURE APPEARS** | In exact platform identity and confident object presentation only. |
| **WHERE PROOF / PRECISION TAKES OVER** | At configuration, Included/Required, every technical fact, endpoint relationship, price, stock, eligibility, derived action, setup, and replacement. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Brand field, display typography, atmospheric/device-lifestyle media, glow, decorative tech iconography, large whitespace, and promotion disappear before contents and compatibility. |

## 22. Specification 12 — Pod / Coil / Replacement PDP

**Inheritance:** Universal PDP Shell. This adaptation specializes exact replacement identity, owned-device context, bidirectional compatibility, technical options, verified successor recovery, and replacement lifecycle.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Help a customer confirm that the exact pod, coil, cartridge, or replacement component works with what they own; preserve part/model distinctions; block known incompatibility; expose conditional/unknown state; and recover from sold-out inventory only through verified relationships. |
| Pressure & Proof intensity | **P1 part identity → P0 owned context, compatibility, conditions, availability, and successor evidence.** |
| Top-to-bottom composition | Exact part identity and role → owned device/platform context → compatibility input/result → technical option/specification → requirements → price/availability/eligibility → composed state → derived action → connection/label media → supported-platform relationships → replacement interval/lifecycle only when authoritative → sold-out exact/successor recovery → support. |
| Wide-screen composition | Universal media/decision adjacency, with compatibility context occupying the decision region before price/action. Exact part code and owned endpoint are visually paired. Supported-platform relationships use a P\* data-width record set below; successor comparison names differences side by side only when verified. |
| Narrow-screen composition | Part identity → owned-device input/selection → compatibility result and condition → exact technical option → price/stock/eligibility → action. Connection media follows the textual result. Supported-platform and successor records stack with both endpoints and differences repeated. |
| Semantic reading order | Part identity/role → owned device/platform → compatibility state/conditions → technical option/specification → requirements → price → availability → eligibility → action readiness/action → media → supported platforms → lifecycle → exact/successor recovery → support. |
| Grid and alignment behavior | Universal P\* decision grid. Part and device identifiers share endpoint alignment. Compatibility state/condition/evidence/recovery form one bounded record. Technical specs use P\* data grid. Successor comparison aligns exact item, successor, verified relation, and differences without relying on image similarity. |
| Content-width behavior | Model/part strings wrap and preserve suffixes. Compatibility record uses full decision-column width. Supported-platform lists and comparisons use P\* data measure. Long lists require search/filter or grouped disclosure only if blockers remain visible outside. |
| Typography roles | Exact part identity role; label/data emphasis for part/model code; H3 for owned-device and compatibility groups; data roles for resistance/capacity/technical option only when real; price emphasis; body for conditions/recovery. No identifier is uppercase decorative display by default. |
| Spacing and density mode | Tight P\* endpoint/state grouping. Owned-device selection, technical option, and requirement groups use P\* module spacing. Supported-platform lists use dense records with dividers. Successor differences use dependent-fact spacing. |
| Surface treatment | Flat decision surface; explicit selector borders; compatibility semantic panel; neutral technical records; unboxed supported-product cards; successor comparison as a quiet data field. No glow, neon, or badge cloud. |
| Color-role usage | Compatible, Incompatible, Conditional, bounded Universal, and Unknown use shared semantic roles with exact text. Sold Out is availability, Restricted is eligibility, and Error is operational. Brand red does not indicate match or mismatch. |
| Media treatment | Exact part/package identity, model/label macro, connector/interface macro, and installation orientation only when authoritative. Images never prove compatibility. Missing media leaves part code, specifications, endpoints, and relationship state. Successor never reuses the sold-out item’s image. |
| Component anatomy | Exact identity/role; part code; owned-device selector/resolver; compatibility panel; technical option group; requirements; price/availability/eligibility; derived CTA; gallery; supported-platform records; replacement/lifecycle information; exact-item sold-out record; verified-successor comparison; support handoff. |
| Primary and secondary action hierarchy | For Compatible and otherwise ready state, purchase CTA is primary. Incompatible blocks and makes correction/resolver primary. Conditional requires visible condition and governed acknowledgment/resolution. Unknown routes to identification/support. Sold-out exact item makes verified successor or notification secondary only as authorized. |
| Proof / compatibility / fit / eligibility treatment | Compatibility is bidirectional where meaningful and names exact part and device/platform, state, conditions, evidence/source, consequence, and recovery. Universal is limited to a documented interface. A successor relation is not compatibility and must disclose verified differences. Eligibility is separate. Physical fit appears only if physical geometry is materially governed. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** name endpoints under evaluation. **Error:** service failure offers retry without claiming Unknown. **Unavailable:** exact replacement remains named and no arbitrary substitution occurs. **Unknown:** blocks positive language and requests identity input. **Restricted:** distinct eligibility result. **Changed:** owned-device or technical-option change atomically updates relationship, facts, media, price, stock, requirements, eligibility, URL, and CTA. |
| Responsive reflow | Endpoint pair and state remain adjacent in reading order. Supported-platform tables become labeled records. Successor comparison stacks Exact then Verified Successor with differences; it does not become two unlabeled cards. Sticky action includes selected part, owned endpoint, state, and price or is omitted. |
| Keyboard and focus behavior | Owned-device resolver/selector uses visible labels and accessible suggestions. Compatibility updates announce both endpoints and state. Incompatibility/unknown recovery receives logical focus only after explicit action, not on every keystroke. Relationship lists and comparison controls are keyboard navigable. |
| Reduced-motion behavior | No animated connection, snap, spin, vapor, pulse, or auto-scrolling compatibility result. Relationship changes are immediate. Gallery and layer motion follow shared reduced-motion rules. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-VAPE-COMPATIBLE, SYN-VAPE-INCOMPATIBLE, SYN-VAPE-CONDITIONAL, SYN-VAPE-UNKNOWN, and SYN-VAPE-SUCCESSOR; add long part/model names, P\* 18 supported-platform records, missing connector media, restricted, and Error. |
| Real-data gate | Exact part and device/platform identifiers; option/specification sources; verified bidirectional relationship evidence/conditions; authoritative Universal boundary; price/stock/eligibility; media; lifecycle data; successor relationship/differences; notify/support operations. |
| What must remain visually quiet | Part codes, owned context, relationship state/evidence/conditions, technical facts, stock, eligibility, successor differences, lifecycle information, and support. |
| What the page must not do | It must not infer a match from brand/category/title/image, hide the owned endpoint, use Unknown as a soft yes, call a merely similar item a successor, hide differences, treat stock as compatibility, or animate a match as proof. |
| **WHERE PRESSURE APPEARS** | In concise exact-part identification and the house’s direct language; nothing more. |
| **WHERE PROOF / PRECISION TAKES OVER** | At owned-device context, endpoint relationship, technical option, conditions, requirements, price, availability, eligibility, supported platforms, successor evidence, and support. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Red, display type, editorial/lifestyle media, decorative technology motifs, large type, hover theatrics, and promotion are absent once compatibility context begins. |

## 23. Specification 13 — Complete Glass Piece PDP

**Inheritance:** Universal PDP Shell. This adaptation specializes physical object identity, scale, material, maker/provenance, connection geometry, Included versus Required components, care, and fragile-item consequences.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Let customers understand the exact complete piece as a physical object: real scale, material, connections, contents, requirements, provenance, care, fit consequences, availability, and fragile support—without using photography as a substitute for measurements. |
| Pressure & Proof intensity | **P1 object/craft identity → P0 dimensions, connection, contents, requirements, price, and fragile consequence.** |
| Top-to-bottom composition | Exact product/maker identity → selected variant → structured scale/material/provenance → connection geometry → Included versus Required components → options → price/availability/eligibility and fragile consequence → fit/requirement summary → derived action → identity/scale/connection/contents/craft media → full measurements/specifications → care → verified replacements/relationships → fragile support. |
| Wide-screen composition | Universal media/decision adjacency may give tall-object media more vertical presence, but the decision region keeps structured dimensions and contents before action. Use P\* 2:3 identity only when needed. Scale/reference and connection media align to the corresponding text records. Full measurement/care data uses P\* data/reading measures. |
| Narrow-screen composition | Exact variant and structured scale facts precede optional scale media. Material, connection geometry, Included, Required, price, stock, and fragile consequence appear before the action. Tall identity media is bounded so it cannot delay the blocker/action region indefinitely. |
| Semantic reading order | Identity/maker → selected variant → dimensions/scale → material/provenance → connections → Included → Required → options → price → availability/eligibility/fragile consequence → fit/requirements → action → media → full specs/care → relationships/support. |
| Grid and alignment behavior | Universal P\* decision grid. Dimension label/value/unit/source align; connections use source/target attribute groups. Included and Required use parallel titled records. Gallery view labels align with the factual job they support. Lower data uses P\* data grid. |
| Content-width behavior | Long maker/product names wrap. Multi-unit dimensions bind value and unit. Decision facts use full decision width; measurement records cap at P\* data measure; maker/care prose at P\* reading measure. Tall images never expand the overall shell beyond meaningful content. |
| Typography roles | Product/H1 identity; maker/provenance compact context; H3 for Scale, Connections, Included, Required; data/spec roles with tabular numerals for measurements; price emphasis; body for consequence/care/support. No decorative craft script or oversized dimension callout. |
| Spacing and density mode | P\* dependent spacing binds measurement/unit/source and Included/Required item/state. Separate geometry/contents/price decisions use P\* module spacing. Full specifications are dense and divider-led; maker/care reading is more open. |
| Surface treatment | Flat decision surface; neutral media well; measurements and contents use divider-led records; physical fit uses semantic panel; fragile consequence uses a calm operational field. No glassmorphic panel, floating tile stack, faux shelf, or reflective UI effect. |
| Color-role usage | Shared neutrals and semantic states. Brand red does not encode fragility, material, heat, fit, or stock. Missing scale media uses Unknown/information according to what is actually missing; known structured dimensions remain factual. |
| Media treatment | Roles: exact identity; independent scale/reference with disclosed method; connection macro; Included Contents; assembly relationship; material/craft detail; maker mark/provenance where authoritative; care. Critical object detail is contained within P\* safe area. Missing scale media is explicit and does not erase verified dimensions. |
| Component anatomy | Universal identity/purchase stack; maker/provenance; variant options; scale/dimension record; material record; connection geometry; parallel Included/Required records; price/stock/eligibility/fragile consequence; fit/requirement panel; derived CTA; role-labeled gallery; full specs; care; verified replacement components; fragile support. |
| Primary and secondary action hierarchy | Derived purchase CTA follows selection, price, stock, eligibility, material fit/requirements, and any authorized fragile-fulfillment limitation or consequence. Secondary actions inspect scale/measurement method, identify a required component, view maker/source, learn care, or contact support. Optional accessories follow requirements. |
| Proof / compatibility / fit / eligibility treatment | Physical fit names relevant connection endpoints and every material geometry attribute. Scale is structured data plus media when available, not a compatibility result. Included, Required, Optional, and Replacement are distinct relationships. Maker/material/provenance names source. Eligibility is separate. Fragile state is operational/support, not proof or defect. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** retain exact identity and known dimensions while the named record updates. **Error:** media/relationship service failure is not Unknown measurement. **Unavailable:** exact variant remains named. **Unknown:** missing measurement/clearance is explicit; missing scale media does not imply all scale unknown. **Restricted:** exact eligibility scope. **Changed:** option change atomically updates identity, dimensions, connections, contents, fit, media, price, stock, eligibility, URL, and CTA. |
| Responsive reflow | Tall-media adjacency stacks after decision truth. Dimensions become labeled records. Included/Required columns become titled sequences. Fit diagram uses P\* narrow ratio with textual equivalence. Sticky action includes exact variant, current price/state, and blocker or is omitted. |
| Keyboard and focus behavior | Variant and relationship changes announce material dimension/contents/fit differences. Gallery role labels are keyboard reachable; zoom/layer restores focus. Measurement-method and support disclosures expose state. Error summary links to the affected selector/relationship. |
| Reduced-motion behavior | No spin, liquid/smoke simulation, glint, fragile shake, parallax, or auto-zoom. Gallery changes are customer-controlled and reduced to immediate state when requested. Fit and price changes update immediately. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-GLASS-COMPLETE, SYN-GLASS-NO-SCALE-MEDIA, SYN-GLASS-UNKNOWN-CLEARANCE, SYN-GLASS-FRAGILE-SUPPORT, SYN-SHARED-MULTI-UNIT, long maker/name, P\* 18 specification rows, unavailable, restricted, changed price, and Failed Add. |
| Real-data gate | Verified SKU/receiving measurements and method/source; material; maker/provenance; exact variant and connection geometry; Included/Required relations; tested fit where needed; actual price/stock/eligibility; production identity/scale/connection/contents media; care and fragile support operations. |
| What must remain visually quiet | Dimensions, units, method/source, material, provenance, connection attributes, contents/requirements, price, fit, eligibility, care, fragile consequence, unknowns, and support. |
| What the page must not do | It must not infer scale from the hero image, call the piece complete from photography, hide required components, claim fit from size alone, invent maker lore, use a fragile icon as the full policy, let tall media bury action dependencies, or use glassmorphism as a literal visual pun. |
| **WHERE PRESSURE APPEARS** | In exact object presence, restrained craft confidence, maker identity when verified, and one disciplined identity view. |
| **WHERE PROOF / PRECISION TAKES OVER** | At dimensions, units, material/source, connection geometry, Included/Required, fit, price, stock, eligibility, fragile consequence, care, and support. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Red field, condensed display, atmospheric crop, reflective/decorative UI, oversized object theater, large whitespace, and promotional relationship modules disappear before physical facts and purchase readiness. |

## 24. Specification 14 — Fitted Component PDP

**Inheritance:** Universal PDP Shell. This adaptation specializes owned-piece context, exact source/target geometry, conditional intermediary relationships, physical-fit evidence, and measurement/support recovery.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Let a customer determine whether a bowl, banger, nail, ash/reclaim catcher, adapter, downstem, or other fitted component can work with an exact owned piece; prevent nominal-size false positives; and preserve uncertainty when geometry is incomplete. |
| Pressure & Proof intensity | **P1 component identity → P0 owned context, geometry, fit state, conditions, and action.** |
| Top-to-bottom composition | Exact component identity/role → owned-piece context → source and target connection geometry → fit state and conditions → intermediary/Required components → options → price/availability/eligibility → composed state → derived action → connection/measurement media → full geometry/specifications → supported relationships → measurement help/support. |
| Wide-screen composition | Universal media/decision adjacency, but geometry and fit occupy the decision region before price/action. A P\* 3:2 relationship diagram may sit beside the text record only when real. Full supported-piece/adapter relationships use P\* data width below. |
| Narrow-screen composition | Identity → owned-piece input → source/target attributes → fit state/condition/intermediary → exact variant → price/stock/eligibility → action. Diagram follows the complete text relation. Long geometry becomes stacked labeled records; no sideways compatibility matrix is necessary for the primary decision. |
| Semantic reading order | Component identity/role → owned piece → source/target size → gender/type → angle → applicable length/orientation/clearance/tolerance → fit state → condition/intermediary → requirements → option → price → availability → eligibility → action → media → depth/support. |
| Grid and alignment behavior | Universal P\* decision grid. Source and target attributes use parallel labeled groups with a clear relationship connector in text. State, conditions, evidence, and recovery remain one record. Geometry/spec data aligns label/value/unit/source within P\* data grid. |
| Content-width behavior | Exact component and owned-piece names wrap. Geometry records use full decision width. Multi-unit values bind. Supported relationships cap at P\* data measure; measurement instruction at P\* reading measure. A diagram never forces text into a narrow unreadable strip. |
| Typography roles | Product/H1 identity; compact maker/component role; H3 for owned context, geometry, fit; label/data roles with tabular numerals for attributes; price emphasis; body for condition/consequence/recovery. Nominal size is not isolated as an oversized promotional number. |
| Spacing and density mode | P\* dependent-fact spacing binds source/target attribute pairs and state/condition/intermediary. Separate geometry dimensions use P\* component spacing; decision groups use P\* module spacing. Full relationship lists are dense/divider-led. |
| Surface treatment | Flat decision surface; explicit owned-piece input; source/target comparison on subtle neutral; fit uses semantic evidence panel; option controls use borders; relationship diagrams have no decorative elevation. No glassmorphism, faux technical blueprint, or badge stack. |
| Color-role usage | Shared neutrals. Compatible, Incompatible, Conditional, bounded Universal, and Unknown/Unverified use shared semantic roles plus text/icon/relationship. Brand red never means fit. Error, Restricted, Sold Out, and Additional Component Required stay distinct. |
| Media treatment | Exact component identity; connector macro; labeled measurement view; orientation/angle view; conditionally required adapter/assembly; material detail. Media cannot establish dimension or fit alone. P\* 3:2 / P\* 1:1 relationship diagrams require text endpoints/conditions and remain blocked until actual measurements/assets exist. |
| Component anatomy | Universal identity/purchase structure; component role; owned-piece selector/resolver; parallel source/target geometry; fit panel; conditions/intermediary; Required component record; options; price/availability/eligibility; derived CTA; gallery; geometry specs; supported relationships; measurement help; support handoff. |
| Primary and secondary action hierarchy | Compatible and otherwise ready may enable the purchase CTA. Incompatible blocks and makes correction/measurement/support primary. Conditional makes condition/intermediary resolution primary or required before action according to governed rules. Unknown routes to the smallest missing measurement/input. |
| Proof / compatibility / fit / eligibility treatment | Physical fit is positive only from sufficient verified attributes and/or pair testing. It names endpoints, size, gender/type, angle, applicable orientation/length/clearance/tolerance, intermediary, state, condition, evidence/source, consequence, and recovery. Nominal size alone cannot pass. Eligibility remains separate. Electronic compatibility is Not Applicable unless genuinely relevant. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** name endpoints/attributes evaluating. **Error:** service failure is not Unknown fit. **Unavailable:** exact component stays named; no unverified substitution. **Unknown:** state names missing attribute. **Restricted:** exact eligibility scope. **Changed:** owned piece, adapter, or option change atomically updates endpoints, geometry, fit, requirements, media, price, stock, eligibility, URL, and CTA. |
| Responsive reflow | Parallel source/target groups stack but repeat their labels; a relationship connector becomes explicit prose. Tables become records. A sticky action includes exact component, owned piece, fit state/condition, and price or is omitted. Measurement help stays reachable next to Unknown recovery. |
| Keyboard and focus behavior | Owned-piece and geometry inputs have visible labels/units. Fit updates announce both endpoints, state, and new requirement. Error summary links to missing/invalid attribute. Diagram is nonessential to operation and has a text equivalent. Support transfer preserves consented measurements/context. |
| Reduced-motion behavior | No animated assembly, rotation, snap, fit celebration, shake, or diagram tracing. State changes are immediate. Gallery/layer behavior follows universal reduced-motion rules. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** SYN-GLASS-WRONG-GENDER, SYN-GLASS-ADAPTER, SYN-GLASS-UNKNOWN-CLEARANCE, a verified Compatible pair, long endpoint names, P\* multiple units, missing connector media, Sold Out, Restricted, and four simultaneous states. |
| Real-data gate | Authoritative source/target measurements and sources; standardized receiving method; verified pair testing when needed; exact product/variant identifiers; relationship evidence/conditions/intermediaries; actual price/stock/eligibility; production connection/measurement media; measurement and support workflow. |
| What must remain visually quiet | Endpoint names, every geometry attribute/unit/source, fit state, condition, intermediary, requirement, stock, eligibility, unknown input, measurement help, and support. |
| What the page must not do | It must not infer fit from nominal size, image, title, filename, or apparent similarity; omit gender/type or angle; treat missing clearance as compatible; call an adapter optional when required; replace exact context silently; or make the diagram the only truth source. |
| **WHERE PRESSURE APPEARS** | In concise exact component identity and the direct promise to help the customer avoid a wrong part—not in visual spectacle. |
| **WHERE PROOF / PRECISION TAKES OVER** | At the first owned-piece field and every endpoint attribute, fit state, condition, intermediary, price, availability, eligibility, measurement, and support decision thereafter. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Brand red, display width, editorial image, atmospheric crop, decorative diagram, floating surface, hover effect, and promotion are absent from owned-context and fit resolution. |

## 25. Specification 15 — Quick Cart

**Family role:** Constrained confirmation and routing layer. It inherits exact cart-line grammar but does not own checkout readiness, composed order validation, or complex recovery.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Confirm the most recent add outcome, identify the exact line and current price/quantity, disclose immediately material change or blocker, support simple edit/remove, and route to Full Cart or back to shopping without pretending the order is validated. |
| Pressure & Proof intensity | **P0 throughout.** Quick Cart is a transactional layer with only residual house recognition through typography, spacing, and actions. |
| Top-to-bottom composition | Layer heading and close → add outcome → exact line identity/selected options → quantity/current price → highest immediate blocker/change plus direct recovery → simple edit/remove → subtotal context and qualification → Full Cart/return action → restrained support link when needed. |
| Wide-screen composition | Open as a right-side or otherwise edge-anchored P\* drawer within P\* topology rules. Width is content-driven and must support long identity, option, state, and action without becoming a miniature full page. Background is inert while modal behavior applies. |
| Narrow-screen composition | Use a viewport-contained drawer/sheet or full-height layer that preserves close, heading, exact line, blocker, and actions without browser-UI collision. Content scrolls inside a named region; close and current state remain reachable. It does not compress into a toast. |
| Semantic reading order | Quick Cart heading → add success/failure → exact product/variant/options → quantity → current price/basis → state/change/consequence → edit/remove → subtotal qualification → Full Cart/return → support. |
| Grid and alignment behavior | P\* compact result/cart thumbnail aligns with a flexible line-detail column; price/quantity align to the same text anchor, not a fragile far-right column on narrow widths. State panel spans the content width. Actions align in consequence order. |
| Content-width behavior | Drawer width remains below the page while supporting the P\* long-identity fixture. Critical text wraps. Multiple cart lines, dense validation, cross-line relationships, and full totals trigger a Full Cart route rather than indefinite drawer expansion. |
| Typography roles | H3 for layer heading; shared product identity/compact body for line; data/price emphasis for current price; label/body for state/consequence; standard action roles. No display typography or marketing heading. |
| Spacing and density mode | P\* compact-to-standard density. Exact identity/options use dependent spacing; state/recovery uses component spacing; actions use module separation. Tightness cannot merge quantity, price, blocker, and subtotal into one ambiguous row. |
| Surface treatment | Surface background, P\* drawer elevation, P\* overlay radius only at detached edge, quiet dividers. Line item is not a raised card. Scrim expresses topology, not drama. State panel follows semantic surface. |
| Color-role usage | Neutral surface and near-black primary action. Semantic colors only for named outcome/state. Brand red and full logo are absent. Changed price, Unavailable, Restricted, Unknown, and Error stay distinct and color-independent. |
| Media treatment | P\* 1:1 exact line thumbnail for identity only. Selected options stay textual. Missing media uses neutral exact-identity placeholder; no adjacent product substitution. Media never communicates success, availability, or compatibility alone. |
| Component anatomy | Dialog/drawer container; heading; close; live add outcome; exact cart-line record; thumbnail; identity/options; quantity control; price/current basis; state panel; edit/remove; subtotal with qualification; Full Cart; return; support. Recommendations are excluded from the representative Quick Cart. |
| Primary and secondary action hierarchy | The primary action is state-derived: use “View Full Cart” when validation or complex resolution is needed; otherwise continue appropriately through the governed return/shopping route. A failed add or material line blocker makes its direct recovery primary. Quantity/edit/remove are line utilities, and the alternate full-cart/continue route is secondary. Quick Cart does not claim “Checkout ready.” |
| Proof / compatibility / fit / eligibility treatment | Show only immediately material, currently known line state in shared anatomy. Name exact endpoints/scope when compatibility, fit, proof, or eligibility affects the line. Transfer full context to Full Cart for composed validation. Unknown is explicit; no resolution is inferred from co-presence in the cart. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** identify add/quantity operation and retain prior line. **Empty:** name that no line is present and provide the governed return route. **Error:** Failed Add states whether the line entered cart; retry does not duplicate silently. **Unavailable:** exact variant and valid recovery. **Unknown:** line relationship unresolved. **Restricted:** scope/consequence. **Changed:** old/new price relationship and subtotal qualification are announced. Highest blocker leads; contributing states remain available. |
| Responsive reflow | Thumbnail/detail may stack if the line cannot sustain side-by-side reading. Action row becomes full-width stack in primary order. State content never moves behind a disclosure on narrow screens. The drawer may become a full-height layer based on content failure, not an asserted production breakpoint. |
| Keyboard and focus behavior | On open, announce outcome and place focus deliberately on heading or first recovery—not always close. Background becomes inert when modal. Escape closes when safe. Quantity/edit/remove are labeled; errors are linked. Closing restores focus to the initiating Add control or meaningful successor. |
| Reduced-motion behavior | P\* topology motion becomes immediate or P\* ≤80 ms opacity. No cart bounce, icon flight, confetti, line slide, or price count animation. Outcome/state remains announced. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** each SYN-CART fixture in isolation, Failed Add, empty state, long line/option labels, missing thumbnail, P\* four simultaneous states, quantity error, and changed cart count. |
| Real-data gate | Actual cart-line identity and selected variant; add/update result contract; price and subtotal basis; inventory; eligibility/proof/relationship state; quantity constraints; error/retry/idempotency behavior; full-cart URL; support and focus-return behavior. |
| What must remain visually quiet | Exact options, quantity, price basis, subtotal qualification, blocker explanation, recovery, remove/edit, close, and support. |
| What the page must not do | It must not act as a toast, claim full validation, hide a blocker below recommendations, silently drop/replace a line, use an optimistic success before confirmation, duplicate on retry, promote checkout around restriction, or animate the cart as a reward. |
| **WHERE PRESSURE APPEARS** | Nowhere decoratively. Only the recognizable house typography, action geometry, and direct language remain. |
| **WHERE PROOF / PRECISION TAKES OVER** | At the layer heading, exact add outcome, line identity/options, quantity, current price, state, subtotal qualification, and routing. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Full logo, brand red, display type, editorial imagery, campaign copy, product recommendations, decorative icons, large spacing, hover effects, and nonfunctional motion are removed. |

## 26. Specification 16 — Full Cart

**Family role:** Authoritative cart review and composed revalidation surface. It inherits Universal readiness order, exact cart-line grammar, and all applicable domain state systems.

| REQUIRED DIMENSION | HIGH-FIDELITY SPECIFICATION |
|---|---|
| Visual purpose | Revalidate the current order, expose every line and cross-line consequence, preserve exact choices, resolve blockers/warnings without surprise, show the current total basis, and enable progression only when readiness is true. |
| Pressure & Proof intensity | **P0 throughout—the system’s lowest practical brand intensity.** Trust comes from state fidelity and recovery, not visual persuasion. |
| Top-to-bottom composition | Cart title and order-level alert/error summary → exact line items and line states → cross-line compatibility/fit/requirements → price/availability changes → eligibility and material proof consequences → totals and fulfillment qualification → derived progression action → secondary save/continue/support → only an authorized verified missing-required-component, compatible-replacement, or reasoned-recovery module after all blockers and totals. |
| Wide-screen composition | P\* decision maximum. Main line/revalidation region occupies the dominant reading width; a totals/progression region may be adjacent and sticky only while it repeats current blockers and does not outrank line errors. Cross-line evidence spans P\* data width. Any authorized verified missing-required-component, compatible-replacement, or reasoned-recovery module remains below the complete decision. |
| Narrow-screen composition | Order alert → lines → each localized state/recovery → cross-line relations → totals/fulfillment → derived progression. A sticky progression control is allowed only with current total basis and highest blocker; otherwise actions remain inline. Line media is compact and optional to truth. |
| Semantic reading order | Cart heading → order alert/error summary → each exact line identity/options/quantity/price/state/recovery → cross-line requirements/relationships → price/availability/eligibility/proof changes → totals/fulfillment basis → readiness/result → progression → support → only an authorized verified requirement/replacement/recovery module. |
| Grid and alignment behavior | P\* decision grid with stable line anchors for thumbnail, identity/options, quantity, current price, and state; narrow reflow replaces distant columns with labeled records. Order-level and cross-line state panels align with affected lines and link to them. Totals align label/value/basis. |
| Content-width behavior | Long identities/options wrap. Line and state content cannot be compressed to preserve a sidebar. The totals region has a bounded readable width. Cross-line records use P\* data measure. Empty/error/support prose uses P\* reading/compact-form measure. |
| Typography roles | H1 for Cart; shared line identity and compact-body roles; data/price emphasis for line and totals; H3 for order state/summary; label/data for options, relationships, totals, and fulfillment; body for consequence/recovery. No display/condensed editorial type. |
| Spacing and density mode | P\* component/module density. Identity/options/quantity/price remain tightly grouped by line. Separate lines receive strong divider/module spacing. Order blockers and total basis use bounded data density. Promotion never consumes section-scale space before resolution. |
| Surface treatment | Flat canvas/surface; lines divided, not elevated; state panels semantic and divider-led; totals may use a subtle bounded surface without card theatrics. Sticky totals use P\* utility elevation only for topology. No decorative checkout tunnel styling. |
| Color-role usage | Neutrals dominate. Brand red and full logo are absent from the decision body. Semantic states retain exact shared roles: Changed/warning, Unavailable, Restricted, Incompatible, Unknown, Missing Proof, Error, and success/readiness remain distinct with labels/icons/text. |
| Media treatment | P\* 1:1 exact line thumbnail supports recognition only. Selected variant/options and relationships are text. Missing media preserves exact line. Cross-line diagrams are unnecessary for the primary specification; textual endpoint records govern. No lifestyle or promotional media before progression. |
| Component anatomy | Cart heading; order-level alert/error summary; exact line records; quantity/edit/remove; localized line states/recoveries; cross-line compatibility/physical-fit/required-component records; proof/eligibility/availability/price-change panels; totals/basis; fulfillment qualification; derived progression; continue/save/support; empty state; conditionally present verified missing-required-component, compatible-replacement, or reasoned-recovery region. |
| Primary and secondary action hierarchy | Progression is primary only when the composed readiness result permits it; otherwise the highest blocker’s recovery is primary and progression is visibly unavailable with reason. Edit/quantity/remove are line utilities. Continue shopping and Support are secondary. Promotion never becomes the primary cart action. |
| Proof / compatibility / fit / eligibility treatment | Revalidate each applicable state at exact line/variant scope and evaluate verified cross-line relations without assuming co-purchased items are compatible. Name endpoints, conditions, requirements, and consequences. Unknown never passes silently. Missing/stale proof, Restricted eligibility, Unavailable stock, and Error remain separate. |
| Loading, error, unavailable, unknown, restricted, and changed states | **Loading:** retain line identity/last known state and identify revalidation scope. **Empty:** provide the governed return/discovery route without invented promotion. **Error:** order/line service failure preserves choices and blocks only as governed. **Failed Eligibility Check:** remains an Error with retry/support, never a Restricted outcome. **Unavailable:** never silently removes a line. **Notify Eligible:** appears only for the exact line and only when authoritative operations authorize that action; no channel or commitment is invented. **Unknown:** explicit relationship/data gap. **Restricted:** exact affected line/scope. **Changed:** previous/current price or state, acknowledgment when required, recomputed total, and announcement. Multiple states preserve highest blocker plus contributing records. |
| Responsive reflow | Table-like lines become labeled line records. Order summary follows affected lines in semantic order even if visually sticky wide. Error summary links to each line. Cross-line relationships repeat both endpoints. Action remains reachable without covering focused fields or messages at zoom/narrow widths. |
| Keyboard and focus behavior | Error/order summary links to affected lines and controls. Quantity/removal confirmation is accessible and preserves focus logically. Dynamic price/state/total changes receive restrained announcements. Progression reason is programmatic. Dialogs restore focus. Empty cart and service errors provide meaningful next focus target. |
| Reduced-motion behavior | All revalidation/blocker/price updates are immediate. No line flyout, celebratory progression, shaking error, animated total, urgency timer, or recommendation carousel. Sticky topology becomes immediate under reduced motion. |
| Synthetic fixture needed | **SYNTHETIC / NON-PRODUCTION:** all eight SYN-CART fixtures simultaneously and separately; P\* four-state priority; long names/options; missing thumbnails; multiple units; dense line set; Empty; service Error; failed quantity update; narrow/zoom/keyboard/high-contrast tests. |
| Real-data gate | Cart persistence and exact variant lines; current price/inventory; quantity and fulfillment rules; age/destination/product eligibility; proof and relationship revalidation; Required components; state precedence; totals/tax/shipping presentation as authorized; progression contract; support and recovery operations. |
| What must remain visually quiet | Every line fact, option, quantity, price/basis, order alert, relationship endpoint, blocker, total, fulfillment qualification, progression reason, removal, and support action. |
| What the page must not do | It must not silently remove, replace, reselect, or reinterpret a line; obscure blockers behind totals or recommendations; claim readiness before revalidation; merge eligibility with error/stock; imply compatibility by co-presence; use false urgency; or make checkout persuasion louder than order truth. |
| **WHERE PRESSURE APPEARS** | Nowhere decoratively. House identity survives solely through the common shell, typography, spacing, language, focus, and action grammar. |
| **WHERE PROOF / PRECISION TAKES OVER** | Everywhere: exact lines, cross-line relationships, state precedence, price and total basis, eligibility, proof, fulfillment, recovery, and derived progression. |
| **WHAT VISUAL ELEMENTS ARE REMOVED AS CONSEQUENCE INCREASES** | Existing full logo, brand-red field, condensed display, editorial or lifestyle media, campaign voice, nonessential recommendations, decorative cards, ambient/hover motion, and promotional urgency are removed from the authoritative cart decision. |

### 26.1 Quick Cart / Full Cart boundary

Quick Cart confirms and routes. Full Cart revalidates and decides progression readiness. Quick Cart may handle a simple, currently valid quantity or removal change; it transfers complex, cross-line, eligibility, proof, compatibility, fit, required-component, or multiple-state resolution with exact context. Full Cart never assumes that Quick Cart’s recent confirmation remains current.

## 27. Design-Decision Status

The representative pages resolve a testable direction without converting test values into production approval.

### 27.1 Decisions tested across representative pages

| DECISION | PROVISIONAL OUTCOME | STATUS / REQUIRED NEXT EVIDENCE |
|---|---|---|
| Typography direction | P\* Archivo single-family role system: condensed high-weight only for short upstream display; normal-width upright for commerce, body, controls, identity, and data | **PROVISIONALLY RESOLVED** for static page testing; font build, axes, license, glyphs, rendering, long-name, numerical, and assistive/device tests remain open |
| Neutral temperature | P\* slightly warm canvas with white truth surfaces and near-black text/actions | **PROVISIONALLY RESOLVED**; test beside real product and editorial media, high contrast, forced colors, and calibrated/uncontrolled devices |
| Brand-red usage | P\* asset-observed red restricted to upstream, non-semantic, editorial use; near-black commerce CTA | **PROVISIONALLY RESOLVED as a role;** exact production red and contrast pairings are **BLOCKED BY BRAND ASSETS** |
| Semantic-state separation | P\* separate aliases/anatomies for Success, Compatible, Conditional, Warning, Incompatible, Error, Restricted, Unknown, Information, Current Proof, Loading/Pending, Unavailable, and Changed, always with text/icon/anatomy even when provisional color primitives are shared | **PROVISIONALLY RESOLVED**; final hues remain open pending contextual accessibility testing and authoritative state copy |
| Spacing rhythm | P\* shared 0/4/8/12/16/24/32/48/64/96/128 ladder with visible editorial-to-data contraction | **PROVISIONALLY RESOLVED** for compositions; tune through static prototypes, content, zoom, and device testing |
| Content measures | P\* house 1440, P\* commerce 1280, P\* decision 1200, P\* data 1040, P\* reading 720 or P\* 65–72 characters, P\* compact form 640 or P\* 45–55 characters | **PROVISIONALLY RESOLVED** as test caps, not layout mandates or breakpoints; real copy/data and device tests may reduce them |
| Card geometry | P\* unboxed, shadowless, divider-led card with P\* 4:5 default media and eleven-slot semantic grammar | **PROVISIONALLY RESOLVED**; exact internal alignment and media exceptions require real-product stress |
| Media ratios | P\* role-specific set: P\* card 4:5; P\* result/cart 1:1; P\* PDP 4:5 with P\* 1:1 and P\* 2:3 exceptions; P\* evidence/context 3:2, P\* 4:3, or P\* 1:1; P\* hero 16:9 wide and P\* authored 4:5 narrow | **PROVISIONALLY RESOLVED** for fixture production; final assignments are **BLOCKED BY REAL PRODUCT DATA** and production media |
| Action geometry | P\* neutral primary at standard/prominent control height, P\* 4 radius, one dominant action per bounded decision region, state-derived label/readiness | **PROVISIONALLY RESOLVED**; final labels, disabled/block rules, purchase methods, and sticky use remain operationally open |
| Form density | P\* 48 standard controls, P\* 44 minimum target, P\* wrap-safe option cells, visible legends, dependent groups kept together | **PROVISIONALLY RESOLVED** for testing; actual option cardinality, validation, units, and qualification flows remain data/operations gates |
| Data-panel treatment | P\* flat surface/subtle surface, quiet/semantic dividers, no base elevation, shared state anatomy with separate semantics | **PROVISIONALLY RESOLVED**; final density and record decomposition require real evidence and relationship datasets |
| Responsive composition | Wide adjacency; narrow P\* one-column dependency order; content-failure reflow; filters/layers only when needed; tables become labeled records | **PROVISIONALLY RESOLVED** as behavior; exact breakpoints remain **STILL OPEN** until content/zoom/device testing |
| Motion categories | P\* Immediate, Selection, Feedback, Media, Topology, and one bounded Editorial category; reduced-motion equivalence | **PROVISIONALLY RESOLVED** as semantic jobs; final timings, easing, distance, and device performance remain open |

### 27.2 PROVISIONALLY RESOLVED

- Pressure & Proof intensity ladder from P4 Home to P0 cart/evidence.
- One-house inheritance across Global Shell, Home, Shared Division, Category, Search, Universal PDP, and Cart families.
- P\* Archivo role direction for static tests.
- P\* warm-neutral base, near-black commerce action, and editorial-only red role.
- P\* spacing ladder, P\* 12/8/4 test grids, content caps, and content-failure reflow principle.
- P\* low-chrome product cards, limited radius family, divider hierarchy, and topology-only elevation.
- Shared evidence/state anatomy with separate proof, electronic compatibility, physical fit, eligibility, availability, error, and unknown semantics.
- Shared action, selector, focus, media-role, and reduced-motion grammar.
- Quick Cart as confirmation/routing and Full Cart as composed revalidation/readiness.

### 27.3 STILL OPEN

- Final type family approval; exact Archivo build, license, axes, weight/width instances, type sizes, line heights, tracking, fallback stack, glyph coverage, and rendering.
- Exact production neutral values after real imagery, display calibration, high-contrast, forced-colors, color-vision, and contextual contrast tests.
- Final semantic hues/icons/patterns and whether any division accent can exist without splitting the house.
- Final spacing steps in context; control/target heights; option density; and long-label behavior.
- Content-driven production breakpoints, minimum viable card width, final content caps, grid columns/gutters/edges, and sticky-shell/action behavior.
- Exact gallery interaction, thumbnail treatment, media fit/crop rules by real asset, final P\* safe-area value, icon system, control copy, and action labels.
- Final focus colors, inner/outer widths, offsets, halo/backplate behavior, and contrast across neutral, inverse, red, image, high-contrast, and forced-color surfaces.
- Final border darkness, radii, shadow/elevation optical tuning, motion timing/easing/distance, and performance budget.
- Final review, comparison, notification, save, pagination/continuation, purchase-method, and promotion placements where higher authorities leave behavior conditional.

### 27.4 BLOCKED BY BRAND ASSETS

- Transparent or vector, tightly bounded production logo master.
- Approved compact header mark; no compact mark is fabricated in this specification.
- Reverse, one-color, small-size, and light/dark logo variants.
- Clear space, minimum size, co-branding, background, crop, and misuse rules.
- Authoritative production brand-red value and approved contrast pairings.
- Production favicon/app-icon assets, if later required; none are manufactured here.

### 27.5 BLOCKED BY REAL PRODUCT DATA

- Real long product/maker/model/part names, option dimensions/cardinality/dependencies, selected-state identifiers, and price bases.
- Authoritative facts, units, specifications, package contents, Required/Optional/Replacement relationships, and evidence density.
- Exact product/variant/batch proof records and document mappings.
- Verified electronic compatibility endpoints, states, conditions, evidence, successor relationships, and lifecycle records.
- Verified physical measurements, methods/sources, endpoints, geometry, pair-testing results, intermediaries, and care/provenance data.
- Actual inventory/availability, selected-media assignments, missing-media frequency, image ratios, crops, safe areas, alt text, and comparison needs.
- Actual category/search result distributions needed to finalize card width, filters, sort, pagination, and no-result behavior.

### 27.6 BLOCKED BY OPERATIONS / COMPLIANCE

- Approved age, destination, and product-specific eligibility rules, evaluated scopes, service states, copy, and recovery.
- Governing consequences for Stale, Missing, Not Supplied, Unmatched, Unknown/Unverified, Conditional, and Conflicting evidence/relationship states.
- Proof recency and display rules; claims review; authoritative legal/compliance language.
- Inventory reservation, price-change acknowledgment, quantity limits, fulfillment qualification, notification eligibility, and cart revalidation precedence.
- Exact Add/Failed Add/idempotency behavior, purchase methods, CTA readiness rules, checkout progression, and sticky-action authorization.
- Fragile-item handling/support state, return/damage/support workflows, and carried-context consent/privacy.
- Review, recommendation, bundle, promotion, analytics, account, and support operations where their presence or priority depends on actual policy.

## 28. Validation Record

Validation is against this document and its authoritative sources. **PASS** means the requirement is explicitly governed here; it does not mean final assets, content, product data, accessibility conformance, or production behavior have been tested.

| REQUIRED VALIDATION | RESULT | EVIDENCE IN THIS SPECIFICATION |
|---|---|---|
| Pressure & Proof is visible across representative pages | **PASS** | P4–P0 composition model plus three explicit Pressure/Proof/removal rows in every representative specification |
| Home is the most expressive commerce page | **PASS** | Home alone receives P4 and the full bounded house signal |
| Decision surfaces become progressively quieter | **PASS** | Division/category P3–P1 contraction; PDP P1→P0; carts P0 |
| All divisions remain one visual house | **PASS** | Shared Division inheritance and unchanged shell/card/action/state/token grammar |
| Glossier-derived discipline remains visible without Glossier imitation | **PASS** | Low chrome, stable hierarchy, whitespace, progressive disclosure, synchronized state, functional motion, explicit non-transfer boundary |
| Cards remain low-chrome | **PASS** | Shared unboxed/shadowless eleven-slot card contract used by Home, Division, Category, Search, and related PDP modules |
| Product truth controls PDP hierarchy | **PASS** | Universal semantic sequence and readiness order precede the derived action and media depth |
| THCA proof is scoped and visually explicit | **PASS** | THCA Division/PDP distinguish exact scope and Current/Stale/Missing/Not Supplied/Unmatched/Error |
| Electronic compatibility is visually explicit | **PASS** | Vape Division and both Vape PDPs name endpoints, conditions, evidence, consequence, and Unknown behavior |
| Physical fit is visually explicit | **PASS** | Glass Division and both Glass PDPs govern geometry beyond nominal size and name unknown attributes/intermediaries |
| Cart has the lowest practical brand intensity | **PASS** | Quick Cart and Full Cart are P0 with decorative Pressure removed |
| Responsive priorities preserve blockers and actions | **PASS** | Shared responsive dependency order plus page-specific reflow/sticky truth gates |
| Provisional tokens are clearly non-final | **PASS** | Every proposed quantified design-test value uses P\* or is classified open/blocked, under the exact definition “PROVISIONAL — REQUIRES VISUAL, CONTENT, ACCESSIBILITY, AND DEVICE TESTING” |
| Synthetic fixtures are clearly non-production | **PASS** | Fixture pack and every page fixture are marked **SYNTHETIC / NON-PRODUCTION** |
| No production code exists | **PASS** | Document contains design specifications only; no CSS, application code, framework code, or executable implementation |
| Implementation remains unauthorized | **PASS** | Header states **Implementation authorization: Not granted**; no implementation begins here |
| Competitor research remains closed | **PASS** | Research boundary is explicit; no browsing or new competitor behavior is introduced |

### 28.1 Required prototype test matrix

The validation record above does not waive later testing. Every selected representative static prototype must exercise the Section 8 fixture pack and Section 9 stress protocol across P\* 1440, 1024, 768, 390, and 320 test canvases; P\* 200% and 400% zoom/reflow; keyboard-only operation; visible focus; screen-reader semantic review; reduced motion; high contrast/forced colors; color independence; missing media; long labels; multiple units; dense records; multiple blockers; and Unknown/Unverified data. These are test canvases and conditions, not production breakpoint or conformance claims.

## 29. Selected Next Phase

**D. STATIC VISUAL PROTOTYPES**

Static visual prototypes are the correct next phase because this document has made the page hierarchy, inheritance, provisional typography direction, token hypotheses, media jobs, state anatomy, and fixture requirements concrete enough to test—but not trustworthy enough to freeze into a token specification or technical architecture. Representative static compositions can now expose typography, density, alignment, color, media-ratio, state-priority, and reflow failures using synthetic/non-production fixtures before production implementation creates avoidable lock-in.

The next phase should test a minimal inheritance-spanning set: Home; one Shared Division composition with three adaptations; one Shared Category with all three material card slots; Universal PDP plus the five specialized decision openings; and Quick/Full Cart. It must remain synthetic, static, and non-production until its own authorization. **That phase is selected but does not begin in this document.**

---

End of governing high-fidelity design specification. Implementation remains unauthorized.
