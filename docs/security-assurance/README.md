# Blowin' Smoke SEC-02 Security Feasibility and Assurance Gate

**Package ID:** `SEC-02`
**Package version:** 1.1
**Assessment date:** 2026-08-14
**Repository baseline:** `d54e2569b1961c51c24f01ef64a75ec135ba2043`
**Status:** Feasibility gate complete; implementation and production stack selection not authorized

## Purpose and authority

This package tests the security, privacy, cryptography, Onion, and Private Wholesale requirements established by SEC-01 against current platform and protocol evidence. It answers what is feasible, what is feasible only under stated conditions, what is impossible, and what remains blocked pending evidence or an owner decision.

SEC-01 remains the governing logical architecture except for one explicitly recorded, narrow supersession: its browser client selection for protected Private Wholesale content. SEC-02 preserves SEC-01's cryptographic, endpoint, recovery, declassification, canonical-ownership, and Onion requirements while requiring a future signed approved client for protected plaintext and zero protected payload to browsers/PWAs. The SEC-01 authoritative entry points are annotated accordingly. SEC-02 does not select a production dependency, deploy an Onion Service, build a client, authorize wholesale operations, or establish launch readiness. The Constitution, Technical Architecture, and Blowin' Smoke Same-Day Delivery Network (BSDN) architecture continue to govern canonical ownership, evidence, fulfillment, correction, and audit.

SEC-03 performed the approved-client platform validation. SEC-03A subsequently and narrowly supersedes SEC-03's unmanaged iOS/iPadOS rejection with `CONDITIONAL — APP-STORE-VIABLE TECHNIQUE REQUIRES DEVICE PROOF`, based on a supported capture-protected sample-buffer image plane and an unexecuted whole-surface rasterized proof hypothesis. No client is approved, no production implementation is authorized, and all other platform verdicts remain unchanged.

## Gate conclusion

```text
ORDINARY BROWSER RETAIL:
FEASIBLE — BASELINE SECURITY MUST NOT DEPEND ON TOR OR AN APP

BROWSER SERVER-BLIND MESSAGING AS A CRYPTOGRAPHIC PROPERTY:
CONDITIONALLY FEASIBLE — NO IMPLEMENTATION SELECTED

BROWSER OR PWA AS A PRIVATE WHOLESALE PROTECTED-CONTENT CLIENT:
FAIL — REJECTED; PROTECTED CONTENT MUST FAIL CLOSED

PWA AS A MATERIAL SECURITY BOUNDARY:
FAIL — INSTALLABILITY DOES NOT SOLVE CODE-SUBSTITUTION OR CAPTURE RISK

NATIVE ANDROID OR WINDOWS PROTECTED-CONTENT CLIENT:
CONDITIONAL CANDIDATE — EXACT BUILD/PLATFORM TEST EVIDENCE REQUIRED

NATIVE IOS/IPADOS PROTECTED-CONTENT CLIENT:
CONDITIONAL PUBLIC-API RASTERIZED-SURFACE HYPOTHESIS — DEVICE PROOF REQUIRED

NATIVE MACOS PROTECTED-CONTENT CLIENT:
FAIL UNDER CURRENT SUPPORTED UNMANAGED APP APIS

SUPPORTED-CLIENT SCREENSHOT/RECORDING EXCLUSION:
HARD RELEASE GATE — NO CLIENT YET APPROVED

UNIVERSAL OR SECOND-CAMERA PREVENTION:
FAIL — OUTSIDE THE SOFTWARE TRUST BOUNDARY

FIVE-MINUTE SERVER ACCESS EXPIRATION:
CONDITIONALLY FEASIBLE — NOT A DELETION OR RECALL GUARANTEE

OPTIONAL ONION ENTRANCE TO ONE CANONICAL SYSTEM:
CONDITIONALLY FEASIBLE — ORIGIN-ISOLATION TESTS AND OPERATIONS REQUIRED

PRODUCTION IMPLEMENTATION:
NOT AUTHORIZED
```

The owner model is technically coherent only when public retail and protected wholesale use different client boundaries. Public retail remains browser-first. Browser E2EE remains a valid conditional cryptographic finding, but browsers and PWAs are rejected as protected wholesale delivery clients because they cannot meet the capture gate. Private Wholesale now requires a signed approved client that passes platform capture, ordinary extraction, object-authorization, device-trust, accessibility, and fail-closed tests. Native Android and Windows are documentation-supported candidates; unmanaged iOS/iPadOS now has a conditional public-API rendering hypothesis under SEC-03A. There are no approved candidates and no stack selection. The governing correction and full matrix are in [private-wholesale-protected-content-assurance.md](private-wholesale-protected-content-assurance.md), with the focused iOS supersession in [sec-03a-ios-protected-rendering-investigation.md](sec-03a-ios-protected-rendering-investigation.md).

## Evidence vocabulary

### Feasibility status

| Status | Meaning |
|---|---|
| `PASS` | The requirement is achievable with established mechanisms and no unresolved contradiction; implementation evidence is still required. |
| `CONDITIONAL` | Achievable only if every listed prerequisite and qualification is satisfied. |
| `FAIL` | The requirement, as stated, cannot be honestly provided in the assessed environment. |
| `BLOCKED` | Evidence, authority, policy, or a sufficiently supported implementation is absent; uncertainty is not converted into approval. |

### Assurance strength

| Label | Meaning |
|---|---|
| `GUARANTEED` | A narrowly scoped property enforceable inside the stated trust boundary and verified by test. It never extends to a compromised or uncontrolled endpoint unless expressly proven. |
| `BEST-EFFORT` | A control expected to reduce exposure but unable to cover every platform, failure, or adversary. |
| `DETERRENCE` | A control raises effort or consequence but does not prevent the act. |
| `ATTRIBUTION` | A control may connect a leaked copy to an account/session subject to false-positive, stripping, and evidentiary limits. |
| `NOT YET VERIFIED` | Feasibility has been assessed, but no implementation and test evidence yet supports an operational assurance claim. |
| `NOT POSSIBLE` | The product cannot enforce the desired property in the stated environment. |

Statuses are capability findings; they are not launch approvals.

## Binding feasibility decisions

1. **True endpoint E2EE is conditionally feasible.** The intermediary can route ciphertext without blanket content-decryption authority. A supported candidate, independent review, exact protocol profile, device lifecycle, browser delivery integrity, and adversarial tests remain mandatory.
2. **No reviewed implementation has been selected.** Matrix's current Rust-crypto browser path is a serious evaluation candidate, not an approval. MLS is a serious protocol family, but OpenMLS's browser target is not presently sufficient evidence for approval. Signal's official `libsignal` is unsuitable for this general browser use because its maintainers state that outside use is unsupported and its TypeScript package uses a native Node bridge.
3. **Browsers and PWAs are rejected for protected wholesale.** Their E2EE feasibility is not capture authority. They may support public retail and a generic access-requirement/onboarding surface but receive no protected wholesale content.
4. **Protected wholesale requires an approved signed client.** Native Android and Windows are conditional candidates pending exact supported-version, capture, extraction, integrity, accessibility, and adversarial proof. Unmanaged iOS/iPadOS has a conditional SEC-03A sample-buffer whole-surface proof hypothesis; unmanaged macOS remains rejected. Managed endpoints remain a separate conditional enterprise case. No client is approved now.
5. **All-device-loss recovery restores the account, not unknowable keys.** A prior order number is an identifier/evidence pointer, never a sufficient secret. Recovery requires independent factors and notifications. Old E2EE plaintext remains unavailable unless the customer previously enabled an independently reviewed endpoint-controlled recovery design.
6. **Wholesale catalog media uses a hybrid model.** Message attachments intended to be private conversation content remain E2EE. Current inventory, prices, profiles, photos, and video are restricted server-authorized content because they require current revocation, streaming, merchandising, and controlled delivery. The server and authorized media pipeline can therefore access that catalog media; claims must say so.
7. **Capture protection is a hard supported-client gate.** Genuine OS enforcement is classified as enforcement, not deterrence. Watermarking, short authorization, anti-enumeration, audit, abuse response, and revocation remain secondary controls. Browser/PWA delivery fails closed; external-camera prevention remains impossible.
8. **Five-minute visibility is access expiration, not deletion.** The server can stop new/repeated disclosure after an immutable first-view timestamp, and the approved client must remove the active full view. It cannot universally retract approved-client remnants, required least-privilege assistive output, privileged/unsupported prior output, compromised/offline copies, transcription, or external-camera images.
9. **The thirty-minute dispute-initiation clock is independent.** It remains server-authoritative and auditable after manifest display expires. Starting a dispute within the window preserves the case; it does not itself decide the result.
10. **Onion access is an optional isolated entrance, not anonymity.** Tor Browser is limited to public/nonprotected content and approved-client onboarding. Protected Onion delivery requires an approved signed client with a separately audited Tor transport and resource graph. Either path must reach the same canonical truth, avoid unintended third parties/clearnet leaks, protect the upstream origin, and use a deliberately reviewed session-transition model.
11. **Security marketing stays evidence-bounded.** An exact supported-client capture/extraction statement can become safe only after the named build/platform/surface passes the protected-content gate. Universal capture, deletion, no-tracking, anonymous-order, and uncopyable-content claims remain prohibited.

## Source integrity boundary

The original SEC-02 brief contained 715 lines / 21,783 bytes and ended mid-formula at `EXPIRES_VIEW_AT = FIRST`; version 1.0 correctly refused to invent its absent tail. The authoritative correction/completion brief contains 1,040 lines / 30,028 bytes and is complete. It explicitly establishes Protected Content Mode as a hard release gate and confirms `EXPIRES_VIEW_AT = FIRST_VIEW_AT + 5 minutes` and `DISPUTE_BEGIN_BY = FIRST_VIEW_AT + 30 minutes`. Version 1.1 records that correction without retroactively treating the original truncation as evidence.

## Document map

| Document | Purpose |
|---|---|
| [01-feasibility-gate-and-requirement-matrix.md](01-feasibility-gate-and-requirement-matrix.md) | Executive findings, full capability classification, primary-question answers, prerequisites, risks, and owner decisions. |
| [02-private-wholesale-e2ee-candidates.md](02-private-wholesale-e2ee-candidates.md) | Browser/PWA/native approach comparison and current protocol/implementation candidate evidence. |
| [03-device-trust-recovery-and-ephemeral-content.md](03-device-trust-recovery-and-ephemeral-content.md) | Endpoint identity, trusted-device addition, all-device loss, account/history recovery separation, and message lifecycles. |
| [04-capture-resistance-and-leakage-attribution.md](04-capture-resistance-and-leakage-attribution.md) | Browser, PWA, iOS, Android, desktop, managed-device, watermark, and second-camera limits. |
| [05-wholesale-media-security.md](05-wholesale-media-security.md) | 4K media, private catalog data, streaming, caching, encryption, watermark, accessibility, and hybrid content decision. |
| [06-public-web-onion-and-session-assurance.md](06-public-web-onion-and-session-assurance.md) | Ordinary web, optional Onion, origin isolation, public/Onion sessions, privacy minimization, and Delivery Hub token controls. |
| [07-manifest-dispute-and-fulfillment-assurance.md](07-manifest-dispute-and-fulfillment-assurance.md) | First-view semantics, independent clocks, final-sale qualification, wholesale threshold, negotiation, fulfillment, and BSDN economics. |
| [08-security-claims-decisions-and-next-gate.md](08-security-claims-decisions-and-next-gate.md) | Customer-facing claim matrix, final decisions, unresolved blockers, contradiction register, and the next evidence gate. |
| [private-wholesale-protected-content-assurance.md](private-wholesale-protected-content-assurance.md) | Governing hard release criterion, complete client matrix, control classifications, fail-closed rules, manifest compromise, and dated live evidence register. |
| [sec-03-approved-client-proof-and-platform-validation.md](sec-03-approved-client-proof-and-platform-validation.md) | SEC-03 platform verdict and approved-client proof boundary, with the iOS verdict narrowly superseded by SEC-03A. |
| [sec-03a-ios-protected-rendering-investigation.md](sec-03a-ios-protected-rendering-investigation.md) | Canonical SEC-03A unmanaged iOS/iPadOS protected-rendering finding and conditional verdict. |
| [sec-03a-ios-evidence-register.md](sec-03a-ios-evidence-register.md) | Claim-bounded Apple, Telegram, owner-reference, SDK, and technique-classification ledger. |
| [sec-03a-ios-test-matrix.md](sec-03a-ios-test-matrix.md) | Owner Telegram R01–R16 checklist and Blowin' Smoke iOS I01–I30 physical proof matrix. |
| [sec-03a-registry.json](sec-03a-registry.json) | Machine-readable SEC-03A verdict, mechanisms, proof state, residuals, and document paths. |
| [security-assurance-registry.json](security-assurance-registry.json) | Machine-readable findings, approach scores, candidates, claims, decisions, ownership, and next-gate requirements. |

## Primary evidence baseline

Primary specifications and maintainer documentation are used as feasibility evidence, not proof of a Blowin' Smoke implementation:

- [Signal protocol specifications](https://signal.org/docs/)
- [Signal `libsignal` maintainer README](https://github.com/signalapp/libsignal/blob/main/README.md)
- [Matrix JavaScript SDK maintainer README](https://github.com/matrix-org/matrix-js-sdk/blob/develop/README.md)
- [Matrix JavaScript SDK `v42.1.0` release](https://github.com/matrix-org/matrix-js-sdk/releases/tag/v42.1.0)
- [Matrix Rust SDK security and audit record](https://matrix.org/blog/2022/05/16/independent-public-audit-of-vodozemac-a-native-rust-reference-implementation-of-matrix-end-to-end-encryption/)
- [Matrix 2026 `vodozemac` disclosure analysis](https://matrix.org/blog/2026/02/analysis-of-reported-issues-in-vodozemac/) and [`vodozemac` `v0.10.0` remediation release](https://github.com/matrix-org/vodozemac/releases/tag/0.10.0)
- [Matrix security advisories and disclosures](https://matrix.org/category/security/)
- [RFC 9420 — Messaging Layer Security](https://www.rfc-editor.org/rfc/rfc9420)
- [RFC 9750 — MLS Architecture](https://www.rfc-editor.org/rfc/rfc9750)
- [OpenMLS maintainer documentation](https://github.com/openmls/openmls)
- [NIST SP 800-63B-4 — Authentication and Account Recovery](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)
- [W3C Clear-Site-Data](https://www.w3.org/TR/clear-site-data/)
- [Tor Onion Service protocol overview](https://spec.torproject.org/rend-spec/protocol-overview.html)
- [Tor Project Onion Service operations guidance](https://community.torproject.org/onion-services/)
- [Android secure-display guidance](https://developer.android.com/security/fraud-prevention/activities)
- [Android Play Integrity](https://developer.android.com/google/play/integrity/overview)
- [Apple screen-capture state documentation](https://developer.apple.com/documentation/uikit/uiscreen/iscaptured)
- [Apple App Attest](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity)
- [Apple device-management restrictions](https://developer.apple.com/documentation/devicemanagement/restrictions)
- [Microsoft `SetWindowDisplayAffinity`](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity)
- [Telegram protected-content client contract](https://core.telegram.org/api/content-protection)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)

## Prohibited interpretation

This package does not establish that private wholesale inventory, supplier access, final pricing, payment acceptance, fulfillment capacity, qualified legal policy, or production security operations exist. Conversation content can become commerce truth only through SEC-01 deliberate declassification and revalidation by existing product, price, inventory, eligibility, order, payment, fulfillment, BSDN, consent, and audit owners.

No provider, library, protocol profile, cloud, identity system, key service, media pipeline, CDN, DRM system, device-management system, or Tor host is selected by SEC-02.
