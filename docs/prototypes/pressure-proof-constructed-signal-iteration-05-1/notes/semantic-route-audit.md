# Iteration 05.1 Semantic Route Audit

**Result:** PASS — zero semantic-route failures.

This audit covers every visible link and CTA. Repeated global links are grouped only when label, promise, destination, and destination heading are identical. Source validation separately confirms that every file and fragment exists.

## Global routes on all customer pages

| SOURCE SURFACE | VISIBLE LABEL | PROMISED DESTINATION TYPE | ACTUAL FILE / FRAGMENT | DESTINATION HEADING | RESULT |
|---|---|---|---|---|---|
| All headers/compact menus/footers | Blowin' Smoke | House Home | `01-home.html` | The shelf answers to judgment. | PASS |
| All headers/compact menus/footers | THCA | THCA division | `08-thca-division.html` | Choose the format. Keep the exact record. | PASS |
| All headers/compact menus/footers | Vape & Nicotine | Vape & Nicotine division | `02-vape-nicotine-division.html` | Start with the job, not the aisle. | PASS |
| All headers/compact menus/footers | Glass & Accessories | Glass division | `09-glass-accessories-division.html` | Start with the piece. Then prove the fit. | PASS |
| All headers/compact menus/footers | Learn | House learning route | `01-home.html#learn` | Bring the label. Bring the measurement. Keep your judgment. | PASS |
| All headers/compact menus/footers | Support | House Support route | `01-home.html#support` | Keep the exact question with you. | PASS |
| All headers/footers | Search | Whole-house utility | `10-search.html` | Results for “Relay M1 pod” | PASS |
| All headers/footers | Cart / Review cart | Full Cart | `07-full-cart.html` | Your cart needs review. | PASS |

## Home

| SOURCE SURFACE | VISIBLE LABEL | PROMISED DESTINATION TYPE | ACTUAL FILE / FRAGMENT | DESTINATION HEADING | RESULT |
|---|---|---|---|---|---|
| Home opening | Choose a division | In-page division explanation | `01-home.html#shop-by-division` | Start with what you came to solve. | PASS |
| Opening strip + division cards | THCA / Enter THCA | THCA division | `08-thca-division.html` | Choose the format. Keep the exact record. | PASS |
| Opening strip + division cards | Vape & Nicotine / Enter Vape & Nicotine | Vape division | `02-vape-nicotine-division.html` | Start with the job, not the aisle. | PASS |
| Opening strip + division cards | Glass & Accessories / Enter Glass & Accessories | Glass division | `09-glass-accessories-division.html` | Start with the piece. Then prove the fit. | PASS |
| Curation | Enter THCA | THCA division | `08-thca-division.html` | Choose the format. Keep the exact record. | PASS |
| Curation | Review Relay M1 packages | Exact device PDP | `04-universal-pdp.html` | Relay M1 Pocket Device | PASS |
| Curation | Check Counterweight fit with this piece | Exact fitted decision | `05-fitted-component-pdp.html` | Counterweight Reclaim Catcher — Long-Neck 14 / 45° | PASS |
| Learn | Identify what you own | Device-identification guidance | `02-vape-nicotine-division.html#identify-device` | Keep the identity through the lifecycle. | PASS |
| Learn | Get fit help | Fitted Support record | `05-fitted-component-pdp.html#support` | Support handoff | PASS |
| Support | Find guidance or support | Search result types | `10-search.html#guidance-results` | Other result types stay named. | PASS |

## Vape & Nicotine

| SOURCE SURFACE | VISIBLE LABEL | PROMISED DESTINATION TYPE | ACTUAL FILE / FRAGMENT | DESTINATION HEADING | RESULT |
|---|---|---|---|---|---|
| Opening | Choose your starting point | Customer-job selector | `#starting-points` | I want. I own. I need. | PASS |
| I want | Review a Relay M1 setup | Exact device PDP | `04-universal-pdp.html` | Relay M1 Pocket Device | PASS |
| I own | Use your device | Owned-device witness | `#owned-device` | The platform is known. The pod record is stale. | PASS |
| I need | Find a replacement | Parts category | `03-shared-category.html` | For the Relay M1 you own. | PASS |
| Relationship | Review identification guidance | Identification/lifecycle | `#identify-device` | Keep the identity through the lifecycle. | PASS |
| Taxonomy | Devices | Device-start route | `#i-want` | A complete starting setup | PASS |
| Taxonomy | Pods & cartridges / Coils & parts / Consumables / Accessories | Parts discovery | `03-shared-category.html#results` | Identity first. Consequence where it matters. | PASS |
| Taxonomy | Disposables / Start a whole-house search | Whole-house Search utility | `10-search.html` | Results for “Relay M1 pod” | PASS |
| Identification | Browse with owned context | Owned-context category | `03-shared-category.html#owned-context` | Relay M1 Refillable Device | PASS |
| Identification | Get identification help | House Support | `01-home.html#support` | Keep the exact question with you. | PASS |

## Shared Category

| SOURCE SURFACE | VISIBLE LABEL | PROMISED DESTINATION TYPE | ACTUAL FILE / FRAGMENT | DESTINATION HEADING | RESULT |
|---|---|---|---|---|---|
| Breadcrumb | Vape & Nicotine | Parent division | `02-vape-nicotine-division.html` | Start with the job, not the aisle. | PASS |
| Owned context | Open device identification guidance | Guidance | `02-vape-nicotine-division.html#identify-device` | Keep the identity through the lifecycle. | PASS |
| Charging cable | Review the device package | Setup/package record | `04-universal-pdp.html#setup-support` | Setup & support | PASS |
| Pod cards | Find exact pod/revision records | Exact Search product group | `10-search.html#product-results-title` | Normal results first. | PASS |
| Sleeve | Review the device context | Exact device PDP | `04-universal-pdp.html` | Relay M1 Pocket Device | PASS |
| Axis + Forge | Identify exact/another device | Identification guidance | `02-vape-nicotine-division.html#identify-device` | Keep the identity through the lifecycle. | PASS |
| Restricted item | Get help with this restricted line | Exact-record Support guidance | `#category-support` | Keep the device, candidate part, and unresolved fact together. | PASS |
| Adapter | Review selected owned context | Current owned-context record | `#owned-context` | Relay M1 Refillable Device | PASS |
| Category Support | Identify what you own | Identification guidance | `02-vape-nicotine-division.html#identify-device` | Keep the identity through the lifecycle. | PASS |

## Universal and Fitted PDPs

| SOURCE SURFACE | VISIBLE LABEL | PROMISED DESTINATION TYPE | ACTUAL FILE / FRAGMENT | DESTINATION HEADING | RESULT |
|---|---|---|---|---|---|
| Universal breadcrumb | Vape & Nicotine | Parent division | `02-vape-nicotine-division.html` | Start with the job, not the aisle. | PASS |
| Universal breadcrumb/footer | Devices / Return to devices | Device-start route | `02-vape-nicotine-division.html#i-want` | A complete starting setup | PASS |
| Universal decision | Choose a package | In-page package options | `#package-options` | Choose a package | PASS |
| Universal footer | Setup & support | In-page disclosure | `#setup-support` | Setup & support | PASS |
| Fitted breadcrumb | Glass & Accessories | Parent division | `09-glass-accessories-division.html` | Start with the piece. Then prove the fit. | PASS |
| Fitted decision | How to measure | Measurement method | `#measurement-method` | Measurement method | PASS |
| Fitted footer | Support | Exact Support handoff | `#support` | Support handoff | PASS |

## Quick Cart, Full Cart, THCA, Glass, and Search

| SOURCE SURFACE | VISIBLE LABEL | PROMISED DESTINATION TYPE | ACTUAL FILE / FRAGMENT | DESTINATION HEADING | RESULT |
|---|---|---|---|---|---|
| Quick Cart | View Full Cart | Full order review | `07-full-cart.html` | Your cart needs review. | PASS |
| Quick Cart | Continue shopping | Glass division | `09-glass-accessories-division.html` | Start with the piece. Then prove the fit. | PASS |
| Full Cart | Review fit decision | Fitted decision | `05-fitted-component-pdp.html` | Counterweight Reclaim Catcher — Long-Neck 14 / 45° | PASS |
| Full Cart | Open whole-house Search | Search utility; exact Relay M0 name remains in preceding copy | `10-search.html` | Results for “Relay M1 pod” | PASS |
| Full Cart | Open device identification / package / measurement / Support result | Named recovery destinations | respective exact fragments | respective named headings | PASS |
| THCA taxonomy/products | Flower, Pre-rolls, Concentrates, exact record guidance | THCA shelf/proof guidance | `#thca-products`, `#proof-guidance` | Balanced products before proof claims. / Current proof is scoped. | PASS |
| THCA taxonomy | Edibles / Review record requirements | Proof/eligibility requirements, not nonexistent inventory | `#proof-guidance` | Current proof is scoped. Eligibility is another question. | PASS |
| Glass taxonomy/products | Complete pieces, fitted parts, care, fit guidance | Relevant shelf or guidance | `#glass-products`, `#care-guidance`, `#measure-guide` | Named matching sections | PASS |
| Search products | Open exact product / revision | Exact card fragments | `03-shared-category.html#product-v10a`, `#product-v08c` | Exact matching product cards | PASS |
| Search result types | Category / Guidance / Relationship / Support | Corresponding category or guidance surface | named files/fragments | matching destination content | PASS |

`aria-current="page"` is used only when the link resolves to the actual current page in customer-facing pages and the matching Full Cart study specimen. Parent-division context is expressed through visible current-location text, not a false page claim.

