# COM-ADM-02A — Recommended Day-1 Stack and Next Gate

**COM-ADM-02A status:** Complete activation decision
**Provider procurement:** Not authorized
**Production implementation / pilot / launch:** Not authorized

## 1. Final Day-1 recommendation

| Required category | Selected Day-1 direction | Failure if removed |
|---|---|---|
| Canonical database | Neon Launch PostgreSQL | No single transactional authority for inventory, exact pricing/cost, orders, audit, outbox, or recovery history |
| Admin/API/website execution | Vercel Pro responsive Web Admin + server-only modular-monolith command API | No approved commercial owner surface, server command boundary, managed release/rollback, or automatic website execution |
| Authentication | Auth0 Essentials with password + user-verifying roaming FIDO2 key, exact step-up, two keys, and offline recovery | No selected managed service currently establishes the required phishing-resistant MFA and factor-specific high-risk path at lower total risk |
| Device/session admission | Simplified application `AdminDevice` + revocable BFF session per browser | Unknown endpoint could receive Admin data or a lost browser could not be independently revoked |
| Security notification | Canonical notification outbox + AWS SES to a preverified owner security destination | Factor/device/recovery/security changes could occur without independent warning or delivery-failure evidence |
| Canonical media/evidence | Private S3 quarantine, GuardDuty result, application validation, immutable masters/versions | No safe iPhone/desktop intake, COA/evidence store, canonical original, or controlled publication path |
| Public derivative delivery | Fixed sanitized image set in private S3 + CloudFront OAC + responsive `srcset`; bounded automatic H.264/AAC remux and progressive MP4 | Public delivery would expose masters, add an unproved second cache, or lack bounded owner-operable ordinary media |
| Search | PostgreSQL FTS + `pg_trgm` | Owner/customer discovery would lack an adequate small-catalog retrieval path |
| Audit/projection | PostgreSQL append-only application audit + transactional outbox | Material changes and website synchronization could diverge or lose accountable evidence |
| Recovery | Neon seven-day history + nightly encrypted `pg_dump`/manifest to separately controlled S3 Object Lock + restore proof | One provider/control failure could destroy or render canonical state unrecoverable |
| Observability | Vercel/Neon diagnostics + Sentry Developer free alerts | Owner would operate blind or conflate runtime logs with business audit |
| Cost/supplier/reorder basics | Receipt supplier and exact cost layers, margin inputs, manual threshold, low-stock signal | COGS and future purchasing intelligence would begin with missing/untrustworthy history |

## 2. Minimum non-blind observability

Paid Sentry is not required, but proactive notice is.

- Emit structured Vercel runtime logs with correlation IDs and no secret/sensitive payload. Current Pro base retention is short, so these are immediate diagnostics only.
- Use Vercel built-in observability for invocation, error, deployment, and usage context.
- Use Neon UI metrics/logs for short-window database diagnosis; provider metrics are not business audit.
- Use Sentry Developer for **server/worker-only allowlisted exceptions**, owner email alerts, one public liveness monitor, and one aggregate operations/backup cron heartbeat.
- The continuous liveness endpoint tests Vercel/API availability without querying Neon, avoiding monitor-induced always-on database compute.
- The hourly idempotent operations pulse checks database reachability, outbox/dead-letter backlog, projection lag, backup freshness, and last reconciliation. It sends the cron check-in and reveals only an opaque result.
- Do not load a Sentry browser SDK, script, pixel, replay, or cross-origin resource on Admin paths. If client error state must be reported, the Admin posts a small allowlisted code to a same-origin first-party endpoint; the server decides whether to emit a minimized event. Collection-time allowlisting is required—downstream scrubbing is not the primary control. Exclude authorization, cookies, credentials, customer/order contents, COAs/evidence, private media, and protected-wholesale data.

Upgrade telemetry only under document 05's trigger.

## 3. Principal Day-1 risks and controls

| Risk | Mandatory proof/control before a later pilot |
|---|---|
| Browser registration is mistaken for hardware trust | State the limit; test copy/loss/revocation/session-generation behavior; never use it for protected-wholesale payload |
| Identity token becomes business authorization | Re-read canonical actor/device/capability/object state; use command-bound step-up; deny provider-role-only authority |
| Concurrent orders oversell | Prove locking/isolation, exact position/version, idempotency, reservations, expiry/release, commitment, and reconciliation |
| Retry/timeout creates duplicate/partial mutation | One transaction, stable idempotency result, atomic audit/outbox, forced-failure and replay tests |
| Website projection is stale | Expose lag/failure, retry idempotently, reconcile, and reread canonical state for final operation |
| Uploaded media bypasses quarantine | Single-object grant, checksum, malware result, parser/decode limits, metadata policy, immutable promotion, separate publish command |
| iPhone video is incompatible | In-Admin Most Compatible guidance; H.264/AAC validation and bounded automatic MP4 remux; unsupported upload safely stored/unpublished; trigger managed transcode on real repeated need |
| Video excludes customers | Manual transcript/caption workflow and meaningful-audio classification; missing/unreviewed required text blocks publication |
| Public unpublish remains cached | Immutable versioned delivery keys, canonical outbox, storefront-reference removal, public-copy disable/delete, exact CloudFront invalidation, visible propagation state, and stale-URL proof |
| Backup exists but is unusable | Direct `pg_dump`, checksum/manifest, independent credentials/retention, alert, clean restore, invariant/audit/outbox reconciliation |
| Free telemetry misses material failure | Liveness + operations pulse + owner alert; activate paid tier when limits/diagnosis fail; canonical audit remains durable |
| COGS/accounting drift | Canonical receipt cost layers and immutable history; labeled operational margin; later accountant-approved idempotent export/integration |
| Deferred provider silently becomes necessary | Monitor trigger evidence and open a bounded activation decision; no calendar-driven procurement |
| Provider lock-in | Standard SQL/dumps, canonical S3 objects/manifests, HTTP contracts, adapter boundaries, provider alias mapping, exit/restore proof |

## 4. Day-1 proof matrix

COM-ADM-03 must define and later execute representative tests for:

### Identity and Admin

- owner bootstrap, two roaming keys, key loss, provider recovery, all-devices-lost recovery;
- iPhone and Mac browser enrollment, self-approval denial, unknown/pending/active/suspended/revoked states;
- exact factor-specific step-up, freshness, one-use command binding, replay, session fixation/rotation, and global revocation;
- provider/device/audit outage and fail-closed behavior;
- responsive touch, keyboard, screen reader, zoom, error, and recovery flows.

### Commerce truth

- exact money/quantity conversion and forbidden floating-point cases;
- concurrent receipt, adjustment, reservation, release, commitment, cancellation, and correction;
- retail price and approved non-protected channel state with immutable effective history; protected wholesale zero-payload/`CLIENT_REQUIRED` denial;
- supplier cost/lot/receipt, gross-margin input, manual low-stock, and order snapshot;
- material write + audit + outbox atomicity, idempotent delivery, lag, replay, and reconciliation;
- automatic website update without source/release action.

### Media/evidence

- iPhone/desktop multipart upload, interruption, expiry, wrong key/type/size/checksum, retry, and duplicate completion;
- clean/malicious/unsupported/spoofed/polyglot/decompression/metadata cases;
- immutable promotion/successor, rights/assignment/publication, COA applicability and revocation;
- fixed image variants, publication/unpublish/invalidation, and ordinary H.264/AAC capture/remux/playback; HEVC/ProRes remains unpublished unless normalized;
- meaningful-audio classification, manual transcript/caption review, missing-text denial, and accessible playback;
- exact master/evidence export and derivative rebuild.

### Recovery and operations

- Neon restore-history configuration and point-in-time recovery;
- nightly dump, direct connection, encryption, append-only archive authority, missing/late/corrupt job alert;
- clean independent restore and inventory/audit/outbox/migration reconciliation;
- liveness monitor without waking Neon; aggregate operations pulse and privacy-safe diagnostics;
- SES identity/sandbox exit, minimized security notice, provider acceptance, bounce/suppression/retry/failure, and owner receipt;
- provider quota, spend, outage, rollback, and exit behavior.

## 5. Decisions intentionally outside Day 1

- native iPhone or Mac applications;
- Cloudflare Access/WARP, App Attest, MDM, or managed endpoint attestation;
- specialist image SaaS or adaptive/4K video processing;
- external search or cache;
- paid telemetry;
- barcode camera workflow, label generation, printer/scanner procurement;
- physical POS interface or payment-terminal choice;
- QuickBooks subscription/integration;
- advanced reorder/forecasting;
- production Private Wholesale protected content.

Their destination contracts remain preserved in COM-ADM-01, COM-ADM-02, and document 05.

## 6. Exact next gate

# COM-ADM-03 — Day-1 Controlled Implementation Plan and Proof Specification

COM-ADM-03 may define, without deploying production:

1. provider account/region/configuration/procurement decision records for Neon, Vercel, Auth0, and AWS only;
2. schema, migration, server command, responsive Admin, and website-projection implementation plan mapped to COM-ADM-01;
3. transaction, exact arithmetic, reservation, audit/outbox, idempotency, reconciliation, and failure proof harnesses;
4. Auth0 roaming-key, `AdminDevice`, session, step-up, revocation, recovery, accessibility, and outage proof plan;
5. S3 quarantine/validation/promotion/delivery/revocation, fixed images, ordinary-video remux/captions, evidence, backup, restore, and provider-exit proof plan;
6. minimized observability, alert, privacy-scrubbing, incident, RPO/RTO, cost, and spend-control acceptance;
7. activation-interface stubs/contracts only where needed to prevent rearchitecture—no deferred provider provisioning;
8. a staged procurement recommendation requiring a later explicit owner authorization.

COM-ADM-03 must also return the unresolved wholesale-reference decision: either qualified policy classifies an exact administrative field as non-protected without exposing D3/D4 relationships, or the operation remains `CLIENT_REQUIRED` until a separately approved protected client exists. The Web Admin receives zero protected payload in either case.

It may not create production accounts/resources, live credentials, production application code, live catalog/inventory/media, pilot users, public launch, POS, accounting integration, native clients, or protected-wholesale delivery unless the owner gives separate explicit authority beyond this package.

## 7. Final state

| Result | State |
|---|---|
| COM-ADM-02A Day-1 activation decision | **COMPLETE** |
| Day-1 provider count | **5 — Neon, Vercel, Auth0, AWS, and Sentry Developer; 4 are paid/metered core providers** |
| Protected wholesale reference price / sensitive visibility | **DAY-1 REQUIRED; WEB ADMIN BLOCKED; `CLIENT_REQUIRED` pending classification or approved client** |
| Native iPhone Admin | **DEFER** |
| Auth0 | **KEEP** |
| Cloudflare Zero Trust | **DEFER** |
| Mux | **DEFER** |
| Sentry paid | **DEFER** |
| QuickBooks | **DEFER** |
| POS implementation | **DEFER** |
| Label hardware | **DEFER** |
| Advanced reorder | **DEFER** |
| Production code changed | **NO** |
| Production implementation authorized | **NO** |
| Pilot/launch established | **NO** |
