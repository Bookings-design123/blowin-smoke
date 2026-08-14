# Identity, Access, Sessions, and Delivery Hub Security

**Document role:** Governing authentication and authorization architecture
**Implementation status:** Policy and provider selection remain open

## 1. Governing model

Authentication establishes an identity or session at a stated assurance. Authorization decides whether that actor may perform one action on one object in its current state. Neither replaces canonical business validation.

Customer, staff, driver, wholesale staff, service, and Delivery Hub capability contexts are distinct. A role or valid link is never universal authority. All privileged and high-risk actions require server-side object/action authorization, current aggregate version, purpose, replay/idempotency protection, and durable audit.

Authentication and session controls must be evaluated against current [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html) and [OWASP Session Management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

## 2. Trust contexts and minimum authority

| Context | Permitted scope | Prohibited authority |
|---|---|---|
| Customer account | Own profile, consent, cart, orders, approved support and delivery views/actions | Other customers, staff/driver systems, server-owned eligibility, custody, proof, price, inventory, payment outcome |
| Public unauthenticated | D0 content and explicitly public read models | Personal/order/delivery/wholesale data; governed writes without appropriate anti-abuse and confirmation |
| Delivery Hub grant | Minimum view/actions for one exact delivery and purpose | General account access; unrelated orders; driver private data; raw route/proof; high-risk changes by possession alone |
| Driver | Current offers/assignments and minimum recipient/package context required to perform work | Off-duty tracking, other assignments, payment/age-rule changes, customer history, unrestricted proof, internal notes |
| Dispatcher | Governed dispatch and service-state commands within assigned scope | Price/payment, age result, handoff policy, proof, inventory, tip, or custody-history rewrite |
| Origin staff | Verified release and return receipt for assigned packages | Dispatch authority, customer history, payment, arbitrary proof correction |
| Support/recovery | Minimum case context and approved remedies | Rewriting delivery/custody/payment truth or viewing unrelated raw evidence |
| Finance/payroll | Fee, tip, payable, payout, and reconciliation facts | Raw route, proof media, identity evidence, unnecessary customer/driver data |
| Policy/security/auditor | Explicit policy administration or read-only security/audit scope | Operational writes outside role; unlogged evidence/decrypt access |
| Wholesale staff endpoint | Assigned conversations, local E2EE decryption, governed declassification proposal | Shared universal key, silent plaintext export, direct inventory/order mutation |
| Service identity | Named machine operations on defined records through approved contracts | Human login, blanket database authority, cross-domain direct mutation |

## 3. Customer accounts and sessions

Required controls:

- secure registration and authentication resistant to enumeration, brute force, credential stuffing, fixation, and replay;
- opaque high-entropy server sessions, secure cookie delivery, narrow path/domain, intentional same-site behavior, idle and absolute expiry, server-side logout/revocation;
- session renewal after login, recovery, privilege/assurance change, sensitive identity change, and suspicious activity;
- object-scoped authorization for every personal/order/delivery/support request;
- reauthentication or approved step-up for address/contact changes, new sensitive delivery actions, credential/authenticator management, large-risk wholesale conversion, and security settings;
- session/device inventory, terminate-other-sessions, suspicious-login notification, and recovery-event audit;
- rate limits and anomaly response with thresholds set by a later abuse review;
- optional stronger customer authentication designed without punishing customers who cannot use one specific device or app;
- recovery that does not reveal whether an account exists, silently remove trusted authenticators, or let support bypass policy without audit.

Exact authenticators, identity provider, assurance targets, timeouts, recovery proofs, and risk thresholds remain open.

## 4. Administrative access

Administrative access requires:

1. a separate staff authentication context from customer accounts;
2. mandatory strong, phishing-resistant MFA at the highest feasible assurance selected by the next gate;
3. least-privileged roles aligned to canonical write authority;
4. explicit joiner/mover/leaver workflows and rapid revoke;
5. privileged-session expiry, reauthentication for sensitive reads/decrypts and high-risk commands, and no shared accounts;
6. managed-device or equivalent endpoint posture decision at the implementation gate;
7. separation of duties and dual approval for actions whose blast radius justifies it;
8. periodic access review with owner, evidence, removal, and exception handling;
9. append-only audit for role changes, authentication/recovery, sensitive reads, exports, decrypt operations, key actions, policy changes, and high-risk writes;
10. break-glass access that is time-bound, justified, alerted, reviewed, and unable to erase its audit.

Admin is a governed entrance, not a universal database administrator. Support cannot approve catalog truth; receiving cannot author compliance rules; marketing cannot alter consent or price history.

## 5. Driver identity, device, and session

A driver session binds the authenticated driver account, registered device/session, current assignment authority, and server-known lifecycle. It must support remote revoke and reauthentication.

- Driver access begins only when the applicable role/assignment state permits and ends after closeout/revocation.
- The device sees only the next-action context: assigned package identifiers, minimum customer/contact/location context, current instructions, and approved proof requirements.
- Precise location permission is explicit, purpose-bound, and tied to an active GPS tracking session. Revocation stops collection immediately and creates an auditable degraded/recovery state; it does not automatically imply fault or pay consequence.
- Client time, location, geofence, UI state, and cached authorization are untrusted inputs. Server validation and canonical state guards control transitions.
- Stolen/lost devices support immediate session/device revocation, assignment review, location stop, proof/custody investigation, and notification according to policy.
- Sensitive content is minimized on-device, bounded offline, protected from notification/preview leakage, and removed according to verified closeout policy.
- A driver cannot self-verify age, promote requested handoff, edit custody history, or use a photo/GPS/tap as completion.

Exact device-management, local-storage, offline, biometric, reauthentication, background-location, and labor/consent policies remain open.

## 6. Wholesale staff identity and endpoints

Wholesale staff require both a strongly authenticated staff account and a registered E2EE endpoint identity. The two are linked but not interchangeable.

- Each authorized endpoint has its own identity and session state; a team-wide private key is prohibited.
- Staff addition/removal follows explicit manager/security authority, notification, endpoint registration/revocation, and audit.
- Role removal stops new conversation delivery and initiates rekey/reverification as required by the selected protocol.
- E2EE decryption does not grant direct quote/order/inventory mutation. Deliberate declassification uses existing canonical commands and authorization.
- Plaintext access stays inside the hardened endpoint surface and cannot be silently sent to analytics, CRM, support, logs, or general clipboard/export channels.
- Lost/replaced/compromised endpoints enter the incident and identity-change workflow.

The multi-staff fan-out model, endpoint count, device posture, conversation assignment, recovery, peer verification, and coverage/availability operating model remain next-gate decisions.

## 7. Service identities and adapters

Every service and adapter has a named, environment-specific, least-privileged identity. Machine credentials are scoped, rotated/revoked, never used as human sessions, and never stored in source or ordinary logs.

Provider callbacks and cross-boundary commands require authentication, replay protection, correlation to a known attempt, schema/version validation, idempotency, bounded timeouts, categorized errors, redacted audit, health/lag visibility, and canonical reconciliation. A valid provider credential does not authorize direct canonical storage writes.

## 8. Delivery Hub capability model

The Delivery Hub may use a link carrying an opaque capability. The capability must be:

- cryptographically generated with high entropy and non-sequential;
- unrelated to customer, order, delivery, phone, address, or provider identifiers;
- bound server-side to one exact delivery, customer/purpose context, action set, issue time, expiry, and revocation state;
- excluded from analytics, logs, support text, screenshots generated by the system, referrer propagation, and third-party resources;
- transmitted only through authenticated secure transport and handled with sensitive-response cache/referrer controls;
- rate-limited and monitored for enumeration/replay without storing the plaintext grant in logs;
- revocable on completion, suspicious access, customer/account security change, misdelivery, or support action according to approved policy;
- unable by mere possession to grant account access, personal-data export, or unrestricted sensitive writes.

Where feasible, store a verifier/derived representation rather than the plaintext grant. Token format, exact entropy, TTL, one-use/multi-use behavior, rotation cadence, and session binding remain implementation decisions subject to security review.

The initial tracking URL may carry the opaque capability because the customer must be able to enter the Delivery Hub. The preferred flow exchanges it promptly for a narrow server session and navigates to a clean same-origin address so the capability does not remain in the visible URL/history or propagate in a referrer. Re-entry, multiple devices, one-use versus reusable bootstrap, and lost-link recovery remain SEC-02 decisions; no choice may expose a predictable business identifier or weaken expiration, revocation, replay, logging, or third-party-resource controls.

## 9. Delivery Hub action matrix

| Action | Link capability alone | Additional authority | Required safeguards |
|---|---|---|---|
| View approved current delivery state | May be sufficient under approved risk policy | Exact delivery/purpose scope | Reduced data, freshness, expiry/revoke, rate limits |
| View reduced live position/ETA | May be sufficient only during active delivery | Active GPS session and approved customer projection | No raw route, precise history, off-duty data, or driver personal information |
| View age/handoff result | Minimum approved status only | Current server-owned authorization | No raw ID or verification payload |
| Change location/address | **No** | Authenticated customer + step-up as required; full eligibility/reprice/revalidation | Versioned change, audit, explicit failure |
| Change delivery instructions | **No** for sensitive change | Authenticated/step-up context according to risk | Treat text as D2, notify driver safely, revalidate state |
| Request `HAND_TO_ME`/`LEAVE_AT_DOOR` | Link alone cannot authorize outcome | Authenticated customer context plus server policy evaluation | `REQUESTED` distinct from `AUTHORIZED`; age/eligibility current |
| Submit tip/payment-related change | **No** | Authenticated customer, current order/delivery/payment state, anti-replay/idempotency | Payment reference only; no duplicate capture/payout |
| Submit feedback/contact request | A narrow one-delivery grant may be allowed after abuse/privacy review | Explicit contact consent; stronger auth if revealing personal history | Separate overall/driver feedback, sensitive free text, dedupe |
| View proof media | **No** by default | Authenticated, authorized, purpose-bound evidence view | Controlled object, access audit, minimized/derived proof preferred |
| Complete age/handoff/custody | **Never** | Authorized driver/origin/staff workflow plus canonical state/evidence | Link possession, GPS, photo, or customer tap cannot substitute |

## 10. Session safety and state-changing requests

- Reject session fixation; rotate identifiers after authentication and assurance/privilege changes.
- Apply anti-CSRF controls appropriate to cookie-authenticated routes and same-origin design.
- Apply output/context controls, strict browser content policy, and safe rendering to reduce XSS and injection risk.
- State-changing requests carry current aggregate version and idempotency/replay context. Duplicate requests return the original known outcome rather than repeat an effect.
- No replayable early transport data is accepted for checkout, payment, order, age, handoff, tip, feedback, admin, endpoint registration, or messaging submissions.
- Session, reset, capability, API, and prekey-registration tokens are never placed in routine logs or exposed to third-party browser requests.
- Suspicious activity can revoke one session/device, all sessions for an identity, a Delivery Hub grant, or a service credential according to scope.

## 11. Recovery and support boundary

Support may guide an approved recovery but cannot silently bypass authentication, register a wholesale endpoint, alter age/handoff, expose proof, or rewrite custody/payment truth. Recovery actions require their own authority, reason, evidence, customer notification where appropriate, cooldown/step-up decisions, and durable audit.

Account recovery, endpoint recovery, lost-driver-device response, and Onion-key recovery are distinct. A successful account recovery must not automatically restore access to historical E2EE plaintext or mark a new endpoint identity as verified.

## 12. Open policy decisions

- Customer/staff/driver authenticators, assurance levels, provider, MFA/recovery mechanisms, and timeout values.
- Role definitions, dual-authority actions, access-review frequency, break-glass staffing, and managed-device requirements.
- Delivery Hub token structure, TTL, rotation, binding, and which low-risk views/actions can use capability-only access.
- Driver offline/local-storage, location permission, labor, safety, and device-management policy.
- Wholesale endpoint registration, multi-device/staff authorization, recovery, key verification, and revocation UX.
- Rate limits, anomaly rules, incident severity, notification, and support escalation authority.

These choices are launch-blocking where they govern production access. None is authorized by SEC-01 alone.
