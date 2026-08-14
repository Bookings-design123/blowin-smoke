# Capture Resistance and Leakage Attribution

**Document role:** Platform-specific assurance boundary for screenshots, recording, copying, export, watermarking, and incident response
**Controlling conclusion:** Protected wholesale is released only to an approved client that passes supported-path capture and extraction tests; watermarking remains secondary and external-camera prevention remains impossible

## 1. Platform capability matrix

| Client class | Screenshot | Screen recording/mirroring | Copy/download/print | Second camera | Protected wholesale status |
|---|---|---|---|---|---|
| Ordinary desktop browser | Target veto `NOT ENFORCEABLE` | Target veto `NOT ENFORCEABLE` | UI restrictions are `BEST-EFFORT`; authorized user controls client/devtools | `NOT POSSIBLE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Ordinary mobile browser | `NOT ENFORCEABLE` | `NOT ENFORCEABLE` | `BEST-EFFORT` only | `NOT POSSIBLE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Installed PWA | `NOT ENFORCEABLE` | `NOT ENFORCEABLE` | `BEST-EFFORT`; persistent caches can add risk | `NOT POSSIBLE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Android native, provisionally Android 12+ | `OS-ENFORCED / NOT YET VERIFIED` with secure window on supported paths | Protected pixels excluded from supported non-secure virtual-display paths: `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED` | Signed-app paths `APPLICATION-ENFORCED / NOT YET VERIFIED` | `NOT POSSIBLE` | `CONDITIONAL CANDIDATE` |
| iOS/iPadOS native | Notification is after capture: prevention `NOT ENFORCEABLE` | Active capture detection/redaction `BEST-EFFORT`; protected video is narrower | Signed-app paths `APPLICATION-ENFORCED / NOT YET VERIFIED` | `NOT POSSIBLE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Windows native, provisionally Windows 10 2004+ | Supported public capture-path exclusion is `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED` | Same declared scope | Signed-app paths `APPLICATION-ENFORCED / NOT YET VERIFIED` | `NOT POSSIBLE` | `CONDITIONAL CANDIDATE` |
| macOS native | No verified current target-app veto: `NOT ENFORCEABLE` | No verified current target-app veto: `NOT ENFORCEABLE` | Signed-app paths `APPLICATION-ENFORCED / NOT YET VERIFIED` | `NOT POSSIBLE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Managed Android device | Device/profile-owner policy can disable capture: `OS-ENFORCED / NOT YET VERIFIED` in exact boundary | Policy/output scope: `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED` | App + management policy `NOT YET VERIFIED` | `NOT POSSIBLE` | `CONDITIONAL CANDIDATE` — enterprise only |
| Managed Apple device | Enrolled restrictions payload can disable screenshot/recording on listed supported platforms: `OS-ENFORCED / NOT YET VERIFIED` | Same exact enrolled payload scope | App + management policy `NOT YET VERIFIED` | `NOT POSSIBLE` | `CONDITIONAL CANDIDATE` — enterprise only |
| Managed Windows device | Experience CSP screen-capture controls: `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED` in exact edition/version scope | Recorder policy is narrower by OS version and tool: `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED` | App + management policy `NOT YET VERIFIED` | `NOT POSSIBLE` | `CONDITIONAL CANDIDATE` — enterprise only |

No row earns an unqualified universal `GUARANTEED` label, and no row is an approved Blowin' Smoke client today. Genuine OS enforcement remains enforcement inside its exact supported/tested boundary; the lack of universal protection does not reduce it to watermarking or deterrence.

## 2. Evidence and exact limits

### Browser and PWA

The [W3C Screen Capture API](https://www.w3.org/TR/screen-capture/) controls a web page's request to capture a display surface. The [`display-capture` Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/display-capture) controls whether the document may invoke `getDisplayMedia()`. Neither gives a target page authority to veto OS, browser, extension, accessibility, remote-desktop, or user capture.

PWA installability does not grant a native secure-window flag. A proposed Web App Manifest capture-prevention feature remains a [closed issue, not a standard capability](https://github.com/w3c/manifest/issues/1154). A service worker can make persistence worse if sensitive responses enter Cache Storage.

Disabling context menus, text selection, keyboard shortcuts, print CSS, drag, “save image,” or download controls raises casual effort only. The endpoint can inspect requests, DOM, canvas, memory, media segments, or pixels. The [OWASP AJAX guidance](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html) states the governing principle: client-side security controls cannot be trusted as the enforcement boundary.

### Android native

Android's [`FLAG_SECURE` guidance](https://developer.android.com/security/fraud-prevention/activities) supports blocking common screenshots and display on non-secure outputs. Android itself documents limitations, including incomplete reliability on older versions and gaps against overlay/other paths. [Android 14 screenshot detection](https://developer.android.com/about/versions/14/features/screenshot-detection) covers specific user screenshot actions and excludes ADB/instrumentation. Android 15 recording callbacks can report recording visibility; detection is not prevention.

Therefore supported Android secure-window behavior is `OS-ENFORCED` for the documented path, while the Blowin' Smoke client remains a `CONDITIONAL CANDIDATE / NOT YET VERIFIED`. Android 11 and lower are rejected because Google documents only about 70% reliability there. Android 12+ is a provisional floor, not proof of perfect coverage. Rooted devices, instrumentation, modified OS images, cameras, and previously rendered content remain outside assurance and require integrity gating, negative tests, and fail-closed handling.

### iOS and iPadOS native

Apple's [`userDidTakeScreenshotNotification`](https://developer.apple.com/documentation/uikit/uiapplication/userdidtakescreenshotnotification) arrives after a screenshot. It cannot undo capture. Apple provides [capture-state handling/redaction](https://developer.apple.com/documentation/swiftui/protecting-sensitive-content-when-screen-sharing) for active recording, mirroring, or remote control. FairPlay-protected video can receive narrower output protection, but that does not cover ordinary UI, still images, prices, text, or cameras.

Unsupported secure-text-field/window-layer tricks must not be represented as a supported security control.

### Windows and macOS native

Windows [`SetWindowDisplayAffinity`](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity) can OS-enforce exclusion of a top-level window from a specified set of supported public capture paths. Microsoft explicitly says it is not DRM or a strict guarantee and calls out photographing the screen. Native Windows is therefore a conditional candidate only after exact framework/window/OS/tool testing; the control is real within its stated path but cannot support a broader claim.

Current Apple documentation labels `NSWindow.SharingType.none` [a legacy constant macOS no longer uses](https://developer.apple.com/documentation/appkit/nswindow/sharingtype-swift.enum). ScreenCaptureKit exclusions are selected by the capturing application for its own stream, not a target-application veto. No current public macOS target-controlled prevention mechanism was verified; any future claim remains `BLOCKED` until official supported evidence exists and fails as a present guarantee.

### Managed devices

Android device/profile-owner policy can [disable screen capture](https://developer.android.com/reference/android/app/admin/DevicePolicyManager#setScreenCaptureDisabled(android.content.ComponentName,boolean)); Apple management restrictions can disable [screenshots and screen recording](https://support.apple.com/guide/deployment/review-device-management-restrictions-dep739685973/web); and Windows [Experience Policy CSP](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-experience) documents a device-scoped screen-capture policy plus a narrower version/tool-scoped screen-recorder policy. These are distinct platform controls, not one uniform managed-client guarantee. They require enrollment/administrative authority, exact platform/edition/version/tool proof, and still cannot stop an external camera. They are appropriate for managed staff endpoints or a separately contracted enterprise deployment—not a normal wholesale-customer browser requirement.

## 3. The second-camera boundary

**Status:** `FAIL / NOT POSSIBLE` across every client class.

Once an authorized endpoint converts data into human-visible pixels or audible media, an independently controlled camera/recorder can capture it. Reducing resolution, flickering overlays, hostile motion, or obstructing content can damage accessibility/product inspection without solving this fact.

The product requirement must be expressed as:

> Blowin' Smoke limits who can access private wholesale material, reduces how long it remains accessible, marks authorized views, investigates credible leaks, and can revoke future access. It does not claim to control every copy after material is displayed.

## 4. Layered anti-leak model

### Release gate — Enforce capture and ordinary extraction controls

- expose protected content only in a signed approved client with a current supported platform/control state;
- block or exclude protected pixels from supported screenshots, recordings, mirroring, and non-secure display paths;
- omit and deny copy, cut, forward/share, save, download, open-original, print, drag, and export actions;
- fail closed before any wholesale menu, prices, inventory, media, messages, negotiation history, or manifest is returned when client capability is absent, stale, unknown, or revoked; and
- keep the complete control and client matrix in [private-wholesale-protected-content-assurance.md](private-wholesale-protected-content-assurance.md).

### Layer 1 — Prevent unauthorized disclosure (`GUARANTEED` only within tested server scope)

- object-level authorization on every menu, profile, price, count, image rendition, playlist, media segment/key, message envelope, and manifest request;
- deny-by-default current room grant, endpoint/session, resource, action, and version;
- no public predictable IDs or bulk catalog payload followed by client filtering;
- no bearer secret in page URLs;
- short resource/session authorization; revoke on risk/account/device change;
- rate/scraping controls that preserve `UNKNOWN` and avoid automatic guilt;
- protected canonical origin/media pipeline and provider contract.

### Layer 2 — Reduce exposure (`BEST-EFFORT`)

- only the minimum current data needed for the customer's decision;
- thumbnails/lower renditions first and explicit high-resolution/4K reveal;
- no autoplay; no original master by default;
- no private manifest/media in service-worker/offline cache;
- no plaintext notifications or previews;
- five-minute manifest server access lease as separately defined;
- conversation/ciphertext lifecycle tied to authoritative order/fulfillment state.

### Layer 3 — Deter casual copying (`DETERRENCE`)

- concise handling notice;
- repeated individualized visible watermark;
- static-per-render or static-per-session placement variation that does not animate, flash, or impair inspection.

App-owned copy/download/export/print denial and OS secure-display controls remain release-gate enforcement in Layer 0, not deterrence. Text selection and accessibility semantics remain available to the least privilege necessary for legitimate use; hostile anti-copy gestures are prohibited.

### Layer 4 — Attribute credible leakage (`ATTRIBUTION`)

- pseudonymous trace/account/session marker mapped through restricted evidence;
- server/edge-burned pixel watermark rather than a removable DOM-only overlay;
- optional independently validated forensic mark;
- event/derivative ID, authorization time, media version, and delivery receipt;
- chain of evidence, human review, appeal, false-positive analysis, and no automatic punishment.

### Layer 5 — Respond (`BEST-EFFORT`)

- revoke sessions/endpoints/media leases and suspend room grant under governed authority;
- preserve minimum incident evidence with hold/review/expiry;
- rotate exposed proprietary data where meaningful;
- correct false attribution and restore access through a documented appeal;
- never alter canonical order/payment/fulfillment truth merely because a leak is suspected.

## 5. Visible and session watermark requirements

**Feasibility:** `PASS` as deterrence/limited attribution; never prevention.

Required characteristics:

- a pseudonymous trace/session ID, not a full phone number, legal name, address, or order number;
- repeated placement so one crop is less likely to remove all marks;
- server/edge-burned derivative for valuable still/video where feasible;
- sufficient contrast to remain identifiable without obscuring color, texture, proof text, captions, or controls;
- alternative accessible description available without revealing additional private data;
- placement may vary only when producing a new static render/session derivative; it does not move or animate during viewing and must not flash, flicker, or impair concentration;
- exact mapping retained only for the investigation purpose and approved schedule;
- disclosure that marked views are used for leakage deterrence/investigation.

A DOM-only overlay can be removed. A full identity watermark creates additional privacy and harassment risk. A watermark match alone does not prove which human leaked the material because credentials/devices can be shared or compromised.

## 6. Forensic watermark feasibility

**Status:** `BLOCKED` pending candidate and independent evidence.

The [DASH-IF/ETSI session-oriented forensic watermarking specification](https://dashif.org/guidelines/specifications/) demonstrates a standardized A/B segment approach intended to trace session-origin leakage. It is not a prevention mechanism and does not establish effectiveness for Blowin' Smoke's media, browser, Onion, or external-camera paths.

Before use, a candidate must pass independent tests for:

- direct segment extraction and reassembly;
- screenshot and screen recording;
- external-camera recapture at varied angle/lighting;
- cropping, scaling, rotation, partial capture, color/contrast changes;
- recompression/transcoding/frame-rate changes;
- multiple-account collusion;
- false positive/negative rate and confidence threshold;
- perceptual impact on product inspection and accessibility;
- evidence custody and reproducible detector results;
- vendor access, retention, breach, exit, and deletion.

No adverse account action may be automated solely from a detector result.

## 7. What not to do

- Do not make universal “screenshots blocked” or “screen recording impossible” claims. A supported-client statement remains prohibited until the exact build/platform/surface passes the gate and states its boundary.
- Do not call a missing download button “non-downloadable.”
- Do not draw sensitive content to canvas and claim protection.
- Do not degrade, flash, or constantly move content to frustrate cameras.
- Do not rely on undocumented iOS/macOS hacks.
- Do not require device management for ordinary customers without a separately approved enterprise context.
- Do not store full identity in watermarks or expose it to another viewer.
- Do not equate watermark detection with proof of intentional disclosure.
- Do not retain detailed browsing/capture telemetry indefinitely or repurpose it for marketing.

## 8. Final capture classifications

| Desired property | Status | Assurance label |
|---|---|---|
| Browser/PWA screenshot or recording target veto | `FAIL` | `NOT ENFORCEABLE`; client rejected |
| Android supported-path secure display | `CONDITIONAL CANDIDATE` | Screenshot/non-secure display `OS-ENFORCED / NOT YET VERIFIED`; recording-path exclusion `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED`; provisional Android 12+ boundary |
| iOS screenshot prevention | `FAIL` | `NOT POSSIBLE` |
| iOS active-recording redaction | `CONDITIONAL` | `BEST-EFFORT` |
| Windows supported-path exclusion | `CONDITIONAL CANDIDATE` | `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED` within documented public capture paths |
| macOS current public target-app capture veto | `FAIL` | `NOT POSSIBLE` based on verified evidence |
| Managed Android restriction | `CONDITIONAL CANDIDATE` | `OS-ENFORCED / NOT YET VERIFIED` within exact enrolled policy boundary; recording paths remain `BEST-EFFORT / NOT YET VERIFIED` |
| Managed Apple restriction | `CONDITIONAL CANDIDATE` | `OS-ENFORCED / NOT YET VERIFIED` only on exact payload-supported platforms/versions |
| Managed Windows restriction | `CONDITIONAL CANDIDATE` | `OS-ENFORCED / BEST-EFFORT / NOT YET VERIFIED` within exact edition/version/tool policy boundary |
| Second-camera prevention | `FAIL` | `NOT POSSIBLE` |
| Visible personalized watermark | `PASS` as a control | `DETERRENCE` and limited `ATTRIBUTION` |
| Forensic watermark | `BLOCKED` | Potential `ATTRIBUTION` only |
| Fail-closed unsupported client | `PASS` as an architectural requirement | `NOT YET VERIFIED` |
| Approved-client ordinary copy/forward/save/download/print/drag restrictions | `CONDITIONAL` | `APPLICATION-ENFORCED / NOT YET VERIFIED` |
| Guaranteed non-copyable wholesale material on an arbitrary or compromised endpoint | `FAIL` | `NOT POSSIBLE` |
