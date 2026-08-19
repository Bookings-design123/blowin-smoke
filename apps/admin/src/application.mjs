import { createHash } from "node:crypto";

import { buildAdminPage } from "./admin-page.mjs";
import {
  authorizeAdmin,
  authorizeCapability,
  bindCommerceStore,
  bindPrivateMediaStore,
  inspectRuntimeBoundaries,
} from "./boundaries.mjs";
import {
  sanitizeEvidenceUpload,
  sanitizeImageUpload,
} from "./image-sanitizer.mjs";
import { MAX_UPLOAD_BINARY_BYTES } from "./upload-policy.mjs";

const NO_STORE = Object.freeze({});
const NO_MEDIA_STORE = Object.freeze({});
const MAX_UPLOAD_BYTES = MAX_UPLOAD_BINARY_BYTES;
const DIVISIONS = new Set(["THCA", "VAPE_NICOTINE", "GLASS_ACCESSORIES"]);
const FRESH_AUTH_CAPABILITIES = new Set([
  "catalog.edit",
  "device.manage",
  "price.retail.edit",
  "inventory.receive",
  "inventory.adjust",
  "supplier.manage",
  "media.manage",
  "evidence.manage",
  "reservation.manage",
  "catalog.publish",
  "catalog.unpublish",
]);

export const SYNTHETIC_PRODUCT = Object.freeze({
  name: "SEC-IMPL TEST PRODUCT",
  sku: "TEST-SKU-001",
});

export const CAPABILITIES = Object.freeze({
  adminRead: "catalog.read",
  auditRead: "audit.read",
  catalogEdit: "catalog.edit",
  priceEdit: "price.retail.edit",
  inventoryReceive: "inventory.receive",
  inventoryAdjust: "inventory.adjust",
  supplierManage: "supplier.manage",
  mediaManage: "media.manage",
  evidenceManage: "evidence.manage",
  reservationManage: "reservation.manage",
  deviceManage: "device.manage",
  publish: "catalog.publish",
  unpublish: "catalog.unpublish",
});

function response(
  status,
  body,
  contentType = "application/json; charset=utf-8",
  headers = {},
) {
  return Object.freeze({
    status,
    headers: Object.freeze({
      "cache-control": "no-store",
      "content-type": contentType,
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      ...headers,
    }),
    body,
  });
}

function json(status, payload) {
  return response(status, JSON.stringify(payload));
}

function blocked(scope, missing = []) {
  return json(503, {
    status: "BLOCKED",
    code: "LIVE_TEST_BLOCKED",
    scope,
    missing,
  });
}

function boundaryUnavailable(result) {
  return json(result.status, {
    status: result.status === 401 || result.status === 403 ? "DENIED" : "BLOCKED",
    code: result.code,
  });
}

function invalid(code, status = 400) {
  return json(status, { status: "REJECTED", code });
}

function parseBody(request) {
  if (request.body === undefined || request.body === null || request.body === "") {
    return Object.freeze({ ok: true, value: Object.freeze({}) });
  }
  if (
    typeof request.body === "object" &&
    !Array.isArray(request.body) &&
    !(request.body instanceof Uint8Array)
  ) {
    return Object.freeze({ ok: true, value: request.body });
  }
  if (typeof request.body !== "string") {
    return Object.freeze({ ok: false, response: invalid("INVALID_JSON_BODY") });
  }
  try {
    const value = JSON.parse(request.body);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return Object.freeze({ ok: false, response: invalid("INVALID_JSON_BODY") });
    }
    return Object.freeze({ ok: true, value });
  } catch {
    return Object.freeze({ ok: false, response: invalid("INVALID_JSON_BODY") });
  }
}

function requestHeader(request, name) {
  const headers = request.headers ?? {};
  if (typeof headers.get === "function") return headers.get(name);
  return headers[name] ?? headers[name.toLowerCase()] ?? null;
}

function stableCommandUuid(request, scope) {
  const idempotencyKey = String(requestHeader(request, "idempotency-key") ?? "");
  const digest = createHash("sha256")
    .update(`${scope}\u0000${idempotencyKey}`)
    .digest("hex");
  const versioned = `${digest.slice(0, 12)}4${digest.slice(13, 16)}a${digest.slice(17, 32)}`;
  return `${versioned.slice(0, 8)}-${versioned.slice(8, 12)}-${versioned.slice(
    12,
    16,
  )}-${versioned.slice(16, 20)}-${versioned.slice(20, 32)}`;
}

function decodePath(value) {
  try {
    const decoded = decodeURIComponent(value);
    return decoded.length > 0 && decoded.length <= 160 ? decoded : null;
  } catch {
    return null;
  }
}

function text(value, { max = 4000, required = false } = {}) {
  if (value === undefined || value === null || value === "") {
    return required ? null : undefined;
  }
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if ((required && normalized === "") || normalized.length > max) return null;
  return normalized;
}

function sku(value) {
  const normalized = text(value, { required: true, max: 64 });
  return normalized && /^[A-Z0-9][A-Z0-9._-]{1,63}$/i.test(normalized)
    ? normalized.toUpperCase()
    : null;
}

function integer(value, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  return Number.isSafeInteger(value) && value >= min && value <= max ? value : null;
}

function commandFailure(error) {
  if (
    error &&
    error.safe === true &&
    Number.isInteger(error.status) &&
    error.status >= 400 &&
    error.status < 500 &&
    typeof error.code === "string"
  ) {
    return invalid(error.code, error.status);
  }
  return json(503, { status: "BLOCKED", code: "DATABASE_COMMAND_FAILED" });
}

function readFailure() {
  return json(503, { status: "BLOCKED", code: "DATABASE_READ_FAILED" });
}

function normalizeAdapterResponse(result) {
  if (
    result &&
    Number.isInteger(result.status) &&
    result.headers &&
    Object.hasOwn(result, "body")
  ) {
    return Object.freeze(result);
  }
  return blocked("AUTH0_WEB_FLOW");
}

function decodeUpload(body) {
  const filename = text(body.filename, { required: true, max: 240 });
  const mimeType = text(body.mimeType, { required: true, max: 120 });
  if (!filename || !mimeType || typeof body.contentBase64 !== "string") {
    return Object.freeze({ ok: false, response: invalid("UPLOAD_REQUIRED") });
  }
  const encoded = body.contentBase64.replaceAll("\n", "").replaceAll("\r", "");
  if (
    encoded.length === 0 ||
    encoded.length > Math.ceil((MAX_UPLOAD_BYTES * 4) / 3) + 8 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)
  ) {
    return Object.freeze({ ok: false, response: invalid("INVALID_UPLOAD_ENCODING") });
  }
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES) {
    return Object.freeze({ ok: false, response: invalid("UPLOAD_SIZE_REJECTED") });
  }
  return Object.freeze({ ok: true, filename, mimeType, bytes });
}

async function readProductByIdOrSku(store, target) {
  const byId = await store.readAdminProduct({ productId: target });
  return byId ?? store.readAdminProduct({ sku: target });
}

export function createAdminApplication({
  env = process.env,
  authenticateAdmin,
  commerceStore = NO_STORE,
  mediaStore = NO_MEDIA_STORE,
  authFlow,
} = {}) {
  const runtime = inspectRuntimeBoundaries(env);

  async function openAdminBoundary(request, capability, requiredStoreMethod) {
    if (!runtime.admin.ready) {
      return Object.freeze({
        ok: false,
        response: blocked("ADMIN_AUTH0_AND_DATABASE", runtime.admin.missing),
      });
    }
    const authorization = await authorizeAdmin(request, authenticateAdmin);
    if (!authorization.ok) {
      return Object.freeze({
        ok: false,
        response: boundaryUnavailable(authorization),
      });
    }
    const permission = authorizeCapability(authorization.actor, capability);
    if (!permission.ok) {
      return Object.freeze({ ok: false, response: boundaryUnavailable(permission) });
    }
    if (
      FRESH_AUTH_CAPABILITIES.has(capability) &&
      authorization.actor.freshAuthentication !== true
    ) {
      return Object.freeze({
        ok: false,
        response: boundaryUnavailable({
          status: 403,
          code: "FRESH_AUTHENTICATION_REQUIRED",
        }),
      });
    }
    const database = bindCommerceStore(commerceStore, requiredStoreMethod);
    if (!database.ok) {
      return Object.freeze({ ok: false, response: boundaryUnavailable(database) });
    }
    return Object.freeze({
      ok: true,
      actor: authorization.actor,
      store: database.store,
    });
  }

  function openMediaBoundary() {
    if (!runtime.privateMedia.ready) {
      return Object.freeze({
        ok: false,
        response: blocked("PRIVATE_MEDIA_STORAGE", runtime.privateMedia.missing),
      });
    }
    const media = bindPrivateMediaStore(mediaStore, "putObject");
    if (!media.ok) {
      return Object.freeze({ ok: false, response: boundaryUnavailable(media) });
    }
    return Object.freeze({ ok: true, store: media.store });
  }

  async function runCommand(
    request,
    boundary,
    capability,
    type,
    payload,
    status = 200,
  ) {
    const rawIdempotencyKey = requestHeader(request, "idempotency-key");
    const idempotencyKey =
      typeof rawIdempotencyKey === "string" ? rawIdempotencyKey.trim() : "";
    if (idempotencyKey.length < 8 || idempotencyKey.length > 128) {
      return Object.freeze({
        ok: false,
        response: invalid("IDEMPOTENCY_KEY_REQUIRED"),
      });
    }
    const rawCorrelationId = requestHeader(request, "x-correlation-id");
    const correlationId =
      typeof rawCorrelationId === "string" && rawCorrelationId.trim() !== ""
        ? rawCorrelationId.trim().slice(0, 128)
        : idempotencyKey;
    try {
      const result = await boundary.store.executeAdminCommand({
        type,
        capability,
        actor: boundary.actor,
        idempotencyKey,
        correlationId,
        reason: "DAY1_ADMIN_MVP",
        payload: Object.freeze({ ...payload }),
      });
      return Object.freeze({
        ok: true,
        result,
        response: json(status, { status: "OK", result }),
      });
    } catch (error) {
      return Object.freeze({ ok: false, response: commandFailure(error) });
    }
  }

  async function uploadMedia({
    request,
    boundary,
    capability,
    type,
    payload,
    kind,
    status = 201,
  }) {
    const mediaBoundary = openMediaBoundary();
    if (!mediaBoundary.ok) return mediaBoundary.response;
    const body = parseBody(request);
    if (!body.ok) return body.response;
    const upload = decodeUpload(body.value);
    if (!upload.ok) return upload.response;
    let commandPayload;
    try {
      commandPayload = payload(body.value);
    } catch (error) {
      return invalid(error?.code ?? "INVALID_MEDIA_ASSOCIATION");
    }
    let supersededMedia = null;
    if (
      commandPayload.previousMediaId &&
      typeof boundary.store.readAdminMedia === "function"
    ) {
      try {
        supersededMedia = await boundary.store.readAdminMedia({
          mediaId: commandPayload.previousMediaId,
        });
      } catch {
        return readFailure();
      }
    }

    let sanitized;
    try {
      sanitized =
        kind === "PRODUCT_IMAGE"
          ? await sanitizeImageUpload(upload)
          : await sanitizeEvidenceUpload(upload);
    } catch (error) {
      return invalid(error?.code ?? "UPLOAD_CONTENT_REJECTED");
    }

    const mediaId = stableCommandUuid(request, `${type}:media`);
    const storageKey = `private-media/${stableCommandUuid(request, `${type}:object`)}`;
    try {
      await mediaBoundary.store.putObject({
        key: storageKey,
        bytes: sanitized.bytes,
        contentType: sanitized.contentType,
        checksum: sanitized.checksum,
      });
    } catch {
      try {
        const existing = await mediaBoundary.store.getObject({ key: storageKey });
        if (existing.checksum !== sanitized.checksum) throw new Error("CHECKSUM_MISMATCH");
      } catch {
        return json(503, {
          status: "BLOCKED",
          code: "PRIVATE_MEDIA_WRITE_FAILED",
        });
      }
    }

    const media = Object.freeze({
      id: mediaId,
      storageKey,
      filename: sanitized.filename,
      contentType: sanitized.contentType,
      byteLength: sanitized.byteLength,
      checksum: sanitized.checksum,
    });
    const executed = await runCommand(
      request,
      boundary,
      capability,
      type,
      Object.freeze({ ...commandPayload, media }),
      status,
    );
    if (
      !executed.ok &&
      typeof mediaBoundary.store.deleteObject === "function"
    ) {
      try {
        await mediaBoundary.store.deleteObject({ key: storageKey });
      } catch {
        // The unreferenced object remains private and inaccessible if cleanup fails.
      }
    }
    if (
      executed.ok &&
      supersededMedia?.storageKey &&
      typeof mediaBoundary.store.deleteObject === "function"
    ) {
      try {
        await mediaBoundary.store.deleteObject({ key: supersededMedia.storageKey });
      } catch {
        // The replaced object is no longer authorized through any application read path.
      }
    }
    return executed.response;
  }

  return async function handle(request = {}) {
    const method = String(request.method ?? "GET").toUpperCase();
    const url = new URL(String(request.url ?? "/"), "http://localhost");

    if (method === "GET" && url.pathname === "/admin/login") {
      if (!authFlow || typeof authFlow.beginLogin !== "function") {
        return blocked("AUTH0_WEB_LOGIN");
      }
      try {
        return normalizeAdapterResponse(await authFlow.beginLogin(request));
      } catch {
        return blocked("AUTH0_WEB_LOGIN");
      }
    }
    if (method === "GET" && url.pathname === "/admin/device-enrollment") {
      return response(
        200,
        `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Enroll Admin device</title><style>body{font:16px/1.5 system-ui;margin:0;background:#f4f1ea;color:#151515}main{max-width:34rem;margin:10vh auto;padding:1.25rem}form{display:grid;gap:1rem;background:#fff;border:1px solid #d8d5cf;border-radius:14px;padding:1.25rem}label{display:grid;gap:.4rem;font-weight:700}input,button{font:inherit;min-height:48px;padding:.7rem;border:1px solid #aaa;border-radius:9px}button{background:#151515;color:#fff;font-weight:800}</style></head><body><main><h1>Enroll this Admin device</h1><p>Create a one-time code from an already trusted Blowin' Smoke Admin device, then enter it here. A fresh Auth0 passkey check follows.</p><form method="get" action="/admin/login"><label>One-time enrollment code<input name="enrollment_code" required minlength="8" maxlength="64" autocomplete="one-time-code"></label><button type="submit">Continue with passkey</button></form></main></body></html>`,
        "text/html; charset=utf-8",
      );
    }
    if (method === "GET" && url.pathname === "/admin/callback") {
      if (!authFlow || typeof authFlow.completeLogin !== "function") {
        return blocked("AUTH0_WEB_CALLBACK");
      }
      try {
        return normalizeAdapterResponse(await authFlow.completeLogin(request));
      } catch {
        return blocked("AUTH0_WEB_CALLBACK");
      }
    }
    if (method === "POST" && url.pathname === "/admin/logout") {
      if (!authFlow || typeof authFlow.logout !== "function") {
        return blocked("AUTH0_WEB_LOGOUT");
      }
      try {
        return normalizeAdapterResponse(await authFlow.logout(request));
      } catch {
        return blocked("AUTH0_WEB_LOGOUT");
      }
    }
    if (
      method === "POST" &&
      url.pathname === "/admin/devices/enrollment-grant"
    ) {
      if (
        !authFlow ||
        typeof authFlow.createDeviceEnrollmentGrant !== "function"
      ) {
        return blocked("ADMIN_DEVICE_ENROLLMENT");
      }
      try {
        return normalizeAdapterResponse(
          await authFlow.createDeviceEnrollmentGrant(request),
        );
      } catch {
        return blocked("ADMIN_DEVICE_ENROLLMENT");
      }
    }
    if (method === "GET" && url.pathname === "/admin/devices") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.adminRead,
        "listAdminDevices",
      );
      if (!boundary.ok) return boundary.response;
      try {
        return json(200, {
          status: "OK",
          devices: await boundary.store.listAdminDevices({
            actorId: boundary.actor.id,
          }),
        });
      } catch {
        return readFailure();
      }
    }
    const deviceRoute = url.pathname.match(/^\/admin\/devices\/([^/]+)$/);
    if (method === "DELETE" && deviceRoute) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.deviceManage,
        "revokeAdminDevice",
      );
      if (!boundary.ok) return boundary.response;
      const deviceId = decodePath(deviceRoute[1]);
      if (!deviceId) return invalid("INVALID_DEVICE_ID");
      try {
        const revoked = await boundary.store.revokeAdminDevice({
          deviceId,
          actorId: boundary.actor.id,
        });
        return revoked
          ? json(200, { status: "OK", revoked: true })
          : json(404, { status: "NOT_FOUND" });
      } catch {
        return readFailure();
      }
    }

    if (method === "GET" && url.pathname === "/admin") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.adminRead,
        "readAdminDashboard",
      );
      if (!boundary.ok) {
        if (
          boundary.response.status === 401 &&
          authFlow &&
          typeof authFlow.beginLogin === "function"
        ) {
          return response(302, "", "text/plain; charset=utf-8", {
            location: "/admin/login",
          });
        }
        return boundary.response;
      }
      try {
        const dashboard = await boundary.store.readAdminDashboard();
        const devices =
          typeof boundary.store.listAdminDevices === "function"
            ? await boundary.store.listAdminDevices({ actorId: boundary.actor.id })
            : [];
        return response(
          200,
          buildAdminPage({ ...dashboard, devices }, boundary.actor),
          "text/html; charset=utf-8",
        );
      } catch {
        return readFailure();
      }
    }

    if (url.pathname === "/admin/products" && method === "GET") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.adminRead,
        "readAdminDashboard",
      );
      if (!boundary.ok) return boundary.response;
      try {
        const dashboard = await boundary.store.readAdminDashboard();
        return json(200, { status: "OK", products: dashboard.products ?? [] });
      } catch {
        return readFailure();
      }
    }

    if (url.pathname === "/admin/products" && method === "POST") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.catalogEdit,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const name = text(body.value.name, { required: true, max: 160 });
      const description = text(body.value.description, { max: 4000 }) ?? "";
      const division =
        body.value.division === undefined && body.value.sku === SYNTHETIC_PRODUCT.sku
          ? "VAPE_NICOTINE"
          : body.value.division;
      const legacySku = body.value.sku === undefined ? undefined : sku(body.value.sku);
      if (!name || !DIVISIONS.has(division) || (body.value.sku !== undefined && !legacySku)) {
        return invalid("INVALID_PRODUCT");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.catalogEdit,
        "CreateProduct",
        {
          productId: stableCommandUuid(request, "CreateProduct:product"),
          name,
          description,
          division,
          ...(legacySku
            ? {
                sku: legacySku,
                variantId: stableCommandUuid(request, "CreateProduct:variant"),
                skuId: stableCommandUuid(request, "CreateProduct:sku"),
                variantName: "Default",
              }
            : {}),
        },
        201,
      );
      return executed.response;
    }

    const productVariantRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/variants$/,
    );
    if (method === "POST" && productVariantRoute) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.catalogEdit,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const productId = decodePath(productVariantRoute[1]);
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const variantName = text(body.value.variantName, { required: true, max: 120 });
      const skuCode = sku(body.value.sku);
      const attributes =
        body.value.attributes === undefined ? {} : body.value.attributes;
      if (
        !productId ||
        !variantName ||
        !skuCode ||
        !attributes ||
        typeof attributes !== "object" ||
        Array.isArray(attributes)
      ) {
        return invalid("INVALID_SKU_VARIANT");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.catalogEdit,
        "CreateSku",
        {
          productId,
          variantId: stableCommandUuid(request, "CreateSku:variant"),
          skuId: stableCommandUuid(request, "CreateSku:sku"),
          variantName,
          attributes,
          sku: skuCode,
        },
        201,
      );
      return executed.response;
    }

    const productImageRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/images(?:\/([^/]+))?$/,
    );
    if (productImageRoute && ["POST", "PUT", "DELETE"].includes(method)) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.mediaManage,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const productId = decodePath(productImageRoute[1]);
      const previousMediaId = productImageRoute[2]
        ? decodePath(productImageRoute[2])
        : null;
      if (!productId) return invalid("INVALID_PRODUCT_ID");

      if (method === "DELETE") {
        if (!previousMediaId) return invalid("INVALID_MEDIA_ID");
        const mediaBoundary = openMediaBoundary();
        if (!mediaBoundary.ok) return mediaBoundary.response;
        let previousMedia;
        try {
          previousMedia = await boundary.store.readAdminMedia({
            mediaId: previousMediaId,
          });
        } catch {
          return readFailure();
        }
        const executed = await runCommand(
          request,
          boundary,
          CAPABILITIES.mediaManage,
          "RemoveProductImage",
          { productId, mediaId: previousMediaId },
        );
        if (
          executed.ok &&
          previousMedia?.storageKey &&
          typeof mediaBoundary.store.deleteObject === "function"
        ) {
          try {
            await mediaBoundary.store.deleteObject({ key: previousMedia.storageKey });
          } catch {
            // The removed object is no longer authorized through any application read path.
          }
        }
        return executed.response;
      }
      if (method === "PUT" && !previousMediaId) return invalid("INVALID_MEDIA_ID");
      return uploadMedia({
        request,
        boundary,
        capability: CAPABILITIES.mediaManage,
        type: method === "PUT" ? "ReplaceProductImage" : "AttachProductImage",
        kind: "PRODUCT_IMAGE",
        payload: () => ({
          productId,
          ...(previousMediaId ? { previousMediaId } : {}),
        }),
      });
    }

    const publicationRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/(publish|unpublish)$/,
    );
    if (method === "POST" && publicationRoute) {
      const publishing = publicationRoute[2] === "publish";
      const capability = publishing ? CAPABILITIES.publish : CAPABILITIES.unpublish;
      const boundary = await openAdminBoundary(
        request,
        capability,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const target = decodePath(publicationRoute[1]);
      if (!target) return invalid("INVALID_PRODUCT_ID");
      let product;
      try {
        product = await readProductByIdOrSku(boundary.store, target);
      } catch {
        return readFailure();
      }
      if (!product) return json(404, { status: "NOT_FOUND" });
      const executed = await runCommand(
        request,
        boundary,
        capability,
        publishing ? "PublishProduct" : "UnpublishProduct",
        { productId: product.id, ...(product.sku ? { sku: product.sku } : {}) },
      );
      return executed.response;
    }

    const legacyPriceRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/retail-price$/,
    );
    const skuPriceRoute = url.pathname.match(/^\/admin\/skus\/([^/]+)\/retail-price$/);
    if (method === "PUT" && (legacyPriceRoute || skuPriceRoute)) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.priceEdit,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const skuCode = sku(decodePath((legacyPriceRoute ?? skuPriceRoute)[1]));
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const amountCents = integer(body.value.amountCents, { min: 0 });
      if (!skuCode || amountCents === null || body.value.currency !== "USD") {
        return invalid("INVALID_RETAIL_PRICE");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.priceEdit,
        "SetRetailPrice",
        { sku: skuCode, amountCents, currency: "USD" },
      );
      return executed.response;
    }

    const legacyReceiptRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/inventory-receipts$/,
    );
    const skuReceiptRoute = url.pathname.match(/^\/admin\/skus\/([^/]+)\/receipts$/);
    if (method === "POST" && (legacyReceiptRoute || skuReceiptRoute)) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.inventoryReceive,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const skuCode = sku(decodePath((legacyReceiptRoute ?? skuReceiptRoute)[1]));
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const quantityDelta = integer(body.value.quantityDelta ?? body.value.quantity, {
        min: 1,
      });
      const unitCostCents = integer(body.value.unitCostCents ?? 0, { min: 0 });
      const supplierId = text(body.value.supplierId, { max: 160 });
      const lotCode =
        text(body.value.lotCode, { max: 96 }) ??
        (legacyReceiptRoute ? "LEGACY-SLICE-RECEIPT" : null);
      if (
        !skuCode ||
        quantityDelta === null ||
        unitCostCents === null ||
        !lotCode ||
        (!legacyReceiptRoute && !supplierId)
      ) {
        return invalid("INVALID_RECEIPT");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.inventoryReceive,
        "ReceiveInventory",
        {
          lotId: stableCommandUuid(request, "ReceiveInventory:lot"),
          sku: skuCode,
          supplierId: supplierId ?? null,
          quantityDelta,
          unitCostCents,
          currency: "USD",
          lotCode,
          disposition: "SELLABLE",
        },
        201,
      );
      return executed.response;
    }

    const adjustmentRoute = url.pathname.match(
      /^\/admin\/skus\/([^/]+)\/adjustments$/,
    );
    if (method === "POST" && adjustmentRoute) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.inventoryAdjust,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const skuCode = sku(decodePath(adjustmentRoute[1]));
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const quantityDelta = integer(body.value.quantityDelta);
      const reason = text(body.value.reason, { required: true, max: 240 });
      const unitCostCents =
        body.value.unitCostCents === undefined
          ? undefined
          : integer(body.value.unitCostCents, { min: 0 });
      if (
        !skuCode ||
        quantityDelta === null ||
        quantityDelta === 0 ||
        !reason ||
        unitCostCents === null ||
        (quantityDelta > 0 && unitCostCents === undefined)
      ) {
        return invalid("INVALID_INVENTORY_ADJUSTMENT");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.inventoryAdjust,
        "AdjustInventory",
        {
          sku: skuCode,
          quantityDelta,
          reason,
          unitCostCents,
          currency: "USD",
        },
        201,
      );
      return executed.response;
    }

    const skuRoute = url.pathname.match(/^\/admin\/skus\/([^/]+)$/);
    if (skuRoute && ["PUT", "DELETE"].includes(method)) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.catalogEdit,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const skuCode = sku(decodePath(skuRoute[1]));
      if (!skuCode) return invalid("INVALID_SKU");
      if (method === "DELETE") {
        const executed = await runCommand(
          request,
          boundary,
          CAPABILITIES.catalogEdit,
          "ArchiveSku",
          { sku: skuCode },
        );
        return executed.response;
      }
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const newSku = body.value.newSku === undefined ? undefined : sku(body.value.newSku);
      const variantName = text(body.value.variantName, { max: 120 });
      const attributes = body.value.attributes;
      if (
        (body.value.newSku !== undefined && !newSku) ||
        (attributes !== undefined &&
          (!attributes || typeof attributes !== "object" || Array.isArray(attributes))) ||
        (newSku === undefined && variantName === undefined && attributes === undefined)
      ) {
        return invalid("INVALID_SKU_UPDATE");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.catalogEdit,
        "UpdateSku",
        { sku: skuCode, newSku, variantName, attributes },
      );
      return executed.response;
    }

    if (url.pathname === "/admin/suppliers" && method === "POST") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.supplierManage,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const name = text(body.value.name, { required: true, max: 160 });
      const code = text(body.value.code, { required: true, max: 48 })?.toUpperCase();
      if (!name || !code || !/^[A-Z0-9][A-Z0-9._-]{1,47}$/.test(code)) {
        return invalid("INVALID_SUPPLIER");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.supplierManage,
        "CreateSupplier",
        { supplierId: stableCommandUuid(request, "CreateSupplier:supplier"), name, code },
        201,
      );
      return executed.response;
    }

    const supplierRoute = url.pathname.match(/^\/admin\/suppliers\/([^/]+)$/);
    if (supplierRoute && method === "PUT") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.supplierManage,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const supplierId = decodePath(supplierRoute[1]);
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const name = text(body.value.name, { max: 160 });
      const code = text(body.value.code, { max: 48 })?.toUpperCase();
      if (
        !supplierId ||
        (name === undefined && code === undefined) ||
        (code !== undefined && !/^[A-Z0-9][A-Z0-9._-]{1,47}$/.test(code))
      ) {
        return invalid("INVALID_SUPPLIER_UPDATE");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.supplierManage,
        "UpdateSupplier",
        { supplierId, name, code },
      );
      return executed.response;
    }

    if (url.pathname === "/admin/evidence" && method === "POST") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.evidenceManage,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      return uploadMedia({
        request,
        boundary,
        capability: CAPABILITIES.evidenceManage,
        type: "AttachEvidence",
        kind: "EVIDENCE",
        payload: (body) => {
          const productId = text(body.productId, { max: 160 });
          const lotId = text(body.lotId, { max: 160 });
          const evidenceKind = text(body.kind, { required: true, max: 48 });
          if ((!productId && !lotId) || !evidenceKind) {
            const error = new Error("INVALID_EVIDENCE_ASSOCIATION");
            error.code = "INVALID_EVIDENCE_ASSOCIATION";
            throw error;
          }
          return { productId, lotId, kind: evidenceKind };
        },
      });
    }

    if (url.pathname === "/admin/reservations" && method === "POST") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.reservationManage,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const body = parseBody(request);
      if (!body.ok) return body.response;
      if (!Array.isArray(body.value.items) || body.value.items.length === 0 || body.value.items.length > 50) {
        return invalid("INVALID_RESERVATION_ITEMS");
      }
      const items = [];
      for (const item of body.value.items) {
        const skuCode = sku(item?.sku);
        const quantity = integer(item?.quantity, { min: 1, max: 100000 });
        if (!skuCode || quantity === null) return invalid("INVALID_RESERVATION_ITEMS");
        items.push(Object.freeze({ sku: skuCode, quantity }));
      }
      let expiresAt;
      if (body.value.expiresAt) {
        const date = new Date(body.value.expiresAt);
        if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
          return invalid("INVALID_RESERVATION_EXPIRY");
        }
        expiresAt = date.toISOString();
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.reservationManage,
        "CreateReservation",
        {
          reservationId: stableCommandUuid(request, "CreateReservation:reservation"),
          items,
          expiresAt,
        },
        201,
      );
      return executed.response;
    }

    const reservationRoute = url.pathname.match(
      /^\/admin\/reservations\/([^/]+)\/(commit|release)$/,
    );
    if (reservationRoute && method === "POST") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.reservationManage,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const reservationId = decodePath(reservationRoute[1]);
      if (!reservationId) return invalid("INVALID_RESERVATION_ID");
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.reservationManage,
        reservationRoute[2] === "commit"
          ? "CommitReservation"
          : "ReleaseReservation",
        { reservationId },
      );
      return executed.response;
    }

    const adminMediaRoute = url.pathname.match(/^\/admin\/media\/([^/]+)$/);
    if (adminMediaRoute && method === "GET") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.mediaManage,
        "readAdminMedia",
      );
      if (!boundary.ok) return boundary.response;
      const mediaBoundary = openMediaBoundary();
      if (!mediaBoundary.ok) return mediaBoundary.response;
      const getBoundary = bindPrivateMediaStore(mediaBoundary.store, "getObject");
      if (!getBoundary.ok) return boundaryUnavailable(getBoundary);
      try {
        const media = await boundary.store.readAdminMedia({
          mediaId: decodePath(adminMediaRoute[1]),
        });
        if (!media) return json(404, { status: "NOT_FOUND" });
        const object = await getBoundary.store.getObject({ key: media.storageKey });
        return response(200, object.bytes, media.contentType, {
          "content-length": String(object.bytes.length),
          ...(media.contentType === "application/pdf"
            ? { "content-disposition": 'attachment; filename="evidence.pdf"' }
            : {}),
        });
      } catch {
        return json(503, { status: "BLOCKED", code: "PRIVATE_MEDIA_READ_FAILED" });
      }
    }

    const productRoute = url.pathname.match(/^\/admin\/products\/([^/]+)$/);
    if (productRoute && ["GET", "PUT", "DELETE"].includes(method)) {
      const target = decodePath(productRoute[1]);
      if (!target) return invalid("INVALID_PRODUCT_ID");
      if (method === "GET") {
        const boundary = await openAdminBoundary(
          request,
          CAPABILITIES.adminRead,
          "readAdminProduct",
        );
        if (!boundary.ok) return boundary.response;
        try {
          const product = await readProductByIdOrSku(boundary.store, target);
          if (!product) return json(404, { status: "NOT_FOUND" });
          return json(200, { status: "OK", product });
        } catch {
          return readFailure();
        }
      }
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.catalogEdit,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      if (method === "DELETE") {
        const executed = await runCommand(
          request,
          boundary,
          CAPABILITIES.catalogEdit,
          "ArchiveProduct",
          { productId: target },
        );
        return executed.response;
      }
      const body = parseBody(request);
      if (!body.ok) return body.response;
      const name = text(body.value.name, { max: 160 });
      const description = text(body.value.description, { max: 4000 });
      const division = body.value.division;
      if (
        (division !== undefined && !DIVISIONS.has(division)) ||
        (name === undefined && description === undefined && division === undefined)
      ) {
        return invalid("INVALID_PRODUCT_UPDATE");
      }
      const executed = await runCommand(
        request,
        boundary,
        CAPABILITIES.catalogEdit,
        "UpdateProduct",
        { productId: target, name, description, division },
      );
      return executed.response;
    }

    if (method === "GET" && url.pathname === "/admin/audit") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.auditRead,
        "readAuditRecords",
      );
      if (!boundary.ok) return boundary.response;
      try {
        return json(200, {
          status: "OK",
          records: await boundary.store.readAuditRecords(),
        });
      } catch {
        return readFailure();
      }
    }

    if (method === "GET" && url.pathname === "/api/products") {
      if (!runtime.customerRead.ready) {
        return blocked("CUSTOMER_READ_DATABASE", runtime.customerRead.missing);
      }
      const database = bindCommerceStore(commerceStore, "readPublishedProducts");
      if (!database.ok) return boundaryUnavailable(database);
      try {
        return json(200, { products: await database.store.readPublishedProducts() });
      } catch {
        return readFailure();
      }
    }

    const customerProductRoute = url.pathname.match(/^\/api\/products\/([^/]+)$/);
    if (method === "GET" && customerProductRoute) {
      if (!runtime.customerRead.ready) {
        return blocked("CUSTOMER_READ_DATABASE", runtime.customerRead.missing);
      }
      const database = bindCommerceStore(commerceStore, "readPublishedProducts");
      if (!database.ok) return boundaryUnavailable(database);
      const skuCode = sku(decodePath(customerProductRoute[1]));
      if (!skuCode) return invalid("INVALID_SKU");
      try {
        const products = await database.store.readPublishedProducts({ sku: skuCode });
        if (!products || products.length === 0) {
          return json(404, { status: "NOT_FOUND" });
        }
        return json(200, { product: products[0] });
      } catch {
        return readFailure();
      }
    }

    const publicMediaRoute = url.pathname.match(/^\/api\/media\/([^/]+)$/);
    if (method === "GET" && publicMediaRoute) {
      if (!runtime.customerRead.ready) {
        return blocked("CUSTOMER_READ_DATABASE", runtime.customerRead.missing);
      }
      const mediaBoundary = openMediaBoundary();
      if (!mediaBoundary.ok) return mediaBoundary.response;
      const database = bindCommerceStore(commerceStore, "readPublicMedia");
      if (!database.ok) return boundaryUnavailable(database);
      const getBoundary = bindPrivateMediaStore(mediaBoundary.store, "getObject");
      if (!getBoundary.ok) return boundaryUnavailable(getBoundary);
      try {
        const media = await database.store.readPublicMedia({
          mediaId: decodePath(publicMediaRoute[1]),
        });
        if (!media) return json(404, { status: "NOT_FOUND" });
        const object = await getBoundary.store.getObject({ key: media.storageKey });
        return response(200, object.bytes, media.contentType, {
          "cache-control": "private, no-store",
          "content-length": String(object.bytes.length),
          etag: `"${media.checksum}"`,
        });
      } catch {
        return json(503, { status: "BLOCKED", code: "PRIVATE_MEDIA_READ_FAILED" });
      }
    }

    return json(404, { status: "NOT_FOUND" });
  };
}
