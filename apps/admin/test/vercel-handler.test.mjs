import assert from "node:assert/strict";
import test from "node:test";

import { createVercelAdminHandler } from "../api/index.mjs";
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
