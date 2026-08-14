# Private Wholesale E2EE Architecture

**Document role:** Governing private-wholesale communication architecture
**Priority:** Highest security-design priority in SEC-01
**Implementation status:** Protocol and browser feasibility review required; implementation not authorized

## 1. Purpose and boundary

Blowin' Smoke will support private, non-indexed wholesale conversations for qualified one-pound-and-above business through a browser-accessible, Signal-style E2EE channel. The customer does not need the Signal app or any installed messaging app.

“Signal-style” describes required security properties—authenticated asynchronous establishment, endpoint identities, per-message key evolution, forward secrecy, recovery after some compromise conditions where the selected reviewed protocol supports it, multi-device lifecycle, and key-change warnings. It is not a Signal compatibility claim, a library choice, or permission to recreate Signal's protocols.

The channel protects conversation and attachment content between registered endpoints. It is not a second commerce system. Inventory, eligibility, formal price, quote, order, payment, consent, fulfillment, BSDN/pickup/shipping, correction, and audit truth remain in their existing owning domains.

## 2. Customer experience concept

```text
PRIVATE WHOLESALE

Bulk purchasing: 1+ lb

[ START PRIVATE WHOLESALE INQUIRY ]
  -> browser establishes an authenticated-protocol E2EE context with peer-verification state visible
  -> customer composes plaintext locally
  -> customer endpoint encrypts locally
  -> Blowin' Smoke infrastructure receives, stores, and routes ciphertext
  -> an authorized Blowin' Smoke wholesale endpoint decrypts locally
  -> the reply is encrypted at that endpoint and follows the inverse path
```

The entrance is private and non-indexed. It does not publish wholesale availability, private pricing, negotiation, or quote discussion. Its user-facing language must distinguish a confidential inquiry from a formal quote, inventory reservation, accepted order, payment, or fulfillment commitment.

Non-indexing and low discoverability are not authentication, authorization, or content protection. E2EE, verified endpoint state, account/session controls, and object/action authorization provide those boundaries.

Account or endpoint registration authenticates a relationship to the service; it does not by itself authenticate a correspondent's cryptographic identity. Until an approved peer-verification or directory-authenticity mechanism succeeds, `ACTIVE_UNVERIFIED` must be visibly labeled and no verified peer-authenticity claim may be made. SEC-02 must decide when sensitive use pauses or requires acknowledgement.

## 3. Content and trust topology

```text
Customer browser endpoint                         Authorized wholesale endpoint
┌──────────────────────────┐                     ┌────────────────────────────┐
│ endpoint identity keys   │                     │ endpoint identity keys     │
│ session/ratchet state    │                     │ session/ratchet state      │
│ plaintext compose/view   │                     │ plaintext compose/view     │
│ attachment encrypt/view  │                     │ attachment encrypt/view    │
└────────────┬─────────────┘                     └──────────────┬─────────────┘
             │ authenticated transport + E2EE envelopes        │
             └───────────────────┬──────────────────────────────┘
                                 ▼
                 ┌────────────────────────────────┐
                 │ E2EE routing/mailbox boundary  │
                 │ endpoint directory/prekeys     │
                 │ ciphertext + minimal metadata  │
                 │ no content-decryption keys     │
                 └───────────────┬────────────────┘
                                 │ explicit authorized conversion only
                                 ▼
                 Deliberate declassification gateway
                                 │ governed canonical commands
                                 ▼
                 Existing quote/order/fulfillment domains
```

The intermediary may authenticate users/endpoints, publish approved prekey material, queue ciphertext, deliver receipts, enforce abuse limits, expire ciphertext, and retain minimized operational metadata. It must not possess wholesale content-decryption keys or silently extract plaintext.

## 4. E2EE content envelope and metadata distinction

### 4.1 E2EE content

The following are D4 content when carried inside the protected conversation:

- message body;
- quoted/replied-to content;
- private negotiation details;
- private inventory/pricing discussion;
- attachment plaintext, attachment content key, and authenticated attachment descriptor;
- deliberate-declassification proposal and the content selected for conversion;
- endpoint-visible system messages whose content reveals the negotiation.

### 4.2 Metadata that may remain visible

The server may need a minimized subset of:

- account and endpoint/device identifiers;
- identity-key and prekey directory records;
- sender/recipient mailbox routing;
- ciphertext object identifier, protocol version, size, created/received/expiry time;
- queue/delivery/acknowledgement/retry state;
- abuse/rate-limit state;
- IP/network/security telemetry under a separately approved policy;
- deletion, device-revocation, and declassification audit references.

This metadata is not E2EE content merely because it accompanies ciphertext. It is classified D2 or D3, inventoried, minimized, access-controlled, and retained independently. The UI and privacy disclosures must not imply “no metadata.”

## 5. Protocol property requirements

A candidate implementation must provide and document all applicable properties below. The formal threat and security claims of the selected, versioned protocol/library control; marketing language does not.

| Property | Required behavior | Verification evidence |
|---|---|---|
| Authenticated asynchronous establishment | A sender can initiate securely while a recipient endpoint is offline using authenticated published key material | Published protocol, independent review, implementation tests, prekey lifecycle tests |
| Endpoint identity | Each browser/device/staff endpoint has a persistent cryptographic identity separate from the account identifier | Registration, display, verification, replacement, revoke, and compromise tests |
| Signed/one-time prekeys or reviewed equivalent | Server distributes authenticated establishment material without learning content keys | Exhaustion, replay, deletion, replenishment, downgrade, and substitution tests |
| Per-message key evolution | Fresh message-key material evolves rather than reusing a static conversation key | Test vectors, sequence/state tests, secure state persistence review |
| Forward secrecy | Later key exposure does not automatically disclose every earlier message, within the protocol's stated assumptions | Protocol claim mapped precisely; compromise-timeline tests |
| Post-compromise recovery | Continued uncompromised contributions can restore security where and when the selected protocol actually guarantees it | No blanket claim; protocol-specific recovery test and user warning behavior |
| Authenticated encryption | Message/attachment tampering and wrong-context use fail closed | Test vectors, context binding, corruption and truncation tests |
| Replay resistance | Duplicate/stale envelopes cannot silently repeat user-visible or commerce effects | Message ID/sequence rules, dedupe tests, declassification idempotency |
| Out-of-order/lost delivery | Bounded skipped-message handling preserves integrity without unlimited key retention | Gap, retry, expiry, duplicate, and storage-exhaustion tests |
| Protocol/version negotiation | Unsupported or downgraded versions fail visibly and safely | Downgrade and mixed-version tests |
| Multi-device/session management | Per-device delivery, addition/removal, stale sessions, replacement, and convergence are explicit | Device graph and adversarial lifecycle tests |
| Identity change detection | Unrecognized identity-key change warns and preferably pauses sensitive communication until acknowledged | Key-substitution, lost-device, reinstall, and recovery tests |
| Secure deletion semantics | Expired key state/ciphertext is deleted as far as the selected client/server/storage can verifiably support | Platform-specific deletion limits and user-facing promise review |

Official published specifications—[PQXDH](https://signal.org/docs/specifications/pqxdh/), [X3DH](https://signal.org/docs/specifications/x3dh/), [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/), and [Sesame](https://signal.org/docs/specifications/sesame/)—are requirement references, not implementation authorization. The architecture must not overstate post-quantum, forward-secrecy, or post-compromise claims beyond the selected protocol's exact assumptions.

## 6. No homemade cryptography

Blowin' Smoke must not implement key agreement, ratcheting, authenticated encryption, nonce construction, key derivation, signature schemes, secure deletion, Onion routing, or multi-device secure messaging from primitives.

A candidate library/protocol implementation must be:

- mature and actively maintained;
- based on a published, versioned protocol with a precise security model;
- independently security reviewed, with findings and remediation visible to the evaluators;
- actually supported in the target browser/runtime—not merely exposing a similarly named package;
- usable through a high-level misuse-resistant API;
- equipped with official test vectors, cross-version tests, and deterministic failure behavior;
- able to satisfy endpoint identity, prekey, ratchet, replay, out-of-order, multi-device, attachment, and migration requirements;
- assessed for dependency/supply-chain integrity, release signing/provenance, vulnerability response, licensing, export controls, and long-term maintainability;
- capable of safe protocol/library upgrade without silent downgrade or loss of verification state;
- reviewed by qualified cryptographic and application-security specialists before implementation approval.

Signal's official [`libsignal` repository](https://github.com/signalapp/libsignal#readme) states that use outside Signal is unsupported and does not establish a supported browser integration. It is therefore evidence for an evaluation constraint, not a selected dependency.

## 7. Browser endpoint security

A browser E2EE endpoint receives and displays plaintext. The server that delivers client code can potentially deliver malicious code that exfiltrates keys or plaintext. Browser extensions, the operating system, copied content, screenshots, developer tools, local storage, and endpoint malware are also outside the cryptographic tunnel.

Required controls include:

- a dedicated, minimal client code boundary or origin if review determines it necessary;
- authenticated transport, strict content policy, no unnecessary third-party JavaScript, controlled frames/workers/connections, and safe cache behavior;
- pinned and reviewed dependencies, reproducible/auditable release provenance where feasible, protected publishing authority, and rapid rollback;
- no analytics, support widget, advertising code, tag manager, session replay, or third-party font/script within the plaintext-capable surface;
- local key-state protection appropriate to the selected browser platform and honest disclosure of its limits;
- reauthentication and endpoint unlock before sensitive content according to approved policy;
- safe rendering and output encoding for messages and attachments;
- explicit clipboard/download/export behavior and warnings;
- client-release compromise monitoring and a dedicated incident playbook.

The W3C [Web Cryptography API Recommendation](https://www.w3.org/TR/2017/REC-WebCryptoAPI-20170126/) provides low-level primitives, not a secure-messaging protocol or guaranteed hardware-isolated key store. Direct use of low-level browser cryptography to invent the channel is prohibited. Newer Web Cryptography work must be evaluated according to its actual standards maturity at SEC-02.

## 8. Identity, account, and device lifecycle

The choice between anonymous/pre-account inquiry and an authenticated wholesale account remains `OPEN`. Either model must distinguish:

- commercial/customer account identity;
- individual browser/device cryptographic endpoint identity;
- authorized wholesale staff identity;
- authentication credential and session;
- cryptographic identity verification between correspondents.

### 8.1 Required endpoint states

```text
PENDING_REGISTRATION
  -> ACTIVE_UNVERIFIED
  -> ACTIVE_VERIFIED (after approved peer verification)
  -> REVOKED | REPLACED | LOST | COMPROMISED

Any identity-key change creates KEY_CHANGED_PENDING_ACKNOWLEDGEMENT,
not silent continuity.
```

### 8.2 Required lifecycle controls

1. Generate endpoint identity material at the endpoint through the selected reviewed implementation.
2. Register an endpoint only within an authenticated, rate-limited, replay-resistant workflow.
3. Show all account endpoints/devices and enough creation/last-use context to identify unfamiliar devices without overexposing metadata.
4. Offer an authenticated fingerprint, QR code, or equivalent peer-verification mechanism.
5. Require explicit authorization for device addition and notify existing trusted endpoints through approved channels.
6. Revoke lost, removed, or compromised devices and stop new ciphertext delivery to them.
7. Replace/rekey affected sessions, warn correspondents, and require re-verification after identity change according to policy.
8. Maintain separate wholesale staff endpoints; a shared universal staff private key is prohibited.
9. Record device-directory and revocation audit without storing message plaintext.
10. Do not promise recovery of E2EE content unless the final endpoint-controlled recovery design preserves the no-intermediary-decryption boundary and is independently reviewed. Server-readable escrow would not satisfy SEC-01 and would require a new governing decision.

Multi-staff fan-out, endpoint limits, key transparency/directory authenticity, identity-verification UX, device recovery, inactive-device expiry, and whether pre-account inquiry is allowed remain next-gate decisions.

## 9. Message delivery and state

The routing service may maintain ciphertext lifecycle states such as:

```text
ACCEPTED_CIPHERTEXT -> QUEUED -> DELIVERED_TO_ENDPOINT -> ACKNOWLEDGED
                    -> EXPIRED | DELETED | DELIVERY_ERROR
```

These are routing facts, not evidence that a human read, understood, accepted, quoted, purchased, paid, or fulfilled anything. `DELIVERED_TO_ENDPOINT` does not authorize commerce. Server time and endpoint acknowledgement remain distinct.

Each envelope must include the selected protocol's authenticated version/context and stable opaque message identity necessary for deduplication, ordering, replay handling, and deletion. The server validates only the safe outer schema/limits it is authorized to see. It cannot invent a successful decryption result.

## 10. Encrypted attachments

Future governed attachment use may include product photos, availability sheets, quote documents, and appropriate business documents. Allowing a category does not make every file safe or necessary; exact types remain gated.

Required attachment flow:

```text
Endpoint selects file
  -> local type/size/user-intent checks
  -> fresh attachment content key
  -> local authenticated encryption
  -> upload ciphertext under opaque object identifier
  -> send authenticated object reference + key inside E2EE message
  -> recipient downloads ciphertext
  -> local integrity verification/decryption/safe rendering
```

The object service stores ciphertext, minimum routing metadata, expiry/deletion state, integrity context required by the selected protocol, and no content key. Access must be opaque, authorized, bounded, rate-limited, and non-enumerable.

Plaintext server-side malware scanning conflicts with this E2EE boundary. The implementation gate must assess endpoint-side validation/sandboxing, restricted file types, safe rendering, user-confirmed download, or rejecting attachments. It must not silently decrypt uploads server-side. The [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) supplies general abuse-control requirements; it does not override E2EE.

Exact size/type limits, padding, retention, download count, preview behavior, and endpoint quarantine remain open.

## 11. Deletion semantics

Deletion has distinct scopes:

- **Local deletion:** removes content/key state from one endpoint as far as that platform supports.
- **Server deletion:** removes queued/stored ciphertext and object metadata according to policy.
- **Remote request:** asks another endpoint to delete; it cannot guarantee deletion from screenshots, exports, backups, or a compromised endpoint.
- **Account/device revocation:** blocks future delivery but is not proof that prior plaintext disappeared.
- **Canonical-record retention:** deliberately declassified quote/order/audit data follows its owning policy, not message deletion.

The product must describe only verifiable deletion behavior. “Disappearing” or “deleted everywhere” is prohibited unless technically demonstrated for the exact scope.

## 12. Deliberate declassification to canonical commerce

```text
E2EE CONVERSATION
  -> customer or authorized wholesale representative initiates formal quote creation
  -> explicit disclosure identifies selected information leaving the E2EE-only boundary
  -> WHOLESALE QUOTE
  -> WHOLESALE ORDER
  -> PAYMENT
  -> SHIPPING | PICKUP | BSDN FULFILLMENT
```

Wholesale conversation content may become a formal quote or order only through an explicit conversion boundary:

1. An authorized participant selects the exact content/fields proposed for conversion.
2. The interface states what will leave the E2EE-only boundary, why, which canonical domains will receive it, who may access it, and the relevant retention/policy consequence.
3. Explicit customer authorization/consent to transfer the selected content is recorded separately and purpose-bound. Qualified policy defines the legal wording and basis, but no transfer proceeds without the recorded customer decision.
4. An authorized staff actor confirms the business meaning and current inventory/price/eligibility assumptions; conversation text alone is not canonical truth.
5. The gateway emits governed, schema-validated, idempotent commands to existing owning domains.
6. Each canonical domain validates current state and records its own stable identifiers, version, provenance, authority, and audit.
7. A declassification receipt records actor, customer/account, time, purpose, customer authorization/consent record reference, selected source message references, disclosed fields, target records, policy version, outcome, and correction link—without copying unrelated plaintext into ordinary logs.
8. Failure is explicit and retry-safe. A partial conversion cannot silently create a paid, accepted, eligible, reserved, or fulfilled order.

No background process may scrape E2EE plaintext into a CRM, search index, analytics system, marketing profile, catalog, price record, support transcript, or order. Staff copy/paste is not a substitute for the governed flow.

## 13. Wholesale commerce integration

- Private discussion of availability or price is not canonical availability or price.
- A quote is versioned, scoped, expires under approved policy, and is revalidated before order acceptance.
- One-pound-and-above qualification is a wholesale entrance rule, not proof of legal/customer/product/destination eligibility.
- Retail and wholesale can have different minimums, packages, prices, promotions, and economics without duplicating canonical product/inventory truth.
- Approved wholesale fulfillment uses existing shipping, pickup, or BSDN boundaries, including age, destination/product eligibility, payment, handoff, custody, proof, and audit rules.
- Message delivery, a staff promise, or ciphertext possession never reserves stock, captures payment, or authorizes fulfillment.

## 14. Abuse, availability, and safety

Server-visible controls may enforce ciphertext size/rate, account/endpoint reputation, registration limits, mailbox quota, connection abuse, and known malicious outer-envelope patterns. Content-dependent moderation is unavailable without endpoint action or deliberate disclosure. A report workflow must tell the reporting user exactly what plaintext/evidence will be intentionally disclosed and to whom.

Availability failures remain explicit: prekey unavailable, endpoint unverified, identity changed, mailbox unavailable, delivery delayed, unsupported protocol, ciphertext expired, attachment unavailable, or decryption failed. None becomes a delivered/accepted commercial decision.

## 15. Required incident distinctions

- **Routing-server compromise:** may affect metadata, availability, ciphertext integrity/delivery, prekey directory, and client delivery. Content confidentiality holds only if endpoints, key directory assumptions, client code, and cryptographic implementation remain uncompromised.
- **Client-delivery compromise:** hostile browser code may access plaintext/keys; stop the release, preserve evidence, restore trusted code, scope endpoint identities, revoke/rekey/warn.
- **Endpoint compromise:** revoke endpoint, replace identity/session material, warn peers, require re-verification, and analyze the exact exposure timeline.
- **Identity-key compromise:** authenticity is lost for affected identity; do not claim unaffected past/future content without protocol-specific analysis.
- **Metadata breach:** still a privacy/security incident even if message content remained encrypted.

## 16. Open decisions and acceptance evidence

The next gate must resolve or formally retain:

- the reviewed asynchronous establishment/ratchet/multi-device protocol and supported browser library;
- exact browser/client delivery trust architecture;
- authenticated account versus pre-account inquiry;
- endpoint key persistence, loss, and endpoint-controlled recovery; server-readable escrow is outside SEC-01 and would require a new governing decision;
- staff multi-device authorization and removal;
- directory authenticity/key transparency and peer-verification UX;
- attachment types, safe-rendering approach, metadata/padding, and retention;
- ciphertext and metadata deletion schedules and user-facing promises;
- abuse reporting and deliberate disclosure;
- declassification workflow, schemas, consent/disclosure, correction, and audit;
- protocol upgrades, vulnerability response, dependency integrity, penetration testing, and independent cryptographic review.

Implementation remains unauthorized until a qualified review supplies protocol/library evidence, browser threat validation, interoperability and adversarial test results, privacy disclosure, incident exercises, and explicit approval.
