# COM-ADM-02B — Application-Owned WebAuthn Evaluation

## 1. Verdict

**TECHNICALLY VIABLE; REJECT AS THE DAY-1 WINNER.**

Application-owned WebAuthn using a mature library can support multiple roaming FIDO2 keys, exact user verification, credential revocation, purpose-bound fresh assertions, and strong exit control. The library handles ceremonies; it does not become an identity provider. Blowin' Smoke would own bootstrap, recovery, ceremony state, sessions, abuse controls, audit, device admission, browser/key compatibility, dependency advisories, and urgent security patches.

Saving $35/month does not justify that identity-security burden for one owner. The unresolved all-key-loss recovery path is also a hard gate.

## 2. Standards-backed conceptual architecture

```text
OWNER + ROAMING FIDO2 KEY
        |
        v
server-generated, short-lived, one-use challenge
        |
        v
browser WebAuthn ceremony
        |
        v
server verifies challenge + origin + RP ID + signature + UV
        |
        v
active canonical credential record
        |
        v
ACTIVE AdminDevice + opaque revocable server session
        |
        v
capability/object/version/step-up checks per command
```

No cryptographic primitive would be invented. A maintained WebAuthn server library would parse and verify ceremonies; Blowin' Smoke would own all surrounding policy and state.

## 3. Required owned capabilities

### Registration and authentication

- stable, narrowly scoped RP ID and exact allowed origins;
- cryptographically random, purpose-bound challenges with short expiry and atomic one-time consumption, including failed attempts;
- `userVerification: required` in options and required again at server verification;
- verification of exact challenge, origin, RP ID hash, credential/user binding, signature, UP/UV, credential state, backup eligibility/state, and counter signal;
- credential records for ID, public key, counter, transports, AAGUID/attestation data where used, backup state, nickname, lifecycle, and revocation;
- two active/backup roaming credentials plus a third sealed recovery key before ordinary Admin activation if R10 is to be satisfied without a bearer-secret recovery path;
- no password, email-link, SMS, or TOTP fallback.

### Sessions, step-up, and device admission

- opaque server sessions with protected cookies, rotation, bounded idle/absolute life, logout, and revocation;
- CSRF token plus origin/fetch-metadata validation for mutations;
- fresh WebAuthn UV for sensitive commands, with one-use grant bound to actor, device, session, command, object, input digest/version, expiry, and nonce;
- fresh existing credential plus active `AdminDevice` to add/remove credentials;
- separate pending/active/suspended/revoked endpoint lifecycle;
- session/device cascade after credential or recovery change.

### Operations

- secure owner bootstrap that is permanently disabled after enrollment;
- all-credential-loss recovery and independent identity proofing;
- login/enrollment/recovery abuse throttling and enumeration resistance;
- canonical audit and independent security notifications;
- library/browser/key regression testing;
- dependency pinning, advisory monitoring, urgent patching, and an attestation/MDS policy if hardware-only enforcement is claimed.

## 4. Passkey synchronization and hardware policy

| Class | Application implication |
|---|---|
| Synced passkey | Phishing-resistant but can propagate to another ecosystem device; not approved-device identity |
| Device-bound platform credential | Bound to one platform authenticator but not necessarily a dedicated hardware key or canonical browser/device record |
| Roaming FIDO2 key | Portable physical authenticator; credential stays on key; can still be used from a new unapproved browser |

WebAuthn backup flags distinguish sync eligibility/state, not the identity of an endpoint. `authenticatorAttachment` or a security-key hint guides selection but does not prove a dedicated hardware model. Enforcing a hardware allowlist requires direct attestation and accountable metadata/trust policy, increasing maintenance and privacy/compatibility risk.

If this option were selected, the Day-1 policy would be **three UV-required roaming FIDO2 keys—daily, secondary, and sealed recovery—no synced passkey as an admission credential, and a separate application `AdminDevice` gate**.

Discoverable credentials require an explicit policy rather than being assumed from the word “passkey.” A proof must decide `residentKey`, user-handle, usernameless-discovery, and `allowCredentials` behavior, then test authenticator capacity, privacy, account enumeration, and target-browser/key compatibility. Discoverability may improve sign-in ergonomics, but it is not inherently required for the selected identifier flow and never proves or replaces `AdminDevice`.

## 5. Recovery result

Two active/backup keys handle R01–R09 well: either endpoint plus a remaining key can establish a new session, revoke the lost endpoint/credential, and enroll a replacement under fresh UV.

R10—both active/backup keys lost—fails under the priced two-key baseline. A compliant candidate can close that case with:

- a third separately stored recovery authenticator, selected for this candidate comparison; or
- an independently audited, NIST-aligned recovery/identity-proofing procedure with controlled notifications, cooling-off, complete old-state revocation, and no email/SMS/database-edit shortcut.

A single bearer recovery code or inbox access would weaken the FIDO posture. The third key brings candidate hardware to $87 and satisfies R10 while it remains available; loss of all three still needs an attended recovery authority. Designing and operating that authority remains part of the disproportionate custom burden.

## 6. Cost

| Cost class | Amount |
|---|---:|
| Authentication provider | **$0/month; $0/year** |
| Two active/backup Yubico Security Key C NFC reference keys | **$58 once before tax/shipping** |
| Third sealed recovery key required for the R10-complete candidate | **$29 once before tax/shipping** |
| Total R10-complete hardware | **$87 once before tax/shipping** |
| Engineering, independent review, proof, patching, and support | **Not priced; material and mandatory** |

The provider subscription saving is $420/year versus Auth0. It is not the total cost of ownership.

## 7. Current official evidence register

**Access date for every source:** 2026-08-17

| Source | URL | Claim established | Claim not established |
|---|---|---|---|
| W3C Web Authentication Level 3 | https://www.w3.org/TR/webauthn-3/ | Registration/authentication ceremonies; challenge/origin/RP/signature/UV/credential/counter/backup-state verification; credential decommissioning | Sessions, CSRF, recovery, rate limits, audit, device admission, correct implementation |
| NIST SP 800-63B-4 | https://pages.nist.gov/800-63-4/sp800-63b.html | Verifier-name binding/phishing resistance; replay-resistant challenges; multiple authenticators; binding/revocation/recovery/notification/session guidance; sync risks | Legal assurance mandate, certified implementation, ready recovery service |
| FIDO Alliance passkeys | https://fidoalliance.org/passkeys-2/ | Synced versus device-bound credentials; security keys can hold device-bound credentials; cross-device auth; UV properties | Approved-device identity or RP control over ecosystem recovery |
| Apple public/private-key authentication | https://developer.apple.com/documentation/authenticationservices/public-private-key-authentication | Apple distinguishes synced iCloud Keychain passkeys and physical security keys | Server policy, recovery, application session, target proof |
| WebKit security-key support | https://webkit.org/blog/11312/meet-face-id-and-touch-id-for-the-web/ | Safari/iOS/macOS WebAuthn security-key and PIN-era support | Exact owner hardware/browser/key proof |
| Apple passkeys Q&A | https://developer.apple.com/news/?id=21mnmxow | Synced Apple passkeys require local UV; RP account recovery is separate | Hardware-key-only enforcement or device approval |
| SimpleWebAuthn server | https://simplewebauthn.dev/docs/packages/server | Maintained generation/verification helpers; exact challenge/origin/RP; credential/counter/transport/backup/UV support | Sessions, authorization, recovery, audit, abuse defense, device approval |
| SimpleWebAuthn passkey guidance | https://simplewebauthn.dev/docs/advanced/passkeys/ | Explicit UV request/verification; challenges stored and deleted; backup-state exposure | High-assurance bootstrap or complete identity service |
| SimpleWebAuthn metadata service | https://simplewebauthn.dev/docs/advanced/server/metadata-service | Direct attestation and FIDO metadata support | Perfect hardware proof or zero trust-policy maintenance |
| SimpleWebAuthn project/release evidence | https://github.com/MasterKale/SimpleWebAuthn ; https://github.com/MasterKale/SimpleWebAuthn/releases ; https://www.npmjs.com/package/@simplewebauthn/server | Active maintained library and release history, including security fixes | Certification, SLA, guaranteed maintenance, low patch burden |
| OWASP session/authentication guidance | https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html ; https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html | Protected opaque sessions, CSRF defense, rotation, bounded lifetime, reauth for sensitive events | Automatic correctness or managed abuse response |
| Yubico Security Key C NFC | https://www.yubico.com/product/security-key-series/security-key-c-nfc-by-yubico-black/ | FIDO-only USB-C/NFC reference key is $29 | Final tax/shipping, future price, or exact target-device result |
| Yubico iOS compatibility | https://developers.yubico.com/WebAuthn/Supporting_FIDO2_Security_Keys_on_iOS_or_iPadOS/Security_Key_Compatibility.html | Applicable iPhone NFC/USB-C and Safari support | Exact owner iPhone, Safari, adapter, firmware, and ceremony result |

## 8. Weighted result and reconsideration trigger

Application-owned WebAuthn scores **73/100** with three keys: strong ceremony/security control, ordinary-loss recovery, device-model compatibility, exit, and provider cost; disproportionate maintenance and all-three-key recovery authority remain. Reconsider only if all managed candidates fail the hard requirements and a later phase funds an independent authentication design review, an all-credential-loss recovery proof, target-device tests, and ongoing security ownership. It is not implementation-authorized here.
