if (process.env.NODE_ENV !== "test") {
  throw new Error("TEST_AUTH_FIXTURE_FORBIDDEN_OUTSIDE_TEST");
}

const TEST_TOKEN = "Bearer admin-slice-test-owner";

export const TEST_ACTOR = Object.freeze({
  id: "owner-test-001",
  capabilities: Object.freeze([
    "catalog.read",
    "audit.read",
    "catalog.edit",
    "price.retail.edit",
    "inventory.receive",
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
