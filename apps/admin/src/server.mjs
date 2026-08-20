import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

import { createAdminApplication } from "./application.mjs";
import {
  createProductionAdminApplication,
  dispatchAdminHttpRequest,
  failedRequest,
  maximumCommandBodyBytes,
  maximumUploadBodyBytes,
  requestBodyLimit,
  writeAdminHttpResponse,
} from "./admin-http-runtime.mjs";

export {
  createProductionAdminApplication,
  dispatchAdminHttpRequest,
  failedRequest,
  maximumCommandBodyBytes,
  maximumUploadBodyBytes,
  requestBodyLimit,
  writeAdminHttpResponse,
};

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

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
