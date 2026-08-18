# COM-ADM-02B — Auth0 Essentials Evaluation

## 1. Verdict

**KEEP — selected Day-1 provider at $35/month, subject to configuration and execution proof.**

Auth0 Essentials is not selected because it has the most features. It is selected because Pro MFA provides the exact roaming FIDO2 security-key factor and required-UV policy the Free database-passkey path does not establish, while the paid log stream/retention, support, environment/extensibility capacity, recovery mechanisms, and future user lifecycle reduce operational risk without making Blowin' Smoke its own identity provider.

Auth0 does not own business authorization, `AdminDevice`, application sessions, command grants, or canonical audit.

## 2. What $35/month buys

### Free baseline that does not justify the upgrade

Auth0 Free already advertises one custom domain, database-connection passkeys/passwordless, Basic Attack Protection, five Actions, and one-day logs. Current Auth0 evidence also documents up to 20 passkeys per user, a supported local-enrollment route to a second passkey on another device, and a Post-Login signal that identifies passkey authentication. Those capabilities are useful, but they are not counted as incremental value purchased by Essentials. Free remains blocked—not merely because passwords can coexist—because current evidence does not establish a roaming-hardware-only/attested policy, two physically independent keys, prevention of progressive or password-based enrollment/recovery bypass, a safe no-email/no-password all-credential-loss path, or the exact factor-specific high-risk step-up and recovery behavior required here. Essentials supplies the Pro MFA factor used by the selected UV-required `webauthn-roaming` design.

### Essentials incremental value needed or useful Day 1

| Capability | Use | Result |
|---|---|---|
| Pro MFA factors | WebAuthn roaming security key as independent factor | **Needed** |
| WebAuthn security-key UV policy | `User Verification: Required` forces FIDO2 PIN behavior | **Needed** |
| Expanded Actions capacity + factor-specific policy | Require `webauthn-roaming`; deny when absent; isolate recovery client | **Needed configuration; Free has fewer Actions but lacks the required Pro factor** |
| OIDC reauthentication evidence | `max_age` and validated `auth_time` support fresh ceremony | **Needed** |
| Recovery code | Physically separate break-glass credential | **Needed, tightly constrained** |
| One log stream + five-day retention | Ingest relevant auth/security events into canonical audit with more operating window than Free | **Needed operationally; provider retention is not canonical** |
| Standard support | Managed provider issue path for sole-owner lockout/outage | **Needed operationally** |
| Separate production/development tenant capacity | Avoid testing recovery/Actions against the live owner identity | **Needed before pilot; exact tenant setup remains unauthorized** |

### Necessary inherited baseline

The custom domain and Basic Attack Protection are still required in the selected tenant, but Auth0 already includes them on Free. They are configuration requirements, not reasons for the $35 upgrade.

### Future or non-governing value

| Capability | Day-1 status |
|---|---|
| 500 MAU and staff identities | Mostly unused at one owner; provides a clean future staff path |
| Auth0 roles | Not canonical; Blowin' Smoke capabilities remain authoritative |
| Multiple tenants | Useful for later environment separation; not a reason by itself to buy |
| Enterprise user-session Management API | Not included in Essentials; cannot be claimed |
| Adaptive/advanced attack protection | Higher-plan capability; not assumed |
| Provider user dashboard | Operational convenience; not commerce authority |

## 3. Hard-requirement evaluation

| Requirement | Result | Basis and boundary |
|---|---|---|
| Phishing-resistant ordinary login | **PASS — configuration-dependent** | Password plus required `webauthn-roaming`; password alone denied. WebAuthn is origin-bound. |
| Owner user verification | **PASS — configuration-dependent** | Set security-key `User Verification: Required`; requires FIDO2 PIN behavior. |
| Two independent owner credentials | **CONDITIONAL PASS** | One roaming key plus physically isolated recovery code. Current specific Auth0 guidance does not support two enrolled YubiKeys for one application user. |
| Secure server session | **PASS through application layer** | Blowin' Smoke creates/revokes opaque server sessions; Essentials provider-session enumeration is not assumed. |
| Fresh factor-specific step-up | **PASS — proof pending** | `max_age`/`auth_time` plus Action challenge for `webauthn-roaming`; application issues one-use command-bound grant. |
| Device/session registry | **PASS through application layer** | Canonical `AdminDevice` and server sessions remain independent of Auth0. |
| Fail closed | **PASS by required architecture; proof pending** | Missing factor/freshness/device/session/capability denies. |
| Audit | **PASS with ingestion** | Provider logs cover relevant events; application must stream/map and retain them canonically. |
| iPhone Safari + Mac browser | **DOCUMENTATION-SUPPORTED; execution proof pending** | WebAuthn roaming keys are supported in target browser families; exact owner hardware/browser must be tested. |
| Export/exit | **PARTIAL** | User profiles export; some secrets require support-reviewed export; WebAuthn credentials are not portable and require re-enrollment. |

## 4. Exact selected configuration

1. Use Auth0 Essentials and establish the final custom domain before factor enrollment.
2. Perform one attended bootstrap that returns no commerce data until the first key/PIN, offline code, first device, notification, and audit are complete; then disable the bootstrap authority.
3. Keep the application-user database connection only as required by the provider flow; a password never suffices for Admin admission.
4. Enable the WebAuthn security-key factor and recovery-code factor; set security-key user verification to `Required`.
5. Require MFA `Always` for the owner and use Actions to require `webauthn-roaming`; deny if the factor is missing or cannot be challenged.
6. In the attended bootstrap, explicitly enroll one Yubico Security Key C NFC or equivalent validated FIDO2 roaming key; configure and test its PIN.
7. Do not enroll SMS, email, TOTP, platform/synced passkey, or device-biometric factors as ordinary substitutes.
8. After key enrollment, explicitly call the documented sequenced custom-enrollment step for `recovery-code`. `enrollWith`/`enrollWithAny` enrollment of another factor does not automatically issue the code. Seal the issued code offline and physically apart from the key and both Admin endpoints.
9. Use a distinct recovery-only client/route. Its Action challenges only `recovery-code`; the following Action synchronously verifies that method plus the recovery client ID and emits only recovery-scoped evidence. Any mismatch is denied.
10. Give the recovery client no commerce audience and never exchange its result for an ordinary Admin session. Provider logs are secondary audit/reconciliation, not the admission signal.
11. Use documented MFA authenticator list/delete capability and a supported WebAuthn enrollment flow only inside `RECOVERY_LOCKED`; prove the exact replacement sequence before pilot.
12. After recovery-code use, capture the replacement displayed by Auth0's Universal Login new-code screen once, retire the consumed code, and physically reseal the replacement before recovery can close.
13. Revoke local sessions/devices as governed, notify independently, replace the factor, and record canonical audit before normal access resumes.
14. Build application-owned `AdminDevice`, opaque sessions, CSRF controls, capabilities, command-bound step-up, revocation, and audit.
15. Harden the Auth0 owner/control-plane account with phishing-resistant authentication, separately sealed recovery, least-privilege Management API clients, configuration-change notice/audit, and a tested support-recovery boundary.
16. Deny high-risk commands when Auth0 cannot perform a fresh exact-factor ceremony.

## 5. Material limitation: one security key

Auth0's general WebAuthn overview discusses naming keys, but the newer, specific official support article says an application user can currently enroll only one YubiKey for the WebAuthn security-key MFA factor. The specific limitation governs this decision.

Consequences:

- COM-ADM-02B does not represent two hardware keys as enrolled.
- The independent recovery credential is an offline recovery code, not a second key.
- Recovery temporarily falls below phishing-resistant assurance because the code is a bearer secret.
- The application recovery lock and immediate factor replacement are mandatory compensating controls.
- If two simultaneously enrolled roaming hardware keys becomes a non-negotiable rather than preferred property, Auth0 Essentials no longer qualifies; application-owned WebAuthn becomes the candidate to prove.

## 6. What fails if Auth0 is removed

Removal does not inherently weaken WebAuthn mathematics. It transfers responsibility.

Downgrading specifically to Auth0 Free removes the documented Pro MFA security-key factor used to force `webauthn-roaming` with the selected UV/PIN policy. Current evidence shows that Free database passkeys can be multiple and that an Action can detect a passkey method, so this comparison does not assume a password login must receive application tokens. It still does not establish roaming-hardware-only/attested credentials, two physically independent keys, safe progressive enrollment and recovery without password/email authority, or exact passkey-specific high-risk reauthentication. Its one-day logs/no log stream and reduced support/environment capacity also weaken operations, but those are secondary to the unresolved credential-policy and recovery boundary.

Without Auth0, Blowin' Smoke must either accept a hosted provider whose official evidence does not establish the required recovery/factor-specific step-up policy, or own bootstrap, credential ceremonies, exact verification state, factor lifecycle, recovery authority, sessions, abuse defense, compatibility, security events, dependency advisories, urgent patches, and identity support. That ongoing risk and labor is disproportionate to a $35/month saving for the current phase.

## 7. Recovery and revocation boundaries

- Auth0 recovery code use can restore provider access; it must not directly restore commerce command authority. The ordinary client requests only `webauthn-roaming`. A separate recovery client requests only `recovery-code`, and its second Action checks the completed method and client before it can issue recovery-scoped—not commerce-scoped—evidence.
- This fail-closed split is documentation-supported: Auth0 exposes the initiating client ID, records the factor completed by a prior challenge in the next Action, permits `recovery-code` as an explicit challenge, and permits an Action to deny or set custom token claims. Exact sequencing, token audience isolation, and target tenant behavior remain mandatory execution proof.
- Auth0 also documents user-scoped MFA authenticator list/delete endpoints. Replacement of the sole lost WebAuthn authenticator after recovery remains a full proof case; no document in this package claims it already ran.
- Essentials does not provide the Enterprise-only provider session-management API. Blowin' Smoke must revoke its own server sessions and `AdminDevice` states promptly.
- Refresh-token/provider-session behavior must never substitute for canonical application revocation.
- Auth0 tenant/dashboard recovery is a separate privileged dependency. Sole-owner loss of application key, recovery code, active application sessions, and tenant access is not a normal recovery path; it is an attended support/identity-proofing incident with no weak bypass.
- After successful recovery authentication, Auth0 documents a Universal Login screen that displays a new recovery code and prompts the user to save it. Recovery is incomplete until the displayed code is captured once, sealed offline, recorded in the physical inventory without revealing it, and the old code is confirmed retired.
- Provider logs are short-lived evidence feeds, not the durable audit system.

## 8. Control-plane risk

The Auth0 owner/tenant account can change the exact controls this decision relies on. It therefore requires its own phishing-resistant login, separate recovery material, minimal administrators, least-privilege server-only Management API credentials, notification/audit for Action/client/domain/factor/MFA-reset change, configuration backup/review, and a tested Auth0 Support recovery boundary.

The selected application-user key costs $29. A second $29 key is not counted as already required because current evidence has not established the final dashboard factor topology or whether the same physical key can safely serve both distinct relying parties. It is explicitly reserved as a procurement contingency. If control-plane proof requires it, the one-time hardware becomes $58 before tax/shipping; the monthly decision is unchanged.

## 9. Current official evidence register

**Access date for every source:** 2026-08-17

| Source | URL | Claim established | Claim not established |
|---|---|---|---|
| Auth0 pricing | https://auth0.com/pricing | Free baseline includes one custom domain, passkeys/passwordless, Basic Attack Protection, five Actions, and one-day logs; Essentials is $35/month for 500 MAU and adds Pro MFA factors, five-day logs, one log stream, expanded Actions/tenant capacity, and standard support | Exact annual-prepayment total; final invoice/tax; configured assurance |
| Configure WebAuthn security keys | https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn/configure-webauthn-security-keys-for-mfa | FIDO security-key support; `User Verification: Required` requires FIDO2 PIN; WebAuthn origin binding; custom-domain change can invalidate enrollment | Multiple key enrollment; exact owner-device execution result |
| FIDO/WebAuthn overview | https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn | Roaming versus platform authenticators; phishing resistance; portable roaming-key use | Resolution of the multiple-key conflict below |
| Enroll Multiple YubiKeys — Auth0 Support | https://support.auth0.com/center/s/article/Enroll-Multiple-Yubikeys-for | Specific current guidance says only one YubiKey can be enrolled in the WebAuthn security-key MFA factor for an application user | Future provider behavior; why the general overview suggests naming multiple keys |
| Enable MFA | https://auth0.com/docs/secure/multi-factor-authentication/enable-mfa | MFA can be Always; security key is an independent factor; Actions can customize policy | Second security-key enrollment; application command authorization |
| Customize MFA selection | https://auth0.com/docs/secure/multi-factor-authentication/customize-mfa/customize-mfa-selection-universal-login | Actions can require an exact `webauthn-roaming` challenge and deny when unavailable | Successful target configuration; command binding/freshness storage |
| OIDC reauthentication | https://auth0.com/docs/authenticate/login/max-age-reauthentication | `max_age` and validation of `auth_time` establish reauthentication freshness | Factor strength unless separately required and checked |
| Manage user sessions API | https://auth0.com/docs/manage-users/sessions/manage-user-sessions-with-auth0-management-api | Provider session list/revoke endpoints are Enterprise-only; refresh tokens can outlive session deletion/logout | Essentials-level provider session registry; application revocation |
| Recovery codes | https://auth0.com/docs/secure/multi-factor-authentication/configure-recovery-codes-for-mfa | Recovery code is generated and can restore access after factor loss | Phishing resistance; physical custody; application recovery containment |
| Verify with recovery code | https://auth0.com/docs/api/authentication/multi-factor-authentication/verify-with-recovery-code | Recovery verification uses an explicit `mfa-recovery-code` grant, client ID, MFA token, and recovery code | Automatic commerce lock, safe browser implementation, or replacement-key completion |
| Post-login event object | https://auth0.com/docs/actions/reference/post-login/post-login-event-object | Login Action receives completed authentication methods and the initiating client ID | Correct tenant Action sequencing or application authorization |
| Post-login API object | https://auth0.com/docs/actions/reference/post-login/post-login-api-object | Action can challenge `recovery-code` or `webauthn-roaming`, deny access, enroll a factor, and set custom token claims | Successful target configuration, audience isolation, or complete recovery workflow |
| List/delete MFA authenticators | https://auth0.com/docs/api/authentication/multi-factor-authentication/list-authenticators ; https://auth0.com/docs/api/authentication/multi-factor-authentication/delete-authenticator | User-scoped MFA-audience tokens can list and delete authenticators with explicit scopes | That recovery-code authentication automatically grants those scopes or that sole-key replacement succeeds without proof |
| Reset user MFA | https://auth0.com/docs/secure/multi-factor-authentication/reset-user-mfa | Recovery code or tenant administrator can reset MFA | Safe sole-owner recovery after all control is lost |
| Tenant log catalog | https://auth0.com/docs/tenant-logs | Logs cover login, Management API, MFA enrollment/recovery/unenrollment, and security events | Durable canonical retention or complete delivery without application ingestion |
| Brute-force protection | https://auth0.com/docs/secure/attack-protection/brute-force-protection | Baseline brute-force protection and log events; enabled by default for new tenants | Higher-plan adaptive protection or invulnerability |
| Bulk user export | https://auth0.com/docs/api/management/v2/jobs/post-users-exports | User profiles can be exported through the Management API | Portable WebAuthn credentials |
| Password/MFA secret export | https://auth0.com/docs/manage-users/user-migration/export-password-hashes-and-mfa-secrets | Eligible, support-reviewed PGP export path exists for some secrets | Guaranteed eligibility/timing or WebAuthn credential portability |
| Auth0 database passkeys | https://auth0.com/docs/authenticate/database-connections/passkeys | Database-connection passkeys can synchronize through credential managers and password remains another/recovery factor; passkey-only is not supported | Enforcement that every passkey is synced, a roaming-hardware-only policy, or a two-key Admin posture on Free |
| Detect passkey use in Actions — Auth0 Support | https://support.auth0.com/center/s/article/detecting-passkey-usage-in-auth0-post-login-actions | A Post-Login Action can identify database-passkey authentication through `event.authentication.methods` | Hardware/roaming class, attestation, approved device, or safe recovery |
| Create a second passkey — Auth0 Support | https://support.auth0.com/center/s/article/Creating-a-second-passkey-for-the-same-user-on-a-different-device | With local enrollment enabled, a user who authenticates on a new device using an existing passkey can be offered another local passkey; the official example includes a passkey held on a YubiKey | Two physically independent roaming keys, hardware-only enforcement, or prevention of progressive/password recovery bypass |
| Explicit recovery-code enrollment — Auth0 Support | https://support.auth0.com/center/s/article/Use-api-authentication-enrollWithAny-to-enroll-in-recovery-code-after-enrolling-in-another-factor | Custom `enrollWith`/`enrollWithAny` enrollment of another factor does not automatically issue a recovery code; the recovery code must be enrolled with a sequenced `enrollWith({type:'recovery-code'})` call | Successful target Action sequence or correct bootstrap implementation |
| Universal Login replacement-code screen | https://auth0.com/docs/libraries/acul/react-sdk/API-Reference/Screens/mfa-recovery-code-challenge-new-code | After successful recovery authentication, the screen displays a new recovery code and prompts the user to save it securely | Application containment, physical resealing, or confirmation of target flow execution |
| Add Dashboard MFA | https://auth0.com/docs/get-started/manage-dashboard-access/add-change-remove-mfa/add-mfa | Dashboard users can self-enroll MFA; Auth0 recommends WebAuthn, multiple factors, and a recovery code | Exact control-plane key topology, same-key cross-RP safety, or completed recovery test |
| Dashboard MFA reset — Auth0 Support | https://support.auth0.com/center/s/article/Account-Locked-MFA-Resets-Requests | Auth0 documents an identity-verified support reset path when a tenant member loses every authenticator and recovery code | Recovery completion time, exact identity-proofing result, or direct commerce authority |

## 10. Decision status

Auth0 Essentials receives **83/100** under the fixed weighted rubric and wins. Its result is not “production PASS.” It is **selected, configuration-dependent, execution-proof-pending**.
