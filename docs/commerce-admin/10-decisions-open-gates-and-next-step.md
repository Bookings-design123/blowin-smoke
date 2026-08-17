# COM-ADM-01 — Decisions, Open Gates, and Next Step

**COM-ADM-01 architecture:** Complete
**Live admin system:** Not implemented
**Live inventory database:** Not implemented
**Live media pipeline:** Not implemented
**Live supplier integrations:** Not implemented
**Production implementation:** Not authorized
**Launch readiness:** Not established

## 1. Decision discipline

Architecture completion defines meaning, ownership, invariants, authority, workflows, interfaces, failure behavior, and delivery boundaries. It does not resolve business policy, legal rules, provider feasibility, production design, or real catalog truth. Each unresolved item below has one classification so that uncertainty cannot be presented as completion.

## 2. Architecture decided

| Decision | Governing consequence |
|---|---|
| One canonical commerce operational authority | Retail, wholesale, shipping, York pickup, and BSDN cannot own separate stock truth |
| Bounded logical record owners | Product, variant, inventory, price, media, evidence, supplier/receiving, order, fulfillment, identity, and audit retain distinct invariants |
| Admin as the governed operational entrance | Authorized clients issue commands; neither repository edits nor direct database writes are routine operations |
| GitHub excluded from live operational state | GitHub may contain code, schemas, migrations, releases, docs, and synthetic fixtures only |
| Product, variant, SKU, and lot/batch separated | Durable identity, sellable configuration, operational identifier, and traceable receipt grouping cannot substitute for one another |
| Exact variant/location stock position | Quantity is scoped to an exact sellable variant and owned location, with lot/dimension where material |
| Append-only inventory ledger | Every mutation is an event/entry; corrections preserve history through linked compensation |
| Exact quantity arithmetic | Integer canonical quantities plus a governed unit/dimension; no binary floating point |
| Weight and count remain distinct dimensions | Count products are not forced into mass arithmetic; incompatible dimensions never aggregate |
| Exact money arithmetic | Integer minor units plus ISO currency; no binary floating point |
| Derived available-to-promise | Physical, reserved, committed, damaged, quarantined, unsellable, safety reserve, and allocation are explicitly reconciled |
| Reservation state machine | Requested/reserved/committed/released/expired/failed outcomes use versioned, idempotent commands |
| Canonical inventory decides oversell | Stale search/storefront/admin projections cannot reserve or commit final units |
| Allocation is a constraint, not stock | Channel allocations partition or cap claims against the same physical pool and cannot mint quantity |
| Channel offers reference canonical records | Retail and wholesale visibility, price, qualification, allocation, copy, and fulfillment eligibility are independent scopes without product duplication |
| Price classes and history separated | Retail, wholesale reference, promotion, negotiated quote, and historical records cannot overwrite one another |
| Wholesale qualification preserved | At least one pound of one particular canonical strain; cross-strain aggregation and name similarity do not qualify |
| Media/evidence as governed objects | Immutable masters/documents, versions, derivatives, roles, rights, scope, review, replacement, and archive are explicit |
| Protected wholesale remains gated | Restricted payload requires an approved protected client; none is currently production approved; browser/PWA gets no protected payload |
| Evidence upload is not verification | Exact product/variant/lot/sample/time applicability and qualified review are required |
| Capability-based staff authority | There is no universal administrator; actions are authorized by capability, object, domain, channel, state, and risk |
| High-risk control hooks | Strong MFA, recent/step-up authentication, reason, owner-only capability, approval, and alert can be required without inventing thresholds |
| Required audit in write transaction | Where required, business change, audit, and outbox commit atomically; audit failure blocks the write |
| Projections are rebuildable | Retail, wholesale, search, cart, BSDN, admin, dashboard, and evidence views do not own canonical truth |
| Supplier and receipt semantics | Supplier/PO/expected receipt are future procurement truth; only verified physical receiving creates inventory ledger truth |
| Provider-neutral adapters | Provider IDs are aliases; imports cannot overwrite or auto-publish; failure is explicit; export/exit is required |
| No hard-delete convenience | Archive, unpublish, deactivate, replace, correction, retention, and legal/accounting disposition are distinct |

## 3. Owner decision required

These are business/operating decisions. Architecture must not invent them.

| Open decision | Required owner/accountable input | Safe consequence while open |
|---|---|---|
| Launch assortment and actual product types/categories/options/SKUs | Approved cross-division pilot catalog and catalog owner | No real catalog population or launch claim |
| SKU/canonical identifier convention | Catalog and operations ownership | Stable logical IDs required; final formatting deferred |
| Actual inventory location and York origin/return point | Owner and operations | No location-dependent promise activated |
| Inventory operating procedure | Receiving, inspection, reconciliation, damage, loss, shrinkage, quarantine, stocktake owners | No live stock intake |
| Stock-adjustment risk thresholds | Owner/finance/operations | Strong-control hooks exist; no invented quantity threshold |
| Safety-reserve and channel-allocation policy | Owner/merchandising/operations | No speculative allocation or ATP release |
| Reservation duration, extension, expiry, and override policy | Commerce/operations owner | State model exists; no timeout invented |
| Price authority and price-change acknowledgment | Owner/finance/commerce | No price workflow activation or silent cart acceptance |
| Retail/wholesale promotion and precedence policy | Merchandising/finance | No promotional pricing |
| Wholesale reference/negotiation/quote approval policy | Owner/wholesale sales/finance | No live quotes or reservations |
| Publication and specialist approval responsibilities | Owner/catalog/media/evidence operations | Drafts cannot auto-publish |
| Admin role assignment and separation of duties | Owner/security/operations | Least privilege required; exact staffing deferred |
| Dual-approval actions and break-glass staffing | Owner/security/finance/operations | High-risk actions remain gated or unavailable |
| Access-review cadence and joiner/mover/leaver operations | Owner/security | No production staff access |
| Supplier acceptance, field mapping, discrepancy tolerances, and PO authority | Owner/procurement/receiving | No supplier or PO activation |
| Batch/lot granularity by product role | Catalog/receiving/compliance | Required items remain pending; no fabricated batches |
| Product measurement methods, instruments, precision, and tolerance | Operations/product validation | Measurements remain unknown/unverified |
| Media production, rights, role coverage, accessibility, and archive process | Owner/media/rights | No public or protected asset publishing |
| Evidence currentness, verification, replacement, and archive policy | Qualified evidence/compliance owner | Positive proof claims and purchase use remain blocked |
| Compatibility/fit verifier coverage and review policy | Technical/product validation owners | Unknown remains unknown, never compatible |
| Fulfillment procedures | Shipping, York pickup, BSDN, returns, cancellation, release, handoff, support owners | No operational promise |
| BSDN service days, hours, rates, capacity, and operating policy | Existing BSDN business gate | BSDN architecture remains preserved but not activated |
| Accounting reconciliation/export purpose and authority | Owner/finance/accounting | No accounting integration or financial export |
| Alert thresholds, recipients, escalation, and staffing | Operations/security | Signals exist conceptually; no invented thresholds |
| SLOs, RPO/RTO, workload and support coverage | Owner/operations | No production reliability promise |

## 4. Provider / technology selection required

No choice in this section is authorized by COM-ADM-01. Candidate evaluation must test the canonical contracts instead of changing requirements to match a vendor.

- transactional database and migration/backup/recovery mechanisms;
- application framework and administrative web/app delivery architecture;
- canonical commerce/PIM/inventory platform or custom bounded modules;
- staff identity, phishing-resistant MFA, session, device-posture, and authorization technology;
- object/media/evidence storage, malware scanning, metadata extraction, image processing, 4K transcoding, streaming, and delivery;
- protected-media gateway, authorization lease, watermarking, and approved-client integration;
- search/indexing and administrative retrieval;
- cache and projection infrastructure;
- transactional outbox, event delivery, idempotency, dead-letter, replay, and monitoring;
- supplier/import adapter and mapping technology;
- accounting/reporting integration;
- payment, tax, age, eligibility, shipping/carrier, and support adapters where existing governing gates permit evaluation;
- secrets, encryption/key management, audit immutability, log redaction, alerting, and observability;
- export, portability, provider replacement, regional processing, deletion, and exit proof.

Each future provider decision must document exact fields, purpose, ownership, mappings, versioning, timeouts, retry/idempotency, classified access, subprocessors, retention/deletion, incident duty, observability, export/exit, and safe failure. Provider selection still does not authorize production implementation.

## 5. Legal / compliance required

Qualified owners must supply, approve, and version—not developers or this architecture:

- exact age, destination, product, proof, shipping, pickup, local-delivery, and wholesale rules;
- lawful bases, notices, consent, privacy rights, data minimization, retention, deletion, legal-hold, and access-audit requirements;
- evidence/COA expectations, currentness, issuer/rights, publication, claim restrictions, and archival requirements;
- staff monitoring, access review, audit retention, security incident, and account-recovery requirements;
- supplier, purchasing, product authenticity, documentation, and recordkeeping duties;
- returns, damage, loss, disposal, cancellation, refund, payment capture, tax, accounting, and financial-correction obligations;
- media licensing, maker/creator attribution, protected-content use, accessibility, captions/transcripts, and derivative rights;
- high-risk approval/separation requirements and whether managed devices are mandatory.

Unknown rule coverage and service failure never default to eligible, current, publishable, or allowed.

## 6. Implementation required after authorization

If a later gate authorizes implementation, work will still be required to:

- design and build accessible admin clients and canonical APIs;
- implement schemas, migrations, data classification, exact arithmetic, commands, queries, transactions, and audit;
- implement ledger reconciliation, reservation expiry, compensation, stocktake, receiving, and allocation;
- implement media upload/scan/derivatives/rights/access and evidence workflows;
- configure staff identity, least privilege, strong authentication, step-up, approvals, break glass, and review;
- implement adapters, projections, search, cache invalidation, outbox delivery, replay, monitoring, export, and deletion propagation;
- create synthetic tests and then controlled authoritative pilot records;
- test concurrency, oversell, idempotency, audit failure, provider outage, projection lag, protected payload denial, accessibility, backup/restore, and portability;
- complete security/privacy/compliance review and operational training;
- obtain separate pilot and launch approval.

This list is not implementation authorization.

## 7. Current owner and supplier truth

- Physical inventory: **NONE REPRESENTED / NOT PROVIDED**.
- Wholesale/distributor accounts: **NONE REPRESENTED / NOT PROVIDED**.
- Actual suppliers: **NONE REPRESENTED / NOT PROVIDED**.
- Launch products/SKUs/lots/prices/stock/COAs: **NONE CREATED BY THIS PHASE**.
- Commerce/admin/inventory/media providers: **NOT SELECTED**.
- Approved protected wholesale production client: **NONE**.

No examples in this package are operational facts.

## 8. Exact next gate

# Supplier, Merchant, Compliance, and Pilot Catalog Feasibility Intake

COM-ADM-01 preserves the exact next business gate already governed by the technical architecture. The gate must obtain:

1. supplier/account feasibility and authoritative cross-division pilot product/variant/SKU/package records;
2. merchant/payment underwriting feasibility;
3. qualified age, destination, product, proof, privacy, retention, and fulfillment rules;
4. owner decisions for receiving, inventory adjustment, reservation, allocation, price, wholesale quote, media, evidence, support, and staff authority;
5. real rights-cleared media, proof applicability, compatibility/fit, and location/operations inputs sufficient to evaluate candidates;
6. named owners and safe consequences for unresolved operating policy.

This intake is evidence and accountable decision work—not production implementation and not additional competitor research. After its exit criteria are met, a separate decision may authorize provider evaluation. Provider evaluation does not equal selection; selection does not equal implementation; implementation does not equal pilot or launch approval.

## 9. Final phase status

| Classification | Result |
|---|---|
| COM-ADM-01 logical architecture | **COMPLETE** |
| Owner operating policy | **OPEN — decisions listed above** |
| Provider/technology selection | **REQUIRED LATER — NOT AUTHORIZED** |
| Legal/compliance inputs | **REQUIRED — NOT SUPPLIED BY THIS PHASE** |
| Production implementation | **NOT AUTHORIZED** |
| Live admin/inventory/media/supplier systems | **NOT IMPLEMENTED** |
| Pilot | **NOT AUTHORIZED / NOT READY** |
| Launch | **NOT ESTABLISHED** |
