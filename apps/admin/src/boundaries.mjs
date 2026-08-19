export const DATABASE_ENV_KEYS = Object.freeze(["DATABASE_URL"]);

export const AUTH0_ENV_KEYS = Object.freeze([
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_AUDIENCE",
]);

function missingKeys(env, keys) {
  return Object.freeze(
    keys.filter((key) => typeof env[key] !== "string" || env[key].trim() === ""),
  );
}

export function inspectRuntimeBoundaries(env = {}) {
  const missingDatabase = missingKeys(env, DATABASE_ENV_KEYS);
  const missingAuth0 = missingKeys(env, AUTH0_ENV_KEYS);
  const missingAdmin = Object.freeze([...missingDatabase, ...missingAuth0]);

  return Object.freeze({
    admin: Object.freeze({
      ready: missingAdmin.length === 0,
      missing: missingAdmin,
    }),
    customerRead: Object.freeze({
      ready: missingDatabase.length === 0,
      missing: missingDatabase,
    }),
  });
}

export async function authorizeAdmin(request, authenticateAdmin) {
  if (typeof authenticateAdmin !== "function") {
    return Object.freeze({
      ok: false,
      status: 503,
      code: "AUTH0_BOUNDARY_UNBOUND",
    });
  }

  try {
    const actor = await authenticateAdmin(request);
    if (!actor || typeof actor.id !== "string" || actor.id.trim() === "") {
      return Object.freeze({ ok: false, status: 401, code: "UNAUTHORIZED" });
    }

    return Object.freeze({ ok: true, actor: Object.freeze({ ...actor }) });
  } catch {
    return Object.freeze({ ok: false, status: 401, code: "UNAUTHORIZED" });
  }
}

export function authorizeCapability(actor, capability) {
  if (
    !actor ||
    typeof capability !== "string" ||
    !Array.isArray(actor.capabilities) ||
    !actor.capabilities.includes(capability)
  ) {
    return Object.freeze({
      ok: false,
      status: 403,
      code: "FORBIDDEN",
    });
  }

  return Object.freeze({ ok: true });
}

export function bindCommerceStore(commerceStore, requiredMethod) {
  if (
    !commerceStore ||
    typeof requiredMethod !== "string" ||
    typeof commerceStore[requiredMethod] !== "function"
  ) {
    return Object.freeze({
      ok: false,
      status: 503,
      code: "DATABASE_BOUNDARY_UNBOUND",
    });
  }

  return Object.freeze({ ok: true, store: commerceStore });
}
