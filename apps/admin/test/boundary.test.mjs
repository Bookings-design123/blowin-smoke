import assert from "node:assert/strict";
import test from "node:test";

import { createAdminApplication } from "../src/application.mjs";
import { inspectRuntimeBoundaries } from "../src/boundaries.mjs";

const configuredEnv = Object.freeze({
  DATABASE_URL: "configured-for-boundary-test",
  AUTH0_DOMAIN: "configured-for-boundary-test",
  AUTH0_CLIENT_ID: "configured-for-boundary-test",
  AUTH0_CLIENT_SECRET: "must-not-appear-in-results",
  AUTH0_AUDIENCE: "configured-for-boundary-test",
  AUTH0_OWNER_SUB: "auth0|configured-owner",
  ADMIN_BASE_URL: "https://admin.example.test",
  ADMIN_SESSION_SECRET: "test-only-session-secret-is-at-least-32-bytes",
});

test("missing Auth0 and database configuration fails closed without exposing values", async () => {
  const runtime = inspectRuntimeBoundaries({
    AUTH0_CLIENT_SECRET: "must-not-appear-in-results",
  });

  assert.equal(runtime.admin.ready, false);
  assert.deepEqual(runtime.admin.missing, [
    "DATABASE_URL",
    "AUTH0_DOMAIN",
    "AUTH0_CLIENT_ID",
    "AUTH0_AUDIENCE",
    "AUTH0_OWNER_SUB",
    "ADMIN_BASE_URL",
    "ADMIN_SESSION_SECRET",
  ]);
  assert.equal(JSON.stringify(runtime).includes("must-not-appear-in-results"), false);

  const app = createAdminApplication({ env: {} });
  const result = await app({ method: "GET", url: "/admin" });

  assert.equal(result.status, 503);
  assert.equal(JSON.parse(result.body).code, "LIVE_TEST_BLOCKED");
});

test("unauthorized product create is denied before any database command", async () => {
  let databaseCalls = 0;
  const app = createAdminApplication({
    env: configuredEnv,
    authenticateAdmin: async () => null,
    commerceStore: {
      async executeAdminCommand() {
        databaseCalls += 1;
      },
    },
  });

  const result = await app({ method: "POST", url: "/admin/products" });

  assert.equal(result.status, 401);
  assert.equal(JSON.parse(result.body).code, "UNAUTHORIZED");
  assert.equal(databaseCalls, 0);
});

test("configured runtime still fails closed when production adapters are unbound", async () => {
  const app = createAdminApplication({ env: configuredEnv });
  const result = await app({
    method: "POST",
    url: "/admin/products",
    body: {
      name: "SEC-IMPL TEST PRODUCT",
      sku: "TEST-SKU-001",
    },
  });

  assert.equal(result.status, 503);
  assert.equal(JSON.parse(result.body).code, "AUTH0_BOUNDARY_UNBOUND");
});

test("authenticated actor without create capability is denied before the store", async () => {
  let databaseCalls = 0;
  const app = createAdminApplication({
    env: configuredEnv,
    authenticateAdmin: async () => ({ id: "limited-owner", capabilities: [] }),
    commerceStore: {
      async executeAdminCommand() {
        databaseCalls += 1;
      },
    },
  });

  const result = await app({
    method: "POST",
    url: "/admin/products",
    headers: { "idempotency-key": "capability-test-command" },
    body: {
      name: "SEC-IMPL TEST PRODUCT",
      sku: "TEST-SKU-001",
    },
  });

  assert.equal(result.status, 403);
  assert.equal(JSON.parse(result.body).status, "DENIED");
  assert.equal(JSON.parse(result.body).code, "FORBIDDEN");
  assert.equal(databaseCalls, 0);
});

test("customer product read fails closed without the database boundary", async () => {
  const app = createAdminApplication({ env: {} });
  const result = await app({ method: "GET", url: "/api/products" });

  assert.equal(result.status, 503);
  assert.deepEqual(JSON.parse(result.body).missing, ["DATABASE_URL"]);
});

test("non-media Admin and catalog work while media actions fail explicitly", async () => {
  let commandCalls = 0;
  const product = {
    id: "product-without-media",
    name: "Product without media",
    images: [],
  };
  const app = createAdminApplication({
    env: configuredEnv,
    authenticateAdmin: async () => ({
      id: "owner-test-001",
      freshAuthentication: true,
      capabilities: ["catalog.edit", "media.manage", "evidence.manage"],
    }),
    commerceStore: {
      async executeAdminCommand() {
        commandCalls += 1;
        return { product };
      },
      async readPublishedProducts() {
        return [product];
      },
    },
  });

  const created = await app({
    method: "POST",
    url: "/admin/products",
    headers: { "idempotency-key": "media-optional-product-create" },
    body: {
      name: "Product without media",
      description: "Catalog remains usable before media activation.",
      division: "THCA",
    },
  });
  assert.equal(created.status, 201);
  assert.equal(commandCalls, 1);

  const catalog = await app({ method: "GET", url: "/api/products" });
  assert.equal(catalog.status, 200);
  assert.deepEqual(JSON.parse(catalog.body).products[0].images, []);

  const image = await app({
    method: "POST",
    url: "/admin/products/product-without-media/images",
    headers: { "idempotency-key": "media-optional-image-upload" },
    body: {},
  });
  assert.equal(image.status, 503);
  assert.equal(JSON.parse(image.body).code, "MEDIA_STORAGE_NOT_CONFIGURED");

  const evidence = await app({
    method: "POST",
    url: "/admin/evidence",
    headers: { "idempotency-key": "media-optional-evidence-upload" },
    body: {},
  });
  assert.equal(evidence.status, 503);
  assert.equal(JSON.parse(evidence.body).code, "MEDIA_STORAGE_NOT_CONFIGURED");
  assert.equal(commandCalls, 1);
});

test("trusted device listing and revocation require the owner device capability and fresh auth", async () => {
  let revokedBy = null;
  const commerceStore = {
    async listAdminDevices({ actorId }) {
      return [{ id: "device-test-001", actorId, status: "ACTIVE" }];
    },
    async revokeAdminDevice({ deviceId, actorId }) {
      revokedBy = { deviceId, actorId };
      return true;
    },
  };
  const actor = {
    id: "owner-test-001",
    freshAuthentication: true,
    capabilities: ["catalog.read", "device.manage"],
  };
  const app = createAdminApplication({
    env: configuredEnv,
    authenticateAdmin: async () => actor,
    commerceStore,
  });

  const listed = await app({ method: "GET", url: "/admin/devices" });
  assert.equal(listed.status, 200);
  assert.equal(JSON.parse(listed.body).devices[0].id, "device-test-001");

  const revoked = await app({
    method: "DELETE",
    url: "/admin/devices/device-test-001",
    headers: { "idempotency-key": "device-revoke-test-001" },
  });
  assert.equal(revoked.status, 200);
  assert.deepEqual(revokedBy, {
    deviceId: "device-test-001",
    actorId: "owner-test-001",
  });

  actor.freshAuthentication = false;
  const stale = await app({
    method: "DELETE",
    url: "/admin/devices/device-test-001",
  });
  assert.equal(stale.status, 403);
  assert.equal(JSON.parse(stale.body).code, "FRESH_AUTHENTICATION_REQUIRED");
});
