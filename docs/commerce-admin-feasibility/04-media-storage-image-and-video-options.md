# Media Storage, Image, and Video Options

**Document role:** COM-ADM-02 provider feasibility and evidence-backed media-stack decision  
**Governing architecture:** COM-ADM-01 Media and Evidence Management plus SEC-01/SEC-02/SEC-03 protected-content decisions  
**Evidence access date:** 2026-08-17  
**Selected feasibility stack:** Amazon S3 + Cloudflare Images + Mux  
**Production implementation authorized:** No  
**Provider procurement authorized:** No  
**Private Wholesale release authorized:** No  

## 1. Purpose and decision boundary

This document evaluates the storage, authenticated upload, image-processing, and high-resolution video services needed to operate the media system defined by COM-ADM-01. It translates the governing logical model into a provider-feasible direction without authorizing production implementation.

The selected feasibility stack is:

| Responsibility | Selected candidate | Governing reason |
|---|---|---|
| Private upload quarantine, immutable canonical masters, evidence-document bytes, retention, recovery, and export | **Amazon S3** | The owner prefers reliability, managed security controls, versioning, replication, Object Lock capability, integrity checks, and a first-party managed malware-scanning path over the lowest possible storage or egress price. |
| Public and restricted image derivatives | **Cloudflare Images** | Low operating cost, responsive transformations, metadata control, private-image support, authenticated-origin patterns, and watermark/overlay compatibility without making it the canonical master store. |
| 4K/on-demand video transcode and adaptive delivery | **Mux** | Verified on-demand 4K support, signed playback, mature ingest/transcode operations, captions, and usage-based pricing while exact original bytes remain in S3. |

The principal alternatives remain:

- **Cloudflare R2:** cost/egress alternative to S3;
- **Cloudinary:** premium image DAM and transformation alternative;
- **Bunny Stream:** low-cost 4K proof challenger to Mux;
- **Cloudflare Stream:** rejected when 4K playback is required because current official documentation limits adaptive output to 1080p; and
- **Supabase Storage:** useful application storage, but rejected as the sole canonical master or D3 protected-media store.

Selection in this document means **selected for an isolated proof and commercial/security diligence gate**. It does not mean an account has been purchased, contracts accepted, production credentials created, customer data transferred, or a protected client approved.

## 2. Governing COM-ADM-01 fit

The provider direction preserves the following COM-ADM-01 invariants:

1. A binary object is not product truth, rights approval, proof applicability, or publication approval.
2. Upload never auto-publishes.
3. A master is immutable; replacement creates a successor version.
4. Derivatives identify the exact source master and transformation recipe.
5. Media assignment, rights, access class, channel, role, order, and effective state remain canonical transactional records outside object storage.
6. Original camera masters are never direct storefront or wholesale delivery objects.
7. Public retail, internal review, D3 restricted wholesale, D4 E2EE attachments, and evidence documents remain separate classes.
8. Browser/PWA clients receive zero D3/D4 Private Wholesale protected payload.
9. Failed, unknown, timed-out, stale, unsupported, or unavailable validation and scan states fail closed.
10. Historical orders and audit records retain the exact media/evidence version they consumed.

S3 owns canonical bytes and their storage-level integrity/retention controls. The commerce database remains authoritative for `MediaAsset`, `MediaMasterVersion`, `MediaDerivative`, `MediaAssignment`, rights, evidence applicability, lifecycle, processing state, and audit history. Cloudflare Images and Mux are derivative processors and delivery providers, not truth owners.

## 3. Capability and decision matrix

| Candidate | Authenticated/resumable upload | Security and private access | Processing | Recovery and exit | Cost/operations | COM-ADM-01 decision |
|---|---|---|---|---|---|---|
| **Amazon S3** | Presigned PUT plus multipart upload; independently retried parts; checksum validation | Block Public Access; IAM; private buckets; versioning; Object Lock; replication; GuardDuty Malware Protection for S3 | Event-driven processing is supported; image/video decoding and metadata extraction require a separate isolated processor | Strong versioning, replication, lifecycle, Object Lock, and broad export tooling | Multi-dimensional regional storage/request/transfer/replication/scan pricing; exact launch price **PRICE NOT VERIFIED** | **RECOMMENDED** — canonical quarantine/master store |
| **Cloudflare R2** | Presigned PUT; browser/mobile clients; S3 multipart upload | Private by default; bucket-scoped credentials; Cloudflare-specific bucket locks; encryption at rest | Queue/event triggers; no R2-native object malware scanner established | S3-compatible export and rclone; no S3 Versioning, Replication, Object Lock, or KMS API equivalence | Standard storage **$0.015/GB-month** plus Class A/B operations, free allowances, and no egress charge; custom scan/version/backup work required | **VIABLE ALTERNATIVE** — cost/egress leader |
| **Supabase Storage** | TUS resumable upload; signed upload token; strong browser/mobile ergonomics | Private buckets and RLS; signed/authenticated download | Integrated image transforms subject to limits; no native malware scanner established | S3/rclone export, but no object versioning; database backups exclude Storage object bytes | Pro **$25/month**, currently including 100 GB storage and 250 GB egress; storage overage **$0.0213/GB** plus separate egress charges | **REJECTED** as sole canonical/D3 store; optional application storage only |
| **Cloudflare Images** | One-time Creator Upload URLs; selected pipeline will normally ingest only validated sources | Signed private image URLs and authenticated/private-origin controls | Resize, crop, format, quality, overlays/watermarks, metadata disposition | Hosted original export is available; selected design keeps exact master in S3 | Hosted Images billing includes **$5/100,000 stored images-month** and **$1/100,000 delivered images**; transformations have separate allowance/usage dimensions | **RECOMMENDED** — image derivative processor |
| **Cloudinary** | Signed browser/mobile upload, widget/SDK, chunked upload | `private`/`authenticated` delivery and Strict Transformations; configuration-sensitive defaults | Rich image/video transforms, metadata extraction, DAM, watermarks | Revisions/backups and optional customer-owned backup storage | Free tier exists; reviewed paid DAM tiers are Plus **$99/month** and Advanced **$249/month** before annual discounts, using proprietary credits | **VIABLE ALTERNATIVE** — premium DAM/derivative option |
| **Mux** | Direct resumable upload and iOS/iPadOS SDK exist, but selected flow ingests only after S3 validation | Signed playback JWTs; optional DRM; playback-ID/key lifecycle | Verified on-demand 4K transcode and adaptive streaming; captions; thumbnails; static overlay watermark | Temporary equivalent-quality master download; not a substitute for exact S3 original | Usage-based; current starting 4K figures are approximately **$0.0096/stored minute-month** and **$0.0032/delivered minute**; DRM starts at **$100/month** plus plays | **RECOMMENDED** — 4K derivative/streaming processor |
| **Cloudflare Stream** | One-time direct upload and TUS for large/unreliable uploads | Signed playback and origin restrictions | Adaptive H.264 delivery officially documented only through 1080p | Exact input original is not exportable; encoded MP4 can be generated | **$5/1,000 stored minutes** and **$1/1,000 delivered minutes** | **REJECTED** for required 4K |
| **Bunny Stream** | Presigned TUS with client resume | Token authentication, domain/IP controls, optional DRM | 2160p premium encoding; HLS; static library watermark | Can retain an original when configured, but independent canonical storage remains required | Storage from **$0.01/GB**, North America/Europe Standard delivery about **$0.01/GB** or Volume from **$0.005/GB**, and 4K encoding **$0.15/minute per codec**; DRM starts at **$99/month** plus licenses | **VIABLE ALTERNATIVE** — controlled proof challenger to Mux |

## 4. Selected media topology

```text
OWNER / AUTHORIZED STAFF
        |
        | authenticated upload-session request
        v
COMMERCE ADMIN COMMAND/API
        |
        | short-lived, one-object, one-purpose multipart grant
        v
S3 PRIVATE QUARANTINE BUCKET
        |
        +--> checksum and upload completion verification
        +--> GuardDuty malware scan
        +--> magic-byte/parser/decode validation
        +--> technical and privacy metadata extraction
        |
        | only when every mandatory result is accepted
        v
S3 VERSIONED CANONICAL MASTER BUCKET
        |
        +--> Cloudflare Images derivative path
        |       +--> public retail derivatives
        |       +--> internal review derivatives
        |       +--> D3 candidate derivatives (not releasable yet)
        |
        +--> Mux URL ingest through a short-lived one-object fetch grant
        |       +--> public/signed adaptive video derivatives
        |       +--> D3 candidate signed stream (not releasable yet)
        |
        +--> separate-account/region recovery copy
        |
        v
CANONICAL MEDIA/EVIDENCE RECORDS + AUDIT/OUTBOX
```

### 4.1 Storage boundaries

Use separate buckets or equivalently isolated policy boundaries for:

- upload quarantine;
- accepted canonical media masters;
- accepted evidence-document masters;
- generated internal derivatives when S3-hosted;
- recovery copies; and
- D4 ciphertext attachments if S3 is later used for that class.

Do not use one public bucket with path conventions as the security boundary. Enable S3 Block Public Access at the account and bucket levels for quarantine and canonical storage. Use opaque, server-selected, immutable keys. The client never supplies a canonical path, public filename, product slug, or predictable sequence.

D4 E2EE negotiation attachments are not processed through the server-readable media path. Their store receives ciphertext and limited routing metadata. Server-side plaintext malware scanning, image transformation, watermarking, or video transcode would contradict the server-blind boundary unless a separately governed declassification operation occurs.

### 4.2 Master promotion

The system promotes an object from quarantine only after every required result is present and accepted. Promotion creates an immutable `MediaMasterVersion` or `EvidenceDocumentVersion` and preserves:

- the source upload operation;
- exact checksum and byte length;
- detected type and technical metadata;
- scan engine/result/version and completion time;
- parser/decoder result;
- privacy-metadata disposition;
- actor, purpose, intended class, and correlation;
- rights/evidence review state, which may still remain pending; and
- quarantine and canonical object identifiers.

Clean storage does not make an asset publishable. Rights, assignment, subject scope, alt/caption, evidence applicability, and channel approval remain later governed decisions.

## 5. Upload state architecture

The provider implementation must preserve explicit, auditable states rather than compressing work into a generic `uploaded` flag.

```text
REQUESTED
  -> AUTHORIZED
  -> UPLOADING
  -> UPLOAD_COMPLETE_UNVERIFIED
  -> QUARANTINED
  -> MALWARE_SCAN_PENDING
  -> CONTENT_VALIDATION_PENDING
  -> METADATA_REVIEW_PENDING
  -> ACCEPTED_MASTER
  -> DERIVATIVES_QUEUED
  -> DERIVATIVES_PROCESSING
  -> READY_FOR_ASSIGNMENT
```

Terminal or intervention states include:

- `UPLOAD_AUTHORIZATION_EXPIRED`;
- `UPLOAD_ABORTED`;
- `CHECKSUM_MISMATCH`;
- `MALWARE_DETECTED`;
- `SCAN_UNSUPPORTED`;
- `SCAN_FAILED`;
- `SCAN_TIMED_OUT`;
- `TYPE_MISMATCH`;
- `PARSER_REJECTED`;
- `LIMIT_EXCEEDED`;
- `METADATA_POLICY_REJECTED`;
- `DERIVATIVE_FAILED`;
- `REVOKED`;
- `SUPERSEDED`;
- `ARCHIVED`; and
- `DELETION_PENDING_RETENTION`.

Unknown and unsupported are not clean. A retry must preserve the prior attempt and correlation rather than overwriting evidence. Admin may show an honest retry action, but it must not let an operator manually flip a failed object to accepted.

## 6. Authenticated direct upload and resumability

### 6.1 Admission grant

After authenticating and authorizing the actor, the Admin backend creates a short-lived upload session bound to:

- actor and role;
- intended asset/evidence class;
- one opaque quarantine object key;
- expected or maximum byte length;
- approved content-family policy;
- checksum algorithm/value when available;
- product, SKU, lot, evidence, or draft-media correlation without making that correlation proof;
- expiration and completion boundary; and
- an idempotency key.

The grant allows upload to that one key. It must not allow bucket listing, arbitrary reads, public ACL changes, overwrite of an accepted master, or completion of an unrelated multipart upload. Presigned URLs are bearer capabilities and must not appear in application navigation, analytics, error reports, durable browser history, support screenshots, or ordinary logs.

### 6.2 Desktop flow

Desktop Admin should support:

1. multi-file selection and drag/drop without treating filenames as product assignments;
2. a preflight showing intended class, size, and local checksum progress;
3. multipart upload with per-part retry and visible total progress;
4. pause/cancel and safe resume while the authorization remains current;
5. an explicit finalize request that the server validates before completing the multipart upload;
6. individual status and failure reason for every file in a batch;
7. post-upload technical results without exposing a durable original URL; and
8. separate rights, evidence, assignment, and publication work after processing.

Bulk upload is not bulk approval. One failed file remains failed without silently rolling back or approving unrelated files unless the exact command declared an atomic batch.

### 6.3 iPhone/iPad flow

The iPhone/iPad operator flow should support camera/photo-library selection, upload progress, retry, and restoration of an interrupted multipart session. AWS multipart makes independently retried parts feasible, but current evidence does not prove background continuation, process-restart recovery, or file-handle persistence in the eventual iOS Safari/PWA/native Admin surface. Those behaviors require proof on the exact client and OS versions.

The application must therefore:

- persist only the minimum non-secret upload-session state;
- request fresh part grants after restart when policy allows;
- verify the local file still matches the original checksum/size before resume;
- handle network switching and low-power interruption honestly;
- never silently restart into a second canonical asset;
- let the user intentionally restart when the local file handle is no longer available; and
- show `UPLOAD_INTERRUPTED` rather than success when completion is uncertain.

Mux, Cloudflare Stream, Supabase, and Bunny provide convenient direct/TUS or native resumable paths. They are not the selected canonical intake because direct-to-processor upload would bypass the S3 quarantine and GuardDuty/content-validation gate. For selected video processing, Mux receives only a clean S3 source through a narrowly scoped, short-lived fetch URL.

## 7. Quarantine, malware scanning, and file validation

### 7.1 GuardDuty role

GuardDuty Malware Protection for S3 is selected as the managed malware layer for new quarantine objects. Official documentation establishes automatic scanning of new versions, EventBridge/CloudWatch outcomes, optional result tags, tag-based access patterns, and a current maximum attempted object size of 100 GB.

GuardDuty is one layer, not the entire gate. Its scan engine is principally file-based; it does not establish safe decode, correct media identity, truthful metadata, rights, or proof applicability. An object larger than the supported scan ceiling, an unsupported scan, access failure, timeout, or missing result remains denied.

Recommended quarantine behavior:

- deny application read and downstream processing until the exact object version has an accepted scan result;
- permit only the scanner and isolated validation service to read quarantined bytes;
- emit an auditable processing event for every outcome;
- isolate or expire rejected objects under a qualified retention policy;
- avoid logging file content, presigned URLs, customer data, or malware payload fragments; and
- separately monitor completed, failed, skipped, and infected scan counts.

### 7.2 Content validation

The isolated validation worker must compare:

- extension;
- declared `Content-Type`;
- file signature/magic bytes;
- safe parser/decoder result;
- container and codec;
- byte length and checksum;
- image dimensions, orientation, color profile, and pixel count;
- video dimensions, duration, frame rate, audio tracks, and bitrate where required;
- evidence page count and active-content policy; and
- decompression and nested-content limits.

Reject executables, scripts, active documents, SVG or other active formats unless a separately approved sanitizer exists, malformed/polyglot content, nested archives, decompression bombs, unsupported codecs, and parser failures. Processors must run with least privilege, bounded CPU/memory/time, no unnecessary network access, patched decoders, and a disposable isolation boundary.

### 7.3 Metadata and provenance

Extract only metadata needed for operations or provenance. Strip GPS, device serial, local paths, unnecessary creator/contact data, and other privacy-sensitive fields from delivery derivatives. Preserve an approved provenance subset as canonical metadata when justified; do not depend on public EXIF to carry product truth.

Cloudflare Images can strip or preserve selected metadata during transformation. Mux returns technical media information needed for derivative tracking. Neither provider's output metadata replaces the canonical S3 checksum and application `MediaMasterVersion` record.

## 8. Cloudflare Images derivative architecture

Cloudflare Images is selected for image derivatives, not for canonical originals.

### 8.1 Why it fits

Current official evidence supports:

- image resize, crop, quality, and format transformations;
- overlays and watermark compatibility;
- signed private hosted-image delivery;
- authenticated private-origin access patterns;
- metadata disposition controls;
- original export for assets hosted by Cloudflare Images; and
- low count/transformation-based pricing.

Cloudflare Hosted Images currently limits direct uploads to 10 MB. That is too small to govern all high-resolution camera masters. The selected architecture therefore retains the exact master in S3 and uses an authenticated origin/processing path for eligible derivatives. The direct Creator Upload feature is not the canonical Admin upload path.

### 8.2 Derivative classes

Each generated output records source master version, recipe/version, dimensions, format, quality, checksum, access class, processing status, and provider identity. Candidate classes include:

- public thumbnail/card/PDP;
- public responsive detail image;
- internal rights/evidence review;
- high-resolution inspection;
- visible-watermarked restricted derivative; and
- static fallback for reduced-motion or unavailable video.

Public derivatives may have stable cacheable URLs only after publication approval. They remain opaque and must not expose an original-camera path. D3 candidate derivatives remain private and unreleasable until a protected client satisfies the separate security gate.

### 8.3 Watermark boundary

Cloudflare Images overlays can implement a static or server-selected visible mark. Official evidence does not establish a robust per-account/per-session forensic watermark or prove who leaked an image. If the future D3 architecture requires pseudonymous session marks, the exact server/edge burn-in, anti-crop layout, cache key, privacy mapping, latency, quality, and false-attribution behavior require a separate proof.

Watermarks never count as screenshot prevention, must not obscure product detail or proof, and must preserve accessible alternatives.

## 9. Mux 4K derivative architecture

Mux is selected for on-demand 4K processing and adaptive streaming after S3 acceptance.

### 9.1 Ingest

The backend creates a Mux asset from a short-lived URL that exposes one accepted S3 master version for the minimum ingest window. Mux official API documentation establishes asset creation from an input URL. The application records the Mux asset ID against the exact S3 master and processing correlation.

Do not make direct-to-Mux device upload the normal Admin path. Although Mux supports resumable direct upload and iOS/iPadOS upload SDKs, using them first would let media reach the transcode service before the selected quarantine scan and validation boundary.

### 9.2 Required Mux configuration direction

- request the required on-demand 4K resolution tier only for sources and assignments that justify it;
- create signed rather than public playback for restricted candidates;
- do not enable downloadable/static MP4 for D3 content;
- generate captions/transcript through an approved accessible workflow;
- preserve the exact original only in S3;
- record webhooks and processing failure states idempotently;
- remove or revoke future playback when a media version is invalidated; and
- never claim recall of segments or pixels already delivered.

Mux's downloadable master is described as equivalent in quality to the input, not guaranteed to be the exact original bytes. It is an exit aid, not the canonical master or backup.

### 9.3 Playback and DRM

Signed Mux playback uses JWT authorization and may apply expiry and other restrictions. It is still a bearer delivery capability. It does not establish account/room/device/client authorization on its own and does not block screenshots, screen recording, external-camera capture, privileged extraction, or a compromised client.

Mux DRM is optional and not selected by this document. Current pricing adds a material base and per-play charge. DRM could reduce some direct video extraction, but it would not protect prices, structured profiles, still images, or ordinary UI. Any DRM adoption requires platform, accessibility, approved-client, Onion, support, and recovery evidence.

Mux supports a static burned overlay. Built-in per-viewer forensic or pseudonymous session watermarking was not established. That requirement remains a separate derivative proof.

## 10. Protected-wholesale security boundary

The selected providers do not change the SEC-02/SEC-03 gate.

### 10.1 D3 restricted catalog media

D3 high-resolution images and 4K catalog video are server-decryptable restricted media. S3, Cloudflare, and Mux may process plaintext only within a later-approved, contractually governed provider boundary. Before any D3 response or playback token is issued, the application must validate at minimum:

- signed supported client/build;
- protected-rendering/capture-control state required for that platform;
- trusted endpoint/device and revocation state;
- current account/session;
- current wholesale-room grant;
- exact object/version and purpose;
- current rights/publication state;
- token/lease freshness; and
- no missing, unknown, stale, revoked, tampered, or unsupported mandatory signal.

Browser/PWA delivery remains rejected. A browser session, role, user-agent, Cloudflare signed URL, or Mux JWT cannot override that decision.

### 10.2 Resource delivery

For a future approved protected client:

- issue an opaque one-resource lease only after current admission;
- authorize manifests, segments, keys/licenses, poster, captions, and high-resolution image derivatives, not merely the page shell;
- use the shortest tested usable expiry;
- avoid navigation/referrer query tokens where a header/cookie/gateway exchange is feasible;
- deny public enumeration and stable original URLs;
- disable ordinary save/share/open-original/export paths in the client;
- avoid persistent private client cache and offline protected media;
- revalidate before each sensitive reveal/playback; and
- make revocation stop future requests without claiming deletion of already received bytes.

`Cache-Control: no-store`, token expiry, signed URLs, segmented streaming, DRM, and watermarking are defense in depth. None individually establishes the hard capture-output acceptance rule.

### 10.3 D4 E2EE attachments

D4 message attachments remain encrypted before upload and decrypt only at an approved endpoint. S3 may store ciphertext, but Cloudflare Images and Mux cannot transform server-blind attachments without deliberate declassification. Server-side malware scanning of plaintext also conflicts with the E2EE promise. Endpoint type limits, safe rendering, reporting, and any declassification into catalog/support/incident truth require the separate E2EE architecture.

## 11. Retention, recovery, deletion, and exit

### 11.1 S3 canonical recovery

The selected proof should evaluate:

- S3 Versioning for canonical master buckets;
- Object Lock mode and retention only after the owner and qualified policy owners define the exact obligation;
- same- or cross-Region replication into a separate AWS account/security boundary;
- independent backup inventory and integrity checks;
- lifecycle transition for superseded/archived masters without breaking retention;
- recovery of application metadata and exact object versions together; and
- periodic restore drills.

Object Lock is not automatically enabled for every asset. Compliance mode can make deletion impossible until expiry, so it must follow an approved retention schedule. Governance mode, legal hold, backup expiry, privacy deletion, evidence obligations, and incident preservation must not be improvised by implementation staff.

### 11.2 Processor exit

Exit from Cloudflare Images or Mux must not require reconstructing canonical originals from derivatives.

Maintain:

- exact S3 original and checksum;
- provider-neutral media identity;
- every provider asset/derivative ID;
- transformation recipe and version in application-owned form;
- output technical metadata and checksum;
- captions/transcripts in portable formats;
- rights, assignment, access, and publication state outside the provider;
- export/delete receipts where available; and
- a tested process to regenerate derivatives with a replacement provider.

Cloudflare Images export and Mux temporary master download are useful controls, but they are not the recovery source. Cloudflare/Mux deletion and cache behavior must be tested. External cached or received copies remain outside a deletion claim.

## 12. Pricing and planning assumptions

No actual launch catalog size, master byte volume, derivative count, 4K duration, protected playback volume, region, retention period, or traffic profile has been supplied. This document therefore records unit economics and cost drivers, not a fabricated monthly bill.

| Cost area | Current official evidence | Planning consequence |
|---|---|---|
| S3 storage | Region, storage class, bytes, requests, retrieval, transfer, replication, and lifecycle are separately billed | Model quarantine dwell, canonical bytes, versions, recovery copies, requests, and Cloudflare/Mux origin egress. |
| GuardDuty S3 malware | Billed by objects evaluated and GB scanned; current us-east-1 example is $0.09/GB scanned, with 1,000 requests and 1 GB monthly free allowance | Short catalog media should remain moderate, but rescans, duplicate uploads, and very large 4K masters increase cost. |
| Cloudflare Images | Current pricing advertises hosted-image storage/delivery and unique-transform pricing, including a 5,000-transform free allowance and paid usage thereafter | Cost scales with stored hosted copies, unique transformation variants, and delivery volume; avoid unbounded user-controlled dimensions. |
| Mux | Current pricing advertises free allowances and per-minute input/storage/delivery dimensions; current starting 4K figures are approximately $0.0096 per stored minute-month and $0.0032 per delivered minute | Encode and retain 4K only where decision value justifies it; public previews can default lower while explicit 4K remains available where approved. |
| AWS-to-provider transfer | S3 internet data transfer may apply when Cloudflare Images or Mux fetches a master | Count one controlled processor ingest per accepted master and prevent repeated origin refetch caused by unstable recipes or retries. |
| Recovery | Replicated versions, Object Lock retention, inventory, and restore testing add storage/request cost | Reliability/security preference accepts moderate extra cost, but retention and version sprawl require policy and budget alerts. |

The selected stack is a **moderate-cost, managed-control direction**, not the lowest-cost direction. R2 would likely reduce storage and egress expense, and Bunny Stream may reduce video delivery expense. The owner-selected S3/Mux direction prioritizes mature managed controls, reliability, and clearer security boundaries. Production approval requires an AWS Pricing Calculator model, provider quotes if applicable, budget alarms, and a representative proof workload.

## 13. Alternative findings

### 13.1 Cloudflare R2

R2 is the primary storage fallback when egress cost materially outweighs AWS control depth. It provides private-by-default storage, presigned operations, multipart uploads, strong consistency, Cloudflare bucket locks, S3-compatible tools, and no egress charges.

It was not selected because current official evidence does not establish an R2-native object malware scanner, S3-compatible object versioning, native bucket replication, S3 Object Lock, or AWS KMS-equivalent controls. Cloudflare WAF Malicious Uploads exists as an Enterprise add-on, but evidence did not establish coverage of direct R2 presigned/multipart traffic. A safe R2 design therefore needs an external scan service, application-owned version model, independent scheduled backup/export, and tested restore.

R2 bucket locks prevent deletion/overwrite while a rule applies, but rules can be removed. They must not be represented as equivalent to S3 Object Lock compliance mode.

### 13.2 Supabase Storage

Supabase provides the easiest TUS and RLS-based browser/mobile upload workflow. It remains viable for noncanonical application files when the application already uses Supabase.

It is rejected as the sole canonical master or protected-media store because official documentation establishes no S3 object versioning, permanent deletion semantics for deleted objects, and exclusion of Storage object bytes from database backups. Signed URL revocation can require support, and Smart CDN may serve a cached signed response beyond token expiry until its cache TTL. Those properties conflict with the required canonical recovery and D3 revocation posture unless substantial compensating infrastructure is added.

### 13.3 Cloudinary

Cloudinary is the premium operator/DAM alternative. It provides the strongest reviewed media-library experience, signed uploads, mobile/browser SDKs, rich metadata extraction, transformations, authenticated delivery, revision support, and optional customer-owned backups.

It is not selected because the reviewed paid DAM configuration introduces $99/$249 monthly plan tiers before annual discounts, credit-model forecasting, plan-specific image/video limits, proprietary transformation URLs, and configuration risk. A free tier exists but does not establish that the production control/volume requirements would remain free. Default `upload` delivery is public; `private` protects the original but still requires Strict Transformations for derivative control; `authenticated` is the safer class. CDN invalidation can lag and external caches remain outside control. No native upload malware scanner was established.

### 13.4 Cloudflare Stream

Cloudflare Stream provides very simple TUS/direct upload, signed playback, HLS/DASH, watermark profiles, and attractive minute-based pricing. Current official documentation states adaptive outputs from 360p through 1080p. It is therefore rejected where COM-ADM-01 requires a 4K-capable candidate.

Stream also does not return the exact uploaded original; only processed downloadable media can be generated. It could be reconsidered for public 1080p clips if the product requirement changes, but absence of 4K must not be presented as a temporary implementation assumption.

### 13.5 Bunny Stream

Bunny Stream is the strongest price challenger. Official documentation supports presigned TUS resume, 2160p premium encoding, token authentication, optional DRM, static watermarks, captions, and low storage/CDN unit prices.

It remains a proof challenger rather than the selected provider because upload-scan integration, operational maturity for this exact workload, revocation behavior, recovery, support, and D3 delivery require deeper proof. Bunny Shield advertises malware upload scanning for protected application/Pull Zone traffic, but evidence did not establish that it governs the separate Stream TUS endpoint. Bunny's Early Play feature can expose the original and must remain disabled for restricted media. Its retained original also does not replace S3 canonical storage.

## 14. Operational burden and lock-in

| Layer | Operational burden | Principal lock-in | Required mitigation |
|---|---|---|---|
| S3 | Medium/high: IAM, bucket policy, versioning, lifecycle, scan, events, replication, cost monitoring | AWS security/policy ecosystem; transfer charges | S3-standard object model, portable checksums/metadata, separate account backup, infrastructure review, restore drill |
| Cloudflare Images | Low/medium: recipes, private-origin auth, cache/invalidation | Transformation API/URL semantics and Cloudflare delivery | Keep exact masters in S3; store provider-neutral recipe intent; test regeneration with another processor |
| Mux | Low/medium: ingest, webhooks, captions, signed playback, deletion | Mux asset/playback model and streaming manifests | Keep exact originals/captions in S3/application records; no production fact depends only on Mux metadata |
| GuardDuty | Low/medium managed operation plus event/tag policy | AWS scan results and pricing | Record normalized scan outcome and engine context; retain a replaceable scanner boundary |

No provider dashboard becomes canonical Admin. Operators work through Blowin' Smoke Admin commands, and provider consoles remain break-glass/diagnostic surfaces with least privilege and auditable use.

## 15. Required proof and exit criteria

The selected stack remains unapproved until an isolated synthetic proof demonstrates:

### Upload and quarantine

1. Desktop multipart upload, interruption, retry, cancel, and idempotent finalization.
2. iPhone/iPad upload under Wi-Fi interruption, network switching, backgrounding, and process restart on declared supported versions.
3. Expired, reused, wrong-object, over-size, wrong-role, and unauthorized upload grants are denied.
4. Checksum mismatch, MIME spoof, malformed image/video, unsupported codec, archive/polyglot, parser timeout, and safe antivirus test artifact remain quarantined or rejected.
5. No unscanned object can be read by Admin, Cloudflare Images, Mux, or a storefront projection.

### Master and derivatives

6. Accepted master version is immutable and replacement creates a successor.
7. GPS/device metadata is absent from public derivatives while approved provenance remains in restricted canonical metadata.
8. Cloudflare Images produces required responsive outputs without a public original or unconstrained transformation abuse.
9. Mux ingests the exact accepted S3 version, produces representative 4K and lower renditions, and reports idempotent ready/failure webhooks.
10. Captions, transcript, keyboard/player controls, lower-bandwidth fallback, reduced-motion/static fallback, and color/detail fidelity pass review.

### Revocation and recovery

11. Rights withdrawal or media invalidation stops new publication/token issuance and records provider/cache propagation honestly.
12. Mux playback-ID deletion/revocation and Cloudflare invalidation are tested without claiming recall.
13. Exact S3 object versions plus transactional metadata restore from a separate recovery boundary.
14. A representative Cloudflare/Mux exit regenerates derivatives from S3 without losing assignments, rights, captions, or lineage.

### Protected Wholesale

15. Browser/PWA negative tests receive zero D3 bytes, identifiers, manifests, captions, posters, or metadata-rich errors.
16. D3 playback/derivative issuance is blocked until SEC-03 approves an exact client/platform and all current client/device/account/room/object signals pass.
17. Ordinary Save/Open Original/Share/Export paths remain absent in the approved-client proof; vendor tokens alone do not create a pass.
18. External-camera capture remains explicitly not preventable.

### Cost and provider diligence

19. Representative image/video volumes are run through an AWS/Cloudflare/Mux cost model with alarms.
20. Provider terms, DPA, subprocessors, breach notice, retention/deletion, training/analytics use, support, residency, law-enforcement process, export, and account termination are reviewed by qualified owners.

## 16. External evidence register

All sources in this section were accessed on **2026-08-17**. A feature described by a provider is documentation-supported, not execution-proven for Blowin' Smoke.

| Source | URL | Access date | What it establishes | What it does not establish |
|---|---|---|---|---|
| Amazon S3 presigned URLs | https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html | 2026-08-17 | Time-limited GET/PUT access without giving the client AWS credentials; permissions derive from the signing principal. | Resumability, malware safety, device binding, product truth, or protected-client approval. |
| Amazon S3 multipart upload | https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html | 2026-08-17 | Independent parts, retry/order behavior, completion, checksums, and incomplete-upload lifecycle considerations. | iOS browser background/restart behavior or an Admin user experience. |
| Amazon S3 object integrity | https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html | 2026-08-17 | Full/composite checksum verification and failure on checksum mismatch. | Correct MIME, safe decoding, absence of malware, or authenticity. |
| Amazon S3 Block Public Access | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html | 2026-08-17 | Account/bucket/access-point public-access blocking and effective evaluation. | Identity binding for a copied presigned URL or application authorization. |
| GuardDuty Malware Protection for S3 | https://docs.aws.amazon.com/guardduty/latest/ug/gdu-malware-protection-s3.html | 2026-08-17 | Automatic scan initiation for newly uploaded objects/new versions and result publication/tagging options. | Sanitization, safe media decode, rights, or product/evidence applicability. |
| GuardDuty S3 operation and feature support | https://docs.aws.amazon.com/guardduty/latest/ug/how-malware-protection-for-s3-gdu-works.html and https://docs.aws.amazon.com/guardduty/latest/ug/supported-s3-features-malware-protection-s3.html | 2026-08-17 | Scanned upload events, result states, isolated scan handling, encryption/versioning/replication/Object Lock support, and tag-based access compatibility. | Perfect detection, client-side encryption plaintext scanning, or a complete content-validation policy. |
| GuardDuty S3 quotas | https://docs.aws.amazon.com/guardduty/latest/ug/malware-protection-s3-quotas-guardduty.html | 2026-08-17 | Current 100 GB maximum object size attempted for scan and archive/depth/protected-bucket quotas. | Successful scanning of every object under the ceiling or support for larger files. |
| GuardDuty scan engine | https://docs.aws.amazon.com/guardduty/latest/ug/guardduty-malware-detection-scan-engine.html | 2026-08-17 | Managed file-based engines, signatures/YARA/heuristics/ML context, and absence of live behavioral analysis. | Infallible detection or safe application/media parsing. |
| Amazon S3 Object Lock | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html | 2026-08-17 | Versioning-dependent WORM retention, governance/compliance behavior, and legal holds. | The correct Blowin' Smoke retention period or automatic regulatory compliance. |
| Amazon S3 replication/Object Lock considerations | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html | 2026-08-17 | Replication of locked objects and retention metadata plus important irreversible configuration considerations. | Independent restoration proof or application-record recovery. |
| Amazon S3 pricing | https://aws.amazon.com/s3/pricing/ | 2026-08-17 | Storage-class, request, retrieval, transfer, replication, and related billing dimensions. | Actual Blowin' Smoke monthly cost without region/volume/request data. |
| Amazon GuardDuty pricing | https://aws.amazon.com/guardduty/pricing/ | 2026-08-17 | Object/GB scan billing, free allowance, and current regional example pricing. | Contracted future rate or final workload bill. |
| Cloudflare R2 presigned URLs | https://developers.cloudflare.com/r2/api/s3/presigned-urls/ | 2026-08-17 | Presigned GET/HEAD/PUT/DELETE, browser/mobile compatibility, expiration range, bearer-token warning, and no presigned POST/custom-domain support. | Malware scanning, resumability by itself, or D3 exact-client authorization. |
| Cloudflare R2 uploads and limits | https://developers.cloudflare.com/r2/objects/upload-objects/ and https://developers.cloudflare.com/r2/platform/limits/ | 2026-08-17 | Direct versus multipart guidance, resumable/parallel suitability, part/object limits, and incomplete-upload behavior. | Native object versioning, scan, metadata extraction, or backup. |
| Cloudflare R2 private/public buckets and security | https://developers.cloudflare.com/r2/buckets/public-buckets/ and https://developers.cloudflare.com/r2/reference/data-security/ | 2026-08-17 | Buckets are not public by default, explicit public enablement, TLS, and encryption at rest. | Customer-managed KMS equivalence, approved-device authorization, or recall. |
| Cloudflare R2 S3 compatibility | https://developers.cloudflare.com/r2/api/s3/api/ | 2026-08-17 | Implemented and unimplemented APIs, including absent S3 Versioning, Replication, Object Lock, KMS, and several policy operations. | That Cloudflare-specific features cannot partly compensate; exact future roadmap. |
| Cloudflare R2 bucket locks | https://developers.cloudflare.com/r2/buckets/bucket-locks/ | 2026-08-17 | Prefix/bucket retention rules preventing deletion/overwrite while configured. | S3 Object Lock compliance-mode equivalence; rules themselves can be removed. |
| Cloudflare R2 events, durability, export, and pricing | https://developers.cloudflare.com/r2/buckets/event-notifications/ ; https://developers.cloudflare.com/r2/reference/durability/ ; https://developers.cloudflare.com/r2/examples/rclone/ ; https://developers.cloudflare.com/r2/pricing/ | 2026-08-17 | Queue notifications, durability design, S3/rclone portability, storage/operation pricing, and no egress fees. | A complete scanner, object history, independent backup, or application restore. |
| Cloudflare malicious upload detection | https://developers.cloudflare.com/waf/detections/malicious-uploads/ | 2026-08-17 | Enterprise paid WAF inspection can scan incoming application uploads for malware. | Coverage of direct R2 presigned or multipart endpoints; low/moderate-cost availability. |
| Supabase Storage and TUS | https://supabase.com/docs/guides/storage and https://supabase.com/docs/guides/storage/uploads/resumable-uploads | 2026-08-17 | RLS-integrated Storage, signed upload tokens, TUS, direct storage host, browser/mobile resume patterns, CDN, and image optimization. | Native malware scanning, immutable masters, or exact-client D3 admission. |
| Supabase private buckets and access control | https://supabase.com/docs/guides/storage/security/access-control and https://supabase.com/docs/guides/storage/buckets/fundamentals | 2026-08-17 | Private-by-default buckets, JWT/RLS access, and service-role bypass risk. | Device-bound authorization or correct policies without application proof. |
| Supabase signed downloads and Smart CDN | https://supabase.com/docs/guides/storage/serving/downloads and https://supabase.com/docs/guides/storage/cdn/smart-cdn | 2026-08-17 | Signed URL behavior, support-dependent signing-key revocation, and cache TTL potentially outliving token expiry. | Immediate object recall, capture protection, or D3 compliance. |
| Supabase S3 compatibility, backup, and export | https://supabase.com/docs/guides/storage/s3/compatibility ; https://supabase.com/docs/guides/platform/backups ; https://supabase.com/docs/guides/storage/management/download-objects | 2026-08-17 | No S3 versioning, permanent deleted-object behavior, Storage bytes excluded from database backups, and S3/rclone export options. | Independent backup unless the customer implements it. |
| Supabase file limits and pricing | https://supabase.com/docs/guides/storage/uploads/file-limits ; https://supabase.com/docs/guides/storage/pricing ; https://supabase.com/pricing | 2026-08-17 | Plan/bucket size/type controls and current storage/egress allowances and overages. | Actual workload cost or media safety. |
| Cloudflare Images Direct Creator Upload and limits | https://developers.cloudflare.com/images/storage/upload-images/direct-creator-upload/ and https://developers.cloudflare.com/images/get-started/limits/ | 2026-08-17 | One-time upload URLs, signed-image option, Hosted Images 10 MB limit, and remote-transform size/pixel limits. | Suitability as an unrestricted high-resolution master store or native malware scanning. |
| Cloudflare Images private delivery and origin control | https://developers.cloudflare.com/images/optimization/hosted-images/serve-private-images/ and https://developers.cloudflare.com/images/optimization/transformations/control-origin-access/ | 2026-08-17 | Signed private-image delivery and authenticated private-origin request patterns. | Approved-device authorization, instantaneous recall, or screenshot prevention. |
| Cloudflare Images transforms, metadata, watermark, export, and pricing | https://developers.cloudflare.com/images/optimization/transformations/ ; https://developers.cloudflare.com/images/optimization/features/ ; https://developers.cloudflare.com/images/examples/watermark-from-kv/ ; https://developers.cloudflare.com/images/storage/manage-images/export-images/ ; https://developers.cloudflare.com/images/pricing/ | 2026-08-17 | Transform/overlay capability, metadata disposition, watermark example, original export, and current count/transformation pricing. | Robust personalized forensic watermark, product-truth fidelity without QA, or exact total cost. |
| Cloudinary uploads and metadata | https://cloudinary.com/documentation/client_side_uploading ; https://cloudinary.com/documentation/image_upload_api_reference ; https://cloudinary.com/documentation/upload_parameters | 2026-08-17 | Signed client uploads, chunking, media metadata extraction, delivery types, and default-public configuration behavior. | Native malware scanning, safe parsing, or automatic protected configuration. |
| Cloudinary access, backup, invalidation, and pricing | https://cloudinary.com/documentation/control_access_to_media ; https://cloudinary.com/documentation/backups_and_version_management ; https://cloudinary.com/documentation/invalidate_cached_media_assets_on_the_cdn ; https://cloudinary.com/pricing ; https://cloudinary.com/pricing/compare-plans | 2026-08-17 | Private/authenticated delivery, Strict Transformations, revisions/backups, cache-invalidation caveats, plan costs, credits, and file limits. | Immediate external-cache recall, D3 approved-client gate, or workload-specific bill. |
| Mux direct and iOS/iPadOS upload | https://www.mux.com/docs/guides/upload-files-directly and https://www.mux.com/docs/guides/upload-video-directly-from-ios-or-ipados | 2026-08-17 | Authenticated direct upload URLs, resumable chunks, client SDKs, iOS/iPadOS support and resume behavior. | Compliance with scan-before-ingest when used directly or Admin client execution proof. |
| Mux asset creation from URL | https://www.mux.com/docs/api-reference/video/assets/create-asset | 2026-08-17 | Mux can ingest the main video from an application-provided URL and associate application metadata. | That a presigned S3 URL is device-bound, nonreplayable, or safe if overly long-lived. |
| Mux 4K | https://www.mux.com/docs/guides/stream-videos-in-4k | 2026-08-17 | On-demand 2160p ingest/storage/delivery and distinction from live resolution. | Acceptable visual fidelity, cost, or device performance for Blowin' Smoke without proof. |
| Mux signed playback and DRM | https://www.mux.com/docs/guides/secure-video-playback and https://www.mux.com/docs/guides/protect-videos-with-drm | 2026-08-17 | Signed playback JWTs, expiry/restriction options, and optional DRM/license protection. | Screenshot/recording blocking, exact trusted-device identity, or full UI protection. |
| Mux watermark and master export | https://www.mux.com/docs/guides/add-watermarks-to-your-videos and https://www.mux.com/docs/guides/download-for-offline-editing | 2026-08-17 | Static overlay watermark and temporary equivalent-quality master access. | Per-viewer forensic watermark or byte-identical original recovery. |
| Mux pricing | https://www.mux.com/pricing and https://www.mux.com/docs/pricing/overview | 2026-08-17 | Current input/storage/delivery/DRM/custom-domain billing dimensions and free allowances. | Actual bill without duration, resolution, storage, playback, and region assumptions. |
| Cloudflare Stream overview and uploads | https://developers.cloudflare.com/stream/ and https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/ | 2026-08-17 | 360p-to-1080p adaptive output, one-time direct upload, and TUS for large/unreliable uploads. | 4K output; therefore it does not satisfy the required 4K candidate role. |
| Cloudflare Stream security, downloads, FAQ, and pricing | https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/ ; https://developers.cloudflare.com/stream/viewing-videos/download-videos/ ; https://developers.cloudflare.com/stream/faq/ ; https://developers.cloudflare.com/stream/pricing/ | 2026-08-17 | Signed playback, downloadable derivative controls, no exact-original download, file limits, and minute-based prices. | Capture prevention, personalized watermark, canonical-original recovery, or 4K. |
| Bunny Stream TUS and video specification | https://docs.bunny.net/stream/tus-resumable-uploads and https://docs.bunny.net/stream/video-specification | 2026-08-17 | Presigned resumable upload and supported 2160p inputs/outputs under Premium Encoding. | Scan-before-ingest, exact client admission, or production reliability for this workload. |
| Bunny Stream security, encoding, storage, and pricing | https://docs.bunny.net/stream/security-options ; https://docs.bunny.net/stream/encoding ; https://docs.bunny.net/stream/storage-structure ; https://docs.bunny.net/stream/pricing | 2026-08-17 | Token/domain controls, DRM options, static watermarks, original/early-play behavior, 4K encoding price, storage, and CDN prices. | Personalized watermark, capture blocking, exact-original backup discipline, or D3 release. |
| Bunny Shield upload scanning | https://docs.bunny.net/shield/upload-scanning and https://docs.bunny.net/shield/quickstart | 2026-08-17 | Shield can scan uploads passing through a configured protected application/Pull Zone. | That Shield scans the separate Bunny Stream TUS endpoint or qualifies as the selected quarantine scanner. |

## 17. Final outcomes

| Question | Outcome |
|---|---|
| Canonical media/evidence object store | **Amazon S3 — SELECTED FOR PROOF** |
| Canonical upload security boundary | **Private S3 quarantine + GuardDuty + isolated content validation — SELECTED FOR PROOF** |
| Canonical masters | **Versioned private S3; immutable application version model — SELECTED FOR PROOF** |
| Image derivatives | **Cloudflare Images — SELECTED FOR PROOF** |
| 4K video derivatives and adaptive streaming | **Mux — SELECTED FOR PROOF** |
| R2 | **PRIMARY COST/EGRESS ALTERNATIVE** |
| Supabase Storage as sole master/D3 store | **REJECTED** |
| Cloudinary | **PREMIUM ALTERNATIVE** |
| Cloudflare Stream for required 4K | **REJECTED — CURRENT OUTPUT CEILING 1080P** |
| Bunny Stream | **PROOF CHALLENGER** |
| Direct device-to-processor upload as canonical intake | **REJECTED FOR SELECTED FLOW — BYPASSES QUARANTINE-FIRST GATE** |
| Public original camera/master URL | **PROHIBITED** |
| Signed URL alone as D3 authorization | **FAIL** |
| Browser/PWA D3 media delivery | **FAIL / REJECTED BY GOVERNING SECURITY DECISION** |
| Personalized forensic watermark from selected vendors | **NOT ESTABLISHED** |
| Production implementation | **NOT AUTHORIZED** |
| Provider account/contract commitment | **NOT AUTHORIZED** |
| Private Wholesale release | **NOT AUTHORIZED** |

The selected stack is feasible enough to enter an isolated proof and commercial/security diligence gate. It is not yet proven operationally, contractually, financially, or as a protected-wholesale client path.
