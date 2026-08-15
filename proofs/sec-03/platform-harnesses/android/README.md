# Android synthetic capture-harness definition

**Status:** `DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED`
**Candidate boundary:** Android 14 / API 34 or later, exact currently patched Google Play-certified OEM/device/build only
**Production stack selection:** none

## Included seed

The source defines one synthetic native `Activity` that:

- sets `FLAG_SECURE` before protected content is attached;
- requests `HIDE_OVERLAY_WINDOWS`;
- disables Recents screenshots on API 33+ as defense in depth;
- renders non-selectable synthetic text;
- opens a separate dialog and applies `FLAG_SECURE` to that dialog window;
- contains no networking, storage, account, commerce, or real protected data.

No Android build system is included because this is an isolated control seed rather than a production application or stack decision. The current host has no Android SDK, Android Studio, Gradle, `adb`, emulator, connected device, or usable Android execution path. The source has not been compiled.

## Required human/device proof

A proof runner must construct a disposable signed synthetic harness and record Android version/API, full build fingerprint, device/OEM/model, security patch, vendor and boot patch, Google Play system update, boot state, app certificate/build, renderer/framework versions, capture tool/version, output topology, result, and artifact hash.

The representative surface inventory must add and separately test:

- classic Views, Compose, text, high-resolution image, Canvas, `TextureView`, and `SurfaceView`;
- `SurfaceView.setSecure(true)` before attachment;
- Activity, traditional Dialog, Compose Dialog with `SecureFlagPolicy.SecureOn`, popup, bottom sheet, menu, transition, and every separately owned window;
- representative 4K synthetic stream;
- a separate MediaProjection helper;
- native recorder, alternate screenshot, casting/sharing, external display, Recents/background states;
- extraction paths T09–T20;
- Play Integrity/request binding, hardware-backed key attestation, trusted device, revocation, and resource tests T21–T35;
- TalkBack, Switch Access, keyboard/D-pad, magnification/scaling, captions/transcript, and high-contrast tests T36–T40.

Test physical Android 14, 15, 16, and 17 rows across multiple currently serviced OEM builds. An emulator can help development but is insufficient for final OEM compositor, recorder, output, hardware-attestation, or compromised-device evidence.

## Fail-closed rules

- Set and verify every applicable control before requesting protected payload.
- Do not reveal protected content on an unknown or unsupported OS/OEM/build/window/surface.
- An absent/empty/stale/mismatched integrity or access-risk verdict denies protected payload.
- Exclude WebView from the initial candidate boundary unless its extraction, cache, URL, debugging, file, JavaScript, print, and external-intent surfaces pass separately.
- Do not persist decrypted media in backups, device-to-device transfer, files, public storage, thumbnails, caches, notifications, logs, crash reports, or analytics.
- A capture callback is telemetry, not prevention.
- Root, privileged capture, instrumentation, or a compromised compositor is not claimed preventable.

Use the governing [test matrix](../../../../docs/security-assurance/sec-03-platform-test-matrix.md) for acceptance.
