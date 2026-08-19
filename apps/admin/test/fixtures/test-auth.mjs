if (process.env.NODE_ENV !== "test") {
  throw new Error("TEST_AUTH_FIXTURE_FORBIDDEN_OUTSIDE_TEST");
}

const TEST_TOKEN = "Bearer admin-slice-test-owner";

const TEST_AUTHENTICATED_AT = "2026-01-01T00:00:00.000Z";

export const TEST_ACTOR = Object.freeze({
  id: "owner-test-001",
  subject: "auth0|owner-test-001",
  sessionId: "test-session-owner-001",
  authenticatedAt: TEST_AUTHENTICATED_AT,
  freshAuthenticationAt: TEST_AUTHENTICATED_AT,
  authenticationMethods: Object.freeze(["webauthn"]),
  freshAuthentication: true,
  capabilities: Object.freeze([
    "catalog.read",
    "audit.read",
    "catalog.edit",
    "supplier.manage",
    "price.retail.edit",
    "inventory.receive",
    "inventory.adjust",
    "media.manage",
    "evidence.manage",
    "reservation.manage",
    "device.manage",
    "catalog.publish",
    "catalog.unpublish",
  ]),
});

export const TEST_AUTHORIZATION_HEADER = TEST_TOKEN;

export async function authenticateTestActor(request = {}) {
  const headers = request.headers ?? {};
  const authorization =
    typeof headers.get === "function"
      ? headers.get("authorization")
      : headers.authorization ?? headers.Authorization;

  return authorization === TEST_TOKEN ? TEST_ACTOR : null;
}
