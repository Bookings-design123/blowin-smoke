import { timingSafeEqual } from "node:crypto";

import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTHORIZATION_PATTERN = /^Bearer ([A-Za-z0-9._~-]+)$/;

export class AdminAuthenticationError extends Error {
  constructor(code) {
    super(code);
    this.name = "AdminAuthenticationError";
    this.code = code;
  }
}

function requiredText(value, code) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AdminAuthenticationError(code);
  }

  return value.trim();
}

function normalizedIssuer(value) {
  const raw = requiredText(value, "AUTH0_ISSUER_REQUIRED");
  const withScheme = raw.includes("://") ? raw : `https://${raw}`;
  let url;

  try {
    url = new URL(withScheme);
  } catch {
    throw new AdminAuthenticationError("AUTH0_ISSUER_INVALID");
  }

  if (
    url.protocol !== "https:" ||
    url.username !== "" ||
    url.password !== "" ||
    url.search !== "" ||
    url.hash !== "" ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new AdminAuthenticationError("AUTH0_ISSUER_INVALID");
  }

  url.pathname = "/";
  return url.toString();
}

function readAuthorizationHeader(request) {
  const headers = request?.headers ?? {};
  const value =
    typeof headers.get === "function"
      ? headers.get("authorization")
      : headers.authorization ?? headers.Authorization;

  if (typeof value !== "string") {
    throw new AdminAuthenticationError("AUTHORIZATION_REQUIRED");
  }

  const match = AUTHORIZATION_PATTERN.exec(value.trim());
  if (!match) {
    throw new AdminAuthenticationError("AUTHORIZATION_INVALID");
  }

  return match[1];
}

function numericDate(value, code) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new AdminAuthenticationError(code);
  }

  return value;
}

function constantEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authenticationMethods(payload) {
  return Object.freeze(
    Array.isArray(payload.amr)
      ? payload.amr.filter(
          (method) => typeof method === "string" && method.trim() !== "",
        )
      : [],
  );
}

function freezeActor(actor, authentication) {
  if (!actor || typeof actor.id !== "string" || actor.id.trim() === "") {
    throw new AdminAuthenticationError("ADMIN_ACTOR_NOT_AUTHORIZED");
  }

  if (actor.active === false || actor.revoked === true) {
    throw new AdminAuthenticationError("ADMIN_ACTOR_NOT_AUTHORIZED");
  }

  return Object.freeze({
    ...actor,
    id: actor.id.trim(),
    subject: authentication.subject,
    capabilities: Object.freeze(
      Array.isArray(actor.capabilities) ? [...actor.capabilities] : [],
    ),
    authenticatedAt:
      authentication.authenticatedAtEpochSeconds === null
        ? null
        : new Date(authentication.authenticatedAtEpochSeconds * 1_000).toISOString(),
    freshAuthenticationAt: authentication.freshAuthentication
      ? new Date(authentication.authenticatedAtEpochSeconds * 1_000).toISOString()
      : null,
    authenticationMethods: authentication.methods,
    freshAuthentication: authentication.freshAuthentication,
    authentication: Object.freeze(authentication),
  });
}

export function hasFreshAuthentication(
  actor,
  { now = () => Date.now(), maxAgeSeconds = 300 } = {},
) {
  const authenticatedAt =
    actor?.authentication?.authenticatedAtEpochSeconds ??
    (typeof actor?.authenticatedAt === "string"
      ? Math.floor(Date.parse(actor.authenticatedAt) / 1_000)
      : actor?.authenticatedAt);
  if (!Number.isSafeInteger(authenticatedAt) || authenticatedAt < 1) {
    return false;
  }

  if (!Number.isSafeInteger(maxAgeSeconds) || maxAgeSeconds < 0) {
    return false;
  }

  const ageSeconds = Math.floor(now() / 1_000) - authenticatedAt;
  return ageSeconds >= 0 && ageSeconds <= maxAgeSeconds;
}

export function requireFreshAuthentication(actor, options = {}) {
  if (!hasFreshAuthentication(actor, options)) {
    throw new AdminAuthenticationError("FRESH_AUTHENTICATION_REQUIRED");
  }

  return actor;
}

export function createAuth0Authenticator({
  issuer: issuerInput,
  domain,
  audience,
  jwks,
  resolveActor,
  now = () => Date.now(),
  clockToleranceSeconds = 5,
  freshAuthenticationMaxAgeSeconds = 300,
  requiredAuthenticationMethods = [],
} = {}) {
  const issuer = normalizedIssuer(issuerInput ?? domain);
  const resolvedAudience = requiredText(audience, "AUTH0_AUDIENCE_REQUIRED");

  if (typeof resolveActor !== "function") {
    throw new AdminAuthenticationError("ADMIN_ACTOR_RESOLVER_UNBOUND");
  }

  if (typeof now !== "function") {
    throw new AdminAuthenticationError("AUTH_CLOCK_INVALID");
  }

  if (!Number.isSafeInteger(clockToleranceSeconds) || clockToleranceSeconds < 0) {
    throw new AdminAuthenticationError("AUTH_CLOCK_TOLERANCE_INVALID");
  }

  if (
    !Number.isSafeInteger(freshAuthenticationMaxAgeSeconds) ||
    freshAuthenticationMaxAgeSeconds < 0
  ) {
    throw new AdminAuthenticationError("FRESH_AUTH_MAX_AGE_INVALID");
  }

  if (
    !Array.isArray(requiredAuthenticationMethods) ||
    requiredAuthenticationMethods.some(
      (method) => typeof method !== "string" || method.trim() === "",
    )
  ) {
    throw new AdminAuthenticationError("AUTH_METHOD_POLICY_INVALID");
  }

  const acceptedAuthenticationMethods = Object.freeze(
    requiredAuthenticationMethods.map((method) => method.trim()),
  );

  const keySet =
    jwks ?? createRemoteJWKSet(new URL(".well-known/jwks.json", issuer));

  return async function authenticateAdmin(request, requirements = {}) {
    try {
      const token = readAuthorizationHeader(request);
      const currentEpochSeconds = Math.floor(now() / 1_000);
      const { payload, protectedHeader } = await jwtVerify(token, keySet, {
        issuer,
        audience: resolvedAudience,
        algorithms: ["RS256"],
        clockTolerance: clockToleranceSeconds,
        currentDate: new Date(currentEpochSeconds * 1_000),
      });

      if (protectedHeader.alg !== "RS256") {
        throw new AdminAuthenticationError("AUTH_TOKEN_ALGORITHM_INVALID");
      }

      const subject = requiredText(payload.sub, "AUTH_TOKEN_SUBJECT_INVALID");
      const issuedAt = numericDate(payload.iat, "AUTH_TOKEN_ISSUED_AT_INVALID");
      const expiresAt = numericDate(payload.exp, "AUTH_TOKEN_EXPIRY_INVALID");
      const tokenAuthenticationMethods = authenticationMethods(payload);

      if (
        acceptedAuthenticationMethods.length > 0 &&
        !acceptedAuthenticationMethods.some((requiredMethod) =>
          tokenAuthenticationMethods.includes(requiredMethod),
        )
      ) {
        throw new AdminAuthenticationError("PHISHING_RESISTANT_AUTH_REQUIRED");
      }

      if (issuedAt > currentEpochSeconds + clockToleranceSeconds) {
        throw new AdminAuthenticationError("AUTH_TOKEN_ISSUED_AT_INVALID");
      }

      if (expiresAt <= currentEpochSeconds - clockToleranceSeconds) {
        throw new AdminAuthenticationError("AUTH_TOKEN_EXPIRED");
      }

      const authenticatedAt = Number.isSafeInteger(payload.auth_time)
        ? payload.auth_time
        : null;
      const actor = await resolveActor(
        Object.freeze({ provider: "auth0", subject }),
      );
      const authentication = {
        provider: "auth0",
        subject,
        issuedAt,
        expiresAt,
        authenticatedAtEpochSeconds: authenticatedAt,
        methods: tokenAuthenticationMethods,
        freshAuthentication:
          Number.isSafeInteger(authenticatedAt) &&
          currentEpochSeconds - authenticatedAt >= 0 &&
          currentEpochSeconds - authenticatedAt <=
            freshAuthenticationMaxAgeSeconds,
      };
      const resolvedActor = freezeActor(actor, authentication);

      if (
        requirements?.requireFresh === true &&
        !hasFreshAuthentication(resolvedActor, {
          now,
          maxAgeSeconds: freshAuthenticationMaxAgeSeconds,
        })
      ) {
        throw new AdminAuthenticationError("FRESH_AUTHENTICATION_REQUIRED");
      }

      return resolvedActor;
    } catch {
      return null;
    }
  };
}

export function createAuth0IdTokenVerifier({
  issuer: issuerInput,
  domain,
  clientId,
  jwks,
  now = () => Date.now(),
  clockToleranceSeconds = 5,
  freshAuthenticationMaxAgeSeconds = 300,
} = {}) {
  const issuer = normalizedIssuer(issuerInput ?? domain);
  const resolvedClientId = requiredText(clientId, "AUTH0_CLIENT_ID_REQUIRED");

  if (typeof now !== "function") {
    throw new AdminAuthenticationError("AUTH_CLOCK_INVALID");
  }
  if (!Number.isSafeInteger(clockToleranceSeconds) || clockToleranceSeconds < 0) {
    throw new AdminAuthenticationError("AUTH_CLOCK_TOLERANCE_INVALID");
  }
  if (
    !Number.isSafeInteger(freshAuthenticationMaxAgeSeconds) ||
    freshAuthenticationMaxAgeSeconds < 0
  ) {
    throw new AdminAuthenticationError("FRESH_AUTH_MAX_AGE_INVALID");
  }

  const keySet =
    jwks ?? createRemoteJWKSet(new URL(".well-known/jwks.json", issuer));

  return async function verifyAuth0IdToken(token, { nonce } = {}) {
    try {
      const encodedToken = requiredText(token, "AUTH0_ID_TOKEN_REQUIRED");
      const expectedNonce = requiredText(nonce, "AUTH0_NONCE_REQUIRED");
      const currentEpochSeconds = Math.floor(now() / 1_000);
      const { payload, protectedHeader } = await jwtVerify(encodedToken, keySet, {
        issuer,
        audience: resolvedClientId,
        algorithms: ["RS256"],
        clockTolerance: clockToleranceSeconds,
        currentDate: new Date(currentEpochSeconds * 1_000),
        requiredClaims: ["sub", "iat", "exp", "nonce", "auth_time"],
      });

      if (protectedHeader.alg !== "RS256") {
        throw new AdminAuthenticationError("AUTH_TOKEN_ALGORITHM_INVALID");
      }

      const subject = requiredText(payload.sub, "AUTH_TOKEN_SUBJECT_INVALID");
      const issuedAt = numericDate(payload.iat, "AUTH_TOKEN_ISSUED_AT_INVALID");
      const expiresAt = numericDate(payload.exp, "AUTH_TOKEN_EXPIRY_INVALID");
      const authenticatedAt = numericDate(
        payload.auth_time,
        "AUTH_TOKEN_AUTHENTICATED_AT_INVALID",
      );
      const tokenNonce = requiredText(payload.nonce, "AUTH0_NONCE_INVALID");
      if (!constantEqual(tokenNonce, expectedNonce)) {
        throw new AdminAuthenticationError("AUTH0_NONCE_INVALID");
      }
      if (issuedAt > currentEpochSeconds + clockToleranceSeconds) {
        throw new AdminAuthenticationError("AUTH_TOKEN_ISSUED_AT_INVALID");
      }
      if (expiresAt <= currentEpochSeconds - clockToleranceSeconds) {
        throw new AdminAuthenticationError("AUTH_TOKEN_EXPIRED");
      }
      const authenticationAgeSeconds = currentEpochSeconds - authenticatedAt;
      if (
        authenticationAgeSeconds < -clockToleranceSeconds ||
        authenticationAgeSeconds > freshAuthenticationMaxAgeSeconds
      ) {
        throw new AdminAuthenticationError("FRESH_AUTHENTICATION_REQUIRED");
      }

      return Object.freeze({
        provider: "auth0",
        subject,
        issuedAt,
        expiresAt,
        authenticatedAtEpochSeconds: authenticatedAt,
        methods: authenticationMethods(payload),
      });
    } catch {
      return null;
    }
  };
}
