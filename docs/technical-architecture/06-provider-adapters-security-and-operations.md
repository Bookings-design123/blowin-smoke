# Provider Adapters, Security, and Operations

## Adapter contract

Adapters translate canonical Blowin' Smoke requests/outcomes without becoming the owner of product, order, relationship or policy truth. Every adapter has a versioned mapping, correlation and idempotency support, bounded timeout, categorized errors, redacted audit record, health/lag visibility, export capability and tested replacement path. Provider selection is **NOT AUTHORIZED**.

## Adapter register

| Adapter capability | Canonical input → output | Sensitive exposure | Role / timeout, retry and idempotency | Outage fallback and audit | Portability / selection status |
|---|---|---|---|---|---|
| Commerce platform | Approved product/variant, price, cart/order commands → external refs/outcomes | Customer/order/commerce data | Sync commands + async events; bounded timeout; safe reads retry; writes require idempotency | Canonical modules remain authority; failure blocks affected action and preserves context; audit mappings/outcomes | Full catalog/order/export and no provider-only canonical IDs; **NOT SELECTED** |
| Payment and merchant services | Order/payment attempt, amount/currency, permitted customer/payment token context → authorized/failed/captured/refunded/unknown | Highest sensitivity; provider-held payment data | Sync authorization with async reconciliation; no blind retry; idempotency mandatory | Unknown outcome blocks duplicate charge and enters reconciliation; audit references, not prohibited payment data | Export attempts/outcomes/refunds; replace without rewriting Orders; **NOT SELECTED / UNDERWRITING UNRESOLVED** |
| Age verification | Minimal qualification request and rule scope → qualified/not qualified/unknown/error plus reference/version | Sensitive identity/age evidence | Sync before progression; retry only per approved privacy/failure policy; idempotency required | Fail closed as Service Error/Unknown, never Eligible or Ineligible by inference; access audit | Minimized result export/deletion and provider exit; **NOT SELECTED** |
| Eligibility/rule evaluation | Age result ref, exact destination/product/variant/format/method, effective context → eligible/ineligible/unknown/error | Destination and regulated-commerce context | Sync at PDP/cart/order checkpoints; retry service errors; context/rule idempotency | No default allowed; preserve cart and explain service failure; audit rule/version/input refs | Rules and decision history exportable; no opaque lock-in; **NOT SELECTED** |
| Tax | Address/product/price/fulfillment/order context → quote/commit/refund tax outcome/reference | Address and transaction data | Sync for final totals; async filings/reconciliation; idempotent commit/refund | Block final total when material unless future approved policy provides another lawful path; audit versions | Transaction/tax exports and replaceable mappings; **NOT SELECTED** |
| Carrier/rate/shipping | Eligible shipment context, package/order/address → services/rates/labels/status/errors | Address/contact/order contents | Sync rates/label commands, async status; idempotent label creation; bounded retries | No invented rate/timeline; preserve method selection and route operational recovery; audit provider refs | Labels/status/manifests export; carrier-independent shipment IDs; **NOT SELECTED** |
| York pickup operations | Eligible pickup selection, location/allocation/order → accepted/ready/released/exception | Customer identity/contact and order | Sync allocation/release checks + async readiness; idempotent transitions | Preserve order; no Ready notification without committed state; audit handoff/release | Canonical Pickup record survives tool replacement; **NOT SELECTED** |
| York delivery operations | Eligible York delivery context, address/allocation/order → zone/schedule/handoff/status | Address/contact/order | Sync serviceability/schedule, async status; idempotent scheduling | Outage is delivery service error, not product ineligibility; allow re-selection after revalidation | Export routes/status and preserve canonical Delivery IDs; **NOT SELECTED** |
| Catalog/PIM | Supplier/maker records and governed intake → mapped draft/approved catalog data | Commercial supplier data | Async/batch intake plus governed writes; idempotent source/version imports | Never auto-publish or overwrite canonical approval; quarantine conflicts; audit field provenance | Full raw/mapped exports and Blowin' Smoke IDs; **NOT SELECTED** |
| Owned inventory | Receipts, exact variants, locations, reservations/corrections → position/outcome/events | Commercial/operational data | Sync reservation/release, async receipt/reconciliation; idempotency mandatory | Conflict returns current position; no negative/assumed stock; durable reconciliation | Full ledger, receipts, positions, reservations and audit export; **NOT SELECTED** |
| Search | Approved projection documents/query/scope → ranked typed results, rationale refs and health | Queries; possible pseudonymous context | Sync query; async indexing; reads may retry within budget; writes version-idempotent | Browse/support recovery; never fall back to unverified compatibility/eligibility; audit index version | Rebuildable index and alias/ranking export; **NOT SELECTED** |
| Media/document storage | Approved asset/document bytes, metadata, rights/access command → immutable object/version/access outcome | Rights records, proof documents, possible restricted data | Sync authorized access/upload confirmation + async processing; content-addressed/idempotent writes | Textual media fallback; proof access error distinct from Missing; access audit | Original bytes/metadata/versions exportable; stable canonical IDs; **NOT SELECTED** |
| Customer identity | Minimal sign-in/account command → subject/session/reference/outcome | PII and credentials handled at boundary | Sync auth; token refresh under protocol; no unsafe automatic retry | Protect private data, preserve public task, offer safe re-auth; audit security events | Standard export/link/unlink/delete and canonical customer reference; **NOT SELECTED** |
| Consent | Subject/purpose/scope/policy version command → granted/denied/revoked/error record | PII and preference data | Sync decision, async propagation; idempotency per purpose/version | Absence/error means no consent; suppress affected processing; audit every change | Complete consent history export/deletion and granular scopes; **NOT SELECTED** |
| Customer support | Context bundle/case command/attachment refs → case/reference/status/error | PII, orders, attachments, sensitive context | Sync submit with async case updates; idempotent case creation/retry | Preserve safe draft/context; alternate contact only if approved; audit access/transfers | Full cases/comments/attachments/links export; canonical support IDs; **NOT SELECTED** |
| Notifications | Authorized consent + exact event/template/contact ref → accepted/delivered/failed/unsubscribed | Contact and preference data | Async by default; bounded provider calls; dedupe/idempotency mandatory | Commerce state never depends on marketing delivery; operational notices follow approved policy; audit purpose | Export consent-linked delivery/suppression history; **NOT SELECTED** |
| Analytics and observability | Minimized events/metrics/traces/logs → aggregates, alerts and diagnostic refs | Must exclude or redact PII/secrets; limited pseudonymous IDs | Async; loss/retry policies by class; event IDs dedupe | Analytics outage never blocks commerce; critical operational telemetry has durable fallback/alert | Raw/aggregate export, open schemas and provider exit; **NOT SELECTED** |

## Security and privacy requirements

### Authentication and authorization

- Customer and staff authentication are separate trust contexts.
- Staff access uses least-privilege roles aligned to domain write authority; support cannot approve catalog truth, receiving cannot author compliance rules, and marketing cannot alter consent or price history.
- High-risk writes require explicit authority, current version and auditable actor/service identity.
- Provider callbacks are authenticated, replay-protected and mapped to known attempts.

### Secret and encryption boundaries

- Secrets never enter source, logs, events, browser-readable configuration or canonical business records.
- Payment, identity and age-provider credentials are isolated per adapter and environment.
- Sensitive transport and stored data require encryption appropriate to the selected platform; key custody/rotation design remains OPEN until platform selection.
- Proof/rights documents and support attachments use authorized access, immutable versions and access logging.

### PII minimization, consent, retention and deletion

- Collect only data required for the named task; age verification stores the minimum approved result/reference.
- Consent is granular, purpose-bound, versioned and revocable; absence is not consent.
- Retention/deletion schedules remain OPEN pending qualified policy, but every adapter must support scoped export, deletion, legal/operational hold where authorized and propagation confirmation.
- Public catalog/search projections exclude private order, identity, age, support and consent data.
- Logs and analytics use redaction, minimized identifiers and access control; raw sensitive payloads are prohibited unless explicitly justified and governed.

## Operational requirements

| Area | Provider-neutral requirement |
|---|---|
| Audit logging | Immutable canonical audit for high-risk writes; access audit for sensitive records; correlation across command, event and provider attempt |
| Observability | Structured health, timeout/error class, event lag, projection version, retry/dead-letter, reservation conflict and correction propagation visibility |
| Alerting | Actionable ownership and escalation; exact quantitative thresholds remain OPEN |
| Backup/recovery | Canonical records, audit history and required documents must be restorable and verifiably consistent; RPO/RTO remain OPEN |
| Performance | Decision paths have bounded budgets and fail safely; exact latency/throughput targets remain OPEN pending traffic/platform evidence |
| Accessibility | Provider-hosted and integrated customer/staff surfaces must meet the repository's semantic, keyboard, focus, announcement, document and reduced-motion obligations |
| Correction propagation | Authorized correction invalidates projections/caches, revalidates active commerce and records consumer acknowledgments/failures |
| Data export and exit | Complete canonical data, provider refs, mappings, history, rights and documents in usable documented formats; replacement test before lock-in |
| Change management | Adapter/version changes use contract compatibility, test evidence, rollback and audit; provider features cannot silently redefine canonical meaning |
| Incident handling | Contain by domain, preserve evidence/context, distinguish service error from business outcome, reconcile uncertain side effects and publish authorized corrections |

Quantitative production SLOs, retention periods, staffing/on-call commitments and recovery targets are **OPEN** until real platform, provider, traffic and operating information exists.
