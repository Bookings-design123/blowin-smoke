# Glossier Homepage — Final Design DNA Specification

**Prepared for:** Blowin' Smoke design, product, and engineering teams  
**Status:** Final research synthesis  
**Purpose:** Extract transferable interaction and systems principles without reproducing Glossier's identity or trade dress

## Evidence base

1. Blowin' Smoke, *Article I — Brand Philosophy*, Version 1.0.
2. Glossier homepage Firecrawl structural Markdown.
3. Existing *Glossier Homepage Design-System Analysis*.
4. *Glossier Homepage — Forensic UI, Interaction & Motion Audit*.

## Evidence key

- **OBSERVED** — Seen in the structural crawl or live forensic session.
- **TECHNICALLY CONFIRMED** — Verified through DOM, attributes, platform globals, or source behavior recorded in the forensic audit.
- **INFERRED** — A reasonable explanation supported by evidence but not directly verified.
- **NOT DETERMINABLE** — The supplied evidence cannot support a reliable conclusion.

Dual labels are retained where the audit itself reports mixed evidence. An observation does not establish the underlying implementation.

## Evidence revisions from the earlier analysis

- **Hero model revised — TECHNICALLY CONFIRMED.** The earlier analysis described the hero mainly as an image carousel because the Firecrawl capture exposed campaign image variants and slideshow controls. The live audit confirms that the active hero uses a native video element with autoplay, muted, loop, and playsinline behavior plus visible pause and mute controls. The consolidated model is therefore a **dynamic campaign-media system** that can present authored responsive imagery or controlled video; it is not defined as a carousel alone.
- **Header model strengthened — OBSERVED.** The earlier analysis marked the rendered header as unavailable. Live evidence now establishes a centered logo, left primary navigation, right utility navigation, an announcement carousel, and sticky behavior.
- **Mega menus, search, cart, and modal added — OBSERVED.** These interaction systems were absent from the structural crawl and are now supported by live evidence.
- **Hover and motion model strengthened — OBSERVED / INFERRED.** Image changes, restrained button/link feedback, menu fades, carousel translation, and cart-drawer motion were seen live. Exact timing, easing, and universal consistency across every card remain unknown.
- **Responsive implementation strengthened — TECHNICALLY CONFIRMED.** Responsive `srcset` delivery and native video attributes are confirmed. The image-processing engine, exact breakpoints, and media-generation pipeline remain unconfirmed.

---

# 1. Core Design Philosophy

Glossier's premium quality comes from the coordination of restraint and responsiveness. The visual field stays controlled, but the interface is not inert. Hover changes, media controls, overlays, drawers, variant selectors, sticky navigation, and contextual actions make the page feel attentive without turning interaction into spectacle. **OBSERVED.**

The system follows five core ideas:

1. **One dominant purpose per surface.** The hero campaigns, the product card supports evaluation, search isolates query entry, and the cart drawer manages transaction continuity. **OBSERVED.**
2. **Progressive disclosure.** Global navigation reveals mega menus on demand; product choices appear within cards; search and cart enter as temporary layers rather than permanent page density. **OBSERVED.**
3. **State-aware commerce.** “Add to bag,” “Choose set,” “Notify me,” and detail routes correspond to different product conditions. **OBSERVED.**
4. **Motion communicates topology.** Fade indicates appearance, horizontal movement indicates carousel progression, and right-to-left movement establishes the cart as a side layer. **OBSERVED.** Exact motion tokens are **NOT DETERMINABLE**.
5. **Editorial and commerce remain connected.** Campaign, category, product, and recommendation modules alternate while maintaining direct shopping routes. **OBSERVED.**

This logic is transferable; its expression is not. Under the Blowin' Smoke Constitution, premium must mean independent judgment made visible through credible curation, direct language, customer respect, and operational performance. It must not mean beauty-brand minimalism, corporate luxury, or a softened lifestyle posture.

---

# 2. Homepage Information Architecture

## Consolidated hierarchy

| Order | System | Role | Evidence |
|---|---|---|---|
| 1 | Skip link | Bypass repeated chrome and enter main content | **OBSERVED** |
| 2 | Announcement carousel | Present promotional or shipping value with previous, next, and pause controls | **OBSERVED / TECHNICALLY CONFIRMED** |
| 3 | Sticky global header | Maintain brand, category, search, account, and cart access | **OBSERVED** |
| 4 | Dynamic campaign hero | Establish the current proposition with controlled video or authored campaign media and a primary CTA | **OBSERVED / TECHNICALLY CONFIRMED** |
| 5 | “Shop All” product row | Serve high-intent customers with a curated assortment | **OBSERVED** |
| 6 | Collection/editorial modules | Route into a featured family or campaign world | **OBSERVED** |
| 7 | Visual category routes | Present durable product categories after representative merchandise | **OBSERVED** |
| 8 | Campaign/story module | Extend brand context through media and a bounded CTA | **OBSERVED** |
| 9 | Contextual recommendation module | Convert editorial interest into specific product routes | **OBSERVED** |
| 10 | Support/chat layer | Keep help available as a sticky utility | **OBSERVED** |

The sequence is not a single funnel. High-intent visitors can search, enter a category, or shop the product row immediately. Exploratory visitors receive campaign context, edited categories, and contextual recommendations. **OBSERVED.**

The structural principle is:

**orientation → proposition → product proof → guided discovery → brand context → contextual commerce**

The forensic session also recorded page-height growth after scrolling. This supports the presence of deferred media/content loading, but the exact page measurements are session-specific and are not design tokens. **OBSERVED.**

---

# 3. Global Header System

## Announcement layer

- The first observed promotion referenced a gift tied to a qualifying product. **OBSERVED.**
- The Firecrawl source also contains localized shipping thresholds, indicating market-dependent announcement content. **OBSERVED.**
- The announcement content advances automatically and uses a fade between messages. **OBSERVED / TECHNICALLY CONFIRMED.**
- Previous, next, and pause controls are present. **OBSERVED / TECHNICALLY CONFIRMED.**
- The announcement layer remains at the top during scroll. **OBSERVED / TECHNICALLY CONFIRMED.**
- Exact autoplay interval, fade duration, easing, and content-selection logic are **NOT DETERMINABLE**.

## Brand and navigation layer

- Logo is centered and maintains its apparent size while scrolling. **OBSERVED.**
- Primary category links are left-aligned. **OBSERVED.**
- Search, account, and cart utilities are right-aligned. **OBSERVED.**
- The header remains available during scroll. **OBSERVED.**
- The audit reports sticky positioning at the top, but the exact CSS declaration for the complete header was not technically classified; the behavioral result is **OBSERVED**, while exact implementation is **NOT DETERMINABLE**.

The header's design DNA is persistent utility without visible compression or dramatic transformation. It maintains orientation while allowing the content beneath it to change modes.

---

# 4. Navigation and Mega-Menu System

- Primary navigation uses text category links. **OBSERVED.**
- Hover opens a mega menu. **OBSERVED.**
- Menus use a multi-column layout with vertical category lists and featured image-led modules. **OBSERVED.**
- The observed example combined product subcategories such as Face, Brow, and Eye with a campaign module. **OBSERVED.**
- Menus close when the pointer leaves the relevant navigation/menu region. **OBSERVED.**
- Entrance appeared sharp with a fade rather than a large spatial animation. **OBSERVED.**
- Exact duration, easing, opacity values, and CSS implementation are **NOT DETERMINABLE**.
- A safe-triangle or pointer-intent technique may explain forgiving diagonal movement, but this is **INFERRED**.
- Keyboard opening behavior, focus order, escape handling, focus return, and touch equivalents are **NOT DETERMINABLE** from the audit.

The system combines taxonomy and merchandising. Permanent lists answer “where can I go?” while featured modules answer “what matters now?” Their roles remain visually and structurally distinct.

---

# 5. Hero and Dynamic Media System

## Confirmed live-video state

- The hero uses a native video element. **TECHNICALLY CONFIRMED.**
- Autoplay, muted, loop, and playsinline behavior are present. **TECHNICALLY CONFIRMED.**
- Visible controls allow pause/play and mute/unmute. **OBSERVED / TECHNICALLY CONFIRMED.**
- The primary CTA uses a high-contrast black/white treatment and the observed label “Take a peek.” **OBSERVED.**
- The button appeared rectangular with sharp corners and uppercase text. **OBSERVED.**

## Structural-crawl state

- The Firecrawl capture exposed separate desktop, tablet, and mobile campaign images for the “In A New York Minute” hero. **OBSERVED.**
- It exposed previous/next and play/pause slideshow controls. **OBSERVED.**
- It exposed a concise heading, one supporting sentence, and one direct CTA. **OBSERVED.**

## Consolidated model

The stronger live evidence revises the component from a fixed “hero carousel” to a **dynamic campaign hero** capable of controlled motion media and authored responsive imagery. Whether one component implementation handles both modes, or different campaign templates are swapped over time, is **NOT DETERMINABLE**.

The durable hierarchy is media → campaign proposition → short support copy → one primary action → media controls. Decorative content does not replace user control.

---

# 6. Product-Card System

## Anatomy

| Element | Function | Evidence |
|---|---|---|
| Product media | Establish recognition and support alternate/lifestyle views | **OBSERVED** |
| Availability state | Communicate coming-soon or unavailable conditions | **OBSERVED** |
| Merchandise badge | Signal New, Best Seller, Mix + Match, engraving, limited edition, or promotion | **OBSERVED** |
| Product title | Link to the product-detail page | **OBSERVED** |
| Descriptor | State format, category, or short benefit | **OBSERVED** |
| Variant selector | Expose card-level options through circles/radio controls or text values | **OBSERVED** |
| Price block | Show current price, variant price, or sale/regular comparison | **OBSERVED** |
| Primary action | Add, configure, or request notification according to state | **OBSERVED** |
| Secondary detail route | Provide a lower-commitment path to more information | **OBSERVED** |

## State map

| State | Visible behavior | Evidence |
|---|---|---|
| Default | Main image, title, price, and available variant controls | **OBSERVED** |
| Hover | Alternate or lifestyle image; action receives stronger attention; some cards show slight visual elevation/change | **OBSERVED / INFERRED** |
| Selected variant | Active circle changes border/fill and the card reflects the selection | **OBSERVED** |
| Directly purchasable | “Add to bag” is available | **OBSERVED** |
| Configuration required | “Choose set” or equivalent configuration route replaces direct add | **OBSERVED** |
| Coming soon/unavailable | “Notify me” replaces purchase | **OBSERVED** |
| Add success | Cart drawer opens | **OBSERVED** |

Alternate imagery was observed, but whether every card uses exactly the same hover rule is **NOT DETERMINABLE**. The audit's phrase “elevation or image swap” does not establish a universal effect.

## Design logic

The card keeps a stable semantic order while supporting multiple commercial objects: single items, sizes, variants, sets, sale items, and unavailable products. The action changes with readiness rather than presenting a generic purchase button. **OBSERVED.**

The source establishes badge order in the content stream, not exact rendered placement. Badge geometry and universal placement are **NOT DETERMINABLE** from the structural record alone.

---

# 7. Hover-State System

## Observed patterns

- Buttons use color inversion or a slight opacity response; large scale transforms were not observed. **OBSERVED.**
- Primary navigation links may use underline or color change. The audit records variation, so the universal rule is **NOT DETERMINABLE**.
- Product cards change imagery or visual emphasis; some appear to gain slight elevation. **OBSERVED / INFERRED.**
- Entire category and editorial cards are clickable. **OBSERVED.**
- CTA styling within editorial cards changes subtly on hover. **OBSERVED.**

## System principle

Hover communicates interactivity or reveals useful secondary media without materially reflowing the layout. It does not rely on dramatic scaling. **OBSERVED.**

Touch behavior, pen behavior, hover-media preloading, and whether all hover states have equivalent keyboard focus treatments are **NOT DETERMINABLE**.

---

# 8. Search System

- Search opens as a full-width overlay. **OBSERVED.**
- Its vertical coverage varies with viewport conditions and may occupy the upper region or most/all of the viewport. **OBSERVED.**
- The input receives focus when search opens. **OBSERVED.**
- A close control appears in the upper-right area. **OBSERVED.**
- Overlay appearance uses a fade pattern. **OBSERVED.**
- Exact geometry, responsive thresholds, result ranking, predictive-search behavior, keyboard shortcuts, focus trapping, escape handling, and focus return are **NOT DETERMINABLE**.

Search temporarily replaces browsing context with a focused known-item task. Its overlay form avoids adding a permanent large search field to the header while keeping entry globally available.

---

# 9. Cart Drawer System

- Successful quick add opens a right-side cart drawer. **OBSERVED.**
- The drawer enters from right to left. **OBSERVED.**
- A dimmed scrim blocks interaction with the underlying page. **OBSERVED.**
- The empty state says “Your bag is empty” and offers a “Shop all” route. **OBSERVED.**
- Exact drawer width, duration, easing, focus trap, escape behavior, body-scroll lock, quantity controls, error recovery, and focus return are **NOT DETERMINABLE**.

The drawer preserves page context while confirming transaction state. Its direction creates a spatial model: the bag is adjacent to the page rather than a destination that replaces it.

---

# 10. Modal System

- An email-signup modal appeared after the user had scrolled into the page. **OBSERVED.**
- The audit estimated the trigger near a particular scroll depth, but the exact threshold is **NOT DETERMINABLE** and must not be treated as a specification.
- The modal uses a semi-transparent dark scrim. **OBSERVED.**
- It can be dismissed with an X control or a “No thanks” link. **OBSERVED.**
- Trigger frequency, delay, session suppression, targeting, consent fields, focus management, escape behavior, and reappearance logic are **NOT DETERMINABLE**.

The modal is interruption-based acquisition. Its presence is evidence of a pattern, not evidence that the pattern is appropriate for Blowin' Smoke.

---

# 11. Scroll and Sticky Behavior

- Announcement and global navigation remain available while scrolling. **OBSERVED.**
- The Gorgias chat widget remains available as a sticky/floating utility. **OBSERVED.**
- Lower-page images and video appear to load progressively, with document height changing as the page is traversed. **OBSERVED.**
- The page rhythm alternates product groups and full-width editorial or video modules. **OBSERVED.**
- The exact sticky CSS, stacking-index system, placeholder strategy, layout-shift mitigation, lazy-loading API, preload priorities, and intersection thresholds are **NOT DETERMINABLE**.

The page uses persistent utilities for orientation and assistance while letting content density change by task. The recorded height values describe one audit session only and are not reusable specifications.

---

# 12. Motion System

## Motion inventory

| Pattern | Use | Evidence |
|---|---|---|
| Fade | Announcement changes, mega-menu entrance, overlays | **OBSERVED** |
| Horizontal translation | Announcement/product carousel progression | **OBSERVED** |
| Right-to-left slide | Cart drawer entrance | **OBSERVED** |
| Continuous video | Campaign hero, muted and looping by default | **TECHNICALLY CONFIRMED** |
| Image change | Product hover/alternate view | **OBSERVED / INFERRED** |
| Scroll-triggered appearance | Email-signup modal | **OBSERVED** |

## Motion philosophy

Motion is restrained in amplitude and mapped to function. Fade signals layer appearance; translation communicates direction or sequence; media motion carries campaign energy; hover change reveals another product view. **OBSERVED.**

Exact durations, easing curves, stagger values, transform distances, spring physics, animation ownership, and performance budgets are **NOT DETERMINABLE**. No claim can be made that GSAP, Framer Motion, or another animation library is used.

---

# 13. Responsive Media System

- Responsive image delivery uses `srcset`. **TECHNICALLY CONFIRMED.**
- The structural crawl includes separate desktop, tablet, and mobile hero assets. **OBSERVED.**
- Asset URLs use Shopify-hosted paths and Imgix-style sizing parameters. **OBSERVED / TECHNICALLY CONFIRMED** as URL behavior.
- Shopify is the confirmed commerce platform. **TECHNICALLY CONFIRMED.**
- Imgix as the actual processing engine is **INFERRED**, not confirmed.
- Native video uses playsinline behavior, supporting inline mobile playback. **TECHNICALLY CONFIRMED.**
- Exact breakpoints, art-direction rules, quality settings, format negotiation, CDN ownership, poster behavior, preload policy, and crop automation are **NOT DETERMINABLE**.

The design-system principle is authored media by role and viewport, not one source scaled indiscriminately. Product, category, editorial, and hero media each serve a different decision function.

---

# 14. Accessibility and Motion-Control Requirements

## Current evidence

- A “Skip To Main” link is present in the DOM. **OBSERVED.**
- Video players use region semantics and controls include ARIA labels. **OBSERVED.**
- Hero video provides manual pause and mute controls. **OBSERVED / TECHNICALLY CONFIRMED.**
- Announcement autoplay provides a pause control. **OBSERVED / TECHNICALLY CONFIRMED.**
- Full keyboard equivalence, focus trapping, focus return, live announcements, visible focus across all controls, reduced-motion media-query behavior, and contrast compliance are **NOT DETERMINABLE**.

## Blowin' Smoke requirement

- **SOURCE PRINCIPLE:** User control around autoplay; skip-link and ARIA evidence; Blowin' Smoke's “respect over manipulation” and “performance over appearance alone.”
- **BLOWIN' SMOKE APPLICATION:** All autoplaying or looping media must expose pause. Sound must never begin without user initiation. Honor reduced-motion preferences with a static or materially reduced alternative. Give mega menus, search, drawers, modals, carousels, variant controls, and chat complete keyboard and screen-reader behavior; trap and restore focus for true modal layers; announce cart and variant state changes; preserve visible focus; prevent background interaction when a modal layer is active.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — equal access to regulated product facts and eligibility; Vape & Nicotine — equal access to compatibility and variant decisions; Glass & Accessories — equal access to dimensions, media, and cart behavior.
- **DO NOT COPY:** Do not reproduce Glossier's control styling, placement, labels, animation, or any accessibility behavior that was not actually verified.

---

# 15. Confirmed Technical Mechanisms

| Mechanism | Confirmation |
|---|---|
| Shopify commerce platform | `window.Shopify` and Shopify URL patterns — **TECHNICALLY CONFIRMED** |
| Native campaign video | Native video element — **TECHNICALLY CONFIRMED** |
| Video behaviors | Autoplay, muted, loop, and playsinline attributes — **TECHNICALLY CONFIRMED** |
| Responsive image delivery | `srcset` — **TECHNICALLY CONFIRMED** |
| Gorgias support | Third-party Gorgias chat widget — **TECHNICALLY CONFIRMED** |
| Announcement controls/sticky behavior | Recorded as **OBSERVED / TECHNICALLY CONFIRMED** in the forensic audit |

These mechanisms explain part of the delivered experience. They do not establish exact component source, framework architecture, theme structure, analytics, animation ownership, or performance strategy.

---

# 16. Inferred or Unknown Mechanisms

## Inferred

- Pointer-intent or safe-triangle handling may make diagonal mega-menu movement more forgiving. **INFERRED.**
- Imgix may process the observed parameterized imagery. **INFERRED.**
- Product-card alternate views may be preloaded to make hover swapping immediate. **INFERRED.**

## Not determinable

- Exact animation library or whether motion is implemented with CSS, Web Animations, theme scripts, or a third-party library. **NOT DETERMINABLE.**
- Exact timing, easing, delay, transform, opacity, and breakpoint values. **NOT DETERMINABLE.**
- Server-side caching, CDN ownership, image-generation pipeline, and cache invalidation. **NOT DETERMINABLE.**
- Exact CSS declarations for the full sticky-header stack. **NOT DETERMINABLE.**
- Search ranking, predictive-search source, and result-state logic. **NOT DETERMINABLE.**
- Modal targeting, scroll threshold, frequency capping, consent data flow, and suppression logic. **NOT DETERMINABLE.**
- Drawer and overlay focus traps, focus restoration, escape behavior, and body-scroll locking. **NOT DETERMINABLE.**
- Reduced-motion media-query behavior. **NOT DETERMINABLE.**
- Lazy-loading mechanism and intersection thresholds. **NOT DETERMINABLE.**
- Universal consistency of image swap, elevation, underline, and color-change hover patterns. **NOT DETERMINABLE.**

---

# 17. Glossier Principles Worth Adapting

These are principle transfers, not visual references.

## 17.1 Restrained surface, rich state model

- **SOURCE PRINCIPLE:** Glossier keeps default layouts visually controlled while exposing meaningful hover, variant, overlay, drawer, carousel, and media-control states. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Keep the default page composed and legible, then use interaction to reveal product proof, compatibility, alternate views, cart confirmation, and guided discovery. Richness should come from usefulness, not ornament.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — reveal lab and format context without crowding; Vape & Nicotine — reveal compatibility and variants; Glass & Accessories — reveal alternate angles, scale, and connection details.
- **DO NOT COPY:** Glossier's proportions, white-space signature, card appearance, hover art direction, or motion styling.

## 17.2 Stable component grammar

- **SOURCE PRINCIPLE:** Product cards retain a consistent information sequence across simple products, variants, sets, sales, and unavailable states. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Use one cross-division product shell with controlled attribute slots and state-specific actions.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — format/composition slots; Vape & Nicotine — device/consumable/compatibility slots; Glass & Accessories — material/dimension/connection slots.
- **DO NOT COPY:** Cosmetic swatches, Glossier badge vocabulary, typography, image crops, or card trade dress.

## 17.3 Action follows readiness

- **SOURCE PRINCIPLE:** Direct add, configuration, notification, and detail actions appear for different product conditions. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Offer direct add only when the SKU is resolved and eligible; otherwise use Select options, Check compatibility, Check availability, or Notify me as truthful next steps.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — jurisdiction and option readiness; Vape & Nicotine — compatibility and required selections; Glass & Accessories — size and connection choices.
- **DO NOT COPY:** Exact Glossier CTA labels, button geometry, color inversion, or cart choreography.

## 17.4 Persistent orientation

- **SOURCE PRINCIPLE:** Announcement, brand navigation, utilities, and support remain accessible during scroll. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Keep division orientation, search, and cart available while making the persistent stack compact enough not to dominate mobile content.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — fast movement between education and products; Vape & Nicotine — rapid search and cart access; Glass & Accessories — persistent category and compatibility routes.
- **DO NOT COPY:** Centered-logo composition, left/right alignment formula, link styling, sticky dimensions, or Gorgias presentation.

## 17.5 Editorial-commerce alternation

- **SOURCE PRINCIPLE:** Product rows alternate with category, campaign, video, and contextual recommendation modules. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Alternate product proof with independent-operator insight, maker stories, lab/material education, and setup guidance. Each editorial module must have substance and a relevant next action.
- **PRIORITY:** Supporting
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — standards and documentation; Vape & Nicotine — device education and compatibility; Glass & Accessories — makers, craft, and care.
- **DO NOT COPY:** Beauty-editorial narratives, campaign rhythm, “Get the Look,” city concepts, or Glossier photography.

## 17.6 Motion as spatial explanation

- **SOURCE PRINCIPLE:** Fade, horizontal translation, side-drawer motion, and media controls correspond to different changes in interface state. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Define a small motion vocabulary: fade for layer visibility, horizontal movement for sequence, lateral drawer movement for adjacent transaction context, and restrained media transitions for proof.
- **PRIORITY:** Supporting
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — state and document transitions; Vape & Nicotine — option/compatibility feedback; Glass & Accessories — media and cart transitions.
- **DO NOT COPY:** Exact direction as a signature, duration, easing, opacity, transforms, or Glossier's motion cadence.

## 17.7 Authored responsive media

- **SOURCE PRINCIPLE:** Responsive `srcset`, distinct viewport assets, and inline native video show intentional delivery rather than simple scaling. **OBSERVED / TECHNICALLY CONFIRMED.**
- **BLOWIN' SMOKE APPLICATION:** Author hero crops by viewport and define role-specific media for product recognition, material proof, scale, compatibility, editorial context, and motion alternatives.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — packaging and factual detail; Vape & Nicotine — device scale and interfaces; Glass & Accessories — silhouette, material, and connection detail.
- **DO NOT COPY:** Glossier's responsive crops, asset ratios, campaign imagery, CDN pattern, or beauty-product staging.

## 17.8 Customer-controlled media

- **SOURCE PRINCIPLE:** Announcement and hero motion provide manual pause; hero sound begins muted and can be enabled. **OBSERVED / TECHNICALLY CONFIRMED.**
- **BLOWIN' SMOKE APPLICATION:** Give customers direct control over motion and sound and provide reduced-motion alternatives without diminishing content access.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — accessible education; Vape & Nicotine — accessible demos; Glass & Accessories — accessible craft/process media.
- **DO NOT COPY:** Control icons, labels, placement, video treatment, or campaign sound design.

---

# 18. Glossier-Specific Elements That Must Not Be Copied

## Identity and trade dress

- Signature pink/neutral palette, beauty-brand minimalism, wordmark behavior, centered-logo composition, type choices, case patterns, iconography, and the combined appearance of its header.
- Card proportions, whitespace ratios, sharp black/white CTA treatment, sticker-like badges, category-tile composition, and image hierarchy as a recognizable package.
- Mega-menu visual composition, featured-image placement, search-overlay geometry, cart-drawer geometry, and modal presentation.

## Content and merchandising

- Cosmetics taxonomy, shade/beauty variant conventions, routine framing, “Get the Look,” “Mix + Match,” “Choose your own adventure,” Glossier campaign names, or its promotional-gift logic.
- Beauty-editorial photography, skin-centric crops, campaign props, city-story concepts, product staging, and motion media.
- Glossier's conversational cadence, CTA language, promotional copy, scarcity patterns, and badge vocabulary.

## Behavior as signature

- Exact hover swap, opacity treatment, underline, drawer direction, fade choreography, carousel pacing, autoplay interval, control placement, or modal trigger.
- Any unverified mechanism such as safe-triangle logic, animation libraries, breakpoints, or Imgix engine assumptions.

## False alternatives for Blowin' Smoke

Avoid replacing Glossier's trade dress with generic “smoke-shop rebellion”: black-and-red aggression, graffiti clichés, haze overlays, glitch effects, faux protest graphics, forced slang, hostile errors, or constant use of “Who Wants That Smoke?” Conviction must be demonstrated through independent selection, real knowledge, cultural relationships, positions, and performance.

---

# 19. Blowin' Smoke Homepage Interaction DNA

## 19.1 Challenge → proof → action

- **SOURCE PRINCIPLE:** Glossier's hero pairs a focused proposition with controlled media and one CTA; its editorial modules remain commercially connected. **OBSERVED.** Blowin' Smoke requires substance behind brand attitude.
- **BLOWIN' SMOKE APPLICATION:** Use one high-conviction hero statement, then immediately prove it through a product standard, independent story, uncommon edit, or operator insight before presenting one clear action. Use “Who Wants That Smoke?” only when the surrounding evidence preserves its meaning as a challenge.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — proof through selection standards and documentation; Vape & Nicotine — proof through knowledge and compatibility; Glass & Accessories — proof through makers, material, and craft.
- **DO NOT COPY:** Glossier's video concept, black/white CTA, campaign phrasing, hero composition, or beauty-editorial restraint.

## 19.2 Three-division orientation

- **SOURCE PRINCIPLE:** Glossier keeps durable taxonomy separate from temporary campaigns and exposes categories persistently. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Make THCA, Vape & Nicotine, and Glass & Accessories the stable first-level commerce architecture across header, search, mobile navigation, mixed assortments, and product cards.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — clear regulated-product path; Vape & Nicotine — device/consumable separation; Glass & Accessories — function/material/compatibility path.
- **DO NOT COPY:** Glossier's category labels, number of columns, menu imagery, or campaign/category mixing formula.

## 19.3 Discovery without obscurity

- **SOURCE PRINCIPLE:** Glossier uses curated products and editorial routes to make a large catalog feel edited. **OBSERVED.** Blowin' Smoke prioritizes discovery over familiarity and respect over manipulation.
- **BLOWIN' SMOKE APPLICATION:** Surface independent finds, staff rationale, maker stories, and useful field knowledge while keeping prices, restrictions, availability, and destinations explicit.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — uncommon products with factual rationale; Vape & Nicotine — informed device/consumable edits; Glass & Accessories — makers and functional pieces.
- **DO NOT COPY:** Artificial exclusivity, beauty-style drops, hidden information, novelty-gift campaigns, or manufactured scarcity.

## 19.4 State-aware product behavior

- **SOURCE PRINCIPLE:** Product cards expose variants and change their next action according to readiness; add success opens the bag drawer. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Synchronize selected option, image, price, factual attributes, eligibility, stock, URL, and CTA. Open a cart confirmation layer only after a valid add; preserve the customer's browsing position.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — option/eligibility coherence; Vape & Nicotine — compatibility coherence; Glass & Accessories — size/connection coherence.
- **DO NOT COPY:** Cosmetic radio styling, Glossier card layout, CTA vocabulary, drawer geometry, or motion timing.

## 19.5 Useful hover, equivalent focus

- **SOURCE PRINCIPLE:** Hover states reveal alternate media or restrained emphasis rather than dramatic transformation. **OBSERVED / INFERRED.**
- **BLOWIN' SMOKE APPLICATION:** Use hover to reveal scale, angle, material, package contents, or connection detail. Provide the same information through focus, explicit controls, or touch interaction; never hide required facts behind hover.
- **PRIORITY:** Supporting
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — package/detail view; Vape & Nicotine — ports, controls, and included items; Glass & Accessories — angle, texture, scale, and joint detail.
- **DO NOT COPY:** Glossier lifestyle swaps, elevation, opacity, crop choices, or focus appearance.

## 19.6 Layered utilities with disciplined interruption

- **SOURCE PRINCIPLE:** Search uses an overlay, cart uses a drawer, and email acquisition uses a modal. **OBSERVED.**
- **BLOWIN' SMOKE APPLICATION:** Match layer type to task: overlay for focused search, drawer for reversible cart confirmation, modal only for necessary or explicitly valuable interruptions. Acquisition should be permission-based and frequency-capped.
- **PRIORITY:** Supporting
- **CONFIDENCE:** Medium
- **DIVISION IMPACT:** THCA — focused discovery and eligibility-aware cart; Vape & Nicotine — compatibility-aware search/cart; Glass & Accessories — dimension/material search and retained browsing context.
- **DO NOT COPY:** Glossier overlay coverage, cart slide treatment, email trigger depth, scrim, dismissal copy, or acquisition cadence.

## 19.7 Restrained, accessible motion

- **SOURCE PRINCIPLE:** Motion is function-specific and user controls exist for autoplay. **OBSERVED / TECHNICALLY CONFIRMED.**
- **BLOWIN' SMOKE APPLICATION:** Use a small semantic motion vocabulary, pause controls, muted defaults, reduced-motion alternatives, stable layout, and no critical information conveyed only through animation.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — legible facts and education; Vape & Nicotine — demos and state feedback; Glass & Accessories — craft/media detail.
- **DO NOT COPY:** Exact motion values, effects, control visuals, video behavior as brand signature, or unconfirmed libraries.

## 19.8 Culture through evidence

- **SOURCE PRINCIPLE:** Glossier integrates campaign narrative with commerce. **OBSERVED.** Blowin' Smoke requires culture over corporate imitation and firsthand credibility.
- **BLOWIN' SMOKE APPLICATION:** Build editorial interactions around the operator's real history, independent judgment, customers and collaborators with consent, builders, activists, entrepreneurs, makers, and products that earned their place. Every story must connect to a real position or customer value.
- **PRIORITY:** Core
- **CONFIDENCE:** High
- **DIVISION IMPACT:** THCA — standards and advocacy context where appropriate; Vape & Nicotine — street-level product knowledge; Glass & Accessories — maker and craft ecosystems.
- **DO NOT COPY:** Beauty community mythology, Glossier campaign structure, borrowed street aesthetics, demographic caricature, or performative slang.

---

# 20. Blowin' Smoke Homepage Component Candidate List

The list below is a candidate system, not an implementation order or authorization to build. “Division impact” describes the content each component must support.

| Candidate | SOURCE PRINCIPLE | BLOWIN' SMOKE APPLICATION | PRIORITY | CONFIDENCE | DIVISION IMPACT | DO NOT COPY |
|---|---|---|---|---|---|---|
| Skip link | Glossier exposes a main-content skip route — **OBSERVED** | Provide a visible-on-focus skip route with a reliable main target | Core | High | THCA: full access; Vape & Nicotine: full access; Glass & Accessories: full access | Glossier focus styling or exact placement |
| Utility/eligibility bar | Announcement carousel surfaces transactional value — **OBSERVED / TECHNICALLY CONFIRMED** | Show one truthful, locally relevant shipping, eligibility, service, or promotion message with pause if rotating | Core | High | THCA: eligibility/shipping; Vape & Nicotine: eligibility/shipping; Glass & Accessories: shipping/service | Promo copy, gift strategy, fade timing, layout, or false urgency |
| Global header | Persistent centered brand with left categories and right utilities — **OBSERVED** | Keep brand, three divisions, search, account, and cart continuously understandable | Core | High | THCA: primary route; Vape & Nicotine: primary route; Glass & Accessories: primary route | Centered-logo trade dress, alignment formula, proportions, or icons |
| Division mega menu | Multi-column taxonomy plus featured editorial module — **OBSERVED** | Give each division durable subcategories, one guided route, education, and at most one current independent feature | Supporting | High | THCA: formats/education; Vape & Nicotine: device/consumable/compatibility; Glass & Accessories: function/material/makers | Cosmetics taxonomy, menu grid, featured-image treatment, or hover timing |
| Mobile division menu | Desktop taxonomy requires a smaller-viewport equivalent; exact Glossier behavior — **NOT DETERMINABLE** | Reveal one division subtree at a time; retain search and cart at the top level | Core | Medium | THCA: progressive categories; Vape & Nicotine: progressive categories; Glass & Accessories: progressive categories | Invented Glossier behavior or desktop-hover dependency |
| Dynamic campaign hero | Native controlled video — **TECHNICALLY CONFIRMED**; authored responsive images — **OBSERVED** | Support original static or controlled-motion campaigns with one proposition, proof, CTA, and accessible controls | Core | High | THCA: standard/story; Vape & Nicotine: product knowledge; Glass & Accessories: craft/maker | Glossier media, crops, black/white CTA, phrasing, or hero layout |
| Three-division gateway | Glossier uses visual category routes — **OBSERVED** | Present THCA, Vape & Nicotine, and Glass & Accessories as three equal, distinct entry points | Core | High | THCA: identity and path; Vape & Nicotine: identity and path; Glass & Accessories: identity and path | Category-card trade dress, beauty imagery, tile count beyond the necessary three |
| Section header | Short labels reset browsing context — **OBSERVED** | Use direct functional labels for commerce and stronger voice only for editorial chapters | Core | High | THCA: clear context; Vape & Nicotine: clear context; Glass & Accessories: clear context | All-caps convention, Glossier phrases, or decorative ambiguity |
| Product rail/grid | Curated “Shop All” row supports immediate browsing — **OBSERVED** | Present a small edited assortment with visible division labels and a route to broader results | Core | High | THCA: selected formats; Vape & Nicotine: selected devices/consumables; Glass & Accessories: selected pieces/tools | Glossier row density, carousel controls, card proportions, or assortment logic |
| Cross-division product card | Stable card grammar and state-aware actions — **OBSERVED** | Use common primitives with division-specific decision attributes and truthful actions | Core | High | THCA: composition/format; Vape & Nicotine: compatibility/capacity; Glass & Accessories: material/dimensions | Cosmetic card anatomy, swatches, badge visuals, or image staging |
| Variant/option control | Interactive card-level circles/radios — **OBSERVED** | Expose only simple resolved choices; route complex, regulated, or compatibility-dependent choices to fuller selection | Core | High | THCA: simple size/format; Vape & Nicotine: capacity/compatible options; Glass & Accessories: size/connection | Cosmetic circles, color logic, visual styling, or unverified state mechanics |
| Product proof link | Detail routes coexist with quick action — **OBSERVED** | Provide predictable access to lab documents, compatibility, materials, dimensions, included items, care, and restrictions | Core | High | THCA: lab/eligibility; Vape & Nicotine: compatibility/included items; Glass & Accessories: material/dimension/care | Glossier “See details” wording or placement |
| Contextual recommendation module | “Get the Look” connects editorial context to products — **OBSERVED** | Use Complete the Setup, Pairs With, or constitution-aligned rationale based on verified compatibility or use | Supporting | High | THCA: permitted complements; Vape & Nicotine: compatible components; Glass & Accessories: care/connection/accessories | “Get the Look,” beauty routine framing, three-tile layout, or campaign imagery |
| Independent-find module | Curated assortment demonstrates merchandising judgment — **OBSERVED** | Explain why an uncommon product, maker, or tool earned selection | Supporting | High | THCA: factual rationale; Vape & Nicotine: informed selection; Glass & Accessories: maker/craft rationale | Artificial exclusivity, Glossier badge language, or vague hype |
| Operator/maker story | Campaign modules connect narrative to commerce — **OBSERVED** | Feature real operator history, builders, activists, creators, or makers with consent and a substantive connection | Supporting | High | THCA: standards/independence; Vape & Nicotine: firsthand knowledge; Glass & Accessories: maker craft | Glossier campaign mythology, staged street culture, or exploitative storytelling |
| Search overlay | Full-width auto-focused search layer — **OBSERVED** | Search product, brand, division, format, compatibility, material, and allowed attributes; label division in results | Core | High | THCA: format/product search; Vape & Nicotine: device/compatibility search; Glass & Accessories: material/dimension search | Overlay geometry, fade, ranking, or focus behavior not verified |
| Cart drawer | Quick add opens a right-side drawer with scrim — **OBSERVED** | Confirm valid adds without losing page position; surface eligibility, compatibility, quantity, and recovery states | Core | High | THCA: eligibility state; Vape & Nicotine: compatibility state; Glass & Accessories: quantity/connection state | Drawer width, right-slide signature, scrim, copy, or timing |
| Availability capture | “Notify me” replaces unavailable purchase — **OBSERVED** | Offer permission-based email/SMS notification with clear consent and accurate state explanation | Supporting | High | THCA: launch/restock; Vape & Nicotine: restock; Glass & Accessories: limited maker restock | Glossier modal/form, scarcity language, cadence, or consent assumptions |
| Email acquisition modal | Scroll-triggered modal — **OBSERVED** | Use only if testing shows clear value; frequency-cap, delay appropriately, preserve easy dismissal, and never interrupt eligibility or purchase decisions | Optional | Experimental | THCA: education/updates; Vape & Nicotine: releases/restocks; Glass & Accessories: maker drops | Trigger depth, “No thanks,” scrim, geometry, or interruption strategy |
| Media controls | Pause and mute controls exist for dynamic media — **OBSERVED / TECHNICALLY CONFIRMED** | Standardize play/pause and sound controls, honor reduced motion, and provide static alternatives | Core | High | THCA: education video; Vape & Nicotine: demo video; Glass & Accessories: craft video | Iconography, lower-corner placement, control labels, or video art direction |
| Support/chat utility | Sticky Gorgias widget present — **OBSERVED / TECHNICALLY CONFIRMED** | Provide accessible human help without obscuring navigation, consent, cart, or mobile content | Supporting | Medium | THCA: product/eligibility help; Vape & Nicotine: compatibility help; Glass & Accessories: dimension/care help | Gorgias branding/presentation, placement, behavior, or vendor assumption |
| Trust/service closure | Transaction clarity — **OBSERVED**; footer implementation — **NOT DETERMINABLE** | Close with shipping, returns, support, accessibility, age/regulatory information, contact, and division routes | Core | High | THCA: regulation/documentation; Vape & Nicotine: restrictions/returns; Glass & Accessories: shipping/returns/care | Glossier footer structure, newsletter treatment, social layout, or fine-print styling |

## Final synthesis

Blowin' Smoke should combine **visual restraint** with **interaction richness**, but its restraint must frame conviction rather than polish away the edge. Premium hierarchy should make an independent point of view easier to understand. Motion should explain state and remain controllable. Product cards should react truthfully to eligibility, configuration, compatibility, availability, and cart state. The three divisions should share one grammar while presenting different evidence.

The governing emotional arc is:

**challenge → discovery → proof → confidence → connection**

The governing approval rule is the Constitution's Decision Test. Any major decision that feels generic, manipulative, culturally borrowed, unsupported, or cosmetically derivative should return to research—even if it appears visually refined.

The design DNA to carry forward is Glossier's discipline, not Glossier's appearance.
