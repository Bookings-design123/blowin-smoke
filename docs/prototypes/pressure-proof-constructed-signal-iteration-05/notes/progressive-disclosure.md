# Iteration 05 Progressive Disclosure Contract

**Status:** Static prototype behavior specification  
**Implementation authorization:** Not granted

## Governing rule

Progressive disclosure reduces visible burden without concealing the decision. Critical truth, blockers, reasons, and recovery remain available at every viewport. This follows `docs/system/01-master-design-commerce-system.md`, Part VI; `docs/system/04-page-by-page-architecture-specifications.md`, cross-page governing rule 4 and Contracts 13, 21, 29, and 30; and `docs/system/05-visual-design-system.md`, Section 24.

Native `<details>/<summary>` is preferred for this static study. A summary must:

- be understandable while closed;
- name the content and material state represented;
- contain no nested link, button, input, or other interactive control;
- provide a target-height hypothesis of at least 44 CSS pixels;
- retain visible keyboard focus;
- expose open/closed state through native semantics;
- preserve logical reading order when opened;
- keep its essential label and state meaningful in forced colors;
- avoid hiding a verdict, blocker, reason, or recovery.

No disclosure behavior in this package constitutes production keyboard, screen-reader, focus-management, zoom, or device certification.

## Universal PDP

### Default state: visible

- exact product identity;
- selected option or explicit missing selection;
- fictional/demo price basis;
- availability state;
- single primary blocker;
- concise reason;
- enabled recovery;
- derived commerce action;
- primary media or honest missing-media state.

### Secondary disclosure

- complete package contents;
- extended specification ledger;
- source and currentness details;
- dependency witness;
- additional support explanation.

The collapsed summary names the group and any material state, for example “Package contents — one external component required.” It must not imply that the product is ready merely because detail is closed.

## Fitted Component PDP

### Default state: visible

- exact component identity;
- exact owned target;
- direct verdict;
- concise reason;
- the decision-critical geometry that supports that reason;
- conditional adapter route;
- unresolved clearance;
- blocked purchase state;
- primary measurement recovery.

### Secondary disclosure

- full geometry table;
- detailed evidence record;
- tolerances;
- extended measurement method;
- connector-media plan;
- complete support handoff.

The verdict, reason, and recovery never collapse. The governing Fitted Component contract requires exact decision-critical geometry before the action; only extended records move into disclosure.

## Quick Cart

The default visible sequence is fixed:

> Exact line context → review boundary → highest issue → concise reason → View Full Cart / Continue shopping.

Supporting line details may scroll within the named middle region or disclose, but the highest issue and reason remain immediately before the fixed actions. Quick Cart contains no recommendation rail and makes no full-order-validation or checkout-readiness claim.

## Full Cart

### Default state: visible

- order-level statement;
- all eight exact line identities and state labels;
- a concise reason and direct recovery for each line;
- one expanded highest-consequence conflict;
- current total basis;
- blocked progression and reason;
- order-level recovery/support route.

### Secondary-line disclosure

Seven secondary issues may use semantic `<details>` rows. Their summaries retain exact line identity, state, and concise reason while closed. Expanded content may add evidence, prior/current state, relationship endpoints, or a longer recovery explanation without turning the cart into a dashboard.

Only one highest-consequence conflict is open by default. A state change may change which issue deserves default expansion, but the prototype does not implement revalidation logic.

## Compact-navigation disclosure

At 390 and 320, the Menu control may use `<details>/<summary>`. The closed state preserves visible house identity, named Search, named Cart, Menu, and current page/division. The open state exposes THCA, Vape & Nicotine, Glass & Accessories, Learn, Support, and any architecture-required utility without erasing the current-page label.

## Measured 390-pixel default heights

Percent change is calculated as `(Iteration 05 − Iteration 04) / Iteration 04 × 100`. A negative value is a shorter default document; a positive value is a taller one. Height alone is not a quality verdict: disclosure succeeds only when the decision remains visible, while upstream discovery may intentionally gain content when it improves customer orientation or realistic retail density.

| SURFACE | ITERATION 04 HEIGHT | ITERATION 05 HEIGHT | CHANGE | INTERPRETATION |
|---|---:|---:|---:|---|
| Home | 7,193 px | 6,736 px | **−6.35%** | Modest reduction after removing visible research commentary while retaining the complete house, division, curation, learning, and support sequence. |
| Vape & Nicotine division | 6,372 px | 6,861 px | **+7.67%** | Intentional discovery expansion, not a disclosure failure: the customer-job opening remains first and is followed by a more credible role taxonomy, one bounded relationship witness, lifecycle guidance, and identification help. |
| Shared Category | 7,683 px | 8,058 px | **+4.88%** | Intentional decision-support expansion: fuller retail results and consequence variation add useful comparison burden upstream rather than hiding it downstream. |
| Universal PDP | 6,042 px | 3,747 px | **−37.98%** | Material default-density reduction. Identity, selected state, price basis, availability, blocker, reason, recovery, action, and primary media remain outside disclosure. |
| Fitted Component PDP | 8,441 px | 3,383 px | **−59.92%** | Material default-density reduction. The exact endpoints, direct verdict, reason, conditional adapter route, unknown clearance, blocked purchase state, and primary measurement recovery remain visible. |
| Quick Cart | 844 px | 844 px | **0.00%** | Deliberately unchanged viewport height. Its task is containment and decision order, not document shortening. |
| Full Cart | 6,624 px | 2,976 px | **−55.07%** | Material default-density reduction. Eight line identities/states, concise reasons, one expanded highest conflict, total basis, blocked progression, and recovery remain scannable. |

The primary disclosure objective is therefore met on Universal PDP, Fitted PDP, and Full Cart. The division and category increases are explicitly not presented as reductions; they are bounded discovery expansions whose value must be judged by orientation, result realism, and section distinctness. A shorter page would still fail if identity, state, reason, recovery, total basis, or action were concealed.

## Implemented default and expanded states

- Universal PDP secondary `<details>` groups are closed by default. A committed 390-wide state capture opens all secondary details for inspection.
- Fitted Component PDP geometry/evidence disclosures are closed by default. A committed 390-wide state capture opens the geometry and evidence record.
- Full Cart keeps only the highest-consequence order summary open by default. The seven secondary line disclosures are closed, with identity, state, and concise reason retained in each summary. A committed 390-wide state capture opens a secondary line for comparison.
- Quick Cart does not depend on collapsed secondary content for its highest issue. Its fixed default order remains line context → review boundary → highest issue → reason → actions.
- Compact navigation has committed closed and open evidence at 390 and open evidence at 320, including the long-current-label and focus specimens.

## Evidence result and remaining boundary

The state evidence demonstrates the intended information split: opening secondary material does not replace the default verdict, reason, recovery, or commerce state. Native summaries contain no nested interactive controls and are written to remain meaningful while closed.

This is static design evidence only. It does not certify production screen-reader behavior, focus management, zoom/reflow, device touch behavior, or live state changes. Those remain implementation gates.
