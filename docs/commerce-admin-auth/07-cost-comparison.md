# COM-ADM-02B — Cost Comparison

## 1. Cost rules

- Current public list prices were accessed 2026-08-17.
- Monthly provider cost, annual provider cost, one-time hardware, optional future cost, and excluded labor are separated.
- A free or cheaper price receives no security credit for an unproved capability.
- Tax, shipping, domain registration, development, security review, support labor, and future price changes are excluded.
- Authentication cost does not include the application-owned `AdminDevice`, BFF session, authorization, audit, notification, or recovery-containment work required under every candidate.

## 2. One-owner Day-1 comparison

| Candidate | Required provider plan | Monthly provider | Annual provider | Recommended/required hardware | First-year auth cash cost before tax/shipping | Qualification |
|---|---|---:|---:|---:|---:|---|
| **Auth0** | Essentials | **$35** | **$420** at published monthly rate | **One $29 Security Key C NFC** + offline recovery code | **$449** | **Selected; execution proof pending** |
| WorkOS — shared domain | AuthKit core | $0 | $0 | Compliant roaming/second credential not established | Not meaningfully calculable | Rejected: hard credential/recovery/step-up gaps |
| WorkOS — production custom domain | AuthKit + custom domain | $99 | $1,188 | Compliant roaming/second credential not established | At least $1,188 | Rejected; costs more than Auth0 and preserves gaps |
| Clerk — month-to-month | Pro | $25 | $300 | Two reference keys: $58 | $358 | Conditional; conflicting step-up evidence and recovery gap |
| Clerk — annual commitment | Pro | $20 effective | $240 prepaid/billed annually | Two reference keys: $58 | $298 | Same non-qualification; annual commitment |
| Application-owned WebAuthn | Mature library + owned identity layer | $0 | $0 | Three reference keys: $87 | $87 plus unpriced mandatory engineering/security work | Technically viable; R10 covered by sealed third key; rejected for burden |

The WorkOS custom domain is documented as recommended before production/passkey enrollment, not technically mandatory. Both its $0 and $99 scenarios are shown so cost is not manipulated.

## 3. Hardware decision

The reference Yubico Security Key C NFC was listed at **$29 each** and supports FIDO2/WebAuthn over USB-C/NFC. Exact owner iPhone/Mac/Safari/key compatibility remains a proof requirement.

| Hardware scenario | Cost | Treatment |
|---|---:|---|
| Selected Auth0 ordinary key | **$29 once** | Counted |
| Auth0 physically separate recovery code | **$0 provider-generated** | Counted as recovery credential; bearer-secret risk governed |
| Second Auth0 application-user key | $29 | **Not counted/recommended under current evidence:** Auth0's specific guidance says a second YubiKey cannot currently be enrolled for this factor |
| Separate Auth0 control-plane key | **$29 contingency** | Not counted as already required; add if dashboard/control-plane proof finds that reusing the selected physical key across distinct RPs is unsafe or unsupported |
| Two-key Clerk baseline | **$58 once** | Included in Clerk candidate comparison |
| Three-key application-owned model | **$87 once** | Two active/backup keys plus the sealed recovery key required to cover R10; all-three-key recovery policy remains |

COM-ADM-02A previously carried $58 for two keys as a one-time planning item. COM-ADM-02B supersedes that exact application-user assumption with **$29 for one enrolled key plus one offline recovery code** and retains another **$29 control-plane contingency** if proof requires dedicated tenant hardware. This changes no monthly stack range.

## 4. Selected annual economics

| Item | Amount |
|---|---:|
| Auth0 Essentials provider cost | **$35/month** |
| Auth0 provider cost at 12 published monthly payments | **$420/year** |
| Selected security key | **$29 once** |
| Explicit control-plane hardware contingency | **$29 additional if proof requires** |
| Selected first-year authentication cash cost | **$449 before tax/shipping** |
| Auth0 monthly cost saved | **$0** |

Auth0's public page did not establish a separate annual-prepayment checkout price. `$420/year` is arithmetic on the published $35 monthly price, not a claim about an unverified annual discount.

## 5. Counterfactual monthly stack effect

These rows expose the economics; rejected alternatives do not become recommendations.

| Auth direction | Change versus Auth0 | Counterfactual absolute stack floor | Counterfactual recommended stack | Decision |
|---|---:|---:|---:|---|
| **Auth0 Essentials** | **$0** | **$59–$75/month** | **$76–$120/month** | **Selected** |
| Clerk Pro month-to-month | −$10/month | $49–$65/month | $66–$110/month | Not selected; save only after hard proof |
| Clerk Pro annual effective | −$15/month | $44–$60/month effective | $61–$105/month effective | Not selected; annual commitment and same proof gap |
| WorkOS shared domain | −$35/month | $24–$40/month | $41–$85/month | Not selected; hard gaps |
| WorkOS custom domain | +$64/month | $123–$139/month | $140–$184/month | Not selected |
| Application-owned WebAuthn | −$35/month before labor | $24–$40/month before labor | $41–$85/month before labor | Not selected; $87 hardware and mandatory labor/security cost omitted from monthly range |

## 6. Why the $35 is justified

The relevant comparison is not `$35 versus $0`; it is `$35 versus owning or accepting unresolved identity-security responsibilities`. Auth0 Free already supplies a custom domain, basic attack protection, limited Actions, and one-day logs; those do not justify the upgrade. Essentials is justified by the Pro MFA roaming security-key factor/required-UV path plus log streaming and longer retention, support, and safer environment/extensibility capacity around the required exact-factor and recovery policies.

It does **not** remove application work for secure sessions, CSRF, approved devices, capabilities, command binding, audit, notification, recovery lock, or outage behavior. Those costs exist under every hosted option and are not attributed to the Auth0 subscription.

## 7. Optional future costs

| Future event | Potential cost direction | Decision now |
|---|---|---|
| Owner + staff identities | Auth0 Essentials capacity already exceeds initial headcount; individual keys add hardware cost | No staff account or hardware purchase authorized |
| Need two simultaneously enrolled roaming keys per user | May require provider change or application-owned credential layer | Trigger a new evidence/proof decision; do not falsely claim support |
| Enterprise provider session API / advanced attack protection / longer logs | Higher Auth0 plan or separate tooling | Not needed Day 1; canonical session/audit remains application-owned |
| Provider exit | Engineering for export, re-enrollment, cutover, and revocation | Plan/test before material scale; not purchased here |

## 8. Cost evidence

| Source | URL | Establishes | Does not establish |
|---|---|---|---|
| Auth0 pricing | https://auth0.com/pricing | Free baseline and Essentials' $35/month incremental Pro MFA, log stream/retention, support, and capacity distinctions | Final invoice/tax, annual discount, or configured assurance |
| WorkOS pricing | https://workos.com/pricing | AuthKit core $0; custom domain $99/month | Qualification or final invoice |
| Clerk pricing | https://clerk.com/pricing | Pro $25 month-to-month or $20/month billed annually; required production passkey/MFA features | Downgrade behavior or final invoice |
| Yubico Security Key C NFC | https://www.yubico.com/product/security-key-series/security-key-c-nfc-by-yubico-black/ | Reference key $29 | Tax/shipping, future price, exact target proof |

## 9. Cost conclusion

The authentication decision does not change COM-ADM-02A's recurring budget: the absolute Day-1 stack remains **$59–$75/month**, and the recommended Day-1 range remains **$76–$120/month**. The selected application-user hardware is one $29 key rather than two enrolled application-user keys. Keep a visible $29 control-plane contingency; if its proof requires a dedicated second key, the prior $58 one-time hardware envelope is restored without changing monthly cost.
