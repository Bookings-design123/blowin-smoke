# Blowin' Smoke — Owner Authentication Cost / Security Reduction Proof

**Phase:** COM-ADM-02B

**Status:** Decision complete; configuration proof, procurement, implementation, and production use remain unauthorized

**Governing base:** `49ca641cc6fa177b7db8241822918e827d8851f3`

**Evidence access date:** 2026-08-17

**Production code changed:** No

## Purpose

This package answers one question: can the one-owner Day-1 Admin replace Auth0 Essentials with a materially cheaper authentication path without weakening phishing resistance, user verification, recovery, step-up, session control, device admission, or audit?

## Decision

**KEEP AUTH0 ESSENTIALS at $35/month.**

Auth0 is retained because Essentials adds the Pro MFA factor needed for a UV-required roaming security key, plus log streaming/longer retention, support, and environment/extensibility capacity around Auth0's existing free custom-domain/basic-protection baseline. That exact-factor path, managed recovery mechanisms, and future multi-user operation remove a disproportionate amount of identity-security work for $420/year. WorkOS and Clerk are cheaper only while one or more hard properties remain unproved or weaker. Application-owned WebAuthn can be designed to exceed the provider options, but doing so would make Blowin' Smoke responsible for an identity provider, recovery authority, ceremony state, abuse controls, compatibility testing, and urgent security maintenance merely to save $35/month.

The research corrects one COM-ADM-02A assumption: current specific Auth0 support guidance says one application user can enroll only one YubiKey in the WebAuthn security-key MFA factor. The selected Day-1 recovery model is therefore:

```text
ORDINARY AUTHENTICATION
password + one roaming FIDO2 security key
User Verification: Required
              |
              v
Blowin' Smoke AdminDevice + revocable server session

PHYSICALLY SEPARATE BREAK-GLASS CREDENTIAL
one offline Auth0 recovery code
              |
              v
recovery-only containment; no ordinary Admin command authority
replace key + revoke sessions/devices + audit/notify
```

The recovery code is an independent credential, but it is a bearer secret and not phishing-resistant. It is permitted only through a separate recovery-only Auth0 client/route whose completed `recovery-code` challenge is checked synchronously before token issuance. That route has no commerce audience, creates no ordinary Admin session, and can enter only the application recovery lock. The ordinary Admin client challenges only `webauthn-roaming`, so the recovery code is not a fallback there. Email, SMS, TOTP, password-only login, asynchronous logs, or help-desk assertion must not become an ordinary equivalent path.

## Day-1 policy

- Use the Auth0 WebAuthn roaming security-key factor, not Auth0 database-connection synced passkeys.
- Configure `User Verification: Required`; the selected FIDO2 key must require its PIN.
- Require that factor for every ordinary Admin login and every fresh high-risk step-up.
- Do not enable SMS, email, TOTP, or platform/synced passkeys as equivalent Admin factors.
- During the attended bootstrap, explicitly enroll `webauthn-roaming` and then explicitly enroll `recovery-code` through the documented sequenced custom-enrollment flow. Custom enrollment of the key does not automatically issue a recovery code.
- Keep the recovery code offline, physically separate, and unavailable to browsers, password managers, email, cloud notes, source control, or application storage.
- Use separate ordinary and recovery client contexts: ordinary requires only `webauthn-roaming`; recovery requires and synchronously verifies only `recovery-code`, returns no commerce authority, and fails closed on any missing/mismatched method or client signal.
- Treat recovery as a containment workflow, not a normal login.
- After any recovery-code use, use the Universal Login new-code screen to capture the displayed replacement once, retire the consumed code, and reseal the replacement offline before recovery can close.
- Keep `AdminDevice`, server sessions, capabilities, command authorization, step-up grants, and canonical audit owned by Blowin' Smoke.
- Deny when any mandatory identity, factor, device, session, freshness, or authorization state is missing, unknown, expired, revoked, unsupported, or unverified.

This is a design decision, not a claim that the configuration has been executed. Exact iPhone Safari, Mac Safari, FIDO2 PIN, factor forcing, recovery, event delivery, session revocation, and outage behavior remain mandatory proof items before a later pilot.

The Auth0 tenant/control plane is itself privileged: a tenant administrator can alter Actions, clients, factors, domains, and user MFA. A later proof must harden that owner account with phishing-resistant authentication, a separate offline recovery credential, minimized Management API grants, independent change notifications, and an attended recovery procedure. The selected $29 key is the application-user hardware cost; a second $29 control-plane key is an explicit procurement contingency if the proof cannot safely reuse the selected hardware across distinct relying parties. Neither key is purchased here.

## Package map

| Document | Purpose |
|---|---|
| [01 — Hard security and recovery requirements](01-hard-security-and-recovery-requirements.md) | Acceptance boundary, passkey taxonomy, selected credential policy, and application-owned controls |
| [02 — Auth0 evaluation](02-auth0-evaluation.md) | Current plan value, hard-requirement result, limitations, evidence, and Day-1 configuration |
| [03 — WorkOS AuthKit evaluation](03-workos-authkit-evaluation.md) | Free/custom-domain costs, passkey/session capabilities, and unresolved recovery/step-up gaps |
| [04 — Clerk evaluation](04-clerk-evaluation.md) | Required Pro cost, passkey/session capabilities, documentation conflict, and hard-gate result |
| [05 — Application-owned WebAuthn evaluation](05-application-owned-webauthn-evaluation.md) | Standards-backed feasibility, required architecture, maintenance burden, and rejection rationale |
| [06 — Attack, recovery, and outage matrix](06-attack-recovery-and-outage-matrix.md) | A01–A20, R01–R10, bounded-session outage rule, and safe behavior |
| [07 — Cost comparison](07-cost-comparison.md) | Actual one-owner provider, annual, hardware, stack, and optional future costs |
| [08 — Final authentication decision](08-final-authentication-decision.md) | Weighted decision, winner, loser rationale, future staff path, risks, and next proof gate |
| [Machine-readable registry](commerce-admin-auth-registry.json) | Structured decision, scoring, controls, costs, recovery, evidence states, and non-authorization |

## Evidence discipline

Every material provider claim is tied to a current official source and records what the source does and does not establish. A marketing label such as “passkey,” “MFA,” “free,” or “reverification” is not treated as proof of a specific factor policy, two-credential recovery, command-bound step-up, device approval, or provider exit.

Where official material conflicts or omits a required property, the result is `BLOCKED — EVIDENCE INSUFFICIENT`; inference is not converted into a capability.

## Governing result

| Item | Result |
|---|---|
| Authentication decision | **KEEP AUTH0** |
| Selected plan | **Auth0 Essentials — $35/month** |
| Selected ordinary credential | **One roaming FIDO2 security key, UV/PIN required** |
| Selected independent recovery credential | **One physically isolated Auth0 recovery code; recovery-only** |
| Selected one-time hardware | **One Yubico Security Key C NFC — $29 before tax/shipping** |
| Explicit control-plane hardware contingency | **One additional $29 key if proof requires dedicated tenant hardware** |
| Synced passkey as device approval | **PROHIBITED** |
| Application `AdminDevice` and session authority | **PRESERVED** |
| Auth0 monthly cost saved | **$0** |
| Absolute Day-1 stack floor | **Unchanged: $59–$75/month** |
| Recommended Day-1 stack | **Unchanged: $76–$120/month** |
| Production authentication | **NOT IMPLEMENTED** |
| Production implementation | **NOT AUTHORIZED** |

## Completion ledger

`PASS` means the research/decision requirement is addressed with its evidence boundary intact. It does not mean production execution has occurred. The delivery rows describe the required state of this package after its single delivery commit and post-push remote verification.

| Required item | Status | Evidence |
|---|---|---|
| Auth0 evaluated from current official evidence | PASS | 02 |
| WorkOS evaluated from current official evidence | PASS | 03 |
| Clerk evaluated from current official evidence | PASS | 04 |
| Application-owned WebAuthn evaluated | PASS | 05 |
| Synced/device-bound/roaming distinction evaluated | PASS | 01; 05 |
| Hardware security-key model evaluated | PASS | 01; 02; 05 |
| Phishing resistance and owner UV evaluated | PASS | 01–05 |
| R01–R10 recovery and all-device/session loss evaluated | PASS | 06 |
| Fresh step-up and session revocation evaluated | PASS — execution proof pending | 01; 02; 06 |
| Canonical approved-device compatibility preserved | PASS | 01; 06; 08 |
| A01–A20 attack matrix complete | PASS | 06; registry |
| Provider outage behavior complete | PASS | 06; registry |
| Export/exit evaluated | PASS | 02–05; 06 |
| Future staff migration evaluated | PASS | 08; registry |
| Exactly one winner selected | PASS — KEEP AUTH0 | 08; registry |
| Actual one-owner Day-1 cost calculated | PASS | 07; registry |
| COM-ADM-02A recurring cost update required | NO — recurring ranges unchanged | 07 |
| Production remains unauthorized | PASS | All documents; registry |
| Registry parses as valid JSON | PASS | Delivery validation |
| Single commit created | PASS | COM-ADM-02B delivery commit |
| Commit pushed directly to `origin/main` | PASS | Fast-forward remote ref update; no force push |
| Post-push `origin/main` equals resulting commit | PASS | Final remote commit and file verification |
