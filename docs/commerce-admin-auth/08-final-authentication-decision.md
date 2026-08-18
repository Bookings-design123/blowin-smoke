# COM-ADM-02B — Final Authentication Decision

## 1. Selected decision

# KEEP AUTH0

**Plan:** Auth0 Essentials

**Day-1 provider cost:** $35/month; $420/year at the published monthly rate

**One-time selected hardware:** one Yubico Security Key C NFC at $29 before tax/shipping

**Ordinary factor:** Auth0 `webauthn-roaming`, `User Verification: Required`, FIDO2 PIN

**Independent recovery credential:** one physically isolated Auth0 recovery code, recovery-only

**Production state:** not implemented and not authorized

## 2. Why the winner wins

Auth0 is the only reviewed hosted candidate whose current official evidence jointly supports the selected Pro MFA roaming security-key factor, required FIDO2 user verification, factor-specific challenge, fresh reauthentication evidence, managed recovery mechanisms, a log stream/support path, and a practical future staff lifecycle. Auth0 Free already includes a custom domain, basic attack protection, limited Actions, one-day logs, multiple database passkeys, and a detectable passkey authentication method; those baseline features are not counted as value uniquely purchased by Essentials. Free remains blocked because current evidence does not establish hardware-roaming-only enforcement, two physically independent keys, safe non-password recovery/enrollment boundaries, or the exact high-risk policy required here.

It has a material limitation: one application user cannot currently enroll two YubiKeys for the WebAuthn security-key factor. The selected system therefore meets the two-independent-credential requirement with one UV-required hardware key plus one offline recovery code, not the preferred two-key arrangement. Recovery is a declared temporary assurance downgrade and must be contained by the application.

That containment cannot depend on an asynchronous log. The ordinary Auth0 client challenges only `webauthn-roaming`. A distinct recovery client challenges only `recovery-code`; the following Action checks the completed factor and client synchronously, then emits only recovery-scoped evidence. It has no commerce audience and cannot create an ordinary Admin session. Missing or mismatched method/client/audience state denies. Auth0 documents each building block; exact end-to-end behavior and sole-key replacement remain execution-proof gates.

The subscription is retained because moving to WorkOS or Clerk would save money before proving hard factor/recovery/step-up properties, while moving to application-owned WebAuthn would transfer the entire identity-provider and recovery burden for only $420/year.

## 3. Weighted decision

Scores are points earned within each fixed weight, not unweighted ratings. A score cannot waive a hard gate.

| Candidate | Security 30 | Recovery 20 | Implementation / maintenance 15 | Step-up / session 10 | Device compatibility 10 | Exit 5 | Staff 5 | Cost 5 | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **Auth0 Essentials** | 27 | 15 | 13 | 8 | 8 | 4 | 5 | 3 | **83** |
| WorkOS AuthKit + recommended custom domain | 21 | 7 | 13 | 6 | 5 | 2 | 5 | 2 | **61** |
| Clerk Pro | 21 | 9 | 13 | 6 | 7 | 2 | 5 | 5 | **68** |
| Application-owned WebAuthn | 25 | 14 | 5 | 8 | 7 | 5 | 4 | 5 | **73** |

A successful passkey-step-up proof could materially improve Clerk, but has not occurred.

Auth0 does not receive a perfect recovery or session score: the recovery code is a bearer secret, two enrolled keys are unavailable, and provider session enumeration/revocation is Enterprise-only. Those limitations remain visible rather than being hidden to make the winner look stronger.

## 4. Exact selected architecture

```text
OWNER
  -> Auth0 password identifier flow
  -> mandatory roaming FIDO2 key + PIN / UV
  -> exact validated Auth0 callback evidence
  -> active AdminActor
  -> ACTIVE application AdminDevice
  -> opaque, revocable, bounded application session
  -> capability + object + version checks
  -> ordinary command

HIGH-RISK COMMAND
  -> new Auth0 transaction
  -> max_age/auth_time freshness
  -> forced webauthn-roaming challenge
  -> one-use application grant bound to exact command/input/device/session
  -> command or fail closed

KEY LOSS
  -> separate recovery-only client
  -> synchronous recovery-code factor + client check
  -> recovery-scoped evidence; no commerce audience/session
  -> application RECOVERY_LOCKED
  -> revoke/review old sessions and devices
  -> enroll replacement key + PIN
  -> notify + canonical audit
  -> restore ordinary access only after review
```

SMS, email, TOTP, synced passkey, platform passkey, user agent, a provider role, or a stale provider session is not an equivalent substitute.

## 5. What Blowin' Smoke still owns

Auth0 answers who proved control of the configured credentials. Blowin' Smoke remains responsible for:

- active/suspended/revoked AdminActor state;
- pending/active/suspended/revoked/expired `AdminDevice` state;
- opaque BFF sessions, protected cookies, rotation, lifetimes, logout, and revocation;
- CSRF/origin/fetch-metadata defenses;
- canonical roles, capabilities, object scope, and separation of duties;
- exact step-up freshness and one-use command binding;
- recovery lock, device/session cascade, and independent notification;
- durable canonical authentication/security audit;
- provider-event ingestion, delivery/reconciliation, and retention;
- provider outage, migration, and exit proof;
- target iPhone/Mac/Safari/security-key accessibility and behavior.

## 6. Why each alternative loses

### WorkOS AuthKit

WorkOS has a strong free offer and a UV passkey, but official evidence does not establish a roaming hardware-key policy, adding a second passkey, a phishing-resistant recovery path, passkey-specific reauthentication, or complete credential-change audit. A recommended production custom domain costs $99/month, more than Auth0, without closing those gaps.

### Clerk

Clerk Pro is only $25 month-to-month or $20/month on annual billing. It supports multiple passkeys and newly documents `verifyWithPasskey()` plus factor age. But initial signup requires another strategy, current evidence does not establish removal of the bootstrapped owner's password route, and the general reverification guide still excludes passkeys and allows downgrade behavior. Hardware-only enforcement and both-key-loss recovery are also unproved. The cheaper price cannot be selected before those paths pass an isolated proof.

### Application-owned WebAuthn

This path provides the clearest multi-key and exact-step-up architecture and best credential-record portability. Three $29 keys—daily, secondary, and sealed recovery—can cover R10 for $87. A mature library still does not provide bootstrap, all-three-key recovery, sessions, device admission, abuse defense, audit, compatibility, incident response, or patch ownership. The $420 annual subscription saving is disproportionate to assuming those responsibilities.

## 7. Recovery decision

The selected recovery code is not misrepresented as FIDO or phishing-resistant. It is accepted because the hard requirement asks for an independent physically separate credential, while two hardware keys are preferred rather than absolute. Recovery has these mandatory consequences:

1. enter recovery-only state;
2. deny ordinary and high-risk commerce commands;
3. review/revoke all old sessions and device state;
4. remove the lost/stolen factor;
5. enroll and test a replacement UV-required roaming key;
6. rotate security-sensitive application session state;
7. send independent notice;
8. write canonical audit;
9. capture the replacement shown on Auth0's Universal Login new-code screen once, retire the consumed recovery code, and reseal the replacement offline;
10. restore ordinary access only after completion.

The synchronous gate is explicit: the ordinary client accepts only a completed roaming-key challenge; the recovery client accepts only a completed recovery-code challenge and cannot mint an application commerce session. Provider logs are used for audit/reconciliation, never to decide whether the first protected payload may be returned.

If the key and offline recovery code are both unavailable, no self-service or email/SMS bypass exists. A separately approved attended identity-proofing/provider-support runbook is required and must still reestablish a key plus application device/session authority before commerce access.

Initial enrollment is a distinct attended one-time bootstrap. It explicitly enrolls `webauthn-roaming` and then explicitly enrolls `recovery-code` through the documented sequenced custom-enrollment flow; custom key enrollment does not issue the code automatically. It returns no commerce payload until the first key/PIN, sealed recovery code, first device, notification, and audit are complete, then the bootstrap authority is disabled. Later ordinary credential changes require a fresh existing key; only the synchronously authenticated recovery client may replace a lost key without that key, and only while commerce remains locked.

## 8. Approved-device compatibility

The selected roaming key can authenticate from an unknown browser. Therefore it is intentionally **not** device admission. A valid Auth0 response from an unregistered endpoint creates at most a pending application state and receives no Admin data until the separate `AdminDevice` policy is satisfied.

A synced consumer passkey is not enabled as an equivalent Day-1 factor because it can propagate through an ecosystem account. A device-bound passkey may be considered later for convenience, but it cannot replace `AdminDevice`, the physical recovery credential, or exact high-risk policy.

## 9. Future staff migration

Growth from one owner to owner plus staff does not share credentials or clone owner authority.

1. Create one provider identity per human.
2. Require an individual approved phishing-resistant credential policy and separate recovery enrollment for each account.
3. Create individual canonical AdminActor and `AdminDevice` records.
4. Grant least-privilege application roles/capabilities; provider roles are not canonical authority.
5. Attribute every session, step-up, command, approval, device, credential event, and recovery to the human actor.
6. Implement joiner/mover/leaver controls: supervised enrollment, capability change, device review, immediate session/device/identity disable, and durable audit.
7. Reevaluate multiple-key support, delegated recovery, dual control, plan limits, and hardware cost before the first staff activation.

No staff identity, role, device, or credential is created by this decision.

## 10. Residual risks

- Auth0 supports only one application-user YubiKey under the specific current guidance; recovery depends on a bearer code.
- Recovery-code theft can bypass the FIDO factor at the provider; physical isolation, recovery lock, notice, and immediate replacement are critical.
- Recovery rotates the bearer code; failure to capture and reseal the replacement creates a future lockout.
- The Auth0 tenant administrator can alter Actions, clients, factors, domains, and MFA state. Its phishing-resistant login, recovery, Management API grants, configuration-change audit/notice, and support-recovery boundary remain mandatory proof. Reserve another $29 key if the control plane requires separate hardware.
- Exact Auth0 factor challenge, method/freshness evidence, event ordering, and recovery-lock triggering remain execution-proof items.
- Essentials lacks Enterprise provider session-management APIs; local server session/device revocation must be authoritative.
- A stolen active browser session can perform bounded ordinary work until revoked/expired; fresh key step-up protects high-risk work, not every read.
- Exact iPhone/Mac/Safari/NFC/USB-C/PIN behavior is documentation-supported but untested here.
- Auth0 outage blocks login and high-risk step-up; no weak continuity path exists.
- Provider exit requires WebAuthn re-enrollment and a tested cutover; credential portability is not established.
- No recovery architecture can prove protection from owner coercion, malicious endpoint control, or physical compromise of both key and offline code.

## 11. Completion and next proof gate

COM-ADM-02B is complete as a research/cost decision. It changes no production application code, creates no account or credential, provisions no provider, and authorizes no implementation.

A later separately authorized proof must validate the exact selected Auth0 plan/configuration, custom domain, key/PIN on both owner endpoint classes, factor forcing, freshness/command binding, recovery containment, event ingestion, session/device/global revocation, CSRF, cookie replay, outage, accessibility, and provider exit. Any material failure reopens the provider decision; it does not authorize a weaker fallback.
