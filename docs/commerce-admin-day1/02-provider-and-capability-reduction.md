# COM-ADM-02A — Provider and Capability Reduction

**Decision type:** Day-1 activation overlay; COM-ADM-01 and COM-ADM-02 remain architectural history
**Classification vocabulary:** `DAY_1_REQUIRED`, `DAY_1_SIMPLIFY`, `DEFER_UNTIL_TRIGGER`, `REMOVE_FROM_RECOMMENDED_PATH`
**Provider accounts created:** None

## 1. Reduction decision

Day 1 uses four paid or metered core providers:

1. **Neon** for managed PostgreSQL;
2. **Vercel** for the commercial responsive Admin, website, and server-only command API;
3. **Auth0** for owner identity and phishing-resistant MFA;
4. **AWS** for private media/evidence storage, malware scanning, delivery from private origins, and the independently controlled database archive.

PostgreSQL absorbs search, audit, outbox, low-stock state, and canonical reporting inputs. The responsive Admin replaces separate iPhone and Mac applications for non-protected operations. It does not replace the separately gated protected-wholesale client. AWS supplies multiple bounded services without adding another vendor. **Sentry Developer is a fifth, free-with-limits monitoring provider** for narrow diagnostics and alerts; it is not a paid Day-1 commitment or business audit system.

## 2. Complete activation matrix

Every named COM-ADM-02 component receives exactly one classification. “Provision” and “enable” describe what a separately authorized pilot would require; nothing is provisioned or enabled by this document.

| Component | Exact classification | Designed | Day-1 build? | Day-1 provision? | Day-1 enable? | Decision / activation trigger |
|---|---|---:|---:|---:|---:|---|
| Neon Launch PostgreSQL | `DAY_1_REQUIRED` | Yes | Yes | Yes | Yes | Removing it removes canonical transactions, constraints, recovery history, and commerce truth |
| Vercel Pro | `DAY_1_REQUIRED` | Yes | Yes | Yes | Yes | Removing it leaves no approved commercial Admin/API/website execution and rollback surface |
| Auth0 Essentials | `DAY_1_REQUIRED` | Yes | Yes | Yes | Yes | Removing it leaves no currently selected, documented roaming-key MFA and factor-specific step-up service |
| Cloudflare Zero Trust Access/WARP | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate for second operator/staff/BYOD, endpoint-posture mandate, insurer/compliance requirement, or demonstrated inadequacy of the simplified registry |
| Responsive custom Web Admin | `DAY_1_REQUIRED` | Yes | Yes | Included in Vercel | Yes | It is the complete iPhone and Mac/desktop owner surface, except any D3/D4 wholesale operation that remains `CLIENT_REQUIRED` |
| Application-owned `AdminDevice` registry | `DAY_1_SIMPLIFY` | Yes | Yes | Included in Neon/Vercel | Yes | Required revocable browser-continuity boundary; it does not claim hardware integrity |
| Protected wholesale reference-price and sensitive visibility command | `DAY_1_REQUIRED` | Yes | Server/API contract only | Approved protected client blocked | No | COM-ADM-01 requires `CLIENT_REQUIRED`; enable only after exact non-protected classification approval or an approved protected client |
| Native SwiftUI iPhone Admin | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate when browser scanning, receiving, upload, peripherals, or native attestation is proven operationally inadequate |
| Native Mac application/wrapper | `REMOVE_FROM_RECOMMENDED_PATH` | Interface boundary only | No | No | No | Responsive/installable Web Admin already satisfies the surface; reconsider only for a concrete OS/peripheral requirement |
| Apple Developer Program | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate when native Apple build signing, device testing, or distribution begins |
| Apple App Attest | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate with native iPhone Admin or an approved need for native app-instance attestation |
| Apple MDM / Managed Device Attestation | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate for a managed staff fleet, enforced configuration/remote erase, or explicit insurer/compliance requirement |
| Amazon S3 | `DAY_1_REQUIRED` | Yes | Yes | Yes | Yes | Removing it removes canonical media/evidence quarantine, masters, and independent database archive storage |
| Cloudflare R2 as canonical media store | `REMOVE_FROM_RECOMMENDED_PATH` | Exit/alternative boundary only | No | No | No | Reconsider only if measured S3 cost/exit evidence outweighs compensating version, malware, recovery, and security work |
| GuardDuty Malware Protection for S3 | `DAY_1_REQUIRED` | Yes | Yes | Yes | Yes | Required fail-closed malware result for new upload objects; parser/decode validation remains separate |
| CloudFront OAC delivery | `DAY_1_SIMPLIFY` | Yes | Yes | Same AWS account | Yes | Private S3 origin and bounded public derivative delivery without another vendor; execution/cost proof required |
| Application-owned fixed image derivatives + responsive `srcset` | `DAY_1_SIMPLIFY` | Yes | Yes | Included in AWS/Vercel | Yes | One controlled derivative recipe and one CloudFront cache boundary; Vercel transformation cache is not required |
| Vercel/Next Image Optimization service | `DEFER_UNTIL_TRIGGER` | Yes | No — interface boundary only | No | No | Activate only if fixed derivatives become operationally inadequate and cache/revocation proof passes |
| Cloudflare Images | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate when fixed-derivative cost/volume, overlays, private variants, or multi-client delivery demonstrate need and revocation proof passes |
| Mux | `DEFER_UNTIL_TRIGGER` | Yes | No — adapter boundary only | No | No | Activate for a real 4K/adaptive stream, managed HEVC/ProRes normalization, generated caption/thumbnail workflow, or failed progressive-MP4 proof |
| PostgreSQL FTS + `pg_trgm` | `DAY_1_SIMPLIFY` | Yes | Yes | Included in Neon | Yes | Basic catalog/Admin retrieval inside PostgreSQL; final commerce operation rereads canonical state |
| External search | `DEFER_UNTIL_TRIGGER` | Yes | No — adapter boundary only | No | No | Activate only after measured relevance/merchandising/latency remains inadequate after SQL/index tuning |
| External Redis/cache | `DEFER_UNTIL_TRIGGER` | Yes | No — adapter boundary only | No | No | Activate only after measured load remains unacceptable and a disposable, non-authoritative cache contract passes proof |
| PostgreSQL application audit/outbox | `DAY_1_REQUIRED` | Yes | Yes | Included in Neon | Yes | Material command, audit, and outbox must commit atomically; provider logs cannot replace it |
| Independent logical backup archive | `DAY_1_SIMPLIFY` | Yes | Yes | Same AWS provider, separate account/bucket/credentials | Yes | Nightly encrypted `pg_dump`, checksum/manifest, Object Lock, monitored freshness, and tested restore; no enterprise multi-region program |
| Sentry Developer | `DAY_1_SIMPLIFY` | Yes | Yes | Required free account at later authorized gate | Yes | Server/worker-only narrow errors, one liveness monitor, and one aggregate operations pulse; no browser SDK, replay, or sensitive payloads |
| Amazon SES owner security notifications | `DAY_1_SIMPLIFY` | Yes | Yes | Included in AWS; metered | Yes | Preverified security destination, minimized content, durable notification outbox, bounce/failure visibility, and delivery proof |
| Sentry Team paid | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate for second telemetry user, free-limit exhaustion, required integrations/API, inadequate retention, or failed incident diagnosis |
| Vercel Observability Plus | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate when Vercel-native anomaly alerts/longer runtime logs are proven necessary and preferred to the Sentry upgrade |
| VisionKit | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Native-only; activate with native iPhone scanning workflow |
| SKU/UPC/EAN/GTIN/barcode/QR data | `DAY_1_SIMPLIFY` | Yes | Yes | Included in Neon; no hardware | Yes | Store authoritative aliases and internal opaque identifiers; manual search/entry is the Day-1 input method |
| Browser/native scanning workflow | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate after real receiving/stocktake volume proves manual entry inadequate and exact client scanning passes proof |
| Versioned PDF/ZPL label generation | `DEFER_UNTIL_TRIGGER` | Yes | No — adapter boundary only | No | No | Activate when internal labels are operationally required and real templates/media pass scan and compliance tests |
| Label printer/dedicated scanner hardware | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Procure only after label dimensions/media/volume and peripheral compatibility are known |
| Custom POS | `DEFER_UNTIL_TRIGGER` | Yes | No — API boundary only | No | No | Build before physical counter sales begin, after terminal/merchant underwriting and transaction proof |
| Purchase-order workflow | `DEFER_UNTIL_TRIGGER` | Yes | No — domain boundary only | No | No | Activate when recurring supplier ordering, approval, expected-receipt, or discrepancy reconciliation is operationally required; audited receipt without PO remains explicit |
| QuickBooks integration/subscription | `DEFER_UNTIL_TRIGGER` | Yes | No — export/adapter boundary only | No | No | Activate when accountant-approved automated posting/reconciliation is operationally required |
| Manual reorder threshold + low-stock signal | `DAY_1_SIMPLIFY` | Yes | Yes | Included in Neon | Yes | Owner-controlled threshold and queue only; preserve clean sales, supplier, cost, receipt, and inventory history |
| Advanced reorder automation/forecasting | `DEFER_UNTIL_TRIGGER` | Yes | No | No | No | Activate after sufficient clean sales and supplier lead-time history supports backtesting and owner-approved recommendations |

## 3. Provider decisions and alternatives

| Category | Day-1 choice | Re-evaluated alternatives | Reduction conclusion |
|---|---|---|---|
| Database | Neon Launch | Supabase Pro, Render PostgreSQL, larger cloud-managed PostgreSQL | Keep Neon. Standard PostgreSQL, metered small-load economics, scale-to-zero, and seven-day restore history fit the fixed profile. Alternatives remain destination contingencies, not launch providers |
| API/hosting | Vercel Pro | Cloudflare Workers, Render service, self-hosting | Keep Vercel. Hobby is not the commercial plan; managed deployment/rollback and one web codebase reduce operations. Provider portability remains a proof requirement |
| Identity | Auth0 Essentials | Auth0 Free, WorkOS AuthKit, Clerk Pro, application-owned WebAuthn | Keep Essentials. Lower-cost options do not currently establish the same fail-closed roaming-key MFA and factor-specific sensitive-action path at lower total risk/cost |
| Device edge | Application `AdminDevice` only on Day 1 | Cloudflare Access/WARP, MDM, App Attest, mTLS | Simplify. One owner gets revocable browser continuity, not a false hardware-integrity claim. Stronger layers activate with workforce/risk/native-client evidence |
| Canonical object storage | Private S3 | R2, Supabase Storage | Keep S3. It reuses one provider for quarantine, versioning, malware workflow, evidence, delivery origin, and database archive. R2 remains an exit/cost alternative, not canonical Day-1 authority |
| Image pipeline | Fixed sanitized derivative set + CloudFront + responsive `srcset` | Vercel/Next optimizer, Cloudflare Images, Cloudinary | Use one delivery cache and defer specialist/on-demand transformation. Canonical masters and derivative recipes remain portable |
| Video pipeline | Validated progressive H.264/AAC MP4 | Mux, Bunny Stream, Cloudflare Stream | Defer managed processing until a real format, adaptive, or 4K need; unsupported uploads remain unpublished |
| Search/cache | PostgreSQL FTS/`pg_trgm`; no cache | Algolia, Upstash/Redis | Use built-in PostgreSQL; add no projection/provider until measured evidence |
| Observability | Vercel + Neon diagnostics and Sentry Developer | Sentry Team, Vercel Observability Plus, Better Stack | Paid telemetry defers, but free proactive liveness/ops alerts prevent operating blind |
| Accounting | Canonical COGS plus governed export readiness | QuickBooks, Xero, Zoho | Capture financial inputs now; activate one accountant-approved destination later without giving it inventory authority |
| POS/peripherals | Canonical API readiness | Generic POS inventory, custom POS now, printers/scanners now | Defer user interfaces and hardware until physical operations; never create a second stock authority |

### Current evidence revision

Current Clerk documentation improves its baseline relative to COM-ADM-02: current instances can treat passkeys as satisfying MFA. It still does not support passkeys in its documented reverification flow, and that flow can downgrade requested assurance in documented circumstances. The Day-1 Auth0 decision therefore does not change.

## 4. Provider-consolidation boundaries

Consolidation is permitted only where authority remains clear:

- Vercel may host Admin, storefront projection, server commands, and basic diagnostics. It does not own products, inventory, audit, media masters, or the Day-1 public-derivative cache.
- Neon may own canonical business records, search indexes, audit, outbox, low-stock signals, and reporting inputs. It does not become an identity provider or object store.
- AWS may store canonical media/evidence, operate upload scanning, deliver approved public derivatives through a private-origin CDN, and hold encrypted database archives in a separate credential boundary. Delivery caches and backup copies do not become business authority.
- Auth0 may establish identity and authentication evidence. Roles, capabilities, device state, object authorization, and command outcome remain canonical application state.
- Sentry may receive minimized diagnostic events. It never receives credentials, complete orders, COAs, private media, protected-wholesale content, or canonical audit responsibility.

## 5. What is deliberately not cut

The following remain Day-1 implementation/proof scope even though they do not add providers:

- exact schema and transaction constraints;
- inventory ledger, reservations, and oversell protection;
- retail/wholesale channel state;
- supplier, receipt cost, COGS, and margin inputs;
- server-side authorization and high-risk command step-up;
- media/evidence quarantine, validation, version, rights/scope, and publication state;
- append-only audit and transactional outbox;
- website projection freshness/reconciliation;
- provider recovery, independent export, monitoring, and restore test;
- accessible error, recovery, and mobile/desktop owner workflows.

These are product correctness, not optional SaaS features.
