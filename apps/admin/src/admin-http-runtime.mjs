import { createAdminApplication } from "./application.mjs";
import {
  createAuth0Authenticator,
  createAuth0IdTokenVerifier,
} from "./auth0-authenticator.mjs";
import { createAuth0WebFlow } from "./auth0-web-flow.mjs";
import { requireProductionRuntimeConfiguration } from "./boundaries.mjs";
import { createProductionPostgresStore } from "./postgres-commerce-store.mjs";
import { createS3PrivateMediaStore } from "./s3-private-media-store.mjs";
import { MAX_UPLOAD_REQUEST_BYTES } from "./upload-policy.mjs";

export const maximumCommandBodyBytes = 128 * 1024;
export const maximumUploadBodyBytes = MAX_UPLOAD_REQUEST_BYTES;

const SAFE_RUNTIME_ERROR_NAMES = new Set([
  "AdminAuthenticationError",
  "AggregateError",
  "Error",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
]);

const SAFE_RUNTIME_ERROR_DETAILS = new Map([
  [
    "PRODUCTION_CONFIGURATION_MISSING",
    "Required runtime configuration is missing.",
  ],
  ["DATABASE_BOUNDARY_UNBOUND", "Database configuration is invalid."],
  ["DATABASE_URL_INVALID", "Database configuration is invalid."],
  ["DATABASE_TLS_REQUIRED", "Database TLS configuration is invalid."],
  ["POSTGRES_POOL_CONFIGURATION_INVALID", "Database pool configuration is invalid."],
  ["POSTGRES_DRIVER_UNAVAILABLE", "Database driver is unavailable."],
  ["POSTGRES_POOL_REQUIRED", "Database pool is unavailable."],
  ["POSTGRES_MIGRATION_STATE_MISSING", "Database schema verification failed."],
  ["POSTGRES_MIGRATION_STATE_CONFLICT", "Database schema verification failed."],
  ["POSTGRES_SCHEMA_DRIFT", "Database schema verification failed."],
  ["AUTH0_ISSUER_REQUIRED", "Authentication configuration is invalid."],
  ["AUTH0_ISSUER_INVALID", "Authentication configuration is invalid."],
  ["AUTH0_DOMAIN_REQUIRED", "Authentication configuration is invalid."],
  ["AUTH0_DOMAIN_INVALID", "Authentication configuration is invalid."],
  ["AUTH0_CLIENT_ID_REQUIRED", "Authentication configuration is invalid."],
  ["AUTH0_CLIENT_SECRET_REQUIRED", "Authentication configuration is invalid."],
  ["AUTH0_AUDIENCE_REQUIRED", "Authentication configuration is invalid."],
  ["ADMIN_BASE_URL_REQUIRED", "Authentication configuration is invalid."],
  ["ADMIN_BASE_URL_INVALID", "Authentication configuration is invalid."],
  ["ADMIN_SESSION_SECRET_REQUIRED", "Authentication configuration is invalid."],
  ["ADMIN_SESSION_SECRET_TOO_SHORT", "Authentication configuration is invalid."],
  ["AUTH0_TOKEN_AUTHENTICATOR_UNBOUND", "Authentication runtime is unavailable."],
  ["AUTH0_ID_TOKEN_VERIFIER_UNBOUND", "Authentication runtime is unavailable."],
  ["ADMIN_ACTOR_RESOLVER_UNBOUND", "Authentication runtime is unavailable."],
  ["AUTH0_OWNER_SUB_REQUIRED", "Authentication configuration is invalid."],
  ["AUTH0_FETCH_UNBOUND", "Authentication runtime is unavailable."],
  ["ADMIN_SESSION_STORE_UNBOUND", "Authentication runtime is unavailable."],
  ["ERR_INVALID_URL", "A required runtime URL is invalid."],
  ["ENOTFOUND", "A required service could not be resolved."],
  ["EAI_AGAIN", "A required service could not be resolved."],
  ["ECONNREFUSED", "A required service refused the connection."],
  ["ECONNRESET", "A required service connection was reset."],
  ["ETIMEDOUT", "A required service connection timed out."],
  ["ENETUNREACH", "A required service is unreachable."],
  ["EHOSTUNREACH", "A required service is unreachable."],
  ["28P01", "Database authentication failed."],
  ["3D000", "The configured database is unavailable."],
  ["42501", "Database permission was denied."],
  ["08000", "Database connection failed."],
  ["08001", "Database connection failed."],
  ["08003", "Database connection failed."],
  ["08004", "Database connection failed."],
  ["08006", "Database connection failed."],
  ["08007", "Database connection failed."],
  ["08P01", "Database connection failed."],
]);

const SAFE_RUNTIME_STACK_FILES = new Set([
  "admin-http-runtime.mjs",
  "application.mjs",
  "auth0-authenticator.mjs",
  "auth0-web-flow.mjs",
  "boundaries.mjs",
  "postgres-commerce-store.mjs",
  "s3-private-media-store.mjs",
]);

function errorText(error, property) {
  if (!error || (typeof error !== "object" && typeof error !== "function")) {
    return undefined;
  }
  try {
    return typeof error[property] === "string" ? error[property] : undefined;
  } catch {
    return undefined;
  }
}

function safeRuntimeStack(error) {
  const rawStack = errorText(error, "stack");
  if (!rawStack) return Object.freeze([]);

  const frames = [];
  for (const rawLine of rawStack.split(/\r?\n/).slice(1)) {
    const match = /\(?((?:file:\/\/)?(?:\/|[A-Za-z]:[\\/])[^()\s]+):(\d+):(\d+)\)?$/.exec(
      rawLine.trim(),
    );
    if (!match) continue;
    const filename = match[1].split(/[\\/]/).at(-1);
    if (!SAFE_RUNTIME_STACK_FILES.has(filename)) continue;
    frames.push(`${filename}:${match[2]}:${match[3]}`);
    if (frames.length === 8) break;
  }
  return Object.freeze(frames);
}

function safeRuntimeDiagnostic(error) {
  const rawName = errorText(error, "name");
  const name = SAFE_RUNTIME_ERROR_NAMES.has(rawName) ? rawName : "Error";
  const rawCode = errorText(error, "code");
  const rawMessage = errorText(error, "message");
  const code = SAFE_RUNTIME_ERROR_DETAILS.has(rawCode)
    ? rawCode
    : SAFE_RUNTIME_ERROR_DETAILS.has(rawMessage)
      ? rawMessage
      : "UNCLASSIFIED_RUNTIME_ERROR";

  return Object.freeze({
    name,
    code,
    message:
      SAFE_RUNTIME_ERROR_DETAILS.get(code) ?? "Runtime initialization failed.",
    stack: safeRuntimeStack(error),
  });
}

function logRuntimeStartupError(error, logger) {
  try {
    if (logger && typeof logger.error === "function") {
      logger.error(safeRuntimeDiagnostic(error));
    }
  } catch {
    // Logging must never weaken the fail-closed response or retry behavior.
  }
}

export function requestBodyLimit(request) {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  return pathname === "/admin/evidence" ||
    /^\/admin\/products\/[^/]+\/images(?:\/[^/]+)?$/.test(pathname)
    ? maximumUploadBodyBytes
    : maximumCommandBodyBytes;
}

async function readRequestBody(request, maximumBodyBytes) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximumBodyBytes) {
      const error = new Error("Request body too large");
      error.status = 413;
      error.code = "REQUEST_BODY_TOO_LARGE";
      throw error;
    }
    chunks.push(chunk);
  }

  return chunks.length === 0 ? undefined : Buffer.concat(chunks).toString("utf8");
}

function bodyBytes(body) {
  if (body === undefined || body === null || body === "") return undefined;
  if (Buffer.isBuffer(body)) return Buffer.from(body);
  if (body instanceof Uint8Array) return Buffer.from(body);
  if (typeof body === "string") return Buffer.from(body, "utf8");
  return Buffer.from(JSON.stringify(body), "utf8");
}

export function failedRequest(error) {
  const status = error?.status === 413 ? 413 : 503;
  const code = status === 413 ? "REQUEST_BODY_TOO_LARGE" : "REQUEST_FAILED";
  return Object.freeze({
    status,
    headers: Object.freeze({
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
    }),
    body: JSON.stringify({ status: "BLOCKED", code }),
  });
}

export async function dispatchAdminHttpRequest(handle, request) {
  try {
    const limit = requestBodyLimit(request);
    let body;
    if (["POST", "PUT", "DELETE"].includes(request.method)) {
      if (request.body !== undefined) {
        const bytes = bodyBytes(request.body);
        if (bytes && bytes.length > limit) {
          const error = new Error("Request body too large");
          error.status = 413;
          throw error;
        }
        body =
          request.body &&
          typeof request.body === "object" &&
          !Buffer.isBuffer(request.body) &&
          !(request.body instanceof Uint8Array)
            ? request.body
            : bytes?.toString("utf8");
      } else {
        body = await readRequestBody(request, limit);
      }
    }

    return await handle({
      method: request.method,
      url: request.url,
      headers: request.headers,
      body,
    });
  } catch (error) {
    return failedRequest(error);
  }
}

export function writeAdminHttpResponse(response, result) {
  response.writeHead(result.status, result.headers);
  response.end(result.body);
}

export function createConfiguredOwnerResolver({ commerceStore, ownerSubject } = {}) {
  if (!commerceStore || typeof commerceStore.resolveAdminActor !== "function") {
    throw new Error("ADMIN_ACTOR_RESOLVER_UNBOUND");
  }
  if (typeof ownerSubject !== "string" || ownerSubject.trim() === "") {
    throw new Error("AUTH0_OWNER_SUB_REQUIRED");
  }
  const configuredSubject = ownerSubject.trim();
  return async function resolveConfiguredOwner({ subject } = {}) {
    if (typeof subject !== "string" || subject !== configuredSubject) return null;
    return commerceStore.resolveAdminActor({
      subject,
      bootstrapSubject: configuredSubject,
    });
  };
}

export async function createProductionAdminApplication({
  env = process.env,
  pgModule,
  s3Client,
  auth0Jwks,
  fetchImpl = fetch,
  logger = console,
} = {}) {
  const runtime = requireProductionRuntimeConfiguration(env);
  let commerceStore;
  try {
    commerceStore = await createProductionPostgresStore({
      databaseUrl: env.DATABASE_URL,
      env,
      pgModule,
      migrate: false,
      verifySchema: true,
    });
    const mediaStore = runtime.privateMedia.ready
      ? createS3PrivateMediaStore({
          bucket: env.S3_MEDIA_BUCKET,
          region: env.AWS_REGION,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID.trim(),
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY.trim(),
            ...(typeof env.AWS_SESSION_TOKEN === "string" &&
            env.AWS_SESSION_TOKEN.trim() !== ""
              ? { sessionToken: env.AWS_SESSION_TOKEN.trim() }
              : {}),
          },
          ...(s3Client ? { client: s3Client } : {}),
        })
      : undefined;
    const resolveOwner = createConfiguredOwnerResolver({
      commerceStore,
      ownerSubject: env.AUTH0_OWNER_SUB,
    });
    const tokenAuthenticator = createAuth0Authenticator({
      domain: env.AUTH0_DOMAIN,
      audience: env.AUTH0_AUDIENCE,
      ...(auth0Jwks ? { jwks: auth0Jwks } : {}),
      resolveActor: resolveOwner,
    });
    const idTokenVerifier = createAuth0IdTokenVerifier({
      domain: env.AUTH0_DOMAIN,
      clientId: env.AUTH0_CLIENT_ID,
      ...(auth0Jwks ? { jwks: auth0Jwks } : {}),
    });
    const authFlow = createAuth0WebFlow({
      domain: env.AUTH0_DOMAIN,
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      audience: env.AUTH0_AUDIENCE,
      baseUrl: env.ADMIN_BASE_URL,
      sessionSecret: env.ADMIN_SESSION_SECRET,
      authenticateToken: tokenAuthenticator,
      verifyIdToken: idTokenVerifier,
      sessionStore: commerceStore,
      fetchImpl,
      logger,
    });

    return Object.freeze({
      handle: createAdminApplication({
        env,
        authenticateAdmin: authFlow.authenticateAdmin,
        commerceStore,
        mediaStore,
        authFlow,
      }),
      async close() {
        await commerceStore.close();
      },
    });
  } catch (error) {
    if (commerceStore && typeof commerceStore.close === "function") {
      try {
        await commerceStore.close();
      } catch {
        // Preserve the production initialization failure.
      }
    }
    throw error;
  }
}

export function createVercelAdminHandler({
  runtimeFactory = createProductionAdminApplication,
  logger = console,
} = {}) {
  let runtimePromise;

  return async function vercelAdminHandler(request, response) {
    try {
      runtimePromise ??= Promise.resolve()
        .then(() => runtimeFactory())
        .catch((error) => {
          runtimePromise = undefined;
          logRuntimeStartupError(error, logger);
          throw error;
        });
      const runtime = await runtimePromise;
      const result = await dispatchAdminHttpRequest(runtime.handle, request);
      writeAdminHttpResponse(response, result);
    } catch {
      writeAdminHttpResponse(response, failedRequest());
    }
  };
}
