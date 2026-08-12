# Iteration 05 Typography Audition

**Status:** Provisional static-study decision; not production approval  
**Font assets:** No font files downloaded, copied, or committed  
**Rendered evidence:** Browser measurement and final visual inspection completed for the evidence environment

## Selection

Candidate A, the **Helvetica Neue system stack**, is the provisional selection for the seven customer-facing surfaces in this static prototype. It provides the best starting balance of assertive upstream scale, upright commerce readability, resilient mixed-case product identity, and quiet technical roles without tracing the Blowin’ Smoke logo.

This is not a production font lock. The measurements below describe one evidence environment only; production selection still requires licensed font decisions, platform and device coverage, glyph review, real-content stress, zoom and assistive testing, and final visual approval.

## Candidate A — Helvetica Neue system stack

- **Declared stack:** `"Helvetica Neue", Helvetica, Arial, sans-serif`
- **Study class:** `.type-a`
- **Provisional result:** Selected for the seven customer-facing surfaces
- **Strengths to test:** decisive short display lines; compact mixed-case headings; long product-name resilience; neutral body and control copy; clear price and specification rhythm.
- **Risks to inspect:** fallback to Helvetica or Arial; ordinary appearance at body sizes; overly compressed display treatment; synthetic weights that map to the same installed face.
- **Actual computed family:** `"Helvetica Neue", Helvetica, Arial, sans-serif`
- **Actual computed weight by role:** Home display `800`; division heading `800`; page heading `750`; product title `750`; section heading `750`; body `400`; option label `700`; price `700` after the final shared-CSS correction; specification data `400`; navigation `700`.
- **Fallback evidence:** `document.fonts.check` returned `true` for Helvetica Neue, Helvetica, and Arial in the evidence environment. This establishes availability only in that environment; it does not establish production availability or universal glyph-level resolution.

## Candidate B — Trebuchet system stack

- **Declared stack:** `"Trebuchet MS", Arial, sans-serif`
- **Study class:** `.type-b`
- **Provisional result:** Not selected
- **Strengths to test:** open counters, humane body texture, strong small-size legibility, visible distinction from generic neo-grotesque systems.
- **Reasons not selected provisionally:** its familiar humanist voice can soften the Home challenge, make product identity feel less exact, and create a more conventional web-retail tone across data-heavy surfaces.
- **Actual computed family:** `"Trebuchet MS", Arial, sans-serif`
- **Actual computed weight by role:** Not used to approve a production role system; Candidate A carries the measured role contract below.
- **Fallback evidence:** `document.fonts.check` returned `true` for Trebuchet MS and Arial in the evidence environment. This does not establish availability elsewhere.

## Candidate C — Georgia system stack

- **Declared stack:** `Georgia, "Times New Roman", serif`
- **Study class:** `.type-c`
- **Provisional result:** Not selected
- **Strengths to test:** authored editorial tone, durable paragraph reading, clear mixed-case distinction, strong long-form texture.
- **Reasons not selected provisionally:** using it as the primary family risks museum-catalog or prestige-editorial resemblance, weakens the direct division opening, and separates product and technical roles more than this unified storefront needs.
- **Actual computed display family:** `Georgia, "Times New Roman", serif`
- **Actual computed body family:** `Arial, Helvetica, sans-serif`
- **Actual computed data family:** `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- **Actual computed weight by role:** Not used to approve a production role system; Candidate A carries the measured role contract below.
- **Fallback evidence:** `document.fonts.check` returned `true` for Georgia and the generic monospace request in the evidence environment. This does not establish availability elsewhere.

## Declared role contract

| Role | Required sample | Declared treatment | Governing boundary |
|---|---|---|---|
| Display | Home proposition | Candidate family, weight `800`, tight display tracking | Home only |
| Division opening | Short direct division proposition | Candidate family, weight `800`, tight display tracking | Vape & Nicotine opening only |
| Page heading | Mixed-case customer-facing heading | Candidate family, weight `750`, upright | No campaign scale downstream |
| Product identity | Long exact product name | Candidate family, weight `750`, upright, resilient wrapping | Product, fit, and cart identity |
| Section heading | Customer-job or decision heading | Candidate family, weight `750` | Section structure, not decoration |
| Body | Explanatory customer copy | Candidate family, nominal weight `400` | Plain-language reading |
| Option label | Exact selectable configuration | Candidate family, weight `700`, compact | Must remain legible when long |
| Price | Current or from-price basis | Shared system-monospace data stack, weight `700`, tabular numerals | Never promotional display |
| Specification value | Exact identifier, unit, or endpoint | Shared system-monospace data stack, nominal weight `400` | Quiet and unambiguous |
| Error / recovery microcopy | State, reason, and next step | Candidate family, nominal weight `400`, upright | No slang, display type, or campaign tone |

The system-monospace data stack is shared across all three candidates so the audition tests the customer-facing family without turning numerical and endpoint data into a separate stylistic competition.

## Final browser evidence

The rendered-evidence pass queried the elements carrying `data-type-candidate` and `data-type-role` in `studies/09-typography-audition.html`.

| Measured item | Evidence-environment result |
|---|---|
| Candidate A computed family | `"Helvetica Neue", Helvetica, Arial, sans-serif` |
| Candidate B computed family | `"Trebuchet MS", Arial, sans-serif` |
| Candidate C display family | `Georgia, "Times New Roman", serif` |
| Candidate C body family | `Arial, Helvetica, sans-serif` |
| Shared data family | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |
| Candidate A Home display weight | `800` |
| Candidate A division-heading weight | `800` |
| Candidate A page-heading weight | `750` |
| Candidate A product-title weight | `750` |
| Candidate A section-heading weight | `750` |
| Candidate A body weight | `400` |
| Candidate A option-label weight | `700` |
| Candidate A price weight | `700` after final shared-CSS correction |
| Candidate A specification-data weight | `400` |
| Candidate A navigation weight | `700` |

`document.fonts.check` returned `true` for Helvetica Neue, Helvetica, Arial, Trebuchet MS, Georgia, and monospace in the evidence environment. That result is environment-specific and is not a production font-availability guarantee.

Visible clipping and horizontal-overflow behavior is verified through the final rendered evidence and geometry inspection, not inferred from the font-availability checks. The final evaluation should cite those render results separately from this family and weight record.

Candidate A is selected only for this static prototype. No candidate is production-approved by this audition.
