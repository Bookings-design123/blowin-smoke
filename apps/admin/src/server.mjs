import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

import { createAdminApplication } from "./application.mjs";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const maximumBodyBytes = 64 * 1024;

async function readRequestBody(request) {
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

export function createAdminHttpServer(handle = createAdminApplication()) {
  return createServer(async (request, response) => {
    let result;

    try {
      const body =
        request.method === "POST" || request.method === "PUT"
          ? await readRequestBody(request)
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
  const server = createAdminHttpServer();
  server.listen(port, () => {
    console.log(`Blowin' Smoke Admin boundary listening on http://localhost:${port}`);
  });
}
