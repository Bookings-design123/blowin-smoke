# Threat Model and Security Objectives

**Document role:** Governing threat model
**Implementation status:** Not authorized

## 1. Scope and method

This threat model covers the ordinary public web entrance, optional Onion entrance, canonical commerce services, BSDN, Delivery Hub, private wholesale E2EE, adapters, administrative and driver surfaces, data stores, logs, backups, key custody, and recovery operations.

It treats every network, browser, endpoint, integration, and human role according to its authority—not according to its location. It assumes attackers can observe, replay, enumerate, phish, inject, steal devices or credentials, exploit vulnerable code, abuse legitimate access, compromise a provider, and obtain copied storage. It does not assume every threat succeeds; it establishes what the architecture must resist, contain, expose, and recover from.

Threat modeling is continuous. Each production design must be reviewed against the current [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) and the system-specific abuse cases below before implementation approval.

## 2. Assets and required truth

| Asset | Why it matters | Governing owner or boundary |
|---|---|---|
| Canonical catalog, price, inventory, eligibility, order, payment, fulfillment, consent, and audit records | Commerce correctness and customer trust | Existing Technical Architecture domains; security does not take ownership |
| Customer identity, contact, addresses, order history, and support context | Personal safety, privacy, account integrity | Identity/Consent, Order, Fulfillment, and Support domains |
| Age result/reference and any exceptionally authorized identity evidence | Restricted compliance evidence | Age Qualification boundary |
| Driver identity, assignment, precise location, and device/session state | Worker and customer safety; delivery correctness | BSDN governed records |
| Delivery instructions, handoff authorization, proof, feedback, and comments | Sensitive operational evidence and free text | BSDN governed records |
| Delivery Hub grants and application sessions | Narrow authorization capabilities | Identity/session security boundary |
| Private wholesale message content, attachments, endpoint identity, and metadata | Commercial confidentiality and negotiation integrity | E2EE endpoints plus minimized routing boundary |
| Encryption, signing, endpoint identity, backup, and Onion identity keys | Decryption, authenticity, service identity, and recovery authority | Purpose-separated key custody boundaries |
| Logs, audit records, backups, exports, and recovery artifacts | Detection, accountability, restoration, and potential concentration of sensitive data | Audit/Corrections and controlled operations boundaries |

## 3. Trust boundaries

```text
Customer browser ─┐
                  ├─> Public edge/gateway ─┐
Tor Browser ──────┘   Onion gateway ───────┼─> Canonical application modules
                                           │       ├─> canonical stores + outbox
Admin endpoint ─────> staff trust gateway ─┤       ├─> rebuildable projections
Driver device ──────> driver trust gateway ┤       └─> provider adapters
Wholesale endpoint -> E2EE routing service ┘

Every arrow crosses an authenticated, authorized, minimized, logged boundary.
E2EE content is the exception: intermediary services receive ciphertext, not content plaintext.
```

Customer, staff, driver, and wholesale endpoints can be compromised. The public edge, Onion gateway, E2EE delivery service, application runtime, stores, logging pipeline, backup system, key services, and every adapter are separate compromise zones. Access across one boundary does not imply authority across another.

## 4. Threat actors and conditions

| Actor or condition | Plausible capability | Required architectural response |
|---|---|---|
| Passive network observer | Observe destinations, timing, sizes, and unencrypted traffic | Modern transport protection; minimize metadata; optional Onion entrance; never promise zero metadata |
| Hostile local network | Redirect, intercept, downgrade, inject, or replay | Authenticated secure transport, strict browser security controls, replay-resistant requests, no insecure mixed resources |
| DNS/domain attacker | Poison resolution, seize account, alter records, or impersonate public domain | Hardened domain/DNS administration, strong privileged authentication, change audit, recovery and verified customer communication |
| Credential thief or phisher | Take over customer, driver, staff, or wholesale accounts | Phishing-resistant strong authentication where required, rate limits, risk signals, session/device revocation, recovery controls |
| Customer account attacker | View orders/addresses or change delivery actions | Object-level authorization, reauthentication for sensitive changes, anomaly controls, notification, session inventory |
| Compromised administrator | Exfiltrate or alter broad data | Least privilege, separation of duties, step-up, narrow decryptors, immutable audit, access review, dual authority where approved |
| Excessive employee or insider | Use valid access outside purpose | Purpose-bound roles, just-in-time scope where practical, sensitive-read audit, alerts, periodic review, enforceable sanctions policy |
| Compromised driver account/device | Expose assignment/location or forge delivery actions | Assignment-scoped access, device binding/revoke, server state guards, explicit custody and proof, rapid session termination |
| Lost or stolen endpoint | Retain valid sessions, cached data, or endpoint keys | Local protection, short bounded sensitive access, remote revoke, rekey, minimized offline content, incident workflow |
| Database, object store, backup, export, or log compromise | Copy concentrated data at rest | Classification, field encryption, purpose-separated keys, redaction, immutable recovery, scoped export, retention limits |
| Secret or API-token compromise | Impersonate service or provider | Secret inventory, versioning, rotation/revocation, narrow scope, no source/log exposure, callback reconciliation |
| Malicious or compromised adapter/provider | Forge outcomes, overcollect, leak data, or become unavailable | Authenticated/replay-protected callbacks, validation, canonical ownership, bounded data contract, categorized failure, replacement path |
| Wholesale routing-server compromise | Read metadata, withhold/replay ciphertext, substitute keys, or serve hostile client code | Endpoint-authenticated E2EE, replay resistance, key-change warnings, delivery acknowledgements, hardened client delivery, availability recovery |
| E2EE endpoint compromise | Read plaintext and keys at that endpoint or send as it | Device identity, revocation/rekey, key-change warning, local security, explicit limitation: E2EE cannot protect a compromised endpoint |
| Wholesale identity-key compromise | Impersonate an endpoint or undermine authenticity | Key versioning, verified replacement, revoke device/session, warn peers, re-establish trusted identity |
| Onion identity-key compromise | Impersonate the Onion Service address | Isolated custody, minimal access, rotation/retirement playbook, verified replacement-channel communication |
| Tracking-grant theft or enumeration | Observe a delivery or attempt sensitive changes | High entropy, non-sequential values, exact scope, expiry/revoke, rate limiting, no URL PII, stronger authority for writes |
| Session fixation or hijacking | Reuse or impose a valid session | Session rotation, secure cookie policy, binding/risk checks, reauthentication, revocation, no raw session identifiers in logs |
| CSRF | Cause authenticated browser actions | Same-origin request defenses, anti-CSRF controls appropriate to the architecture, reauthentication for sensitive actions |
| XSS or client-code injection | Steal sessions, alter transactions, or read browser E2EE plaintext | Output/context controls, strict content policy, trusted build/dependency pipeline, isolation, security testing |
| Query/command injection | Read, corrupt, or execute beyond intended data | Typed/parameterized data access, schema validation, least privilege, safe interpreters, adversarial verification |
| Replay or duplicate submission | Repeat state, payment, tip, proof, message, or callback effects | Idempotency, nonce/sequence/version checks, deduplication, authenticated envelopes, canonical reconciliation |
| Brute force and enumeration | Discover accounts, tokens, Onion endpoints, or business state | Uniform failure responses where appropriate, throttling, anomaly detection, high-entropy capabilities, monitoring |
| Precise-location surveillance | Track driver/customer beyond active delivery purpose | Bounded consented sessions, reduced projections, short operational retention, no off-duty collection, access audit |
| Metadata accumulation | Infer relationships or activity from communication and commerce metadata | Purpose limitation, minimization, short approved retention, access controls, deletion/export, explicit disclosure |
| Age-document overcollection | Create unnecessary identity-theft exposure | Store minimized result/reference; raw ID prohibited unless a qualified requirement authorizes purpose, protection, and retention |
| Proof-of-delivery exposure or tampering | Reveal people/property or invalidate custody evidence | Controlled object storage, field/media keys, immutable reference and integrity metadata, access audit, correction lineage |
| Support/instruction/comment leakage | Expose unstructured personal or hazardous information | Treat free text as sensitive, minimize display, redact logs, limit role access, bounded retention, safe moderation/escalation |
| Availability or destructive attack | Block sales/delivery, corrupt state, or erase evidence | Isolation, recovery copies, restore tests, degraded states, reconciliation, incident ownership; never fabricate success |

## 5. Security objectives

| Objective | Required outcome | Failure that must remain visible |
|---|---|---|
| **Confidentiality** | Data is exposed only to endpoints, people, and services with current purpose-bound authority. | Unauthorized read, overbroad export, plaintext log, leaked key/token, metadata overexposure |
| **Integrity** | Canonical state, messages, proofs, commands, and corrections cannot be silently altered or reordered. | Version conflict, invalid signature/authentication, tampered proof, replay, incomplete write |
| **Authenticity** | A user, endpoint, service, provider callback, Onion address, and message peer can be tied to the asserted identity at the required assurance. | Unverified/key-changed endpoint, unknown callback, suspicious session, revoked device |
| **Availability** | Approved functions remain usable or enter explicit degraded/error states with recovery paths. | `SERVICE_ERROR`, unavailable verification/tracking, delayed ciphertext, restore incident |
| **Privacy** | Collection, use, sharing, retention, access, correction, export, and deletion are purpose-bound and minimized. | Missing authority, retention exceeded, deletion unconfirmed, inappropriate correlation |
| **Auditability** | High-risk writes and sensitive reads have durable actor, authority, reason, time, target, correlation, and outcome evidence. | Audit failure blocks governed write where required; logs alone are insufficient |
| **Recoverability** | Authorized teams can restore trusted state, rotate compromised authority, reconcile side effects, and communicate impact. | Unverified restore, unknown compromise scope, stale credentials, unreconciled external effect |

## 6. Binding security invariants

1. Security controls cannot invent or override commerce truth.
2. An encrypted value is not automatically accurate, authorized, current, or policy-compliant.
3. Authentication does not replace object-level and action-level authorization.
4. A Delivery Hub grant is not an account and cannot authorize unrelated personal data or high-risk writes.
5. Onion routing is not a promise of customer anonymity and is not required for ordinary commerce.
6. Transport protection does not make a server-blind system; field encryption and E2EE require separate designs.
7. E2EE protects content only between uncompromised, authenticated endpoints. Metadata, endpoint compromise, malicious client delivery, screenshots, and voluntary disclosure remain in scope.
8. Missing, stale, invalid, revoked, or unavailable security evidence never becomes authorization or success.
9. No raw secret, decryption key, session token, tracking grant, raw identity document, full payment data, precise GPS stream, proof media, or wholesale plaintext enters routine logs or analytics.
10. Corrections and incident actions preserve the original event and add linked evidence; they do not destructively rewrite history.

## 7. Explicit non-goals

SEC-01 does not attempt to:

- hide identity required by payment, tax, age, delivery, support, or an approved wholesale transaction;
- guarantee safety on a compromised customer, driver, staff, or wholesale endpoint;
- create a proprietary cipher, ratchet, key exchange, Onion routing system, or secure-messaging protocol;
- claim compatibility with Signal or select Signal's implementation libraries;
- encrypt the entire commerce lifecycle end to end, which would conflict with legitimate order, fulfillment, payment, support, and audit processing;
- use Tor as a compliance bypass, alternate policy domain, or mandatory checkout path;
- define legal authority, retention duration, breach-notification deadline, labor policy, evidence requirement, or operational SLO without qualified approval;
- replace physical security, staff training, background policy, device management, secure receiving, fraud operations, or incident staffing;
- authorize production deployment.

## 8. Required validation before implementation

The next gate must test this model against abuse cases for tracking-link leakage, account and device takeover, location spoofing/replay, proof tampering, forged state transitions and callbacks, duplicate financial effects, privileged misuse, log/export exposure, wholesale key substitution, malicious browser-client delivery, Onion key loss, and denial of routing/tracking/verification. Findings must update this document and the registry before implementation authorization.
