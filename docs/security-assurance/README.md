# Blowin' Smoke SEC-02 Security Feasibility and Assurance Gate

**Package ID:** `SEC-02`
**Package version:** 1.0
**Assessment date:** 2026-08-14
**Repository baseline:** `9f898f382a086c5f1b6ac5503c827f8a6dc5336b`
**Status:** Feasibility gate complete; implementation and production stack selection not authorized

## Purpose and authority

This package tests the security, privacy, cryptography, Onion, and Private Wholesale requirements established by SEC-01 against current platform and protocol evidence. It answers what is feasible, what is feasible only under stated conditions, what is impossible, and what remains blocked pending evidence or an owner decision.

SEC-01 remains the governing logical architecture. SEC-02 does not rewrite it, select a production dependency, deploy an Onion Service, build a client, authorize wholesale operations, or establish launch readiness. The Constitution, Technical Architecture, and Blowin' Smoke Same-Day Delivery Network (BSDN) architecture continue to govern canonical ownership, evidence, fulfillment, correction, and audit.

## Gate conclusion

```text
ORDINARY BROWSER RETAIL:
FEASIBLE — BASELINE SECURITY MUST NOT DEPEND ON TOR OR AN APP

BROWSER-ACCESSIBLE SERVER-BLIND WHOLESALE MESSAGING:
CONDITIONALLY FEASIBLE — NO IMPLEMENTATION SELECTED

PWA AS A MATERIAL SECURITY BOUNDARY:
FAIL — INSTALLABILITY DOES NOT SOLVE CODE-SUBSTITUTION OR CAPTURE RISK

SIGNED NATIVE WHOLESALE CLIENT:
CONDITIONALLY FEASIBLE — STRONGER ENDPOINT CONTROL, MATERIAL CUSTOMER FRICTION

GUARANTEED SCREENSHOT, RECORDING, COPY, OR SECOND-CAMERA PREVENTION:
FAIL

FIVE-MINUTE SERVER ACCESS EXPIRATION:
CONDITIONALLY FEASIBLE — NOT A DELETION OR RECALL GUARANTEE

OPTIONAL ONION ENTRANCE TO ONE CANONICAL SYSTEM:
CONDITIONALLY FEASIBLE — ORIGIN-ISOLATION TESTS AND OPERATIONS REQUIRED

PRODUCTION IMPLEMENTATION:
NOT AUTHORIZED
```

The owner model is technically coherent only when the product makes narrower, testable promises. The strongest honest direction is a browser-first Wholesale Room using a mature, supported, independently reviewed E2EE implementation; explicit device trust; account recovery separated from message-history recovery; hybrid handling of messaging versus catalog media; short-lived authorization; individualized watermarking; and an optional future signed-native tier for customers who value stronger endpoint controls. This is a feasibility direction, not a stack decision.

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
3. **A PWA is not a cryptographic trust upgrade by itself.** It can improve installability and cache/update control, but it remains web-delivered code and cannot prevent OS-level capture.
4. **A signed native client can materially improve key custody, release integrity, and some capture controls.** It still cannot prevent a second camera, a compromised endpoint, or every recording path; it also raises access, accessibility, support, Onion, and adoption costs.
5. **All-device-loss recovery restores the account, not unknowable keys.** A prior order number is an identifier/evidence pointer, never a sufficient secret. Recovery requires independent factors and notifications. Old E2EE plaintext remains unavailable unless the customer previously enabled an independently reviewed endpoint-controlled recovery design.
6. **Wholesale catalog media uses a hybrid model.** Message attachments intended to be private conversation content remain E2EE. Current inventory, prices, profiles, photos, and video are restricted server-authorized content because they require current revocation, streaming, merchandising, and controlled delivery. The server and authorized media pipeline can therefore access that catalog media; claims must say so.
7. **Capture protection is layered deterrence and attribution.** Browser prevention fails. Dynamic account/session watermarking, short authorization, no public enumeration, output shaping, audit, abuse response, and revocation are useful, but cannot make content uncopyable.
8. **Five-minute visibility is access expiration, not deletion.** The server can stop new/repeated disclosure after an immutable first-view timestamp. It cannot retract pixels, accessibility output, screenshots, printouts, memory, or copies already controlled by an endpoint.
9. **The thirty-minute dispute-initiation clock is independent.** It remains server-authoritative and auditable after manifest display expires. Starting a dispute within the window preserves the case; it does not itself decide the result.
10. **Onion access is an optional isolated entrance, not anonymity.** It must reach the same canonical truth, avoid third-party browser resources, protect the upstream origin, and use a deliberately reviewed session-transition model.
11. **Security marketing stays evidence-bounded.** “E2EE,” “optional Onion access,” and “we minimize data” can become safe only after the exact tested conditions in the claim matrix hold. Absolute deletion, no-tracking, anonymous-order, and capture-prevention claims remain prohibited.

## Source integrity boundary

The supplied SEC-02 brief available for this assessment contains 715 lines / 21,783 bytes and ends mid-formula at the partial text `EXPIRES_VIEW_AT = FIRST`. All requirements through that boundary are preserved. No absent tail text is treated as an owner decision. The manifest semantics in this package derive only from the surviving owner requirements: five minutes of access after first view, thirty minutes to begin a qualifying dispute, separate server-authoritative clocks, and preservation of canonical records. Any later recovered instruction that conflicts with this package requires an explicit addendum rather than silent reinterpretation.

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
- [Apple screen-capture state documentation](https://developer.apple.com/documentation/uikit/uiscreen/iscaptured)
- [Microsoft `SetWindowDisplayAffinity`](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)

## Prohibited interpretation

This package does not establish that private wholesale inventory, supplier access, final pricing, payment acceptance, fulfillment capacity, qualified legal policy, or production security operations exist. Conversation content can become commerce truth only through SEC-01 deliberate declassification and revalidation by existing product, price, inventory, eligibility, order, payment, fulfillment, BSDN, consent, and audit owners.

No provider, library, protocol profile, cloud, identity system, key service, media pipeline, CDN, DRM system, device-management system, or Tor host is selected by SEC-02.
