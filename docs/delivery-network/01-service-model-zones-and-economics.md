# Service Model, Zones, and Economics

## Service model

BSDN is a first-party, origin-based, same-day fulfillment mode. The initial operating origin is York, Pennsylvania. The exact pickup address, coordinates, operating entity, inventory-serving location, and receiving/return point are **OPEN authoritative operational inputs**; no inferred address may activate service.

Catalog inclusion creates a candidate only. A positive service-zone result cannot override product, destination, age, package, handoff, inventory, payment, or compliance evaluation. Material `UNKNOWN` or `SERVICE_ERROR` fails safe and preserves another valid fulfillment choice where one exists.

## Routed-distance authority

Zone assignment uses the approved road route from the active origin to the normalized destination. Straight-line/Haversine distance may support coarse prechecks or diagnostics but cannot authorize service, assign the payable zone, or set the final quote.

The routing boundary returns a route reference, origin/destination versions, routed miles, estimated duration, observation time, route/provider data version where available, and outcome (`ROUTED`, `NO_ROUTE`, `AMBIGUOUS_ADDRESS`, `SERVICE_ERROR`, or `STALE`). The canonical quote stores the result reference, not a mutable map response. Material route changes trigger a new quote.

## Initial configurable zone policy

| Zone | Routed-road-mile interval | Minimum reference | Initial status |
|---|---:|---|---|
| Z1 | `0 ≤ miles ≤ 20` | M1 | Configurable |
| Z2 | `20 < miles ≤ 40` | M2 | Configurable |
| Z3 | `40 < miles ≤ 60` | M3 | Configurable |
| Z4 | `60 < miles ≤ 80` | M4 | Configurable |
| Z5 | `80 < miles ≤ 100` | M5 | Configurable |
| Z6 | `100 < miles ≤ 120` | M6 | Configurable |

Exactly one active zone may own a routed distance for the same origin, service policy, and effective instant. Intervals may not overlap or leave an unintended gap. Boundary inclusion is explicit. The initial maximum is 120 routed miles; it is a versioned business ceiling, not a hardcoded permanent limit. Beyond the active ceiling, the result is `SAME_DAY_UNAVAILABLE_OUTSIDE_ACTIVE_DISTANCE`.

A zone version contains stable zone ID, display code, origin reference, lower/upper distance with inclusion rules, active status, merchandise-minimum reference, rate-policy reference, package classes, capacity/service-window references, effective interval, supersession reference, and audit context. Publishing validates coverage, ordering, and non-overlap.

### Activation and modification

- A zone can be `DRAFT`, `ACTIVE`, `PAUSED`, `RETIRED`, or `SUPERSEDED`.
- Pausing blocks new quotes but does not rewrite paid deliveries; operations apply explicit recovery.
- Future bounds, count, origin, rate, or minimum changes create new effective versions; they do not edit historical quotes.
- A pending policy is evaluated for conflicts before activation and can be rolled back by publishing a governed successor.
- Existing unexpired quotes follow an approved quote-honoring policy, which remains **OPEN**; they never silently inherit a new amount.

## Progressive merchandise minimums

The required invariant is:

```text
M1 < M2 < M3 < M4 < M5 < M6
```

Dollar amounts remain **OPEN**. Each minimum is currency-specific, effective-dated, and versioned. The evaluated basis is the qualifying merchandise subtotal for the exact cart after governed line discounts and eligibility; tips, taxes, delivery fees, credits, gift value, and other non-merchandise amounts do not count unless a future approved policy explicitly redefines the basis.

The evaluation returns `SATISFIED`, `BELOW_MINIMUM`, `UNKNOWN`, or `SERVICE_ERROR`, the qualifying subtotal, minimum reference, shortfall when calculable, currency, and evaluated cart version. Changing quantity, line eligibility, discount, destination, fulfillment mode, or zone invalidates the result.

## Package classes

`BSDN_STANDARD_30` permits a maximum combined declared delivery weight of 30 pounds. The package record also carries package count and any future approved handling constraints. Exact scale/measurement procedure and packaging limits are **OPEN**.

Outcomes are `STANDARD_ELIGIBLE`, `OVER_STANDARD_WEIGHT`, `SPECIALIZED_CLASS_REQUIRED`, `WEIGHT_UNKNOWN`, or `SERVICE_ERROR`. An order above 30 pounds—or with materially unknown weight—cannot silently use the standard class. The model permits separately governed heavier, oversized, fragile, temperature-sensitive, or specialized classes without redefining historical deliveries.

## Versioned rate architecture

BSDN owns the customer rate table. The owner's stated objective—rates competitive with comparable Uber Courier/package-delivery pricing for the standard package class—is an offline economics benchmark only, not a provider selection or adopted schedule. BSDN does not query Uber or another courier network at runtime to discover its price and does not copy or invent another company's rates.

A `Delivery Rate Version` can express:

- currency and effective interval;
- base charge;
- routed-mile components and their calculation basis;
- zone adjustment/reference;
- a future approved time, demand, capacity, or operational adjustment;
- customer delivery fee before and after governed override;
- driver-compensation input/reference, separate from customer fee;
- expected outbound/return mileage assumptions by reference;
- contribution/margin calculation inputs;
- override type, reason, authority, bounds, and expiry;
- calculation formula identifier/version and rounding policy;
- publication, supersession, and audit state.

All monetary values and adjustment rules are **OPEN**. A quote stores a complete calculation breakdown and rate version. Overrides are explicit, authorized, bounded, and auditable; a dispatcher cannot silently rewrite a fee. A customer fee is not driver pay, and a tip is neither.

## Capacity and service hours

Capacity is a time-bounded operational decision over active drivers, accepted workload, origin readiness, route duration, return/deadhead expectation, vehicle/package constraints, and safety/operating policy. It returns `AVAILABLE`, `LIMITED`, `UNAVAILABLE`, `UNKNOWN`, or `SERVICE_ERROR` with a capacity-policy version and optional next eligible window only when authoritative.

One driver may operate initially, but capacity is modeled as a collection of driver/vehicle/shift and delivery commitments. No `singleDriver` rule exists. Dispatch may reserve capacity when a quote is selected; reservation duration and overbooking policy are **OPEN**.

Service days, hours, blackout periods, order cutoffs, promises, driver shifts, break policy, weather/safety closure rules, and per-zone simultaneous limits are all **OPEN**. They remain versioned operational inputs. An inactive service window prevents a new quote and never produces an invented reopening time.

## Deadhead and round-trip economics

Customer distance is not the full operating cost. Each quote/delivery preserves separately:

1. routed outbound miles and duration;
2. expected return/deadhead miles and duration at quote time;
3. actual outbound movement where available;
4. actual post-delivery/return movement attributed under an approved method;
5. total attributed vehicle miles and driver time;
6. multi-stop allocation method/version if future batching is approved.

Expected deadhead may equal a return-to-origin route initially only if an approved operations policy says so. The architecture does not assume that every route returns directly, that multi-stop routing exists, or that all vehicle miles are customer-billable.

## Unit-economics contract

| Input/output | Source of truth | Status |
|---|---|---|
| Qualifying merchandise subtotal | Order pricing snapshot | Required |
| Merchandise gross margin | Approved cost/finance inputs | **OPEN until real costs exist** |
| Customer delivery revenue | Captured order/fee ledger | Required when paid |
| Driver tip | Tip ledger; reported separately | Required when applicable |
| Routed outbound miles | Quote/route and actual tracking context | Required |
| Expected return/deadhead | Versioned quote policy/route | Required as estimate |
| Actual attributable vehicle miles | Operations/vehicle methodology | **OPEN methodology** |
| Driver labor time/cost | Assignment milestones and approved compensation model | **OPEN** |
| Vehicle cost | Approved per-mile/time/fixed allocation inputs | **OPEN** |
| Payment/refund/credit effects | Payment and recovery ledgers | Required when applicable |
| Delivery contribution | Delivery revenue less approved delivery costs; exact formula versioned | **OPEN formula inputs** |
| Order contribution | Merchandise margin plus delivery contribution under approved finance method | **OPEN formula inputs** |
| Zone profitability | Aggregated versioned contribution by zone/effective policy | Derived only when inputs are complete |

Missing cost inputs produce `NOT_CALCULABLE`, not zero and not profit. Quotes may still be operationally unavailable until an approved economics policy exists.

## Quote/serviceability decision order

```text
AUTHORITATIVE ORIGIN + NORMALIZED DESTINATION
  → ROUTE AVAILABLE
  → ACTIVE DISTANCE CEILING AND ZONE
  → TRANSACTION ELIGIBILITY
  → STANDARD OR APPROVED PACKAGE CLASS
  → QUALIFYING MERCHANDISE MINIMUM
  → SERVICE WINDOW + CAPACITY
  → VERSIONED RATE CALCULATION
  → EXPIRING QUOTE
```

Each step records its own outcome. A negative or unresolved result cannot be concealed by a later price calculation.
