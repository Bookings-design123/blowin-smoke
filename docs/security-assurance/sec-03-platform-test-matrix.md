# SEC-03 — Protected Client Platform Test Matrix

**Version:** 1.0
**Date:** 2026-08-15
**Status:** Evidence-backed test definition; no production client approved
**Scope:** Synthetic, isolated, non-production validation only

This matrix is subordinate to the [SEC-03 canonical report](./sec-03-approved-client-proof-and-platform-validation.md) and should be read with the [isolated proof package](../../proofs/sec-03/README.md). It does not authorize production implementation, Private Wholesale launch, a production stack, or any weakening of the Protected Content release gate.

## Reading the dispositions

The following phrases have exact meanings in this matrix:

- **REJECTED — NO QUALIFYING SUPPORTED CONTROL:** current authoritative evidence does not establish a supported public mechanism that can satisfy the test for arbitrary protected application UI. An observed third-party effect, capture notification, capture-state detection, undocumented secure-text behavior, private API, or implementation accident cannot change this result.
- **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED:** authoritative documentation supports a plausible control, but this SEC-03 workspace could not run the required operating system, SDK, device, or representative capture path. This is not a test pass and not a platform approval.
- **DEVICE EXECUTION BLOCKED:** a control or interface can be defined, but it has not been exercised on the named platform. This is not a pass.
- **LOCAL LOGIC PASS — NOT A PLATFORM PASS:** the platform-neutral Node proof returned the required fail-closed result. It does not prove real code signing, hardware-backed endpoint identity, platform attestation, capture exclusion, native cache behavior, or accessibility on any client platform.
- **NOT PREVENTABLE:** the path is outside software control. It remains a disclosed physical limit and is not allowed to erase otherwise valid results for supported digital capture paths.

An allowed SEC-03 platform verdict is assigned only by the canonical report. A row disposition must never be promoted into `PROVEN CANDIDATE` without authoritative mechanism evidence, representative execution, bypass/failure testing, and an exact platform/version/framework record.

## Superseding hard capture-output rule

The acceptance question is the **actual screenshot or recording artifact**, not whether the client noticed a capture attempt. A qualifying result must do one of the following:

- prevent the artifact from being created; or
- make the protected surface black or fully redacted, with **zero protected information** in the artifact.

Zero-information exclusion covers private wholesale inventory; classified strain names; prices; quantities and availability; strain profiles; photographs; video; messages; negotiation information; manifests; customer/order-sensitive information; and protected navigation or context. One readable protected frame, transition frame, thumbnail, partial image, text fragment, price, identifier, metadata-bearing preview, or other protected information is a failure. Detecting capture, showing a warning, deleting an artifact after creation, logging the event, or adding a watermark after protected content was captured also fails. Watermarking remains defense-in-depth only.

Every capture path must include race and transition attempts **before, during, and after reveal**, including navigation into and out of the protected surface, dialogs, image and video loading, background/foreground, task switching, orientation or window-size change, lock/unlock, external-display attach/detach, recording started before protected entry, and recording started while already inside. If protection is missing, unknown, late, stale, revoked, unsupported, or cannot be established, the client must fail closed to a non-sensitive unavailable surface before fetching, decoding, decrypting, or rendering protected payload.

## Common acceptance rules

1. A screenshot test passes only when no artifact is created or the artifact shows a black/fully redacted protected region with zero protected information. A non-sensitive unavailable placeholder may replace the protected surface. A callback after any protected information was saved is a failure.
2. A screen-recording or capture-API test passes only when every output frame contains zero protected information throughout entry, reveal, interaction, transition, backgrounding, and exit. Detection while protected information continues to be recorded is a failure; one readable frame fails the entire run.
3. A control must fail closed. If the required protection cannot be established before payload delivery or protected rendering, the client must show only a non-sensitive unavailable surface. No protected payload, decoded media, transition frame, thumbnail, or stale protected UI may appear.
4. Extraction tests cover ordinary client-supported paths. They do not claim resistance to privileged instrumentation, reverse engineering, endpoint compromise, manual transcription, or a second camera.
5. Accessibility must remain functional. Removing copy, selection, or export actions must not remove screen-reader access, equivalent navigation, text enlargement, captions/transcripts, high contrast, or usable order verification.
6. All proof content must remain synthetic. No customer, product, price, account, wholesale-room, or production credential data may be used.

## T01–T08 — Capture

| ID | Exact test and acceptance | iOS / iPadOS (unmanaged) | Android | Windows | macOS (unmanaged) |
|---|---|---|---|---|---|
| **T01** | **Screenshot — standard OS shortcut/control.** Display synthetic protected text, image, and video states; invoke the platform's normal screenshot control. Pass only if no artifact is created or the protected surface is black/fully redacted with zero protected information. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** No verified public arbitrary-UI screenshot veto; post-capture notification is insufficient. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Expected control: `FLAG_SECURE` on every protected window before rendering. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Expected control: capture affinity on every owned top-level protected window, with hard failure if affinity cannot be set. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** No verified target-controlled public arbitrary-UI screenshot exclusion mechanism. |
| **T02** | **Screenshot — alternate supported OS path.** Repeat T01 using a second supported path, such as accessibility/vendor capture UI or Screenshot/Snipping tooling. Absence of one path must be recorded; it cannot be silently skipped. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** An alternate screenshot path does not become protected by notification or detection. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Vendor, Recents, Assistant, or accessibility capture paths must be exercised where present. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Snipping Tool and Print Screen must be tested separately. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** Screenshot shortcuts and Screenshot app remain within the unsupported whole-UI boundary. |
| **T03** | **Screen recording — native OS recorder.** Start recording both before protected entry and while already inside; exercise every reveal and transition state. Pass only if every output frame is black/fully redacted at the protected surface and contains zero protected information. One readable frame fails. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** Active-capture detection does not itself exclude arbitrary UI from the recording. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** `FLAG_SECURE` is the expected control; the stock recorder and relevant OEM recorder must be exercised. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Native recorder/Game Bar paths require direct proof; display affinity is not DRM. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** Capture awareness is not target-controlled exclusion for arbitrary UI. |
| **T04** | **Screen recording — supported capture API.** Capture using a documented public API; begin both before protected entry and while already inside; inspect every frame through protected exit. Pass only if the protected surface is black/fully redacted and zero protected information appears in every frame. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** ReplayKit/capture-state handling does not establish a general arbitrary-UI exclusion. Narrow protected-media behavior cannot qualify the whole surface. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Exercise a `MediaProjection` capture client against Views, Compose, WebView, image, text, and video variants. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Exercise Windows Graphics Capture and any other declared supported public capture API. | **REJECTED — NO QUALIFYING SUPPORTED CONTROL.** A capturing application can use supported capture APIs; no verified target-controlled arbitrary-UI exclusion was established. |
| **T05** | **Display mirroring.** Mirror the protected client through each declared supported system path. Pass only if the destination shows a black/fully redacted protected surface with zero protected information, or the client fails closed before protected delivery/rendering. | **REJECTED — NO QUALIFYING SUPPORTED WHOLE-SURFACE CONTROL.** AirPlay/route detection or narrow media protection does not establish exclusion for the complete wholesale UI. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Secure versus non-secure display behavior, casting, and OEM paths require representative device proof. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Mirroring and remote presentation paths must be proved separately; capture affinity alone is not assumed to cover every path. | **REJECTED — NO QUALIFYING SUPPORTED WHOLE-SURFACE CONTROL.** No qualifying target-controlled arbitrary-UI exclusion was established. |
| **T06** | **External display.** Attach/detach or create each declared supported external display before, during, and after reveal; move/duplicate the protected surface. Pass only if the external output has zero protected information or the client fails closed before protected delivery/rendering. | **REJECTED — NO QUALIFYING SUPPORTED WHOLE-SURFACE CONTROL.** External-display observation or app policy is not proven capture/output enforcement. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Physical and virtual displays, secure/non-secure classification, and vendor behavior require direct proof. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Extended/duplicated displays and Remote Desktop require direct proof; display affinity is not treated as DRM. | **REJECTED — NO QUALIFYING SUPPORTED WHOLE-SURFACE CONTROL.** No qualifying public target-controlled mechanism was established. |
| **T07** | **App/task preview.** With protected content visible, enter Recents, task switcher, Mission Control, taskbar preview, or equivalent before, during, and after reveal. Pass only if the preview is omitted or shows a black/fully redacted or non-sensitive unavailable surface with zero protected information. | **DEVICE EXECUTION BLOCKED; PLATFORM OTHERWISE REJECTED.** A lifecycle privacy cover would require execution and cannot cure T01–T06. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Test Recents snapshots for the activity, dialogs, and every protected window. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Test Alt-Tab, taskbar thumbnails, multiple windows, and dialogs. | **DEVICE EXECUTION BLOCKED; PLATFORM OTHERWISE REJECTED.** Preview redaction would not cure T01–T06. |
| **T08** | **Backgrounding while protected content is visible.** Background, foreground, lock/unlock, switch user/session where applicable, and immediately return before, during, and after reveal. Pass only if every transition, snapshot, notification, thumbnail, and restored frame contains zero protected information. | **DEVICE EXECUTION BLOCKED; PLATFORM OTHERWISE REJECTED.** Lifecycle redaction can be evaluated separately but cannot qualify the platform. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Test pause/stop transitions, lock screen, process recreation, and return. | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED.** Test minimize, lock, session switch, suspension, and restore across all owned windows. | **DEVICE EXECUTION BLOCKED; PLATFORM OTHERWISE REJECTED.** Lifecycle redaction can be evaluated separately but cannot qualify the platform. |

### Mandatory capture variants for a human run

- **iOS/iPadOS, only if authoritative evidence reopens the platform:** hardware-button and alternate screenshot paths; native screen recording; ReplayKit; AirPlay/mirroring; QuickTime capture; app-switcher snapshot; background/lock transition; external display; protected text, image, media, dialog, and accessibility states. No secure-text-field wrapper, private UIKit behavior, or undocumented rendering trick may be tested as a qualifying mechanism.
- **Android:** hardware-button screenshot; every supported OEM/Recents/Assistant alternate path; stock and OEM screen recorder; a separate `MediaProjection` capture app; non-secure virtual display; casting/mirroring; physical external display where supported; Recents/background/lock; Activity, Dialog, overlay, WebView, Compose, native View, image, text, and video surfaces. Every separately created protected window must establish `FLAG_SECURE` before content is bound.
- **Windows:** Print Screen; Snipping Tool image and recording modes; Game Bar; Windows Graphics Capture; every other declared supported public capture API; mirrored and extended displays; Remote Desktop; Alt-Tab and taskbar thumbnails; child windows, owned top-level dialogs, multiple windows, text, image, and video surfaces. Every owned top-level protected window must establish `WDA_EXCLUDEFROMCAPTURE` or the canonical supported equivalent before rendering.
- **macOS, only if authoritative evidence reopens the platform:** keyboard and Screenshot-app still capture; native recording; ScreenCaptureKit; AirPlay/mirroring; external display; app/Mission Control previews; background/lock; text, image, and media surfaces. Private APIs and brittle tricks cannot qualify.

## T09–T20 — Ordinary extraction

No native client was executed in SEC-03. Every extraction row therefore remains **DEVICE EXECUTION BLOCKED** on iOS/iPadOS, Android, Windows, and macOS. On iOS/iPadOS and macOS this independent result does not alter the platform's capture-based rejection.

| ID | Exact test and acceptance | iOS / iPadOS | Android | Windows | macOS |
|---|---|---|---|---|---|
| **T09** | **Copy protected text.** Invoke keyboard, context-menu, command, and assistive-action copy paths. Pass only if no protected text reaches any clipboard or paste target while screen-reader reading remains available. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T10** | **Select protected text.** Attempt pointer/touch/keyboard selection, selection handles, select-all, and accessibility selection actions. Pass only if protected ranges cannot be selected for extraction; semantic assistive access must remain usable. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T11** | **Share protected content.** Invoke every visible, keyboard, context, system-share, and automation path. Pass only if no share activity/intent/contract or serialized protected payload is produced. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T12** | **Save image.** Attempt long-press/context save, Photos/Gallery/Files save, screenshot-derived save, and any media action. Pass only if no protected image or unprotected derivative is written through an ordinary supported path. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T13** | **Save video.** Attempt media-context, player, gallery, file, and system save actions. Pass only if no complete video, segment, original, or unprotected derivative is written through an ordinary supported path. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T14** | **Download media.** Inspect UI, network handoff, download manager, browser/WebView, and player actions. Pass only if no ordinary download action or durable downloaded protected asset exists. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T15** | **Print.** Invoke keyboard shortcut, menu/context action, system print UI, print contract/intent, and PDF-print path. Pass only if protected content cannot be printed or rendered into a printable artifact. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T16** | **Drag/drop.** Drag text, image, video, link, selection, and whole-surface representations into same-app and external targets. Pass only if no protected payload, preview, file promise, or reusable locator leaves the protected surface. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T17** | **Open original.** Invoke media, context, accessibility, developer-supported, and external-app actions. Pass only if no original asset, external viewer, public locator, or less-protected representation opens. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T18** | **Export.** Exercise all in-app and OS integration export commands, including PDF/file creation where supported. Pass only if no protected content or usable derivative is exported. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T19** | **Clipboard extraction.** Inspect all ordinary clipboard types after copy/cut, keyboard, context, rich-data, image, link, and automation attempts. Pass only if no protected plain text, rich text, bitmap, file, URL, or metadata is present. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T20** | **Deep-link/direct-resource reuse.** Capture any exposed route, token, locator, player request, or resource identifier and replay it after use, expiry, revocation, and from a wrong account/room/endpoint/client. Pass only if no durable locator exists and every unauthorized replay is denied without protected bytes. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |

Extraction controls must be retested with keyboard/switch access and screen readers enabled. Passing by making protected content inaccessible to legitimate assistive technology is a failure.

## T21–T35 — Resource admission and device lifecycle

The isolated Node proof was executed locally on 2026-08-15 using Node.js 18.17.0 on macOS 26.6.1 (25G76), arm64. It returned **16 passed, 0 failed**. The cases in [`proof-model.test.mjs`](../../proofs/sec-03/test/proof-model.test.mjs) cover T21–T34 plus supporting no-store, synthetic-media, watermark, admission-evidence, and clock invariants.

This result proves only deterministic application-level policy behavior in the synthetic model. The fixture labels a release as Android, but it is not an Android execution and must not be reported as one. Fields such as `signed`, `integrityEvidenceId`, `endpointId`, and `captureControlState` are synthetic server-held records, not proof of operating-system signatures, attestation, hardware-bound keys, or native capture controls.

| ID | Exact test and acceptance | iOS / iPadOS | Android | Windows | macOS |
|---|---|---|---|---|---|
| **T21** | **Expired media grant.** Advance to the exact expiry boundary and redeem. Pass only if redemption is generically denied and returns no protected resource. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T22** | **Revoked media grant.** Revoke before redemption. Pass only if redemption is generically denied and returns no protected resource. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T23** | **Wrong account.** Redeem an otherwise valid grant under a different account. Pass only if the result is the same generic denial and exposes no account/resource existence detail. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T24** | **Wrong room.** Redeem under a different wholesale room. Pass only if the result is the same generic denial and no protected resource is returned. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T25** | **Wrong endpoint.** Redeem from a different endpoint identity. Pass only if the grant remains endpoint-bound and access is denied. Real client proof must use a cryptographically established endpoint, not a claimed string. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T26** | **Unsupported client.** Request or redeem with a release outside the support registry. Pass only if protected payload admission is denied before delivery. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T27** | **Stale client version.** Mark the build stale and request protected content. Pass only if admission is denied before delivery. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T28** | **Tampered/unsigned client.** Request as an unsigned or untrusted build. Pass only if admission is denied before delivery. The local Boolean fixture is policy logic only; native signature, attestation, and tamper evidence remain unproved. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T29** | **Reused resource token.** Redeem once, then replay the identical token. Pass only if the first authorized use consumes it and every replay is generically denied. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T30** | **Enumerated resource ID.** Guess/substitute a resource identifier at grant issue and redemption. Pass only if neither enumeration nor substitution returns protected content or an existence oracle. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T31** | **Add device without trusted-device authorization.** Attempt enrollment without a currently trusted authorizer. Pass only if no trusted endpoint or protected history access is created. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T32** | **Add device with valid authorization.** Complete a fresh, one-use, expiring authorization from a currently trusted endpoint. Pass only if the intended new endpoint is enrolled, the ceremony cannot replay, and historical access is not silently granted. Real signature/key confirmation remains unproved. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T33** | **Revoke trusted device.** Revoke an enrolled endpoint, then attempt grant redemption and device authorization. Pass only if its grants are invalidated and it cannot access content or authorize another device. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T34** | **Lost-device scenario.** Exercise all-device-loss recovery. Pass only if insufficient evidence is denied, old endpoints are revoked, a new cryptographic identity is created after the approved evidence ceremony, and old protected history is not silently recovered. | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS | LOCAL LOGIC PASS — NOT A PLATFORM PASS |
| **T35** | **Root/jailbreak/modified environment where testable.** Run the capture, extraction, admission, key-storage, and attestation cases on a representative privileged/modified environment. Record bypasses, false positives, privacy effects, and what integrity evidence does not establish. Pass cannot mean “infallible detection.” A mandatory compromised state must fail closed. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |

Before any platform can rely on T21–T34, a native integration run must replace synthetic trust fields with the actual signed build, endpoint key, version registry, freshness signal, revocation record, and justified platform integrity evidence. Protected bytes and native caches must be inspected—not merely the API status code.

## T36–T40 — Accessibility

No device accessibility run occurred. All four platforms remain **DEVICE EXECUTION BLOCKED** for every row. Accessibility cannot be deferred as a production-only concern because anti-extraction controls can directly damage assistive use.

| ID | Exact test and acceptance | iOS / iPadOS | Android | Windows | macOS |
|---|---|---|---|---|---|
| **T36** | **Screen reader.** Using the platform screen reader, reach all protected content needed for ordering, hear meaningful names/roles/states/order, operate every required control, and verify media alternatives. Pass only if access is complete and no ordinary copy/share/export action is introduced. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T37** | **Keyboard/switch navigation.** Complete protected viewing and order verification without touch/pointer-only interaction. Pass only with logical order, visible focus, no focus trap, equivalent actions, and no extraction-only bypass. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T38** | **Text enlargement.** Apply the maximum declared supported system text size/zoom and display scaling. Pass only if protected text remains readable, operable, ordered, and free of critical clipping/overlap without exposing an unprotected fallback. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T39** | **Captions/transcript.** For synthetic video/audio, enable captions and access the protected transcript or equivalent. Pass only if equivalent information and controls are usable without creating an ordinary downloadable/exportable unprotected asset. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |
| **T40** | **High contrast.** Enable the platform high-contrast/increased-contrast setting and inspect text, watermark, focus, states, controls, errors, and security placeholders. Pass only if information and operation remain perceivable without relying on color alone. | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED | DEVICE EXECUTION BLOCKED |

## T41 — Physical capture limit

| ID | Exact test and acceptance | iOS / iPadOS | Android | Windows | macOS |
|---|---|---|---|---|---|
| **T41** | **External second camera.** Photograph or record the physical display with a separate camera. Expected result: readable pixels may be captured. Record the visible privacy-minimized watermark and disclosure. This test must remain `NOT PREVENTABLE`; watermarking is defense-in-depth, not screenshot prevention and not proof of who leaked content. | **NOT PREVENTABLE** | **NOT PREVENTABLE** | **NOT PREVENTABLE** | **NOT PREVENTABLE** |

T41 does not invalidate a valid supported digital-capture result. It prevents the project from making an absolute “cannot be captured” claim.

## Required human/device execution procedure

The following procedure is mandatory before any documentation-supported platform can be considered for `PROVEN CANDIDATE`:

1. **Freeze the subject.** Check out an exact proof commit; record its commit SHA and source-tree state. Do not use production credentials, accounts, services, customer data, or product data.
2. **Record the platform exactly.** Record manufacturer, model, architecture, OS name, edition, version, build, security-patch level, firmware, boot state, and whether the device is physical, virtual, rooted, jailbroken, managed, or otherwise modified.
3. **Record the toolchain exactly.** Record SDK, framework, compiler, IDE/build-tool, application package/bundle identity, build number, signing identity class, and hashes of the installed package and proof artifacts.
4. **Test the declared boundary, not one convenient device.** At minimum run the canonical report's proposed minimum supported OS/build and the current supported OS/build. Run every separately supported UI framework, window/surface type, display topology, and capture path listed above. A control that works on only one surface does not protect the whole client.
5. **Establish protection before payload.** Instrument the proof so the log proves capture/output protection and client admission were established before synthetic content was fetched, decrypted, decoded, or rendered. Deliberately force setup to fail and confirm that only a non-sensitive unavailable surface appears, with no protected payload, pixel, metadata, thumbnail, or stale frame.
6. **Use only synthetic media.** Exercise the 3840×2160 synthetic image and representative 4K protected stream, synthetic text/message/price, and repeated privacy-minimized watermark. Include still, moving, loading, error, dialog, background, and restored states.
7. **Run T01–T08 without omission.** Preserve the resulting synthetic capture or recording where policy permits; inspect the full-resolution image and every video frame. Hash the evidence artifact. A black live preview is not enough if the saved artifact contains protected information, and the inverse must also be checked. Any readable frame fails. Detection, warning, post-capture deletion, logging, or watermarking does not repair a failed artifact.
8. **Run T09–T20 into observable sinks.** Use a clean clipboard monitor/paste target, external share target, file/gallery/download directory, print-to-file target, drag target, and replay client. Inspect filesystem and cache state before and after each attempt. Record both UI behavior and sink contents.
9. **Integrate T21–T34.** Use an isolated synthetic authority and actual native client bindings. Exercise expiry at the boundary, revocation during an active view, wrong bindings, stale/unsupported/tampered builds, one-time replay, enumeration, trusted-device add/revoke, and all-device-loss recovery. Confirm denials contain no protected bytes and reveal no resource-existence oracle.
10. **Run T35 honestly.** Where a representative modified environment is available, rerun capture and admission tests with instrumentation/privilege. Record bypasses and false positives. Do not claim root/jailbreak detection is complete or unbypassable.
11. **Run T36–T40 with real assistive technology.** Use the native screen reader, keyboard/switch equivalent, declared maximum text size, captions/transcript, and high-contrast mode against the same protected build. No alternate unprotected page may be substituted.
12. **Run T41 and preserve the limitation.** Use a second camera only with synthetic content. Verify the watermark remains visible enough for defense-in-depth, then record `NOT PREVENTABLE`; do not convert it into a pass or failure of digital capture controls.
13. **Repeat transitions and race/failure cases.** Run before, during, and after reveal; navigation into/out of the surface; dialog open/close; image and video load/start/seek/end; cold/warm start; lock/unlock; background/foreground; task switch; orientation/window resize; process/app restart; network loss; token expiry; endpoint revocation; external-display attach/detach; recording begun before entry; and recording begun inside. No path may produce protected information in a transition frame, partial image, metadata-bearing preview, or stale cached asset.
14. **Require independent review.** A second reviewer must compare each artifact with the acceptance text in this matrix. Any missing path, ambiguous frame, unrecorded version, or failed artifact inspection remains blocked; it cannot be inferred as passing.

## Execution record schema

Create one immutable record per test case, platform build, surface variant, and capture/extraction path. Do not collapse materially different paths into one result.

```yaml
schema_version: sec-03-test-record-v1
test_id: T01
run_id: unique-pseudonymous-id
executed_at_utc: 2026-08-15T00:00:00Z
operator_id: pseudonymous-reviewer-id
independent_reviewer_id: pseudonymous-reviewer-id
proof_commit_sha: full-git-sha
working_tree_clean: true
platform:
  family: Android
  os_version: exact-version
  os_build: exact-build
  security_patch: exact-patch-or-not-applicable
  edition: exact-edition-or-not-applicable
device:
  manufacturer: exact-manufacturer
  model: exact-model
  architecture: exact-architecture
  firmware: exact-firmware
  physical_or_virtual: physical
  managed_state: unmanaged
  modification_state: stock-unmodified
toolchain:
  sdk: exact-sdk
  framework: exact-framework
  compiler: exact-compiler
  build_tool: exact-build-tool
client:
  package_id: synthetic-proof-package-id
  version: exact-version
  build: exact-build
  signing_class: development-proof
  installed_artifact_sha256: hex-digest
  support_registry_state: SUPPORTED
  endpoint_trust_state: TRUSTED
  integrity_signal_and_freshness: exact-signal-record
surface:
  technology: exact-view-or-window-type
  window_id: pseudonymous-window-id
  content_fixture: synthetic-fixture-id
  protection_established_before_payload: true
display_topology: exact-topology
assistive_settings: exact-settings
test_path:
  mechanism: exact-os-control-api-or-target
  application_and_version: exact-capture-or-sink-version
  preconditions: exact-preconditions
expected_result: exact-matrix-acceptance
actual_result: factual-observation-only
result: PASS_OR_FAIL_OR_BLOCKED_OR_NOT_PREVENTABLE
artifacts:
  - relative_path: synthetic-evidence-path
    sha256: hex-digest
logs:
  - relative_path: proof-log-path
    sha256: hex-digest
protected_bytes_returned: false
protected_information_present_in_artifact: false
readable_protected_frame_count: 0
cache_or_sink_artifact_found: false
limitations:
  - factual-limit
deviations:
  - none
retest_required: false
reviewed_against_matrix_version: "1.0"
```

`PASS` is allowed in an execution record only when the recorded artifact establishes the exact row acceptance for the exact declared boundary. `BLOCKED` is required when the platform, device, SDK, capture path, output artifact, or inspection evidence is unavailable. Documentation, a compile-only result, or an app-side callback cannot fill an execution-evidence gap.
