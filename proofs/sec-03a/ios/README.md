# SEC-03A iOS public-API capture harness

**Status:** `SOURCE TYPE-CHECKED — EXECUTION PROOF BLOCKED`
**Target:** physical unmanaged iPhone/iPad; owner priority device is iPhone 15 Pro
**Deployment target:** iOS/iPadOS 17.0 for the isolated harness; not a production floor

Open `SEC03AProof.xcodeproj` with a working current Xcode installation. Select a disposable development team and a physical test device. No network or account configuration is required.

## Required first run

1. Record device model, iOS/iPadOS version and build, Xcode version, app commit, signing type, and test time.
2. Open **UIKIT**. Take a standard screenshot and a short native screen recording. The synthetic fixture should be readable; otherwise the capture test itself is invalid.
3. Open **BUFFER OFF**. Repeat the capture. It must be readable so the public property is the controlled variable.
4. Open **BUFFER ON**. Repeat the capture; this is the candidate result.
5. Start recording before entering **BUFFER ON**, then switch into it. Frame-step the saved video from the final control frame through the first protected frame.
6. Start recording while **BUFFER ON** is already visible. Frame-step the beginning of the artifact.
7. Record this as the initial C0/C1/C2 primitive result only. The current minimal source does not implement every state in I01–I30 and cannot support a platform conclusion. Expand the isolated harness to implement each applicable row, then execute all applicable I01–I30 tests before drawing that conclusion. Preserve original PNG/MOV artifacts and calculate SHA-256 hashes.

## Mechanism boundaries

- `AVSampleBufferDisplayLayer.preventsCapture` is a supported public property for image data displayed by that sample-buffer video layer.
- It does not document protection for sibling UIKit/SwiftUI views, controls, system UI, accessibility output, app-switcher snapshots, durable data, or extraction paths.
- The proof keeps synthetic secrets inside the candidate layer. Any future protected overlay must independently pass; assuming inheritance is prohibited.
- The capture-state indicator is observational only and does not redact content. This prevents reactive hiding from contaminating the sample-layer result.
- The screenshot notification is post-capture telemetry and never counts as prevention.
- The control does not use FairPlay. This isolates the layer property from DRM and tests an uncompressed synthetic sample buffer.
- Secure-text-field wrapping and private UIKit implementation classes are intentionally absent.
- If sample-buffer preparation fails, the candidate remains hidden behind a zero-information local placeholder. Returning from background also requires a fresh proof-mode selection. This is a small fail-closed harness behavior, not a production authorization or complete I29/I30 admission proof.

## Build status

On 2026-08-15, the local host contained Apple SDK headers that declare `AVSampleBufferDisplayLayer.preventsCapture` as available on iOS 13.0 and later. The three Swift source files passed direct `swiftc -typecheck` against the installed iPhone Simulator SDK for an arm64 iOS 17 simulator target. Both `xcodebuild` and `xcrun` failed before project evaluation because the installed Xcode could not load a required USDKit symbol. No linked application build, simulator launch, signing, installation, screenshot, or recording result is claimed.
