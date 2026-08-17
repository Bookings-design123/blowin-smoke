# COM-ADM-02 — Owner Profile and Evaluation Criteria

**Phase:** Technology, provider, and implementation feasibility  
**Governing base:** `e241ce89520dc05fe3bf0f4aa9cf9f8df37aa9e2`  
**Evidence currency date:** 2026-08-17  
**Status:** Technology recommendation complete; implementation not authorized

## 1. Fixed owner profile

This feasibility decision treats the following inputs as authoritative. They are business requirements, not provider defaults.

| Area | Fixed input | Technology consequence |
|---|---|---|
| Initial operators | Owner only | Optimize for one accountable operator without weakening future role separation |
| Surfaces | Web, iPhone, and Mac/desktop | One shared command API; web-first full Admin; focused native iPhone companion; installed Mac web surface |
| Endpoint policy | Personal and unapproved devices prohibited | Identity authentication and application-owned device admission are separate, fail-closed gates |
| Sensitive work | Approved devices and strong MFA required | Phishing-resistant MFA, recent step-up, device revocation, and command authorization are mandatory |
| Catalog | Under 100 products | PostgreSQL-native search is sufficient; no search cluster or external cache at launch |
| Inventory | One York, Pennsylvania location; typically one active batch per product | Preserve the complete multi-location, lot-aware model without buying enterprise warehouse tooling |
| Operations | POs, COGS, supplier price history, labels, barcode/QR, and POS | Custom Admin remains canonical; accounting and payment/POS products are adapters only |
| Media | iPhone and desktop photo/video upload, including high-resolution media and 4K video | Resumable direct upload, quarantine, validation, immutable masters, derivatives, and independent exit are required |
| Infrastructure preference | Reliability and managed operations over lowest possible cost | Select proven managed commodity services; avoid self-hosting and premature distributed infrastructure |
| Admin experience | Custom-tailored to Blowin' Smoke | Build the owner workflow, not custom database/auth/storage/transcoding infrastructure |
| Accounting | Integration required | Preserve canonical operational truth; post mapped financial records to an accounting system and reconcile |
| Reorder | Automatic intelligence required | Begin with deterministic thresholds and inventory math; forecasting waits for sufficient clean history |
| Physical retail | POS planned now | Use the same catalog, pricing, order, reservation, inventory ledger, and audit authority |

## 2. Governing architecture compatibility

COM-ADM-01 remains authoritative. Provider selection may implement its boundaries but may not change them.

1. PostgreSQL is the one canonical operational data authority for the recommended stack.
2. Product, variant, SKU, lot, inventory, reservation, price, offer, media, evidence, supplier, purchase order, order, fulfillment, identity, device, and audit remain separate governed records.
3. Inventory and money use exact representations; binary floating point is prohibited.
4. A business mutation, required audit event, and outbox event commit atomically.
5. Search, cache, dashboards, accounting, media processors, POS peripherals, and storefronts are projections or adapters, never alternate authorities.
6. Provider IDs are versioned aliases. Provider outage or replacement cannot redefine canonical identity.
7. Unknown, stale, unsupported, revoked, or failed security state denies the affected operation.
8. No browser or ordinary Admin decision satisfies the separate Private Wholesale protected-client gate.

## 3. Weighted evaluation criteria

The following weights govern comparative decisions. A lower-cost provider does not win by price alone.

| Criterion | Weight | Required interpretation |
|---|---:|---|
| Reliability and recoverability | 16 | Managed operation, documented failure behavior, backup capability, and testable restore/exit |
| Security and privacy | 16 | Least privilege, strong authentication, encryption, revocation, redaction, and fail-closed integration |
| COM-ADM-01 correctness | 15 | Exact transactions, constraints, canonical ownership, audit/outbox atomicity, and projection boundaries |
| Operational burden | 12 | Sustainable for one owner and a small implementation team without fragile self-hosting |
| Data ownership and exit | 10 | Exportable canonical data and media; replaceable provider adapters; no sole copy trapped in a processor |
| Managed-service maturity | 9 | Current supported product, official documentation, incident/security posture, and support path |
| Custom Admin flexibility | 8 | Supports Blowin' Smoke workflows without surrendering domain authority to a generic back office |
| Integration quality | 6 | Supported SDK/API, idempotency, webhooks/events, observability, and bounded credentials |
| Cost fit | 5 | Reasonable for the owner profile, with current official pricing or an explicit unknown |
| Growth path | 3 | Can scale beyond the first owner/location without forcing an immediate platform rewrite |

## 4. Evidence and status discipline

Every candidate is assigned one status:

- **RECOMMENDED** — best current fit, subject to the stated implementation proofs and procurement checks.
- **VIABLE ALTERNATIVE** — credible, but not selected because another option better fits the weighted criteria.
- **REJECTED** — conflicts with a material requirement for this launch profile.
- **BLOCKED — EVIDENCE INSUFFICIENT** — a required current claim could not be established from primary evidence.

Official documentation establishes provider capability, published limits, and current list pricing. It does **not** prove Blowin' Smoke configuration, transactional correctness, access control, restoration, performance, or production fitness. Those require later execution tests.

## 5. Owner decisions versus technology decisions

### Fixed owner decisions

- one initial owner operator;
- approved-device-only administration;
- web, iPhone, and Mac access;
- strong MFA;
- York location and small initial catalog;
- internal PO, COGS, label, POS, supplier-history, accounting, media, and reorder needs;
- managed reliability over lowest price;
- custom Blowin' Smoke Admin experience.

### COM-ADM-02 technology decisions

- managed PostgreSQL and server-only command API;
- managed identity with phishing-resistant MFA plus a separate device gate;
- responsive web primary surface, focused SwiftUI companion, and installed Mac web surface;
- private canonical object masters with specialized derivative processors;
- database-native search and no external cache at launch;
- canonical transactional audit plus off-provider immutable checkpoints/backups;
- same-authority custom POS and replaceable payment/peripheral adapters;
- accounting adapter and deterministic reorder services.

### Still-open accountable decisions

- actual production account ownership, region, contracts, support tier, spend limits, and data-processing terms;
- final accounting/tax inventory-cost method and chart-of-accounts mapping;
- merchant/payment underwriting for the actual THCA, vape/nicotine, glass/accessories, and mixed catalog;
- actual label stock, printer, receipt hardware, cash procedure, and peripheral acceptance tests;
- operational RPO/RTO, retention, legal, privacy, tax, age, shipping, and product rules;
- all-devices-lost recovery authority and procedure;
- protected wholesale client approval, which remains a separate security gate.

## 6. Decision boundary

This package selects a technology direction for a later authorized implementation. It does not create accounts, procure services, deploy infrastructure, build application code, populate inventory, select a payment processor, authorize a pilot, or establish launch readiness.

**Production implementation remains NOT AUTHORIZED.**
