# VaporDNA Research Closure — Compatibility Architecture Decision

**Project:** Blowin' Smoke  
**Research phase:** Vape & Nicotine domain discovery  
**Decision status:** Governing research decision  
**Research status:** Closed for the current discovery phase

## Research conclusion

VaporDNA established the domain problem:

A vape/nicotine customer can purchase a legitimate, available product that is still unusable because it is incompatible with the device, platform, pod, coil, tank, cartridge, accessory, or replacement system they own.

The research also established that device purchases, consumable purchases, replacement purchases, accessories, and disposables have different lifecycle and decision requirements.

That is sufficient domain evidence.

## Deliberate research boundary

We will **not** spend additional research time determining exactly how VaporDNA implements:

- device-to-pod compatibility;
- device-to-coil compatibility;
- tank-to-coil compatibility;
- reverse component-to-device lookup;
- compatibility-aware recommendations;
- compatibility filters;
- cart compatibility validation;
- sold-out compatible alternatives;
- replacement-cycle behavior;
- exact VaporDNA compatibility UI.

These behaviors were **not verified** and must never be represented as observed VaporDNA behavior.

The absence of verified VaporDNA compatibility behavior is not a blocking research gap. Blowin' Smoke will use independent product and design judgment to define a better, original compatibility architecture based on the customer problem already established by the research.

## Original Blowin' Smoke requirement

Blowin' Smoke will define its own compatibility architecture.

The architecture should be based on verified product relationships and customer decision logic rather than imitation of VaporDNA.

Candidate relationship model:

```text
DEVICE / PLATFORM
       ↕
POD / TANK / CARTRIDGE
       ↕
COIL / REPLACEMENT COMPONENT
       ↕
COMPATIBLE CONSUMABLE
       ↕
ACCESSORY
```

Relationships must be bidirectional where appropriate.

A customer should eventually be able to begin with:

> I own this device.

and retrieve verified compatible components.

A customer should also be able to begin with:

> I need this pod, coil, or part.

and see the devices or platforms it supports.

## Compatibility states

The future system should distinguish at minimum:

- **COMPATIBLE**
- **INCOMPATIBLE**
- **CONDITIONALLY COMPATIBLE**
- **UNIVERSAL**
- **UNKNOWN / UNVERIFIED**

Unknown compatibility must never be silently treated as compatible.

## Commerce consequence

Compatibility should eventually be capable of influencing:

- product discovery;
- search;
- filtering;
- PDP information;
- recommendations;
- bundles;
- Add to Cart readiness;
- cart validation;
- replacement discovery;
- sold-out alternatives;
- post-purchase replenishment.

The exact implementation remains an **original Blowin' Smoke design and engineering decision**.

## Evidence discipline

Do not retroactively attribute this architecture to VaporDNA.

The source research established the **problem**.

Blowin' Smoke is defining the **solution**.

Any future document, design, requirement, or implementation that references this decision must preserve that distinction. Unverified VaporDNA behavior must remain unverified and must not be cited as precedent for Blowin' Smoke's architecture.

## Research status

VaporDNA research is now **closed for the current discovery phase**.

Do not recommend additional VaporDNA research unless a future concrete implementation decision reveals a material domain question that cannot reasonably be resolved through original product judgment or authoritative product/manufacturer data.

This closure does not begin implementation and does not finalize the architecture's technical design. It records the decision to stop competitor research and proceed through original Blowin' Smoke product, design, engineering, and data judgment when implementation planning begins.
