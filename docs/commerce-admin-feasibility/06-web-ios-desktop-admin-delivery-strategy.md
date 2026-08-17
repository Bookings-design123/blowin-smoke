# Web, iPhone, and Mac Admin Delivery Strategy

**Document role:** COM-ADM-02 feasibility decision for delivering one custom Blowin' Smoke Admin across Web, iPhone, and Mac/desktop  
**Evidence access date:** 2026-08-17  
**Owner requirements:** Web + iPhone + Mac/desktop; barcode/QR; iPhone and desktop media upload; approved devices only; custom workflows; one canonical commerce authority  
**Selected direction:** Responsive Web Admin + thin native SwiftUI iPhone companion + Safari Add-to-Dock Mac web app  
**Native Mac application:** Deferred  
**Production implementation authorized:** No

## 1. Decision

Blowin' Smoke should deliver one commerce-administration system through three deliberately unequal surfaces:

1. **Responsive Web Admin — primary and complete.** It owns the full accessible operator experience for catalog, variants/SKUs, pricing, inventory, receiving, purchase orders, suppliers, media/evidence management, POS readiness, accounting integration status, reorder signals, audit, security, and configuration.
2. **Native SwiftUI iPhone companion — focused and operational.** It is justified by live barcode/QR scanning, guided receiving/stocktake, camera/media capture, native upload handling, secure native session storage, and App Attest. It consumes the same API and cannot become a separate business system.
3. **Safari Add-to-Dock Mac web app — installed desktop experience.** It packages the responsive Web Admin as an installed Mac surface with a separate app-like window and notification support. Cloudflare Access/WARP and the canonical `AdminDevice` registry provide admission; installation itself is not a security property.

A native Mac, Electron, or Tauri application is deferred until an execution proof shows that an approved label printer, POS device, scanner, other peripheral, safe offline workflow, or platform-specific security requirement cannot be met through the installed Web Admin. A wrapper built only to look native would add release and security burden without changing the browser trust boundary.

This is one product with one API, one domain model, one inventory ledger, one price authority, one authorization service, and one audit model. It is not three applications with synchronized copies of commerce truth.

## 2. Architectural principle: one authority, fit-for-purpose clients

```text
RESPONSIVE WEB ADMIN --------+
                             |
SAFARI MAC WEB APP ----------+--> AUTH / DEVICE ADMISSION
                             |            |
NATIVE IPHONE COMPANION -----+            v
                                  CANONICAL ADMIN API
                                           |
               +---------------------------+-------------------------+
               | catalog | inventory | price | media | supplier | audit |
               +-----------------------------------------------------+
```

Every client sends canonical queries and commands. None writes a database directly, holds a parallel stock count, invents product relationships, commits a price locally, or treats an upload/provider callback as canonical success.

The API boundary is shared; presentation is not forced to be identical. The Web and Mac installed surface can share the same application code and component system. The native iPhone companion should use native SwiftUI/VisionKit/Authentication Services where that improves device workflows and security, while sharing generated API clients, schemas, command names, status vocabulary, and design tokens where practical.

## 3. Candidate delivery comparison

| Candidate | Capability | Security/device fit | Cost, lock-in, and burden | COM-ADM fit | Status |
|---|---|---|---|---|---|
| **Responsive Web Admin** | One adaptive application available on current desktop and mobile browsers; strongest surface for dense data, comparisons, keyboard work, audit, configuration, and full workflows | Auth0 + Cloudflare Access/WARP + canonical `AdminDevice`; browser still receives zero D3/D4 Private Wholesale protected payload | No separate app-store release; broad web skill/tooling; normal framework/hosting lock-in can be contained behind APIs and standards | Best primary surface for one owner and fewer than 100 launch products | **RECOMMENDED** — primary |
| **iPhone Home Screen web app/PWA** | Installable web icon, standalone display, service workers, push/badging on supported iOS/iPadOS | Useful web client but cannot present App Attest as a native app; synced passkey does not prove the iPhone is an approved endpoint | Lowest incremental build burden | Suitable for status, notifications, and full responsive fallback, but weaker for high-frequency scan/camera and endpoint assertion | **VIABLE ALTERNATIVE** — supporting fallback, not native-capability substitute |
| **Native SwiftUI iPhone companion** | VisionKit live barcode/QR/text scanning; camera/media workflow; native file/background facilities subject to implementation; Auth0 native SDK/web authentication; App Attest | Strongest available iPhone-specific admission signal when combined with manual `AdminDevice` activation; still not perfect integrity | Apple Developer Program `$99/year`; separate native release/QA is real, so scope must remain thin | Materially improves receiving, stocktake, lookup, label verification, media capture/upload, and selected approval actions without duplicating the domain | **RECOMMENDED** — focused client |
| **Safari Add-to-Dock Mac web app** | macOS Sonoma 14+ installed web app with separate window, Dock presence, notifications, and badging | Remains a web client; installation supplies no attestation. Use paid Cloudflare WARP/posture and application registry | Reuses Web Admin code; no separate Mac application release | Meets Mac/desktop access efficiently for launch | **RECOMMENDED** — Mac surface |
| **Native Mac application** | Could later support native peripheral SDKs, OS services, managed-device certificates, and specialized local workflows | App Attest is not supported on Mac. Managed Device Attestation/ACME may later supply managed hardware identity, but exact integration is unproven | Separate build, signing, distribution, update, QA, accessibility, and security burden; exact cost **PRICE NOT VERIFIED** | No launch workflow yet demonstrates that this cost is required | **VIABLE ALTERNATIVE** — deferred until concrete native need |
| **Electron/Tauri desktop wrapper** | Installs web UI and can bridge to native APIs/peripherals | A wrapper alone does not improve endpoint integrity or authorize protected payload; native bridges expand the attack surface | Adds runtime/update/signing/bridge operations and desktop-specific regression testing | Justified only by a verified peripheral/offline requirement, not appearance | **REJECTED** for launch |
| **Three independent full clients** | Maximum per-platform freedom | Triples security/release surfaces and creates semantic-drift risk | Highest build and operator burden | Conflicts with one canonical authority and one-owner launch profile | **REJECTED** |

## 4. Surface responsibility matrix

Legend: **P** primary; **S** supported; **F** focused/native advantage; **D** deliberately deferred from that client.

| Workflow | Responsive Web | Native iPhone | Mac Add-to-Dock | Governing note |
|---|---:|---:|---:|---|
| Dashboard, tasks, alerts | P | S | P | Values identify projection time/staleness; no dashboard is write authority |
| Product/variant/SKU authoring | P | S for quick correction/draft | P | Publication remains a separate canonical command |
| Dense comparison and bulk review | P | D | P | Mobile must not hide consequential diffs |
| Barcode/QR lookup | S via supported browser camera/scanner where proven | F | S via compatible attached/network scanner where proven | Scan resolves an identifier; it does not invent identity or compatibility |
| Guided receiving and discrepancy capture | P | F | P | Receipt commits canonical inventory only after exact review and authorization |
| Stocktake and location/bin scan | S | F | S | Offline count capture, if later permitted, is a draft until server reconciliation |
| Inventory correction/override | P | S with complete preview/step-up | P | Same capability, expected version, reason, and audit contract on every surface |
| Purchase orders/suppliers/cost history | P | S read/receive context | P | COGS and supplier truth remain canonical server records |
| Retail/wholesale price and offers | P | S review/approval where safe | P | No client-local money truth; protected-wholesale gate remains separate |
| Camera photo/video capture | S upload existing files | F | S upload existing files | Direct authenticated upload goes to quarantine; provider upload is not publication |
| 4K/resumable upload monitoring | P | F capture/initiate/status | P | Background behavior and interruption recovery require device execution proof |
| COA/PDF/evidence intake | P | F capture/import | P | Image/filename/text never establishes evidence applicability |
| Media ordering/rights/derivatives | P | S | P | Native client does not bypass rights, malware, metadata, or publication states |
| Label generation/print setup | P | S preview/scan verification | P | Final printer path requires hardware proof; native Mac is not preselected |
| POS operations | P candidate at fixed station | S candidate for scan/lookup | P candidate | Same order, price, reservation, and inventory authority; payment remains separate gate |
| Accounting/reorder configuration | P | S read/alerts | P | Deterministic server calculations first; no client-side financial authority |
| Audit, exports, role/device security | P | S for selected emergency actions | P | Full history and high-risk preview favor larger surfaces; step-up is server enforced |
| D3/D4 Private Wholesale protected render | D | D unless separately approved by SEC gate | D | COM-ADM-02 does not approve any protected client |

The iPhone client may eventually expose more routine commands, but “thin” means it does not duplicate domain logic. It does not mean an inaccessible or read-only token application. Its scope should follow proven mobile jobs and maintain equivalent previews, error states, authorization, and audit.

## 5. Shared application and API boundary

### 5.1 Must be shared

- canonical identifiers and entity/version contracts;
- command/query names and server validation;
- atomic capability vocabulary and authorization outcomes;
- `AdminDevice` and session-risk decisions;
- inventory ledger, reservations, allocations, and available-to-promise calculations;
- price, money, tax-provider-result, quote, and COGS representations;
- supplier, purchase-order, receipt, discrepancy, and supplier-price-history state machines;
- media upload sessions, quarantine, scan, derivative, rights, publication, and archive states;
- audit event, correlation, causation, idempotency, and error/status vocabulary;
- projection freshness and provider/service-error semantics;
- accessibility content semantics and plain-language consequential-action descriptions.

The server is the enforcement point. Generated clients may encode the contract, but generated code is not a substitute for server authorization.

### 5.2 May be shared where practical

- design tokens, color/spacing/type primitives, icons, and content strings;
- JSON/OpenAPI or equivalent schemas and generated TypeScript/Swift models;
- validation messages that do not expose sensitive existence or provider details;
- analytics event names and non-sensitive telemetry schemas;
- feature-availability declarations by client/build;
- synthetic fixtures and conformance test vectors.

### 5.3 Should remain platform-specific

- SwiftUI view composition and Apple accessibility APIs;
- VisionKit live scanning and camera permission flows;
- App Attest key and assertion lifecycle;
- secure native token/key references;
- Web keyboard, table, focus, URL, and responsive behavior;
- Mac/web printing and peripheral integration until a native requirement is proven;
- platform update, backgrounding, file-picker, and share behavior.

Forcing Web content into a native shell would forfeit the native iPhone benefits that justify the companion. Reimplementing server rules in Swift would create a dangerous second commerce system. The correct shared layer is the domain/API contract.

## 6. Authentication and approved-device behavior by surface

| Surface | Authentication | Device admission | Session storage/refresh | Mandatory denial cases |
|---|---|---|---|---|
| Web Admin | Auth0 authorization-code flow with current OIDC guidance and mandatory FIDO2/WebAuthn assurance | Cloudflare Access requires WARP/posture; API requires matching active `AdminDevice` | Server/BFF or other reviewed design should minimize browser token exposure; exact implementation remains an engineering proof gate | No WARP/posture, unknown/revoked/stale device, unsupported browser/client, stale actor/capability, provider uncertainty, audit failure |
| Mac Add-to-Dock | Same Web flow | Same Cloudflare and `AdminDevice` checks; Add-to-Dock installation is not evidence | Same Web architecture and expiry; no trust in local installation metadata | Same as Web; restoring web-app data or synced passkey never transfers approval |
| Native iPhone | Auth0 native authorization through system web authentication/official SDK | Active `AdminDevice` + verified App Attest key; fresh assertion on selected sensitive calls; Cloudflare may add network policy but is not the final authority | OS-protected credential storage through the reviewed SDK/keychain design; refresh remains revocable and short-lived according to risk | Unsupported/failed App Attest for sensitive Admin, new key after reinstall/restore, revoked/stale build/device/session, missing step-up, provider uncertainty |

All surfaces use the enrollment, revocation, recovery, and high-risk step-up contract in `03-auth-device-security-and-admin-access.md`. No client can reactivate itself or convert a successful identity login into device approval.

## 7. iPhone companion scope

### 7.1 Launch-candidate jobs

- scan product/SKU UPC/EAN or internal barcode/QR for lookup;
- scan lot/batch/location/receiving labels where the canonical schema defines them;
- create a receiving-session draft and capture observed quantity/discrepancy;
- conduct stocktake count drafts and submit them for version-aware server reconciliation;
- capture product/media/evidence photos and video;
- initiate authenticated upload sessions, display quarantine/processing status, and retry safely;
- review task/alert state and selected exact before/after command previews;
- approve a new device or perform another selected security action only after fresh hardware-key step-up and server policy;
- verify printed label content by rescanning.

### 7.2 Native justification

Apple VisionKit's `DataScannerViewController` provides live camera recognition for barcodes, text, highlighting, and guidance, with availability checks. App Attest adds a hardware-backed native app-instance signal. These are material advantages over relying solely on a PWA for fast store-floor workflows.

### 7.3 Explicit non-authority

The native app does not:

- own a local inventory database or decrement stock from a scan;
- infer SKU, lot, compatibility, size, cost, or included components from imagery or code format;
- publish media merely because upload completed;
- commit an offline inventory adjustment;
- store an unprotected durable original-media URL;
- bypass reason, step-up, version, approval, or audit requirements;
- receive D3/D4 Private Wholesale protected payload without a separate future SEC approval.

### 7.4 Camera and upload behavior

Camera/file access is requested only in context with a plain-language purpose. A captured file remains a local draft until the server issues a short-lived upload grant. Completion moves the asset into server-side quarantine/validation; it does not assign rights, product truth, evidence applicability, or publication.

Interruption, backgrounding, battery, network switching, large image, and representative 4K-video tests must prove resumability and safe retry before launch. The architecture must never report canonical success from a local callback or background task alone.

## 8. Responsive Web and Mac installed behavior

### 8.1 Web information architecture

The Web Admin is optimized for evidence-rich operational decisions:

- persistent task and exception navigation;
- keyboard-complete tables, filters, detail drawers/pages, and bulk previews;
- source, currentness, version, and projection-time visibility;
- exact before/proposed/after presentation for consequential commands;
- non-color-only state labels for unknown, unverified, stale, service error, conflict, and denied;
- draft preservation without silent canonical mutation;
- responsive layouts that remain usable on iPhone without pretending every dense workflow is optimal there.

### 8.2 Mac Add-to-Dock boundary

Apple documents Add to Dock for macOS Sonoma 14 or later, with a separate web-app window, Dock identity, notifications, and badging. It is the selected installed Mac experience because it reuses the primary application while offering app-like launch and window management.

It remains a Web client. The following are prohibited assumptions:

- installed means approved;
- Dock identity means signed native client;
- notification permission means device posture;
- a local web-app profile is durable device identity;
- Web content becomes eligible for protected-wholesale payload.

Cloudflare paid WARP/posture and the canonical `AdminDevice` are required whether the owner uses the Add-to-Dock app or ordinary approved browser.

## 9. Offline, background, and conflict policy

Launch Admin is **online-required for canonical reads and writes**. Do not promise an offline POS, inventory, receiving, or publication mode in this phase.

Permitted future offline behavior is limited to explicitly classified drafts, such as a scan/count list or upload queue, when device encryption, data minimization, expiry, logout/revocation cleanup, and conflict handling are proven. On reconnection:

- reauthenticate/re-admit the device;
- re-read canonical versions and availability;
- show conflicts and the complete proposed change;
- require the same capability, reason, step-up, and approval as an online command;
- submit with an idempotency key;
- never replay a stale privileged command silently.

Background uploads can continue only under short-lived scoped grants and safe platform behavior. A revoked device or expired grant prevents finalization even if bytes already reached quarantine.

## 10. Barcode, QR, label, and peripheral boundary

- Use standard manufacturer UPC/EAN/GTIN where authoritative; store them as external identifiers linked to canonical SKU/variant records.
- Use internal barcode/QR values only when they resolve a stable opaque Blowin' Smoke identifier; do not expose secrets, mutable prices, or customer data in the code.
- Lot/batch/location/receipt labels use distinct typed identifiers so a product scan cannot be mistaken for a lot or location.
- Every scan shows the resolved entity type and human-verifiable context before a consequential action.
- Browser, iPhone, and later POS scans call the same resolver and canonical query.
- Label generation is server-governed and versioned; printing success is not receiving or stock success.
- No printer class, model, driver, or native Mac bridge is selected here. Hardware evaluation must use representative label volume, size, barcode quality, network/USB/Bluetooth path, browser/OS support, reprint/correction audit, and accessibility/operational needs.

A native Mac client becomes a candidate only if the selected printer/POS workflow has a verified supported SDK or device path that the Web/Mac installed application cannot satisfy reliably and securely.

## 11. Accessibility requirements

The shared workflow must preserve WCAG-aligned semantics, while each client uses its platform accessibility system:

- complete keyboard and visible-focus operation on Web/Mac;
- VoiceOver/assistive naming and order on iPhone and Mac;
- dynamic text/text enlargement without truncating quantity, money, state, proof, or warning meaning;
- high contrast and non-color-only status;
- reduced-motion support and no motion-dependent operation;
- large scan/camera targets with audible/haptic/visual confirmation options that do not create duplicate submissions;
- captions/transcripts for instructional or evidence video where required;
- accessible before/proposed/after review for high-risk commands;
- recoverable validation with explicit field/state relationship;
- no anti-copy or device-security control that destroys legitimate assistive access.

Accessibility parity is evaluated by completing the operator job, not by making every layout visually identical.

## 12. Release, compatibility, and operations

### 12.1 Web/Mac

- Maintain an explicit supported-browser and minimum macOS/Safari matrix.
- Deploy Web Admin atomically with backwards-compatible API/schema policy and rollback evidence.
- A stale or unsupported client receives no privileged command authority and a safe upgrade message.
- Service worker/web-app caches must not retain unauthorized sensitive payload after logout, revocation, permission change, or deployment.
- Cloudflare policy, application device policy, and release state require monitored change control and recovery.

### 12.2 iPhone

- Maintain minimum iOS/hardware support based on VisionKit and App Attest execution proof, not marketing assumptions.
- Sign and distribute through an approved Apple path; Apple Developer Program cost is `$99/year`.
- Pin server compatibility to supported build ranges. Stale, tampered, unsupported, or revoked builds fail closed for privileged commands.
- Treat App Attest key replacement as device reenrollment.
- Test interrupted scanning, permission denial, camera unavailable, VoiceOver, text enlargement, background upload, low storage, low power, network transition, and revocation.

### 12.3 Operational burden

The selected strategy has two release trains, not three:

- Web application, also consumed by Mac Add-to-Dock;
- native iPhone companion.

It still requires cross-client API conformance, feature/status compatibility, security regression, accessibility tests, synthetic fixtures, and coordinated incident/revocation procedures. The companion remains narrow so native work buys real operational value rather than cosmetic duplication.

## 13. Cost, portability, and lock-in

| Item | Launch effect | Portability / lock-in response |
|---|---|---|
| Responsive Web Admin | Included in application build/hosting cost evaluated elsewhere | Keep domain logic and data in canonical API/database; use standard Web/OIDC contracts |
| Mac Add-to-Dock | No separate Apple program fee identified; requires macOS Sonoma 14+ for documented behavior | It is the Web application, so exit is normal browser deployment rather than desktop-runtime migration |
| Native iPhone companion | Apple Developer Program `$99/year`, plus native engineering/testing not priced | SwiftUI/VisionKit/App Attest are Apple-specific by design; isolate them behind shared API contracts so only the client is platform-locked |
| Auth0 Swift/web authentication | Auth0 Essentials cost recorded in the security document | Use OIDC/custom-domain boundaries and generated API contracts; expect auth-flow and credential reenrollment work on exit |
| Cloudflare WARP/Access | `$7/user/month` listed for paid plan; modeled one owner subject to purchase verification | Keep final device authority in `AdminDevice`; Cloudflare identifiers remain replaceable aliases |

The selected delivery strategy minimizes avoidable client duplication, not all vendor dependence. Apple-native scanning/attestation is intentional platform lock-in because it supplies concrete iPhone value. Canonical commerce logic, records, and device authorization remain provider-neutral.

## 14. Known limits and rejected assumptions

- A PWA is not equivalent to a native App Attest-capable iPhone client.
- A Safari-installed web app is not a signed native Mac client and adds no capture protection or hardware attestation.
- App Attest verifies app-instance evidence but does not establish a perfectly uncompromised iPhone.
- App Attest is not supported on Mac.
- Managed Device Attestation may later strengthen Apple endpoint identity, but its MDM/ACME/relying-party path is not selected or proven.
- Native does not mean offline-safe. No client may commit inventory, price, publication, or financial truth offline.
- A barcode is an identifier input, not product truth; a camera image is not measurement, compatibility, included-components, evidence, or rights proof.
- Provider upload/transcode/search success is not canonical success.
- Web/PWA receives zero D3/D4 Private Wholesale protected payload. This strategy does not approve iPhone or Mac for that payload either.
- No label printer, POS hardware, payment processor, native Mac framework, or desktop wrapper is selected by this document.

## 15. Evidence records

Every record below was accessed **2026-08-17**.

### DELIVERY-01 — iPhone/iPad Home Screen web applications

- **SOURCE:** WebKit, Web Push for Web Apps on iOS and iPadOS
- **URL:** https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** iOS/iPadOS 16.4 introduced standards-based Web Push for Home Screen web apps, including notifications/badging and service-worker behavior, without requiring Apple Developer Program membership for the web app.
- **WHAT IT DOES NOT ESTABLISH:** App Attest availability, native VisionKit scanning, approved-device identity, background behavior for 4K upload, or protected-wholesale eligibility.

### DELIVERY-02 — Mac Add to Dock

- **SOURCE:** Apple Support, Use Safari Web Apps on Mac / Add a Website to the Dock
- **URLS:** https://support.apple.com/en-us/104996 ; https://support.apple.com/guide/safari/add-to-dock-ibrw9e991864/mac
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** macOS Sonoma 14 or later can save a site as a separate web app with its own window, Dock presence, notifications, and badging.
- **WHAT IT DOES NOT ESTABLISH:** Native-code status, signed-client identity, WARP/posture, hardware attestation, peripheral support, capture protection, or protected payload approval.

### DELIVERY-03 — Native barcode/QR scanning

- **SOURCE:** Apple VisionKit `DataScannerViewController`; Scanning Data with the Camera
- **URLS:** https://developer.apple.com/documentation/visionkit/datascannerviewcontroller ; https://developer.apple.com/documentation/visionkit/scanning-data-with-the-camera
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** VisionKit provides a native live-camera scanning controller for supported text and machine-readable codes with guidance/highlighting and availability checks.
- **WHAT IT DOES NOT ESTABLISH:** Support on every iPhone, a canonical SKU match, barcode truth, label-printer compatibility, or inventory mutation authority.

### DELIVERY-04 — Native authentication integration

- **SOURCE:** Auth0 Swift; Apple `ASWebAuthenticationSession`
- **URLS:** https://auth0.com/docs/libraries/auth0-swift ; https://developer.apple.com/documentation/authenticationservices/aswebauthenticationsession
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Auth0 provides a Swift SDK for supported iOS/macOS targets and credential/web-authentication workflows; Apple provides a system-mediated web authentication session and scoped callback for native applications.
- **WHAT IT DOES NOT ESTABLISH:** Approved-device status, App Attest, safe application-specific token storage/configuration, or commerce authorization. Exact SDK/version and session design require implementation review.

### DELIVERY-05 — iPhone App Attest boundary

- **SOURCE:** Apple Establishing Your App's Integrity; `DCAppAttestService.isSupported`; DeviceCheck
- **URLS:** https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity ; https://developer.apple.com/documentation/devicecheck/dcappattestservice/issupported ; https://developer.apple.com/documentation/devicecheck
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Native App Attest can create and certify a hardware-backed app-instance key, keys do not survive reinstall/migration/restore, unsupported devices exist, and Mac returns unsupported. Apple states App Attest cannot definitively identify a compromised OS.
- **WHAT IT DOES NOT ESTABLISH:** Perfect iPhone integrity, Commerce Admin activation, support on every owner device, or protected-wholesale approval.

### DELIVERY-06 — Apple Developer Program price

- **SOURCE:** Apple Developer Program, What's Included
- **URL:** https://developer.apple.com/programs/whats-included/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Current Apple Developer Program membership is `$99/year` and supplies app distribution/testing and relevant Apple developer capabilities.
- **WHAT IT DOES NOT ESTABLISH:** Development labor, App Store approval, hardware cost, enterprise/private distribution eligibility, or production readiness.

### DELIVERY-07 — Cloudflare client and device gate

- **SOURCE:** Cloudflare Manual Deployment; Require WARP; Device Registration; Zero Trust Pricing
- **URLS:** https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/deployment/manual-deployment/ ; https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/client-checks/require-warp/ ; https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/device-registration/ ; https://www.cloudflare.com/plans/zero-trust-services/
- **ACCESS DATE:** 2026-08-17
- **WHAT IT ESTABLISHES:** Cloudflare One Client can be deployed to small-device fleets including Mac/iOS, Access can require WARP/posture, registrations can be managed/revoked, and paid pricing is listed at `$7/user/month` with paid SLA/support/log differences.
- **WHAT IT DOES NOT ESTABLISH:** A permanent physical-device identity, App Attest, one-user invoice minimum, or final application authorization.

## 16. Implementation proof and next gate

Before production authorization, the delivery proof must demonstrate with synthetic data:

- complete critical Web workflows at supported desktop and iPhone viewport sizes;
- Mac Add-to-Dock install, update, logout, cache cleanup, notifications, WARP removal, and revoked-device denial;
- native iPhone Auth0 login, App Attest enrollment/assertions, reinstall/restore reenrollment, build-floor denial, and device revocation;
- UPC/EAN/QR scan accuracy against synthetic identifiers, ambiguous/no-match handling, duplicate-scan prevention, and accessibility;
- receiving, stocktake, upload, and selected approval flows using the same server contracts as Web;
- interrupted high-resolution image and representative 4K-video upload without false success;
- no offline privileged command replay;
- server rejection for stale version, missing capability, missing step-up, missing audit, unsupported client, wrong device, and revoked grant;
- keyboard, VoiceOver, text enlargement, high contrast, reduced motion, captions/transcripts where required, and consequential-command review;
- explicit zero D3/D4 Private Wholesale protected payload on all unapproved clients.

| Decision | Status |
|---|---|
| Responsive Web Admin | **RECOMMENDED PRIMARY** |
| Native SwiftUI iPhone companion | **RECOMMENDED FOCUSED CLIENT** |
| Safari Add-to-Dock Mac web app | **RECOMMENDED MAC SURFACE** |
| Native Mac/Electron/Tauri launch client | **DEFERRED / REJECTED WITHOUT CONCRETE NEED** |
| Shared canonical API/domain authority | **REQUIRED** |
| Production delivery | **NOT AUTHORIZED** |
| POS/peripheral implementation | **NOT AUTHORIZED; separate hardware/payment proof gates remain** |
| Private Wholesale protected client | **NOT AUTHORIZED; separate SEC gate unchanged** |

This document establishes an opinionated delivery architecture and its evidence boundary. It does not begin implementation, create production applications, select a production framework, enroll devices, purchase services, or authorize launch.
