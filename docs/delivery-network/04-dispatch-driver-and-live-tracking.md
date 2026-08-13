# Dispatch, Driver, and Live Tracking

## Operating model

BSDN dispatch is a first-party control plane over canonical Delivery, Package, Driver Availability, Driver Assignment, Vehicle, GPS Session, ETA, Exception, and Return records. It can begin with one active driver, but assignment and capacity always use collections and stable IDs; no logic assumes a permanent singleton.

## Dispatch console

The console provides role-authorized, state-aware queues:

- orders awaiting preparation and packages awaiting verification;
- ready-for-dispatch deliveries;
- unassigned, offered, assigned, pickup-bound, picked-up, customer-bound, approaching, and arrived work;
- active/offline/unavailable drivers, location permission/heartbeat state, and vehicle availability;
- origin, routed miles, zone/version, package class/count/weight, quote timing and current ETA/range;
- age result and effective handoff requirement as minimized decision states, not raw documents;
- tracking freshness, instruction version/acknowledgment, exception, failure, return, and support escalation;
- completed deliveries with milestone and correction history.

Filters and projections never become state authority. High-risk actions require current record version, reason, actor authority, and idempotency key. Dispatch cannot mark payment, forge verification, authorize Leave at Door, or edit proof.

## Assignment

An assignment decision checks current delivery/package readiness, driver availability/authorization, vehicle eligibility, route/package constraints, active workload, and capacity policy. It records the considered version references and whether the decision was manual or policy-assisted.

```text
PROPOSED → OFFERED → ACCEPTED → ACTIVE → COMPLETED
                   ↘ DECLINED | EXPIRED
PROPOSED/OFFERED/ACCEPTED/ACTIVE → CANCELED
ACCEPTED/ACTIVE → REASSIGNMENT_REQUIRED → successor assignment
```

Driver accept/decline and offer expiry behavior are configurable and **OPEN**. Decline/cancel records a governed reason category without inventing a penalty. At most one active driver assignment controls one delivery unless a future explicit transfer/multi-party custody policy exists. A successor assignment never deletes the earlier attempt.

Invalid transitions include assigning an offline/unauthorized driver, two concurrent active assignments, accepting an expired offer, changing driver/vehicle inside an accepted record, pickup without package release, or reassignment without custody reconciliation.

## Driver lifecycle

Required normal states:

```text
OFFLINE → AVAILABLE → OFFERED → ASSIGNED
  → EN_ROUTE_TO_PICKUP → AT_PICKUP
  → EN_ROUTE_TO_DROPOFF → AT_DROPOFF
  → AVAILABLE

AT_PICKUP | EN_ROUTE_TO_DROPOFF | AT_DROPOFF
  → RETURNING → AVAILABLE
```

Governed exception substates include `LOCATION_PERMISSION_REQUIRED`, `TRACKING_STALE`, `TEMPORARILY_UNAVAILABLE`, `VEHICLE_EXCEPTION`, `SAFETY_HOLD`, and `ASSIGNMENT_EXCEPTION`. They do not erase the base assignment/custody state.

Valid transitions require authenticated driver/dispatcher authority, current assignment, and required milestones. `AT_PICKUP → EN_ROUTE_TO_DROPOFF` requires verified pickup and package custody. `AT_DROPOFF → AVAILABLE` requires completed handoff or a completed/received return path. Invalid transitions include `OFFLINE → ASSIGNED`, `OFFERED → AT_PICKUP`, direct `EN_ROUTE_TO_DROPOFF → DELIVERED` without handoff/proof, self-authorization of age/handoff, or `RETURNING → AVAILABLE` before store receipt where a package remains in custody.

## Driver mobile experience

The provider/framework-neutral mobile surface supports:

1. secure driver authentication, session/device status, and least-privilege assignment access;
2. availability and location-permission disclosure/control;
3. assignment offer and accept/decline where policy permits;
4. origin navigation, arrival, package identity/count/weight-class confirmation, and pickup verification;
5. explicit assumption of custody and tracking-session start;
6. destination navigation and GPS sharing with health/freshness indicator;
7. current delivery state, minimized customer contact mechanism, age result, effective handoff requirement, and current instructions;
8. approaching/arrival commands and instruction acknowledgment;
9. direct handoff or authorized Leave at Door workflow and required proof;
10. exception/failure reason, dispatcher/support escalation, return routing, store receipt, and completion.

The app must support keyboard/screen-reader semantics where applicable, large touch targets, clear focus, non-color status, reduced motion, low-connectivity recovery, and no critical action available only through gesture or animation.

## Replaceable mapping, routing, and navigation boundary

No mapping provider is selected. Canonical contracts separate:

| Capability | Input | Output / fail-safe behavior |
|---|---|---|
| Geocode/normalize | Minimized entered address + purpose | Candidate reference, coordinates/quality, ambiguity/error; never auto-select ambiguous result |
| Route/distance | Origin/destination refs, vehicle/package constraints where approved, observation time | Route ref, routed miles/duration, status/version; no Haversine authorization fallback |
| ETA | Current route, accepted location, delivery milestones, relevant operating inputs | Estimate/range, confidence/quality, generated time; stale/error explicit |
| Driver navigation | Authorized active assignment and endpoints | Deep link/session/instructions; navigation outcome cannot change canonical delivery state |
| Customer map projection | Reduced current location/route/status and valid tracking authorization | Purpose-limited view; no raw history/full precision beyond approved need |

Every adapter has bounded timeouts, categorized errors, idempotent/replay-safe behavior, correlation, health/lag visibility, redacted audit, versioned mapping, export, and replacement tests. Provider output is evidence/input; BSDN remains state authority.

## GPS permission and location pipeline

```text
DRIVER CONSENT/PERMISSION + ACTIVE ASSIGNMENT
  → GPS TRACKING SESSION
  → DEVICE LOCATION OBSERVATION
  → AUTHENTICATED INGEST + SESSION/SEQUENCE VALIDATION
  → QUALITY / PLAUSIBILITY CLASSIFICATION
  → APPEND-ONLY LOCATION EVIDENCE
  → REDUCED CURRENT-LOCATION PROJECTION
  → ROUTE / ETA UPDATE
  → CUSTOMER, DRIVER, AND DISPATCH PROJECTIONS
```

Each accepted observation includes session and assignment references, observed and received times, coordinate precision, accuracy/quality, sequence/deduplication key, device/app source alias, and audit context. Rejected or implausible observations are retained only as governed diagnostic evidence and cannot silently move the public marker.

Sampling rate, background-location behavior, precision, geofence thresholds, stale timeout, off-route handling, retention, and driver consent/labor policy are **OPEN**. Tracking runs only for the declared delivery purpose and bounded session. GPS revocation stops collection immediately, records the event, marks tracking degraded, and invokes operational recovery; it does not automatically claim driver fault or delivery failure.

## Delivery Hub and tracking-token security

The Delivery Hub shows only customer-authorized projections: current customer-facing state, approximate/live position at approved precision, ETA/range and freshness, age status, handoff preference/effective result, instruction status, tipping actions where allowed, completion/proof summary, and support/recovery entry.

Access uses an opaque, high-entropy, purpose-bound tracking grant associated with the exact delivery/customer/session and limited actions. It is short-lived or revocable under approved policy, transported securely, protected against enumeration/replay, never logged in plaintext, and rotated/revoked after suspicious access or completion according to policy. Sensitive writes require stronger authenticated/step-up context where appropriate; possession of a view link alone must not authorize handoff changes, tips, or personal-data access unless explicitly approved.

The customer never receives driver phone/home address, raw route history, exact off-duty location, internal notes, vehicle/private records, full custody ledger, or raw age/proof evidence. Driver contact uses a minimized approved channel.

## Status synchronization

Canonical writes commit state, audit, and an outbox event atomically. Projections consume at least once with event-ID deduplication and per-delivery ordering. Each view carries state version and last-updated/freshness information. A later low-version update cannot overwrite a newer state. Reconnect replays from the last acknowledged sequence and reconciles current canonical state before enabling actions.

### View responsibilities

| Surface | Sees | Can command |
|---|---|---|
| Customer Delivery Hub | Approved delivery state, ETA/location projection, age/handoff/instruction/tip/completion/support state | Governed preference/instruction/tip/feedback/support actions |
| Driver mobile | Current assignment/package, route, minimized recipient context, effective handoff, instructions, tracking/proof/exception state | Availability, offer response, milestones, custody, arrival, proof, exception, return |
| Dispatcher | Operational queues, active drivers/vehicles, detailed freshness/routes, milestones, exceptions/returns | Authorized assignment, exception acknowledgment, reassignment/return/escalation commands |
| Support/recovery | Necessary delivery/order/feedback/custody summaries and access-controlled evidence refs | Case actions within role; no delivery truth rewrite |

## Stale, offline, and reconnect behavior

| Condition | Required response |
|---|---|
| Delayed observation | Keep last accepted location labeled with freshness; never animate fabricated movement |
| Stale threshold reached | Mark tracking `STALE`, suppress misleading live claim, alert driver/dispatch under policy, keep canonical delivery state |
| Driver app offline | Queue only commands safe for local capture; show pending; reconcile server version before commit; no false completion |
| GPS permission revoked | End/pause session, disclose degraded tracking, require governed operational action |
| Routing/ETA unavailable | Preserve delivery, mark ETA unavailable/stale, do not substitute invented time |
| Duplicate/out-of-order events | Deduplicate/order by aggregate version; audit conflicts |
| Reconnect | Authenticate, refresh assignment/state, upload idempotent queued evidence, resolve version conflicts explicitly |
| Tracking service outage | Use durable milestones/dispatch contact as governed fallback; analytics outage never blocks operations |

## Multiple drivers and reassignment

Dispatch ranks or presents eligible drivers only after approved policy exists; no algorithm or performance target is invented. Each assignment attempt is independent. Reassignment records reason, prior/new driver and vehicle, custody location/status, tracking-session closure/new session, package verification/transfer where applicable, customer-visible consequence, and ETA successor.

Before pickup, reassignment may follow normal offer flow. After pickup, it requires an explicit custody transfer or return-to-store workflow; a database driver-ID edit is invalid. One driver's feedback, location, and proof remain bound to that driver's assignment segment.
