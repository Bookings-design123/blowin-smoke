# Private Wholesale E2EE Candidates and Client Approaches

**Document role:** Current implementation-family and client-boundary feasibility dossier
**Decision posture:** Candidate evaluation only; no dependency, protocol profile, or production client selected

## 1. Required security property

Private Wholesale message content and explicitly approved message attachments must be encrypted at an authorized sender endpoint and decrypted only at authorized participating endpoints. The application server, database, hosting operator, infrastructure administrator, and ownership must not hold routine blanket content-decryption authority.

This does **not** mean:

- the server sees no account, endpoint, time, size, routing, delivery, abuse, or retention metadata;
- an authorized customer or representative cannot copy plaintext;
- a compromised endpoint is harmless;
- an operator controlling browser-code delivery can never target an endpoint;
- account authentication proves a correspondent's cryptographic identity;
- transport or storage encryption is E2EE;
- “Signal-like” authorizes a Signal compatibility claim or an unsupported Signal library.

## 2. Minimum protocol/application properties

Any future candidate must demonstrate all of the following together:

1. Local generation and custody of each endpoint's private identity/device material.
2. Authenticated asynchronous session/group establishment using published protocol mechanisms—not an improvised exchange.
3. Key evolution and documented forward-secrecy behavior; post-compromise behavior stated exactly, not implied.
4. Authenticated encryption with replay/duplicate handling, message identity, ordering/out-of-order rules, and rollback protection appropriate to the selected protocol.
5. Explicit per-device membership; no universal staff key.
6. Existing-trusted-device approval for a new device, independent notifications, key-change warnings, and prompt revocation.
7. A directory/key-authenticity design that resists silent server-inserted endpoints, or an honest statement of that remaining risk.
8. Separate account recovery and message-key recovery.
9. Attachment encryption before upload, key conveyance only inside the E2EE channel, safe local rendering, type/size policy, and no plaintext telemetry.
10. Versioned protocol profile, interoperable/test vectors, upgrade/downgrade prevention, migration, vulnerability response, and cryptographic/app integration review.

Published protocols are necessary but not sufficient. Identity binding, delivery, storage, authorization, notification, abuse, deletion, and declassification remain application responsibilities.

## 3. Client-architecture comparison

This section distinguishes two questions that version 1.0 combined: whether a client can support genuine E2EE, and whether it may receive Private Wholesale Protected Content. The browser remains a conditional E2EE execution environment. It is nevertheless rejected for protected wholesale because it cannot satisfy the hard capture gate. The governing release matrix is [private-wholesale-protected-content-assurance.md](private-wholesale-protected-content-assurance.md).

### Scoring method

For capability rows, `1` is weakest and `5` is strongest. For friction/burden/complexity rows, `1` is lowest and `5` is highest. Scores are comparative feasibility judgments supported by the findings below; they are not measured production results.

| Criterion | A — Browser-first | B — Installable PWA | C — Signed native client |
|---|---:|---:|---:|
| Customer friction (lower is better) | 1 | 2 | 5 |
| True E2EE feasibility | 4 | 4 | 4 |
| Server-blind content feasibility | 4 | 4 | 4 |
| Endpoint-key protection | 2 | 2 | 5 |
| Explicit device authorization | 4 | 4 | 5 |
| Multi-device feasibility | 4 | 4 | 4 |
| Account recovery feasibility | 4 | 4 | 4 |
| Historical recovery without prior key authority | 1 | 1 | 1 |
| Screenshot protection | 1 | 1 | 3 |
| Screen-recording protection | 1 | 1 | 3 |
| 4K media access protection | 3 | 3 | 4 |
| Safe offline behavior | 2 | 2 | 3 |
| Update/release integrity | 2 | 2 | 5 |
| Onion compatibility | 4 | 2 | 1 |
| Accessibility baseline | 5 | 4 | 3 |
| Operational burden (lower is better) | 3 | 4 | 5 |
| Development complexity (lower is better) | 3 | 4 | 5 |
| Incident-response difficulty (lower is better) | 4 | 4 | 5 |
| Auditability | 3 | 3 | 5 |
| Long-term maintainability | 3 | 3 | 2 |

### A — Browser-first E2EE Wholesale Room

**E2EE feasibility:** `CONDITIONAL`
**Protected-content client status:** `REJECTED FOR PROTECTED WHOLESALE`
**Commercial position:** Public retail and generic protected-client onboarding may remain browser-accessible; no wholesale menu, catalog, prices, media, messages, negotiation history, or manifest may be delivered.

The browser can execute a maintained WebAssembly/JavaScript cryptographic client, persist endpoint state, and encrypt before upload. The service can route ciphertext without content keys. The unresolved trust boundary is code delivery: an operator or attacker controlling the origin can deliver targeted code that reads plaintext or invokes local keys. The [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/) explicitly provides primitives, not an application protocol, and script injection remains able to act with page authority.

Required mitigations include a dedicated wholesale origin; no third-party executable resources; strict CSP and Trusted Types; immutable/content-addressed assets; reproducible builds; signed release manifests; externally visible release transparency; dual-control deployment; independent monitors that compare served builds; dependency pin/review; and release-by-release security review. These reduce but do not eliminate bootstrap and targeted-origin risk.

Default policy should keep decrypted content and keys out of offline application caches. Endpoint state that must persist requires protected local storage, schema migration, corruption recovery, revocation checks, and a clear unsupported-client state.

### B — Installable PWA with a hardened wholesale boundary

**E2EE feasibility:** `CONDITIONAL`, with **no material cryptographic-security advantage over A by installability alone**
**Protected-content client status:** `REJECTED FOR PROTECTED WHOLESALE`
**Commercial position:** A PWA may package nonprotected public/account functions, but installability never authorizes protected wholesale content.

A PWA still receives executable code from a web origin. A service worker can cache/update an application shell but does not create an independent signing trust root. It introduces additional stale-release, revoked-device, offline-data, and cache-clearing hazards. Because the PWA is rejected for protected wholesale, private manifests, catalog media, messages, and negotiation history must never be delivered into its response graph or service-worker/cache boundary. Authorization and revocation research does not create a fallback exception.

PWA installation and behavior in Tor Browser must not be assumed. Tor's higher security levels restrict JavaScript and media, so any browser E2EE experiment requires tested client/security-level disclosure. It remains research-only: Tor Browser and every PWA are rejected for protected wholesale, and no fallback may reveal a protected room or protected payload.

### C — Dedicated signed native wholesale client

**E2EE feasibility:** `CONDITIONAL`; strongest endpoint/release assurance, highest friction
**Protected-content client status:** Platform-specific. Native Android and Windows are `CONDITIONAL CANDIDATE`; unmanaged native iOS/iPadOS and native macOS are `REJECTED FOR PROTECTED WHOLESALE`; managed endpoints are a separate conditional enterprise case. No client is approved.
**Commercial position:** A signed approved native client is required for protected wholesale. It is never required for ordinary retail.

Platform signing creates an independent update identity relative to ordinary same-origin web delivery. Apple Secure Enclave and Android Keystore can protect suitable long-term/wrapping keys; app attestation/integrity signals can add risk evidence. Not every rapidly changing ratchet/group state can be assumed to remain in secure hardware.

Android supplies a secure-window control that excludes screenshots and non-secure display output on supported implementations. Windows can exclude a top-level window from specified public capture paths, while Microsoft expressly disclaims DRM/security-grade coverage. Those mechanisms are real platform controls but remain unverified for Blowin' Smoke. iOS/iPadOS can detect a completed screenshot and react to active recording/mirroring but has no verified supported whole-window screenshot veto for arbitrary UI; macOS has no verified current target-app veto. Native also adds accessibility parity, distribution policy, release/emergency-update, device support, incident, and adoption burdens. No native design stops a second camera. A native app is not Onion-compatible merely because it can make network requests; an embedded/audited Tor transport would be a separate high-risk design.

Primary platform sources:

- [Apple code signing](https://developer.apple.com/documentation/xcode/using-the-latest-code-signature-format)
- [Apple Secure Enclave keys](https://developer.apple.com/documentation/security/protecting-keys-with-the-secure-enclave)
- [Apple App Attest](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity)
- [Android app signing](https://developer.android.com/studio/publish/app-signing)
- [Android Keystore](https://developer.android.com/privacy-and-security/keystore)
- [Android key attestation](https://developer.android.com/privacy-and-security/security-key-attestation)
- [Play Integrity](https://developer.android.com/google/play/integrity/overview)

## 4. Current candidate dossier

### Candidate C1 — Matrix JavaScript SDK with Rust crypto/WASM

**Disposition:** `CONDITIONAL` proof candidate; not approved
**Observed current state (2026-08-14):** Maintained browser/Node SDK; stable release `v42.1.0` observed in the official release record; Apache-2.0; current Rust-crypto path documented. Pre-release versions are not treated as the stable baseline.

| Required evidence | Finding |
|---|---|
| Maintenance/activity | Active repositories and current package releases. |
| Runtime/browser | Maintainer states browser and Node support; E2EE uses WebAssembly bindings to Rust `matrix-sdk-crypto`. |
| API/protocol | High-level client and crypto API; Matrix Olm/Megolm device/room model. |
| Endpoint storage | Browser crypto store defaults to IndexedDB. SDK warns that multiple clients sharing the same crypto database can cause corruption/decryption failures. |
| Device lifecycle | Cross-signing, interactive verification, device lists, secret storage, and key backup mechanisms exist. |
| Independent review | Least Authority audited the Rust `vodozemac` implementation in 2022. Matrix separately confirmed a 2026 all-zero X25519-output acceptance issue while disputing the reporter's claimed confidentiality consequence under Matrix's authenticated key-distribution model. Neither record is an audit of the complete SDK configuration or Blowin' Smoke application. |
| License | Apache-2.0. |
| Migration | Legacy-to-Rust crypto migration is documented; unsupported/deprecated API paths must be excluded. |
| Test/security response | Active tests and a published Matrix security disclosure process/advisory record exist; application-specific vectors and incident integration are still required. |

Primary sources:

- [Matrix JavaScript SDK README](https://github.com/matrix-org/matrix-js-sdk)
- [Matrix JavaScript SDK `v42.1.0` release](https://github.com/matrix-org/matrix-js-sdk/releases/tag/v42.1.0)
- [Matrix JavaScript SDK npm package](https://www.npmjs.com/package/matrix-js-sdk)
- [Matrix E2EE and device model](https://matrix.org/docs/matrix-concepts/end-to-end-encryption/)
- [Matrix Client-Server specification](https://spec.matrix.org/latest/client-server-api/)
- [Olm/Megolm specification](https://spec.matrix.org/latest/olm-megolm/)
- [Independent `vodozemac` audit](https://matrix.org/blog/2022/05/16/independent-public-audit-of-vodozemac-a-native-rust-reference-implementation-of-matrix-end-to-end-encryption/)
- [Matrix analysis of reported `vodozemac` issues](https://matrix.org/blog/2026/02/analysis-of-reported-issues-in-vodozemac/)
- [`vodozemac` contributory-behavior fix](https://github.com/matrix-org/vodozemac/pull/298/) and [`v0.10.0` release](https://github.com/matrix-org/vodozemac/releases/tag/0.10.0)
- [Matrix security disclosure policy](https://matrix.org/security-disclosure-policy/)
- [Legacy `libolm` deprecation](https://matrix.org/blog/2024/08/libolm-deprecation/)

Material limitations and required deviations:

1. Megolm provides different security properties from a per-message Double Ratchet. It has partial forward secrecy and does not provide post-compromise recovery within an already compromised outbound group session. Rotation policy must be exact and must not be marketed as stronger than demonstrated.
2. Replay/index tracking and transcript consistency require correct application behavior; they cannot be assumed from “encrypted room.”
3. Default key backup, secret storage, automatic cross-signing recovery, or history forwarding can violate “password/phone alone gives no old history.” Each must be disabled or separately redesigned and independently reviewed.
4. An uploaded cross-signing public key does not by itself prevent a malicious service from equivocation. Verification/transparency and key-change UX remain material.
5. The SDK and underlying audit do not cover Blowin' Smoke's authentication, room policy, attachment renderer, declassification, retention, or deployment pipeline.
6. Matrix confirmed that the Olm 3DH path accepted all-zero X25519 outputs while disputing that this caused a confidentiality break under its authenticated key-distribution model. The library added contributory-behavior checks in PR #298 and released them in `vodozemac 0.10.0`; the candidate remains conditional until its shipped dependency is proven to contain `v0.10.0` or later and current disclosure/advisory closure is reviewed.

**Proof-gate question:** Can a constrained one-customer/assigned-representative room profile disable incompatible history-recovery paths, implement trusted-device-only addition, rotate safely, preserve replay state, and survive a whole-product audit?

### Candidate C2 — IETF MLS with OpenMLS

**Protocol disposition:** `CONDITIONAL` serious family
**OpenMLS browser/native dependency disposition:** `BLOCKED`
**Observed current state:** RFC 9420/9750 standards; active MIT-licensed Rust implementation; released line observed at 0.8.1; maintainer documentation lists WebAssembly, iOS, and Android as built but unsupported rather than supported test targets.

[RFC 9420](https://www.rfc-editor.org/rfc/rfc9420) supplies asynchronous group key agreement with forward secrecy and post-compromise security between epochs. [RFC 9750](https://www.rfc-editor.org/rfc/rfc9750) makes clear that authentication/delivery services, multi-device integration, recovery, and application-layer behavior surround MLS.

MLS maps well to a customer, assigned representative, and multiple individually enrolled endpoints: a new device can join as a new member without automatically receiving pre-addition history; a trusted member can commit membership changes; lost endpoints can be removed. A compromised authentication service can still add ghost credentials unless endpoint verification or key transparency detects it.

OpenMLS evidence:

- [OpenMLS repository and target support](https://github.com/openmls/openmls)
- [OpenMLS changelog](https://github.com/openmls/openmls/blob/main/CHANGELOG.md)
- [OpenMLS validation dashboard](https://validation.openmls.tech/)
- [2026 independent audit announcement](https://blog.phnx.im/openmls-independent-security-audit/)
- [MIT license](https://raw.githubusercontent.com/openmls/openmls/main/LICENSE)

The reported independent audit found eight issues, including one High; the publisher reported seven fixed in patched releases and one Low still in progress at publication. Final closure was not independently established by this gate. Target support, application identity/replay, storage migration, complete audit closure, vectors/interoperability, and whole-product review therefore block approval.

### Candidate C3 — AWS `mls-rs`

**Disposition:** `BLOCKED`
**Observed current state:** Active RFC 9420 implementation; dual Apache-2.0/MIT; test-vector and WebAssembly build support; maintainer labels the Web Crypto provider experimental/unsupported and states that the project has not received a full third-party audit.

Source: [AWS `mls-rs`](https://github.com/awslabs/mls-rs)

It may remain a comparative MLS implementation for interoperability research, not a selected browser dependency.

### Candidate C4 — Signal protocol / official `libsignal`

**Protocol-design reference:** serious
**Browser/PWA dependency:** `FAIL`
**Native third-party dependency:** `BLOCKED`

Signal's [PQXDH](https://signal.org/docs/specifications/pqxdh/), [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/), and [Sesame](https://signal.org/docs/specifications/sesame/) specifications remain valuable references for asynchronous setup, key evolution, forward secrecy, and multi-device state.

The current [`libsignal` README](https://github.com/signalapp/libsignal/blob/main/README.md) states that use outside Signal is unsupported and APIs/implementations may change without notice. Its TypeScript package is a native Node add-on, not a general browser/WebAssembly implementation. The repository is AGPL-3.0 and would require legal review even if support constraints changed. Active releases do not cure unsupported external use.

The old [`libsignal-protocol-javascript`](https://github.com/signalapp/libsignal-protocol-javascript) is archived and unmaintained: `FAIL`.

### Candidate C5 — Raw Web Crypto or primitive-only libraries

**Disposition:** `FAIL`

The [W3C Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/) is a low-level primitive interface. It does not provide authenticated correspondent identity, prekey lifecycle, ratchet/group state, replay/out-of-order behavior, multi-device membership, migration, or a vulnerability-response program. Building those properties directly would be prohibited homemade protocol work even if every primitive were individually standard.

## 5. Feasibility-level device/message flow

This is a property flow, not production design:

1. Account authentication establishes access to the service; it does not establish endpoint identity.
2. Endpoint generates its own device identity/key material locally and registers only the public/authentication material required by the selected protocol.
3. First endpoint remains visibly unverified until the approved enrollment/verification policy succeeds.
4. For asynchronous delivery, the sender obtains authenticated recipient device material/prekeys or the selected protocol's equivalent.
5. Sender encrypts content locally to the exact authorized device membership; server routes ciphertext and minimized delivery metadata.
6. Recipient validates sender/device identity, replay/order state, and protocol state before exposing plaintext.
7. Protocol erases obsolete message secrets as required; application records only non-content delivery state.
8. A new device enters `PENDING`; an existing trusted endpoint verifies and signs/commits it. Password/phone login never forwards history keys.
9. Membership/key changes notify every affected endpoint and may pause sensitive messages until acknowledged/reverified.
10. Revocation rotates or advances group/session state so a removed endpoint cannot decrypt future messages. Previously captured keys/plaintext cannot be recalled.

## 6. Recommendation and non-selection

1. Preserve browser-first for public retail and as a conditional E2EE feasibility finding, but reject browser and PWA delivery of every protected wholesale content class.
2. Advance Matrix JS + Rust crypto only as a constrained **proof candidate**, with key-backup/history behaviors disabled unless expressly approved. This is not production selection.
3. Keep MLS as a long-term protocol-family candidate; do not approve OpenMLS or `mls-rs` until supported targets, audit closure, application semantics, and migration evidence pass.
4. Reject `libsignal` for browser use and do not imply Signal support/compatibility.
5. Treat PWA as optional packaging for nonprotected functions only; it is not a protected-room entrance.
6. Require a signed approved client for protected wholesale. Advance native Android and native Windows only as conditional candidates; reject unmanaged iOS/iPadOS and macOS under current supported capture APIs; govern managed devices separately.
7. Require exact platform capture/extraction tests, fail-closed client verification, accessibility review, external cryptographic design review, integration audit, protocol vectors/interoperability tests, reproducible/reviewed release evidence, adversarial device/recovery tests, and a named vulnerability-response owner before any stack decision.
