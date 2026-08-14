# Backup, Recovery, Incident, and Key-Compromise Architecture

**Document role:** Governing resilience and security-response architecture
**Implementation status:** Runbook structure defined; owners, targets, platforms, and notification policy remain open

## 1. Recovery objective

Blowin' Smoke must restore trusted service and canonical truth without converting unavailable, stale, unauthenticated, or corrupted evidence into success. Recovery is complete only when restored data, permissions, keys, sessions, projections, outbox/event delivery, adapters, external side effects, and customer/driver/staff-visible states have been reconciled.

The operating model follows the integrated preparation, detection, response, recovery, and improvement approach in [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Exact severity levels, staffing, notification duties, RPO, and RTO remain qualified-policy and platform-gate decisions.

## 2. Backup architecture

Backups must:

- cover canonical records, audit/correction records, outbox/event state, required configuration/provenance, controlled proof/evidence objects, and key metadata necessary to perform an authorized restore;
- use encryption under separately controlled backup keys rather than assuming production storage encryption carries into every copy;
- separate backup-key custody and restore authority from ordinary application access;
- preserve classifications, ownership, versions, integrity, deletion/hold duties, and access audit;
- exclude plaintext secrets and wholesale E2EE endpoint/session keys from general server backups;
- retain wholesale messages/attachments only as ciphertext at the intermediary boundary;
- use immutable or write-protected recovery generations appropriate to ransomware/destructive threats;
- prevent one compromised production identity from deleting or encrypting every recovery copy;
- inventory replicas, exports, snapshots, object versions, and provider-managed copies;
- expire data according to approved schedules and holds rather than keeping every backup indefinitely.

Backup encryption is not sufficient if the same compromise also exposes backup keys. A backup key compromise scopes both ciphertext copies and every data key or secret it could recover.

## 3. Restore validation

Restore tests must occur on a scheduled, risk-based cadence approved at the next gate and must verify:

1. authorized access to the correct backup generation and key version;
2. integrity/authenticity before restored data is trusted;
3. schema/version compatibility and migration safety;
4. canonical record counts, invariants, provenance, correction lineage, and audit continuity;
5. outbox/event replay with idempotent consumers and no duplicate external side effects;
6. reconstruction of projections from canonical state, including source version/freshness;
7. payment, inventory, order, fulfillment, BSDN custody, tip, proof, and adapter reconciliation;
8. retention/deletion/hold state after restore so previously deleted data is not silently republished;
9. role, service, secret, key, session, device, and grant validity—stale credentials are not blindly restored;
10. explicit `UNKNOWN`/`SERVICE_ERROR` for anything that cannot be verified;
11. recorded test evidence, owner, findings, corrective action, and follow-up.

Production restore authority, test environment isolation, test-data access, RPO/RTO, and restoration cadence remain open.

## 4. Incident lifecycle

```text
PREPARE
  -> DETECT / REPORT
  -> TRIAGE + SCOPE
  -> CONTAIN
  -> PRESERVE EVIDENCE
  -> ERADICATE / ROTATE / REVOKE
  -> RESTORE + RECONCILE
  -> NOTIFY under approved authority
  -> POST-INCIDENT REVIEW + CONTROL UPDATE
```

Every incident record needs stable ID, owner, sensitivity, source/evidence, affected systems/data/key versions, observed/received/occurred times, actor/service authority, decisions, containment, external effects, notification determination, recovery verification, corrections, and closure approval. General logs are supporting evidence, not the sole incident record.

Recovery actions are append-only or otherwise tamper-evident, immutable events linked to the incident and affected canonical records. A correction adds a successor explanation or action; it never erases who restored, rotated, revoked, reconciled, approved, or verified what and when.

Incident responders receive temporary purpose-bound authority. Break-glass access is time-bounded, alerted, audited, reviewed, and cannot erase original evidence. Preserve evidence without unnecessarily copying plaintext or expanding access.

## 5. Universal containment and recovery rules

- Stop active harm while preserving the minimum evidence needed for scope and recovery.
- Identify affected identity, session, token, secret, key, key version, endpoint, data family, adapter, record, environment, and time window.
- Revoke narrowly first when safe; expand scope when containment cannot be proven.
- Rotate/rekey without losing the ability to interpret legitimate historical ciphertext or signatures under controlled recovery authority.
- Invalidate caches/projections and rebuild from verified canonical state.
- Reconcile external effects before retrying payments, tips, messages, notifications, reservations, or fulfillment commands.
- Never interpret timeout, missing audit, failed decrypt, unavailable key, or corrupted proof as a positive outcome.
- Correct through linked records/events; do not destructively hide a fraudulent or mistaken original.
- Communicate only verified facts, limitations, required user actions, and authenticated replacement channels.
- Apply legally/contractually required notifications only after qualified determination; SEC-01 does not invent deadlines.

## 6. Key-compromise procedure

For any suspected key compromise:

1. Quarantine or disable unnecessary use of the key/identity without destroying evidence.
2. Identify purpose, environment, owner, version, dependents, authorized operations, copies/backups, and observed use.
3. Determine whether exposure concerns plaintext key material, an authorized cryptographic operation, endpoint access, ciphertext only, or unverifiable scope.
4. Treat every subordinate key/data set an exposed root or key-encryption authority could release as potentially affected.
5. Generate approved replacement authority and cut new writes/identities over safely.
6. Rewrap or re-encrypt affected data where meaningful; preserve versions/provenance and avoid destructive record rewrite.
7. Revoke sessions, devices, grants, certificates, API credentials, or peer trust whose security depended on the key.
8. Review decrypt/sign/use audit, logs, provider events, exports, and backups with minimized access.
9. Reconcile forged, replayed, or failed effects and mark uncertainty explicitly.
10. Notify affected users, peers, staff, providers, or authorities under approved policy.
11. Retire/destroy old authority only after recovery dependencies and holds are resolved.
12. Update threat model, key inventory, access policy, runbooks, tests, and training.

Rotation, rewrapping, re-encryption, revocation, and endpoint rekeying reduce future authority or exposure. They do not erase plaintext already read, copied, exported, photographed, or captured at an endpoint; incident scope and communication must preserve that limitation.

## 7. Required compromise playbooks

| Scenario | Immediate containment | Scope and integrity questions | Recovery and user/system consequence |
|---|---|---|---|
| **Customer account/session compromise** | Revoke affected or all customer sessions/authenticators and Delivery Hub grants as scope requires; block high-risk actions | Which profile, address, order, delivery, support, consent, or security actions and views occurred? | Restore through governed correction, reauthenticate/recover through approved proof, rotate affected grants, notify according to policy |
| **Administrator account/session compromise** | Revoke sessions/authenticators, suspend high-risk role, protect audit/key boundaries | Which reads, exports, decrypts, writes, role/key/policy changes occurred? | Restore roles/state by governed correction, rotate reached secrets, notify as approved, re-review privileged access |
| **Driver account/device lost or compromised** | Revoke device/sessions, stop GPS collection, freeze affected assignment actions, contact operations through verified channel | What assignment, customer context, location, proof, custody, instructions, or forged actions were exposed? | Reassign only through explicit custody transfer/return; revalidate delivery; minimize/clear local data; notify affected parties under policy |
| **Delivery Hub grant exposed** | Revoke grant and related derived session; rate-limit suspicious source | Which delivery views/actions occurred; did referrer/log/third party receive it? | Issue replacement only through approved channel, reauthenticate sensitive actions, assess customer/driver exposure |
| **Database or object store compromise** | Isolate read/write paths, suspend broad decrypt authority, preserve snapshots/evidence | Which classifications, fields, ciphertext, key versions, proofs, audit records, or integrity changes were reached? | Restore trusted canonical state, rotate/rewrap/re-encrypt as applicable, rebuild projections, reconcile records and notifications |
| **Backup/export compromise** | Revoke access, isolate copy/key paths, stop further replication/download | Were separately controlled keys exposed; what generations/data/holds/deletions were present? | Rotate backup authority, assess all recoverable data, replace clean recovery copies, review export/deletion controls |
| **Logging/analytics compromise** | Stop ingestion/query/export and revoke credentials | Did logs violate exclusions or permit identity/location/session reconstruction? | Purge under evidence/hold policy, rotate exposed tokens, repair redaction/schema, assess privacy incident |
| **Age-verification data/provider compromise** | Disable affected adapter/credential, preserve canonical minimized results, fail safely | Was raw ID overcollected, what references/results/credentials/callbacks were altered or exposed? | Rotate adapter secrets, reconcile attempts, require new verification only under policy, delete prohibited copies, never infer eligibility |
| **Precise GPS/location compromise** | End affected tracking sessions, revoke read/export authority, stop exposed projection | Which drivers/customers/routes/time windows and off-duty data were exposed? | Delete/minimize unauthorized copies where permitted, rotate keys/grants, notify per policy, correct projections without rewriting observations |
| **Proof/evidence compromise** | Lock object access and completion/correction commands | Was media viewed, copied, substituted, or integrity metadata changed; which custody decisions depended on it? | Restore verified object/version, add correction/addendum, revalidate completion/dispute, rotate proof keys/links |
| **Wholesale endpoint or identity-key compromise** | Revoke endpoint, stop delivery, warn peers, pause on key change | Which plaintext/keys were available at the endpoint and during what interval? | Replace identity/session keys, require peer re-verification, analyze protocol-specific past/future exposure; never make categorical assurances |
| **Wholesale routing/E2EE server compromise** | Isolate relay/directory/client release, revoke service credentials, preserve ciphertext/metadata evidence | Were metadata, prekeys, delivery, availability, or client code altered; were endpoints/keys also affected? | Restore trusted directory/relay/client, force safe protocol/identity checks, assess metadata incident; content protection claim remains conditional on uncompromised endpoints/client/protocol |
| **Browser E2EE client-delivery compromise** | Stop affected release/origin, protect signing/publish authority, warn endpoints | Could hostile code read plaintext/keys or register/substitute endpoints? | Restore verified build, revoke/replace potentially exposed identities, reverify peers, review release supply chain |
| **Onion identity private-key compromise/loss** | Stop advertising old address; isolate Tor boundary | Could attacker impersonate; which channels/config/backups exposed key; was origin leaked? | Create new identity/address, publish via authenticated channels, retire old identity; no silent continuity claim |
| **TLS certificate, public domain, or DNS compromise** | Restore authoritative control, revoke/replace credentials, block malicious routes | Which interception/phishing/session theft occurred and when? | Invalidate exposed sessions/grants, verify release/content, communicate authenticated recovery, monitor recurrence |
| **API/provider secret or forged callback** | Revoke credential, reject callback path, quarantine affected attempts | Which adapter outcomes/commands were accepted; could replay/idempotency be bypassed? | Rotate secret, reconcile provider and canonical state, correct through governed events, retest callback authentication |
| **Ransomware/destructive event** | Isolate affected identities/systems; preserve immutable recovery copies | What data, keys, backups, deployment authority, and audit were encrypted/deleted/corrupted? | Rebuild from verified clean release and backup, rotate credentials, reconcile external effects, restore in approved priority order |

## 8. E2EE-specific compromise truth

E2EE does not make endpoint or client-delivery compromise harmless. A compromised endpoint can expose plaintext and active keys; a compromised application host may deliver hostile JavaScript. Ratcheting properties apply only under the selected protocol's precise assumptions.

After endpoint/identity change, correspondents receive a conspicuous warning and, for sensitive wholesale use, communication should pause until approved acknowledgement/re-verification. The routing service cannot silently mark replacement identity as trusted. Historical exposure is assessed against message time, endpoint state, key state, protocol behavior, backups/exports, and attacker duration.

Server compromise of ciphertext alone is different from endpoint/key compromise, but still implicates metadata, availability, replay, directory integrity, client delivery, and traffic analysis. Incident language must preserve that distinction.

## 9. Onion-key recovery truth

The `.onion` address authenticates the Onion Service identity. If its private key is exposed, impersonation is possible; if it is irrecoverably lost, the same address cannot be restored. The response is to retire the old identity, create a new identity/address through the approved boundary, and distribute it using authenticated public and customer channels. Do not rely on the suspected Onion address to prove its own replacement.

## 10. Recovery priorities and dependencies

Recovery ordering is risk- and dependency-based, not a fixed uptime promise:

1. protect people, active delivery/custody, keys/identity, and evidence from continuing harm;
2. restore trustworthy authentication, authorization, key, audit, and canonical write boundaries;
3. restore canonical records and reconcile payment/inventory/order/fulfillment/BSDN effects;
4. rebuild projections and customer/driver/staff views with visible freshness;
5. restore adapters and asynchronous delivery with replay/idempotency protection;
6. restore optional entrances and non-authoritative analytics only after truth/security boundaries are trusted.

An analytics outage cannot block commerce; an audit, authorization, key, age, payment, custody, or proof-integrity failure may need to fail closed. The optional Onion entrance may remain unavailable while verified public recovery proceeds, but its status must be communicated honestly.

## 11. Exercises and evidence

Before production authorization, conduct documented tabletop and technical exercises for customer account/session takeover, administrator takeover, driver-device loss during custody, leaked Delivery Hub grant, database/log/backup exposure, age/GPS/proof breach, forged adapter callback, wholesale endpoint/key change, malicious E2EE client release, E2EE relay compromise, Onion-key compromise, and destructive restore.

Each exercise must produce owner, assumptions, observed gaps, containment time, recovery/reconciliation evidence, notification decision path, inaccessible/degraded states, and tracked remediation. Restore exercises must demonstrate actual recoverability rather than configuration existence.

## 12. Open operational decisions

- Incident severity, commander, on-call coverage, evidence role, communication authority, notification policy, and external contacts.
- RPO/RTO, backup frequency/generations, immutability mechanism, geographic/administrative separation, restore cadence, and recovery staffing.
- Key rotation/revoke targets, cryptoperiods, re-encryption approach, and emergency access.
- Session/grant/device global revocation mechanisms and response thresholds.
- Data-specific retention, legal holds, deletion, export, workforce, and customer rights.
- Provider incident duties, forensic access, failover, exit, and replacement testing.
- E2EE and Onion continuity promises and verified replacement communication channels.

These items remain launch-blocking where applicable. No production readiness is implied by the existence of this document.
