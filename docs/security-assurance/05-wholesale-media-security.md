# Wholesale Media Security

**Document role:** Feasibility and classification decision for private catalog data, 4K media, message attachments, and final manifests
**Decision:** **C — hybrid by media class**
**Provider/stack selection:** None

**Protected-client correction:** The hybrid encryption decision is preserved, but every D3/D4 private wholesale presentation is now restricted to an approved protected client. Browser/PWA delivery is rejected. See [private-wholesale-protected-content-assurance.md](private-wholesale-protected-content-assurance.md).

## 1. Decision summary

Private Wholesale contains two different privacy problems:

1. **Conversation confidentiality:** messages and approved one-to-one attachments should be unreadable to the routing intermediary. These remain D4 E2EE content.
2. **Restricted merchandising:** current inventory, private starting prices, evidence-backed profiles, proof, photos, and video must be frequently updated, revoked, streamed, personalized, and delivered to multiple authorized viewers. These are restricted server-authorized content, not server-blind E2EE.

Encrypting the entire catalog end-to-end would not make it uncopyable. The authorized customer endpoint still needs plaintext/pixels. It would also complicate current authorization, high-resolution derivatives, adaptive 4K streaming, individualized watermarking, revocation, accessibility, and correction while giving an inaccurate impression that the server never accesses assets it must process.

Therefore:

- **D4 / endpoint E2EE:** customer–representative messages and explicitly approved negotiation attachments.
- **D3 / restricted server-authorized:** private inventory availability/counts, starting prices, evidence-backed profile/proof projection, high-resolution catalog photos, 4K catalog video, and personalized media derivatives.
- **D3 canonical projection:** the final-order manifest. It is deliberate commerce truth and not disposable E2EE-only content even if access is ephemeral.
- **D0/D1 where approved:** a separately authorized public product/proof fact; publication never occurs merely because the field existed in wholesale.

Encryption does not lower classification.

## 2. Media-class matrix

| Material | Recommended protection | Server/provider plaintext boundary | Update/revocation need | Customer delivery | Capture reality |
|---|---|---|---|---|---|
| Private unit price | D3 restricted field/projection | Authorized Price projection/runtime can read | Immediate/versioned | Approved protected client; short response; watermark page | Ordinary client copy/capture blocked; transcription, external-camera, compromised/privileged extraction remain |
| Availability/private count | D3 restricted current projection | Authorized Inventory projection/runtime can read | Immediate; stale state explicit | Minimum decision-needed precision; avoid bulk payload | Ordinary client copy blocked; transcription/compromise remain; staleness must be visible |
| Evidence-backed strain profile | D3 restricted catalog projection | Catalog/content runtime can read | Version/correction/provenance | Accessible structured protected content | Ordinary client copy blocked; transcription/compromise remain; no invented facts |
| Proof information | Governed proof projection at highest contained class | Proof owner and authorized renderer | Expiry/invalidation/correction | Linked, versioned, accessible protected evidence | Ordinary client copy blocked; privileged/compromised extraction remains; truth/provenance controls |
| High-resolution catalog photo | D3 restricted media | Authorized origin/derivative/watermark path can read | Version/revoke/replace | Sized derivatives; explicit approved-client high-res reveal | Supported screenshot/record paths blocked; external camera and privileged/compromised extraction remain |
| Catalog 4K video | D3 restricted media | Authorized transcode/package/watermark/CDN path can read | Version/revoke/lease | Adaptive segmented approved-client stream; no autoplay | Ordinary save/capture blocked; privileged/compromised segment or output extraction and camera remain |
| Negotiation attachment | D4 E2EE object | Routing/object store sees ciphertext only | Conversation lifecycle | Encrypt before upload; decrypt/render only in approved protected endpoint | Ordinary copy/export/capture blocked; transcription, camera, compromise remain |
| One-to-one sensitive product media | D4 only if genuinely conversation-specific and no server transform is required | Ciphertext store only | Conversation lifecycle | Approved-endpoint encrypted attachment | No server watermark/transcode; ordinary capture blocked, privileged/compromised capture and camera remain |
| Final manifest | D3 canonical order projection | Order/manifest runtime can read | Immutable version/correction, ephemeral view | Online reveal; five-minute access lease | Cannot be recalled after display |

## 3. 4K photo and video feasibility

### High-resolution still photography

**Status:** `CONDITIONAL`.

Deliver fit-for-inspection derivatives rather than original camera masters. Every request must revalidate current room grant, account/session/device posture, exact media/version, purpose, and expiry. Generate a server/edge-burned individualized derivative where it does not distort product truth. Avoid stable public filenames, predictable object keys, EXIF/location metadata, or long-lived URLs.

An approved client must block ordinary supported screenshot, recording, save, download, and open-original paths before high-resolution reveal. A privileged or compromised endpoint can still fetch or reconstruct renderable data, and an authorized viewer can still photograph or manually reproduce what is visible. “View-only” and “non-downloadable” remain prohibited as absolute claims.

### 4K video

**Status:** `CONDITIONAL`.

Adaptive segmented streaming can make 4K commercially usable while reducing unnecessary transfer. [RFC 8216](https://www.rfc-editor.org/rfc/rfc8216.html) defines HLS playlists, segments, and key retrieval; segmentation does not create non-copyability because the authorized player receives the segments and usable playback path.

Required behavior:

- reveal only after the signed client, supported platform/control state, trusted endpoint, account/room grant, and object authorization pass; unknown or unsupported state fails closed;
- thumbnail/poster and lower rendition first;
- explicit 4K selection, never autoplay;
- per-playback authorization and short lease;
- authorization on playlist/manifest, every segment, key/license where used, captions, and poster—not only the initial page;
- no stable original/master URL;
- server/edge-personalized visible mark; forensic candidate only after validation;
- captions/transcript and controls; reduced-motion/autoplay respect;
- measured bandwidth and graceful lower-quality fallback;
- revoke future requests without claiming recall of received segments.

### DRM qualification

The [W3C Encrypted Media Extensions Recommendation](https://www.w3.org/TR/2017/REC-encrypted-media-20170918/) is an interface to content-protection key systems, not a universal DRM guarantee. Android support varies by scheme/format/device ([Media3 DRM](https://developer.android.com/media/media3/exoplayer/drm)); Apple FairPlay is an Apple-platform HLS system with separate approval/credential requirements ([FairPlay Streaming](https://developer.apple.com/streaming/fps/)).

DRM may reduce some direct video extraction on supported paths. DRM alone does not protect price, profiles, still photography, ordinary UI screenshots, or a second camera; the approved client's separate capture gate still applies to the full protected surface. DRM can reduce accessibility/platform/Onion reach. SEC-02 treats DRM as `OPTIONAL / BLOCKED PENDING CANDIDATE`, not a prerequisite or selected architecture.

## 4. Authorization and URL semantics

### Short-lived signed URLs

Signed URLs are bearer capabilities. Anyone who receives one can generally use it until its conditions expire. [RFC 6750](https://www.rfc-editor.org/rfc/rfc6750) warns against putting bearer tokens in page URLs because of history/log leakage. Official CDN documentation similarly describes signed access as time-bounded authorization, not identity or recall.

Preferred feasibility order:

1. authenticated application/media-gateway request with header/cookie and current server authorization;
2. narrowly scoped signed cookie/header or one-resource lease that is not exposed in navigation/referrer;
3. signed URL only when unavoidable, with very short duration, no PII/canonical ID, strict referrer policy, log redaction, and no third-party page resources.

Do not bind media access solely to source IP: mobile and Tor circuits change, shared addresses create false confidence, and IP does not prove endpoint identity.

Expiry denies later requests; it does not revoke bytes already delivered. A transfer started before expiry may finish depending on the delivery system, so exact segment/range behavior must be tested and disclosed.

## 5. Cache behavior

All restricted catalog/manifest responses are available only to an approved protected client and use the strictest compatible server and application-cache baseline, including `Cache-Control: no-store` where applicable, no persistent private app cache, and no prefetch/prerender. Browsers and PWAs receive no protected response. [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111) remains negative evidence that `no-store` is not a reliable or sufficient privacy mechanism and malicious/compromised caches may ignore it.

[Clear-Site-Data](https://www.w3.org/TR/clear-site-data/) is also browser negative evidence: it can request origin cache/storage/context clearing but cannot promise complete disk-remnant removal. It is not a protected-client control or a reason to send protected data to a browser.

Consequences:

- use a dedicated wholesale service/origin boundary while returning zero protected payload to browser/PWA clients;
- test browser/Tor/PWA routes as negative proof that no protected response, identifier, preload, cache entry, service-worker entry, or metadata-rich error is delivered;
- never treat cache headers or application cleanup as remote erasure;
- do not store private 4K or manifests for offline use;
- keep decrypted message attachments out of persistent application state by default;
- revalidate grant/revocation online before each sensitive reveal/playback;
- test approved-client application memory/cache, background/task preview, crash/restart, offline transition, range/segment/key, output, and cleanup behavior;
- record only controlled-system deletion results; external copies remain outside the claim.

## 6. Origin, CDN, and provider exposure

Server-decryptable restricted content may be visible to authorized media origin, transform/transcode, watermark, CDN, object storage, and observability boundaries unless the selected topology removes them. Every provider therefore requires:

- exact allowed fields/objects and purpose;
- D3 handling and personnel/service access;
- encryption at rest/in transit and purpose-separated key authority;
- cache/location/replication/residency behavior;
- request/token/log redaction;
- retention, deletion, backup expiry, hold and proof;
- breach/vulnerability notification;
- subcontractor inventory;
- export and replacement/exit;
- no model training, advertising, profiling, or unrelated analytics;
- Onion behavior or explicit exclusion.

Encryption at rest protects stolen media/storage but ordinarily lets the authorized runtime/provider path decrypt. It must never be described as E2EE.

For D4 attachments, the object store/CDN may receive ciphertext and metadata only. Server malware scanning of plaintext conflicts with server blindness; safe type limits and rendering occur on endpoints, and explicit user reporting/declassification creates a separate governed plaintext record.

## 7. Watermark layers

| Layer | Feasibility | Purpose | Limitation |
|---|---|---|---|
| DOM/page session overlay | `PASS` as basic deterrence | Mark text/UI and reinforce handling | Removable by a capable client |
| Server/edge-burned visible derivative | `PASS` as deterrence/limited attribution | Mark the actual image/video pixels | Can be cropped/obscured; processing path sees plaintext |
| Static-per-render/session placement variation | `CONDITIONAL` | Make one reusable clean crop less convenient without animation | Still removable/recordable; must remain stable, accessible, and non-obscuring |
| Forensic video/still watermark | `BLOCKED` | Potential session attribution | Requires independent robustness/false-positive/evidence validation |

Use pseudonymous trace IDs rather than full identity. Keep mapping restricted and time-bounded. A match supports investigation; it never independently proves intent or actor.

## 8. Accessibility and product-truth safeguards

Privacy controls cannot erase the information needed to inspect a product or operate the interface.

Required conditions:

- meaningful alt text based on verified facts, not effects/genetics/source inference;
- captions and transcript for video; keyboard and assistive-technology controls;
- no autoplay; pause/stop; reduced-motion handling;
- watermark placement that preserves color/texture/product detail and never obscures proof text or captions;
- lower-bandwidth renditions and data-use choice;
- the same authorization applied to accessible alternatives without hiding them behind inaccessible controls;
- expiration warning/timing handling consistent with document 07 and WCAG review;
- no canvas-only text or blocked selection that prevents assistive access to material order facts.

## 9. Onion implications

The optional browser Onion entrance may serve public/nonprotected content and generic approved-client onboarding, but Tor Browser is rejected for protected wholesale under the same capture gate as every browser. It must not receive private catalog media, messages, or manifests.

Protected 4K media over Onion is therefore `BLOCKED` until an approved signed client has a separately reviewed Tor transport. Any such candidate must test E2EE, object authorization, media ranges/segments/keys, resource isolation, performance, accessibility, and failure behavior without a silent clearnet CDN fallback; use thumbnail/lower rendition before explicit 4K; avoid IP pinning; and state degraded/unavailable outcomes honestly. A static login or public Onion page does not establish protected-media compatibility.

## 10. Competitor leakage and scraping response

The system can block ordinary supported-client recording and extraction and limit systematic unauthorized extraction. It cannot stop manual transcription, an external camera, or privileged/compromised/unsupported endpoint capture of current prices or media.

Allowed controls:

- object-level authorization, current qualification, resource minimization;
- pagination/decision-oriented views rather than one bulk catalog response;
- rate/concurrency/behavior limits with safe challenge/review;
- pseudonymous session watermarks;
- revoke/suspend through a governed, appealable abuse process;
- rotate private commercial terms when business-authorized;
- keep investigation data purpose-limited and never repurpose private browsing for marketing.

Do not fingerprint customers invasively, create unsupported fraud conclusions, or fabricate inventory variants to trap users without qualified security/privacy/legal approval.

## 11. Hybrid decision consequences

1. “Private” means access-restricted and minimized for catalog media; it does not mean server-blind.
2. “End-to-end encrypted” applies only to designated messages and approved attachments whose keys never enter the intermediary.
3. Moving an attachment into catalog, proof, quote, order, support, or incident truth requires deliberate declassification, customer disclosure where applicable, target-domain validation, receipt, and correction path.
4. The final manifest is an authorized projection of canonical commerce data. Its presentation can expire; its required canonical source records do not.
5. Approved clients must block supported screenshots/recordings and ordinary copy/forward/save/download/print/drag/export paths as a release condition. Even after that gate passes, an external camera, compromised endpoint, or privileged unsupported capture can reproduce content; short access, individualized marks, audit, and revocation remain defense in depth.

## 12. Final media outcomes

| Question | Outcome |
|---|---|
| All wholesale media as E2EE | `FAIL` as the default architecture; conflicts with required catalog operations without solving endpoint capture |
| Shared catalog as server-decryptable restricted content | `CONDITIONAL`, recommended class |
| Messages/approved negotiation attachments as genuine E2EE | `CONDITIONAL`, required class |
| Hybrid by media class | `PASS` as the controlling feasibility decision; implementation evidence still required |
| Private 4K access control | `CONDITIONAL` |
| Browser/PWA private media delivery | `FAIL`; rejected for protected wholesale |
| Approved-client ordinary save/download path removal | `CONDITIONAL / APPLICATION-ENFORCED / NOT YET VERIFIED` |
| Truly “non-downloadable” media against an endpoint owner | `FAIL` as an absolute claim |
| Segmentation as copy prevention | `FAIL`; useful delivery/access-control mechanism only |
| Visible individualized watermark | `PASS` as deterrence/limited attribution |
| Forensic watermark | `BLOCKED` pending independent evidence |
| Server access expiration/revocation | `PASS` within tested server boundary |
| Recall of already rendered/received content | `FAIL` |
