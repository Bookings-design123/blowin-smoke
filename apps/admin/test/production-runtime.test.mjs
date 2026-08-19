import assert from "node:assert/strict";
import test from "node:test";

import { requireProductionRuntimeConfiguration } from "../src/boundaries.mjs";
import {
  createProductionPostgresStore,
  productionPostgresPoolOptions,
  runDay1AdminMigrations,
} from "../src/postgres-commerce-store.mjs";
import { createProductionAdminApplication } from "../src/server.mjs";

function productionEnvironment() {
  return {
    DATABASE_URL: "postgresql://database.example/admin?sslmode=require",
    POSTGRES_POOL_MAX: "2",
    AUTH0_DOMAIN: "tenant.example.auth0.com",
    AUTH0_CLIENT_ID: "owner-client",
    AUTH0_CLIENT_SECRET: "client-secret",
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

function schemaResponse(sql, migrated = true) {
  if (sql.includes("to_regclass('public.admin_schema_migrations')")) {
    return { rows: [{ relation: migrated ? "admin_schema_migrations" : null }] };
  }
  if (sql.includes("FROM public.admin_schema_migrations")) {
    return {
      rowCount: migrated ? 1 : 0,
      rows: migrated
        ? [
            {
              version: 1,
              name: "001_day1_admin_mvp",
              revision: "2026-08-18.1",
            },
          ]
        : [],
    };
  }
  if (sql.includes("pg_class.relkind IN ('r', 'p')") || sql.includes("FROM pg_trigger")) {
    return { rows: [] };
  }
  return { rows: [] };
}

test("production PostgreSQL configuration requires TLS and bounds serverless pools", () => {
  const options = productionPostgresPoolOptions({ env: productionEnvironment() });
  assert.equal(options.max, 2);
  assert.equal(options.connectionTimeoutMillis, 5_000);
  assert.equal(options.query_timeout, 10_000);
  assert.equal(options.allowExitOnIdle, true);

  assert.throws(
    () =>
      productionPostgresPoolOptions({
        databaseUrl: "postgresql://database.example/admin",
        env: {},
      }),
    /DATABASE_TLS_REQUIRED/,
  );
  assert.throws(
    () => productionPostgresPoolOptions({ databaseUrl: "https://database.example", env: {} }),
    /DATABASE_URL_INVALID/,
  );
  for (const databaseUrl of [
    "postgresql://database.example/admin?ssl=true&sslmode=disable",
    "postgresql://database.example/admin?ssl=true&sslmode=no-verify",
    "postgresql://database.example/admin?sslmode=require&uselibpqcompat=true",
  ]) {
    assert.throws(
      () => productionPostgresPoolOptions({ databaseUrl, env: {} }),
      /DATABASE_TLS_REQUIRED/,
    );
  }
  assert.throws(
    () =>
      productionPostgresPoolOptions({
        databaseUrl: "postgresql://database.example/admin?sslmode=require",
        env: { POSTGRES_POOL_MAX: "2garbage" },
      }),
    /POSTGRES_POOL_CONFIGURATION_INVALID/,
  );
});

test("migration applies once, records exact state, and then verifies without DDL", async () => {
  let migrated = false;
  const queries = [];
  const pool = {
    async query(query) {
      const sql = typeof query === "string" ? query : query.text;
      queries.push({ sql, options: typeof query === "string" ? null : query });
      if (sql.startsWith("BEGIN;")) {
        assert.match(sql, /CREATE TABLE IF NOT EXISTS admin_schema_migrations/);
        assert.match(sql, /unversioned admin schema requires explicit review/);
        assert.match(sql, /VALUES \(1, '001_day1_admin_mvp', '2026-08-18\.1'\)/);
        migrated = true;
        return { rows: [] };
      }
      return schemaResponse(sql, migrated);
    },
  };

  const first = await runDay1AdminMigrations({ pool });
  const queryCount = queries.length;
  const second = await runDay1AdminMigrations({ pool });

  assert.equal(first.applied, true);
  assert.equal(second.applied, false);
  assert.equal(
    queries.slice(queryCount).some(({ sql }) => sql.startsWith("BEGIN;")),
    false,
  );
  const migrationQuery = queries.find(({ sql }) => sql.startsWith("BEGIN;"));
  assert.equal(migrationQuery.options.query_timeout, 75_000);
  const triggerVerification = queries.find(({ sql }) => sql.includes("FROM pg_trigger"));
  assert.match(triggerVerification.sql, /tgenabled IN \('O', 'A'\)/);
  assert.match(triggerVerification.sql, /tgtype = 27/);
  assert.match(triggerVerification.sql, /reject_immutable_commerce_row_mutation/);
});

test("production store consumes DATABASE_URL, verifies schema, and closes its pool", async () => {
  let options;
  let ended = false;
  class TestPool {
    constructor(value) {
      options = value;
    }
    async query(sql) {
      return schemaResponse(sql, true);
    }
    async connect() {
      throw new Error("not used by production initialization");
    }
    async end() {
      ended = true;
    }
  }

  const store = await createProductionPostgresStore({
    env: productionEnvironment(),
    pgModule: { Pool: TestPool },
    verifySchema: true,
  });
  assert.match(options.connectionString, /^postgresql:/);
  assert.equal(options.max, 2);
  await store.close();
  assert.equal(ended, true);
});

test("production runtime rejects incomplete configuration instead of starting partially", async () => {
  const configured = productionEnvironment();
  delete configured.AUTH0_CLIENT_SECRET;
  delete configured.S3_MEDIA_BUCKET;

  assert.throws(
    () => requireProductionRuntimeConfiguration(configured),
    (error) => {
      assert.equal(error.code, "PRODUCTION_CONFIGURATION_MISSING");
      assert.deepEqual(error.missing, ["AUTH0_CLIENT_SECRET", "S3_MEDIA_BUCKET"]);
      assert.equal(error.message.includes("client-secret"), false);
      return true;
    },
  );
  await assert.rejects(
    createProductionAdminApplication({ env: configured }),
    /PRODUCTION_CONFIGURATION_MISSING/,
  );
});

test("production runtime binds verified PostgreSQL, Auth0, and private S3 adapters", async () => {
  let ended = false;
  class TestPool {
    async query(sql) {
      return schemaResponse(sql, true);
    }
    async connect() {
      throw new Error("not used by production initialization");
    }
    async end() {
      ended = true;
    }
  }
  const runtime = await createProductionAdminApplication({
    env: productionEnvironment(),
    pgModule: { Pool: TestPool },
    s3Client: { async send() { return {}; } },
  });

  assert.equal(typeof runtime.handle, "function");
  await runtime.close();
  assert.equal(ended, true);
});
