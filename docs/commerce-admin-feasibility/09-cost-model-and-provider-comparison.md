# COM-ADM-02 — Cost Model and Provider Comparison

**Pricing evidence date:** 2026-08-17  
**Currency:** USD unless a provider explicitly bills otherwise  
**Estimate class:** Planning range, not quote  
**Production implementation:** Not authorized

## 1. Modeled launch profile

The cost model assumes:

- one owner/admin and one York, Pennsylvania inventory location;
- fewer than 100 products and typically one active batch per product;
- low initial order/PO/receiving volume;
- responsive web Admin, a thin iPhone companion, and a Mac installed web surface;
- private high-resolution image masters, public-safe image derivatives, and a modest 4K video library;
- approximately 100–250 GB of canonical media at low volume;
- approximately 100–600 retained encoded video minutes with modest playback at low volume;
- managed database/API/auth/device gate/backups/telemetry;
- QuickBooks Online Essentials;
- no production protected-wholesale media delivery, multi-region active-active system, 24/7 support contract, or external search/cache cluster.

Development labor, tax/legal/compliance work, business insurance, customer email/SMS, domains, storefront/CDN outside this Admin scope, payment processing, merchant reserves, shipping/tax/age vendors, and hardware already owned are excluded.

## 2. Recommended-stack recurring cost

| Component | Provider / plan | Cost evidence | Low-volume planning amount | Cost class |
|---|---|---:|---:|---|
| Transactional database | Neon Launch PostgreSQL | Usage-based; official typical intermittent-load example about **$15/month** | $15–35 | Required, usage-based |
| Admin/API hosting | Vercel Pro | **$20/month**, including usage credit | $20–40 | Required, fixed + usage |
| Identity/MFA | Auth0 Essentials | **$35/month**, up to 500 MAU | $35 | Required, fixed |
| Web/Mac device edge gate | Cloudflare Zero Trust pay-as-you-go | **$7/user/month** listed; verify billing minimum | $7 | Required, fixed assumption |
| iPhone distribution | Apple Developer Program | **$99/year** | $8.25 monthly equivalent | Required annual |
| Canonical media + archive | Amazon S3, GuardDuty Malware Protection, KMS/requests as configured | Multi-dimensional; exact regional bill **PRICE NOT VERIFIED** | $5–25 planning allowance | Required, usage-based |
| Image derivatives | Cloudflare Images | Hosted pricing starts at **$5/100,000 stored images/month** and **$1/100,000 delivered images** | $5–15 | Required, usage-based |
| 4K derivatives/streaming | Mux pay-as-you-go | Published starting rates include about **$0.0096/stored 4K minute-month** and **$0.0032/delivered 4K minute**; workload dimensions vary | $1–35 | Required when 4K is used |
| Search | PostgreSQL FTS + `pg_trgm` | No separate vendor charge | $0 incremental | Included |
| Cache | None external at launch | No separate vendor | $0 | Included |
| Canonical audit/outbox | PostgreSQL transaction | Included in database workload | $0 incremental | Included |
| Independent audit/backup archive | Separate-account S3 Object Lock | No Object Lock feature fee; storage/requests/transfer apply; exact bill **PRICE NOT VERIFIED** | $1–10 planning allowance | Required, usage-based |
| Observability | Sentry Team | **$26/month** | $26–50 | Required, fixed + usage |
| Accounting | QuickBooks Online Essentials | **$85/month** regular price | $85 | Required, fixed |
| Apple Business built-in MDM | Apple Business | **$0** base service | $0 | Required operating control |

### Expected low-volume monthly total

**$215–$365/month**, including annual Apple membership as a monthly equivalent.

The lower end represents the stated small catalog and modest media/playback. The upper end provides headroom for 4K delivery, database/serverless overage, malware scanning, telemetry, and independent backups. It is not a promise or spending cap.

### Expected moderate-growth monthly total

**$400–$950/month**.

This range assumes increased orders, media storage/delivery, 4K transcode/playback, database compute/history, function usage, telemetry, backup retention, and possible upgrade from QuickBooks Essentials to Plus. Auth/device cost remains small while the operator count remains low.

## 3. Required fixed, usage, optional, and one-time costs

### Required fixed or minimum recurring

- Vercel Pro: $20/month.
- Auth0 Essentials: $35/month.
- Cloudflare Zero Trust: modeled at $7/month for one user; billing minimum to verify.
- Sentry Team: $26/month.
- QuickBooks Online Essentials: $85/month.
- Apple Developer Program: $99/year.
- Cloudflare Images: modeled from its published hosted-image billing unit.

### Required usage-based

- Neon compute/storage/history above included behavior;
- S3 master/quarantine/archive storage, requests, scans, keys, and transfer;
- Mux ingest/storage/transcoding/delivery dimensions;
- Cloudflare image delivery/transformation volume;
- Vercel/Sentry usage above allowances.

### Optional later

- QuickBooks Plus: $140/month regular price if the accountant requires its extra inventory/PO functionality without making it canonical;
- Mux DRM: published current base **$100/month** plus license charges; not included and not a protected-client substitute;
- Algolia Grow: likely $0 within its published included launch quota, but unnecessary at under 100 products;
- advanced MDM/ACME/device-attestation integration, paid support, higher database/hosting tiers, managed incident response, or a native Mac client;
- dedicated barcode scanner and additional POS peripherals.

### One-time hardware

| Item | Evidence / allowance | Status |
|---|---:|---|
| Two Yubico Security Key C NFC devices | **$58** before tax/shipping | Recommended daily + sealed recovery key |
| Brother QL-1110NWB label printer candidate | **$334.99** before tax/shipping | Viable candidate; procurement waits for label test |
| Zebra ZD421-class configured printer | **PRICE NOT VERIFIED** | Recommended benchmark; obtain quote |
| Receipt printer, cash drawer, payment terminal, dedicated scanner | **PRICE NOT VERIFIED** | Blocked pending POS/peripheral and merchant decisions |
| iPhone and Mac | Excluded; existing-device assumption | Must still be managed and explicitly approved |

## 4. Cross-category decision matrix

| Category | Recommended | Main alternative(s) | Why not selected |
|---|---|---|---|
| Transactional database | Neon Launch PostgreSQL | Supabase Pro; Render PostgreSQL; cloud-managed PostgreSQL | Neon preserves standard PostgreSQL with low operations and strong small-load economics. Alternatives add coupled BaaS behavior, incomplete verified price, or greater baseline operations |
| Backend/API/deployment | Vercel Pro server-only TypeScript command API | Cloudflare Workers; Render Web Service | Vercel has a mature managed Node path and rollback. Workers needs transaction/driver runtime proof; Render complete current compute price was not established |
| Identity | Auth0 Essentials | WorkOS AuthKit; Clerk Pro | Auth0 has clearer roaming security-key MFA, native/web passkey support, explicit step-up, and documented credential-export path. WorkOS custom domain raises practical cost; Clerk convenience reverification can downgrade required assurance unless replaced |
| Approved-device gate | App `AdminDevice` registry + Cloudflare Access/WARP + iPhone App Attest | MDM attestation/mTLS later | No single vendor signal is sufficient. Launch layering is feasible; managed-device attestation integration remains unproven |
| Canonical object storage | Amazon S3 | Cloudflare R2; Supabase Storage | S3 best matches security/retention priority with versioning, Object Lock, replication, and malware-protection integration. R2 is cheaper/portable but lacks equivalent native controls; Supabase bytes are outside database backup and lack object versioning |
| Image derivatives | Cloudflare Images | Cloudinary | Cloudflare is economical and originals remain separate. Cloudinary offers a free tier, while reviewed paid DAM tiers are $99/$249 monthly before annual discounts and increase transformation/workflow lock-in |
| 4K video | Mux | Bunny Stream; Cloudflare Stream | Mux is the primary managed 4K choice. Bunny is a cost challenger requiring proof. Cloudflare Stream's documented output ceiling is 1080p |
| Search | PostgreSQL FTS + `pg_trgm` | Algolia Grow | Native search is adequate for under 100 products and removes synchronization/data exposure; Algolia remains a rebuildable growth option |
| Cache | No external cache | Upstash Redis later | Adds stale-authority, credential, outage, and cost surface without demonstrated launch need |
| Audit/backup | Transactional PostgreSQL audit/outbox + separate-account encrypted S3 Object Lock export | Provider-only logs/backups | Provider logs are not business audit; same-provider backup is not sufficient exit/recovery evidence |
| Observability | Sentry Team | Better Stack Nano | Sentry has the lower month-to-month list price for the initial error/trace/job need; Better Stack's annual-equivalent Nano price is slightly lower and remains a credible broader telemetry alternative |
| Accounting | QuickBooks Online Essentials | Xero Growing; Zoho Books Professional; QBO Plus | QBO Essentials supplies the chosen US accounting destination while canonical Admin retains PO/inventory. Alternatives remain credible if accountant preference changes |
| POS | Custom canonical POS surface + replaceable terminal adapter | Square terminal/POS adapter | Generic POS inventory duplicates authority; actual merchant eligibility is unproven |

## 5. Significant-growth cost drivers

1. 4K stored and delivered minutes, DRM/license requests, and derivative count.
2. Canonical image/video bytes, malware-scanned upload volume, backup copies, retention, and restore egress.
3. PostgreSQL compute/history/storage and longer recovery windows.
4. API/function invocations, duration, data transfer, and background processing.
5. Observability events, traces, logs, uptime/cron monitors, and retention.
6. Additional admin identities, support tier, WARP/MDM endpoints, and application distribution.
7. Accounting plan/user upgrades and higher integration call volume.
8. POS locations, devices, receipts, labels, and payment processing/merchant risk pricing.
9. Legal/compliance, support coverage, and operational recovery obligations not priced as software seats.

Payment processing could materially exceed infrastructure cost and is excluded because the actual catalog has not been underwritten. No published general rate establishes approval or final pricing for Blowin' Smoke.

## 6. Price evidence and limitations

The detailed provider evidence, URLs, access dates, and claim limitations are recorded in documents 02–08. The price sources most directly governing this model are:

- Neon: https://neon.com/pricing
- Vercel: https://vercel.com/pricing
- Auth0: https://auth0.com/pricing?pm=true
- Cloudflare Zero Trust: https://www.cloudflare.com/plans/zero-trust-services/
- Apple Developer Program: https://developer.apple.com/programs/whats-included/
- Amazon S3: https://aws.amazon.com/s3/pricing/
- AWS GuardDuty: https://aws.amazon.com/guardduty/pricing/
- Cloudflare Images: https://developers.cloudflare.com/images/pricing/
- Mux: https://www.mux.com/pricing
- Sentry: https://sentry.io/pricing/
- QuickBooks: https://quickbooks.intuit.com/pricing/
- Yubico Security Key: https://www.yubico.com/product/security-key-series/security-key-nfc-by-yubico-black/
- Brother QL-1110NWB: https://www.brother-usa.com/p/desktop-label-printers/QL1110NWB

**WHAT THESE SOURCES ESTABLISH:** Published list prices, allowance dimensions, and product billing models on 2026-08-17.  
**WHAT THEY DO NOT ESTABLISH:** A quote, tax, regional total, future price, negotiated discount, exact workload, merchant underwriting, production fitness, or actual Blowin' Smoke invoice.

## 7. Procurement rule

Reprice every selected service, confirm terms/data region/support/limits, set spend alerts, model representative media traffic, and run exit/restore proofs before procurement. A planning range is not implementation or spending authorization.
