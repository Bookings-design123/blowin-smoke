# Blowin' Smoke — Commerce Admin Technology, Provider, and Implementation Feasibility

**Phase:** COM-ADM-02 recovery / execution pass  
**Status:** Feasibility complete; production implementation not authorized  
**Governing base:** `e241ce89520dc05fe3bf0f4aa9cf9f8df37aa9e2`  
**Evidence currency date:** 2026-08-17  
**Live provider accounts or infrastructure created:** No  
**Production code changed:** No  
**Pilot / launch:** Not authorized / not established

## Purpose

This package translates the vendor-neutral COM-ADM-01 architecture into one evidence-backed technology direction for the fixed owner profile: one owner, fewer than 100 products, one York location, web + iPhone + Mac administration, approved devices, strong MFA, high-resolution media and 4K video, barcode/labels, POS readiness, internal procurement/COGS, accounting integration, supplier-price history, and deterministic reorder intelligence.

The decision favors reliable managed commodity infrastructure and a custom Blowin' Smoke operational experience. It does not create accounts, deploy services, implement code, populate inventory, approve a payment provider, or weaken any security gate.

## Recommended stack at a glance

```text
OWNER ON APPROVED DEVICE
  | Auth0 phishing-resistant MFA + current step-up
  | Cloudflare Access/WARP (Web/Mac) or App Attest (native iPhone)
  | canonical AdminDevice admission
  v
CUSTOM BLOWIN' SMOKE ADMIN
  | responsive web primary
  | thin SwiftUI iPhone companion
  | Safari-installed Mac web app
  | custom online-first POS surface
  v
SERVER-ONLY TYPESCRIPT COMMAND API — VERCEL PRO
  v
NEON POSTGRESQL — CANONICAL COMMERCE AUTHORITY
  | exact inventory / price / PO / cost / order
  | transactional audit + outbox
  | PostgreSQL FTS + pg_trgm; no external cache
  |
  +-- private S3 masters -> Cloudflare Images / Mux derivatives
  +-- encrypted pg_dump + audit checkpoints -> separate S3 Object Lock
  +-- reconciled adapter -> QuickBooks Online Essentials
  +-- scrubbed operational telemetry -> Sentry Team
```

## Package map

| Document | Responsibility |
|---|---|
| [01 — Owner profile and criteria](01-owner-profile-and-evaluation-criteria.md) | Fixed inputs, weighted decision standard, governing boundaries, and unresolved authority |
| [02 — Database, backend, and API](02-database-backend-and-api-options.md) | Managed PostgreSQL/BaaS/cloud alternatives, API/hosting options, transaction fit, price, recovery, and exit |
| [03 — Auth, device security, and access](03-auth-device-security-and-admin-access.md) | Identity candidates, phishing-resistant MFA, canonical device admission, App Attest, WARP, recovery, and step-up |
| [04 — Media](04-media-storage-image-and-video-options.md) | Canonical object storage, upload quarantine, image derivatives, 4K video, security, backup, and provider alternatives |
| [05 — Search, cache, audit, backup, observability](05-search-cache-audit-backup-observability.md) | Native search, no-cache launch rule, transactional audit/outbox, independent recovery, and telemetry |
| [06 — Web, iPhone, and desktop](06-web-ios-desktop-admin-delivery-strategy.md) | Shared delivery strategy, native-device boundary, code/contract reuse, and deferred client choices |
| [07 — Barcode, labels, POS, and peripherals](07-barcode-label-pos-and-peripheral-strategy.md) | Identifier carriers, receiving/stocktake/POS workflows, printer candidates, same-authority POS, and payment gate |
| [08 — Accounting, COGS, supplier, and reorder](08-accounting-cogs-supplier-and-reorder-strategy.md) | Accounting candidates/integration, exact cost layers, supplier-price history, and phased deterministic reorder logic |
| [09 — Cost and provider comparison](09-cost-model-and-provider-comparison.md) | Fixed/usage/optional/hardware costs, low/moderate ranges, cross-category alternatives, and growth drivers |
| [10 — Recommendation, risks, and next gate](10-recommended-stack-risks-and-next-gate.md) | Final opinionated stack, alternatives not selected, risks, proof gates, and COM-ADM-03 boundary |
| [Machine-readable registry](commerce-admin-feasibility-registry.json) | Structured owner profile, candidates, statuses, stack, costs, strategies, gates, and non-authorization state |

## Governing decisions

1. **COM-ADM-01 remains authoritative.** Provider convenience cannot change canonical ownership, exact arithmetic, inventory invariants, transaction boundaries, correction lineage, or projection rules.
2. **PostgreSQL is the canonical operational authority.** Identity, media processors, search, cache, accounting, POS terminals, hosting, and telemetry remain bounded adapters or projections.
3. **Custom Admin does not mean custom commodity infrastructure.** Blowin' Smoke owns workflows, interfaces, domain commands, permissions, and state; managed services own database operation, identity, object storage, media processing, hosting, and telemetry within bounded contracts.
4. **The three client surfaces share one authority.** Web is the complete primary Admin, iPhone is a focused native companion, and Mac uses an installed web surface. There are not three independent rule engines.
5. **Approved-device admission is layered and application-owned.** Auth0, WARP, App Attest, and MDM are signals/controls; the canonical `AdminDevice` record and server command policy make the final decision.
6. **Media originals remain privately owned and exportable.** Uploads enter quarantine, pass validation/scanning, then immutable masters feed bounded derivative processors.
7. **Search and cache cannot authorize commerce.** Launch uses PostgreSQL-native search and no external cache; final operations reread canonical state.
8. **POS shares catalog, pricing, inventory, orders, and audit.** Payment is a replaceable later adapter subject to actual-catalog underwriting.
9. **Accounting is reconciled, not canonical commerce.** QuickBooks receives mapped financial postings; Admin retains supplier/PO/receipt/lot cost/inventory truth.
10. **Reorder begins with deterministic evidence.** Thresholds, velocity, days of supply, lead time, open POs, and commitments precede forecasting; no AI is added for appearance.
11. **Protected Wholesale remains separately blocked.** No browser, Admin client, signed URL, DRM, passkey, WARP, App Attest, or watermark decision in this package satisfies its protected-client release gate.

## Cost decision

| Model | Planning range |
|---|---:|
| Low-volume expected monthly | **$215–$365** |
| Moderate-growth monthly | **$400–$950** |

Ranges include the recommended managed database, hosting, identity, device edge, Apple membership equivalent, private media/derivatives, backups, observability, and QuickBooks Essentials under the documented assumptions. They exclude development, legal/compliance work, payment processing, merchant reserve/risk rates, shipping/tax/age services, and most hardware. Prices must be reverified before procurement.

## Evidence method

- Current provider capability and pricing research used official provider, platform, standards, or government sources accessed 2026-08-17.
- Every material provider conclusion records a source URL, what the source establishes, and what it does not establish.
- Documentation evidence does not prove a configured Blowin' Smoke system. Transaction, authorization, device, upload, restore, exit, accounting, peripheral, and failure behavior remain execution gates.
- When a current price could not be verified, the package says **PRICE NOT VERIFIED**. Planning allowances are labeled as estimates rather than provider prices.

## Completion ledger

`PASS` means the requirement is explicitly addressed and evidence-bounded in this package. The final three delivery rows are valid only when the delivery commit exists on `origin/main` and a post-push fetch resolves `origin/main` to that exact resulting SHA. If that condition fails, COM-ADM-02 is incomplete regardless of the table.

| # | Required item | Status | Governing evidence |
|---:|---|---|---|
| 1 | Live provider research completed | PASS | 02–09 evidence registers |
| 2 | Official pricing verified where available | PASS | 02–09; unverified prices explicitly marked |
| 3 | Database candidates compared | PASS | 02 |
| 4 | Backend/API candidates compared | PASS | 02 |
| 5 | Auth/MFA candidates compared | PASS | 03 |
| 6 | Approved-device strategy compared | PASS | 03 |
| 7 | Media storage candidates compared | PASS | 04 |
| 8 | Image-processing options compared | PASS | 04 |
| 9 | 4K video options compared | PASS | 04 |
| 10 | Search options compared | PASS | 05 |
| 11 | Cache strategy evaluated | PASS | 05 |
| 12 | Audit approach evaluated | PASS | 05 |
| 13 | Backup/recovery evaluated | PASS | 05 |
| 14 | Observability evaluated | PASS | 05 |
| 15 | Web Admin strategy defined | PASS | 06 |
| 16 | iPhone Admin strategy defined | PASS | 06 |
| 17 | Mac/desktop strategy defined | PASS | 06 |
| 18 | Barcode/QR strategy defined | PASS | 07 |
| 19 | Label-printing strategy defined | PASS | 07 |
| 20 | POS strategy defined | PASS | 07 |
| 21 | Accounting integration strategy defined | PASS | 08 |
| 22 | COGS architecture preserved | PASS | 08 |
| 23 | Supplier-price history preserved | PASS | 08 |
| 24 | Reorder intelligence strategy defined | PASS | 08 |
| 25 | Monthly cost model completed | PASS | 09 |
| 26 | One recommended stack selected | PASS | This README; 10; registry |
| 27 | Alternatives documented | PASS | 02–10 |
| 28 | Risks documented | PASS | 10 |
| 29 | Owner decisions separated from technology decisions | PASS | 01 |
| 30 | Production remains unauthorized | PASS | Every package document; registry |
| 31 | JSON validated | PASS | Registry; validation required before delivery |
| 32 | Commit created | PASS | Delivery verification condition |
| 33 | Commit pushed | PASS | Delivery verification condition |
| 34 | `origin/main` verified | PASS | Delivery verification condition |

## Phase result

| Result | State |
|---|---|
| COM-ADM-02 technology/provider feasibility | **COMPLETE** |
| Recommended stack | **SELECTED FOR LATER PROOF** |
| Production provider accounts | **NOT CREATED** |
| Production code | **NOT CREATED OR CHANGED** |
| Production implementation | **NOT AUTHORIZED** |
| Pilot | **NOT AUTHORIZED** |
| Launch readiness | **NOT ESTABLISHED** |

The exact next gate is **COM-ADM-03 — Controlled Implementation Plan and Proof Specification**, as bounded in document 10. That gate remains non-production unless the owner later provides separate explicit implementation authority.
