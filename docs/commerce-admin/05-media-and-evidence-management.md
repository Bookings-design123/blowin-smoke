# Media and Evidence Management

**Document role:** Governing COM-ADM-01 media, rights, evidence, and COA architecture
**Architecture status:** Logical architecture defined; provider and implementation choices remain open
**Live media pipeline:** Not implemented
**Production implementation authorized:** No
**Private Wholesale release authorized:** No

## 1. Purpose and boundary

Blowin' Smoke Admin must let an authorized owner or staff member upload, review, assign, reorder, replace, publish, protect, unpublish, and archive media and evidence without editing GitHub, committing source, deploying code, invoking Codex, or manually constructing storage URLs.

GitHub owns source code, schemas, migrations, releases, architecture, and documentation. It does not own live media assignments, evidence state, publication state, or any other operational commerce record. The canonical commerce application and its persistent operational stores own those records.

This document governs:

- media identity, masters, derivatives, assignments, rights, and lifecycle;
- owner-operated upload and processing;
- public, internal, and protected-wholesale media delivery classes;
- evidence and COA identity, version, provenance, scope, status, and replacement;
- the administrative commands, projections, audit evidence, and failure states needed to operate them; and
- archival, retention, export, and deletion boundaries.

It does not select an object store, database, image service, video transcoder, CDN, malware scanner, DRM system, watermark vendor, evidence vendor, or admin framework. It does not redesign the protected-client security architecture.

## 2. Governing invariants

1. A binary object is not, by itself, product truth, proof, publication approval, or a governed assignment.
2. A media upload never auto-publishes and an evidence upload never auto-verifies a claim.
3. A media master is immutable. Replacement creates a new identifiable version and preserves lineage.
4. A derivative is reproducible output tied to an exact master version and transformation recipe; it never becomes the canonical master.
5. A media assignment is independently scoped to its exact subject, role, channel, order, rights, and effective state.
6. A COA or other evidence record applies only to the exact product, variant, lot/batch, sample, and time scope established by authoritative evidence. Similar names are not applicability evidence.
7. `CURRENT` means applicable and within the governing currency rule; it does not mean favorable.
8. Public publication requires current rights and governed approval. Existence in Admin or Private Wholesale does not authorize public disclosure.
9. Public media, restricted wholesale media, E2EE attachments, and evidence documents remain distinct classes with distinct access and transformation rules.
10. Browser/PWA clients receive zero D3/D4 Private Wholesale protected payload. No admin role, URL, feature flag, or user-agent claim may bypass that boundary.
11. No protected wholesale client is currently approved. An "authorized admin app" is a future trust boundary, not an approved client today.
12. Archive, unpublish, assignment removal, replacement, and deletion are different operations.
13. Historical orders and audit records retain stable references to the versions that informed them even after current media or evidence changes.
14. A failure to scan, validate, derive, authorize, audit, or propagate remains visible and cannot be reported as success.

## 3. Canonical records and ownership

| Record | Canonical owner | Required semantics | Not owned by this record |
|---|---|---|---|
| `MediaAsset` | Media and Rights | Stable asset identity, media class, creator/source, capture/received time, technical identity, checksum, classification, lifecycle | Product facts, proof applicability, channel publication |
| `MediaMasterVersion` | Media and Rights | Immutable original bytes reference, exact asset version, validation results, metadata disposition, predecessor/successor | Public URL, storefront role, product truth |
| `MediaDerivative` | Media and Rights | Exact master version, derivative type, transformation recipe/version, dimensions/duration/codec where applicable, checksum, status, access class | Canonical master, product identity, publication approval |
| `MediaAssignment` | Media and Rights | Asset/version or approved derivative, exact subject scope, semantic and delivery role, sort order, alt/caption, crop/focal intent, channel/access class, validity | Subject identity, rights evidence, evidence verification |
| `MediaRightsRecord` | Media and Rights | Source/creator, rights basis, allowed uses/channels/regions if applicable, attribution, restrictions, effective/expiry context, evidence and review state | Product claims or supplier authority beyond its documented scope |
| `EvidenceRecord` | Evidence/Proof | Stable identity for the evidence proposition or expected proof, type, source, issuer, subject, status, currency rule reference | Automatic claim acceptance or product identity |
| `EvidenceDocumentVersion` | Evidence/Proof | Immutable document bytes reference, document version, checksum, format, source, received time, predecessor/successor, access class | Applicability to any product/variant/lot without a relationship |
| `EvidenceApplicability` | Evidence/Proof | Exact document version and product/variant/lot/batch/sample/time scope, basis, verifier/review state, effective state | Unscoped category-wide truth or name-based matching |
| `EvidenceReview` | Evidence/Proof | Reviewer authority, source checks, scope decision, status transition, reason, time, conflicts and supporting references | Silent mutation of the source document |
| `ClaimEvidenceLink` | Claim owner plus Evidence/Proof | Exact claim/version to exact applicability/version, permitted display context | Claim wording, publication, or compliance policy itself |

Binary objects live in governed object/media storage. Canonical metadata, rights, applicability, lifecycle, and assignments live in transactional records. Search indexes, storefront projections, thumbnails, caches, and dashboards are consumers, not owners.

## 4. Media identity, role, and assignment model

### 4.1 Master and derivative distinction

A `MediaAsset` has one or more immutable `MediaMasterVersion` records. A replacement creates a successor version; it does not overwrite bytes under the old version. A `MediaDerivative` identifies:

- source asset and exact master version;
- derivative purpose and access class;
- transformation recipe and recipe version;
- output technical metadata and checksum;
- processing status and failure category;
- creation time and processing correlation; and
- invalidation, supersession, or archive state.

The architecture must support at least:

- image derivative;
- video derivative;
- thumbnail;
- card derivative;
- PDP derivative;
- high-resolution inspection derivative;
- protected-wholesale derivative;
- visible-watermarked derivative; and
- adaptive streaming derivative and its authorized manifest/segment set.

Original camera masters are not direct storefront or wholesale delivery objects.

### 4.2 Assignment has two role dimensions

The assignment separates what the image communicates from where it is delivered.

**Semantic roles** may include:

- `IDENTITY`;
- `SCALE`;
- `CONNECTION`;
- `CONTENTS`;
- `ASSEMBLY`;
- `MATERIAL_CRAFT`;
- `USE_CONTEXT`;
- `VARIANT`;
- `PACKAGING`; and
- `PROOF_SUPPORT`.

**Delivery roles** may include:

- `THUMBNAIL`;
- `CARD`;
- `PDP_PRIMARY`;
- `PDP_GALLERY`;
- `PDP_DETAIL`;
- `INTERNAL_REVIEW`;
- `WHOLESALE_PROFILE`;
- `WHOLESALE_HIGH_RES`; and
- `WHOLESALE_VIDEO`.

Every assignment records the exact product, variant, SKU, lot/batch, evidence, or other approved subject; channel and access class; position; alternative text/caption; crop/focal intent; effective state; source assignment version; and rights decision. One asset may serve multiple assignments only when each is truthful and independently authorized.

Alt text describes the assigned media job using verified information. It must not smuggle in specifications, potency, effects, genetics, composition, source, included contents, scale, compatibility, or proof that the governed product records do not establish. Media alone never proves those facts.

## 5. Owner-operated upload pipeline

The governing pipeline is:

```text
UPLOAD
  -> VALIDATE
  -> SECURITY SCAN
  -> METADATA EXTRACTION
  -> MASTER STORAGE
  -> DERIVATIVE GENERATION
  -> ROLE ASSIGNMENT
  -> PUBLISH OR PROTECT
  -> ARCHIVE OR REPLACE
```

### 5.1 Upload admission

Admin requests a short-lived, one-purpose upload authorization tied to the authenticated actor, intended asset class, expected object, size boundary, correlation, and expiry. The upload enters non-public quarantine. The client never supplies a public object key or canonical storage path.

The planned intake supports product photos, high-resolution/4K-equivalent stills, 4K video, and separately validated evidence/COA documents. Declaring an intended class selects validation and processing policy; it does not establish the file's actual type, rights, scope, safety, or publication eligibility.

An upload request and its completion are idempotent. A checksum match may suggest an existing object, but the system must not silently reuse it because rights, source, scope, or classification may differ. Reuse requires an explicit governed decision.

The initial acknowledgement returns an opaque operation/asset reference and processing state, not a durable public or protected-content URL.

### 5.2 Required validation and security scanning

No operator, including the owner, bypasses the file gate. The future implementation must:

- compare extension, declared content type, file signature, and safe parser/decode result rather than trusting a filename;
- enforce allowlisted media/document classes and separately approved size, pixel, duration, frame-rate, container, codec, page-count, and decompression limits;
- reject executables, scripts, active content, malformed/polyglot content, nested archives, decompression bombs, unsupported codecs, and parser failures;
- scan with an approved malware/content-safety boundary and retain scan engine/signature/version outcome without placing sensitive file content in logs;
- extract only required technical metadata;
- remove GPS, device serial, and other unnecessary embedded metadata from delivery derivatives while preserving any separately authorized provenance record under restricted access;
- compute integrity checksums and bind all later processing to the validated master version;
- keep `PENDING`, `QUARANTINED`, `REJECTED`, `PROCESSING_FAILED`, and `READY` distinct; and
- fail closed: an unknown, timed-out, stale, or unavailable scan/validation result cannot become ready or publishable.

Exact limits, formats, scan engines, parser isolation, quarantine duration, and retry policy are provider/technology and owner-security decisions. They are not invented here.

### 5.3 Processing and publication

Derivative generation occurs only from the validated master. Every output is linked to its recipe/version and checksum. Failed derivatives remain failed; the system may use an honest textual or previously approved fallback but must not substitute similar product media.

Role assignment does not publish. Publication requires, for the exact assignment and target channel:

- a ready approved derivative;
- current source and rights decision;
- exact subject and variant/lot scope where material;
- accessible alternative text/caption where required;
- an allowed access class;
- a current subject/publication version; and
- an authorized, audited publish command.

The command and its outbox event commit durably before Admin reports success. Projection/cache invalidation may be asynchronous, but lag or failure remains visible.

## 6. Media operations and concurrency

Admin must eventually expose these governed operations:

| Operation | Governing behavior |
|---|---|
| Upload | Create a quarantined candidate and begin validation; never auto-publish |
| Assign | Bind an approved asset/version to exact subject, role, position, channel, and rights context |
| Reorder | Update assignment order under an optimistic version check; no last-write-wins |
| Replace | Create/choose a new master version or asset, validate it, atomically supersede selected assignments, and preserve predecessor lineage |
| Archive | Remove asset/version from new assignments and current delivery according to policy while retaining governed history |
| Unpublish | Remove one or more delivery assignments without deleting the asset or rights/evidence records |
| Restore | Re-evaluate current validation, rights, scope, and publication readiness; archive reversal is not automatic republication |
| Invalidate | Suppress affected assignments immediately, publish invalidation, and retain reason/authority/history |

Consequential media writes require expected record/assignment versions. A media replacement during an active customer session cannot silently change an order snapshot or produce a mix of old and new derivatives. Projections identify the exact assignment and asset version they consumed; current pages refresh or fall back when invalidated. An active transfer may complete only according to the later-selected delivery system's tested revocation semantics—never by an invented recall claim.

Bulk assignment, reorder, archive, and replacement retain per-record validation, result, and audit. One failure must be represented explicitly; atomic-all versus partial-commit behavior is an operation-specific implementation decision and must be declared before execution.

## 7. Rights and provenance

Each publishable asset requires a `MediaRightsRecord` with, at minimum:

- source and responsible party;
- creator/owner where known;
- acquisition method and source reference;
- rights basis and supporting record;
- allowed media uses, channels, transformations, and audiences;
- attribution requirement;
- geographic or temporal restriction where applicable;
- effective, review, expiry, withdrawal, or dispute state;
- accountable reviewer and decision; and
- predecessor/successor and affected assignments.

Rights states remain distinct, including `PENDING_REVIEW`, `APPROVED`, `RESTRICTED`, `EXPIRED`, `WITHDRAWN`, `DISPUTED`, and `REJECTED`. The exact policy and terminology may be refined, but no blank state is treated as approval. Expiry, withdrawal, or dispute invalidates affected publication until an authorized review says otherwise; it does not erase prior use or audit history.

Supplier delivery of a file does not automatically grant publication, transformation, high-resolution wholesale, watermark, or marketing rights. A public-media approval does not automatically approve protected-wholesale use, and vice versa.

## 8. Evidence and COA governance

### 8.1 Evidence identity and scope

An evidence record must support, where applicable:

- `type`;
- `source` and source type;
- `issuer` or laboratory/maker/manufacturer/receiving authority;
- stated subject/sample identity;
- document identifier and immutable version;
- issued, tested/observed, received, effective, and expiry/review dates when supplied;
- exact product scope;
- exact variant/SKU scope;
- exact lot/batch/sample scope;
- applicability basis and any material conditions;
- current status and currency-rule reference;
- rights/access classification; and
- review actor, authority, reason, and evidence.

An `EvidenceRecord` may exist without an accessible document to represent `MISSING` or `NOT_SUPPLIED`. An `EvidenceDocumentVersion` may exist without a valid applicability relationship and therefore remain `UNMATCHED` or `PENDING_VERIFICATION`.

### 8.2 Required evidence states

| State | Meaning and consequence |
|---|---|
| `PENDING_VERIFICATION` | A candidate record/document exists and a defined review is incomplete; it cannot support an approved current claim |
| `CURRENT` | Source, exact scope, applicability, and governing currency requirements are satisfied; this says nothing about whether a result is favorable |
| `STALE` | A previously accepted record is outside its governing currency/review rule; it cannot support a positive current claim that requires currency |
| `MISSING` | An expected accessible record is absent; the absence remains explicit |
| `NOT_SUPPLIED` | The accountable source has not supplied the expected evidence; distinct from technical access failure |
| `UNMATCHED` | Evidence exists but cannot be tied to the selected product/variant/lot/batch/sample |
| `CONFLICTING` | Relevant accepted or candidate sources disagree; all source values and the conflict remain visible to authorized reviewers |
| `SUPERSEDED` | A newer governed version controls current use; the previous version remains in history |
| `ARCHIVED` | Retained for history/obligation and unavailable for current positive use |
| `UNKNOWN` | The system cannot make a reliable determination; unknown never becomes current |

Blank storage is not a semantic state. A system rule may flag staleness, missing material, or a conflict; only the accountable evidence owner or authorized verifier may resolve truth unless a qualified deterministic rule has been approved.

### 8.3 Review and claim separation

Upload begins as `PENDING_VERIFICATION`. Review must establish document integrity, source/issuer, exact subject/sample identifiers, date/currency, rights, and applicability. Optical extraction, filenames, URLs, media metadata, product-title similarity, supplier assertions, and automated classification are candidate inputs—not verification.

An evidence reviewer may accept or reject applicability; they do not thereby alter the source document. An approved applicability relationship may support a separately governed `ClaimEvidenceLink`. The claim owner still governs claim class, wording, display permission, and correction.

The system must not invent or infer potency, genetics, effects, source, cultivation, composition, availability, maker/provenance, compatibility, or proof. Laboratory evidence governs only the results and scope it actually establishes. Competitor research has zero catalog-authority status.

### 8.4 COA replacement and batch safety

COA replacement is a high-risk versioned operation:

1. ingest and validate a new immutable document version;
2. review its issuer, subject/sample, dates, exact product/variant/lot/batch scope, and rights;
3. require the current applicability version and an authorized reason;
4. create a successor relationship rather than overwriting the prior document;
5. mark prior applicability `SUPERSEDED`, `STALE`, or another truthful state only after the new review commits;
6. re-evaluate affected claims, publication readiness, carts, support views, and evidence projections;
7. preserve exact document/applicability references already recorded on historical orders; and
8. alert on failed propagation or unresolved conflict.

A COA for Batch A never validates Batch B without explicit authoritative applicability. Whether a missing, stale, conflicting, or unmatched COA blocks sale, fulfillment, or only a proof claim remains a qualified legal/compliance and product-policy decision. The architecture must be able to enforce the eventual decision without fabricating one now.

## 9. Protected-wholesale media boundary

The governing hybrid classification remains unchanged:

- private reference price, current private availability/count, evidence-backed profile/proof, high-resolution catalog photos, 4K catalog video, personalized derivatives, and the final manifest are D3 restricted server-authorized content;
- designated customer–representative messages and explicitly approved one-to-one negotiation attachments are D4 E2EE content; and
- approved public media/proof facts are D0 only after separate publication approval.

For D3/D4 Private Wholesale presentation:

1. browser and PWA routes return zero protected payload, identifier-rich preview, preload, service-worker entry, cache object, or metadata-rich error;
2. an admin website may show nonsensitive operation state and opaque references but cannot render private wholesale prices, counts, profiles, proof, protected photos/video, manifests, or E2EE plaintext;
3. upload acknowledgement never confers read/reveal authority; any protected review requires an independently approved protected client;
4. no approved protected client currently exists, including on iOS/iPadOS; SEC-03A remains conditional pending physical proof;
5. a future signed client must revalidate supported build, trusted endpoint/device, account/room/object grant, exact asset/version, purpose, expiry, and revocation before each reveal;
6. missing, unknown, stale, revoked, unsupported, or mismatched mandatory evidence fails closed before payload delivery;
7. protected assets have no public/predictable object enumeration, stable original URL, persistent private cache, offline master, prefetch, or ordinary Copy, Forward, Save, Download, Share, Open Original, Print, Drag, or Export path;
8. an approved client must exclude or redact the complete protected surface from every supported screenshot and screen-recording path in its declared platform boundary; one readable protected frame fails the gate;
9. high-resolution stills use fit-for-inspection derivatives rather than camera masters;
10. 4K delivery, if later approved, uses short playback authorization and authorizes manifests, segments, keys/licenses, captions, and posters—not merely the first request;
11. visible pseudonymous watermarks are defense in depth, never capture prevention or proof of a leaker; and
12. external-camera capture, manual transcription, privileged extraction, and compromised endpoints remain outside the supported prevention claim.

The preferred authorization order is an authenticated media-gateway request with current server authorization, then a narrowly scoped header/cookie or one-resource lease. A signed URL is permitted only if unavoidable and later approved: it must be very short-lived, contain no PII or canonical business identifier, avoid navigation/referrer exposure, and be redacted from logs. Source IP alone never proves identity.

Server-decryptable D3 assets may be exposed to an authorized origin, transform/transcode, watermark, object, CDN, or observability boundary. Each such boundary requires an approved disclosure contract. D4 attachments remain ciphertext to intermediary object/CDN services; moving selected D4 content into catalog, proof, quote, order, support, or incident truth requires deliberate declassification, target-domain validation, a receipt, and correction lineage.

## 10. Accessibility and product truth

Every relevant assignment must support:

- truthful alternative text based on verified facts;
- captions and transcript for video;
- keyboard and assistive-technology operation;
- no autoplay and respect for reduced motion;
- lower-bandwidth alternatives and explicit high-resolution/4K choice;
- watermark placement that does not obscure proof text, captions, color, texture, measurements, or product detail; and
- the same authorization on accessible alternatives as on their visual source.

Canvas-only text, inaccessible image text, or blocked selection cannot be used to deprive an authorized customer or staff member of material order facts. A future protected client must separately prove its accessible semantics; weakening accessibility is not an acceptable capture-control substitute.

## 11. Commands, queries, events, and projection rules

### 11.1 Command families

The canonical API must eventually support vendor-neutral commands for:

- initiate/finalize/cancel media upload;
- retry approved media processing;
- assign, reorder, unassign, replace, invalidate, archive, and restore media;
- approve/restrict/withdraw media rights;
- attach evidence, create applicability, begin/complete review, mark status, replace/supersede, archive, and restore;
- link/unlink an approved evidence version to a governed claim; and
- publish/unpublish a specific approved assignment.

Every mutation carries actor/service identity, capability, purpose/reason, idempotency/correlation, expected record version, target scope, and classification. Commands validate canonical subject state and never accept a search document, cache value, filename, or storage URL as authority.

### 11.2 Query families

Admin read models may expose:

- processing queue and failures;
- unassigned/assigned assets;
- assignments by product, variant, lot/batch, role, channel, rights, or state;
- missing-media and rights-review signals;
- evidence by document, issuer, product, variant, lot/batch, date, state, or conflict;
- publication-impact preview; and
- immutable history and propagation state.

Queries are projections. They never authorize publication, evidence acceptance, or protected-resource delivery. A stale projection triggers canonical revalidation before a write.

### 11.3 Events

At minimum, the architecture emits versioned, idempotent events equivalent to:

- `MediaMasterValidated` / `MediaProcessingFailed`;
- `MediaAssigned` / `MediaInvalidated` / `MediaArchived`;
- `MediaRightsChanged`;
- `ProofLinked`;
- `ProofBecameStale`;
- `ProofUnmatched` / `ProofConflicting`;
- `EvidenceSuperseded`; and
- `CorrectionPublished`.

Consumers refresh Search, Retail Catalog, Private Wholesale, Admin Product Detail, Evidence Status, Support, Cart, and affected order/claim views. Replay rebuilds projections; it does not re-upload, re-transcode, re-watermark, or repeat an external side effect without explicit deduplication.

## 12. Storage, cache, audit, and provider boundaries

| Storage class | Responsibility | Explicit exclusion |
|---|---|---|
| Transactional database | Canonical media/evidence metadata, versions, rights, scope, status, assignments, processing references | Large binary bytes; derived search truth |
| Object/media storage | Immutable masters, immutable evidence document versions, derived objects under exact version and access policy | Inventory, price, publication, applicability, or rights truth |
| Search index | Rebuildable approved public/internal metadata according to classification | Canonical records; private payload outside approved projection |
| Cache/CDN | Disposable authorized derivatives and response optimization under access policy | Authorization, durable evidence, private offline archive |
| Audit storage | Tamper-evident material mutations and sensitive-read evidence | Raw masters, evidence documents, secrets, or unrestricted snapshots |
| Analytics/projections | Minimized operational status and aggregates | Protected content, D4 plaintext, proof documents, rights records, or secrets |
| GitHub | Source, schemas, migrations, tests, architecture, documentation | Live media/evidence operational state or object storage |

Any provider is an adapter, not canonical owner. A future contract must define exact objects/fields/classification, purpose, access, regions/subprocessors, encryption and key authority, cache/replication, logs, model-training/advertising prohibition, retention/deletion/backup/hold proof, incident notification, export, and tested replacement. Provider outage or deletion failure remains explicit.

## 13. Audit, archive, deletion, and export

Every upload, scan/validation disposition, assignment, reorder, replacement, rights decision, evidence review, status change, applicability decision, claim link, publish/unpublish, archive/restore, protected reveal authorization, sensitive read, and export produces the audit evidence defined in [06-admin-roles-security-and-audit.md](06-admin-roles-security-and-audit.md).

The system distinguishes:

- remove assignment from one publication;
- unpublish from a channel;
- archive an asset/evidence record;
- supersede one immutable version with another;
- delete a disposable draft that has no governed dependency;
- expire/delete a derivative or cache object;
- retain source or audit material under policy/hold; and
- verified deletion across primary storage, derivatives, caches, providers, exports, and backup expiry.

Hard deletion of published, ordered, relied-upon, rights-disputed, evidence, or audited material is not a routine admin action. Exact retention, holds, source-document access, derivative expiry, and deletion timing require qualified policy. A failed downstream deletion is unresolved; the UI cannot report complete because a primary record disappeared.

Exports require explicit scope and purpose, strong authorization and step-up where applicable, an expiring encrypted artifact, access audit, and exclusion of secrets and unrelated parties. D4 plaintext export, if ever offered, belongs to the authenticated endpoint; the server may export only authorized ciphertext/metadata. Provider and rights limitations travel with exported media/evidence metadata.

## 14. Operational signals

Admin must represent, without turning them into customer-facing claims or inventing thresholds:

- `MEDIA_MISSING`;
- `MEDIA_PROCESSING`;
- `MEDIA_PROCESSING_FAILED`;
- `MEDIA_QUARANTINED`;
- `MEDIA_RIGHTS_PENDING`;
- `MEDIA_RIGHTS_EXPIRED_OR_WITHDRAWN`;
- `MEDIA_ASSIGNMENT_INVALID`;
- `EVIDENCE_MISSING`;
- `EVIDENCE_NOT_SUPPLIED`;
- `EVIDENCE_PENDING_VERIFICATION`;
- `EVIDENCE_STALE`;
- `EVIDENCE_UNMATCHED`;
- `EVIDENCE_CONFLICTING`;
- `PROTECTED_CLIENT_REQUIRED`;
- `PROTECTED_DELIVERY_BLOCKED`; and
- `FAILED_PROJECTION_OR_INVALIDATION`.

Each signal identifies canonical object/version, source condition, owning role, consequence, and recovery path. A signal is not itself a verification or publication decision.

## 15. Decisions and open gates

### Architecture decided

- Admin, not GitHub, is the operational entrance.
- Media masters and evidence document versions are immutable and separately scoped from assignments/applicability.
- Derivatives are versioned/reproducible outputs, not canonical truth.
- Rights, provenance, accessibility, role, channel, and access class are explicit publication inputs.
- Evidence/COA applicability is exact and versioned; upload is never verification.
- Replacement preserves predecessors and triggers governed invalidation/re-evaluation.
- D3 restricted catalog media is server-authorized; qualifying negotiation attachments are D4 E2EE.
- Browser/PWA receives zero protected-wholesale payload and no protected client is currently approved.

### Owner decision required

- approved public and protected media roles by product type;
- required media coverage and ordering rules;
- owner/staff review and replacement authority;
- upload and bulk-operation approval thresholds;
- operational alert thresholds and retry/escalation procedures;
- which supplier media may be transformed, watermarked, or distributed; and
- which evidence conditions block a claim, publication, sale, reservation, or fulfillment once qualified rules exist.

### Provider / technology selection required

- transactional database and object/media storage;
- upload protocol and quarantine boundary;
- image/video/document parsers and malware scanning;
- image processing, 4K transcoding, adaptive streaming, CDN/gateway, and watermark path;
- search/index and job/queue/outbox implementation;
- integrity, encryption, key management, backup, deletion, and observability services; and
- protected-client platform after its evidence gate passes.

### Legal / compliance required

- COA/evidence authority, accepted issuers/formats, currency and batch-applicability rules;
- product-claim and sale-blocking consequences;
- rights/licenses, attribution, permitted transformations, geographic/term restrictions;
- exact retention, deletion, legal hold, export, disclosure, and access rules; and
- App Store/business-distribution, regulated-product, privacy, and incident duties.

### Implementation required

- schemas, migrations, object policies, APIs, jobs, admin interfaces, protected-client integration, tests, monitoring, recovery, and operator runbooks;
- adversarial upload/parser/scanner tests and access-control tests;
- physical protected-client and accessibility proof; and
- migration/export/restore/deletion and projection-rebuild evidence.

## 16. Current implementation status

| Question | Status |
|---|---|
| Media/evidence architecture defined | `YES` |
| Owner-operated media/evidence Admin implemented | `NO` |
| Live object/media storage selected | `NO` |
| Live derivative/transcoding pipeline implemented | `NO` |
| Evidence/COA verification policy approved | `NO` |
| Protected wholesale client approved | `NO` |
| Browser/PWA protected payload permitted | `NO` |
| Production implementation authorized | `NO` |
| Launch readiness established | `NO` |
