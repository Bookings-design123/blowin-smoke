import {
  createProductionAdminApplication,
  dispatchAdminHttpRequest,
  failedRequest,
  writeAdminHttpResponse,
} from "../src/server.mjs";

export function createVercelAdminHandler({
  runtimeFactory = createProductionAdminApplication,
} = {}) {
  let runtimePromise;

  return async function vercelAdminHandler(request, response) {
    try {
      runtimePromise ??= Promise.resolve()
        .then(() => runtimeFactory())
        .catch((error) => {
          runtimePromise = undefined;
          throw error;
        });
      const runtime = await runtimePromise;
      const result = await dispatchAdminHttpRequest(runtime.handle, request);
      writeAdminHttpResponse(response, result);
    } catch {
      writeAdminHttpResponse(response, failedRequest());
    }
  };
}

export default createVercelAdminHandler();
