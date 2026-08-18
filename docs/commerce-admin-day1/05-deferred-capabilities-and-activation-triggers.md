# COM-ADM-02A — Deferred Capabilities and Activation Triggers

**Rule:** Deferral preserves the destination contract; it does not authorize build, procurement, or enablement
**Trigger type:** Operational evidence, not calendar date
**Production implementation:** Not authorized

## 1. Activation rule

A trigger opens a focused evidence/proof decision. It does not automatically buy a plan or ship a feature. Activation requires:

1. recorded evidence that the trigger occurred;
2. confirmation that the Day-1 path cannot satisfy the requirement safely;
3. current pricing, terms, data-handling, security, recovery, accessibility, and exit review;
4. representative success, failure, revocation, and rollback proof;
5. explicit owner authorization for build/procurement/enablement;
6. no change to canonical commerce ownership.

## 2. Complete deferred-capability register

| Deferred capability | Preserved destination contract | Concrete activation trigger | What activation must not change |
|---|---|---|---|
| Cloudflare Access/WARP | Edge identity/posture signal linked to canonical `AdminDevice` | Second Admin actor; staff/BYOD/remote endpoints; insurer/compliance posture mandate; or incident/proof shows browser registration insufficient | Application actor/device/capability authorization remains final; WARP never becomes perfect integrity |
| Native SwiftUI iPhone Admin | Shared command API, media and scan adapters, native attestation hook | Browser scanning/receiving/stocktake/upload/peripheral workflow fails measured operational acceptance, or native attestation becomes mandatory | No second domain model, offline inventory authority, or private-wholesale conflation |
| Apple Developer Program | Native signing/test/distribution boundary | Native iPhone build or device-test work is separately authorized | Membership does not authorize production app or launch |
| App Attest | App-instance signal bound to `AdminDevice` | Native iPhone Admin is activated and server-verified app-instance attestation is an approved control | App Attest is one signal; unknown/unsupported fails closed; no perfect-compromise claim |
| MDM / Managed Device Attestation | Managed fleet, configuration, certificate/attestation lifecycle | Staff fleet, remote-erasure/configuration need, or explicit compliance/insurance control | MDM evidence does not replace owner identity, capability, command, or audit checks |
| Vercel/Next Image Optimization service | Optional replaceable image-delivery adapter over canonical fixed recipes | Fixed derivatives become operationally inadequate and a second cache's unpublish/revocation behavior passes proof | Never receive a master/evidence URL or become the only derivative copy |
| Cloudflare Images | Replaceable derivative-processor interface; canonical S3 master and recipe | Fixed-derivative cost/volume, overlays/private variants, or multi-client delivery requirements are measured and revocation proof passes | Never become sole master; provider state remains rebuildable and exportable |
| Mux | Replaceable video-processor/playback adapter; canonical S3 source | Accepted production asset needs 4K/adaptive streaming, managed HEVC/ProRes normalization, generated captions/thumbnails, or progressive MP4 fails measured playback | Never become canonical original; signed playback/DRM is not protected-client approval; accessible text remains required independently |
| External search | Rebuildable projection carrying source version and lag | Measured PostgreSQL retrieval relevance, merchandising, typo tolerance, or latency remains inadequate after index/query tuning | Search cannot authorize price, stock, eligibility, compatibility, or order state |
| External Redis/cache | Disposable keyed value with source version/expiry and bypass path | Measured DB/API load remains unacceptable after query/index/transaction tuning and a non-authoritative cache proof succeeds | No inventory, reservation, order, price, authorization, audit, or irreplaceable job truth |
| Sentry Team paid | Scrubbed telemetry adapter with event budget and export/retention rules | Second telemetry operator; >5,000 monthly errors; required API/integration; free retention inadequate; or incident cannot be diagnosed before context expires | No credentials, full orders, COAs, private media, protected content, or business-audit ownership |
| Vercel Observability Plus | Hosting-native diagnostics/alerts | Need for Vercel anomaly alerts/longer runtime logs is proven and preferred to the Sentry upgrade | Still diagnostic only; no canonical audit or sensitive payload capture |
| VisionKit | Native code-scanning adapter with manual accessible fallback | Native iPhone Admin activates and tested scanning materially improves receiving/stocktake | Scan resolves a server record; it never authorizes a mutation |
| Browser/native barcode scanning | Identifier resolution endpoint and explicit command preview | Real receiving/stocktake volume makes manual entry error-prone or too slow and exact client capability passes proof | Manufacturer code is preserved; unknown/duplicate/wrong-purpose code fails; manual fallback remains |
| PDF/ZPL label generation | Versioned template/render/print-event adapter | Internal SKU/lot/bin labels are operationally required and exact content/size/compliance rules are approved | Label/reprint does not create stock, identity, evidence, or current price truth |
| Label printer / dedicated scanner | Replaceable peripheral adapter | Approved label stock/dimensions/volume or scan volume exists and representative hardware passes compatibility/readability/accessibility testing | Hardware never bypasses command confirmation, authorization, or audit |
| Custom POS | Same command API, canonical cart/order/reservation/inventory/audit, replaceable terminal adapter | Before physical counter sales begin, after mixed-catalog merchant underwriting and end-to-end transaction proof | No second catalog/inventory; payment result alone never commits or repairs stock |
| Purchase-order workflow | Canonical supplier/PO/expected-receipt/receiving/discrepancy model | Recurring supplier ordering, approvals, expected receipts, partials, or discrepancy reconciliation make receipt-only operation inadequate | PO is not on-hand stock; receiving remains the only physical-stock creation event; receipt without PO stays explicit/audited |
| QuickBooks integration/subscription | Versioned outbox mapping, idempotency, reconciliation, correction, export | Accountant approves target/mapping and manual export is no longer adequate for actual close/tax workflow | QuickBooks remains accounting destination, not inventory/PO/product authority |
| Advanced reorder automation | Versioned recommendation inputs/output, backtest and owner approval | Enough clean demand, receipt, supplier lead-time, stockout, cancellation, and seasonality history exists to backtest materially better decisions | No automatic PO submission; unknown inputs block recommendation; owner approval remains |

## 3. Removed path

`REMOVE_FROM_RECOMMENDED_PATH` means the component is not merely waiting for ordinary launch volume. A new concrete requirement must first establish why the architecture needs it.

| Removed component | Reason | Reconsideration condition |
|---|---|---|
| Native Mac application/wrapper | Responsive/installable Web Admin already supplies the complete desktop surface; a wrapper alone adds release/security burden without stronger trust | A Mac-only peripheral, background, offline, sandbox, or security property is documented and cannot be met by the web surface |
| Application-owned identity/WebAuthn server | Reimplements managed challenge, credential, recovery, session, abuse, migration, monitoring, and incident responsibility | Only after a separate security review proves managed identity cannot satisfy a required property and funds long-term ownership |
| R2 as Day-1 canonical media authority | Current reviewed fit lacks the selected S3 versioning/Object Lock/KMS/replication/malware workflow equivalents without compensating work | A measured cost/exit problem justifies the compensating security, recovery, and migration proof |

## 4. Day-1 data captured for future activation

Deferral must not create a future data gap. Day 1 records:

- stable product, variant, SKU, manufacturer identifier aliases, and opaque internal code values;
- exact receipts, quantities, inventory events, reservations, commitments, stockouts, cancellations, returns, and fulfillment times;
- supplier, supplier-product reference, received unit cost, pack/unit mapping, receipt date, discrepancy, and lead-time evidence;
- retail/wholesale price and effective history;
- media checksum, technical metadata, derivative recipe, rights, assignment, and publication history;
- evidence issuer, subject, product/SKU/lot applicability, effective/expiry/review state, and successor lineage;
- outbox delivery, projection lag, diagnostic correlation, backup freshness, and restore results;
- owner-approved manual reorder threshold and the action taken on each low-stock signal.

Clean history permits later capability. It does not permit invented forecasting, compatibility, accounting, or evidence truth.

## 5. Activation sequencing

When multiple triggers occur, sequence work by business failure, not vendor appeal:

1. protect identity, canonical data, recovery, and transaction integrity;
2. resolve the specific owner workflow blocker;
3. activate the smallest bounded adapter that removes it;
4. measure the result and cost;
5. retain rollback and provider exit;
6. update this activation registry without rewriting COM-ADM-01 history.

No deferred component has a scheduled activation date. “We may need it later” is not evidence.
