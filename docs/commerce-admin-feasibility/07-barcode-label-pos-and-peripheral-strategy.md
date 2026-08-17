# COM-ADM-02 — Barcode, Label, POS, and Peripheral Strategy

**Status:** Feasibility decision complete; payment and hardware procurement remain open  
**Evidence access date:** 2026-08-17  
**Production implementation:** Not authorized

## 1. Decision

Blowin' Smoke should build its eventual POS as a task-specific surface over the same canonical command API, catalog, pricing, reservation, inventory ledger, order, correction, and audit system used by Commerce Admin. It must not create a second POS inventory.

At launch, camera scanning on the approved iPhone companion is the baseline. The Admin generates versioned PDF and ZPL label artifacts. Procurement should benchmark a networked 300-dpi thermal printer against actual label stock before selection. Card acceptance remains a separately underwritten, replaceable terminal adapter; no payment provider is selected by this phase.

## 2. Identifier and carrier policy

| Use | Recommended carrier | Payload rule |
|---|---|---|
| Manufacturer product lookup | Existing UPC-A, EAN, or GTIN | Preserve the authoritative manufacturer value; never fabricate or infer a GTIN |
| Blowin' Smoke SKU lookup | Code 128 | Opaque stable internal SKU/stock identifier, not mutable title/price data |
| Lot/batch and receipt workflow | QR by default; GS1-128 only when authoritative supply-chain data justifies it | Opaque ID/deep link to an authorized server lookup; no PII, credential, signed media URL, or product claim |
| PO/receiving session | QR | Stable purchase-order or receiving-session identifier with server-side authorization |
| Shelf/bin/location | Code 128 or QR | Stable owned-location/bin identifier; location state remains canonical server data |
| Consumer/public use | Separate governed QR purpose | Never expose admin routes or private identifiers merely because a QR is printable |

Scanning is an input method, not truth. The server resolves the code, verifies record type/state/location, requires the intended command, and records the actor/device/result. Unknown, duplicated, malformed, wrong-purpose, or retired identifiers do not default to a match.

## 3. Workflow coverage

### Receiving

1. Scan PO or receiving session.
2. Scan manufacturer code or internal SKU.
3. Resolve the expected line; do not create stock from the code alone.
4. Enter/verify count or exact governed mass, lot, received unit cost, condition, discrepancy, and evidence.
5. Post one idempotent receiving command. Only successful physical receiving can create inventory ledger truth.
6. Print the approved SKU/lot label from a versioned template.

### Stocktake and adjustment

- Scan exact SKU, lot where material, and location.
- Show canonical expected quantity and command version.
- Require reason/evidence and step-up when policy marks the correction high risk.
- Use a linked ledger correction; never overwrite a balance.

### POS lookup

- Scan or search the canonical sellable variant.
- Resolve current canonical price, eligibility, channel offer, and available-to-promise.
- Revalidate at reservation/commit; a scanned code or displayed cart never guarantees stock.

## 4. Scanner strategy

### Recommended launch path — iPhone camera

Apple VisionKit `DataScannerViewController` supports live text and machine-readable-code scanning on supported devices. The thin native iPhone companion can therefore cover receiving, lookup, stocktake, and adjustment without initial dedicated scanner hardware. It must check platform support/availability and offer accessible manual entry.

### Later peripheral path

A USB/Bluetooth scanner operating as keyboard input is a viable low-complexity desktop/POS accessory. Before procurement, test supported code types, check-digit handling, prefix/suffix configuration, duplicate reads, focus safety, offline failure, accessibility, and device enrollment. A peripheral must never be allowed to invoke a consequential command merely by injecting text.

## 5. Label generation and printing

### Application contract

- Canonical Admin owns the template ID/version, record identity, field provenance, print reason, print count, actor, approved device, timestamp, and reprint history.
- Generate printable PDF for portability and ZPL for precise supported thermal-printer output.
- Render human-readable product/SKU/lot text beside every barcode where space permits.
- Validate quiet zones, contrast, minimum size, check digits, scan distance, abrasion, heat, moisture, curvature, and adhesive compatibility using real packaging.
- Price, compliance claim, expiry, or regulated text is printed only from approved current source data.
- A reprint never creates a new SKU, lot, receipt, or stock position.

### Printer candidates

| Candidate | Current evidence | Cost / burden | Status |
|---|---|---|---|
| Zebra ZD421 class | 4-inch desktop thermal family, direct-thermal/thermal-transfer variants, 203/300 dpi options, and ZPL support; network/wireless options vary by configuration | Official guide price was not established: **PRICE NOT VERIFIED**. Strong ZPL portability; moderate configuration burden | **RECOMMENDED** — benchmark; final hardware blocked pending label test and quote |
| Brother QL-1110NWB | Up to 4-inch direct-thermal labels, 300 dpi, USB/Ethernet/Wi-Fi/Bluetooth, desktop/mobile platform support | Official page listed **$334.99** before tax/shipping; lower operational burden, but proprietary media/workflow must be tested | **VIABLE ALTERNATIVE** |
| Browser-only consumer printing | Generic OS/browser print path | Low acquisition friction but weaker calibration, deterministic sizing, status, and unattended POS behavior | **REJECTED** as sole label path |

No specialized printer is procured by this phase. Actual labels and representative glass/accessory, vape, and packaged-product surfaces must pass readability and adhesion testing.

## 6. POS architecture

```text
APPROVED POS DEVICE
        |
 Blowin' Smoke POS UI
        |
CANONICAL COMMAND API
  | catalog / price / eligibility
  | reservation / payment intent alias
  | order / inventory commitment / audit
        |
REPLACEABLE TERMINAL + RECEIPT + LABEL ADAPTERS
```

The same transaction boundary must govern web order and store order. Payment success alone does not create or repair inventory truth. The final capture/commit workflow must be designed and execution-tested for each terminal provider's asynchronous and retry behavior.

Required eventual functions:

- approved-device admission and fresh owner authentication;
- code scan and accessible search;
- canonical cart and current pricing;
- exact reservation/commitment and immutable order-line snapshot;
- cash/card abstraction, receipt, order history, and reconciled terminal reference;
- governed void, return, cancellation, and compensating inventory/financial correction;
- cash-drawer, receipt, label, and scanner adapters;
- explicit provider degradation and idempotent recovery.

### Offline rule

The launch recommendation is **online required for authoritative commitment**. If canonical API/database readiness cannot be established, the POS must not claim current stock, commit an order, alter inventory, or initiate an untraceable payment. A local nonsensitive draft cart may be preserved, clearly labeled uncommitted, then fully revalidated online. Offline sales are deferred until a separately proven cryptographic, conflict, payment, oversell, and reconciliation design exists.

## 7. Build-versus-integrate comparison

| Candidate | Capability and fit | Material conflict / limitation | Status |
|---|---|---|---|
| Custom Blowin' Smoke POS surface + terminal adapter | Preserves exact COM-ADM-01 authority and custom workflow; terminal provider remains replaceable | Requires later implementation, device/peripheral tests, merchant underwriting, and operational procedures | **RECOMMENDED** |
| Square POS/API | Official POS APIs can hand work to Square POS; current POS software page lists a **$0/month** Free plan plus published processing examples, while the CBD program lists different higher rates | POS API lacks Sandbox and does not provide itemized sale data through the handoff; Square inventory would compete with canonical stock; actual Blowin' Smoke mixed-catalog eligibility/rate is **PRICE NOT VERIFIED** pending underwriting | **VIABLE ALTERNATIVE** only as a later payment/terminal adapter, not canonical POS |
| Shopify POS | Mature retail UI, scanner/peripheral extensions, synchronized Shopify catalog/inventory/orders; Basic is listed at **$39/month** and POS Pro adds **$89/location/month** | Creates a second commerce authority unless heavily constrained; Shopify Payments' prohibited-business material includes hemp/CBD/THC and tobacco categories, so payment eligibility/rate is **PRICE NOT VERIFIED** | **REJECTED** as canonical POS |
| Lightspeed Retail | Documented purchasing, receiving, stock counts, and retail inventory workflows | Those features duplicate canonical purchasing/inventory; a current complete price for the evaluated configuration was not established: **PRICE NOT VERIFIED** | **REJECTED** as canonical POS |

No provider documentation establishes merchant approval for THCA, vape/nicotine, glass/accessories, or their combined catalog. **PAYMENT UNDERWRITING IS AN OPEN GATE.**

## 8. Security and failure controls

- POS uses the same owner identity, approved-device registry, step-up, authorization, audit, and revocation rules as Admin.
- Peripheral input is untrusted and size/rate/type constrained.
- No cardholder data is stored in the canonical commerce database; later integration should use provider tokens/references and validated hosted/terminal flows.
- Cash corrections and drawer reconciliation require explicit reason and audit.
- Terminal callback/webhook signatures, replay controls, ordering, and idempotency must be proven before pilot.
- Receipts and labels minimize personal/sensitive data and never expose internal signed URLs or credentials.
- Storefront/POS availability projections cannot authorize final stock commitment.

## 9. Primary evidence register

All sources were accessed **2026-08-17**.

### Apple VisionKit

- **SOURCE:** Apple Developer — DataScannerViewController and camera scanning  
  **URL:** https://developer.apple.com/documentation/visionkit/datascannerviewcontroller and https://developer.apple.com/documentation/visionkit/scanning-data-with-the-camera  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Supported native live text/machine-readable-code scanning and runtime support/availability checks.  
  **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke code support, device enrollment, scan correctness, or command authorization.

### GS1

- **SOURCE:** GS1 US — GS1-128 and GS1 General Specifications  
  **URL:** https://www.gs1us.org/upcs-barcodes-prefixes/gs1-128 and https://documents.gs1us.org/adobe/assets/deliver/urn%3Aaaid%3Aaem%3Aaeb705a1-90da-45f8-a466-c2fc4be50c50/gs1-general-specifications-r22.pdf  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** GS1-128 can encode governed identifiers and application-identifier data such as GTIN and lot/batch.  
  **WHAT IT DOES NOT ESTABLISH:** Authority to assign a GTIN or accuracy of a supplier/product claim.

### Zebra

- **SOURCE:** Zebra ZPL Programming Guide, Browser Print guide, and ZD421 product page  
  **URL:** https://docs.zebra.com/us/en/printers/software/zpl-pg/introduction.html ; https://www.zebra.com/content/dam/zebra_new_ia/en-us/solutions-verticals/product/Software/Printer%20Software/Link-OS/browser-print/zebra-browser-print-user-guide-v1-3-2-en-us.pdf ; https://www.zebra.com/us/en/products/printers/desktop/zd400-series/zd421.html  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Supported ZPL/browser-print mechanisms and documented ZD421-class capabilities.  
  **WHAT IT DOES NOT ESTABLISH:** Current configured purchase price, label-media fitness, or compatibility with an unbuilt Admin.

### Brother

- **SOURCE:** Brother QL-1110NWB product page  
  **URL:** https://www.brother-usa.com/p/desktop-label-printers/QL1110NWB  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Published connectivity, width/resolution/platform characteristics, and $334.99 list price shown at access.  
  **WHAT IT DOES NOT ESTABLISH:** Procurement availability, total label cost, or acceptance on Blowin' Smoke packages.

### Square

- **SOURCE:** Square Developer POS API, Inventory API, POS pricing, and business/CBD eligibility guidance  
  **URL:** https://developer.squareup.com/docs/pos-api/what-it-does ; https://developer.squareup.com/docs/inventory-api/what-it-does ; https://squareup.com/us/en/point-of-sale/software/pricing ; https://squareup.com/help/us/en/article/6386-why-can-t-square-support-all-businesses ; https://squareup.com/us/en/industry/cbd  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Current supported POS handoff/inventory features, published plan/processing examples, and Square's stated restricted-business/CBD boundaries.  
  **WHAT IT DOES NOT ESTABLISH:** Blowin' Smoke underwriting approval, all future transaction rates, or safe canonical integration.

### Shopify

- **SOURCE:** Shopify POS pricing, POS UI extensions, Shopify Payments eligibility, and hemp guidance  
  **URL:** https://www.shopify.com/pos/pricing ; https://shopify.dev/docs/api/pos-ui-extensions/latest ; https://help.shopify.com/en/manual/payments/shopify-payments/onboarding/eligibility ; https://help.shopify.com/en/manual/compliance/legal/hemp/payments  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Current POS plan structure, supported extension/hardware interfaces, and published Shopify Payments restrictions.  
  **WHAT IT DOES NOT ESTABLISH:** Third-party processor approval or a non-duplicative canonical integration.

### Lightspeed

- **SOURCE:** Lightspeed Retail Inventory documentation  
  **URL:** https://x-series-support.lightspeedhq.com/hc/en-us/categories/25001452447643-Inventory  
  **ACCESS DATE:** 2026-08-17  
  **WHAT IT ESTABLISHES:** Documented PO, receiving, inventory count, and related retail-inventory capabilities.  
  **WHAT IT DOES NOT ESTABLISH:** Complete current price, Blowin' Smoke merchant eligibility, or compatibility as a subordinate adapter.

## 10. Next-gate proof

Before any POS or peripheral pilot: procure representative test media, verify barcodes/labels across the three divisions, exercise scan ambiguity and accessibility, validate printer and receipt failure recovery, prove one canonical order/inventory transaction under retries, complete terminal/webhook security tests, obtain written merchant underwriting for the actual catalog, and document safe cash/card reconciliation. Until then, POS and hardware remain **SELECTED DIRECTION / NOT IMPLEMENTED**.
