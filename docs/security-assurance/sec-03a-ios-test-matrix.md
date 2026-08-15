# SEC-03A — iOS/iPadOS Protected-Rendering Test Matrix

**Package:** `SEC-03A`
**Repository base:** `4407e42ae778514e04e821371a4e395058dd0bed`
**Matrix state:** defined; no owner-device or Blowin' Smoke iOS proof results are populated
**Production authority:** none

## 1. Governing acceptance rules

For screenshots and recordings, the saved artifact—not the on-device warning, callback, or tester expectation—controls the result.

`PASS` requires the complete protected surface to be one of:

- `BLACK`;
- `REDACTED` with zero protected information;
- `OMITTED`; or
- `SECURITY PLACEHOLDER` with zero protected information.

Any readable protected text, price, quantity, message, media pixel, caption, manifest fact, selection state, protected title, or readable protected frame is `FAIL`. One readable frame fails that recording path. Detection after capture, a warning, watermarking readable content, deletion after saving, or redaction after a readable first frame is `FAIL`.

Extraction tests pass only when the ordinary supported action is absent or denied and no protected representation reaches the destination. Physical second-camera capture remains `NOT PREVENTABLE`; privileged/jailbroken instrumentation remains outside the supported-client claim but must be recorded as a residual limitation.

## 2. Artifact and execution record

Every executed row must carry this metadata. Blank or missing required metadata makes the result `INADMISSIBLE — RECORD INCOMPLETE`.

| Field | Required value |
|---|---|
| Test ID | `R01`–`R16` or `I01`–`I30` |
| Device model | Exact marketing and hardware model |
| OS version/build | Exact iOS/iPadOS version and build |
| App | Telegram version/build and protection mode for R-tests; SEC-03A commit/build/signature for I-tests |
| Content type | Exact synthetic fixture and state |
| Test action | Exact capture/extraction path and start order |
| Visible device result | What remained visible on the device |
| Captured artifact result | `BLACK`, `REDACTED`, `OMITTED`, `SECURITY PLACEHOLDER`, `READABLE`, `NO ARTIFACT`, or `NOT APPLICABLE` |
| Result | `PASS`, `FAIL`, `BLOCKED`, or `NOT EXECUTED` |
| Artifact | Original filename, media type, byte count, SHA-256, capture time, and storage location |
| Tester | Name/identifier and date/time/time zone |
| Notes | Exact anomalies, first/last affected frame, overlays, warnings, or failure detail |

Never recompress, crop, annotate, or otherwise alter the original PNG/MOV used for acceptance. A derived frame-contact sheet may accompany, but never replace, the original.

## 3. Owner iPhone 15 Pro — Telegram reference checklist

### 3.1 Run header

Complete once for each distinct Telegram protection mode, then bind the header identifier to every R-row.

```text
RUN ID:
DEVICE MODEL: iPhone 15 Pro
HARDWARE IDENTIFIER:
IOS VERSION:
IOS BUILD:
TELEGRAM VERSION:
TELEGRAM BUILD:
DATE / TIME / TIME ZONE:
ACCOUNT TYPE:
PROTECTION MODE: channel/group Restrict Saving Content | private-chat Disable Sharing | bot protect_content | protected story
SOURCE CHAT/CHANNEL: privacy-safe alias only
SYNTHETIC FIXTURE IDENTIFIER:
TESTER:
```

Run the matrix first against the exact owner-observed content/protection context, then against uniquely marked synthetic text, still, and timecoded video in the same protection mode. Do not merge results between protection modes. The reference run can establish Telegram behavior only; it cannot establish Telegram's mechanism or a Blowin' Smoke client result.

### 3.2 R01–R16 procedure matrix

| ID | Content type | Exact test action | Artifact acceptance focus | Current result |
|---|---|---|---|---|
| R01 | Protected plain text | Open a unique synthetic protected text message; take the standard Side + Volume Up screenshot; inspect the saved PNG at full zoom. | Text, sender/chat identity, timestamp, previews, reactions, and adjacent protected messages contain zero readable protected information. | `NOT EXECUTED` |
| R02 | Protected still photo | Open a uniquely marked protected image full-screen; take a screenshot. | Image pixels, caption, filename/metadata, and protected chrome are black/redacted/omitted. | `NOT EXECUTED` |
| R03 | Protected paused video | Pause a timecoded protected video on a uniquely marked frame with caption and controls; take a screenshot. | Frame, caption, timecode, and any protected overlay contain zero protected information. | `NOT EXECUTED` |
| R04 | Protected playing video | Play the timecoded protected video; take a screenshot during motion. | Captured frame, caption, and overlays contain zero protected information. | `NOT EXECUTED` |
| R05 | Mixed protected content | Start native iOS recording before entering the protected Telegram surface; reveal text, photo, paused video, and playing video; stop. | Frame-step the last unprotected through first protected frame; no protected frame may be readable. | `NOT EXECUTED` |
| R06 | Protected text/media | With protected content visible, start the native recorder from Control Center; wait, navigate, stop. | Capture denied or all protected output black/redacted/omitted from the first affected frame. | `NOT EXECUTED` |
| R07 | Text/photo/video transitions | While recording, scroll among uniquely marked messages and open/close media. | Every transition and recomposition frame; one readable message/media pixel fails. | `NOT EXECUTED` |
| R08 | Protected media | While recording, move paused→playing, seek, enter/exit full-screen, and transition image→video. | Media, caption, price/message overlays, controls, and first/last frames remain protected. | `NOT EXECUTED` |
| R09 | Protected content + task switcher | Leave protected content visible; invoke app switcher; capture the task switcher through a supported digital path. | Task snapshot contains no readable protected content. A second camera may document visible state but does not count as preventable capture. | `NOT EXECUTED` |
| R10 | Protected text/caption | Long-press; attempt Select, Select All, Copy; paste into Notes. | Selection/copy absent or denied; no protected plaintext reaches clipboard/destination. | `NOT EXECUTED` |
| R11 | Protected message/media | Attempt forwarding from message and viewer paths. | No recipient/draft receives content; record exact denial. | `NOT EXECUTED` |
| R12 | Protected photo | Attempt Save/Download from long-press, viewer, Share, Files, and Photos routes. | No exported Photos/Files asset or durable original appears. | `NOT EXECUTED` |
| R13 | Protected video | Attempt Save/Download from long-press, viewer, Share, Files, and Photos routes. | No exported video/segment/original appears. | `NOT EXECUTED` |
| R14 | Mixed protected content | Attempt share sheet, drag/drop where available, Open In, copy link, edit/sticker/repost routes. | No protected bytes/text or reusable direct resource escapes. | `NOT EXECUTED` |
| R15 | Text/image/video | Record while rotating portrait↔landscape and opening/closing full-screen content. | Frame-step layout and recomposition frames; no transient protected pixel is readable. | `NOT EXECUTED` |
| R16 | Protected content | Record while backgrounding, showing app switcher, returning, and unlocking where applicable. | Background, task snapshot, re-entry, and first rendered frames contain zero readable protected information. | `NOT EXECUTED` |

### 3.3 R-result ledger template

Duplicate this block for every test and protection mode; do not replace blanks with assumptions.

```text
TEST ID:
RUN ID:
DEVICE MODEL:
IOS VERSION / BUILD:
TELEGRAM VERSION / BUILD:
PROTECTION MODE:
CONTENT TYPE:
TEST ACTION:
VISIBLE DEVICE RESULT:
CAPTURED ARTIFACT RESULT:
PASS / FAIL AGAINST BLOWIN' SMOKE STANDARD:
ORIGINAL ARTIFACT FILENAME:
MEDIA TYPE:
BYTE COUNT:
SHA-256:
CAPTURE TIME / TIME ZONE:
STORAGE LOCATION:
TESTER:
NOTES:
```

## 4. Blowin' Smoke public-API proof controls

The first physical build must use the isolated harness at `proofs/sec-03a/ios/` and the same distinctive synthetic values in three modes. C1 and C2 must use the pixel-identical composite frame; C0 is the ordinary UIKit capture-path control:

| Control | Required configuration | Expected capture |
|---|---|---|
| C0 | Ordinary UIKit rendering | `READABLE`; otherwise the capture path is not validated |
| C1 | Opaque `AVSampleBufferDisplayLayer`, same composite frame, `preventsCapture = false` | `READABLE`; isolates the public property as the controlled variable |
| C2 | Same layer/frame, `preventsCapture = true` set before first protected enqueue | Candidate must be black/redacted/omitted/placeholder with zero protected information |

The C2 composite must simultaneously contain:

- `PRIVATE WHOLESALE TEST`;
- `STRAIN: SYNTHETIC STRAIN A`;
- `PRIVATE PRICE: $1,234.56`;
- `AVAILABLE: 10 LB`;
- `MESSAGE: THIS TEXT MUST NOT APPEAR IN A SCREENSHOT.`;
- synthetic high-resolution still detail;
- moving/timecoded synthetic video content;
- a synthetic order manifest; and
- visible protected control labels, modal content, captions, and state where each relevant row requires them.

Every sensitive visual pixel must be inside the protected sample-buffer plane. A deliberately sensitive ordinary UIKit overlay must be added in a separate negative-boundary run to confirm that siblings do not inherit protection; that run is expected to fail and must never be mistaken for the candidate.

## 5. I01–I30 iOS proof matrix

| ID | Test | Exact proof requirement | Current result |
|---|---|---|---|
| I01 | Screenshot — protected text | C0/C1 readable; C2 composite text output black/redacted/omitted/placeholder. | `NOT EXECUTED` |
| I02 | Screenshot — protected image | Unique high-detail still in C2 contains zero readable protected pixels; inspect full-resolution PNG. | `NOT EXECUTED` |
| I03 | Screenshot — protected video paused | Paused timecoded frame, caption, and controls inside C2 remain protected. | `NOT EXECUTED` |
| I04 | Screenshot — protected video playing | Moving frame and protected overlays inside C2 remain protected. | `NOT EXECUTED` |
| I05 | Screenshot — manifest | Complete synthetic order manifest and values remain protected. | `NOT EXECUTED` |
| I06 | Screenshot — messages | Message text, sender alias, reply preview, timestamp, and reaction state remain protected. | `NOT EXECUTED` |
| I07 | Recording begun before protected entry | Start recorder on C0/C1, enter C2, and frame-step the transition; zero readable protected frames. | `NOT EXECUTED` |
| I08 | Recording begun after protected entry | With C2 visible, start recorder; inspect countdown, first produced frame, and stop transition. | `NOT EXECUTED` |
| I09 | Recorded navigation transitions | Navigate synthetic list/detail/media states while recording; every recomposition frame protected. | `NOT EXECUTED` |
| I10 | Recorded modal/dialog | Open and close a protected modal whose complete visual content is in C2; separately prove a UIKit sibling leaks in the negative-boundary run. | `NOT EXECUTED` |
| I11 | Recorded image/video transition | Transition still↔paused video↔playing video with captions; no clear/intermediate frame leaks. | `NOT EXECUTED` |
| I12 | Background/foreground | Record C2 through background, task snapshot, and re-entry; no stale/first frame leak; neutral placeholder until renderer ready. | `NOT EXECUTED` |
| I13 | App switcher | Task-switcher snapshot contains zero protected information; lifecycle cover is separate defense in depth. | `NOT EXECUTED` |
| I14 | Lock/unlock | Record supported path through lock/unlock; reauthentication/revalidation occurs before protected reveal. | `NOT EXECUTED` |
| I15 | AirPlay/mirroring | Test current supported AirPlay/mirroring path; device remains usable only if protected plane is omitted/black or entry is denied. | `NOT EXECUTED` |
| I16 | External display | Test supported USB-C/external-display topology; unknown/insufficient output state must fail closed. | `NOT EXECUTED` |
| I17 | ReplayKit/public capture API | Exercise ReplayKit and current supported ScreenCaptureKit/public capture where available; inspect output artifact. | `NOT EXECUTED` |
| I18 | Copy | No protected selection/copy command or clipboard representation; VoiceOver reading remains separately usable. | `NOT EXECUTED` |
| I19 | Share | No activity/share item containing protected content, reference, or reusable identifier. | `NOT EXECUTED` |
| I20 | Save image | No Photos/Files/save/export/original route; no unprotected thumbnail or preview cache. | `NOT EXECUTED` |
| I21 | Save video | No file/segment/playlist/key/export route; no offline protected cache. | `NOT EXECUTED` |
| I22 | Print | No protected printable formatter, PDF, print preview, or AirPrint payload. | `NOT EXECUTED` |
| I23 | Drag/export | No drag item, pasteboard provider, Open In, document picker export, or transferable representation. | `NOT EXECUTED` |
| I24 | VoiceOver/accessibility | Synthetic semantic tree supports reading, order verification, focus, and actions; inspect visual focus and recorded audio/output for leakage. | `NOT EXECUTED` |
| I25 | Text enlargement | Dynamic Type rerenders C2 without moving protected labels into ordinary views; maximum supported size remains usable. | `NOT EXECUTED` |
| I26 | Captions/transcripts | Protected caption/transcript is usable and inside the protected plane; accessible alternative follows same authorization. | `NOT EXECUTED` |
| I27 | Device rotation | Rotate through supported orientations while screenshotting/recording; no resize/reallocation/intermediate-frame leak. | `NOT EXECUTED` |
| I28 | Low-memory/process lifecycle | Force memory pressure/termination/relaunch where supported; no fallback ordinary rendering, stale preview, disk cache, or preauthorization reveal. | `NOT EXECUTED` |
| I29 | Unsupported/unknown protection state | Renderer/property/output/build/integrity state unknown or failed; protected payload is denied and neutral placeholder shown. | `NOT EXECUTED` |
| I30 | Entry while protection cannot be established | Deliberately fail renderer/readiness/admission before first enqueue; no protected data enters memory/render path and entry remains denied. | `NOT EXECUTED` |

## 6. Mandatory race cases

I07–I12 and I27 must explicitly cover:

1. recorder active before app launch;
2. recorder active before protected-room entry;
3. recording begins while protected content is visible;
4. first protected content reveal;
5. protected navigation and modal opening;
6. video start and still/video transition;
7. orientation/layout change;
8. background→foreground and lock→unlock; and
9. renderer failure/recreation.

The `preventsCapture` flag must be set before any C2 frame is enqueued. A neutral local placeholder is the only permitted output until admission is current, the renderer is ready, and the first protected frame can be displayed. Capture-state detection may be logged, but it must not be the mechanism producing the C2 result.

## 7. Decision rule

- Source, successful compilation, or a simulator result cannot produce `PROVEN CANDIDATE`.
- A black still screenshot does not prove screen recording.
- A black media region does not prove the whole surface.
- A complete candidate requires representative physical artifacts for every applicable I-row, all mandatory accessibility rows, and all fail-closed rows on each declared OS/device boundary.
- Until then, unmanaged iOS/iPadOS remains `CONDITIONAL — APP-STORE-VIABLE TECHNIQUE REQUIRES DEVICE PROOF` and Private Wholesale remains unreleased.
