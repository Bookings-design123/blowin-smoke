import { createHash, randomBytes } from "node:crypto";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const OPAQUE_KEY_PATTERN = /^[A-Za-z0-9_-]{20,128}$/;
const PREFIX_PATTERN = /^[A-Za-z0-9][A-Za-z0-9/_-]{0,127}$/;
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "application/pdf"]);
const DEFAULT_MAX_OBJECT_BYTES = 24 * 1024 * 1024;

function requiredText(value, code) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(code);
  }

  return value.trim();
}

function normalizedBytes(value) {
  if (Buffer.isBuffer(value)) {
    return Buffer.from(value);
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }

  throw new Error("PRIVATE_MEDIA_BYTES_REQUIRED");
}

function normalizedPrefix(value) {
  const prefix = requiredText(value, "PRIVATE_MEDIA_PREFIX_REQUIRED")
    .replace(/^\/+|\/+$/g, "");

  if (!PREFIX_PATTERN.test(prefix) || prefix.includes("//") || prefix.includes("..")) {
    throw new Error("PRIVATE_MEDIA_PREFIX_INVALID");
  }

  return prefix;
}

function defaultOpaqueKey() {
  return randomBytes(24).toString("base64url");
}

function assertOpaqueKey(value) {
  if (typeof value !== "string" || !OPAQUE_KEY_PATTERN.test(value)) {
    throw new Error("PRIVATE_MEDIA_OPAQUE_KEY_INVALID");
  }

  return value;
}

function assertOwnedObjectKey(value, prefix) {
  if (
    typeof value !== "string" ||
    !value.startsWith(`${prefix}/`) ||
    !OPAQUE_KEY_PATTERN.test(value.slice(prefix.length + 1))
  ) {
    throw new Error("PRIVATE_MEDIA_OBJECT_KEY_INVALID");
  }

  return value;
}

function resolvedApplicationObjectKey(value, prefix) {
  const key = requiredText(value, "PRIVATE_MEDIA_OBJECT_KEY_REQUIRED");
  if (OPAQUE_KEY_PATTERN.test(key)) {
    return `${prefix}/${key}`;
  }

  return assertOwnedObjectKey(key, prefix);
}

function assertClient(client) {
  if (!client || typeof client.send !== "function") {
    throw new Error("PRIVATE_MEDIA_S3_CLIENT_UNBOUND");
  }

  return client;
}

export function createS3PrivateMediaStore({
  bucket,
  region,
  client,
  prefix = "private-media",
  keyFactory = defaultOpaqueKey,
  maxObjectBytes = DEFAULT_MAX_OBJECT_BYTES,
} = {}) {
  const resolvedBucket = requiredText(bucket, "PRIVATE_MEDIA_BUCKET_REQUIRED");
  const resolvedPrefix = normalizedPrefix(prefix);
  const resolvedClient = assertClient(
    client ??
      (typeof region === "string" && region.trim() !== ""
        ? new S3Client({ region: region.trim() })
        : null),
  );

  if (typeof keyFactory !== "function") {
    throw new Error("PRIVATE_MEDIA_KEY_FACTORY_INVALID");
  }

  if (!Number.isSafeInteger(maxObjectBytes) || maxObjectBytes < 1) {
    throw new Error("PRIVATE_MEDIA_MAX_OBJECT_SIZE_INVALID");
  }

  async function putObject({ key, bytes: input, contentType, checksum } = {}) {
    const bytes = normalizedBytes(input);
    const resolvedContentType = requiredText(
      contentType,
      "PRIVATE_MEDIA_CONTENT_TYPE_REQUIRED",
    );

    if (!ALLOWED_CONTENT_TYPES.has(resolvedContentType)) {
      throw new Error("PRIVATE_MEDIA_CONTENT_TYPE_NOT_ALLOWED");
    }

    if (bytes.length < 1 || bytes.length > maxObjectBytes) {
      throw new Error("PRIVATE_MEDIA_OBJECT_SIZE_INVALID");
    }

    const objectKey = resolvedApplicationObjectKey(key, resolvedPrefix);
    const checksumBytes = createHash("sha256").update(bytes).digest();
    const checksumHex = checksumBytes.toString("hex");

    if (checksum !== undefined && checksum !== checksumHex) {
      throw new Error("PRIVATE_MEDIA_CHECKSUM_MISMATCH");
    }

    await resolvedClient.send(
      new PutObjectCommand({
        Bucket: resolvedBucket,
        Key: objectKey,
        Body: bytes,
        ContentType: resolvedContentType,
        ContentLength: bytes.length,
        CacheControl: "private, no-store",
        ServerSideEncryption: "AES256",
        ChecksumSHA256: checksumBytes.toString("base64"),
        IfNoneMatch: "*",
      }),
    );

    return Object.freeze({
      key: objectKey,
      objectKey,
      contentType: resolvedContentType,
      byteLength: bytes.length,
      checksum: checksumHex,
      checksumSha256: checksumHex,
    });
  }

  async function putPrivateObject({ bytes, contentType, checksum } = {}) {
    const opaqueKey = assertOpaqueKey(await keyFactory());
    return putObject({ key: opaqueKey, bytes, contentType, checksum });
  }

  async function bodyToBytes(body) {
    if (Buffer.isBuffer(body)) {
      if (body.length > maxObjectBytes) {
        throw new Error("PRIVATE_MEDIA_OBJECT_SIZE_INVALID");
      }
      return Buffer.from(body);
    }

    if (body instanceof Uint8Array) {
      if (body.byteLength > maxObjectBytes) {
        throw new Error("PRIVATE_MEDIA_OBJECT_SIZE_INVALID");
      }
      return Buffer.from(body);
    }

    if (typeof body?.transformToByteArray === "function") {
      const bytes = Buffer.from(await body.transformToByteArray());
      if (bytes.length > maxObjectBytes) {
        throw new Error("PRIVATE_MEDIA_OBJECT_SIZE_INVALID");
      }
      return bytes;
    }

    if (body && typeof body[Symbol.asyncIterator] === "function") {
      const chunks = [];
      let byteLength = 0;
      for await (const chunk of body) {
        const bytes = normalizedBytes(chunk);
        byteLength += bytes.length;
        if (byteLength > maxObjectBytes) {
          throw new Error("PRIVATE_MEDIA_OBJECT_SIZE_INVALID");
        }
        chunks.push(bytes);
      }
      return Buffer.concat(chunks);
    }

    throw new Error("PRIVATE_MEDIA_OBJECT_BODY_INVALID");
  }

  async function getPrivateObject({ objectKey } = {}) {
    const resolvedObjectKey = assertOwnedObjectKey(objectKey, resolvedPrefix);
    const result = await resolvedClient.send(
      new GetObjectCommand({
        Bucket: resolvedBucket,
        Key: resolvedObjectKey,
      }),
    );

    if (!result?.Body) {
      throw new Error("PRIVATE_MEDIA_OBJECT_BODY_MISSING");
    }

    if (
      Number.isSafeInteger(result.ContentLength) &&
      result.ContentLength > maxObjectBytes
    ) {
      throw new Error("PRIVATE_MEDIA_OBJECT_SIZE_INVALID");
    }

    return Object.freeze({
      objectKey: resolvedObjectKey,
      body: result.Body,
      contentType: result.ContentType ?? "application/octet-stream",
      byteLength: result.ContentLength ?? null,
      checksumSha256: result.ChecksumSHA256 ?? null,
    });
  }

  async function getObject({ key } = {}) {
    const result = await getPrivateObject({
      objectKey: resolvedApplicationObjectKey(key, resolvedPrefix),
    });
    const bytes = await bodyToBytes(result.body);
    const checksumHex = createHash("sha256").update(bytes).digest("hex");

    return Object.freeze({
      key: result.objectKey,
      bytes,
      contentType: result.contentType,
      byteLength: bytes.length,
      checksum: checksumHex,
    });
  }

  async function deletePrivateObject({ objectKey } = {}) {
    const resolvedObjectKey = assertOwnedObjectKey(objectKey, resolvedPrefix);
    await resolvedClient.send(
      new DeleteObjectCommand({
        Bucket: resolvedBucket,
        Key: resolvedObjectKey,
      }),
    );

    return Object.freeze({ objectKey: resolvedObjectKey, deleted: true });
  }

  async function deleteObject({ key } = {}) {
    const result = await deletePrivateObject({
      objectKey: resolvedApplicationObjectKey(key, resolvedPrefix),
    });
    return Object.freeze({ key: result.objectKey, deleted: true });
  }

  return Object.freeze({
    putObject,
    getObject,
    deleteObject,
    putPrivateObject,
    getPrivateObject,
    deletePrivateObject,
  });
}
