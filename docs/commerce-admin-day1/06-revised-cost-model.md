# COM-ADM-02A — Revised Day-1 Cost Model

**Pricing evidence date:** 2026-08-17
**Currency:** USD
**Estimate class:** Planning range, not quote
**Procurement:** Not authorized

## 1. Modeled profile

This model assumes one owner, fewer than 100 products, one York location, low order/receiving volume, responsive browser Admin, one canonical PostgreSQL database, private image/video/evidence storage, ordinary progressive video only, seven-day provider database history, one nightly database export, basic alerting, and no production protected-wholesale media.

Usage prices vary by region, bytes, requests, execution time, scan volume, transfer, retention, and provider policy. The lower bound is a small-load planning model, not a contractual minimum.

## 2. Absolute required monthly planning floor

| Component | Day-1 cost basis | Low-load planning amount |
|---|---|---:|
| Vercel Pro | Current commercial plan fee; includes one deploying seat and usage credit | $20 |
| Auth0 Essentials | Current plan price up to 500 MAU | $35 |
| Neon Launch | Metered, no contractual monthly minimum; small scale-to-zero workload model | Approximately $3–15 |
| AWS S3/GuardDuty/KMS/CloudFront/SES/backup runner and archive | Small initial media, low-volume security notices, and nightly logical backup; current allowances where eligible | Approximately $1–5 |
| Sentry Developer | One owner, 5,000 errors, one uptime and one cron monitor | $0 |
| PostgreSQL search/audit/outbox/low-stock | Included in database workload | $0 incremental |
| **Absolute required planning floor** | | **Approximately $59–$75/month** |

This is the lowest defensible operating model, not the recommended budget. A zero-dollar Neon or AWS invoice is not assumed merely because a service is metered or has free allowances.

The Neon lower-bound illustration assumes roughly 100 active hours at 0.25 CU, about 1 GB of database storage, scale-to-zero between work, and low restore-history volume: approximately $2.65 compute plus storage/history. It is deliberately labeled a model. The AWS lower bound assumes a small initial accepted-media footprint, low request/scan volume, current eligible allowances, and one small nightly dump; real retained/scanned bytes can move it above the floor.

## 3. Recommended Day-1 monthly budget

| Component | Recommended planning allowance | Why headroom exists |
|---|---:|---|
| Vercel Pro | $20 | Commercial plan fee; included credit is not counted twice |
| Auth0 Essentials | $35 | Fixed selected identity/MFA plan |
| Neon Launch | $15–35 | Official intermittent-load example near the low end; additional compute/storage/history headroom |
| AWS media, scanning, delivery, SES notices, KMS, runner, and independent archive | $6–30 | Bytes, scans, messages, requests, transfer, retention, and CDN eligibility vary; one provider, multiple bounded services |
| Sentry Developer | $0 | Narrow alert/diagnostic use within current free limits |
| **Recommended Day-1 budget** | **$76–$120/month** | Planning envelope before actual workload proof |

Set provider budgets/spend alerts and reprice immediately before any procurement decision.

## 4. Direct monthly cost deferred or avoided

The following were modeled as recurring components in COM-ADM-02 and are now unprovisioned:

| Deferred component | COM-ADM-02 monthly planning amount | Day-1 amount | Avoided/deferred |
|---|---:|---:|---:|
| Cloudflare Zero Trust/WARP | $7 COM-ADM-02 paid-plan assumption | $0 | $7 modeled-stack delta |
| Apple Developer Program | $99/year = $8.25 monthly equivalent | $0 | $8.25 |
| Cloudflare Images | $5–15 | $0 | $5–15 |
| Mux | $1–35 | $0 | $1–35 |
| Sentry Team | $26–50 | $0 | $26–50 |
| QuickBooks Online Essentials | $85 | $0 | $85 |
| **Direct recurring total deferred/avoided** | | | **$132.25–$200.25/month** |

Reported as a rounded planning range: **$132–$200/month**.

This is the reduction from COM-ADM-02's selected paid-plan model, not a guarantee of literal cash savings. Cloudflare currently also lists a free under-50-user tier; if that had replaced the earlier paid assumption, its one-owner marginal subscription could have been $0 and the comparable cash-avoidance range would be approximately **$125–$193/month**. The governing reported number remains the like-for-like COM-ADM-02 model delta.

No savings are claimed for PostgreSQL search or the absence of Redis because COM-ADM-02 already modeled them at $0. No recurring savings are invented for POS, native Mac, labels, scanners, or other unpriced work.

## 5. Future full-stack cost preserved

COM-ADM-02's destination planning range remains:

| Future state | Preserved range |
|---|---:|
| Low-volume destination stack | **$215–$365/month** |
| Moderate growth | **$400–$950/month** |

These are not Day-1 commitments. Future activation is component-by-component after the trigger and proof rules in document 05. The full stack is not purchased as a bundle.

## 6. Cost classes

### Fixed software subscription

- Vercel Pro: $20/month.
- Auth0 Essentials: $35/month.

### Usage-based infrastructure

- Neon compute, database storage, and restore history;
- S3 storage, requests, retrieval, inventory, retention, and transfer;
- GuardDuty bytes/objects scanned;
- KMS key/requests where configured;
- Lambda/container/Scheduler backup job;
- CloudFront requests/transfer or flat-rate plan eligibility;
- SES security-notification messages and outgoing data;
- Vercel compute/image/transfer beyond included credit.

### Free Day-1 service tier

- Sentry Developer within current one-user, error, uptime, cron, and retention limits.

Free is still a provider dependency requiring privacy-safe configuration, ownership, export/exit awareness, availability behavior, and an upgrade/disable decision.

### Annual memberships

- None required on Day 1.
- Apple Developer Program, currently $99/year, activates only with native Apple work.

### Hardware

- Existing iPhone and Mac/desktop are assumed and excluded.
- COM-ADM-02B supersedes the two-application-key assumption: one $29 Yubico Security Key C NFC is the selected application-user hardware, with a separate rotating offline recovery code. Reserve another $29 as a control-plane hardware contingency if proof requires a dedicated Auth0 tenant key. Reprice before purchase; no hardware procurement is authorized.
- Label printer, scanner, receipt printer, cash drawer, payment terminal, and POS peripherals are deferred. The former Brother candidate was $334.99 before tax/shipping; no hardware procurement is authorized.

## 7. Exclusions

The model excludes:

- development, QA, design, security testing, operations labor, and support;
- legal, tax, accounting-advice, privacy, product, age, destination, retention, and compliance work;
- payment processing, merchant underwriting, reserves, chargebacks, terminal lease, and PCI scope;
- shipping, tax calculation, age verification, customer email/SMS, and customer-support providers;
- public domain and broader storefront costs outside retained Vercel/AWS components;
- native client and protected-wholesale implementation;
- tax, regional price variance, negotiated discounts, and future provider changes.

## 8. Cost controls

1. Reprice every retained service and verify account owner, region, terms, DPA/subprocessors, quotas, support, and billing alert behavior before procurement.
2. Configure provider spend notifications and hard controls where safe; cost exhaustion must fail explicitly, not corrupt commerce state.
3. Keep the always-on uptime monitor on an API liveness endpoint that does **not** query Neon; frequent polling must not prevent scale-to-zero.
4. Run one hourly aggregate operations pulse for database reachability, outbox/projection state, backup freshness, and reconciliation; expose only opaque health state.
5. Budget media using representative upload, scan, derivative, and delivery samples before approving the AWS envelope.
6. Track actual cost by capability so a later trigger cannot hide a provider's marginal cost.

## 9. Price evidence and limits

All sources were accessed 2026-08-17.

| Source | URL | What it establishes | What it does not establish |
|---|---|---|---|
| Neon pricing | https://neon.com/pricing | Current Launch rates, seven-day restore ceiling, and monitoring/plan dimensions | Actual workload, invoice, recovery success, or production fitness |
| Neon usage pricing | https://neon.com/blog/new-usage-based-pricing | No monthly minimum, scale-to-zero billing, and example economics | Blowin' Smoke usage |
| Vercel Pro/pricing | https://vercel.com/docs/plans/pro-plan and https://vercel.com/pricing | Current $20 plan fee, included seat/credit, allowances, and spend controls | Final usage, application correctness, or future price |
| Auth0 pricing | https://auth0.com/pricing?pm=true | Current $35 Essentials price and plan features | Configured assurance or final tax/invoice |
| Sentry pricing | https://sentry.io/pricing/ | Current Developer limits and $26 Team list price | Adequate detection, privacy-safe setup, or event volume |
| S3/GuardDuty pricing | https://aws.amazon.com/s3/pricing/ and https://aws.amazon.com/guardduty/pricing/ | Storage/request/scan dimensions and current allowances | One universal monthly media price |
| Amazon SES pricing | https://aws.amazon.com/ses/pricing/ | Current plan/à-la-carte message rates and no-minimum option | Delivery, configured identity, actual message volume, or final bill |
| KMS/Lambda/EventBridge | https://aws.amazon.com/kms/pricing/ , https://aws.amazon.com/lambda/pricing/ , https://aws.amazon.com/eventbridge/pricing/ | Current key, compute, request, and scheduler billing units | Final backup cost or job success |
| CloudFront plans | https://docs.aws.amazon.com/PricingPlanManager/latest/UserGuide/plans.html | Current flat-rate plan allowances and conditions | Eligibility, exact bill, or media workload fitness |
| Cloudflare Images | https://developers.cloudflare.com/images/pricing/ | Current image transform/storage/delivery units | Need or future cost |
| Mux pricing | https://www.mux.com/pricing | Current free/PAYG dimensions and rates | Actual video workload or implementation fitness |
| QuickBooks pricing | https://quickbooks.intuit.com/pricing/ | Current list pricing | Accountant approval, tax treatment, or integration need |
| Cloudflare Zero Trust | https://www.cloudflare.com/plans/zero-trust-services/ | Current user-based plan listing | One-owner final invoice/minimum or necessity |
| Apple Developer Program | https://developer.apple.com/programs/whats-included/ | Current annual membership amount | Need or app approval |

Every amount must be reverified at procurement. Planning precision must not be mistaken for a quote.
