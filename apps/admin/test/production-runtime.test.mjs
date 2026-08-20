import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { requireProductionRuntimeConfiguration } from "../src/boundaries.mjs";
import {
  createProductionPostgresStore,
  DAY1_ADMIN_IMMUTABLE_TRIGGERS,
  productionPostgresPoolOptions,
  runDay1AdminMigrations,
} from "../src/postgres-commerce-store.mjs";
import { createProductionAdminApplication } from "../src/admin-http-runtime.mjs";

const MIGRATION_URL = new URL("../migrations/001_day1_admin_mvp.sql", import.meta.url);

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

function queryText(query) {
  return typeof query === "string" ? query : query.text;
}

function assertImmutableInstallSql(sql) {
  assert.match(sql, /CREATE OR REPLACE FUNCTION reject_immutable_commerce_row_mutation/);
  assert.match(
    sql,
    /RAISE EXCEPTION ''% is immutable'', TG_TABLE_NAME USING ERRCODE = ''55000'';/,
  );
  assert.equal(sql.match(/\bCREATE TRIGGER\b/g)?.length, 4);
  for (const trigger of DAY1_ADMIN_IMMUTABLE_TRIGGERS) {
    assert.match(
      sql,
      new RegExp(
        `CREATE TRIGGER ${trigger.name}\\s+BEFORE UPDATE OR DELETE ON ${trigger.table}\\s+FOR EACH ROW EXECUTE FUNCTION reject_immutable_commerce_row_mutation\\(\\);`,
      ),
    );
  }
}

function migrationTestPool({
  migrated = false,
  installedTriggers = [],
  omittedOnInstall = [],
  installError,
} = {}) {
  let schemaInstalled = migrated;
  let committedTriggers = new Set(installedTriggers);
  let transactionTriggers;
  const omitted = new Set(omittedOnInstall);
  const queries = [];

  function response(sql, triggers = committedTriggers) {
    if (sql.includes("to_regclass('public.admin_schema_migrations')")) {
      return { rows: [{ relation: schemaInstalled ? "admin_schema_migrations" : null }] };
    }
    if (sql.includes("FROM public.admin_schema_migrations")) {
      return schemaInstalled
        ? {
            rowCount: 1,
            rows: [
              {
                version: 1,
                name: "001_day1_admin_mvp",
                revision: "2026-08-18.1",
              },
            ],
          }
        : { rowCount: 0, rows: [] };
    }
    if (sql.includes("pg_class.relkind IN ('r', 'p')")) return { rows: [] };
    if (sql.includes("FROM pg_trigger")) {
      return {
        rows: DAY1_ADMIN_IMMUTABLE_TRIGGERS.filter(
          (trigger) => !triggers.has(trigger.name),
        ).map((trigger) => ({ name: trigger.name })),
      };
    }
    return { rows: [] };
  }

  const client = {
    async query(query) {
      const sql = queryText(query);
      queries.push({ scope: "client", sql, options: typeof query === "string" ? null : query });
      if (sql === "BEGIN") {
        transactionTriggers = new Set(committedTriggers);
        return { rows: [] };
      }
      if (sql === "COMMIT") {
        committedTriggers = transactionTriggers;
        transactionTriggers = undefined;
        return { rows: [] };
      }
      if (sql === "ROLLBACK") {
        transactionTriggers = undefined;
        return { rows: [] };
      }
      if (sql.includes("CREATE OR REPLACE FUNCTION reject_immutable_commerce_row_mutation")) {
        assertImmutableInstallSql(sql);
        if (installError) throw installError;
        transactionTriggers = new Set(
          DAY1_ADMIN_IMMUTABLE_TRIGGERS.filter(
            (trigger) => !omitted.has(trigger.name),
          ).map((trigger) => trigger.name),
        );
        return { rows: [] };
      }
      return response(sql, transactionTriggers ?? committedTriggers);
    },
    release() {},
  };

  const pool = {
    async query(query) {
      const sql = queryText(query);
      queries.push({ scope: "pool", sql, options: typeof query === "string" ? null : query });
      if (sql.startsWith("BEGIN;")) {
        schemaInstalled = true;
        return { rows: [] };
      }
      const mutation =
        /^\s*UPDATE\s+([a-z_]+)/i.exec(sql) ??
        /^\s*DELETE\s+FROM\s+([a-z_]+)/i.exec(sql);
      if (mutation) {
        const trigger = DAY1_ADMIN_IMMUTABLE_TRIGGERS.find(
          (candidate) => candidate.table === mutation[1],
        );
        if (trigger && committedTriggers.has(trigger.name)) {
          const error = new Error(`${mutation[1]} is immutable`);
          error.code = "55000";
          throw error;
        }
      }
      return response(sql);
    },
    async connect() {
      return client;
    },
  };

  return {
    pool,
    queries,
    committedTriggerNames: () => [...committedTriggers].sort(),
  };
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

test("001 is parser-safe schema SQL without procedural bodies", async () => {
  const sql = await readFile(MIGRATION_URL, "utf8");

  assert.doesNotMatch(sql, /^\s*DO\b/im);
  assert.doesNotMatch(sql, /\bCREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\b/i);
  assert.doesNotMatch(sql, /\bLANGUAGE\s+plpgsql\b/i);
  assert.doesNotMatch(sql, /\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/);
  assert.doesNotMatch(sql, /\bCREATE\s+TRIGGER\b/i);
  assert.doesNotMatch(sql, /\bRAISE\s+EXCEPTION\b/i);
  assert.match(sql, /unversioned_admin_schema_guard/);
  assert.match(sql, /migration_revision_guard/);
  assert.match(sql, /VALUES \(1, '001_day1_admin_mvp', '2026-08-18\.1'\)/);
});

test("migration applies schema, installs all protections, and then verifies without DDL", async () => {
  const database = migrationTestPool();
  const first = await runDay1AdminMigrations({ pool: database.pool });
  const queryCount = database.queries.length;
  const second = await runDay1AdminMigrations({ pool: database.pool });

  assert.equal(first.applied, true);
  assert.equal(second.applied, false);

  const migrationIndex = database.queries.findIndex(({ sql }) => sql.startsWith("BEGIN;"));
  const installIndex = database.queries.findIndex(({ sql }) =>
    sql.includes("CREATE OR REPLACE FUNCTION reject_immutable_commerce_row_mutation"),
  );
  const protectedVerificationIndex = database.queries.findIndex(
    ({ sql }, index) => index > installIndex && sql.includes("FROM pg_trigger"),
  );
  const commitIndex = database.queries.findIndex(
    ({ sql }, index) => index > protectedVerificationIndex && sql === "COMMIT",
  );

  assert.ok(migrationIndex >= 0);
  assert.ok(installIndex > migrationIndex);
  assert.ok(protectedVerificationIndex > installIndex);
  assert.ok(commitIndex > protectedVerificationIndex);
  assert.equal(database.queries[migrationIndex].options.query_timeout, 75_000);
  assert.equal(database.queries[installIndex].options.query_timeout, 75_000);
  assert.deepEqual(
    database.committedTriggerNames(),
    DAY1_ADMIN_IMMUTABLE_TRIGGERS.map((trigger) => trigger.name).sort(),
  );
  assert.equal(
    database.queries
      .slice(queryCount)
      .some(
        ({ sql }) =>
          sql.startsWith("BEGIN;") ||
          sql.includes("CREATE OR REPLACE FUNCTION reject_immutable_commerce_row_mutation"),
      ),
    false,
  );

  const triggerVerification = database.queries.find(({ sql }) =>
    sql.includes("FROM pg_trigger"),
  );
  assert.match(triggerVerification.sql, /tgenabled IN \('O', 'A'\)/);
  assert.match(triggerVerification.sql, /tgtype = 27/);
  assert.match(triggerVerification.sql, /reject_immutable_commerce_row_mutation/);
});

test("runtime protections reject update and delete attempts for every immutable table", async () => {
  const database = migrationTestPool();
  await runDay1AdminMigrations({ pool: database.pool });

  for (const trigger of DAY1_ADMIN_IMMUTABLE_TRIGGERS) {
    await assert.rejects(
      database.pool.query(
        `UPDATE ${trigger.table} SET id = id WHERE id = 'protected-record'`,
      ),
      (error) => error.code === "55000",
    );
    await assert.rejects(
      database.pool.query(
        `DELETE FROM ${trigger.table} WHERE id = 'protected-record'`,
      ),
      (error) => error.code === "55000",
    );
  }
});

test("runner installs protections after parser-safe schema was applied separately", async () => {
  const database = migrationTestPool({ migrated: true });
  const result = await runDay1AdminMigrations({ pool: database.pool });

  assert.equal(result.applied, false);
  assert.equal(database.queries.some(({ sql }) => sql.startsWith("BEGIN;")), false);
  assert.equal(
    database.queries.some(({ sql }) =>
      sql.includes("CREATE OR REPLACE FUNCTION reject_immutable_commerce_row_mutation"),
    ),
    true,
  );
  assert.deepEqual(
    database.committedTriggerNames(),
    DAY1_ADMIN_IMMUTABLE_TRIGGERS.map((trigger) => trigger.name).sort(),
  );
});

test("missing immutable protection fails verification and rolls back the install", async () => {
  const missingTrigger = "inventory_ledger_immutable";
  const database = migrationTestPool({ omittedOnInstall: [missingTrigger] });

  await assert.rejects(
    runDay1AdminMigrations({ pool: database.pool }),
    (error) => {
      assert.equal(error.code, "POSTGRES_SCHEMA_DRIFT");
      assert.deepEqual(error.missingTables, []);
      assert.deepEqual(error.missingTriggers, [missingTrigger]);
      return true;
    },
  );
  assert.equal(database.queries.some(({ sql }) => sql === "ROLLBACK"), true);
  assert.equal(database.queries.some(({ sql }) => sql === "COMMIT"), false);
  assert.deepEqual(database.committedTriggerNames(), []);
});

test("immutable protection installation error fails migration and rolls back", async () => {
  const installError = new Error("IMMUTABLE_PROTECTION_INSTALL_FAILED");
  const database = migrationTestPool({ installError });

  await assert.rejects(
    runDay1AdminMigrations({ pool: database.pool }),
    installError,
  );
  assert.equal(database.queries.some(({ sql }) => sql === "ROLLBACK"), true);
  assert.equal(database.queries.some(({ sql }) => sql === "COMMIT"), false);
  assert.deepEqual(database.committedTriggerNames(), []);
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

  assert.throws(
    () => requireProductionRuntimeConfiguration(configured),
    (error) => {
      assert.equal(error.code, "PRODUCTION_CONFIGURATION_MISSING");
      assert.deepEqual(error.missing, ["AUTH0_CLIENT_SECRET"]);
      assert.equal(error.message.includes("client-secret"), false);
      return true;
    },
  );
  await assert.rejects(
    createProductionAdminApplication({ env: configured }),
    /PRODUCTION_CONFIGURATION_MISSING/,
  );
});

test("production runtime starts without private media configuration", async () => {
  const configured = productionEnvironment();
  for (const key of [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "S3_MEDIA_BUCKET",
  ]) {
    delete configured[key];
  }
  const boundaries = requireProductionRuntimeConfiguration(configured);
  assert.equal(boundaries.admin.ready, true);
  assert.equal(boundaries.privateMedia.ready, false);

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
    env: configured,
    pgModule: { Pool: TestPool },
  });
  assert.equal(typeof runtime.handle, "function");
  await runtime.close();
  assert.equal(ended, true);
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
