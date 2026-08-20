import assert from "node:assert/strict";
import test from "node:test";

import {
  SignJWT,
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
} from "jose";

import { createAdminApplication } from "../src/application.mjs";
import {
  createAuth0Authenticator,
  createAuth0IdTokenVerifier,
} from "../src/auth0-authenticator.mjs";
import { createAuth0WebFlow } from "../src/auth0-web-flow.mjs";

const NOW = Date.parse("2026-01-01T00:00:00.000Z");
const SESSION_SECRET = "test-only-session-secret-is-at-least-32-bytes";

function cookiePair(setCookie) {
  return setCookie.split(";", 1)[0];
}

function cookieHeader(setCookies) {
  return setCookies.map(cookiePair).join("; ");
}

test("Auth0 web flow binds fresh OIDC login evidence to trusted devices and sessions", async () => {
  const sessions = new Map();
  const devices = new Map();
  let currentTime = NOW;
  let expectedNonce;
  let enrollmentGrant = null;
  const actor = Object.freeze({
    id: "owner-test-001",
    subject: "auth0|owner-test-001",
    freshAuthentication: false,
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
  const authenticateToken = async (request) => {
    const authorization = request.headers?.authorization;
    if (authorization !== "Bearer test-access-token") return null;
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
    verifyIdToken: async (token, { nonce }) => {
      assert.equal(token, "test-id-token");
      assert.equal(nonce, expectedNonce);
      return Object.freeze({
        subject: actor.subject,
        authenticatedAtEpochSeconds: Math.floor(NOW / 1_000),
        methods: Object.freeze(["pwd"]),
      });
    },
    sessionStore,
    now: () => currentTime,
    fetchImpl: async (url, options) => {
      assert.equal(url.toString(), "https://tenant.example.auth0.com/oauth/token");
      const body = JSON.parse(options.body);
      assert.equal(body.grant_type, "authorization_code");
      assert.equal(typeof body.code_verifier, "string");
      assert.ok(body.code_verifier.length > 40);
      return {
        ok: true,
        async json() {
          return {
            access_token: "test-access-token",
            id_token: "test-id-token",
            token_type: "Bearer",
          };
        },
      };
    },
  });

  const firstStart = await flow.beginLogin({ url: "/admin/login" });
  assert.equal(firstStart.status, 302);
  const firstAuthorization = new URL(firstStart.headers.location);
  expectedNonce = firstAuthorization.searchParams.get("nonce");
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
  const firstAuthenticated = await flow.authenticateAdmin({
    headers: { cookie: firstCookies },
  });
  assert.equal(firstAuthenticated.id, actor.id);
  assert.equal(firstAuthenticated.freshAuthentication, true);
  assert.deepEqual(firstAuthenticated.authenticationMethods, ["pwd"]);
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
  expectedNonce = secondAuthorization.searchParams.get("nonce");
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

  currentTime += 301 * 1_000;
  const staleSessionActor = await flow.authenticateAdmin({
    headers: { cookie: secondCookies },
  });
  assert.equal(staleSessionActor.id, actor.id);
  assert.equal(staleSessionActor.freshAuthentication, false);
  assert.equal(
    await flow.authenticateAdmin(
      { headers: { cookie: secondCookies } },
      { requireFresh: true },
    ),
    null,
  );

  const loggedOut = await flow.logout({ headers: { cookie: firstCookies } });
  assert.equal(loggedOut.status, 200);
  assert.equal(
    await flow.authenticateAdmin({ headers: { cookie: firstCookies } }),
    null,
  );
});

test("production-shaped callback accepts an API token without AMR or auth_time", async () => {
  const nowSeconds = Math.floor(NOW / 1_000);
  const issuer = "https://tenant.example.auth0.com/";
  const audience = "https://admin.example.test";
  const clientId = "owner-client";
  const subject = "auth0|configured-owner";
  const { privateKey, publicKey } = await generateKeyPair("RS256", {
    extractable: true,
    modulusLength: 2048,
  });
  const publicJwk = await exportJWK(publicKey);
  Object.assign(publicJwk, { alg: "RS256", kid: "callback-test-key", use: "sig" });
  const jwks = createLocalJWKSet({ keys: [publicJwk] });
  const authenticateToken = createAuth0Authenticator({
    issuer,
    audience,
    jwks,
    now: () => NOW,
    resolveActor: async ({ subject: tokenSubject }) =>
      tokenSubject === subject
        ? {
            id: "owner-001",
            active: true,
            capabilities: ["catalog.read", "device.manage"],
          }
        : null,
  });
  const verifyIdToken = createAuth0IdTokenVerifier({
    issuer,
    clientId,
    jwks,
    now: () => NOW,
  });
  const devices = new Map();
  const sessions = new Map();
  const sessionStore = {
    async registerAdminDevice(device) {
      const registered = { ...device, status: "ACTIVE" };
      devices.set(device.deviceId, registered);
      return registered;
    },
    async createAdminDeviceEnrollmentGrant() {},
    async createAdminSession(session) {
      assert.equal(devices.get(session.deviceId)?.actorId, session.actorId);
      const registered = { ...session, status: "ACTIVE", revokedAt: null };
      sessions.set(session.sessionId, registered);
      return registered;
    },
    async readAdminSession({ sessionId }) {
      return sessions.get(sessionId) ?? null;
    },
    async revokeAdminSession() {},
  };
  let callbackNonce;
  const flow = createAuth0WebFlow({
    domain: issuer,
    clientId,
    clientSecret: "test-client-secret",
    audience,
    baseUrl: audience,
    sessionSecret: SESSION_SECRET,
    authenticateToken,
    verifyIdToken,
    sessionStore,
    now: () => NOW,
    fetchImpl: async () => {
      const accessToken = await new SignJWT({ sub: subject })
        .setProtectedHeader({ alg: "RS256", kid: "callback-test-key" })
        .setIssuer(issuer)
        .setAudience(audience)
        .setIssuedAt(nowSeconds - 30)
        .setExpirationTime(nowSeconds + 600)
        .sign(privateKey);
      const idToken = await new SignJWT({
        sub: subject,
        nonce: callbackNonce,
        auth_time: nowSeconds - 30,
      })
        .setProtectedHeader({ alg: "RS256", kid: "callback-test-key" })
        .setIssuer(issuer)
        .setAudience(clientId)
        .setIssuedAt(nowSeconds - 30)
        .setExpirationTime(nowSeconds + 600)
        .sign(privateKey);
      return {
        ok: true,
        async json() {
          return {
            access_token: accessToken,
            id_token: idToken,
            token_type: "Bearer",
          };
        },
      };
    },
  });

  const login = await flow.beginLogin({ url: "/admin/login" });
  const authorization = new URL(login.headers.location);
  callbackNonce = authorization.searchParams.get("nonce");
  const completed = await flow.completeLogin({
    url: `/admin/callback?code=test-code&state=${encodeURIComponent(
      authorization.searchParams.get("state"),
    )}`,
    headers: { cookie: cookiePair(login.headers["set-cookie"]) },
  });
  const sessionCookies = cookieHeader(
    completed.headers["set-cookie"].filter(
      (value) =>
        value.startsWith("bs_admin_session=") ||
        value.startsWith("bs_admin_device="),
    ),
  );
  const authenticated = await flow.authenticateAdmin({
    headers: { cookie: sessionCookies },
  });

  assert.equal(completed.status, 302);
  assert.equal(authenticated.id, "owner-001");
  assert.equal(authenticated.subject, subject);
  assert.equal(authenticated.freshAuthentication, true);
  assert.deepEqual(authenticated.authenticationMethods, []);
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

test("callback diagnostics and the public failure response never expose secrets", async () => {
  const sensitiveValues = [
    "AUTHORIZATION_CODE_MARKER",
    "ACCESS_TOKEN_MARKER",
    "COOKIE_MARKER",
    "CLIENT_SECRET_MARKER",
    "owner.personal@example.test",
  ];
  const diagnostics = [];
  const sessionStore = {
    async registerAdminDevice() {},
    async createAdminDeviceEnrollmentGrant() {},
    async createAdminSession() {},
    async readAdminSession() { return null; },
    async revokeAdminSession() {},
  };
  const flow = createAuth0WebFlow({
    domain: "tenant.example.auth0.com",
    clientId: "test-client",
    clientSecret: sensitiveValues[3],
    audience: "https://admin.example.test",
    baseUrl: "https://admin.example.test",
    sessionSecret: SESSION_SECRET,
    authenticateToken: async () => null,
    verifyIdToken: async () => null,
    sessionStore,
    logger: {
      error(diagnostic) {
        diagnostics.push(diagnostic);
      },
    },
    fetchImpl: async () => {
      throw new Error(sensitiveValues.join(" | "));
    },
    now: () => NOW,
  });
  const login = await flow.beginLogin({ url: "/admin/login" });
  const authorization = new URL(login.headers.location);
  const app = createAdminApplication({
    env: {
      DATABASE_URL: "test-boundary",
      AUTH0_DOMAIN: "tenant.example.auth0.com",
      AUTH0_CLIENT_ID: "test-client",
      AUTH0_CLIENT_SECRET: sensitiveValues[3],
      AUTH0_AUDIENCE: "https://admin.example.test",
      AUTH0_OWNER_SUB: "auth0|owner-test-001",
      ADMIN_BASE_URL: "https://admin.example.test",
      ADMIN_SESSION_SECRET: SESSION_SECRET,
    },
    authFlow: flow,
  });

  const result = await app({
    method: "GET",
    url: `/admin/callback?code=${sensitiveValues[0]}&state=${encodeURIComponent(
      authorization.searchParams.get("state"),
    )}`,
    headers: {
      cookie: `${cookiePair(login.headers["set-cookie"])}; extra=${sensitiveValues[2]}`,
    },
  });

  assert.equal(result.status, 503);
  assert.equal(
    result.body,
    '{"status":"BLOCKED","code":"LIVE_TEST_BLOCKED","scope":"AUTH0_WEB_CALLBACK","missing":[]}',
  );
  assert.deepEqual(diagnostics, [
    {
      event: "ADMIN_AUTH0_CALLBACK_FAILED",
      name: "Auth0CallbackError",
      code: "AUTH0_TOKEN_EXCHANGE_FAILED",
      message: "Auth0 token exchange failed.",
    },
  ]);
  const serialized = JSON.stringify({ diagnostics, result });
  for (const sensitiveValue of sensitiveValues) {
    assert.equal(serialized.includes(sensitiveValue), false);
  }
});
