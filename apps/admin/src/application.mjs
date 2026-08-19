import {
  authorizeAdmin,
  authorizeCapability,
  bindCommerceStore,
  inspectRuntimeBoundaries,
} from "./boundaries.mjs";

const NO_STORE = Object.freeze({});

export const SYNTHETIC_PRODUCT = Object.freeze({
  name: "SEC-IMPL TEST PRODUCT",
  sku: "TEST-SKU-001",
});

const CAPABILITIES = Object.freeze({
  adminRead: "catalog.read",
  auditRead: "audit.read",
  createProduct: "catalog.edit",
  setRetailPrice: "price.retail.edit",
  receiveInventory: "inventory.receive",
  publishProduct: "catalog.publish",
  unpublishProduct: "catalog.unpublish",
});

function response(status, body, contentType = "application/json; charset=utf-8") {
  return Object.freeze({
    status,
    headers: Object.freeze({
      "cache-control": "no-store",
      "content-type": contentType,
      "x-content-type-options": "nosniff",
    }),
    body,
  });
}

function json(status, payload) {
  return response(status, JSON.stringify(payload));
}

function blocked(scope, missing) {
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

function invalid(code) {
  return json(400, { status: "REJECTED", code });
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

function decodeSku(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function requestHeader(request, name) {
  const headers = request.headers ?? {};
  if (typeof headers.get === "function") return headers.get(name);
  return headers[name] ?? headers[name.toLowerCase()] ?? null;
}

function validSyntheticSku(sku) {
  return sku === SYNTHETIC_PRODUCT.sku;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatUsd(price) {
  if (!price || !Number.isSafeInteger(price.amountCents)) return "Not set";
  const sign = price.amountCents < 0 ? "-" : "";
  const absolute = Math.abs(price.amountCents);
  const dollars = Math.trunc(absolute / 100);
  const cents = String(absolute % 100).padStart(2, "0");
  return `${sign}$${dollars}.${cents}`;
}

function buildAdminPage(product) {
  const productState = product
    ? `<section aria-labelledby="product-state"><h2 id="product-state">Synthetic product state</h2><dl><dt>Name</dt><dd>${escapeHtml(product.name)}</dd><dt>SKU</dt><dd>${escapeHtml(product.sku)}</dd><dt>Retail price</dt><dd>${escapeHtml(formatUsd(product.retailPrice))}</dd><dt>Publication</dt><dd>${escapeHtml(product.publicationState)}</dd><dt>Current quantity</dt><dd>${escapeHtml(product.currentQuantity)}</dd><dt>Available quantity</dt><dd>${escapeHtml(product.availableQuantity)}</dd></dl><h3>Inventory history</h3><ol>${product.inventoryHistory
        .map(
          (entry) =>
            `<li>${escapeHtml(entry.eventType)} ${entry.quantityDelta > 0 ? "+" : ""}${escapeHtml(entry.quantityDelta)} — ${escapeHtml(entry.disposition)}</li>`,
        )
        .join("")}</ol></section>`
    : '<section aria-labelledby="product-state"><h2 id="product-state">Synthetic product state</h2><p>No operational product record exists yet.</p></section>';

  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Blowin' Smoke Admin</title><main><h1>Blowin' Smoke Admin</h1><p>This isolated slice sends authenticated server commands; the browser never writes to the commerce store directly.</p>${productState}<section aria-labelledby="commands"><h2 id="commands">Commands</h2><form action="/admin/products" data-admin-command="create" data-method="POST"><button type="submit">Create synthetic product</button></form><form action="/admin/products/${SYNTHETIC_PRODUCT.sku}/retail-price" data-admin-command="price" data-method="PUT"><button type="submit">Set retail price to $19.99</button></form><form action="/admin/products/${SYNTHETIC_PRODUCT.sku}/inventory-receipts" data-admin-command="receive" data-method="POST"><button type="submit">Receive 10 sellable units</button></form><form action="/admin/products/${SYNTHETIC_PRODUCT.sku}/publish" data-admin-command="publish" data-method="POST"><button type="submit">Publish</button></form><form action="/admin/products/${SYNTHETIC_PRODUCT.sku}/unpublish" data-admin-command="unpublish" data-method="POST"><button type="submit">Unpublish</button></form><p id="command-status" role="status" aria-live="polite"></p></section></main><script type="module">const bodies={create:${JSON.stringify(SYNTHETIC_PRODUCT)},price:{amountCents:1999,currency:"USD"},receive:{quantity:10},publish:{},unpublish:{}};document.addEventListener("submit",async(event)=>{const form=event.target.closest("form[data-admin-command]");if(!form)return;event.preventDefault();const status=document.querySelector("#command-status");status.textContent="Working…";try{const result=await fetch(form.action,{method:form.dataset.method,credentials:"same-origin",headers:{"content-type":"application/json","idempotency-key":crypto.randomUUID()},body:JSON.stringify(bodies[form.dataset.adminCommand])});if(!result.ok){const payload=await result.json();throw new Error(payload.code||"COMMAND_FAILED");}location.reload();}catch(error){status.textContent="Command failed: "+error.message;}});</script></html>`;
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
    return json(error.status, { status: "REJECTED", code: error.code });
  }

  return json(503, { status: "BLOCKED", code: "DATABASE_COMMAND_FAILED" });
}

export function createAdminApplication({
  env = process.env,
  authenticateAdmin,
  commerceStore = NO_STORE,
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
      return Object.freeze({
        ok: false,
        response: boundaryUnavailable(permission),
      });
    }

    const database = bindCommerceStore(commerceStore, requiredStoreMethod);
    if (!database.ok) {
      return Object.freeze({
        ok: false,
        response: boundaryUnavailable(database),
      });
    }

    return Object.freeze({
      ok: true,
      actor: authorization.actor,
      store: database.store,
    });
  }

  async function executeCommand(
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
      return invalid("IDEMPOTENCY_KEY_REQUIRED");
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
        reason: "ADMIN_SLICE_01",
        payload: Object.freeze({ ...payload }),
      });
      return json(status, { status: "OK", result });
    } catch (error) {
      return commandFailure(error);
    }
  }

  return async function handle(request = {}) {
    const method = String(request.method ?? "GET").toUpperCase();
    const url = new URL(String(request.url ?? "/"), "http://localhost");

    if (method === "GET" && url.pathname === "/admin") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.adminRead,
        "readAdminProduct",
      );
      if (!boundary.ok) return boundary.response;

      try {
        const product = await boundary.store.readAdminProduct({
          sku: SYNTHETIC_PRODUCT.sku,
        });
        return response(200, buildAdminPage(product), "text/html; charset=utf-8");
      } catch {
        return json(503, {
          status: "BLOCKED",
          code: "DATABASE_READ_FAILED",
        });
      }
    }

    if (method === "POST" && url.pathname === "/admin/products") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.createProduct,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;

      const body = parseBody(request);
      if (!body.ok) return body.response;
      if (
        body.value.name !== SYNTHETIC_PRODUCT.name ||
        body.value.sku !== SYNTHETIC_PRODUCT.sku
      ) {
        return invalid("SYNTHETIC_PRODUCT_REQUIRED");
      }

      return executeCommand(
        request,
        boundary,
        CAPABILITIES.createProduct,
        "CreateProduct",
        SYNTHETIC_PRODUCT,
        201,
      );
    }

    const priceRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/retail-price$/,
    );
    if (method === "PUT" && priceRoute) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.setRetailPrice,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;

      const sku = decodeSku(priceRoute[1]);
      if (!sku || !validSyntheticSku(sku)) {
        return invalid("SYNTHETIC_PRODUCT_REQUIRED");
      }
      const body = parseBody(request);
      if (!body.ok) return body.response;
      if (
        body.value.amountCents !== 1999 ||
        !Number.isSafeInteger(body.value.amountCents) ||
        body.value.currency !== "USD"
      ) {
        return invalid("INVALID_RETAIL_PRICE");
      }

      return executeCommand(
        request,
        boundary,
        CAPABILITIES.setRetailPrice,
        "SetRetailPrice",
        Object.freeze({
          sku,
          amountCents: body.value.amountCents,
          currency: body.value.currency,
        }),
      );
    }

    const receiptRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/inventory-receipts$/,
    );
    if (method === "POST" && receiptRoute) {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.receiveInventory,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;

      const sku = decodeSku(receiptRoute[1]);
      if (!sku || !validSyntheticSku(sku)) {
        return invalid("SYNTHETIC_PRODUCT_REQUIRED");
      }
      const body = parseBody(request);
      if (!body.ok) return body.response;
      if (body.value.quantity !== 10 || !Number.isSafeInteger(body.value.quantity)) {
        return invalid("INVALID_RECEIPT_QUANTITY");
      }

      return executeCommand(
        request,
        boundary,
        CAPABILITIES.receiveInventory,
        "ReceiveInventory",
        Object.freeze({
          sku,
          quantityDelta: body.value.quantity,
          disposition: "SELLABLE",
        }),
        201,
      );
    }

    const publishRoute = url.pathname.match(
      /^\/admin\/products\/([^/]+)\/(publish|unpublish)$/,
    );
    if (method === "POST" && publishRoute) {
      const publishing = publishRoute[2] === "publish";
      const capability = publishing
        ? CAPABILITIES.publishProduct
        : CAPABILITIES.unpublishProduct;
      const boundary = await openAdminBoundary(
        request,
        capability,
        "executeAdminCommand",
      );
      if (!boundary.ok) return boundary.response;
      const sku = decodeSku(publishRoute[1]);
      if (!sku || !validSyntheticSku(sku)) {
        return invalid("SYNTHETIC_PRODUCT_REQUIRED");
      }

      return executeCommand(
        request,
        boundary,
        capability,
        publishing ? "PublishProduct" : "UnpublishProduct",
        Object.freeze({ sku }),
      );
    }

    const adminProductRoute = url.pathname.match(/^\/admin\/products\/([^/]+)$/);
    if (method === "GET" && adminProductRoute) {
      const sku = decodeSku(adminProductRoute[1]);
      if (!sku) return invalid("INVALID_SKU");
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.adminRead,
        "readAdminProduct",
      );
      if (!boundary.ok) return boundary.response;

      try {
        const product = await boundary.store.readAdminProduct({ sku });
        if (!product) return json(404, { status: "NOT_FOUND" });
        return json(200, { status: "OK", product });
      } catch {
        return json(503, {
          status: "BLOCKED",
          code: "DATABASE_READ_FAILED",
        });
      }
    }

    if (method === "GET" && url.pathname === "/admin/audit") {
      const boundary = await openAdminBoundary(
        request,
        CAPABILITIES.auditRead,
        "readAuditRecords",
      );
      if (!boundary.ok) return boundary.response;

      try {
        const records = await boundary.store.readAuditRecords();
        return json(200, { status: "OK", records });
      } catch {
        return json(503, {
          status: "BLOCKED",
          code: "DATABASE_READ_FAILED",
        });
      }
    }

    if (method === "GET" && url.pathname === "/api/products") {
      if (!runtime.customerRead.ready) {
        return blocked("CUSTOMER_READ_DATABASE", runtime.customerRead.missing);
      }

      const database = bindCommerceStore(commerceStore, "readPublishedProducts");
      if (!database.ok) return boundaryUnavailable(database);

      try {
        const products = await database.store.readPublishedProducts();
        return json(200, { products });
      } catch {
        return json(503, {
          status: "BLOCKED",
          code: "DATABASE_READ_FAILED",
        });
      }
    }

    return json(404, { status: "NOT_FOUND" });
  };
}
