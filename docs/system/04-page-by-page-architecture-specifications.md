# Blowin' Smoke — Page-by-Page Architecture Specifications

**Status:** Governing page architecture specification

**Master system:** `docs/system/01-master-design-commerce-system.md`

**Information architecture:** `docs/system/02-information-architecture-page-system.md`

**Data model:** `docs/system/03-data-model-catalog-schema.md`

**Implementation authorization:** Not granted

## Authority and contract method

This specification translates the approved system, IA, and data model into page contracts. It defines content responsibility, sequence, state, handoff, and data dependency—not color, typography, styling, breakpoints, pixel layout, platform behavior, or production code.

Authority resolves in this order: Article I; Master Design & Commerce System; Information Architecture & Page System; Data Model & Catalog Schema. Research remains closed.

Every contract uses the same twenty fields. An extension contract inherits its named shared contract and states its required differences; inheritance never removes a blocker, accessibility obligation, or real-data gate.

### Cross-page governing rules

1. Pages consume canonical Product, Sellable Variant, Attribute, Price, Availability, Eligibility, Proof, Relationship, Media, Education, Claim, and Source objects. They do not own manual copies.
2. Selected sellable state updates price, availability, eligibility, proof/fit, required components, media, and CTA readiness atomically.
3. Critical truth, blockers, and recovery remain available on every screen size.
4. Progressive disclosure reduces density but never conceals a purchase blocker.
5. State architecture distinguishes Loading, Empty, Error, Unknown, Restricted, Unavailable, Sold Out, Stale, Missing Media, Missing Proof, Unknown Compatibility, Selection Required, Additional Component Required, Price Changed, Eligibility Check Failed, and Notify Eligible where relevant.
6. All example content in this document is **SYNTHETIC** and non-production.

### Responsive priority vocabulary

- **ESSENTIAL:** survives first; identity, task, blockers, exact selected state, primary action.
- **HIGH:** follows immediately; comparison facts, recovery, navigation context.
- **SUPPORTING:** retained but may follow the main decision.
- **DEFERRED:** loaded or disclosed after essential understanding without becoming inaccessible.

---

## Contract 01 — Global Shell / Header / Navigation

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Know where they are, move among the house/divisions, search, access account, and inspect cart |
| 2. Entry conditions | Present on every public commerce surface; account/policy contexts may simplify but not remove orientation |
| 3. Authoritative data inputs | Division, Category, account/session state, cart summary, search configuration, governed navigation labels |
| 4. Information hierarchy | House identity → three divisions → search → account/cart → Learn/Support utilities |
| 5. Module sequence | Announcement only when governed and dismissible → header → primary division navigation → contextual breadcrumb where needed |
| 6. Primary action | Navigate to a division or initiate search, according to customer intent |
| 7. Secondary actions | Home, Learn, Support, account, cart, close navigation layer |
| 8. Decision-critical information | Active division/scope, cart state, search scope, current location |
| 9. Before primary action | Clear house identity, three division names, accessible control names |
| 10. Progressive disclosure | Division category/job links and bounded current curation |
| 11. State requirements | Loading-free core orientation; open/closed/focus states; cart changed; search scoped; authenticated/anonymous; announcement dismissed |
| 12. Failure/recovery | Preserve core links if search/account/cart service fails; state failure locally and keep navigation operable |
| 13. Cross-page handoffs | Pass visible search/division context; breadcrumbs return to durable category/division; cart opens with exact context |
| 14. Recommendation/education | No product recommendation in global shell; at most durable Learn/fit/proof entry |
| 15. Accessibility | Keyboard-complete navigation; managed focus for layers; Escape/return focus; landmark semantics; state not color-only |
| 16. Responsive priority | ESSENTIAL house/divisions/search/cart; HIGH account; SUPPORTING Learn/Support; DEFERRED deep division links |
| 17. Analytics questions | Can customers identify divisions, find search, recover from deep pages, and reach cart without misnavigation? |
| 18. Synthetic fixtures | **SYNTHETIC:** anonymous/authenticated, empty/changed cart, scoped search, dismissed announcement |
| 19. Real-data gates | Approved navigation taxonomy, actual account/cart/search services, governed announcement content |
| 20. Must not do | Become a catalog dump, create separate division shells, hide utilities, or use campaigns as permanent navigation |

---

## Contract 02 — Home

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand the house, choose a division, discover selective value, and know why the store deserves trust |
| 2. Entry conditions | Root entry, broad campaign entry, or return to whole-house context |
| 3. Authoritative data inputs | Division, Category, Collection/Recommendation, Product/Variant summary, Media, Education, approved Claims |
| 4. Information hierarchy | House identity → three-division orientation → standards/judgment → selective discovery → knowledge → trust/service/story |
| 5. Module sequence | Identity statement; division entrances; proof of judgment; limited curation; Learn entry; trust/operations; About/Support |
| 6. Primary action | Enter the appropriate division |
| 7. Secondary actions | Explore a curated edit, guide, About, or Support |
| 8. Decision-critical information | What each division is for and what Blowin' Smoke stands for |
| 9. Before primary action | House identity and plain-language division distinctions |
| 10. Progressive disclosure | Curation rationale, deeper story, policy/trust detail |
| 11. State requirements | Loading, missing media, unavailable curated item, empty curation, stale promotion, restricted product summary |
| 12. Failure/recovery | Division routing survives content failures; unsafe/empty merchandising modules disappear cleanly |
| 13. Cross-page handoffs | Preserve chosen division into landing/navigation; curated products route to canonical PDP; education returns to task |
| 14. Recommendation/education | Small reasoned edits only; one or more task-relevant education routes, never generic article volume |
| 15. Accessibility | Logical landmark/heading order; descriptive destination names; pause controls for any motion media |
| 16. Responsive priority | ESSENTIAL identity/divisions; HIGH standards/current discovery; SUPPORTING Learn/trust; DEFERRED extended story |
| 17. Analytics questions | Do visitors choose a division, understand the house, and use curation/education without promotion confusion? |
| 18. Synthetic fixtures | **SYNTHETIC:** three division entries, one bounded curation, unavailable featured item, missing hero media |
| 19. Real-data gates | Approved brand content, category routes, product/collection membership, media rights, operational claims |
| 20. Must not do | Become a product grid, three mini-homepages, campaign stack, trust-badge wall, or generic corporate landing page |

---

## Contract 03 — Division Landing: Shared Contract

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Translate a division into plain-language jobs, durable roles, decision guidance, and trusted next steps |
| 2. Entry conditions | Division nav, Home entry, search recovery, or external division intent |
| 3. Authoritative data inputs | Division, Category, Product Type/Role, Collection, Education, Claims, proof/fit policy summaries |
| 4. Information hierarchy | Orientation → customer jobs → durable role categories → key decisions → trust/fit/proof → curation → education/support |
| 5. Module sequence | Division definition; intent entrances; category entrances; decision guidance; evidence model; curation; current bounded merchandising; help |
| 6. Primary action | Choose a customer job or durable category |
| 7. Secondary actions | Use guided help, explore curation, open Learn, escalate uncertainty |
| 8. Decision-critical information | Role distinctions and the two or three choices most likely to cause a wrong purchase |
| 9. Before primary action | Division meaning and plain-language routes; no expert vocabulary required |
| 10. Progressive disclosure | Deeper category education, evidence explanation, merchandising rationale |
| 11. State requirements | Loading, empty category, unavailable curation, restricted content/product state, stale promotion, error |
| 12. Failure/recovery | Durable role/category routes survive merchandising failure; empty categories are withheld or explained |
| 13. Cross-page handoffs | Pass division/job context to category/search/resolver; guides return to division/category |
| 14. Recommendation/education | Curations require rationale; education answers role/decision questions before product pressure |
| 15. Accessibility | Job language in accessible names; structured categories; no hover-only descriptions |
| 16. Responsive priority | ESSENTIAL orientation/jobs; HIGH categories/decision guidance; SUPPORTING trust/curation; DEFERRED deeper Learn/story |
| 17. Analytics questions | Which jobs lead to successful destinations, where does terminology cause retreat, and which help paths resolve uncertainty? |
| 18. Synthetic fixtures | **SYNTHETIC:** complete job set, empty category, unavailable curation, help escalation |
| 19. Real-data gates | Actual assortment, approved taxonomy, evidence coverage, curation, education, policies |
| 20. Must not do | Lead with attributes, mirror supplier taxonomy, become a full catalog, or isolate the division as another store |

---

## Contract 04 — THCA Division Landing

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand THCA formats, proof/eligibility expectations, and choose a safe discovery route |
| 2. Entry conditions | Inherits Shared Division; active division is THCA |
| 3. Authoritative data inputs | Shared inputs plus THCA Product Type/Format, governed strain/quantity concepts, Proof states, Eligibility explanation references |
| 4. Information hierarchy | THCA orientation → format jobs → strain/quantity/value guidance → proof/eligibility → curation → responsible education |
| 5. Module sequence | Shared sequence specialized to formats, product truth, COA/proof, eligibility, curated discovery, current merchandising, support |
| 6. Primary action | Enter a durable THCA format/category |
| 7. Secondary actions | Explore strain/value edit, understand proof, view guide, seek eligibility support |
| 8. Decision-critical information | Format differences, proof scope, quantity/value basis, eligibility context |
| 9. Before primary action | Plain-language format orientation and notice that exact proof/eligibility resolves at product state |
| 10. Progressive disclosure | Composition/potency education, proof explanation, storage/responsible guidance |
| 11. State requirements | Shared states plus Missing Proof, Stale Proof, Restricted, Eligibility Check Failed |
| 12. Failure/recovery | Never imply universal proof/eligibility; route missing/stale/failed states to explanation/support |
| 13. Cross-page handoffs | Format context to category; proof education to proof route/PDP; eligibility context retained non-sensitively |
| 14. Recommendation/education | Curation reason required; no effects promises; education precedes complex composition claims |
| 15. Accessibility | Proof and restriction status announced textually; abbreviations expandable; documents not sole explanation |
| 16. Responsive priority | ESSENTIAL orientation/formats; HIGH proof/eligibility; SUPPORTING curation/guidance; DEFERRED long education |
| 17. Analytics questions | Can customers find formats, understand proof scope, and recover from restriction or missing evidence? |
| 18. Synthetic fixtures | **SYNTHETIC:** current/stale/missing proof summaries; eligible/restricted/failed-check contexts |
| 19. Real-data gates | Actual THCA catalog, formats, eligibility rules, COAs/batches, composition data, fulfillment facts |
| 20. Must not do | Invent legal conclusions, effects, potency, COA coverage, or turn strain/quantity/promotion into unsupported taxonomy |

---

## Contract 05 — Vape & Nicotine Division Landing

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Choose device, disposable, consumable, replacement, accessory, or guided fit route |
| 2. Entry conditions | Inherits Shared Division; active division is Vape & Nicotine |
| 3. Authoritative data inputs | Shared inputs plus Product Role, Platform/Model, nicotine formats, electronic Compatibility, replacement relationships |
| 4. Information hierarchy | Role orientation → plain-language jobs → durable categories → platform/lifecycle → compatibility help → curation/education |
| 5. Module sequence | “I want/I need” entrances; devices/disposables/consumables/replacements; fit help; curated products; technical education/support |
| 6. Primary action | Choose a role/job route |
| 7. Secondary actions | Start compatibility/replacement search, open setup guide, seek identification help |
| 8. Decision-critical information | Device vs consumable vs replacement; platform ownership; nicotine format; fit risk |
| 9. Before primary action | Plain-language role explanation and route for customers who do not know terminology |
| 10. Progressive disclosure | Technical fields, lifecycle, charging/setup education, platform detail |
| 11. State requirements | Shared states plus Unknown Compatibility, Unavailable replacement, Additional Component Required |
| 12. Failure/recovery | Preserve known model/part context; unknown fit routes to resolver/support; sold-out recovery uses verified relationship |
| 13. Cross-page handoffs | Job/platform context to search, category, resolver, PDP; unresolved identity to support |
| 14. Recommendation/education | Only typed compatible/replacement/curated relations; no co-purchase fit claims |
| 15. Accessibility | Technical terms paired with definitions; fit state and conditions readable without diagrams/color |
| 16. Responsive priority | ESSENTIAL role/jobs; HIGH compatibility/replacement help; SUPPORTING curation/education; DEFERRED deep platform context |
| 17. Analytics questions | Can novice and returning users reach correct role, and where does device identification fail? |
| 18. Synthetic fixtures | **SYNTHETIC:** device-first, part-first, unknown model, compatible/incompatible/unknown summaries |
| 19. Real-data gates | Actual roles/catalog, normalized model/part data, compatibility corpus, nicotine/technical facts |
| 20. Must not do | Force expert terms first, isolate parts without platform context, or infer fit from name/brand |

---

## Contract 06 — Glass & Accessories Division Landing

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Choose a complete piece, find a fitted/replacement part, shop care/tools, or explore substantive makers |
| 2. Entry conditions | Inherits Shared Division; active division is Glass & Accessories |
| 3. Authoritative data inputs | Shared inputs plus Product Role, physical Attributes, Physical Fit, contents, Maker/Artist, care relationships |
| 4. Information hierarchy | Complete vs component orientation → job routes → fit/measurement → care/makers → curation/support |
| 5. Module sequence | Complete-piece entry; owned-piece/part/replacement help; care/tools; measurement/fit help; makers; curation; fragile support |
| 6. Primary action | Choose complete-piece or owned-object job route |
| 7. Secondary actions | Measure fit, shop by maker, open care guide, seek unknown-fit support |
| 8. Decision-critical information | Complete vs fitted component, geometry beyond nominal size, contents, material/care |
| 9. Before primary action | Plain-language roles and explicit warning that fitted parts are not automatically universal |
| 10. Progressive disclosure | Measurement procedures, maker provenance, detailed care and fragile fulfillment |
| 11. State requirements | Shared states plus Unknown Compatibility, Missing Media/scale, Additional Component Required, damage-support route |
| 12. Failure/recovery | Retain measurements/candidate part; unknown fit routes to guide/resolver/support; no visual inference |
| 13. Cross-page handoffs | Job/measurements to category/resolver/PDP; maker to substantive entity page; care to applicable product/guide |
| 14. Recommendation/education | Fit/care requires verified relationship; maker edits require provenance/rationale |
| 15. Accessibility | Measurement steps textual; geometry tables semantic; scale not image-only |
| 16. Responsive priority | ESSENTIAL role/jobs; HIGH fit/measurement; SUPPORTING makers/care; DEFERRED extended curation/story |
| 17. Analytics questions | Can customers distinguish complete vs fitted products and resolve or escalate physical fit? |
| 18. Synthetic fixtures | **SYNTHETIC:** complete piece, 14-unit nominal size with gender/angle, unknown clearance, missing scale media |
| 19. Real-data gates | Actual product roles, measurements, fit tests, contents, materials, maker permissions, operations |
| 20. Must not do | Treat nominal size as full fit, infer contents from photos, or publish thin maker routes |

---

## Contract 07 — Category / Subcategory: Shared Contract

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand, filter, compare, and choose products within one durable intent |
| 2. Entry conditions | Division/category navigation, search refinement, guide/PDP return, or canonical route |
| 3. Authoritative data inputs | Category membership, Product/Variant summaries, Attribute definitions/values, Price, Availability, Media, eligibility/fit summaries |
| 4. Information hierarchy | Category orientation → sub-routes → state/context → filters/sort → results → inline education/comparison → recovery/support |
| 5. Module sequence | Definition; active constraints; filter/sort; product grid; optional compare; contextual education; deeper guide/support |
| 6. Primary action | Inspect a qualified product/result |
| 7. Secondary actions | Filter, sort, compare, clear constraint, open guide, request help |
| 8. Decision-critical information | Category meaning, active scope, product role, critical facts, price, availability, proof/fit where material |
| 9. Before primary action | Orientation, active eligibility/compatibility context, filters needed to understand result set |
| 10. Progressive disclosure | Full filter groups, long education, comparison detail, curation rationale |
| 11. State requirements | Loading, Empty/No Results, Error, Unknown, Restricted, Unavailable/Sold Out, Missing Media, Stale, Unknown Compatibility |
| 12. Failure/recovery | Preserve constraints; name conflict; suggest safe relaxation; never silently remove fit/eligibility constraints |
| 13. Cross-page handoffs | Carry category/filter context to PDP and back; guide/resolver returns to constrained results |
| 14. Recommendation/education | Promoted items obey filters; education appears at point of decision; no arbitrary grid insertion |
| 15. Accessibility | Semantic filter groups/counts; keyboard sort/filter; result updates announced; focus restored after changes |
| 16. Responsive priority | ESSENTIAL category/results/active constraints; HIGH filters/sort/cards; SUPPORTING compare/education; DEFERRED deep guide |
| 17. Analytics questions | Which filters resolve intent, create zero results, or correlate with successful qualified PDP visits? |
| 18. Synthetic fixtures | **SYNTHETIC:** populated, zero-result conflict, unknown attribute, unavailable item, scoped compatibility filter |
| 19. Real-data gates | Actual taxonomy, membership, normalized coverage, products, price/stock, eligibility/relationships |
| 20. Must not do | Turn filters into taxonomy, hide unknown values, duplicate facts, or let promotion override relevance/constraints |

---

## Contract 08 — THCA Category

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Compare THCA products by format and governed decision dimensions |
| 2. Entry conditions | Inherits Shared Category; THCA format/type scope |
| 3. Authoritative data inputs | Shared plus format, strain, quantity, scoped composition/potency, Proof and Eligibility states |
| 4. Information hierarchy | Format orientation → eligibility/proof context → strain/quantity/filter decisions → qualified products |
| 5. Module sequence | Shared sequence with proof-state and responsible education integrated near filters/results |
| 6. Primary action | Open a THCA PDP for exact variant/proof resolution |
| 7. Secondary actions | Filter strain/quantity/proof, open proof explainer, recover restriction/no result |
| 8. Decision-critical information | Format, strain context, quantity/price basis, proof status, availability/eligibility signal |
| 9. Before primary action | Applied product/format scope and meaning of proof/eligibility summaries |
| 10. Progressive disclosure | Composition/potency definitions and long responsible guidance |
| 11. State requirements | Shared plus Missing/Stale Proof, Restricted, Eligibility Check Failed |
| 12. Failure/recovery | Missing proof never becomes lab-tested; restriction and service failure remain distinct |
| 13. Cross-page handoffs | Preserve format/filter context to PDP; proof help to explainer/detail; return restores list state |
| 14. Recommendation/education | Only current governed edits; no effect-based recommendation |
| 15. Accessibility | Proof/eligibility status text; potency basis/units associated programmatically |
| 16. Responsive priority | ESSENTIAL format/results/blockers; HIGH proof/quantity/price; SUPPORTING filters/education; DEFERRED long guidance |
| 17. Analytics questions | Which proof/quantity/format constraints help or block selection, and where are proof states misunderstood? |
| 18. Synthetic fixtures | **SYNTHETIC:** current/stale/missing proof, quantity options, restricted result, zero-result constraint |
| 19. Real-data gates | THCA catalog, variants, price, COAs/batches, composition, eligibility rules |
| 20. Must not do | Infer effects, current proof, legality, or build permanent category routes from promotions/potency bands |

---

## Contract 09 — Vape & Nicotine Category

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Compare one device/consumable/replacement role and find a usable product |
| 2. Entry conditions | Inherits Shared Category; role/category and optional owned-platform context |
| 3. Authoritative data inputs | Shared plus Product Role, Platform/Model, nicotine/technical Attributes, Compatibility, replacements |
| 4. Information hierarchy | Role orientation → owned-device context → role-critical filters → products with fit/status → help |
| 5. Module sequence | Shared sequence; fit context/control precedes component results when material |
| 6. Primary action | Open PDP or compatibility resolver for exact state |
| 7. Secondary actions | Set/change device, filter technical fields, find replacement, open terminology help |
| 8. Decision-critical information | Role, platform/model, nicotine/technical critical facts, compatibility state, availability |
| 9. Before primary action | Clear role and visible owned-device/fit scope; Unknown not presented as Compatible |
| 10. Progressive disclosure | Full technical filter sets and lifecycle guidance |
| 11. State requirements | Shared plus Compatible/Incompatible/Conditional/Unknown, Additional Component Required, Sold Out |
| 12. Failure/recovery | Preserve model/part; route ambiguous/unknown fit to resolver/support; verified successor only |
| 13. Cross-page handoffs | Device context to PDP/resolver/cart; return keeps filters and scope |
| 14. Recommendation/education | Compatibility requires relationship evidence; technical education explains fields, not products by hype |
| 15. Accessibility | Fit state/conditions announced; abbreviations and units have accessible definitions |
| 16. Responsive priority | ESSENTIAL role/context/results; HIGH fit/critical fields; SUPPORTING filters/guide; DEFERRED deep specs |
| 17. Analytics questions | Does device context reduce wrong-part exploration and unknown-fit escalation? |
| 18. Synthetic fixtures | **SYNTHETIC:** compatible, incompatible, conditional, unknown; sold-out exact replacement with successor |
| 19. Real-data gates | Device/part catalog, normalized specs, verified relationships, price/stock, eligibility |
| 20. Must not do | Infer fit from text/co-purchase, isolate components, or show irrelevant fields across roles |

---

## Contract 10 — Glass & Accessories Category

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Compare complete pieces, fitted parts, care, or tools using the facts relevant to that role |
| 2. Entry conditions | Inherits Shared Category; role/type and optional owned-piece/measurement context |
| 3. Authoritative data inputs | Shared plus material/dimensions, connection geometry, Physical Fit, contents, Maker, care relationships |
| 4. Information hierarchy | Role orientation → fit/scale context → normalized filters → products → measurement/care/maker help |
| 5. Module sequence | Shared sequence; fitted categories place owned-piece/geometry context before results |
| 6. Primary action | Open exact PDP or fit resolver |
| 7. Secondary actions | Set measurements/owned piece, compare scale/material, shop maker, open care guide |
| 8. Decision-critical information | Role, scale/material, size, gender/type, angle/length/clearance as applicable, fit status |
| 9. Before primary action | Complete vs fitted distinction and visible fit context |
| 10. Progressive disclosure | Full measurement groups, maker context, care depth |
| 11. State requirements | Shared plus Unknown Fit, Missing Scale Media, Additional Component, Unavailable replacement |
| 12. Failure/recovery | Nominal match alone cannot qualify; preserve measurements and escalate missing geometry |
| 13. Cross-page handoffs | Measurements/owned object to resolver/PDP/support; return preserves context |
| 14. Recommendation/education | Fit/care relationships verified; maker curation has rationale/provenance |
| 15. Accessibility | Units/connection relationships semantic; measurement help operable without imagery |
| 16. Responsive priority | ESSENTIAL role/results/fit; HIGH geometry/scale; SUPPORTING filters/care; DEFERRED maker story |
| 17. Analytics questions | Which missing measurements cause failure and which guidance resolves fitted-part selection? |
| 18. Synthetic fixtures | **SYNTHETIC:** matching nominal size but wrong gender; conditional adapter; unknown clearance; missing scale image |
| 19. Real-data gates | Measurements, fit evidence, materials, contents, maker data, price/stock |
| 20. Must not do | Treat size as complete fit, infer contents/material from media, or label universal without bounded scope |

---

## Contract 11 — Search Results

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Resolve known item, category, entity, guide, compatibility, replacement, or problem intent |
| 2. Entry conditions | Global/division search, autocomplete, resolver handoff, or external query route |
| 3. Authoritative data inputs | Governed search projection of Product/Variant, Category, entities, Education, Relationships, Price, Availability |
| 4. Information hierarchy | Query interpretation/scope → suggestions/refinements → typed results → constraints → recovery/help |
| 5. Module sequence | Interpreted query; result-type navigation; product/category/entity/guide results; fit/replacement mode; no-results recovery |
| 6. Primary action | Open the best qualified destination or refine ambiguity |
| 7. Secondary actions | Change division/type scope, set owned product, open guide, contact support |
| 8. Decision-critical information | Result type, division/role, matched concept, critical facts, state, why fit/replacement result applies |
| 9. Before primary action | Visible interpretation and scope; ambiguity resolved before authoritative fit claim |
| 10. Progressive disclosure | Additional refinements, result explanations, long education |
| 11. State requirements | Loading, No Results, Error, Ambiguous, Unknown, Restricted, Unavailable, Missing Media, Unknown Compatibility |
| 12. Failure/recovery | Preserve query; identify failed constraint; safe relaxation; never silently broaden eligibility/fit |
| 13. Cross-page handoffs | Carry query/scope/owned context to destination and back; unresolved task to support |
| 14. Recommendation/education | Education may lead for how-to queries; product ranking cannot imply fit without relationship |
| 15. Accessibility | Search label/status; result types and updates announced; keyboard autocomplete; no focus theft |
| 16. Responsive priority | ESSENTIAL query/interpretation/results; HIGH scope/refinement/state; SUPPORTING education; DEFERRED explanations |
| 17. Analytics questions | Which intents resolve, reformulate, reach zero results, or require fit/support escalation? |
| 18. Synthetic fixtures | **SYNTHETIC:** known product, ambiguous term, compatibility query, replacement query, educational query, no result |
| 19. Real-data gates | Search index, synonyms, products/entities/guides, relationships, ranking and privacy governance |
| 20. Must not do | Index as taxonomy, derive compatibility from text, blend result types without labels, or discard constraints |

---

## Contract 12 — Curated Collection / Edit

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Explore a bounded selection chosen for a clear Blowin' Smoke reason |
| 2. Entry conditions | Home/division/category merchandising, direct durable edit route, or guide context |
| 3. Authoritative data inputs | Collection, explicit/rule membership, rationale, owner, effective dates, Product/Variant states, Media |
| 4. Information hierarchy | Purpose/rationale → scope → qualified products → supporting context → durable routes |
| 5. Module sequence | Edit identity; why it exists; product set; optional education/maker context; related category/support |
| 6. Primary action | Inspect a product within the stated rationale |
| 7. Secondary actions | Return to durable category, learn rationale, explore entity/guide |
| 8. Decision-critical information | Editorial nature, division/scope, current product state, reason for membership |
| 9. Before primary action | Rationale and any time-bound/promotional conditions |
| 10. Progressive disclosure | Extended editorial context and supporting education |
| 11. State requirements | Loading, Empty, Expired/Stale, Unavailable/Sold Out member, Restricted, Missing Media |
| 12. Failure/recovery | Remove invalid members; expire bounded edit honestly; route to durable category, not arbitrary substitute |
| 13. Cross-page handoffs | Product to canonical PDP; category restores durable browse; entity/guide retains context |
| 14. Recommendation/education | Membership itself is curated relation; no additional arbitrary cross-sell |
| 15. Accessibility | Editorial purpose precedes grid; state/expiration readable; cards retain full semantics |
| 16. Responsive priority | ESSENTIAL rationale/products; HIGH state/scope; SUPPORTING education; DEFERRED extended editorial |
| 17. Analytics questions | Does the rationale improve qualified exploration, and do expired/unavailable states recover safely? |
| 18. Synthetic fixtures | **SYNTHETIC:** active edit, expired promotion, empty membership, unavailable member |
| 19. Real-data gates | Approved collection, rationale/owner, membership, effective dates, product commerce states |
| 20. Must not do | Repair weak taxonomy, persist expired campaigns, omit rationale, or override product eligibility/fit |

---

## Contract 13 — Universal PDP Shell

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Decide whether the exact sellable state is right, usable, eligible, available, and actionable |
| 2. Entry conditions | Product card/search/category/recommendation/order/support link; optional valid variant/context |
| 3. Authoritative data inputs | Product, Sellable Variant, Options, Attributes, Price, Availability, Eligibility, Proof/Fit, Contents, Media, Claims, Education, Recommendations |
| 4. Information hierarchy | Orientation/identity → essential facts → options → composed commerce states → action → media/depth → education/reviews/recommendations → policy/support |
| 5. Module sequence | Breadcrumb; identity; fact summary; selectors; price/stock/eligibility/proof/fit/requirements; CTA; media; specs/contents; education; reviews; relationships; support |
| 6. Primary action | State-derived purchase action or the highest-priority resolution action |
| 7. Secondary actions | Change options, inspect media/proof/fit, save, compare, open guide/support |
| 8. Decision-critical information | Exact variant, critical facts, price, availability, eligibility, proof/fit, required components, CTA consequence |
| 9. Before primary action | Identity, selected state, required options, resolved price/availability, blockers, material proof/fit/contents |
| 10. Progressive disclosure | Full specs, long provenance, methods, guides, reviews, recommendation detail; never blockers |
| 11. State requirements | All specified page states; selected-state changes are atomic and announced |
| 12. Failure/recovery | Preserve selections; identify affected domain; retry locally; route valid alternative/support without false readiness |
| 13. Cross-page handoffs | Preserve variant/context to cart/proof/resolver/support; category/search return restores discovery state |
| 14. Recommendation/education | Appear after primary decision; typed reason, current validation, and exact scope required |
| 15. Accessibility | Semantic option groups; focus/error linkage; live state/price announcements; gallery alternatives; keyboard disclosure |
| 16. Responsive priority | ESSENTIAL identity/options/states/CTA; HIGH critical media/facts/recovery; SUPPORTING specs/education; DEFERRED reviews/recommendations |
| 17. Analytics questions | Which dependency blocks readiness, which state changes fail, and do customers reach correct action without preventable error? |
| 18. Synthetic fixtures | **SYNTHETIC:** selection required, restricted, sold out, unknown fit, missing component, price change, failed add |
| 19. Real-data gates | Product/variant catalog, price/stock, eligibility rules, proof/fit, contents, media, policies/support |
| 20. Must not do | Enable independent marketing CTA, hide blockers, copy facts, infer unknowns, or let reviews/recommendations outrank truth |

---

## Contract 14 — THCA PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Resolve format, strain, quantity, composition/potency scope, proof, eligibility, and exact purchase state |
| 2. Entry conditions | Inherits Universal PDP; THCA product with optional selected variant/batch context |
| 3. Authoritative data inputs | Universal inputs plus Batch, Proof Document/Version, Laboratory results, composition/potency Claims, THCA rule scope |
| 4. Information hierarchy | Identity/format → strain/quantity → scoped composition → proof/eligibility → price/availability/action → media/depth |
| 5. Module sequence | Universal shell specialized with proof status near action and full proof/education below |
| 6. Primary action | Purchase when composed state resolves; otherwise select, qualify, inspect proof, or recover |
| 7. Secondary actions | Open COA detail, change strain/quantity, read proof/composition guide, seek support |
| 8. Decision-critical information | Exact format/strain/quantity, price basis, applicable proof status, potency basis, eligibility, stock |
| 9. Before primary action | All decision-critical information including material missing/stale/unmatched proof |
| 10. Progressive disclosure | Full result groups/methods, storage, responsible education, reviews |
| 11. State requirements | Universal plus Current/Stale/Missing/Not Supplied/Unmatched Proof; eligibility failure vs restriction |
| 12. Failure/recovery | No proof claim without applicability; failed rule service remains unknown; preserve variant/batch context to support |
| 13. Cross-page handoffs | Exact product/variant/batch to proof route/order/cart/support |
| 14. Recommendation/education | No effects claims; contextual complements/replenishment only after current eligibility/proof/state checks |
| 15. Accessibility | COA link/status named; result units/basis semantic; document alternative/access support |
| 16. Responsive priority | ESSENTIAL format/options/proof/eligibility/price/action; HIGH composition/media; SUPPORTING specs/education; DEFERRED reviews |
| 17. Analytics questions | Are proof and option scopes understood, and which proof/eligibility state prevents safe progression? |
| 18. Synthetic fixtures | **SYNTHETIC:** current/stale/missing/unmatched COA; quantity price change; restricted/failed-check |
| 19. Real-data gates | Actual products/variants, batches, COAs/results, price/stock, current eligibility and fulfillment rules |
| 20. Must not do | Apply proof by product name, imply effects/legal status, merge manufacturer copy with lab results, or hide proof state |

---

## Contract 15 — Disposable PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Select an integrated finite-lifecycle product with clear nicotine, flavor, capacity, charging, and state |
| 2. Entry conditions | Inherits Universal PDP; Disposable role |
| 3. Authoritative data inputs | Universal plus model, nicotine format/strength/basis, flavor, liquid/battery/charging attributes, sourced puff claim |
| 4. Information hierarchy | Identity/model → flavor/nicotine options → capacity/charging/lifecycle → commerce states → action |
| 5. Module sequence | Universal shell with compact technical facts and lifecycle/setup below action |
| 6. Primary action | Purchase resolved variant or resolve option/state |
| 7. Secondary actions | Change flavor/strength, inspect charging/specs, compare, seek technical support |
| 8. Decision-critical information | Exact flavor/nicotine, capacity, charging state, sourced claim status, price/stock/eligibility |
| 9. Before primary action | Variant options, nicotine basis, price, stock, eligibility, required operating facts |
| 10. Progressive disclosure | Complete specifications, setup, lifecycle/disposal guidance, manufacturer-claim detail |
| 11. State requirements | Selection Required, Restricted, Unavailable/Sold Out, Price Changed, Missing Media, Error |
| 12. Failure/recovery | Preserve variant; distinguish unavailable option from product; offer valid alternative without equivalence claim |
| 13. Cross-page handoffs | Variant to cart/order/support; category/search return context |
| 14. Recommendation/education | Care/accessories only with reason; education for charging/lifecycle, not pressure |
| 15. Accessibility | Nicotine basis and option state explicit; charging/setup media has text alternative |
| 16. Responsive priority | ESSENTIAL options/nicotine/price/stock/action; HIGH capacity/charging/media; SUPPORTING specs/guides; DEFERRED reviews |
| 17. Analytics questions | Which options and technical claims cause uncertainty or failed purchase readiness? |
| 18. Synthetic fixtures | **SYNTHETIC:** flavor selection, strength restriction, sold-out variant, sourced manufacturer puff claim |
| 19. Real-data gates | Actual variants, nicotine/product facts, technical specs, claims, price/stock, eligibility |
| 20. Must not do | Present manufacturer claim as measured fact, hide nicotine basis, or imply compatibility/lifecycle not evidenced |

---

## Contract 16 — Refillable Device / Kit PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Choose a platform/kit and understand included parts, required parts, operating facts, and replacements |
| 2. Entry conditions | Inherits Universal PDP; Refillable Device or Kit role |
| 3. Authoritative data inputs | Universal plus platform/model, battery/charging/power, Included/Required relationships, Compatibility, kit membership |
| 4. Information hierarchy | Platform identity → selected variant → contents/requirements → technical constraints → compatibility → commerce/action |
| 5. Module sequence | Universal shell; contents/requirements and platform compatibility adjacent to action; setup/replacement below |
| 6. Primary action | Purchase complete resolved configuration or resolve missing requirement |
| 7. Secondary actions | Inspect contents, find compatible pod/coil, compare models, open setup/support |
| 8. Decision-critical information | Platform/model, exact contents, missing requirements, power/charging, verified compatible components, state |
| 9. Before primary action | Selected variant, contents/requirements, material compatibility, price/stock/eligibility |
| 10. Progressive disclosure | Full specs, setup, charging, replacement lifecycle, long compatibility lists |
| 11. State requirements | Selection Required, Additional Component Required, Unknown/Incompatible/Conditional Fit, Sold Out, Price Changed |
| 12. Failure/recovery | Name missing component; preserve platform; block verified incompatible bundle; route unknown to resolver/support |
| 13. Cross-page handoffs | Platform context to resolver/replacement PDP/cart/order/support |
| 14. Recommendation/education | Only verified compatible components and typed care/replacement; kit economics transparent |
| 15. Accessibility | Contents and requirements differentiated in text; compatibility conditions programmatically associated |
| 16. Responsive priority | ESSENTIAL platform/options/contents/requirements/states/action; HIGH specs/media; SUPPORTING setup/replacements; DEFERRED reviews |
| 17. Analytics questions | Do customers understand what is included versus required, and where does platform matching fail? |
| 18. Synthetic fixtures | **SYNTHETIC:** kit with required external component; unknown fit; conditional component; missing contents record |
| 19. Real-data gates | Actual variants, package contents, specs, compatibility, price/stock, eligibility |
| 20. Must not do | Infer included parts from images, show unverified compatible parts, or treat kit/bundle as interchangeable |

---

## Contract 17 — E-Liquid PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Select flavor, volume, nicotine format/strength, and suitable hardware context |
| 2. Entry conditions | Inherits Universal PDP; E-liquid role |
| 3. Authoritative data inputs | Universal plus volume, flavor, nicotine format/strength/basis, composition where governed, suitability relationships |
| 4. Information hierarchy | Identity → flavor/volume/strength options → suitability/eligibility → price/stock/action → composition/use depth |
| 5. Module sequence | Universal shell with nicotine/suitability adjacent to options and action |
| 6. Primary action | Purchase exact resolved variant |
| 7. Secondary actions | Change options, inspect suitability/composition, compare, seek help |
| 8. Decision-critical information | Nicotine format/strength/basis, volume, flavor, applicable hardware class, price/stock/eligibility |
| 9. Before primary action | Exact options, nicotine basis, suitability limitation, eligibility, commerce states |
| 10. Progressive disclosure | Full composition, storage/use guidance, preference reviews |
| 11. State requirements | Selection Required, Restricted, Unknown suitability, Unavailable, Price Changed, Missing Media |
| 12. Failure/recovery | Do not equate unknown hardware suitability with compatible; preserve options into support |
| 13. Cross-page handoffs | Variant/hardware context to cart, compatible device guidance, order/support |
| 14. Recommendation/education | Hardware pairing only with evidence; flavor preference never compatibility evidence |
| 15. Accessibility | Strength/basis and volume read together; selection/status announcements |
| 16. Responsive priority | ESSENTIAL options/nicotine/suitability/states/action; HIGH product media; SUPPORTING composition/guidance; DEFERRED reviews |
| 17. Analytics questions | Which strength/suitability decisions cause abandonment or support need? |
| 18. Synthetic fixtures | **SYNTHETIC:** multiple strengths, unavailable flavor, unknown hardware suitability, restriction |
| 19. Real-data gates | Actual variants, nicotine/composition facts, suitability evidence, price/stock/eligibility |
| 20. Must not do | Infer device compatibility, omit nicotine basis, or make health/effect claims |

---

## Contract 18 — Nicotine Pouch PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Choose flavor, count, format, and strength with clear basis and eligibility |
| 2. Entry conditions | Inherits Universal PDP; Nicotine Pouch role |
| 3. Authoritative data inputs | Universal plus strength/basis, count, format, flavor, composition/ingredients where required, warnings |
| 4. Information hierarchy | Identity → strength/flavor/count options → warnings/eligibility → price/stock/action → deep information |
| 5. Module sequence | Universal shell with strength basis and eligibility adjacent to selection |
| 6. Primary action | Purchase resolved eligible variant |
| 7. Secondary actions | Change options, inspect ingredients/warnings, compare, seek support |
| 8. Decision-critical information | Strength and basis, count, flavor, price, stock, eligibility/warnings |
| 9. Before primary action | Exact option state, strength basis, eligibility, price/availability |
| 10. Progressive disclosure | Full composition/ingredients, responsible guidance, reviews |
| 11. State requirements | Selection Required, Restricted, Eligibility Check Failed, Unavailable, Price Changed |
| 12. Failure/recovery | Preserve choices; distinguish restriction from service failure; no unsupported alternative |
| 13. Cross-page handoffs | Variant to cart/order/support; return to pouch category |
| 14. Recommendation/education | Alternatives by explicit preference/category reason; no outcome claims |
| 15. Accessibility | Strength and unit/basis always associated; warnings not color-only |
| 16. Responsive priority | ESSENTIAL options/strength/eligibility/action; HIGH count/price/stock; SUPPORTING composition; DEFERRED reviews |
| 17. Analytics questions | Is strength basis understood, and where does eligibility or option confusion occur? |
| 18. Synthetic fixtures | **SYNTHETIC:** two strengths, sold-out flavor, restricted state, failed eligibility service |
| 19. Real-data gates | Actual pouch variants, strength basis, count/composition, warnings, price/stock/rules |
| 20. Must not do | Hide strength basis, invent warnings/legal conclusions, or use testimony as product fact |

---

## Contract 19 — Pod / Coil / Replacement PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Confirm the exact part works with an owned platform and select the correct variant |
| 2. Entry conditions | Inherits Universal PDP; component/replacement role with optional owned-device context |
| 3. Authoritative data inputs | Universal plus platform/model/part, resistance/capacity/count, electronic Compatibility, replacements/successors |
| 4. Information hierarchy | Part identity → owned-device/fit status → variant/technical constraints → price/stock/action → supported platforms/replacement help |
| 5. Module sequence | Context/identity; compatibility result/input; options/specs; requirements; commerce/action; media; full supported relationships; setup/support |
| 6. Primary action | Purchase only when fit/readiness resolves, otherwise check compatibility |
| 7. Secondary actions | Change owned device/variant, view supported platforms, find replacement/successor, support |
| 8. Decision-critical information | Exact part/model, resistance/capacity/count, supported platform, conditions, compatibility state, stock |
| 9. Before primary action | Compatibility state and conditions, exact variant, requirements, price/availability/eligibility |
| 10. Progressive disclosure | Full supported-device list, operating detail, replacement procedure |
| 11. State requirements | Compatible, Incompatible, Conditional, Universal bounded, Unknown; Selection Required; Sold Out; successor |
| 12. Failure/recovery | Block known incompatibility; unknown routes to resolver/support; sold-out alternatives require verified relationship |
| 13. Cross-page handoffs | Owned device/part context to resolver/cart/order/support; bidirectional device links |
| 14. Recommendation/education | Replacement/compatible/successor reason explicit; no generic related-products module |
| 15. Accessibility | Fit result/conditions announced and linked; technical units labeled; matrices semantic |
| 16. Responsive priority | ESSENTIAL part/owned context/fit/options/action; HIGH specs/stock; SUPPORTING supported platforms/help; DEFERRED reviews |
| 17. Analytics questions | How often is fit known, unknown, or wrong; which inputs resolve it; how do sold-out recoveries perform? |
| 18. Synthetic fixtures | **SYNTHETIC:** compatible 0.8-unit option, incompatible platform, conditional version, unknown model, verified successor |
| 19. Real-data gates | Part/device variants, authoritative compatibility, specs, replacements, price/stock/eligibility |
| 20. Must not do | Hide compatibility in description, infer from naming/brand, or treat similar part as replacement |

---

## Contract 20 — Complete Glass Piece PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand exact piece, scale, material, connections, contents, provenance, care, and purchase state |
| 2. Entry conditions | Inherits Universal PDP; Complete Piece role |
| 3. Authoritative data inputs | Universal plus dimensions/material, connections, contents, physical relationships, Maker/Artist, fragile operations |
| 4. Information hierarchy | Identity/provenance → scale/material → connections/contents → selected state/action → media/specs/care/fit |
| 5. Module sequence | Universal shell with scale/contents/connections near action; measurement/craft/care below |
| 6. Primary action | Purchase exact resolved piece or resolve variant/state |
| 7. Secondary actions | Inspect scale/contents, find compatible parts, read care/maker context, damage/support |
| 8. Decision-critical information | Essential dimensions, material, connection geometry, included/required parts, price/stock, fragile limitation |
| 9. Before primary action | Scale facts, contents, connection, variant, price/availability, material fit/requirements |
| 10. Progressive disclosure | Full measurement method, craft/provenance, care, detailed compatible parts |
| 11. State requirements | Selection Required, Missing Scale Media, Unknown measurement, Additional Component, Unavailable, Price Changed |
| 12. Failure/recovery | Text facts survive media failure; missing dimension disclosed; fit-dependent recommendations suppressed |
| 13. Cross-page handoffs | Exact piece/variant to resolver, fitted part, cart, order, support |
| 14. Recommendation/education | Parts/care require verified fit/material applicability; maker relations sourced |
| 15. Accessibility | Scale and connections textual/semantic; gallery alternatives; fragile terms accessible near action |
| 16. Responsive priority | ESSENTIAL identity/scale/contents/connections/states/action; HIGH media/material; SUPPORTING care/maker; DEFERRED reviews |
| 17. Analytics questions | Do customers access scale/contents and find compatible parts; which missing facts create support? |
| 18. Synthetic fixtures | **SYNTHETIC:** complete piece with verified bowl included; missing scale media; unknown clearance; fragile support note |
| 19. Real-data gates | Measurements/material, contents, media, fit relationships, maker provenance, price/stock/policies |
| 20. Must not do | Infer scale/contents/material from photos, hide connection data, or claim fit without scope |

---

## Contract 21 — Fitted Component PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Verify a component physically fits the owned piece/configuration before purchase |
| 2. Entry conditions | Inherits Universal PDP; Fitted Component/Replacement role with optional owned-piece/measurement context |
| 3. Authoritative data inputs | Universal plus connection point, size, source/target gender/type, angle, length, orientation, clearance, tolerance, Physical Fit |
| 4. Information hierarchy | Component identity → owned context → geometry/fit state → conditions/adapter → price/stock/action → measurement/support |
| 5. Module sequence | Fit context/input; component/variant; geometry; fit result; requirements; commerce/action; media; full fit/measurement/care |
| 6. Primary action | Purchase only after appropriate fit resolution; otherwise check fit |
| 7. Secondary actions | Enter/change measurements, view supported pieces, add verified adapter, open measurement/support |
| 8. Decision-critical information | Size, both gender/types, angle, relevant lengths/orientation/clearance/tolerance, fit state/conditions |
| 9. Before primary action | Exact geometry, fit state, adapter/requirement, selected variant, price/availability |
| 10. Progressive disclosure | Full measurement methods, supported-piece list, care, maker detail |
| 11. State requirements | Compatible/Incompatible/Conditional/Universal bounded/Unknown; Selection Required; Additional Component; Sold Out |
| 12. Failure/recovery | Nominal match cannot pass alone; preserve measurements; route unknown to guide/support; block incompatibility |
| 13. Cross-page handoffs | Owned piece/measurements/component to resolver/cart/order/support; bidirectional supported-piece links |
| 14. Recommendation/education | Adapters/replacements require typed verified relation; measurement help precedes guessing |
| 15. Accessibility | Geometry labeled in text/table; instructions independent of imagery; state/conditions announced |
| 16. Responsive priority | ESSENTIAL owned context/geometry/fit/action; HIGH connection media/requirements; SUPPORTING measurement/care; DEFERRED reviews |
| 17. Analytics questions | Which geometry field remains unknown, which help resolves it, and where do customers abandon/escalate? |
| 18. Synthetic fixtures | **SYNTHETIC:** same nominal size/wrong gender; correct size/gender/wrong angle; conditional adapter; unknown clearance |
| 19. Real-data gates | Verified measurements/tolerances, pair tests, variant scope, adapters, price/stock |
| 20. Must not do | Imply suitability before fit, use image inference, or call universal without bounded evidence |

---

## Contract 22 — Care / Maintenance PDP

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Determine whether a care product/method applies safely to the owned material/device |
| 2. Entry conditions | Inherits Universal PDP; Care Product role with optional owned-object context |
| 3. Authoritative data inputs | Universal plus Care Applies To relationships, incompatible materials, method/handling, quantity/format |
| 4. Information hierarchy | Product identity → owned material/device applicability → prohibitions/requirements → commerce/action → method/depth |
| 5. Module sequence | Applicability context; format/quantity; safe/incompatible use; requirements; price/stock/action; instructions/support |
| 6. Primary action | Purchase when applicability and commerce state resolve |
| 7. Secondary actions | Set owned object/material, inspect method, find alternative, open care guide/support |
| 8. Decision-critical information | Applicable/incompatible scope, method, quantity, required handling, price/stock |
| 9. Before primary action | Material/device applicability and material prohibitions where decision-critical |
| 10. Progressive disclosure | Full procedure, maintenance schedule context, long handling detail |
| 11. State requirements | Compatible/applicable, Incompatible, Conditional, Unknown; Selection Required; Unavailable |
| 12. Failure/recovery | Unknown applicability never becomes safe; preserve owned context into support |
| 13. Cross-page handoffs | Owned product/material to guide, alternative care PDP, cart/order/support |
| 14. Recommendation/education | Care relation must be verified; instruction cannot be marketing filler |
| 15. Accessibility | Warnings/prohibitions explicit and associated; method has textual steps |
| 16. Responsive priority | ESSENTIAL applicability/prohibitions/action; HIGH method/quantity; SUPPORTING guide/media; DEFERRED reviews |
| 17. Analytics questions | Which materials/devices lack care coverage and how often does unknown applicability escalate? |
| 18. Synthetic fixtures | **SYNTHETIC:** applicable glass material, incompatible finish, conditional disassembly, unknown device material |
| 19. Real-data gates | Materials/device facts, care evidence, instructions, handling policies, price/stock |
| 20. Must not do | Assume universal care, infer material, hide prohibited use, or turn recommendation into safety evidence |

---

## Contract 23 — Maker / Artist Object PDP Extension

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Evaluate a specific sellable object whose authorship/craft materially affects the decision |
| 2. Entry conditions | Inherits applicable Universal/Glass PDP; Maker/Artist Object role |
| 3. Authoritative data inputs | Applicable PDP inputs plus Maker/Artist/Studio, provenance Claims, permissions, variation/uniqueness, craft Media |
| 4. Information hierarchy | Object identity → verified maker/provenance → exact variant/unique state → dimensions/fit/contents → commerce/action |
| 5. Module sequence | Applicable PDP shell with provenance near identity and deeper maker method/story after product truth |
| 6. Primary action | Purchase exact object/variant when ready |
| 7. Secondary actions | Explore maker entity, inspect craft/scale, view related works, seek care/support |
| 8. Decision-critical information | Exact object, authorship, uniqueness/variation, material/dimensions, fit/contents, fulfillment state |
| 9. Before primary action | Verified authorship, exact sellable identity, product facts and blockers |
| 10. Progressive disclosure | Long maker history, process, related work, editorial context |
| 11. State requirements | Unique item sold/unavailable, provenance Unknown/Conflicting, Missing Media, Price Changed, fragile support |
| 12. Failure/recovery | Preserve documentation when sold; suppress unverified biography/claims; route successor/related work only by rationale |
| 13. Cross-page handoffs | Maker entity, cart/order, care/support, related object |
| 14. Recommendation/education | Related work by maker/curation relation; never arbitrary style similarity |
| 15. Accessibility | Craft media alternatives; authorship/variation textual; unique-item state announced |
| 16. Responsive priority | ESSENTIAL object/authorship/facts/states/action; HIGH craft/scale media; SUPPORTING maker context; DEFERRED extended story |
| 17. Analytics questions | Does provenance aid decision without obscuring object truth, and how do sold unique objects recover? |
| 18. Synthetic fixtures | **SYNTHETIC:** verified studio object, handmade tolerance, sold unique object, provenance pending |
| 19. Real-data gates | Object identity, maker permissions/provenance, measurements/media, exact price/stock/policies |
| 20. Must not do | Invent biography/origin, merge brand/manufacturer/maker, or let story conceal fit/contents/state |

---

## Contract 24 — Learn Index

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Find trustworthy help by task, division, or decision—not publication chronology |
| 2. Entry conditions | Global utility, division/category/PDP/support context, or external educational intent |
| 3. Authoritative data inputs | Education Resources, Tasks, Division/Category/Product Type relationships, canonical Glossary terms |
| 4. Information hierarchy | Common tasks → division needs → guide types → glossary/help → support fallback |
| 5. Module sequence | Learn orientation; task routes; division-specific help; measurement/fit/proof/care; glossary; recent only if useful |
| 6. Primary action | Open the relevant guide/help resource |
| 7. Secondary actions | Browse division/topic, search, return to commerce context, contact support |
| 8. Decision-critical information | Resource purpose, audience/task, governed status, division relevance |
| 9. Before primary action | Clear task categories and non-promotional purpose |
| 10. Progressive disclosure | Extended resource listings and editorial metadata |
| 11. State requirements | Loading, Empty topic, Error, Stale resource, Missing Media |
| 12. Failure/recovery | Preserve task; route to related canonical resource/support; do not fill gaps with generic content |
| 13. Cross-page handoffs | Guide returns to originating product/category/resolver; support receives task context |
| 14. Recommendation/education | Education is primary; product links are contextual and typed |
| 15. Accessibility | Clear hierarchy, descriptive links, search/list semantics, no card relying on imagery |
| 16. Responsive priority | ESSENTIAL tasks/search; HIGH division guides; SUPPORTING glossary; DEFERRED editorial discovery |
| 17. Analytics questions | Which questions find a useful resource, return to a decision, or still require support? |
| 18. Synthetic fixtures | **SYNTHETIC:** measurement, compatibility, proof, care, setup resources; empty topic |
| 19. Real-data gates | Approved education inventory, canonical relationships, owners/review status |
| 20. Must not do | Become a generic blog, SEO archive, duplicated FAQ system, or disguised product grid |

---

## Contract 25 — Guide / How-to

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Complete or understand a consequential task with clear limits and next steps |
| 2. Entry conditions | Learn, contextual help, search, PDP/order/support deep link |
| 3. Authoritative data inputs | Education Resource, Source references, Attribute/Task/Product Type relationships, approved Media |
| 4. Information hierarchy | Task/outcome → prerequisites/limits → steps/concepts → verification/recovery → contextual destinations |
| 5. Module sequence | Purpose; who/when; required information/tools; ordered guidance; warnings/unknowns; result check; commerce/support links |
| 6. Primary action | Complete the task or return to the informed decision |
| 7. Secondary actions | Open glossary, related guide, relevant category/PDP/resolver, support |
| 8. Decision-critical information | Scope, prerequisites, limitations, authoritative source, consequence of uncertainty |
| 9. Before primary action | Task scope and any safety/eligibility/fit limitation needed before steps |
| 10. Progressive disclosure | Background theory, references, optional advanced paths |
| 11. State requirements | Loading, Error, Stale, Missing Media, missing referenced product/context |
| 12. Failure/recovery | State inability to resolve; preserve context to resolver/support; retain prior version only as labeled archive |
| 13. Cross-page handoffs | Deep link to exact resolver/PDP section and back; support receives completed steps |
| 14. Recommendation/education | Products appear only when task relationship is valid; no forced shopping outcome |
| 15. Accessibility | Semantic steps, captions/transcripts, text alternatives, warnings before dependent action |
| 16. Responsive priority | ESSENTIAL purpose/prerequisites/steps; HIGH limits/recovery; SUPPORTING media/context; DEFERRED background |
| 17. Analytics questions | Do users complete the task, revisit steps, recover, or escalate at a named point? |
| 18. Synthetic fixtures | **SYNTHETIC:** joint measurement, device setup, proof interpretation, cleaning procedure |
| 19. Real-data gates | Approved subject guidance, source authority, media, product relationships, policy limits |
| 20. Must not do | Invent safety/legal advice, duplicate definitions, use competitor content, or prioritize products over task success |

---

## Contract 26 — Glossary Term

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand one governed term and why it matters to a decision |
| 2. Entry conditions | Inline help, Learn/search, guide/category/PDP reference, direct shareable route |
| 3. Authoritative data inputs | Canonical Glossary Term, source/review status, Attribute/Product Type/Task relationships |
| 4. Information hierarchy | Plain definition → decision consequence → examples/contrasts → related tasks/terms |
| 5. Module sequence | Term; concise definition; applies/does not apply; decision use; related resources/support |
| 6. Primary action | Return to the informed task or open related guidance |
| 7. Secondary actions | Explore related term, category, guide, or support |
| 8. Decision-critical information | Canonical meaning, scope, common confusion, unit/basis where applicable |
| 9. Before primary action | Complete concise definition and consequence |
| 10. Progressive disclosure | Etymology/background, extended comparisons, source detail |
| 11. State requirements | Loading, Error, Stale, Unknown/contested term status |
| 12. Failure/recovery | Do not publish unsupported definition; route to broader guide/support |
| 13. Cross-page handoffs | Return to origin without losing state; term links to relevant Attribute/Guide |
| 14. Recommendation/education | No product grid by default; contextual destinations only |
| 15. Accessibility | Term pronunciation only if sourced; definition text-first; popover and page equivalents |
| 16. Responsive priority | ESSENTIAL definition/consequence; HIGH contrasts; SUPPORTING related links; DEFERRED sources/background |
| 17. Analytics questions | Does the definition reduce backtracking, option errors, or repeated help use? |
| 18. Synthetic fixtures | **SYNTHETIC:** resistance, joint gender/type, proof status, potency basis terms |
| 19. Real-data gates | Approved canonical definition, source, relationships, review owner |
| 20. Must not do | Diverge from inline definitions, create keyword filler, or imply product/legal conclusions |

---

## Contract 27 — THCA Proof / COA Detail

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Verify what evidence applies to an exact product/variant/batch and understand its status |
| 2. Entry conditions | THCA PDP/card summary, order detail, direct proof route, support |
| 3. Authoritative data inputs | Product/Variant/Batch, Proof Document/Version, Laboratory, Result Groups, applicability Relationship, Claim/Source/status |
| 4. Information hierarchy | Applicability identity → document status → issuer/date/version → accessible document/results → limits/history/support |
| 5. Module sequence | Product/batch scope; Current/Stale/Missing/etc.; document identity; results/methods; version/archive; explanation; support |
| 6. Primary action | Inspect/download accessible applicable evidence or return to informed product/order decision |
| 7. Secondary actions | View product, change known batch, read explainer, report mismatch, contact support |
| 8. Decision-critical information | Exact applicability, status, batch/sample, issuer, date/version, missing/stale consequence |
| 9. Before primary action | Product/variant/batch/document scope and current status |
| 10. Progressive disclosure | Full result groups, methods, archival versions, terminology |
| 11. State requirements | Loading, Error, Current, Stale, Missing, Not Supplied, Unmatched, Superseded, Archived, Unknown |
| 12. Failure/recovery | Never substitute another batch; preserve product/order/batch context to support; stale remains labeled |
| 13. Cross-page handoffs | Exact scope to PDP/order/support; product return preserves variant |
| 14. Recommendation/education | Proof explainer only; no product cross-sell on evidence surface |
| 15. Accessibility | Document viewer alternative, semantic results, status/date in text, keyboard access, support for inaccessible files |
| 16. Responsive priority | ESSENTIAL applicability/status/document access; HIGH issuer/date/results; SUPPORTING explainer/history; DEFERRED methods |
| 17. Analytics questions | Can users locate applicable proof, distinguish stale/unmatched, and recover from inaccessible/missing evidence? |
| 18. Synthetic fixtures | **SYNTHETIC:** current, stale, missing, unmatched, superseded, inaccessible document |
| 19. Real-data gates | Actual COAs, batches, laboratory metadata, versions, applicability, rights/accessibility |
| 20. Must not do | Apply by product name, imply missing evidence is positive, alter results, or hide scope/history |

---

## Contract 28 — Maker / Brand / Artist Entity Page

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand a substantive entity's verified role, provenance, relationship to Blowin' Smoke, and relevant work |
| 2. Entry conditions | PDP, curated edit, maker navigation, guide/search; page exists only after substance threshold |
| 3. Authoritative data inputs | Brand/Manufacturer/Maker/Artist entities, relationships, provenance Claims/Sources, permissions, relevant Products/Education |
| 4. Information hierarchy | Identity/role → verified provenance → why carried → relevant work → education/context → claims/source/support |
| 5. Module sequence | Entity identity; role distinctions; provenance; curation rationale; product/work set; guides; source/update context |
| 6. Primary action | Explore relevant verified work/products |
| 7. Secondary actions | Read entity context, open guide, return to category, ask authenticity/support question |
| 8. Decision-critical information | Exact entity role, authorship/manufacturing distinctions, verified claims, current product states |
| 9. Before primary action | Entity identity/role and Blowin' Smoke rationale |
| 10. Progressive disclosure | Extended biography, methods, collaboration history, source detail |
| 11. State requirements | Loading, Empty work set, Unknown/Conflicting provenance, Missing Media, stale claims, entity inactive |
| 12. Failure/recovery | No page instance without substance; suppress unsupported claims; preserve useful history if no products |
| 13. Cross-page handoffs | Products to canonical PDP, guides to Learn, category/search back with entity scope |
| 14. Recommendation/education | Product membership based on verified relation; curation rationale explicit |
| 15. Accessibility | Role distinctions textual; image attribution/alternatives; no logo-only identity |
| 16. Responsive priority | ESSENTIAL identity/role/rationale/work; HIGH provenance; SUPPORTING education; DEFERRED extended biography |
| 17. Analytics questions | Does substantive context aid qualified product discovery, and where do role/provenance questions remain? |
| 18. Synthetic fixtures | **SYNTHETIC:** maker with verified works, brand not manufacturer, collaboration, empty current assortment |
| 19. Real-data gates | Entity identity, permissions, provenance sources, relationships, curation content, products |
| 20. Must not do | Publish thin SEO pages, invent biography/origin, merge roles, or show an unqualified product grid |

---

## Contract 29 — Quick Cart

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Confirm a recent add and understand the immediate line state without losing page context |
| 2. Entry conditions | Successful/failed add or explicit cart utility open |
| 3. Authoritative data inputs | Exact Sellable Variant, quantity, Price, Availability, top eligibility/fit/requirement/proof state, cart summary |
| 4. Information hierarchy | Add result → exact line identity/variant → quantity/price → highest blocker/change → full-cart/continue actions |
| 5. Module sequence | Status; line item; concise state; edit/remove; subtotal summary; full cart; return |
| 6. Primary action | Review full cart when validation is needed, otherwise continue appropriately |
| 7. Secondary actions | Adjust quantity, remove, return to product/shopping, open issue explanation |
| 8. Decision-critical information | Exact variant, quantity, current price/availability, add failure/blocker |
| 9. Before primary action | Add outcome and any material state change |
| 10. Progressive disclosure | Full validation detail routes to full cart; never hidden if action depends on it |
| 11. State requirements | Loading, Empty, Failed Add, Price Changed, Unavailable, Restricted, Unknown Fit, Additional Component |
| 12. Failure/recovery | Preserve selection; prevent duplicate add; route complex issue to full cart with context |
| 13. Cross-page handoffs | Full cart receives exact state; close returns focus to trigger; product link keeps variant |
| 14. Recommendation/education | No arbitrary cross-sell; only concise missing-required-component route when verified |
| 15. Accessibility | Drawer focus management, Escape/return focus, live add status, background inert, labeled controls |
| 16. Responsive priority | ESSENTIAL add result/line/blocker/full-cart action; HIGH quantity/price; SUPPORTING continue link; DEFERRED none |
| 17. Analytics questions | Do adds succeed, duplicate, fail by state, or require full-cart resolution? |
| 18. Synthetic fixtures | **SYNTHETIC:** successful add, failed add, price change, missing component, empty cart |
| 19. Real-data gates | Cart service, exact variants, current price/stock, state evaluation |
| 20. Must not do | Replace full validation, hide blocker, invent subtotal, trap focus, or add unrelated recommendations |

---

## Contract 30 — Full Cart

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Revalidate the complete intended purchase and resolve every material blocker before checkout |
| 2. Entry conditions | Quick cart, header cart, PDP/cart recovery, returning session |
| 3. Authoritative data inputs | Exact Variants, quantities, Price, Availability, Eligibility, Options, Compatibility, Requirements, Proof, Bundle relationships |
| 4. Information hierarchy | Cart status → line identities/states → cross-line relationships → interventions → totals/fulfillment → progression/support |
| 5. Module sequence | Global alert; line items; relationship/requirements; price/availability changes; eligibility/fit/proof; totals; primary action; support |
| 6. Primary action | Proceed only when composed cart state permits; otherwise resolve highest blocker |
| 7. Secondary actions | Edit/remove, resolve options, check fit, add required component, save/return, support |
| 8. Decision-critical information | Every exact variant, quantity, current price/stock, eligibility, fit, requirements, bundle state, changed facts |
| 9. Before primary action | All blocking/warning states and current total basis |
| 10. Progressive disclosure | Detailed evidence/policy explanation; blocker summary remains visible |
| 11. State requirements | Loading, Empty, Error, Restricted, Unavailable/Sold Out, Unknown Fit, Missing Proof, Additional Component, Price Changed, Failed Eligibility, Notify Eligible |
| 12. Failure/recovery | Preserve valid lines/choices; localize errors; distinguish block/warn/inform; prevent duplicate progression |
| 13. Cross-page handoffs | Exact line/context to PDP/resolver/proof/support; return from resolution restores cart |
| 14. Recommendation/education | Only missing-required, compatible replacement, or reasoned recovery; no pressure module before blockers |
| 15. Accessibility | Error summary links to lines; state changes announced; quantities operable; relationships conveyed semantically |
| 16. Responsive priority | ESSENTIAL lines/blockers/total/action; HIGH recovery/relationships; SUPPORTING fulfillment/policy; DEFERRED optional recommendations |
| 17. Analytics questions | Which composed states block, recover, or cause removal; do price/fit/eligibility changes remain understood? |
| 18. Synthetic fixtures | **SYNTHETIC:** incompatible pair, unknown fit, missing component, restricted item, price change, unavailable bundle member |
| 19. Real-data gates | Live cart, price/stock, eligibility, compatibility/requirements, proof, fulfillment/policy |
| 20. Must not do | Merely list SKUs, silently remove/replace items, imply checkout readiness, or weaken constraints |

---

## Contract 31 — Account Overview

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Reach orders, support, profile/consent controls, and enabled saved context |
| 2. Entry conditions | Authenticated account entry; unauthenticated users receive secure sign-in route outside this architecture |
| 3. Authoritative data inputs | Account identity/service state, Orders summary, consent/preferences, support cases and saved products if enabled |
| 4. Information hierarchy | Current service needs → orders → support → profile/consent → optional saved context |
| 5. Module sequence | Account orientation; recent order/action; order list; support; profile/consent; supporting saved items |
| 6. Primary action | View relevant order or account task |
| 7. Secondary actions | Manage profile/consent, access support, view saved products, sign out |
| 8. Decision-critical information | Account state, recent order status, consent state, unresolved support issue |
| 9. Before primary action | Clear private context and most relevant service action |
| 10. Progressive disclosure | Preferences, history, future owned-product features |
| 11. State requirements | Loading, Empty orders, Error, stale session, unavailable service, consent changed |
| 12. Failure/recovery | Protect privacy; preserve non-sensitive task; route service failure without exposing data |
| 13. Cross-page handoffs | Orders/support receive account/order context; public product links remain canonical |
| 14. Recommendation/education | No personalization without clear job/consent; post-purchase guidance tied to order |
| 15. Accessibility | Clear private landmarks; session/error announcements; consent controls explicit and reversible |
| 16. Responsive priority | ESSENTIAL current task/orders/support; HIGH profile/consent; SUPPORTING saved products; DEFERRED future history |
| 17. Analytics questions | Can customers retrieve orders/support and manage consent without confusion or unnecessary data collection? |
| 18. Synthetic fixtures | **SYNTHETIC:** new account/no orders, recent order, consent changed, service error |
| 19. Real-data gates | Identity/account platform, orders, consent/privacy rules, support operations |
| 20. Must not do | Build speculative profile, bundle marketing consent, expose private data, or imply saved item means ownership |

---

## Contract 32 — Order List

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Find a past/current order and recognize its status/context |
| 2. Entry conditions | Authenticated account navigation |
| 3. Authoritative data inputs | Orders, order status, dates/references, line summaries, fulfillment/support state |
| 4. Information hierarchy | Current/action-needed orders → history → filter/search where justified |
| 5. Module sequence | List orientation; status groups/filters; order summaries; empty/error/support |
| 6. Primary action | Open an order detail |
| 7. Secondary actions | Filter/search orders, access support, return to account |
| 8. Decision-critical information | Order reference/date, status, recognizable line summary, action-needed state |
| 9. Before primary action | Order identity/status and whether action is required |
| 10. Progressive disclosure | Extended line preview, older history, filters |
| 11. State requirements | Loading, Empty, Error, stale status, unavailable order data |
| 12. Failure/recovery | Preserve filters; distinguish no orders from service failure; support route retains account context |
| 13. Cross-page handoffs | Exact order to detail/support; account return |
| 14. Recommendation/education | None; post-purchase guidance belongs in detail |
| 15. Accessibility | Semantic list, descriptive order links, status not color-only, updates announced |
| 16. Responsive priority | ESSENTIAL reference/status/date/action; HIGH line recognition; SUPPORTING filters; DEFERRED older detail preview |
| 17. Analytics questions | Can customers locate the intended order and identify action-needed states? |
| 18. Synthetic fixtures | **SYNTHETIC:** no orders, current order, historical order, failed service |
| 19. Real-data gates | Order/account/fulfillment systems and retention policy |
| 20. Must not do | Invent status/timing, expose sensitive details in summaries, or add unrelated merchandising |

---

## Contract 33 — Order Detail

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand one order, retrieve exact product documentation/proof, and get contextual help/replacement |
| 2. Entry conditions | Authenticated order list/confirmation/account/support link |
| 3. Authoritative data inputs | Order, purchased Variant references/snapshots, fulfillment state, Batch/Proof where recorded, Education, Relationships, support case |
| 4. Information hierarchy | Order identity/status → lines/exact configurations → fulfillment/action → proof/docs/setup/care → replacement/support |
| 5. Module sequence | Summary/status; line details; fulfillment; documentation/proof; setup/care; current validated reorder/replacement; support |
| 6. Primary action | Complete the current order-related task or get support |
| 7. Secondary actions | View product/proof, access guide, reorder/replace after revalidation, return/damage request |
| 8. Decision-critical information | Exact purchased variant, order/fulfillment state, current versus historical distinction, applicable documents |
| 9. Before primary action | Order identity/status and any action-needed operational state |
| 10. Progressive disclosure | Full line facts, documents, guides, replacement detail |
| 11. State requirements | Loading, Error, Stale status, Missing Proof, discontinued product, unavailable replacement, support case state |
| 12. Failure/recovery | Historical state remains labeled; current reorder revalidates everything; missing data routes with exact order context |
| 13. Cross-page handoffs | Purchased context to proof/PDP/guide/support; replacement to current PDP/cart |
| 14. Recommendation/education | Setup/care/replacement only by exact order/product relation; no generic retention cross-sell |
| 15. Accessibility | Status/action relationships semantic; documents accessible; order/line headings structured |
| 16. Responsive priority | ESSENTIAL order/status/lines/action; HIGH docs/proof/support; SUPPORTING setup/replacement; DEFERRED extended history |
| 17. Analytics questions | Can customers find proof/docs/support and safely revalidate reorder/replacement? |
| 18. Synthetic fixtures | **SYNTHETIC:** THCA order with proof, vape setup/replacement, glass damage case, discontinued product |
| 19. Real-data gates | Order/fulfillment data, purchased variants, proof/batch mapping, guides, support/returns operations |
| 20. Must not do | Treat past price/fit/eligibility as current, invent fulfillment promises, or lose order context |

---

## Contract 34 — Order Confirmation

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Confirm the completed transaction and know immediate next steps |
| 2. Entry conditions | Successful transaction result only; payment/checkout design is outside scope |
| 3. Authoritative data inputs | Confirmed Order, exact lines, totals, current fulfillment references, documents/support routes |
| 4. Information hierarchy | Confirmation → order reference → exact items/totals → next steps → order detail/docs/support |
| 5. Module sequence | Success status; order reference; line summary; operational next step; account/order access; support |
| 6. Primary action | View order detail or complete the immediate documented next step |
| 7. Secondary actions | Access proof/setup/support, return to house |
| 8. Decision-critical information | Confirmation status, order reference, exact lines, recorded total, next-step category |
| 9. Before primary action | Unambiguous transaction outcome and order reference |
| 10. Progressive disclosure | Detailed documents, setup/care, policies |
| 11. State requirements | Loading/processing, Error/unknown outcome, duplicate refresh protection, missing document |
| 12. Failure/recovery | Never display false success; unknown outcome routes to order lookup/support without duplicate order |
| 13. Cross-page handoffs | Exact order to detail/proof/guide/support |
| 14. Recommendation/education | Immediate product documentation only; no cross-sell wall |
| 15. Accessibility | Outcome announced; reference selectable/readable; focus lands on confirmation status |
| 16. Responsive priority | ESSENTIAL outcome/reference/lines/next step; HIGH order detail/support; SUPPORTING docs; DEFERRED house return |
| 17. Analytics questions | Do customers understand outcome and reach order details without duplicate attempts? |
| 18. Synthetic fixtures | **SYNTHETIC:** confirmed, processing/unknown outcome, missing proof link, guest/account route |
| 19. Real-data gates | Transaction/order service, actual lines/totals, fulfillment/support/document routes |
| 20. Must not do | Invent confirmation, promises, delivery time, or dominate with promotion |

---

## Contract 35 — Support Hub / Contextual Intake

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Resolve or escalate an order, shipping, return, damage, product, proof, eligibility, compatibility, fit, technical, or care issue |
| 2. Entry conditions | Global Support, PDP/resolver/proof/cart/order contextual handoff, policy route |
| 3. Authoritative data inputs | Support intents/resources, policy/guide references, optional product/variant/order/proof/fit/cart context, private customer input |
| 4. Information hierarchy | Current carried context → intent → self-service answer → required details → human escalation/case state |
| 5. Module sequence | Context summary; intent selection; relevant help; unresolved question; minimal intake; consent/attachment; handoff/reference |
| 6. Primary action | Resolve via authoritative resource or submit contextual escalation |
| 7. Secondary actions | Change intent/context, return to source page, access policy/guide/order |
| 8. Decision-critical information | What context is carried, what remains unknown, what data is requested/why, available resolution path |
| 9. Before primary action | Context summary, privacy purpose, relevant known state, no invented service promise |
| 10. Progressive disclosure | Troubleshooting detail, optional attachments, policy/source depth |
| 11. State requirements | Loading, Empty context, Error, Unknown, failed submission, case created, attachment failure, stale context |
| 12. Failure/recovery | Preserve entered/known context safely; issue reference on success; retry without duplicate; alternate route if service fails |
| 13. Cross-page handoffs | Context remains linked to exact source object; resolution returns to product/cart/order where appropriate |
| 14. Recommendation/education | Self-service resources must match intent; products only as verified resolution, never deflection |
| 15. Accessibility | Labeled forms/errors, focus summary, attachment alternatives, no timing traps, status announcements |
| 16. Responsive priority | ESSENTIAL context/intent/resolution/submit; HIGH errors/privacy; SUPPORTING resources; DEFERRED background detail |
| 17. Analytics questions | Which intents self-resolve, escalate, lose context, fail submission, or reveal catalog data gaps? |
| 18. Synthetic fixtures | **SYNTHETIC:** unknown coil, unknown glass fit, missing COA, damaged item, failed eligibility service, submission error |
| 19. Real-data gates | Support channels/workflow/authority, policies, case system, privacy/retention, real contextual objects |
| 20. Must not do | Promise channels/times, discard context, convert customer input to catalog truth, or force repeated explanation |

---

## Contract 36 — Policy / Trust Page Family

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Retrieve current governed shipping, returns/damage, privacy, terms, accessibility, age/eligibility, warning, or authenticity/proof information |
| 2. Entry conditions | Footer, contextual PDP/cart/order/support link, direct policy route |
| 3. Authoritative data inputs | Legal/Policy Statements, Operational Promises, Source Owners, effective/version status, support references |
| 4. Information hierarchy | Policy identity/scope → current effective status → decision-relevant summary → full governed content → support/update history |
| 5. Module sequence | Title/scope/owner/effective date; summary; structured provisions; exceptions/context; related policies; support |
| 6. Primary action | Understand the rule/commitment or reach the correct support path |
| 7. Secondary actions | Return to product/cart/order, open related policy, accessibility/support contact |
| 8. Decision-critical information | Scope, effective date/version, accountable source, operational versus legal nature |
| 9. Before primary action | Current status and concise applicable context |
| 10. Progressive disclosure | Full detail, archived versions, definitions |
| 11. State requirements | Loading, Error, Stale/Superseded, Missing/Unknown content, inaccessible document |
| 12. Failure/recovery | Never fill missing policy; retain last version only as labeled stale/archive; route qualified support |
| 13. Cross-page handoffs | Return preserves originating product/cart/order; support receives policy/context reference |
| 14. Recommendation/education | Related policy/explainer only; no commerce recommendation |
| 15. Accessibility | Semantic long-form structure, plain-language summary, accessible documents, skip links, readable updates |
| 16. Responsive priority | ESSENTIAL identity/scope/status/summary; HIGH applicable detail/support; SUPPORTING related policies; DEFERRED archives |
| 17. Analytics questions | Can customers find applicable policy and contextual support, and where do stale/missing versions interrupt decisions? |
| 18. Synthetic fixtures | **SYNTHETIC:** current, superseded, missing owner content, accessibility support route |
| 19. Real-data gates | Qualified legal/compliance/operations content, owners, effective dates, support process |
| 20. Must not do | Write legal conclusions, manually duplicate page summaries, hide version/scope, or mix marketing into policy |

---

## Contract 37 — About / House Story

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Understand why Blowin' Smoke exists, who it serves, and how independence shapes curation/service |
| 2. Entry conditions | Home/footer/entity/press or direct brand-intent route |
| 3. Authoritative data inputs | Article I-approved brand content, verified house Claims/Sources, approved Media, curation standards |
| 4. Information hierarchy | Mission/underdog purpose → independent story → standards/judgment → people/culture with consent → invitation to shop/learn/support |
| 5. Module sequence | Purpose; origin; customer/conviction; how judgment works; accountable people/culture; next routes |
| 6. Primary action | Enter a division or Learn with informed house context |
| 7. Secondary actions | Explore standards, support, maker/curation context |
| 8. Decision-critical information | Authentic mission, independent operating stance, customer promise, verifiable claims |
| 9. Before primary action | Clear purpose and distinction without corporate filler |
| 10. Progressive disclosure | Long history, profiles, behind-the-scenes media, source context |
| 11. State requirements | Loading, Missing Media, Stale/Unverified claim, content unavailable |
| 12. Failure/recovery | Story remains meaningful without media; suppress unsupported claims; route to house/divisions |
| 13. Cross-page handoffs | House/division/learn/support; maker/entity relations only when verified |
| 14. Recommendation/education | No product grid; links express house standards and customer tasks |
| 15. Accessibility | Media consent/alternatives, logical narrative headings, no decorative motion dependency |
| 16. Responsive priority | ESSENTIAL mission/story/standards; HIGH division routes; SUPPORTING people/media; DEFERRED extended history |
| 17. Analytics questions | Do visitors understand the house and continue to a relevant division/knowledge route? |
| 18. Synthetic fixtures | **SYNTHETIC:** text-first story, missing media, pending house claim, division destinations |
| 19. Real-data gates | Approved brand narrative, verified history/claims, people permissions, original media |
| 20. Must not do | Manufacture culture, copy competitor language, become corporate filler, or use unsupported superlatives |

---

## Contract 38 — Footer

| CONTRACT FIELD | SPECIFICATION |
|---|---|
| 1. Customer job | Retrieve durable shop, Learn, Support, About, policy, and account destinations after the main task |
| 2. Entry conditions | End of public pages; simplified appropriately in private/transaction contexts |
| 3. Authoritative data inputs | Approved navigation groups/routes, policy versions, account/support availability, consent controls |
| 4. Information hierarchy | Shop divisions → Learn → Support → About → Policies → Account/consent |
| 5. Module sequence | Grouped durable links; contact/support route; policy/legal; consent/accessibility controls |
| 6. Primary action | Reach the missing durable destination |
| 7. Secondary actions | Account/orders, consent management, return to house |
| 8. Decision-critical information | Current support/policy destinations and house/division orientation |
| 9. Before primary action | Group labels and descriptive link names |
| 10. Progressive disclosure | None that would hide required policy/accessibility/consent links |
| 11. State requirements | Link/service unavailable, consent changed, authenticated/anonymous, policy update |
| 12. Failure/recovery | Core routes remain; failed service link explains alternate support without invented promise |
| 13. Cross-page handoffs | Destination receives current non-sensitive context only when useful/allowed |
| 14. Recommendation/education | Durable Learn entry only; no product recommendations |
| 15. Accessibility | Footer landmark, semantic grouped lists/headings, keyboard links, accessible consent controls |
| 16. Responsive priority | ESSENTIAL Support/Policies/three divisions; HIGH Learn/About; SUPPORTING Account; DEFERRED no required links |
| 17. Analytics questions | Which retrieval paths compensate for missed navigation and where are links unavailable/confusing? |
| 18. Synthetic fixtures | **SYNTHETIC:** anonymous/authenticated, policy update, support service unavailable, consent change |
| 19. Real-data gates | Approved routes, actual policies/support/account/consent systems |
| 20. Must not do | Dump every URL, duplicate full taxonomy, repeat campaigns, or hide required trust links |

---

## First-Version Design Priority

| PRIORITY | CONTRACTS | RATIONALE |
|---|---|---|
| DESIGN-BLOCKING | Global Shell; Home; Shared Division Landing plus three division extensions; Shared Category plus three category extensions; Search; Universal PDP plus THCA, Refillable Device/Kit, Pod/Coil/Replacement, Complete Glass Piece, Fitted Component; Quick Cart; Full Cart | Establishes shared shells, three-division orientation, discovery, highest-risk product decisions, and transaction-state grammar |
| CAN FOLLOW DURING VISUAL DESIGN | Curated Edit; Disposable, E-Liquid, Nicotine Pouch, Care, Maker Object PDP extensions; Learn Index; Guide; Glossary; Proof Detail; Entity Page; Account Overview; Order List/Detail/Confirmation; Support; Policy; About; Footer | Contracts are governed and can extend validated shells while visual work begins; they still precede implementation |
| SUPPORTING | Product comparison and dedicated compatibility resolver contracts identified in IA but outside this minimum requested contract set | Important after data coverage and core shell validation |
| FUTURE | Saved device/piece, aggregated proof/replacement history, personalized discovery | Depend on consent, operations, and mature relationship data |

Design-blocking does not mean production-ready. It means visual-system decisions would be unsafe or incoherent without these contracts fixed first.

---

## Architecture Matrix

| PAGE FAMILY | CUSTOMER JOB | PRIMARY DATA OBJECTS | PRIMARY ACTION | CRITICAL BLOCKER | DIVISION / PRODUCT-TYPE EXTENSION | DESIGN PRIORITY | REAL-DATA DEPENDENCY |
|---|---|---|---|---|---|---|---|
| Global shell | Orient/navigate | Division, Category, account/cart/search state | Navigate/search | Lost orientation/service failure | Division labels/jobs | Design-Blocking | Taxonomy/services |
| Home | Understand house/choose division | Division, Collection, Product summaries, Education | Enter division | Identity/routing absent | Cross-house | Design-Blocking | Brand/curation/media |
| Division landing family | Choose job/role | Division, Type/Role, Category, Education | Enter job/category | Jargon-first routing | THCA proof; vape fit; glass fit | Design-Blocking | Catalog/taxonomy |
| Category family | Compare/refine | Category, Product/Variant, Attributes, commerce states | Open qualified PDP | Constraint/zero-result ambiguity | Division filter/fact schemas | Design-Blocking | Normalized catalog |
| Search | Resolve expressed intent | Search projection, Relationships, Education | Open/refine result | Ambiguous/unknown relationship | Semantic division/role modes | Design-Blocking | Index/relationships |
| Curated edit | Explore rationale | Collection, members, states | Open product | Missing rationale/expired membership | Global/division | During Visual Design | Curation/products |
| Universal PDP | Resolve sellable state | Product/Variant and all commerce states | State-derived action | Highest precedence unresolved state | Ten product families | Design-Blocking | Full product truth |
| THCA PDP | Resolve proof/eligibility | Variant, Batch, Proof, composition, eligibility | Purchase/resolve | Restriction or proof/option issue | THCA | Design-Blocking | COA/rules/catalog |
| Vape device/part PDPs | Resolve platform/fit | Variant, Attributes, Contents, Compatibility | Purchase/check fit | Unknown/incompatible/missing part | Vape roles | Design-Blocking | Compatibility/specs |
| Glass piece/component PDPs | Resolve geometry/contents | Variant, measurements, Fit, Contents, Maker | Purchase/check fit | Unknown/incompatible geometry | Glass roles | Design-Blocking | Measurements/tests |
| Other PDP extensions | Resolve role-specific options | Universal objects + role schema | Purchase/resolve | Role-specific blocker | Disposable/liquid/pouch/care/maker | During Visual Design | Catalog/specs |
| Learn/guide/glossary | Resolve knowledge task | Education, Task, Attribute, Sources | Complete/return | Stale/unsupported guidance | Division/task | During Visual Design | Approved content |
| Proof detail | Verify evidence | Batch, Proof, Lab, Results, applicability | Inspect evidence | Missing/unmatched/stale | THCA | During Visual Design | Actual COAs |
| Entity page | Verify provenance/explore work | Entity roles, Claims, Products | Explore work | Thin/unverified entity | Maker/brand/artist | During Visual Design | Permissions/content |
| Quick/full cart | Confirm/revalidate | Exact variants and composed states | Proceed/resolve | Restriction, incompatibility, unavailable, invalid price | All | Design-Blocking | Live commerce data |
| Account/orders | Retrieve private continuity | Account, Order, Product/Proof/Support refs | View task/order | Service/privacy failure | All | During Visual Design | Identity/orders |
| Support | Resolve/escalate | Intent, context refs, private input | Resolve/submit | Lost context/service failure | All domains | During Visual Design | Operating model |
| Policy/About/Footer | Retrieve trust/identity/routes | Claims, Policies, navigation | Understand/navigate | Missing/stale governed content | Global/contextual | During Visual Design | Approved content |

---

## Open Page Decisions

| DECISION | WHY OPEN | WHAT RESOLVES IT | WHEN TO DECIDE |
|---|---|---|---|
| Exact category depth | Actual assortment is absent | Catalog/taxonomy audit | Before division/category visual compositions freeze |
| Actual product assortment/PDP instances | Products and variants are not supplied | Approved catalog | Before production content and implementation |
| Filter inventory/order | Data coverage and customer value unknown | Attribute audit and usability validation | Before category interaction design finalizes |
| Exact promotional modules | Merchandising cadence/ownership unknown | Merchandising operating plan | During content/merchandising planning |
| Dedicated resolver launch scope | Verified relationship coverage absent | Compatibility corpus and support capacity | Before first-version scope lock |
| Policy content/granularity | Qualified content absent | Legal/compliance/operations owners | Before policy content and purchase enablement |
| Exact account capabilities | Identity/support/privacy operations unknown | Account and consent operating decisions | Before account visual design finalizes |
| Support channels/service commitments | Operating model absent | Support owner/tooling/staffing | Before support implementation/content |
| COA document display details | Real formats/accessibility/rights unknown | Actual COA corpus and compliance review | Before proof viewer visual specification |
| Compatibility coverage and input methods | Catalog/manufacturer/measurement evidence absent | Data coverage and validation workflows | Before resolver and fit modules become functional |
| Real responsive module quantities | Actual content lengths/card density unknown | Synthetic prototype plus real sample catalog | During visual-system validation |
| Reviews launch scope | Review source/moderation absent | Operations, privacy, and data decision | Before review module design |

---

## Next Phase Recommendation

### Selected phase: A. Visual Design System

The governing system now defines principles, IA, data objects, and exact page contracts. A Visual Design System should come next to establish an original Blowin' Smoke expression for typography roles, spacing rhythm, density, color roles, surfaces, iconography, media treatments, semantic states, responsive composition, motion roles, and component anatomy without borrowing competitor trade dress.

It can use these contracts and clearly labeled synthetic fixtures to test hierarchy, state density, PDP-family extensions, proof, compatibility, cart interventions, and responsive priority. Actual products, media, prices, inventory, COAs, measurements, compatibility, policies, eligibility, and operating claims remain real-data gates. The next phase must not implement components or populate production content.

---

## Validation Record

| REQUIREMENT | RESULT |
|---|---|
| Every Foundational/Core Launch family has a usable contract | PASS — 38 requested contracts completed |
| Architecture follows Master System | PASS |
| Responsibilities match IA | PASS |
| Inputs follow Data Model | PASS |
| Product-family PDPs preserve universal shell | PASS |
| THCA proof remains product/variant/batch scoped | PASS |
| Electronic compatibility is state-aware | PASS |
| Physical fit is state-aware | PASS |
| Cart revalidates rather than summarizes | PASS |
| Support preserves context | PASS |
| Responsive priorities defined | PASS |
| Synthetic fixtures explicitly non-production | PASS |
| No visual styling defined | PASS |
| No implementation code | PASS |
| No real catalog/legal facts invented | PASS |
| Implementation remains unauthorized | PASS |
| Competitor research remains closed | PASS |

The validation confirms page-contract completeness, not visual or implementation readiness.
