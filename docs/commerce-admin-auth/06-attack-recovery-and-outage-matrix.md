# COM-ADM-02B — Attack, Recovery, and Outage Matrix

## 1. Reading the matrix

The selected Auth0 behavior below is an acceptance requirement for a later authorized proof, not a fabricated test result. `PASS` means the documented design has a supported mechanism; `PROOF REQUIRED` means exact configuration/target execution remains untested; `BLOCKED` means official evidence does not establish the property.

## 2. Candidate security posture

| Property | Auth0 Essentials | WorkOS AuthKit | Clerk Pro | Application-owned WebAuthn |
|---|---|---|---|---|
| UV phishing-resistant ordinary login | **Supported** with exact roaming factor + required PIN | **Supported** for UV passkey; roaming-key policy unproved | **Conditional:** passkey is UV, but removal of the required bootstrap owner's existing password route is not established and hardware-only policy is unproved | **Supported by design** with UV-required WebAuthn |
| Independent recovery | One key + offline bearer recovery code; weaker but governed | Second credential and safe recovery not established | Multiple passkeys possible; all-key-loss recovery not established | Three-key candidate covers loss of both active/backup keys; all-three-key loss still requires attended recovery |
| Fresh phishing-resistant step-up | Supported building blocks; exact proof required | Fresh auth exists; exact passkey factor cannot be required from established evidence | Conflicting official docs; isolated proof required | Exact purpose-bound assertion can be built; not implemented |
| Canonical device/session revocation | Application-owned | Application-owned | Application-owned | Application-owned |
| Provider/credential exit | User export; WebAuthn re-enrollment required | User listing; migration-out/passkey portability not established | User export; passkey portability not established | Strongest control; stable RP/record migration proof still required |

## 3. Required attack and failure matrix

| ID | Attack/failure | Required safe behavior with selected Auth0 design | Candidate evidence note |
|---|---|---|---|
| A01 | Phishing site attempts login | Origin-bound `webauthn-roaming` assertion cannot satisfy the legitimate RP; no application session; failed event observed/audited where available | WorkOS/Clerk passkeys also resist phishing when no weak parallel route; application-owned must verify exact origin/RP |
| A02 | Stolen password | Password alone never creates Admin access; required roaming factor and active device/session gate deny | Auth0 selected; WorkOS/Clerk must not leave password as sufficient recovery; app-owned has no password |
| A03 | Compromised email account | Email cannot authorize login, factor reset, device admission, or recovery by itself; independent alert channel is not authority | WorkOS email reset and Clerk email strategies are recovery concerns; Auth0 tenant/reset path must be configured/tested not to bypass recovery lock |
| A04 | SIM swap | No SMS factor or SMS recovery; no effect on Admin authority | Same mandatory rule for every candidate |
| A05 | Stolen iPhone | Revoke iPhone `AdminDevice` and sessions from Mac; new login still requires hardware key/PIN; already-open session bounded and revocable | Provider “device” signal never substitutes for application revocation |
| A06 | Stolen Mac | Revoke Mac `AdminDevice` and sessions from iPhone; new login still requires hardware key/PIN | Same boundary for all candidates |
| A07 | Stolen hardware key without PIN | Required UV denies normal use; invoke offline recovery containment, remove/replace factor, revoke affected sessions/devices, notify/audit | Authenticator PIN retry/lock behavior needs target proof; no claim of perfect theft resistance |
| A08 | Stolen active browser session | Server-side session, active device, actor/capability, idle/absolute lifetime, and fresh step-up constrain access; revoke session/device; high-risk command needs new key UV | WebAuthn does not protect a stolen bearer session for ordinary commands |
| A09 | Session cookie replay | Rotate identifiers; bind canonical session to device record; detect/revoke reuse where feasible; bounded lifetime; sensitive command requires fresh step-up; deny revoked state | No provider eliminates replay; Clerk app-domain token adds a short JavaScript-readable bearer surface |
| A10 | CSRF against Admin command | Secure/HttpOnly/appropriate SameSite cookie plus CSRF token and Origin/Fetch-Metadata checks; unsafe GET forbidden; exact command authorization and step-up | Same application responsibility for all candidates |
| A11 | Attacker attempts new credential enrollment | Ordinary change requires active actor/device/session and fresh exact roaming-key UV. Initial attended bootstrap and synchronously authenticated `RECOVERY_LOCKED` replacement are the only exceptions; both return no commerce payload until complete, then disable/close. Notify/audit; unknown/weaker state denied | Auth0 bootstrap/recovery enrollment lifecycle requires proof; WorkOS second passkey blocked; Clerk hardware-only/last-key policy unproved; app-owned must build ceremony |
| A12 | Attacker attempts recovery | Email/SMS/TOTP/password/caller claim alone denied; ordinary client accepts only `webauthn-roaming`. Separate recovery client accepts only a synchronously verified `recovery-code` challenge, has no commerce audience/session, and enters recovery lock for containment/replacement | Auth0 recovery code is a bearer-secret residual risk; exact client/method/audience and replacement sequence requires proof; alternative managed candidates lack a complete established recovery model |
| A13 | Revoked device attempts reuse | Canonical `AdminDevice` state is checked on every protected request/command; revoke all linked sessions; deny despite valid provider identity | Equal application requirement for every candidate |
| A14 | Revoked credential attempts authentication | Removed provider factor cannot complete challenge; related application sessions contained; audit/notify | Exact propagation and race behavior requires provider proof; app-owned denies inactive credential record |
| A15 | Stale session attempts high-risk command | No current one-use grant; force fresh Auth0 `webauthn-roaming` ceremony and exact command binding; stale or weaker result denied | WorkOS exact-factor step-up unproved; Clerk docs conflict; app-owned can design exact challenge |
| A16 | Authentication provider unavailable | No new login, step-up, enrollment, removal, or recovery; no weaker fallback; only already-valid bounded low-risk sessions may continue | Application-owned has no runtime IdP dependency but application/DB outage still fails closed |
| A17 | Database available but identity provider unavailable | Database availability does not authorize identity; same outage rule; inventory remains intact; high-risk commands denied | Existing local sessions use canonical database state only within policy |
| A18 | Credential/provider export required | Export user/profile/audit data where supported; preserve canonical actor/device/session/audit; plan WebAuthn re-enrollment at stable replacement RP; revoke old integration after verified cutover | No hosted candidate establishes portable WebAuthn credentials; application-owned has best record control but still needs migration proof |
| A19 | Owner loses all normal active sessions | Fresh password + required roaming key/PIN can authenticate; known endpoint can create a new canonical session, or unknown endpoint enters governed admission | WorkOS sole-passkey loss gap; Clerk can use a surviving passkey; app-owned can use either key |
| A20 | Owner loses primary credential | Use physically separate recovery code only through `RECOVERY_LOCKED`; replace key, revoke old factor/sessions/devices as needed, notify/audit before normal access | Auth0 temporarily lowers assurance; WorkOS safe path unestablished; Clerk second key works if enrolled; app-owned second key works |

## 4. Recovery matrix R01–R10

Each recovery must answer who authorizes it, what proof is used, what assurance is lost, whether old state is revoked, and whether an audit event exists.

| ID | Failure | Selected Auth0 result | WorkOS result | Clerk result | Application-owned result |
|---|---|---|---|---|---|
| R01 | Owner loses iPhone | Mac + password + key/PIN; owner revokes iPhone device/sessions; no assurance downgrade; provider/application audit | Other endpoint may have synced passkey, but this is not independent device approval; revoke locally | Other endpoint + key; revoke Clerk/local sessions and device | Mac + either key; revoke iPhone device/sessions |
| R02 | Owner loses Mac | iPhone Safari + password + NFC/USB-C key/PIN; revoke Mac; no downgrade | Same limitation as R01 | iPhone + supported key; revoke Mac | iPhone + NFC key; revoke Mac |
| R03 | Owner loses primary security key | Recovery-only client synchronously verifies the offline code, creates no commerce session, and enters `RECOVERY_LOCKED`; assurance temporarily downgrades to bearer secret; remove key, revoke relevant sessions/devices, enroll replacement, notify/audit | **BLOCKED:** no second passkey/self-service high-assurance path established | Surviving second key works if two were actually enrolled; hardware-policy proof missing | Recovery key authorizes revocation/replacement with fresh UV; no downgrade |
| R04 | Owner loses iPhone + primary key | Mac + offline recovery code; same containment and downgrade as R03; revoke both lost assets | **BLOCKED / not safely established** | Mac + second key if enrolled; otherwise unresolved | Mac + recovery key; revoke iPhone and primary key |
| R05 | Owner loses Mac + primary key | iPhone + offline recovery code; same containment/downgrade; revoke both lost assets | **BLOCKED / not safely established** | iPhone + second key if supported/tested; otherwise unresolved | iPhone + recovery key; revoke Mac and primary key |
| R06 | Owner loses every active browser session | Fresh ordinary password + key/PIN; known device gets new session; unknown endpoint requires separate admission; audit | Surviving passkey authenticates; loss of sole passkey remains blocked | Surviving passkey authenticates; session/device admission remains local | Either key authenticates; unknown endpoint admission separately governed |
| R07 | One credential is stolen | Owner + offline recovery code initiate containment; key PIN remains theft barrier but credential is revoked/replaced; all security-sensitive sessions reviewed/revoked; notify/audit | Dashboard deletion requires surviving access; safe next credential/recovery not established | Use second key/session to delete; app cascades revocation; hardware-only policy unproved | Second key authorizes revoke/replace; notify/audit |
| R08 | One registered device is stolen | Surviving device + ordinary key; revoke `AdminDevice` and every linked session; provider identity unaffected unless evidence indicates compromise; audit | Same application control | Same application control | Same application control |
| R09 | Primary credential becomes unusable | Same as R03; offline recovery code and containment; replace key | **BLOCKED / weak alternate path** | Second key if enrolled; otherwise unresolved | Recovery key; revoke/replace |
| R10 | Both hardware keys are lost | Selected design has only one enrolled key: offline recovery code handles key loss under recovery lock. If key **and** recovery code are lost, no self-service recovery; attended tenant/support identity proof is required and cannot itself grant commerce access without approved runbook | Two keys cannot be established; sole passkey loss has no verified high-assurance recovery | Multiple keys can exist, but both-key-loss phishing-resistant recovery is not established | Third sealed UV-required key authorizes replacement and revocation; loss of all three requires independently audited attended recovery |

### Recovery authority

- Ordinary key loss is authorized only through the separate recovery client: it challenges `recovery-code`, the following Action checks the completed method and client synchronously, and its token/audience cannot create a commerce session. The ordinary client challenges only `webauthn-roaming`.
- Email/SMS/phone access, a password, a provider support statement, or direct database editing is never sufficient commerce authority.
- Recovery does not silently preserve old sessions or devices. The application invalidates or reviews all active state, replaces the key, and records actor, event source, reason, old/new factor references, devices, sessions, timestamps, notifications, and completion status.
- Because the recovery code is not phishing-resistant, its use is a declared assurance downgrade. Normal commerce access resumes only after a new UV-required roaming factor and device/session posture are established. The consumed code is retired and the replacement displayed on Auth0's Universal Login new-code screen is captured once and resealed offline before recovery closes.
- Provider logs reconcile/audit recovery after ingestion; they are never used as the pre-payload lock signal.

## 5. Provider outage matrix

| Candidate | New login/step-up during outage | Existing session rule | Forbidden fallback | Residual |
|---|---|---|---|---|
| Auth0 Essentials | Denied | Already-issued canonical session may continue low-risk work until its existing idle/absolute bound if actor/device/state remain valid; high-risk step-up denied | Password-only, email, SMS, TOTP, local emergency user | Provider event/revocation freshness may be delayed; bounded lifetime and local revocation remain critical |
| WorkOS AuthKit | Denied | Same local rule | Weaker password/email path | Exact hosted/passkey and refresh outage behavior not established |
| Clerk Pro | Denied | Same local rule, subject to short provider-token refresh evidence | Weaker factor or bypass | 60-second token refresh can shorten practical continuity; exact outage behavior not established |
| Application-owned WebAuthn | No third-party runtime IdP outage; application/DB outage denies | Existing sessions only while application and canonical state are available/valid | Static emergency password or database edit | Blowin' Smoke owns every availability, patching, and incident burden |

## 6. Required bounded-session policy

Exact durations are not selected in this research phase. A later proof must choose and test explicit idle and absolute lifetimes, refresh/rotation, step-up freshness, logout, per-session/device/global revocation, recovery cascade, and provider-outage behavior. No duration may be silently extended because the provider is unavailable. High-risk operations always require a live fresh ceremony.

## 7. Matrix conclusion

Auth0's principal weakness is transparent: one hardware-key enrollment plus a bearer recovery code rather than the preferred two enrolled keys. WorkOS has wider unproved credential/recovery gaps; Clerk has promising but conflicting step-up evidence and unresolved all-key-loss recovery; application-owned WebAuthn can close R10 with a third $29 key but still creates disproportionate identity-provider and all-three-key recovery burden. The selected Auth0 design qualifies only if recovery locking, exact factor forcing, session/device cascade, and target-device behavior pass later execution proof.
