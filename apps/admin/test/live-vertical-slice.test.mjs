import assert from "node:assert/strict";
import test from "node:test";

import {
  createAdminApplication,
  SYNTHETIC_PRODUCT,
} from "../src/application.mjs";
import { createAdminHttpServer } from "../scripts/local-admin-server.mjs";
import {
  authenticateTestActor,
  TEST_AUTHORIZATION_HEADER,
} from "./fixtures/test-auth.mjs";
import { createTestCommerceStore } from "./fixtures/test-commerce-store.mjs";

const testEnv = Object.freeze({
  DATABASE_URL: "test-only-database-boundary",
  AUTH0_DOMAIN: "test-only-auth-boundary",
  AUTH0_CLIENT_ID: "test-only-client",
  AUTH0_CLIENT_SECRET: "test-only-secret",
  AUTH0_AUDIENCE: "test-only-audience",
  AUTH0_OWNER_SUB: "auth0|owner-test-001",
  ADMIN_BASE_URL: "https://admin.example.test",
  ADMIN_SESSION_SECRET: "test-only-session-secret-is-at-least-32-bytes",
});

const authorizedHeaders = Object.freeze({
  authorization: TEST_AUTHORIZATION_HEADER,
});

let commandSequence = 0;

function request(
  app,
  method,
  url,
  body,
  authorized = true,
  idempotencyKey,
) {
  const headers = authorized ? { ...authorizedHeaders } : {};
  if (["POST", "PUT", "DELETE"].includes(method)) {
    commandSequence += 1;
    headers["idempotency-key"] =
      idempotencyKey ?? `admin-slice-test-command-${commandSequence}`;
  }

  return app({
    method,
    url,
    headers,
    body,
  });
}

test("test fixtures require explicit injection and cannot mask missing production configuration", async () => {
  assert.equal(process.env.NODE_ENV, "test");

  const store = createTestCommerceStore();
  const app = createAdminApplication({
    env: {},
    authenticateAdmin: authenticateTestActor,
    commerceStore: store,
  });
  const result = await request(
    app,
    "POST",
    "/admin/products",
    SYNTHETIC_PRODUCT,
  );

  assert.equal(result.status, 503);
  assert.equal(JSON.parse(result.body).code, "LIVE_TEST_BLOCKED");
  assert.equal(
    await store.readAdminProduct({ sku: SYNTHETIC_PRODUCT.sku }),
    null,
  );
});

test("HTTP boundary forwards a bounded JSON create command to the injected store", async (context) => {
  const store = createTestCommerceStore();
  const app = createAdminApplication({
    env: testEnv,
    authenticateAdmin: authenticateTestActor,
    commerceStore: store,
  });
  const server = createAdminHttpServer(app);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  context.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  const address = server.address();
  assert.equal(typeof address, "object");
  const result = await fetch(`http://127.0.0.1:${address.port}/admin/products`, {
    method: "POST",
    headers: {
      authorization: TEST_AUTHORIZATION_HEADER,
      "content-type": "application/json",
      "idempotency-key": "http-create-command-001",
    },
    body: JSON.stringify(SYNTHETIC_PRODUCT),
  });

  assert.equal(result.status, 201);
  assert.equal(
    (await store.readAdminProduct({ sku: SYNTHETIC_PRODUCT.sku })).name,
    SYNTHETIC_PRODUCT.name,
  );
});

test("fixture-backed Admin slice executes product, price, immutable receipt, publication projection, and audit", async () => {
  const store = createTestCommerceStore();
  const app = createAdminApplication({
    env: testEnv,
    authenticateAdmin: authenticateTestActor,
    commerceStore: store,
  });

  const unauthorized = await request(
    app,
    "POST",
    "/admin/products",
    SYNTHETIC_PRODUCT,
    false,
  );
  assert.equal(unauthorized.status, 401);
  assert.equal(JSON.parse(unauthorized.body).code, "UNAUTHORIZED");
  assert.equal(
    await store.readAdminProduct({ sku: SYNTHETIC_PRODUCT.sku }),
    null,
  );

  const created = await request(
    app,
    "POST",
    "/admin/products",
    SYNTHETIC_PRODUCT,
  );
  assert.equal(created.status, 201);
  assert.equal(JSON.parse(created.body).result.product.name, SYNTHETIC_PRODUCT.name);
  assert.equal(JSON.parse(created.body).result.product.sku, SYNTHETIC_PRODUCT.sku);
  const createdProductId = JSON.parse(created.body).result.product.id;

  const decimalPrice = await request(
    app,
    "PUT",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}/retail-price`,
    { amountCents: 19.99, currency: "USD" },
  );
  assert.equal(decimalPrice.status, 400);
  assert.equal(JSON.parse(decimalPrice.body).code, "INVALID_RETAIL_PRICE");

  const priced = await request(
    app,
    "PUT",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}/retail-price`,
    { amountCents: 1999, currency: "USD" },
  );
  assert.equal(priced.status, 200);
  assert.equal(JSON.parse(priced.body).result.product.retailPrice.amountCents, 1999);
  assert.equal(
    Number.isSafeInteger(
      JSON.parse(priced.body).result.product.retailPrice.amountCents,
    ),
    true,
  );

  const receiptIdempotencyKey = "admin-slice-receipt-001";
  const received = await request(
    app,
    "POST",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}/inventory-receipts`,
    { quantity: 10 },
    true,
    receiptIdempotencyKey,
  );
  assert.equal(received.status, 201);
  const replayedReceipt = await request(
    app,
    "POST",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}/inventory-receipts`,
    { quantity: 10 },
    true,
    receiptIdempotencyKey,
  );
  assert.equal(replayedReceipt.status, 201);
  assert.equal(replayedReceipt.body, received.body);

  const adminRead = await request(
    app,
    "GET",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}`,
  );
  assert.equal(adminRead.status, 200);
  const adminProduct = JSON.parse(adminRead.body).product;
  assert.equal(adminProduct.currentQuantity, 10);
  assert.equal(adminProduct.availableQuantity, 10);
  assert.equal(Object.hasOwn(adminProduct, "quantity"), false);
  assert.equal(adminProduct.inventoryHistory.length, 1);
  assert.deepEqual(
    {
      eventType: adminProduct.inventoryHistory[0].eventType,
      quantityDelta: adminProduct.inventoryHistory[0].quantityDelta,
      disposition: adminProduct.inventoryHistory[0].disposition,
    },
    { eventType: "RECEIPT", quantityDelta: 10, disposition: "SELLABLE" },
  );
  const canonicalAdminProduct = await store.readAdminProduct({
    sku: SYNTHETIC_PRODUCT.sku,
  });
  assert.equal(Object.isFrozen(canonicalAdminProduct.inventoryHistory), true);
  assert.equal(Object.isFrozen(canonicalAdminProduct.inventoryHistory[0]), true);

  const adminPage = await request(app, "GET", "/admin");
  assert.equal(adminPage.status, 200);
  assert.equal(adminPage.body.includes(SYNTHETIC_PRODUCT.name), true);
  assert.equal(adminPage.body.includes("10 available"), true);
  assert.equal(adminPage.body.includes("Receive inventory + cost"), true);

  const draftProducts = await request(app, "GET", "/api/products");
  assert.equal(draftProducts.status, 200);
  assert.deepEqual(JSON.parse(draftProducts.body).products, []);

  const published = await request(
    app,
    "POST",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}/publish`,
  );
  assert.equal(published.status, 200);

  const visible = await request(app, "GET", "/api/products");
  assert.equal(visible.status, 200);
  const visibleProducts = JSON.parse(visible.body).products;
  assert.equal(visibleProducts.length, 1);
  assert.equal(visibleProducts[0].id, createdProductId);
  assert.equal(visibleProducts[0].name, SYNTHETIC_PRODUCT.name);
  assert.equal(visibleProducts[0].publicationState, "PUBLISHED");
  assert.deepEqual(visibleProducts[0].variants[0].skus[0], {
    id: "sku-1",
    sku: SYNTHETIC_PRODUCT.sku,
    retailPrice: { amountCents: 1999, currency: "USD" },
    availableQuantity: 10,
  });
  assert.equal(JSON.stringify(visibleProducts).includes("inventoryHistory"), false);
  assert.equal(JSON.stringify(visibleProducts).includes("actorId"), false);

  const unpublished = await request(
    app,
    "POST",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}/unpublish`,
  );
  assert.equal(unpublished.status, 200);

  const hidden = await request(app, "GET", "/api/products");
  assert.equal(hidden.status, 200);
  assert.deepEqual(JSON.parse(hidden.body).products, []);

  const adminReadAfterUnpublish = await request(
    app,
    "GET",
    `/admin/products/${SYNTHETIC_PRODUCT.sku}`,
  );
  const retained = JSON.parse(adminReadAfterUnpublish.body).product;
  assert.equal(retained.retailPrice.amountCents, 1999);
  assert.equal(retained.currentQuantity, 10);
  assert.equal(retained.availableQuantity, 10);
  assert.equal(retained.inventoryHistory.length, 1);

  const audit = await request(app, "GET", "/admin/audit");
  assert.equal(audit.status, 200);
  const records = JSON.parse(audit.body).records;
  assert.deepEqual(
    records.map((record) => record.action),
    [
      "CreateProduct",
      "SetRetailPrice",
      "ReceiveInventory",
      "PublishProduct",
      "UnpublishProduct",
    ],
  );
  assert.equal(records.length, 5);
  assert.equal(records.every((record) => record.actorId === "owner-test-001"), true);
  assert.equal(
    records.every(
      (record) =>
        typeof record.occurredAt === "string" &&
        record.reason === "DAY1_ADMIN_MVP" &&
        typeof record.idempotencyKey === "string" &&
        record.priorVersion + 1 === record.resultVersion &&
        record.result === "COMMITTED",
    ),
    true,
  );
});
