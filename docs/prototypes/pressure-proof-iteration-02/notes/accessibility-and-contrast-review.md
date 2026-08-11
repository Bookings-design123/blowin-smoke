# Iteration 02 Accessibility and Contrast Review

**Scope:** Static visual evidence only; this is not an accessibility-conformance claim.

## Rendering environment

- Browser surface: Codex in-app browser, local HTTP origin.
- Engine version: not exposed by the browser-control surface; no version is inferred.
- Device pixel ratio: `1`.
- Test canvases: `1440 × 900`, `390 × 844`, and `320 × 760` CSS pixels. They are evidence canvases, not production breakpoints.
- Exports: 14 pages at each canvas (42 PNGs) plus 12 required before/after boards.
- Inspection: every committed PNG was opened; 14 cross-canvas inspection sheets and the comparison boards were visually reviewed. Automated image checks confirmed expected page widths and no uniform/blank export.

## Font evidence

- Display computed family: `Archivo, "Arial Narrow", Arial, sans-serif`; computed weight `800`.
- Product-title computed family: `Archivo, Arial, "Helvetica Neue", sans-serif`; computed weight `700`; `46.8px` wide, `34px` at 390, and `30px` at 320.
- Interface/body computed family: `Archivo, Arial, "Helvetica Neue", sans-serif`; computed body weight `400`.
- Data computed family: `Archivo, Arial, "Helvetica Neue", sans-serif`; tabular numerals remain declared for price/data roles.
- Proof, compatibility, form, cart, and error copy inherit the interface/data stack rather than the condensed display fallback.
- `document.fonts.check()` returned `true` for Archivo at `400`, `500`, `600`, `700`, `800`, and `900`. The CSS uses only `400` (normal), `600`, `700`, and `800`; it uses no arbitrary `650`, `750`, or `850` values.
- No font binary is bundled or downloaded. The environment resolved the declared Archivo family; no fallback activation was observed. Glyph-level font-file identity was not exposed by the browser surface.

## Selected red approach

Approach **B** is selected: a near-black `#171717` Pressure field with observed logo red `#ED2925` limited to the unmodified logo and a non-text witness bar. The witness bar replaces the unsupported arc and marks the boundary between expressive brand pressure and quieter decision proof.

Observed logo red is an asset observation, not an approved interface token. It is not used for error copy, restriction copy, normal-size text, buttons, or semantic status fields. Error and incompatibility use contextual foreground/background/border families with labels and symbols, so brand red cannot be mistaken for a commerce state. Production red remains blocked by the authoritative brand package.

## Contrast calculations

Ratios use the WCAG relative-luminance formula with unrounded sRGB channel values.

| Use | Foreground / background | Ratio |
|---|---|---:|
| Body text | `#171717` / `#FAFAF8` | 17.155:1 |
| Secondary text | `#4D4A46` / `#FAFAF8` | 8.431:1 |
| Muted text | `#67635E` / `#FAFAF8` | 5.704:1 |
| Pressure-field text | `#FFFFFF` / `#171717` | 17.928:1 |
| Observed-red non-text bar | `#ED2925` / `#171717` | 4.221:1 |
| Observed-red asset against white | `#ED2925` / `#FFFFFF` | 4.247:1 |
| Light-surface focus | `#0065D8` / `#FFFFFF` | 5.450:1 |
| Canvas focus | `#0065D8` / `#FAFAF8` | 5.215:1 |
| Blue focus against Pressure | `#0065D8` / `#171717` | 3.289:1 |
| Inverse focus | `#78C8FF` / `#171717` | 9.821:1 |
| Generic success specimen | `#14532D` / `#EDF8F1` | 8.372:1 |
| Compatible | `#0F5B4E` / `#EAF8F5` | 7.326:1 |
| Warning / conditional / changed | `#704B00` / `#FFF7E0` | 7.284:1 |
| Incompatible | `#7A271A` / `#FFF2EE` | 8.997:1 |
| Service error | `#8E1B1B` / `#FFF1F1` | 8.225:1 |
| Restricted | `#5B2A86` / `#F7F1FC` | 8.934:1 |
| Unknown / unavailable / loading | `#374151` / `#F3F4F6` | 9.366:1 |
| Current Proof / information | `#0B4F6C` / `#ECF8FC` | 8.258:1 |
| Warning inline cue on canvas | `#704B00` / `#FAFAF8` | 7.455:1 |
| Incompatible inline cue on canvas | `#7A271A` / `#FAFAF8` | 9.422:1 |
| Unknown inline cue on canvas | `#374151` / `#FAFAF8` | 9.863:1 |
| Current Proof inline cue on canvas | `#0B4F6C` / `#FAFAF8` | 8.554:1 |
| Disabled copy | `#4D4A46` / `#F3F2EE` | 7.865:1 |

The observed red/white pairing is below 4.5:1 and is therefore not authorized for normal interface text. Its only text appearance is inside the unchanged, large-format source logo asset.

## Responsive and control observations

- `scrollWidth` equaled `clientWidth` on all 14 pages at all three canvases; no horizontal overflow was observed.
- Search remained visible and named “Search” on all 14 pages at 320.
- At 390 the Shared Category shows two compact, low-consequence browse cards while evidence cards occupy the full row. At 320 all cards collapse to one column.
- Quick Cart measured `695px` high within the `900px` wide canvas, `641px` high within the `844px` narrow canvas, and `537px` high within the `760px` 320 canvas; its bottom remained inside every viewport. The middle region is independently scrollable while both action controls remain visible.
- Consequential controls are represented with a minimum 44px target hypothesis; primary buttons/options use 48px. This is not a functional target-size audit.
- Card focus no longer adds a second `focus-within` perimeter; the focused link/control owns the single boundary. Inverse surfaces use the lighter focus alias.
- Selected, focused, disabled, blocked, incompatible, unavailable, Current Proof, and generic Success states use text/symbol/border differences in addition to color.
- Incompatible options remain fully readable and do not depend on line-through.
- Reduced-motion CSS eliminates nonessential animation/transition duration, and all required information exists in the static state.
- Forced-colors CSS separately represents focus, selected controls, Unknown dashed treatment, and status/evidence boundaries. A real forced-colors environment was not available for rendered verification.
- Controlled 200% and 400% browser zoom were not exposed by the browser capability. Narrow reflow is not represented as proof of zoom behavior.
- Functional focus containment, focus return, background inertness, assistive-technology reading, live target sizes, and real motion interruption remain implementation/testing gates.
