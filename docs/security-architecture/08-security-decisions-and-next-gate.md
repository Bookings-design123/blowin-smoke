# Security Decisions and Next Gate

**Document role:** Binding SEC-01 decision record and phase boundary
**Package version:** 1.0

## 1. Final phase classification

- **SECURITY LOGICAL ARCHITECTURE: COMPLETE FOR CURRENT SPECIFICATION PHASE**
- **PRIVATE WHOLESALE E2EE: REQUIREMENTS COMPLETE; PROTOCOL/LIBRARY/CLIENT ARCHITECTURE NOT SELECTED**
- **ONION SERVICE: OPTIONAL ACCESS ARCHITECTURE COMPLETE; DEPLOYMENT NOT AUTHORIZED**
- **PRIVACY/RETENTION/INCIDENT POLICY: CAPABILITY REQUIREMENTS DEFINED; QUALIFIED POLICY DECISIONS OPEN**
- **PRODUCTION IMPLEMENTATION: NOT AUTHORIZED**
- **LAUNCH READINESS: NOT ESTABLISHED**

“Complete” means the logical boundaries, invariants, threat model, classification, security properties, and next evaluation gate are defined. It does not mean a provider, platform, algorithm profile, library, policy, control implementation, penetration test, legal review, or operating team has been approved.

## 2. Governing decision records

### SEC-ADR-001 — Ordinary public web remains primary

**Decision:** The primary Blowin' Smoke site must work securely in an ordinary browser without Tor, VPN, extension, or installed app.
**Consequence:** Baseline transport, session, browser, storage, field, authorization, privacy, and recovery controls apply to every customer. Tor is not a prerequisite for security.
**Prohibited:** Describing ordinary customers as receiving Tor anonymity or making security depend on installing privacy software.

### SEC-ADR-002 — Optional Onion entrance supplements one canonical system

**Decision:** A Tor Onion Service may provide an optional entrance through an isolated gateway to the same canonical application.
**Consequence:** It shares inventory, price, eligibility, order, payment, fulfillment, consent, correction, and audit truth; Onion-specific privacy/isolation controls may be stricter.
**Prohibited:** Shadow catalog/database, policy bypass, separate commerce truth, origin leakage, or unnecessary third-party browser resources.

### SEC-ADR-003 — Encryption layers remain explicit

**Decision:** Transport, storage/database, field/application, and E2EE protection are separate controls with separate threat coverage.
**Consequence:** D2/D3 fields receive threat-justified field/object protection and purpose-separated authority; E2EE is limited to private wholesale content.
**Prohibited:** Calling encrypted storage E2EE or implying TLS makes server-held plaintext inaccessible to the server.

### SEC-ADR-004 — D0–D4 classification governs every copy

**Decision:** Public, Internal, Personal, Restricted, and E2EE Content classes apply to canonical records, projections, messages, metadata, logs, exports, backups, and provider copies.
**Consequence:** Highest contained sensitivity controls handling; encryption never lowers classification; metadata is classified separately from E2EE content.
**Prohibited:** Treating ciphertext metadata as public or copying sensitive payloads into lower-class telemetry.

### SEC-ADR-005 — Keys are purpose-separated and lifecycle governed

**Decision:** Use a conceptual root/environment/purpose/DEK hierarchy with independent backup, wholesale endpoint, and Onion identity roles. Envelope encryption is used where authorized recovery of selected D2/D3 data is required.
**Consequence:** Rotation, versioning, revocation, least privilege, recovery, audit, and compromise scope are implementation prerequisites.
**Prohibited:** Universal application key, source/log/browser key exposure, or algorithm selection by developer preference.

### SEC-ADR-006 — Wholesale content uses real endpoint E2EE

**Decision:** Private one-pound-and-above wholesale conversation content and attachments must be encrypted/decrypted only at registered communicating endpoints. The intermediary stores/routes ciphertext and minimized metadata.
**Consequence:** Browser E2EE requires mature published protocol properties, a supported independently reviewed implementation, endpoint identity/device lifecycle, key-change warnings, and hardened client delivery.
**Prohibited:** Homemade cryptography, Signal compatibility claims, unsupported browser-library assumptions, server-held content keys, or claims that endpoint compromise is harmless.

### SEC-ADR-007 — Metadata is a separate privacy surface

**Decision:** Participant, endpoint, routing, time, size, delivery, network, abuse, and retention metadata are inventoried, classified, minimized, and scheduled independently of content.
**Consequence:** “E2EE” cannot be marketed as “no metadata.”
**Prohibited:** Indefinite metadata retention or unreviewed analytics/marketing correlation.

### SEC-ADR-008 — Canonical commerce requires deliberate declassification

**Decision:** Wholesale plaintext becomes a formal quote/order only through explicit field selection, disclosure, recorded customer authorization/consent, actor authority, governed domain commands, and a declassification receipt.
**Consequence:** Existing product, price, inventory, order, payment, consent, fulfillment, BSDN, correction, and audit owners remain authoritative.
**Prohibited:** Silent CRM/analytics/catalog/order scraping, copy/paste as canonical ingestion, or treating a message as reservation/payment/fulfillment.

### SEC-ADR-009 — Delivery Hub links are narrow capabilities

**Decision:** A Delivery Hub grant is high-entropy, non-sequential, exact-delivery/purpose/action scoped, expiring/revocable, rate-limited, and excluded from logs/referrers/third parties.
**Consequence:** It may support approved low-risk delivery views but is not an account session. Sensitive changes require stronger authenticated/step-up authority.
**Prohibited:** IDs/PII in URL, account access by link, raw route/proof exposure, or completion/age/handoff/custody authorization by possession.

### SEC-ADR-010 — Sensitive BSDN data is minimized by lifecycle

**Decision:** Addresses, precise GPS, driver context, age references, handoff, proof, instructions, tips, feedback, and comments use collection/use/share/retention/deletion/export/correction controls.
**Consequence:** GPS follows encrypted bounded ingestion, short-lived operational storage, minimized projection, and approved deletion/downsampling after completion.
**Prohibited:** Off-duty tracking, indefinite route history, raw sensitive logs, or turning missing evidence into success.

### SEC-ADR-011 — Backups and incidents preserve trust, not just bytes

**Decision:** Backups are encrypted with separately controlled keys, protected from destructive production authority, retention-aware, and regularly restore-tested. Incident recovery includes keys, sessions, audit, canonical state, projections, adapters, and side-effect reconciliation.
**Consequence:** Required playbooks cover privileged, driver, capability, data, log, age, GPS, proof, wholesale endpoint/client/server, Onion key, domain/DNS, adapter, backup, and ransomware compromise.
**Prohibited:** Declaring recovery from an untested backup or silently restoring stale credentials/deleted data.

### SEC-ADR-012 — Unknown and security failure stay explicit

**Decision:** Unavailable, stale, invalid, revoked, failed-decrypt, unverified, or conflicting security evidence never becomes eligibility, authorization, success, consent, proof, or completion.
**Consequence:** Safe degraded/blocked/unknown/service-error states remain visible and recoverable.
**Prohibited:** Fail-open commerce or fabricated movement, identity continuity, message delivery, payment, age, custody, or proof.

## 3. Decisions preserved from parent architecture

- Modular-monolith bounded modules, canonical domain ownership, transactional core/outbox, rebuildable projections, provider adapters, stable IDs, version/provenance/correction, and explicit failure states remain governing.
- Security, Onion, messaging, key-management, identity, analytics, and provider tooling cannot own duplicate commerce truth.
- Staff/customer/driver/service trust contexts remain distinct; sensitive reads and high-risk writes are purpose-authorized and audited.
- BSDN custody, age, handoff, proof, GPS, tip, feedback, recovery, and audit semantics remain unchanged.
- All providers and platforms remain `NOT_SELECTED` unless a later approved decision says otherwise.

## 4. Unresolved decision register

### Cryptography and keys

- Browser-supported E2EE protocol/library, protocol variant, independent review evidence, upgrade/migration, test vectors, and vulnerability process.
- Non-protocol field-encryption algorithms/modes/libraries, key service/hardware boundary, key granularity, cryptoperiods, rotation/re-encryption, recovery, and emergency authority.
- Endpoint key persistence, loss and endpoint-controlled recovery, device limits, staff fan-out, directory authenticity/key transparency, and verification UX. Server-readable escrow is outside SEC-01 and would require a new governing decision.

### Onion and public web

- Hosting/runtime topology, gateway/proxy, protected upstream, origin-leak test plan, HTTPS-over-Onion, Onion-Location, public/Onion cookie/session separation, account interoperability, client authorization, monitoring, and identity-key continuity/rotation as an authenticated address migration.
- Exact TLS compatibility, HSTS rollout, CSP/cross-origin/browser-header profile, and public/wholesale origin separation.

### Identity, access, and operations

- Identity providers, authenticators, customer optional strong auth, staff mandatory strong MFA implementation, driver device posture, assurance, timeouts, recovery, role/dual authority, break-glass, access-review cadence, and rate/anomaly thresholds.
- Delivery Hub token structure, lifetime, rotation, session binding, and capability-only low-risk actions.
- Security staffing, incident owners/severity/on-call/communications, notification authority, RPO/RTO, backup cadence/generations, restore frequency, and exercises.

### Privacy, legal, workforce, and evidence

- Purpose, lawful basis/consent, notices, access/correction/export/deletion/hold, numeric retention, backup expiry, provider duties, and incident notifications.
- Age method sufficiency, raw-ID prohibition/exception, provider privacy, and deletion.
- Driver safety/labor/location consent, sampling/precision/background behavior, geofences/staleness/off-route, worker access/review/appeal, and performance-use restrictions.
- Handoff/proof requirements, proof media, support/free text, feedback/contact, and workforce-use policy.
- Wholesale qualification/account model, metadata/ciphertext/attachment lifecycle, file types/safe rendering, abuse reporting, declassification disclosure/consent, and wholesale operating coverage.

### Providers and performance

- All platform, cloud, database, key-management, identity, commerce, payment, age, tax, shipping, BSDN, storage, messaging, notification, observability, and security providers.
- Quantitative availability, latency, throughput, capacity, SLO, alert, recovery, reconciliation, and staffing targets.

## 5. Required next gate

The next authorized activity is:

> **SEC-02 — Security, Privacy, Cryptography, Onion, and Private Wholesale Feasibility & Assurance Gate**

It is a decision-and-evidence gate, not production implementation. It must include qualified security architecture, application security, cryptography, privacy/legal/compliance, BSDN operations/driver safety, wholesale operations, accessibility, and platform engineering review.

### Required inputs

1. Current schemas and data-flow diagrams mapped to D0–D4 and canonical owners.
2. Field-by-field purpose, authority, retention, export, correction, deletion, and hold proposals.
3. Candidate E2EE protocol/library feasibility dossier with official support status, independent review, browser/client-delivery model, endpoint storage, device lifecycle, attachments, metadata, test vectors, migration, and incident behavior.
4. Onion threat-tested topology with origin-leak analysis, key custody/continuity, browser-resource inventory, session/account model, monitoring, outage, and recovery.
5. Authentication/session/role/step-up/Delivery Hub capability design and abuse cases.
6. Conceptual-to-platform key design with separation, rotate/revoke/restore, audit, and compromise blast radius.
7. Backup/restore and incident operating proposal with owners and exercises.
8. Third-party disclosure contracts and provider-replacement requirements, still without premature selection if procurement is not authorized.
9. Accessibility and honest privacy/security claim review.

### Required evidence and tests

- independent cryptographic and browser-security review;
- application threat-model/ASVS verification plan and adversarial abuse cases;
- protocol test vectors, multi-device/key-change/replay/out-of-order/downgrade/attachment tests;
- client-release and dependency integrity evidence;
- Onion origin-leak, route/resource, session-transition, outage, and key-compromise exercises;
- field/key access, rotation, revoke, backup, restore, deletion/hold, and provider propagation tests;
- admin, driver-device, Delivery Hub, GPS, proof, E2EE endpoint/server/client, domain/DNS, and ransomware tabletop exercises;
- privacy, legal, workforce, evidence, and customer-disclosure approvals.

### Exit criteria

SEC-02 may recommend implementation only when every launch-blocking item has an owner and disposition, claims match demonstrated behavior, chosen cryptography is mature and independently reviewed, privacy/retention policy is approved, recovery is testable, and no candidate weakens canonical commerce or BSDN truth.

If evidence is absent or conflicting, the outcome stays `OPEN`, `BLOCKED`, or `NOT AUTHORIZED`. The gate cannot convert uncertainty into approval.

## 6. Work explicitly not authorized now

- Production code, schemas, infrastructure, Onion deployment, domain/DNS changes, or security configuration.
- Cryptographic implementation or library/provider/platform selection.
- Wholesale client/server build, prototype that handles real sensitive data, or claims of Signal compatibility.
- Production key creation, migration, re-encryption, account/device enrollment, or provider contracting.
- Numeric policy invented without qualified authority.
- Modification of closed prototype packages or existing intelligence/design research.

SEC-01 ends with this documentation package and machine-readable registry.
