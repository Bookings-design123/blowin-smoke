# COM-ADM-02B — Day-1 Authentication Decision

**Status:** Decided
**Day-1 identity provider:** Auth0 Free
**Recurring Day-1 authentication cost:** $0
**Production implementation:** Not authorized

## Decision

Auth0 Free is the Day-1 identity provider. Its current Free tier includes passkeys/WebAuthn and is sufficient for the initial one-owner profile.

Day-1 authentication must:

- require phishing-resistant passkey/WebAuthn authentication;
- maintain two independent owner credentials/recovery keys, stored separately;
- require server-verified fresh authentication before every high-risk operation; and
- fail closed when mandatory identity, credential, freshness, device, session, authorization, or revocation state is missing, unknown, stale, revoked, or unsupported.

Blowin' Smoke retains application ownership of the `AdminDevice` registry, authorization, application sessions, device and session revocation, canonical audit, and command controls. Auth0 identity or authentication evidence never becomes business authorization by itself.

## Deferred paid tier

Auth0 Essentials is deferred. Paid Auth0 MFA, organization, and centralized log-streaming features are not Day-1 requirements.

Reevaluate a paid tier only when staff access, advanced MFA policy, higher limits, centralized log streaming, support, or another concrete requirement creates the need.

## Cost effect

- Auth0 recurring Day-1 cost: **$0**
- Absolute Day-1 planning floor: **approximately $24–$40/month**
- Recommended Day-1 planning budget: **approximately $41–$85/month**

## Scope

This record supersedes the expanded COM-ADM-02B provider-comparison package. It does not authorize a provider switch, production code, provider configuration, account creation, credential enrollment, procurement, pilot, launch, or changes to unrelated architecture.
