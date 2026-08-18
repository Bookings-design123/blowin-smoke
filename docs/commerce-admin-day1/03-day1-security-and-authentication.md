# COM-ADM-02A — Day-1 Security and Authentication

**Decision:** Use Auth0 Free; preserve application-owned security controls; defer paid Auth0 and enterprise endpoint tooling
**Authentication:** Phishing-resistant passkey/WebAuthn authentication with two independent owner credentials/recovery keys
**Approved-device claim:** Browser continuity and explicit owner approval, not hardware integrity
**Production configuration:** Not authorized

**COM-ADM-02B decision:** Auth0 Free is the Day-1 identity provider at $0 recurring cost. Auth0 Essentials is deferred until a concrete paid-feature requirement appears. See `docs/commerce-admin-auth/`.

## 1. Decision

**Auth0 Free is `DAY_1_REQUIRED` for the initial one-owner profile.** Its passkeys/WebAuthn capability supplies the managed authentication evidence required at this stage. Paid Auth0 MFA, organizations, centralized log streaming, and support are not Day-1 requirements.

The cost reduction occurs in device tooling:

- retain a minimal application-owned `AdminDevice` registry as `DAY_1_SIMPLIFY`;
- defer Cloudflare Access/WARP;
- defer native iPhone, App Attest, Apple Developer Program, and MDM;
- use one server-owned browser session and explicit device enrollment on iPhone and Mac/desktop;
- state honestly that this proves registered browser continuity, not an uncompromised device.

## 2. Governing authentication controls

Selecting the provider does not satisfy Day 1 without these controls:

1. Disable public Admin signup and establish the one owner through an attended bootstrap.
2. Require phishing-resistant passkey/WebAuthn authentication for Admin admission.
3. Maintain two independent owner credentials/recovery keys, stored separately.
4. Do not permit a lower-assurance fallback to authorize ordinary Admin access.
5. Require server-verified fresh authentication before every high-risk operation, then issue only a short-lived, one-use, command-bound application grant.
6. Use the provider subject only as an alias to one canonical `AdminActor`; provider roles or metadata never authorize a commerce operation.
7. Keep `AdminDevice`, authorization, application sessions, device/session revocation, canonical audit, and command controls inside Blowin' Smoke.
8. Deny when mandatory identity, credential, freshness, device, session, authorization, or revocation state is missing, unknown, stale, revoked, or unsupported.
9. Do not depend on paid Auth0 MFA, organizations, centralized log streaming, or support for Day-1 correctness.

## 3. Minimal application-owned `AdminDevice`

The registry is required because identity-provider authentication alone does not establish that the current browser is approved. It is deliberately smaller than COM-ADM-02's layered endpoint architecture.

Minimum record:

- stable `admin_device_id`, `admin_actor_id`, and opaque browser-registration ID;
- platform/surface and owner-readable label that is never proof;
- `PENDING`, `ACTIVE`, `SUSPENDED`, or `REVOKED` status;
- hash/version of a high-entropy registration/session secret;
- bound application-session IDs or session generation;
- authentication credential references and assurance class where available;
- creation, approval, last-seen, review, suspension, and revocation times;
- approval/revocation authority, reason, incident, and immutable audit references.

Do not store raw registration secrets, access/refresh tokens, private keys, recovery codes, or reusable WebAuthn challenges in this record.

### Enrollment

1. The iPhone browser profile and Mac/desktop browser profile enroll separately.
2. A successful Auth0 login from an unknown browser creates only `PENDING` state and receives no Admin data.
3. Normal activation requires an existing `ACTIVE` device, server-verified fresh passkey/WebAuthn authentication, exact pending-device preview, owner confirmation, and canonical audit.
4. A requesting endpoint cannot approve itself.
5. Initial-device activation uses an attended bootstrap mechanism that is disabled immediately afterward.
6. All-devices-lost recovery creates a new pending endpoint; apparent device name, cookie restoration, synced passkey, email access, or phone number never silently restores `ACTIVE`.

### Admission

Every protected request rechecks:

```text
valid Auth0 issuer / audience / signature / expiry
+ active owner AdminActor
+ required authentication method and recency
+ active application session generation
+ exact ACTIVE AdminDevice browser binding
+ exact capability / object / division / location / channel scope
+ current resource state and expected version
+ fresh command-bound authentication grant when required
------------------------------------------------------------
= ALLOW | DENY | FRESH_AUTH_REQUIRED | APPROVAL_REQUIRED
```

Unknown, missing, stale, revoked, unsupported, or inconsistent mandatory state denies. The UI hiding an action is not authorization.

## 4. Session and command security

- Use a backend-for-frontend session with an opaque identifier; keep provider refresh material server-side.
- Put only the opaque session/registration value in a cookie with `__Host-`, `Secure`, `HttpOnly`, `SameSite=Strict`, and `Path=/` controls.
- Store only a hash server-side. Rotate after sign-in, fresh authentication, recovery, privilege/device changes, and suspicious state.
- Keep access tokens short-lived. Auth0 refresh-grant revocation does not revoke an already-issued access token, so a bearer token alone never authorizes a canonical command.
- Re-read actor, device, session generation, capability, and object state for each protected operation.
- Bind a high-risk one-use grant to actor, device, capability, command type, target/version, proposed diff digest, nonce, issue/expiry, and server-verified fresh authentication evidence.
- Revoke application sessions immediately on device loss, key loss, owner security action, or incident; also revoke corresponding provider grants where identifiable.
- CSRF, origin, content-type, rate, replay, idempotency, and stale-version defenses remain required at the server boundary.

High-risk actions include inventory correction, wholesale price/visibility, COA replacement, reservation override, permission/security configuration, recovery, bulk export, and financial correction.

## 5. Recovery and availability

The one-owner design must not turn strong authentication into an unplanned lockout path.

- Maintain two independent owner credentials/recovery keys and store them separately.
- Loss of one credential invokes governed recovery with the surviving credential, revocation of lost credential/device/session state, independent notice, and canonical audit.
- Loss of all credentials remains a fail-closed recovery case requiring an attended proof/runbook decision; no email, SMS, password-only, or help-desk shortcut silently grants Admin authority.
- Send an independent AWS SES notification to a preverified owner security destination for new factor, new device, recovery, session revocation, and security-policy change.
- Define a cooling-off period and evidence/authority requirements for all-credentials/devices-lost recovery.
- Globally revoke old sessions/devices before replacement activation.
- Rehearse one-credential loss, browser loss, iPhone loss, and all-credentials/devices-lost procedures before pilot.
- Auth0 outage blocks new login and mandatory fresh authentication. A still-valid application session may continue only within its explicit lifetime and unchanged actor/device state; no high-risk command bypass is permitted.

Exact lifetimes, cooling-off duration, SES destination/acceptance policy, and recovery authority remain COM-ADM-03 proof decisions.

### Security-notification delivery

AWS SES is `DAY_1_SIMPLIFY` inside the already retained AWS provider boundary. The canonical command writes a minimized notification intent to the transactional outbox; failure to persist a notification required by policy blocks the security command. A worker sends only event category, time, pseudonymous device/session reference, safe recovery/incident route, and owner-approved contact information—never credentials, recovery codes, tokens, private wholesale data, or the sensitive command payload.

Delivery acceptance, bounce, complaint, suppression, retry, and terminal failure must be observable and audited. Enrollment/recovery/security-configuration proof must establish which operations also require confirmed provider acceptance before completion and which safely commit with durable urgent retry; no send failure becomes silent success. The preverified destination must be separate from the Admin session and tested, but email delivery is not represented as identity proof.

Current SES à-la-carte pricing lists no minimum and $0.10 per 1,000 outbound messages; current plan choices and account/sandbox/identity restrictions must be reverified before procurement. This low-volume traffic remains inside the AWS cost allowance rather than adding a sixth provider.

## 6. Deferred endpoint controls

| Control | Status | Trigger |
|---|---|---|
| Cloudflare Access/WARP | `DEFER_UNTIL_TRIGGER` | Second Admin actor, staff/BYOD/remote growth, endpoint-posture mandate, insurer/compliance requirement, or demonstrated browser-registration weakness |
| Native App Attest | `DEFER_UNTIL_TRIGGER` | Native iPhone Admin activation or approved native app-instance-attestation need |
| Apple Developer Program | `DEFER_UNTIL_TRIGGER` | Native Apple signing/device-test/distribution work begins |
| MDM / Managed Device Attestation | `DEFER_UNTIL_TRIGGER` | Managed staff fleet, enforced configuration/remote erase, or explicit compliance requirement |

Cloudflare WARP, MDM, App Attest, a passkey, and an `AdminDevice` row are all partial signals. None is represented as perfect endpoint integrity.

## 7. Decision boundary

This document records the selected Day-1 tier and retained application controls. It does not claim that Auth0 or Blowin' Smoke has been configured, tested, procured, or approved for production. A later authorized gate must still prove enrollment, fresh authentication, revocation, replay resistance, outage handling, accessibility, and recovery before any pilot decision.
