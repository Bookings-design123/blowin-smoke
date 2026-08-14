# Public Web, Onion, Session, and Delivery Hub Assurance

**Document role:** Feasibility boundary for the normal entrance, optional Onion entrance, customer privacy, sessions, and capability links
**Architecture rule:** Two entrances; one canonical commerce truth; no anonymity claim

## 1. Public web is the primary security baseline

Ordinary customers must receive the complete security posture in a supported modern browser without Tor, VPN, extension, or app. The normal entrance therefore requires the same canonical authorization, price, inventory, eligibility, order, payment, fulfillment, consent, correction, and audit controls that any optional Onion entrance receives.

**Feasibility:** `PASS`, implementation evidence required.

The public site must not:

- imply that customers need privacy software to be safe;
- reserve meaningful data minimization or secure sessions for Tor users;
- load third parties before consent/authority simply because that is common retail practice;
- log or analyze sensitive payloads;
- weaken the normal entrance to make Onion appear more private;
- turn a security/privacy differentiator into absolute anonymity, deletion, or zero-tracking claims.

## 2. Data minimization assurance

### Data Blowin' Smoke should never retain by default

- E2EE message/attachment plaintext or content keys at the intermediary;
- passwords, saved recovery codes, OTPs, reset/capability tokens, session secrets, or API/key material in plaintext;
- full payment credentials or raw payment authentication data;
- raw identity/age evidence unless a specifically approved method and retention exception requires it;
- precise BSDN GPS outside active assignment, exact purpose, bounded ingestion, and approved short lifecycle;
- off-duty driver location;
- full Delivery Hub bootstrap/session values or private-media bearer credentials in logs, analytics, referrers, support, or notifications;
- raw proof media, signatures, IDs, addresses, route detail, handoff context, or unrestricted free text beyond a separately approved purpose/schedule;
- E2EE or wholesale browsing/content for advertising, model training, profiling, or ordinary product analytics;
- routine public/Onion cross-entrance correlation identifiers;
- copied phone negotiation content or call recordings without qualified consent/authority;
- unsupported product claims or inferred identity/intent;
- third-party copies not justified by an adapter disclosure contract.

“Never by default” is not “never under any circumstance.” Any exception requires a named owner, purpose, authority/lawful basis, D-class, minimum fields, access, provider boundary, retention/hold/backup expiry, correction/export/deletion, incident behavior, and customer/workforce notice as applicable.

### Evidence required for “we minimize data”

- a field-by-field inventory across canonical stores, projections, caches, logs, analytics, exports, support, providers, endpoints, and backups;
- purpose/authority and collection-time disclosure;
- default-off nonessential collection;
- numeric lifecycle approved by qualified authority;
- tested deletion/hold/provider propagation and backup expiry;
- telemetry payload inspection and prohibited-field tests;
- documented corrections and exceptions;
- periodic evidence that actual flows match the register.

## 3. Onion protocol feasibility

**Optional Onion entrance:** `PASS` at protocol level.
**Production origin isolation:** `CONDITIONAL`.

Tor v3 Onion Services provide an authenticated, encrypted route from Tor client to the Onion Service, and the onion address is bound to the service identity public key. See the [Tor protocol overview](https://spec.torproject.org/rend-spec/protocol-overview.html) and [Onion Service overview](https://community.torproject.org/onion-services/overview/index.html).

Tor does not:

- make an authenticated account unknown to Blowin' Smoke;
- hide identity, phone, address, payment, age, pickup, or delivery information the customer provides;
- protect plaintext after it reaches application/endpoints;
- prevent application/resource/session correlation;
- prove legal eligibility or make shipping/delivery anonymous;
- eliminate timing/volume/endpoint/commerce metadata;
- protect a leaked Onion identity key from impersonation.

## 4. Required Onion topology properties

Feasibility topology:

```text
TOR CLIENT
  -> TOR NETWORK
  -> ISOLATED ONION GATEWAY / VHOST
  -> PROTECTED AUTHENTICATED UPSTREAM
  -> SAME GOVERNED APPLICATION SERVICES
  -> SAME CANONICAL DOMAIN OWNERS
```

Required controls:

1. Onion gateway/vhost isolated from the public edge; separate service boundary/Unix socket or equivalent where practical, consistent with [Tor setup guidance](https://community.torproject.org/onion-services/setup/).
2. Canonical origin has no unintended direct public exposure; network policy permits only approved ingress.
3. Relative same-Onion resource links; no error, redirect, header, DNS, certificate, source map, log, or asset URL revealing protected infrastructure.
4. Onion identity key held in a purpose-separated protected boundary, not a general application secret. Backup/recovery, access, incident, and replacement are tested.
5. Identity-key rotation represented as an authenticated address migration—not transparent in-place rotation—because the address derives from the public key.
6. Same canonical commerce owners and rules; no shadow database, inventory, price, eligibility, order, payment, fulfillment, consent, correction, or audit.
7. Privacy-minimized Onion operations telemetry sufficient for availability/abuse/incident response, never advertising correlation.
8. No automatic clearnet redirect. Any boundary exit is an explicit warned user action.
9. HTTPS-over-Onion, `Onion-Location`, client authorization, monitoring, outage, key continuity, and recovery are decisions tested at the next proof gate, not assumed.

Tor's [HTTPS-over-Onion guidance](https://community.torproject.org/onion-services/advanced/https/) notes that complex HTTP/HTTPS handling can leak cookies and recommends relative links; that choice requires exact configuration tests.

## 5. Onion browser-resource boundary

A privacy-preserving Onion document must not make ordinary browser-visible requests to these third parties by default:

- analytics, advertising, pixels, attribution, tag managers;
- remote fonts, images, avatars, social embeds;
- chat/support widgets or session-replay tools;
- CAPTCHA/bot providers;
- maps/geocoding browser SDKs;
- external video players, media CDNs, DRM/license systems;
- federated identity/login widgets;
- payment, age-verification, shipping, or tax browser widgets;
- client-side error/performance telemetry;
- push/notification registration before explicit need and review.

Third-party scripts execute with substantial host-page privilege and resource calls reveal correlation data. See [OWASP Third-Party JavaScript Management](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html).

An external capability must be one of:

1. self-hosted under the Onion boundary with license/update/integrity controls;
2. server-side adapter/proxy that receives only approved purpose-bounded fields and never exposes the canonical origin;
3. explicit warned transition to a named external/clearnet boundary, with no session/token transfer beyond the minimum authorized data;
4. unavailable on Onion with a clear safe alternative—not silently degraded or falsified.

## 6. Onion client compatibility

Tor Browser security levels can restrict JavaScript and make HTML5 media click-to-play. Full browser E2EE using WebAssembly/IndexedDB and 4K streaming must be tested at every claimed security level; “works over Onion” cannot mean only that a static login page loads.

Requirements:

- disclose the tested Tor Browser/version/security-level support boundary;
- fail closed with a plain explanation when E2EE state cannot initialize;
- provide a progressively enhanced low-JavaScript route for public/product/account information where possible;
- make 4K explicit and offer lower renditions;
- never silently send media to a clearnet CDN;
- do not assume PWA installation in Tor Browser;
- do not claim a native app uses Onion unless a separate audited Tor transport exists.

Current Tor Browser known-issues documentation states WebAuthn/U2F is disabled. Therefore Onion authentication cannot rely exclusively on passkeys/hardware WebAuthn. A separately reviewed strong alternative must remain available, and staff/privileged access assurance cannot be weakened merely to gain Onion compatibility.

Sources:

- [Tor Browser security levels](https://support.torproject.org/tor-browser/features/security-levels/)
- [Tor Browser known issues](https://support.torproject.org/tor-browser/encountering-issues/known-issues/)
- [Tor Browser speed](https://support.torproject.org/tor-browser/general/tor-browser-speed/)

## 7. Public/Onion account and session relationship

**Safest default:** separate browser sessions with the same canonical account authority.

| Property | Normal web | Onion | Relationship |
|---|---|---|---|
| Cookie namespace | Public origin scoped | Onion origin scoped | Never shared directly |
| Session identifier | Independent, rotated | Independent, rotated | Server may map both to same account after authentication |
| CSRF state | Public session scoped | Onion session scoped | Never transferred |
| Authentication ceremony | Explicit | Explicit, Tor-compatible | Reauthentication when crossing entrance |
| E2EE endpoint | Exact enrolled endpoint | Exact enrolled endpoint | An endpoint key is not implied by account session |
| Analytics/telemetry | Minimized/consented | Stricter, operational only | No routine cross-entrance marketing correlation |
| Transition | Explicit user action | Explicit user action | Never bearer session/token in URL |

Signing into both entrances lets Blowin' Smoke associate both sessions with the account. That is honest account behavior, not anonymous use. [Tor's safe-use guidance](https://support.torproject.org/tor-browser/security/using-tb-safely/) states that signing in or providing identifying information identifies the user to the site.

An optional future session-transfer ceremony would require a one-time purpose-bound grant, explicit confirmation on both origins, reauthentication, rotation, no URL token, and full abuse testing. SEC-02 recommends **no transfer by default**.

## 8. Onion assurance test plan

Before any deployment decision, independent testing must cover:

- direct origin discovery and network reachability;
- DNS and certificate transparency/configuration exposure;
- every HTML/CSS/JS/font/image/video/caption/playlist/segment/license/fetch/WebSocket/event/push/error request;
- absolute URLs, redirects, canonical/Open Graph links, source maps, stack traces, headers, server banners, error pages and email links;
- public-to-Onion and Onion-to-public cookie/session/CSRF confusion;
- authentication, logout, recovery, key/device verification and security notifications;
- Tor Browser Standard/Safer/Safest behavior, JavaScript disabled, media blocked, storage cleared;
- E2EE WASM/IndexedDB availability, corruption, update and fail-closed states;
- upstream outage, Tor outage, denial of service, clock error and stale projection;
- Onion identity-key backup, compromise, replacement/address migration and authenticated customer notice;
- monitoring/log payload minimization and incident usefulness;
- third-party/adaptor boundary exits;
- parity of canonical inventory/price/eligibility/order/payment/fulfillment/consent/correction/audit results.

Origin isolation stays `CONDITIONAL` until these tests pass against the deployed topology.

## 9. Delivery Hub capability assurance

SEC-01 permits one narrow URL exception: an initial opaque Delivery Hub bootstrap capability may arrive in a link because the customer needs an entry point. It is never an account, identity, proof of age/handoff/custody/completion, or authority for sensitive writes.

### Required bootstrap flow

1. Generate a high-entropy, non-sequential, opaque capability with no customer/order/delivery ID or PII.
2. Scope to exact delivery, purpose, initial action set, issuance context, expiry, and revocation state.
3. Notification uses no sensitive preview/plaintext and the narrowest provider disclosure.
4. Entry endpoint has no third-party resources and sends strict referrer/cache/security policy.
5. Server validates current delivery/purpose/revocation/rate state and exchanges the capability promptly for a narrow server session.
6. Navigate/replace history to a clean same-origin URL so the bootstrap value does not remain visible.
7. Store only a protected verifier/hash or reference; redact from edge/app/security logs, traces, analytics, support, errors, and audit payload.
8. Rotate/revoke on use or risk according to the approved re-entry policy; exact multiple-device/lost-link behavior remains an implementation-gate decision.

### Capability-only action boundary

Potentially low-risk views/actions remain `BLOCKED` until approved. Capability possession alone must never authorize:

- account access or identity/contact/address change;
- payment, tip, refund, cancellation, order modification;
- age qualification or raw identity evidence;
- delivery handoff authorization;
- custody, proof, completion, exception or return outcome;
- raw route/precise GPS/driver/private proof exposure;
- wholesale room/message/manifest access.

Sensitive actions require the governing authenticated/step-up authority, current state/version, idempotency/replay protection, reason, and durable audit.

## 10. Final outcomes

| Capability | Outcome |
|---|---|
| Secure ordinary-browser retail without Tor/app | `PASS` feasibility |
| Aggressive data minimization | `CONDITIONAL` on field/purpose/policy evidence |
| Optional Onion protocol entrance | `PASS` feasibility |
| Production Onion origin isolation | `CONDITIONAL` on exact topology/tests/operations |
| Same canonical truth across entrances | `PASS` and mandatory |
| Silent shared browser session across origins | Not recommended; `BLOCKED` absent separate approval |
| Exclusive WebAuthn-only Onion login | `FAIL` under current documented Tor Browser support |
| Full E2EE/4K compatibility at every Tor security level | `BLOCKED`; must be tested and disclosed |
| Delivery Hub narrow bootstrap capability | `CONDITIONAL` |
| Capability-only sensitive writes | `FAIL` |
| Anonymous order/delivery because Onion is used | `FAIL` and prohibited claim |
