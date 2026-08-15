# SEC-03A — iOS/iPadOS Protected-Rendering Investigation

**Decision:** `CONDITIONAL — APP-STORE-VIABLE TECHNIQUE REQUIRES DEVICE PROOF`
**Scope:** unmanaged iOS/iPadOS only; managed Apple devices remain a separate enterprise profile
**Governing base:** `4407e42ae778514e04e821371a4e395058dd0bed`
**Evidence date:** 2026-08-15
**Production implementation authorized:** no
**Private Wholesale release authorized:** no

## 1. Decision

SEC-03A identifies a real public Apple capture-protection primitive that the earlier broad SEC-03 conclusion did not fully develop into a whole-surface proof hypothesis:

> `AVSampleBufferDisplayLayer.preventsCapture` is a supported public contract for the image data displayed by that sample-buffer layer, and the layer accepts compressed or uncompressed frames.

That does **not** create a general UIKit/SwiftUI screenshot veto. It creates a narrower but technically plausible architecture: rasterize every sensitive visible pixel—text, stills, moving media, messages, prices, quantities, manifest content, protected captions, and protected visual control labels—into one opaque protected sample-buffer plane. Keep all ordinary native siblings nonsensitive. Supply a separate custom accessibility tree. Fail closed before the first protected frame and on any renderer/output/admission failure.

This public-API hypothesis is concrete enough to advance unmanaged iOS/iPadOS from `REJECTED FOR PROTECTED WHOLESALE` to `CONDITIONAL — APP-STORE-VIABLE TECHNIQUE REQUIRES DEVICE PROOF`. It remains far below `PROVEN CANDIDATE` because:

- no build succeeded in the current host toolchain;
- no physical iPhone/iPad execution occurred;
- no screenshot or recording artifact exists;
- Apple does not document whole-window inheritance or enumerate every capture/output path for the sample-buffer property;
- accessibility, overlay containment, first-frame behavior, lifecycle failure, external output, performance, and operational maintainability remain unproved; and
- Blowin' Smoke's tobacco/vape commerce faces a separate App Store policy constraint under current Guideline 1.4.3.

“App-Store-viable” in this status describes the public-API technique only. It is not a prediction that Apple will approve the Blowin' Smoke business application.

## 2. Evidence vocabulary

| Classification | Meaning in SEC-03A |
|---|---|
| `OBSERVED` | A described behavior was directly observed by the owner or reported in a first-party product tracker; mechanism remains unproven unless separately established. |
| `TECHNICALLY CONFIRMED` | A current authoritative public contract or exact local public SDK declaration was inspected. It does not imply device execution. |
| `INFERRED` | A conclusion follows from multiple established facts but is not itself promised by the platform. |
| `NOT DETERMINABLE` | Available evidence cannot establish the property; record as `BLOCKED — EVIDENCE NOT ESTABLISHED` where the property is required. |

## 3. Owner reference and Telegram discrepancy

### 3.1 Owner observation

**OBSERVED:** on an unmanaged iPhone 15 Pro, protected Telegram content remained visible on the phone, while the resulting saved iOS screenshot showed the protected content black.

This is technically plausible because Apple has public protected-media/image-plane behavior capable of omitting protected pixels from capture, and unsupported secure-rendering side effects also exist in shipping applications. The observation proves neither path, and SEC-03A does not attribute either one to Telegram.

### 3.2 Telegram's first-party record is nonuniform

Telegram's current API and product material requires or promises screenshot, copy, forwarding, download, and media-saving restrictions for several protected-content modes. Telegram's official iOS issue tracker simultaneously contains:

- a current report that bot `protect_content` text remained fully readable in Telegram 12.5.2 on iOS 26.3; and
- an older protected-photo issue whose reporter said recording was blocked, while a Save path escaped until the issue was marked fixed.

**INFERRED:** the owner's result can be genuine for a particular protection mode, content class, application version, and iOS build while another Telegram protected surface remains readable. “Telegram protected content” is not one uniform capture property.

**NOT DETERMINABLE:** Telegram's actual iOS rendering mechanism, screenshot output rules by content class, screen-recording first-frame behavior, and version-stable coverage.

The R01–R16 checklist in the [SEC-03A test matrix](sec-03a-ios-test-matrix.md) is therefore required to turn the owner reference into reproducible, artifact-backed product evidence. It still will not reveal the mechanism.

## 4. Apple mechanism findings

### 4.1 General arbitrary UI

**TECHNICALLY CONFIRMED:** Apple DTS states that iOS has no public general screenshot-prevention API for arbitrary application UI. `UIApplication.userDidTakeScreenshotNotification` runs after the screenshot is saved. Scene/screen capture-state handling is a reactive recording/mirroring signal with a first-frame race.

Consequences:

- post-screenshot overlay or audit: `FAIL` as prevention;
- recording-state redaction while readable content is already on screen: `FAIL` as the sole control;
- app-switcher cover: required defense in depth for that snapshot, but not foreground screenshot protection;
- `.privacySensitive`, blur, watermark, and warning: not capture exclusion.

### 4.2 Protected sample-buffer image plane

**TECHNICALLY CONFIRMED:** Apple documents `AVSampleBufferDisplayLayer` as displaying compressed or uncompressed video frames and exposes the public `preventsCapture` property. The installed public SDK header states that the layer's image data should be protected from capture and declares the property available from iOS 13.0.

Exact supported claim:

> The image data displayed by that layer has a public capture-protection contract.

Unsupported extensions of that claim:

- the enclosing window is protected;
- children or sibling UIKit/SwiftUI/Core Animation views inherit protection;
- native modal, focus, keyboard, caption, accessibility, share, print, or system overlays inherit protection;
- every supported screenshot, recording, mirroring, QuickTime, ReplayKit, ScreenCaptureKit, and external-output path has already passed;
- the app can positively attest that the OS compositor established the property; or
- source code or a successful build proves capture output.

### 4.3 ClearKey and FairPlay

**TECHNICALLY CONFIRMED:** current Apple documentation for `AVPlayer.allowsCaptureOfClearKeyVideo` says the default `false` excludes ClearKey-encrypted video from screenshots, screen recordings, `AVPlayerItemVideoOutput`, and ScreenCaptureKit. Apple's official documentation metadata introduces it on iOS/iPadOS 26.4. The installed local SDK predates the declaration, so it is not included in the proof harness.

This is stronger, explicit video-only evidence. It does not protect ordinary text, stills, messages, manifests, UI overlays, or earlier systems.

**TECHNICALLY CONFIRMED:** FairPlay Streaming is a supported protected audiovisual delivery/playback path. Apple documents that FairPlay video is omitted/blacked out in recording, mirroring, and AirPlay screen streams; protected audio can remain included. FairPlay credentials require Apple approval and the program is framed for eligible content owners/licensees.

Neither ClearKey nor FairPlay solves the complete wholesale surface. They can become media controls inside a future proof, never substitutes for whole-surface protection.

### 4.4 Metal, Core Animation, and IOSurface

Public Metal storage modes describe CPU/GPU location and visibility, not screenshot security. Public `CAMetalLayer`, `CALayer`, and IOSurface APIs reviewed expose no generic target-controlled arbitrary-UI capture-exclusion contract for an ordinary iOS App Store app.

**NOT DETERMINABLE / BLOCKED — EVIDENCE NOT ESTABLISHED:** a qualifying generic protected Metal/Core Animation/IOSurface UI plane.

Metal may generate frames supplied to the AVFoundation protected sample-buffer layer. In that case the capture property comes from AVFoundation's public contract, not from Metal `private` storage or IOSurface.

### 4.5 visionOS and managed Apple contrast

Apple exposes explicit app-protected content replacement on visionOS with a platform entitlement. Apple also exposes screenshot/recording restrictions to enrolled managed devices. These facts show that Apple can provide whole-surface policy where it chooses.

Neither is an unmanaged iOS/iPadOS application mechanism. They must not be conflated with the consumer candidate.

## 5. Technique classification

| Technique | Classification | Decision |
|---|---|---|
| `AVSampleBufferDisplayLayer.preventsCapture` for its displayed image plane | `SUPPORTED PUBLIC CONTRACT` | Advance to physical proof |
| Public `CVImageBuffer`/`CMSampleBuffer` creation and sample-buffer presentation | `SUPPORTED PUBLIC CONTRACT` | Legitimate input path for synthetic composited frames |
| Full opaque wholesale visual surface rasterized into protected frames | Public APIs composed into an implementation-sensitive architecture; whole result `UNKNOWN` | Conditional only; device, accessibility, failure, and App Review proof required |
| `AVPlayer.allowsCaptureOfClearKeyVideo = false` | `SUPPORTED PUBLIC CONTRACT`, ClearKey-encrypted video only | Optional narrow 26.4+ video control |
| FairPlay Streaming | `SUPPORTED PUBLIC CONTRACT`, eligible protected audiovisual media only | Optional narrow media control; audio and eligibility limits remain |
| Screenshot notification | `SUPPORTED PUBLIC CONTRACT`, post-capture | Reject as prevention |
| Scene/screen capture-state redaction | `SUPPORTED PUBLIC CONTRACT`, reactive | Reject as sole control due first-frame race |
| App-switcher cover | `SUPPORTED PUBLIC CONTRACT`, background snapshot only | Required defense in depth |
| Direct `isSecureTextEntry` on the actual text object | `SUPPORTED PUBLIC CONTRACT`, narrow and qualified | May secure a password field; not a whole-surface control |
| Arbitrary view wrapped/reparented through secure text behavior | `PUBLIC API USED OUTSIDE DOCUMENTED SECURITY CONTRACT` + `OBSERVED IMPLEMENTATION SIDE EFFECT` | Reject as release-gate dependency |
| UIKit internal class-name lookup, private secure canvas/layer access, private flags/selectors | `PRIVATE / UNDOCUMENTED` | Reject; excluded from proof |
| Generic Metal/Core Animation/IOSurface “secure surface” | `UNKNOWN` | Blocked; no public qualifying contract established |

## 6. Candidate whole-surface architecture

The architecture to prove is deliberately unlike an ordinary UIKit/SwiftUI screen:

1. Keep a local neutral, zero-information security placeholder visible.
2. Verify signed build, current supported version, trusted endpoint, fresh account/room/resource authorization, current integrity signal, revocation state, and declared tested platform boundary.
3. Create one opaque `AVSampleBufferDisplayLayer` covering the complete protected visual region.
4. Set `preventsCapture = true` before any protected frame enters the layer.
5. Rasterize all sensitive visual state into uncompressed protected frames: text, prices, quantities, stills, moving media, messages, captions/transcripts when shown, manifests, selection state, protected navigation titles, modals, toasts, and protected visual control labels.
6. Keep every visible native sibling nonsensitive. Native hit regions may be transparent/nonsensitive; they must not repeat protected values.
7. Provide custom accessibility elements/actions mapped to the same authorized state. Do not render a second ordinary sensitive label to make VoiceOver work.
8. Remove ordinary copy, share, save, download, print, drag, export, Open Original, transferable, and durable-resource paths.
9. Keep task-switcher/lifecycle snapshots neutral and deny reveal after background/restart until authorization and renderer state are revalidated.
10. On renderer error, resize/reallocation uncertainty, output uncertainty, stale authorization, capture-property configuration failure, or unsupported build: discard the protected frame and return to the placeholder.

### 6.1 What this can plausibly cover

| Content class | Candidate handling | Current evidence state |
|---|---|---|
| Text, prices, quantities | Rasterized glyphs inside protected frame | Public input path exists; physical black-capture result unproved |
| Still images | Uncompressed image pixels inside protected frame | Public input path exists; physical result unproved |
| Moving video | Composite moving frames in protected layer; optionally ClearKey/FairPlay for eligible media | Layer result unproved; narrower protected-video contracts exist |
| Messages | Rasterized message list/detail, metadata, reply state, reactions | Physical result and interaction performance unproved |
| Manifest | Rasterized canonical view; custom accessible semantics | Physical result and accessible order verification unproved |
| Controls/navigation | Protected visual labels inside frame; nonsensitive native hit targets/actions | Overlay containment, focus, keyboard, Switch Control unproved |
| Captions/transcripts | Burn into protected frame plus least-privilege accessible semantics | VoiceOver/capture interaction unproved |

### 6.2 What cannot be assumed

A black protected media rectangle surrounded by a readable native price, message, caption, modal, or title is `FAIL`. A visible control is not safe merely because it sits above a protected layer. A custom accessibility tree is necessary but may expose plaintext to legitimate assistive technology and privileged automation. That is a precise authorized-access boundary, not “noncopyability.”

## 7. Race and first-frame analysis

Reactive scene-capture handling cannot satisfy the gate because Apple DTS identifies a timing window in which already-visible normal UI can enter the first recording frame.

The sample-buffer hypothesis is different: the documented property is set on the render layer before the first protected frame, so its intended security property is not based on a callback after capture starts. That eliminates the *architectural dependence* on a reactive race.

**NOT DETERMINABLE:** whether every required physical capture path honors the layer from the first presented protected frame, including when capture is active before app launch or room entry. That is why I07–I12 and I27 require frame-by-frame artifact review.

There may be no fallback to ordinary sensitive views while the buffer layer is loading, resizing, rotating, flushing, recovering from decoder failure, backgrounding, or reentering foreground. The placeholder remains until the protected renderer is ready.

## 8. App Store and maintainability assessment

The proof harness uses public APIs for their documented roles: constructing/displaying sample-buffer image frames and applying the layer's capture-protection property. That is materially different from secure-text view wrapping or private UIKit class manipulation.

The complete rasterized-UI architecture still has unresolved review and engineering risk:

- Apple documents the layer as a video-frame presentation object, not a commerce UI framework;
- App Review never preapproves an architecture;
- rasterized text/layout/localization may be expensive and fragile;
- continuous full-surface frames may have battery, thermal, memory, and latency costs;
- state synchronization between visual pixels, hit targets, and accessibility semantics is complex;
- platform updates may change capture behavior even while the public property remains; and
- current App Review Guideline 1.4.3 separately restricts tobacco/vape promotion and tobacco sales facilitation.

The security technique is therefore reasonably App-Store-viable for proof because it uses public contracts, but the Blowin' Smoke application remains a separate policy/legal/distribution decision.

## 9. Accessibility boundary

Apple supports `UIAccessibilityElement` for custom/non-view content. A rasterized protected surface can therefore expose semantic labels, values, traits, grouping, focus regions, and actions without placing visible sensitive UIKit labels above the layer.

Required unresolved tests:

- complete VoiceOver reading order and actionable control use;
- whether VoiceOver focus visuals reveal protected labels/pixels in screenshots or recordings;
- whether VoiceOver speech is included in recording and whether that is an unacceptable protected-content output;
- Switch Control, external keyboard, and equivalent navigation;
- Dynamic Type rerendering through maximum supported size;
- high contrast, color-independent state, and Reduce Motion;
- accessible protected captions/transcripts and manifest verification; and
- lifecycle/rotation synchronization between visual and semantic trees.

Accessibility metadata necessarily contains plaintext for authorized assistive use. Apple does not document it as a nonextractable security container. Removing that metadata to manufacture an extraction claim would fail the accessibility gate. Privileged automation or a compromised device remains a residual bypass, while ordinary client commands must still be minimized.

## 10. Extraction controls

Black capture feasibility is only one release condition. A future iOS client must separately demonstrate:

- no selectable protected text and no protected copy/cut representation;
- no forward action;
- no activity/share item containing protected content or identifier;
- no Save to Photos/Files and no download/original route;
- no print formatter, print preview, PDF, or AirPrint payload;
- no drag/drop, transferable, Open In, document-picker export, or durable deep link;
- no public/predictable object identifier or reusable protected URL;
- no unprotected thumbnail, Quick Look item, notification, crash report, log, backup, or private offline cache; and
- server-side expiry/revocation on future access without claiming recall of already rendered human-visible content.

These are primarily signed-client and server controls. They are not inherited from `preventsCapture`.

## 11. Client trust and device limits

The candidate rendering path is compatible in principle with App Store-signed code, build allowlists, App Attest, device-bound endpoint keys, Keychain/Secure Enclave operations, trusted-device enrollment/revocation, short-lived resource grants, and later E2EE endpoint state.

App Attest can help a server assess that a request comes from a legitimate app instance and bind assertions to a server challenge. Apple expressly says it cannot definitively identify a compromised operating system. Therefore:

- missing, unsupported, stale, failed, revoked, or mismatched mandatory signals deny the protected payload;
- user-agent strings and `approved=true` client claims never create admission;
- jailbreak/root/privileged instrumentation can bypass app logic, inspect generated frames, or alter compositor behavior and is not claimed perfectly detectable;
- a renderer can protect output pixels without turning app-created pixel buffers into DRM or E2EE; and
- a second external camera remains `NOT PREVENTABLE`.

## 12. Residual bypasses and unknowns

| Residual | Status |
|---|---|
| External second camera/manual transcription | `NOT PREVENTABLE` |
| Jailbreak, privileged debugger/instrumentation, modified client/OS | Outside supported guarantee; imperfectly detectable |
| In-process access to app-generated pixel buffers | Not prevented by display-layer capture exclusion |
| Accessibility/UI automation extraction | Legitimate semantics required; privileged misuse remains residual |
| VoiceOver audio in recordings | `BLOCKED — EVIDENCE NOT ESTABLISHED` |
| Screenshot path output for sample-buffer layer | `BLOCKED — EXECUTION PROOF NOT PERFORMED` |
| Native recording first frame | `BLOCKED — EXECUTION PROOF NOT PERFORMED` |
| AirPlay/mirroring/QuickTime/external display | `BLOCKED — EXECUTION PROOF NOT PERFORMED` |
| ReplayKit/ScreenCaptureKit output | `BLOCKED — EXECUTION PROOF NOT PERFORMED` |
| Task switcher, rotation, low-memory, renderer recovery | `BLOCKED — EXECUTION PROOF NOT PERFORMED` |
| App Review acceptance of rasterized protected UI | `UNKNOWN`; no preapproval |
| App Store eligibility for Blowin' Smoke catalog | Material independent policy/legal blocker |

## 13. Explicit answers to required questions

1. **Is the owner-observed Telegram black-screenshot behavior technically plausible on unmanaged iOS?**
   **Yes — `OBSERVED / MECHANISM UNKNOWN`.** Apple exposes narrow protected image/video planes and unsupported side effects also exist; neither is attributed to Telegram.

2. **Does current Apple documentation expose a supported general mechanism for arbitrary UIKit/SwiftUI UI?**
   **No.** Apple DTS confirms no public general screenshot-prevention API.

3. **Is a narrower protected-rendering mechanism available?**
   **Yes — `TECHNICALLY CONFIRMED`.** `AVSampleBufferDisplayLayer.preventsCapture` protects that layer's image data; ClearKey 26.4+ and FairPlay provide narrower protected-video paths.

4. **Can the narrower mechanism protect the whole wholesale surface?**
   **Plausible but unproved.** A complete opaque rasterized protected plane is a legitimate public-API hypothesis. Whole-client behavior is `NOT DETERMINABLE` without artifacts.

5. **Are secure-text-view approaches documented security contracts or side effects?**
   Direct secure entry is a narrow text-object contract. Arbitrary child-view wrapping/reparenting is an unintended implementation side effect outside the documented contract.

6. **Are secure-text arbitrary-view techniques App-Store-viable?**
   They cannot qualify for this gate. Apple requires intended API use and DTS calls the behavior unintended/unstable. Internal-class variants are private/undocumented and rejected.

7. **Could secure-text arbitrary-view techniques survive iOS updates reliably enough for a release gate?**
   **No supported guarantee.** Apple states the side effect can change without notice.

8. **Can screenshots become black?**
   Apple documents black/omitted output for certain protected video and a capture-protected sample-buffer layer; the owner observed black Telegram output. The SEC-03A sample-buffer screenshot result remains `BLOCKED — EXECUTION PROOF NOT PERFORMED`.

9. **Can screen recordings remain black/redacted from the first protected frame?**
   Narrow protected-video contracts support omission. The whole sample-buffer candidate is unproved; reactive capture-state redaction alone fails due race.

10. **Can recording started before protected-room entry still be protected?**
    The preconfigured sample-buffer architecture is designed to do so, but I07 physical/frame proof is mandatory. Current answer: `NOT DETERMINABLE`.

11. **Can text, stills, video, messages, prices, manifests, and UI all satisfy the same rule?**
    They can be composited into one protected image plane through public APIs. Whether every resulting pixel is excluded on every required path is unproved. Any sensitive sibling overlay fails.

12. **Can VoiceOver/accessibility continue to work?**
    Feasible in principle using a custom accessibility tree; not executed. VoiceOver focus/speech capture remains a material test requirement.

13. **What exact residual bypasses remain?**
    External camera, transcription, jailbreak/privileged compromise, modified clients, in-process frame extraction, legitimate accessibility plaintext, and every untested capture/output/lifecycle path.

14. **Does unmanaged iOS remain rejected?**
    **No. It advances only to `CONDITIONAL — APP-STORE-VIABLE TECHNIQUE REQUIRES DEVICE PROOF`.** It is not proven, approved, or released.

15. **What physical test is next?**
    First run the public-API-only C0/C1/C2 pixel-plane harness on the owner's iPhone 15 Pro and record the exact iOS/build and proof commit. C0 and C1 must be readable; C2 must contain zero readable protected information in both a screenshot and frame-stepped recordings begun before and after C2 reveal. This minimal harness cannot close the platform gate. Expand the isolated proof states and execute every applicable I01–I30 row with original artifact hashes before a platform conclusion. Run R01–R16 separately to characterize the owner-observed Telegram mode.

## 14. SEC-03 impact

SEC-03's unmanaged iOS verdict is narrowly superseded by SEC-03A:

```text
SEC-03:
REJECTED FOR PROTECTED WHOLESALE

SEC-03A:
CONDITIONAL — APP-STORE-VIABLE TECHNIQUE REQUIRES DEVICE PROOF
```

Nothing else advances. There is no approved client, no production stack selection, no E2EE protocol selection, no Private Wholesale launch approval, and no authority to alter the closed retail/static prototype. If C2 fails any mandatory physical path, inaccessible behavior cannot be corrected, ordinary sensitive overlays cannot be eliminated, or the architecture cannot remain fail-closed, unmanaged iOS returns to `REJECTED FOR PROTECTED WHOLESALE`.

## 15. Exact next physical proof

1. Repair/use a current Xcode toolchain and build the isolated source at `proofs/sec-03a/ios/` without adding private APIs.
2. On the owner's iPhone 15 Pro, record exact hardware identifier, iOS version/build, Xcode/SDK, signing type, proof commit, time, and tester.
3. Capture C0 ordinary UIKit, C1 identical sample-buffer with protection off, and C2 identical sample-buffer with protection on before enqueue.
4. Preserve and hash the original screenshots and recordings.
5. Begin one recording before app launch/room entry and another while C2 is visible; frame-step every transition.
6. Treat the current minimal source as the initial C0/C1/C2 pixel-plane test only. Before any platform conclusion, extend the isolated proof with the controlled states required by every applicable I01–I30 row, then exercise navigation, modal, media change, rotation, app switcher, background/foreground, lock/unlock, AirPlay/mirroring, QuickTime/wired capture, external display, ReplayKit/current public capture, extraction, renderer/admission failure, VoiceOver, Dynamic Type, Switch Control, keyboard, captions/transcript, and high contrast.
7. Add one deliberately sensitive ordinary sibling overlay in a negative-boundary run; it should remain readable and prove that all real sensitive pixels must stay inside C2.
8. Record results in the [SEC-03A test matrix](sec-03a-ios-test-matrix.md). Do not advance to `PROVEN CANDIDATE` until every applicable mandatory row has a physical artifact and no readable protected frame.
