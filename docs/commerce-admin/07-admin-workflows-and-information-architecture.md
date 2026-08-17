# COM-ADM-01 — Admin Workflows and Information Architecture

**Status:** Governing operational information architecture; visual design and implementation not authorized

## 1. Operator experience standard

The Admin is a business operating surface, not a repository editor or generic database console. A trained authorized operator should be able to complete routine work through named tasks, validated forms, review states, and explicit outcomes. No routine product, price, inventory, media, evidence, offer, or publication change may require GitHub, Codex, code, a deployment, or developer intervention.

Every task surface must show:

- the canonical object and current version being changed;
- whether displayed data is canonical or a projection and when it was refreshed;
- the actor's permitted actions and any required specialist authority;
- provenance, verification, publication, and sale-readiness states separately;
- exact validation blockers without converting unknown into success;
- the expected downstream effects before confirmation;
- the resulting canonical record, audit reference, and propagation status after completion.

Admin convenience cannot bypass field authority, exact units, source evidence, optimistic concurrency, audit, protected-wholesale admission, or any purchase-readiness rule.

## 2. Information architecture

| Area | Primary jobs | Canonical owners queried or commanded |
|---|---|---|
| Dashboard | Work queues, blockers, signals, projection health, recent governed activity | All through read projections; no direct mutation |
| Catalog / Products | Product identity, type/role, structured content, lifecycle, review, publication | Catalog |
| Catalog / Variants and SKUs | Options, valid combinations, identifiers, activation, variant truth | Variant and Option |
| Catalog / Categories | Durable taxonomy and approved memberships | Catalog / Taxonomy |
| Catalog / Drafts, Published, Archived | Workflow, publication, and lifecycle views kept distinct | Catalog plus readiness composition |
| Inventory / Stock | Exact positions by variant, location, dimension, and lot where applicable | Inventory |
| Inventory / Lots and Batches | Provenance, received quantity, status, evidence links | Inventory / Receiving / Evidence |
| Inventory / Reservations | Requested, reserved, committed, released, expired, failed | Inventory |
| Inventory / Receiving | PO expectations, physical arrivals, inspection, discrepancy, quarantine | Supplier and Purchasing references; Inventory and Receiving commands |
| Inventory / Adjustments | Damage, loss, shrinkage, corrections, stocktake, reclassification | Inventory |
| Inventory / Quarantine | Held stock, reason, evidence, authorized release | Inventory |
| Inventory / Stock History | Append-only ledger, related order/receipt/actor, compensation chain | Inventory / Audit |
| Pricing / Retail | Current/scheduled retail price and history | Pricing |
| Pricing / Wholesale | Reference price and separately scoped negotiated quotes | Pricing / Wholesale Commerce |
| Pricing / Promotions | Effective, bounded promotional records and precedence | Pricing |
| Media | Uploads, validation, masters, derivatives, rights, roles, replacement, archive | Media and Rights |
| Evidence / COA | Document versions, issuer/source, scope, status, review, correction | Evidence / Proof |
| Wholesale | Catalog visibility, profiles, protected assets, reference prices, allocations, quotes, sales status | Wholesale Commerce plus canonical dependencies |
| Suppliers / Receiving | Supplier references, POs, expected receipts, sessions, lines, costs, discrepancies | Supplier and Purchasing plus Inventory and Receiving |
| Orders / Fulfillment | Order snapshots and shipping/pickup/local-delivery operational references | Order / Fulfillment |
| BSDN Operations Linkage | Delivery status and exceptions from BSDN; committed-stock references only | BSDN bounded domains; no inventory write |
| Audit | Consequential mutations, sensitive reads, overrides, corrections, access | Audit / Corrections |
| Staff / Permissions | Staff status, scoped roles, capability grants/revocations, reviews | Identity and Access |
| Settings | Controlled vocabularies and approved operational policy references | Each accountable owner; never global free-form overrides |

The navigation may adapt by role, but hiding a section is not authorization. Every command is enforced server-side. Staff see the minimum fields and actions required for their purpose.

## 3. Reusable task pattern

Every consequential workflow uses the same predictable sequence:

1. **Find:** retrieve by stable identity, human identifier, or governed filters.
2. **Inspect:** show current canonical version, provenance, state, blockers, related records, and projection freshness.
3. **Propose:** collect a complete command in canonical units with reason/source and effective context.
4. **Validate:** run field, permission, state-transition, cross-record, and dependency checks without mutation.
5. **Review:** preview before/after state, affected channels/consumers, warnings, and required approval or step-up.
6. **Commit:** submit one idempotent command against the expected version.
7. **Confirm:** show success, conflict, rejection, or service error—never ambiguous optimistic success.
8. **Propagate:** expose outbox/projection progress and durable failure/retry state.
9. **Audit:** link to the immutable audit and correction chain accessible to authorized roles.

Conflict never silently overwrites another operator. The UI refreshes the current version, preserves the proposed change safely, identifies the conflicting fields, and requires explicit reconciliation.

## 4. Catalog workflows

### Add product

1. Create a draft durable product identity with division, product type, product role, source, and responsible catalog owner.
2. Define option dimensions and valid combinations; create exact variants and SKU identifiers without encoding all truth in titles.
3. Record structured attributes, content classes, sources, verification states, relationships, and conditional lot/proof/fit requirements.
4. Assign media and evidence by exact subject scope.
5. Connect price, availability interface, channel-offer drafts, and eligibility rule references without inventing outcomes.
6. Run publication and sale-readiness validation.
7. Submit for appropriate review; publish only approved capabilities.

Creating a product does not publish it, create inventory, make evidence current, expose wholesale data, or make it purchasable.

### Edit, archive, restore, publish, and unpublish

- Edit uses expected version, field-level provenance, before/after preview, and correction reason for material facts.
- Archive ends ordinary discovery while retaining identifiers, order interpretation, proof/fit/support history, and audit.
- Restore returns the record to governed review; it never restores stale prices, evidence, rights, stock, or eligibility automatically.
- Publish is capability-specific: search, category, PDP, retail sale, and wholesale presentation each require their own current inputs.
- Unpublish removes an approved projection or sale capability but does not erase canonical history.
- Deactivating a SKU blocks new sale for that exact variant and triggers cart/read-model revalidation; it does not delete prior orders or ledger history.

## 5. Inventory workflows

### Receive stock

1. Open an authorized receiving session for a location and optional PO/expected receipt.
2. identify the exact variant, quantity dimension, received quantity, lot/batch where required, supplier/source, and supporting evidence.
3. Record discrepancies, package condition, inspection requirements, and unit-cost context under correct authority.
4. Validate exact integer quantity in the canonical unit and prevent duplicate receipt by idempotency/receipt identity.
5. Commit the receiving event and ledger entries atomically; stock enters the governed received/inspection/quarantine state.
6. Make units allocatable only after every required inspection, evidence, and inventory rule permits it.

An expected receipt or PO line is never counted as physical on hand. Receipt is not automatic sellability.

### Adjust stock

Target operator flow:

```text
Inventory -> select exact position -> compare 8.0 lb to observed 7.5 lb
-> enter canonical observed quantity and reason -> preview -0.5 lb compensation
-> authorize -> ledger entry + audit commit -> availability recomputes
-> retail / wholesale / BSDN projections refresh
```

The UI may display pounds, but converts the submitted amount to the exact canonical integer unit before mutation. It does not directly set a mutable balance. The command creates a reasoned compensating entry against a counted position. Large or sensitive corrections invoke the unresolved threshold/approval policy; the architecture does not invent that threshold.

### Quarantine and unquarantine

- Quarantine identifies exact quantity/lot/position and reason, atomically moves it out of allocatable state, and revalidates affected carts/orders/offers.
- Unquarantine requires the authority, evidence, and review dictated by the future operational policy; it is not the inverse button available to all inventory staff.
- Damage, loss, shrinkage, and unsellable disposition are explicit ledger classifications, not notes or deletions.

### Release reservation

The operator locates an exact reservation, sees order/cart/quote context and current state, selects an authorized reason, completes any step-up or approval, and issues an idempotent release. Already fulfilled/released/expired reservations reject a duplicate state change while returning their current result. Manual override never fabricates physical quantity.

## 6. Pricing and offer workflows

### Change price

1. Select exact variant, price class, currency, channel/purchase-method scope, and effective interval.
2. Enter an integer minor-unit amount; no binary floating point.
3. Preview affected offers, carts, scheduled records, and history.
4. Record reason/source, required authority, and any high-risk step-up/approval.
5. Commit a successor price record and audit; never overwrite history.
6. Revalidate carts and refresh projections. Affected carts follow the future owner-approved acknowledgment rule.

### Create wholesale offer

1. Select a canonical product/variant and set `WHOLESALE_VISIBLE` independently from retail visibility.
2. Reference, rather than copy, current product truth, wholesale reference price, current wholesale allocation, qualified evidence/profile, and protected media assignments.
3. Define minimum/maximum quantity and fulfillment eligibility from approved policy records.
4. Apply the governing qualification: at least one pound of one particular canonical strain. Do not aggregate different strains or name-similar records.
5. Validate protected-client eligibility before any restricted payload; publication alone cannot bypass the client gate.

### Create negotiated quote

1. Identify the authorized wholesale account or permitted pseudonymous inquiry context.
2. Reference exact offer/variant/strain, quantity, currency, proposed amount, validity context, salesperson, and negotiation record.
3. Validate 1+ lb same-canonical-strain qualification and current canonical availability.
4. Optionally request a reservation through Inventory; quote creation by itself does not hold stock.
5. Approve/issue under scoped authority, preserving the wholesale reference price.
6. Convert only through canonical order, inventory, eligibility, payment, and fulfillment commands.

Customer A's negotiated quote never changes Customer B's reference price.

## 7. Media and evidence workflows

### Upload and assign media

1. Select a local file through Admin; no manual object URL or filename convention is required.
2. Create an upload session with intended subject/role/classification and asserted source/rights.
3. Validate type/size/structure, security scan, extract metadata, store immutable master, and generate governed derivatives.
4. Review processing failures and rights/accessibility requirements.
5. Assign exact product/variant/batch subject, role, ordering, alt text/caption, crop intent, audience, and effective status.
6. Publish a public derivative or link a protected derivative only after its separate authorization checks.

### Replace or archive media

Replacement creates a successor master/derivative set and updates approved assignments transactionally. Active sessions may retain a versioned public rendition only under cache policy; decision-critical protected access revalidates. Prior assets and rights/audit history are retained according to policy. “Remove from publication” is not destructive deletion.

### Attach or replace evidence/COA

1. Upload/register the immutable document with type, source, issuer, date, rights, integrity metadata, and classification.
2. Attach through an explicit applicability relationship to exact product, variant, lot/batch/sample, and effective context.
3. Mark candidate state such as pending verification; upload does not create verified truth.
4. Qualified authority reviews provenance, exact scope, currentness, and conflict.
5. Publish only approved facts/proof access. Replacing creates a successor/correction and preserves prior version.

A COA for Batch A cannot verify Batch B. Storage failure is a service error, not `MISSING`.

## 8. Search and filters

Admin retrieval must support exact and fuzzy lookup where appropriate across:

- product canonical ID, title, type, role, category, collection, division, brand/maker;
- SKU, variant, option combination, canonical strain identity;
- lot/batch, supplier reference, PO, receipt, location;
- physical/ATP/reserved/committed/damaged/quarantined/unsellable stock state;
- retail or wholesale visibility, shipping/York pickup/BSDN eligibility, offer status;
- current/missing/scheduled/stale price;
- evidence state, exact scope, issuer, review queue;
- publication, lifecycle, verification, media coverage, and fulfillment-blocker state.

Results show canonical identity and source version. Search is a projection and cannot authorize an action. Selecting a result refreshes the canonical object before a command is enabled.

## 9. Bulk operations

Potential bulk tasks include price scheduling, channel assignment, visibility, product archive, media role assignment, governed import, and receipt-line intake. Bulk does not mean one unchecked mutation.

Every bulk job requires:

- explicit saved scope and count, with exclusions visible;
- capability and object authorization per record;
- preview and dry validation with per-record result;
- expected versions and idempotent job identity;
- reason/source and required high-risk controls;
- atomicity declared as all-or-nothing only where one domain transaction can support it, otherwise explicit independently committed rows;
- no hidden success when only some records committed;
- downloadable safe result report and correction/retry path;
- one job audit plus each material record's audit/correlation.

A CSV or supplier feed cannot bypass product, inventory, evidence, pricing, or publication rules. Conflicting imports enter review/quarantine; they never auto-publish or silently overwrite canonical records.

## 10. Import and export governance

### Import

Supported future classes may include catalog CSV, inventory-receipt CSV, and supplier data through an adapter. The flow is upload, security/format validation, canonical mapping, preview, conflict detection, authority check, explicit commit, per-record audit, and reconciliation. Imports are idempotent where practical and retain source file/reference without exposing restricted raw data broadly.

Inventory imports represent receipt or correction commands—not balance replacement. Supplier fields enter drafts/candidates with provenance. Unknown columns or values fail safely. No provider is selected by this architecture.

### Export

Potential reports include inventory position/history, price history, accounting-support records, PO/receiving records, and narrowly scoped operational views. Export requires capability, purpose, scope preview, sensitive-field minimization, audit, encrypted/expiring delivery, and retention/deletion handling. It cannot combine another party's private data, wholesale content, proof, or security material without explicit authority.

## 11. Operational signals

Signals create internal work—not customer-facing claims or automatic authority.

| Signal | Trigger ownership | Operator recovery |
|---|---|---|
| `LOW_STOCK` | Configurable inventory rule | Review position, demand, allocation, and replenishment; threshold remains owner-gated |
| `OUT_OF_STOCK` | Canonical ATP result | Review reservations, receipts, quarantine, channel offers |
| `RESERVATION_AGING` | Reservation policy | Inspect active claim; release only with authority |
| `EVIDENCE_STALE` | Evidence currentness rule | Review successor/source; suppress dependent positive claim as governed |
| `EVIDENCE_MISSING` | Evidence expectation rule | Obtain or explicitly mark not supplied; never infer |
| `MEDIA_MISSING` | Product-role coverage rule | Upload/assign or use honest fallback |
| `PRICE_MISSING` | Pricing/readiness rule | Create approved exact price; block purchase resolution |
| `UNPUBLISHED` | Catalog workflow | Review readiness; never auto-publish |
| `QUARANTINED` | Inventory state | Resolve evidence/inspection/disposition under authority |
| `FAILED_PROJECTION` | Projection monitoring | Retry/rebuild; canonical data remains unchanged |
| `FULFILLMENT_BLOCKER` | Composed readiness/fulfillment | Resolve exact dependency; do not silently switch method |

Thresholds, recipients, escalation windows, and service objectives remain owner/technology gates. Duplicate signals should correlate to a single work item without deleting the underlying canonical state.

## 12. Dashboard behavior

The dashboard prioritizes blocked or expiring work, not vanity analytics. It may summarize receiving sessions awaiting inspection, stock discrepancies, low/out-of-stock positions, aged reservations, unpublished approved products, missing prices/media, evidence review/staleness, failed projections, fulfillment blockers, high-risk approvals, and security/audit alerts.

Each tile identifies source timestamp and links to a filtered work queue. Counts are projections. The operator re-reads the target canonical record before acting. Dashboard failure cannot change business state.

## 13. Error and recovery states

- **Validation error:** preserve input, identify exact field/rule, and allow correction.
- **Version conflict:** show current version and proposed changes; require reconciliation.
- **Authorization denied:** expose no sensitive details beyond permitted context; provide escalation route.
- **Dependency unknown/service error:** do not turn it into eligible, available, missing, or restricted; safely block the affected operation.
- **Partial bulk result:** enumerate committed, rejected, conflicted, and retryable records.
- **Projection lag:** label staleness, keep canonical reads available, and disable action based only on stale projection.
- **Ambiguous command outcome:** reconcile by idempotency/correlation before retry to prevent duplicate inventory, price, or order effects.

## 14. Archiving and deletion semantics

| Action | Meaning |
|---|---|
| Archive product | Remove from ordinary discovery while retaining identity, relationships, history, and support interpretation |
| Unpublish | Withdraw an approved presentation/sale capability without erasing canonical content |
| Deactivate SKU | Prevent new sale/selection of exact variant identifier; preserve orders and ledger |
| Remove media from publication | End an assignment/effective public rendition; retain governed master/history |
| Replace media | Create successor assets/assignments; preserve lineage |
| Delete draft | Allowed only under future retention policy when no legal, audit, referenced, or governed history requires it |
| Retention-required audit | Never editable/deletable through routine admin; disposed only by qualified retention process |
| Legal/accounting record | Retained, corrected, exported, or disposed under qualified policy, not catalog convenience |

Historical orders retain immutable line snapshots and references so they remain interpretable after catalog, price, media, evidence, or availability changes.

## 15. Accessibility and responsive operations

The eventual Admin must support keyboard operation, screen-reader labels and state announcements, zoom/text enlargement, high contrast, non-color-only status, error summaries, accessible data tables, confirmation for destructive/high-risk actions, and reduced motion. Large media previews and graphs must not hide the textual facts needed to operate. Accessibility alternatives receive the same authorization and protected-content controls as their visual counterparts.

## 16. Current boundary

This document defines tasks and information architecture only. It does not specify final styling, framework, screen layouts, provider, alert thresholds, approval thresholds, reservation timeout, launch catalog, or operational staffing. It creates no working dashboard and grants no production implementation authority.
