import { createHash, randomBytes, randomUUID } from "node:crypto";

export const PROOF_POLICY_VERSION = "SEC-03-SYNTHETIC-2026-08-15";
export const FIVE_MINUTES_MS = 5 * 60 * 1000;
export const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export class ProtectedResourceDenied extends Error {
  constructor() {
    super("PROTECTED_RESOURCE_DENIED");
    this.name = "ProtectedResourceDenied";
    this.statusCode = 404;
  }
}

function deny() {
  throw new ProtectedResourceDenied();
}

function tokenDigest(token) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export class SyntheticProtectedAuthority {
  constructor({ clock = () => Date.now(), integrityMaxAgeMs = 5 * 60 * 1000 } = {}) {
    this.clock = clock;
    this.integrityMaxAgeMs = integrityMaxAgeMs;
    this.accounts = new Map();
    this.rooms = new Map();
    this.clientReleases = new Map();
    this.endpoints = new Map();
    this.integrityEvidence = new Map();
    this.resources = new Map();
    this.grants = new Map();
    this.deviceChallenges = new Map();
  }

  registerAccount(record) {
    this.accounts.set(record.id, { status: "ACTIVE", ...record });
  }

  registerRoom(record) {
    this.rooms.set(record.id, { status: "ACTIVE", ...record });
  }

  registerClientRelease(record) {
    this.clientReleases.set(record.id, {
      signed: false,
      supportState: "UNKNOWN",
      captureControlState: "UNKNOWN",
      ...record,
    });
  }

  registerEndpoint(record) {
    this.endpoints.set(record.id, {
      trustState: "PENDING",
      revocationState: "ACTIVE",
      historyAccess: false,
      ...record,
    });
  }

  recordIntegrity(record) {
    this.integrityEvidence.set(record.id, { state: "UNKNOWN", ...record });
  }

  registerResource(record) {
    this.resources.set(record.id, { status: "ACTIVE", ...record });
  }

  assertAdmission(request) {
    // request.clientClaims and userAgent are deliberately ignored. Only
    // server-held records participate in admission.
    const account = this.accounts.get(request.accountId);
    const room = this.rooms.get(request.roomId);
    const release = this.clientReleases.get(request.clientReleaseId);
    const endpoint = this.endpoints.get(request.endpointId);
    const integrity = this.integrityEvidence.get(request.integrityEvidenceId);
    const resource = this.resources.get(request.resourceId);
    const now = this.clock();

    if (!account || account.status !== "ACTIVE") deny();
    if (!room || room.status !== "ACTIVE" || room.accountId !== account.id) deny();
    if (!resource || resource.status !== "ACTIVE" || resource.roomId !== room.id) deny();
    if (!release || release.supportState !== "SUPPORTED" || release.signed !== true) deny();
    if (release.captureControlState !== "ESTABLISHED") deny();
    if (!endpoint || endpoint.accountId !== account.id || endpoint.clientReleaseId !== release.id) deny();
    if (endpoint.trustState !== "TRUSTED" || endpoint.revocationState !== "ACTIVE") deny();
    if (!integrity || integrity.state !== "PASS") deny();
    if (integrity.endpointId !== endpoint.id || integrity.clientReleaseId !== release.id) deny();
    if (!Number.isFinite(integrity.observedAt) || now - integrity.observedAt > this.integrityMaxAgeMs) deny();
    if (integrity.observedAt > now) deny();

    return { account, room, release, endpoint, resource, integrity };
  }

  issueOneTimeGrant(request, { action = "RENDER", ttlMs = 30_000 } = {}) {
    const admitted = this.assertAdmission(request);
    if (!Number.isFinite(ttlMs) || ttlMs <= 0 || ttlMs > 60_000) deny();

    const token = randomBytes(32).toString("base64url");
    this.grants.set(tokenDigest(token), {
      id: randomUUID(),
      action,
      accountId: admitted.account.id,
      roomId: admitted.room.id,
      endpointId: admitted.endpoint.id,
      clientReleaseId: admitted.release.id,
      resourceId: admitted.resource.id,
      issuedAt: this.clock(),
      expiresAt: this.clock() + ttlMs,
      usedAt: null,
      revokedAt: null,
    });
    return token;
  }

  revokeGrant(token) {
    const grant = this.grants.get(tokenDigest(token));
    if (!grant) deny();
    grant.revokedAt = this.clock();
  }

  redeemOneTimeGrant({ token, accountId, roomId, endpointId, clientReleaseId, resourceId, action = "RENDER" }) {
    const grant = this.grants.get(tokenDigest(token || ""));
    const now = this.clock();
    if (!grant || grant.revokedAt !== null || grant.usedAt !== null || now >= grant.expiresAt) deny();
    if (grant.action !== action) deny();
    if (grant.accountId !== accountId || grant.roomId !== roomId) deny();
    if (grant.endpointId !== endpointId || grant.clientReleaseId !== clientReleaseId) deny();
    if (grant.resourceId !== resourceId) deny();

    const freshAdmission = this.assertAdmission({
      accountId,
      roomId,
      endpointId,
      clientReleaseId,
      resourceId,
      integrityEvidenceId: this.endpoints.get(endpointId)?.integrityEvidenceId,
    });
    grant.usedAt = now;
    return { grant: { ...grant }, resource: { ...freshAdmission.resource } };
  }

  beginTrustedDeviceAdd({ accountId, authorizerEndpointId, newEndpointId, newClientReleaseId }) {
    const authorizer = this.endpoints.get(authorizerEndpointId);
    const release = this.clientReleases.get(newClientReleaseId);
    if (!authorizer || authorizer.accountId !== accountId) deny();
    if (authorizer.trustState !== "TRUSTED" || authorizer.revocationState !== "ACTIVE") deny();
    if (!release || !release.signed || release.supportState !== "SUPPORTED") deny();
    if (this.endpoints.has(newEndpointId)) deny();

    const challenge = randomBytes(24).toString("base64url");
    this.deviceChallenges.set(tokenDigest(challenge), {
      accountId,
      authorizerEndpointId,
      newEndpointId,
      newClientReleaseId,
      expiresAt: this.clock() + 60_000,
      usedAt: null,
    });
    return challenge;
  }

  completeTrustedDeviceAdd({ challenge, authorizerEndpointId }) {
    const record = this.deviceChallenges.get(tokenDigest(challenge || ""));
    if (!record || record.usedAt !== null || this.clock() >= record.expiresAt) deny();
    if (record.authorizerEndpointId !== authorizerEndpointId) deny();
    const authorizer = this.endpoints.get(authorizerEndpointId);
    if (!authorizer || authorizer.trustState !== "TRUSTED" || authorizer.revocationState !== "ACTIVE") deny();

    record.usedAt = this.clock();
    const endpoint = {
      id: record.newEndpointId,
      accountId: record.accountId,
      clientReleaseId: record.newClientReleaseId,
      cryptographicIdentityId: randomUUID(),
      trustState: "TRUSTED",
      revocationState: "ACTIVE",
      historyAccess: false,
      integrityEvidenceId: null,
    };
    this.registerEndpoint(endpoint);
    return { ...endpoint };
  }

  revokeEndpoint(endpointId) {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) deny();
    endpoint.revocationState = "REVOKED";
    endpoint.trustState = "REVOKED";
    for (const grant of this.grants.values()) {
      if (grant.endpointId === endpointId && grant.revokedAt === null) grant.revokedAt = this.clock();
    }
  }

  recoverAfterAllDevicesLost({ accountId, newEndpointId, newClientReleaseId, independentEvidence }) {
    const account = this.accounts.get(accountId);
    const release = this.clientReleases.get(newClientReleaseId);
    if (!account || account.status !== "ACTIVE") deny();
    if (!release || !release.signed || release.supportState !== "SUPPORTED") deny();
    if (!Array.isArray(independentEvidence) || new Set(independentEvidence).size < 2) deny();

    for (const endpoint of this.endpoints.values()) {
      if (endpoint.accountId === accountId) {
        endpoint.trustState = "LOST";
        endpoint.revocationState = "REVOKED";
      }
    }
    const recovered = {
      id: newEndpointId,
      accountId,
      clientReleaseId: newClientReleaseId,
      cryptographicIdentityId: randomUUID(),
      trustState: "TRUSTED",
      revocationState: "ACTIVE",
      historyAccess: false,
      integrityEvidenceId: null,
    };
    this.registerEndpoint(recovered);
    return { ...recovered };
  }
}

export function protectedDeliveryHeaders() {
  return {
    "cache-control": "private, no-store, max-age=0",
    pragma: "no-cache",
    expires: "0",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "content-disposition": "inline",
  };
}

export function renderSyntheticProtectedImage({ traceId, renderId, timeWindow }) {
  const mark = escapeXml(`SEC03 ${traceId} ${renderId} ${timeWindow}`);
  const positions = [[220, 350], [2050, 420], [840, 1200], [2500, 1680]];
  const marks = positions.map(([x, y]) => `<text x="${x}" y="${y}" class="mark">${mark}</text>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160" viewBox="0 0 3840 2160" role="img" aria-labelledby="title description"><title id="title">Synthetic protected wholesale test image</title><desc id="description">Synthetic SEC-03 image with repeated privacy-minimized session watermark.</desc><rect width="3840" height="2160" fill="#171717"/><rect x="180" y="180" width="3480" height="1800" rx="60" fill="#2a2a2a"/><text x="300" y="900" class="main">PRIVATE WHOLESALE TEST</text><text x="300" y="1090" class="sub">SYNTHETIC PROTECTED CONTENT · TEST PRICE</text>${marks}<style>.main{font:700 180px system-ui;fill:#fff}.sub{font:500 88px system-ui;fill:#ddd}.mark{font:600 54px ui-monospace;fill:#fff;opacity:.34;transform:rotate(-8deg);transform-origin:center}</style></svg>`;
}

export function renderSyntheticProtectedVideoSegment({ sequence, traceId, renderId, timeWindow }) {
  const descriptor = {
    proofOnly: true,
    mediaClass: "SYNTHETIC_4K_EQUIVALENT_REPRESENTATIVE_STREAM",
    dimensions: { width: 3840, height: 2160 },
    sequence,
    content: "PRIVATE WHOLESALE TEST / SYNTHETIC PROTECTED CONTENT / TEST VIDEO",
    burnedWatermark: { traceId, renderId, timeWindow, placement: "REPEATED_MULTI_REGION" },
  };
  return Buffer.from(JSON.stringify(descriptor), "utf8");
}

export class ManifestLeaseProof {
  constructor({ clock = () => Date.now() } = {}) {
    this.clock = clock;
    this.firstViewAt = null;
  }

  reveal() {
    if (this.firstViewAt === null) this.firstViewAt = this.clock();
    return this.currentState();
  }

  currentState() {
    if (this.firstViewAt === null) return { state: "NOT_REVEALED" };
    const now = this.clock();
    const expiresViewAt = this.firstViewAt + FIVE_MINUTES_MS;
    const disputeBeginBy = this.firstViewAt + THIRTY_MINUTES_MS;
    if (now < expiresViewAt) return { state: "FULL", firstViewAt: this.firstViewAt, expiresViewAt, disputeBeginBy };
    if (now < disputeBeginBy) return { state: "MINIMAL_DISPUTE_REFERENCE", firstViewAt: this.firstViewAt, expiresViewAt, disputeBeginBy };
    return { state: "EXPIRED", firstViewAt: this.firstViewAt, expiresViewAt, disputeBeginBy };
  }
}
