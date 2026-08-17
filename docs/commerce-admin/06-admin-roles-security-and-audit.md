# Admin Roles, Security, and Audit

**Document role:** Governing COM-ADM-01 administrative trust, authorization, security, privacy, and audit architecture
**Architecture status:** Logical architecture defined; production policies and providers remain open
**Live Admin:** Not implemented
**Production implementation authorized:** No
**Private Wholesale release authorized:** No

## 1. Purpose and boundary

Blowin' Smoke Admin is a high-trust operational entrance to canonical Catalog, Inventory, Pricing, Media, Evidence/COA, Channel Offers, Reservations, Supplier/Receiving, Order/Fulfillment, and Audit capabilities. It is not a universal database console and it does not create a parallel source of truth.

This document defines:

- administrative actors, roles, and atomic capabilities;
- the authorization decision and object/channel/location scope;
- stronger controls for high-risk operations;
- secure admin sessions, origins, uploads, and service boundaries;
- immutable/tamper-evident audit evidence;
- privacy, export, archival, deletion, recovery, and break-glass requirements; and
- the explicit decisions that remain open.

It does not select an identity provider, authentication method, database, admin framework, security service, scanner, device-management system, audit product, SIEM, or cloud provider. It creates no production accounts or permissions.

## 2. Governing security rules

1. Staff authentication is separate from customer authentication.
2. Authentication establishes an identity and assurance state; it never replaces object-level and action-level authorization.
3. Every material admin mutation is a canonical command, not a direct database edit.
4. Every command is authorized server-side against atomic capability, object scope, location/division/channel scope, current object version/state, purpose, and any high-risk conditions.
5. Default is deny. Missing, unknown, stale, revoked, unsupported, or unavailable authorization evidence never becomes permission.
6. No shared staff account is permitted. Every human action resolves to one accountable actor.
7. Owner and Administrator are capability bundles, not superuser bypasses.
8. Support cannot approve catalog truth; receiving/inventory staff cannot author compliance rules; marketing/catalog staff cannot alter consent or price history; wholesale decryption cannot mutate inventory, price, quote, or order truth.
9. Consequential stock, price, evidence, permission, publication, and financial changes cannot use silent last-write-wins.
10. The canonical domain mutation and its durable audit/outbox evidence are one success boundary. If required audit cannot be durably recorded, the governed write does not report success.
11. Corrections preserve original events/versions and add linked correction or compensating evidence; they never erase history.
12. Browser/PWA clients receive zero D3/D4 Private Wholesale protected payload. An admin role does not bypass the protected-client gate.
13. No approved Private Wholesale protected client exists today. A future authorized admin app must pass the separate security gate before protected fields can be returned.
14. GitHub stores source and architecture, never live roles, sessions, inventory, publication, or audit state.

## 3. Administrative trust contexts

```text
OWNER / AUTHORIZED STAFF
          |
          +--> WEB ADMIN ----------------------+
          |    public/internal operations      |
          |    zero protected-wholesale payload|
          |                                    v
          +--> FUTURE AUTHORIZED ADMIN APP --> ADMIN TRUST GATEWAY
               not an approved protected       |
               client today                    v
                                      CANONICAL COMMERCE API
                                                |
                  +-----------------------------+------------------+
                  | Catalog | Inventory | Price | Media | Evidence |
                  | Channel | Receiving | Orders | Audit           |
                  +-----------------------------------------------+
```

| Context | May receive | Must never receive or do by context alone |
|---|---|---|
| Web Admin | Authorized D0/D1 operations and separately authorized non-wholesale D2/D3 administrative data under the governing security architecture | D3/D4 Private Wholesale protected payload; E2EE plaintext; direct database access; capability bypass |
| Future authorized admin app | Only data allowed by its signed-build, endpoint/device, actor, capability, resource, and protected-client status | Protected payload until the client is separately proven and admitted; universal authority |
| Admin service identity | Named machine operations under one bounded contract | Human login, broad database access, cross-domain mutation, provider-as-truth |
| Background worker/adapter | Exact queued job/callback with least privilege, idempotency, and schema/version validation | Reuse as staff session, silent canonical overwrite, invented success |
| Auditor | Authorized read/query/export of audit evidence within scope | Operational mutation, audit deletion, unlogged sensitive read |

The Web Admin may initiate an authorized upload into quarantine and receive opaque processing status, but it cannot render a protected wholesale preview or retrieve a protected derivative. “Authorized Admin App” is an architectural slot, not evidence of present approval.

## 4. Actor, role, and capability model

### 4.1 Actor and assignment records

An `AdminActor` has a stable internal identity, employment/contract status where applicable, authentication identities, active/revoked state, role assignments, direct exceptional grants if policy permits them, object/division/location/channel constraints, and joiner/mover/leaver history.

A role assignment records:

- actor and role version;
- atomic capability set;
- subject/object, division, location, and channel scope;
- effective and expiry time;
- granting actor/authority and approval evidence;
- business reason;
- review owner and next review trigger;
- status and revocation; and
- immutable audit reference.

Roles never carry raw secrets or provider credentials. Machine identities use separate service records and cannot authenticate as humans.

### 4.2 Minimum role vocabulary

| Role | Intended bounded responsibility | Explicit non-authority |
|---|---|---|
| `OWNER` | Business-owner governance, exceptional approvals, role/security stewardship, and scoped operations | No bypass of MFA, protected-client gate, canonical validation, dual-control policy, or audit |
| `ADMINISTRATOR` | Day-to-day administration across explicitly granted domains | No automatic owner/security authority, no self-escalation, no direct database or audit control |
| `INVENTORY_MANAGER` | Receiving, inventory ledger operations, quarantine, reservations, and allocations within location scope | Product-fact approval, compliance/evidence authority, price history rewrite, permission management |
| `CATALOG_MANAGER` | Product/variant/SKU content, media, publication readiness, and assigned evidence intake/review | Inventory ledger correction, consent, security, unsupported product claims |
| `WHOLESALE_SALES` | Wholesale offers, reference-price proposals/changes as granted, qualification workflow, quotes, and conversation-to-order handoff | Direct stock mutation, universal E2EE access, customer-independent price rewrite, protected payload without approved client |
| `FULFILLMENT` | Authorized order, reservation-release, picking/packing/handoff and exception workflow | Inventory-history rewrite, price/evidence/publication/permission authority |
| `SUPPORT` | Minimum case/order/product context and approved recovery guidance | Catalog/evidence approval, protected-proof exposure by default, account-security bypass, inventory/price/custody/payment rewrite |
| `AUDITOR_READ_ONLY` | Scoped read-only audit, access, correction, and control evidence | Operational writes, role changes, audit alteration/deletion, unrestricted payload access |

Final staff structure, role names, role membership, direct grants, and staffing are owner/security decisions. These templates define boundaries, not live grants.

## 5. Atomic capability vocabulary

Capabilities use stable action names and are always evaluated with resource scope. The minimum architecture supports:

| Domain | Required capabilities |
|---|---|
| Catalog | `catalog.read`, `catalog.edit`, `catalog.publish`, `catalog.unpublish`, `catalog.archive`, `catalog.restore`, `variant.manage`, `sku.activate` |
| Inventory | `inventory.read`, `inventory.receive`, `inventory.adjust`, `inventory.quarantine`, `inventory.unquarantine`, `inventory.transfer`, `inventory.channel_reallocate` |
| Reservations | `reservation.read`, `reservation.release`, `reservation.override` |
| Pricing | `price.read`, `price.retail.edit`, `price.wholesale.edit`, `price.promotion.edit`, `price.history.read`, `quote.create`, `quote.convert` |
| Media | `media.read`, `media.upload`, `media.assign`, `media.reorder`, `media.replace`, `media.archive`, `media.rights.review`, `media.protected.read` |
| Evidence | `evidence.read`, `evidence.attach`, `evidence.review`, `evidence.replace`, `evidence.archive`, `evidence.claim_link` |
| Channel offers | `channel.read`, `channel.offer.edit`, `channel.visibility.edit`, `channel.fulfillment_eligibility.edit` |
| Wholesale | `wholesale.read`, `wholesale.publish`, `wholesale.hide`, `wholesale.allocation.edit`, `wholesale.profile.edit`, `wholesale.protected.read` |
| Supplier/Receiving | `supplier.read`, `supplier.manage`, `purchase_order.manage`, `receiving.commit`, `receiving.discrepancy.resolve` |
| Orders/Fulfillment | `order.read`, `fulfillment.manage`, `fulfillment.exception.resolve` |
| Administration | `staff.read`, `role.manage`, `audit.read`, `audit.export`, `bulk.execute`, `data.export`, `recovery.case.manage`, `account.recovery.execute`, `security.config`, `financial.correction` |

Capability naming may be encoded differently in implementation, but the separation of actions cannot collapse into `admin=true`.

## 6. Capability-based RBAC matrix

This matrix defines the maximum eligible role-template surface, not a production grant.

**Legend:**

- `S` — eligible for a standard scoped grant after authentication and canonical preconditions;
- `H` — eligible only through the high-risk control path;
- `R` — eligible for a separately scoped read capability only;
- `P` — additionally requires an approved protected client and protected-resource admission;
- `G` — architecture reserves the capability, but no production role is eligible until the named policy/authority gate is resolved;
- `—` — outside the role template.

Every `S`, `H`, `R`, or `P` still requires an explicit live assignment. `OWNER` and `ADMINISTRATOR` do not inherit every cell automatically.

| Capability | Owner | Administrator | Inventory manager | Catalog manager | Wholesale sales | Fulfillment | Support | Auditor / read only |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `catalog.read` | S | S | R | S | R | R | R | R |
| `catalog.edit`, `variant.manage`, `sku.activate` | S | S | — | S | — | — | — | — |
| `catalog.publish`, `catalog.unpublish` | H | H | — | H | — | — | — | R |
| `catalog.archive`, `catalog.restore` | H | H | — | H | — | — | — | R |
| `inventory.read`, `reservation.read` | S | S | S | R | R | R | R | R |
| `inventory.receive` | S | S | S | — | — | — | — | R |
| `inventory.adjust` | H | H | H | — | — | — | — | R |
| `inventory.quarantine` | S | S | S | — | — | R | — | R |
| `inventory.unquarantine` | H | H | H | — | — | — | — | R |
| `inventory.transfer`, `inventory.channel_reallocate` | H | H | H | — | — | — | — | R |
| `reservation.release` | S | S | S | — | — | S | — | R |
| `reservation.override` | H | H | H | — | — | H | — | R |
| `price.read`, `price.history.read` | S | S | R | R | R | R | R | R |
| `price.retail.edit`, `price.promotion.edit` | H | H | — | H | — | — | — | R |
| `price.wholesale.edit` | H/P | H/P | — | — | H/P | — | — | R/P |
| `quote.create`, `quote.convert` | H/P | H/P | — | — | S/P | — | R | R/P |
| `media.read` | S | S | R | S | R | R | R | R |
| `media.upload`, `media.assign`, `media.reorder` | S | S | — | S | — | — | — | R |
| `media.replace`, `media.archive`, `media.rights.review` | H | H | — | H | — | — | — | R |
| `media.protected.read` | P | P | — | P | P | — | — | R/P |
| `evidence.read` | S | S | R | S | R/P | R | R | R |
| `evidence.attach` | S | S | S | S | — | — | — | R |
| `evidence.review`, `evidence.claim_link` | G | G | — | G | — | — | — | R |
| `evidence.replace`, `evidence.archive` | H | H | — | H | — | — | — | R |
| `channel.read` | S | S | R | S | R | R | R | R |
| `channel.offer.edit`, `channel.visibility.edit`, `channel.fulfillment_eligibility.edit` | H | H | R | H | R | R | — | R |
| `wholesale.read`, `wholesale.protected.read` | P | P | — | R/P | P | — | — | R/P |
| `wholesale.publish`, `wholesale.hide`, `wholesale.profile.edit` | H/P | H/P | — | — | H/P | — | — | R/P |
| `wholesale.allocation.edit` | H/P | H/P | H/P | — | R/P | — | — | R/P |
| `supplier.read` | S | S | S | R | — | R | — | R |
| `supplier.manage`, `purchase_order.manage` | H | H | S | — | — | — | — | R |
| `receiving.commit`, `receiving.discrepancy.resolve` | H | H | S | — | — | — | — | R |
| `order.read` | S | S | R | R | R | S | R | R |
| `fulfillment.manage` | S | S | R | — | — | S | R | R |
| `fulfillment.exception.resolve` | H | H | R | — | — | H | R | R |
| `staff.read` | S | S | — | — | — | — | — | R |
| `role.manage` | H | H | — | — | — | — | — | R |
| `audit.read` | S | S | R | R | R | R | R | S |
| `audit.export`, `data.export` | H | H | — | — | — | — | — | H |
| `bulk.execute` | H | H | H | H | H/P | H | — | R |
| `recovery.case.manage` | S | S | — | — | — | — | S | R |
| `account.recovery.execute` | H | H | — | — | — | — | — | R |
| `security.config` | H | H | — | — | — | — | — | R |
| `financial.correction` | G | G | — | — | — | — | — | R |

`G` is deliberate. Evidence-verification authority and financial-correction authority are not established by COM-ADM-01. A future accountable role and qualified policy must be approved before any grant exists.

Cells marked `P` are unavailable today because no protected client is approved. A read-only or auditor role does not weaken the protected-client requirement. For non-wholesale evidence or media, normal classification and access rules apply; for D3/D4 Private Wholesale content, protected admission is mandatory.

## 7. Authorization decision contract

Every admin query or command is decided from an authenticated server-known context:

```text
actor identity + actor status
+ authentication assurance + recency
+ session status + risk/revocation
+ endpoint/client status when required
+ capability assignment + role version
+ division/location/channel/object scope
+ target object + current state/version
+ command purpose/reason
+ approval evidence when required
+ idempotency/replay context
+ protected-resource grant when required
------------------------------------------------
= ALLOW | DENY | STEP_UP_REQUIRED | APPROVAL_REQUIRED | CLIENT_REQUIRED
```

The decision must not rely solely on a hidden UI control, user-agent string, client-supplied role, `approved=true`, cached authorization, or provider credential. Denials return a safe categorized reason without revealing whether an unauthorized sensitive object exists.

### 7.1 Required command preconditions

- The actor and assignment are active and not expired/revoked.
- The session meets the required assurance and recency.
- The capability covers the exact object, division, location, and channel.
- The target record version and state still match the operator's reviewed state.
- The command supplies an operation-specific idempotency key and purpose/reason where required.
- Required approval is current, distinct where policy requires separation, and bound to this exact proposed change.
- Canonical domain invariants pass; authorization cannot invent stock, price, evidence, publication, or fulfillment truth.
- Any protected-wholesale response passes the separate signed-client, supported-version, trusted-endpoint, account/room/resource, expiry, and revocation gate.

If any mandatory signal is missing or unknown, the operation fails closed and preserves the operator's safe draft where appropriate.

## 8. High-risk operation controls

High-risk controls are composable requirements, not a single "Are you sure?" modal. The system must support strong MFA, recent authentication, step-up, reason codes, constrained free-text justification, owner-only capability where approved, second approval where warranted, security notification, immutable proposed-change preview, and post-action review.

| Operation | Mandatory architecture controls | Policy still open |
|---|---|---|
| Large inventory correction / stocktake correction | `inventory.adjust`; exact SKU/lot/location and before/proposed quantity; expected ledger version; canonical units; reason; step-up; compensating ledger entry; audit; projection/revalidation impact; alert | Quantity/value threshold; when a second approver is mandatory |
| Wholesale reference-price change | `price.wholesale.edit`; approved protected client; step-up; exact offer/variant, currency, prior/new value and effective context; no negotiated-quote overwrite; audit and affected-view refresh | Amount/percentage threshold, approval role, timing policy |
| COA/evidence replacement | `evidence.replace`; step-up; immutable new version; exact product/variant/lot scope; reason; source/rights review; predecessor preserved; affected-claim preview; audit and re-evaluation | Required verifier, second approval, acceptable issuers/currency rules |
| Manual reservation override | `reservation.override`; step-up; exact reservation/position/order; expected versions; reason; no negative/assumed stock; compensating transition; audit and alert | Allowed reasons, quantity/value threshold, second approver |
| Permission/role change | `role.manage`; step-up; proposed grant/revoke diff; scope/expiry/review owner; no self-approval or self-escalation; notification; immutable audit | Which grants require owner-only action or two-person approval; review cadence |
| Account recovery execution | Separate recovery authority; step-up; identity/recovery evidence; no support bypass; revoke/rotate affected sessions; notify; cooldown/risk review as approved; audit | Recovery proof, provider, cooldown, notification and exception policy |
| Security configuration/key authority | `security.config`; strongest selected assurance; exact versioned diff; separation from ordinary operations; alert; rollback/recovery evidence; immutable audit | Owner-only and dual-control list; managed-device and key-administration policy |
| Bulk export | `data.export`/`audit.export`; step-up; purpose, exact filters/fields/records/classification; preview/count; approval; encrypted expiring output; download/access audit; no secrets or unrelated parties | Size/sensitivity thresholds, expiry, approver, retention and destination policy |
| Sensitive wholesale visibility/reveal | Capability plus approved protected client, signed supported build, trusted endpoint/device, actor/account/room/object grant, current version, purpose, expiry and revocation; zero browser/PWA payload | Client remains unapproved; device/client and operating policy unresolved |
| Bulk publication/price/channel mutation | `bulk.execute` plus each per-record capability; validated preview; current version per record; per-record result/audit; step-up; no rule bypass | Atomic-all versus partial commit by operation; thresholds/approvals |
| Manual financial correction | No live role is authorized; must use a separately approved finance capability, step-up, idempotent compensating record, external reconciliation, reason, audit, and separation from support | Finance role, provider/ledger contract, legal/accounting rules, mandatory dual approval |

No monetary, quantity, percentage, record-count, or time threshold is set here. The owner and qualified security/finance/compliance reviewers must approve them before implementation.

## 9. Administrative authentication and sessions

Production Admin requires:

- a separate staff identity context and origin from customer authentication;
- mandatory strong phishing-resistant MFA at the highest feasible later-selected assurance;
- no shared accounts and explicit joiner/mover/leaver workflows with rapid revoke;
- opaque high-entropy server sessions delivered only through secure, intentionally scoped cookies or an equivalently reviewed native session mechanism;
- session identifier rotation after login, recovery, assurance/role change, and suspicious activity;
- idle and absolute expiry, with exact periods left open;
- reauthentication/step-up for sensitive reads, decrypts, exports, role/security changes, and high-risk commands;
- active session/device inventory, terminate-one/terminate-all, suspicious-login notification, and recovery audit;
- brute-force, enumeration, credential-stuffing, fixation, hijacking, and replay defenses;
- rate and concurrency controls with thresholds established by a later abuse review;
- managed-device or equivalent endpoint-posture decision at the implementation gate; and
- immediate revocation behavior for role removal, lost device, staff departure, compromise, or break-glass expiry.

For cookie-authenticated Web Admin, every state-changing request requires architecture-appropriate same-origin and anti-CSRF controls. No replayable early transport data is accepted for admin writes. Sensitive tokens never appear in URLs, logs, referrers, source, analytics, or support text.

## 10. Admin origin, browser, and application security

The future implementation must establish:

- authenticated secure transport on every hop and strict origin routing;
- a dedicated Admin security boundary with deny-by-default network/application routes;
- safe output encoding, parameterized/typed data access, schema validation, and a strict content policy;
- no third-party scripts, pixels, session replay, advertising, unrelated analytics, or cross-origin resources on protected admin paths;
- origin/referrer/cache controls that prevent credentials, capabilities, protected identifiers, and sensitive responses from propagating;
- dependency/build provenance, signed release, vulnerability management, and rollback evidence;
- authorization at the API on every object/action, not just hidden navigation;
- explicit file upload validation and quarantine under [05-media-and-evidence-management.md](05-media-and-evidence-management.md);
- no direct browser or app access to canonical databases, object credentials, key stores, or provider administrative consoles; and
- safe error responses that separate authorization, validation, conflict, service failure, and unknown outcome without leaking payload.

Secrets and keys use purpose-separated, environment-specific custody. Passwords, private keys, content keys, API/provider credentials, session/reset tokens, signed upload grants, and authorization headers never enter source control, browser-readable general configuration, URLs, routine logs, analytics, canonical business events, audit diffs, or support transcripts.

## 11. File and import security

Admin uploads and imports are untrusted even when submitted by the owner. Media/evidence file controls are defined in document 05. CSV/supplier imports additionally require:

- an explicit import capability and purpose;
- size/row/column/encoding/formula and schema limits;
- neutralization of spreadsheet-formula injection in generated previews/exports;
- mapping to stable canonical identifiers, not name similarity;
- complete parse and validation before any commit;
- preview of proposed creates/updates/rejections and affected versions;
- per-record domain validation, authorization, and audit;
- idempotency/correlation and an explicit atomic-all or partial-result contract;
- no direct provider/database writes and no bypass of publication, evidence, price, inventory, or channel rules; and
- safe downloadable rejection detail without sensitive data leakage.

Exact file limits and accepted schemas remain implementation decisions.

## 12. Audit system

### 12.1 AuditEvent contract

Every material admin mutation and required sensitive read creates a stable `AuditEvent` containing the minimum evidence needed to answer who, what, when, why, on which object/version, from which authority, and with what result.

| Field group | Required contents |
|---|---|
| Identity | Stable event ID; actor or service identity; actor type; effective role/capability snapshot; approval actor(s) where applicable |
| Authority | Capability, scope, assurance/step-up class, decision/policy version, protected-client status category when material |
| Target | Domain, object type, stable object ID, prior version, proposed/result version, related SKU/lot/order/reservation/media/evidence refs |
| Command | Versioned command type, purpose, controlled reason code, minimized justification reference, idempotency key representation |
| State change | Previous and new canonical state/value needed to reconstruct the decision, or a protected encrypted delta/snapshot reference when raw content would be unsafe |
| Time | Occurred, received, authorized, approved, and effective times where distinct |
| Correlation | Non-secret request/session correlation, causation/event/job/provider-attempt references, source surface/client class |
| Result | Allowed/denied/step-up/approval/client requirement, committed/rejected/conflict/failed/unknown, reason category, correction/reversal link |
| Sensitivity | Classification, retention/hold category, access-control category, redaction policy/version |

Inventory and price audit must retain exact canonical before/after values, units/currency, and reason in restricted audit evidence. For D2/D3/D4 payload, the audit records safe references, hashes where useful, changed-field names, status/version transitions, and an encrypted restricted delta only when purpose requires it. It never duplicates raw media, COAs, wholesale plaintext, identity documents, credentials, full request bodies, or secrets.

### 12.2 Audit coverage

Required material audit includes:

- actor authentication, recovery, session/device revoke, and suspicious access;
- role/capability grant, scope/expiry change, access review, and revoke;
- product/variant/SKU create, edit, publish, unpublish, archive, and restore;
- inventory receipt, reservation/release/commit, correction, damage/loss/shrink, quarantine/unquarantine, stocktake, reallocation, and transfer;
- retail/wholesale/promotion price changes, quote conversion, and manual financial correction;
- media upload disposition, rights, assignment, reorder, replacement, invalidation, publication, archive, protected reveal, and export;
- evidence/COA upload, applicability, review, status, conflict, replacement/supersession, claim link, archive, sensitive read, and export;
- wholesale visibility, private reference price, allocation, profile, quote, protected-resource admission, and deliberate declassification;
- supplier, purchase order, receiving, discrepancy, and expected-versus-actual correction;
- import/bulk operation preview, approval, per-record result, and rejection;
- security/key/configuration administration, break glass, and incident action; and
- correction propagation, consumer acknowledgement/failure, restore, deletion, and export.

### 12.3 Integrity, atomicity, and access

- Audit records are append-only or tamper-evident and cannot be edited or deleted through ordinary Admin.
- The canonical domain write and local durable audit/outbox record commit atomically. External audit projections may lag; if the local evidence cannot be committed, the write fails.
- At-least-once event delivery is deduplicated by stable event/command identity. Replay rebuilds audit/read projections and never repeats external side effects.
- Audit access is capability- and purpose-scoped; sensitive audit reads and exports are themselves audited.
- Auditors cannot alter business records or audit evidence. Operators cannot erase or approve their own audit exception.
- Corrections append new linked evidence and identify affected consumers/propagation. They do not rewrite the prior event.
- Audit retention, tamper-evidence mechanism, immutable period, archival, hold, export, and deletion schedule require qualified policy and technology selection.

Security/audit evidence is separate from routine logs, metrics, traces, analytics, and crash reports. General telemetry cannot substitute for the canonical audit record.

## 13. Logging, observability, and alerting boundary

Routine logs, metrics, traces, analytics, crash reports, error responses, and support tools must not contain:

- passwords, private/content keys, provider secrets, session/reset/upload tokens, full authorization headers, or raw capability grants;
- D4 wholesale plaintext or decrypted attachments;
- private wholesale prices, counts, protected media, manifests, or evidence content unless a separately justified restricted security event requires a safe reference;
- raw identity documents/numbers, prohibited payment data, full address/contact details, precise GPS, proof media, or unrestricted driver identity;
- media/evidence binaries, delivery instructions, support/feedback free text, or unrestricted request/response bodies; or
- database dumps or bulk export contents.

Use versioned allowlisted event schemas, stable event names, collection-time redaction, pseudonymous correlation, bounded cardinality, purpose-based access, and explicit retention. Observability must expose authentication/authorization failures, conflict rates, queue/outbox lag, media scan/processing failures, stale protected grants, audit write failures, correction/deletion propagation failures, and suspicious access without reconstructing sensitive business content.

Alert thresholds, paging ownership, staffing, severity, escalation, and incident-notification timing remain open.

## 14. Privacy, classification, and protected data

Admin enforces the repository classification model:

- D0: approved public catalog, price, media, and policy content;
- D1: unpublished catalog, supplier/commercial terms, inventory operations, and internal service state;
- D2: personal, pseudonymous, behavioral, commercial, and precise operational data;
- D3: restricted identity, compliance, payment-reference, authentication, proof/media, privileged, security, and private-wholesale catalog data; and
- D4: designated Private Wholesale message/attachment plaintext available only at authenticated communicating endpoints.

Classification follows the most sensitive content and aggregation can raise it. Encryption does not lower classification or create authorization.

For every data family, the operational system must support `COLLECT -> USE -> SHARE -> RETAIN -> DELETE`, plus export and correction, with purpose, authority, minimum fields, owner, access, triggers, audit, propagation, and holds. Exact lawful basis, consent, notice, retention, deletion, and legal-hold rules remain qualified policy decisions.

Public/search projections exclude private order, identity, age, support, consent, supplier terms, unpublished catalog, inventory operations, audit, and protected wholesale data. Wholesale metadata and ciphertext have independent minimization and retention. No server process may routinely decrypt D4 content, use it for analytics/marketing/search, or move it into canonical commerce records without deliberate user-selected declassification and a governed receipt.

## 15. Export, archive, deletion, and correction

### 15.1 Export

Every export requires authenticated actor, explicit capability, object/field scope, purpose, classification review, affected-party isolation, strong transport/storage protection, expiry, access audit, and deletion confirmation. High-risk exports require step-up and the configured approval policy.

Exports never include secrets, another party's private content, unneeded proof/identity evidence, or unrestricted protected-wholesale payload. A server-side D4 export may include only authorized ciphertext and metadata; plaintext export, if offered, belongs to the approved endpoint.

### 15.2 Archive and deletion

Admin distinguishes:

- archive product;
- unpublish one or more channel offers;
- deactivate SKU;
- remove a media assignment;
- replace/archive media or evidence version;
- delete a disposable draft with no governed dependency;
- expire/delete a generated export or cache;
- delete/anonymize personal data under approved policy; and
- retain canonical order/accounting/evidence/audit records or holds.

Hard deletion is not a shortcut for correction. Historical orders retain interpretable line/price/product/proof references. Deletion reconciles canonical data, projections, caches, objects, adapters/providers, exports, and backup expiry. Failure remains visible and retryable; Admin cannot say complete merely because the primary row disappeared.

### 15.3 Correction

Corrections carry original and corrected object/version, authority, reason, effective time, affected scope, and consumer propagation. Inventory corrections use ledger/compensating entries. Price/evidence/catalog corrections preserve prior values and order snapshots. A correction invalidates/rebuilds affected projections and revalidates active commerce where required.

## 16. Joiner, mover, leaver, access review, and break glass

### Joiner

- establish individual staff identity;
- verify approved relationship and manager/security authority;
- assign the minimum role/capability/scope with expiry/review owner;
- enroll selected strong authenticators and endpoint posture;
- record acknowledgement/training where policy requires; and
- audit every grant.

### Mover

- derive new requirements from current responsibilities, not old access;
- revoke obsolete capabilities before or with new grants;
- reassess object/location/channel scope, protected endpoint, sessions, approvals, and conflicts of interest; and
- notify and audit.

### Leaver or compromise

- revoke staff identity, active sessions, registered endpoints/devices, outstanding approvals, and service access immediately according to severity;
- stop new E2EE conversation delivery and initiate required rekey/reverification;
- preserve and review relevant audit without granting access to content outside incident purpose; and
- rotate/revoke exposed credentials or keys under the separate key lifecycle.

### Access review

Periodic review records owner, reviewed grants/scopes, evidence, exceptions, removal, due/complete time, and unresolved items. Frequency and reviewer hierarchy remain open.

### Break glass

Break-glass access is separately issued, time-bound, purpose-bound, strongly authenticated, alerted in real time, unable to erase audit, and reviewed after use. It cannot bypass canonical commerce invariants, the protected-client gate, or create access to D4 plaintext outside an authenticated endpoint. Staffing, eligible actions, maximum duration, approval, and emergency recovery policy remain open.

## 17. Service identities and provider boundaries

Every service/adapter has a named, environment-specific, least-privileged identity. Machine credentials are narrowly scoped, rotated/revoked, never reused as human sessions, and never stored in source or routine logs.

Provider callbacks and cross-boundary commands require authentication, replay protection, correlation to a known attempt, schema/version validation, idempotency, bounded timeout, categorized errors, redacted audit, health/lag visibility, and canonical reconciliation. A valid provider credential never authorizes direct canonical storage writes.

Every future adapter contract specifies exact fields/classification/purpose, direction, provider role, authentication/encryption/access, retention/deletion/hold, subprocessors/regions, secondary-use prohibition, rights propagation, incident duties, timeout/retry/idempotency, full export, migration/termination, change notice, and tested replacement. Provider selection is not authorized by COM-ADM-01.

## 18. Operational failure semantics

Admin must distinguish:

- `UNAUTHENTICATED`;
- `UNAUTHORIZED`;
- `STEP_UP_REQUIRED`;
- `APPROVAL_REQUIRED`;
- `PROTECTED_CLIENT_REQUIRED`;
- `INVALID_INPUT`;
- `VERSION_CONFLICT`;
- `DOMAIN_RULE_BLOCKED`;
- `DEPENDENCY_SERVICE_ERROR`;
- `PROCESSING_PENDING`;
- `PARTIAL_RESULT` only for operations whose contract explicitly permits it;
- `OUTCOME_UNKNOWN_RECONCILIATION_REQUIRED`; and
- `AUDIT_UNAVAILABLE_WRITE_BLOCKED`.

Service failure does not become business failure or success by inference. A conflict returns current version/state and safe recovery. Unknown financial/provider outcomes block blind retry. A protected-client failure returns zero protected payload.

## 19. Decisions and open gates

### Architecture decided

- separate staff trust context and capability-based RBAC;
- default-deny, server-side object/action authorization with scope and current version;
- no shared accounts, superuser bypass, or direct database administration through Admin;
- high-risk control path with step-up, reason, approval/alert capability, and immutable preview;
- append-only/tamper-evident audit for material mutations and sensitive reads;
- canonical write plus durable audit/outbox as one success boundary;
- correction lineage instead of destructive history rewrite;
- browser/PWA zero protected-wholesale payload; and
- no approved protected client or production Admin today.

### Owner decision required

- final roles, staff membership, direct grants, divisions/locations/channels, and delegation limits;
- owner-only actions, dual-approval actions, separation-of-duty conflicts, and substitute/emergency approvers;
- inventory, price, COA, reservation, bulk, export, and financial high-risk thresholds;
- access-review cadence, exception expiry, alert recipients, and operational escalation;
- exact import/bulk atomicity by operation; and
- break-glass eligibility, actions, duration, review, and staffing.

### Provider / technology selection required

- staff identity/authentication/MFA/recovery provider and assurance targets;
- admin web/native application framework, session store, device posture/management, and integrity/attestation;
- policy/authorization engine implementation;
- database, transactional outbox, audit/tamper-evidence, object/key/secret, backup/recovery, monitoring/SIEM, and rate-limiting systems;
- file scanning/parser isolation under document 05; and
- protected-client platform after execution proof.

### Legal / compliance required

- staff/workforce privacy, monitoring, location/device, access, appeal, notice, and retention policy;
- data-family purposes, lawful bases/consent, disclosure, export/correction/deletion, legal holds, and breach/incident duties;
- evidence/COA verification authority and regulated-product consequences;
- accounting/financial correction, records, approval, and retention rules; and
- provider roles, regions/transfers, subprocessors, contracts, and exit duties.

### Implementation required

- schemas, migrations, policy data, APIs, session and authorization enforcement, admin interfaces, audit/outbox, adapters, tests, monitoring, recovery, and runbooks;
- abuse cases for credential theft, privilege escalation, IDOR, CSRF, XSS, injection, replay, bulk misuse, export leakage, audit failure, provider forgery, and protected-client bypass;
- access-control, concurrency, idempotency, fail-closed, restore/export/delete, and correction-propagation proof; and
- owner/staff training and real operational validation.

## 20. Current implementation status

| Question | Status |
|---|---|
| Capability/RBAC architecture defined | `YES` |
| High-risk operation control architecture defined | `YES` |
| Audit contract and coverage defined | `YES` |
| Live Admin authentication/authorization implemented | `NO` |
| Live roles or staff accounts created | `NO` |
| Identity, audit, or security provider selected | `NO` |
| Protected wholesale client approved | `NO` |
| Browser/PWA protected payload permitted | `NO` |
| Production implementation authorized | `NO` |
| Launch readiness established | `NO` |
