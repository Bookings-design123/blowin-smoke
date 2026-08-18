# COM-ADM-02A — Day-1 Security and Authentication

**Decision:** Keep Auth0 Essentials; simplify endpoint admission; defer enterprise endpoint tooling
**Authentication:** Password plus user-verifying WebAuthn roaming security key
**Approved-device claim:** Browser continuity and explicit owner approval, not hardware integrity
**Production configuration:** Not authorized

## 1. Decision

**Auth0 Essentials remains `DAY_1_REQUIRED` at its current $35/month list price.** For this owner-only Admin, it is the lowest-risk reviewed option with documented Pro MFA, WebAuthn roaming security keys, factor-specific challenge behavior, custom domain, recovery codes, log stream, and supported step-up building blocks.

The cost reduction occurs in device tooling:

- retain a minimal application-owned `AdminDevice` registry as `DAY_1_SIMPLIFY`;
- defer Cloudflare Access/WARP;
- defer native iPhone, App Attest, Apple Developer Program, and MDM;
- use one server-owned browser session and explicit device enrollment on iPhone and Mac/desktop;
- state honestly that this proves registered browser continuity, not an uncompromised device.

## 2. Identity candidate decision

| Candidate | Current evidence | Material limitation | Day-1 decision |
|---|---|---|---|
| Auth0 Free | $0; up to 25,000 MAU; custom domain and passkeys; limited Actions/logs | No Pro MFA. Auth0 documents that password remains configured as passkey backup; current evidence does not establish plan-native strict password denial plus passkey-specific high-risk step-up | Not selected |
| **Auth0 Essentials** | $35/month; 500 MAU; custom domain; Pro MFA; one log stream; five-day provider logs; standard support | Provider log is not canonical audit; identity is not authorization; configured behavior still needs execution proof | **`DAY_1_REQUIRED`** |
| WorkOS AuthKit | Core $0 through 1 million users; passkeys, session revocation, `auth_time`, and `max_age` reauthentication | Official guidance says configure a custom domain before production passkeys; that domain is $99/month. Passkeys are hosted-UI-only and reauthentication chooses the method; complete credential/recovery exit is not established | Viable alternative, no Day-1 cost advantage |
| Clerk Pro | $20/month annual or $25 monthly; passkeys, MFA, sessions, device/session visibility | Documented reverification excludes passkeys and may downgrade requested assurance when a stronger factor is unavailable | Conditional alternative, not selected |
| Application-owned WebAuthn | No identity subscription | Blowin' Smoke would own challenge validation, authenticator/recovery/session lifecycle, abuse controls, migration, monitoring, and incident response | `REMOVE_FROM_RECOMMENDED_PATH` |

## 3. Required Auth0 policy

Selecting the plan without this policy does not satisfy Day 1:

1. Disable public Admin signup.
2. Establish the one owner through an attended bootstrap.
3. Configure one Blowin' Smoke authentication custom domain before WebAuthn enrollment.
4. Require password plus a `webauthn-roaming` challenge for Admin authentication.
5. Set MFA to always required; do not use adaptive-only admission for the owner Admin.
6. Enroll two FIDO2 roaming security keys: one daily key and one separately stored recovery key.
7. Require security-key user verification/PIN.
8. Do not enable SMS or email as an assurance-equivalent fallback.
9. Keep provider recovery material sealed offline and separate from endpoints and both keys.
10. For a high-risk command, request the exact roaming-key factor rather than `any`, require fresh authentication, and issue an application command grant only after successful verification.
11. Use the provider subject only as an alias to one canonical `AdminActor`; provider roles or metadata never authorize a commerce operation.
12. Stream/minimize provider security events, but retain canonical business audit in PostgreSQL.

## 4. Minimal application-owned `AdminDevice`

The registry is required because a roaming key can be inserted into an unapproved computer and a synced passkey may appear on multiple devices. It is deliberately smaller than COM-ADM-02's layered endpoint architecture.

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
3. Normal activation requires an existing `ACTIVE` device, fresh roaming-key step-up, exact pending-device preview, owner confirmation, and canonical audit.
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
+ fresh command-bound step-up grant when required
------------------------------------------------------------
= ALLOW | DENY | STEP_UP_REQUIRED | APPROVAL_REQUIRED
```

Unknown, missing, stale, revoked, unsupported, or inconsistent mandatory state denies. The UI hiding an action is not authorization.

## 5. Session and command security

- Use a backend-for-frontend session with an opaque identifier; keep provider refresh material server-side.
- Put only the opaque session/registration value in a cookie with `__Host-`, `Secure`, `HttpOnly`, `SameSite=Strict`, and `Path=/` controls.
- Store only a hash server-side. Rotate after sign-in, step-up, recovery, privilege/device changes, and suspicious state.
- Keep access tokens short-lived. Auth0 refresh-grant revocation does not revoke an already-issued access token, so a bearer token alone never authorizes a canonical command.
- Re-read actor, device, session generation, capability, and object state for each protected operation.
- Bind a high-risk one-use grant to actor, device, capability, command type, target/version, proposed diff digest, nonce, issue/expiry, and successful authentication evidence.
- Revoke application sessions immediately on device loss, key loss, owner security action, or incident; also revoke corresponding provider grants where identifiable.
- CSRF, origin, content-type, rate, replay, idempotency, and stale-version defenses remain required at the server boundary.

High-risk actions include inventory correction, wholesale price/visibility, COA replacement, reservation override, permission/security configuration, recovery, bulk export, and financial correction.

## 6. Recovery and availability

The one-owner design must not turn strong MFA into an unplanned lockout path.

- Maintain two independently stored FIDO2 keys.
- Keep recovery codes offline, inventoried, and sealed.
- Send an independent AWS SES notification to a preverified owner security destination for new factor, new device, recovery, session revocation, and security-policy change.
- Define a cooling-off period and evidence/authority requirements for all-devices-lost recovery.
- Globally revoke old sessions/devices before replacement activation.
- Rehearse the lost daily key, lost browser, lost iPhone, and all-devices-lost procedures before pilot.
- Auth0 outage blocks new login and mandatory step-up. A still-valid application session may continue only within its explicit lifetime and unchanged actor/device state; no high-risk command bypass is permitted.

Exact lifetimes, cooling-off duration, SES destination/acceptance policy, and recovery authority remain COM-ADM-03 proof decisions.

### Security-notification delivery

AWS SES is `DAY_1_SIMPLIFY` inside the already retained AWS provider boundary. The canonical command writes a minimized notification intent to the transactional outbox; failure to persist a notification required by policy blocks the security command. A worker sends only event category, time, pseudonymous device/session reference, safe recovery/incident route, and owner-approved contact information—never credentials, recovery codes, tokens, private wholesale data, or the sensitive command payload.

Delivery acceptance, bounce, complaint, suppression, retry, and terminal failure must be observable and audited. Enrollment/recovery/security-configuration proof must establish which operations also require confirmed provider acceptance before completion and which safely commit with durable urgent retry; no send failure becomes silent success. The preverified destination must be separate from the Admin session and tested, but email delivery is not represented as identity proof.

Current SES à-la-carte pricing lists no minimum and $0.10 per 1,000 outbound messages; current plan choices and account/sandbox/identity restrictions must be reverified before procurement. This low-volume traffic remains inside the AWS cost allowance rather than adding a sixth provider.

## 7. Deferred endpoint controls

| Control | Status | Trigger |
|---|---|---|
| Cloudflare Access/WARP | `DEFER_UNTIL_TRIGGER` | Second Admin actor, staff/BYOD/remote growth, endpoint-posture mandate, insurer/compliance requirement, or demonstrated browser-registration weakness |
| Native App Attest | `DEFER_UNTIL_TRIGGER` | Native iPhone Admin activation or approved native app-instance-attestation need |
| Apple Developer Program | `DEFER_UNTIL_TRIGGER` | Native Apple signing/device-test/distribution work begins |
| MDM / Managed Device Attestation | `DEFER_UNTIL_TRIGGER` | Managed staff fleet, enforced configuration/remote erase, or explicit compliance requirement |

Cloudflare WARP, MDM, App Attest, a passkey, and an `AdminDevice` row are all partial signals. None is represented as perfect endpoint integrity.

## 8. Security evidence register

All sources were accessed 2026-08-17.

| Source | URL | What it establishes | What it does not establish |
|---|---|---|---|
| Auth0 pricing | https://auth0.com/pricing?pm=true | Free/Essentials prices and limits; custom domain; Pro MFA; log/support distinctions | Configured Blowin' Smoke behavior, production fitness, or future price |
| Auth0 passkey policy | https://auth0.com/docs/authenticate/database-connections/passkeys/configure-passkey-policy | Passkey policy and password backup behavior | Strict passkey-only Admin assurance on Free |
| Auth0 MFA factors | https://auth0.com/docs/secure/multi-factor-authentication/multi-factor-authentication-factors | WebAuthn roaming/platform factors and recovery codes | Owner enrollment or application authorization |
| Auth0 step-up | https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication | Scopes, Actions, and selected stronger-authentication challenge mechanisms | Successful commerce command or complete fail-closed configuration |
| Auth0 reauthentication | https://auth0.com/docs/authenticate/login/max-age-reauthentication | `max_age` and `auth_time` freshness behavior | Factor assurance unless separately enforced |
| Auth0 refresh revocation | https://auth0.com/docs/secure/tokens/refresh-tokens/revoke-refresh-tokens | Refresh grant/token revocation and consistency limits | Revocation of already-issued access tokens |
| WorkOS pricing | https://workos.com/pricing | $0 AuthKit core and $99/month custom domain | Equivalent factor-specific Day-1 assurance or credential exit |
| WorkOS passkeys | https://workos.com/docs/authkit/passkeys/passkey-configuration/multi-factor-auth | Hosted-UI passkeys, custom-domain guidance, and passkeys satisfying MFA | Passkey-specific reauthentication or recovery/exit completeness |
| WorkOS sessions / reauthentication | https://workos.com/docs/authkit/sessions and https://workos.com/docs/authkit/reauthentication | Session configuration/revocation, `auth_time`, and `max_age` | Required passkey selection during reauthentication |
| Clerk pricing and auth strategies | https://clerk.com/pricing and https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options | Current Pro price and passkey/MFA/session capabilities | Passkey-based high-risk reverification |
| Clerk reverification | https://clerk.com/docs/guides/secure/reverification | Passkey exclusion and documented downgrade behavior | A fail-closed custom replacement |
| NIST SP 800-63B-4 | https://pages.nist.gov/800-63-4/sp800-63b/authenticators/ | WebAuthn phishing resistance and OTP limitations | Provider configuration or endpoint integrity |
| WebAuthn Level 3 | https://www.w3.org/TR/webauthn-3/ | Credential backup flags and recovery/multiple-credential considerations | That a browser or OS is uncompromised |
| OWASP Session Management | https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html | Secure session/cookie design guidance | Execution correctness or device identity |
| Amazon SES pricing | https://aws.amazon.com/ses/pricing/ | Current plan/à-la-carte message rates and no-minimum option | Deliverability, configured identity, actual bill, or successful security notice |
| Amazon SES sending | https://docs.aws.amazon.com/ses/latest/dg/send-email.html | Supported outbound sending setup and verified-identity boundary | Owner receipt, recovery authority, or application correctness |

Documentation supports the selection; it does not constitute a configured-client proof. COM-ADM-03 must execute enrollment, step-up, revocation, replay, outage, and recovery tests before any pilot decision.
