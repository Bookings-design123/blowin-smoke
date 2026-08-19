import assert from "node:assert/strict";
import test from "node:test";

import sharp from "sharp";

import {
  MediaValidationError,
  sanitizeEvidenceUpload,
  sanitizeImageUpload,
} from "../src/image-sanitizer.mjs";

test("product images are content-validated and emitted as metadata-free JPEGs", async () => {
  const source = await sharp({
    create: {
      width: 24,
      height: 12,
      channels: 4,
      background: { r: 20, g: 40, b: 60, alpha: 0.7 },
    },
  })
    .png()
    .withMetadata({ orientation: 6 })
    .toBuffer();

  const sourceMetadata = await sharp(source).metadata();
  assert.ok(sourceMetadata.exif);

  const result = await sanitizeImageUpload({
    bytes: source,
    mimeType: "image/png",
    filename: "source-with-private-metadata.png",
  });
  const metadata = await sharp(result.bytes).metadata();

  assert.equal(result.kind, "image");
  assert.equal(result.contentType, "image/jpeg");
  assert.equal(result.extension, "jpg");
  assert.equal(result.filename, "product-image.jpg");
  assert.match(result.checksum, /^[a-f0-9]{64}$/);
  assert.equal(metadata.format, "jpeg");
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.xmp, undefined);
  assert.equal(metadata.iptc, undefined);
});

test("declared image type must agree with decoded content", async () => {
  const source = await sharp({
    create: {
      width: 4,
      height: 4,
      channels: 3,
      background: "#112233",
    },
  })
    .png()
    .toBuffer();

  await assert.rejects(
    sanitizeImageUpload({ bytes: source, mimeType: "image/jpeg" }),
    (error) =>
      error instanceof MediaValidationError &&
      error.code === "IMAGE_CONTENT_TYPE_MISMATCH",
  );
});

test("non-image uploads are rejected", async () => {
  await assert.rejects(
    sanitizeImageUpload({
      bytes: Buffer.from("not an image", "utf8"),
      mimeType: "image/png",
    }),
    (error) =>
      error instanceof MediaValidationError && error.code === "IMAGE_DECODE_FAILED",
  );
});

test("evidence accepts bounded PDF content and routes images through sanitization", async () => {
  const pdf = Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n", "ascii");
  const pdfResult = await sanitizeEvidenceUpload({
    bytes: pdf,
    mimeType: "application/pdf",
    filename: "uploaded-coa.pdf",
  });
  assert.equal(pdfResult.kind, "pdf");
  assert.equal(pdfResult.filename, "evidence.pdf");
  assert.match(pdfResult.checksum, /^[a-f0-9]{64}$/);
  assert.deepEqual(pdfResult.bytes, pdf);

  const image = await sharp({
    create: {
      width: 3,
      height: 3,
      channels: 3,
      background: "#abcdef",
    },
  })
    .webp()
    .toBuffer();
  const imageResult = await sanitizeEvidenceUpload({
    bytes: image,
    mimeType: "image/webp",
    filename: "uploaded-coa.webp",
  });
  assert.equal(imageResult.contentType, "image/jpeg");
  assert.equal(imageResult.filename, "evidence-image.jpg");
});
