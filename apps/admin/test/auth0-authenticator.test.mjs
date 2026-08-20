import assert from "node:assert/strict";
import test from "node:test";

import {
  SignJWT,
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
} from "jose";

import {
  createAuth0Authenticator,
  createAuth0IdTokenVerifier,
  hasFreshAuthentication,
  requireFreshAuthentication,
} from "../src/auth0-authenticator.mjs";

const ISSUER = "https://tenant.example.test/";
const AUDIENCE = "https://admin.example.test";
const CLIENT_ID = "owner-client";
const NOW_SECONDS = 2_000_000_000;

async function createSigningFixture() {
  const { privateKey, publicKey } = await generateKeyPair("RS256", {
    extractable: true,
    modulusLength: 2048,
  });
  const publicJwk = await exportJWK(publicKey);
  publicJwk.alg = "RS256";
  publicJwk.kid = "auth-test-key";
  publicJwk.use = "sig";

  return Object.freeze({
    privateKey,
    jwks: createLocalJWKSet({ keys: [publicJwk] }),
  });
}

async function signToken(privateKey, overrides = {}) {
  const claims = {
    sub: "auth0|owner-test",
    auth_time: NOW_SECONDS - 30,
    amr: ["webauthn"],
    ...overrides,
  };

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", kid: "auth-test-key" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(NOW_SECONDS - 30)
    .setExpirationTime(NOW_SECONDS + 300)
    .sign(privateKey);
}

test("Auth0 RS256 bearer verification resolves an application-owned actor", async () => {
  const signing = await createSigningFixture();
  const resolutions = [];
  const authenticate = createAuth0Authenticator({
    issuer: ISSUER,
    audience: AUDIENCE,
    jwks: signing.jwks,
    now: () => NOW_SECONDS * 1_000,
    resolveActor: async (identity) => {
      resolutions.push(identity);
      return {
        id: "admin-actor-001",
        capabilities: ["catalog.edit"],
        active: true,
      };
    },
  });
  const token = await signToken(signing.privateKey);
  const actor = await authenticate({
    headers: { authorization: `Bearer ${token}` },
  });

  assert.equal(actor.id, "admin-actor-001");
  assert.deepEqual(actor.capabilities, ["catalog.edit"]);
  assert.equal(actor.authentication.provider, "auth0");
  assert.equal(actor.authenticatedAt, "2033-05-18T03:32:50.000Z");
  assert.equal(actor.freshAuthenticationAt, actor.authenticatedAt);
  assert.deepEqual(actor.authenticationMethods, ["webauthn"]);
  assert.equal(actor.freshAuthentication, true);
  assert.deepEqual(resolutions, [
    { provider: "auth0", subject: "auth0|owner-test" },
  ]);
  assert.equal(
    hasFreshAuthentication(actor, {
      now: () => NOW_SECONDS * 1_000,
      maxAgeSeconds: 60,
    }),
    true,
  );
  assert.equal(
    requireFreshAuthentication(actor, {
      now: () => NOW_SECONDS * 1_000,
      maxAgeSeconds: 60,
    }),
    actor,
  );
});

test("Auth0 verification fails closed for invalid audience and missing bearer", async () => {
  const signing = await createSigningFixture();
  let resolutions = 0;
  const authenticate = createAuth0Authenticator({
    issuer: ISSUER,
    audience: "https://wrong-audience.example.test",
    jwks: signing.jwks,
    now: () => NOW_SECONDS * 1_000,
    resolveActor: async () => {
      resolutions += 1;
      return { id: "must-not-resolve" };
    },
  });
  const token = await signToken(signing.privateKey);

  assert.equal(
    await authenticate({ headers: { authorization: `Bearer ${token}` } }),
    null,
  );
  assert.equal(await authenticate({ headers: {} }), null);
  assert.equal(resolutions, 0);
});

test("fresh-auth requirement uses auth_time rather than token issue time", async () => {
  const signing = await createSigningFixture();
  const authenticate = createAuth0Authenticator({
    domain: "tenant.example.test",
    audience: AUDIENCE,
    jwks: signing.jwks,
    now: () => NOW_SECONDS * 1_000,
    freshAuthenticationMaxAgeSeconds: 60,
    resolveActor: async () => ({ id: "admin-actor-001" }),
  });
  const staleToken = await signToken(signing.privateKey, {
    auth_time: NOW_SECONDS - 600,
  });

  assert.equal(
    await authenticate(
      { headers: { authorization: `Bearer ${staleToken}` } },
      { requireFresh: true },
    ),
    null,
  );

  const ordinaryActor = await authenticate({
    headers: { authorization: `Bearer ${staleToken}` },
  });
  assert.equal(ordinaryActor.id, "admin-actor-001");
  assert.equal(
    hasFreshAuthentication(ordinaryActor, {
      now: () => NOW_SECONDS * 1_000,
      maxAgeSeconds: 60,
    }),
    false,
  );
});

test("ordinary access tokens do not require tenant-specific AMR or auth_time claims", async () => {
  const signing = await createSigningFixture();
  const authenticate = createAuth0Authenticator({
    issuer: ISSUER,
    audience: AUDIENCE,
    jwks: signing.jwks,
    now: () => NOW_SECONDS * 1_000,
    resolveActor: async () => ({ id: "admin-actor-001", active: true }),
  });
  const token = await signToken(signing.privateKey, {
    amr: undefined,
    auth_time: undefined,
  });

  const actor = await authenticate({
    headers: { authorization: `Bearer ${token}` },
  });

  assert.equal(actor.id, "admin-actor-001");
  assert.deepEqual(actor.authenticationMethods, []);
  assert.equal(actor.freshAuthentication, false);
});

test("explicit authentication-method policy fails closed before actor resolution", async () => {
  const signing = await createSigningFixture();
  let resolutions = 0;
  const authenticate = createAuth0Authenticator({
    issuer: ISSUER,
    audience: AUDIENCE,
    jwks: signing.jwks,
    now: () => NOW_SECONDS * 1_000,
    requiredAuthenticationMethods: ["webauthn"],
    resolveActor: async () => {
      resolutions += 1;
      return { id: "must-not-resolve" };
    },
  });
  const passwordToken = await signToken(signing.privateKey, { amr: ["pwd"] });

  assert.equal(
    await authenticate({
      headers: { authorization: `Bearer ${passwordToken}` },
    }),
    null,
  );
  assert.equal(resolutions, 0);
});

test("ID-token verification binds client audience, nonce, and recent auth_time", async () => {
  const signing = await createSigningFixture();
  const verifyIdToken = createAuth0IdTokenVerifier({
    issuer: ISSUER,
    clientId: CLIENT_ID,
    jwks: signing.jwks,
    now: () => NOW_SECONDS * 1_000,
    freshAuthenticationMaxAgeSeconds: 300,
  });
  async function idToken({
    nonce = "expected-nonce",
    authTime = NOW_SECONDS - 30,
    audience = CLIENT_ID,
  } = {}) {
    return new SignJWT({
      sub: "auth0|owner-test",
      nonce,
      auth_time: authTime,
      amr: ["pwd"],
    })
      .setProtectedHeader({ alg: "RS256", kid: "auth-test-key" })
      .setIssuer(ISSUER)
      .setAudience(audience)
      .setIssuedAt(NOW_SECONDS - 30)
      .setExpirationTime(NOW_SECONDS + 300)
      .sign(signing.privateKey);
  }

  const identity = await verifyIdToken(await idToken(), {
    nonce: "expected-nonce",
  });
  assert.deepEqual(identity, {
    provider: "auth0",
    subject: "auth0|owner-test",
    issuedAt: NOW_SECONDS - 30,
    expiresAt: NOW_SECONDS + 300,
    authenticatedAtEpochSeconds: NOW_SECONDS - 30,
    methods: ["pwd"],
  });
  assert.equal(
    await verifyIdToken(await idToken(), { nonce: "wrong-nonce" }),
    null,
  );
  assert.equal(
    await verifyIdToken(
      await idToken({ authTime: NOW_SECONDS - 301 }),
      { nonce: "expected-nonce" },
    ),
    null,
  );
  assert.equal(
    await verifyIdToken(
      await idToken({ audience: "different-client" }),
      { nonce: "expected-nonce" },
    ),
    null,
  );
});
