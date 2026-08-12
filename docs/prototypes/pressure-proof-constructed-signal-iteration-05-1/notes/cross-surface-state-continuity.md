# Iteration 05.1 Cross-Surface State Continuity

## Governing narrative

The Counterweight line existed in the cart before the customer supplied or changed the owned-piece context. That context change triggered revalidation and exposed an incompatible direct connection plus an unresolved conditional adapter route. The blocked Fitted PDP action never succeeds.

| SURFACE | PRODUCT ID | VARIANT ID | OWNED CONTEXT | EVENT | STATE | PRICE | CUSTOMER CONSEQUENCE |
|---|---|---|---|---|---|---:|---|
| Fitted Component PDP | `DEMO-GLASS-214` | `DEMO-GLASS-214-V14F45` | `DEMO-GLASS-110-VSG` | Customer reviews current decision | Direct `INCOMPATIBLE`; adapter `CONDITIONALLY_COMPATIBLE`; clearance `UNKNOWN_UNVERIFIED` | $32 | Add to cart unavailable; measure before relying on adapter route. |
| Quick Cart | `DEMO-GLASS-214` | `DEMO-GLASS-214-V14F45` | `DEMO-GLASS-110-VSG` | Existing line → owned context changed → line revalidated | Existing line needs review; same direct/conditional/unknown states | $32 | View Full Cart or continue shopping; no readiness claim. |
| Full Cart | `DEMO-GLASS-214` | `DEMO-GLASS-214-V14F45` | `DEMO-GLASS-110-VSG` | Revalidation history retained on `DEMO-CART-LINE-01` | Highest issue expanded; same direct/conditional/unknown states | $32 | Resolve the incompatible line before progression. |

Quantity remains 1. Direct relationship `DEMO-REL-PHYS-001` remains incompatible. Conditional relationship `DEMO-REL-PHYS-002` remains dependent on adapter `DEMO-GLASS-310-V14MM`; clearance remains unknown. No product, variant, owned target, state, reason, recovery, price, or chronology changes silently.

