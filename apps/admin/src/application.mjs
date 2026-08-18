import {
  authorizeAdmin,
  bindCommerceStore,
  inspectRuntimeBoundaries,
} from "./boundaries.mjs";

const NO_STORE = Object.freeze({});

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
    status: result.status === 401 ? "DENIED" : "BLOCKED",
    code: result.code,
  });
}

export function createAdminApplication({
  env = process.env,
  authenticateAdmin,
  commerceStore = NO_STORE,
} = {}) {
  const runtime = inspectRuntimeBoundaries(env);

  return async function handle(request = {}) {
    const method = String(request.method ?? "GET").toUpperCase();
    const url = new URL(String(request.url ?? "/"), "http://localhost");

    if (method === "GET" && url.pathname === "/admin") {
      if (!runtime.admin.ready) {
        return blocked("ADMIN_AUTH0_AND_DATABASE", runtime.admin.missing);
      }

      const authorization = await authorizeAdmin(request, authenticateAdmin);
      if (!authorization.ok) return boundaryUnavailable(authorization);

      const database = bindCommerceStore(commerceStore, "executeAdminCommand");
      if (!database.ok) return boundaryUnavailable(database);

      return response(
        200,
        "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><title>Blowin' Smoke Admin</title><main><h1>Blowin' Smoke Admin</h1><p>Authentication and database boundaries are ready.</p></main>",
        "text/html; charset=utf-8",
      );
    }

    if (method === "POST" && url.pathname === "/admin/products") {
      if (!runtime.admin.ready) {
        return blocked("ADMIN_AUTH0_AND_DATABASE", runtime.admin.missing);
      }

      const authorization = await authorizeAdmin(request, authenticateAdmin);
      if (!authorization.ok) return boundaryUnavailable(authorization);

      const database = bindCommerceStore(commerceStore, "executeAdminCommand");
      if (!database.ok) return boundaryUnavailable(database);

      return json(503, {
        status: "BLOCKED",
        code: "LIVE_VERTICAL_SLICE_NOT_EXECUTED",
      });
    }

    if (method === "GET" && url.pathname === "/api/products") {
      if (!runtime.customerRead.ready) {
        return blocked("CUSTOMER_READ_DATABASE", runtime.customerRead.missing);
      }

      const database = bindCommerceStore(commerceStore, "readPublishedProducts");
      if (!database.ok) return boundaryUnavailable(database);

      return json(503, {
        status: "BLOCKED",
        code: "LIVE_VERTICAL_SLICE_NOT_EXECUTED",
      });
    }

    return json(404, { status: "NOT_FOUND" });
  };
}
