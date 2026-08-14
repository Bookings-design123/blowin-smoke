# Data Classification, Encryption, and Key Management

**Document role:** Governing data-protection model
**Implementation status:** Logical requirements only; algorithms, platforms, and providers are not selected

## 1. Classification model

Classification follows the most sensitive data present in a record, payload, projection, export, log, or backup. Combining fields can raise sensitivity. Encryption does not lower classification. A derived value may remain sensitive when it reveals the underlying fact.

| Class | Definition | Representative examples |
|---|---|---|
| **D0 — Public** | Approved for intentional public disclosure. | Published retail catalog, approved public price, public policy content, approved media |
| **D1 — Internal** | Non-public business or operational information whose exposure would create limited-to-material harm. | Internal drafts, inventory operations, service health, non-sensitive configuration metadata |
| **D2 — Personal** | Personal, pseudonymous, commercial, behavioral, or precise operational information tied or reasonably linkable to a person, device, business, or delivery. | Contact data, addresses, order history, support context, driver identity, precise GPS, delivery instructions, wholesale metadata |
| **D3 — Restricted** | High-impact identity, compliance, financial-reference, authentication, proof, safety, privileged, or highly sensitive personal information. | Age result/reference, exceptional raw ID evidence, payment references, handoff authorization, proof media, authentication records, private audit evidence |
| **D4 — E2EE Content** | Wholesale message and attachment plaintext intentionally available only at authenticated communicating endpoints. Intermediary services receive ciphertext. | Private wholesale message bodies and client-encrypted attachment content/keys |

`D4` describes the endpoint-only content-access promise and continues to govern the ciphertext that carries that protected content. It is not a claim that metadata is hidden or that plaintext ceases to exist at endpoints. Outer E2EE object/routing metadata is classified separately as D2 or D3 according to its contents and risk.

## 2. Handling requirements by class

All exact retention durations remain `OPEN — QUALIFIED POLICY REQUIRED`. “Delete” below means an authorized, auditable process that also addresses replicas, derived projections, provider copies, and backup expiry, subject to approved holds.

| Control | D0 — Public | D1 — Internal | D2 — Personal | D3 — Restricted | D4 — E2EE Content |
|---|---|---|---|---|---|
| **Transport** | Authenticated secure transport for integrity and origin authentication | Secure transport on every hop | Secure transport on every hop | Secure transport on every hop; no replay-prone state change | Secure transport plus endpoint-authenticated E2EE |
| **Storage** | Integrity-protected, recoverable storage | Encryption at rest | Encryption at rest; field encryption when justified by threat/authority concentration | Encryption at rest plus field/object encryption by default unless documented equivalent control | Intermediary stores ciphertext only; endpoint plaintext follows local protected-storage policy |
| **Field protection** | Not required for confidentiality | Only when aggregation or secret business value justifies it | Required for selected high-risk fields after field-level review | Required where an authorized service must recover the value; purpose-separated decrypt authority | Protocol/attachment encryption at endpoint; not server field encryption |
| **Who may decrypt/read** | Anyone after publication approval | Authorized role/service for business purpose | Owning domain and least-privileged purpose-bound roles/services | Explicit narrow decryptor or evidence role; sensitive reads audited | Registered authenticated communicating endpoints only |
| **Logs/analytics** | May record approved identifiers and aggregates | Minimized and redacted | Pseudonymous correlation; no unnecessary values | References/outcomes only; no raw restricted payload | No plaintext, content keys, or decrypted attachment data; minimized routing metadata separately governed |
| **Backups** | Integrity and availability controls | Encrypted backup | Encrypted backup with access audit | Encrypted backup with separately controlled keys and strict recovery authority | Ciphertext may be backed up; endpoint content/session keys are excluded from general server backups; any recovery mechanism must remain endpoint-controlled and preserve the no-intermediary-decryption promise |
| **Retention** | Publication/history policy | Defined purpose and trigger | Shortest approved purpose-bound period | Strictest approved purpose-bound period; periodic review | Message/attachment ciphertext and metadata have separate, explicit lifecycles; no indefinite default |
| **Export** | Public export as approved | Authorized scoped export | Authenticated, scoped, purpose-audited export | Strongly authorized, minimized, encrypted transfer; evidence access logged | Endpoint-controlled plaintext export, if offered; server can export ciphertext/metadata only under its authority |
| **Deletion** | Unpublish/archive according to record rules | Authorized deletion/archival and confirmation | Delete/anonymize/hold with projection/provider propagation | Verified deletion/crypto-erasure where applicable, legal hold separation, confirmation | Endpoint and server-ciphertext deletion are distinct; deletion cannot guarantee removal from another endpoint or prior user export |
| **Incident priority** | Integrity/availability priority | Business-impact triage | Privacy incident | High-priority restricted-data incident | High priority if plaintext/key/endpoint/client delivery is implicated; relay ciphertext exposure alone must still assess metadata and cryptographic assumptions |

## 3. Record-to-class mapping

The mapping supplies a minimum class. Actual payloads inherit the highest applicable class.

| Record or data family | Minimum class | Protection and minimization rule |
|---|---:|---|
| Approved retail catalog, public price, public media, public policies | D0 | Publication still requires integrity, provenance, and governed approval |
| Unpublished catalog, supplier/commercial terms, inventory operations | D1 | Keep out of public/search projections unless separately approved |
| Customer email and phone | D2 | Purpose-bound access; field protection considered for concentrated stores |
| Shipping, pickup, billing, and delivery addresses | D2 | Field encryption required for retained full addresses unless implementation review documents an equivalent narrow trust boundary |
| Order and purchase history | D2 | Object-scoped customer access; no public/search projection |
| Payment provider references and minimized outcomes | D3 | Never store full credentials or prohibited payment data; provider reference is not authorization by itself |
| Age qualification result and provider/process reference | D3 | Store minimum result/reference/method category/authority/version/times; no identity profile |
| Raw identification image, number, or extracted fields, if exceptionally unavoidable | D3 | Noncanonical and prohibited by default; requires qualified purpose, authority, field/object encryption, strict access, and shortest approved deletion trigger |
| Driver identity and contact | D2; D3 when authentication or safety evidence is included | Assignment/role-scoped views; finance/support projections minimized |
| Precise driver GPS observations and route history | D2 high risk | Purpose key, bounded active session, reduced customer projection, shortest approved operational retention |
| Delivery instructions and customer location notes | D2 | Sensitive free text; minimum driver display; no routine logging |
| Age/handoff authorization and delivery-specific eligibility evidence | D3 | Immutable attempt/result/reference; never inferred from GPS, photo, or customer request |
| Proof-of-delivery media and integrity metadata | D3; D2 only for a separately approved minimized fact | Controlled object storage, stable reference, purpose key, immutable lineage, access audit |
| Feedback, comments, support context, and contact request | D2; D3 when content reveals restricted data | Treat free text as sensitive; contact consent is explicit and purpose-bound |
| Tip/payment movement references | D3 | Financial reference and outcome only; separate from payable/payout authority |
| Delivery Hub grant, session identifier, reset token, API secret | D3 credential/secret | Never place plaintext in logs, analytics, referrers, source, or canonical business records; store verifier/derived representation where feasible |
| Wholesale ciphertext | D4 because it carries protected content; outer object/routing metadata is separately D2/D3 | Server has no content-decryption authority; integrity, expiry, and object authorization still apply |
| Wholesale plaintext | D4 | Exists only at registered endpoints unless deliberately declassified |
| Wholesale participants, endpoint/device IDs, delivery state, times, IP/routing data, message sizes | D2; D3 where security-sensitive | Explicit metadata inventory; minimize, separate, and retain independently of content |
| Root, environment, purpose, data, backup, endpoint-identity, session, and Onion private keys | D3 secret | Dedicated key/endpoint custody; no ordinary export or general backup; access and administration audited |
| Security and business audit records | Class inherited from target, up to D3 | Append-only/tamper-evident, narrow access; logs are not substitutes |

## 4. Encryption layers are not interchangeable

| Layer | Protects against | Does not protect against | Blowin' Smoke use |
|---|---|---|---|
| **Transport encryption** | Passive observation and modification between authenticated connection endpoints | A compromised endpoint/runtime, application authorization failure, stored copy, endpoint malware | Required on public, Onion-host-to-app when not local/protected, staff, driver, wholesale, provider, and sensitive internal hops |
| **Database/storage encryption** | Lost media, storage snapshot, or backup without key authority | An application or operator that legitimately holds broad read/decrypt authority | Baseline for non-public stores, objects, replicas, exports, and backups |
| **Field/application encryption** | Broad database reads and services without the purpose-specific decryptor | Compromised authorized decryptor, endpoint display, metadata, bad authorization | Selected D2 fields and D3 values/media with purpose-separated authority |
| **E2EE** | Intermediary content reading when endpoints and protocol implementation remain trusted | Metadata, endpoint compromise, malicious browser code, screenshots, deliberate export/declassification, availability | Private wholesale message/attachment content only |

An encrypted database is not field encryption. Field encryption is not E2EE. E2EE is not a replacement for TLS, authentication, secure endpoints, retention, or business authorization.

## 5. Conceptual key hierarchy

The hierarchy names roles and separation requirements, not a selected service or algorithm.

```text
Root / key-management trust boundary
└── Environment protection keys
    ├── Domain or purpose key-encryption keys
    │   ├── Customer-sensitive field data keys
    │   ├── BSDN location data keys
    │   ├── Proof/evidence object data keys
    │   └── Other record/object data keys by justified purpose
    └── Separately governed backup protection keys

Independent endpoint/service identities
├── Wholesale endpoint identity and session keys (held at endpoints)
└── Onion Service identity private key (held by Onion boundary)
```

### 5.1 Key roles

| Key role | Purpose | Custody and separation requirement |
|---|---|---|
| Root/key-management trust | Authorizes or protects environment-level key authority | Most restricted administrative boundary; no application plaintext use; compromise scopes every subordinate authority it can release |
| Environment key | Separates production/non-production and other approved environments | No cross-environment reuse; applications obtain only purpose-scoped operations |
| Domain/purpose key-encryption key | Wraps data keys for one bounded purpose | Address, location, proof, age, and backup authority must not collapse into one universal decrypt role |
| Data-encryption key (DEK) | Encrypts a field set, record, object, batch, or approved partition | Generated and stored through approved key service; ciphertext carries key version/context, never plaintext key |
| Customer-sensitive field key | Protects selected address/contact/identity fields | Decryption limited to the owning workflow and purpose |
| BSDN location key | Protects precise observations and route artifacts | Available only during bounded operational/incident purposes; analytics receives derived non-coordinate data |
| Proof/evidence key | Protects proof media and restricted evidence | Narrow capture/verification/support roles; raw media excluded from general logs/events |
| Backup key | Protects backups independently of production data access | Separate custody and recovery authorization; restore is logged and tested |
| Wholesale endpoint identity key | Authenticates a browser/device or authorized staff endpoint | Generated/used at endpoint; registration, verification, revoke, replacement, and key-change warning required |
| Wholesale session/message key state | Protects evolving E2EE conversation content | Endpoint-only; lifecycle defined by selected reviewed protocol; never escrowed to the routing intermediary |
| Onion Service identity private key | Authenticates the `.onion` address | Isolated Onion boundary; restricted backup/continuity; compromise requires retirement and verified replacement |

## 6. Envelope-encryption pattern

Where an authorized application must later recover D2/D3 data, use envelope encryption conceptually:

1. Generate or obtain a DEK for the approved field/object scope.
2. Encrypt and authenticate the data with that DEK.
3. Wrap the DEK under the correct domain/purpose key-encryption authority.
4. Store ciphertext, wrapped DEK, key version, protection context, and integrity metadata—never plaintext key material.
5. Permit unwrap/decrypt only for an authenticated service and authorized purpose.
6. Audit key administration and sensitive decrypt operations without logging keys or plaintext.

Partition granularity must balance blast radius, revocation/rotation cost, availability, and access frequency. One universal application key is prohibited. Per-field/per-record designs are not automatically superior; the implementation gate must choose a reviewed model consistent with the threat model.

## 7. Key lifecycle requirements

The implementation must satisfy the key lifecycle described by [NIST SP 800-57 Part 1 Rev. 5](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final) and the [OWASP Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html), adapted to the selected, reviewed system.

1. **Inventory and purpose:** Every key has a stable non-secret identifier, owner, purpose, environment, allowed operations, status, version, and dependent-data inventory.
2. **Generation:** Approved secure generation occurs inside the selected boundary; no human-chosen or repository-generated production keys.
3. **Distribution/use:** Applications receive narrowly authorized cryptographic operations or short-lived grants—not general plaintext key export.
4. **Activation/versioning:** Ciphertext and signatures carry enough version/context to choose the correct authorized key without ambiguity or downgrade.
5. **Rotation:** Planned rotation supports new-write cutover and controlled rewrap/re-encryption where needed, without silent data loss.
6. **Revocation:** Compromise, role removal, device loss, environment retirement, or protocol failure can terminate future authority quickly.
7. **Retirement/destruction:** Retired keys cannot protect new data; destruction accounts for replicas, exports, backups, and approved holds.
8. **Recovery:** Recoverability is explicitly designed per key role. Recovering server field data is different from recovering an E2EE endpoint identity.
9. **Audit:** Create, change, access-policy update, unwrap/decrypt approval, rotation, revoke, restore, export, and destruction actions are durably audited.
10. **Separation of duties:** No single ordinary operator receives unrestricted ciphertext, key authority, and unreviewed audit control.

## 8. Rotation and compromise semantics

- Key rotation must not rewrite canonical business truth or discard original audit/correction lineage.
- A key version is part of protection context, not a business identifier.
- If a field key is compromised, scope affected data by key/version and access history, suspend unnecessary decrypt authority, rotate, rewrap/re-encrypt as approved, assess backups/exports, and follow the incident plan.
- If a root/key-encryption authority is compromised, treat every subordinate key it could release as potentially exposed until analysis proves otherwise.
- If an endpoint identity changes, correspondents receive a warning and must re-establish trust according to approved policy; the server must not silently normalize the change.
- If the Onion identity private key is compromised, the address identity is compromised. The old identity is retired and a replacement is distributed through authenticated channels.
- Rotation, rewrapping, re-encryption, revocation, and rekeying limit future authority or exposure; they cannot undo plaintext already read, copied, exported, or captured at an endpoint.

## 9. Secrets boundary

Passwords, private keys, content keys, session and reset tokens, provider secrets, signing credentials, and API tokens must never appear in source control, browser-readable general configuration, URLs, routine logs, analytics, canonical business events, proof metadata, or customer-support transcripts. A reviewed initial Delivery Hub bootstrap URL is the narrow exception for its opaque capability: it must contain no predictable business ID or PII, must not propagate to logs/referrers/third parties, and should be exchanged promptly for a scoped server session as defined in the Delivery Hub architecture. The grant remains prohibited everywhere else. Secret stores, environment injection, scopes, expiry, access review, and emergency rotation remain implementation-gate decisions.

## 10. Decisions deliberately left open

- Field-encryption algorithms, modes, libraries, and parameter profiles.
- Key-management, hardware, cloud, database, and object-storage products.
- Cryptoperiods and quantitative rotation targets.
- Final field-by-field D2 encryption list after schema/threat validation.
- E2EE protocol implementation, browser library, endpoint persistence, and endpoint-controlled recovery design. Any server-readable escrow would fail the SEC-01 E2EE requirement and require a new governing decision.
- Onion identity backup/continuity mechanism.
- Retention, hold, export, deletion, anonymization, and backup-expiry periods.
- RPO, RTO, staffing, alert thresholds, and incident-notification policy.

No open decision may be filled by developer preference without the named review gate.
