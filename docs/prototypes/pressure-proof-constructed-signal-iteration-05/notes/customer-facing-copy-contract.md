# Iteration 05 Customer-Facing Copy Contract

**Status:** Package-local static-prototype contract  
**Implementation authorization:** Not granted

## Governing voice

The voice translates the independence, knowledge, respect, and curation standards in `docs/constitution/01-brand-philosophy.md` into customer-facing commerce language. It must be:

- direct;
- independent;
- concise;
- culturally credible;
- plainspoken;
- confident without pretending to know what is unknown.

The copy may carry conviction upstream. Consequential product, fit, restriction, error, cart, and recovery language stays literal and free of slang. Beautiful design is respect; clear language is part of that design.

## Prototype honesty

Each customer-facing surface contains this notice once, near the top:

> Fictional products, prices, inventory, relationships, and policies for design evaluation only.

Do not repeat “synthetic,” “prototype,” or “design study” across product names, media frames, headings, or state copy. Fictional records instead remain traceable through:

- `DEMO-` identifiers in `fixtures/customer-facing-catalog.json`;
- `data-synthetic="true"` on appropriate source elements where useful;
- the package README's global declaration;
- the single persistent surface notice.

The visible experience must remain honest without reading like an internal specification.

## Remove from visible copy

The following belong in package notes or source metadata, never customer-facing pages:

- “Synthetic media position”;
- “Media job”;
- “Must not imply”;
- “If absent”;
- “Essential notation retained”;
- “Notation removed”;
- “P0 / P1 / P2 / P3 / P4”;
- design rationale or anti-generic commentary;
- test-method prose;
- internal implementation boundaries;
- repeated statements that the page is a study;
- explanations of why a component was designed a certain way.

## Copy hierarchy

Customer-facing decision copy follows:

1. **Identity:** name the exact object or task.
2. **Selected context:** name the option, owned object, or affected cart line.
3. **State:** use the exact governed state label.
4. **Consequence:** say what can or cannot happen.
5. **Reason:** name the material fact or missing input.
6. **Recovery:** name the smallest useful next step.
7. **Action:** label the outcome, not enthusiasm.

This follows the state anatomy in `docs/system/05-visual-design-system.md`, Section 26, and the action rules in Section 21.

## State-language rules

| STATE | COPY DUTY | PROHIBITED SHORTCUT |
|---|---|---|
| Compatible | Name both exact endpoints and verified scope | “Works with most” or an unlabeled green check |
| Incompatible | Name endpoints, conflict, blocked consequence, and recovery | “Not recommended” when fit is known to fail |
| Conditionally compatible | Name every material condition or required intermediary | “Compatible” without the condition |
| Universal | Name the verified bounded class | Unqualified “universal” |
| Unknown / Unverified | Name what is missing and why it matters | “Should fit,” “likely,” or silence |
| Not supplied | Name the expected value/source gap when material | Treating absence as Not Applicable |
| Stale | Name the affected evidence and currentness problem | Presenting the prior value as current |
| Unavailable | Name the exact item/variant and valid recovery | Treating stock as restriction or fit |
| Restricted | Name the governed category of restriction and available support | Improvised legal advice or teasing commerce |
| Service error | Name the failed check, preserved context, and retry/support | Calling the customer ineligible |
| Changed | Name prior/current state and affected scope | Silent replacement or price update |
| Missing media | Preserve exact textual identity and facts | Substituting a similar product image |

Unknown remains non-affirmative under `docs/system/01-master-design-commerce-system.md`, Part XXIV, and `docs/system/03-data-model-catalog-schema.md`, Part XXV.

## Action language

Actions name the actual result:

- “Choose an option”;
- “Check compatibility”;
- “Enter measurements”;
- “View full cart”;
- “Continue shopping”;
- “Get fit help”;
- “Review changed price.”

Do not use generic enthusiasm, false readiness, urgency, or pressure around a blocked decision. Disabled styling never supplies the explanation alone; reason and enabled recovery remain adjacent.

## Surface voice map

### Home

- Use the most compressed and assertive house voice.
- “Who wants that smoke?” may appear once, in the opening only.
- State a direct house proposition, then move quickly to the three divisions.
- Do not repeat the same independence or trust claim in later sections.

### Vape & Nicotine division

- Lead with “I want / I own / I need.”
- Translate roles before introducing device taxonomy.
- Explain one consequential relationship in ordinary language.
- Do not use neon-tech, hacker, gamer, or wiring-diagram language.

### Shared Category

- Define the result set and active context briefly.
- Product names carry identity; facts enable comparison.
- Resolved records require little state copy.
- Consequential records name one material fact and one next action before deeper detail.

### Universal PDP

- Read as a product page first.
- Name the product, selected or missing option, demo price basis, availability, blocker, reason, recovery, and action without implementation commentary.
- Secondary evidence may be more technical after the purchase decision is understood.

### Fitted Component PDP

- Answer: what is this, what is the exact target, does it fit directly, why, is an adapter path possible, what remains unknown, and what happens next.
- Keep size, gender/type, angle, orientation, clearance, and intermediary language literal.
- Do not let a nominal-size match imply fit.

### Quick Cart

- Confirm or identify the add outcome.
- Name the highest-consequence issue and concise reason immediately before the two actions.
- Do not claim order validation or checkout readiness.

### Full Cart

- Use a humane review voice: exact line → state → reason → recovery.
- Keep eight distinct lines scannable without project-management terminology.
- Progression language is derived from the composed state.

## Editorial discipline

- Each section has one distinct job.
- Delete or combine any section that restates a prior proposition.
- Avoid corporate mission language, generic luxury language, stoner clichés, fake rebellion, filler, repeated “we show our work” language, and trust claims repeated on every page.
- Curation requires an explicit house reason; do not label an item “best seller” without a governed basis.
- Do not write health or effect claims, legal conclusions, age or destination rules, real proof, real compatibility, real maker provenance, real inventory, shipping promises, warranties, or performance claims.
- Bracketed language is limited to intentionally unresolved states such as “Exact revision unknown,” “Measurement not supplied,” “Price unavailable,” or “Verification required.”

## Copy QA gate

Before final evidence is approved, confirm:

- every surface has exactly one required notice;
- no visible internal design annotation remains;
- every state has a non-color text label;
- every blocker has a reason and enabled recovery;
- no Unknown language implies likely compatibility or eligibility;
- “Who wants that smoke?” appears no more than once and only on Home;
- no section repeats a prior section's job;
- all fictional records resolve to a `DEMO-` fixture;
- no copy creates real catalog, policy, proof, legal, operational, or compatibility truth;
- product, fit, cart, error, and support language remains upright, plain, and readable.

