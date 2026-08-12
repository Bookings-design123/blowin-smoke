# Iteration 05.1 Typography Correction

**Decision:** Candidate A, the Archivo role system, is selected provisionally.  
**Production approval:** Not granted.

## Declared candidates

| CANDIDATE | DECLARED STACK | TESTED ROLES |
|---|---|---|
| A — provisional selection | `"Archivo", "Arial Narrow", Arial, sans-serif` for display; `"Archivo", Arial, "Helvetica Neue", sans-serif` for body/commerce | Home display and body; Universal PDP identity, option, price, and recovery |
| B | `"Helvetica Neue", Helvetica, Arial, sans-serif` | The same Home and Universal PDP roles |

No font file is downloaded, embedded, or committed. The browser's computed `font-family` string records the resolved CSS declaration, not proof that an installed Archivo or Helvetica Neue face was used. Browser fallback, substitution, and synthesis remain possible.

## Supported weight discipline

The entire package permits only:

- 400 — body and supporting copy;
- 600 — compact current markers and small route qualifiers;
- 700 — headings, product identity, navigation, labels, links, and price;
- 800 — display, wordmark text, primary controls, and terminal state emphasis.

Final source and computed-browser inventories contain only `400`, `600`, `700`, and `800`. There is no `500`, `650`, `750`, `850`, or other arbitrary value.

## Rendered comparison

### Home

Archivo creates clearer differentiation between the upstream assertion and normal-width retail/support copy. It reduces the smooth generic fashion/AI-agency tone seen in the Helvetica system while keeping the unmodified logo visually independent. The selection is based on the final rendered comparison, not computed CSS alone.

### Universal PDP

Archivo keeps the long mixed-case product name legible, distinguishes exact-option labels from the product identity, and lets monospace record data remain quiet. The decision panel stays commerce-readable rather than becoming a poster or technical document.

## Provisional selection

Candidate A is selected for Iteration 05.1 because it best supports:

- a distinctive but bounded Home display role;
- upright mixed-case product identity;
- clear customer controls and recovery;
- quiet technical/cart copy;
- separation from the logo rather than imitation of it.

## Remaining boundary

This pass does not prove font availability, licensing, glyph coverage, loading behavior, fallback metrics, browser/platform consistency, screen-reader behavior, zoom/reflow, or production performance. Final typography requires licensed assets or an approved platform strategy plus production testing.

