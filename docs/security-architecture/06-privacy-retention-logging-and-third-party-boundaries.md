# Privacy, Retention, Logging, and Third-Party Boundaries

**Document role:** Governing privacy lifecycle and disclosure architecture
**Implementation status:** Exact purposes, lawful bases, rights, and periods require qualified policy/legal approval

## 1. Privacy operating rule

For every data family, Blowin' Smoke must define and enforce:

```text
COLLECT -> USE -> SHARE -> RETAIN -> DELETE
                    ├──────────────> EXPORT
                    └──────────────> CORRECT
```

Each step needs an approved purpose, authority, minimum fields, responsible owner, access scope, trigger, audit behavior, and exception/hold handling. “We may need it” is not a purpose. Encryption does not authorize collection or indefinite retention.

Exact lawful basis, consent language, rights, notice, age-document policy, workforce policy, retention periods, deletion timing, and legal holds remain `OPEN — QUALIFIED POLICY REQUIRED`. This document defines required system capability without inventing law.

## 2. Data-lifecycle matrix

| Data family | Collect | Use | Share | Retain trigger, not duration | Delete / anonymize | Export / correct |
|---|---|---|---|---|---|---|
| Customer identity and contact | Minimum account/transaction/support fields under disclosed purpose | Authentication, transaction, required communication, support | Only owning services and contracted adapters for exact purpose | Active relationship, transaction/evidence need, approved hold | Remove or anonymize when purpose/obligation ends; propagate | Authenticated scoped export; identity correction preserves audit and downstream propagation |
| Order history | Canonical lines, prices, outcomes, provenance | Customer service, accounting, fulfillment, correction | Minimum to payment/tax/fulfillment/support adapters | Canonical business/evidence policy and hold | Apply approved deletion/anonymization without corrupting financial/evidence truth | Versioned correction; export excludes other parties and secrets |
| Addresses and location | Only address/location needed for selected fulfillment | Eligibility, routing, delivery, support case | Geocode/route/delivery adapters under explicit contract | Active transaction plus approved evidence/exception trigger | Delete or minimize full detail; invalidate projections/provider copies | Authenticated export; material correction forces revalidation |
| Precise driver GPS | Active assignment, declared purpose, permission/consent, bounded tracking session | Current dispatch/customer reduced projection, safety/exception review | Routing/tracking adapter only minimum data | Active operational session, then approved short recovery/evidence trigger | Delete raw observations or approved downsample/derive; never indefinite route history | Worker-access/correction policy required; raw observation corrected by annotation, not rewrite |
| Driver identity/device | Minimum employment/contract, assignment, security context | Authorization, dispatch, custody, safety, incident | Minimum to required operational services | Active role/device/assignment plus approved record trigger | Revoke device/session; delete/minimize according to workforce policy/hold | Role and device correction audited; export rights defined by qualified policy |
| Age qualification | Minimized method category, result, reference, authority/rule version, times | Eligibility and required audit | Approved verifier/owning domain; support sees minimum status | Policy/evidence trigger; no indefinite default | Delete per approved schedule and provider confirmation | Correct through linked attempt/correction; never overwrite result history |
| Raw ID evidence, if exceptionally authorized | Prohibited by default; only qualified purpose and minimum fields/media | Exact approved verification/incident purpose | Strict verifier/evidence role only | Shortest approved purpose/hold trigger | Verified prompt deletion across copies/backups/provider lifecycle | Restricted export/correction under qualified procedure |
| Handoff authorization | Request, server evaluation, authority/rule version, result | Delivery decision and audit | Customer/driver get minimum current result | Delivery/evidence/correction trigger | Minimize/delete under evidence schedule | New evaluation/correction links to original; no destructive edit |
| Proof of delivery | Minimum governed media/fact, integrity, actor/session/time/purpose | Custody/completion evidence, authorized dispute | Controlled evidence/support/legal role only | Evidence/dispute/hold trigger | Delete raw media when approved; retain only allowed minimized evidence/reference | Access/export logged; correction is addendum/linked record |
| Delivery instructions | Customer-provided minimum free text | Perform one delivery; approved support | Assigned driver/dispatcher minimum only | Active delivery and short approved exception window | Delete/minimize after purpose; no general customer profile | Customer correction versioned and may force revalidation |
| Tip/payment references | Amount intent/outcome/provider refs, never credentials | Payment, payable, payout, reconciliation | Payment/finance adapters and authorized roles | Financial/evidence trigger | Follow qualified financial policy; delete unnecessary context | Append-only correction/reversal; scoped export |
| Feedback and comments | Separate overall/driver feedback, explicit contact request | Service quality and approved recovery | Minimum support/recovery role; workforce use separately governed | Support/recovery purpose and approved review trigger | Delete/anonymize free text and contact linkage when purpose ends | Correction/addendum; contact consent independently revocable |
| Support free text/attachments | Minimum needed to resolve case; warn against unnecessary sensitive input | One case and governed recovery | Assigned support/evidence adapter only | Case closure plus approved exception/hold | Delete/minimize attachments and free text on schedule | Authenticated case export; correction cannot rewrite commerce truth |
| Wholesale message ciphertext | Ciphertext envelope only at intermediary | Queue/deliver/retry/delete | Recipient endpoint/object store under E2EE routing | Delivery/expiry/conversation policy | Delete ciphertext/objects per verifiable server lifecycle | Server export is ciphertext/metadata; endpoint plaintext export is separate |
| Wholesale plaintext | Endpoint compose/view only | Private negotiation; deliberate declassification if explicitly chosen | Communicating endpoint; selected content only through disclosed conversion | Endpoint policy; no server retention | Local deletion limits disclosed; cannot guarantee peer/export deletion | Endpoint-controlled; canonical correction after declassification follows target domain |
| Wholesale metadata | Minimum participants/endpoints/routing/times/sizes/state/security telemetry | Delivery, device security, abuse, incident | Minimum operations/security services | Independently approved routing/security trigger | Delete/anonymize separately from ciphertext | Scoped account/device export and correction where meaningful |
| Audit/security logs | Minimum event, actor/pseudonym, authority, target ref, result, time, correlation | Accountability, detection, investigation, recovery | Auditors/security under restricted purpose | Risk/evidence/hold trigger | Approved expiry; immutable period and deletion can coexist through staged policy | Append correction; export narrowly scoped and redacted |

## 3. GPS privacy flow

```text
Authenticated active GPS session
  -> encrypted ingestion boundary
  -> append-only short-lived operational observation store
  -> quality/staleness/sequence validation
  -> minimized current-location + ETA/freshness projection
  -> delivery completes / permission revoked / session ends
  -> delete raw observations OR approved downsample/derived evidence
  -> retain only approved milestones/evidence for an explicit period
```

Rules:

- Collection begins only for an active assignment, declared delivery purpose, driver permission/consent, and bounded GPS session.
- Store observed and received time, approved precision, accuracy/quality, source alias, sequence/dedupe, and audit context.
- Rejected, stale, duplicate, or implausible observations cannot move the customer marker or fabricate arrival, ETA, failure, or success.
- Customers receive only an approved reduced position/ETA/freshness view. They never receive raw route history, off-duty location, driver home address, or unrestricted coordinates.
- General analytics receives derived distance/time/milestones, not precise coordinates or unrestricted route history.
- Permission revocation stops collection immediately, logs the event, degrades tracking visibly, and starts operational recovery. It is not automatic driver fault or pay evidence.
- Sampling, precision, background behavior, stale thresholds, off-route logic, geofences, retention, workforce access, consent, and labor policy remain open.

## 4. Retention architecture

Every retained data family needs a versioned schedule with:

- record/data-family and classification;
- purpose and authority;
- start and end trigger;
- approved duration or event-based rule;
- owner and permitted access;
- delete, anonymize, downsample, archive, or retain action;
- downstream projections, caches, exports, providers, and backups affected;
- hold/exception authority and review expiry;
- proof of execution and unresolved propagation failures;
- user/worker disclosure and rights handling where applicable.

No numeric duration is set here. Production launch is blocked until qualified policy approves schedules for addresses, precise GPS, age results and any identity evidence, handoff, proof media, instructions, comments, support attachments, tracking grants, sessions, E2EE ciphertext, E2EE metadata, endpoint/prekey records, access/audit records, exports, and backups.

Deletion must be idempotent and observable. A failed provider deletion or backup-expiry process remains an unresolved state; the system cannot report completion merely because the primary row disappeared. Holds are scoped, approved, time-reviewed, and cannot silently become indefinite retention.

## 5. Logging and observability boundary

Routine plaintext logs, traces, metrics labels, analytics events, crash reports, support tools, and error payloads must never include:

- passwords, authentication secrets, private keys, content keys, provider credentials, reset tokens, session identifiers, Delivery Hub grants, or full authorization headers;
- wholesale message or attachment plaintext;
- raw identity documents/numbers or unneeded age-verification payloads;
- full payment credentials or prohibited payment data;
- full addresses, direct contact details, precise GPS coordinates/route history, or unrestricted driver identity;
- raw proof media or unneeded proof metadata;
- delivery instructions, support comments, feedback/free text, or attachment bodies;
- database dumps, full request/response bodies, or third-party payloads containing the above.

Use structured event schemas, allowlisted fields, stable event names, redaction at collection, pseudonymous correlation, bounded cardinality, access control, integrity, retention, and deletion. Raw tokens are never logged; if correlation is essential, use a separately governed non-reversible or rotated correlation representation. The [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) is the verification baseline.

Security/audit records are separate from general telemetry. Required high-risk audit includes actor/service identity, authority, target reference/version, command/purpose/reason, outcome, occurred/received time, correlation/causation, and correction link—without secret or raw sensitive payload.

## 6. Third-party adapter disclosure contract

Before any future adapter receives customer, driver, delivery, wholesale, or security data, its versioned contract must state:

1. exact fields and classification;
2. purpose and governing authority;
3. data-flow direction and triggering action;
4. processor/controller/independent-role determination by qualified review;
5. authentication, transport, storage, field protection, and access expectations;
6. provider retention and deletion timing/confirmation;
7. onward sharing, subprocessors, region/transfer, and browser-side disclosure;
8. logging, analytics, model-training, advertising, and secondary-use prohibition or explicit terms;
9. customer/worker export, correction, deletion, and hold propagation;
10. incident detection and compromise-notification duties;
11. availability, timeout, retry, idempotency, replay, and categorized-error behavior;
12. complete export, contract tests, migration, termination, and replacement path;
13. audit/assurance evidence and change-notice obligations.

No provider may directly overwrite canonical state or turn outage/missing data into success. Provider IDs remain aliases. A vendor's default collection or retention is not automatically approved Blowin' Smoke policy.

## 7. Onion entrance privacy boundary

The Onion browser surface must not load ordinary third-party scripts, pixels, ads, session replay, tag managers, chat widgets, fonts, frames, or cross-origin resources that leak the Onion context. Browser referrer, redirects, downloads, media, error pages, support links, payment/age flows, and authentication transitions require explicit privacy review.

Server-side adapters receive only fields necessary for the canonical action under the disclosure contract. Monitoring measures availability/security with minimized data and cannot reconstruct ordinary customer browsing. Entrance choice does not create a marketing segment by default.

## 8. E2EE privacy boundary

No server process may routinely decrypt wholesale content, derive marketing/search/analytics features from it, or transfer it to CRM/support/catalog/order systems. Metadata and ciphertext have separate schedules. A user-initiated report or deliberate declassification discloses only explicitly selected content through a clear receipt and governed purpose.

Attachment scanning, content moderation, legal requests, account recovery, and abuse response must not be described as server-readable if the architecture cannot read plaintext. Any future exception that changes the trust promise requires a new governing decision and user disclosure before implementation.

## 9. Export, correction, and deletion

- Authenticate and authorize the requestor and scope before personal/restricted export.
- Exports are encrypted in transfer and storage, expire under policy, and are audited without logging their contents.
- Do not combine one customer's data with another party's identity, private proof, wholesale content, driver private data, or security secrets.
- Corrections preserve original provenance/history and invalidate/rebuild affected projections.
- Customer assertions update only domains they are authorized to address; they do not rewrite compliance, payment, custody, or provider evidence.
- E2EE server export can include only ciphertext and authorized metadata; plaintext export belongs to the endpoint.
- Deletion requests reconcile canonical stores, projections, caches, objects, providers, exports, and backup expiry, subject to approved holds and record obligations.
- A correction/deletion/export service failure remains visible and retryable; it cannot be reported as success.

## 10. Launch-blocking policy decisions

- Exact purpose, lawful basis/consent, disclosure, access, correction, export, deletion, hold, and retention rules per data family.
- Raw identity-evidence prohibition/exception process and age-verification provider behavior.
- Worker location consent, access, review, appeal, labor, and safety policy.
- Proof/handoff evidence requirements and media retention.
- Free-text moderation, support access, contact consent, and workforce-use boundaries.
- E2EE metadata/ciphertext/attachment retention and deletion promises.
- Onion telemetry, public/onion linkage, and third-party flow policy.
- Adapter contracting, subprocessors, regions, incident notification, and exit assurance.

The system must be capable of enforcing the decisions. SEC-01 does not manufacture them.
