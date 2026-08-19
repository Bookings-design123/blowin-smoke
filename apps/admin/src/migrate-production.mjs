import { pathToFileURL } from "node:url";

import { createProductionPostgresStore } from "./postgres-commerce-store.mjs";

export async function runProductionMigration({
  env = process.env,
  pgModule,
  output = process.stdout,
} = {}) {
  let store;
  try {
    store = await createProductionPostgresStore({
      env,
      pgModule,
      migrate: true,
    });
    output.write(
      `${JSON.stringify({ status: "READY", migration: "001_day1_admin_mvp" })}\n`,
    );
    return Object.freeze({ ok: true, status: "READY" });
  } catch {
    output.write(
      `${JSON.stringify({ status: "BLOCKED", code: "PRODUCTION_MIGRATION_FAILED" })}\n`,
    );
    return Object.freeze({
      ok: false,
      status: "BLOCKED",
      code: "PRODUCTION_MIGRATION_FAILED",
    });
  } finally {
    if (store) await store.close();
  }
}

const executedFile = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (executedFile === import.meta.url) {
  const result = await runProductionMigration();
  if (!result.ok) process.exitCode = 1;
}
