import assert from "node:assert/strict";
import test from "node:test";

import {
  inspectAuth0SmokeConfiguration,
  runProductionSmokeTest,
} from "../src/production-smoke.mjs";

function configuredEnvironment() {
  return {
    DATABASE_URL: "postgresql://test.invalid/admin?sslmode=require",
    AUTH0_DOMAIN: "tenant.example.auth0.com",
    AUTH0_CLIENT_ID: "owner-client",
    AUTH0_CLIENT_SECRET: "test-client-secret",
    AUTH0_AUDIENCE: "https://admin.example.test",
    AUTH0_OWNER_SUB: "auth0|owner",
    ADMIN_BASE_URL: "https://admin.example.test",
    ADMIN_SESSION_SECRET: "s".repeat(32),
    AWS_REGION: "us-east-1",
    AWS_ACCESS_KEY_ID: "test-access-key",
    AWS_SECRET_ACCESS_KEY: "test-secret-key",
    S3_MEDIA_BUCKET: "private-test-bucket",
  };
}

function completePool({
  missingTables = [],
  missingTriggers = [],
  migrationMissing = false,
  error,
} = {}) {
  const queries = [];
  let released = false;
  const client = {
    async query(sql, parameters) {
      queries.push({ sql, parameters });
      if (error && sql.startsWith("SELECT 1")) throw error;
      if (sql.startsWith("SELECT 1")) return { rows: [{ connected: 1 }] };
      if (sql.includes("to_regclass('public.admin_schema_migrations')")) {
        return {
          rows: [{ relation: migrationMissing ? null : "admin_schema_migrations" }],
        };
      }
      if (sql.includes("FROM public.admin_schema_migrations")) {
        return migrationMissing
          ? { rowCount: 0, rows: [] }
          : {
              rowCount: 1,
              rows: [
                {
                  version: 1,
                  name: "001_day1_admin_mvp",
                  revision: "2026-08-18.1",
                },
              ],
            };
      }
      if (sql.includes("pg_class.relkind IN ('r', 'p')")) {
        return { rows: missingTables.map((name) => ({ name })) };
      }
      if (sql.includes("FROM pg_trigger")) {
        return { rows: missingTriggers.map((name) => ({ name })) };
      }
      return { rows: [] };
    },
    release() {
      released = true;
    },
  };
  return {
    pool: { async connect() { return client; } },
    queries,
    wasReleased: () => released,
  };
}

class TestHeadBucketCommand {
  constructor(input) {
    this.input = input;
  }
}

test("production smoke verifies providers without mutating business data", async () => {
  const database = completePool();
  const commands = [];
  const result = await runProductionSmokeTest({
    env: configuredEnvironment(),
    pool: database.pool,
    s3Client: {
      async send(command) {
        commands.push(command);
        return {};
      },
    },
    s3Module: { HeadBucketCommand: TestHeadBucketCommand },
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, "READY");
  assert.equal(result.checks.database.schema, "COMPLETE");
  assert.equal(result.checks.auth0.validation, "CONFIGURATION_PRESENT");
  assert.equal(result.checks.privateMedia.configured, true);
  assert.equal(result.checks.privateMedia.access, "HEAD_BUCKET_VERIFIED");
  assert.deepEqual(result.missingExternalInputs, []);
  assert.equal(database.wasReleased(), true);
  assert.deepEqual(commands.map((command) => command.input), [
    { Bucket: "private-test-bucket" },
  ]);

  const statements = database.queries.map(({ sql }) => sql.trim());
  assert.equal(statements[0], "BEGIN TRANSACTION READ ONLY");
  assert.equal(statements.at(-1), "COMMIT");
  assert.equal(
    statements.some((sql) => /\b(INSERT|UPDATE|DELETE|MERGE|TRUNCATE)\b/i.test(sql)),
    false,
  );
});

test("production smoke treats unconfigured media as deferred", async () => {
  const env = configuredEnvironment();
  for (const key of [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "S3_MEDIA_BUCKET",
  ]) {
    delete env[key];
  }
  const result = await runProductionSmokeTest({
    env,
    pool: completePool().pool,
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, "READY");
  assert.equal(result.checks.privateMedia.ready, true);
  assert.equal(result.checks.privateMedia.configured, false);
  assert.equal(result.checks.privateMedia.code, "MEDIA_STORAGE_NOT_CONFIGURED");
  assert.equal(result.checks.privateMedia.access, "DEFERRED");
  assert.deepEqual(result.missingExternalInputs, []);
});

test("production smoke fails closed for missing configuration without exposing values", async () => {
  const result = await runProductionSmokeTest({ env: {} });
  const serialized = JSON.stringify(result);

  assert.equal(result.ok, false);
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.checks.database.code, "DATABASE_CONFIGURATION_MISSING");
  assert.equal(result.checks.auth0.code, "AUTH0_CONFIGURATION_MISSING");
  assert.equal(result.checks.privateMedia.code, "MEDIA_STORAGE_NOT_CONFIGURED");
  assert.equal(result.checks.privateMedia.ready, true);
  assert.ok(result.missingExternalInputs.includes("DATABASE_URL"));
  assert.ok(result.missingExternalInputs.includes("AUTH0_CLIENT_SECRET"));
  assert.equal(result.missingExternalInputs.includes("AWS_SECRET_ACCESS_KEY"), false);
  assert.equal(serialized.includes("test-client-secret"), false);
});

test("production smoke reports incomplete migration and rolls back failed checks", async () => {
  const incomplete = completePool({ missingTables: ["inventory_ledger"] });
  const incompleteResult = await runProductionSmokeTest({
    env: configuredEnvironment(),
    pool: incomplete.pool,
    s3Client: { async send() { return {}; } },
    s3Module: { HeadBucketCommand: TestHeadBucketCommand },
  });
  assert.equal(incompleteResult.ok, false);
  assert.equal(incompleteResult.checks.database.code, "DATABASE_MIGRATION_INCOMPLETE");
  assert.deepEqual(incompleteResult.checks.database.missingTables, ["inventory_ledger"]);

  const missingTrigger = completePool({
    missingTriggers: ["inventory_ledger_immutable"],
  });
  const missingTriggerResult = await runProductionSmokeTest({
    env: configuredEnvironment(),
    pool: missingTrigger.pool,
    s3Client: { async send() { return {}; } },
    s3Module: { HeadBucketCommand: TestHeadBucketCommand },
  });
  assert.equal(
    missingTriggerResult.checks.database.code,
    "DATABASE_MIGRATION_INCOMPLETE",
  );
  assert.deepEqual(missingTriggerResult.checks.database.missingTriggers, [
    "inventory_ledger_immutable",
  ]);

  const failed = completePool({ error: new Error("provider detail must stay private") });
  const failedResult = await runProductionSmokeTest({
    env: configuredEnvironment(),
    pool: failed.pool,
    s3Client: { async send() { return {}; } },
    s3Module: { HeadBucketCommand: TestHeadBucketCommand },
  });
  assert.equal(
    failedResult.checks.database.code,
    "DATABASE_CONNECTIVITY_OR_SCHEMA_CHECK_FAILED",
  );
  assert.equal(JSON.stringify(failedResult).includes("provider detail"), false);
  assert.equal(
    failed.queries.map(({ sql }) => sql.trim()).at(-1),
    "ROLLBACK",
  );
});

test("Auth0 smoke validation rejects malformed runtime configuration", () => {
  const invalidDomain = configuredEnvironment();
  invalidDomain.AUTH0_DOMAIN = "http://tenant.example.auth0.com";
  assert.equal(
    inspectAuth0SmokeConfiguration(invalidDomain).code,
    "AUTH0_DOMAIN_INVALID",
  );

  const weakSession = configuredEnvironment();
  weakSession.ADMIN_SESSION_SECRET = "too-short";
  assert.equal(
    inspectAuth0SmokeConfiguration(weakSession).code,
    "ADMIN_SESSION_SECRET_TOO_SHORT",
  );
});
