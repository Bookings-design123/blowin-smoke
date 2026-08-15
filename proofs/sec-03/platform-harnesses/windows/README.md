# Windows synthetic capture-harness definition

**Status:** `DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED`
**Mechanism API floor:** Windows 10 version 2004 / build 19041
**Current candidate admission floor:** fully patched Windows 11 24H2 at minimum; Windows 11 25H2+ preferred for a new consumer proof
**Production stack selection:** none

## Included seed

`ProtectedWindow.cpp` creates one synthetic app-owned top-level Win32 `HWND`, applies `WDA_EXCLUDEFROMCAPTURE`, reads the affinity back, and terminates if either operation fails or the verified value is not exact. It contains no networking, storage, accounts, commerce, credentials, or real data.

The source has not been compiled or executed. The current macOS ARM64 host has no Windows VM/runtime, Windows SDK, Visual Studio, MSBuild, .NET SDK, Wine, QEMU, or Windows hardware. Cross-compilation would not prove runtime capture behavior.

## Required human/device proof

Run on exact, currently serviced Windows editions/builds with TPM 2.0 hardware. Record edition, build, architecture, device, GPU/driver, display topology, framework/runtime, package/signature, capture tool/version, output result, artifact hash, tester, and date.

Protect and separately verify every app-owned top-level window before content enters it. Test dialogs, tool windows, pop-outs, media windows, secondary windows, child/composition/video surfaces, and lifecycle transitions. Keep sensitive dialogs inside a protected parent where feasible; do not infer child or out-of-process inheritance.

Execute at minimum:

- Print Screen, Win+Print Screen, Win+Shift+S, all Snipping Tool modes and delayed capture;
- Snipping Tool recording, Xbox Game Bar, `Windows.Graphics.Capture`, `PrintWindow`/GDI, DXGI Desktop Duplication;
- ordinary OBS, Teams, Zoom, Discord, Miracast, multiple displays, virtual displays, and external display;
- RDP and RemoteApp as a denied/unknown topology until proven;
- Alt+Tab, Task View, taskbar thumbnail, minimize, lock, suspend, terminate, and stale preview paths;
- extraction T09–T20, resource/device T21–T35, Narrator/UI Automation and accessibility T36–T40.

A separate official UWP control may corroborate black capture through `ApplicationView.IsScreenCaptureEnabled=false` and Game Bar denial through `AppCapture.SetAllowedAsync(false)`. It is not a production-stack selection. Do not place protected content in WebView2 for the initial proof.

## Fail-closed rules

- A failed/unknown affinity call or unsupported OS/build denies protected payload.
- Do not infer DRM, remote-session protection, external-output protection, video-surface behavior, or third-party-tool behavior from the API documentation.
- Signed MSIX/package integrity and TPM-backed endpoint keys are separate trust layers; they do not prove the current capture state or an uncompromised runtime.
- Treat UI Automation as an intentional accessibility output boundary. Do not remove Narrator access to manufacture an extraction claim.
- Administrator/kernel compromise, injection, hooks, and privileged capture remain outside the supported guarantee.

Use the governing [test matrix](../../../../docs/security-assurance/sec-03-platform-test-matrix.md) for acceptance.
