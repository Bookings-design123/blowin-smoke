import { createVercelAdminHandler } from "../src/admin-http-runtime.mjs";

const handler = createVercelAdminHandler();

export default function vercelAdminFunction(request, response) {
  return handler(request, response);
}
