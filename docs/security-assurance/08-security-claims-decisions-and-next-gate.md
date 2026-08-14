# Security Claims, Decisions, and Next Gate

**Document role:** Binding SEC-02 feasibility conclusion, customer-claim boundary, unresolved decision register, and implementation-proof boundary
**Status:** SEC-02 evidence synthesis complete; implementation not authorized

## 1. Customer-facing claim matrix

The status applies to the exact claim, not the general topic. “Safe if verified” requires every condition listed and current evidence at the time the claim is used.

| Candidate claim | Classification | Conditions / safe replacement |
|---|---|---|
| “End-to-end encrypted wholesale messaging” | `SAFE IF VERIFIED` | Only for designated message/approved-attachment content delivered through an approved protected client; a selected maintained implementation passes independent cryptographic/application review; keys remain at authorized endpoints; device membership and key changes are visible; no plaintext logs/backups/analytics; metadata and endpoint/code-delivery limits are disclosed. |
| “Blowin' Smoke cannot read your private wholesale messages” | `REQUIRES QUALIFICATION` | Safer: “Our messaging intermediary is designed not to hold the keys needed to decrypt designated wholesale messages. Authorized participants can read them on their approved devices.” Must disclose signed-client release/supply-chain, endpoint, participant, reporting/declassification, and metadata boundaries. Browser-code delivery remains a research-only E2EE concern, not a protected-wholesale fallback. |
| “Even the owner cannot read your conversations” | `PROHIBITED` | An owner could be an authorized representative/endpoint or control the signed-client release authority; the absolute also ignores deliberate customer reporting/declassification. |
| “Servers, database administrators, and hosting providers do not have blanket message-decryption access” | `SAFE IF VERIFIED` | Exact routing/storage/key architecture, access tests, plaintext-exclusion tests, endpoint membership, no server-readable escrow, and incident monitoring pass. Limit to message content, not catalog media/metadata/canonical orders. |
| “Your messages disappear after delivery” | `REQUIRES QUALIFICATION` | State exact controlled UX/ciphertext lifecycle and trigger. Disclose canonical records, holds/backups, offline/endpoints, screenshots/exports/cameras, and failures. Safer: “After the linked order closes, messages are removed from the active room under our retention policy; copies outside our control may remain.” |
| “Your messages are deleted everywhere” | `PROHIBITED` | No system can guarantee deletion from screenshots, exports, cameras, compromised/offline endpoints, or uncontrolled storage. |
| “Screenshots are blocked” | `PROHIBITED` as a universal or unscoped claim | Browser/PWA/iOS/macOS prevention fails under current evidence; no Blowin' Smoke client has passed the gate. |
| “Protected Wholesale content is excluded from screenshots and screen recordings on this supported approved client” | `SAFE IF VERIFIED` | Bind to exact client build, platform/version/device state, protected surface, OS/app control, and passing test evidence. Disclose unsupported/modified clients, privileged compromise, already rendered content, and external cameras. Not authorized now. |
| “Protected Wholesale content cannot normally be copied, forwarded, saved, downloaded, printed, or exported through this approved client” | `SAFE IF VERIFIED` | Limit to ordinary supported app/service paths and exact tested build. Do not imply control over instrumentation, endpoint memory, manual transcription, or a camera. Not authorized now. |
| “Private Wholesale uses protected-content controls in addition to end-to-end encrypted messaging” | `SAFE IF VERIFIED` | E2EE is limited to designated messages/approved attachments delivered through an approved protected client after implementation selection and independent verification; restricted catalog/media remains server-decryptable and must pass its own capture/extraction gate. Not authorized now. |
| “Supported native clients use screen-capture protections” | `REQUIRES QUALIFICATION` | Name exact platform/version/control and whether it OS-blocks, detects, or redacts. Disclose gaps, screenshots already taken, compromised devices, and cameras. |
| “Screen recording is impossible” | `PROHIBITED` | No assessed client class provides this universal guarantee. |
| “Private wholesale inventory cannot be copied” | `PROHIBITED` | The approved client must block ordinary supported extraction/capture, but an authorized viewer can still transcribe or use a camera and a privileged/compromised/unsupported endpoint can inspect or reconstruct rendered data. |
| “Wholesale media is encrypted” | `REQUIRES QUALIFICATION` | Say whether transport, at-rest, restricted server-decryptable, DRM, or endpoint E2EE. Never imply catalog-media server blindness when processors can decrypt. |
| “Wholesale room access is restricted to approved accounts and approved protected clients” | `SAFE IF VERIFIED` | Every object/field/media/message/manifest request checks the exact signed client build, supported platform/control state, endpoint, account, room/resource grant, integrity/freshness, and revocation state; no public enumeration/bulk leak; every unknown/stale state fails closed. |
| “Media access expires and can be revoked” | `SAFE IF VERIFIED` | Limit to future server requests/leases; verify segment/range/key behavior; disclose that received/rendered copies cannot be recalled. |
| “This manifest is available for five minutes after you reveal it” | `REQUIRES QUALIFICATION` | Explicit reveal semantics, immutable server clock, accessible timing decision, online-only/no private cache, deny-after-expiry tests, transmission/outage/reissue rule, and copy limits are stated. |
| “The manifest is erased from your device after five minutes” | `PROHIBITED` | Approved-client memory/remnants, a frozen or compromised/offline endpoint, required least-privilege assistive output, privileged/unsupported capture, transcription, and cameras cannot be universally erased or recalled. |
| “Personalized watermarks help deter and investigate leaks” | `SAFE IF VERIFIED` | Visible mark is actually delivered; pseudonymous mapping, purpose/retention/disclosure, evidence chain, human review, correction/appeal are in place. Do not promise proof. |
| “Watermarks prove who leaked the content” | `PROHIBITED` | Account/session compromise, sharing, false positives, removal, and recapture prevent absolute attribution. |
| “Optional Onion access” | `SAFE IF VERIFIED` | Limit to the live controlled public/nonprotected Onion entrance unless an approved native client has a separately audited Tor transport. The applicable origin/resource/session/key-continuity/parity tests and operations monitoring pass. Do not imply anonymity or universal client feature parity. |
| “Onion access improves network-path privacy” | `REQUIRES QUALIFICATION` | Explain that Tor can hide network location/origin path while account, phone, payment, shipping, pickup, delivery, and application metadata can identify/correlate the transaction. |
| “Tor makes your order anonymous” | `PROHIBITED` | Signing in and providing commerce/fulfillment data identifies or correlates the customer. |
| “Your delivery is anonymous” | `PROHIBITED` | Fulfillment ordinarily requires destination, eligibility, handoff, proof, or payment data. |
| “Your data is never tracked” | `PROHIBITED` | Required sessions, security, order, payment, fulfillment, and delivery processing create data. Precise qualified statements are required. |
| “Your data isn't our product” | `REQUIRES QUALIFICATION` | May become safe only under an approved business/privacy policy prohibiting sale, brokerage, advertising use, unrelated profiling/model training, with provider contracts and audits. It does not mean no processing. |
| “We minimize the data we collect” | `SAFE IF VERIFIED` | Field-level purposes, default-off nonessential collection, approved retention, deletion/hold/provider propagation, backup expiry, telemetry inspection, and periodic evidence are current. |
| “We never sell your personal data” | `REQUIRES QUALIFICATION` | Requires qualified legal definition/jurisdiction, provider/ad-tech practices, transfer/merger treatment, contracts, and actual audited behavior. Not established by SEC-02. |
| “Your account can be recovered after all devices are lost” | `SAFE IF VERIFIED` | Multi-factor/risk-based recovery, notifications, old-device revocation, and new cryptographic identity work. State clearly that old message history may not return. |
| “Recover your old encrypted messages with your order number” | `PROHIBITED` | Order number is not a secret and cannot recreate missing E2EE keys. |
| “We have no metadata” | `PROHIBITED` | Routing, participant/device, time, size, delivery, security, retention, and commerce metadata remain. |
| “All wholesale sales are final—no exceptions” | `PROHIBITED` | The absolute can never become safe as written. A qualified replacement must preserve the owner-authorized wrong-item/quantity correction path and mandatory statutory, payment-network, fraud, defect, and regulatory rights, using approved context-specific wording. |
| “Wholesale orders over $1,000 get free same-day delivery” | `REQUIRES QUALIFICATION` | Current merchandise subtotal is strictly over $1,000, exact order/address is eligible/serviceable under approved wholesale BSDN policy, capacity is confirmed, exclusions are disclosed, and `$0` charge does not erase internal cost. |

## 2. SEC-02 decision records

### SEC-02-ADR-001 — Browser-first applies to public retail, not protected wholesale delivery

**Decision:** Preserve complete ordinary-browser public retail and the conditional browser-E2EE feasibility finding. Reject browser delivery of protected wholesale because the web lacks the required capture authority.
**Qualification:** A browser may show only generic access/onboarding guidance and never protected wholesale navigation, prices, inventory, media, messages, history, or manifest.
**Consequence:** Protected wholesale requires a signed approved client and fails closed; public-web and Onion hardening remain mandatory for the surfaces they actually serve.

### SEC-02-ADR-002 — No E2EE implementation is selected

**Decision:** Matrix JS + Rust crypto is a conditional proof candidate; MLS is a serious protocol family; OpenMLS/`mls-rs` remain blocked for current target evidence; official `libsignal` fails general browser suitability and remains unsupported for external use.
**Consequence:** A constrained proof and independent review must precede selection.
**Prohibited:** Raw WebCrypto/primitive assembly, archived Signal JS, Signal compatibility claim, or choosing by name/marketing.

### SEC-02-ADR-003 — PWA is not a stronger security boundary by itself

**Decision:** PWA may package nonprotected functions for convenience but is rejected for protected wholesale; it does not solve code substitution, screenshot, recording, or key custody.
**Consequence:** No protected content or offline manifest/private media cache enters a PWA.

### SEC-02-ADR-004 — A signed approved client is required for protected wholesale

**Decision:** Platform signing, platform capture authority, app-owned extraction paths, protected key facilities, trusted endpoint state, and fail-closed admission are required for protected wholesale. Native Android and Windows are conditional candidates; unmanaged iOS/iPadOS and macOS are rejected under current supported APIs; managed routes are separate enterprise candidates. No client is approved.
**Consequence:** Native is never required for ordinary retail. No native client may claim Onion compatibility absent separate audited transport.

### SEC-02-ADR-005 — Account recovery and history recovery stay separate

**Decision:** All-device-loss recovery can restore an account and create a new cryptographic identity. It cannot restore old plaintext absent a surviving or prospectively configured endpoint-controlled recovery key.
**Consequence:** Order number is only a record pointer; independent factors, risk handling, notifications, revocation, and re-verification are required.

### SEC-02-ADR-006 — Capture enforcement is a hard supported-client gate; attribution is secondary

**Decision:** Browser/PWA capture prevention and second-camera prevention fail, but genuine supported OS capture exclusion is enforcement inside its exact boundary. Protected content is denied unless the approved client passes capture and ordinary extraction controls. Watermarking never substitutes for the gate.
**Consequence:** Advance Android/Windows only through exact platform tests; fail closed elsewhere. Use least exposure, short leases, individualized visible marks, optional validated forensic marks, audit, appeal, and revoke as defense in depth. Universal prevention claims remain prohibited.

### SEC-02-ADR-007 — Wholesale media uses a hybrid class

**Decision:** D4 endpoint E2EE for messages/approved negotiation attachments; D3 restricted server-authorized current catalog/prices/inventory/profiles/photos/video; D3 canonical manifest projection.
**Consequence:** Server/provider exposure for catalog media is disclosed and governed. Declassification is required between message and commerce/catalog truth.

### SEC-02-ADR-008 — Manifest expiry is access expiry, not erasure

**Decision:** Explicit reveal creates immutable server `FIRST_VIEW_AT`; server access ends at +5 minutes; dispute initiation ends independently at +30 minutes.
**Consequence:** Refresh/replay never extends clocks; open/offline/captured content cannot be guaranteed gone; canonical records remain. At +5 minutes the full protected manifest ends; only the approved minimal protected line/dispute reference may remain until +30 minutes. Accessibility, transmission failure, and exact reference policy still require qualified approval.

### SEC-02-ADR-009 — Onion is optional, isolated, and non-anonymous

**Decision:** A browser Onion entrance may front only public/nonprotected content and approved-client onboarding through an isolated gateway after origin/resource/session/key/operations tests. Protected Onion delivery requires an approved signed client with a separately audited Tor transport and protected resource graph.
**Consequence:** Separate public/Onion browser sessions and explicit reauthentication are the safest default; third-party browser resources are denied by default; neither Tor Browser nor a generic Onion session receives protected wholesale content; account/transaction anonymity is never claimed.

### SEC-02-ADR-010 — Wholesale commercial policy does not bypass domain authority

**Decision:** One-strain one-pound qualification and over-$1,000 `$0` customer delivery charge are feasible rules. Negotiated terms, final-sale wording, inventory, eligibility, payment, and fulfillment remain revalidated by canonical owners and qualified policy.
**Consequence:** Phone/message content never automatically becomes quote/order truth; wholesale BSDN beyond 120 routed miles needs a separate approved service envelope and cost evidence.

### SEC-02-ADR-011 — Protected Content Mode is a hard fail-closed release gate

**Decision:** Protected wholesale authorization includes approved client/build, supported platform/control state, signed release, trusted endpoint, current account/room/resource grant, and freshness. Missing, unknown, stale, unsupported, or revoked state denies every protected object.
**Consequence:** A user-agent string, URL parameter, client Boolean, watermark, or missing download button cannot authorize access. No production launch occurs until one conditional client passes the complete matrix in [private-wholesale-protected-content-assurance.md](private-wholesale-protected-content-assurance.md).

## 3. SEC-01 contradiction and tension register

SEC-02 identifies one demonstrable client-selection contradiction and resolves it through a narrow supersession: SEC-01's browser endpoint remains a research-only conditional E2EE feasibility path, but protected Private Wholesale plaintext requires a future signed approved client and browsers/PWAs receive zero protected payload. The authoritative SEC-01 README, E2EE document, and registry are annotated; SEC-01's cryptographic, endpoint-lifecycle, recovery, declassification, canonical-ownership, and Onion requirements remain intact. The remaining feasibility qualifications are:

| Topic | SEC-01/owner intent | Evidence result | Required treatment |
|---|---|---|---|
| Server-blind browser messaging | Originally required as the protected endpoint | Technically feasible as research, but origin can substitute client code and browsers fail the capture gate | Preserve the cryptographic property; supersede browser client selection; require a future signed approved client and zero protected browser payload |
| Existing trusted device adds new device | Required | Feasible | Preserve; account login alone remains insufficient |
| All-device recovery with purchase evidence | Desired | Account recovery feasible; old-key reconstruction not | Separate account/history; order number never sole factor |
| Conversations disappear | Desired | Controlled lifecycle feasible; universal deletion impossible | Use copy-specific states/claims |
| Strong capture prevention | Hard protected-content release gate | Browser/PWA/iOS/macOS unmanaged paths fail; Android/Windows have conditional supported paths; camera prevention fails | Reject incapable clients, test conditional native clients, preserve camera limitation, keep watermarking secondary |
| Five-minute manifest | Required | Server cutoff feasible; endpoint erasure impossible; fixed timer may conflict with accessibility | Preserve server lease; qualified timing decision required |
| Thirty-minute dispute | Required | Feasible; the full view expires at +5 and only the minimal protected line/dispute reference plus staff fallback may remain to +30 | Finalize exact accessible fields, outage/grace, receipt, and staff policy without restoring full protected content |
| Optional Onion | Desired | Protocol feasible; production isolation/operations conditional | Preserve as optional; no anonymity or universal feature claim |
| All wholesale sales final | Commercial intent | Absolute policy not technically/legally authorizable here | Preserve intent behind qualified statutory/payment/product/fulfillment gates |

If later owner direction demands the prohibited absolute forms rather than these testable properties, that would require an explicit governing decision acknowledging the technical contradiction; SEC-02 cannot manufacture the missing platform authority.

## 4. Unresolved launch-blocking decisions

### Cryptography and client

- Exact protocol/profile/library, version/support policy, independent audit scope, licensing, migration, interoperability/vectors, vulnerability response.
- Matrix proof restrictions including Megolm rotation/properties, replay/index tracking, history forwarding, cross-signing, key backup/secret storage, IndexedDB concurrency/migration.
- MLS application identity/delivery/replay/storage and supported target implementation; OpenMLS audit closure; comparative `mls-rs` evidence.
- Browser release authority remains relevant to public retail/E2EE research; protected wholesale additionally requires selected native signing/distribution authority, minimum-version/revocation policy, and fail-closed client verification.
- Exact Android and Windows supported version/device/framework/capture-tool matrix; complete protected-window coverage; app-integrity/attestation admission; root/instrumentation/modified-OS tests; native accessibility; independent capture review.
- iOS/iPadOS and macOS remain rejected unless new authoritative supported target-app capture authority and product tests materially change the evidence; managed-device use requires separate enterprise governance.
- Directory authenticity/key transparency or acceptable verified-device ceremony; participant/key-change pause policy.
- Attachment formats, limits, safe renderer, report/declassification/abuse process.

### Identity, endpoints, and recovery

- Wholesale account/qualification owner, assurance, approve/suspend/review/appeal.
- Customer and staff authenticators, Tor-compatible alternative, staff phishing-resistant MFA, trusted-device approval threshold.
- Recovery factors for pseudonymous versus transacting accounts, cooldown/dual review, notification channels, reproofing authority.
- Whether optional endpoint-controlled history backup is ever explored; default remains none.
- Numeric endpoint/session/ciphertext/attachment/metadata/notification/backup schedules and hold behavior.

### Capture and media

- Media origin/processor/CDN/DRM/watermark candidates and provider disclosure contract.
- Native supported versions/control behavior and proof that the candidate blocks the required capture/extraction paths; native is mandatory for protected wholesale but not public retail.
- Fail-closed handoff and admission that reveals no wholesale menu, price, inventory, media, message, history, manifest, identifier, preload, or metadata-rich error to an unsupported client.
- Visible watermark design/privacy/retention/appeal.
- Forensic watermark independent robustness/false-positive/collusion/camera/evidence evaluation.
- 4K performance/accessibility/Onion fallback and resource authorization tests.

### Manifest and commercial policy

- First-view transmission failure/reissue rule and clock operations evidence.
- WCAG timing model or qualified essential exception.
- Exact accessible fields and handling for the governing +5m-to-+30m minimal protected reference plus staff fallback; outage/grace and receipt policy.
- Discount authority, quote expiry, phone recording/consent, accessible negotiation alternative.
- Qualified final-sale, fulfillment-error, statutory/payment/fraud/defect/regulatory policy.
- Shipping/pickup readiness, wholesale BSDN envelope beyond 120 miles, driver/custody/safety/capacity, `$1,000` rule activation and exclusions.

### Onion, privacy, and operations

- Exact gateway/upstream/HTTPS/Onion-Location/key custody/migration/monitoring/outage topology and origin-leak test.
- Public/Onion session and explicit transition policy; Tor Browser security-level support.
- Every field's purpose/authority/notice/retention/export/correction/deletion/hold/provider/backup behavior.
- Delivery Hub low-risk capability actions, token/session TTL, re-entry/multiple-device/lost-link flow.
- Incident staffing, RPO/RTO, backup/restore/deletion evidence, provider exit, tabletop and disclosure authority.

## 5. Proposed next gate

The correction source is complete and confirms the protected-content proof requirements. The following next-gate name remains a package proposal rather than owner-specified wording:

> **SEC-03 — Security Candidate Proof, Qualified Policy, and Independent Review Gate**

It remains a proof/evidence activity with synthetic data only unless separately authorized. It must not create production keys, enroll real wholesale customers, process real conversations, deploy a public Onion address, contract a provider, or activate commerce/fulfillment policy.

### Required workstreams

1. **Constrained E2EE proofs:** Matrix candidate plus approved MLS comparative proof; exact protocol properties/config; trusted-device add/revoke; all-device account recovery without history; replay/out-of-order/key-change/multi-device/attachment/migration tests.
2. **Protected-client integrity and capture proof:** selected signed Android/Windows candidate, exact supported matrix, release manifest/transparency and dual control, device-bound keys, request-bound integrity/attestation, trusted endpoint lifecycle, fail-closed admission, screenshot/recording/mirroring/non-secure-display tests, copy/forward/save/download/print/drag/export denial, root/instrumentation/tamper tests, and external-camera disclosure.
3. **Independent review:** qualified cryptographic design and integration review, application/ASVS review, privacy/security claim review, accessibility, and adversarial tests.
4. **Media proof:** approved-client object authorization, leases, cache behavior, 4K segments/range/key/expiry, no public/master URL, visible derivative, provider boundary, forensic candidate if any, scrape tests, Onion implications, and accessible protected alternatives.
5. **Manifest proof:** atomic first reveal, concurrent retry, +5m full server deny/client removal, offline/frozen/restart/cache/memory/output tests, +30m minimal protected reference and idempotent dispute receipt, accessible timing, transmission failure, and reissue policy.
6. **Public Onion browser proof:** public/nonprotected resource trace, origin/session leak tests, Tor security-level compatibility, outage/key compromise/address migration, and public/Onion canonical parity. **Future protected Onion proof:** separately selected approved signed client, audited native Tor transport, protected object/media/E2EE resource graph, fail-closed clearnet-leak tests, performance, accessibility, and incident behavior.
7. **Qualified policy:** privacy/retention/holds/backups/providers, recovery assurance, wholesale final-sale/discount/phone, shipping/pickup/BSDN service/safety/economics, incident/operations owners.

### Exit criteria before implementation may be recommended

- one candidate profile has supported target evidence, acceptable license, closed material findings, whole-product independent review, vectors/interoperability, migration and named security response;
- public-browser and protected-native claims match tested behavior; no unsupported client receives protected content; malicious-code/endpoint residuals are disclosed;
- at least one signed client passes the full protected-content release matrix, independent review, and fail-closed tests; documentation alone cannot satisfy this criterion;
- every device/recovery/expiry/declassification/abuse path has explicit states, owner, audit, safe failure and customer consequence;
- capture/media/manifest claims use the exact assurance classifications in this package;
- Onion origin/resource/session/key tests pass and ordinary web remains complete;
- privacy/retention/accessibility/legal/payment/fulfillment/BSDN decisions are approved by qualified owners;
- no candidate creates duplicate commerce/BSDN truth or converts `UNKNOWN`/failure into authorization;
- production implementation receives a separate explicit authorization.

Any missing or conflicting evidence remains `BLOCKED`; the gate cannot convert prototype success into launch approval.

## 6. Final phase classification

- **SEC-02 FEASIBILITY AND ASSURANCE SYNTHESIS: COMPLETE FOR THE CURRENT EVIDENCE PHASE**
- **TRUE SERVER-BLIND WHOLESALE E2EE: CONDITIONALLY FEASIBLE; IMPLEMENTATION NOT SELECTED**
- **PRIVATE WHOLESALE PROTECTED CONTENT: HARD RELEASE GATE; CONDITIONAL / NOT YET VERIFIED**
- **BROWSER/PWA WHOLESALE CLIENT: REJECTED; PUBLIC RETAIL UNAFFECTED**
- **NATIVE ANDROID WHOLESALE CLIENT: CONDITIONAL CANDIDATE; NOT APPROVED**
- **NATIVE IOS/IPADOS WHOLESALE CLIENT: REJECTED UNDER CURRENT SUPPORTED APIS**
- **NATIVE WINDOWS WHOLESALE CLIENT: CONDITIONAL CANDIDATE; NOT APPROVED**
- **NATIVE MACOS WHOLESALE CLIENT: REJECTED UNDER CURRENT SUPPORTED APIS**
- **SECOND-CAMERA AND GUARANTEED REMOTE DELETION: FAIL**
- **WHOLESALE MEDIA: HYBRID CLASS DECIDED; PIPELINE NOT SELECTED**
- **FIVE-MINUTE SERVER ACCESS CUTOFF: FEASIBLE; ACCESSIBILITY/PRESENTATION POLICY BLOCKED**
- **THIRTY-MINUTE DISPUTE CLOCK: FEASIBLE; MINIMAL REFERENCE DIRECTION SELECTED, EXACT ACCESSIBILITY/OUTAGE POLICY OPEN**
- **OPTIONAL ONION: CONDITIONALLY FEASIBLE; DEPLOYMENT NOT AUTHORIZED**
- **PRIVATE WHOLESALE/COMMERCE/FULFILLMENT ACTIVATION: NOT ESTABLISHED**
- **PRODUCTION IMPLEMENTATION AND STACK/PROVIDER SELECTION: NOT AUTHORIZED**
