import { pathToFileURL } from "node:url";

import {
  AUTH0_ENV_KEYS,
  DATABASE_ENV_KEYS,
  PRIVATE_MEDIA_ENV_KEYS,
} from "./boundaries.mjs";
import {
  createProductionPostgresPool,
  DAY1_ADMIN_MIGRATION,
  verifyDay1AdminSchema,
} from "./postgres-commerce-store.mjs";

const DEFAULT_TIMEOUT_MILLISECONDS = 10_000;

function missingKeys(env, keys) {
  return keys.filter(
    (key) => typeof env[key] !== "string" || env[key].trim() === "",
  );
}

function blocked(component, code, details = {}) {
  return Object.freeze({
    ready: false,
    component,
    code,
    ...details,
  });
}

function ready(component, details = {}) {
  return Object.freeze({ ready: true, component, ...details });
}

function validHttpsOrigin(value, { allowLocalHttp = false } = {}) {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    const localHttp =
      allowLocalHttp &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    return (
      (url.protocol === "https:" || localHttp) &&
      url.username === "" &&
      url.password === "" &&
      url.search === "" &&
      url.hash === "" &&
      (allowLocalHttp || url.pathname === "" || url.pathname === "/")
    );
  } catch {
    return false;
  }
}

export function inspectAuth0SmokeConfiguration(env = {}) {
  const missing = missingKeys(env, AUTH0_ENV_KEYS);
  if (missing.length > 0) {
    return blocked("auth0", "AUTH0_CONFIGURATION_MISSING", {
      missing: Object.freeze(missing),
    });
  }

  if (!validHttpsOrigin(env.AUTH0_DOMAIN)) {
    return blocked("auth0", "AUTH0_DOMAIN_INVALID");
  }

  if (!validHttpsOrigin(env.ADMIN_BASE_URL, { allowLocalHttp: true })) {
    return blocked("auth0", "ADMIN_BASE_URL_INVALID");
  }

  if (Buffer.byteLength(env.ADMIN_SESSION_SECRET.trim()) < 32) {
    return blocked("auth0", "ADMIN_SESSION_SECRET_TOO_SHORT");
  }

  return ready("auth0", {
    validation: "CONFIGURATION_PRESENT",
    requiredAuthenticationMethod: "webauthn",
  });
}

async function inspectDatabase({ env, pool, pgModule }) {
  const missing = missingKeys(env, DATABASE_ENV_KEYS);
  if (missing.length > 0) {
    return blocked("database", "DATABASE_CONFIGURATION_MISSING", {
      missing: Object.freeze(missing),
    });
  }

  let resolvedPool = pool;
  let ownsPool = false;
  let client;
  let transactionStarted = false;

  try {
    if (!resolvedPool) {
      resolvedPool = await createProductionPostgresPool({ env, pgModule });
      ownsPool = true;
    }

    if (typeof resolvedPool?.connect !== "function") {
      return blocked("database", "POSTGRES_POOL_UNBOUND");
    }

    client = await resolvedPool.connect();
    await client.query("BEGIN TRANSACTION READ ONLY");
    transactionStarted = true;

    const connectivity = await client.query("SELECT 1 AS connected");
    if (connectivity.rows?.[0]?.connected !== 1) {
      throw new Error("DATABASE_CONNECTIVITY_CHECK_FAILED");
    }

    const schema = await verifyDay1AdminSchema({ queryable: client });

    await client.query("COMMIT");
    transactionStarted = false;

    return ready("database", {
      connectivity: "VERIFIED",
      migration: schema.migration.name,
      revision: schema.migration.revision,
      schema: "COMPLETE",
    });
  } catch (error) {
    if (transactionStarted && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // The smoke result remains fail-closed and does not expose provider details.
      }
    }
    const schemaFailure = new Set([
      "POSTGRES_MIGRATION_STATE_MISSING",
      "POSTGRES_MIGRATION_STATE_CONFLICT",
      "POSTGRES_SCHEMA_DRIFT",
    ]).has(error?.code);
    return blocked(
      "database",
      schemaFailure
        ? "DATABASE_MIGRATION_INCOMPLETE"
        : "DATABASE_CONNECTIVITY_OR_SCHEMA_CHECK_FAILED",
      {
        migration: DAY1_ADMIN_MIGRATION.name,
        ...(Array.isArray(error?.missingTables)
          ? { missingTables: error.missingTables }
          : {}),
        ...(Array.isArray(error?.missingTriggers)
          ? { missingTriggers: error.missingTriggers }
          : {}),
      },
    );
  } finally {
    if (client && typeof client.release === "function") client.release();
    if (ownsPool && typeof resolvedPool?.end === "function") {
      try {
        await resolvedPool.end();
      } catch {
        // Closing the temporary smoke-test pool cannot change the check result.
      }
    }
  }
}

async function inspectPrivateMedia({ env, s3Client, s3Module }) {
  const missing = missingKeys(env, PRIVATE_MEDIA_ENV_KEYS);
  if (missing.length > 0) {
    return blocked("privateMedia", "S3_CONFIGURATION_MISSING", {
      missing: Object.freeze(missing),
    });
  }

  let client = s3Client;
  let ownsClient = false;
  let timeout;

  try {
    const s3 = s3Module ?? (await import("@aws-sdk/client-s3"));
    const S3Client = s3.S3Client;
    const HeadBucketCommand = s3.HeadBucketCommand;
    if (typeof HeadBucketCommand !== "function") {
      return blocked("privateMedia", "S3_DRIVER_UNAVAILABLE");
    }

    if (!client) {
      if (typeof S3Client !== "function") {
        return blocked("privateMedia", "S3_DRIVER_UNAVAILABLE");
      }
      client = new S3Client({
        region: env.AWS_REGION.trim(),
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID.trim(),
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY.trim(),
          ...(typeof env.AWS_SESSION_TOKEN === "string" &&
          env.AWS_SESSION_TOKEN.trim() !== ""
            ? { sessionToken: env.AWS_SESSION_TOKEN.trim() }
            : {}),
        },
      });
      ownsClient = true;
    }

    if (typeof client?.send !== "function") {
      return blocked("privateMedia", "S3_CLIENT_UNBOUND");
    }

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MILLISECONDS);
    await client.send(
      new HeadBucketCommand({ Bucket: env.S3_MEDIA_BUCKET.trim() }),
      { abortSignal: controller.signal },
    );

    return ready("privateMedia", {
      access: "HEAD_BUCKET_VERIFIED",
      mutationPerformed: false,
    });
  } catch {
    return blocked("privateMedia", "S3_ACCESS_CHECK_FAILED");
  } finally {
    if (timeout) clearTimeout(timeout);
    if (ownsClient && typeof client?.destroy === "function") client.destroy();
  }
}

function externalInputs(checks) {
  const inputs = [];
  for (const check of Object.values(checks)) {
    if (Array.isArray(check.missing)) inputs.push(...check.missing);
    if (!check.ready && !Array.isArray(check.missing)) inputs.push(check.code);
  }
  return Object.freeze([...new Set(inputs)].sort());
}

export async function runProductionSmokeTest({
  env = process.env,
  pool,
  pgModule,
  s3Client,
  s3Module,
} = {}) {
  const [database, privateMedia] = await Promise.all([
    inspectDatabase({ env, pool, pgModule }),
    inspectPrivateMedia({ env, s3Client, s3Module }),
  ]);
  const auth0 = inspectAuth0SmokeConfiguration(env);
  const checks = Object.freeze({ database, auth0, privateMedia });
  const ok = Object.values(checks).every((check) => check.ready);

  return Object.freeze({
    ok,
    status: ok ? "READY" : "BLOCKED",
    checks,
    missingExternalInputs: externalInputs(checks),
  });
}

const executedFile = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (executedFile === import.meta.url) {
  const result = await runProductionSmokeTest();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}
