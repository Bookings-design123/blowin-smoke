import { createServer } from "node:http";

import { createAdminApplication } from "./application.mjs";

const handle = createAdminApplication();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

const server = createServer(async (request, response) => {
  const result = await handle({
    method: request.method,
    url: request.url,
    headers: request.headers,
  });

  response.writeHead(result.status, result.headers);
  response.end(result.body);
});

server.listen(port, () => {
  console.log(`Blowin' Smoke Admin boundary listening on http://localhost:${port}`);
});
