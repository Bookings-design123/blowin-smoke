# Blowin' Smoke — Commerce Administration Architecture

**Phase:** COM-ADM-01 recovery / completion pass
**Status:** Architecture complete; implementation not authorized
**Governing base:** `399ed490cc285fb5970b49d118e9ae5accb9aa86`
**Live admin system:** Not implemented
**Live inventory database:** Not implemented
**Live media pipeline:** Not implemented
**Live supplier integrations:** Not implemented
**Launch readiness:** Not established

## Purpose

This package defines how Blowin' Smoke can eventually operate its catalog, exact inventory, pricing, channel offers, media, evidence, suppliers, receiving, and administrative controls without treating a software repository as a business tool. It is a vendor-neutral logical architecture. It supplies no application code, production data, provider choice, supplier account, or implementation authorization.

The operating objective is direct:

```text
OWNER / AUTHORIZED STAFF
            |
     BLOWIN' SMOKE ADMIN
       /             \
WEB ADMIN     AUTHORIZED ADMIN APP
            |
  CANONICAL COMMERCE API
            |
 Catalog / Inventory Ledger / Pricing / Media / Evidence
 Channel Offers / Reservations / Receiving / Audit
            |
 Retail / Protected Wholesale / Search / Cart / Checkout
 Shipping / York Pickup / BSDN / Support / Operations
```

There is one canonical operational commerce authority with bounded record owners inside it. There is not one giant product record, and there are not separate stock truths for retail, wholesale, shipping, pickup, or BSDN.

## Governing operational rule

GitHub owns source code, architecture, schemas, migrations, releases, and documentation. It does **not** own live products, prices, inventory, lots, reservations, offers, media assignments, evidence state, purchase orders, or receiving state. Routine business operations occur through authorized admin clients and canonical commands. They require no GitHub edit, repository commit, code change, deployment, Codex prompt, or developer intervention.

## Package map

| Document | Governing responsibility |
|---|---|
| [01 — Domain and ownership](01-domain-and-ownership.md) | Operational topology, canonical owners, entities, commands, queries, and GitHub boundary |
| [02 — Catalog model](02-catalog-product-variant-sku-lot-model.md) | Product, variant, SKU, lot/batch, structured content, provenance, and publication |
| [03 — Inventory ledger](03-inventory-ledger-and-reservations.md) | Exact quantity accounting, reservations, oversell prevention, mutations, and concurrency |
| [04 — Pricing and channel offers](04-pricing-and-channel-offers.md) | Exact money, price history, negotiated quotes, channel offers, allocation, and visibility |
| [05 — Media and evidence](05-media-and-evidence-management.md) | Upload pipeline, derivatives, rights, evidence/COA scope, and protected media linkage |
| [06 — Roles, security, and audit](06-admin-roles-security-and-audit.md) | Capability authorization, high-risk controls, privacy, and tamper-evident audit |
| [07 — Workflows and information architecture](07-admin-workflows-and-information-architecture.md) | Admin navigation, routine workflows, retrieval, bulk work, and operational signals |
| [08 — Suppliers, receiving, and locations](08-supplier-receiving-and-location-model.md) | Future supplier/PO model, physical receiving, discrepancies, quarantine, and locations |
| [09 — Integrations and transaction boundaries](09-integrations-projections-and-transaction-boundaries.md) | API boundary, write transactions, outbox, projections, storage classes, BSDN, and adapters |
| [10 — Decisions and next gate](10-decisions-open-gates-and-next-step.md) | Decided architecture, unresolved owner/provider/legal/implementation gates, and status |
| [Machine-readable registry](commerce-admin-registry.json) | Structured summary of owners, entities, invariants, roles, projections, gates, and authorization |

## Non-negotiable invariants

1. Exact sellable variant plus owned inventory location is the stock-position scope.
2. Every quantity mutation creates a durable ledger entry; history is corrected by linked compensating entries, never silent overwrite.
3. No quantity or money calculation uses binary floating point.
4. Retail, wholesale, shipping, York pickup, and BSDN constrain one stock pool; channel allocation cannot create units.
5. A stale storefront, search document, dashboard, or cache cannot reserve or commit inventory.
6. Product, variant, SKU, lot/batch, stock position, reservation, offer, price, media, evidence, order, and fulfillment remain separate governed concepts.
7. Receipt is not sellability; a purchase order and expected receipt are not physical on-hand inventory.
8. Price is not stock; stock is not eligibility; proof is not approval; publication is not purchase readiness.
9. Uploading media or evidence does not verify a claim or publish an asset.
10. Protected wholesale fields and payloads remain subject to the approved-protected-client gate. No such production client is currently approved.
11. Every consequential write uses server-side capability and object authorization, current-version validation, idempotency where retryable, and required audit.
12. Search indexes, caches, analytics, storefront documents, and admin dashboards are rebuildable projections, not canonical ownership.

## Architecture authority

This package applies the [Brand Philosophy](../constitution/01-brand-philosophy.md), [Data Model and Catalog Schema](../system/03-data-model-catalog-schema.md), [Technical Architecture](../technical-architecture/README.md), [Delivery Network Architecture](../delivery-network/README.md), [Security Architecture](../security-architecture/README.md), and [Security Assurance](../security-assurance/README.md). If this package conflicts with those governing sources, the higher governing source controls. Competitor research is not catalog or implementation authority.

## Completion ledger

`PASS` means the architecture requirement is explicitly governed in this package. The final three delivery entries are valid only when the delivery commit exists on `origin/main` and post-push fetch resolves that same SHA; if that condition is false, COM-ADM-01 must be treated as incomplete regardless of this table.

| # | Requirement | Status | Governing location |
|---:|---|---|---|
| 1 | GitHub removed as live operational inventory mechanism | PASS | This README; 01 |
| 2 | Canonical commerce ownership defined | PASS | 01 |
| 3 | Admin operational boundary defined | PASS | 01; 09 |
| 4 | Product model defined | PASS | 02 |
| 5 | Variant model defined | PASS | 02 |
| 6 | SKU model defined | PASS | 02 |
| 7 | Lot/batch model defined | PASS | 02; 08 |
| 8 | Location model defined | PASS | 08 |
| 9 | Weight inventory defined | PASS | 03 |
| 10 | Count inventory defined | PASS | 03 |
| 11 | Exact quantity arithmetic defined | PASS | 03 |
| 12 | Exact money arithmetic defined | PASS | 04 |
| 13 | Inventory ledger defined | PASS | 03 |
| 14 | Inventory invariants defined | PASS | 03 |
| 15 | Reservations defined | PASS | 03 |
| 16 | Oversell protection defined | PASS | 03; 09 |
| 17 | Concurrency defined | PASS | 03; 09 |
| 18 | Transaction boundaries defined | PASS | 03; 09 |
| 19 | Channel allocation defined | PASS | 03; 04 |
| 20 | Retail offer defined | PASS | 04 |
| 21 | Wholesale offer defined | PASS | 04 |
| 22 | Pricing/history defined | PASS | 04 |
| 23 | Negotiated quotes defined | PASS | 04 |
| 24 | Media ingestion defined | PASS | 05 |
| 25 | Media derivatives defined | PASS | 05 |
| 26 | Protected wholesale media linkage defined | PASS | 05; 06 |
| 27 | Evidence/COA governance defined | PASS | 05 |
| 28 | Evidence scope defined | PASS | 05 |
| 29 | Admin RBAC/capabilities defined | PASS | 06 |
| 30 | High-risk operation controls defined | PASS | 06 |
| 31 | Audit model defined | PASS | 06 |
| 32 | Admin workflows defined | PASS | 07 |
| 33 | Admin information architecture defined | PASS | 07 |
| 34 | Search/filter defined | PASS | 07 |
| 35 | Bulk operations defined | PASS | 07 |
| 36 | Operational alerts defined | PASS | 07 |
| 37 | Supplier model defined | PASS | 08 |
| 38 | Purchase-order model defined | PASS | 08 |
| 39 | Receiving model defined | PASS | 08 |
| 40 | Projections defined | PASS | 09 |
| 41 | BSDN integration ownership defined | PASS | 09 |
| 42 | Shipping/pickup integration defined | PASS | 04; 08; 09 |
| 43 | Import/export governance defined | PASS | 07; 09 |
| 44 | Privacy/security boundary defined | PASS | 05; 06; 09 |
| 45 | Archive/deletion semantics defined | PASS | 02; 05; 06; 07 |
| 46 | Machine-readable registry valid | PASS | Registry; validation required before delivery |
| 47 | Unresolved gates explicitly separated | PASS | 10; registry |
| 48 | Production remains unauthorized | PASS | This README; 10; registry |
| 49 | Git diff restricted to authorized docs | PASS | Delivery verification condition |
| 50 | Commit created | PASS | Delivery verification condition |
| 51 | Commit pushed | PASS | Delivery verification condition |
| 52 | `origin/main` verified at pushed SHA | PASS | Delivery verification condition |

## Phase result

| Result | State |
|---|---|
| COM-ADM-01 architecture | **COMPLETE** |
| Live admin system | **NOT IMPLEMENTED** |
| Live inventory database | **NOT IMPLEMENTED** |
| Live media pipeline | **NOT IMPLEMENTED** |
| Live supplier integrations | **NOT IMPLEMENTED** |
| Production implementation | **NOT AUTHORIZED** |
| Launch readiness | **NOT ESTABLISHED** |

Architecture completion means the operational rules and boundaries are defined. It does not mean the owner can yet use a working dashboard.
