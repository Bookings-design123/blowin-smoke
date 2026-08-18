# Blowin' Smoke — Commerce Admin Day-1 Activation Plan

**Phase:** COM-ADM-02A
**Status:** Activation plan complete; implementation, procurement, pilot, and launch not authorized
**Governing base:** `e914cc9feff8a78c5913bbb6f2ee4d68418bd657`
**Evidence access date:** 2026-08-17
**Production code changed:** No

## Purpose

COM-ADM-01 defines the vendor-neutral commerce authority. COM-ADM-02 defines a credible destination stack. This package adds a third, narrower decision: what must be built, provisioned, and enabled for one owner, fewer than 100 products, and one York location on Day 1.

The governing distinction is:

> **Designed is not the same as built, provisioned, enabled, or required at launch.**

Future capabilities remain designed and adapter-bounded. They do not create a current subscription, client application, integration, or hardware purchase until a documented operational trigger occurs.

## Opinionated Day-1 stack

```text
OWNER — IPHONE OR MAC/DESKTOP BROWSER
  | Auth0 Free: phishing-resistant passkey/WebAuthn authentication
  | two independent owner credentials/recovery keys
  | application-owned AdminDevice browser registration
  v
RESPONSIVE CUSTOM WEB ADMIN — VERCEL PRO
  | server-only command API; no browser database credentials
  v
NEON LAUNCH POSTGRESQL — CANONICAL AUTHORITY
  | exact inventory / money / prices / channels / costs / orders
  | transactional audit + outbox
  | PostgreSQL FTS + pg_trgm; no external search or cache
  |
  +-- private S3 quarantine / masters / evidence
  |     -> fixed validated public derivatives
  |     -> CloudFront OAC + responsive srcset / progressive MP4
  |
  +-- nightly encrypted pg_dump
        -> separately controlled S3 Object Lock archive

BASE TELEMETRY
  Vercel + Neon diagnostics
  Sentry Developer free: one liveness monitor + one aggregate ops pulse

OWNER SECURITY NOTIFICATIONS
  AWS SES from a durable canonical notification outbox
```

Day 1 has **three paid or metered core providers—Neon, Vercel, and AWS—plus the Auth0 Free identity tier and Sentry's free Developer monitoring tier**. Cloudflare Zero Trust, native Apple delivery, Cloudflare Images, Mux, paid Auth0, paid Sentry, QuickBooks, POS, and label hardware are not provisioned.

## Day-1 outcome

The owner can securely use one responsive Admin from iPhone and Mac/desktop to manage products, retail price, separately approved non-protected channel state, receiving, canonical inventory, media, evidence/COAs, availability, orders, suppliers, acquisition cost/COGS, margin inputs, audit history, and automatic website projections.

The requested wholesale reference-price and sensitive wholesale-visibility operations remain Day-1 business requirements but are **not silently enabled in the browser**. COM-ADM-01 requires an approved protected client for those commands. The later pilot remains blocked until either an accountable classification decision establishes an exact non-protected administrative field or an approved protected client exists. COM-ADM-02A does neither.

Routine operations do not require GitHub, Codex, code edits, deployments, or developer intervention. Source code, migrations, and releases remain engineering work; live commerce records do not.

## Package map

| Document | Responsibility |
|---|---|
| [01 — Day-1 operational requirements](01-day1-operational-requirements.md) | Fixed owner outcome, preserved invariants, client surfaces, and acceptance boundary |
| [02 — Provider and capability reduction](02-provider-and-capability-reduction.md) | Exact component classifications and build/provision/enable decisions |
| [03 — Day-1 security and authentication](03-day1-security-and-authentication.md) | Auth0 Free status, browser-device continuity, sessions, fresh authentication, recovery, and application-owned controls |
| [04 — Day-1 media and backup](04-day1-media-and-backup.md) | Consolidated S3 media path, basic derivatives/video, quarantine, backup, and recovery |
| [05 — Deferred capabilities and triggers](05-deferred-capabilities-and-activation-triggers.md) | Concrete operational activation conditions and preserved adapter contracts |
| [06 — Revised cost model](06-revised-cost-model.md) | Required floor, recommended budget, avoided cost, future full stack, and exclusions |
| [07 — Recommended stack and next gate](07-recommended-day1-stack-and-next-gate.md) | Final recommendation, risks, proof work, and bounded COM-ADM-03 gate |
| [Machine-readable registry](commerce-admin-day1-registry.json) | Structured classifications, activation states, costs, controls, triggers, and non-authorization |

## Non-negotiable boundaries

1. PostgreSQL remains the sole canonical commerce authority.
2. Every business mutation crosses a server-side command and authorization boundary.
3. Inventory uses an immutable ledger and exact quantity rules; oversell-sensitive work remains transactional.
4. Money remains integer minor units plus currency; binary floating point cannot own price or COGS truth.
5. Retail and wholesale are channel states over shared canonical products and stock, not duplicate catalogs.
6. Material mutation and required sensitive read audit cannot be replaced by provider logs.
7. Website/search views are rebuildable projections and cannot authorize a reservation, price, eligibility, or commitment.
8. Unknown, stale, revoked, unsupported, or inconsistent identity/device/resource state fails closed.
9. Media upload never means publish; original masters and evidence remain private and versioned.
10. Provider recovery plus an independent, tested logical copy is mandatory.
11. No Admin browser is approved for D3/D4 Private Wholesale protected content.

## Cost decision

| Model | Planning amount |
|---|---:|
| Absolute required monthly planning floor | **$24–$40/month** |
| Recommended Day-1 monthly budget | **$41–$85/month** |
| Direct monthly cost deferred or avoided versus COM-ADM-02 | **$167–$235/month** |
| Preserved future low-volume full-stack range | **$215–$365/month** |

These are workload ranges, not quotes. Neon and AWS have usage-based dimensions with no universal Blowin' Smoke minimum. Payment processing, legal/compliance work, development labor, customer communication providers, domains/public-storefront scope outside this package, and hardware are excluded.

## Completion ledger

`PASS` means the requirement is explicitly addressed and evidence-bounded in this package. The final three self-referential delivery rows are intentionally `DELIVERY-CONDITIONAL`; their authoritative result is the post-push delivery record because a commit cannot contain evidence of its own future push. If commit, push, or exact-SHA verification fails, COM-ADM-02A is incomplete.

| # | Required item | Status | Evidence |
|---:|---|---|---|
| 1 | Every named COM-ADM-02 component reevaluated | PASS | 02; registry |
| 2 | Every component receives exactly one classification | PASS | 02; registry |
| 3 | Day-1 operational outcome preserved without weakening protected wholesale | PASS — protected wholesale portion remains explicit `CLIENT_REQUIRED` launch blocker | 01; 07 |
| 4 | Routine operations require no GitHub/Codex/deployment/developer | PASS | 01 |
| 5 | Responsive Web Admin evaluated as primary | PASS | 01; 02 |
| 6 | Native iPhone Admin reevaluated | PASS | 02; 05 |
| 7 | Native Mac app reevaluated | PASS | 02; 05 |
| 8 | Auth0 reevaluated | PASS | 03 |
| 9 | Approved-device tooling reevaluated | PASS | 03 |
| 10 | S3 reevaluated | PASS | 04 |
| 11 | Cloudflare Images reevaluated | PASS | 04; 05 |
| 12 | Mux reevaluated | PASS | 04; 05 |
| 13 | Sentry reevaluated | PASS | 02; 05 |
| 14 | QuickBooks reevaluated | PASS | 02; 05 |
| 15 | POS reevaluated | PASS | 02; 05 |
| 16 | Barcode and labels reevaluated | PASS | 02; 05 |
| 17 | Reorder automation reevaluated | PASS | 02; 05 |
| 18 | Search and cache confirmed | PASS | 02 |
| 19 | Proportionate backup remains adequate | PASS | 04 |
| 20 | Revised cost calculated | PASS | 06 |
| 21 | Deferred-cost savings calculated | PASS | 06 |
| 22 | Every deferred capability has an operational trigger | PASS | 05; registry |
| 23 | Destination architecture remains preserved | PASS | 02; 05 |
| 24 | Production remains unauthorized | PASS | All documents; registry |
| 25 | Registry parses as valid JSON | PASS | Delivery validation condition |
| 26 | One delivery commit created | DELIVERY-CONDITIONAL | Resulting commit and final delivery record |
| 27 | Commit pushed directly to `origin/main` without force | DELIVERY-CONDITIONAL | Remote ref update and final delivery record |
| 28 | Post-push `origin/main` equals the resulting commit | DELIVERY-CONDITIONAL | Post-push fetch and final delivery record |

## Result

COM-ADM-02A is an activation and cost-control decision only. It creates no provider account, infrastructure, live database, credential, application, integration, hardware purchase, pilot, or launch authority. The next gate is **COM-ADM-03 — Day-1 Controlled Implementation Plan and Proof Specification**, bounded in document 07.
