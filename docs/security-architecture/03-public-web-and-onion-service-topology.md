# Public Web and Onion Service Topology

**Document role:** Governing entrance and trust-boundary architecture
**Implementation status:** Optional Onion architecture defined; deployment not authorized

## 1. Governing decision

Blowin' Smoke has one canonical commerce system with two possible entrances:

1. a primary public HTTPS entrance that works in an ordinary modern browser; and
2. an optional Tor Onion Service entrance for customers who choose Tor Browser.

Tor supplements the public site. It never replaces it. No ordinary customer must use Tor, a VPN, an extension, or an installed application. Both entrances receive the same security baseline and reach the same canonical inventory, price, eligibility, cart, order, payment, fulfillment, consent, correction, and audit truth.

## 2. Logical topology

### 2.1 Normal public web entrance

```text
Ordinary browser
  │ authenticated secure transport
  ▼
Public DNS/domain + hardened HTTPS edge
  │ authenticated request; normalized origin context
  ▼
Application entrance / modular-monolith boundary
  ├── canonical modules + stores + transactional outbox
  ├── rebuildable public/private projections
  └── provider adapters through explicit trust boundaries
```

The normal entrance provides transport integrity, authentication, secure sessions, browser defenses, least-privileged application access, encrypted storage, field protection, logging minimization, and governed recovery without requiring Tor.

### 2.2 Optional Onion Service entrance

```text
Tor Browser
  │ Tor circuits; onion address authenticates service identity
  ▼
Tor Onion Service process
  │ local or separately protected narrow upstream
  ▼
Isolated Onion gateway / reverse-proxy boundary
  │ normalized, policy-limited application request
  ▼
Same application entrance / same canonical modules
  ├── same inventory, price, eligibility, order and fulfillment truth
  ├── entrance-aware privacy controls, not entrance-specific business state
  └── adapters invoked only by owning domains under normal rules
```

The Onion Service address is bound to its identity public key. Its private identity key is therefore high-impact service identity material. The [Tor Project overview](https://community.torproject.org/onion-services/overview/) and [setup guidance](https://community.torproject.org/onion-services/setup/) govern the implementation review.

## 3. Entrance parity and intentional differences

| Concern | Required parity | Permitted entrance-specific behavior |
|---|---|---|
| Catalog, price, availability | Same approved projection and canonical source version | Caching/edge strategy may differ while freshness remains visible |
| Age/product/destination eligibility | Same server-owned rules and states | Adapter reachability may create an explicit entrance-specific `SERVICE_ERROR`; never bypass |
| Cart/order/payment | Same canonical ownership, validation, idempotency, and correction | Payment/provider support may be evaluated; unsupported flow must be explicit, never silently weaker |
| Fulfillment/BSDN | Same destination, handoff, age, custody, proof, and audit rules | No Onion-specific waiver or alternate delivery truth |
| Account/consent/support | Same purpose and authoritative record | Account interoperability and cookie/session relationship remain open |
| Security/privacy | Same baseline confidentiality/integrity/authorization | Onion entrance removes unnecessary third-party browser calls and may apply stricter metadata minimization |
| Analytics/monitoring | Same operational need for health and security | Onion telemetry is separately minimized to avoid reconstructing customer behavior |

“Same commerce truth” does not mean identical browser plumbing. It means entrance choice cannot create contradictory business records, eligibility outcomes, prices, inventory, order status, or evidence requirements.

## 4. Onion isolation requirements

1. The Tor process and Onion gateway are a separate trust boundary from the canonical application.
2. Expose the upstream through the narrowest deployment-appropriate local or protected channel. A Unix socket or loopback binding is preferred where the reviewed platform permits; a network hop requires separate authenticated protection.
3. Do not expose the canonical application origin because an Onion request leaks a hostname, absolute asset URL, redirect, diagnostic page, source map, email, DNS lookup, or third-party request.
4. Normalize forwarded host, scheme, client, and entrance context only from a trusted gateway. The application must not trust spoofable client headers.
5. Restrict gateway egress and application routes to those actually required. Onion routing does not grant internal-network access.
6. Use relative or explicitly approved same-origin application links. Test redirects, error pages, canonical links, media URLs, downloads, authentication callbacks, and checkout transitions for origin leakage.
7. Do not load ordinary third-party analytics, pixels, advertising, chat widgets, fonts, scripts, frames, or cross-origin browser resources on the Onion surface.
8. Protect application code, packages, and media served to Onion users with the same integrity and release controls as the public entrance.
9. Keep Onion-specific configuration and private keys outside source, general application configuration, logs, events, and normal backups.
10. Do not create an Onion-only database or shadow commerce state.

The Tor Project's [operational-security guidance](https://community.torproject.org/onion-services/advanced/opsec/) is an implementation baseline; this specification does not claim that the topology makes correlation or endpoint compromise impossible.

## 5. Onion identity-key custody

The Onion Service identity private key authenticates the `.onion` address. It requires:

- an isolated owner and access policy;
- no application-runtime read authority unless technically unavoidable and approved;
- restrictive file/key-boundary permissions and a documented inventory/version;
- separate, encrypted, controlled continuity or backup handling if continuity is approved;
- audited administration without recording the key;
- detection for unexpected identity/address/configuration change;
- a tested compromise and loss runbook.

If compromised, the old address must be treated as impersonable. Stop advertising it, isolate the affected boundary, create a new identity/address through the approved process, and publish the replacement only through authenticated channels. Do not silently present an unrelated address as continuous identity.

Planned Onion identity-key rotation is also an address migration because the v3 onion address is derived from the identity public key. It cannot be represented as transparent in-place key rotation. SEC-02 must define authenticated announcement, overlap or no-overlap, old-address retirement, bookmark/user warning, rollback, and continuity evidence without making the old key broadly accessible.

## 6. Browser and transport requirements

- Use authenticated secure transport for the public entrance and every non-local sensitive hop. [RFC 9846](https://www.rfc-editor.org/info/rfc9846) is the current TLS 1.3 specification.
- Do not use replayable early data for checkout, payment, order, age, handoff, tip, feedback, administrative, endpoint-registration, or wholesale-message state changes.
- Apply a tested browser-security policy: content restrictions, anti-framing, MIME-sniffing prevention, referrer minimization, permissions minimization, sensitive-response cache controls, and secure session cookies appropriate to each entrance.
- No mixed insecure resource is permitted.
- E2EE wholesale messaging still requires authenticated transport. E2EE does not replace connection security or server authentication.

Exact transport compatibility, header directives, and HSTS rollout are implementation-gate decisions based on supported clients and verified topology—not copied defaults.

## 7. Session and account boundary

The following remain intentionally open until threat-tested against both entrances:

- whether public and Onion entrances use isolated cookie namespaces and signing keys;
- whether one account session can be interoperable across entrances;
- whether entering or leaving Onion requires fresh authentication;
- how account recovery avoids linking more entrance metadata than needed;
- whether a dedicated wholesale origin is required;
- whether Onion client authorization has a legitimate future use.

Whatever choice is approved must prevent cross-origin fixation, token leakage through redirects/referrers, privilege carryover, and silent privacy downgrade. Tracking grants, reset tokens, and session identifiers must not appear in routine logs or third-party requests.

## 8. Optional discovery and HTTPS-over-Onion decisions

The Tor Project documents [Onion-Location](https://community.torproject.org/onion-services/advanced/onion-location/) as an optional way for an authenticated public site to advertise its Onion address. Activation remains `OPEN` pending identity, content, privacy, and operational review.

The decision to add HTTPS over the Onion Service remains `OPEN`. Tor authenticates the onion identity and protects traffic to the onion host; [Tor's HTTPS guidance](https://community.torproject.org/onion-services/advanced/https/) identifies additional deployment considerations. The decision must account for browser secure-context behavior, the gateway-to-application hop, certificate operations, client expectations, and outage risk. Neither option may weaken authenticated transport on other hops.

## 9. Third-party and adapter behavior

The Onion browser surface should be same-origin by default. When the application must call a payment, age, notification, or other adapter, the owning server-side domain invokes the adapter under the normal disclosure contract. The browser must not be redirected to an unreviewed third party in a way that silently discloses Onion use, a tracking grant, wholesale context, full referrer, or unnecessary identity.

If a required provider cannot support the approved Onion flow, the system presents an explicit unsupported or `SERVICE_ERROR` state and a privacy-respecting alternative. It never bypasses eligibility, payment, age, or evidence requirements.

## 10. Monitoring, outage, and recovery

Monitoring must establish service identity, health, latency, errors, abuse, and capacity without building an ordinary behavioral analytics profile of Onion users. Logs use minimized/pseudonymous correlation and exclude raw addresses, tokens, secrets, wholesale plaintext, and unnecessary client/network data.

Required operational states include:

- Onion entrance available and serving the approved release;
- degraded or unreachable Onion entrance while the public entrance remains available;
- upstream/canonical application degradation affecting both entrances;
- unexpected Onion identity/address change;
- suspected origin leak;
- suspected Onion-key compromise;
- abusive traffic requiring narrow rate or access response.

An Onion outage must not corrupt canonical state. The public entrance remains primary, but incident communication must not tell a safety-sensitive user that the public route provides Tor-equivalent network privacy.

## 11. Privacy claims that are prohibited

Do not claim that:

- HTTPS users receive Tor anonymity;
- Tor makes accounts, payment, age verification, shipping, local delivery, support, or wholesale identity anonymous;
- an Onion Service removes metadata, timing, endpoint, browser, or operational risks;
- Onion users receive secret inventory, alternate prices, or policy exemptions;
- a public-site visit is necessary to discover the Onion address unless that policy is deliberately approved;
- HTTPS-over-Onion or Onion-Location is implemented before technical confirmation.

## 12. Acceptance gate

Before deployment authorization, a qualified review must validate origin-leak prevention, gateway isolation, route/resource parity, same-origin dependencies, session/cookie design, account transition behavior, Onion identity custody and recovery, adapter disclosures, privacy-preserving monitoring, browser security headers, transport policy, outage behavior, and externally reviewed security testing. Provider and platform selection remain outside SEC-01.
