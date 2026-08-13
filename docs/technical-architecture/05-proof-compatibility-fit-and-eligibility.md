# Proof, Compatibility, Fit, and Eligibility

These are separate logical decision architectures. They share identifiers, provenance, audit and correction infrastructure but never collapse semantics.

## A. THCA proof

The canonical chain is:

```text
Product → exact Variant → received/packaged Batch → Applicability Relationship → Proof Document Version → Laboratory / Results
```

Applicability names exact endpoints and time scope. Product-name similarity, a nearby batch, marketing copy or a generic lab page cannot establish applicability.

| State | Meaning / behavior |
|---|---|
| Current | Applicable and within the owner-supplied currency rule; enables only the exact supported claim |
| Stale | Applicable evidence is outside its currency rule; label/suppress material claim and revalidate purchase if required |
| Missing | An expected accessible record is absent |
| Not Supplied | The accountable source has not supplied the expected record |
| Unmatched | A document exists but cannot be tied to exact product/variant/batch/sample |
| Superseded | Retained history; a newer governed document version controls |

Source, issuer, document identity/version, rights/access, sample/method/result scope, received/verification dates and currentness rule are mandatory when applicable. Invalidation emits a correction/staleness event, suppresses dependent claims, invalidates projections and revalidates affected carts. Storage outage is a document-access service error, not Missing and not negative proof. Proof never establishes eligibility, safety, product quality or purchase approval.

## B. Electronic compatibility

Every relationship names source and target product/variant/model/revision, direction, relationship type, conditions, required intermediary, operating constraints, evidence, verifier, verification/effective dates and review rule.

States are Compatible, Incompatible, Conditionally Compatible, Universal with a named bounded class, Unknown/Unverified and Not Applicable. Reverse lookup is supported from either endpoint but may render different wording and constraints. Shared brand, connector appearance, reviews, co-purchase and titles do not establish compatibility.

Successor, replacement, included, required, optional, consumable and merely related relationships remain separate typed records. A successor is not automatically compatible. Invalidation removes the positive result, preserves history, updates both lookup directions, revalidates carts/bundles and routes uncertainty to support.

## C. Physical fit

A fit relationship names exact source/target variants and, where material:

- connection point and nominal size;
- source and target gender/type;
- angle and orientation;
- insertion depth and effective/total length;
- clearance envelope;
- tolerance and handmade variation;
- load/weight condition;
- required intermediary/adapter;
- material applicability;
- measurement source/method or documented pair test;
- verifier, version and effective/review time.

The state vocabulary matches electronic compatibility but remains a different domain. Nominal-size match alone cannot establish fit. Missing material geometry yields Unknown/Unverified. A photograph cannot establish measurement or fit. Conditional fit names every material condition/intermediary. Invalidation updates both endpoints and all dependent projections/carts while preserving evidence history.

## D. Age and eligibility

Age Qualification evaluates the minimum necessary customer context under a qualified rule/provider version. Destination and Product Eligibility separately evaluates exact destination, product/variant/format, quantity where governed, purchase/fulfillment method and the age result reference.

```text
Age Qualification
  + Destination Context
  + Exact Product / Variant / Format
  + Fulfillment Method
  + Effective Rule Version
  → Eligible | Ineligible | Unknown | Service Error
```

The architecture stores the minimum approved result/reference and audit facts, not raw sensitive evidence by default. Provider data exposure, retention, deletion, retry and operating ownership remain gated. Evaluation is idempotent for the same context/rule version and must be re-run when a material input or effective rule changes.

- `Eligible` applies only to the recorded context/version.
- `Ineligible` is a completed negative evaluation with a governed reason category.
- `Unknown` means the rules/data do not support a determination.
- `Service Error` means evaluation failed; it is not Ineligible and never defaults to Eligible.

Retries preserve the correlation/idempotency key and avoid duplicate provider actions. Audit records reference rule/provider version, inputs by minimized references, outcome, time and failure class without logging prohibited sensitive data.

## Mandatory semantic separations

| A | Is not B |
|---|---|
| Availability | Eligibility |
| Eligibility service error | Ineligibility |
| Proof | Purchase approval |
| Current proof | Generic success, quality or safety |
| Electronic compatibility | Physical fit |
| Related / successor / co-purchased | Compatible |
| Included | Required |
| Unknown | Compatible, eligible, current, available or safe |

No actual legal rule, age threshold, destination restriction, proof interval, compatibility result, physical-fit result or operational policy is encoded here. Those enter later as versioned authoritative records through the owning domain and adapter boundary.
