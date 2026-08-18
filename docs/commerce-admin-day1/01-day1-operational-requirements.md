# COM-ADM-02A — Day-1 Operational Requirements

**Status:** Required outcome fixed
**Owner profile:** One owner; fewer than 100 products; one York, Pennsylvania location
**Primary client:** Responsive browser Admin on iPhone and Mac/desktop
**Production implementation:** Not authorized

## 1. Day-1 success definition

Day 1 is successful only when the owner can run routine commerce through the Admin without touching source control or waiting for an engineer. A decorative dashboard, direct database editor, Git-backed product file, or collection of disconnected provider consoles does not satisfy the outcome. The fixed wholesale-reference requirement is preserved, but its current protected-client gate is reconciled explicitly in section 2; it is not misrepresented as browser-ready.

| Owner operation | Day-1 system behavior | Governing control |
|---|---|---|
| Secure sign-in | Auth0 Free, mandatory phishing-resistant passkey/WebAuthn authentication, two independent owner credentials/recovery keys, approved browser registration, revocable server session | Fail closed; no shared account; lower-assurance fallback cannot authorize Admin access |
| Add/edit/archive/unpublish product | Structured product, variant, SKU, category, publication, and reasoned successor state | Canonical command; no live product in Git |
| Set retail price | Governed retail price and channel state | Integer minor units and effective history |
| Set wholesale reference price | Required canonical command and price class | `CLIENT_REQUIRED` under current COM-ADM-01 classification; browser receives no protected value or command preview |
| Manage channel visibility | Web may manage separately approved non-protected routing/publication state | Sensitive wholesale reveal/visibility remains `CLIENT_REQUIRED`; no duplicate channel catalog |
| Receive inventory | Receipt, supplier, cost, quantity, lot/batch where material, location, discrepancy, and ledger posting | PO/expected receipt never equals on-hand; receipt does not silently make stock sellable |
| Adjust inventory | Reasoned compensating ledger entry with exact position and version | No balance overwrite; audit and invariant checks are atomic |
| View inventory history | Human-readable immutable ledger and folded stock position | Canonical history, not telemetry |
| Manage availability | Quarantine/damage/unsellable/safety/reserved/committed state and available-to-promise | Projection cannot authorize commitment |
| Upload product image/video | Direct authorized upload into private quarantine with visible progress and honest failure | Upload never auto-publishes; unknown format/scan state remains blocked |
| Attach evidence/COA | Versioned document plus subject, scope, applicability, provenance, and review state | A file name or URL is not proof applicability |
| View orders | Canonical order and immutable line snapshot, fulfillment and exception state | Order/inventory transition integrity remains transactional |
| Record supplier and acquisition cost | Supplier reference, receipt cost layer, exact quantity, source, and effective history | COGS inputs remain canonical even without accounting integration |
| View basic gross-margin inputs | Sale amount less approved acquisition/COGS allocation under a labeled method | Operational view is not final tax/accounting advice |
| View audit history | Actor, device/session, command, reason, target/version, result, correlation, and correction lineage | Required audit failure blocks the material write |
| Keep website synchronized | Transactional outbox drives idempotent rebuildable projections | No manual deployment for routine changes; final order path rereads canonical state |

## 2. Hard architecture retained

The reduction changes subscriptions and launch scope, not commerce truth.

### Canonical transactional database

PostgreSQL owns catalog, variants/SKUs, inventory ledger and folded positions, reservations, prices, channels, media/evidence metadata, suppliers, costs, orders, audit, and projection outbox. Provider dashboards and spreadsheets are not alternative authorities.

### Server-side command boundary

The browser never receives database credentials or a generic client-to-table write path. Each mutation identifies the actor, active Admin device/session, capability, purpose, expected object version, exact command, idempotency key, and current domain preconditions. Authorization and business validation occur again on the server immediately before commit.

### Inventory and oversell protection

Inventory remains an immutable ledger with transactionally maintained positions. Available-to-promise is derived from physical, damaged, quarantined, unsellable, reserved, committed, and safety-reserve state. Reservations and order commitment use database concurrency controls, idempotency, and stale-version rejection; the website projection cannot grant stock.

### Exact arithmetic

Money is signed integer minor units plus ISO currency. Governed quantity is an integer count of a versioned quantum. Cross-unit conversion is exact integer or rational arithmetic. Rounding occurs only at an approved recorded boundary. Binary floating point cannot become canonical price, quantity, cost, or margin truth.

### Audit and projection integrity

The material mutation, append-only business audit, and outbox event share one transaction. Provider/runtime logs remain diagnostic only. Projection delivery is at least once with idempotent consumers, source version, projection time, lag visibility, and reconciliation.

### Wholesale protected-client reconciliation

COM-ADM-01 requires an approved protected client for a wholesale reference-price change and for sensitive wholesale visibility/reveal. No approved client exists, and browser/PWA receives zero D3/D4 payload. COM-ADM-02A therefore records these operations as **Day-1 required but currently blocked from the Web Admin**.

A later pilot may satisfy the requirement only through one of two accountable paths:

1. a qualified data-classification/security decision defines a precise administrative reference or channel field as D0/D1 non-protected, without exposing or deriving any D3/D4 price, quantity, inventory, media, evidence, customer, room, or protected relationship; or
2. a separately proven and approved protected client performs the current high-risk command.

Until one path is approved, the Web Admin may configure safe drafts/scaffolding without protected values but cannot read, set, reveal, or change protected wholesale reference price/sensitive visibility. This is a launch blocker for that portion of the fixed owner outcome, not an excuse to weaken the gate.

## 3. Day-1 surface decision

The **responsive Web Admin is the primary Day-1 client**. It is complete for authorized non-protected Admin operations; it is not a protected-wholesale client.

It must provide the same canonical actions on:

- current supported iPhone Safari;
- current supported Mac Safari/Chrome or equivalent desktop browser;
- an installed web surface where the OS/browser supports it, without claiming native integrity.

The layout may adapt for touch, camera/file pickers, narrow screens, and interrupted uploads. It may not hide required validation, evidence scope, reason codes, price units, stock position, or confirmation consequences merely to fit mobile.

### iPhone acceptance

The browser must support product and order work, receiving/adjustment, camera/photo-library selection, ordinary video selection, upload progress/retry, and accessible manual SKU/identifier entry. Barcode camera scanning is optional on Day 1; manual search and entry are required. Native SwiftUI becomes justified only if a measured browser limitation blocks operations.

### Mac/desktop acceptance

The browser must support the complete Admin, multi-file selection, keyboard navigation, bulk review where safe, downloadable owner-authorized exports, and print through ordinary governed document workflows. A native Mac application or wrapper adds no Day-1 domain value and is removed from the recommended path.

## 4. Routine operations versus engineering work

| Routine owner operation — no engineering | Controlled engineering/release work |
|---|---|
| Products, variants, SKUs, categories, archive/publication | Schema and migration change |
| Retail price and approved non-protected channel state; protected wholesale returns `CLIENT_REQUIRED` | New domain capability or authorization/classification policy |
| Receiving, adjustment, stocktake, quarantine, availability | Transaction/concurrency implementation change |
| Supplier, acquisition cost, evidence/COA | Provider replacement or infrastructure configuration |
| Media upload, assignment, ordering, archive | New codec/processor or media-security mechanism |
| Order and exception review | Release, rollback, incident repair requiring code |
| Manual reorder threshold and low-stock review | New forecasting model |

Routine mutations synchronize the website through canonical projections. They never create a source commit or deployment.

## 5. Designed / build / provision / enable vocabulary

| Term | Meaning in COM-ADM-02A |
|---|---|
| `DESIGNED` | The destination interface, data contract, invariant, or adapter is recorded so future work does not require architectural reversal |
| `DAY-1 BUILD` | Application behavior must be implemented and execution-tested before a later pilot can be authorized |
| `DAY-1 PROVISION` | A provider account/plan/resource would be required for that pilot; this package itself creates none |
| `DAY-1 ENABLE` | The tested capability would be active in the proposed Day-1 boundary after separate authorization |
| `ACTIVATION TRIGGER` | Observable operational evidence that permits the deferred capability to enter a later proof/procurement gate |

## 6. Day-1 acceptance boundary

Before any later pilot authorization, proof must establish:

1. all listed non-protected owner workflows on both iPhone and Mac/desktop browsers, plus explicit `CLIENT_REQUIRED` denial for protected wholesale operations;
2. fail-closed identity, device/session, capability, object, and server-verified fresh-authentication behavior;
3. exact concurrent reservation/commitment and correction behavior;
4. no routine GitHub, Codex, deployment, or developer dependency;
5. safe upload quarantine, validation, publication, replacement, and evidence applicability;
6. atomic audit/outbox and automatic website synchronization;
7. provider recovery plus successful independent restore and invariant reconciliation;
8. accessible keyboard, touch, screen-reader, zoom, error, and recovery behavior;
9. measured costs within an owner-approved budget and provider spending controls.

Unknown or unproven behavior does not become launch readiness. COM-ADM-02A authorizes neither implementation nor pilot.
