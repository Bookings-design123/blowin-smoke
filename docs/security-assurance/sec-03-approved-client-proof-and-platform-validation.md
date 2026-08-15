# SEC-03 — Approved Client Proof & Platform Validation

**Package:** `SEC-03`
**Evidence access date:** 2026-08-15
**Governing base:** `f0e29cbfe4bc4ce717a569b1ecc3b66d7b422aeb` — “Correct SEC-02 protected content release criteria”
**Document role:** Canonical platform verdict, proof boundary, and next-gate decision
**Implementation authority:** None
**Production status:** Not authorized; no platform is a proven or approved Private Wholesale client

## 1. Decision

SEC-03 did not establish a production-ready Private Wholesale client. It established two supported **documentation candidates** whose required platform execution remains blocked in the available environment, and it reaffirmed that unmanaged Apple clients and browser clients do not meet the governing whole-surface capture gate.

| Client boundary | SEC-03 status | Governing reason |
|---|---|---|
| Unmanaged iOS / iPadOS | **REJECTED FOR PROTECTED WHOLESALE** | Current supported public APIs do not give a target application a general arbitrary-UI screenshot veto. Capture notifications and active-capture state do not prevent a readable screenshot. Narrow protected-media rendering does not protect the whole wholesale surface. |
| Native Android, Android 14 / API 34 candidate floor | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED** | `FLAG_SECURE` is a supported secure-window control for documented screenshot and non-secure-display paths. No Android device/emulator execution was available, so the full capture, extraction, integrity, accessibility, and failure matrix remains unproved. |
| Native Windows, fully patched Windows 11 24H2 minimum; Windows 11 25H2+ preferred | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED** | `WDA_EXCLUDEFROMCAPTURE` is a supported target-window mechanism for documented public capture paths. No Windows runtime/SDK/test environment was available, and Microsoft expressly limits the mechanism: it is not DRM or a universal capture guarantee. |
| Unmanaged macOS | **REJECTED FOR PROTECTED WHOLESALE** | No current supported target-controlled capture-exclusion mechanism sufficient for arbitrary protected application UI was established. ScreenCaptureKit selection is controlled by the capturing process, not the target application. |
| Managed Apple endpoint | **DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED** as a separate enterprise profile | Enrolled restrictions can disable screenshots and screen recordings within their exact managed-device boundary. No enrolled-device proof was run, and this does not create an unmanaged consumer-client capability. |
| Browser / PWA | **REJECTED FOR PROTECTED WHOLESALE** | SEC-02 is retained. No new evidence established target-controlled OS screenshot or recording exclusion. A browser may serve public retail and generic approved-client onboarding only; it receives zero protected wholesale payload. |

There is no `PROVEN CANDIDATE`. Documentation, a compilable harness, a detection callback, a disabled menu item, or a watermark cannot independently satisfy the gate. A candidate can advance only after authoritative support and representative execution demonstrate the required property, required bypasses are exercised, and the exact platform, version, framework, device, and capture path are recorded.

The complete authoritative-source ledger is in [SEC-03 Evidence Register](sec-03-evidence-register.md). The test-level disposition is in [SEC-03 Platform Test Matrix](sec-03-platform-test-matrix.md). Those documents control source qualifications and T01–T41 results; this document does not duplicate either ledger.

## 2. Purpose and boundary

SEC-03 answers one question:

> Which currently supported client platforms can plausibly satisfy Blowin’ Smoke’s Private Wholesale Protected Content standard, and which of those properties have actually been proved?

The answer is narrower than product selection. SEC-03:

- evaluates supported platform authority over screenshots, recordings, non-secure output, ordinary extraction, client integrity, and accessibility;
- distinguishes an API’s documented scope from behavior actually executed by Blowin’ Smoke;
- defines isolated synthetic proofs without implementing commerce, accounts, inventory, or production cryptography;
- preserves SEC-02’s fail-closed content-release gate; and
- records what a later human/device validation must prove.

SEC-03 does **not** authorize a production application, select a final framework or stack, select an E2EE protocol/library, launch Private Wholesale, enroll customers, use real customer or product data, create production credentials, or modify the closed retail/static prototype.

## 3. Governing acceptance standard

Every protected surface of an approved client must satisfy all six classes below inside its declared supported boundary. A strong result in one class cannot compensate for failure in another.

1. **Capture protection:** ordinary supported screenshot and screen-recording paths cannot produce readable protected pixels; protected output to supported mirroring, external-display, and non-secure virtual-display paths is denied, omitted, blanked, or replaced with an approved placeholder. A callback after a readable capture is produced fails this requirement.
2. **Extraction restriction:** ordinary client-supported copy, cut, selection for export, forward, share, save, download, open-original, print, drag/drop, export, external-intent, durable-resource-URL, and unauthorized offline-persistence paths are absent or denied.
3. **Protected delivery:** every object is private, authenticated, non-enumerable, short-lived, revocable, bound to its authorized context, absent from an unprotected private cache, and withheld until all required admission evidence is established.
4. **Client and device trust:** the client is signed, current, supported, and bound to an explicitly enrolled endpoint. Stale, revoked, tampered, unsigned, unsupported, or untrusted state is denied. A user-agent string or client Boolean is never authorization.
5. **Accessibility:** equivalent keyboard/switch navigation, assistive reading, enlargement, captions/transcripts, high contrast, and protected order verification remain usable. Anti-extraction controls cannot erase legitimate accessibility.
6. **Security honesty:** a second camera is not preventable; privileged, rooted, jailbroken, instrumented, or otherwise compromised environments may defeat client controls. These limits are stated without weakening the supported-client gate.

The state rule is unchanged:

```text
MISSING | UNKNOWN | STALE | REVOKED | UNSUPPORTED
    -> DENY BEFORE PROTECTED PAYLOAD
```

No silent downgraded rendering, browser fallback, lower-protection cache, or detection-only fallback is allowed.

### 3.1 Hard capture-output rule

This output rule supersedes every weaker interpretation:

> **Protected wholesale content must never appear readably in the resulting supported screenshot or screen-recording output on an approved client.**

The preferred result is that capture is prevented and no artifact is produced. The minimum acceptable result is an artifact whose complete protected surface is black, fully omitted, or replaced with a security placeholder containing zero protected information. The exclusion must cover private inventory, classified strain names, prices, quantities/availability, profiles, photos, video, messages, negotiation information, manifests, customer/order-sensitive information, and protected navigation or context.

Each screenshot test must inspect the actual saved screenshot. Each recording test must inspect the actual recording across all protected intervals, frame-by-frame where practical. A single readable protected frame fails that path. These all fail:

- readable capture followed by a warning or deletion;
- post-capture screenshot notification;
- active-recording detection while protected pixels remain in output;
- pausing only after a readable frame was recorded; and
- watermarking otherwise readable captured content.

Tests must attempt capture before, during, and immediately after reveal; across protected navigation, modal/dialog opening, image/video transitions, background/foreground, task switching, orientation or window changes, lock/unlock, external-display attach/detach, recording begun before protected entry, and recording begun while already inside. Any readable transition race fails the path.

If required protection cannot be established before protected payload, decode, or render, the client must show only a non-sensitive surface such as:

```text
PRIVATE WHOLESALE
PROTECTED CONTENT UNAVAILABLE

This device cannot currently establish the protection required to
display Private Wholesale content.
```

No protected content may exist behind, underneath, or preloaded for that surface.

## 4. SEC-02 revisions and affirmations

SEC-03 narrows candidate boundaries using current evidence; it does not rewrite the SEC-02 architecture.

### 4.1 Android candidate floor revised

SEC-02 used Android 12+ as a provisional lower boundary because Android’s own guidance reported materially weaker `FLAG_SECURE` reliability on Android 11 and lower. SEC-03 sets **Android 14 / API 34** as the candidate proof floor.

This is a support-and-validation boundary, not a claim that Android 12 or 13 never implement the documented secure-window property. Android 14 provides a current, bounded target for the complete proof program and a supported screenshot-detection API that can supplement—but never replace—`FLAG_SECURE`. Approval still requires a maintained release/version policy and tests on each admitted device/OS/framework combination.

### 4.2 Windows availability separated from admission

`WDA_EXCLUDEFROMCAPTURE` has a documented API behavior floor of **Windows 10 version 2004**. That is not the production admission floor. Windows 10 is outside the proposed maintained-client boundary, so SEC-03 sets a **fully patched Windows 11 24H2** device as the minimum proof target and prefers **Windows 11 25H2 or later** for a longer support runway.

The API’s historical availability must never be presented as evidence that an obsolete Windows release is an acceptable protected client.

### 4.3 Apple conclusions strengthened, not loosened

Current Apple evidence reinforces the unmanaged iOS/iPadOS rejection: no supported public general screenshot-veto API was established for arbitrary application UI. Current narrow protected-video/sample-buffer mechanisms are recorded separately so their real scope is not lost, but they do not convert a mixed text, image, price, messaging, manifest, and media interface into a protected whole surface.

The unmanaged macOS rejection also remains. Managed-device restrictions are separated as an enterprise profile rather than attributed to an ordinary application.

### 4.4 Browser boundary retained

SEC-03 found no genuinely new browser platform authority that changes SEC-02. Public retail remains a complete ordinary HTTPS browser experience. An optional public Onion entrance may serve public/nonprotected content and protected-client onboarding. Neither receives protected Private Wholesale content.

## 5. iOS and iPadOS validation

### 5.1 Verdict

**Status:** `REJECTED FOR PROTECTED WHOLESALE`
**Supported whole-surface mechanism:** None established
**Proof status:** Rejection is evidence-based; a qualifying whole-surface proof could not be defined from supported public APIs
**Remaining blocker:** A future supported public target-controlled mechanism would have to exclude readable arbitrary wholesale UI from screenshots and recordings across the declared boundary, followed by representative execution and bypass testing

### 5.2 What supported APIs establish

- The application can learn that a screenshot has already been taken. That is a post-capture notification; it cannot retract readable pixels already written to the screenshot.
- Scene/screen capture state can report active recording, mirroring, or related capture conditions and let the app replace or pause content. Detection plus application redaction is useful defense in depth, but it is not a general OS-enforced veto and requires tests for first-frame/race behavior.
- The application can obscure its app-switcher/background snapshot through lifecycle-controlled cover UI. That protects a separate snapshot path; it does not establish screenshot or recording exclusion while the scene is active.
- Supported protected-video technologies, including FairPlay-based media paths and protected sample-buffer display behavior, can protect a narrower media-rendering path under their documented conditions. They do not protect ordinary UIKit/SwiftUI text, prices, still images, lists, controls, messages, dialogs, manifests, or accessibility surfaces.
- Managed-device restrictions can disable screenshots and screen recordings within an exact enrolled-policy boundary. That is administrative device control, not authority held by an unmanaged App Store client.

### 5.3 What does not qualify

Wrapping arbitrary UI in secure text-entry rendering, relying on private UIKit layers, manipulating private flags, or exploiting secure-text implementation side effects is **OBSERVED / UNSUPPORTED — NOT ACCEPTABLE FOR PRODUCTION GATE**. Popularity in third-party code does not make the behavior a supported Apple contract. Such techniques introduce platform-update, App Review, accessibility, rendering, and silent-failure risk.

Telegram’s protected-content product language establishes a desired customer outcome, not an Apple API. Current Telegram official issue material also reports platform-dependent behavior, including readable iOS captures in some protected-content cases. It cannot elevate an undocumented technique into supported platform authority, and SEC-03 did not reverse-engineer Telegram.

### 5.4 Architectural implication

Rebuilding selected video as a protected-media surface would protect only that media under its exact supported conditions. The Private Wholesale experience also requires protected text, prices, inventory, still imagery, navigation, messages, order verification, and accessible controls. Because the complete surface cannot satisfy the screenshot gate, a partially protected iOS/iPadOS client cannot receive protected wholesale payload.

## 6. Android validation

### 6.1 Verdict

**Status:** `DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED`
**Minimum candidate version:** Android 14 / API 34
**Supported mechanism:** `WindowManager.LayoutParams.FLAG_SECURE` applied to every protected window/surface; app-owned extraction denial; separate integrity and endpoint admission evidence
**Proof status:** Minimal native-view harness defined; compile, install, device execution, capture output inspection, and bypass matrix not run
**Remaining blocker:** Representative physical-device/emulator execution of the complete T01–T41 matrix across every admitted window, framework, media surface, output, accessibility mode, and compromised-device case

### 6.2 Mechanism and exact limit

`FLAG_SECURE` is the primary supported Android capture control. Android documents it as preventing screenshots and display on non-secure displays for the protected window. The security property belongs to the exact secure window/compositor/output path; it is not a universal assertion about every OEM, privileged capture, rooted device, instrumentation, or external camera.

Screenshot and recording callbacks are observational controls. They may support audit, customer explanation, pausing, or incident handling, but they do not replace pixel exclusion. The same is true of overlay defenses and device-management policy: each addresses a separate path and must be tested separately.

The candidate must demonstrate secure behavior for:

- every activity, dialog, popup, secondary window, task/app preview, transition, and background state;
- native views, Compose if selected, WebView if present, image surfaces, video surfaces, text, and accessibility-rendered equivalents;
- the normal screenshot controls, alternate supported screenshot paths, native recorder, MediaProjection, non-secure virtual displays, mirroring, and supported external displays;
- copy/selection, clipboard, shares, print adapters, downloads, save actions, external intents, drag/drop, and direct-resource reuse; and
- clean, low-memory, process-restart, update, stale-client, offline, and failure paths without flashing or caching readable content.

The Android harness under [`proofs/sec-03/platform-harnesses/android/`](../../proofs/sec-03/platform-harnesses/android/) sets a protected native window and includes a separately exercised secure dialog using synthetic content. It contains no commerce, accounts, network calls, production credentials, or production UI. Because the environment had no Android SDK, emulator, ADB, or device bridge, its existence is not execution evidence.

### 6.3 Integrity boundary

App signing, Android Keystore/StrongBox where actually supported, trusted-device keys, and Play Integrity evidence may contribute to admission. They do not prove that a device is uncompromised and do not make root detection infallible. The final policy must record the exact verdicts and freshness it accepts; mandatory missing, unknown, stale, replayed, unlicensed, tampered, revoked, or unsupported evidence fails closed. Root/instrumentation bypass remains inside the adversarial test plan and outside any universal prevention claim.

## 7. Windows validation

### 7.1 Verdict

**Status:** `DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED`
**API behavior floor:** Windows 10 version 2004
**Minimum candidate admission version:** Fully patched Windows 11 24H2; Windows 11 25H2+ preferred
**Supported mechanism:** `SetWindowDisplayAffinity(window, WDA_EXCLUDEFROMCAPTURE)` for each owned top-level protected window, plus app-owned extraction denial and separate client/device admission
**Proof status:** Minimal Win32 harness defined; compilation, Windows execution, capture inspection, and bypass matrix not run
**Remaining blocker:** Representative supported-Windows execution across the declared framework/window topology, capture tools/APIs, display/remote paths, extraction paths, accessibility, and integrity states

### 7.2 Mechanism and exact limit

Microsoft documents `WDA_EXCLUDEFROMCAPTURE` as excluding the target top-level window from documented supported capture paths on the stated OS line. The calling process must own the applicable top-level window. The mechanism is **not DRM**, does not make content cryptographically inaccessible after rendering, does not stop photographing the screen, and is not a strict guarantee against privileged or unsupported capture.

The test boundary must include:

- Snipping Tool, Print Screen, native screen recording, Game Bar, and supported Windows capture APIs;
- each top-level window, owned dialog, child/embedded surface, popup, video surface, and any browser-embedded process;
- multiple-window movement, transitions, thumbnails/previews, desktop switching, mirroring, external display, and Remote Desktop behavior;
- clipboard, text selection, copy, print, save, export, drag/drop, shell/open-with actions, and direct-resource reuse; and
- compatibility after OS, framework, graphics-driver, recording-tool, and application updates.

The Win32 harness under [`proofs/sec-03/platform-harnesses/windows/`](../../proofs/sec-03/platform-harnesses/windows/) applies `WDA_EXCLUDEFROMCAPTURE` to an owned top-level window and terminates rather than silently continuing if the call cannot be established. It displays only synthetic content. The available macOS ARM64 environment had no Windows runtime, SDK, supported VM, or capture tools, so no output result was observed.

### 7.3 Integrity boundary

Code signing, a supported release manifest, protected device keys through an appropriate Windows key facility, and platform/device health evidence may contribute to admission. Exact packaging, attestation, and key-storage choices remain unselected. Display affinity cannot substitute for signed-build verification, endpoint enrollment, authorization, or application removal of extraction commands.

## 8. macOS and managed Apple boundary

### 8.1 Unmanaged macOS

**Status:** `REJECTED FOR PROTECTED WHOLESALE`

Current evidence did not establish a supported API by which the target app can exclude arbitrary protected UI from normal screenshots and screen recordings. The legacy `NSWindow` sharing setting does not provide the required current protection. ScreenCaptureKit lets a capturing application define what its own stream includes or excludes; it does not give another target application a mandatory veto. Narrow protected-media behavior does not cover the complete wholesale interface.

No private API, secure-text side effect, brittle compositor behavior, or reverse-engineered trick may qualify.

### 8.2 Managed Apple profile

**Status:** `DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED` as a separately governed enterprise profile

Apple’s enrolled restrictions can disable screenshots and screen recordings within their stated managed platform/version boundary. Before that route could advance, Blowin’ Smoke would need an owned or contractually governed device enrollment model, exact restriction payload and OS/version tests, policy-removal and noncompliance handling, accessibility validation, customer-support/exit procedures, and proof that missing or stale management state denies content. It is not a fallback for ordinary wholesale customers and does not change the unmanaged verdict.

## 9. Browser, PWA, and reference-product disposition

Browser and PWA research is closed for this gate unless genuinely new target-controlled OS authority appears. Web APIs can govern capture initiated by the page itself, remove app-owned actions, and reduce caching; they do not let the target page veto ordinary OS/browser capture. Installability does not create an independent signing or secure-display boundary.

Telegram remains a reference for user-perceived protected-content behavior and for client-contract variation. It is not an implementation source, a platform capability proof, a cryptographic selection, or a basis for attributing unsupported behavior to Apple, Android, Windows, or macOS.

### 9.1 Distribution policy is a separate blocker

Platform capture capability does not establish that a native client can be distributed to Blowin' Smoke customers. Current Apple App Review and Google Play policies materially restrict applications that facilitate tobacco/nicotine and marijuana/THC sales. Those policies do not change the OS API findings, and they do not by themselves establish how THCA or a narrowly scoped private-wholesale client would be classified. They do establish that ordinary public app-store distribution cannot be assumed.

No store submission, enterprise/custom distribution route, direct Android distribution route, or legal/product-classification strategy is selected by SEC-03. A later gate must obtain current qualified policy/legal review and prove a supportable signed-update and revocation channel without weakening client integrity. Apple enterprise distribution cannot be treated as a general customer channel without satisfying Apple’s exact organizational eligibility and use restrictions. An Android route outside Google Play cannot silently assume `PLAY_RECOGNIZED` or other Play-specific admission signals; the integrity profile must match the actual distribution channel.

## 10. Isolated proof work and execution boundary

All SEC-03 proof artifacts are non-production, synthetic, and isolated under [`proofs/sec-03/`](../../proofs/sec-03/). They are not application code and must not be promoted into a product repository path.

### 10.1 Available environment

| Capability | Observed state | Consequence |
|---|---|---|
| Host | macOS 26.6.1, ARM64 | Suitable for platform-neutral tests only in the current configuration |
| Node / npm | Node 18.17.0; npm 9.6.7 | Platform-neutral admission/resource model executed |
| Apple toolchain | Xcode command-line entry points present but failed to load required framework dependencies | No valid Apple build/simulator execution |
| Android toolchain | No Android SDK, emulator, ADB, or connected device | Android harness uncompiled and unexecuted |
| Windows toolchain | No Windows runtime, SDK, supported VM, or capture tools | Windows harness uncompiled and unexecuted |

This constraint is recorded as `EXECUTION PROOF BLOCKED`; no device result was inferred.

### 10.2 Platform-neutral proof result

The isolated Node proof executed **16 of 16 tests successfully** for its declared model. It demonstrated feasibility of:

- denial for expired/revoked grants, wrong account, wrong room, wrong endpoint, unsupported/stale/unsigned clients, reused grants, and enumerated or substituted resource identifiers;
- ignoring self-asserted `approved=true` and user-agent strings;
- denial for missing, unknown, stale, future-dated, or revoked mandatory evidence;
- trusted-device challenge/confirmation, revocation, and all-device-loss recovery into a new cryptographic identity without old-history access;
- opaque one-time grant handling and response headers that prohibit intentional storage while preserving the qualification that `no-store` is not secure erasure;
- a synthetic 3840×2160 protected image, representative high-resolution video segment descriptor, privacy-minimized repeated visible watermark, and immutable +5-minute view / +30-minute dispute clock semantics.

These are **application-model feasibility results only**. They do not establish an authenticated production service, network behavior, CDN/cache behavior, actual 4K decoding, OS capture exclusion, device integrity, secure key custody, accessibility, or production cryptography.

## 11. Fail-closed admission model

A protected object can be released only after the server independently establishes all mandatory evidence for that request:

```text
signed supported release
+ supported platform/control state
+ current account authorization
+ current wholesale-room authorization
+ explicitly trusted, non-revoked endpoint identity
+ fresh accepted integrity evidence where required
+ current opaque resource grant
+ account/room/resource/endpoint binding
+ freshness and revocation checks
= protected response
```

The server must evaluate this state; the client cannot declare itself approved. Grants are opaque, short-lived, non-enumerable, narrowly scoped, and invalidated on expiry, revocation, use policy, or endpoint/account/room state change. Denials do not expose protected existence through rich error detail. Protected bytes are not prefetched while admission is unresolved, and an unsupported client receives no protected shell metadata, catalog, price, inventory, media, message, history, or manifest.

The proof model establishes that this decision shape is feasible. Production token format, attestation provider, session mechanism, service topology, persistence, rate limits, replay policy, and cryptographic implementation remain unselected.

## 12. Protected media and watermark boundary

SEC-03 preserves SEC-02’s hybrid media decision:

- current catalog, private price, inventory, proof, product imagery, and streamable catalog video are D3 restricted server-authorized content;
- messages and explicitly approved conversation-specific attachments are D4 endpoint-E2EE content; and
- a final-order manifest is a D3 canonical commerce projection, even when its view lease is short.

A later device proof must use synthetic high-resolution image and representative 4K media to test authorization, range/segment/key requests, expiry, revocation, replay, wrong-context access, no public enumeration, no durable original URL, no ordinary Save/Share/Open Original action, no unprotected offline cache, and no direct replay after authorization expires. Expiry terminates future authorized delivery; it does not recall pixels, memory, outputs, or copies already obtained by a compromised endpoint.

Visible watermarking remains defense in depth. The allowed concept uses a privacy-minimized pseudonymous account/session value, render/session identifier, bounded time window, and repeated placement not confined to an easily cropped corner. Where the service must decrypt D3 media for authorized transform, the mark should be burned into the served derivative rather than exist only as a removable UI overlay. Raw email, phone number, address, or other direct identifier must not be embedded.

Watermarking is neither screenshot prevention nor proof of who leaked content. A match may support an investigation only with corroborating evidence, false-positive controls, notice, access limits, retention, appeal, and due process. Forensic watermarking remains unselected and blocked pending independent evidence.

## 13. Extraction and state-aware behavior

Capture flags do not remove application extraction paths. Every candidate must separately prove that protected text, stills, video, documents, messages, and manifests offer no ordinary copy, forward, share, save, download, print, drag/drop, export, open-original, external-intent, or durable resource path.

State changes must be observable and fail closed:

- background, capture-active, unsupported-display, stale-build, revoked-device, expired-grant, lost-network, and integrity-unknown states remove or replace protected content before exposure;
- dialogs, errors, notifications, recent-item previews, logs, analytics, crash reports, clipboard history, search indexes, backups, thumbnails, and OS restoration state contain no protected plaintext;
- no content flashes before a secure surface is established; and
- a failed platform-control call terminates the protected view rather than continuing with a warning.

Privileged instrumentation, manual transcription, endpoint compromise, and an external camera remain separately modeled limits, not ordinary supported extraction paths.

## 14. Accessibility requirements

Protected does not mean unusable. A candidate cannot advance until representative assistive-technology execution demonstrates:

- keyboard, switch, or equivalent navigation through every protected action;
- screen-reader access to the information needed to evaluate products, converse, and verify an order;
- text enlargement/reflow and high-contrast behavior without clipping, leaking, or forcing an unprotected fallback;
- synchronized captions and protected transcripts for required media;
- clear security placeholders and recovery paths when content is withheld; and
- sufficient protected time or a qualified accessible alternative for view and dispute workflows.

Accessibility semantics must be least-privilege and bound to the authorized process, but accessibility cannot be disabled wholesale to create an anti-copy claim. A control that blocks screenshots by breaking assistive access fails the gate. SEC-03 executed no platform accessibility test; T36–T40 remain blocked as recorded in the test matrix.

## 15. Root, jailbreak, tampering, and integrity limits

No platform offers infallible proof that an endpoint is clean. Signing, app attestation/integrity services, secure key facilities, device health signals, and local compromise indicators establish bounded evidence under their documented threat models; they do not defeat a fully privileged attacker or prove the absence of instrumentation.

The future admission policy must:

- bind accepted evidence to the request, account, release, endpoint, nonce/challenge, and freshness window where supported;
- treat replayed, stale, unknown, unavailable, unsupported, tampered, revoked, or mandatory-missing signals as denial;
- test root/jailbreak/instrumentation and modified-environment bypasses without promising perfect detection;
- document false-positive, privacy, availability, regional/device-support, and recovery consequences; and
- revoke future access and rotate affected endpoint material after a credible compromise.

A compromised-device signal should cause fail-closed denial when the signal is part of the approved admission profile. The lack of a detected compromise must never be advertised as proof that capture controls cannot be bypassed.

## 16. E2EE compatibility without protocol selection

Android and Windows candidate architectures are compatible in principle with the later E2EE requirements, but SEC-03 selects no protocol, library, key format, secure-storage profile, or production stack. Any surviving client must still support:

- endpoint identity keys and protected local key use;
- authorization of a new device from an existing trusted device;
- explicit multi-device add, suspend, revoke, and lost-device lifecycle;
- peer-visible key-change warnings and required conversation pause/reverification policy;
- ratchet/session/group state, replay and out-of-order handling, and safe migration;
- message and approved attachment encryption with no server-readable universal content key; and
- account recovery separated from old-history recovery.

Secure Enclave, Android Keystore/StrongBox, and Windows protected-key facilities may protect suitable long-term or wrapping keys under exact tested conditions. They cannot be assumed to hold every rapidly changing protocol state and do not make a final protocol safe by themselves. Homemade cryptography remains prohibited.

## 17. Onion relationship

SEC-03 keeps transport selection independent from client capture approval:

```text
PUBLIC WEBSITE
  -> ordinary HTTPS

OPTIONAL PUBLIC ONION
  -> public/nonprotected content
  -> generic approved-client onboarding only

PROTECTED NATIVE WHOLESALE
  -> approved signed client required
  -> Onion only through a separately selected and audited native transport
  -> no silent clearnet fallback
```

Native Onion transport is not required to classify a capture candidate. Conversely, a native client is not Onion-compatible merely because it can make network requests, and Tor Browser remains ineligible for protected payload.

## 18. Security claims permitted after SEC-03

The following are accurate:

- “No Private Wholesale client is approved or proven.”
- “Android provides a documented secure-window candidate; Blowin’ Smoke has not executed the required device proof.”
- “Windows provides a documented target-window capture-exclusion candidate for specified supported paths; Blowin’ Smoke has not executed the required Windows proof, and the mechanism is not DRM.”
- “No supported general arbitrary-UI screenshot veto was established for an unmanaged iOS/iPadOS or macOS client.”
- “Managed Apple restrictions are a separate enrolled-device possibility, not an unmanaged application capability.”
- “Watermarking deters and can contribute evidence; it does not prevent screenshots or conclusively identify a person.”
- “An external camera and privileged endpoint compromise remain outside the supported digital-capture guarantee.”

The following remain prohibited:

- “Screenshots are impossible.”
- “Android/Windows passed.”
- “Telegram proves iOS capture protection.”
- “Protected video makes the whole Apple app protected.”
- “The client is unhackable/root-proof/jailbreak-proof.”
- “No-store securely erases delivered content.”
- “Watermarks prove who leaked it.”
- “E2EE, native Onion, DRM, production cryptography, or a production stack has been selected.”

## 19. Next gate

SEC-03 closes platform documentation research for the current evidence set. The next authorized work, if separately approved, is a **representative device execution and independent review gate**, not product implementation.

At minimum it must:

1. compile signed synthetic proof clients using a declared Android and Windows framework/release profile;
2. run the complete T01–T41 matrix on the exact supported OS/device/tool boundary, retaining screenshots/recordings/logs and hashes as evidence;
3. test every protected window, dialog, framework surface, media type, output, extraction command, app-state transition, cache, and accessibility path;
4. exercise unsupported/stale/tampered builds, endpoint enrollment and revocation, resource expiry/replay/enumeration, integrity failures, root/instrumentation or equivalent privileged scenarios, and recovery;
5. obtain independent application-security, platform-capture, accessibility, privacy/claims, and later cryptographic integration review; and
6. define a maintainable support/patch/emergency-revocation policy before any client can become a `PROVEN CANDIDATE`.

An execution result promotes only the exact tested boundary. A later OS, framework, device class, graphics path, recorder, or window topology must enter the regression matrix before admission. `PROVEN CANDIDATE` still would not mean production approved; launch requires a separate explicit governing decision.

## 20. Final phase classification

- **SEC-03 PLATFORM RESEARCH: COMPLETE FOR THE CURRENT EVIDENCE SET**
- **PROVEN PRIVATE WHOLESALE CLIENT: NONE**
- **ANDROID 14 / API 34: DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED**
- **WINDOWS 11 24H2 MINIMUM / 25H2+ PREFERRED: DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED**
- **UNMANAGED IOS / IPADOS: REJECTED FOR PROTECTED WHOLESALE**
- **UNMANAGED MACOS: REJECTED FOR PROTECTED WHOLESALE**
- **MANAGED APPLE: DOCUMENTATION-SUPPORTED — EXECUTION PROOF BLOCKED AS A SEPARATE ENTERPRISE PROFILE**
- **BROWSER / PWA: REJECTED FOR PROTECTED WHOLESALE; PUBLIC RETAIL UNAFFECTED**
- **NATIVE CLIENT DISTRIBUTION: MATERIAL POLICY EVIDENCE RECORDED; NO STORE OR ALTERNATE DISTRIBUTION ROUTE SELECTED**
- **PLATFORM-NEUTRAL ADMISSION/MEDIA MODEL: 16/16 SYNTHETIC TESTS PASSED WITHIN ITS DECLARED SCOPE**
- **EXTERNAL-CAMERA PREVENTION: NOT PREVENTABLE; T41 DOES NOT INVALIDATE SUPPORTED DIGITAL CAPTURE PROTECTION**
- **E2EE PROTOCOL, NATIVE ONION TRANSPORT, DRM, PRODUCTION STACK, AND PRODUCTION IMPLEMENTATION: NOT SELECTED / NOT AUTHORIZED**
