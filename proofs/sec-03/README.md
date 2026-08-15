# SEC-03 isolated proof package

**Package:** Blowin' Smoke SEC-03 — Approved Client Proof & Platform Validation
**Date:** 2026-08-15
**Classification:** synthetic, non-production security proof
**Production authorization:** none

## Purpose

This package tests a narrow subset of the SEC-03 protected-client gate without implementing a wholesale application. It contains no production UI, accounts, commerce, inventory, customer/product data, credentials, production keys, or production providers.

The package deliberately separates:

1. a **runnable platform-neutral model** for fail-closed admission, short-lived protected-resource grants, device lifecycle, synthetic protected media, watermark minimization, and manifest clocks; and
2. **native capture harness definitions** that require real Android or Windows execution before they can produce capture evidence.

The runnable model cannot approve a client platform. Native documentation and source code cannot approve one either. See the [canonical SEC-03 verdict](../../docs/security-assurance/sec-03-approved-client-proof-and-platform-validation.md) and [T01–T41 matrix](../../docs/security-assurance/sec-03-platform-test-matrix.md).

## Current result

```text
PLATFORM-NEUTRAL NODE PROOF:
16 tests passed / 0 failed / 0 skipped

ANDROID CAPTURE PROOF:
BLOCKED — EVIDENCE NOT ESTABLISHED

WINDOWS CAPTURE PROOF:
BLOCKED — EVIDENCE NOT ESTABLISHED

APPLE WHOLE-SURFACE HARNESS:
NOT CREATED — NO QUALIFYING SUPPORTED PUBLIC MECHANISM ESTABLISHED

APPROVED / PROVEN CLIENT:
NONE
```

The local result is recorded in [`results/2026-08-15-local-proof.json`](results/2026-08-15-local-proof.json).

## Runnable proof

Requirements:

- Node.js 18 or later;
- no third-party packages;
- no network access;
- no credentials.

Run from this directory:

```sh
npm test
```

The model proves only that the included synthetic logic denies the tested missing, mismatched, stale, expired, revoked, replayed, and unsupported states. It does not prove a production server, real attestation, native capture protection, cryptographic protocol, durable-storage erasure, or accessibility behavior.

## Platform harness boundaries

| Directory | Purpose | Current execution state |
|---|---|---|
| [`platform-harnesses/android/`](platform-harnesses/android/) | Minimal native Android secure-window seed plus human/device plan | Source defined; not compiled or run |
| [`platform-harnesses/windows/`](platform-harnesses/windows/) | Minimal owned top-level Win32 capture-exclusion seed plus human/device plan | Source defined; not compiled or run |
| [`platform-harnesses/apple/`](platform-harnesses/apple/) | Records why no unmanaged whole-surface proof is asserted | No qualifying harness; Apple toolchain also unavailable |

Any future execution must use synthetic content only and record the exact platform, OS/build, device, framework, app build/signature, capture tool/version, display topology, expected result, actual result, output artifact hash, tester, and date. A readable protected pixel in a required normal capture path is a failure.

The saved artifact controls the result. Capture prevention passes; a black, fully omitted, or zero-information placeholder for the complete protected surface may pass. Detection, warning, deletion, pause-after-capture, or watermarking after a readable screenshot/frame does not pass. One readable frame fails the tested recording path. Transition and race testing must include reveal, navigation, dialogs, media changes, background/foreground, task switch, orientation/window change, lock/unlock, display attach/detach, and recording begun both before entry and while inside.

## Security boundaries

- `FLAG_SECURE` and `WDA_EXCLUDEFROMCAPTURE` are candidate platform controls, not universal DRM.
- Watermarks are defense in depth, not screenshot prevention or conclusive leak attribution.
- HTTP `no-store` is necessary but does not erase already stored data or compromised endpoints.
- Play Integrity, App Attest, package signing, key attestation, MSIX integrity, and TPM signals have distinct scopes; no single signal proves an uncompromised device.
- Accessibility is required. Removing semantic access to claim extraction resistance is not acceptable.
- External-camera capture is not preventable.

## Prohibited reuse

Do not deploy this package, connect it to real accounts or inventory, place real protected content in it, add production secrets, represent its models as production cryptography, or treat a local test pass as platform or launch approval.
