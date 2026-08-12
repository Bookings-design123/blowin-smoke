# Blowin' Smoke — Media and Brand Asset Manifest

**Scope:** Repository-local production-readiness audit  
**Rule:** File presence does not establish ownership, commercial usage rights, product identity, variant assignment, truth, or production suitability

## Inventory result

The repository contains **223 local binary media/font files**, all PNG: one actual brand-reference PNG and 222 prototype screenshots. It contains no local production product photography, production editorial photography, SVG/vector asset, JPG/JPEG, WebP, AVIF, GIF, video, PDF proof asset, or font binary.

External URLs, scraped images, Firecrawl references, competitor assets, customer-research imagery, and prototype screenshots are evidence only. They must not be downloaded, republished, assigned to products, or treated as proof of rights.

## Actual brand-reference asset

| Field | Repository finding | Status |
|---|---|---|
| Exact path | `docs/brand/assets/blowin-smoke-logo.png` | `VERIFIED` |
| File type | PNG, 8-bit RGBA, non-interlaced | `VERIFIED` |
| Dimensions | 8000 × 4500, 16:9 | `VERIFIED` |
| File size | 415,052 bytes | `VERIFIED` |
| Intended role | Full house identity at spacious Home/editorial scale | `PARTIAL` |
| Classification | Brand reference; not a prototype placeholder | `VERIFIED` |
| Production suitability | Not a routine web/header master; only suitable unmodified at generous scale while the source limitation is honored | `PARTIAL` |
| Alpha/transparency | Encoded RGBA but fully opaque; no transparent background | `MISSING` |
| Crop | Substantial white canvas; no tight production crop | `MISSING` |
| Usage rights | No repository ownership, trademark, commercial-use, or rights-chain record | `BLOCKED` |
| Vector master | None present | `MISSING` |
| Light/dark or one-color variants | None present | `MISSING` |
| Compact/header variant | None present | `MISSING` |
| Mobile variant | None present | `MISSING` |
| Favicon/app-icon variant | None present | `MISSING` |
| Social/open-graph variant | None present | `MISSING` |
| Production brand red | The raster sample near `#ED2925` is observational only; no authoritative token or contrast pair is approved | `BLOCKED` |

The documented constraint in `docs/system/05-visual-design-system.md` is controlling: white is internal to the lettering and surrounding forms, so automated background removal or chroma keying would damage the mark. The current PNG must not be cropped, redrawn, recolored, or processed by this gate.

### Brand supply required before production

1. Authoritative designer/vector master and rights/trademark record.
2. Tight transparent raster exports at governed densities.
3. Approved full, compact/header, mobile, one-color, reverse, light-surface, and dark-surface variants.
4. Favicon/app-icon and social/open-graph families.
5. Clear-space, minimum-size, background, co-branding, crop, and misuse rules.
6. Approved print/digital color specifications and profiles.
7. Standardized accessible text name and alt-text guidance.

## Prototype screenshot evidence

Every screenshot below is an internal static evaluation record containing synthetic or fictional content. None is production product, editorial, proof, or marketing media. Commercial reuse rights are not established.

| Exact path | Count | Dimensions present | Intended role | Classification | Production-suitable | Rights | Placeholder / supply consequence |
|---|---:|---|---|---|---|---|---|
| `docs/prototypes/pressure-proof/screenshots/` | 26 | Widths 390/1440; heights 2775–8754 | Static rendering evidence | Evidence | No | `BLOCKED` for commercial reuse | Prototype-only; replace synthetic media positions with approved real assets |
| `docs/prototypes/pressure-proof-iteration-02/screenshots/` | 54 | Widths 320/390/852/1440/1512; heights 1164–11897 | Responsive/comparison evidence | Evidence | No | `BLOCKED` for commercial reuse | Prototype-only; do not promote into runtime |
| `docs/prototypes/pressure-proof-art-direction-iteration-03/screenshots/` | 10 | Widths 390–1656; heights 2408–12353 | Art-direction comparison evidence | Evidence | No | `BLOCKED` for commercial reuse | Prototype-only |
| `docs/prototypes/pressure-proof-constructed-signal-iteration-04/screenshots/` | 33 | Widths 320–1450; heights 760–8643 | Page/state evaluation evidence | Evidence | No | `BLOCKED` for commercial reuse | Prototype-only |
| `docs/prototypes/pressure-proof-constructed-signal-iteration-05/screenshots/` | 40 | Widths 320–1450; heights 760–8210 | Page/state/comparison evidence | Evidence | No | `BLOCKED` for commercial reuse | Prototype-only |
| `docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/screenshots/` | 59 | Widths 320–1570; heights 490–7695 | Final static architecture/rendering evidence | Evidence | No | `BLOCKED` for commercial reuse | Closed prototype evidence; replace every synthetic media position |

**Screenshot total:** 222.

The prototype boundary is explicit in `docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/README.md`, `docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/decision-lock.md`, `docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/media-direction.md`, and `docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/notes/image-integrity.json`.

## External reference media

| Repository path | Reference type | Dimensions | Classification | Production-suitable | Rights / variants |
|---|---|---|---|---|---|
| `docs/research/glossier/homepage-firecrawl.md` | External competitor image URLs | Not determinable from repository-local metadata | Research evidence | No | Not established; no production variants |
| `docs/research/glossier/02-product-page-firecrawl.md` | External competitor image URLs | Not determinable | Research evidence | No | Not established |
| `docs/research/bay-smokes/01-homepage-firecrawl.md` | External competitor image URLs | Not determinable | Research evidence | No | Not established |
| `docs/research/bay-smokes/02-thca-smalls-pdp-firecrawl.md` | External competitor image URLs | Not determinable | Research evidence | No | Not established |
| `docs/research/vapordna/01-homepage-firecrawl.md` | External competitor image URLs | Not determinable | Research evidence | No | Not established |
| `docs/research/smoke-cartel/01-homepage-firecrawl.md` | External competitor image URLs | Not determinable | Research evidence | No | Not established |

## Product and editorial media readiness

| Required media family | Present? | Status | Minimum authoritative supply |
|---|---|---|---|
| Exact product/selected-variant identity | No | `MISSING` | Original or licensed product assets mapped to exact product and variant |
| Alternate angles and visible option differences | No | `MISSING` | Role-based shot set with exact assignment and capture metadata |
| Packaging and included contents | No | `MISSING` | Exact sellable configuration and contents imagery verified at receiving |
| Scale and decision-oriented context | No | `MISSING` | Authored scale references that do not substitute for structured measurements |
| Vape ports, interfaces, components, and lifecycle | No | `MISSING` | Exact model/revision/component images with manufacturer or original rights |
| Glass joints, orientation, measurements, clearance, and material | No | `MISSING` | Measurement-oriented receiving media and verified object assignment |
| THCA package/batch/proof context | No | `MISSING` | Exact package/variant/batch media and separately governed proof documents |
| Care, setup, and assembly | No | `MISSING` | Validated instructional assets with approved claims and accessibility |
| Maker/provenance editorial | No | `MISSING` | Permissioned maker/origin content with source and subject releases where applicable |
| House editorial photography | No | `MISSING` | Original, culturally credible, rights-cleared 16:9 and 4:5 authored compositions |

Each production asset requires the media metadata governed by `docs/system/03-data-model-catalog-schema.md`: identity, creator/source, permission record, capture date, role, exact subject/product/variant/batch assignment, alt text, caption, order, responsive-crop intent, status, and effective context.

## Typography asset readiness

No `.woff`, `.woff2`, `.ttf`, or `.otf` file exists in the repository. Archivo is a provisional design-test direction in `docs/system/06-high-fidelity-page-design-specifications.md`, not a production approval.

| Requirement | Status | Supply needed |
|---|---|---|
| Final type family and approved builds | `BLOCKED` | Brand/design owner approval |
| License and permitted web usage | `BLOCKED` | License record and approved distribution method |
| Font binaries/subsetting strategy | `MISSING` | Authorized source files after technical review |
| Axes, weights, widths, glyph coverage, fallbacks | `PARTIAL` | Exact test matrix and representative real content |
| Cross-platform rendering, zoom, high-contrast, and assistive tests | `PARTIAL` | Licensed builds, target browsers/devices, and real-media/content audition |

## Manifest conclusion

The repository has enough evidence to define an asset intake contract, but not to populate a real-media storefront or approve production brand delivery. A combined real-media and typography audition cannot begin until at least one rights-cleared, representative product-media set per intended product family and an authorized typography build are supplied.
