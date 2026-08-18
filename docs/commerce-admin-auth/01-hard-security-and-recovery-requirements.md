# COM-ADM-02B — Hard Security and Recovery Requirements

## 1. Acceptance boundary

A candidate qualifies only if the complete system—provider plus the canonical Blowin' Smoke application layer—can meet every hard property. Weighted scoring ranks qualifying or near-qualifying options; it cannot waive a hard requirement.

| Requirement | Mandatory property | Failure examples |
|---|---|---|
| Phishing-resistant authentication | Origin/RP-bound WebAuthn/FIDO must participate in every ordinary Admin login | Password-only, email-link-only, SMS-only, or TOTP-only |
| User verification | Authenticator PIN, biometric, device PIN, or equivalent FIDO UV must be required | Presence/touch without verified user |
| Independent recovery | A physically separate credential must survive loss of the daily credential | Recovery available only on the lost device |
| Secure session | Opaque server session, protected cookie, rotation, bounded lifetime, CSRF defense, revocation, logout | Long-lived unrevocable bearer token as command authority |
| Fresh step-up | High-risk command requires fresh phishing-resistant UV and a one-use, command-bound grant | Stale login, weak factor, or generic “recent MFA” flag |
| Approved device | Application can register, suspend, revoke, disable, and expire each browser/device state | Provider identity automatically means approved endpoint |
| Fail closed | Unknown, invalid, expired, revoked, unverified, or unsupported state is denied | Emergency password bypass or user-agent trust |
| Audit | Authentication, credential, recovery, device, session, step-up, and setting changes reach canonical audit | Short provider logs treated as business record |

Authentication proves control of an authentication credential. Blowin' Smoke still decides whether the actor is active, the endpoint/session is approved, the capability and object scope exist, step-up is current, and the command is permitted.

## 2. Credential taxonomy

| Credential class | Security property | Device-admission consequence | Day-1 policy |
|---|---|---|---|
| Synced passkey | Phishing-resistant public-key credential replicated through an ecosystem account | May appear on additional ecosystem devices; does not prove a specific browser/device was approved | **Not an equivalent Admin factor on Day 1** |
| Device-bound platform credential | Non-synced credential held by a phone/computer authenticator | Bound to an authenticator, but still not the application `AdminDevice` record | Deferred; not the selected recovery credential |
| Roaming FIDO2 security key | Credential remains on a portable hardware authenticator and works across supported endpoints | The same key can be carried to an unknown endpoint; separate `AdminDevice` admission remains mandatory | **Selected ordinary factor** |
| Recovery code | High-entropy one-time bearer secret | Does not prove a device or provide phishing resistance | **Physically isolated break glass only** |

WebAuthn backup-eligibility/backup-state flags describe credential backup behavior; they do not identify or approve an endpoint. A security-key hint or authenticator attachment preference is also not, by itself, cryptographic proof of a particular hardware model.

## 3. Selected owner credential policy

1. The owner has one individual Auth0 identity. Sharing is prohibited.
2. The ordinary flow requires the Auth0 roaming WebAuthn factor with `User Verification: Required` and a FIDO2 PIN.
3. Password knowledge alone never creates an application session or authorizes a command.
4. SMS, email, TOTP, and synced/platform passkeys are not enrolled as ordinary equivalent Admin factors.
5. One Auth0 recovery code is printed or recorded in durable offline form, sealed, and stored physically apart from the security key and Admin devices.
6. The ordinary Auth0 client challenges only `webauthn-roaming`, with no recovery-code alternative. If that exact enrolled factor is unavailable, the ordinary login transaction fails.
7. A separate recovery-only Auth0 client/route challenges only `recovery-code`. A subsequent Action checks the completed factor in `event.authentication.methods`, checks the recovery client ID, and fails closed on any absence or mismatch.
8. The recovery client token/audience is recovery-only. It cannot call the commerce API, cannot create an ordinary Admin session, and can enter only `RECOVERY_LOCKED`.
9. Recovery completes only after old authenticator/session/device containment, replacement key enrollment, independent notice, and canonical audit. The provider's authenticator list/delete mechanisms and WebAuthn enrollment flow are proof items, not assumed execution results.
10. Successful recovery displays a replacement code through Auth0's Universal Login new-code screen. The newly displayed code must be captured once, the consumed code retired, and the replacement sealed offline before recovery closes.
11. The application never stores the provider recovery code. Asynchronous provider logs are audit/reconciliation evidence only and are never the admission gate.

The specific Auth0 support evidence available on 2026-08-17 says an application user can currently enroll only one YubiKey for the WebAuthn security-key factor. Therefore COM-ADM-02B does **not** claim two enrolled Auth0 hardware keys. The preferred two-key model remains technically possible under application-owned WebAuthn, but its maintenance and R10 recovery burden make it disproportionate for Day 1.

## 4. Session and command boundary

The selected provider does not own the canonical Admin session.

```text
Auth0 callback evidence
  -> exact issuer/audience/signature/expiry/factor/freshness validation
  -> active canonical AdminActor
  -> ACTIVE AdminDevice
  -> rotate/create opaque server session
  -> Secure + HttpOnly + appropriate SameSite cookie
  -> CSRF and Origin/Fetch-Metadata validation
  -> capability/object/version checks per command
```

Mandatory session behavior:

- bounded idle and absolute lifetimes;
- identifier rotation after authentication, device admission, recovery, privilege/security change, and step-up where appropriate;
- server-side revocation by actor, device, credential/recovery event, and individual session;
- explicit logout and “revoke all” control;
- no database credential, identity-provider management credential, or durable API bearer exposed to the browser;
- no high-risk command from a session whose factor assurance or step-up evidence is missing;
- canonical audit written atomically with material authorization state changes.

## 5. Fresh step-up

A high-risk command begins a new Auth0 authorization transaction with reauthentication freshness and an Action policy that requires `webauthn-roaming`. The server validates `auth_time` and the returned factor evidence, then issues a short-lived, one-use grant bound to:

- actor;
- active AdminDevice;
- current server session;
- exact command type;
- target object/scope;
- material input digest/version;
- expiry and nonce.

Replay, command substitution, object substitution, stale input, a different session/device, a weaker factor, or provider unavailability must fail. A callback after a password, email, SMS, TOTP, or unspecified factor is not an acceptable substitute.

Exact factor forcing and returned evidence require execution proof before pilot; documentation is not a production PASS.

## 6. Recovery assurance rule

Recovery is deliberately more restrictive than login.

- The recovery code is not an ordinary login factor and is never accepted directly by the commerce Admin. Ordinary login always requests only the roaming key.
- Auth0 documents `recovery-code` as an explicit MFA challenge type; a following Action can read the completed challenge type, the login event exposes the client ID, and an Action can deny access or set a narrowly scoped claim. The recovery client uses those synchronous controls to produce only recovery authority.
- A missing/mismatched client ID, method type, audience, recovery state, or replacement-factor result denies before any ordinary session or commerce payload.
- Provider MFA APIs document listing and deleting authenticators; WebAuthn re-enrollment is performed only inside the recovery flow and must be proved on the selected plan/configuration.
- Until a replacement UV-required roaming key is enrolled and reviewed, the application allows only the minimum recovery workflow and returns no commerce data beyond the recovery state.
- No email, SMS, caller assertion, database edit, or provider-support assertion alone restores commerce authority.
- The owner must test key loss and recovery before pilot. If the completed recovery factor, client, audience, replacement-factor result, or recovery state cannot be checked synchronously before ordinary session/payload admission, the configuration fails the gate.
- Provider logs provide durable evidence after ingestion but cannot substitute for the synchronous factor/client/audience gate.
- After successful recovery authentication, Auth0 documents a Universal Login screen that displays a new recovery code and asks the user to save it. The runbook must require one-time capture from that screen, offline resealing, inventory update, and confirmation that the old code no longer works; no replacement code may enter application storage or logs.
- Loss of the key **and** offline recovery code is `BLOCKED — NO SELF-SERVICE RECOVERY`; provider/tenant control and an attended, separately approved identity-proofing runbook are required. No emergency weak-factor path is created.

## 7. Bootstrap and credential-change exception

Initial bootstrap and lost-key replacement cannot require a key that does not yet exist. They are the only controlled exceptions to “fresh existing key required for enrollment.”

- Initial bootstrap is attended, one-time, and pre-authorized in canonical state. It must enable the recovery-code factor, enroll the first roaming key, and then explicitly enroll `recovery-code` in the documented sequenced custom-enrollment flow; custom enrollment of another factor does not automatically issue the code. It returns no commerce payload until the key/PIN, sealed code, first `AdminDevice`, notification, and audit are complete. The bootstrap authority is then irreversibly disabled.
- Recovery replacement is allowed only inside the separately authenticated recovery client and `RECOVERY_LOCKED`; it can remove the lost authenticator and enroll a replacement but cannot perform commerce commands.
- Every ordinary add/remove/change after bootstrap still requires an active device/session and fresh existing roaming-key UV.
- A missing bootstrap/recovery state, unexpected factor, reused ceremony, unsealed replacement code, or incomplete key test denies.

## 8. Auth0 control plane

The Auth0 tenant is a privileged security surface, not an invisible SaaS detail. A tenant administrator can change clients, domains, Actions, MFA policy, authentication methods, and user MFA state.

Before pilot, the owner tenant account must use phishing-resistant authentication where supported; its recovery credential must be separately sealed; Management API clients must be server-only, least-privilege, rotated, and audited; Action/client/domain/factor changes must generate independent notice and configuration evidence; and Auth0 Support recovery must never directly grant commerce authority. Auth0 officially documents Dashboard-user MFA enrollment, WebAuthn factors, recovery codes, and an attended support reset when all authenticators and the code are lost. Those sources do not establish the exact selected control-plane factor topology, same-key cross-RP use, or a completed recovery proof, so those items remain open gates.

The selected application hardware cost is one $29 key. Reserve a separate $29 control-plane key as a visible contingency if the proof determines that safely reusing the selected physical authenticator across the application and tenant-control RPs is unacceptable or unsupported.

## 9. Provider outage rule

During an Auth0 outage:

- no new authentication;
- no mandatory step-up;
- no credential enrollment/removal or recovery;
- no fallback to password-only, local emergency account, email, SMS, or TOTP;
- existing application sessions may continue only until their already-issued bounded idle/absolute lifetime and only while local actor, device, session, capability, and resource state remain valid;
- high-risk commands requiring fresh step-up are denied;
- inventory integrity and authorization do not change merely because the provider is unavailable.

## 10. Proof status

This package establishes a documented candidate configuration, not executed production assurance. A later authorized proof must exercise iPhone Safari and Mac Safari; NFC/USB-C key use; FIDO2 PIN; exact factor forcing; recovery containment; event ingestion; all session/device revocation; CSRF; cookie replay; provider outage; accessibility; and migration/exit. Until then, the configuration is **DECISION-COMPLETE / EXECUTION-PROOF-PENDING**.
