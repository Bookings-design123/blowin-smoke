# Device Trust, Recovery, and Ephemeral Content Assurance

**Document role:** Feasibility semantics for wholesale accounts, endpoints, recovery, message history, and disappearance
**Implementation authority:** None

## 1. Four authorities that must remain separate

| Authority | What it proves | What it does not prove | Proposed canonical owner |
|---|---|---|---|
| Wholesale account authentication | The claimant controlled approved account authenticators at this time. | That a device is cryptographically trusted; that the correspondent key is genuine; access to old message keys. | Customer Identity/Consent boundary, specialized by Wholesale Access policy. |
| Wholesale qualification/room grant | The account has a current authorized wholesale-room scope. | Product availability, final price, reservation, payment, fulfillment, or legal eligibility. | Wholesale Access policy record; consumes canonical commerce evidence and never duplicates it. Final owner assignment remains a parent-domain decision. |
| Endpoint identity/trust | An exact endpoint key is enrolled, verified, active, and authorized for an exact participant/conversation scope. | The human behind it remains uncompromised; account/transaction eligibility. | Security E2EE endpoint directory. |
| Correspondent verification | Participating endpoints recognized/verified the cryptographic identity or accepted a qualified change. | Legal identity, order authority, or a server guarantee that an endpoint is safe. | Endpoint-held verification state plus minimized signed/audited server projection. |

A single “logged in” flag cannot safely represent these authorities.

## 2. Endpoint record and states

The future endpoint directory needs stable endpoint identity, account/worker association, public protocol material, protocol/profile version, created/authorized/verified/revoked times, authorizing endpoint or recovery case, display context, last security event, and correction history. It must never store the endpoint private key.

Feasibility states:

```text
PENDING_ACCOUNT_AUTH
    -> PENDING_TRUSTED_DEVICE_APPROVAL
    -> ACTIVE_UNVERIFIED
    -> ACTIVE_VERIFIED
    -> SUSPENDED_RISK
    -> REVOKED

COMPROMISED and LOST are incident reasons leading to SUSPENDED/REVOKED;
they are not positive authorization states.
```

`ACTIVE_UNVERIFIED` must remain visible. A server registration or password/phone login cannot silently produce `ACTIVE_VERIFIED`.

### Staff endpoints

Every representative uses an individual workforce identity, authenticator, endpoint key, and assignment scope. Staff reassignment changes membership and triggers protocol rekey/advance. Shared workstations require individual OS/application sessions and individually enrolled endpoint keys; a universal store key or “sales team private key” is prohibited.

## 3. New-device authorization

**Feasibility:** `PASS`, implementation `CONDITIONAL` on the chosen protocol and reviewed ceremony.

Required sequence:

1. Account authentication permits the new device to create a pending enrollment, not to retrieve conversation keys.
2. The device locally generates its endpoint identity/key material and submits only public enrollment material.
3. Server shows a bounded, fresh approval request to an already active trusted endpoint.
4. Both endpoints compare or transfer an authenticated short-lived challenge using QR, short authentication string, or the selected protocol's reviewed equivalent.
5. The trusted endpoint signs/commits the exact new endpoint public identity, account, nonce, protocol profile, and request expiry.
6. Server rejects stale, replayed, mismatched, already-used, or revoked approvals.
7. Every current verified customer and affected staff endpoint receives an independent security notification.
8. Conversation/group state advances. The new endpoint receives only content/state expressly permitted by the approved protocol and history policy.
9. The event writes a durable security audit record without private keys, message plaintext, or recovery secrets.

### Required UI context

The authorizing endpoint must see enough information to detect a fraudulent request: device type/name chosen by the user, approximate request time, requested account/scope, and a verification value. Location/IP is risk evidence, not a trusted fact and not a required public display. “Approve” must not be the default or a generic login continuation.

### High-risk cases

- Existing endpoint under compromise: risk can suspend approval and require a separate bound factor/manual case.
- Concurrent approval/revocation: optimistic version/current-state check; revocation wins or event is blocked for review.
- Identity/protocol-profile change: present as a security change, not a routine device rename.
- Staff coverage emergency: no universal key. Use a governed reassignment flow, explicit customer notice, and new membership.

## 4. Revocation, loss, and compromise

Revocation prevents future access after protocol/group state advances; it cannot make a removed endpoint forget keys or plaintext it already held.

Required behavior:

- revoke exact endpoint and its application sessions;
- invalidate pending approvals issued by it;
- advance/rotate protocol state to exclude it from future content;
- notify other authorized endpoints and the correspondent;
- pause sensitive use when identity continuity is uncertain;
- preserve minimal security incident/audit evidence under an approved schedule;
- allow appeal/correction without restoring the compromised key;
- never change delivery/payment/order/wholesale qualification truth as an incidental security side effect.

## 5. All-device-loss recovery

### 5.1 Account recovery

**Status:** `CONDITIONAL`.

[NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html) treats account recovery as an exceptional event using saved or issued recovery codes, recovery contacts, repeated identity proofing, or a risk-analysed application method. It requires notifications and separates recovery from routine authentication. [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) requires strong random, single-use, expiring reset values, rate limits, anti-enumeration, secure storage, and independent notification.

A prior wholesale order number is **not an authenticator**. It may be printed, emailed, disclosed to support, visible in packaging/account history, or leaked. It can locate a prior transaction record after rate-limited anti-enumeration controls; it cannot alone establish control of the account.

Minimum recovery evidence set:

1. prior wholesale order number as the owner-required transaction pointer;
2. one separately bound possession factor—prefer a high-entropy customer-held saved recovery code or existing passkey/authenticator where supported;
3. one independent verified recovery channel/code or recovery contact for the account's assurance tier;
4. risk evaluation for recycled phone/SIM change, rapid attempts, account/device changes, and staff conflict;
5. cooldown/manual dual review for high-risk recovery;
6. notice to every previously registered notification channel, with repudiation path;
7. revocation of previous wholesale endpoints, sessions, pending enrollment, and recovery values;
8. a visibly new cryptographic identity and re-verification with the representative.

For an account that was never identity-proofed, later identity proofing cannot be assumed to prove continuity with a pseudonym. For a prior completed transaction that included verified identity, address, payment, or fulfillment evidence, any reuse must be qualified, purpose-limited, and minimized; raw payment/identity data must not be exposed to the recovery operator or turned into knowledge questions.

### 5.2 Historical-message recovery

**Status without a surviving key or preconfigured endpoint-controlled recovery design:** `FAIL`.

Account recovery creates a new account-authentication and endpoint epoch. It cannot derive cryptographic secrets that no authorized party holds. A server-readable key escrow would restore history but would contradict the current server-blind requirement and SEC-01 prohibition.

An optional future customer-controlled backup could be researched only prospectively. It would require an independently reviewed design covering recovery-key entropy, brute-force resistance, metadata, versioning, key rotation, device authorization, server substitution, backup deletion, forgotten secret, safe export, and clear customer choice. Human-memorable password or order number alone is not acceptable key protection. SEC-02 does not approve such a design.

### Recovery result model

| Result | Account access | New messages | Old E2EE history | Correspondent state |
|---|---|---|---|---|
| Surviving trusted device authorizes new device | Restored/continued | After membership succeeds | Only if protocol/history policy explicitly transfers it | Existing continuity, new-device notice |
| All devices lost; evidence-based account recovery | Restored after case | After new identity is enrolled | Unavailable by default | Identity changed; re-verification required |
| Order number only | Denied | Denied | Denied | No change |
| Server/operator override request | Denied absent a separate governed recovery case | Denied | Impossible under server-blind design | Security escalation |

## 6. Message, attachment, and metadata lifecycles

“The conversation disappears after the corresponding order is placed and delivered” is a multi-copy workflow, not one delete flag.

| Data family | Authority/owner | Active-use end trigger | Controlled-system action | What cannot be promised |
|---|---|---|---|---|
| Customer endpoint plaintext/view state | Approved protected endpoint | Canonical linked order reaches approved delivered/terminal trigger and no hold/reopen applies | Remove from active UX; delete local indexed plaintext/key references best effort; record acknowledgement/failure without content | Privileged/unsupported prior output, OS remnants, compromised/offline endpoint, transcription, external camera |
| Staff endpoint plaintext/view state | Assigned endpoint/workforce policy | Same trigger plus authorized case/coverage completion | Remove from active queue; endpoint cleanup under managed policy; audit exceptions | Manual notes, external camera, unmanaged copies |
| Message ciphertext | E2EE routing boundary | Approved message-retention trigger | Deny retrieval and delete primary ciphertext under schedule/hold; tombstone minimal state if needed | Previously replicated/external ciphertext; future decryption if another copy/key exists |
| Encrypted message attachment | E2EE attachment routing boundary | Attachment/message trigger | Revoke fetch; delete encrypted object according to schedule/hold | Decrypted endpoint copy |
| Routing/delivery metadata | E2EE routing boundary | Operational/security purpose ends | Minimize/aggregate/delete by field schedule | Required incident/abuse evidence under an approved hold |
| Endpoint protocol state and keys | Endpoint | Session/group advance, revoke, expiry | Delete obsolete message secrets per protocol; remove local history key references | Secure deletion from all flash/virtual memory cannot be universally proven |
| Notification payload | Notification boundary/provider | Delivery/TTL | Use generic notifications; expire provider payload; no message plaintext | Device/provider display history outside control |
| Canonical declassification/export receipt | Governing target-domain owner after explicit customer/staff proposal | Separately approved commerce, support, incident, or records purpose | No protected-client export path; only validate and commit minimum approved fields into the canonical target with a receipt | Recall after deliberate declassification or external disclosure |
| Declassification proposal/receipt | Security-to-domain workflow; canonical target owner | Commerce/audit policy | Retain the exact approved fields, disclosure, actor, consent, command, target result | Treating the receipt as disposable conversation content |
| Canonical quote/order/payment/fulfillment/delivery record | Existing domain owner | Domain retention/hold | Retain/correct/delete only under governing domain and qualified policy | Deleting because chat disappeared |
| Backup copy | Backup owner | Backup generation expires and holds clear | Crypto-shred/delete according to tested backup schedule; prove restore/deletion behavior | Instant purge of every backup without approved mechanism |

Numeric schedules remain `BLOCKED` pending privacy/legal/accounting/security/operations approval. Encryption never lowers classification.

## 7. Trigger semantics

The disappearance trigger must reference authoritative states, not message text:

```text
LINKED_CANONICAL_ORDER exists
AND ORDER has passed the owner-approved placed/finalization boundary
AND FULFILLMENT is an approved delivered/terminal state
AND no qualifying dispute, support case, security incident, legal hold,
    correction workflow, or recovery obligation requires continued controlled access
```

The exact interpretation of “placed and delivered” is an owner-policy decision. If a conversation covers multiple orders or no order, it needs an explicit case-close/expiry rule; it cannot remain forever by omission.

Failures stay explicit:

- endpoint offline: `EXPIRY_PENDING_ENDPOINT_ACK`, never “deleted everywhere”;
- deletion job/provider unavailable: `SERVICE_ERROR`, retry/reconcile;
- legal/qualified hold: `HELD`, with scope/authority/review/expiry;
- unknown conversation-order link: `UNKNOWN`, block automated destructive action;
- ciphertext deletion complete but metadata open: represent each lifecycle separately.

## 8. Cryptographic erasure qualification

Deleting the only accessible content key can make retained ciphertext computationally inaccessible within the chosen cryptographic assumptions. It is a meaningful controlled-system property only when:

- key copies and wrapping/recovery paths are fully inventoried;
- deletion is testable and audited;
- endpoints, backups, exports, and caches are separate;
- the implementation does not keep plaintext logs or crash artifacts;
- no claim extends to keys/plaintext previously captured outside control.

Customer wording must say what access/store was removed, not “your messages are erased everywhere.”

## 9. Abuse, support, and safe rendering

Server-blind content removes ordinary server-side plaintext moderation/malware scanning. The future design must choose and disclose:

- client-side attachment type/size validation and safe isolated rendering;
- whether recipients can report a selected message by deliberately disclosing exact content and context;
- whether abuse evidence is uploaded only with explicit reporter action;
- blocked sender/representative, staff reassignment, and urgent safety escalation;
- metadata-only rate/abuse detection that does not infer guilt;
- how a support case avoids silently becoming a plaintext conversation archive.

Any reported content becomes a new purpose-specific D3 record with an owner, reporter disclosure, access, retention, correction, and audit—not a backdoor into all conversations.

## 10. Feasibility decisions

- Existing trusted device addition: `PASS` at property level; `CONDITIONAL` on selected protocol/integration.
- Individual staff endpoints: `PASS`; operational role/coverage design remains open.
- Password/phone alone yielding old history: `FAIL` and prohibited.
- Order number as sole recovery factor: `FAIL`.
- All-device-loss account recovery: `CONDITIONAL` using independent factors, risk handling, notification, and new cryptographic identity.
- Historical plaintext recovery with no surviving/preconfigured recovery key: `FAIL`.
- Removal from controlled active UX: `CONDITIONAL`.
- Guaranteed remote deletion from endpoints/external copies: `FAIL`.
- Server ciphertext/key lifecycle deletion: `CONDITIONAL` on policy, implementation evidence, holds, backups, and reconciliation.
