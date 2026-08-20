import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

import { createAdminApplication } from "./application.mjs";
import { createAuth0Authenticator } from "./auth0-authenticator.mjs";
import { createAuth0WebFlow } from "./auth0-web-flow.mjs";
import { requireProductionRuntimeConfiguration } from "./boundaries.mjs";
import { createProductionPostgresStore } from "./postgres-commerce-store.mjs";
import { createS3PrivateMediaStore } from "./s3-private-media-store.mjs";
import { MAX_UPLOAD_REQUEST_BYTES } from "./upload-policy.mjs";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
export const maximumCommandBodyBytes = 128 * 1024;
export const maximumUploadBodyBytes = MAX_UPLOAD_REQUEST_BYTES;

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

export async function createProductionAdminApplication({
  env = process.env,
  pgModule,
  s3Client,
  fetchImpl = fetch,
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
    const authFlow = createAuth0WebFlow({
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

export function createAdminHttpServer(handle = createAdminApplication()) {
  return createServer(async (request, response) => {
    const result = await dispatchAdminHttpRequest(handle, request);
    writeAdminHttpResponse(response, result);
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
