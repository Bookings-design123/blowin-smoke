import test from "node:test";
import assert from "node:assert/strict";
import {
  FIVE_MINUTES_MS,
  THIRTY_MINUTES_MS,
  ManifestLeaseProof,
  ProtectedResourceDenied,
  SyntheticProtectedAuthority,
  protectedDeliveryHeaders,
  renderSyntheticProtectedImage,
  renderSyntheticProtectedVideoSegment,
} from "../src/proof-model.mjs";

function fixture() {
  let now = Date.parse("2026-08-15T12:00:00Z");
  const authority = new SyntheticProtectedAuthority({ clock: () => now });
  authority.registerAccount({ id: "acct-proof", status: "ACTIVE" });
  authority.registerRoom({ id: "room-proof", accountId: "acct-proof", status: "ACTIVE" });
  authority.registerClientRelease({ id: "android-proof-current", platform: "ANDROID_12_PLUS", signed: true, supportState: "SUPPORTED", captureControlState: "ESTABLISHED" });
  authority.registerClientRelease({ id: "android-proof-stale", platform: "ANDROID_12_PLUS", signed: true, supportState: "STALE", captureControlState: "ESTABLISHED" });
  authority.registerClientRelease({ id: "android-proof-unsigned", platform: "ANDROID_12_PLUS", signed: false, supportState: "SUPPORTED", captureControlState: "ESTABLISHED" });
  authority.registerClientRelease({ id: "android-proof-capture-unknown", platform: "ANDROID_12_PLUS", signed: true, supportState: "SUPPORTED", captureControlState: "UNKNOWN" });
  authority.registerEndpoint({ id: "endpoint-proof", accountId: "acct-proof", clientReleaseId: "android-proof-current", trustState: "TRUSTED", revocationState: "ACTIVE", integrityEvidenceId: "integrity-proof" });
  authority.recordIntegrity({ id: "integrity-proof", endpointId: "endpoint-proof", clientReleaseId: "android-proof-current", state: "PASS", observedAt: now });
  authority.registerResource({ id: "image-proof", roomId: "room-proof", type: "SYNTHETIC_HIGH_RES_IMAGE", status: "ACTIVE" });
  authority.registerResource({ id: "video-segment-proof", roomId: "room-proof", type: "SYNTHETIC_4K_REPRESENTATIVE_SEGMENT", status: "ACTIVE" });
  const request = {
    accountId: "acct-proof",
    roomId: "room-proof",
    endpointId: "endpoint-proof",
    clientReleaseId: "android-proof-current",
    integrityEvidenceId: "integrity-proof",
    resourceId: "image-proof",
  };
  return { authority, request, now: () => now, advance: milliseconds => { now += milliseconds; } };
}

function denied(fn) {
  assert.throws(fn, error => error instanceof ProtectedResourceDenied && error.statusCode === 404);
}

test("T21 expired media grant fails closed", () => {
  const f = fixture();
  const token = f.authority.issueOneTimeGrant(f.request, { ttlMs: 1000 });
  f.advance(1000);
  denied(() => f.authority.redeemOneTimeGrant({ token, ...f.request }));
});

test("T22 revoked media grant fails closed", () => {
  const f = fixture();
  const token = f.authority.issueOneTimeGrant(f.request);
  f.authority.revokeGrant(token);
  denied(() => f.authority.redeemOneTimeGrant({ token, ...f.request }));
});

test("T23 wrong account and T24 wrong room fail with the same generic denial", () => {
  const f = fixture();
  const tokenA = f.authority.issueOneTimeGrant(f.request);
  denied(() => f.authority.redeemOneTimeGrant({ token: tokenA, ...f.request, accountId: "acct-other" }));
  const tokenB = f.authority.issueOneTimeGrant(f.request);
  denied(() => f.authority.redeemOneTimeGrant({ token: tokenB, ...f.request, roomId: "room-other" }));
});

test("T25 wrong endpoint fails closed", () => {
  const f = fixture();
  const token = f.authority.issueOneTimeGrant(f.request);
  denied(() => f.authority.redeemOneTimeGrant({ token, ...f.request, endpointId: "endpoint-other" }));
});

test("T26 unsupported, T27 stale, and T28 unsigned client releases are denied", () => {
  const f = fixture();
  denied(() => f.authority.issueOneTimeGrant({ ...f.request, clientReleaseId: "missing-client" }));
  denied(() => f.authority.issueOneTimeGrant({ ...f.request, clientReleaseId: "android-proof-stale" }));
  denied(() => f.authority.issueOneTimeGrant({ ...f.request, clientReleaseId: "android-proof-unsigned" }));
  denied(() => f.authority.issueOneTimeGrant({ ...f.request, clientReleaseId: "android-proof-capture-unknown" }));
});

test("T29 a redeemed resource token cannot be reused", () => {
  const f = fixture();
  const token = f.authority.issueOneTimeGrant(f.request);
  assert.equal(f.authority.redeemOneTimeGrant({ token, ...f.request }).resource.id, "image-proof");
  denied(() => f.authority.redeemOneTimeGrant({ token, ...f.request }));
});

test("T30 enumerated or substituted resource identifiers fail closed", () => {
  const f = fixture();
  denied(() => f.authority.issueOneTimeGrant({ ...f.request, resourceId: "image-proof-0002" }));
  const token = f.authority.issueOneTimeGrant(f.request);
  denied(() => f.authority.redeemOneTimeGrant({ token, ...f.request, resourceId: "video-segment-proof" }));
});

test("user-agent and approved=true claims never create admission", () => {
  const f = fixture();
  denied(() => f.authority.issueOneTimeGrant({
    ...f.request,
    endpointId: "missing-endpoint",
    clientClaims: { approved: true, captureProtected: true },
    userAgent: "BlowinSmokeApproved/999",
  }));
});

test("missing, unknown, stale, future, and revoked evidence fails closed", () => {
  const f = fixture();
  denied(() => f.authority.issueOneTimeGrant({ ...f.request, integrityEvidenceId: "missing-integrity" }));
  f.authority.recordIntegrity({ id: "integrity-proof", endpointId: "endpoint-proof", clientReleaseId: "android-proof-current", state: "UNKNOWN", observedAt: f.now() });
  denied(() => f.authority.issueOneTimeGrant(f.request));
  f.authority.recordIntegrity({ id: "integrity-proof", endpointId: "endpoint-proof", clientReleaseId: "android-proof-current", state: "PASS", observedAt: f.now() - 300_001 });
  denied(() => f.authority.issueOneTimeGrant(f.request));
  f.authority.recordIntegrity({ id: "integrity-proof", endpointId: "endpoint-proof", clientReleaseId: "android-proof-current", state: "PASS", observedAt: f.now() + 1 });
  denied(() => f.authority.issueOneTimeGrant(f.request));
  f.authority.recordIntegrity({ id: "integrity-proof", endpointId: "endpoint-proof", clientReleaseId: "android-proof-current", state: "PASS", observedAt: f.now() });
  f.authority.revokeEndpoint("endpoint-proof");
  denied(() => f.authority.issueOneTimeGrant(f.request));
});

test("T31 device add without trusted authorization is denied; T32 valid ceremony succeeds", () => {
  const f = fixture();
  denied(() => f.authority.beginTrustedDeviceAdd({ accountId: "acct-proof", authorizerEndpointId: "missing", newEndpointId: "endpoint-new", newClientReleaseId: "android-proof-current" }));
  const challenge = f.authority.beginTrustedDeviceAdd({ accountId: "acct-proof", authorizerEndpointId: "endpoint-proof", newEndpointId: "endpoint-new", newClientReleaseId: "android-proof-current" });
  const endpoint = f.authority.completeTrustedDeviceAdd({ challenge, authorizerEndpointId: "endpoint-proof" });
  assert.equal(endpoint.trustState, "TRUSTED");
  assert.equal(endpoint.historyAccess, false);
  denied(() => f.authority.completeTrustedDeviceAdd({ challenge, authorizerEndpointId: "endpoint-proof" }));
});

test("T33 revoked trusted device loses grants and cannot authorize another device", () => {
  const f = fixture();
  const token = f.authority.issueOneTimeGrant(f.request);
  f.authority.revokeEndpoint("endpoint-proof");
  denied(() => f.authority.redeemOneTimeGrant({ token, ...f.request }));
  denied(() => f.authority.beginTrustedDeviceAdd({ accountId: "acct-proof", authorizerEndpointId: "endpoint-proof", newEndpointId: "endpoint-new", newClientReleaseId: "android-proof-current" }));
});

test("T34 all-device-loss recovery creates a new identity without history", () => {
  const f = fixture();
  denied(() => f.authority.recoverAfterAllDevicesLost({ accountId: "acct-proof", newEndpointId: "endpoint-recovered", newClientReleaseId: "android-proof-current", independentEvidence: ["order-pointer-only"] }));
  const endpoint = f.authority.recoverAfterAllDevicesLost({ accountId: "acct-proof", newEndpointId: "endpoint-recovered", newClientReleaseId: "android-proof-current", independentEvidence: ["recovery-code", "verified-contact"] });
  assert.equal(endpoint.trustState, "TRUSTED");
  assert.equal(endpoint.historyAccess, false);
  assert.notEqual(endpoint.cryptographicIdentityId, f.authority.endpoints.get("endpoint-proof").cryptographicIdentityId);
});

test("protected delivery headers deny persistent caching and attachment behavior", () => {
  const headers = protectedDeliveryHeaders();
  assert.match(headers["cache-control"], /no-store/);
  assert.equal(headers["referrer-policy"], "no-referrer");
  assert.equal(headers["content-disposition"], "inline");
  assert.equal(headers["x-content-type-options"], "nosniff");
});

test("synthetic 3840x2160 image has repeated privacy-minimized burned marks", () => {
  const image = renderSyntheticProtectedImage({ traceId: "trace-7f2a", renderId: "render-91", timeWindow: "20260815T1200Z" });
  assert.match(image, /width="3840" height="2160"/);
  assert.equal((image.match(/SEC03 trace-7f2a render-91 20260815T1200Z/g) || []).length, 4);
  assert.doesNotMatch(image, /@|\+1|phone|email/i);
});

test("representative 4K stream segment is bound to synthetic content and minimized mark", () => {
  const segment = JSON.parse(renderSyntheticProtectedVideoSegment({ sequence: 4, traceId: "trace-7f2a", renderId: "render-91", timeWindow: "20260815T1200Z" }).toString("utf8"));
  assert.deepEqual(segment.dimensions, { width: 3840, height: 2160 });
  assert.equal(segment.proofOnly, true);
  assert.equal(segment.burnedWatermark.placement, "REPEATED_MULTI_REGION");
});

test("manifest clocks remain immutable and independently enforce +5 and +30", () => {
  let now = Date.parse("2026-08-15T12:00:00Z");
  const lease = new ManifestLeaseProof({ clock: () => now });
  const initial = lease.reveal();
  assert.equal(initial.state, "FULL");
  assert.equal(initial.expiresViewAt, initial.firstViewAt + FIVE_MINUTES_MS);
  assert.equal(initial.disputeBeginBy, initial.firstViewAt + THIRTY_MINUTES_MS);
  now += FIVE_MINUTES_MS;
  assert.equal(lease.reveal().state, "MINIMAL_DISPUTE_REFERENCE");
  assert.equal(lease.firstViewAt, initial.firstViewAt);
  now = initial.firstViewAt + THIRTY_MINUTES_MS;
  assert.equal(lease.currentState().state, "EXPIRED");
});
