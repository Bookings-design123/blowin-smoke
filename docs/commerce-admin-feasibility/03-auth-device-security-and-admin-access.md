# Authentication, Approved-Device Security, and Admin Access

**Document role:** COM-ADM-02 provider and implementation-feasibility decision for owner authentication, endpoint admission, session control, recovery, and security-sensitive commands  
**Evidence access date:** 2026-08-17  
**Owner profile:** One owner; Web, iPhone, and Mac/desktop access; strong MFA required; personal or unapproved-device access prohibited  
**Selected launch direction:** Auth0 Essentials + Cloudflare Zero Trust Access/WARP + application-owned `AdminDevice` registry + App Attest on native iPhone  
**Production implementation authorized:** No  
**Production accounts, credentials, devices, or policies created:** No

## 1. Decision

Blowin' Smoke should use **Auth0 Essentials** as the managed staff identity provider and **Cloudflare Zero Trust Access with paid WARP/device-posture service** as the Web/Mac edge gate. Neither provider becomes canonical authorization truth. The canonical commerce application owns the final `AdminActor`, capability, session-risk, and `AdminDevice` authorization decision.

The launch control model is deliberately layered:

1. Auth0 establishes the owner identity and a recent phishing-resistant authentication state.
2. Cloudflare Access requires the expected identity plus current WARP/device-posture evidence before the Web or Mac surface reaches the application.
3. The canonical API requires an active application-owned `AdminDevice` record on every protected Admin request.
4. The native iPhone companion additionally binds a verified App Attest key to its `AdminDevice` and presents fresh assertions for selected sensitive requests.
5. High-risk canonical commands require recent step-up, exact object/capability scope, current device state, a command-bound authorization, and all COM-ADM-01 preconditions.

If a required signal is missing, unknown, stale, revoked, unsupported, or unavailable, the request fails closed. A client assertion such as `approved=true`, a cookie, user-agent string, device name, remembered browser, provider session, or hidden user-interface control is never sufficient.

This decision protects Commerce Admin access. It does **not** approve any client for D3/D4 Private Wholesale protected content and does not weaken the independent SEC-02/SEC-03 protected-client release gate.

## 2. Governing compatibility with COM-ADM-01

The selected providers implement parts of the COM-ADM-01 trust contract without replacing it:

| Concern | Canonical owner | Provider role | Required boundary |
|---|---|---|---|
| Human identity and authentication ceremony | Identity and Access domain | Auth0 | Provider subject is an external alias to a stable `AdminActor`, not business authority |
| Role, capability, object, division, location, and channel scope | Canonical commerce application | None | Never derive permission from `admin=true`, Auth0 metadata alone, or Cloudflare admission |
| Approved endpoint lifecycle | Canonical commerce application | Cloudflare supplies Web/Mac posture; Apple supplies iPhone App Attest evidence | `AdminDevice.status = ACTIVE` is required in addition to provider evidence |
| Consequential command authorization | Owning commerce domain plus Identity and Access | Auth0 can perform step-up | The API re-reads actor, device, capability, object state/version, purpose, approval, and idempotency |
| Audit | Audit, Provenance, and Corrections domain | Auth0 and Cloudflare supply supporting provider logs | Canonical mutation + durable audit/outbox remain one success boundary |
| Protected Wholesale payload | Separate protected-client admission architecture | None selected here | Web/PWA remains zero-payload for D3/D4 Private Wholesale content |

Auth0's provider roles may be used only as coarse authentication configuration. COM-ADM roles, atomic capabilities, device approval, and high-risk command authority remain versioned application data so that provider replacement cannot rewrite commerce authorization semantics.

## 3. Identity-provider candidate comparison

### 3.1 Decision matrix

| Candidate | Current official launch pricing and limits | Security and session capability | Recovery, export, and lock-in | Operational burden and COM-ADM fit | Status |
|---|---|---|---|---|---|
| **Auth0 Essentials** | `$35/month`; up to 500 MAU; one custom domain; Pro MFA factors; one log stream; 5-day Auth0 log retention; standard support | Passkeys included; WebAuthn roaming security keys and device biometrics; TOTP, push, and recovery codes; Actions; API/web step-up; native/web passkey API; session and refresh-token revocation | User profile/metadata export is documented. Password-hash/MFA-secret export requires paid service, eligibility review, PGP, support, executive acknowledgment, and has no guaranteed timing. Passkey private credential export is not established; reenrollment must be expected on exit | Strongest documented fit for an owner-only application needing mandatory hardware-key MFA, native iOS support, explicit factor selection, step-up, and log streaming. Five-day provider log retention is insufficient for canonical audit | **RECOMMENDED** |
| **WorkOS AuthKit** | AuthKit `$0/month` up to 1 million active users; custom domain `$99/month`; additional million users `$2,500/month`; paid annual-credit plans add support/SLA terms | WebAuthn passkeys, TOTP/SMS MFA, multiple web/mobile applications, session revocation, and `auth_time`/`max_age` reauthentication. Passkey authentication is currently hosted-UI-only | User/profile API access is documented. A complete outbound credential/passkey export was not established from current official evidence. A branded production passkey deployment should use the `$99/month` custom domain | Capable managed alternative and good multi-application model, but its current evidence is less explicit about mandatory roaming hardware-key policy and exit of credentials | **VIABLE ALTERNATIVE** |
| **Clerk Pro** | `$20/month` billed annually (`$25/month` monthly per current pricing FAQ); 50,000 monthly retained users per app; 7-day application logs; passkeys and MFA | Passkeys, TOTP/SMS/backup-code MFA, sessions, device views, revocation, and server-side reverification helpers | Dashboard/API exports are documented and pricing states full data exports. Passkey credential portability is not established and reenrollment should be expected | Reverification currently excludes passkeys and may gracefully downgrade requested multi-factor/second-factor assurance to first-factor when no second factor exists. That conflicts with fail-closed high-risk commands unless custom controls replace the convenience flow | **REJECTED** |
| **Custom/self-hosted identity** | Commodity hosting cost could be low, but engineering, monitoring, incident response, factor lifecycle, email/recovery, SDK, and migration cost are unbounded | Only what Blowin' Smoke safely builds and continuously maintains | Maximum data control; maximum security and operating obligation | Reinvents commodity security infrastructure and conflicts with the owner's managed-service preference | **REJECTED** |

### 3.2 Auth0 launch configuration

The feasibility recommendation assumes all of the following; selecting Auth0 without these controls does not satisfy the requirement:

- Use a Blowin' Smoke custom authentication domain before enrolling WebAuthn credentials. Changing the relying-party domain later can invalidate existing enrollments.
- Enroll a **FIDO2 roaming security key with user verification required**. The owner supplies the key PIN/verification gesture for authentication.
- Enroll two physical keys: one daily key and one separately stored recovery key. A current FIDO-only Yubico Security Key NFC or Security Key C NFC is listed at `$29` each, or `$58` before tax/shipping for two.
- Do not enable SMS or email as an assurance-equivalent fallback for sensitive Admin access. Recovery codes are break-glass material, not routine MFA.
- A synced platform passkey may later be offered for convenience, but it cannot substitute for approved-device admission and must not silently weaken a command requiring the roaming key.
- Configure Auth0 Actions to request the intended WebAuthn roaming factor for high-risk flows. Do not use an unrestricted `any` challenge where a lower-assurance factor could satisfy the operation.
- Disable remembered-browser bypass for high-risk command step-up.
- Use short access-token lifetimes proportionate to Admin risk; rotate refresh tokens; revoke sessions and refresh grants during device loss, factor loss, owner security action, and incident response.
- Stream Auth0 logs immediately. Five days of provider retention is supporting evidence, not the COM-ADM audit retention system.

WebAuthn proves control of a relying-party-bound credential. Apple documents that iCloud Keychain passkeys sync between devices, while physical security-key credentials remain on physical media. Neither proves that the computer using the credential is an approved Blowin' Smoke endpoint. Authentication and endpoint admission therefore remain separate decisions.

## 4. Approved-device candidate comparison

| Candidate/control | Exact capability | Limitations and failure behavior | Cost/operations | Status |
|---|---|---|---|---|
| **Application-owned `AdminDevice` registry** | Binds one `AdminActor` to an endpoint record, approved platform/surface, credential or attestation references, state, approval, review, last-seen, and revocation evidence; checked server-side for every protected request | A database record is not hardware proof. It must be combined with fresh identity, provider posture, and native attestation where available | Custom bounded-domain work, but low ongoing provider dependence and essential for portability | **RECOMMENDED** — required final authority |
| **Cloudflare Access + paid WARP/device posture** | Edge policy can combine IdP identity with WARP registration and device-posture checks; registration keys can be revoked; the client supports Mac and iOS; APIs expose device/registration lifecycle | WARP enrollment is not proof of an uncompromised OS. Cloudflare documents that a revoked client may re-register if the user remains eligible, so application and enrollment authorization must also be revoked. No provider posture signal may bypass the canonical registry | Pay-as-you-go is listed at `$7/user/month`, no user limit, 100% uptime SLA, chat/ticket support, and up to 30-day standard logs. One-owner invoice/minimum must be verified before purchase | **RECOMMENDED** — Web/Mac edge gate |
| **Cloudflare Free** | Same useful proof-of-concept class for fewer than 50 users | No paid SLA; community support; most Access/Gateway activity retention only up to 24 hours | `$0 forever` within published user limit | **VIABLE ALTERNATIVE** — proof/development only |
| **Apple App Attest** | Native app creates a hardware-backed key, Apple certifies a legitimate app instance, and the server verifies challenge-bound attestations/assertions. The key can be mapped to one iPhone `AdminDevice` | Apple says no single policy eliminates fraud and App Attest cannot definitively identify a compromised OS. Not all devices support it. Keys do not survive reinstall, migration, or restore. `isSupported` is false on Mac, including Mac Catalyst and iOS/iPadOS apps on Apple silicon | Included with eligible Apple platform development; requires native app and server validation. Apple Developer Program is `$99/year` | **RECOMMENDED** — iPhone signal; fail closed for sensitive Admin when unsupported or invalid |
| **Apple Business built-in MDM** | Current Apple Business service is free and provides built-in device management, Blueprints, managed accounts, app distribution, and Admin API capabilities | Current source does not establish that built-in MDM exposes Managed Device Attestation/ACME evidence directly to Blowin' Smoke's relying party | `$0`; optional iCloud storage starts `$0.99/user/month`; AppleCare+ starts `$6.99/device/month` or `$13.99/user/month` for up to three devices | **RECOMMENDED** — supporting device management, not final trust evidence |
| **Apple Managed Device Attestation/ACME** | On supported managed Apple hardware, supplies Secure-Enclave-bound identity and attested properties that an ACME server/device manager/relying party can evaluate; can support deauthorization and reauthorization | Requires an exact MDM, ACME/CA, certificate-lifecycle, and relying-party integration. Fresh `DeviceInformation` attestation is currently limited to one per device every seven days. Integration through Apple Business built-in MDM is not established | Material setup and certificate operations; provider/integration cost **PRICE NOT VERIFIED** | **BLOCKED — EVIDENCE INSUFFICIENT** for launch; possible later hardening |
| **Passkey/WebAuthn alone** | Phishing-resistant account authentication; W3C backup-eligibility/backed-up flags can distinguish some credential classes | Synced passkeys travel between devices; roaming keys can be inserted into an unapproved device; neither proves endpoint approval or OS integrity | Included in selected identity service | **REJECTED** as sole device gate |
| **mTLS client certificate** | Can add certificate possession to Cloudflare Access policy | Exportable certificates are not necessarily hardware-bound; CA issuance, renewal, and revocation add burden; certificate possession does not prove OS integrity | Provider/CA cost **PRICE NOT VERIFIED** | **VIABLE ALTERNATIVE** — optional later defense-in-depth |

## 5. Canonical `AdminDevice` contract

The application-owned device record is not provider metadata. Minimum fields should support:

- stable `admin_device_id` and `admin_actor_id`;
- display label that is never used as proof;
- platform and surface: Web/Mac, native iPhone, or a later separately reviewed client;
- lifecycle state: `PENDING`, `ACTIVE`, `SUSPENDED`, `REVOKED`;
- approved application/client identifier and minimum supported build where applicable;
- Auth0 subject alias and enrolled assurance class;
- Cloudflare physical-device/registration reference for Web/Mac where applicable;
- App Attest key identifier and verified public-key reference for native iPhone where applicable;
- approval actor, approval time, purpose, and approval evidence;
- last successful posture/attestation, last seen, review due, and staleness status;
- suspension/revocation time, authority, reason, incident/case reference, and replaced-device lineage;
- immutable audit references for enrollment, activation, challenge failure, suspension, revocation, and recovery.

Private keys, raw recovery codes, refresh tokens, provider administrative secrets, and reusable attestation challenges do not belong in this record. External identifiers are aliases. A deleted or recreated Cloudflare registration and a regenerated App Attest key are new credential bindings requiring reconciliation and, normally, reapproval.

## 6. Fail-closed enrollment and admission

### 6.1 Initial owner bootstrap

Bootstrap is an attended ceremony, not an open sign-up route:

1. Create the single owner `AdminActor` through an authorized deployment/runbook after owner identity and contact channels are verified.
2. Configure the custom Auth0 domain and enroll the daily and sealed recovery FIDO2 keys.
3. Register the initial Mac/Web endpoint in Cloudflare WARP and create `AdminDevice(PENDING)`.
4. Verify Auth0 authentication, WARP/posture, the exact device reference, and bootstrap authority; activate the device through a one-time deployment ceremony recorded in canonical audit.
5. Enroll the native iPhone application separately. Generate and attest its App Attest key, bind it to `AdminDevice(PENDING)`, and approve it from the already-active endpoint with fresh hardware-key verification.

Bootstrap authority must be removed or disabled after the initial ceremony. It must not remain as a universal administrative route.

### 6.2 New-device enrollment

An unknown endpoint receives only the minimum unauthenticated/authentication/enrollment response needed to establish its state. It receives no catalog, price, stock, supplier, purchase-order, COGS, audit, customer, wholesale, or protected-media payload.

Normal activation requires:

- successful Auth0 authentication at the required assurance;
- current WARP/posture evidence for Web/Mac, or verified App Attest enrollment for native iPhone;
- a new `PENDING` device record;
- approval from an existing `ACTIVE` endpoint;
- fresh FIDO2 security-key verification;
- an immutable preview of the device, platform, credential reference, requested scope, and approval consequence;
- a canonical activation event.

The requesting endpoint cannot approve itself.

### 6.3 Per-request admission

Every protected Admin request resolves:

```text
verified Auth0 issuer/audience/signature/expiry
+ active owner actor
+ required authentication assurance and recency
+ active provider session/revocation state
+ current Cloudflare Access/WARP posture where required
+ exact ACTIVE AdminDevice binding
+ supported platform/client/build
+ fresh App Attest assertion for selected native requests
+ exact capability and business scope
+ current resource state/version and required approval
-------------------------------------------------------
= ALLOW | DENY | STEP_UP_REQUIRED | APPROVAL_REQUIRED
```

Provider outage, posture outage, unknown device, stale client, failed App Attest, inconsistent credential binding, revoked factor, or audit inability never becomes a permissive fallback. Safe drafts may be retained locally or server-side only when their data classification and authorization allow it; the canonical mutation does not report success.

## 7. Revocation, loss, and recovery

### 7.1 Device or key loss

Revocation is multi-layered and idempotent:

1. Suspend or revoke the application `AdminDevice` immediately.
2. Revoke Auth0 sessions and refresh grants associated with the affected actor/device where identifiable; rotate or remove the lost authentication factor.
3. Revoke/delete the Cloudflare registration and remove the user's ability to re-enroll that endpoint when the risk requires it.
4. Revoke the App Attest key mapping and reject all future assertions from it.
5. Invalidate outstanding step-up/command grants, upload grants, and sensitive export links.
6. Notify the owner through an independently configured channel and create the canonical incident/recovery audit trail.

Cloudflare registration revocation alone is not enough because a still-eligible user can re-register. Auth0 logout alone is not enough because the device may obtain a new session. The application registry remains the immediate final deny control.

### 7.2 Reinstall, migration, restore, or replacement

Apple states that App Attest keys survive normal app updates but not app reinstall, device migration, or restore. These events create a new attestation key and return the iPhone endpoint to `PENDING`; apparently matching model, name, phone number, backup, or Apple Account does not restore `ACTIVE` status.

A replacement Mac likewise receives a distinct WARP registration and `AdminDevice`. Restoring browser data or an iCloud-synced passkey does not transfer device approval.

### 7.3 Owner-only recovery

One owner creates a real availability risk. The launch runbook must include:

- two physical FIDO2 keys, separated in storage;
- Auth0 recovery material stored offline and separately from both daily endpoints and keys;
- owner notifications for factor, session, and device changes;
- an all-devices-lost break-glass procedure that does not rely on email or SMS alone;
- a delay/cooling-off and independent business-identity evidence appropriate to the risk;
- global session, factor, device, and outstanding-grant revocation before new endpoint activation;
- post-recovery review and test evidence.

The exact break-glass authority, proof, cooling-off duration, and support obligations remain an **OPEN OPERATIONAL GATE**. Until they are approved and tested, recovery is not production ready. No provider recovery flow may silently activate an unknown application device.

## 8. High-risk step-up

Step-up applies at minimum to:

- device activation, suspension, revocation, and security configuration;
- role/capability changes and recovery execution;
- large or exceptional inventory corrections and reservation overrides;
- catalog publication, bulk operations, evidence replacement, and protected visibility changes;
- retail/wholesale price publication or financial correction;
- supplier, accounting, POS, and integration credential changes;
- sensitive export creation or retrieval.

The server requests a fresh Auth0 authorization ceremony bound to the intended assurance class. Auth0 documents that the `amr` claim may be absent from tokens issued through silent authentication or refresh even when earlier MFA occurred. Therefore the application must not infer current step-up from a remembered browser or old ID token. It must verify fresh authentication time, the required factor/assurance evidence, active `AdminDevice`, exact command scope, nonce/idempotency, short expiry, and one-time use where appropriate.

An Auth0 action or token proves only the authentication ceremony. It cannot authorize the commerce mutation. The owning domain still validates capability, object/division/location/channel scope, target version, proposed diff, reason, required approval, and durable audit/outbox.

## 9. Security honesty and known limits

- Auth0, Cloudflare, Apple, WebAuthn, MDM, and the application registry form defense in depth; none proves a perfectly uncompromised endpoint.
- Rooted, jailbroken, instrumented, malware-infected, privileged, or physically controlled environments may bypass some client-side controls. App Attest and posture reduce risk but do not justify an infallible-device claim.
- A physical FIDO key can be stolen; require its PIN/user verification and maintain immediate factor/device revocation.
- A synced passkey can appear on another Apple device by design. It is identity evidence, not approval of that device.
- WARP registration can be recreated by an eligible identity; attended enrollment and the application registry prevent silent reentry.
- App Attest is unavailable on Mac and unsupported on some Apple devices. Sensitive native Admin access fails closed rather than following Apple's consumer-oriented graceful-bypass sample.
- Managed Device Attestation is a promising hardware-bound managed-device control, but the exact MDM/ACME/relying-party integration is unproven for this stack.
- Auth0's five-day Essentials log retention and Cloudflare's provider logs are not canonical audit retention.
- Web and PWA surfaces remain ineligible for D3/D4 Private Wholesale protected payload regardless of owner role or approved Commerce Admin device.

## 10. Launch cost contribution

| Item | Current verified price | Cost class | Notes |
|---|---:|---|---|
| Auth0 Essentials | `$35/month` | Required fixed | One owner is far below 500 MAU; selected for Pro MFA/support/log stream rather than capacity |
| Cloudflare Zero Trust pay-as-you-go | `$7/user/month` listed | Required fixed, modeled | Model `$7/month` for one owner; verify billing cadence/minimum at purchase |
| Apple Developer Program | `$99/year` | Required fixed for distributed native iPhone work | `$8.25/month` equivalent |
| Apple Business built-in MDM | `$0` | Required/managed operations | Optional storage/support not required for this subtotal |
| Two Yubico FIDO2 Security Keys | `$58` before tax/shipping | One-time hardware | `$29` each; final connector/form factor must match owner devices |

Modeled recurring authentication/device baseline is **`$42/month + $99/year`**, or **`$50.25/month equivalent`**, plus `$58` one-time key hardware. Application engineering, external audit retention, devices, optional AppleCare/storage, and a later ACME/CA integration are excluded.

## 11. Exit and replacement plan

- Keep the stable `AdminActor`, roles, capabilities, device registry, audit, and all commerce identifiers in the canonical database.
- Store the Auth0 subject, Cloudflare device/registration identifiers, and App Attest key identifier as versioned external aliases.
- Export Auth0 profile/metadata regularly in a documented, encrypted format appropriate to one owner; test provider replacement before production renewal decisions.
- Treat Auth0 password-hash/MFA-secret export as support-mediated and not time-guaranteed. Do not design incident recovery around receiving it quickly.
- Expect security-key/passkey reenrollment during identity-provider migration; private passkey export is not established.
- Provider replacement must revoke old issuers, sessions, WARP policies, callbacks, secrets, and device aliases without deleting canonical actor/device/audit history.
- Maintain a synthetic migration drill; no production owner credential is used in repository proof artifacts.

Lock-in is **medium**: OIDC/WebAuthn standards and canonical application authority reduce business-data lock-in, but authentication enrollment, Actions, hosted login behavior, session semantics, and provider device identifiers require migration work.

## 12. Evidence records

Every record below was accessed **2026-08-17**.

### AUTH-01 — Auth0 plans and included limits

- **SOURCE:** Auth0 Pricing
- **URL:** https://auth0.com/pricing?pm=true
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Essentials is `$35/month` for up to 500 MAU and includes Pro MFA, one custom domain, one log stream, five-day log retention, separate production/development environments, and standard support; passkeys are included.
- **WHAT IT DOES NOT ESTABLISH:** It does not prove Blowin' Smoke's configuration, execution behavior, device approval, or long-term price. Factor availability still depends on plan/configuration.

### AUTH-02 — Auth0 MFA factors and policy

- **SOURCE:** Auth0 Multi-Factor Authentication Factors; Configure WebAuthn with Security Keys for MFA
- **URLS:** https://auth0.com/docs/secure/multi-factor-authentication/multi-factor-authentication-factors ; https://auth0.com/docs/secure/multi-factor-authentication/fido-authentication-with-webauthn/configure-webauthn-security-keys-for-mfa
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Auth0 supports WebAuthn security keys, device biometrics, TOTP, push, recovery codes, Actions-based policies, and security-key user-verification settings. Requiring a FIDO2 PIN supplies the strongest documented security-key user-verification setting.
- **WHAT IT DOES NOT ESTABLISH:** MFA does not establish that the host device is approved or uncompromised. Availability and browser behavior require configuration and testing.

### AUTH-03 — Native/web passkeys and custom-domain requirement

- **SOURCE:** Auth0 Authentication API, Start a Passkey Challenge
- **URL:** https://auth0.com/docs/api/authentication/passkey/challenge
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Auth0 exposes a first-party OIDC passkey challenge for native and web applications; calls must use the tenant custom domain and return WebAuthn challenge parameters.
- **WHAT IT DOES NOT ESTABLISH:** It does not bind a synced passkey to one approved endpoint or establish App Attest/device posture.

### AUTH-04 — Step-up

- **SOURCE:** Auth0 Add Step-up Authentication; Configure Step-up Authentication for Web Apps
- **URLS:** https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication ; https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication/configure-step-up-authentication-for-web-apps
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** APIs can use scopes, tokens, and Actions to trigger stronger authentication, while web applications can examine authentication claims and trigger MFA. Auth0 documents `amr` exceptions for silent authentication/refresh-issued tokens.
- **WHAT IT DOES NOT ESTABLISH:** It does not authorize a commerce command, prove a device, or guarantee the required factor unless the tenant Action and server validation enforce it.

### AUTH-05 — Sessions and provider exit

- **SOURCE:** Auth0 Revoke Refresh Tokens; Bulk User Exports; Export Password Hashes and MFA Secrets; Export Data
- **URLS:** https://auth0.com/docs/secure/tokens/refresh-tokens/revoke-refresh-tokens ; https://auth0.com/docs/manage-users/user-migration/bulk-user-exports ; https://auth0.com/docs/manage-users/user-migration/export-password-hashes-and-mfa-secrets ; https://auth0.com/docs/troubleshoot/customer-support/manage-subscriptions/export-data
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Sessions/refresh grants can be revoked; normal user data can be exported; password hashes/MFA secrets require a paid, PGP-encrypted, support-mediated eligibility process without a guaranteed ETA.
- **WHAT IT DOES NOT ESTABLISH:** Revocation instantly invalidates every already-issued access token; passkey private credentials are exportable; or a credential export request will qualify on a required date.

### ALT-01 — WorkOS AuthKit

- **SOURCE:** WorkOS Pricing; Passkeys; Reauthentication; Applications
- **URLS:** https://workos.com/pricing ; https://workos.com/docs/authkit/passkeys/passkey-configuration/multi-factor-auth ; https://workos.com/docs/authkit/reauthentication ; https://workos.com/docs/authkit/applications
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Current AuthKit pricing, hosted-UI passkeys, passkey-as-MFA semantics, fresh `auth_time`/`max_age`, and shared users with platform-specific application/session configuration.
- **WHAT IT DOES NOT ESTABLISH:** Mandatory roaming hardware-key policy, device approval, or complete outward export of passkey credentials.

### ALT-02 — Clerk

- **SOURCE:** Clerk Pricing; Reverification for Sensitive Actions
- **URLS:** https://clerk.com/pricing ; https://clerk.com/docs/guides/secure/reverification
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Pro pricing, passkeys/MFA, logs, device tracking/revocation, user-data export, and documented reverification behavior. Reverification supports password/email/phone/TOTP/backup factors and may downgrade to first factor when the requested second factor is unavailable.
- **WHAT IT DOES NOT ESTABLISH:** A fail-closed passkey-based high-risk step-up or approved physical endpoint.

### DEVICE-01 — Passkey synchronization versus physical key

- **SOURCE:** Apple Public-Private Key Authentication; Apple Passkeys Overview; W3C WebAuthn Level 3
- **URLS:** https://developer.apple.com/documentation/authenticationservices/public-private-key-authentication ; https://developer.apple.com/passkeys/ ; https://www.w3.org/TR/webauthn-3/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Apple platform passkeys sync through iCloud Keychain and can be shared/imported/exported; physical security keys retain credentials on physical media. WebAuthn defines backup-eligibility and backup-state flags.
- **WHAT IT DOES NOT ESTABLISH:** Either credential type proves approval or integrity of the endpoint presenting it.

### DEVICE-02 — Cloudflare Access/WARP posture and lifecycle

- **SOURCE:** Cloudflare Zero Trust Pricing; Access Policies; Require WARP; Device Registration; Zero Trust Logs
- **URLS:** https://www.cloudflare.com/plans/zero-trust-services/ ; https://developers.cloudflare.com/cloudflare-one/access-controls/policies/ ; https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/client-checks/require-warp/ ; https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/device-registration/ ; https://developers.cloudflare.com/cloudflare-one/insights/logs/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Current free/pay-as-you-go pricing, paid SLA/support/log differences, identity-plus-posture policies, mandatory WARP checks, registration keys, registration revocation, and log-retention classes.
- **WHAT IT DOES NOT ESTABLISH:** Perfect OS integrity, immutable physical identity, one-user billing minimum, or permanent denial when the identity is still allowed to re-enroll.

### DEVICE-03 — App Attest

- **SOURCE:** Apple Establishing Your App's Integrity; Validating Apps That Connect to Your Server; DeviceCheck; `isSupported`
- **URLS:** https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity ; https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server ; https://developer.apple.com/documentation/devicecheck ; https://developer.apple.com/documentation/devicecheck/dcappattestservice/issupported
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Secure-Enclave-backed per-user/per-device app-instance keys, server challenge/attestation/assertion validation, reinstall/migration/restore key loss, imperfect fraud assurance, and lack of Mac support.
- **WHAT IT DOES NOT ESTABLISH:** An infallible jailbreak/compromise verdict, Mac admission, support on every iPhone, or automatic approval in Blowin' Smoke.

### DEVICE-04 — Managed Apple devices

- **SOURCE:** Apple Managed Device Attestation; Deploy Managed Device Attestation; Apple Business announcement
- **URLS:** https://support.apple.com/en-ie/guide/deployment/dep28afbde6a/web ; https://support.apple.com/en-lamr/guide/deployment/dep54e5ac1fd/web ; https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Managed Device Attestation hardware/OS scope, Secure-Enclave-bound ACME identity, relying-party patterns, revocation considerations, freshness limits, and current free Apple Business built-in MDM pricing/features.
- **WHAT IT DOES NOT ESTABLISH:** That Apple Business's built-in MDM exposes an immediately usable ACME/attestation integration to this custom Admin API or that such integration has been execution-tested.

### DEVICE-05 — Hardware-key price and capability

- **SOURCE:** Yubico Security Key Series
- **URL:** https://www.yubico.com/product/security-key-series/security-key-nfc-by-yubico-black/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Current `$29` list price for USB-A NFC and USB-C NFC FIDO-only keys and support for FIDO2/WebAuthn hardware-bound credentials.
- **WHAT IT DOES NOT ESTABLISH:** Shipping/tax, the final connector choice, owner possession, Auth0 configuration, or protection after theft without PIN/user verification.

## 13. Status and next proof gate

| Item | Status |
|---|---|
| Identity provider | **RECOMMENDED — Auth0 Essentials** |
| Web/Mac edge device gate | **RECOMMENDED — Cloudflare paid Access/WARP posture** |
| Final approved-device authority | **REQUIRED — canonical application `AdminDevice` registry** |
| Native iPhone attestation | **RECOMMENDED — App Attest plus manual activation** |
| Managed Apple hardware attestation | **CONDITIONAL LATER HARDENING** |
| Enrollment/revocation/recovery model | **DEFINED FOR IMPLEMENTATION PROOF; NOT EXECUTED** |
| Production Admin access | **NOT AUTHORIZED** |
| Private Wholesale protected payload | **NOT AUTHORIZED; unchanged separate gate** |

The next security proof must execute synthetic enrollment, normal admission, unknown-device denial, stale-client denial, WARP removal, WARP re-registration, App Attest failure/reinstall, session/factor revocation, lost-device recovery, all-devices-lost recovery, provider outage, step-up factor selection, token replay, and canonical audit-failure tests. Documentation and provider availability alone do not constitute production approval.
