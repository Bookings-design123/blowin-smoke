import assert from "node:assert/strict";
import test from "node:test";

import { createAuth0WebFlow } from "../src/auth0-web-flow.mjs";

const NOW = Date.parse("2026-01-01T00:00:00.000Z");
const SESSION_SECRET = "test-only-session-secret-is-at-least-32-bytes";

function cookiePair(setCookie) {
  return setCookie.split(";", 1)[0];
}

function cookieHeader(setCookies) {
  return setCookies.map(cookiePair).join("; ");
}

test("Auth0 web flow enforces fresh passkeys, trusted devices, and one-time enrollment", async () => {
  const sessions = new Map();
  const devices = new Map();
  let enrollmentGrant = null;
  const actor = Object.freeze({
    id: "owner-test-001",
    subject: "auth0|owner-test-001",
    freshAuthentication: true,
    capabilities: Object.freeze(["catalog.read", "device.manage"]),
    authentication: Object.freeze({
      expiresAt: Math.floor(NOW / 1_000) + 3_600,
    }),
  });
  const sessionStore = {
    async createAdminDeviceEnrollmentGrant(grant) {
      assert.ok(sessions.has(grant.sessionId));
      enrollmentGrant = { ...grant, consumed: false };
      return enrollmentGrant;
    },
    async registerAdminDevice(device) {
      const existing = devices.get(device.deviceId);
      if (existing) return existing;
      if (devices.size > 0) {
        if (
          !enrollmentGrant ||
          enrollmentGrant.consumed ||
          enrollmentGrant.codeHash !== device.enrollmentCodeHash
        ) {
          throw new Error("DEVICE_ENROLLMENT_AUTHORIZATION_REQUIRED");
        }
        enrollmentGrant.consumed = true;
      }
      const registered = { ...device, status: "ACTIVE" };
      devices.set(device.deviceId, registered);
      return registered;
    },
    async createAdminSession(session) {
      assert.equal(devices.get(session.deviceId)?.actorId, session.actorId);
      const registered = { ...session, status: "ACTIVE", revokedAt: null };
      sessions.set(session.sessionId, registered);
      return registered;
    },
    async readAdminSession({ sessionId }) {
      return sessions.get(sessionId) ?? null;
    },
    async revokeAdminSession({ sessionId, actorId }) {
      const session = sessions.get(sessionId);
      assert.equal(session.actorId, actorId);
      sessions.set(sessionId, {
        ...session,
        status: "REVOKED",
        revokedAt: new Date(NOW).toISOString(),
      });
      return true;
    },
  };
  const authenticateToken = async (request, requirements = {}) => {
    const authorization = request.headers?.authorization;
    if (authorization !== "Bearer test-access-token") return null;
    if (requirements.requireFresh && actor.freshAuthentication !== true) return null;
    return actor;
  };
  const flow = createAuth0WebFlow({
    domain: "tenant.example.auth0.com",
    clientId: "test-client",
    clientSecret: "test-client-secret",
    audience: "https://admin.example.test",
    baseUrl: "https://admin.example.test",
    sessionSecret: SESSION_SECRET,
    authenticateToken,
    sessionStore,
    now: () => NOW,
    fetchImpl: async (url, options) => {
      assert.equal(url.toString(), "https://tenant.example.auth0.com/oauth/token");
      const body = JSON.parse(options.body);
      assert.equal(body.grant_type, "authorization_code");
      assert.equal(typeof body.code_verifier, "string");
      assert.ok(body.code_verifier.length > 40);
      return {
        ok: true,
        async json() {
          return { access_token: "test-access-token" };
        },
      };
    },
  });

  const firstStart = await flow.beginLogin({ url: "/admin/login" });
  assert.equal(firstStart.status, 302);
  const firstAuthorization = new URL(firstStart.headers.location);
  assert.equal(firstAuthorization.pathname, "/authorize");
  assert.equal(firstAuthorization.searchParams.get("code_challenge_method"), "S256");
  assert.equal(firstAuthorization.searchParams.get("prompt"), "login");
  assert.equal(firstAuthorization.searchParams.get("max_age"), "300");
  assert.ok(firstAuthorization.searchParams.get("code_challenge"));
  assert.match(firstStart.headers["set-cookie"], /HttpOnly/);
  assert.match(firstStart.headers["set-cookie"], /Secure/);

  const firstComplete = await flow.completeLogin({
    url: `/admin/callback?code=test-code&state=${encodeURIComponent(
      firstAuthorization.searchParams.get("state"),
    )}`,
    headers: { cookie: cookiePair(firstStart.headers["set-cookie"]) },
  });
  assert.equal(firstComplete.status, 302);
  assert.equal(firstComplete.headers.location, "/admin");
  const firstSessionCookies = firstComplete.headers["set-cookie"].filter(
    (value) =>
      value.startsWith("bs_admin_session=") || value.startsWith("bs_admin_device="),
  );
  assert.equal(firstSessionCookies.length, 2);
  assert.equal(devices.size, 1);
  assert.equal(sessions.size, 1);
  firstSessionCookies.forEach((value) => {
    assert.match(value, /HttpOnly/);
    assert.match(value, /Secure/);
  });
  const firstCookies = cookieHeader(firstSessionCookies);
  assert.equal(
    (await flow.authenticateAdmin({ headers: { cookie: firstCookies } })).id,
    actor.id,
  );
  assert.equal(
    await flow.authenticateAdmin({
      headers: { authorization: "Bearer test-access-token" },
    }),
    null,
  );

  const grantResponse = await flow.createDeviceEnrollmentGrant({
    headers: { cookie: firstCookies },
  });
  assert.equal(grantResponse.status, 201);
  const grant = JSON.parse(grantResponse.body);
  assert.match(grant.enrollmentCode, /^[A-Za-z0-9_-]{8,64}$/);

  const secondStart = await flow.beginLogin({
    url: `/admin/login?enrollment_code=${encodeURIComponent(grant.enrollmentCode)}`,
  });
  const secondAuthorization = new URL(secondStart.headers.location);
  const secondComplete = await flow.completeLogin({
    url: `/admin/callback?code=second-code&state=${encodeURIComponent(
      secondAuthorization.searchParams.get("state"),
    )}`,
    headers: { cookie: cookiePair(secondStart.headers["set-cookie"]) },
  });
  assert.equal(secondComplete.status, 302);
  assert.equal(devices.size, 2);
  assert.equal(enrollmentGrant.consumed, true);
  const secondCookies = cookieHeader(
    secondComplete.headers["set-cookie"].filter(
      (value) =>
        value.startsWith("bs_admin_session=") ||
        value.startsWith("bs_admin_device="),
    ),
  );
  assert.equal(
    (await flow.authenticateAdmin({ headers: { cookie: secondCookies } })).id,
    actor.id,
  );

  const loggedOut = await flow.logout({ headers: { cookie: firstCookies } });
  assert.equal(loggedOut.status, 200);
  assert.equal(
    await flow.authenticateAdmin({ headers: { cookie: firstCookies } }),
    null,
  );
});

test("Auth0 web flow rejects non-local cleartext Admin origins", () => {
  assert.throws(
    () =>
      createAuth0WebFlow({
        domain: "tenant.example.auth0.com",
        clientId: "test-client",
        clientSecret: "test-secret",
        audience: "https://admin.example.test",
        baseUrl: "http://admin.example.test",
        sessionSecret: SESSION_SECRET,
        authenticateToken: async () => null,
      }),
    /ADMIN_BASE_URL_INVALID/,
  );
});
