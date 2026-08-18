# COM-ADM-02B — Clerk Evaluation

## 1. Verdict

**DO NOT REPLACE AUTH0 WITH CLERK AT THIS GATE.**

Clerk Pro is materially cheaper and may eventually satisfy the design through its newly documented passkey session-verification API plus application command binding. It is not an evidence-complete replacement today. Current official Clerk documentation conflicts on whether passkeys can be required for production reverification, hardware-key-only enrollment cannot be enforced from the established evidence, all-key-loss recovery is unresolved, and passkey portability is unverified.

The correct classification is **CONDITIONAL — BLOCKED BY CONFLICTING OFFICIAL EVIDENCE AND EXECUTION PROOF**, not a claim that Clerk lacks all relevant capability.

## 2. Required plan and actual cost

| Plan | Price | Result for this requirement |
|---|---:|---|
| Hobby | $0 | **Rejected:** production passkeys, MFA, and custom session lifetime are excluded |
| Pro month-to-month | **$25/month; $300/year** | Required plan; $10/month cheaper than Auth0 |
| Pro annual | **$20/month effective; $240/year** | Required plan with annual commitment; $15/month effective savings |

No paid add-on is established for one owner and one production domain. Two $29 reference security keys would add $58 once if Clerk were selected and exact target compatibility proved.

## 3. Hard-requirement evaluation

| Requirement | Result | Evidence boundary |
|---|---|---|
| Phishing-resistant ordinary login | **CONDITIONAL / BLOCKED — EVIDENCE INSUFFICIENT** | Passkeys use PIN/biometric UV, but initial signup needs another strategy and current official evidence does not establish removal of the bootstrapped owner's existing password route |
| Two independent credentials | **OPERATIONALLY POSSIBLE; POLICY NOT ESTABLISHED** | Users can create/list/rename/delete multiple passkeys, but official evidence does not enforce two roaming keys or prevent deletion of the last key |
| Hardware-key-only policy | **BLOCKED — EVIDENCE INSUFFICIENT** | Discoverable passkeys include hardware and password-manager/synced credentials; attestation or attachment enforcement is not established |
| Fresh passkey-specific step-up | **BLOCKED — CONFLICTING OFFICIAL EVIDENCE** | New Session API exposes `verifyWithPasskey()` and factor age; general reverification guide excludes passkeys and may downgrade requested MFA |
| Secure sessions | **PARTIAL / usable building block** | Pro supports bounded sessions, listing, revocation; FAPI cookie is HttpOnly, but a short-lived app-domain token is JavaScript-readable |
| Approved-device model | **PASS only through application layer** | Clerk device/session evidence does not replace canonical `AdminDevice` approval |
| Recovery | **FAIL / NOT ESTABLISHED for all-key loss** | Email, SMS, TOTP, and backup codes weaken the FIDO boundary; high-assurance provider/operator recovery is not established |
| Audit | **PARTIAL** | Seven-day application logs include factor/passkey/session events; durable log streaming/webhook completeness is not established |
| Exit | **PARTIAL** | User CSV/API export exists; WebAuthn credential portability does not |
| Future staff | **PASS structurally** | Individual identities and sessions scale; business roles/device/capabilities remain canonical |

## 4. Material documentation conflict

The current Session reference, updated August 14, 2026, documents `verifyWithPasskey()`, passkey first-factor verification, and factor-verification age. That creates a plausible supported flow:

```text
explicit passkey verification
  -> server validates fresh first-factor age
  -> application issues one-use command-bound grant
```

The general reverification guide still lists password/email/phone as supported first factors and TOTP/phone/backup code as second factors, omits passkeys, and permits utilities to downgrade requested MFA to first factor when a second factor is unavailable. The public-beta authorization helper is not recommended for production.

No inference resolves that conflict. Before Clerk could replace Auth0, an isolated Pro proof must show:

1. explicit passkey verification updates server-visible factor age;
2. the server can require the passkey/fresh first factor without downgrade;
3. only the passkey path is offered for protected commands;
4. the result can be consumed once and bound to the intended command;
5. missing, stale, failed, or weaker verification denies;
6. credential removal triggers the application session/device containment cascade.

## 5. Credential, recovery, and device model

Clerk supports multiple passkey records, including hardware keys. It does not, from the current official evidence, prove:

- that exactly roaming hardware authenticators can be enforced;
- that synced/password-manager passkeys can be rejected;
- that two approved hardware keys must remain enrolled;
- that deletion of the final approved credential can be prevented;
- that loss of all keys has a phishing-resistant owner recovery path.

Passkeys cannot perform the initial signup by themselves. Clerk documents that another strategy is required and that disabling Password affects new users rather than removing password sign-in from existing users. No supported evidence reviewed here establishes deletion of the bootstrapped owner's weaker password route. Therefore Clerk is not credited with passkey-only ordinary authentication even before the step-up conflict is considered.

If Clerk were ever selected, Day 1 would require two roaming FIDO2 keys, no weaker parallel login/recovery strategy, separate application `AdminDevice` admission, and a separately approved all-key-loss procedure. Those conditions are not credited as current Clerk capabilities without proof.

## 6. Sessions and outage

Clerk's production FAPI session cookie is HttpOnly/SameSite=Lax; the app-domain session token is JavaScript-readable and short-lived. Pro supports custom inactivity/maximum lifetimes, session enumeration, revocation, and explicit logout. Blowin' Smoke must still maintain its opaque canonical BFF session, CSRF controls, device/session revocation, and command authorization.

During Clerk outage, no new authentication or step-up is allowed and no weaker fallback exists. Exact refresh behavior during outage is not documented; the short token lifetime means a provider outage may stop provider evidence refresh quickly. Bounded application sessions may continue only under the same local policy and cannot authorize high-risk commands requiring fresh step-up.

## 7. Evidence register

**Access date for every source:** 2026-08-17

| Source | URL | Claim established | Claim not established |
|---|---|---|---|
| Clerk pricing | https://clerk.com/pricing | Hobby/Pro features; Pro is $25 month-to-month or $20/month billed annually; production passkeys/MFA/custom session lifetime require Pro | Downgrade behavior for existing credentials/sessions; final invoice/tax |
| Sign-up/sign-in options | https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options | Passkeys use physical device plus PIN/biometric and can satisfy MFA; another strategy is required for initial signup; disabling Password does not remove it from existing users | Supported deletion of the bootstrapped owner's password route, hardware-key-only/attestation policy, or safe passkey-only recovery |
| Custom passkey flow | https://clerk.com/docs/guides/development/custom-flows/authentication/passkeys | Discoverable passkeys include hardware and password-manager credentials; create/list/rename/delete; RP/domain binding | Two-physical-key enforcement, last-key deletion prevention, synced/roaming restriction, export |
| Session object reference | https://clerk.com/docs/react/reference/objects/session | `verifyWithPasskey()`, passkey first-factor verification, and `factorVerificationAge` exist | End-to-end production proof that server-visible freshness updates and can be command-bound |
| Backend Auth object | https://clerk.com/docs/reference/backend/types/auth-object | Server exposes factor verification age / `fva` and custom age checks | Public-beta `has({reverification})` suitability; exact passkey proof |
| Reverification guide | https://clerk.com/docs/guides/secure/reverification | Built-in sensitive-action reverification and server checks; documented factor list; graceful downgrade behavior | Reconciliation with newer passkey Session API |
| How Clerk works / XSS leak protection | https://clerk.com/docs/guides/how-clerk-works/overview ; https://clerk.com/docs/guides/secure/best-practices/xss-leak-protection | HttpOnly/SameSite FAPI cookie; JavaScript-readable app-domain token expires quickly and refreshes | HttpOnly app-domain token or zero replay window |
| Session options/list/revoke | https://clerk.com/docs/guides/secure/session-options ; https://clerk.com/docs/reference/backend/sessions/get-session-list ; https://clerk.com/docs/reference/backend/sessions/revoke-session | Bounded sessions, listing, individual revocation, logout | Automatic global revocation after credential/recovery change |
| CSRF / production deployment | https://clerk.com/docs/guides/secure/best-practices/csrf-protection ; https://clerk.com/docs/guides/development/deployment/production | SameSite, authorized parties, subdomain allowlist, DNS/origin restrictions | Protection from application mutation/authorization flaws |
| Application logs | https://clerk.com/docs/guides/dashboard/logs/application-logs | Sign-in/factor/passkey/session/device events; Pro retains seven days | Durable canonical audit, log stream, complete webhook availability |
| Security overview / lockout / limits | https://clerk.com/docs/guides/secure/overview ; https://clerk.com/docs/guides/secure/user-lockout ; https://clerk.com/docs/guides/how-clerk-works/system-limits | Rate limiting, lockout, bot and enumeration controls | Device attestation or complete passkey-only abuse defense |
| Unauthorized sign-in notice | https://clerk.com/docs/guides/secure/best-practices/unauthorized-sign-in | Pro can notify about unfamiliar-device sign-in and offer revocation | High-assurance device admission |
| Migration from Clerk | https://clerk.com/docs/guides/development/migrating/overview | User data export via CSV/API, including eligible password data | WebAuthn credential portability |

## 8. Why Clerk loses

Clerk's potential $120–$180 annual provider saving is not enough to accept an unremoved bootstrap password route, conflicting production step-up story, unenforced hardware-only policy, or unresolved full-key-loss recovery. Its current weighted score is **68/100**. A successful isolated proof could materially improve that score, but COM-ADM-02B is required to choose based on evidence now, not anticipated behavior.
