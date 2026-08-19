import { createHash } from "node:crypto";

if (process.env.NODE_ENV !== "test") {
  throw new Error("TEST_PRIVATE_MEDIA_FIXTURE_FORBIDDEN_OUTSIDE_TEST");
}

function copyBytes(value) {
  if (Buffer.isBuffer(value)) {
    return Buffer.from(value);
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }

  throw new Error("TEST_PRIVATE_MEDIA_BYTES_REQUIRED");
}

export function createTestPrivateMediaStore() {
  const objects = new Map();
  let sequence = 0;

  async function putObject({ key, bytes: input, contentType, checksum } = {}) {
    const bytes = copyBytes(input);
    if (bytes.length < 1 || typeof contentType !== "string" || contentType === "") {
      throw new Error("TEST_PRIVATE_MEDIA_INPUT_INVALID");
    }

    const objectKey =
      typeof key === "string" && key !== ""
        ? key
        : `test-private/${(++sequence).toString(16).padStart(24, "0")}`;
    if (objects.has(objectKey)) {
      throw new Error("TEST_PRIVATE_MEDIA_IMMUTABLE_KEY_COLLISION");
    }

    const checksumSha256 = createHash("sha256").update(bytes).digest("hex");
    if (checksum !== undefined && checksum !== checksumSha256) {
      throw new Error("TEST_PRIVATE_MEDIA_CHECKSUM_MISMATCH");
    }
    objects.set(
      objectKey,
      Object.freeze({
        bytes,
        contentType,
        checksumSha256,
      }),
    );

    return Object.freeze({
      key: objectKey,
      objectKey,
      contentType,
      byteLength: bytes.length,
      checksum: checksumSha256,
      checksumSha256,
    });
  }

  async function putPrivateObject(input = {}) {
    return putObject(input);
  }

  async function getPrivateObject({ objectKey } = {}) {
    const object = objects.get(objectKey);
    if (!object) {
      throw new Error("TEST_PRIVATE_MEDIA_OBJECT_NOT_FOUND");
    }

    return Object.freeze({
      objectKey,
      body: Buffer.from(object.bytes),
      contentType: object.contentType,
      byteLength: object.bytes.length,
      checksumSha256: object.checksumSha256,
    });
  }

  async function getObject({ key } = {}) {
    const result = await getPrivateObject({ objectKey: key });
    return Object.freeze({
      key,
      bytes: result.body,
      contentType: result.contentType,
      byteLength: result.byteLength,
      checksum: result.checksumSha256,
    });
  }

  async function deletePrivateObject({ objectKey } = {}) {
    if (!objects.delete(objectKey)) {
      throw new Error("TEST_PRIVATE_MEDIA_OBJECT_NOT_FOUND");
    }

    return Object.freeze({ objectKey, deleted: true });
  }

  async function deleteObject({ key } = {}) {
    const result = await deletePrivateObject({ objectKey: key });
    return Object.freeze({ key: result.objectKey, deleted: true });
  }

  function inspectObjects() {
    return Object.freeze(
      [...objects.entries()].map(([objectKey, object]) =>
        Object.freeze({
          objectKey,
          contentType: object.contentType,
          byteLength: object.bytes.length,
          checksumSha256: object.checksumSha256,
        }),
      ),
    );
  }

  return Object.freeze({
    putObject,
    getObject,
    deleteObject,
    putPrivateObject,
    getPrivateObject,
    deletePrivateObject,
    inspectObjects,
  });
}
