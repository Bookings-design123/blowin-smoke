# Private Wholesale Protected Content Assurance

**Package:** `SEC-02`
**Correction date:** 2026-08-14
**Document role:** Governing protected-content release criterion, client release matrix, and evidence register
**Implementation authority:** None
**Production status:** Not authorized; no client is approved for production

## 1. Governing correction

Private Wholesale Protected Content Mode is a **hard release gate**. Public retail remains a complete ordinary-browser experience. Private wholesale inventory, pricing, availability, media, messages, negotiation history, and manifests must be withheld unless the requesting client is an approved client that has passed the protected-content acceptance standard.

The prior browser-first conclusion remains valid only as a feasibility finding about browser E2EE. It is superseded as a Private Wholesale client recommendation because no qualifying supported target-controlled capture veto was verified for the assessed browsers. A PWA does not gain that authority merely by being installed.

The controlling direction is therefore:

```text
PUBLIC RETAIL
  -> ordinary supported browsers

PRIVATE WHOLESALE DISCOVERY / SIGN-IN
  -> may explain access requirements without disclosing protected content

PRIVATE WHOLESALE PROTECTED CONTENT
  -> signed, approved client
  -> current account + room grant + trusted endpoint
  -> supported platform and control state verified
  -> fail closed if any required state is absent, unknown, stale, or revoked
```

No current client is an `APPROVED CANDIDATE` because Blowin' Smoke has not built or tested one. Native Android and native Windows are `CONDITIONAL CANDIDATE` architectures. Managed-device routes are conditional only as a separately governed enterprise case. All assessed browsers and PWAs, native iOS/iPadOS, and native macOS are rejected for protected wholesale under current authoritative evidence.

This decision does not claim universal control over an authorized person's endpoint. An external camera remains outside software authority. That irreducible limit does not weaken the requirement to block screenshots and recordings through the supported platform paths where the approved client and OS can enforce it.

## 2. Acceptance standard and evidence vocabulary

An approved client must, for every protected surface:

1. use a supported platform control that excludes protected pixels from ordinary screenshots, screen recordings, mirroring, and non-secure displays within the declared support boundary;
2. remove ordinary app-supported copy, cut, forward, share, save, download, print, drag, export, open-original, and durable-URL paths;
3. obtain every protected object through current server authorization, without public enumeration or a private offline cache;
4. bind access to a signed current client, approved endpoint, current room grant, and short-lived resource authorization;
5. fail closed when platform support, integrity, device trust, authorization, capture control, or freshness cannot be established;
6. preserve accessible reading, navigation, captions, transcripts, enlargement, contrast, and dispute access through least-privilege protected alternatives; and
7. supplement prevention with individualized visible marks, audit, revocation, and governed leakage response.

Control labels have narrow meanings:

| Label | Meaning |
|---|---|
| `OS-ENFORCED` | The supported OS supplies and enforces the named control for the stated path. This is not a claim about modified OS images, privileged compromise, unsupported capture paths, or an external camera. |
| `APPLICATION-ENFORCED` | The signed client owns the relevant command or data-delivery path and denies it. A compromised endpoint can bypass application logic. |
| `BEST-EFFORT` | The control reduces exposure but authoritative documentation or the stated boundary leaves material gaps. |
| `NOT ENFORCEABLE` | No supported mechanism was verified that gives the target client authority over the requested behavior. |
| `NOT YET VERIFIED` | A mechanism exists, but no Blowin' Smoke build and test evidence establishes the operational property. |

`APPROVED CANDIDATE` means the architecture has sufficient authoritative and test evidence to enter final approval review. It does not mean production approval. `CONDITIONAL CANDIDATE` has a plausible supported enforcement path but still lacks one or more mandatory proofs. `REJECTED FOR PROTECTED WHOLESALE` means the current client class cannot meet the hard gate and must receive no protected content.

## 3. Telegram reference standard

Telegram is evidence of desired customer-perceived behavior, not a dependency, protocol choice, or implementation to copy.

| Observed reference behavior | Platform capability or constraint established | Blowin' Smoke implementation class | Strength | Residual bypass | Result |
|---|---|---|---|---|---|
| Protected chats/messages require clients to disable forwarding, downloads, copying, and screenshots | Telegram defines a client contract and returns a restricted-forward error; the contract does not prove uniform enforcement by every OS/client | Signed client plus server-side message/object policy | App + platform dependent | Modified clients, unsupported platforms, compromised endpoints | Reference behavior only |
| Group/channel protection limits media saving and forwarding and describes screenshot prevention | Telegram publishes a customer-facing protected-content mode | Native protected client | Platform dependent | Telegram's own platform behavior varies | Reference behavior only |
| Telegram Desktop/Web currently permit screenshots as intended behavior while still restricting copy, forward, and local media save | Desktop/web product behavior is not uniform and the web client does not gain a target-controlled screenshot veto | Browser/PWA | Screenshot `NOT ENFORCEABLE` | OS capture, browser inspection | Reject browser/PWA |
| Telegram's official issue tracker contains current iOS reports that protected bot content remains visible in screenshots while Android blocks it | User reports on an official tracker show platform variation; they are not an Apple capability guarantee | Android versus iOS native | Corroborating, not controlling | Version/build differences | Require platform evidence and tests |
| Telegram warns screenshot detection is not bulletproof and no product can stop another camera | Endpoint and physical-world limits remain | Every client | `NOT ENFORCEABLE` for external camera | Re-photography, transcription | Preserve explicit limitation |

Blowin' Smoke targets the security property—protected pixels excluded on supported approved clients plus ordinary extraction paths removed—without claiming Telegram compatibility or recreating Telegram internals.

## 4. Three-layer protection model

### A. Restricted content controls

Every protected object is deny-by-default. The client and service remove or deny ordinary copy, cut, forward/share, download, save, open-original, print, drag/drop, export, durable asset URL, unprotected offline cache, bulk enumeration, and unauthorized API retrieval paths. Accessibility APIs receive only the least protected equivalent required for legitimate use; they are not disabled wholesale.

### B. Capture protection

Screenshot, screen recording, display mirroring, non-secure display, capture detection, and capture redaction/exclusion are evaluated separately. Detection never substitutes for prevention when the gate requires blocking. A post-screenshot event never satisfies screenshot prevention.

### C. Leakage deterrence and attribution

Individualized visible watermarks, pseudonymous session/account trace IDs, server/edge-burned marks, bounded static-per-render or static-per-session placement variation, short authorization, rate/scrape monitoring, revocation, and an optional independently validated forensic watermark remain defense in depth. They do not replace Layers A or B and never prove which human disclosed content without corroboration and due process.

## 5. Client release matrix

Abbreviations: `OS` = `OS-ENFORCED`; `APP` = `APPLICATION-ENFORCED`; `BE` = `BEST-EFFORT`; `NE` = `NOT ENFORCEABLE`; `NV` = `NOT YET VERIFIED`. “Block” means exclusion through the named supported client/OS path, not an external camera or privileged compromise.

### 5.1 Capture and ordinary extraction controls

| Client | Screenshot block | Screen-record block | Display/mirror protection | Copy | Forward | Save | Download | Print | Drag/export | Overall status |
|---|---|---|---|---|---|---|---|---|---|---|
| Desktop Chromium browser | `NE` | `NE` | `NE` target veto | `BE` | `APP/BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Desktop Safari browser | `NE` | `NE` | `NE` target veto | `BE` | `APP/BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Desktop Firefox browser | `NE` | `NE` | `NE` target veto | `BE` | `APP/BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Mobile Chromium browser | `NE` | `NE` | `NE` target veto | `BE` | `BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Mobile Safari browser | `NE` | `NE` | `NE` target veto | `BE` | `BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Mobile Firefox browser | `NE` | `NE` | `NE` target veto | `BE` | `BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Desktop PWA | `NE` | `NE` | `NE` target veto | `BE` | `APP/BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Mobile PWA | `NE` | `NE` | `NE` target veto | `BE` | `BE` | `BE` | `BE` | `BE` | `BE` | `REJECTED FOR PROTECTED WHOLESALE` |
| Native Android, provisionally Android 12+ only | `OS/NV` with `FLAG_SECURE` | `OS/BE/NV` for supported non-secure virtual-display paths | `OS/NV` non-secure-display exclusion | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `CONDITIONAL CANDIDATE` |
| Native iOS/iPadOS | `NE`; notification is after capture | `APP/BE` detection and redaction | `APP/BE` active-capture response | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `REJECTED FOR PROTECTED WHOLESALE` |
| Native Windows, provisionally Windows 10 2004+ | `OS/BE/NV` supported public paths | `OS/BE/NV` supported public paths | `OS/BE/NV` with display-affinity/DXGI scope | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `CONDITIONAL CANDIDATE` |
| Native macOS | `NE` for arbitrary target UI | `NE` for arbitrary target UI | `NE` target veto | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `APP/NV` | `REJECTED FOR PROTECTED WHOLESALE` |
| Managed Android endpoint | `OS/NV` under device-owner/profile-owner policy | `OS/BE/NV` under the same declared policy boundary | Policy-specific `OS/BE/NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | `CONDITIONAL CANDIDATE` — enterprise only |
| Managed Apple endpoint | `OS/NV` only on exact platforms/versions governed by the enrolled restrictions payload | `OS/NV` in that enrolled boundary | Policy-specific `OS/NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | `CONDITIONAL CANDIDATE` — enterprise only |
| Managed Windows endpoint | `OS/BE/NV` under exact supported Experience CSP policies | `OS/BE/NV`; recorder-specific policies have narrower version/tool scope | Policy-specific `OS/BE/NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | Policy + app `NV` | `CONDITIONAL CANDIDATE` — enterprise only |

Android's official guidance says `FLAG_SECURE` was only about 70% reliable on Android 11 and lower. Those versions are rejected; Android 12+ is only a provisional candidate floor, not a claim of perfect coverage. Windows `WDA_EXCLUDEFROMCAPTURE` covers a specific set of public OS capture features and Microsoft expressly says it is not DRM or a strict guarantee. Both native candidates require an exact version/device/framework/capture-tool acceptance matrix before approval.

### 5.2 Capture-property decomposition

| Client class | Screenshot | Screen recording | Display mirroring | Non-secure display | Capture detection | Capture redaction / exclusion |
|---|---|---|---|---|---|---|
| Each assessed desktop/mobile browser and PWA | Target veto `NOT ENFORCEABLE` | Target veto `NOT ENFORCEABLE`; `getDisplayMedia()` governs capture requested by the calling page | Target veto `NOT ENFORCEABLE` | Target veto `NOT ENFORCEABLE` | No general target-capture signal verified | Page-only lifecycle tricks `BEST-EFFORT`, insufficient |
| Native Android candidate | `FLAG_SECURE` `OS-ENFORCED/NV` on supported boundary | Secure pixels excluded on supported non-secure virtual-display paths `OS-ENFORCED/BEST-EFFORT/NV`; every recording path still requires testing | Secure-display behavior is output-specific `OS-ENFORCED/BEST-EFFORT/NV` | `FLAG_SECURE` exclusion `OS-ENFORCED/NV` | Android 14 screenshot callback and Android 15 recording callback are `APPLICATION-ENFORCED` signals, not substitutes for exclusion | Whole protected window/surface exclusion `OS-ENFORCED/NV`; every activity/dialog/surface/task preview must be tested |
| Native iOS/iPadOS | Screenshot block `NOT ENFORCEABLE`; notification is after capture | Active scene capture can be detected but no qualifying general block was verified | Recording/mirroring/AirPlay can produce capture state; response is `APPLICATION-ENFORCED/BEST-EFFORT` | No qualifying general arbitrary-UI exclusion verified | Screenshot post-event + active scene-capture signals `APPLICATION-ENFORCED` | General UI redaction `APPLICATION-ENFORCED/BEST-EFFORT`; narrow protected video is not whole-app protection |
| Native Windows candidate | Top-level window exclusion `OS-ENFORCED/BEST-EFFORT/NV` for named public paths | Same declared public-path scope | Framework/tool dependent `OS-ENFORCED/BEST-EFFORT/NV` | Display-only/protected rendering is framework/hardware-specific `BEST-EFFORT/NV` | No detector is treated as a complete substitute for exclusion | Window omission/exclusion `OS-ENFORCED/BEST-EFFORT/NV`; child/dialog/embedded-process/framework paths require tests |
| Native macOS | No qualifying supported arbitrary-UI veto verified | No qualifying supported target veto verified | No qualifying supported target veto verified | No qualifying supported target veto verified | No complete target-capture signal established for this gate | Capturing app controls its own ScreenCaptureKit selection; no qualifying current public target-app veto was verified |
| Managed Android endpoint | Exact enrolled policy `OS-ENFORCED/NV` | Exact enrolled policy `OS-ENFORCED/BEST-EFFORT/NV` | Policy/output-specific `BEST-EFFORT/NV` | Enrolled policy `OS-ENFORCED/NV` | Management/compliance state `APPLICATION-ENFORCED/NV` | Device-wide enrolled policy; not an unmanaged per-app capability |
| Managed Apple endpoint | Exact enrolled restriction `OS-ENFORCED/NV` on listed supported platforms | Exact enrolled restriction `OS-ENFORCED/NV` | Enrolled restriction `OS-ENFORCED/NV` where the payload applies | Enrolled restriction `OS-ENFORCED/NV` where the payload applies | Management/compliance state `APPLICATION-ENFORCED/NV` | Device-wide enrolled policy; not an unmanaged per-app capability |
| Managed Windows endpoint | Experience CSP `OS-ENFORCED/BEST-EFFORT/NV` in exact supported editions/versions | `OS-ENFORCED/BEST-EFFORT/NV`; Snipping Tool recorder policy is tool- and version-scoped | Policy/tool-specific `BEST-EFFORT/NV` | Policy/tool-specific `BEST-EFFORT/NV` | Management/compliance state `APPLICATION-ENFORCED/NV` | Device-wide policy requires exact OS, edition, tool, and bypass tests |

### 5.3 Media, trust, delivery, and operational characteristics

| Client | Private media authorization | Private media expiry | E2EE compatibility | Trusted-device compatibility | Device-key protection | Onion compatibility | Accessibility impact | Update-integrity risk | Residual bypass | Overall status |
|---|---|---|---|---|---|---|---|---|---|---|
| Desktop browsers | Not eligible; protected requests denied before payload | Not applicable; no protected reveal | `CONDITIONAL` research feasibility only | `CONDITIONAL` research only | Browser storage is insufficient | Public/nonprotected Onion potential only | Strong public-web baseline | Active web-code substitution | Public/onboarding responses remain inspectable; protected payload must be absent | `REJECTED FOR PROTECTED WHOLESALE` |
| Mobile browsers | Not eligible; protected requests denied before payload | Not applicable; no protected reveal | `CONDITIONAL` research feasibility only | `CONDITIONAL` research only | Browser storage is insufficient | Public/nonprotected browser platform dependent | Strong public-web baseline | Active web-code substitution | Public/onboarding responses remain inspectable; protected payload must be absent | `REJECTED FOR PROTECTED WHOLESALE` |
| Desktop/mobile PWA | Not eligible; protected requests denied before payload | Not applicable; no protected reveal or private offline cache | `CONDITIONAL` research feasibility only | `CONDITIONAL` research only | Web storage is insufficient | Public/nonprotected only | Good public-web baseline if equivalent | Web delivery + stale service worker | Cache/inspection of nonprotected shell; protected payload must be absent | `REJECTED FOR PROTECTED WHOLESALE` |
| Native Android | Server + signed app `NV` | Server + app `NV`; no recall of rendered copy | `CONDITIONAL`; implementation unselected | `CONDITIONAL/NV` | Keystore/StrongBox where verified | Separate audited transport required | Platform work required | Signed release/pipeline compromise | Root, instrumentation, unsupported capture, camera | `CONDITIONAL CANDIDATE` |
| Native iOS/iPadOS | Server + signed app `NV` | Server + app `NV`; no recall | `CONDITIONAL`; implementation unselected | `CONDITIONAL/NV` | Keychain/Secure Enclave where suitable | Separate audited transport required | Platform work required | Signed release/pipeline compromise | Ordinary screenshot, jailbreak, camera | `REJECTED FOR PROTECTED WHOLESALE` |
| Native Windows | Server + signed app `NV` | Server + app `NV`; no recall | `CONDITIONAL`; implementation unselected | `CONDITIONAL/NV` | TPM/CNG where verified | Separate audited transport required | Platform work required | Signing/release-pipeline compromise | Unsupported/privileged capture, camera | `CONDITIONAL CANDIDATE` |
| Native macOS | Server + signed app `NV` | Server + app `NV`; no recall | `CONDITIONAL`; implementation unselected | `CONDITIONAL/NV` | Keychain/Secure Enclave where suitable | Separate audited transport required | Platform work required | Signing/notarization pipeline compromise | OS capture, privileged tools, camera | `REJECTED FOR PROTECTED WHOLESALE` |
| Managed Android endpoint | Server + app + policy `NV` | Server + app + policy `NV` | Native-client profile required; no cloud-decrypting intermediary | DevicePolicy + integrity `NV` | Keystore/StrongBox where verified | Separate audited transport required | High enrollment/support burden | OEM, policy, release, and compliance drift | Policy removal, admin/root compromise, camera | `CONDITIONAL CANDIDATE` — enterprise only |
| Managed Apple endpoint | Server + app + policy `NV` | Server + app + policy `NV` | Native-client profile required; no cloud-decrypting intermediary | MDM + app integrity `NV` | Keychain/Secure Enclave where suitable | Separate audited transport required | High enrollment/support burden | MDM, platform, release, and compliance drift | Policy removal, admin/jailbreak compromise, camera | `CONDITIONAL CANDIDATE` — enterprise only |
| Managed Windows endpoint | Server + app + policy `NV` | Server + app + policy `NV` | Native-client profile required; no cloud-decrypting intermediary | MDM/health attestation `NV` | TPM/CNG where verified | Separate audited transport required | High enrollment/support burden | CSP, edition, tool, release, and compliance drift | Policy gaps/removal, admin/endpoint compromise, camera | `CONDITIONAL CANDIDATE` — enterprise only |

## 6. Required feasibility results

| Required result | Classification |
|---|---|
| Telegram-grade protected content on ordinary desktop browser | `FAIL` — `REJECTED FOR PROTECTED WHOLESALE` |
| Telegram-grade protected content on mobile browser | `FAIL` — `REJECTED FOR PROTECTED WHOLESALE` |
| Telegram-grade protected content on desktop or mobile PWA | `FAIL` — `REJECTED FOR PROTECTED WHOLESALE` |
| Telegram-grade protected content on native Android | `CONDITIONAL CANDIDATE / NOT YET VERIFIED`; provisionally Android 12+ with secure-window enforcement and integrity gating |
| Telegram-grade protected content on native iOS/iPadOS | `FAIL` for the hard gate because arbitrary UI screenshots cannot be blocked through a verified supported API |
| Telegram-grade protected content on native Windows | `CONDITIONAL CANDIDATE / BEST-EFFORT / NOT YET VERIFIED` for supported public capture paths |
| Telegram-grade protected content on native macOS | `FAIL` for arbitrary UI under current public APIs |
| Screenshot blocking | Android supported path `OS-ENFORCED/NV`; Windows supported public paths `OS/BE/NV`; iOS/macOS/browser/PWA `NOT ENFORCEABLE`; managed Android `OS/NV`, managed Apple `OS/NV` only in exact payload-supported boundary, and managed Windows `OS/BE/NV` in exact CSP/edition/version boundary |
| Screen-recording blocking or protected-pixel exclusion | Android supported non-secure virtual-display paths `OS-ENFORCED/BEST-EFFORT/NV`; Windows supported public paths `OS-ENFORCED/BEST-EFFORT/NV`; iOS active detection/redaction `BEST-EFFORT` but insufficient because screenshot block fails; no qualifying browser/PWA/macOS target veto was verified |
| Copy restriction | Native signed client `APPLICATION-ENFORCED/NV` for ordinary UI paths; browser/PWA `BEST-EFFORT` only |
| Forwarding restriction | Server + native client `APPLICATION-ENFORCED/NV`; protected messages must return a deny outcome rather than create a transferable object |
| Save/download restriction | Native signed client + object service `APPLICATION-ENFORCED/NV`; never called “non-downloadable” because an authorized endpoint receives renderable data |
| Print restriction | Native signed client `APPLICATION-ENFORCED/NV`; browser/PWA `BEST-EFFORT` only |
| Second-camera prevention | `FAIL / NOT POSSIBLE` on every client |
| Personalized watermarking | `PASS` as a feasible `DETERRENCE` and limited `ATTRIBUTION` control; implementation not verified |
| Forensic watermarking | `BLOCKED`; attribution only after independent robustness, privacy, false-positive, and appeal evidence |
| Private 4K media access control | `CONDITIONAL / NOT YET VERIFIED` using restricted server-authorized delivery and approved-client enforcement |
| Fail-closed unsupported client | `PASS` as an architectural requirement; implementation not verified |

## 7. Content-control classifications

| Control | Enforcement | Deterrence | Bypass that must be tested | Residual risk after passing |
|---|---|---|---|---|
| Text selection | Restrict only on protected fields through signed-client view semantics; retain least-privilege accessible reading | Handling notice and visible session mark | Accessibility/automation, instrumentation, modified client | Manual transcription, compromised endpoint |
| Text copy/cut | `APPLICATION-ENFORCED/NV`: no edit action, copy command, or protected clipboard representation | Copy attempt can show neutral policy feedback | OS accessibility/automation, hooks, endpoint memory | Manual transcription, compromised endpoint |
| Context-menu copy/save | `APPLICATION-ENFORCED/NV`: no context action or transferable protected object | Attempt may be audited in privacy-bounded form | Long press/right click through injected or modified UI | Instrumentation, camera |
| Keyboard shortcuts | `APPLICATION-ENFORCED/NV`: signed client consumes/denies copy, save, print, and export commands on protected surfaces | Neutral blocked-action feedback | Global automation, remapping, privileged tools | Manual recreation, camera |
| Clipboard | `APPLICATION-ENFORCED/NV`: protected content never enters general clipboard; managed policy may add separation | Paste/copy attempts may receive policy notice | Accessibility services, instrumentation, process compromise | Transcription, privileged extraction |
| Share sheet | `APPLICATION-ENFORCED/NV`: no activity/share intent, transferable item, or deep-link payload | Handling notice | Modified app, automation, screenshot/camera | Human re-entry or re-photography |
| Forwarding | Server `APPLICATION-ENFORCED/NV`: no forward capability and protected message/object request returns deny | Audit/revoke under governed abuse policy | Modified client retypes or re-uploads content | Manual reproduction, camera |
| Open image/original | Server + client `APPLICATION-ENFORCED/NV`: protected renderer only, no external viewer, master, or open-original route | Watermarked controlled derivative | Proxy, instrumentation, endpoint memory | Authorized renderer still receives pixels |
| Save media | `APPLICATION-ENFORCED/NV`: no Photos/gallery/filesystem/export path | Visible individualized mark | Hooks, compromised process, privileged storage access | Camera, unsupported extraction |
| Download | Server + client `APPLICATION-ENFORCED/NV`: no download route; only authorized derivative/segment responses | Rate/scrape monitoring and watermark | Proxy, instrumentation, segment collection | Compromised endpoint can reconstruct |
| Print | `APPLICATION-ENFORCED/NV`: no print-capable view/command; managed policy denies printer redirection where applicable | Neutral policy feedback and mark | Virtual printer, automation, privileged process | Camera/manual transcription |
| Drag/drop | `APPLICATION-ENFORCED/NV`: no draggable item or drag provider | None required beyond handling notice | Accessibility/automation, injected UI | Manual recreation |
| Export | `APPLICATION-ENFORCED/NV`: no file/report/export object or external-app contract | Policy feedback | Modified client, process instrumentation | Human recreation |
| Browser HTTP cache | Browser delivery is rejected; public/onboarding responses contain no protected data | `no-store` is hygiene, not gate evidence | Compromised/noncompliant cache | No protected payload should exist to recover |
| Service-worker cache | Browser/PWA delivery is rejected; no protected response enters Cache Storage | None; installability is not a trust signal | Malicious web code or stale worker | No protected payload should exist to cache |
| Native offline cache | `APPLICATION-ENFORCED/NV`: no offline catalog, manifest, playlist, key, attachment plaintext, or notification preview | Short authorization reduces value of retained tokens | OS/app remnants, crash memory, compromised endpoint | Already rendered data cannot be recalled |
| Durable asset URL | Server `APPLICATION-ENFORCED/NV`: opaque short resource/session/purpose grant; no bearer secret in navigation URL | Short validity and trace mark | Token leakage/replay before expiry | Authorized sharing during the short window |
| Direct asset retrieval | Server `APPLICATION-ENFORCED/NV`: authorize every rendition/range/segment/key; client certificate/endpoint binding where selected | Rate/anomaly review | Proxy, instrumentation, stolen live session | Authorized endpoint can receive renderable bytes |
| Playlist/segment extraction | Server `APPLICATION-ENFORCED/NV`: per-playback lease and authorization on every playlist, segment, range, and key | Burned visible mark; optional validated forensic mark | Instrumented player, memory/key extraction | Reconstructed/recorded media on compromised endpoint |
| Browser developer tools | Browser/PWA is rejected; no protected wholesale response is issued | None | User can inspect any public/onboarding response | No protected payload should be present |
| Native debugging/instrumentation | Signed release disables debug surfaces; integrity admission and server policy deny known unsupported environments | Audit/revoke and handling notice | Root/jailbreak, hooks, privileged debugger, modified OS | Unknown compromise remains possible |
| Accessibility APIs | Least-privilege semantic/caption/transcript path inside the same approved protected client; no blanket disable | Watermark/handling notice remains perceptible without blocking use | Malicious or compromised accessibility/automation service | Accessible plaintext can be remembered/transcribed |
| Endpoint memory | Minimize lifetime, clear controlled buffers/state, prevent logs/crash reports/backups, use protected key facilities | Short exposure and audit | Process compromise, memory dump, OS compromise | Plaintext must exist to render; perfect prevention impossible |
| Bulk enumeration | Server `APPLICATION-ENFORCED/NV`: object/field authorization, high-entropy identifiers, bounded pagination/rate, no full private payload filtered client-side | Scrape monitoring, watermark, governed revoke/appeal | Distributed credential automation, slow scraping | Authorized manual collection/camera |
| Unauthorized API retrieval | Server `APPLICATION-ENFORCED/NV`: current client/build/endpoint/account/room/resource/purpose/freshness checks on every request | Audit and anomaly review | Credential/session theft, compromised approved endpoint | Authorized endpoint abuse |
| Screenshot | Named OS secure-window/display-affinity or enrolled policy, verified before reveal | Visible individualized mark remains secondary | Unsupported versions/tools, root/jailbreak, privileged capture | External camera |
| Screen recording | Named OS protected-pixel exclusion, verified against the supported tool/path matrix | Visible/forensic mark remains secondary | Driver/VM/remote-control path, modified OS | External camera |
| Display mirroring | Named OS non-secure-output exclusion or fail-closed capture-state response | Handling notice | Secure external display, unsupported casting/remote path | External camera at allowed display |
| Non-secure display | Named OS secure-surface/output rule; deny reveal when the output state is not allowed or unknown | None substitutes for enforcement | Modified OS/driver, untested display path | External camera |

No ordinary application restriction is described as perfect endpoint control. The release gate requires the strongest supported enforcement paths, explicit bypass testing, and denial when the asserted boundary cannot be verified.

## 8. Protected content classes

| Content | Cryptographic/content class | Protected-client consequence |
|---|---|---|
| Private messages and approved negotiation attachments | Candidate D4 endpoint E2EE; no implementation selected | Decrypt only at individually authorized protected endpoints; no browser fallback; account recovery does not imply history recovery |
| Private inventory, unit pricing, availability, strain profiles, photos, and video | D3 restricted, server-authorized, server/media-pipeline decryptable | Serve only to approved protected clients through object-specific, short authorization; server/provider exposure must be disclosed and governed |
| Private order manifest | D3 restricted projection of canonical commerce truth | Five-minute full reveal only on approved protected client; canonical records persist |
| Proprietary operational information | D3 restricted by default; D4 only when it is genuinely conversation-specific and the selected E2EE profile supports it; never inferred to be public | Minimize to the customer's decision/role, serve only through approved protected client and exact authorization, and deliberately declassify before any canonical/public use |
| Canonical product, price, inventory, eligibility, order, payment, fulfillment, BSDN, consent, and audit records | Governing domain truth, not disappearing room content | Existing owners, provenance, correction, retention, and policy remain authoritative |
| Deliberately approved public facts | D0/D1 only after explicit declassification and revalidation | May be shown in public retail; wholesale presence alone never authorizes publication |

The hybrid media/E2EE decision remains intact. Protected-client eligibility changes where protected plaintext may be shown; it does not make catalog media E2EE or turn conversations into commerce truth.

## 9. Protected media requirements

Private photos, video, playlists, segments, keys, captions, transcripts, and accessible alternatives require:

- a private authenticated origin and authorization on every object, field, rendition, range, playlist, segment, and key request;
- opaque, short, purpose/resource/session-bound grants with no durable public asset URL or predictable object identifier;
- no original master by default, controlled derivatives, explicit high-resolution/4K reveal, adaptive segmented streaming, and bandwidth-aware alternatives;
- no service-worker/offline cache, public CDN enumeration, autoplay, plaintext notification preview, or unrestricted range/segment reuse;
- expiry and revocation enforced on every subsequent request, including range, segment, and key requests;
- server/edge-burned individualized visible marks that preserve product inspection, captions, and accessibility;
- provider/CDN access, cache, retention, breach, exit, and deletion boundaries reviewed and disclosed;
- Onion resource isolation and performance tested separately; a native client is not Onion-compatible without a separately audited transport; and
- scrape/rate response that never treats an anomaly score as automatic guilt.

Protected video DRM/output protection may strengthen the video path on particular platforms. It does not protect price tables, still images, messages, manifests, or general UI and therefore cannot make an otherwise rejected client pass.

## 10. Device trust and client attestation

Client eligibility is a server-verified state, not a URL parameter, JavaScript boolean, user-agent string, or self-asserted device flag.

Required feasibility chain:

1. a release is signed by the approved publisher identity and meets the minimum nonrevoked version;
2. the endpoint generates a device-bound identity and stores suitable long-term/wrapping keys in the strongest verified platform key facility available;
3. a fresh server nonce binds integrity/attestation evidence to the protected access request, account, endpoint, client build, and requested purpose;
4. the server verifies the attestation/integrity response and applies the exact supported OS/device/policy matrix;
5. an existing trusted endpoint or approved recovery ceremony authorizes the new endpoint; login alone is insufficient;
6. the server verifies current room grant, endpoint status, resource grant, and capture-control readiness immediately before reveal; and
7. failure, timeout, stale evidence, unsupported version, root/jailbreak/modified environment signal, capture-risk signal, revoked endpoint, or policy removal denies protected content and offers a safe remediation route.

| Signal | What it can establish | What it does not establish | Privacy/operational cost |
|---|---|---|---|
| App signing and package integrity | Publisher/build identity and tamper evidence within the platform path | That a correctly signed release is benign; capture state; secure release authority | Signing-key custody, dual control, emergency update/revocation, store/vendor dependency |
| Android Play Integrity/app recognition | Recognized app, licensed install, and tiered device/integrity/access-risk verdicts when available | A perfect unrooted state, absence of every hook/recorder, human identity, or future safety | Google service dependency, device exclusion, false/unknown verdicts, data/battery/latency, remediation support |
| Android Keystore/StrongBox and key attestation | A key can be hardware-backed with verified properties on supported devices | That plaintext/UI/app memory cannot be read; support on every device | Algorithm/device variance, revocation lists, migration and loss handling |
| Apple App Attest | Requests can be bound to a legitimate app instance and hardware-backed key where supported | Screenshot blocking, absence of jailbreak/compromise, or universal device support | Apple service dependency, compatibility fallback, key/reinstall lifecycle, privacy and support |
| Apple Keychain/Secure Enclave | Protected/nonexportable suitable keys on supported hardware | Protection of every algorithm, ratchet state, plaintext, or screen | Hardware/algorithm constraints, migration/recovery complexity |
| Windows signing/MSIX/TPM/health attestation | Package publisher/integrity and device/key/boot posture within configured paths | DRM-level capture prevention, absence of privileged compromise, or benign signed code | Windows/version/management dependency, policy and certificate operations |
| MDM compliance | Current enrollment and declared device-wide policy state | Per-app perfection, survival after policy removal, or external-camera prevention | High customer friction, administrator trust, intrusive policy, support and privacy burden |

**Spoofing and replay limits:** every attestation/integrity response must be server-validated, bound to a fresh nonce or request hash plus account/endpoint/build/purpose, rejected on replay, and combined with authorization and risk state. A valid response can still be proxied from a legitimate device or issued by a compromised but passing runtime; no verdict is a substitute for product capture tests.

**Root and jailbreak limits:** negative or missing Android integrity signals can identify many rooted, hooked, emulated, unlocked, or uncertified environments but not every compromise. Apple explicitly does not make App Attest a perfect compromised-OS detector. Unknown, unevaluated, stale, unsupported, or policy-failing states deny protected content; customer remediation and appeal remain necessary.

**Privacy cost:** collect only the minimum app/build/device-policy verdict and pseudonymous endpoint reference needed for admission, disclose purpose, prevent advertising/fingerprinting use, restrict access, bound retention, and support correction/appeal. Blowin' Smoke's account-to-endpoint mapping remains identifiable operational data even when a platform attestation omits a hardware identifier.

**Operational cost:** the design adds store/platform dependencies, signing-key custody, dual-control releases, attestation service/quota/outage handling, OEM/device regression testing, minimum-version enforcement, certificate/attestation root updates, endpoint replacement, revocation, customer remediation, and accessibility/support obligations.

Attestation is a risk and admission signal, not a perfect “secure device detected” claim. It becomes mandatory for a candidate only if the proof gate shows it is necessary to keep unsupported/modified clients from receiving protected content. The final policy must minimize retained device data, disclose purpose, bound retention, support correction/appeal, and never repurpose integrity telemetry for marketing.

## 11. Fail-closed customer experience

An unsupported client may receive only a generic access-requirement surface. It must not receive wholesale navigation, prices, inventory, counts, protected media, messages, negotiation history, manifests, private object identifiers, preload data, metadata-rich errors, or alternative text that leaks protected facts.

Recommended state:

```text
PRIVATE WHOLESALE

Protected client required.

This browser or device cannot enforce the security requirements for this private room.

[ USE APPROVED CLIENT ]
```

The transition to an approved client uses a short, single-purpose handoff or sign-in—not a protected payload or durable bearer URL. The approved client repeats account, endpoint, room, resource, integrity, version, revocation, and capture-control checks. Unknown and service-error states fail closed. Remediation copy explains whether the customer needs an update, supported device, integrity remediation, trusted-device approval, or staff help without exposing the private catalog.

## 12. Accessibility requirements

Protected Content Mode must support keyboard and switch access, visible focus, screen readers, text enlargement/reflow, high contrast, reduced motion, captions, transcripts, audio control, low-bandwidth alternatives, and equivalent protected product information. Anti-copy gestures, moving watermarks, canvas-only text, hostile overlays, disabled zoom, timing tricks, and blanket accessibility-API denial are prohibited.

Least privilege means accessible alternatives:

- carry the same content class and object authorization as the visual asset;
- are delivered only to the same approved protected endpoint;
- reveal no additional private data;
- expire and revoke with the same resource/manifest rules;
- remain operable without clipboard, print, or export authority; and
- are tested with representative assistive technologies inside the declared supported-client boundary.

If a platform accessibility path necessarily exports protected plaintext beyond the approved client boundary, that path remains `BLOCKED` pending a qualified accessibility/security decision; the product must offer an equivalent protected or staff-assisted route rather than silently weaken either access or security.

## 13. Five-minute manifest and minimal reference compromise

The correction source confirms the complete governing formulas:

```text
FIRST_VIEW_AT = immutable server acceptance time of first authorized explicit reveal
EXPIRES_VIEW_AT = FIRST_VIEW_AT + 5 minutes
DISPUTE_BEGIN_BY = FIRST_VIEW_AT + 30 minutes
```

The clocks are independent and server-authoritative. Client time is irrelevant. Refresh, another tab/device, reconnect, replay, or clock change never resets either deadline. At `EXPIRES_VIEW_AT`, the server denies every future full-manifest, protected image/video, playlist, segment, key, range, and accessible-alternative request; the active approved client removes the full view and clears controlled transient state. Offline or captured pixels cannot be recalled. Canonical records remain.

Until `DISPUTE_BEGIN_BY`, the approved client may show only a minimal protected reference surface sufficient to identify the matter and start a dispute:

- manifest/version reference and protected line reference;
- concise line identity and quantity only to the minimum needed to select the disputed line;
- expiry/dispute deadline and current dispute-receipt state;
- structured dispute reasons and an idempotent `Begin dispute` action; and
- accessible support/contact route.

The minimal reference must not restore full photos, video, proofs, private unit prices, private totals, broader inventory, negotiation history, or the full manifest. A dispute about a hidden price/total can be preserved by selecting the line and reason; qualified staff can review canonical records inside an authorized support process. At `DISPUTE_BEGIN_BY`, even the minimal surface expires except for a nonsensitive receipt/status route governed by the dispute and records policy.

The fixed five-minute window remains `BLOCKED` for release pending accessibility/essential-timing and transmission-failure/reissue decisions. Any accommodation is explicit, server-authoritative, auditable, and does not silently reset or extend the original clocks.

## 14. Customer-facing claims

The following are not authorized now. They become `SAFE IF VERIFIED` only when bound to an exact approved client build, supported platform/version/device state, named protected surface, named OS/app enforcement, passing capture/extraction tests, continuous evidence, and visible limits:

| Candidate claim | Required qualification |
|---|---|
| “Protected Wholesale content is excluded from screenshots and screen recordings on this supported approved client.” | Name the exact platform/build/control and protected surface. State that unsupported/modified devices, privileged compromise, already rendered content, and external cameras are outside the claim. |
| “Protected Wholesale content cannot normally be copied, forwarded, saved, downloaded, printed, or exported through this approved client.” | Limit the claim to ordinary supported client commands and verified service paths; do not claim control over instrumentation, endpoint memory, transcription, or a camera. |
| “Private Wholesale uses protected-content controls in addition to end-to-end encrypted messaging.” | E2EE is limited to designated messages/approved attachments after candidate selection and independent verification; restricted catalog/media remains server-decryptable. |
| “Wholesale room access is restricted to approved accounts and approved protected clients.” | Every object request, client integrity state, endpoint, grant, version, and revocation path passes tests and fails closed. |

Still prohibited: “No one can ever copy our content,” “our private inventory can never leak,” “screenshots are impossible on every device,” “screen recording is impossible on every device,” “external cameras are impossible,” “watermarks prove who leaked content,” “Tor makes your order anonymous,” “messages are deleted everywhere,” or “even the owner can never read any conversation under any conceivable circumstance.”

## 15. Evidence required before a client can be approved

At minimum, the next gate must produce:

1. a selected signed client architecture, exact supported OS/device/version/framework matrix, distribution/update/revocation policy, and protected surface inventory;
2. lab evidence for OS screenshot, keyboard screenshot, Snipping Tool/system recorder, common screen-sharing/remote-control paths, mirroring/casting, non-secure displays, multi-monitor, background/app-switcher, overlays, accessibility tools, and failure/revocation transitions;
3. adversarial evidence for root/jailbreak, instrumentation, hooking, emulator/VM, modified OS, app tamper, replayed attestation, proxy/segment extraction, debug/developer tools, endpoint memory, and stale client/policy states;
4. independent application-security, cryptographic-integration, privacy, accessibility, and claims review;
5. selected E2EE profile and supported implementation with device lifecycle, history-recovery, attachment, migration, vulnerability-response, and plaintext-exclusion proof;
6. object authorization, private media origin/CDN/provider, grants, ranges/segments/keys, expiry/revocation, anti-enumeration, cache, watermark, and 4K performance evidence;
7. exact fail-closed compatibility negotiation that cannot be bypassed by a user-controlled value;
8. manifest +5-minute denial, +30-minute minimal-reference/dispute receipt, accessibility, transmission failure, and reissue tests; and
9. incident response, evidence retention, false-positive review, appeal, customer support, device replacement, and policy-drift operations.

Passing platform documentation is not passing product evidence. Until these gates close, native candidates remain conditional and protected wholesale remains blocked from release.

## 16. Live evidence register

All sources were accessed on **2026-08-14**. Primary specifications and first-party platform documentation are controlling; Telegram issue reports are identified as product-variation evidence rather than authoritative OS capability proof.

| Source | URL | Access date | Establishes | Does not establish |
|---|---|---|---|---|
| Telegram Content protection | https://core.telegram.org/api/content-protection | 2026-08-14 | Telegram's protected-message/client contract disables forwarding, downloads, copying, and screenshots and returns `CHAT_FORWARDS_RESTRICTED` for forwarding | Uniform enforcement by every Telegram client, OS, or third-party client; a Blowin' Smoke implementation |
| Telegram Protected Content announcement | https://telegram.org/blog/protected-content-delete-by-date-and-more | 2026-08-14 | Telegram's product behavior restricts forwarding, describes screenshot prevention, and limits media saving in protected groups/channels | Platform-universal or bypass-proof enforcement |
| Telegram official issue response: Desktop & Web | https://bugs.telegram.org/c/63404/3 | 2026-08-14 | Telegram states desktop/web screenshots are currently intended while text copy, forwarding, and local media save are the protected feature's focus there | That browsers can block screenshots or that every Telegram client behaves alike |
| Telegram official issue tracker: iOS protected bot content | https://bugs.telegram.org/c/42017 | 2026-08-14 | Current user reports on Telegram's official tracker show iOS/Android variation | An Apple API guarantee or a controlled independent test |
| Telegram FAQ screenshot alerts | https://telegram.org/faq | 2026-08-14 | Telegram states screenshot detection is not bulletproof and an external camera cannot be stopped | The exact behavior of a current Blowin' Smoke client |
| W3C Screen Capture Working Draft | https://www.w3.org/TR/screen-capture/ | 2026-08-14 | `getDisplayMedia()` governs capture requested by the calling document and a permission policy can deny that request | An exhaustive vendor-capability survey or a target-page veto over OS/browser/user screenshots or recordings |
| W3C Web App Manifest contributor proposal | https://github.com/w3c/manifest/issues/1154 | 2026-08-14 | Screenshot prevention was proposed for PWAs and the contributor issue was closed without a standard feature | Normative standard text, exhaustive vendor behavior, or deployable PWA secure-window authority |
| W3C Clear-Site-Data | https://www.w3.org/TR/clear-site-data/ | 2026-08-14 | Web storage/cache clearing mechanisms and documented disk/remnant limits | Guaranteed endpoint erasure or prevention of prior capture |
| Chrome DevTools Device Mode | https://developer.chrome.com/docs/devtools/device-mode | 2026-08-14 | Chrome DevTools provides viewport and full-page screenshot workflows | Every operating-system capture path or a target-page veto |
| Chrome DevTools Network panel | https://developer.chrome.com/docs/devtools/network/ | 2026-08-14 | Chrome exposes loaded requests, resources, headers, and responses to the authorized browser user | That a resource was never delivered or that every encrypted payload can be interpreted without keys |
| Firefox Screenshots | https://support.mozilla.org/en-US/kb/take-screenshots-firefox | 2026-08-14 | Firefox provides visible-area, selected-area, and full-page screenshot and save workflows | Every operating-system capture path or a target-page veto |
| Firefox Developer Tools | https://firefox-source-docs.mozilla.org/devtools-user/ | 2026-08-14 | Firefox supplies page, network, storage, PWA, and screenshot inspection tools to the browser user | That a resource was never delivered or a target-page capture veto |
| Safari Web Inspector | https://developer.apple.com/documentation/safari-developer-tools/web-inspector | 2026-08-14 | Safari Web Inspector exposes DOM, resources, network activity, storage, and caches to the browser user | Protection for plaintext/resources already delivered to the browser |
| Apple macOS screenshot and recording guide | https://support.apple.com/guide/mac-help/take-a-screenshot-mh26782/mac | 2026-08-14 | macOS provides operating-system screenshot and screen-recording workflows | That every target app can veto those workflows |
| Apple iPhone screenshot guide | https://support.apple.com/en-ca/guide/iphone/iphc872c0115/ios | 2026-08-14 | iPhone provides ordinary and supported full-page screenshot workflows | A webpage or arbitrary app UI pre-capture veto |
| W3C CSS UI `user-select` | https://www.w3.org/TR/css-ui-4/ | 2026-08-14 | CSS can influence ordinary text-selection behavior | A security boundary over DOM, accessibility, network, memory, screenshots, or transcription |
| W3C Clipboard API | https://www.w3.org/TR/clipboard-apis/ | 2026-08-14 | A web app can handle or cancel ordinary copy/cut events within defined browser behavior | Protection from inspection, alternate APIs, endpoint access, screenshots, or manual transcription |
| WHATWG drag and drop | https://html.spec.whatwg.org/multipage/dnd.html | 2026-08-14 | The web platform exposes drag-start and data-transfer behavior an app may influence | Prevention of other extraction or capture paths |
| Chrome print guide | https://support.google.com/chrome/answer/1069693 | 2026-08-14 | Chrome provides browser printing and save-to-PDF workflows where available | That every page prints identically or that print suppression creates a security boundary |
| Safari save webpage guide | https://support.apple.com/guide/safari/save-part-or-all-of-a-webpage-ibrw1089/mac | 2026-08-14 | Safari can save page text, images, web archives, or source through supported commands | Access to a resource that was never delivered or authority over other capture paths |
| Android secure sensitive activities / `FLAG_SECURE` | https://developer.android.com/security/fraud-prevention/activities | 2026-08-14 | Android can block screenshots, blank protected windows, and prevent display on non-secure outputs; official limitations include older-device reliability and incomplete coverage | Universal protection against overlays, modified/rooted devices, instrumentation, every recorder, or cameras |
| Android screenshot detection | https://developer.android.com/about/versions/14/features/screenshot-detection | 2026-08-14 | Android 14 provides a privacy-preserving screenshot callback and directs apps to `FLAG_SECURE` for screenshot exclusion | Prevention by detection alone or detection of every capture path |
| Android screen-recording callback | https://developer.android.com/reference/android/view/WindowManager#addScreenRecordingCallback(java.util.concurrent.Executor,java.util.function.Consumer) | 2026-08-14 | Android 15 can report whether an app's activities are visible in screen recording | Recording prevention or detection of every privileged/instrumented path |
| Play Integrity overview | https://developer.android.com/google/play/integrity/overview | 2026-08-14 | Play Integrity can contribute app/device/license risk signals to server admission | Perfect root/hook/capture detection, human identity, or permanent trust |
| Play Integrity verdicts | https://developer.android.com/google/play/integrity/verdicts | 2026-08-14 | Documented app recognition, licensing, device-integrity, patch, and access-risk verdicts can support tiered decisions | That every verdict is available on every device or proves protected-content enforcement |
| Android Keystore | https://developer.android.com/privacy-and-security/keystore | 2026-08-14 | Android can generate keys with hardware-backed/StrongBox properties on supported devices | Protection of UI pixels, plaintext in app memory, or support on every device |
| Android key attestation | https://developer.android.com/privacy-and-security/security-key-attestation | 2026-08-14 | A server can validate supported key properties and certificate chains | Device infallibility, screenshot prevention, or proof of a benign runtime |
| Android app signing | https://developer.android.com/studio/publish/app-signing | 2026-08-14 | Android packages and updates can be authenticated under platform signing rules | Benign signed code, uncompromised signing custody, or runtime capture protection |
| Android managed screen-capture policy | https://developer.android.com/reference/android/app/admin/DevicePolicyManager#setScreenCaptureDisabled(android.content.ComponentName,boolean) | 2026-08-14 | A device/profile owner can disable screen capture in its documented enrolled scope | An unmanaged/BYOD per-app solution, every privileged bypass, or camera prevention |
| Apple screenshot notification | https://developer.apple.com/documentation/uikit/uiapplication/userdidtakescreenshotnotification | 2026-08-14 | iOS/iPadOS informs an app after a screenshot | A pre-capture veto or undo of the saved screenshot |
| Apple sensitive content during screen sharing | https://developer.apple.com/documentation/swiftui/protecting-sensitive-content-when-screen-sharing | 2026-08-14 | Apps can detect active recording, mirroring, or remote control and redact sensitive fields | Blocking an ordinary still screenshot of arbitrary UIKit/SwiftUI UI |
| Apple FairPlay/capture state | https://developer.apple.com/documentation/uikit/uiscreen/iscaptured | 2026-08-14 | FairPlay video can be blacked out during system capture and apps can react to active capture | Protection for price text, photos, messages, manifests, or general UI |
| Apple App-Protected Content entitlement | https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.protected-content | 2026-08-14 | Vision Pro can replace screenshots/recordings with a protected image | Availability for iOS/iPadOS or macOS arbitrary UI |
| Apple App Attest | https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity | 2026-08-14 | A server can validate requests from a legitimate app instance using hardware-backed keys where supported | Screenshot blocking, a perfect jailbreak signal, or universal support |
| Apple Secure Enclave key protection | https://developer.apple.com/documentation/security/protecting-keys-with-the-secure-enclave | 2026-08-14 | Supported keys can be protected by Secure Enclave-backed controls | Protection of arbitrary plaintext, UI pixels, every algorithm, or recoverability |
| Apple code-signing security | https://support.apple.com/guide/security/sec7c917bf14/web | 2026-08-14 | Apple platform code-signing controls can authenticate approved executable code and updates in their supported boundary | Benign signed code, uncompromised signing custody, or screenshot prevention |
| Apple Device Management restrictions | https://developer.apple.com/documentation/devicemanagement/restrictions | 2026-08-14 | Enrolled policy can disable screenshots and screen recording on supported Apple platforms | A per-app unmanaged/BYOD solution or external-camera prevention |
| Microsoft `SetWindowDisplayAffinity` | https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity | 2026-08-14 | A Windows app can exclude its top-level window from a specified set of public OS capture features; `WDA_EXCLUDEFROMCAPTURE` is supported from Windows 10 2004 | DRM/security guarantee, every capture path, privileged compromise, or photography |
| Microsoft DXGI swap-chain flags | https://learn.microsoft.com/en-us/windows/win32/api/dxgi/ne-dxgi-dxgi_swap_chain_flag | 2026-08-14 | Display-only/protected swap-chain modes can restrict remote access/desktop duplication for compatible rendering paths | Whole-app protection without exact framework, driver, hardware, and DRM tests |
| Microsoft MSIX package signing | https://learn.microsoft.com/en-us/windows/msix/package/signing-package-overview | 2026-08-14 | Windows packages can carry publisher/integrity signatures under documented trust rules | Benign signed code, secure signing operations, or runtime capture prevention |
| Microsoft TPM security | https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/how-windows-uses-the-tpm | 2026-08-14 | Windows can use TPM-backed roots and key protection on supported devices | Protection of UI pixels, all plaintext, or absence of privileged compromise |
| Microsoft Health Attestation CSP | https://learn.microsoft.com/en-us/windows/client-management/mdm/healthattestation-csp | 2026-08-14 | Managed Windows can report documented boot and security posture for policy decisions | Screenshot prevention, perfect endpoint integrity, or support on every edition/device |
| Microsoft Experience Policy CSP | https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-experience | 2026-08-14 | Managed Windows exposes device-scoped screen-capture policy and a narrower version/tool-scoped screen-recorder policy | Universal coverage of every capture application, unmanaged/BYOD authority, or camera prevention |
| Apple `NSWindow.SharingType.none` | https://developer.apple.com/documentation/appkit/nswindow/sharingtype-swift.enum/none | 2026-08-14 | Apple identifies this as a legacy constant macOS no longer uses and says not to use it to hide capture | A current native macOS target-controlled capture veto |
| Microsoft Edge `DisableScreenshots` policy | https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies/DisableScreenshots | 2026-08-14 | Managed Edge can disable browser screenshot shortcuts and extension APIs | Blocking OS features or other applications from capturing the browser |

## 17. Resulting SEC-02 status

- **SEC-02 FEASIBILITY:** correction complete for current documentary evidence; proof and independent review still required.
- **PRIVATE WHOLESALE E2EE:** `CONDITIONAL`; preserved, implementation not selected.
- **PRIVATE WHOLESALE PROTECTED CONTENT:** hard release gate; `CONDITIONAL / NOT YET VERIFIED`; release blocked until an approved client passes.
- **BROWSER WHOLESALE CLIENT:** `REJECTED FOR PROTECTED WHOLESALE`; public retail remains browser-first.
- **PWA WHOLESALE CLIENT:** `REJECTED FOR PROTECTED WHOLESALE`.
- **NATIVE ANDROID WHOLESALE CLIENT:** `CONDITIONAL CANDIDATE`; no production approval.
- **NATIVE IOS/IPADOS WHOLESALE CLIENT:** `REJECTED FOR PROTECTED WHOLESALE` under current supported APIs.
- **NATIVE WINDOWS WHOLESALE CLIENT:** `CONDITIONAL CANDIDATE`; no production approval.
- **NATIVE MACOS WHOLESALE CLIENT:** `REJECTED FOR PROTECTED WHOLESALE` under current supported APIs.
- **MANAGED ENDPOINT:** `CONDITIONAL CANDIDATE` only as a separately approved enterprise model.
- **ONION:** `CONDITIONAL`; preserved, and no native client may claim compatibility without separately audited transport.
- **PRODUCTION IMPLEMENTATION:** `NOT AUTHORIZED`.
- **LAUNCH READINESS:** `NOT ESTABLISHED`.
