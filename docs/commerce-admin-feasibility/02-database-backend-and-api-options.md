# COM-ADM-02 — Transactional Database, Backend, API, and Deployment Options

**Phase:** COM-ADM-02 provider feasibility
**Status:** Evidence-backed recommendation; architecture and production implementation remain unauthorized
**Evidence access date:** 2026-08-17
**Catalog assumption:** Managed small-business commerce administration with fewer than 100 launch products
**Production system:** Not implemented
**Launch readiness:** Not established

## 1. Purpose and authority boundary

This document evaluates current managed transactional-database, backend/API, and deployment candidates against the logical requirements defined by COM-ADM-01. It recommends a low-operations candidate stack for the next proof gate. It does not authorize procurement, schema implementation, production credentials, live catalog or inventory loading, deployment, pilot, or launch.

Provider documentation establishes product capabilities and plan boundaries. It does not establish that Blowin' Smoke has correctly implemented:

- canonical record ownership;
- exact-money and exact-quantity arithmetic;
- inventory concurrency and oversell prevention;
- command idempotency;
- transactional audit and outbox behavior;
- capability and object authorization;
- backup recoverability; or
- security acceptance.

Those properties require representative implementation proofs and failure tests after the owner authorizes a later phase.

## 2. Decision

| Concern | COM-ADM-02 recommendation | Status |
|---|---|---|
| Transactional system of record | Neon Launch PostgreSQL | **RECOMMENDED** |
| Admin application and server-side command API | Vercel Pro using the standard Node.js runtime | **RECOMMENDED** |
| Integrated database/backend alternative | Supabase Pro, with writes constrained to explicit server-side domain commands | **VIABLE ALTERNATIVE** |
| Edge API alternative | Cloudflare Workers Paid, after representative transaction/runtime proof | **VIABLE ALTERNATIVE** |
| Managed application-and-database alternative | Render Web Services plus Render Postgres | **VIABLE ALTERNATIVE** |
| Any browser-to-database or generated-CRUD write path that bypasses domain commands | Not acceptable | **REJECTED** |
| Production implementation | Not authorized by this research | **BLOCKED** |

The opinionated candidate is:

```text
AUTHORIZED ADMIN CLIENT
        |
   VERCEL PRO
Admin UI + server-only command/query API
        |
 NEON LAUNCH POSTGRESQL
Canonical records + ledgers + audit + idempotency + outbox
```

Neon and Vercel are independently replaceable. PostgreSQL remains the durable boundary; Vercel functions do not own commerce truth. A single command must complete its canonical mutation, ledger/version effects, required audit record, idempotency outcome, and outbox record in one database transaction where COM-ADM-01 requires that atomic boundary.

## 3. Why the recommendation fits COM-ADM-01

PostgreSQL provides the relevant primitives without requiring a large-business platform:

- transaction isolation through `SERIALIZABLE` for operations that require its guarantees;
- row and table locking for explicit concurrency control;
- exact `numeric`/`decimal` and integer types rather than binary floating point;
- constraints, foreign keys, indexes, triggers, roles, and row-level security;
- SQL migrations and portable logical dumps;
- full-text search and trusted extensions for the initial catalog scale; and
- one transaction for business mutation, audit evidence, idempotency outcome, and outbox event.

The presence of a database feature is not an implementation decision. Exact isolation, locking, retry, invariant, and audit mechanisms remain subject to later proof. COM-ADM-01's domain rules control if a provider default or convenience API conflicts with them.

## 4. Candidate comparison

| Candidate | Current price model | Capability and material limits | Security and recovery | Exit / lock-in | Operational burden | COM-ADM-01 fit | Verdict |
|---|---|---|---|---|---|---|---|
| Neon Launch PostgreSQL | Usage based; official typical example **$15/month** for intermittent load and 1 GB. Compute **$0.106/CU-hour**; storage **$0.35/GB-month**; history **$0.20/GB-month** of changed data. | Standard PostgreSQL; up to 16 CU; scale-to-zero available; up to seven-day configurable restore window; only three days of metrics/logs in the UI; no Launch log export, IP allow rules, private network, or SLA. | TLS 1.2+; AES-256 at rest; annual SOC 2 Type II and ISO audits. Provider recovery exists, but independent export and tested restore remain required. | Strong PostgreSQL/`pg_dump` exit. Neon time travel, branching, and control-plane operations are proprietary. | Low | High | **RECOMMENDED** |
| Vercel Pro | **$20/month** with **$20 included usage credit**; additional developer seats **$20/month**. Hobby is non-commercial. | Managed Git deployments, preview deployments, Node.js functions, instant rollback. With Fluid Compute, Pro supports up to 4 GB function memory and configurable duration up to 800 seconds; proxied external destinations have a 120-second timeout. | SOC 2 Type II; AES-256 at rest; TLS 1.3 in transit. Platform backups and deployment rollback do not back up the external commerce database. | Standard Node/HTTP code is portable; runtime configuration, deployments, caches, and integrations create moderate coupling. | Very low | High for short server-only commands | **RECOMMENDED** |
| Supabase Pro | From **$25/month**; includes $10 compute credit covering one Micro instance. | PostgreSQL, Auth, Storage, Data API, Edge Functions, Realtime, metrics. Micro: 1 GB RAM, 60 direct/200 pooled connections. Pro: seven-day daily-backup retention and seven-day logs. No Pro platform audit logs, SLA, PrivateLink, or customer SOC/ISO report entitlement. Seven-day PITR is **$100/month** and requires at least Small compute. | Hosted platform is SOC 2 Type II audited under shared responsibility. RLS is useful defense-in-depth. Daily backup cadence can expose a near-24-hour RPO. | PostgreSQL data exits with SQL/`pg_dump`; Auth, Storage, Realtime, RLS patterns, and Edge Functions add moderate coupling. | Very low | High only behind domain commands | **VIABLE ALTERNATIVE** |
| Cloudflare Workers Paid | Minimum **$5/account/month**; 10 million requests and 30 million CPU milliseconds included; overage **$0.30/million requests** and **$0.02/million CPU milliseconds**. | Edge/serverless Fetch runtime; 128 MB memory; default 30-second CPU limit configurable to five minutes; 10 MB compressed Worker; six simultaneous outgoing connections. | Cloudflare documents isolate defenses and TLS termination. It is not the system of record and supplies no application-database recovery. | Standard Fetch code can be portable; Workers, Hyperdrive, KV, and Durable Objects increase coupling. | Very low | Conditional pending transaction/runtime proof | **VIABLE ALTERNATIVE** |
| Render Web Services + Postgres | Pro workspace **$25/month**; PostgreSQL storage **$0.30/GB-month**. Current complete compute price was not exposed in the reviewed official pricing response: **PRICE NOT VERIFIED**. | Managed web services, private networking, Postgres, deploy rollback, PITR, and logical exports. Storage cannot shrink. HA requires eligible higher database types. | PostgreSQL requires TLS 1.2+ and supports external IP allowlists. Paid DB PITR is three days on Hobby or seven on Pro; logical exports are retained seven days. | Standard Postgres and downloadable logical backups provide strong data exit. Render runtime/configuration creates moderate deployment coupling. | Low | High | **VIABLE ALTERNATIVE** |

## 5. Recommended transactional database — Neon Launch PostgreSQL

### 5.1 Approved feasibility conclusion

Neon Launch is the leading database candidate for a low-volume, managed commerce administration system because it combines standard PostgreSQL semantics, usage-based small-workload pricing, built-in restore history, serverless-aware connection mechanisms, and a comparatively strong exit path.

The recommendation is bounded by these conditions:

1. Configure the full required restore window; “up to seven days” is not proof that the production project has seven days configured.
2. Use pooled connections for ordinary serverless request traffic and a direct connection where migrations and `pg_dump` require it.
3. Keep all credentials server-side. No browser, public client, search index, cache, or generated data API may possess a database owner credential.
4. Create least-privilege runtime, migration, backup, and operational roles. Do not run the application as the database owner.
5. Write consequential operations through explicit domain commands, not generic table CRUD.
6. Treat Launch's three-day UI log window and lack of log export as insufficient for canonical audit or long-term operational evidence.
7. Maintain and restore-test an off-provider logical backup as specified in [05 — Search, cache, audit, backup, and observability](05-search-cache-audit-backup-observability.md).

### 5.2 Connection and transaction constraints

Neon's pooled endpoint uses PgBouncer in transaction mode. Neon documents that this mode limits some PostgreSQL functionality and recommends a direct connection for migrations and `pg_dump`. The application must therefore separate:

| Use | Connection class |
|---|---|
| Short web/API commands and queries | Provider-supported pooled connection or supported serverless driver |
| Multi-query non-interactive domain transaction | Supported Neon transaction API or compatible pooled driver, proven against representative commands |
| Interactive/session transaction when genuinely required | Supported WebSocket/client mode, bounded to one request and proven |
| Schema migration, administrative operation, logical dump | Direct, non-pooled connection with a separately governed role |

No provider statement proves that a chosen ORM correctly preserves transaction scope, isolation, retry behavior, prepared statements, or session settings. That remains a proof gate.

### 5.3 Recovery and exit

Neon's restore history is the fast operational recovery layer. It is not the sole disaster-recovery or provider-exit layer. Required later proof includes:

- configured history window inspection;
- restore to a separate branch or endpoint;
- application reconciliation against the restored state;
- encrypted `pg_dump` generation through a direct connection;
- restoration into a clean independent PostgreSQL instance; and
- measurement of actual recovery point and recovery time.

Expected Neon launch cost is approximately **$15/month** only under the workload profile used in Neon's pricing example. It is not a fixed quote or spend guarantee. Autoscaling bounds, history volume, branches, storage, network transfer, and activity determine the actual bill.

## 6. Recommended backend and deployment — Vercel Pro

### 6.1 Approved feasibility conclusion

Vercel Pro is the leading admin/frontend and command-API deployment candidate because it provides a commercial plan, standard Node.js coverage, managed deployments, preview environments, and rapid rollback with minimal operations. The canonical database remains external and authoritative.

Required command path:

```text
authenticated request
  -> current session and capability validation
  -> object/domain/channel/risk authorization
  -> input and expected-version validation
  -> one bounded database transaction
  -> canonical change + ledger/version + audit + idempotency + outbox
  -> explicit outcome
```

Vercel retries, client retries, timeouts, duplicate submissions, and partial network responses must not create duplicate inventory, receiving, price, publication, or fulfillment effects. Retryable commands require durable idempotency keys and recorded outcomes in the canonical transaction.

### 6.2 Security boundary

Vercel's platform encryption and compliance posture do not supply application authorization. A later implementation must:

- isolate preview, test, and production credentials;
- prevent production secrets from reaching client bundles or untrusted preview deployments;
- use server-only database credentials and short, bounded transactions;
- fail closed on missing, stale, unknown, or revoked assurance/authorization signals;
- minimize request, response, and telemetry data;
- protect admin routes and APIs independently of obscurity or URL knowledge; and
- treat platform rollback as code/deployment recovery, not database rollback.

Expected Vercel launch cost is **$20/month** for one Pro developer seat before usage beyond the included credit, add-ons, taxes, or extra paid developer seats.

## 7. Viable integrated alternative — Supabase Pro

Supabase can reduce component count by combining PostgreSQL, Auth, Storage, generated APIs, Edge Functions, Realtime, and metrics. That convenience is not permission to expose table-oriented write APIs to Admin clients.

If selected later:

- explicit Edge Function/server endpoints or stored commands must enforce the COM-ADM command boundary;
- RLS is defense-in-depth, not the only authorization layer;
- browser-exposed keys must never authorize consequential operational writes merely because RLS exists;
- the generated REST API must not become a generic inventory, pricing, evidence, or publication administration interface;
- provider Auth, Storage, Realtime, and Edge coupling must be recorded in the exit plan; and
- daily backup RPO and lack of platform audit logs/SLA on Pro must be accepted or mitigated.

Expected base stack cost with Vercel Pro and Sentry Team is approximately **$71/month**. Moving to Small compute and seven-day PITR adds approximately **$105/month**, producing an approximate **$176/month** stack before other services and overages.

## 8. Viable deployment alternatives

### Cloudflare Workers Paid

Workers is economically attractive and operationally light. It remains a conditional alternative because its isolate runtime, memory/connection limits, Node compatibility surface, and PostgreSQL connection mechanism must be proven with the exact database driver and transaction pattern.

It must not become authoritative through KV, Durable Objects, Cache API, or an edge-local copy. Those services may support bounded projections or coordination only where COM-ADM-01 permits it.

An estimated Neon + Workers + Sentry Team baseline is **$46/month**, plus backup/archive and excluded services. Cost alone does not close the runtime proof gate.

### Render Web Services + Render Postgres

Render is a coherent, low-operations alternative with standard application runtimes, private service networking, managed Postgres, PITR, logical exports, and rollback. It has a strong exit path because the canonical database remains PostgreSQL.

The full current launch price is **BLOCKED — PRICE NOT VERIFIED** because the reviewed dynamic pricing page did not expose current instance compute amounts. Render cannot be selected on a presumed legacy price. Obtain a current configured quote before any procurement decision.

## 9. Rejected patterns

The following are **REJECTED** regardless of provider:

- browser-to-database owner connections;
- client possession of write credentials capable of bypassing command authorization;
- generic generated CRUD as the operational boundary for inventory, prices, evidence, receiving, publication, or permissions;
- provider/user-agent assertions as authorization;
- business invariants implemented only in UI validation;
- provider dashboard edits as routine commerce operations;
- distributed mutation of canonical records without the COM-ADM-01 owner transaction;
- treating deployment rollback as database recovery;
- treating provider logs as the canonical audit ledger;
- direct search/cache writes that independently correct canonical commerce truth; and
- use of free/personal plans where provider terms limit them to personal or non-production work.

## 10. Cost envelope

| Candidate composition | Evidence-backed monthly baseline | Excluded / variable |
|---|---:|---|
| Neon Launch typical + Vercel Pro + Sentry Team | **~$61** | S3 archive, identity, media, email, domains, tax, overages |
| Above plus estimated small S3 archive allowance | **~$62–71** | Estimate only; modeled at $1–10 to align with the package cost envelope; region, storage, requests, retention, and transfer vary |
| Single-user proof using Sentry Developer | **~$35 + S3** | Not a production approval |
| Neon typical + Cloudflare Workers Paid + Sentry Team | **~$46 + S3** | Runtime/transaction proof still required |
| Supabase Pro + Vercel Pro + Sentry Team | **~$71** | Daily backup only; no PITR |
| Supabase alternative with Small compute and seven-day PITR | **~$176** | Other services and overages excluded |
| Render composition | **BLOCKED — PRICE NOT VERIFIED** | Current database and service compute price required |

These figures are research estimates, not quotes. Re-price immediately before procurement and configure spend limits/alerts where supported.

## 11. Evidence register

Every source below is first-party and was accessed **2026-08-17**.

### DB-01 — PostgreSQL transaction isolation

- **SOURCE:** PostgreSQL 18 documentation — Transaction Isolation
- **URL:** https://www.postgresql.org/docs/current/transaction-iso.html
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** PostgreSQL's supported isolation levels and the anomaly guarantees of `SERIALIZABLE`, `REPEATABLE READ`, and `READ COMMITTED`.
- **WHAT IT DOES NOT ESTABLISH:** Which isolation level Blowin' Smoke must use for each command, correct retry handling, or proof that oversell is prevented.

### DB-02 — PostgreSQL exact types

- **SOURCE:** PostgreSQL 18 documentation — Data Types
- **URL:** https://www.postgresql.org/docs/current/datatype.htm
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** PostgreSQL supplies integers and exact `numeric`/`decimal` values of selectable precision.
- **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke's currency exponent, rounding policy, canonical quantity unit, or schema correctness.

### DB-03 — PostgreSQL logical export

- **SOURCE:** PostgreSQL 18 documentation — `pg_dump`
- **URL:** https://www.postgresql.org/docs/current/app-pgdump.html
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** `pg_dump` can produce plain SQL and portable archive formats and supports migration to newer PostgreSQL versions.
- **WHAT IT DOES NOT ESTABLISH:** Backup scheduling, encryption, completeness, retention, tested restoration, RPO, or RTO.

### DB-04 — Neon price and plan boundary

- **SOURCE:** Neon — Pricing
- **URL:** https://neon.com/pricing
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Launch's usage rates, $15/month typical example, scale-to-zero behavior, restore-window ceiling, monitoring retention, egress allowance, and which networking/log-export/SLA features are reserved for Scale.
- **WHAT IT DOES NOT ESTABLISH:** A fixed Blowin' Smoke bill, configured restore duration, performance under its workload, or production suitability.

### DB-05 — Neon security posture

- **SOURCE:** Neon — Security & Compliance
- **URL:** https://neon.com/security
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Annual SOC 2 Type II/ISO audits, TLS 1.2+ in transit, AES-256 at rest, key-management controls, and Neon-described backup/continuity practices.
- **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke compliance, correct database roles, application authorization, independent backup, or successful disaster recovery.

### DB-06 — Neon connection pooling

- **SOURCE:** Neon documentation — Connection pooling
- **URL:** https://neon.com/docs/connect/connection-pooling
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Neon uses PgBouncer transaction pooling, supports pooled endpoints for serverless workloads, documents feature limits, and recommends direct connections for migrations and `pg_dump`.
- **WHAT IT DOES NOT ESTABLISH:** ORM compatibility, preserved transaction semantics, suitable pool sizing, or correct application connection lifecycle.

### DB-07 — Neon serverless transactions

- **SOURCE:** Neon documentation — Serverless driver
- **URL:** https://neon.com/docs/serverless/serverless-driver
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** The GA driver supports HTTP/WebSocket connections, multi-query non-interactive transactions, configurable isolation, and session/interactive transaction patterns.
- **WHAT IT DOES NOT ESTABLISH:** Suitability of a particular driver mode for every COM-ADM command or safe behavior under timeout/retry/failure.

### API-01 — Vercel commercial pricing

- **SOURCE:** Vercel — Pricing
- **URL:** https://vercel.com/pricing
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Pro costs $20/month, includes $20 usage credit, extra developer-seat pricing, and Hobby's personal/non-commercial boundary.
- **WHAT IT DOES NOT ESTABLISH:** Final monthly usage, suitability, application performance, or production approval.

### API-02 — Vercel function limits

- **SOURCE:** Vercel documentation — Functions limits
- **URL:** https://vercel.com/docs/functions/limitations
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Current Node.js API coverage, function memory, duration, bundle, connection/file-descriptor, and billing boundaries.
- **WHAT IT DOES NOT ESTABLISH:** Transaction completion, retry semantics, latency, or database correctness for Blowin' Smoke.

### API-03 — Vercel security and platform backups

- **SOURCE:** Vercel documentation — Security & Compliance Measures
- **URL:** https://vercel.com/docs/security/compliance
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Vercel's SOC 2 Type II posture, AES-256 at rest, TLS 1.3 in transit, resiliency practices, and two-hour platform-backup interval with 30-day persistence.
- **WHAT IT DOES NOT ESTABLISH:** Backup or recovery of an external PostgreSQL database, application authorization, or customer-accessible business-record restoration.

### API-04 — Vercel deployment rollback

- **SOURCE:** Vercel documentation — Rolling back a production deployment
- **URL:** https://vercel.com/docs/deployments/rollback-production-deployment
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Pro can route production back to a prior eligible deployment without rebuilding.
- **WHAT IT DOES NOT ESTABLISH:** Database rollback, event reversal, compatibility with current schema/data, or recovery of canonical records.

### ALT-01 — Supabase pricing and plan controls

- **SOURCE:** Supabase — Pricing
- **URL:** https://supabase.com/pricing
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Pro price, compute credit/sizes, included quotas, daily-backup retention, log retention, PITR price, Edge Function quota, and unavailable Pro audit/SLA/compliance-entitlement features.
- **WHAT IT DOES NOT ESTABLISH:** Safe generated-API use, correct RLS, acceptable RPO, restored data correctness, or production approval.

### ALT-02 — Supabase backup behavior

- **SOURCE:** Supabase documentation — Database Backups
- **URL:** https://supabase.com/docs/guides/platform/backups
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Daily backup and PITR behavior, restore downtime, PITR compute requirement, and logical-dump options.
- **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke's required RPO/RTO, successful restore, independent retention, or business reconciliation.

### ALT-03 — Supabase Data API

- **SOURCE:** Supabase documentation — Data REST API
- **URL:** https://supabase.com/docs/guides/api
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Supabase generates a PostgREST API from the database schema and permits use with or alongside a custom API server.
- **WHAT IT DOES NOT ESTABLISH:** That direct generated CRUD satisfies COM-ADM-01 commands, invariants, audit, or authorization.

### ALT-04 — Supabase Edge Function limits

- **SOURCE:** Supabase documentation — Edge Function Limits
- **URL:** https://supabase.com/docs/guides/functions/limits
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Function memory, duration, CPU, idle-timeout, bundle, and function-count limits.
- **WHAT IT DOES NOT ESTABLISH:** Fit of every dependency, command duration, transaction correctness, or production capacity.

### ALT-05 — Cloudflare Workers price and limits

- **SOURCE:** Cloudflare Workers documentation — Pricing and Limits
- **URL:** https://developers.cloudflare.com/workers/platform/pricing/
- **URL:** https://developers.cloudflare.com/workers/platform/limits/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Workers Paid base price, included usage, overage rates, memory, CPU, bundle, subrequest, and connection limits.
- **WHAT IT DOES NOT ESTABLISH:** Compatibility with the selected PostgreSQL driver/ORM, preservation of domain transactions, or workload performance.

### ALT-06 — Cloudflare Workers security model

- **SOURCE:** Cloudflare Workers documentation — Security model
- **URL:** https://developers.cloudflare.com/workers/reference/security-model/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Cloudflare's documented isolate design and TLS-termination boundary.
- **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke endpoint authorization, secret handling, database security, or compliance.

### ALT-07 — Render capability, recovery, networking, and current workspace price

- **SOURCE:** Render documentation and official pricing-plan announcement
- **URL:** https://render.com/docs/web-services
- **URL:** https://render.com/docs/postgresql-backups
- **URL:** https://render.com/docs/postgresql-refresh
- **URL:** https://render.com/docs/postgresql-creating-connecting
- **URL:** https://render.com/blog/better-pricing-for-fast-growing-teams
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Managed runtime support, Pro workspace price, PostgreSQL storage rate, TLS/IP controls, PITR windows, logical exports, and documented service capabilities.
- **WHAT IT DOES NOT ESTABLISH:** A complete current configured compute bill, application correctness, accepted recovery objective, or production suitability.

## 12. Next gate

If the owner later authorizes proof work, the minimum next gate is a synthetic, non-production candidate stack demonstrating:

1. exact money and quantity persistence;
2. optimistic version and/or lock behavior under conflicting inventory commands;
3. idempotent retry and duplicate submission;
4. canonical mutation, audit, idempotency outcome, and outbox atomicity;
5. least-privilege runtime and migration roles;
6. failure behavior for timeout, unknown commit outcome, and stale projection;
7. configured PITR and actual restore;
8. independent logical export and clean-instance restore; and
9. provider cost observation under a representative synthetic workload.

Until that work is explicitly authorized and passes, Neon and Vercel are **RECOMMENDED CANDIDATES**, not selected production architecture. No live Admin, database, API, credentials, catalog, inventory, deployment, pilot, or launch is authorized by this document.
