# Glossier Balm Dotcom PDP — Final Design DNA Specification

**Prepared for:** Blowin' Smoke design, product, and engineering teams  
**Status:** Final PDP research synthesis  
**Purpose:** Define a transferable product-experience system without reproducing Glossier's brand, category conventions, or trade dress  
**Companion specification:** [01-homepage-final-design-dna.md](./01-homepage-final-design-dna.md)

## Evidence base

1. Blowin' Smoke — *Article I: Brand Philosophy*, Version 1.0.
2. *Glossier Homepage — Final Design DNA Specification*.
3. Glossier Balm Dotcom PDP — raw Firecrawl structural Markdown.
4. Glossier Balm Dotcom PDP — recovered forensic audit.

## Evidence key

- **OBSERVED** — Directly supported by the structural capture or a successfully completed live inspection.
- **TECHNICALLY CONFIRMED** — Supported by direct technical evidence recorded in the recovered audit.
- **INFERRED** — Reasonably suggested but not directly verified.
- **NOT DETERMINABLE** — The supplied evidence does not establish an answer.

The raw capture contains repeated subscription, gallery, product-card, and review content. Those repetitions are capture artifacts, not evidence of intentional repeated modules. Browser-extension and `ERR_BLOCKED_BY_CLIENT` blocks are excluded from the architecture. Failed code executions, interrupted inspections, and the audit's proposed follow-up steps are not treated as evidence.

## Governing design position

The PDP must help a customer make a sound product decision before it attempts to increase basket size. For Blowin' Smoke, “premium” means informed selection, visible product truth, culturally credible context, respectful commerce, and dependable performance. The customer should feel that they discovered an independent advantage—not that they entered a beauty retailer or a generic smoke shop with an “edgy” skin.

---

# 1. PDP Information Architecture

## Reconstructed hierarchy

| Order | System | Decision role | Evidence |
|---|---|---|---|
| 1 | Global utility and navigation | Preserve site orientation, promotion/shipping context, search, account, and cart access | Homepage system **OBSERVED**; PDP skip and announcement content **OBSERVED** |
| 2 | Product media and purchase panel | Establish the item and support the immediate purchase decision | **OBSERVED** |
| 3 | Product identity | Title, rating/review route, badges, and current price establish recognition and social context | **OBSERVED** |
| 4 | Variant choice | Twelve named options combine swatch, label, and short variant description | **OBSERVED** |
| 5 | Purchase method | Separate one-time purchase from subscription | **OBSERVED** |
| 6 | Subscription detail and frequency | Explain savings/terms and expose one- through five-month replenishment intervals | **OBSERVED** |
| 7 | Purchase action | State-aware Add to Bag or notification behavior, with price in the CTA | **OBSERVED** |
| 8 | Transaction constraints | Customer quantity limit and installment-payment messaging qualify the purchase | **OBSERVED** |
| 9 | Concise product explanation | Short promise, expanded description, volume, attributes, and policy/ethics claim | **OBSERVED** |
| 10 | Save With Sets | Present the product inside contextual bundles with contents and explicit savings | **OBSERVED** |
| 11 | Extended product gallery | Provide product and lifestyle imagery plus pagination, arrows, and an “Open gallery modal” trigger | **OBSERVED** |
| 12 | Ingredients | Move from formula summary to named ingredients, explanations, and a full-list route | **OBSERVED** |
| 13 | Studies/proof | Present a headline claim, quantified study responses, and a full-trial route | **OBSERVED** |
| 14 | How to use | Convert product claims into concrete usage steps | **OBSERVED** |
| 15 | Editorial/UGC | Show people, context, and campaign language around the selected product | **OBSERVED** |
| 16 | Related campaign collection | Reconnect campaign context to a shoppable collection | **OBSERVED** |
| 17 | Related products | Offer individual items and sets with prices, variants, states, and actions | **OBSERVED** |
| 18 | Reviews | Aggregate rating, search/sort, review writing, buyer metadata, helpfulness, and progressive loading | **OBSERVED** structurally |

## Why the order works

The page resolves questions in increasing depth:

1. **What is it?** Product identity, current variant, gallery, rating, and price.
2. **Which one is right?** Variant names, swatches, and descriptions.
3. **How do I buy it?** One-time or subscription, frequency, action, limit, and payment information.
4. **Why should I trust it?** Description, attributes, ingredients, study claims, and instructions.
5. **How does it fit a broader context?** Sets, lifestyle/editorial content, collection, and related products.
6. **What do customers report?** Aggregate and individual review evidence.

The progression keeps essential decision information near the action and lets deeper education appear when the customer is ready for substantiation. The precise desktop column geometry, purchase-panel stickiness, and mobile ordering are **NOT DETERMINABLE**.

---

# 2. Purchase Panel Design DNA

## Hierarchy and density

The live panel exposes product title, rating/review route, product and variant badges, current price, variant controls, purchase method, subscription details/frequency, Add to Bag, payment messaging, and short descriptive content. **OBSERVED.** It is information-dense, but the density follows dependency rather than equal emphasis.

### Must remain visible at the purchase decision

- product name;
- current price;
- current option and the attribute needed to understand it;
- stock/eligibility state;
- selected purchase method;
- primary action;
- any customer quantity limit;
- concise trust or restriction facts that materially change the decision.

This visibility rule is a Blowin' Smoke requirement derived from Glossier's transaction clarity and the Constitution's “respect over manipulation.”

### May be progressively disclosed

- full subscription terms;
- long description;
- complete composition or ingredient list;
- detailed proof methodology;
- extended instructions;
- secondary payment explanation;
- nonessential campaign context.

## Action hierarchy

- “Add to bag $16” is the active main-product CTA in the observed state. **OBSERVED.**
- The current price is included in its label. **OBSERVED.**
- “Notify me” exists structurally, but the live audit did not observe it as the active main-product action; all tested Balm Dotcom variants appeared available. **OBSERVED.**
- A related sold-out sticker product uses “Notify me,” confirming the broader availability pattern but not the main product's exact unavailable transition. **OBSERVED.**
- Afterpay messaging and a Learn More dialog trigger sit as secondary financial information. **OBSERVED.**

## Progressive disclosure

- Subscription “Details” opens explanatory content stating the saving, replenishment benefit, and ability to reschedule, skip, or cancel. **OBSERVED.**
- The short product copy exposes “Show More.” **OBSERVED** structurally; the live expansion behavior is **NOT DETERMINABLE**.
- Full ingredients and clinical-trial routes exist. **OBSERVED** structurally; whether they expand, navigate, or open a layer is **NOT DETERMINABLE**.

## Trust balance

Operational trust comes from price, selected state, interval choices, limit disclosure, availability, payment terms, and cancellation language. Promotional persuasion comes from “Best Seller,” “New,” savings, product claims, and campaign framing. **OBSERVED.** The panel works because operational facts remain close to the action rather than being displaced by persuasion.

---

# 3. Variant System

## Taxonomy

Twelve options are present: I Love NY, Black Cherry, Birthday, Strawberry, Original, Mint, Mango, Rose, Coconut, Wild Fig, Lavender, and Espresso. **OBSERVED.** Each option is represented by a radio-style control with swatch and label text. **OBSERVED.** The selected I Love NY state also exposes a variant-specific “New” badge and a concise sensory/appearance description. **OBSERVED.**

## Confirmed relationships

| Relationship | Finding | Evidence |
|---|---|---|
| Selection → selected state | Clicking Original or Birthday selects that radio option | **OBSERVED** |
| Selection → URL | Original updates the URL to variant ID `46731566088437`; Birthday updates to `46731565891829` | **TECHNICALLY CONFIRMED** |
| Selection → gallery | Original loads Original-specific assets; Strawberry loads Strawberry-specific lifestyle imagery | **OBSERVED** |
| Selection → price | Tested options remained $16 | **OBSERVED** |
| Selection → CTA | Strawberry did not change the CTA | **OBSERVED** |
| Selection → availability | All tested main-product variants appeared available | **OBSERVED** |
| Selected variant → description | Variant labels include descriptive text; selected I Love NY description is exposed | **OBSERVED** |
| Selected variant → badge | I Love NY exposes a variant-specific New badge | **OBSERVED** |

## Unknown relationships

- URL synchronization was technically confirmed for Original and Birthday, not every variant. Universal behavior is **INFERRED**.
- Gallery synchronization was observed for Original and Strawberry, not all twelve variants. Universal behavior is **INFERRED**.
- Price synchronization logic for differently priced variants cannot be tested because observed options shared one price. **NOT DETERMINABLE.**
- CTA synchronization under unavailable or restricted main-product variants is **NOT DETERMINABLE**.
- Badge appearance/disappearance across every option is **NOT DETERMINABLE**.
- Browser back/forward restoration, share-link hydration, analytics events, and server/client state ownership are **NOT DETERMINABLE**.

## General product-option state model

```text
PRODUCT
  → OPTION GROUP
    → SELECTED OPTION
      → OPTION ID / SHAREABLE URL
      → OPTION-SPECIFIC MEDIA SET
      → OPTION-SPECIFIC FACTS
      → PRICE
      → AVAILABILITY / ELIGIBILITY
      → BADGES
      → VALID PURCHASE METHODS
      → PRIMARY ACTION
```

All downstream values should resolve from one selected option state. A change should be atomic: the interface must not show media for one option, price for another, and an action for a third.

---

# 4. Product Media System

## Observed system

- The primary media area uses a large product or lifestyle image. **OBSERVED.**
- Six page dots were visible in the live primary gallery. **OBSERVED.**
- Left and right chevrons are present; the left control is disabled on the first slide. **OBSERVED.**
- Variant selection immediately replaces the active gallery assets. **OBSERVED.**
- Lifestyle images identify people wearing specific variants. **OBSERVED.**
- The structural capture exposes a longer sequence of product and lifestyle images, an indexed “1 / 11” state, arrows, and “Open gallery modal.” **OBSERVED.**
- No native video element or video iframe was detected in the inspected primary gallery. **OBSERVED.** This does not prove that every variant or deferred slide lacks GIF or motion media.

## Evidence reconciliation

The live six-dot gallery and structurally exposed eleven-item indexed gallery may represent a preview and expanded media set, different rendering states, or capture duplication. Their exact relationship is **NOT DETERMINABLE**. The safe system conclusion is that the PDP supports a navigable primary gallery, variant-specific asset sets, and a structural trigger for an expanded gallery layer.

## Gallery modal boundary

“Open gallery modal” is direct structural evidence that a modal trigger exists. **OBSERVED.** The modal was not opened in the completed audit. Its geometry, focus behavior, close controls, zoom, thumbnails, swipe support, captions, animation, and selected-slide continuity are **NOT DETERMINABLE**.

## Media sequencing principle

A transferable sequence is:

1. recognizable product view;
2. option-specific proof;
3. scale or application/context;
4. material, texture, connection, or package detail;
5. contents or compatibility evidence;
6. secondary editorial imagery.

This is a Blowin' Smoke design requirement, not a claim that Glossier uses that exact universal order.

## Unknowns

Zoom behavior, lightbox implementation, media transition, exact animation, hidden video/GIF content, lazy loading, `srcset` behavior on this PDP, breakpoints, mobile gallery layout, swipe behavior, and responsive purchase/media ordering are **NOT DETERMINABLE**.

---

# 5. Purchase Model

Glossier separates four concepts that commerce systems often collapse:

| Layer | Question | Observed implementation |
|---|---|---|
| Product choice | Which variant do I want? | Twelve radio/swatches with labels and descriptions — **OBSERVED** |
| Purchase method | Do I want one-time or subscription? | Separate one-time and “Subscribe and save 10%” options — **OBSERVED** |
| Purchase frequency | If subscribing, how often? | One through five months — **OBSERVED** |
| Purchase action | What happens now? | “Add to bag $16” in the available state — **OBSERVED** |

## One-time purchase

The option exists. **OBSERVED.** Whether it is the technical default after every new session is **NOT DETERMINABLE** from the completed audit.

## Subscription

- Subscription offers 10% savings. **OBSERVED.**
- Details state that orders can be rescheduled, skipped, or cancelled. **OBSERVED.**
- A Learn More route exists. **OBSERVED.**
- Frequency options span every month through every five months. **OBSERVED.**
- Exact subscription price rendering, default interval, eligibility by variant/market, cart representation, and subsequent management flow are **NOT DETERMINABLE**.

## Add to Bag

- The main button is active because an option is already selected in the observed state. **OBSERVED.**
- Its label includes the price. **OBSERVED.**
- Hover changes the pointer and produces a font-size transition. **OBSERVED.** The audit reported an exact CSS transition value, but it was not classified as technically confirmed; the exact value is therefore not adopted here.
- Post-click cart behavior was not completed in this PDP audit. The homepage audit observed quick add opening the cart drawer, but identical PDP behavior is **INFERRED**, not confirmed here.

## Limits, installments, and unavailable states

- Quantity is limited to 20 per customer. **OBSERVED** structurally. Client- versus server-side enforcement is **NOT DETERMINABLE**.
- Four interest-free payments of $4 are shown for the $16 state, with Afterpay and a Learn More trigger. **OBSERVED.**
- “Notify me” exists in the structural purchase source, but the active main-product unavailable state was not observed. **NOT DETERMINABLE** for Balm Dotcom behavior.

The transferable principle is dependency order: choose product → choose method → choose frequency if required → act. Price, eligibility, and availability qualify each layer.

---

# 6. Product Education System

## Progressive depth

| Depth | Content | Role | Evidence |
|---|---|---|---|
| Immediate | Variant description, price, badges, CTA | Support selection and action | **OBSERVED** |
| Concise | One-line promise and short product description | Explain the proposition in plain language | **OBSERVED** |
| Scannable facts | Volume, Moisturizing, Nourishing, cruelty-free statement | Support quick qualification | **OBSERVED** |
| Ingredient overview | Formula summary plus four named ingredient explanations | Explain composition and function | **OBSERVED** |
| Full disclosure | Full ingredients-list route | Provide deeper transparency | **OBSERVED** structurally |
| Proof | Clinical headline, quantified responses, full-trial route | Substantiate claims | **OBSERVED** structurally |
| Use | Three ordered instructions | Translate product properties into behavior | **OBSERVED** |
| Supporting media | Product, lifestyle, ingredient, and highlight imagery | Reinforce recognition and context | **OBSERVED** |

Information depth increases down the page while the purchase panel keeps only the minimum needed to choose and act. This prevents the primary action from being buried without withholding substantiation.

For Blowin' Smoke, the same architecture must change its content type by division. Ingredient-style storytelling is not a universal template; factual composition, device compatibility, material, dimensions, included parts, lab documents, restrictions, and care replace it where relevant.

---

# 7. Trust & Proof System

## Operational trust

Operational trust answers whether the transaction and product state are understandable:

- exact current price and price-bearing CTA — **OBSERVED**;
- selected option state — **OBSERVED**;
- URL synchronization for two tested variants — **TECHNICALLY CONFIRMED**;
- available subscription intervals and cancellation language — **OBSERVED**;
- quantity/customer limit — **OBSERVED** structurally;
- installment amount and Learn More trigger — **OBSERVED**;
- availability and notification patterns — **OBSERVED** across the source, with main-product unavailable transition **NOT DETERMINABLE**;
- full ingredient and trial routes — **OBSERVED** structurally;
- usage instructions — **OBSERVED**.

## Promotional persuasion

Promotional persuasion creates preference:

- Best Seller and New badges — **OBSERVED**;
- subscription and set savings — **OBSERVED**;
- benefit statements and “cult-favorite” framing — **OBSERVED**;
- clinical claims and response percentages — **OBSERVED** structurally;
- campaign imagery and language — **OBSERVED**;
- aggregate rating and review count — **OBSERVED**.

## Social proof

- Aggregate total: 10,714 reviews. **OBSERVED** in the capture.
- Displayed average: 4.5, with exact recorded rating 4.451372. **OBSERVED.**
- Individual reviews expose Verified Buyer status. **OBSERVED.**
- Review cards include rating, title, body, date, name/location, product-category metadata, recommendation response, and helpful vote counts. **OBSERVED.**

The design principle is proof layering: operational truth first, product substantiation second, and customer reports third. Promotional statements should never replace eligibility, compatibility, composition, or availability facts.

---

# 8. Sets, Bundles & Cross-Selling

## Save With Sets anatomy

Three contextual sets are exposed:

| Set | Relationship | Savings evidence | Actions |
|---|---|---|---|
| Balm + Line Duo | Primary item plus a complementary product | Save 11%; $32 versus $36 — **OBSERVED** | Add to Bag, Notify me source state, See full page |
| In A New York Minute Set | Primary item inside a larger coordinated set | Save 17%; $70 versus $84 — **OBSERVED** | Add to Bag, Notify me source state, See full page |
| The Glossier Icons | Primary item inside a flagship assortment | Save 38%; $65 versus $105 — **OBSERVED** | Add to Bag, Notify me source state, See full page |

Each set exposes its included products and selected variants. **OBSERVED.** At least some included items have configuration cues. **OBSERVED.** The exact dependency rules, validation, partial availability behavior, and whether Add to Bag requires unresolved choices are **NOT DETERMINABLE**.

## Why it is stronger than generic recommendations

“Save With Sets” answers three questions a generic recommendation row often leaves unresolved:

1. Why are these items together?
2. What exactly is included?
3. What is the combined value?

The full-page route supports customers who need more detail, while the inline action serves resolved bundles. This creates a reasoned cross-sell rather than an arbitrary adjacency.

## Limitation

The observed relationships are cosmetics-specific and sometimes campaign-driven. Blowin' Smoke should carry over transparent composition, verified compatibility, clear savings, and state-aware action—not the bundle contents or beauty logic.

---

# 9. Editorial Commerce

The PDP moves from product instruction back into desire and discovery:

- Lifestyle imagery shows named people wearing variants. **OBSERVED.**
- “Get the Look” uses three UGC/editorial images and short campaign captions. **OBSERVED.**
- The related I Love NY collection provides a “Shop all” route. **OBSERVED.**
- A broad related-product assortment reconnects the campaign to sets, complementary items, accessories, and other categories. **OBSERVED.**

The system does not end education at a dead end. After ingredients, proof, and use, it shows the product in social/editorial context and then reopens commerce.

For Blowin' Smoke, editorial commerce should be based on real operator knowledge, makers, builders, product standards, setup logic, care, material craft, and authentic community relationships. Beauty routines, “Get the Look,” cosmetic application imagery, and campaign language are forbidden transfers.

---

# 10. Reviews System

## Aggregate and entry layer

- Reviews heading, “Write a review,” 10,714 total reviews, displayed 4.5 average, and exact 4.451372 rating are present. **OBSERVED.**
- The purchase panel includes a jump-to-reviews link. **OBSERVED.**
- Rating distribution bars or per-star counts are not exposed in the supplied capture. **NOT DETERMINABLE.**

## Discovery controls

- Keyword/question search input and Search action are present. **OBSERVED** structurally.
- Sort choices are Newest first, Highest rating, Lowest rating, and Most helpful. **OBSERVED** structurally.
- “Newest first” appears as the displayed selection. **OBSERVED** structurally.
- Search results, empty states, sort transitions, URL state, and control behavior were not live-tested. **NOT DETERMINABLE**.

## Review-card anatomy

- date;
- reviewer name and optional location;
- Verified Buyer indicator;
- rating;
- review title and body;
- product-specific metadata: skin type, skin shade, and age range;
- bottom-line recommendation response;
- upvote/downvote counts.

All are **OBSERVED** in the structural capture. The repeated copies of review fields are capture duplication, not multiple intentional versions of the same review.

## Review submission

The form exposes required score, review title, review, name, and email; optional location; beauty-specific profile metadata; and a yes/no recommendation field. **OBSERVED** structurally. It also exposes a thank-you state and social-sharing links. **OBSERVED** structurally. Validation behavior, moderation, verification, privacy treatment, submission transport, and success focus behavior are **NOT DETERMINABLE**.

## Progressive loading and helpfulness

Four review cards appear in the captured loaded state, followed by “Load more.” **OBSERVED.** Helpful voting counts and up/down controls are exposed. **OBSERVED.** Load behavior, vote authentication, abuse prevention, optimistic feedback, and terminal state are **NOT DETERMINABLE**.

## Trust function

The system supports four trust tasks: understand aggregate sentiment, find relevant language, inspect reviewer context, and distinguish verified buyers. Blowin' Smoke should retain those tasks while replacing beauty-specific metadata with division-relevant context and protecting customer privacy.

---

# 11. Interaction & State System

## Product state

```text
Loaded product
  → identity, aggregate rating, base/current price, product badge
  → selected option exists
  → valid purchase controls appear
```

Initial selected option was I Love NY in the audited state. **OBSERVED.** Whether that is a universal default, campaign default, persisted choice, or URL-driven choice is **NOT DETERMINABLE**.

## Variant state

```text
Default selected option
  → user selects another radio option
  → selected styling changes                         OBSERVED
  → URL variant parameter changes                    TECHNICALLY CONFIRMED for Original/Birthday
  → gallery asset set changes                        OBSERVED for Original/Strawberry
  → price re-resolves                                OBSERVED unchanged in tested states
  → badge/description/availability/CTA re-resolve    PARTIAL / NOT DETERMINABLE universally
```

## Purchase-method state

```text
One-time option ↔ Subscription option
Subscription option → details + frequency requirement
```

Both methods and subscription detail controls are **OBSERVED**. Default selection, price update, disabled states, and method persistence are **NOT DETERMINABLE**.

## Subscription-frequency state

```text
Subscription selected
  → frequency combobox
  → 1 / 2 / 3 / 4 / 5 months
  → selected interval qualifies purchase
```

Frequency choices are **OBSERVED**. Default interval, required-state validation, and cart-line representation are **NOT DETERMINABLE**.

## Media-gallery state

```text
First media selected; previous disabled            OBSERVED
  → next/previous or pagination selection
  → selected media changes                         interaction existence OBSERVED
Variant changes
  → gallery asset set changes                      OBSERVED
Open gallery modal trigger
  → expanded layer                                 trigger OBSERVED; resulting state NOT DETERMINABLE
```

## Add-to-Bag state

```text
Available + selected option → active “Add to bag $16”   OBSERVED
Hover → pointer + typographic transition                 OBSERVED
Click → add trigger                                      OBSERVED as available control
Post-click success/error/cart behavior                   NOT DETERMINABLE in PDP audit
```

## Availability state

```text
Available → Add to Bag
Unavailable/coming soon → Notify me
Sold out related product → Sold out + Notify me
```

Available main-product state and sold-out related-product state are **OBSERVED**. The main-product transition and per-option partial availability are **NOT DETERMINABLE**.

## Bundle state

```text
Bundle card
  → included products + current included variants
  → savings + current/original price
  → configure if necessary
  → Add to Bag / Notify me / See full page
```

Structure and actions are **OBSERVED**. Configuration validation, synchronized option changes, partial stock, and post-add behavior are **NOT DETERMINABLE**.

## Review state

```text
Aggregate state
  → search or sort controls
  → loaded review list
  → helpful vote or Load more
Write review
  → required/optional fields
  → submission
  → thank-you/share state
```

Controls and source states are **OBSERVED** structurally. Their transitions and failure states are **NOT DETERMINABLE**.

## Expandable-content state

- Subscription Details was opened successfully and exposed explanatory text. **OBSERVED.**
- Product “Show More,” full ingredients, full clinical trial, Afterpay Learn More, and gallery modal triggers exist. **OBSERVED** structurally.
- Their exact layer type, animation, focus handling, and close behavior are **NOT DETERMINABLE**.

---

# 12. PDP Component Inventory

| COMPONENT NAME | PURPOSE | OBSERVED GLOSSIER BEHAVIOR | UNDERLYING PRINCIPLE | BLOWIN' SMOKE APPLICATION | PRIORITY | CONFIDENCE | DIVISION IMPACT | DO NOT COPY |
|---|---|---|---|---|---|---|---|---|
| Global utility/header | Preserve orientation and transaction access | PDP exposes skip/announcement content; homepage audit defines sticky navigation — **OBSERVED** | Product decisions should not strand global utilities | Retain skip, three divisions, search, account, cart, and truthful utility messaging | Core | High | THCA: eligibility route; Vape: search/compatibility; Glass: category/cart | Glossier alignment, centered logo, promotion, colors, or sticky proportions |
| Product media stage | Establish recognition and evidence | Large media, dots, arrows, disabled previous, variant asset swap — **OBSERVED** | Media is part of option state | Use role-based sequences for pack, scale, detail, contents, compatibility, material, and context | Core | High | THCA: pack/factual detail; Vape: ports/components; Glass: scale/material/joints | Exact gallery geometry, dots, arrows, crops, or lifestyle direction |
| Gallery-modal trigger | Offer expanded inspection | “Open gallery modal” appears — **OBSERVED**; resulting layer **NOT DETERMINABLE** | Deep inspection should not overload the base page | Candidate expanded viewer with accessible focus and option continuity if user need is validated | Optional | Medium | THCA: label/document detail; Vape: interface/port detail; Glass: craft/connection detail | Unobserved Glossier modal, zoom, animation, or control placement |
| Purchase-panel shell | Coordinate identity, option, method, price, trust, and action | Dense above-fold purchase system — **OBSERVED** | Dependency order reduces errors | Shared shell with controlled division-specific evidence slots | Core | High | THCA: composition/eligibility; Vape: compatibility/restrictions; Glass: dimensions/material | Beauty hierarchy, exact columns, spacing, or sticky behavior |
| Product identity block | Name and qualify the item | Title, rating route, badges, price — **OBSERVED** | Recognition precedes configuration | Show name, division, product type, price, rating when valid, and critical state | Core | High | THCA: product type; Vape: brand/model; Glass: maker/type | Glossier typography, badge styling, or exact order as trade dress |
| Aggregate-rating link | Provide social proof and fast review access | Exact rating plus jump-to-reviews — **OBSERVED** | Summary should lead to evidence | Show average/count only with sufficient verified data and a direct review route | Supporting | High | THCA: product reports; Vape: reliability/fit; Glass: quality/craft | Glossier rating styling, precision display, or beauty metadata |
| Badge system | Signal product/option state | Best Seller at product level; New at option level — **OBSERVED** | State labels require scope | Separate product, option, availability, and restriction badges with precedence | Supporting | High | THCA: New/limited factual state; Vape: model/state; Glass: maker/drop state | Sticker graphics, vocabulary, stacked hype, or unsupported popularity |
| Option selector | Choose a sellable option | Twelve radio/swatch controls with labels — **OBSERVED** | Options are explicit state, not decorative swatches | Use text-first controls with visual support and clear selected/disabled states | Core | High | THCA: form/quantity; Vape: strength/flavor/capacity as allowed; Glass: size/color/joint | Cosmetic swatches, circular styling, or color-only meaning |
| Option description | Explain the selected option | Variant labels include concise description — **OBSERVED** | Selection needs decision context | Pair each option with the fact needed to distinguish it | Core | High | THCA: factual composition; Vape: flavor/strength/capacity; Glass: material/connection | Beauty sensory voice or unsupported effect language |
| Purchase-method selector | Separate one-time from recurring order | One-time and subscribe/save options — **OBSERVED** | Product choice differs from commercial relationship | Only expose recurring purchase where legally, operationally, and behaviorally appropriate | Supporting | Medium | THCA: replenishables subject to policy; Vape: consumables where permitted; Glass: generally limited relevance | Glossier toggle layout, saving language, or universal subscription assumption |
| Subscription disclosure | Explain benefits and terms | Details opens saving/cancel text; Learn More route — **OBSERVED** | Recurring commitment requires transparency | State saving, billing, shipment, skip/cancel, eligibility, and management terms before action | Supporting | High | THCA: policy-dependent; Vape: replenishment terms; Glass: care consumables only | Exact accordion, copy, cadence, or 10% offer |
| Frequency selector | Choose replenishment interval | One through five months — **OBSERVED** | Frequency is separate from method | Offer only intervals supported by actual use and inventory; require explicit selection | Supporting | Medium | THCA: product-dependent; Vape: consumables; Glass: cleaning supplies only | Glossier interval range, combobox appearance, or default |
| Price block | Make current cost and value legible | $16; bundle sale/original prices; installment amount — **OBSERVED** | Price follows selected state | Resolve unit/current/regular/subscription/bundle price from one option state | Core | High | THCA: quantity/unit; Vape: capacity/count; Glass: item/set | Glossier typography, strike-through treatment, or financing placement |
| Primary purchase CTA | Execute a valid purchase | “Add to bag $16,” active with selected option — **OBSERVED** | Action reflects readiness and price | Include resolved price where useful; disable or replace action when state is incomplete/ineligible | Core | High | THCA: eligibility; Vape: compatibility/required choices; Glass: option completeness | Label, sharp black styling, font-size hover, or motion timing |
| Availability/notification control | Preserve interest when purchase is unavailable | Notify pattern present; sold-out related item confirmed — **OBSERVED** | Impossible actions require honest alternatives | Distinguish unavailable, coming soon, restricted destination, and discontinued | Core | High | THCA: jurisdiction/stock; Vape: restriction/stock; Glass: maker stock | Glossier scarcity copy, notification UI, or treating restriction as scarcity |
| Quantity-limit notice | State purchase constraint | Limited to 20 per customer — **OBSERVED** structurally | Constraints belong near action | Show factual per-order/customer limits and explain material restrictions when needed | Core | High | THCA: regulatory/inventory; Vape: regulatory/inventory; Glass: limited-maker stock | Exact limit, wording, or unverified enforcement behavior |
| Payment-information disclosure | Explain installment option | Four payments and Afterpay Learn More trigger — **OBSERVED** | Financing must be transparent and secondary | Show only available lawful payment terms without obscuring total cost | Optional | Medium | THCA: policy-dependent; Vape: policy-dependent; Glass: higher-ticket utility | Afterpay branding/layout, installment cadence, dialog, or persuasion priority |
| Concise-description block | Explain proposition without delaying action | One-line claim, short paragraph, Show More — **OBSERVED** | Summary first, depth on demand | Use factual summary plus expandable detail; avoid therapeutic/effect claims | Core | High | THCA: product truth; Vape: function; Glass: function/craft | Glossier voice, “cult” framing, or beauty benefit language |
| Attribute list | Support rapid qualification | Volume plus two benefit attributes and cruelty-free statement — **OBSERVED** | Scannable facts reduce uncertainty | Division-specific essential facts with consistent label/value grammar | Core | High | THCA: form/quantity/composition; Vape: model/capacity/strength/compatibility; Glass: material/dimensions/joint | Cosmetics attributes or unsubstantiated badges |
| Save With Sets module | Cross-sell with reason and value | Contents, selected variants, savings, add/notify/full-page actions — **OBSERVED** | Composition and value beat generic adjacency | Build verified setup, compatible, replenishment, or care bundles | Supporting | High | THCA: permitted combinations; Vape: compatible kits; Glass: complete setup/care | Exact sets, savings cadence, carousel/card design, or beauty logic |
| Ingredient/composition explainer | Explain what the item contains | Summary, four ingredients, function explanations, full list — **OBSERVED** | Composition proof scales from scan to depth | Use factual composition/lab model for THCA; material/component model for other divisions | Core | High | THCA: composition/lab; Vape: ingredients/components where applicable; Glass: material | Ingredient-card trade dress, health claims, or beauty language |
| Study/proof module | Substantiate product claims | Clinical headline, percentages, full trial route — **OBSERVED** structurally | Claims should connect to evidence | Use lab documents, standards, compatibility tests, specifications, provenance, or care evidence | Core | High | THCA: lab documentation; Vape: technical/safety specifications; Glass: material/craft provenance | Clinical-beauty framing, percentages, layout, or unsupported equivalence |
| How-to-use module | Convert facts into safe action | Three ordered usage steps — **OBSERVED** | Instruction completes the product promise | Give concise setup/use/care guidance and route to deep education | Core | High | THCA: responsible factual use; Vape: setup/compatibility; Glass: assembly/care | Beauty routine, Glossier voice, or unsupported safety assurance |
| Editorial/UGC module | Add human and cultural context | “Get the Look,” named people, campaign captions — **OBSERVED** | Context can reconnect education to discovery | Use authentic operator, maker, builder, and customer stories with consent and product relevance | Supporting | High | THCA: standards/community; Vape: firsthand knowledge; Glass: maker/craft | “Get the Look,” beauty imagery, campaign language, or staged street culture |
| Related collection | Continue a coherent discovery path | Campaign heading and Shop all route — **OBSERVED** | Editorial context should have a bounded next step | Route to an original division collection, standard, maker edit, or use-case group | Supporting | High | THCA: curated formats; Vape: device ecosystem; Glass: maker/function | I Love NY campaign structure, labels, or category composition |
| Related-product cards | Offer further products with state-aware actions | Products/sets expose badges, options, prices, add/configure/notify/detail — **OBSERVED** | Recommendations retain full commerce truth | Reuse shared product-card state model and explain the relationship | Supporting | High | THCA: relevant complements; Vape: compatible items; Glass: compatible/care items | Glossier assortment, card trade dress, or arbitrary recommendations |
| Reviews aggregate/tools | Summarize and navigate customer evidence | Total, average, search, sort, Write review — **OBSERVED** structurally | Social proof should be searchable and inspectable | Support aggregate, keyword search, useful sort, and transparent review entry when volume justifies | Supporting | Medium | THCA: factual customer reports; Vape: performance/compatibility; Glass: craft/fit | Exact vendor UI, beauty filters, rating precision, or sort order |
| Review card | Present attributable customer evidence | Verified Buyer, date, rating, text, metadata, recommendation, votes — **OBSERVED** | Context increases interpretability | Use privacy-respecting, division-relevant metadata and verification | Supporting | High | THCA: purchase/form context; Vape: device/model/usage context; Glass: setup/connection context | Skin type/shade/age fields, card appearance, or excessive profiling |
| Review form | Collect structured feedback | Required score/title/body/name/email; optional metadata/recommendation; thank-you state — **OBSERVED** structurally | Collection should be purposeful and transparent | Ask only decision-relevant fields, explain privacy/moderation, and confirm submission accessibly | Supporting | Medium | THCA: product/form; Vape: compatibility/model; Glass: material/setup | Beauty questions, social-share success prompt, fields, or Glossier validation |
| Load-more/helpfulness controls | Progressively reveal and rank evidence | Four loaded reviews, Load more, up/down counts — **OBSERVED** | Large evidence sets need progressive access | Use load-more or pagination plus abuse-resistant helpfulness if it improves retrieval | Optional | Medium | THCA: find relevant reports; Vape: surface compatibility help; Glass: surface fit/craft help | Exact load pattern, vote UI, counts, or unverified mechanics |

---

# 13. Translate to Blowin' Smoke

## THCA product decision contract

The purchase panel should prioritize:

1. product type: flower, pre-roll, concentrate, disposable, edible, or another lawful category;
2. quantity/count;
3. factual cannabinoid/composition information;
4. current price and unit context where useful;
5. availability and destination eligibility;
6. laboratory-document access;
7. selected purchase method only if lawful and operationally supported;
8. state-aware action.

Deep content should provide batch/lot-linked documentation where applicable, ingredients/composition, factual handling/storage, responsible-use information, shipping restrictions, and review context. No unsupported health, therapeutic, or guaranteed-effect claims belong in the system.

## Vape & Nicotine product decision contract

The purchase panel should prioritize:

1. brand and product name;
2. device versus consumable;
3. model/ecosystem;
4. flavor where applicable;
5. capacity/count and nicotine strength where applicable;
6. compatibility and required components;
7. included components;
8. availability, restrictions, and price;
9. state-aware action.

Compatibility is a first-class state dependency, not secondary educational copy. If the system cannot confirm that the selected item works with the customer's device or chosen component, it should not imply certainty or offer a misleading quick add.

## Glass & Accessories product decision contract

The purchase panel should prioritize:

1. product type and function;
2. maker where relevant;
3. material;
4. dimensions;
5. connection/joint information;
6. compatibility;
7. included pieces;
8. availability and price;
9. state-aware action.

Media must establish silhouette, scale, material, workmanship, connection detail, included pieces, and care needs. Contextual selling should focus on verified fit, protection, cleaning, replacement, or a complete setup.

## Common voice and behavior

All divisions should use direct language, explain why a product earned its place, distinguish facts from opinion, and avoid manipulating urgency. “Who Wants That Smoke?” remains a brand challenge, not routine Add to Bag, error, restriction, or unavailable copy.

---

# 14. Shared PDP Shell

## Universal architecture

```text
GLOBAL ORIENTATION
PRODUCT IDENTITY + SOCIAL SUMMARY
PRODUCT MEDIA
OPTION SELECTION
ESSENTIAL DECISION FACTS
PRICE + AVAILABILITY + ELIGIBILITY
PURCHASE METHOD (WHEN APPLICABLE)
PRIMARY ACTION + CONSTRAINTS
CONCISE DESCRIPTION
PRODUCT PROOF
DEEP EDUCATION / USE / CARE
SOCIAL PROOF
CONTEXTUAL CROSS-SELL
SERVICE / POLICY CLOSURE
```

Universal components are global header, media stage, purchase-panel shell, identity, option selector, price, availability/eligibility, primary action, constraints, concise description, essential attributes, proof links, instructions, recommendations, reviews when supported, and service closure.

## Controlled extension points

| Extension point | THCA | Vape & Nicotine | Glass & Accessories |
|---|---|---|---|
| Option taxonomy | form, quantity, composition/batch as appropriate | flavor, strength, capacity, model | size, color, joint/connection, configuration |
| Critical gate | jurisdiction/shipping eligibility | age/restriction plus compatibility | compatibility and fragile/oversize fulfillment where relevant |
| Proof module | lab documents, factual composition, batch/lot | specifications, ingredients/components, compatibility evidence | material, dimensions, maker/provenance, construction detail |
| Media proof | package/label and factual detail | device, ports, controls, included parts | scale, angles, material, joint, included pieces |
| Instructions | factual handling/storage/responsible-use | setup, charging/installation as applicable, compatibility | assembly, cleaning, storage, care |
| Subscription | only if lawful and operationally justified | consumables where permitted and useful | care/replacement consumables, rarely durable glass |
| Review context | purchased form/quantity; privacy-safe | device/model/compatibility context | setup, connection, use/care context |
| Cross-sell logic | lawful and genuinely related | verified ecosystem compatibility | verified fit, protection, cleaning, replacement |

The visual and interaction grammar stays common. Divisions change evidence fields and gates, not the fundamental page identity.

---

# 15. Product Proof Model

## Shared hierarchy

### Essential decision information

Visible before action: identity, division, product type, selected option, price, availability, eligibility/restriction, critical compatibility, and primary action.

### Product proof

Close to the purchase zone: the smallest evidence set needed to justify the choice.

- **THCA:** factual composition and laboratory-document access.
- **Vape & Nicotine:** model, capacity/strength where applicable, included components, and compatibility.
- **Glass & Accessories:** material, dimensions, connection details, included pieces, and maker where relevant.

### Deep education

Below the transaction: expanded composition/specifications, documentation, use, storage, care, technical guidance, provenance, or policy. Progressive disclosure may shorten the page but must not hide a decision-critical fact.

### Social proof

Aggregate rating and review evidence with verified-purchase status and only division-relevant, privacy-respecting metadata. Reviews do not override factual restrictions, compatibility, or documentation.

### Contextual cross-sell

Recommendations come last in the proof logic and require a stated relationship: verified compatibility, complete setup, replenishment, care, protection, replacement, maker collection, or independent curation.

## Grammar rule

Every division follows the same progression:

**decide → verify → learn → compare experience → extend the purchase**

The content changes; the customer's cognitive path does not.

---

# 16. What We Should Not Copy

## Glossier-specific expression

- cosmetics taxonomy, beauty routines, shade conventions, sensory beauty descriptors, skin-oriented profile fields, and application framing;
- beauty photography, product-on-skin crops, campaign UGC, I Love NY creative, models, props, and city narrative;
- Glossier typography, palette, iconography, badges, card proportions, spacing signature, button styling, and full trade dress;
- exact gallery geometry, dot/arrow treatment, media order, modal trigger styling, or any unobserved modal behavior;
- exact subscription layout, 10% offer, interval options, cancellation language, and promotional cadence;
- “Add to bag $16,” black/white CTA appearance, font-size hover, or any exact hover behavior;
- exact Save With Sets composition, saving levels, related assortment, or bundle-card structure;
- “Get the Look,” campaign collection treatment, beauty-specific review metadata, or social-sharing success state;
- exact payment placement, Afterpay presentation, quantity limit, availability copy, and notification flow.

## Unsupported technical imitation

Do not claim or reproduce unconfirmed breakpoints, CSS values, animation timing, easing, libraries, zoom/lightbox behavior, hidden video behavior, lazy-loading setup, Next.js data, Shopify product state, or backend/metafield architecture.

Shopify variant query parameters were technically confirmed for two options. That is evidence of state behavior, not a requirement to use Shopify or copy Glossier's IDs/URL implementation.

## Generic smoke-shop clichés

Do not replace beauty trade dress with performative rebellion: black-and-red aggression, haze/smoke overlays, neon clichés, graffiti, glitch effects, faux protest graphics, forced slang, macho error states, false scarcity, or constant use of “Who Wants That Smoke?” The Brand Philosophy requires culture, conviction, substance, respect, and performance—not a costume of edge.

---

# 17. Evidence Gaps

| QUESTION | CURRENT EVIDENCE | CONFIDENCE | DOES IT MATTER TO BLOWIN' SMOKE? | ACTION |
|---|---|---|---|---|
| What does the gallery modal do? | Trigger text is **OBSERVED**; resulting layer was not inspected | Low | Moderately; Glass and device detail may benefit from expanded inspection, but Glossier's solution is not required | DEFER |
| Does product media zoom? | **NOT DETERMINABLE** | Low | Potentially useful for Glass craftsmanship and Vape connection detail | RESEARCH LATER |
| Do any variants contain GIF/video? | No video found in inspected primary gallery; deferred/other slides not fully inspected | Low | No; Blowin' Smoke should define motion from its own content needs | IGNORE |
| What is the responsive/mobile PDP layout? | Not completed; breakpoints and mobile behavior **NOT DETERMINABLE** | Low | Yes; purchase order and option usability are material | RESEARCH LATER |
| Is the purchase panel sticky? | Not established by completed evidence | Low | Potentially; must be validated against mobile space, long option lists, and accessibility | RESEARCH LATER |
| What are the exact gallery transitions? | **NOT DETERMINABLE** | Low | No; Blowin' Smoke needs its own restrained motion tokens | IGNORE |
| What library implements motion? | **NOT DETERMINABLE** | Low | No design-system consequence | IGNORE |
| What are the exact CSS hover values? | A font-size transition was reported as observed, not technically confirmed | Low | No; exact Glossier values must not be copied | IGNORE |
| Does URL synchronization cover all variants and browser history? | Confirmed for Original/Birthday selection only; universal behavior **INFERRED** | Medium | Shareable/restorable option state matters, but Glossier's implementation does not | DEFER |
| How do price and CTA change for differently priced options? | Tested options shared $16 and stable CTA | Low | Yes as a Blowin' Smoke state requirement; no further Glossier research needed | DEFER |
| What is the active main-product unavailable flow? | Structural Notify me exists; tested variants available | Low | Yes as a required original state; behavior can be designed independently | DEFER |
| How are subscription price, default interval, and cart line represented? | Methods, 10% saving, details, and intervals observed; deeper behavior unknown | Low | Only if Blowin' Smoke approves subscriptions for a division | DEFER |
| Is the quantity limit enforced server-side? | Limit copy observed; enforcement **NOT DETERMINABLE** | Low | Enforcement matters operationally, but Glossier implementation does not | IGNORE |
| How do bundle configuration and partial stock work? | Contents/actions observed; validation and partial availability unknown | Low | Yes for original bundle-state design | DEFER |
| Do review search, sort, voting, and load-more controls work as implied? | Controls/states structurally observed; live behavior untested | Medium | Vendor and requirements selection matter more than Glossier mechanics | DEFER |
| What is Glossier's direct JSON/data architecture? | Attempts failed; Shopify variant URLs confirmed; Sentry/metafield reference observed | Low | No; Blowin' Smoke architecture must follow its own platform constraints | IGNORE |
| What does the inventory metafield error imply? | Sentry text references an inventory warehouse metafield — **OBSERVED**; architecture implication unknown | Low | No reliable design conclusion | IGNORE |
| Does this PDP use responsive `srcset` and lazy loading? | Not retrieved in PDP audit; homepage has separate confirmation | Low for PDP-specific claim | Performance matters, but exact Glossier mechanism does not | DEFER |
| Are overlays, gallery, options, and reviews fully keyboard accessible? | Not completed; behavior **NOT DETERMINABLE** | Low | Yes; accessibility is a Core requirement | RESEARCH LATER |
| What are exact breakpoints, timing, easing, and cache strategies? | **NOT DETERMINABLE** | Low | No; original system must define its own | IGNORE |

“Research Later” means original Blowin' Smoke user, accessibility, responsive, or technical validation when the design reaches that decision. It does not default to another Firecrawl inspection.

---

# Final System Directive

The Blowin' Smoke PDP must accomplish six things in order:

1. identify the product and its division;
2. make the option and its consequences unmistakable;
3. expose price, eligibility, compatibility, availability, and constraints before action;
4. connect every claim to suitable proof;
5. deepen education without overwhelming the purchase decision;
6. extend commerce only through a credible relationship.

The shared system is one state-driven shell with division-specific evidence slots. THCA changes composition and eligibility proof. Vape & Nicotine makes compatibility a first-class gate. Glass & Accessories emphasizes scale, material, connection, craftsmanship, and care. All three preserve direct language, cultural credibility, accessible control, and customer respect.

The transferable DNA is disciplined progressive disclosure, synchronized product state, proof layering, and contextual commerce. Glossier's beauty expression, trade dress, and exact interactions remain excluded.
