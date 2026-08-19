import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

import sharp from "sharp";

import { createAdminApplication } from "../src/application.mjs";
import {
  authenticateTestActor as authenticateTestOwner,
  TEST_AUTHORIZATION_HEADER,
} from "./fixtures/test-auth.mjs";
import { createTestCommerceStore } from "./fixtures/test-commerce-store.mjs";
import { createTestPrivateMediaStore } from "./fixtures/test-private-media-store.mjs";

const TEST_ENV = Object.freeze({
  DATABASE_URL: "postgresql://test-only/day1-admin-mvp",
  AUTH0_DOMAIN: "test-only.auth0.invalid",
  AUTH0_CLIENT_ID: "test-only-client",
  AUTH0_CLIENT_SECRET: "test-only-secret",
  AUTH0_AUDIENCE: "https://test-only.invalid/admin",
  AUTH0_OWNER_SUB: "auth0|owner-test-001",
  ADMIN_BASE_URL: "https://test-only.invalid",
  ADMIN_SESSION_SECRET: "test-only-session-secret-with-at-least-32-characters",
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY_ID: "test-only-access-key",
  AWS_SECRET_ACCESS_KEY: "test-only-secret-key",
  S3_MEDIA_BUCKET: "test-only-private-media",
});

const SKU = "TEST-SKU-001";

function jsonBody(response) {
  return JSON.parse(response.body);
}

function createRequester(app) {
  let sequence = 0;

  return async function request(method, url, body, { authorized = true } = {}) {
    const headers = authorized
      ? { authorization: TEST_AUTHORIZATION_HEADER }
      : {};
    if (method !== "GET") {
      sequence += 1;
      headers["idempotency-key"] = `day1-admin-mvp-command-${sequence}`;
      headers["x-correlation-id"] = `day1-admin-mvp-correlation-${sequence}`;
    }
    return app({ method, url, headers, body });
  };
}

async function metadataBearingJpeg() {
  const bytes = await sharp({
    create: {
      width: 8,
      height: 6,
      channels: 3,
      background: "#8d4931",
    },
  })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toBuffer();
  const metadata = await sharp(bytes).metadata();
  assert.notEqual(metadata.exif, undefined);
  return bytes;
}

async function replacementPng() {
  return sharp({
    create: {
      width: 7,
      height: 5,
      channels: 4,
      background: "#23372f",
    },
  })
    .png()
    .toBuffer();
}

test("test-only adapters cannot load when test mode is not explicit", () => {
  const fixtureUrls = [
    new URL("./fixtures/test-auth.mjs", import.meta.url).href,
    new URL("./fixtures/test-commerce-store.mjs", import.meta.url).href,
    new URL("./fixtures/test-private-media-store.mjs", import.meta.url).href,
  ];

  for (const fixtureUrl of fixtureUrls) {
    const attemptedImport = spawnSync(
      process.execPath,
      ["--input-type=module", "--eval", `await import(${JSON.stringify(fixtureUrl)})`],
      {
        encoding: "utf8",
        env: { ...process.env, NODE_ENV: "production" },
      },
    );
    assert.notEqual(attemptedImport.status, 0);
    assert.match(attemptedImport.stderr, /FORBIDDEN_OUTSIDE_TEST/);
  }
});

test("owner completes the Day-1 Admin commerce flow through application boundaries", async () => {
  const commerceStore = createTestCommerceStore();
  const mediaStore = createTestPrivateMediaStore();
  const app = createAdminApplication({
    env: TEST_ENV,
    authenticateAdmin: authenticateTestOwner,
    commerceStore,
    mediaStore,
  });
  const request = createRequester(app);

  const unauthorizedCreate = await request(
    "POST",
    "/admin/products",
    {
      name: "SEC-IMPL TEST PRODUCT",
      description: "Synthetic Day-1 test product",
      division: "VAPE_NICOTINE",
    },
    { authorized: false },
  );
  assert.equal(unauthorizedCreate.status, 401);
  assert.equal(jsonBody(unauthorizedCreate).code, "UNAUTHORIZED");

  const created = await request("POST", "/admin/products", {
    name: "SEC-IMPL TEST PRODUCT",
    description: "Synthetic Day-1 test product",
    division: "VAPE_NICOTINE",
  });
  assert.equal(created.status, 201);
  const productId = jsonBody(created).result.product.id;
  assert.equal(jsonBody(created).result.product.publicationState, "UNPUBLISHED");

  const createdSku = await request(
    "POST",
    `/admin/products/${productId}/variants`,
    {
      variantName: "Synthetic Default",
      attributes: { strength: "TEST" },
      sku: SKU,
    },
  );
  assert.equal(createdSku.status, 201);
  assert.equal(jsonBody(createdSku).result.product.skus[0].sku, SKU);

  const updatedSku = await request("PUT", `/admin/skus/${SKU}`, {
    variantName: "Synthetic Updated",
    attributes: { strength: "TEST", format: "SYNTHETIC" },
  });
  assert.equal(updatedSku.status, 200);
  assert.equal(
    jsonBody(updatedSku).result.product.skus[0].variantName,
    "Synthetic Updated",
  );

  const supplierCreated = await request("POST", "/admin/suppliers", {
    name: "Synthetic Test Supplier",
    code: "TEST-SUPPLIER",
  });
  assert.equal(supplierCreated.status, 201);
  const supplierId = jsonBody(supplierCreated).result.supplier.id;

  const supplierUpdated = await request(
    "PUT",
    `/admin/suppliers/${supplierId}`,
    { name: "Synthetic Test Supplier Updated" },
  );
  assert.equal(supplierUpdated.status, 200);
  assert.equal(
    jsonBody(supplierUpdated).result.supplier.name,
    "Synthetic Test Supplier Updated",
  );

  const received = await request("POST", `/admin/skus/${SKU}/receipts`, {
    supplierId,
    quantityDelta: 10,
    unitCostCents: 700,
    lotCode: "TEST-LOT-001",
  });
  assert.equal(received.status, 201);
  const receivedProduct = jsonBody(received).result.product;
  const lot = receivedProduct.lots.find((candidate) => candidate.lotCode === "TEST-LOT-001");
  assert.ok(lot);
  assert.equal(lot.receivedQuantity, 10);
  assert.equal(lot.unitCostCents, 700);

  const adjusted = await request("POST", `/admin/skus/${SKU}/adjustments`, {
    quantityDelta: 2,
    reason: "Synthetic receiving count correction",
    unitCostCents: 800,
  });
  assert.equal(adjusted.status, 201);
  assert.equal(jsonBody(adjusted).result.product.availableQuantity, 12);

  const priced = await request("PUT", `/admin/skus/${SKU}/retail-price`, {
    amountCents: 1999,
    currency: "USD",
  });
  assert.equal(priced.status, 200);
  const canonicalPrice = jsonBody(priced).result.product.skus[0].retailPrice;
  assert.deepEqual(canonicalPrice, { amountCents: 1999, currency: "USD" });
  assert.equal(Number.isSafeInteger(canonicalPrice.amountCents), true);

  const originalImageBytes = await metadataBearingJpeg();
  const unauthorizedUpload = await request(
    "POST",
    `/admin/products/${productId}/images`,
    {
      filename: "synthetic-source-with-metadata.jpg",
      mimeType: "image/jpeg",
      contentBase64: originalImageBytes.toString("base64"),
    },
    { authorized: false },
  );
  assert.equal(unauthorizedUpload.status, 401);
  assert.equal(mediaStore.inspectObjects().length, 0);

  const uploaded = await request("POST", `/admin/products/${productId}/images`, {
    filename: "synthetic-source-with-metadata.jpg",
    mimeType: "image/jpeg",
    contentBase64: originalImageBytes.toString("base64"),
  });
  assert.equal(uploaded.status, 201);
  const firstImage = jsonBody(uploaded).result.media;
  assert.equal(firstImage.filename, "product-image.jpg");
  assert.equal(firstImage.contentType, "image/jpeg");
  assert.equal(Object.hasOwn(firstImage, "storageKey"), false);
  const firstImageInternal = await commerceStore.readAdminMedia({
    mediaId: firstImage.id,
  });
  const sanitizedObject = await mediaStore.getObject({
    key: firstImageInternal.storageKey,
  });
  const sanitizedMetadata = await sharp(sanitizedObject.bytes).metadata();
  assert.equal(sanitizedMetadata.exif, undefined);
  assert.equal(sanitizedMetadata.xmp, undefined);
  assert.equal(sanitizedMetadata.iptc, undefined);
  assert.equal(sanitizedMetadata.icc, undefined);

  const replacementBytes = await replacementPng();
  const replaced = await request(
    "PUT",
    `/admin/products/${productId}/images/${firstImage.id}`,
    {
      filename: "synthetic-replacement.png",
      mimeType: "image/png",
      contentBase64: replacementBytes.toString("base64"),
    },
  );
  assert.equal(replaced.status, 201);
  const currentImage = jsonBody(replaced).result.media;
  assert.notEqual(currentImage.id, firstImage.id);
  assert.equal(jsonBody(replaced).result.product.images.length, 1);
  assert.equal(jsonBody(replaced).result.product.images[0].id, currentImage.id);
  await assert.rejects(
    mediaStore.getObject({ key: firstImageInternal.storageKey }),
    /TEST_PRIVATE_MEDIA_OBJECT_NOT_FOUND/,
  );
  const currentImageInternal = await commerceStore.readAdminMedia({
    mediaId: currentImage.id,
  });

  const syntheticCoa = Buffer.from(
    "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n",
    "ascii",
  );
  const evidenceAttached = await request("POST", "/admin/evidence", {
    productId,
    lotId: lot.id,
    kind: "COA",
    filename: "synthetic-coa.pdf",
    mimeType: "application/pdf",
    contentBase64: syntheticCoa.toString("base64"),
  });
  assert.equal(evidenceAttached.status, 201);
  const evidence = jsonBody(evidenceAttached).result.evidence;
  assert.equal(evidence.productId, productId);
  assert.equal(evidence.lotId, lot.id);
  assert.equal(evidence.kind, "COA");

  const adminReadBeforePublish = await request(
    "GET",
    `/admin/products/${productId}`,
  );
  assert.equal(adminReadBeforePublish.status, 200);
  const adminProductBeforePublish = jsonBody(adminReadBeforePublish).product;
  assert.equal(adminProductBeforePublish.currentQuantity, 12);
  assert.equal(adminProductBeforePublish.reservedQuantity, 0);
  assert.equal(adminProductBeforePublish.availableQuantity, 12);
  assert.equal(adminProductBeforePublish.inventoryHistory.length, 2);
  assert.deepEqual(
    adminProductBeforePublish.inventoryHistory.map((entry) => entry.eventType),
    ["RECEIPT", "ADJUSTMENT"],
  );
  assert.equal(adminProductBeforePublish.inventoryValueCents, 8600);
  assert.equal(adminProductBeforePublish.cogs.amountCents, 0);
  assert.equal(adminProductBeforePublish.evidence.length, 1);
  assert.equal(adminProductBeforePublish.evidence[0].lotId, lot.id);

  const adminPage = await request("GET", "/admin");
  assert.equal(adminPage.status, 200);
  assert.match(adminPage.body, /<meta name="viewport"/);
  assert.match(adminPage.body, /Catalog commands/);
  assert.match(adminPage.body, /Supplier, receiving, and stock/);
  assert.match(adminPage.body, /Order reservations/);
  assert.match(adminPage.body, /Inventory history/);
  assert.match(adminPage.body, /Trusted Admin devices/);

  const enrollmentPage = await request("GET", "/admin/device-enrollment");
  assert.equal(enrollmentPage.status, 200);
  assert.match(enrollmentPage.body, /One-time enrollment code/);

  const draftCatalog = await request("GET", "/api/products");
  assert.equal(draftCatalog.status, 200);
  assert.deepEqual(jsonBody(draftCatalog).products, []);

  const published = await request(
    "POST",
    `/admin/products/${productId}/publish`,
  );
  assert.equal(published.status, 200);
  assert.equal(jsonBody(published).result.product.publicationState, "PUBLISHED");

  const catalog = await request("GET", "/api/products");
  assert.equal(catalog.status, 200);
  const publicProduct = jsonBody(catalog).products[0];
  assert.equal(publicProduct.id, productId);
  assert.equal(publicProduct.variants[0].skus[0].sku, SKU);
  assert.equal(publicProduct.variants[0].skus[0].retailPrice.amountCents, 1999);
  assert.equal(publicProduct.variants[0].skus[0].availableQuantity, 12);
  assert.equal(publicProduct.images[0].id, currentImage.id);
  const serializedPublicProduct = JSON.stringify(publicProduct);
  assert.equal(serializedPublicProduct.includes("storageKey"), false);
  assert.equal(serializedPublicProduct.includes("inventoryHistory"), false);
  assert.equal(serializedPublicProduct.includes("supplierId"), false);
  assert.equal(serializedPublicProduct.includes("evidence"), false);

  const customerProductRead = await request("GET", `/api/products/${SKU}`);
  assert.equal(customerProductRead.status, 200);
  assert.equal(jsonBody(customerProductRead).product.id, productId);

  const authorizedMediaRead = await request(
    "GET",
    `/api/media/${currentImage.id}`,
  );
  assert.equal(authorizedMediaRead.status, 200);
  assert.equal(authorizedMediaRead.headers["content-type"], "image/jpeg");
  assert.equal(Buffer.isBuffer(authorizedMediaRead.body), true);
  assert.equal(authorizedMediaRead.body.length, currentImage.byteLength);

  const firstReservation = await request("POST", "/admin/reservations", {
    items: [{ sku: SKU, quantity: 8 }],
  });
  assert.equal(firstReservation.status, 201);
  const firstReservationId = jsonBody(firstReservation).result.reservation.id;

  const afterReservation = jsonBody(
    await request("GET", `/admin/products/${productId}`),
  ).product;
  assert.equal(afterReservation.currentQuantity, 12);
  assert.equal(afterReservation.reservedQuantity, 8);
  assert.equal(afterReservation.availableQuantity, 4);

  const oversellAttempt = await request("POST", "/admin/reservations", {
    items: [{ sku: SKU, quantity: 5 }],
  });
  assert.equal(oversellAttempt.status, 409);
  assert.equal(jsonBody(oversellAttempt).code, "INSUFFICIENT_AVAILABLE_INVENTORY");

  const released = await request(
    "POST",
    `/admin/reservations/${firstReservationId}/release`,
  );
  assert.equal(released.status, 200);
  assert.equal(jsonBody(released).result.reservation.status, "RELEASED");
  const afterRelease = jsonBody(
    await request("GET", `/admin/products/${productId}`),
  ).product;
  assert.equal(afterRelease.availableQuantity, 12);
  assert.equal(afterRelease.reservedQuantity, 0);

  const committedReservation = await request("POST", "/admin/reservations", {
    items: [{ sku: SKU, quantity: 6 }],
  });
  assert.equal(committedReservation.status, 201);
  const committedReservationId = jsonBody(committedReservation).result.reservation.id;
  const committed = await request(
    "POST",
    `/admin/reservations/${committedReservationId}/commit`,
  );
  assert.equal(committed.status, 200);
  assert.equal(jsonBody(committed).result.reservation.status, "COMMITTED");
  assert.equal(jsonBody(committed).result.reservation.cogsAmountCents, 4200);

  const afterCommit = jsonBody(
    await request("GET", `/admin/products/${productId}`),
  ).product;
  assert.equal(afterCommit.currentQuantity, 6);
  assert.equal(afterCommit.reservedQuantity, 0);
  assert.equal(afterCommit.availableQuantity, 6);
  assert.equal(afterCommit.cogs.amountCents, 4200);
  assert.equal(afterCommit.inventoryValueCents, 4400);
  assert.deepEqual(
    afterCommit.inventoryHistory.map((entry) => entry.eventType),
    [
      "RECEIPT",
      "ADJUSTMENT",
      "RESERVATION_CREATED",
      "RESERVATION_RELEASED",
      "RESERVATION_CREATED",
      "RESERVATION_COMMITTED",
    ],
  );
  const canonicalProduct = await commerceStore.readAdminProduct({ productId });
  assert.equal(Object.isFrozen(canonicalProduct.inventoryHistory), true);
  assert.equal(
    canonicalProduct.inventoryHistory.every((entry) => Object.isFrozen(entry)),
    true,
  );

  const removed = await request(
    "DELETE",
    `/admin/products/${productId}/images/${currentImage.id}`,
  );
  assert.equal(removed.status, 200);
  assert.deepEqual(jsonBody(removed).result.product.images, []);
  const catalogAfterRemoval = jsonBody(await request("GET", "/api/products"));
  assert.deepEqual(catalogAfterRemoval.products[0].images, []);
  const removedMediaRead = await request(
    "GET",
    `/api/media/${currentImage.id}`,
  );
  assert.equal(removedMediaRead.status, 404);
  await assert.rejects(
    mediaStore.getObject({ key: currentImageInternal.storageKey }),
    /TEST_PRIVATE_MEDIA_OBJECT_NOT_FOUND/,
  );

  const edited = await request("PUT", `/admin/products/${productId}`, {
    name: "SEC-IMPL TEST PRODUCT EDITED",
    description: "Synthetic Day-1 test product, edited through Admin",
  });
  assert.equal(edited.status, 200);
  assert.equal(
    jsonBody(edited).result.product.name,
    "SEC-IMPL TEST PRODUCT EDITED",
  );

  const unpublished = await request(
    "POST",
    `/admin/products/${productId}/unpublish`,
  );
  assert.equal(unpublished.status, 200);
  assert.equal(jsonBody(unpublished).result.product.publicationState, "UNPUBLISHED");
  assert.deepEqual(jsonBody(await request("GET", "/api/products")).products, []);
  assert.equal((await request("GET", `/api/products/${SKU}`)).status, 404);

  const auditRead = await request("GET", "/admin/audit");
  assert.equal(auditRead.status, 200);
  const auditRecords = jsonBody(auditRead).records;
  assert.equal(auditRecords.length, 19);
  assert.deepEqual(
    auditRecords.map((record) => record.action),
    [
      "CreateProduct",
      "CreateSku",
      "UpdateSku",
      "CreateSupplier",
      "UpdateSupplier",
      "ReceiveInventory",
      "AdjustInventory",
      "SetRetailPrice",
      "AttachProductImage",
      "ReplaceProductImage",
      "AttachEvidence",
      "PublishProduct",
      "CreateReservation",
      "ReleaseReservation",
      "CreateReservation",
      "CommitReservation",
      "RemoveProductImage",
      "UpdateProduct",
      "UnpublishProduct",
    ],
  );
  assert.equal(
    auditRecords.every(
      (record) =>
        record.actorId === "owner-test-001" &&
        record.reason === "DAY1_ADMIN_MVP" &&
        record.result === "COMMITTED" &&
        record.priorVersion + 1 === record.resultVersion,
    ),
    true,
  );
  assert.equal(
    auditRecords.filter((record) => record.action === "CreateReservation").length,
    2,
  );
});
