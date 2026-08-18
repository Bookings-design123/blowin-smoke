# COM-ADM-02A — Day-1 Media and Backup

**Decision:** One canonical object-storage provider; minimal image/video processing; layered tested recovery
**Canonical media store:** Private Amazon S3
**Specialist image/video SaaS:** Deferred
**Production resources:** Not created

## 1. Day-1 media topology

```text
AUTHORIZED IPHONE / DESKTOP UPLOAD
        |
        v
PRIVATE S3 QUARANTINE — OPAQUE ONE-OBJECT GRANT
        |
        +-- checksum / length / declared type
        +-- GuardDuty malware result
        +-- magic bytes / safe parser or decoder / bounded resources
        +-- technical metadata / privacy metadata disposition
        v
IMMUTABLE-KEY S3 MASTER OR EVIDENCE VERSION
        |
        +-- canonical PostgreSQL MediaMasterVersion / EvidenceDocumentVersion
        +-- rights / subject / applicability / review / assignment state
        v
SANITIZED WEB-SOURCE DERIVATIVE
        |
        +-- fixed responsive image set -> private S3 origin -> CloudFront OAC
        +-- H.264/AAC MOV/MP4 -> bounded automatic MP4 remux -> CloudFront Range delivery
```

This preserves COM-ADM-02's private canonical intake while avoiding Cloudflare Images and Mux on Day 1. CloudFront, S3, GuardDuty, KMS, and the backup archive remain one AWS vendor boundary, with separate roles/accounts where blast-radius separation matters.

## 2. Required upload and promotion behavior

### Admission

The server authorizes an upload only after current owner, active Admin device/session, exact capability, intended asset class, and target context pass. A short-lived grant is bound to one opaque quarantine key, size/type policy, checksum when available, expiry, actor, purpose, and idempotency key. It cannot list a bucket, choose an arbitrary key, read another object, change ACLs, or overwrite an accepted master.

### Quarantine and validation

Every completed upload remains non-readable by ordinary application/delivery roles until all required results exist:

- multipart completion and checksum/byte-length confirmation;
- accepted GuardDuty result for the exact object version;
- extension, declared type, magic byte, parser/decoder, dimension/duration, codec/container, and decompression-limit validation;
- privacy metadata removal/disposition;
- immutable technical/provenance record and processing audit.

GuardDuty does not prove safe decoding, correct format, rights, product truth, or evidence applicability. Missing, unsupported, timed-out, failed, or inconsistent scan/validation state remains denied. A human cannot toggle a failed object to clean.

### Promotion and publication

Promotion creates a new immutable-key master/evidence version and canonical record. Publication is a separate command requiring assignment, rights, alt/caption, subject/scope, evidence applicability, channel, and approved derivative state. Replacing a file creates a successor; it does not overwrite history.

Original masters, COAs, evidence, quarantine objects, and private-wholesale classes are never exposed through public delivery.

## 3. Day-1 image decision

The retained isolated application processing step creates a small fixed set of sanitized JPEG/WebP/AVIF delivery derivatives using a versioned recipe. The storefront renders a responsive `picture`/`srcset` against those immutable versioned CloudFront paths. S3 remains private behind Origin Access Control. Vercel renders the page but does not create a second transformation cache on Day 1.

Vercel/Next Image Optimization is deferred with the specialist processors. This revision removes a second cache/invalidation boundary and makes each public derivative directly traceable to a canonical recipe and publication version.

Cloudflare Images is `DEFER_UNTIL_TRIGGER`, even though its current free/low-cost allowances are attractive. Provider cost alone does not justify a second integration, copy/projection state, revocation surface, and exit procedure for fewer than 100 products.

Activate it only when measured evidence shows one or more of:

- derivative recipes/variants or processing cost materially outgrow the fixed Day-1 set;
- specialized overlays, private variants, multi-client delivery, or transformation controls are required;
- a cost model proves specialist delivery materially simpler or cheaper without weakening canonical ownership.

## 4. Day-1 ordinary video decision

Mux is `DEFER_UNTIL_TRIGGER`. Day 1 may progressively deliver only a validated browser-compatible H.264 video with AAC audio in the approved MP4 profile. CloudFront Range requests support efficient partial delivery, but this is not adaptive streaming.

The owner-operable Day-1 path is explicit:

1. Before capture/import, the Admin shows tested iPhone **Most Compatible** guidance and the accepted publication profile.
2. The owner captures/selects and uploads through the same Admin; no developer, source change, or deployment is involved.
3. Validation identifies container, codecs, dimensions, duration, audio, and limits.
4. A bounded isolated AWS worker automatically remuxes accepted H.264/AAC MOV or MP4 input into the approved MP4 delivery container without re-encoding, then validates the result.
5. The Admin presents the derivative status and a representative playback check before publication.
6. HEVC, ProRes, unsupported audio, or any source requiring re-encoding remains safely stored but unpublished with an actionable instruction to recapture/export a Most Compatible source. It never becomes a developer ticket by default; a repeated real need is the Mux trigger.

Apple documents that iPhones can produce HEIF/HEVC by default and ProRes files can be substantially larger. Therefore arbitrary iPhone media is never assumed storefront-compatible, and the exact iPhone/OS/browser/worker flow must pass COM-ADM-03 execution proof.

### Captions and transcript gate

Accessibility does not wait for Mux. Before publishing video, the owner must classify audio as meaningful or non-meaningful. Meaningful spoken/informational audio requires a reviewed manual transcript and synchronized caption track in the approved provider-independent format. Silent/decorative video requires an appropriate text alternative and must not communicate unavailable information through motion alone. Missing, stale, failed, or unreviewed required text/caption state blocks publication.

Day 1 supports owner-authored/pasted transcript and caption upload/edit/review inside the Admin. Generated captions may be added later, but they never bypass human review or the fail-closed publication rule.

Activate Mux when a real production asset requires:

- 4K or adaptive-bitrate streaming;
- managed HEVC/ProRes or mixed-codec normalization;
- reliable generated captions/thumbnails or video workflow state;
- measured cross-device playback that progressive MP4 cannot satisfy;
- delivery/processing volume for which managed video is operationally safer.

Mux Free/PAYG allowances do not remove the integration, lifecycle, privacy, failure, and exit work. The adapter remains designed so activation does not change canonical master ownership.

## 5. Evidence/COA requirements

Evidence uses the same secure intake but a separate artifact class and access policy. Required canonical fields include:

- versioned document and checksum;
- issuer/source and received date;
- subject and exact product/SKU/lot/batch applicability;
- evidence/claim type and scope;
- effective/expiry/review state;
- supersession/correction lineage;
- visibility and permitted channels;
- actor, rights/provenance, and review evidence.

A document name, uploaded URL, apparent product similarity, or supplier statement is not automatically applicable proof. Evidence masters are never image-optimization inputs.

## 6. Public unpublish, revocation, and cache propagation

Public delivery derivatives are separate disposable copies with opaque immutable versioned keys. Masters and evidence are never deleted merely to unpublish a derivative.

An archive, unpublish, rights revocation, evidence revocation, or successor command must:

1. atomically change canonical publication/assignment state and write audit/outbox evidence;
2. remove current storefront/search references through the projection worker;
3. disable/delete the affected public delivery copy while preserving the private master and lineage as policy permits;
4. issue CloudFront invalidation for the exact versioned paths;
5. expose projection and invalidation state as `PENDING`, `SUCCEEDED`, or `FAILED`, with retry and owner alert;
6. prevent a failed propagation from being represented as fully complete.

Exact public-cache TTL and emergency-revocation objectives remain proof decisions. COM-ADM-03 must test stale URL reuse, direct CloudFront path requests, invalidation delay/failure, successor versioning, storefront/search removal, and recovery. The system cannot recall a file already saved or copied outside controlled delivery; it must not claim otherwise.

## 7. Proportionate database recovery

Day 1 retains a real recovery system without building multi-region enterprise disaster recovery.

1. Configure Neon Launch for its full seven-day restore-history window.
2. Run a nightly custom-format `pg_dump -Fc` using the direct, non-pooled connection.
3. Create a checksum and manifest recording database identity, timestamp, PostgreSQL/`pg_dump` version, schema/migration identity, byte length, encryption reference, and result.
4. Encrypt and write the export to a versioned S3 Object Lock bucket under a separately controlled AWS account/bucket/credential boundary.
5. Give the backup writer append-only authority; it cannot delete objects or reduce retention.
6. Monitor job success and archive freshness through the aggregate operations pulse.
7. Restore into an independent clean PostgreSQL target before any pilot, quarterly thereafter, and after material schema/PostgreSQL/tool/encryption/provider change.
8. Reconcile row counts, migration identity, inventory invariants, audit checkpoints, outbox state, and selected canonical records after restore.

The independent-copy planning RPO is up to 24 hours unless a later owner decision requires tighter. RTO must be measured, not promised, during the restore proof.

An AWS Lambda container plus EventBridge Scheduler is a feasible low-frequency runner, but Lambda's execution ceiling and the complete dump/encrypt/upload/alert path require execution proof. If the dump approaches that ceiling, a longer-running managed container job becomes the activation trigger.

S3 is off-provider relative to Neon. Reusing AWS for media and database archive reduces provider count; separate account, bucket, keys, roles, retention, and recovery authority prevent the application credential from deleting its own backups.

## 8. Media recovery and exit

One canonical store is not one copy:

- enable versioning and immutable master keys;
- maintain canonical checksums/manifests and periodic object-inventory reconciliation;
- copy accepted masters/evidence to a separately controlled recovery bucket/account under approved retention;
- test retrieval, decryptability, checksum equality, metadata/assignment reconstruction, and successor lineage;
- export canonical PostgreSQL metadata plus exact objects without depending on CloudFront, Vercel, or a future derivative processor;
- document R2 or an encrypted offline/object-store export as a later provider-diversity option, not a silent Day-1 authority switch.

Object Lock and versioning do not prove completeness or restoration. A restore test is the evidence.

## 9. Protected-wholesale boundary

This topology supports public retail derivatives and authorized internal Admin media. It does not authorize browser/PWA delivery of D3/D4 Private Wholesale content. CloudFront private origins, signed URLs, Mux, DRM, watermarking, MFA, or S3 permissions cannot replace the approved-client capture/extraction/resource/device/accessibility gate. Protected payload remains zero until that separate gate passes.

## 10. Media and backup evidence register

All sources were accessed 2026-08-17.

| Source | URL | What it establishes | What it does not establish |
|---|---|---|---|
| S3 presigned URLs | https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html | Time-bounded bearer upload/access mechanisms and policy considerations | Safe file contents, application authorization, or publication |
| S3 multipart upload | https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html | Multipart upload lifecycle and checksums | Browser background continuity or complete Admin UX |
| GuardDuty pricing/capability | https://aws.amazon.com/guardduty/pricing/ | Current malware-protection billing dimensions/free allowance | Safe decode, correct type, rights, applicability, or exact bill |
| CloudFront private S3 origins | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html | Origin Access Control for HTTPS access to private S3 origins | Application authorization, transformation, or protected-client approval |
| CloudFront Range requests | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RangeGETs.html | Byte-range forwarding/caching behavior | Adaptive streaming, codec compatibility, or playback quality |
| CloudFront plans | https://docs.aws.amazon.com/PricingPlanManager/latest/UserGuide/plans.html | Current flat-rate allowances and eligibility conditions | Blowin' Smoke enrollment, exact invoice, or workload fitness |
| Vercel image optimization | https://vercel.com/docs/image-optimization and https://vercel.com/docs/image-optimization/limits-and-pricing | Supported optimization path, formats, limits, and billing dimensions | Safe source, rights, master storage, or final cost |
| Cloudflare Images pricing/limits | https://developers.cloudflare.com/images/pricing/ and https://developers.cloudflare.com/images/get-started/limits/ | Current transform/storage/delivery units and limits | Need, configured security, or canonical ownership |
| Mux pricing/4K | https://www.mux.com/pricing and https://www.mux.com/docs/guides/stream-videos-in-4k | Current allowances/rates and supported 4K workflow | Need, exact bill, rights, or protected-client approval |
| Apple media formats | https://support.apple.com/en-us/116944 and https://support.apple.com/en-us/109041 | iPhone HEIF/HEVC compatibility settings and ProRes size/behavior | That any uploaded file is browser-compatible or safe |
| PostgreSQL `pg_dump` | https://www.postgresql.org/docs/current/app-pgdump.html | Portable logical export modes and custom archive behavior | Scheduling, encryption, completeness, or achieved restore |
| S3 Object Lock | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html | WORM retention behavior and versioning requirement | Dump completeness, decryptability, or restorability |
| AWS KMS/Lambda/EventBridge pricing | https://aws.amazon.com/kms/pricing/ , https://aws.amazon.com/lambda/pricing/ , https://aws.amazon.com/eventbridge/pricing/ | Current billing units/free allowances | Final bill or successful job execution |

All costs remain planning evidence. Region, request mix, bytes, scans, transforms, transfer, retention, and actual client behavior must be proved and repriced before procurement.
