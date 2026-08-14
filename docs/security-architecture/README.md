# Blowin' Smoke Security Architecture

**Package version:** 1.0
**Status:** Governing specification; implementation not authorized
**Repository baseline:** `e2d55f531df1ead37b44e55af6760474ae794fef`

## Purpose and authority

This package defines the privacy, encryption, Onion access, identity, session, recovery, and private-wholesale security boundaries for Blowin' Smoke. It is subordinate to the Constitution, the completed Technical Architecture, and the Blowin' Smoke Same-Day Delivery Network (BSDN) architecture. It strengthens those systems; it does not reopen their canonical ownership, commerce states, provider neutrality, or evidence rules.

This is a logical security architecture, not production code, a deployment plan, a vendor selection, legal advice, or launch approval. Where policy, law, operations, platform choice, or cryptographic implementation review is still required, the decision remains explicitly open.

### SEC-02 protected-client supersession

SEC-02 preserves this package's E2EE, endpoint-identity, device-lifecycle, recovery, declassification, canonical-ownership, and Onion requirements. It narrowly supersedes SEC-01's **browser client selection for protected Private Wholesale content**. Browser E2EE remains a research-only conditional feasibility finding, but an ordinary browser or PWA receives zero protected wholesale payload. Protected plaintext requires a future signed approved client that passes the hard fail-closed release gate in [SEC-02 Protected Content Assurance](../security-assurance/private-wholesale-protected-content-assurance.md). No client, protocol, library, or production stack has been selected.

## Phase status

```text
SECURITY ARCHITECTURE:
SPECIFICATION PHASE IN PROGRESS

PRIVATE WHOLESALE E2EE:
ARCHITECTURE PHASE

ONION SERVICE:
OPTIONAL ACCESS CHANNEL

PRODUCTION IMPLEMENTATION:
NOT AUTHORIZED
```

The final package classification and next gate are recorded in [08-security-decisions-and-next-gate.md](08-security-decisions-and-next-gate.md).

## Relationship to governing architecture

The security architecture preserves these inherited rules:

- Canonical business records retain stable Blowin' Smoke identifiers, owners, provenance, versions, authority, and correction history.
- Security infrastructure cannot become a second catalog, inventory, identity, consent, order, payment, fulfillment, delivery, or audit authority.
- A canonical write, its audit context, and its outbox event commit atomically where they share a consistency boundary.
- Public and private read models are rebuildable projections, never independent truth.
- External services enter through replaceable adapters. Provider identifiers are aliases, not canonical identifiers.
- `UNKNOWN`, stale, invalidated, and `SERVICE_ERROR` never become a positive business decision.
- High-risk actions require authenticated authority, current state/version, idempotency or replay protection, reason, and durable audit.
- Logs are not the sole audit record.

The SEC-01 brief referenced three superseded BSDN filenames. This package uses their current equivalents without creating duplicates:

| Superseded reference | Current authoritative sources |
|---|---|
| `03-dispatch-driver-tracking-and-custody.md` | `04-dispatch-driver-and-live-tracking.md`; `06-chain-of-custody-failures-and-returns.md` |
| `04-delivery-hub-age-handoff-and-proof.md` | `03-quote-checkout-age-and-handoff.md`; `04-dispatch-driver-and-live-tracking.md`; `06-chain-of-custody-failures-and-returns.md` |
| `06-privacy-security-and-audit.md` | `07-analytics-privacy-security-and-operations.md`; `06-chain-of-custody-failures-and-returns.md`; canonical audit definitions in `02-delivery-domain-and-record-model.md` |

## Terminology

| Term | Meaning in this package |
|---|---|
| **Normal web entrance** | The primary public HTTPS site, usable in an ordinary modern browser without Tor, a VPN, an extension, or an installed app. |
| **Onion entrance** | An optional Tor Onion Service entrance to the same governed application and canonical commerce truth. It supplements rather than replaces the normal web entrance. |
| **Transport encryption** | Protects a connection in transit. The receiving service can read the application plaintext. |
| **Storage encryption** | Protects a storage volume, database, object, or backup at rest. An authorized runtime can ordinarily decrypt it. |
| **Field/application encryption** | Encrypts selected sensitive values before general storage and gives decryption authority only to a narrower application boundary. |
| **End-to-end encryption (E2EE)** | Protects message content so only registered communicating endpoints hold the content-decryption authority; intermediary services store and route ciphertext. |
| **Metadata** | Information about a communication or transaction—participants, endpoint identifiers, times, sizes, delivery state, routing, retention, and correlations—that may remain visible even when content is E2EE. |
| **Deliberate declassification** | An explicit, authorized, disclosed conversion of agreed wholesale conversation content into a canonical quote, order, fulfillment, consent, or audit record owned by the governing domain. |
| **Delivery Hub grant** | A narrow, high-entropy capability authorizing limited access to one delivery experience; it is not an account session or proof of identity. |

## Threat boundary

The protected system includes public and Onion entrances, application services, canonical stores, projections, adapters, logs, backups, staff and driver surfaces, Delivery Hub links, wholesale messaging endpoints, cryptographic key custody, and recovery operations. Customer, staff, and driver devices are endpoints—not automatically trusted zones. Third-party resources and providers remain separate trust boundaries.

The architecture does not promise anonymity. A customer who provides identity, address, payment, age, delivery, or wholesale business information can still be identified through that commerce relationship. Tor can reduce some network and origin exposure; it does not erase transaction, endpoint, payment, delivery, or application metadata.

## Two entrances, one commerce truth

Ordinary customers receive the complete baseline security posture through the normal web entrance. No customer must install Tor, use a VPN, add an extension, or install Signal. The optional Onion entrance reaches an isolated gateway and then the same canonical application services. It must not create a shadow storefront or different inventory, price, eligibility, order, payment, fulfillment, consent, or audit truth.

## Private wholesale model

Private wholesale supports qualified one-pound-and-above conversations through a future signed approved client using a Signal-style E2EE channel. Inventory availability, private pricing, negotiation, and quote discussion stay private and non-indexed. The messaging service stores ciphertext and necessary minimized metadata; registered authorized endpoints decrypt content locally. Browser delivery remains research-only and may expose only generic approved-client onboarding with zero protected payload.

This is a protocol requirement, not a claim of Signal compatibility and not permission to invent a protocol. A future implementation must use mature, published, independently reviewed primitives and protocol libraries that pass the evaluation gate in this package. No Signal application installation is required, and no replacement client is approved by this statement.

An approved conversation may become a canonical quote or order only through deliberate declassification. Retail and wholesale may differ in minimums, package structure, pricing, and economics, while approved fulfillment still enters the same eligibility, order, payment, BSDN/pickup/shipping, consent, and audit boundaries.

## Prohibited assumptions

This package does not:

- select a cloud, database, framework, identity provider, key-management service, cryptographic library, messaging protocol implementation, Tor host, payment provider, or age-verification provider;
- hardcode algorithms because they are fashionable or familiar;
- claim anonymity, perfect secrecy, endpoint safety, zero metadata, guaranteed availability, or immunity from lawful obligations;
- represent transport encryption, database encryption, field encryption, and E2EE as interchangeable;
- allow an Onion entrance or wholesale channel to bypass age, eligibility, price, inventory, payment, fulfillment, evidence, consent, or audit policy;
- expose E2EE plaintext to analytics, ordinary logs, customer-support tooling, a CRM, or canonical commerce records by default;
- retain precise location, raw identity evidence, proof media, tracking grants, free text, or communication metadata indefinitely;
- infer a positive result from missing, stale, invalid, unverified, or unavailable security evidence;
- authorize production implementation.

## Document map

| Document | Purpose |
|---|---|
| [01-threat-model-and-security-objectives.md](01-threat-model-and-security-objectives.md) | Assets, actors, trust boundaries, realistic threats, objectives, invariants, and non-goals. |
| [02-data-classification-encryption-and-key-management.md](02-data-classification-encryption-and-key-management.md) | D0–D4 classification, encryption layers, conceptual key hierarchy, lifecycle, and record handling. |
| [03-public-web-and-onion-service-topology.md](03-public-web-and-onion-service-topology.md) | Normal-web and optional-Onion entrances, isolation, parity, leakage controls, and open topology choices. |
| [04-private-wholesale-e2ee-architecture.md](04-private-wholesale-e2ee-architecture.md) | Browser E2EE protocol requirements, identity, devices, attachments, metadata, and deliberate declassification. |
| [05-identity-access-sessions-and-delivery-hub-security.md](05-identity-access-sessions-and-delivery-hub-security.md) | Customer, staff, driver, wholesale endpoint, session, recovery, and Delivery Hub controls. |
| [06-privacy-retention-logging-and-third-party-boundaries.md](06-privacy-retention-logging-and-third-party-boundaries.md) | Privacy lifecycle, GPS minimization, logging exclusions, and adapter disclosure contracts. |
| [07-backup-recovery-incident-and-key-compromise.md](07-backup-recovery-incident-and-key-compromise.md) | Backup, restore, incident, ransomware, token, endpoint, and key-compromise response architecture. |
| [08-security-decisions-and-next-gate.md](08-security-decisions-and-next-gate.md) | Binding decisions, unresolved questions, completion boundary, and next review gate. |
| [security-registry.json](security-registry.json) | Machine-readable index of classifications, assets, threats, decisions, requirements, incidents, and gates. |

## Normative references

The package uses primary, authoritative references as evaluation baselines, not as evidence that an implementation exists:

- [NIST SP 800-57 Part 1 Rev. 5, Key Management Guidelines](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)
- [NIST SP 800-61 Rev. 3, Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST SP 800-63B-4, Authentication and Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Tor Project: Onion Services overview](https://community.torproject.org/onion-services/overview/)
- [Tor Project: Onion Services setup](https://community.torproject.org/onion-services/setup/)
- [Signal PQXDH, Double Ratchet, and Sesame specifications](https://signal.org/docs/)
- [IETF TLS 1.3, RFC 9846](https://www.rfc-editor.org/info/rfc9846)
