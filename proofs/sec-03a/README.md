# SEC-03A isolated iOS proof package

**Package:** Blowin' Smoke SEC-03A — iOS/iPadOS Protected-Rendering Investigation
**Date:** 2026-08-15
**Classification:** synthetic, non-production security proof
**Production authorization:** none

This package exists only to test one documented Apple rendering hypothesis: whether an `AVSampleBufferDisplayLayer` with `preventsCapture` enabled excludes every pixel in that layer from supported screenshots and recordings on a physical unmanaged iPhone or iPad.

It does not implement commerce, accounts, inventory, customer data, production authorization, cryptography, E2EE, media delivery, attestation, or a production interface. It contains no real product information or credentials. The two sample-buffer controls are pixel-identical except for `preventsCapture`; the ordinary UIKit control carries equivalent distinctive synthetic values so the OS capture path can first be validated.

The source uses public SDK declarations only. It deliberately excludes secure-text-field view wrapping, private UIKit classes, private selectors, layer-tree manipulation through UIKit internals, and undocumented capture flags.

## Current result

```text
PUBLIC API SOURCE HARNESS: CREATED
DIRECT SWIFT SDK TYPECHECK: PASS
PROOF SCOPE: INITIAL C0/C1/C2 PIXEL-PLANE PRIMITIVE ONLY
XCODE BUILD: BLOCKED — LOCAL XCODE FRAMEWORK LOAD FAILURE
SIMULATOR EXECUTION: NOT PERFORMED
PHYSICAL IOS/IPADOS EXECUTION: NOT PERFORMED
SCREENSHOT ARTIFACTS: NONE
SCREEN-RECORDING ARTIFACTS: NONE
APPROVED CLIENT: NONE
```

The local environment record is in [`results/2026-08-15-local-environment.json`](results/2026-08-15-local-environment.json). The source passed a direct Swift SDK type-check, but no linked app build or execution occurred. Device acceptance is governed by the [SEC-03A matrix](../../docs/security-assurance/sec-03a-ios-test-matrix.md), not by source inspection, type-checking, or a successful build.

## Proof boundary

The proof compares:

1. **CONTROL — ordinary UIKit:** synthetic text and blocks rendered as normal views. Readable capture is expected and confirms the test path is capable of capturing the app.
2. **CONTROL — sample-buffer protection off:** the candidate rendering pipeline with `preventsCapture = false`. Readable capture isolates the effect of the property from the rendering path.
3. **CANDIDATE — sample-buffer protection on:** the complete synthetic protected panel is rasterized into an uncompressed `CMSampleBuffer`, displayed by `AVSampleBufferDisplayLayer`, and the layer's public `preventsCapture` property is set before any protected frame is enqueued.

This is a narrow rendering proof, not the complete executable I01–I30 harness and not proof that an accessible, stateful wholesale application can safely be implemented as a video-layer surface. The current source can test the initial C0/C1/C2 pixel-plane property. Before any platform conclusion, the isolated proof must be expanded with the controlled states required by every applicable I01–I30 row, including overlays, transitions, dialogs, accessibility semantics, Dynamic Type, captions, task snapshots, external output, capture already active before reveal, extraction controls, and explicit admission failures.

## Acceptance

The saved PNG or MOV controls the result. The candidate passes a tested capture path only if the complete synthetic protected panel is black, redacted, omitted, or replaced by a zero-information security placeholder. A warning, callback, post-capture response, partial blackening, readable overlay, or one readable recording frame fails that path.

Do not deploy this package or connect it to a service. Do not infer Telegram's mechanism from its result.
