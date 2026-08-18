# COM-ADM-02B — WorkOS AuthKit Evaluation

## 1. Verdict

**DO NOT REPLACE AUTH0 WITH WORKOS AUTHKIT.**

AuthKit's $0 core price is real, and its user-verifying passkey, sessions, reauthentication, events, user management, and future multi-user capacity are credible. Current official evidence does not establish a roaming hardware-key policy, a second independent passkey, safe sole-owner high-assurance recovery, or passkey-specific reauthentication. Those are hard requirements, not enterprise embellishments.

## 2. Actual cost scenarios

| Scenario | Provider cost | Security/cost consequence |
|---|---:|---|
| AuthKit on a WorkOS-hosted domain | **$0/month; $0/year** | Technically possible, but passkeys bind to that domain and later custom-domain migration requires re-enrollment; still fails credential/recovery/step-up evidence gates |
| AuthKit with production custom domain | **$99/month; $1,188/year** | WorkOS documentation recommends custom domain before production/passkey enrollment; costs more than Auth0 and still does not close the hard gaps |

The custom domain is prudent, not represented as technically mandatory. Neither cost path changes the qualification result.

## 3. Hard-requirement evaluation

| Requirement | Result | Evidence boundary |
|---|---|---|
| Phishing-resistant ordinary login | **PASS for a UV passkey** | AuthKit passkeys use WebAuthn and require biometric/PIN user verification |
| Roaming hardware security key | **BLOCKED — EVIDENCE INSUFFICIENT** | Official AuthKit material does not establish roaming-key support, attachment control, or hardware-only enforcement |
| Two independent owner credentials | **FAIL / NOT ESTABLISHED** | Hosted UI does not allow adding another passkey after enrollment; no equivalent recovery credential is established |
| Fresh passkey-specific step-up | **CONDITIONAL / NOT ESTABLISHED** | `max_age` and `auth_time` provide freshness, but AuthKit chooses among available methods rather than proving that a passkey can be demanded |
| Secure sessions | **PASS as a building block** | Configurable lifetimes, refresh rotation, logout, session API; canonical application session still required |
| Approved-device model | **PASS only through application layer** | WorkOS “unrecognized device” signals do not replace `AdminDevice` admission |
| Recovery | **FAIL as a complete high-assurance design** | Passkey-only can lock out; keeping password/email reset creates a weaker alternate path; no official recovery-code mechanism found |
| Credential/security audit | **PARTIAL** | Authentication and session events exist; passkey enrollment/removal events were not established |
| Export/exit | **PARTIAL** | User records can be listed/exported; portable passkey credentials and a documented migration-out path are not established |
| Future staff | **PASS structurally** | Individual users/sessions/RBAC exist; application roles/capabilities remain canonical |

## 4. Recovery dilemma

AuthKit presents two unacceptable one-owner choices under current evidence:

1. **Disable password:** a UV passkey is strong for login, but the hosted interface does not establish a second passkey or safe self-service path when the sole passkey is lost.
2. **Keep password/email reset:** password reset can revoke sessions, but a compromised email account becomes a recovery route and passkey-specific reauthentication is not assured. This weakens the desired phishing-resistant boundary.

WorkOS cannot be credited with an unverified hardware key, second credential, recovery code, or exact-factor step-up simply because the product advertises passkeys and MFA.

## 5. Sessions and device admission

AuthKit supports configurable absolute lifetime, inactivity timeout, access-token duration, refresh-token rotation, logout, session listing, and individual revocation. These are useful provider controls, but the same application rule applies:

- provider identity/session is evidence, not commerce authorization;
- application `AdminDevice` remains canonical;
- unknown or revoked application state denies even if WorkOS accepts the user;
- high-risk commerce commands require a separate one-use command-bound step-up grant;
- provider events must be ingested into durable canonical audit.

## 6. Evidence register

**Access date for every source:** 2026-08-17

| Source | URL | Claim established | Claim not established |
|---|---|---|---|
| WorkOS pricing | https://workos.com/pricing | AuthKit core is free through one million users; custom domain is $99/month; AuthKit includes MFA/RBAC | Hard-requirement equivalence or final invoice |
| AuthKit passkeys | https://workos.com/docs/authkit/passkeys | WebAuthn passkeys require UV and can satisfy both factors; custom domain recommended before production; hosted UI only; current UI cannot view, rename, add another, or remove passkeys | Roaming hardware-key support, second credential, API enrollment, device-bound enforcement, recovery |
| Custom domains | https://workos.com/docs/custom-domains | Custom domains are paid; a WorkOS domain can otherwise be used | That custom domain is technically mandatory |
| AuthKit MFA | https://workos.com/docs/authkit/mfa | Documented additional MFA factor is TOTP; UV passkey can satisfy both factors | FIDO security key as MFA factor, recovery codes, phishing-resistant fallback |
| Reauthentication | https://workos.com/docs/authkit/reauthentication | `auth_time`, `max_age`, and `maxAge: 0` support fresh authentication | Ability to require a passkey rather than password/TOTP/SSO |
| Sessions | https://workos.com/docs/authkit/sessions | Session lifetimes, refresh rotation guidance, logout, secure server-cookie guidance | Business authorization or `AdminDevice` status |
| Session API | https://workos.com/docs/reference/authkit/session | Active sessions can be listed and individually revoked | Credential revocation or command authorization |
| Password reset | https://workos.com/docs/reference/authkit/password-reset | Email-mediated reset exists and revokes active WorkOS sessions | Phishing-resistant recovery |
| Email/password configuration | https://workos.com/docs/authkit/email-password | Password authentication can be disabled globally | Safe recovery after loss of sole passkey |
| Events | https://workos.com/docs/events | Successful/failed passkey authentication, password reset, session creation, and session revocation events exist | Passkey enrollment/removal events; durable canonical retention |
| Radar | https://workos.com/docs/authkit/radar | Hosted flow can apply bot, brute-force, impossible-travel, stale-account, and unrecognized-device controls | Hardware integrity or replacement for approved-device admission |
| User API | https://workos.com/docs/reference/authkit/user | Users can be listed programmatically | Passkey export or complete provider-exit procedure |
| Migration guide | https://workos.com/docs/migrate/other-services | Users/password hashes can be imported into AuthKit | Migration out or portable passkey credentials |

## 7. Why WorkOS loses

The $0 path saves $35/month but transfers essential uncertainty to recovery and factor policy. The custom-domain path costs $64/month more than Auth0 while preserving the same gaps. WorkOS receives **61/100** using the recommended custom-domain production scenario and is rejected for this Day-1 owner profile. Reevaluate only if official capability and execution proof establish multiple independent credentials, exact roaming/passkey step-up, complete credential-change events, and a non-phishable sole-owner recovery path.
