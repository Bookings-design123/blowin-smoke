# Blowin’ Smoke — Master Design DNA

**Status:** Canonical storefront design synthesis

**Scope:** Customer-facing website design, merchandising presentation, interaction, and responsive behavior

**Authority:** Governing design direction; not production code, catalog truth, legal policy, or implementation approval

**Source window:** All durable design research and prototype evidence available in the repository and both named Codex task histories at consolidation time

---

## How to use this document

This specification consolidates the prior research without turning any reference site into a template. It defines the design logic Blowin’ Smoke should carry into storefront implementation: confident restraint, consequential product truth, clear division architecture, selective editorial expression, and commerce behavior that responds honestly to product state.

When this document conflicts with another source:

1. The Blowin’ Smoke Constitution governs brand purpose and non-negotiable conduct.
2. Domain closure decisions govern what competitor research did and did not establish.
3. Canonical data, commerce, policy, accessibility, security, and compliance specifications govern factual behavior.
4. This document governs the synthesis of those requirements into customer-facing design.
5. Later validated production evidence may refine provisional visual choices, but must preserve the principles and evidence discipline defined here.

Evidence language used in this document:

- **Source-established:** directly supported by a cited research source.
- **Synthesized:** an original Blowin’ Smoke conclusion supported by one or more sources.
- **Statically tested:** demonstrated in the static prototype package at named viewport/state coverage.
- **Production-unverified:** not yet proven with real catalog data, production fonts, live interaction, assistive technology, performance constraints, or customer outcomes.

No static prototype value, competitor mechanism, customer quotation, research-candidate status, or visual sample becomes production truth merely by appearing here.

---

# 1. SOURCE INVENTORY

The identifiers in brackets are used by the provenance matrix in Section 19.

## 1.1 Governing brand and research charter

- **[BRAND-01] docs/constitution/01-brand-philosophy.md — Article I: Brand Philosophy.** Governs identity, audience, customer feeling, “Who Wants That Smoke?”, independence, respect, cultural credibility, and the rejection of generic corporate retail.
- **[RESEARCH-00] docs/research/README.md — Research program overview.** Defines why Glossier, Bay Smokes, VaporDNA, and Smoke Cartel were studied and assigns each reference a different learning role.

The remaining numbered Constitution articles were empty placeholders at consolidation time and were not treated as evidence.

## 1.2 Authoritative Codex task histories

- **[TASK-G1] “Analyze Glossier homepage system,” task 019fd451-18d3-7260-8d58-a013db19d1b7.** The complete task archive was reviewed, including messages, supplied Firecrawl material, forensic interaction notes, generated research files, implementation conclusions, and prototype-direction decisions present in that history. It established the first detailed reverse engineering of Glossier’s homepage and the Blowin’ Smoke adaptation boundary.
- **[TASK-G2] “Analyze Glossier homepage system (2),” task 019ff7b8-8d56-7272-8d81-0cf18679ef91.** The complete task archive was reviewed, including inherited context, later PDP analysis, research closures, system specifications, prototype iterations, screenshot evidence, and design-decision refinements.

The second task carries forward part of the first task’s history. Shared material was treated as corroborating duplication, not as two independent observations. Unique conclusions from either task were retained. Later security and Admin implementation work in the second task was not used as storefront art-direction evidence.

All durable design conclusions found only in task commentary or intermediate artifact discussion have been incorporated into this document where they remained valid. No separate unpersisted task conclusion is required to interpret the canonical direction after this consolidation.

## 1.3 Glossier structural and design-system research

- **[G-README] docs/research/glossier/README.md**
- **[G-PROMPT] docs/research/glossier/codex-analysis-prompt.md**
- **[G-HOME-RAW] docs/research/glossier/homepage-firecrawl.md**
- **[G-HOME-FORENSIC] docs/research/glossier/01-homepage-forensic-audit.md**
- **[G-HOME-DNA] docs/research/glossier/01-homepage-final-design-dna.md**
- **[G-PDP-RAW] docs/research/glossier/02-product-page-firecrawl.md**
- **[G-PDP-FORENSIC] docs/research/glossier/02-product-page-forensic-audit.md**
- **[G-PDP-DNA] docs/research/glossier/02-product-page-final-design-dna.md**
- **[G-CLOSE] docs/research/glossier/03-research-closure-design-system-decision.md**

The raw captures are structural evidence. The forensic audits distinguish observed, technically confirmed, inferred, and indeterminable behavior. The final DNA files synthesize the strongest evidence. The closure decision prevents further competitor imitation and transfers solution ownership to Blowin’ Smoke.

## 1.4 THCA commerce research

- **[BAY-README] docs/research/bay-smokes/README.md**
- **[BAY-HOME] docs/research/bay-smokes/01-homepage-firecrawl.md**
- **[BAY-PDP] docs/research/bay-smokes/02-thca-smalls-pdp-firecrawl.md**
- **[BAY-INTEL] docs/research/bay-smokes/03-thca-commerce-intelligence-report.md**
- **[BAY-DECISION] docs/research/bay-smokes/03-thca-smalls-pdp-product-decision-intelligence.md**
- **[BAY-CLOSE] docs/research/bay-smokes/04-research-closure-thca-commerce-decision.md**

These sources establish THCA-specific decision requirements, not a visual template. The Bay Smokes README is incomplete as a standalone charter; the captures, intelligence reports, and closure decision carry the durable conclusions.

## 1.5 Vape and nicotine commerce research

- **[VAPE-README] docs/research/vapordna/README.md**
- **[VAPE-HOME] docs/research/vapordna/01-homepage-firecrawl.md**
- **[VAPE-INTEL] docs/research/vapordna/02-homepage-vape-nicotine-commerce-intelligence.md**
- **[VAPE-CLOSE] docs/research/vapordna/03-research-closure-compatibility-decision.md**

These sources establish device, component, consumable, replacement, and lifecycle decision problems. The closure expressly states that Blowin’ Smoke—not VaporDNA—will define the compatibility architecture.

## 1.6 Glass and accessories commerce research

- **[GLASS-README] docs/research/smoke-cartel/README.md**
- **[GLASS-HOME] docs/research/smoke-cartel/01-homepage-firecrawl.md**
- **[GLASS-INTEL] docs/research/smoke-cartel/02-homepage-glass-accessories-commerce-intelligence.md**
- **[GLASS-CLOSE] docs/research/smoke-cartel/03-research-closure-physical-compatibility-decision.md**

These sources establish physical-data, fit, component-role, scale, material, provenance, care, and fragile-product support requirements. They do not establish a verified Smoke Cartel compatibility interface.

## 1.7 Blowin’ Smoke system specifications

- **[SYS-01] docs/system/01-master-design-commerce-system.md**
- **[SYS-02] docs/system/02-information-architecture-page-system.md**
- **[SYS-03] docs/system/03-data-model-catalog-schema.md**
- **[SYS-04] docs/system/04-page-by-page-architecture-specifications.md**
- **[SYS-05] docs/system/05-visual-design-system.md**
- **[SYS-06] docs/system/06-high-fidelity-page-design-specifications.md**
- **[SYS-07] docs/system/07-static-visual-prototype-evaluation.md**
- **[SYS-08] docs/system/08-static-visual-prototype-iteration-evaluation.md**

These files turn the research into shared information architecture, data-aware page behavior, visual roles, page-level hierarchy, and prototype evaluation criteria. Where an early system hypothesis conflicts with later validated prototype findings, the later finding governs presentation while the underlying commerce rule remains intact.

## 1.8 Static prototype evidence

- **[P-01] docs/prototypes/pressure-proof/**
- **[P-02] docs/prototypes/pressure-proof-iteration-02/**
- **[P-03] docs/prototypes/pressure-proof-art-direction-iteration-03/**
- **[P-04] docs/prototypes/pressure-proof-constructed-signal-iteration-04/**
- **[P-05] docs/prototypes/pressure-proof-constructed-signal-iteration-05/**
- **[P-051] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/**

For every package, its README, evaluation, page studies, shared styles, fixtures, notes, state views, and rendered screenshot evidence were considered where available. The latest package contributes these particularly material records:

- **[P-051-LOCK] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/decision-lock.md**
- **[P-051-HOME] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/home-anti-generic-audit.md**
- **[P-051-COPY] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/customer-facing-copy-contract.md**
- **[P-051-MEDIA] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/media-direction.md**
- **[P-051-DISCLOSURE] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/progressive-disclosure.md**
- **[P-051-ROUTES] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/semantic-route-audit.md**
- **[P-051-BALANCE] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/merchandise-balance-audit.md**
- **[P-051-CONTINUITY] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/cross-surface-state-continuity.md**
- **[P-051-TYPE] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/typography-correction.md**
- **[P-051-VAPE] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/vape-value-density-audit.md**
- **[P-051-EVAL] docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/evaluation.md**

The screenshot boards for home, division, category, PDP, search, cart continuity, typography, open states, mobile navigation, and 1440/1024/901/390/320 viewport evidence were inspected. They prove static composition and reflow only. They do not prove production semantics, data integrity, motion, performance, assistive-technology behavior, or customer conversion.

The primary visually inspected Iteration 05.1 references were:

- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/overview/all-ten-default-openings.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/overview/home-anti-generic-comparison.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/overview/category-assortment-balance.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/overview/pdp-cart-continuity.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/overview/route-destination-map.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/overview/typography-candidate-comparison.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/states/mobile-navigation-open-320x760.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/wide/03-shared-category-1440x900.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/wide/08-thca-division-1440x900.png
- docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/wide/09-glass-accessories-division-1440x900.png

## 1.9 Customer and reviewer intelligence

- **[CI-BANK] research/customer-intelligence/INSIGHT-BANK.md**
- **[CI-LEDGER] research/customer-intelligence/RESEARCH-COVERAGE-LEDGER.md**
- **[CI-NIC] research/customer-intelligence/nicotine/README.md**
- **[CI-FLAVOR] research/customer-intelligence/youtube/2026/YT-FLAVOR-001-ripe-vapes/README.md; research/customer-intelligence/youtube/2026/YT-FLAVOR-001-ripe-vapes/e-liquid.md; research/customer-intelligence/youtube/2026/YT-FLAVOR-001-ripe-vapes/e-liquid.json; research/customer-intelligence/youtube/2026/YT-FLAVOR-001-ripe-vapes/transcript.txt**
- **[CI-DISPOSABLE] research/customer-intelligence/youtube/2026/YT-DISPOSABLE-002-geek-bar-pulse-x-strawberry-dragon/README.md; research/customer-intelligence/youtube/2026/YT-DISPOSABLE-002-geek-bar-pulse-x-strawberry-dragon/YT-DISPOSABLE-002-geek-bar-pulse-x-strawberry-dragon.md; research/customer-intelligence/youtube/2026/YT-DISPOSABLE-002-geek-bar-pulse-x-strawberry-dragon/JSON**
- **[CI-POD] research/customer-intelligence/nicotine/pod-systems/POD-HARDWARE-INTELLIGENCE-001-grimmgreen-july-2026.md**
- **[CI-VAPORIZER] research/customer-intelligence/dry-herb-vaporizers/PORTABLE-VAPORIZER-INTELLIGENCE-001-bud-boss-state-of-vape-2026.md**
- **[CI-REVIEWS] reviews-003-006/README.md; reviews-003-006/CUSTOMER-SATISFACTION-BLUEPRINT.md; reviews-003-006/master-intelligence.json**
- **[CI-THCA] thca-customer-intelligence-001/README.md; thca-customer-intelligence-001/BLUEPRINT.md; thca-customer-intelligence-001/master-intelligence.json**
- **[CATALOG-READY] docs/production-readiness/02-representative-catalog-candidates.json**

The Insight Bank contains substantial usable synthesis but its final Litmus board is physically truncated. The intact body, coverage ledger, and source-specific files were used; the truncated ending was not inferred. Candidate and research statuses do not establish live assortment, inventory, compliance, compatibility, or product approval.

---

# 2. SOURCE-SPECIFIC LEARNINGS

## 2.1 Blowin’ Smoke Constitution

The brand is not premium because it resembles luxury retail. It is premium when it exercises judgment, communicates with substance, respects the customer, knows the products, and feels independently operated. Discovery should feel like finding an advantage. “Who Wants That Smoke?” retains the force of a challenge and therefore loses power if repeated as decorative copy.

Design consequences:

- Cultural credibility comes from decisions, product knowledge, language discipline, and real provenance—not from borrowed slang or visual stereotypes.
- Clarity is respect. Hiding conditions, inflating urgency, or burying incompatibility violates the brand.
- Visual force is welcome when it has a job. Gimmicks, corporate neutrality, and empty spectacle are not.
- The interface must reveal a human point of view without profiling every customer as one type of person.

## 2.2 Glossier task 1

The first task established why a premium homepage can feel composed without feeling empty:

- A small set of reusable modules can create variety when section purpose, hierarchy, media role, and density are controlled.
- Navigation earns confidence by making the breadth of the catalog understandable before asking the customer to commit.
- Product cards remain visually stable while their actions change with product readiness.
- Campaign media, merchandising, search, cart, and modal systems feel premium when they share one interaction grammar.
- White space is not decoration; it separates decisions and gives each module one primary job.

Its most important boundary was equally clear: the learning is discipline, not Glossier’s beauty vocabulary, trade dress, copy tone, photography, category logic, or exact compositions.

## 2.3 Glossier task 2

The second task extended the homepage work into PDP, full-system behavior, and prototype judgment:

- Selection, URL, gallery, price, availability, and CTA must behave as one state system.
- Progressive disclosure should protect the purchase decision, not conceal material truth.
- Motion should explain topology, selection, progress, and state change; it should not become ambient decoration.
- “Pressure & Proof” became the governing intensity model: stronger expression upstream, less noise as consequences increase.
- “Constructed Signal” became the selected structural grammar because it can carry independent editorial energy without destabilizing commerce.
- The later prototype iterations corrected route semantics, copy, merchandise balance, cross-surface state continuity, mobile navigation, and typography roles.

The durable conclusion is not that Iteration 05.1 is a finished website. It is that its hierarchy and state discipline are the strongest static expression tested so far, subject to production validation.

## 2.4 Glossier source research

Glossier demonstrated:

- premium hierarchy through controlled sequencing and low ambiguity;
- responsive media chosen for a communication job;
- a shared global shell across editorial and transactional modules;
- stable product-card anatomy with state-aware action;
- search as a primary discovery surface rather than a utility afterthought;
- a cart drawer that acknowledges progress without forcing checkout;
- PDP state synchronization and layered information;
- user control over motion and semantic access points.

Blowin’ Smoke should adapt the discipline, progressive disclosure, synchronized state, and component consistency. It must not adapt the visual identity, palette, type choices, photography, beauty-specific organization, slogans, proportions, or recognizable trade dress.

## 2.5 Bay Smokes

The THCA source established that a purchasable item can still be a bad or noncompliant decision if product form, strain/type, quantity, composition, lot evidence, jurisdictional eligibility, or fulfillment conditions are unclear.

Design consequences:

- product identity and purchasable option must be atomic;
- price must state its basis;
- COA/evidence must be tied to the correct product and lot where applicable;
- eligibility is separate from availability;
- claims require explicit lanes and evidence;
- fulfillment constraints belong near action;
- promotion must never dominate product truth.

Bay Smokes’ promotional density and taxonomy inconsistencies are cautionary evidence, not patterns to reproduce.

## 2.6 VaporDNA

The vape source established that a legitimate, available item may be unusable because the customer owns a different device, platform, pod, tank, cartridge, coil, or replacement system.

Design consequences:

- identify whether an item is a device, platform, consumable, replacement component, accessory, or disposable;
- expose the relationship between what the customer owns and what the item supports;
- distinguish included, required, optional, replacement, and compatible items;
- support bidirectional discovery when verified;
- make replacement availability and lifecycle support part of product value;
- never silently convert unknown compatibility into compatible.

VaporDNA established the problem. Blowin’ Smoke owns the original relationship model, validation rules, and interface.

## 2.7 Smoke Cartel

The glass source established that names and joint size alone cannot reliably communicate physical fit. Dimensions, joint gender/type, angle, orientation, clearance, length, component role, material, and included/required parts may all change usability.

Design consequences:

- scale requires structured measurements plus decision-oriented media;
- product roles must be explicit;
- compatibility must be contextual and bidirectional where meaningful;
- maker and provenance may be product truth;
- material affects care and related-product logic;
- fragile products need distinct delivery, inspection, damage, and support states.

Smoke Cartel did not establish a verified physical-compatibility system. Blowin’ Smoke must use manufacturer/maker data, verified SKU/package information, physical receiving inspection, standardized measurement, and pair testing where needed.

## 2.8 System specifications

The system documents supplied the bridge between research and interface:

- one house-level information architecture with division-specific decision models;
- canonical catalog and relationship data as the source of displayed truth;
- state-derived commerce behavior rather than manually authored CTA claims;
- explicit page responsibilities and evidence ordering;
- a visual continuum from expressive orientation to calm verification;
- accessibility, responsive behavior, recovery, and empty/error states as designed requirements.

They also established that editorial content cannot repair missing operational data. Product truth must originate in the canonical commerce model.

## 2.9 Prototype program

The prototype sequence taught through comparison:

- Iteration 01 proved breadth but exposed excess density and generic system qualities.
- Iteration 02 improved responsive coverage, search, cart, and state handling.
- Iteration 03 compared Poster Pressure, Independent Archive, and Constructed Signal rather than accepting one aesthetic by instinct.
- Iteration 04 applied Constructed Signal to the system.
- Iteration 05 moved toward customer-facing fidelity and media integration.
- Iteration 05.1 corrected semantic routes, retail credibility, copy, merchandise balance, typography roles, mobile navigation, and cross-surface continuity.

The selected relationship is:

- **Pressure & Proof:** the governing hierarchy and intensity model.
- **Constructed Signal:** the structural visual grammar.
- **Poster Pressure:** an upstream editorial-energy source used sparingly.
- **Independent Archive:** a provenance and education reference, not a global skin.

## 2.10 Customer and reviewer intelligence

Customer research established that:

- habitual use, rebuy intent, replacement behavior, and direct preference are stronger signals than novelty;
- “best” is meaningless without a customer job;
- expectation accuracy drives satisfaction—surprise cooling, intensity, form factor, upkeep, or portability erodes trust;
- preferences are spectra, not one universal optimum;
- supportability and replacement supply are part of the product;
- friction can defeat an otherwise strong product;
- acquisition interest and retained satisfaction are different signals;
- curation is a competitive advantage only when the reason is visible and evidence-bounded;
- reviewer, manufacturer, operator, measured, verified, policy, compatibility, and customer-testimony evidence must not be collapsed into one voice.

The research supports a “House Read” and contextual recommendation system. It does not support universal scores, fake consensus, or a badge wall.

---

# 3. SHARED PATTERNS

These patterns recur across the strongest independent sources:

1. **Orientation precedes persuasion.** Customers need to know where they are, what kind of product they are seeing, and what decision comes next before promotional language can help.
2. **The interface becomes calmer as consequences rise.** Expression can be strongest on Home, narrower on a division page, comparison-focused in a category, and most literal on PDP, cart, proof, fit, and eligibility surfaces.
3. **A stable shell increases perceived quality.** Header, typography roles, controls, product grammar, disclosure behavior, and state feedback should remain coherent while division content changes.
4. **Product truth outranks campaign copy.** Identity, exact selection, price basis, availability, evidence, compatibility, eligibility, and required conditions must remain visible.
5. **Action must derive from readiness.** Add to Cart, Configure, Select, Verify, Notify, Find Compatible, or Unavailable is a system conclusion—not a copywriting choice.
6. **Progressive disclosure is ethical only when blockers stay visible.** Supporting depth can collapse; decision-changing truth cannot.
7. **Good curation explains itself.** “Why we carry it,” “best for,” tradeoffs, evidence maturity, and use context create confidence without pretending to be objective universal rankings.
8. **Media is evidence with a job.** Image and video should establish identity, variant, scale, fit, assembly, material, provenance, or use—not fill a template.
9. **Compatibility is a relationship, not a badge.** It must name the subject, object, scope, conditions, confidence, and recovery when unknown or incompatible.
10. **Promotion is subordinate to comprehension.** One relevant offer can help; stacked banners, badge piles, and false urgency reduce confidence.
11. **Mobile is an information-priority test.** Smaller screens should preserve the decision sequence rather than merely stack desktop blocks.
12. **Recovery is part of conversion.** When a product is blocked, unavailable, incompatible, ineligible, or incomplete, the next valid route should be adjacent.
13. **Accessibility and restraint reinforce each other.** Clear hierarchy, semantic controls, explicit text states, visible focus, reduced motion, and plain-language evidence improve both inclusion and premium perception.
14. **One house does not require one undifferentiated catalog.** Shared grammar can support distinct decision models for THCA, Vape & Nicotine, and Glass & Accessories / Merch.
15. **Unknown is a legitimate state.** Unverified compatibility, missing evidence, incomplete measurements, or uncertain claims must remain explicit rather than being styled away.

---

# 4. BLOWIN’ SMOKE TRANSLATION

## 4.1 Core design position

Blowin’ Smoke should feel like an informed independent operator has already done difficult selection work on the customer’s behalf, then made that judgment inspectable.

The design is:

- **confident:** decisive hierarchy, direct labels, clear choices;
- **premium:** controlled density, consistent behavior, accurate details, composed media;
- **street-aware:** culturally awake and unafraid, without costume or forced slang;
- **editorial:** able to frame a point of view and connect products to use;
- **enthusiast-led:** specific about performance, fit, maintenance, and tradeoffs;
- **product-obsessed:** exact selection and evidence always defeat generic campaign language;
- **clean and modern:** low chrome, flat surfaces, strong alignment, meaningful negative space;
- **selective and non-corporate:** a visible house judgment, not an endless commodity marketplace.

## 4.2 Governing phrase

**Pressure attracts attention. Proof earns action.**

Pressure is the brand’s visual and verbal force. Proof is the product, compatibility, evidence, customer-context, policy, and operational truth that makes the force credible.

The closer a customer gets to a consequential purchase decision, the less visual noise the interface should introduce.

## 4.3 Expression continuum

| Surface | Primary job | Permitted expression | Required restraint |
|---|---|---|---|
| Home | Establish the house and orient to three divisions | Highest, but bounded | All three routes and the point of view remain legible |
| Division | Explain the room and common jobs | Distinctive editorial frame | Taxonomy and support routes cannot be buried |
| Category/search | Compare qualified options | Light contextual framing | Products, filters, states, and recovery dominate |
| PDP | Verify one exact decision | Product-specific character | Selection, price, evidence, fit, availability, and action dominate |
| Proof/fit/eligibility | Establish consequential truth | Minimal | Literal labels, provenance, scope, and status |
| Quick Cart/full cart/support | Confirm consequence and recovery | Minimal | No decorative interruption of totals, blockers, or next steps |

## 4.4 Conflict resolutions

| Tension in prior research | Canonical resolution |
|---|---|
| Premium minimalism versus strong street expression | Use the Pressure & Proof continuum: bounded force upstream, precision downstream. Premium is discipline, not visual silence. |
| One shared system versus three distinct businesses | Share shell, tokens, interaction grammar, and evidence semantics; vary taxonomy, proof, media jobs, and division voice. |
| Quick Add versus complex readiness | Quick Add exists only for a fully resolved, eligible, compatible, in-stock selection. Otherwise route to the decision that remains. |
| Promotional energy versus customer respect | Permit one contextual promotion after product identity; never let promotion become taxonomy or conceal conditions. |
| Scores and badges versus nuanced evidence | Prefer short plain-language conclusions linked to source, scope, maturity, and tradeoff. No universal house score. |
| Prototype specificity versus production truth | Treat exact typefaces, dimensions, colors, timings, and merchandise examples as provisional until production validation. |
| Frequent brand slogan versus challenge integrity | Use “Who Wants That Smoke?” rarely, at high-conviction house moments—not as a repeating CTA or decorative stamp. |
| Reviewer consensus versus uneven source coverage | Show evidence maturity and source type. Do not claim consensus where the corpus is sparse or absent, especially in Glass. |
| Broad assortment versus selective credibility | Provide enough role coverage for comparison and recovery, but make the selection rationale visible and avoid endless-grid behavior. |
| Editorial narrative versus transactional efficiency | Editorial context may frame the decision, but must never interrupt exact selection, price, fit, proof, availability, or recovery. |
| Early Helvetica direction versus Iteration 05.1 typography correction | Archivo-based role separation is the current prototype hypothesis; production font selection and licensing remain open. |
| Early “more competitor research” recommendations versus closure decisions | Closure decisions govern. Blowin’ Smoke owns the original solution architecture. |

## 4.5 Originality boundary

The following are available for adaptation: hierarchy, disciplined spacing, progressive disclosure, state synchronization, purposeful media, stable card grammar, search prominence, cart continuity, and semantic motion.

The following remain off-limits: another brand’s palette, fonts, logo treatment, recognizable composition, campaign styling, photography direction, copy cadence, icon set, beauty-specific taxonomy, card silhouette, or trade dress. Blowin’ Smoke’s structure must be recognizable through its own pressure/proof relationship, house divisions, evidence presentation, and operator voice.

---

# 5. VISUAL SYSTEM

## 5.1 Typography

Typography has four jobs:

1. **House display:** rare, forceful statements and division openings.
2. **Editorial heading:** structured explanation, curation, and education.
3. **Commerce text:** product identity, options, price, facts, controls, policies, and cart.
4. **Evidence text:** compact but highly legible labels, provenance, status, timestamps, conditions, and measurements.

Rules:

- Use size, weight, width, and placement to establish order before using color.
- Product identity must be easier to find than campaign language.
- Commerce text prioritizes legibility over attitude.
- All-caps is a controlled label tool, not a body-copy style.
- Numerals, prices, measurements, percentages, strengths, resistances, capacities, and quantities must remain unambiguous.
- Long headings must wrap intentionally at narrow widths without forcing ornamental line breaks.
- Links must be recognizable without relying on color alone.

The Iteration 05.1 prototype’s current hypothesis is:

- display: Archivo, then narrow/common sans fallbacks;
- commerce/body: Archivo, then common sans fallbacks;
- working weights: 400, 600, 700, and 800.

This supersedes the earlier Helvetica-led prototype direction, but it is **not a production font approval**. Licensing, delivered files, rendering, language coverage, performance, real-product stress testing, and accessible text behavior remain required.

## 5.2 Scale

- Use a limited semantic scale rather than isolated page-specific sizes.
- The largest display tier belongs only to house and division identity.
- Category and PDP headings must leave room for product facts above the fold.
- Body and evidence sizes must not shrink to create false spaciousness.
- Price is prominent but does not overpower exact selection or blocker state.
- Compact labels may be visually quiet; they must remain readable and programmatically associated.
- Type must survive 200% zoom and narrow reflow without losing information order.

No exact production pixel scale is approved by the research.

## 5.3 Spacing and vertical rhythm

- Space by relationship: tight within one decision, moderate between related groups, generous between separate page jobs.
- Use negative space to make comparison and consequence easier, not to imitate luxury emptiness.
- Blockers and their recovery action stay close.
- Labels stay close to values; evidence source stays close to the claim it qualifies.
- Repeated product cards keep common internal rhythm so scanning becomes learned behavior.
- Editorial modules may breathe more than commerce modules, but must not create excessive scrolling before products.

The prototype tested a working ladder based on 0, 4, 8, 12, 16, 24, 32, 48, 64, 96, and 128 units. This is a hypothesis for implementation tokens, not a final metric contract.

## 5.4 Grid and containers

- Use a shared page frame with predictable left/right anchors across header, opening, product grids, evidence, and footer.
- Use a wide 12-column, middle 8-column, and narrow 4-column mental model as a layout aid, not as a mandate to preserve desktop geometry.
- Break the grid only for a clear identity or media purpose.
- Product comparison aligns like facts and actions.
- Long-form editorial text uses a readable measure inside the wider frame.
- Full-bleed media is exceptional and must not detach copy or action from its context.
- Horizontal overflow is never an acceptable responsive strategy for primary content.

## 5.5 Surfaces and elevation

- The canvas is warm-neutral rather than clinical white.
- Product and proof surfaces are predominantly flat.
- Use contained white or quiet-neutral truth surfaces where separation aids comprehension.
- Use near-black for high-conviction identity and primary action.
- Avoid floating card decks and decorative shadows.
- Elevation is reserved for genuine topology: menu, search, dialog, quick cart, or transient feedback.
- Overlays must retain clear dismissal, focus management, and background separation.

## 5.6 Borders, dividers, and witness rules

- Thin rules establish structure, comparison, and provenance.
- A stronger “witness rule” may punctuate one high-conviction house statement or verified boundary.
- Borders must not turn every module into a box.
- State borders are paired with text and, when useful, iconography; color alone is insufficient.
- Dividers should clarify a change of job, not merely decorate empty space.

## 5.7 Radius and shape

- Default geometry is restrained and constructed.
- Small radius may improve touch targets and grouped controls.
- Pills are limited to narrow semantic uses such as a compact filter, status, or segmented choice.
- Product cards, evidence panels, and editorial stories should not all share a generic rounded-SaaS silhouette.
- Organic or novelty shapes require an explicit media or story purpose and must not become interface grammar.

## 5.8 Color logic

- **Canvas:** warm neutral for a human, non-clinical ground.
- **Truth surfaces:** white or a very quiet neutral for comparison and evidence.
- **Ink:** near-black for text, framing, and high-conviction action.
- **House signal:** a disciplined red used for identity or editorial punctuation, not routine decoration.
- **Semantic states:** success, caution, blocked, unknown, and informational colors remain independent from the house signal and always include text.
- **Division distinction:** use restrained shifts in media, contextual tone, labels, and supporting accents; do not create three unrelated palettes.

The red sampled in prototype work and all prototype color values are reference evidence only. Production contrast, dark/light context, printing, photography interaction, and color-vision behavior still require validation.

## 5.9 Imagery

Every asset receives a declared job:

- identity;
- exact variant;
- alternate angle;
- scale;
- connection or fit;
- contents;
- assembly or setup;
- material or craft;
- responsible use;
- maker, operator, place, or provenance.

Direction:

- show real product specificity and physical truth;
- use consistent lighting and crop logic within a comparison set;
- reserve expressive editorial framing for house/division context;
- use scale references and connection views where dimensions affect use;
- make the selected variant visually unmistakable;
- retain essential facts as text even when media demonstrates them;
- use permissioned media with known provenance.

Avoid stock rebellion, artificial smoke effects, neon cannabis clichés, anonymous luxury still life, gratuitous hands, beauty-style imitation, unverified lifestyle claims, and imagery that obscures exact product form.

## 5.10 Iconography

- Use a small coherent stroke/fill family.
- Icons support a label; they do not replace unfamiliar meanings.
- Reserve icons for utilities, navigation, disclosure, media controls, fit direction, care, shipping/support, and recognized state cues.
- Product-domain meaning should be named in text before it is encoded in an icon.
- Do not use decorative icon clouds or counterfeit trust seals.

## 5.11 Motion

Motion is allowed to explain:

- menu, search, cart, and modal topology;
- selection change;
- disclosure;
- progress and completion;
- validation, error, and recovery;
- media inspection;
- one bounded upstream editorial moment.

Motion must:

- preserve spatial continuity;
- complete quickly enough that repeat shopping is not delayed;
- remain interruptible;
- never carry the only version of a fact;
- avoid shifting controls after the customer targets them;
- respect reduced-motion preferences by removing nonessential translation, scale, parallax, loops, and autoplay.

Avoid scroll hijacking, looped smoke, ambient card animation, perpetual marquees, forced hero video, celebratory motion around regulated or risky decisions, and hover-only revelations. No exact production durations, easing curves, libraries, or breakpoints are established.

## 5.12 Density

Density follows decision risk:

- Home: few large signals.
- Division: enough orientation to choose a job or category.
- Category/search: high comparative density with strict alignment.
- PDP: moderate density, sequenced around one exact selection.
- Proof, eligibility, fit, and cart: dense in truth but visually quiet.
- Editorial: readable narrative density with explicit exits back to commerce or support.

The system should feel selective without making customers hunt for ordinary details.

## 5.13 Responsive behavior

- Reflow by information priority, not by shrinking or mechanically stacking.
- Component semantics remain constant across widths.
- Multi-column comparison becomes grouped labeled records or a deliberate horizontal comparison tool with accessible controls.
- Persistent controls must not cover content or collide with browser safe areas.
- Media aspect ratios may change only when the communication job survives the crop.
- The static prototype demonstrated no horizontal overflow at 1440, 1024, 901, 390, and 320 pixel evidence widths. This is static evidence, not a final breakpoint specification.
- Focus order, screen-reader behavior, zoom/reflow, dynamic text, touch, safe-area handling, reduced motion, and live content shifts remain production acceptance tests.

---

# 6. NAVIGATION SYSTEM

## 6.1 Navigation objective

Navigation should make a complex house feel learnable. It must let a first-time visitor identify the three divisions immediately, let an experienced customer reach a known product quickly, and let an uncertain customer begin with a job rather than jargon.

## 6.2 Global header

The global header contains:

- Blowin’ Smoke identity linked to Home;
- THCA;
- Vape & Nicotine;
- Glass & Accessories / Merch;
- Search;
- account when applicable;
- Cart with a text-accessible current quantity/state;
- access to Learn and Support.

Rules:

- The house identity remains consistent across all divisions.
- All three divisions stay reachable without returning Home.
- Search and Cart are named or unambiguously labeled, not reduced to mystery icons.
- A current division may be indicated, but the header should not visually become a different brand.
- Sticky behavior is permitted when it preserves context and does not consume disproportionate mobile space.
- Announcement space is optional and limited to one current, consequential message. It must never become a rotating urgency machine.

## 6.3 Desktop navigation and mega menus

Each division menu should expose:

1. common customer jobs;
2. primary product roles or families;
3. one consequential guidance route;
4. a bounded curation route;
5. a route to view the full division.

Examples of jobs, subject to catalog truth:

- THCA: choose by format, intended context, strength/profile, or evidence readiness.
- Vape & Nicotine: start a platform, replace a component, replenish a consumable, or find compatible parts.
- Glass & Accessories / Merch: choose a complete piece, replace a component, solve fit, add care, shop by maker/material, or browse house merchandise.

Deep attributes such as dimensions, strength, capacity, resistance, joint geometry, brand, or price generally belong in filters and search rather than in the top-level navigation.

Mega-menu behavior:

- opens from a deliberate trigger and closes predictably;
- supports keyboard entry, traversal, escape, and return of focus;
- does not hide a different product universe on hover only;
- uses headings and groups rather than a dense wall of links;
- includes at most one restrained editorial or curation feature;
- makes the division boundary explicit.

## 6.4 Compact and mobile navigation

The compact header must preserve:

- house identity;
- current division or page context when useful;
- named Search;
- named Cart and current state;
- labeled Menu;
- all three division routes;
- Learn;
- Support.

The menu should be an operable disclosure or dialog with:

- visible close control;
- correct focus entry and return;
- no background interaction while modal;
- explicit group labels;
- no dependency on hover;
- no loss of routes that desktop receives.

The Iteration 05.1 mobile-navigation studies statically demonstrated route presence and reflow at 390 and 320 widths. Production focus trapping, screen-reader announcements, scroll containment, and safe-area behavior remain unverified.

## 6.5 Search relationship

Global search is whole-house by default. Category search is explicitly scoped and clearly offers a route to broaden the query. Search is not a substitute for coherent taxonomy; it is the fast path across taxonomy.

## 6.6 Footer

The footer is the dependable institutional layer:

- divisions and major jobs;
- Learn and product education;
- Support, shipping, returns, damage, and contact routes;
- About and independent story;
- required legal, policy, age, eligibility, and accessibility links;
- communications preferences where applicable.

The footer should feel complete and human, not like a legal-data dump or a second mega menu.

---

# 7. HOMEPAGE SYSTEM

## 7.1 Homepage responsibility

The homepage’s primary conversion is **correct orientation into the house**, not an immediate product purchase. It must prove that Blowin’ Smoke has a point of view and then make the three divisions unmistakable.

## 7.2 Canonical sequence

### 1. House identity opening

Purpose:

- establish that this is an independent, product-informed house;
- communicate the challenge and point of view;
- provide immediate access to all three divisions.

Direction:

- one bounded near-black or similarly high-conviction opening;
- one decisive statement;
- a narrow witness rule or equally disciplined construction detail;
- the unmodified logo used with space;
- all three division routes visible without requiring a carousel;
- media only when it adds real product, operator, place, or maker meaning.

Do not build a generic black streetwear hero, a cannabis cliché, or a campaign carousel that makes basic orientation time-dependent.

### 2. Three-division orientation

Purpose:

- explain the three rooms of one house;
- show the kind of decision each room helps solve;
- prevent THCA, Vape & Nicotine, and Glass & Accessories / Merch from collapsing into a miscellaneous shop.

Each division entry includes:

- division name;
- concise customer job;
- one meaningful distinction;
- one route;
- media that belongs to that division without inventing a separate brand.

### 3. House judgment and standards

Purpose:

- show why the selection is credible;
- introduce the idea of proof, fit, supportability, and evidence discipline;
- explain that the house will say “unknown” when truth is not established.

This is a short standards module, not a manifesto wall.

### 4. Small reasoned curation

Purpose:

- demonstrate selection judgment;
- let customers enter through a concrete use case;
- surface only products with truthful, current readiness.

Rules:

- small set rather than an endless grid;
- each item has one reason it belongs;
- no universal ranking;
- role and division are explicit in mixed-company presentation;
- blocked or unresolved products do not masquerade as easy purchases.

### 5. Learn and decision support

Purpose:

- give uncertain customers a task-based starting point;
- connect education directly to a product or support decision.

Examples:

- understand THCA evidence and product form;
- find the right replacement for a device;
- measure a glass connection;
- understand care or replacement cycles.

### 6. Trust and service

Purpose:

- establish concrete support behavior;
- communicate shipping, returns, damage, evidence, compatibility, and help without badge theater.

Use plain commitments and links to details. Do not display generic shield icons as proof.

### 7. About, Support, and footer

Purpose:

- reveal the independent story;
- make the real people and standards behind the business discoverable;
- provide durable support and policy routes.

## 7.3 Homepage module rules

- Every section has one primary job and one primary route.
- Campaign content cannot push all three divisions below an unreasonable discovery threshold.
- No section exists only to create visual variety.
- Repetition is earned by a new customer question, not by a new background color.
- Dynamic media must have controls and a useful static fallback.
- The page must remain coherent when there are no promotions, no editorial campaign, and limited product media.
- Seasonal or campaign content is replaceable; the three-division architecture and house standards are permanent.

## 7.4 Homepage anti-generic test

The opening fails if:

- the logo could be replaced by any premium streetwear or dispensary brand without changing the composition;
- the copy says only “quality,” “culture,” “premium,” or “community” without a concrete house decision;
- the visual relies on smoke, neon, leaves, gradients, or generic black-and-red aggression;
- the three divisions are absent or equal only as decorative tiles;
- the product judgment is claimed but not inspectable;
- “Who Wants That Smoke?” is used as an all-purpose button.

---

# 8. COLLECTION / CATEGORY SYSTEM

## 8.1 Category responsibility

A category page must turn a broad product family into a manageable comparison among qualified options. It is not a campaign landing page with products attached.

## 8.2 Canonical order

1. **Scope:** category name, division, item count or result context, and a short definition.
2. **Decision context:** the two or three attributes most likely to change the choice.
3. **Controls:** filters, sort, active-filter summary, reset, and result count.
4. **Qualified results:** product cards with aligned comparison signals.
5. **Guidance:** compact comparison or education at the point it becomes useful.
6. **Recovery:** adjacent routes for no results, unknown fit, out of stock, or unresolved requirements.
7. **Support:** a human-help path when filters cannot resolve the decision.

## 8.3 Taxonomy, curation, and promotion

- Taxonomy answers “what is this?”
- Curation answers “why did the house select it?”
- Promotion answers “what temporary commercial condition applies?”

These concepts must remain visually and semantically distinct. A sale is not a category. “Best” is not a taxonomy. A curation edit does not erase product roles.

## 8.4 Filter system

Filters must:

- map to canonical structured data;
- show their current state;
- disclose when a result has unknown data rather than silently excluding or matching it;
- support removal individually and reset collectively;
- preserve query context through navigation and Back;
- be usable by keyboard and touch;
- avoid filters that the catalog cannot populate reliably.

Division-specific candidates:

- **THCA:** product form, quantity, profile/type, evidence readiness, availability, eligibility context where legally appropriate.
- **Vape & Nicotine:** device/platform, item role, compatible system, resistance/capacity where relevant, consumable type, replacement availability, availability.
- **Glass & Accessories / Merch:** product role, material, dimensions, joint size, gender/type, angle/orientation, maker, care relationship, availability; non-applicable fit fields stay absent for merch.

## 8.5 Result composition

- Align like facts across cards.
- Keep quiet products visually quiet; do not make every item a warning board.
- Surface a maximum of two or three comparison facts on the card.
- Show one material blocker or unknown when it changes action.
- Keep promotions secondary.
- Permit quick action only for fully resolved products.

The Iteration 05.1 merchandise-balance study demonstrated a useful stress mix of resolved, caution, and blocked examples, but its example products and counts are not a live assortment specification.

## 8.6 Empty, zero-result, and degraded states

A zero-result state should preserve:

- the customer’s query or filters;
- the reason no qualified result is shown when known;
- one-step filter relaxation;
- a broader category or compatible alternative route;
- Support when truth cannot be established.

It should not clear the customer’s work, invent matches, or recommend an incompatible item merely to keep a grid populated.

---

# 9. PRODUCT CARD SYSTEM

## 9.1 Purpose

The card helps a customer decide whether an item deserves deeper inspection and whether any immediate action is valid. It is not a miniature PDP and not a billboard.

## 9.2 Canonical anatomy

In order:

1. **Media:** exact product or exact selected variant where known.
2. **Division:** shown in mixed-house contexts.
3. **Maker or brand:** when it materially aids identity, provenance, or compatibility.
4. **Product identity:** plain, specific, dominant.
5. **Role or type:** what the item is in the customer’s system.
6. **Comparison facts:** two or three facts that matter in this category.
7. **Material state:** one proof, compatibility, fit, eligibility, or requirement state when consequential.
8. **Price:** with range or basis honestly stated.
9. **Promotion:** no more than one, subordinate to identity and state.
10. **Availability:** current and explicit.
11. **Truthful next action:** derived from the resolved state.

## 9.3 Visual rules

- Product media occupies a consistent comparison frame.
- Identity and role have stronger hierarchy than badges.
- Cards are flat or minimally separated; shadow is not the product grammar.
- Text alignment and internal spacing remain stable even when an item has no promotion.
- Badge count is deliberately low.
- Long product names wrap without moving the action into an unpredictable zone.
- Price and state do not rely on color alone.
- A disabled action is paired with a reason and valid recovery where available.

## 9.4 State-derived action

| Product state | Card action |
|---|---|
| Exact purchasable selection is resolved | Add to Cart may be offered |
| Required option remains | Choose options or View product |
| Compatibility/fit must be established | Check fit, Find compatible, or View product |
| Jurisdiction/eligibility must be resolved | Check eligibility or View details |
| Out of stock with allowed notification | Notify me |
| Replacement/successor verified | View replacement |
| Unknown/unverified material relationship | Verify details or Get help; never Add as if compatible |
| Unpublished, unavailable, or prohibited | No purchase action |

Quick Add is a privilege earned by complete state, not a conversion default.

## 9.5 Hover, focus, and touch

- Hover may reveal alternate media, a restrained action, or additional context already reachable elsewhere.
- Hover must not reveal unique material information.
- Focus receives a visible equivalent treatment.
- Touch receives the same decision path without a hover dependency.
- Image swapping must preserve exact variant truth and avoid layout shift.
- Motion is limited to state feedback and media inspection.

## 9.6 Division-specific card facts

- **THCA:** form, quantity, relevant profile/type, evidence state, and eligibility/fulfillment condition when material.
- **Vape & Nicotine:** role, supported platform or relationship, capacity/resistance or consumable fact when relevant, replacement state.
- **Glass & Accessories / Merch:** role, material, dimensions or connection geometry, included/required relationship, maker when relevant; merch uses only applicable product facts.

The component shell remains the same; the decision facts change.

## 9.7 Trust and curation cues

A card may carry one concise cue such as:

- Why we carry it
- Best for a named job
- Verified fit
- Current evidence available
- Replacement supported

The cue must have an inspectable basis. Do not combine bestseller, trending, staff pick, reviewer favorite, Litmus, limited, premium, and sale badges on one item.

---

# 10. PRODUCT DETAIL SYSTEM

## 10.1 PDP responsibility

The PDP resolves one exact purchase decision. It must maintain continuity among product identity, selected variant, media, URL, price, availability, evidence, compatibility/fit, eligibility, requirements, and action.

## 10.2 Above-the-decision sequence

The visible decision sequence is:

1. exact product identity;
2. exact selected state;
3. price and price basis;
4. availability;
5. material blocker or unknown;
6. reason and scope;
7. recovery;
8. valid commerce action.

This order must survive mobile reflow.

## 10.3 Purchase panel

The purchase panel includes only what is necessary to decide:

- division and product role;
- maker/brand when meaningful;
- product name;
- selected option summary;
- price;
- availability;
- required selectors;
- proof/fit/compatibility/eligibility state;
- included versus required item summary;
- state-derived primary action;
- concise fulfillment or policy condition;
- nearby recovery or Support.

No CTA may be visually stronger than the unresolved condition that invalidates it.

## 10.4 Selection synchronization

Changing a material option must update, as applicable:

- selected SKU/variant;
- URL or shareable state;
- exact media;
- price;
- availability;
- evidence/COA association;
- dimensions/specifications;
- compatibility and fit;
- eligibility;
- included/required relationships;
- fulfillment condition;
- CTA.

If synchronization is not complete, the interface fails closed instead of displaying a plausible combination.

## 10.5 Product media gallery

Order media by decision value:

1. exact selected identity;
2. alternate form/angle;
3. scale;
4. connection/fit;
5. contents;
6. assembly or setup;
7. material/craft;
8. responsible-use or context media.

Rules:

- thumbnails and controls are named and keyboard-operable;
- zoom does not expose a misleading or different variant;
- video is user-controlled and captioned/transcribed when speech or material audio is present;
- critical dimensions, compatibility, contents, and safety facts remain in text;
- missing media is handled honestly without breaking the purchase panel.

## 10.6 Evidence and disclosure hierarchy

Immediately visible:

- decision-changing blocker;
- evidence or verification state;
- material fit/compatibility/eligibility condition;
- required additional item;
- unusual fulfillment or fragile-product condition.

Progressively disclosed:

- extended specifications;
- methodology and source lineage;
- full COA or document context;
- care and maintenance;
- detailed reviewer/customer context;
- long policy explanation.

Disclosure labels must describe their contents. “Details” should not hide fundamentally different categories of truth in one undifferentiated accordion.

## 10.7 Division PDP requirements

### THCA

- exact form and quantity;
- profile/type or other verified categorization;
- composition and claims lanes;
- lot/batch evidence association and currentness;
- availability distinct from customer eligibility;
- fulfillment restrictions;
- responsible-use and policy context where required;
- no therapeutic implication through design.

### Vape & Nicotine

- item role in the system;
- exact supported device/platform/component relationships;
- compatibility status with scope and conditions;
- included, required, optional, and replacement items;
- capacity, resistance, consumable or power facts where relevant;
- replacement supply and lifecycle;
- unknown compatibility shown as unknown;
- no youth-coded visual or copy treatment.

### Glass & Accessories / Merch

- complete piece versus component role;
- material;
- structured dimensions;
- joint size, gender/type, angle/orientation, length and clearance where relevant;
- included, required, optional, replacement, and care items;
- maker/provenance;
- scale and connection media;
- fragile delivery, inspection, damage, and support behavior.

## 10.8 Relationships and recommendations

Every recommendation has a declared relationship:

- compatible;
- required;
- included;
- optional;
- replacement;
- successor;
- replenishment;
- care;
- bundle;
- complementary;
- curated for a named job.

The system must not use “You may also like” as a universal excuse for unrelated cross-selling. Unknown relationships are not recommendations.

## 10.9 Reviews and customer evidence

- Reviews follow exact product/variant scope where possible.
- Summary language distinguishes prevalence from certainty.
- Customer reports are labeled as reports, not verified specifications.
- Context such as use pattern, preference, or owned system is included when it changes interpretation.
- Incentivized, imported, sparse, old, or mismatched evidence is disclosed.
- A low-volume review set must not be presented as consensus.

---

# 11. EDITORIAL / EDUCATION SYSTEM

## 11.1 Role

Editorial content turns product knowledge into usable customer advantage. It should reduce uncertainty, teach a repeatable decision, explain the house’s standards, or document maker/operator provenance.

## 11.2 Information architecture

Organize learning primarily by task:

- choose;
- compare;
- verify;
- set up;
- replace;
- care;
- troubleshoot;
- understand policy or eligibility.

Chronological publishing may exist, but it is not the primary customer navigation.

## 11.3 Guide anatomy

A guide contains:

1. task and intended outcome;
2. who the guidance is for;
3. prerequisites and limits;
4. steps or comparison framework;
5. evidence and source type;
6. how to verify the result;
7. failure or recovery path;
8. relevant product, category, or Support route;
9. author/owner and reviewed date.

## 11.4 Editorial voice

- direct, informed, and human;
- specific enough to prove experience;
- willing to state tradeoffs and unknowns;
- never faux-legal, faux-scientific, or forced-street;
- no generic SEO filler;
- no unsupported “best,” “safest,” “cleanest,” or health implication;
- no borrowed reviewer language presented as house fact.

## 11.5 Curation and provenance

A curation story requires:

- a named customer job or house question;
- a current set of qualified items;
- a concise rationale for each inclusion;
- an owner or review responsibility;
- source and evidence maturity;
- a reviewed date;
- a route for correction or changed status.

Maker/operator stories should show real work, place, material, process, or history. They should not turn people into aesthetic props.

## 11.6 Editorial-to-commerce boundary

- Editorial may route to a qualified category or exact product.
- Products embedded in editorial still show current price, availability, and blocker state from canonical commerce data.
- Editorial cannot pin a product as compatible, eligible, evidence-current, or in stock.
- Old articles degrade gracefully when products change or disappear.
- Sponsored or commercial relationships are disclosed.

---

# 12. RESEARCH / LITMUS TEST PRESENTATION SYSTEM

## 12.1 Purpose

The customer-research system explains what Blowin’ Smoke has learned, how mature that learning is, and how it influenced selection—without converting opinion into fact or creating a proprietary-looking badge that overclaims certainty.

## 12.2 Evidence firewall

The interface must distinguish:

- verified product fact;
- manufacturer or maker claim;
- measured or inspected fact;
- compatibility/fit validation;
- policy or eligibility rule;
- reviewer observation;
- customer testimony;
- Blowin’ Smoke interpretation;
- unresolved or unknown information.

Visual consistency may connect these lanes, but labels must keep them epistemically separate.

## 12.3 Customer-facing hierarchy

### Product card

At most one short, contextual cue:

- Why we carry it
- Best for: named job
- Known tradeoff
- Evidence current

### PDP near the decision

After exact facts and action state:

- **House Read:** one plain-language conclusion;
- **Why it made the shelf:** the specific selection rationale;
- **Best for:** a customer job, never an unqualified superlative;
- **Know before buying:** one meaningful expectation or tradeoff.

### Deeper research record

When useful:

- customer job;
- observed strengths;
- observed tradeoffs;
- preference spectrum;
- source type and coverage;
- evidence maturity;
- reviewed date;
- what the evidence does not prove;
- correction/history note.

## 12.4 Litmus Test status

The Blowin’ Smoke Litmus Test is primarily an internal selection discipline. If exposed publicly, it is a contextual record—not a quality seal.

A public record may show:

- scope of the test;
- dimensions considered;
- a plain-language display of an established internal research status;
- current evidence basis;
- known tradeoff;
- reviewed date.

This document does not create a second Litmus taxonomy. The internal research state remains authoritative and any public wording is a governed presentation mapping:

| Established internal state | Proposed public wording | Required qualification |
|---|---|---|
| PASSED — STOCK CANDIDATE | Stock candidate | Research qualification only; not proof of publication, inventory, compliance, or availability |
| PASSED — TEST BUY | Test-buy candidate | Limited evaluation step; not a customer recommendation |
| WATCH | Watching | Reason and next evidence need remain visible |
| FAILED / DO NOT STOCK | Not selected | If published as a research record, state the relevant reason without defamatory or unsupported claims |
| INSUFFICIENT EVIDENCE | Evidence incomplete | Unknowns remain explicit and no positive cue is shown |

No Litmus record is shown as “not evaluated.” The absence of an evaluation produces no Litmus claim. A future change to internal states requires one governed mapping update rather than ad hoc card or PDP copy.

It must not:

- imply laboratory certification;
- substitute for a COA, compatibility record, specification, or legal eligibility;
- collapse diverse dimensions into an unexplained score;
- claim reviewer consensus without a sufficient corpus;
- remain “passed” after its evidence becomes stale;
- appear as a badge on every product.

## 12.5 Recommendation language

Approved patterns:

- Best for customers who prioritize…
- Strong fit when…
- We carry it because…
- Reviewers repeatedly valued…
- Customers reported…
- Manufacturer states…
- We verified…
- Evidence is incomplete for…
- Not the best fit if…

Disallowed patterns without qualifying evidence:

- objectively best;
- perfect for everyone;
- reviewer approved;
- community favorite;
- healthiest;
- guaranteed fit;
- lab tested as a vague badge;
- Blowin’ Smoke certified.

## 12.6 Research component anatomy

A reusable research module contains:

1. conclusion;
2. customer job;
3. strength;
4. tradeoff;
5. evidence lane;
6. maturity or coverage;
7. source/review date;
8. limitation;
9. route to details or correction.

## 12.7 Known corpus limitations

- The Insight Bank’s final Litmus board is truncated; no missing conclusion may be reconstructed.
- THCA research does not establish a currently approved live THCA SKU.
- Glass lacks an equivalent broad independent customer-review corpus; do not imply one.
- Research-candidate records are not inventory, publication, compliance, fit, or availability truth.
- Later integrated statuses and closure decisions supersede older exploratory recommendations.

---

# 13. MOBILE SYSTEM

## 13.1 Mobile principle

Mobile is the strongest test of whether the system understands its own priorities. It must preserve the decision, not merely fit the desktop layout into one column.

## 13.2 Priority order

Across commerce surfaces, preserve:

1. identity and current selection;
2. material blocker or unknown;
3. required choices;
4. price and availability;
5. proof, fit, compatibility, or eligibility;
6. truthful action;
7. supporting depth;
8. editorial and promotion.

If space forces a conflict, promotion yields first.

## 13.3 Header and navigation

- Keep the identity legible.
- Keep Search and Cart named or accessibly labeled.
- Show Cart state without relying on a tiny badge alone.
- Use a labeled Menu trigger.
- Preserve all three division routes, Learn, and Support.
- Avoid a permanent multi-row header that obscures content.
- Do not hide division access inside visual tiles only.

## 13.4 Filters and sort

- Preserve active-filter visibility outside the filter panel.
- Show result count and scope before opening controls.
- Use a full-height or contained sheet only with correct focus, dismissal, scroll, and state retention.
- Keep Apply and Clear meanings distinct.
- Do not require precision gestures.
- Returning from a PDP should restore query, filters, sort, and reasonable scroll context.

## 13.5 PDP

- Exact selection and blocker state appear before extended storytelling.
- Media is swipeable only when controls and position are also understandable.
- Sticky purchase action may be used only if it reflects the same canonical state and does not cover evidence or browser controls.
- Accordions use descriptive labels and preserve state appropriately.
- Tables become labeled records rather than clipped columns.
- Long measurements, compatibility names, and evidence identifiers wrap without ambiguity.

## 13.6 Cart and overlays

- Quick Cart confirms the event and exposes the next valid path.
- Full Cart remains the source for totals, reservations, blockers, and correction.
- Sheets and dialogs have visible close controls, focus containment, return of focus, and sufficient bottom safe-area spacing.
- Background scroll and interaction are disabled while a modal surface is active.

## 13.7 Touch, keyboard, and assistive behavior

- Target size should meet or exceed the platform’s accessible-touch guidance; the static prototype used 44 units as a working minimum.
- Focus order follows visual and decision order.
- Every icon-only control has an accessible name.
- Selection state is announced.
- Status changes use an appropriate live region without repeating excessive content.
- Error summaries link to the affected control.
- Text enlargement and 200% zoom do not remove actions or force two-dimensional scrolling for ordinary content.
- Reduced motion never removes state confirmation.

## 13.8 Mobile proof status

Statically tested:

- reflow at 390 and 320 widths;
- all three divisions in compact navigation;
- default/open component states;
- category, PDP, search, Quick Cart, and full-cart compositions;
- no observed horizontal overflow in the captured fixtures.

Production-unverified:

- device/browser matrix;
- dynamic browser chrome and safe areas;
- real keyboard and screen-reader flow;
- font loading;
- live data extremes;
- focus trap and return;
- touch target measurement in production CSS;
- motion preference;
- network degradation and optimistic state;
- real checkout continuity.

---

# 14. CONVERSION SYSTEM

## 14.1 Conversion definition

Conversion is movement to the next valid decision, not maximum CTA exposure. A customer who learns that an item is incompatible before purchase has experienced a successful conversion of uncertainty into confidence.

## 14.2 Funnel responsibilities

- **Home → Division:** correct room.
- **Division → Category/job:** correct decision frame.
- **Category/search → PDP:** qualified candidate.
- **PDP → Cart:** exact resolved selection.
- **Quick Cart → Continue/full cart/checkout:** acknowledged consequence.
- **Blocked state → recovery:** compatible, eligible, available, complete, or supported alternative.
- **Editorial → commerce/support:** informed next step, not forced product insertion.

## 14.3 Decision reduction

The system reduces decisions by:

- showing only the attributes that matter at the current level;
- aligning like facts;
- remembering state;
- naming unknowns;
- recommending by relationship and job;
- keeping one primary action;
- placing recovery beside the blocker;
- moving deep methodology below the immediate decision;
- preventing invalid combinations.

It must not reduce decisions by hiding tradeoffs or silently choosing consequential options.

## 14.4 Promotion

- One current offer may be attached to the relevant product, category, or cart condition.
- Terms are reachable at the point of claim.
- Original and current price remain legible.
- Countdown, low-stock, popularity, and urgency claims require canonical evidence.
- No false scarcity, perpetual sale, surprise threshold, or opt-out obstruction.
- Promotions cannot override eligibility, compatibility, evidence, or stock state.

## 14.5 Search conversion

Search results should:

- confirm the interpreted query;
- group or label cross-division result types;
- tolerate synonyms and known model/part terminology;
- show exact role and material state;
- offer correction and broader/narrower scope;
- never invent compatibility from lexical similarity.

## 14.6 Recommendation conversion

Recommendations are typed and inspectable:

- compatible with;
- required for;
- replacement for;
- successor to;
- replenishes;
- care for;
- complete the setup;
- often chosen for a named job;
- curated together for a stated reason.

Each relationship has a source and status. Promotional adjacency alone is not a relationship.

## 14.7 Cart continuity

Quick Cart must show:

- exact item and selected variant;
- quantity;
- price;
- material status change since selection;
- a route to continue or review.

Full Cart must show:

- exact line identity and options;
- price and total basis;
- availability/reservation state;
- eligibility, compatibility, required-item, evidence, or fragile-handling consequence where applicable;
- recovery/edit/remove;
- promotion and shipping conditions;
- one primary next step.

The Iteration 05.1 cross-surface continuity audit is the static reference for carrying state from PDP to Quick Cart to Full Cart. Production cart state and checkout remain implementation validation.

## 14.8 Trust

Trust is built by:

- consistent state across surfaces;
- exact product and option identity;
- evidence source and date;
- clear unknowns;
- honest promotion;
- predictable interaction;
- visible support;
- concrete shipping, return, damage, and replacement behavior;
- correction when facts change.

Trust is not built by generic shield badges, excessive review stars, brand-name payment logos, or unsupported superlatives.

## 14.9 Measurement

Measure more than purchase rate:

- successful division orientation;
- search reformulation and zero-result recovery;
- filter use and abandonment;
- compatibility/fit resolution;
- evidence opening where relevant;
- blocked-to-recovery completion;
- replacement/replenishment discovery;
- support escalation;
- return and incompatibility reasons;
- rebuy behavior;
- content-assisted conversion;
- expectation mismatch.

Use measurement to improve decision quality. Do not optimize a local CTA at the expense of returns, distrust, or unusable purchases.

---

# 15. THREE-HOUSE-DIVISION SYSTEM

## 15.1 One house, three decision models

The divisions share:

- logo and house identity;
- global navigation and Search;
- typography roles;
- layout frame and spacing logic;
- control and disclosure grammar;
- product-card skeleton;
- evidence labels and semantic states;
- cart, account, support, policy, and footer;
- voice principles;
- Pressure & Proof intensity model.

They differ in:

- customer jobs;
- taxonomy;
- comparison facts;
- evidence;
- blockers;
- media jobs;
- relationship model;
- support and recovery;
- restrained contextual accent and editorial rhythm.

## 15.2 Division contract

| Dimension | THCA | Vape & Nicotine | Glass & Accessories / Merch |
|---|---|---|---|
| Primary question | What exact product/form fits the intended context, and is its evidence/eligibility state clear? | What role does this item play, and will it work with what I own or need next? | What is this object/component, and will its physical/material relationship work? |
| Core identity | Form, quantity, verified profile/type, exact lot/variant where material | Device/platform, component or consumable role, exact model/variant | Complete piece/component/accessory/merch role, maker, material, exact form |
| Comparison truth | Form, quantity, profile, composition, evidence currentness, price basis | Platform, compatibility, capacity/resistance, lifecycle, replacement supply, price basis | Dimensions, connection geometry, material, included/required pieces, maker, price basis |
| Major blockers | Evidence gap, eligibility, unavailable exact option, fulfillment restriction | Incompatible/unknown relationship, required component absent, unsupported replacement, stock | Incompatible/unknown fit, missing measurement, clearance/orientation issue, missing required component |
| Media jobs | Exact form/variant, quantity/scale, package/label, evidence context | Exact model, component connection, contents, setup, replacement location, size | Scale, joint/connection, angle/orientation, contents, assembly, material/craft |
| Evidence emphasis | Lot/batch COA and claim scope | Verified product relationships and supportability | Measurement provenance, verified pair fit, material/maker truth |
| Recovery | Eligible/current-evidence alternative, different form/quantity, Support | Find compatible part/device, verified successor, Notify, Support | Find matching component/adapter, measurement guide, Support/damage process |
| Editorial character | Clear evidence literacy and product-use context | Enthusiast system knowledge and lifecycle guidance | Object literacy, maker/craft, fit, setup, and care |

Merch belongs within the Glass & Accessories / Merch division at launch unless later catalog scale proves it deserves a distinct information architecture. Merch cards use the shared commerce grammar but do not inherit physical-compatibility fields that are not applicable.

## 15.3 Division distinction without fragmentation

Use:

- different editorial crops and media subjects;
- different decision facts;
- contextual labels and guide topics;
- a restrained accent or surface shift;
- division-specific examples of house judgment.

Do not use:

- separate logos;
- unrelated type systems;
- entirely different navigation;
- different component behavior;
- three unrelated color brands;
- inconsistent evidence terminology;
- division-specific novelty interactions.

## 15.4 Cross-division commerce

Cross-division recommendations are allowed only when the relationship is useful and valid. Examples include a care product, a compatible accessory, or a house-curated setup. The interface names the relationship and division. It does not blend products into a lifestyle collage that obscures role or policy.

## 15.5 House-wide unknown and not-applicable states

Shared relationship status vocabulary:

- Compatible
- Incompatible
- Conditionally compatible
- Universal
- Unknown / unverified
- Not applicable

Eligibility, evidence, availability, and publication have their own vocabularies and must not be collapsed into compatibility. A product can be compatible but unavailable, available but ineligible, or published with an explicitly unresolved informational state only where policy permits.

---

# 16. DO / DO NOT RULES

## 16.1 Do

- Do make the three divisions obvious from every primary entry surface.
- Do use decisive hierarchy and restrained repetition.
- Do explain why a product was selected.
- Do name the customer job behind a recommendation.
- Do keep exact selection, price, availability, and blocker state synchronized.
- Do distinguish verified facts, claims, reports, policy, and house interpretation.
- Do show unknown and unverified states plainly.
- Do connect blockers to recovery.
- Do use product-specific media for identity, scale, fit, contents, setup, and material.
- Do let editorial expression become quieter as the customer approaches purchase.
- Do preserve context across search, filters, PDP, Quick Cart, and Full Cart.
- Do make compatibility and physical fit bidirectional where verified and useful.
- Do treat replacement supply, care, damage, and support as part of the product system.
- Do use real operator, maker, place, and process stories with permission.
- Do design empty, error, loading, stale, blocked, and partial-data states.
- Do support keyboard, screen reader, zoom, touch, contrast, captions, and reduced motion.
- Do validate production type, media, responsive behavior, and real catalog extremes before launch.

## 16.2 Do not

- Do not clone Glossier’s trade dress, palette, type, photography, copy, card proportions, or beauty taxonomy.
- Do not reproduce Bay Smokes’ promotional density or allow merchandising labels to replace taxonomy.
- Do not attribute Blowin’ Smoke compatibility architecture to VaporDNA or Smoke Cartel.
- Do not use neon weed clichés, smoke loops, leaf motifs, generic luxury black, or counterfeit street credibility.
- Do not create three disconnected brand skins.
- Do not hide a material blocker in an accordion.
- Do not offer Add to Cart when required state is unresolved.
- Do not infer fit, eligibility, evidence, inventory, popularity, or consensus from titles, images, URLs, or similarity.
- Do not turn the Litmus Test into an unexplained score or proof badge.
- Do not use review count or stars as the only trust system.
- Do not call an item “best” without stating for whom and on what basis.
- Do not stack promotional, urgency, popularity, curation, evidence, and status badges.
- Do not reveal essential information only on hover, in motion, or in imagery.
- Do not let editorial content pin operational truth.
- Do not use random rounded cards, gradients, glassmorphism, or dashboard patterns because they are fashionable.
- Do not treat the prototype’s fonts, colors, spacing, product fixtures, or timings as final tokens.
- Do not use disabled controls without a reason and recovery.
- Do not preserve desktop composition at the cost of mobile decision order.
- Do not claim production accessibility, performance, or conversion validation from screenshots.

---

# 17. REUSABLE COMPONENT INVENTORY

Component names describe responsibilities, not mandatory implementation names.

## 17.1 Global shell

| Component | Responsibility | Required states |
|---|---|---|
| AnnouncementBar | One consequential current message | hidden, active, dismissible where appropriate |
| GlobalHeader | House identity and primary utilities | default, compact, sticky, menu open |
| DivisionNavigation | Three-room orientation | current division, expanded group, keyboard focus |
| MegaMenu | Jobs, roles, guidance, curation | closed, open, focus traversal, escape |
| MobileMenu | Full compact navigation | closed, open, nested group, focus return |
| GlobalSearchTrigger | Named entry to whole-house search | idle, active |
| CartStatus | Cart route plus state | empty, quantity, changed |
| Breadcrumbs | Hierarchy and scope | standard, compact, overflow-safe |
| Footer | Institutional, support, and policy routes | standard |

## 17.2 Search and discovery

| Component | Responsibility | Required states |
|---|---|---|
| SearchOverlay or SearchPage | Query entry and suggestions/results | idle, typing, loading, results, zero, error |
| SearchScope | Whole-house versus category scope | global, scoped, broaden |
| SuggestionGroup | Queries, products, categories, guides | available, empty |
| FilterSummary | Active filters and result count | none, active, removable |
| FilterPanel | Structured qualification | closed/open, applied, unknown data, error |
| SortControl | Transparent result order | default, selected |
| ZeroResultRecovery | Preserve and relax customer work | scoped recovery, broader search, Support |

## 17.3 House and editorial

| Component | Responsibility | Required states |
|---|---|---|
| HouseOpening | Identity, challenge, three routes | media/no media, narrow/wide |
| DivisionPortal | One room’s job and route | each division, unavailable editorial media |
| HouseStandards | Selection and evidence principles | concise/default |
| CuratedSet | Small reasoned selection | products available, partial, no qualified set |
| EditorialFeature | Task/provenance story | image/no image, current/stale product |
| GuideCard | Task-based learning route | standard |
| GuideStep | Instruction, verification, recovery | normal, warning |
| SourceDisclosure | Author, source, date, limitation | complete, partial |

## 17.4 Product discovery

| Component | Responsibility | Required states |
|---|---|---|
| ProductCard | Qualified product preview | ready, options, blocked, unknown, out of stock |
| ProductMediaFrame | Exact item/variant media | image, video, missing, alternate |
| ProductIdentity | Maker, name, role, division | mixed/within-division |
| ComparisonFacts | Two or three aligned facts | complete, unknown |
| PriceDisplay | Exact/range/basis/promotion | standard, range, sale, unavailable |
| AvailabilityState | Current stock/publication state | available, low only if verified, out, notify |
| CurationCue | One inspectable house reason | present, absent |
| StateDerivedAction | Truthful next step | add, configure, verify, notify, recover |

## 17.5 PDP and product truth

| Component | Responsibility | Required states |
|---|---|---|
| ProductGallery | Decision-oriented media | exact selection, alternate, video, missing |
| VariantSelector | Atomic purchasable state | available, unavailable, required, changed |
| PurchasePanel | Decision summary and action | ready, blocked, unknown, error |
| SelectionSummary | Exact chosen configuration | complete, incomplete |
| EvidenceStatus | Evidence scope/currentness | current, stale, missing, not applicable |
| EligibilityStatus | Customer/location/policy readiness | eligible, ineligible, unresolved |
| CompatibilityStatus | Verified relationship | compatible, incompatible, conditional, universal, unknown, N/A |
| PhysicalFitRecord | Dimensions and connection relationship | verified, conditional, unknown |
| IncludedRequiredList | Package and dependency truth | included, required, optional, replacement |
| SpecGroup | Structured facts | complete, partial, unknown |
| ProofDocument | COA/evidence access and context | current, superseded, unavailable |
| MakerProvenance | Maker/material/process truth | verified, partial |
| CareAndSetup | Setup, maintenance, replacement | standard, warning |
| FragileSupport | Inspection, damage, replacement workflow | normal, issue |

## 17.6 Research and curation

| Component | Responsibility | Required states |
|---|---|---|
| HouseRead | Short Blowin’ Smoke interpretation | current, revised |
| CurationRationale | Why it made the shelf | current, withdrawn |
| CustomerJobTag | Named use/priority context | standard |
| ExpectationMap | Preference spectrum and tradeoff | sufficient evidence, limited |
| EvidenceMaturity | Coverage and confidence | mature, emerging, insufficient |
| LitmusStatusRecord | Contextual evaluation record | stock candidate, test-buy candidate, watch, failed/do not stock, insufficient evidence |
| SupportabilityRecord | Replacements, upkeep, help | supported, limited, unknown |
| CustomerReviewContext | Testimony with scope | sufficient, sparse, mismatched |
| ResearchCorrection | Changed conclusion/history | corrected, superseded |

## 17.7 Relationships and recovery

| Component | Responsibility | Required states |
|---|---|---|
| RelationshipCard | Typed product-to-product relation | compatible, required, replacement, care, curated |
| OwnThisDeviceLookup | Start from an owned system | matched, multiple, unknown, no result |
| ReverseCompatibilityList | Part-to-supported-platform discovery | verified, conditional, unknown |
| AlternativeRoute | Valid recovery from blocker | replacement, successor, different option, Support |
| NotifyAvailability | Allowed stock notification | available, submitted, unavailable |
| SupportEscalation | Preserve context for human help | product, selection, relationship attached |

## 17.8 Cart and feedback

| Component | Responsibility | Required states |
|---|---|---|
| QuickCart | Confirm addition and route onward | open, changed, error |
| FullCartLine | Exact line and consequences | valid, changed, blocked, removable |
| CartSummary | Totals and conditions | calculating, ready, error |
| StatusMessage | Action feedback | success, warning, error, informational |
| ErrorSummary | Linked actionable errors | one, multiple |
| ModalDialog | Focused consequential task | open, validation, close/return |
| Disclosure | Supporting depth | closed, open, unavailable |

All components require loading, empty, partial-data, error, keyboard, focus, touch, narrow-width, and reduced-motion definitions where applicable.

---

# 18. IMPLEMENTATION PRIORITY

## Phase 1 — Trustworthy commerce foundation

Build the smallest complete customer path around canonical operational data:

- global shell with all three divisions, Search, Cart, Learn, and Support;
- Home with house opening, three-division orientation, standards, restrained curation, and service;
- division landing templates for all three rooms;
- category/search with canonical scope, filters, sort, state, and recovery;
- shared product-card shell with division-specific comparison facts;
- universal PDP shell with synchronized selection, URL, media, price, availability, and state-derived action;
- THCA evidence/eligibility presentation;
- vape role and compatibility presentation;
- glass physical-data/fit presentation;
- Quick Cart and Full Cart continuity;
- basic task-based guides;
- plain-language House Read and curation rationale;
- responsive, keyboard, screen-reader, zoom, contrast, touch, and reduced-motion foundations;
- loading, empty, partial, stale, blocked, and error states;
- analytics for orientation, qualification, recovery, and expectation mismatch.

Phase 1 must not wait for decorative campaign media. It must work with incomplete optional media and a small qualified catalog.

Phase 1 acceptance gates:

- real catalog data proves exact state continuity;
- no unsupported quick-add path;
- blockers and unknowns survive every responsive state;
- all three divisions remain one house;
- no public claim crosses its evidence lane;
- core journeys pass accessibility and performance testing;
- legal/compliance policy governs regulated content and action.

## Phase 2 — Rich decision support

Add depth after the foundation is reliable:

- verified bidirectional device/component and physical-fit discovery;
- owned-device/owned-component lookup;
- richer evidence, COA, maker, measurement, and provenance records;
- exact variant and connection-focused media sets;
- comparison tools for like roles/jobs;
- structured setup, care, replacement, and fragile-support journeys;
- typed recommendation modules;
- research maturity and detailed Litmus records where appropriate;
- editorial collections with current commerce-state binding;
- customer review context and expectation maps;
- improved replacement, replenishment, notification, and recovery routes;
- one bounded motion/editorial moment where it improves orientation.

Phase 2 acceptance gates:

- relationships are authoritative and scoped;
- unknown never auto-resolves;
- evidence timestamps and source lineage work in production;
- assistive technology can access the same product truth;
- customer outcomes justify added complexity.

## Phase 3 — Measured differentiation

Build only after evidence shows the opportunity:

- personalized but privacy-respecting owned-system and replenishment support;
- first-party outcome feedback that improves curation;
- advanced fit/setup visualization;
- stronger maker/operator editorial;
- adaptive division merchandising by customer job;
- measured search synonym and intent improvements;
- mature recommendation explanations;
- experimentation with bounded art direction, motion, and campaign modules;
- loyalty or membership presentation only if its operational value is real.

Phase 3 is not permission for personalization theater, opaque ranking, surveillance, or visual novelty. Every addition must preserve state truth, accessibility, and the one-house model.

## Deferred until independently approved

- a final production font package;
- exact production color, spacing, radius, timing, and breakpoint tokens;
- public universal product scores;
- any claim of reviewer consensus across all divisions;
- autoplay commerce media;
- complex 3D/AR fit visualization;
- any storefront behavior that depends on unverified compatibility or eligibility;
- any redesign of the closed prototype solely for novelty.

---

# 19. PROVENANCE MATRIX

This matrix maps major recommendations to the sources that materially informed them. “BS synthesis” means the final resolution is original to Blowin’ Smoke even when the underlying problem or principle came from reference research.

| Major recommendation | Primary source(s) | Source contribution | Blowin’ Smoke resolution |
|---|---|---|---|
| Premium means judgment, respect, and performance | BRAND-01, TASK-G1, G-HOME-DNA | Brand purpose plus premium hierarchy research | Make operational truth and visible selection judgment the premium signal |
| Pressure & Proof intensity continuum | BRAND-01, TASK-G2, SYS-05, P-03, P-051-LOCK | Brand challenge, page-risk hierarchy, comparative art-direction work | Strongest expression upstream; calmest truth at consequential action |
| Constructed Signal as structural grammar | P-03, P-04, P-05, P-051-EVAL | Three-direction comparison and iterative application | Use constructed framing, alignment, rules, and selective interruption without cloning a source site |
| Poster Pressure only as bounded editorial energy | P-03, P-051-HOME | Comparative direction and anti-generic homepage audit | Use for rare house moments, never as the entire commerce skin |
| Independent Archive as provenance reference | P-03, SYS-05 | Editorial/provenance direction | Apply to maker, research, and education content, not global nostalgia styling |
| Three visible divisions in one house | BRAND-01, RESEARCH-00, SYS-01, SYS-02, P-051-ROUTES | Brand identity, domain program, IA, semantic route audit | Shared shell and semantics; division-specific decisions and media |
| Home conversion is correct orientation | G-HOME-DNA, SYS-02, SYS-04, P-051-HOME | Homepage sequence and anti-generic audit | House identity → three divisions → standards → reasoned curation → Learn/Support |
| Stable global shell | G-HOME-FORENSIC, G-HOME-DNA, SYS-02 | Navigation and component consistency | One header/search/cart/footer grammar across all divisions |
| Search is a primary whole-house path | G-HOME-FORENSIC, G-HOME-DNA, SYS-02, P-02, P-051-ROUTES | Search overlay and route/system studies | Named global Search, explicit category scope, preserved context and recovery |
| Stable product-card anatomy | G-HOME-DNA, SYS-04, P-051-BALANCE | Reusable card hierarchy and merchandise stress testing | One shell; category-specific facts; state-derived actions |
| Quick Add only for resolved state | G-HOME-DNA, G-PDP-DNA, SYS-03, SYS-04 | State-aware cards and canonical option model | Quick Add is withheld for options, fit, eligibility, evidence, or availability blockers |
| PDP state synchronization | G-PDP-FORENSIC, G-PDP-DNA, SYS-03, P-051-CONTINUITY | Option/gallery/URL/action synchronization | Exact SKU state updates every material surface and fails closed on mismatch |
| Progressive disclosure without hidden blockers | G-PDP-DNA, SYS-04, P-051-DISCLOSURE | Layered PDP information and prototype audit | Deep method can collapse; decision-changing truth remains visible |
| Purposeful, user-controlled media | G-HOME-FORENSIC, G-PDP-DNA, SYS-05, P-051-MEDIA | Dynamic media behavior and media-role direction | Give every asset a decision or identity job; preserve control and text truth |
| Semantic, accessible motion | G-HOME-FORENSIC, G-HOME-DNA, SYS-05 | Confirmed controls and motion principles | Motion explains topology/state; reduced motion removes nonessential effects |
| THCA evidence and eligibility distinct from inventory | BAY-INTEL, BAY-DECISION, BAY-CLOSE, SYS-03 | Domain decision and evidence model | Separate current evidence, customer eligibility, availability, and publication |
| THCA exact option and lot-aware proof | BAY-PDP, BAY-DECISION, CI-THCA | PDP detail and customer trust research | Tie claims and evidence to exact product/lot where applicable |
| Vape compatibility is a bidirectional relationship | VAPE-INTEL, VAPE-CLOSE, CI-POD | Domain problem and supportability research | Original owned-device and reverse-part architecture using verified relationships |
| Vape lifecycle and replacement support are product value | VAPE-INTEL, CI-POD, CI-VAPORIZER, CI-REVIEWS | Device/consumable lifecycle and customer outcomes | Show included/required/replacement state and ongoing supportability |
| Glass fit needs structured geometry and media | GLASS-INTEL, GLASS-CLOSE, SYS-03 | Physical compatibility problem | Combine verified dimensions, connection records, scale, and fit media |
| Maker/material/care are product truth | GLASS-INTEL, GLASS-CLOSE | Provenance and physical-operation requirements | Make maker, material, care, and fragile support inspectable where applicable |
| Unknown remains unknown | VAPE-CLOSE, GLASS-CLOSE, BAY-CLOSE, SYS-03 | Research closure and evidence discipline | Shared explicit unknown/unverified state; never silent compatibility or eligibility |
| Curation states a customer job and tradeoff | CI-BANK, CI-LEDGER, CI-REVIEWS, CI-POD | Rebuy, preference, expectation, and friction patterns | Use Why we carry it, Best for, and Know before buying with evidence scope |
| No universal score or badge wall | CI-BANK, CI-THCA, BRAND-01, P-051-COPY | Evidence maturity and respectful voice | Plain-language contextual records; Litmus primarily internal |
| Evidence firewall | CI-LEDGER, CI-BANK, BAY-CLOSE, VAPE-CLOSE, GLASS-CLOSE | Different truth sources and closure boundaries | Label verified, manufacturer, measured, policy, reviewer, customer, house, and unknown lanes |
| Task-based education | SYS-02, SYS-04, CI-POD, CI-VAPORIZER | IA plus observed decision/support needs | Organize Learn by choose/verify/setup/replace/care/troubleshoot |
| Recovery is part of conversion | G-PDP-DNA, SYS-04, P-051-CONTINUITY, domain closures | State behavior and relationship requirements | Place a valid alternative, verification, notify, or Support route beside the blocker |
| Promotion remains subordinate | G-HOME-DNA, BAY-HOME, BAY-INTEL, BRAND-01 | Controlled merchandising and promotional-density caution | At most one contextual promotion after identity; no false urgency |
| Flat surfaces and low chrome | G-HOME-DNA, SYS-05, P-03, P-051-EVAL | Premium discipline and selected art direction | Use alignment, rules, and contrast instead of floating card/shadow systems |
| Warm-neutral, ink, restrained house signal color | SYS-05, P-04, P-05, P-051-EVAL | Prototype visual hypothesis | Preserve color roles; validate actual production values and contrast later |
| Archivo role system is provisional | P-051-TYPE, P-051-EVAL | Latest typography correction | Current implementation hypothesis only; licensing and production stress test required |
| Mobile preserves decision order | G-HOME-DNA, G-PDP-DNA, SYS-04, P-02, P-051-EVAL | Responsive principles and static viewport evidence | Blocker, required choice, price/state, and action survive before promotion |
| Tables reflow to labeled records | SYS-04, P-051-DISCLOSURE, P-051-EVAL | Dense evidence and responsive study | Preserve semantic associations without clipped two-dimensional layout |
| Cart carries exact state and consequence | G-HOME-FORENSIC, G-HOME-DNA, P-051-CONTINUITY | Cart drawer and prototype continuity | Quick Cart confirms; Full Cart exposes totals, blockers, and recovery |
| Trust uses concrete commitments, not badge theater | BRAND-01, G-HOME-DNA, CI-BANK | Respect, hierarchy, customer confidence | Show evidence, policies, dates, support behavior, and corrections |
| Real product/operator/maker media over stock rebellion | BRAND-01, SYS-05, P-051-MEDIA | Cultural credibility and media direction | Permissioned real work, product, place, fit, and material |
| Prototype metrics are not production tokens | SYS-07, SYS-08, P-051-EVAL | Static evaluation limits | Treat type, spacing, colors, breakpoints, timing, and fixtures as hypotheses |
| Real catalog truth must drive storefront state | SYS-03, SYS-04, CATALOG-READY | Canonical data and readiness gaps | No Git-authored operational claims; tolerate missing optional media, not missing material truth |
| Measure decision quality, not CTA clicks alone | CI-REVIEWS, CI-BANK, SYS-01 | Retention, expectation, friction, and commerce goals | Track qualification, recovery, incompatibility, returns, rebuy, and support outcomes |

---

## Canonical decision

Blowin’ Smoke will not be a softened copy of a premium reference and will not compensate for weak commerce with louder art direction. Its recognizable design DNA is the combination of:

- one independent house with three legible rooms;
- pressure used to establish identity;
- proof used to earn action;
- stable, low-chrome component grammar;
- exact state and material truth;
- original compatibility and physical-fit systems;
- reasoned curation with visible limits;
- real product, operator, maker, and customer context;
- responsive priority and accessible motion;
- recovery paths that respect the customer.

This document closes the design-research consolidation step. Storefront implementation begins only under a separate authorized task and must validate every production-unverified choice against real data, real content, accessible interaction, performance, policy, and customer outcomes.
