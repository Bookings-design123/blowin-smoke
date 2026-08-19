import assert from "node:assert/strict";
import test from "node:test";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { createS3PrivateMediaStore } from "../src/s3-private-media-store.mjs";
import { createTestPrivateMediaStore } from "./fixtures/test-private-media-store.mjs";

test("S3 private media writes immutable opaque objects without public access fields", async () => {
  const commands = [];
  const client = {
    async send(command) {
      commands.push(command);
      if (command instanceof GetObjectCommand) {
        return {
          Body: Buffer.from("stored", "utf8"),
          ContentType: "image/jpeg",
          ContentLength: 6,
        };
      }
      return {};
    },
  };
  const store = createS3PrivateMediaStore({
    bucket: "private-test-bucket",
    client,
    prefix: "private-media",
    keyFactory: () => "opaque_test_key_1234567890",
  });

  const written = await store.putObject({
    key: "private-media/opaque_test_key_1234567890",
    bytes: Buffer.from("stored", "utf8"),
    contentType: "image/jpeg",
  });
  assert.equal(written.objectKey, "private-media/opaque_test_key_1234567890");
  assert.equal(Object.hasOwn(written, "url"), false);
  assert.ok(commands[0] instanceof PutObjectCommand);
  assert.equal(commands[0].input.IfNoneMatch, "*");
  assert.equal(commands[0].input.ACL, undefined);
  assert.equal(commands[0].input.CacheControl, "private, no-store");
  assert.equal(commands[0].input.ServerSideEncryption, "AES256");

  const read = await store.getObject({ key: written.key });
  assert.deepEqual(read.bytes, Buffer.from("stored", "utf8"));
  assert.match(read.checksum, /^[a-f0-9]{64}$/);
  assert.ok(commands[1] instanceof GetObjectCommand);

  await store.deleteObject({ key: written.key });
  assert.ok(commands[2] instanceof DeleteObjectCommand);
});

test("S3 private media fails closed when configuration is absent", () => {
  assert.throws(
    () => createS3PrivateMediaStore(),
    /PRIVATE_MEDIA_BUCKET_REQUIRED/,
  );
  assert.throws(
    () => createS3PrivateMediaStore({ bucket: "configured" }),
    /PRIVATE_MEDIA_S3_CLIENT_UNBOUND/,
  );
});

test("test-only private media store supports immutable put/read/delete semantics", async () => {
  const store = createTestPrivateMediaStore();
  const written = await store.putObject({
    key: "test-private/000000000000000000000001",
    bytes: Buffer.from("synthetic", "utf8"),
    contentType: "image/jpeg",
  });
  assert.equal(Object.hasOwn(written, "url"), false);
  assert.equal(store.inspectObjects().length, 1);

  const read = await store.getObject({ key: written.key });
  assert.deepEqual(read.bytes, Buffer.from("synthetic", "utf8"));

  await store.deleteObject({ key: written.key });
  assert.equal(store.inspectObjects().length, 0);
});
