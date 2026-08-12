# Blowin' Smoke — Pressure & Proof Constructed Signal, Iteration 05.1

## Semantic Consistency and Retail Credibility Correction

**Package status:** Complete isolated static design evidence  
**Gate decision:** CONDITIONAL PASS for static customer-facing direction  
**Static architecture status:** CLOSED after route-semantics closeout

**Production status:** **NOT APPROVED**

**Implementation authorization:** **NOT GRANTED**

## Purpose

Iteration 05.1 corrects the material semantic and retail-fidelity defects found in Iteration 05 without reopening the Pressure & Proof architecture. It preserves the fixed decision sequence:

> Exact identity → selected state → price basis → availability → material blocker → reason → recovery → commerce action.

The package proves a static direction only. It does not implement a storefront, catalog, compatibility or fit engine, inventory, eligibility, cart logic, checkout, account, support workflow, API, database, or production component.

## Governing sources

The work follows the repository Constitution and system documents, especially:

1. `docs/constitution/01-brand-philosophy.md`
2. `docs/system/01-master-design-commerce-system.md`
3. `docs/system/02-information-architecture-page-system.md`
4. `docs/system/03-data-model-catalog-schema.md`
5. `docs/system/04-page-by-page-architecture-specifications.md`
6. `docs/system/05-visual-design-system.md`
7. `docs/system/06-high-fidelity-page-design-specifications.md`
8. `docs/system/08-static-visual-prototype-iteration-evaluation.md`
9. the unchanged Iteration 05 package
10. Iteration 02 as historical correction evidence

## Package inventory

| PATH | PURPOSE |
|---|---|
| `index.html` | Package index for ten pages and three studies |
| `fixtures/customer-facing-catalog.json` | Fictional catalog, relationship, and cart truth used by the pages |
| `pages/01-home.html` | Authored house opening, immediate three-division orientation, curation, Learn, and Support |
| `pages/02-vape-nicotine-division.html` | “I want / I own / I need,” one relationship witness, taxonomy, lifecycle, and identification |
| `pages/03-shared-category.html` | Eight-product retail assortment with five resolved, one caution, and two blocker records |
| `pages/04-universal-pdp.html` | Selection-dependent device decision with exact-selection rail and disclosure |
| `pages/05-fitted-component-pdp.html` | Direct physical-fit verdict, conditional adapter route, unknown clearance, and recovery |
| `pages/06-quick-cart.html` | Existing-line revalidation event and route to Full Cart |
| `pages/07-full-cart.html` | Eight-line composed order review with one highest issue expanded |
| `pages/08-thca-division.html` | Concise THCA division route-truth destination |
| `pages/09-glass-accessories-division.html` | Concise Glass & Accessories destination with fit and care guidance |
| `pages/10-search.html` | Whole-house Search with products, category, guidance, relationship, and Support result types |
| `studies/mobile-navigation.html` | Compact closed/open and focus specimens |
| `studies/typography-correction.html` | Archivo-role-system versus Helvetica Neue comparison |
| `studies/state-stress-suite.html` | Excess stale, unavailable, missing-media, and service-error states moved out of principal discovery |
| `shared/prototype.css` | Package-local static responsive presentation |
| `notes/` | Route, continuity, density, balance, typography, media, disclosure, decision, and rendering evidence |
| `screenshots/` | Core, state, comparison, and overview PNG evidence |

## Material corrections

- Every global THCA, Vape & Nicotine, and Glass & Accessories label reaches its named division.
- Global Search and the explicitly named Vape taxonomy utility reach `10-search.html#house-search`; category Search remains explicitly local to Relay M1 parts.
- The THCA taxonomy names edible-format record, proof, and eligibility guidance without promising an unrepresented edible merchandise shelf.
- Home keeps one bounded near-black field while showing all three division routes in the opening decision sequence at wide and compact widths.
- The red dot is replaced by a narrow witness rule; the unmodified logo remains editorial rather than interface decoration.
- Vape retains “I want / I own / I need” while combining lifecycle, identification, and support repetition. Structured lifecycle guidance is present; a separate platform-lifecycle media study remains unproven and production-gated.
- The principal category contains 5 resolved/quiet, 1 caution, and 2 blocker records; excess stress states live in the study.
- The Fitted PDP blocked action is preserved. Quick Cart reports an existing line revalidated after owned-context change, never a false successful Add. Full Cart preserves the line and chronology.
- Archivo is the provisional role-system candidate; only weights 400, 600, 700, and 800 are declared or computed.
- Disabled controls remain readable and never use line-through.
- Universal PDP uses an asymmetrical media/decision proportion and exact-selection rail without hiding the blocker.
- Compact navigation preserves house identity, current context, named Search, Cart, Menu, all three divisions, Learn, and Support.

## Fictional-data and media boundary

All products, prices, inventory, relationships, proof, eligibility, compatibility, fit, and cart records are fictional and begin from package-local `DEMO-` data. Every customer-facing page carries exactly one notice:

> Fictional products, prices, inventory, relationships, and policies for design evaluation only.

Neutral CSS studies support recognition, scale, connection, or context. They do not prove fit, compatibility, proof, eligibility, availability, contents, provenance, or performance. No competitor asset, stock image, invented maker history, or fabricated SKU photograph is used.

## Measured results

The final browser record contains 30 core captures, 20 intermediate-width measurements, 10 scripted state records, and one typography record. All tested records report no horizontal overflow, no console warning/error, controls at least 44 CSS pixels tall, supported computed weights only, and no disabled-control decoration.

At 390 pixels:

| SURFACE | ITERATION 05 | ITERATION 05.1 | RESULT |
|---|---:|---:|---|
| Home | 6,736 px | 6,369 px | Three routes enter the opening; duplicate downstream architecture is retained for explanation, not initial orientation |
| Vape & Nicotine | 6,861 px | 5,827 px | −1,034 px / −15.07%; requested 10–18% reduction met |
| Shared Category | 8,058 px | 7,575 px | Retail mix rebalanced and excess stress records removed |
| Universal PDP | 3,747 px | 3,782 px | Exact fixture package labels added; decision order retained |
| Fitted Component PDP | 3,383 px | 3,315 px | Direct answer remains first |
| Quick Cart | 844 px | 844 px | Fixed-view containment preserved |
| Full Cart | 2,976 px | 2,993 px | Eight lines retained; one issue open |

The three new route-truth pages measure 4,518 px (THCA), 4,430 px (Glass & Accessories), and 3,432 px (Search) at 390.

## Evidence inventory

The final package contains **59 PNGs**:

- 30 core page renders: ten pages at 1440 × 900, 390 × 844, and 320 × 760;
- 11 dedicated state captures: navigation closed/open, expanded disclosures, Home opening, Search, and typography; the required Quick Cart wide/390/320 views are the three Quick Cart core renders;
- 10 Iteration 05 versus 05.1 comparison boards;
- 8 overview boards, including color/grayscale openings, wide and narrow anti-generic Home, route map, assortment balance, typography, and cross-surface continuity.

All ten pages were also measured at 1024 and 901 pixels. `notes/rendering-evidence.json` records the original full-package geometry plus the targeted route-semantics rerun. `notes/image-integrity.json` records decodability, dimensions, hashes, distribution, and exact-duplicate checks. `notes/visual-inspection.json` records the final 59-file evidence set: the nine route-dependent PNGs were reopened after this closeout, while unchanged images retain their prior inspection and received refreshed integrity and hash checks. No blank, duplicate, clipped, stale, broken-media, overflow, or unreadable image remains.

## Validation result

- 10 customer-facing pages, one `h1` and one notice each;
- package index and 3 studies also structurally valid;
- zero duplicate IDs, broken local files, broken fragments, or broken ARIA references;
- zero external scripts or assets;
- zero console warnings/errors;
- zero horizontal overflow at 1440, 1024, 901, 390, and 320, including open compact navigation;
- minimum prominent control height: 44 CSS pixels;
- named Search visible at 320;
- default disclosures closed except Full Cart's one highest-consequence issue;
- font weights limited to 400/600/700/800;
- disabled and incompatible actions have no line-through;
- principal category distribution: 5 resolved / 1 caution / 2 blockers;
- Fitted PDP → Quick Cart → Full Cart identity, variant, owned context, state, price, reason, and event chronology continuous;
- source fixture JSON parses and every visible product/variant ID resolves.

## Remaining production boundaries

Static evidence cannot prove real catalog truth, production typography availability, real media quality, live query behavior, focus trapping/return, background inertness, screen-reader output, zoom/reflow, touch behavior, live cart revalidation, eligibility, compatibility, physical fit, inventory, tax, shipping, or checkout readiness. Those remain future authorization and implementation gates.

## Governing conclusion

Iteration 05.1 receives a conditional pass for the static correction gate. Static architecture is CLOSED after the route-semantics closeout. It closes the material semantic-route, retail-balance, cross-surface continuity, typography-weight, disabled-state, and compact-navigation defects while materially reducing the Home anti-generic risk. Real media, real catalog truth, live interaction, accessibility testing, typography packaging, compatibility, fit, eligibility, inventory, and checkout remain explicit production approval gates.

**Production is NOT APPROVED. Implementation authorization is NOT GRANTED.**
