# COM-ADM-02 — Search, Cache, Audit, Backup, Disaster Recovery, and Observability

**Phase:** COM-ADM-02 provider feasibility
**Status:** Evidence-backed recommendation; architecture and production implementation remain unauthorized
**Evidence access date:** 2026-08-17
**Catalog assumption:** Managed small-business commerce administration with fewer than 100 launch products
**Production system:** Not implemented
**Launch readiness:** Not established

## 1. Purpose and authority boundary

This document evaluates search, cache, audit/logging, backup/disaster-recovery, and observability candidates against COM-ADM-01. It complements [02 — Transactional database, backend, API, and deployment options](02-database-backend-and-api-options.md).

It does not authorize account creation, procurement, infrastructure, credentials, implementation, data migration, production telemetry, live backup, pilot, or launch. Provider feature statements are not proof of Blowin' Smoke's data correctness, recoverability, authorization, tamper evidence, or operational readiness.

## 2. Decision

| Concern | COM-ADM-02 recommendation | Status |
|---|---|---|
| Initial search | PostgreSQL full-text search plus `pg_trgm` | **RECOMMENDED** |
| External search | Algolia Grow only if measured requirements exceed PostgreSQL | **VIABLE ALTERNATIVE** |
| Initial cache | No external cache; use only bounded HTTP/CDN caching for public, rebuildable projections | **RECOMMENDED** |
| External Redis cache | Upstash is not justified at launch | **REJECTED** |
| Canonical business audit | Transactional audit and outbox records in PostgreSQL | **RECOMMENDED** |
| Tamper-resistance / independent archive | Encrypted PostgreSQL exports and audit checkpoints in a separate AWS S3 bucket with Object Lock | **RECOMMENDED** |
| Fast operational recovery | Neon configured restore history/PITR | **RECOMMENDED** |
| Provider exit and independent recovery | Direct-connection `pg_dump`, encrypted off-provider, followed by proved restoration | **RECOMMENDED** |
| Application observability | Sentry Team with strict minimization and scrubbing | **RECOMMENDED** |
| Unified telemetry alternative | Better Stack | **VIABLE ALTERNATIVE** |
| General platform/application logs as the sole commerce audit record | Not acceptable | **REJECTED** |
| Production implementation | Not authorized by this research | **BLOCKED** |

The governing separation is:

```text
CANONICAL POSTGRESQL
  business state + ledgers + audit + idempotency + outbox
       |
       +--> rebuildable search projection
       +--> disposable bounded cache
       +--> minimized operational telemetry
       +--> encrypted independent backup / audit checkpoint
```

Search, cache, logs, metrics, traces, alerts, and dashboards never authorize publication, price, inventory, evidence, eligibility, order, or fulfillment truth.

## 3. Search

### 3.1 PostgreSQL full-text search and `pg_trgm` — RECOMMENDED

PostgreSQL supplies:

- `tsvector` document parsing;
- `tsquery`, `plainto_tsquery`, phrase, and web-style query parsing;
- relevance ranking and highlighting;
- field weighting for product name, brand/maker, SKU, taxonomy, and governed aliases;
- trigram similarity for misspelling and partial-name recovery; and
- GIN/GiST index support for scalable retrieval.

For a sub-100-product catalog, these capabilities avoid another credential, data processor, synchronization path, failure mode, and vendor-specific relevance configuration. They also keep the initial search projection next to its canonical source while preserving the logical rule that search is rebuildable.

Recommended search boundary:

| Search surface | Permitted indexed content | Explicit non-authority |
|---|---|---|
| Public retail | Approved public identity, taxonomy, safe card copy, public media references, and channel-visible search facets | Cannot prove current price, stock, eligibility, evidence validity, or checkout readiness |
| Authorized admin | Permitted operational identifiers and minimized cross-domain retrieval facts | Cannot bypass object/domain capability authorization or mutate through search |
| Private Wholesale | Only the separately authorized safe projection under the approved protected-client/content gate | No protected payload to an unapproved client; no search index becomes protected-content authority |

A returned search result must re-read or query the relevant canonical owner before a consequential action. Search must not calculate available-to-promise, grant wholesale access, validate evidence, or commit a price.

Material limitations:

- PostgreSQL's built-in ranking is generic and application-specific tuning remains necessary.
- `pg_trgm` similarity is useful but is not semantic intent understanding.
- Synonym/alias governance remains Blowin' Smoke data work.
- Documentation proves mechanisms, not customer retrieval quality, latency, or conversion impact.

**Expected launch cost:** **$0 incremental** beyond the recommended PostgreSQL database.

### 3.2 Algolia Grow — VIABLE ALTERNATIVE

Algolia becomes reasonable only if measured proof establishes needs such as substantially richer merchandising controls, query suggestions, independent search scaling, or relevance tuning that materially exceed PostgreSQL at the actual catalog size.

Current Grow price:

- 10,000 search requests per month included;
- 100,000 records included;
- then $0.50 per additional 1,000 search requests; and
- then $0.40 per additional 1,000 records.

Algolia supports export of records and configuration, including settings, synonyms, and rules, through its API/CLI. This reduces but does not remove lock-in: ranking behavior, analytics, rule semantics, and operational synchronization remain vendor-specific.

Security constraints if later selected:

- index only data safe for the audience possessing the search key;
- never place sensitive data in index names or metadata;
- keep admin/write keys server-side;
- use least-privilege, restricted, rotating keys;
- treat referrer restriction as a weak supporting control, not authorization;
- use outbox-driven, idempotent projection updates; and
- prove full rebuild from canonical PostgreSQL.

Algolia explicitly warns that exposed search keys can be used to scrape indexed content. It therefore must not receive protected wholesale payloads, unnecessary personal data, private evidence, or operational secrets merely because it offers key restrictions.

**Expected launch cost:** **$0** while within Grow's included quotas, but the synchronization/security/operations cost still exists.

## 4. Cache

### 4.1 No external cache at launch — RECOMMENDED

At the declared catalog size, an external Redis service has no established requirement. Start with:

- correctly indexed PostgreSQL queries;
- bounded in-process/request memoization where safe;
- HTTP/CDN caching only for public, rebuildable projections;
- explicit cache keys containing schema/source version where material;
- short bounded freshness appropriate to the projection; and
- immediate canonical revalidation for every consequential command.

No cache may own or authorize:

- current inventory or available-to-promise;
- reservation/commitment state;
- price acceptance;
- channel allocation;
- evidence applicability/currentness;
- legal, destination, age, or product eligibility;
- trusted-device/protected-client admission;
- staff capabilities; or
- order/payment/fulfillment state.

Cache loss must cause slower reads, not data loss. Cache staleness must cause revalidation or a labeled/suppressed projection, not an unauthorized positive decision.

**Expected launch cost:** **$0 incremental**.

### 4.2 Upstash Redis — REJECTED for launch

Upstash offers a Redis-compatible managed service, TLS, REST access, persistent storage, and automatic backups. Current pricing includes:

- Free: $0, 256 MB, 500,000 commands/month, and 10 GB bandwidth;
- Pay as You Go: $0.20 per 100,000 commands, first 1 GB storage free, then $0.25/GB, and bandwidth free through 200 GB then $0.03/GB;
- Fixed 250 MB: $10/month; and
- Prod Pack: **+$200/month per database**.

The reviewed security documentation states TLS is always enabled, but encryption at rest, multi-zone HA, uptime SLA, SOC 2 plan features, Prometheus/Datadog, and backups up to three days are associated with Prod Pack. That cost and extra system are disproportionate without a measured cache need.

If a later load test establishes a genuine need, Upstash is a **VIABLE ALTERNATIVE for disposable data only**. No future reconsideration permits canonical inventory, price, evidence, authorization, audit, idempotency, or outbox state to migrate into the cache.

Exit burden is low for a disposable cache because it must be fully rebuildable. The reviewed material did not establish a complete managed snapshot-export path; therefore it must never be selected for data whose loss requires recovery.

## 5. Canonical audit and operational logging

### 5.1 Transactional PostgreSQL audit and outbox — RECOMMENDED

COM-ADM-01 requires a consequential business write, required audit, idempotency outcome, and outbox event to commit atomically where they share a transaction boundary. The recommended database can satisfy that logical boundary.

The application audit record should be a governed commerce entity, not free-form application logging. Where applicable it records:

- stable event/audit ID;
- aggregate and exact object identity/version;
- action/command and outcome;
- actor, session, authority class, and relevant assurance class;
- domain, channel, location, and risk scope;
- request/idempotency/correlation/causation identifiers;
- occurred and effective timestamps;
- reason/reference and approval context when required;
- safe prior/new state references or minimized change description;
- provenance and source client/build where allowed;
- sensitivity/retention class; and
- link to the outbox/business event where relevant.

It must avoid raw credentials, authentication secrets, full tokens, unnecessary PII, payment-card data, protected media, private evidence documents, or unrestricted request/response bodies.

PostgreSQL documents triggers and transition tables that can support database-level audit capture. That is a mechanism, not a complete audit architecture. Application commands should deliberately emit domain-aware audit evidence, with carefully scoped database triggers used as defense-in-depth where justified.

### 5.2 Tamper evidence and archive

An ordinary audit table can be modified by a sufficiently privileged database owner. Therefore:

- runtime roles must lack update/delete authority over audit records;
- audit corrections must be linked successor/compensating records, not edits;
- privileged maintenance activity requires separate control and evidence;
- a tamper-evident sequence/checkpoint mechanism must be selected and proved;
- periodic minimized audit checkpoints/exports must leave the primary provider; and
- off-provider copies must have retention, access, legal-hold, and restoration governance.

S3 Object Lock is the recommended archive candidate because it applies WORM retention to versioned S3 objects. Governance mode can be bypassed by an identity with the specific bypass permission; Compliance mode prevents deletion during retention even by the root user. Selection of mode and retention duration requires legal/records/security approval and is not made here.

Object Lock protects a stored object version from overwrite/deletion. It does not prove:

- that the exported audit is complete;
- that an attacker did not omit events before export;
- that the source audit is correct;
- who caused a disputed change;
- that a backup is decryptable or restorable; or
- that Blowin' Smoke meets a legal retention regime.

### 5.3 Logs are not audit

Runtime logs, provider access logs, traces, metrics, error events, session replay, and alerts are supporting operational evidence only. They may be sampled, dropped, redacted, delayed, expire quickly, or become unavailable with a provider incident. None is the sole record of a price change, inventory mutation, evidence decision, permission change, receiving outcome, export, or high-risk Admin action.

## 6. Backup and disaster recovery

### 6.1 Recommended layered recovery model

| Layer | Purpose | Required boundary |
|---|---|---|
| Neon restore history / PITR | Fast recovery from recent bad writes, migration errors, or deletion | Configure the intended window; restore to an isolated branch/endpoint; validate before cutover |
| PostgreSQL logical export | Provider-independent data/schema recovery and exit | Use direct connection; encrypt before/while storing; retain manifest/checksum and tool/version metadata |
| Separate-account S3 Object Lock | Off-provider retention and overwrite/delete resistance | Versioning required; least privilege; retention/hold policy; separately controlled keys and credentials |
| Source code and migrations in GitHub | Recreate application and schema evolution | Does not contain live database state, secrets, inventory, prices, or backups |
| Restore/reconciliation exercise | Prove usability, completeness, and operational recovery | Restore into clean independent PostgreSQL; run invariants and reconciliation; record RPO/RTO evidence |

The exact backup cadence, retention, RPO, RTO, legal hold, and destruction schedule remain owner/security/legal/operations decisions. The system must not silently imply that a provider's maximum restore window equals the approved policy.

### 6.2 Required backup artifact controls

A future authorized implementation should include, at minimum:

- stable backup ID and source database/environment identity;
- start/completion time and source transaction/snapshot reference where available;
- PostgreSQL and `pg_dump` version;
- manifest of included databases/schemas and excluded data;
- encryption algorithm/key reference, without embedding the key;
- content checksum and size;
- retention class and Object Lock state;
- backup job outcome and monitored heartbeat;
- restore-test result and tested target version;
- reconciliation result for ledgers, positions, reservations, prices, audit sequence, and outbox; and
- authorized expiration/destruction evidence.

Do not run `pg_dump` through Neon's transaction-pooled endpoint; Neon recommends a direct connection because session settings may not persist through pooled transaction mode.

### 6.3 Disaster-recovery proof standard

A provider documentation statement or green dashboard is not a recovery proof. The later proof gate must exercise:

1. restore to a safe isolated environment;
2. schema and migration compatibility;
3. decryption and checksum verification;
4. canonical invariant/reconciliation queries;
5. application connection and read behavior;
6. projection/search rebuild;
7. outbox replay/dead-letter recovery without duplicate business effects;
8. credential/key availability under the incident scenario;
9. measured recovery point and recovery time; and
10. documented cutover/rollback authority.

No launch claim is permitted before that exercise passes under an owner-approved recovery objective.

### 6.4 Cost

AWS states that S3 Object Lock has no separate feature charge; ordinary S3 storage, requests, retrieval, replication, key-management, and data-transfer charges still apply. Exact cost depends on region, storage class, object cadence/size, retention, and access pattern.

- **Current exact launch price:** **PRICE NOT VERIFIED**.
- **Planning estimate only:** approximately **$1–10/month** for a very small encrypted logical-backup/audit archive, matching the package cost-model allowance.
- **What the estimate is not:** an AWS quote, a retention policy, or production approval.

## 7. Observability

### 7.1 Sentry Team — RECOMMENDED

Sentry Team is the leading small-team candidate for application errors, traces, release context, logs/metrics within quota, uptime, and scheduled-job monitoring.

Current monthly pricing and included quantities:

- Developer: $0, one user;
- Team: **$26/month**, unlimited users and integrations;
- 50,000 errors;
- 5 GB logs;
- 5 GB application metrics;
- five million spans;
- 50 session replays;
- one uptime monitor; and
- one cron monitor.

The expected production research baseline uses Team. Developer may support a one-person synthetic proof but is not a production approval.

Recommended initial signals:

- command/API error rate and latency;
- database connection/transaction failures;
- idempotency conflicts and unknown outcomes;
- outbox backlog, retry, and dead-letter state;
- projection/search rebuild failures and lag;
- backup completion heartbeat and restore-test failures;
- authentication/authorization failure aggregates without exposing secrets;
- provider dependency health; and
- deployment version/regression context.

Privacy/security requirements:

- enable default and custom data scrubbing;
- remove tokens, cookies, credentials, query secrets, and authorization headers before transmission;
- minimize or pseudonymize actor/customer identifiers;
- exclude protected wholesale content, private evidence/media, raw order contents where unnecessary, and payment-card data;
- separate test/preview/production projects and credentials;
- control session replay or disable it on sensitive Admin/protected surfaces unless separately approved; and
- never use Sentry as the canonical audit record.

Sentry documents data-management and scrubbing controls. Those controls do not prove that an SDK integration is correctly configured or that sensitive data cannot be emitted by application code. A telemetry data-flow review and synthetic leak tests remain required.

### 7.2 Better Stack — VIABLE ALTERNATIVE

Better Stack offers a broader unified surface across logs, traces, metrics, error tracking, uptime, heartbeats, incident management, and optional long-term S3 archival.

Current pricing:

- Free: $0, expressly presented for personal projects, including 10 monitors/heartbeats, 100,000 exceptions, 3 GB logs and traces retained three days, and 30 GB metrics;
- Nano telemetry bundle: **$30/month monthly** or **$25/month billed annually**, with 40 GB each of logs, traces, and metrics and 30-day retention; and
- Responder incident management: **$34/month monthly** or **$29/month billed annually** per responder.

The official pricing page also represents SOC 2 Type II, PII-anonymization controls, ISO 27001 data centers, OpenTelemetry-oriented ingestion, and optional S3 archival. Complete lossless data exit and fit for the exact Blowin' Smoke alert model were not established by the reviewed source.

Better Stack is **VIABLE ALTERNATIVE**, but Sentry Team is initially more focused and has the lower month-to-month list price for the error/trace/release requirement. Better Stack Nano's annual-equivalent price is slightly lower. Do not run both at launch without a demonstrated need.

## 8. Combined cost effect

| Search/cache/audit/backup/observability composition | Monthly effect |
|---|---:|
| PostgreSQL FTS/`pg_trgm` | **$0 incremental** |
| No external cache | **$0 incremental** |
| Sentry Team | **$26** |
| Small S3 Object Lock archive | **PRICE NOT VERIFIED; planning estimate $1–10** |
| Recommended incremental total | **~$27–36** |
| Total with Neon typical + Vercel Pro | **~$62–71** |
| Sentry Developer during one-user proof | **$0** |
| Algolia Grow within included quotas | **$0**, plus integration/operations burden |
| Upstash fixed 250 MB, if later justified | **$10**; production security/SLA add-on **+$200/database** |
| Better Stack Nano telemetry alternative | **$30 monthly** or **$25 annual-equivalent** |

All figures exclude identity, media, email, domain, tax, transfer, overage, key-management, replication, and staff/operational cost. Re-price before procurement.

## 9. Evidence register

Every source below is first-party and was accessed **2026-08-17**.

### SEARCH-01 — PostgreSQL full-text search

- **SOURCE:** PostgreSQL 18 documentation — Controlling Text Search
- **URL:** https://www.postgresql.org/docs/current/textsearch-controls.html
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** `tsvector`, query parsers, web-style query parsing, ranking, field weighting, and highlighting mechanisms.
- **WHAT IT DOES NOT ESTABLISH:** Customer-quality relevance, taxonomy/synonym truth, production latency, or conversion performance.

### SEARCH-02 — PostgreSQL trigram similarity

- **SOURCE:** PostgreSQL documentation — `pg_trgm`
- **URL:** https://www.postgresql.org/docs/17/pgtrgm.html
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Trigram similarity functions/operators and GIN/GiST index support for similarity, `LIKE`, `ILIKE`, and related matching.
- **WHAT IT DOES NOT ESTABLISH:** Appropriate similarity thresholds, semantic intent, customer usefulness, or selected deployment-extension availability until verified.

### SEARCH-03 — Algolia Grow pricing

- **SOURCE:** Algolia — Pricing
- **URL:** https://www.algolia.com/pricing
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Current Grow/Grow Plus included usage, record/search overage prices, plan capabilities, and production use positioning.
- **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke usage, final bill, better relevance than PostgreSQL, or need for an external index.

### SEARCH-04 — Algolia security controls and exposure boundary

- **SOURCE:** Algolia documentation — Security best practices and API keys
- **URL:** https://www.algolia.com/doc/guides/security/security-best-practices
- **URL:** https://www.algolia.com/doc/guides/security/api-keys
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** HTTPS, 2FA guidance, ACL/restricted/expiring keys, key rotation, log/data cautions, and Algolia's warning that exposed search keys can enable scraping.
- **WHAT IT DOES NOT ESTABLISH:** Authorization of protected data, prevention of scraping, correct key configuration, or application compliance.

### SEARCH-05 — Algolia export and exit

- **SOURCE:** Algolia documentation — Export and import indices and settings
- **URL:** https://www.algolia.com/doc/guides/sending-and-managing-data/manage-indices-and-apps/manage-indices/how-to/export-import-indices
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** CLI/API export of records and export/import of settings, synonyms, and rules.
- **WHAT IT DOES NOT ESTABLISH:** Lossless behavioral portability of ranking/analytics, automatic backup, or synchronized canonical state.

### CACHE-01 — Upstash Redis pricing

- **SOURCE:** Upstash — Redis Pricing
- **URL:** https://upstash.com/pricing/redis
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Free, pay-as-you-go, fixed-plan, storage/bandwidth/command prices and the $200/month-per-database Prod Pack price/features.
- **WHAT IT DOES NOT ESTABLISH:** A need for Redis, Blowin' Smoke usage, final bill, or production suitability.

### CACHE-02 — Upstash security and recovery features

- **SOURCE:** Upstash documentation — Security; Prod Pack & Enterprise
- **URL:** https://upstash.com/docs/redis/features/security
- **URL:** https://upstash.com/docs/redis/overall/enterprise
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Always-on TLS, ACL availability on paid databases, and Prod Pack association with encryption at rest, multi-zone/SLA/compliance/monitoring features and backups up to three days.
- **WHAT IT DOES NOT ESTABLISH:** Correct cache use, complete export, recovery of canonical data, or that base plans meet Blowin' Smoke security needs.

### AUDIT-01 — PostgreSQL trigger mechanisms

- **SOURCE:** PostgreSQL 18 documentation — Trigger Functions
- **URL:** https://www.postgresql.org/docs/current/plpgsql-trigger.html
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Row/statement trigger mechanisms and transition-table audit examples.
- **WHAT IT DOES NOT ESTABLISH:** A complete immutable audit design, domain meaning, tamper evidence, privileged-user resistance, retention, privacy, or legal sufficiency.

### BACKUP-01 — PostgreSQL portable logical dump

- **SOURCE:** PostgreSQL 18 documentation — `pg_dump`
- **URL:** https://www.postgresql.org/docs/current/app-pgdump.html
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Plain SQL, custom, directory, and other logical-export formats, compression options, and compatibility with restoration to newer PostgreSQL versions.
- **WHAT IT DOES NOT ESTABLISH:** Scheduling, encryption, complete cluster coverage, tested restoration, application consistency, RPO, or RTO.

### BACKUP-02 — Neon pooling caution for dumps

- **SOURCE:** Neon documentation — Connection pooling
- **URL:** https://neon.com/docs/connect/connection-pooling
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Transaction-pooled session limitations and Neon's recommendation to use a direct connection for `pg_dump` and migration tooling.
- **WHAT IT DOES NOT ESTABLISH:** A successful Blowin' Smoke dump, restore, encryption, retention, or schedule.

### BACKUP-03 — Neon recovery window and backup posture

- **SOURCE:** Neon — Pricing and Security & Compliance
- **URL:** https://neon.com/pricing
- **URL:** https://neon.com/security
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Launch's configurable restore window up to seven days, history pricing, and Neon-described encrypted backup/business-continuity controls.
- **WHAT IT DOES NOT ESTABLISH:** The configured project window, independent recovery, application reconciliation, achieved RPO/RTO, or successful restore.

### BACKUP-04 — S3 Object Lock behavior

- **SOURCE:** AWS documentation — Locking objects with Object Lock
- **URL:** https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** WORM protection, S3 Versioning requirement, per-version retention, legal holds, Governance/Compliance modes, and delete behavior.
- **WHAT IT DOES NOT ESTABLISH:** Backup completeness, source integrity, retention-policy legality, decryptability, restoration, or Blowin' Smoke compliance.

### BACKUP-05 — S3 price model and Object Lock feature charge

- **SOURCE:** AWS — S3 Pricing; AWS Storage Blog — Protecting data with Amazon S3 Object Lock
- **URL:** https://aws.amazon.com/s3/pricing/
- **URL:** https://aws.amazon.com/blogs/storage/protecting-data-with-amazon-s3-object-lock/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** S3 is pay-as-used across storage/requests/transfer/management dimensions and AWS states Object Lock has no additional feature charge.
- **WHAT IT DOES NOT ESTABLISH:** Exact Blowin' Smoke cost, selected region/class, object cadence, retention, KMS/replication charges, or production budget.

### OBS-01 — Sentry price and included telemetry

- **SOURCE:** Sentry — Pricing
- **URL:** https://sentry.io/pricing/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Developer/Team/Business prices, Team user/integration capability, included errors/logs/metrics/spans/replays/uptime/cron quantities, and data-lookback boundaries.
- **WHAT IT DOES NOT ESTABLISH:** Final usage cost, complete telemetry, issue detection, canonical audit, privacy-safe SDK configuration, or production suitability.

### OBS-02 — Sentry privacy controls

- **SOURCE:** Sentry API documentation — Update an Organization
- **URL:** https://docs.sentry.io/api/organizations/update-an-organization/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Organization controls for enhanced privacy, default/custom scrubbing, sensitive/safe fields, crash-report storage, and IP-address scrubbing.
- **WHAT IT DOES NOT ESTABLISH:** That every SDK/event is scrubbed, absence of sensitive leakage, appropriate retention, or application compliance.

### OBS-03 — Sentry security posture

- **SOURCE:** Sentry — Security
- **URL:** https://sentry.io/security/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Sentry's represented security/compliance program and customer data-security controls.
- **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke compliance, safe data selection, canonical audit completeness, or incident detection.

### OBS-04 — Better Stack capability and price

- **SOURCE:** Better Stack — Pricing
- **URL:** https://betterstack.com/pricing
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Current personal-free, Nano telemetry, responder, retention, volume, monitoring, security-representation, PII-anonymization, OpenTelemetry, and S3-archive price/capability statements.
- **WHAT IT DOES NOT ESTABLISH:** Complete lossless export, final bill, correct privacy configuration, canonical audit suitability, or better fit than Sentry for Blowin' Smoke.

## 10. Next proof gate

If the owner later authorizes synthetic non-production proof work, the minimum gate is:

1. representative product/SKU/admin search using PostgreSQL FTS and `pg_trgm`;
2. documented relevance cases and misspelling behavior;
3. proof that stale search/cache cannot authorize a consequential command;
4. atomic canonical mutation, audit, idempotency, and outbox persistence;
5. audit-role denial of update/delete and privileged-maintenance evidence;
6. encrypted direct-connection `pg_dump` with manifest/checksum;
7. separate-account Object Lock upload and retention-state verification;
8. restore into a clean independent PostgreSQL target;
9. ledger/position/reservation/price/audit/outbox reconciliation;
10. Sentry synthetic error, trace, uptime, and backup-heartbeat signals;
11. telemetry tests proving tokens, PII, protected content, media/evidence, and payment data are excluded; and
12. measured RPO/RTO and cost under representative synthetic use.

Until explicitly authorized and passed, every recommendation in this document remains a **candidate direction**, not selected production architecture. Live search, cache, audit storage, backups, telemetry, accounts, credentials, data processing, implementation, pilot, and launch remain unauthorized.
