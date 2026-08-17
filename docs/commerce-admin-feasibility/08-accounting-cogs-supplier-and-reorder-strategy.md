# COM-ADM-02 — Accounting, COGS, Supplier, and Reorder Strategy

**Status:** Feasibility decision complete; accounting policy and production connection remain open  
**Evidence access date:** 2026-08-17  
**Production implementation:** Not authorized

## 1. Decision

Use **QuickBooks Online Essentials** as the recommended launch accounting destination, subject to accountant mapping and API entitlement proof. Blowin' Smoke Commerce Admin remains canonical for product/SKU, supplier reference, purchase order, receipt, lot cost, inventory ledger, order, and operational COGS inputs. QuickBooks receives approved financial postings and reconciliation references; it does not own stock or operational procurement.

Preserve exact receipt/lot cost layers and all supplier-price history in PostgreSQL. Do not silently choose a tax/accounting inventory method. Build deterministic reorder intelligence in three evidence-based phases; do not add AI at launch.

## 2. Accounting ownership boundary

```text
SUPPLIER / PO / RECEIVING / LOT COST / INVENTORY / ORDER
             CANONICAL COMMERCE ADMIN
                       |
       versioned mapped accounting event + outbox
                       |
          ACCOUNTING ADAPTER / RECONCILIATION
                       |
              QUICKBOOKS ONLINE
      general ledger / bills / payments / reports
```

Required controls:

1. Every exported financial event has a stable Blowin' Smoke ID, schema/mapping version, source transaction, effective time, exact integer-minor-unit amounts, and idempotency key.
2. Provider IDs are aliases stored against the canonical event; they never replace canonical identity.
3. Webhooks are untrusted notifications. Verify signatures, enqueue, deduplicate, tolerate reordering, and recover by controlled change-data/API reconciliation.
4. Accounting edits do not silently mutate inventory. Any accepted correction creates an explicit mapped correction/compensating event in the owning system.
5. Failed, partial, duplicate, stale, or ambiguous synchronization is visible and blocks any claim of reconciliation.
6. OAuth tokens are server-side, least-privilege, encrypted, revocable, rotated, and excluded from logs/clients.

## 3. Accounting provider comparison

| Candidate | Current price and capability | Fit / exit / burden | Status |
|---|---|---|---|
| QuickBooks Online Essentials | Published regular price **$85/month**; bills/AP and reporting. Generic QBO API documentation exposes vendors, bills, purchase orders, sales receipts, journal entries, and other entities, but Purchase Order use is plan/add-on gated and the selected Essentials adapter must not assume it | Strong US small-business/accountant ecosystem and documented API. Canonical stock/PO remains in Admin; the launch adapter should post only accountant-approved, plan-entitled bill/journal/sales records. Profile/data/API export exists, but mappings and QBO IDs create moderate lock-in | **RECOMMENDED**, subject to accountant, plan entitlement, and sandbox-to-production mapping proof |
| QuickBooks Online Plus | Published regular price **$140/month**; adds QuickBooks inventory, PO, and COGS features | Useful if the accountant explicitly requires those QBO workflows, but they risk creating a second operational stock/PO truth | **VIABLE ALTERNATIVE** |
| Xero Growing | Published regular price **$55/month**; current developer Starter tier supports up to five connections and 1,000 calls/day per organization without an API subscription fee; OAuth 2.0 | Credible, lower recurring cost and adequate single-company API scale. Not selected because QuickBooks is the preferred launch destination for this US owner profile; accountant preference remains confirmatory | **VIABLE ALTERNATIVE** |
| Zoho Books Professional | Published regular price **$50/month** monthly (**$40/month** annual equivalent); POs, inventory, custom roles, and API access | Lower cost with broad operations, but its inventory/PO features would still be subordinate, and it introduces a different accountant/operator ecosystem | **VIABLE ALTERNATIVE** |
| Spreadsheet/manual books as system of record | Portable document format only | Cannot supply safe API reconciliation, access/audit discipline, or reliable scaling; manual export may remain a controlled fallback | **REJECTED** |

Promotional discounts are excluded. All prices are list prices observed on the access date, not contractual quotes. Accounting subscriptions, API entitlements, rate limits, and accountant access must be reverified immediately before procurement.

## 4. COGS and landed-cost feasibility

The canonical database must retain, without binary floating point:

- supplier and versioned supplier product reference;
- PO line quantity, unit, currency, quoted unit cost, and effective time;
- received quantity and exact received unit cost;
- receipt/lot cost layer and immutable provenance;
- separately classified freight, duty, fee, discount, tax, or other landed-cost components when approved;
- allocation method/version and remainder disposition for shared landed costs;
- inventory consumption link from order/fulfillment to the relevant cost layer(s);
- operational COGS result and later accounting-posting reference;
- retail/wholesale revenue, gross margin, and BSDN delivery contribution as distinct views;
- corrections through successor/compensating records.

The system should be able to calculate reviewed candidate views such as specific identification, FIFO, or weighted-average operational analysis from preserved source layers. It must not label one as the business's tax/accounting method until a qualified accountant approves the method, effective date, opening position, handling of changes, and QuickBooks mapping.

`Revenue - approved COGS` is gross margin, not net profit. BSDN delivery revenue/cost contribution and wholesale negotiated-price margin must remain separately attributable.

## 5. Supplier price history

Supplier price is time-varying evidence, not a mutable field on Product.

For each supplier/SKU/package relationship preserve:

- supplier, supplier product reference, source document/API, currency, unit and pack conversion;
- quoted, ordered, and received cost as separate facts;
- valid/effective and observed times;
- MOQ, case pack, lead-time observation, freight/discount terms where authoritative;
- PO and receipt linkage;
- supersession/correction lineage;
- actor/import adapter, confidence/verification state, and source attachment;
- normalized comparable unit cost only through governed exact conversions.

A supplier import may propose a cost; it cannot overwrite history, publish a retail/wholesale price, create inventory, or change a reorder recommendation without validation. Unknown units, currency, package equivalence, or product mapping remain unresolved.

## 6. Reorder intelligence

### Phase 1 — threshold control

Use owner-approved per-SKU/location values:

- minimum threshold;
- reorder point;
- target stock or fixed suggested order quantity;
- preferred supplier/product reference;
- manual snooze/override with reason and audit.

This is deterministic alerting. The system never submits a PO automatically.

### Phase 2 — inventory and velocity

Calculate from canonical events using a documented window/version:

```text
NET_AVAILABLE = SELLABLE_ON_HAND - RESERVED - COMMITTED - SAFETY_RESERVE
PROJECTED_AVAILABLE = NET_AVAILABLE + QUALIFYING_OPEN_PO_QUANTITY
DAILY_VELOCITY = GOVERNED_QUALIFYING_UNITS / GOVERNED_DAY_WINDOW
DAYS_OF_SUPPLY = NET_AVAILABLE / DAILY_VELOCITY
REORDER_NEED_DATE = EXPECTED_DEPLETION_DATE - VERIFIED_LEAD_TIME_BUFFER
```

Distinguish count and mass dimensions; never aggregate incompatible products, variants, lots, or locations. Returns, voids, wholesale bulk sales, stockouts, promotions, closures, new products, abnormal events, and insufficient history require explicit treatment. Open POs are expected supply, never on-hand stock.

### Phase 3 — forecast and suggested quantity

Only after sufficient clean history:

- forecast demand with versioned backtesting and error measurement;
- consider supplier lead-time distribution, MOQ/case pack, open POs, committed/reserved inventory, safety stock, stockout censoring, seasonality, and supplier cost change;
- explain every suggestion using source observations and formula/model version;
- expose confidence and insufficient-data states;
- require owner review before PO creation or submission.

No generative model is needed for the launch requirement. A later statistical model may assist only after deterministic baselines and evaluation data exist.

## 7. Failure and reconciliation states

At minimum preserve:

- `PENDING_EXPORT`
- `EXPORTED_UNCONFIRMED`
- `CONFIRMED`
- `RETRYABLE_FAILURE`
- `PERMANENT_FAILURE`
- `MAPPING_REQUIRED`
- `PROVIDER_CHANGED`
- `RECONCILIATION_MISMATCH`
- `CORRECTION_REQUIRED`
- `REVERSED`

Accounting outage must not corrupt canonical commerce transactions. The atomic transaction records the canonical business change plus outbox; the adapter retries idempotently. A long-running failure becomes an operational alert. Reconciliation evidence is retained independently of provider logs.

## 8. Primary evidence register

All sources were accessed **2026-08-17**.

### QuickBooks pricing and product

- **SOURCE:** Intuit — QuickBooks pricing  
  **URL:** https://quickbooks.intuit.com/pricing/  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Current published regular monthly prices and plan feature descriptions, including Essentials and Plus.  
  **WHAT IT DOES NOT ESTABLISH:** Contracted price, tax/accounting suitability, merchant approval, or exact API entitlement for the future configured company.

### QuickBooks API and integration

- **SOURCE:** Intuit Developer — OAuth 2.0, scopes, webhooks, webhook practices, QBO API, linked transactions, and bill workflows  
  **URL:** https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0 ; https://developer.intuit.com/app/developer/qbo/docs/learn/scopes ; https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks/configure-webhooks ; https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks/best-practices ; https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api ; https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-linked-transactions ; https://developer.intuit.com/app/developer/qbo/docs/learn/learn-basic-bookkeeping/pay-bills  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Supported authorization model, accounting entities/workflows, notification mechanism, and vendor guidance for secure asynchronous handling.  
  **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke mappings, webhook completeness/ordering, idempotent reconciliation, COGS policy, or production approval.

### Xero

- **SOURCE:** Xero — US plans, developer pricing, OAuth 2.0, and API limits  
  **URL:** https://www.xero.com/us/pricing-plans/ ; https://developer.xero.com/pricing ; https://developer.xero.com/documentation/guides/oauth2/overview ; https://developer.xero.com/faq/limits  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Current plan/API prices, connection/call allowances, and supported OAuth model.  
  **WHAT IT DOES NOT ESTABLISH:** Accountant preference, complete Blowin' Smoke mappings, or error-free production synchronization.

### Zoho Books

- **SOURCE:** Zoho Books — pricing, OAuth, and Purchase Order API  
  **URL:** https://www.zoho.com/us/books/pricing/ ; https://www.zoho.com/books/api/v3/oauth/ ; https://www.zoho.com/books/api/v3/purchase-order/  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Current published plan features/prices and supported OAuth/API operations.  
  **WHAT IT DOES NOT ESTABLISH:** Accountant fit, operational authority, or production integration correctness.

### Inventory accounting methods

- **SOURCE:** United States Internal Revenue Service — Publication 538 and Publication 334  
  **URL:** https://www.irs.gov/forms-pubs/about-publication-538 ; https://www.irs.gov/pub/irs-pdf/p538.pdf ; https://www.irs.gov/publications/p334  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Federal guidance distinguishes inventory identification/valuation methods and treats method choice/change as an accounting matter.  
  **WHAT IT DOES NOT ESTABLISH:** Which method Blowin' Smoke must use, state treatment, legal advice, or a configured ledger mapping.

## 9. Required next-gate proof

Before production connection, a qualified accountant and implementation owner must approve the inventory-cost method, opening balances, chart-of-accounts mapping, sales/tax/refund/fee/COGS/PO/bill treatment, correction rules, close/reconciliation process, retention, and access. Then prove OAuth rotation/revocation, sandbox mapping, duplicate/out-of-order webhooks, provider outage, replay, mismatch handling, and export/exit. Reorder formulas must be backtested against synthetic then controlled real history before use.
