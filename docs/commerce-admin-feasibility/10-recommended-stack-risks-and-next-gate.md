# COM-ADM-02 — Recommended Stack, Risks, and Next Gate

**COM-ADM-02 feasibility:** Complete  
**Provider procurement:** Not authorized  
**Production implementation:** Not authorized  
**Pilot / launch:** Not authorized / not established

## 1. Opinionated recommended launch stack

| Required category | Recommendation | Decision condition |
|---|---|---|
| Transactional database | **Neon Launch PostgreSQL** | Standard PostgreSQL, exact relational transactions, constraints, portable dumps; configure/test recovery and least-privilege roles |
| Backend/API | **Server-only TypeScript modular-monolith command API** using supported PostgreSQL transactions | No browser database credentials or generic direct CRUD; each business write, audit, and outbox event commits atomically |
| Web Admin | **Responsive custom web Admin** | Primary complete owner surface; all authorization remains server-side |
| iPhone Admin | **Thin native SwiftUI companion** | Barcode/QR, camera/media, receiving/stocktake, selected approvals, and App Attest; shares API/contracts, not a second domain system |
| Mac/Desktop Admin | **Safari Add-to-Dock web app on macOS Sonoma 14+** | Cloudflare Access/WARP plus canonical device admission; remains a browser client |
| Authentication/MFA | **Auth0 Essentials** | Owner uses a PIN/user-verifying FIDO2 roaming security key; fresh explicit step-up for high-risk commands |
| Approved-device control | **Application-owned `AdminDevice` registry** + **Cloudflare Zero Trust Access/WARP** for web/Mac + **App Attest** for native iPhone | Layered signals only; unknown/stale/revoked/unsupported denies; no perfect-integrity claim |
| Object storage | **Private Amazon S3** quarantine and canonical immutable-key masters | Block Public Access, multipart/checksums, versioning, scanning workflow, KMS/least privilege, independent backup/exit |
| Image pipeline | **Cloudflare Images** for approved derivatives from private masters | Never sole master; public and protected namespaces/policies separated |
| 4K video pipeline | **Mux** for approved 4K derivatives/streaming after quarantine validation | Keep exact canonical input separately; signed playback/DRM does not satisfy protected-client capture gate |
| Search | **PostgreSQL full-text search + `pg_trgm`** | Rebuildable/read projection only; final price, stock, compatibility, eligibility return to canonical state |
| Cache | **No external cache at launch** | Public-safe HTTP/CDN caching only; add managed Redis later only after measured need and non-authoritative contract |
| Audit | **Append-only application audit and transactional outbox in PostgreSQL** | Required audit failure blocks the business write; telemetry/provider logs never substitute |
| Backups | **Neon time travel + encrypted scheduled `pg_dump` to a separate AWS account/bucket with S3 Object Lock** | Set RPO/RTO, monitor heartbeat, restore-test, and reconcile audit checkpoints |
| Observability | **Sentry Team** | Strict source/server scrubbing; no credentials, private media, order payloads, protected wholesale, or unnecessary PII |
| Barcode/QR | **VisionKit iPhone scanning**, manufacturer UPC/EAN/GTIN preservation, internal Code 128, purpose-bound QR | Manual accessible fallback; scans resolve server records and never authorize a write by themselves |
| Label printing | **Versioned PDF + ZPL generation**; benchmark a **300-dpi network thermal printer** | Zebra ZD421 class benchmark; Brother QL-1110NWB alternative; purchase only after real-media test |
| POS | **Custom online-first Blowin' Smoke POS surface over the canonical API** | Same inventory/order/audit truth; payment terminal is a later replaceable, underwritten adapter; no offline commitment at launch |
| Accounting | **QuickBooks Online Essentials adapter** | Canonical Admin owns stock/PO/receipt/lot cost; QBO owns accounting; accountant mapping and reconciliation proof required |
| Deployment | **Vercel Pro** | Managed immutable deployments/rollback; representative transaction/runtime tests required |

## 2. Why this stack fits Blowin' Smoke

1. **It protects operational truth.** PostgreSQL transactions and constraints fit the exact inventory ledger, exact money, reservations, receiving, pricing history, audit, and outbox model without splitting authority.
2. **It remains custom where custom matters.** Blowin' Smoke owns the owner workflow, rules, information architecture, three-division product logic, POS, and commerce behavior while managed providers handle commodity infrastructure.
3. **It is proportionate.** Under 100 products and one initial owner do not justify distributed microservices, a search cluster, Redis, three full client applications, or enterprise warehouse software.
4. **It takes approved devices seriously.** Identity, endpoint admission, native attestation, session state, and high-risk command authorization are layered and revocable rather than reduced to a cookie or user-agent claim.
5. **It gives media a safe lifecycle.** Exact originals remain privately owned and exportable; scanning/validation precede derivatives; specialist image/video systems do not become the only copy.
6. **It supports physical retail without a second inventory.** Barcode, labels, receiving, POS, orders, and accounting connect through canonical commands and adapters.
7. **It is operable and replaceable.** Standard PostgreSQL, HTTP contracts, canonical IDs, transactional outbox, independent media masters, provider adapters, and exports constrain lock-in.
8. **It preserves security honesty.** No Admin browser, signed URL, DRM feature, WARP signal, passkey, or App Attest result is misrepresented as an approved Private Wholesale protected client.

## 3. Why the main alternatives were not selected

| Alternative | Why it remains secondary or rejected |
|---|---|
| Supabase as combined database/auth/storage/backend | Operationally attractive, but generated CRUD cannot be the command boundary; daily backup/PITR economics and Storage backup/versioning limits weaken the chosen recovery/media posture. It remains a viable PostgreSQL alternative with explicit server commands |
| Cloudflare Workers as command API | Lower baseline price and strong managed edge runtime, but exact selected driver/ORM transactions, CPU/runtime limits, retry behavior, and failure semantics need representative proof before replacing the straightforward Node/Vercel path |
| Render application + PostgreSQL | Credible portable managed option, but the complete current launch compute bill was not established from the captured official pricing evidence |
| WorkOS AuthKit | Strong economics and passkeys, but practical branded passkey use adds custom-domain cost, roaming-key enforcement evidence is less direct, and complete credential/passkey exit is not established |
| Clerk | Lower price and useful device/session tooling, but documented convenience reverification may downgrade an unavailable stronger assurance level unless custom fail-closed enforcement replaces it |
| Cloudflare R2 canonical masters | Excellent egress economics and S3 tooling, but lacks S3-equivalent object versioning, replication, Object Lock, KMS, and established native malware scanning; viable after compensating controls and restore proof |
| Supabase Storage canonical masters | Good resumable uploads, but object bytes are outside database backups, no native object versioning was established, and signed/CDN behavior weakens revocation as the sole protected path |
| Cloudinary | Rich DAM/derivative operations and a free tier, but the reviewed paid DAM tiers are $99/$249 monthly before annual discounts and add transformation/workflow lock-in; those paid capabilities are unnecessary for the launch owner profile |
| Bunny Stream | Compelling 4K price and resumable upload; remains a controlled proof challenger because the selected pipeline prioritizes mature managed video operations and clearer evidence |
| Cloudflare Stream | Documented output ceiling is 1080p, so it does not meet required 4K delivery |
| Algolia | Mature managed search, but creates a new projection, credential, synchronization, cost, and scraping surface with little value below 100 products |
| External Redis | No demonstrated launch need; risks stale authority and additional failure/security surface |
| Shopify/Square/Lightspeed as canonical POS | Their catalog/inventory/order workflows would duplicate COM-ADM authority. Merchant/payment eligibility for the actual mixed catalog is also not established |
| QuickBooks Plus as operational inventory | Useful accounting plan, but duplicating PO/inventory creates reconciliation ambiguity. Upgrade only for an accountant-approved need while keeping it subordinate |
| Native Mac/Electron application | No current requirement justifies a third client or wrapper. A wrapper alone does not establish stronger endpoint integrity |
| Self-hosting | Conflicts with the owner's managed reliability/security preference and increases patching, recovery, monitoring, and incident burden |

## 4. Principal risks and mitigations

| Risk | Required mitigation / evidence before pilot |
|---|---|
| Database or command race oversells inventory | Serializable/locking strategy, exact invariants, idempotency, stale-version rejection, concurrent reservation/commit tests, and reconciliation |
| Serverless retry or timeout causes duplicate/partial work | One database transaction, stable idempotency key/result, bounded duration, outbox delivery, and forced-failure tests |
| Neon Launch lacks private networking/IP allow rules/SLA | Server-only credentials, TLS verification, least-privilege roles, rotation, runtime/migration/backup role separation, monitoring, support/plan re-evaluation |
| Backup exists but cannot restore | Configure recovery window; scheduled off-provider export; restore drills; measured RPO/RTO; alert and audit-checkpoint reconciliation |
| Owner loses every factor/device | Two hardware keys, separated recovery codes, explicit break-glass authority/runbook, cooling-off/notification, global revocation, and tested reenrollment |
| WARP/App Attest/MDM is treated as perfect integrity | Preserve layered risk-signal language and application-owned device states; deny unknown, stale, revoked, unsupported; document compromised-device limitation |
| Identity provider becomes authorization owner | Keep roles/capabilities/device records and object authorization in canonical PostgreSQL; Auth0 establishes identity/factor claims only |
| Media bypasses quarantine or leaks metadata | Single-purpose upload grants, private quarantine, checksum/magic-byte/decoder/malware validation, metadata review/stripping, immutable promotion, no public original |
| Signed URLs/DRM are misrepresented as wholesale protection | Keep D3 payload blocked until the separate approved-client gate passes; bearer delivery controls do not prove trusted device or capture exclusion |
| Third-party projection becomes stale authority | Final command rereads canonical price, eligibility, compatibility, inventory, account, and device state |
| Accounting drift | Versioned mapping, outbox, idempotency, signed webhook verification, change-data reconciliation, mismatch queue, accountant-approved close process |
| POS/provider duplicates inventory or payment becomes unavailable | Custom same-authority POS; provider alias only; explicit online-required failure; separate merchant underwriting and terminal proof |
| Provider exit fails | Standard SQL/migrations, `pg_dump`, canonical S3 masters, exported provider aliases/settings, adapter boundaries, and scheduled exit drills |
| Cost expands through media/telemetry | Budgets, quotas, alerts, lifecycle/retention rules, representative load model, and immediate pre-procurement repricing |

## 5. Open gates

### Provider and implementation proof

- confirm accounts, regions, legal terms, DPAs/subprocessors, retention, support, current prices, spend alerts, and account ownership;
- prove database isolation/locking, exact arithmetic, command idempotency, audit/outbox atomicity, migration, rollback, and provider outage behavior;
- execute backup/PITR/logical-export/independent-object restore drills and approve measured RPO/RTO;
- prove Auth0 factor policy, explicit high-risk step-up, session/token revocation, identity export, and failure behavior;
- prove Cloudflare WARP enrollment/revocation/bypass handling and application-device binding;
- prove App Attest enrollment, reinstall/migration, unsupported device, nonce/replay, stale build, revocation, and accessibility behavior;
- run iPhone/desktop interrupted media uploads, malformed/spoofed/malware tests, metadata stripping, 4K quality/captions, revoke, backup, and provider exit;
- test label stock/printers/scanners/receipts/cash drawer and accessibility with representative packages;
- prove POS transaction/payment-webhook/retry/correction behavior and obtain actual-catalog merchant underwriting;
- obtain accountant approval and prove accounting mappings, reconciliation, correction, and export/exit;
- validate deterministic reorder formulas with controlled authoritative history.

### Business, legal, and operating authority

- qualified age/product/destination/tax/privacy/retention/shipping/pickup/BSDN/return rules;
- authoritative pilot catalog, supplier documents, product identifiers, package/lot truth, costs, media rights, and evidence;
- approved receipt, stocktake, correction, reservation, allocation, price, PO, cash, close, support, incident, and recovery procedures;
- named account/security/recovery authority and a tested all-devices-lost process;
- approved inventory-cost/accounting method and financial controls.

### Separate protected-wholesale gate

No selected Admin technology approves a production protected-wholesale client. Protected content remains denied to browser/PWA and every unapproved client. Media tokens, DRM, watermarking, WARP, MFA, and App Attest do not replace the existing capture/extraction/resource/device/accessibility acceptance gate.

## 6. Exact next gate

# COM-ADM-03 — Controlled Implementation Plan and Proof Specification

The next phase may define, without deploying production:

1. provider account/region/configuration decision records and procurement checks;
2. schema/migration/API contract plan mapped to COM-ADM-01;
3. exact transaction, concurrency, exact-money, audit, outbox, and recovery proof harnesses;
4. identity/device enrollment, revocation, recovery, and high-risk step-up proof plan;
5. media quarantine/validation/derivative/backup/exit proof plan;
6. POS/accounting/peripheral adapter contracts and underwriting/financial gates;
7. accessibility, privacy, security, observability, incident, RPO/RTO, pilot, and rollback acceptance matrices;
8. cost revalidation and staged procurement approval.

COM-ADM-03 is a plan/proof gate only unless a later owner instruction explicitly authorizes implementation. Provider recommendation does not authorize account creation, code, deployment, data population, pilot, or launch.

## 7. Final status

| Classification | Result |
|---|---|
| COM-ADM-02 provider/technology feasibility | **COMPLETE** |
| Opinionated launch stack | **SELECTED FOR LATER PROOF** |
| Provider procurement | **NOT AUTHORIZED** |
| Production code | **NOT CREATED OR CHANGED** |
| Production implementation | **NOT AUTHORIZED** |
| Live Admin/inventory/media/POS/accounting integration | **NOT IMPLEMENTED** |
| Pilot | **NOT AUTHORIZED** |
| Launch readiness | **NOT ESTABLISHED** |
