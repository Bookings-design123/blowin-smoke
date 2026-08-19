import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

import { createAdminApplication } from "./application.mjs";
import { createAuth0Authenticator } from "./auth0-authenticator.mjs";
import { createAuth0WebFlow } from "./auth0-web-flow.mjs";
import { inspectRuntimeBoundaries } from "./boundaries.mjs";
import { createProductionPostgresStore } from "./postgres-commerce-store.mjs";
import { createS3PrivateMediaStore } from "./s3-private-media-store.mjs";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const maximumCommandBodyBytes = 128 * 1024;
const maximumUploadBodyBytes = 18 * 1024 * 1024;

function requestBodyLimit(request) {
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

function failedRequest(error) {
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

export async function createProductionAdminApplication({
  env = process.env,
  pgModule,
  s3Client,
  fetchImpl = fetch,
} = {}) {
  const runtime = inspectRuntimeBoundaries(env);
  let commerceStore;
  let mediaStore;
  let authenticateAdmin;
  let authFlow;

  if (runtime.customerRead.ready) {
    try {
      commerceStore = await createProductionPostgresStore({
        databaseUrl: env.DATABASE_URL,
        pgModule,
        migrate: true,
      });
    } catch {
      // The application still starts, but every database-backed boundary fails closed.
    }
  }

  if (runtime.privateMedia.ready) {
    try {
      mediaStore = createS3PrivateMediaStore({
        bucket: env.S3_MEDIA_BUCKET,
        region: env.AWS_REGION,
        ...(s3Client ? { client: s3Client } : {}),
      });
    } catch {
      // The application still starts, but every private-media boundary fails closed.
    }
  }

  if (runtime.admin.ready && commerceStore) {
    try {
      const tokenAuthenticator = createAuth0Authenticator({
        domain: env.AUTH0_DOMAIN,
        audience: env.AUTH0_AUDIENCE,
        requiredAuthenticationMethods: ["webauthn"],
        resolveActor: ({ subject }) =>
          commerceStore.resolveAdminActor({
            subject,
            bootstrapSubject: env.AUTH0_OWNER_SUB,
          }),
      });
      authFlow = createAuth0WebFlow({
        domain: env.AUTH0_DOMAIN,
        clientId: env.AUTH0_CLIENT_ID,
        clientSecret: env.AUTH0_CLIENT_SECRET,
        audience: env.AUTH0_AUDIENCE,
        baseUrl: env.ADMIN_BASE_URL,
        sessionSecret: env.ADMIN_SESSION_SECRET,
        authenticateToken: tokenAuthenticator,
        sessionStore: commerceStore,
        fetchImpl,
      });
      authenticateAdmin = authFlow.authenticateAdmin;
    } catch {
      // Invalid authentication configuration never falls back to a weaker login path.
    }
  }

  return Object.freeze({
    handle: createAdminApplication({
      env,
      authenticateAdmin,
      commerceStore,
      mediaStore,
      authFlow,
    }),
    async close() {
      if (commerceStore && typeof commerceStore.close === "function") {
        await commerceStore.close();
      }
    },
  });
}

export function createAdminHttpServer(handle = createAdminApplication()) {
  return createServer(async (request, response) => {
    let result;

    try {
      const body = ["POST", "PUT", "DELETE"].includes(request.method)
        ? await readRequestBody(request, requestBodyLimit(request))
        : undefined;
      result = await handle({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body,
      });
    } catch (error) {
      result = failedRequest(error);
    }

    response.writeHead(result.status, result.headers);
    response.end(result.body);
  });
}

const executedFile = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (executedFile === import.meta.url) {
  const runtime = await createProductionAdminApplication();
  const server = createAdminHttpServer(runtime.handle);
  server.listen(port, () => {
    console.log(`Blowin' Smoke Admin boundary listening on http://localhost:${port}`);
  });

  async function stop() {
    server.close(async () => {
      await runtime.close();
      process.exit(0);
    });
  }

  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}
