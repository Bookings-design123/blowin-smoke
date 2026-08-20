import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { format } from "node:util";

import * as vercelEntrypoint from "../api/index.mjs";
import { createVercelAdminHandler } from "../src/admin-http-runtime.mjs";
import {
  MAX_UPLOAD_BINARY_BYTES,
  MAX_UPLOAD_REQUEST_BYTES,
} from "../src/upload-policy.mjs";

function responseRecorder() {
  return {
    status: null,
    headers: null,
    body: null,
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    end(body) {
      this.body = body;
    },
  };
}

test("Vercel entrypoint exports only one default request handler", () => {
  assert.deepEqual(Object.keys(vercelEntrypoint), ["default"]);
  assert.equal(typeof vercelEntrypoint.default, "function");
});

test("Vercel deployment boundary cannot auto-select the local Node server", () => {
  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  const vercelConfig = JSON.parse(
    readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
  );

  assert.equal(packageJson.main, "api/index.mjs");
  assert.equal(packageJson.scripts.start, undefined);
  assert.equal(
    packageJson.scripts["start:local"],
    "node scripts/local-admin-server.mjs",
  );
  assert.equal(existsSync(new URL("../src/server.mjs", import.meta.url)), false);
  assert.deepEqual(Object.keys(vercelConfig.functions), ["api/index.mjs"]);
  assert.equal(
    vercelConfig.functions["api/index.mjs"].excludeFiles,
    "scripts/local-admin-server.mjs",
  );
});

test("Vercel upload policy leaves room for base64 JSON framing", () => {
  const encodedBytes = Math.ceil((MAX_UPLOAD_BINARY_BYTES * 4) / 3);
  assert.ok(encodedBytes + 64 * 1024 < MAX_UPLOAD_REQUEST_BYTES);
});

test("Vercel handler caches one runtime and preserves parsed request bodies", async () => {
  let starts = 0;
  const seen = [];
  const handler = createVercelAdminHandler({
    runtimeFactory: async () => {
      starts += 1;
      return {
        async handle(request) {
          seen.push(request);
          return {
            status: 201,
            headers: { "content-type": "application/json", "set-cookie": ["a=1", "b=2"] },
            body: JSON.stringify({ status: "OK" }),
          };
        },
      };
    },
  });

  for (let index = 0; index < 2; index += 1) {
    const response = responseRecorder();
    await handler(
      {
        method: "POST",
        url: "/admin/products",
        headers: { "content-type": "application/json" },
        body: { name: "Synthetic" },
      },
      response,
    );
    assert.equal(response.status, 201);
    assert.deepEqual(response.headers["set-cookie"], ["a=1", "b=2"]);
  }

  assert.equal(starts, 1);
  assert.deepEqual(seen.map((request) => request.body), [
    { name: "Synthetic" },
    { name: "Synthetic" },
  ]);
});

test("Vercel handler fails closed for initialization errors and oversized commands", async () => {
  let initializationAttempts = 0;
  const initializationFailure = createVercelAdminHandler({
    runtimeFactory: async () => {
      initializationAttempts += 1;
      if (initializationAttempts === 1) {
        throw new Error("provider secret must not escape");
      }
      return {
        async handle() {
          return { status: 200, headers: {}, body: "ready" };
        },
      };
    },
    logger: { error() {} },
  });
  const failed = responseRecorder();
  await initializationFailure({ method: "GET", url: "/admin", headers: {} }, failed);
  assert.equal(failed.status, 503);
  assert.equal(String(failed.body).includes("provider secret"), false);
  const recovered = responseRecorder();
  await initializationFailure({ method: "GET", url: "/admin", headers: {} }, recovered);
  assert.equal(recovered.status, 200);
  assert.equal(initializationAttempts, 2);

  let invoked = false;
  const oversizedHandler = createVercelAdminHandler({
    runtimeFactory: async () => ({
      async handle() {
        invoked = true;
        throw new Error("must not run");
      },
    }),
  });
  const oversized = responseRecorder();
  await oversizedHandler(
    {
      method: "POST",
      url: "/admin/products",
      headers: {},
      body: "x".repeat(129 * 1024),
    },
    oversized,
  );
  assert.equal(oversized.status, 413);
  assert.equal(invoked, false);
});

test("Vercel startup diagnostics cannot expose secrets", async () => {
  const sensitiveValues = [
    "postgresql://db-owner:DB_PASSWORD_MARKER@db.example.test/admin?sslmode=require",
    "DB_PASSWORD_MARKER",
    "AUTH0_CLIENT_SECRET_MARKER",
    "ADMIN_SESSION_SECRET_MARKER",
    "BEARER_TOKEN_MARKER",
    "AWS_ACCESS_KEY_ID_MARKER",
    "AWS_SECRET_ACCESS_KEY_MARKER",
    "owner.personal+marker@example.test",
  ];
  const failure = new Error(sensitiveValues.join(" | "));
  failure.name = sensitiveValues[7];
  failure.code = "ECONNREFUSED";
  failure.cause = new Error(sensitiveValues[3]);
  failure.stack = [
    `Error: ${sensitiveValues.join(" | ")}`,
    `    at ${sensitiveValues[4]} (file:///var/task/apps/admin/src/admin-http-runtime.mjs:241:11)`,
    `    at ${sensitiveValues[5]} (file:///var/task/apps/admin/src/${sensitiveValues[6]}.mjs:1:1)`,
    `    at ${sensitiveValues[7]} (https://example.test/module.mjs?token=${sensitiveValues[4]}:2:3)`,
  ].join("\n");
  const logged = [];
  const handler = createVercelAdminHandler({
    runtimeFactory: async () => {
      throw failure;
    },
    logger: {
      error(...args) {
        logged.push(args);
      },
    },
  });
  const response = responseRecorder();

  await handler(
    {
      method: "GET",
      url: "/admin",
      headers: { authorization: `Bearer ${sensitiveValues[4]}` },
    },
    response,
  );

  assert.equal(response.status, 503);
  assert.equal(response.body, '{"status":"BLOCKED","code":"REQUEST_FAILED"}');
  assert.equal(logged.length, 1);
  assert.equal(logged[0].length, 1);
  assert.deepEqual(logged[0][0], {
    name: "Error",
    code: "ECONNREFUSED",
    message: "A required service refused the connection.",
    stack: ["admin-http-runtime.mjs:241:11"],
  });

  const renderedLog = format(...logged[0]);
  for (const sensitiveValue of sensitiveValues) {
    assert.equal(renderedLog.includes(sensitiveValue), false);
  }
  assert.equal(response.body.includes("ECONNREFUSED"), false);
});
