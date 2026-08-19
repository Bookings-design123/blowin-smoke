import { createHash } from "node:crypto";

import sharp from "sharp";

export const PRODUCT_IMAGE_LIMITS = Object.freeze({
  maxInputBytes: 12 * 1024 * 1024,
  maxOutputBytes: 12 * 1024 * 1024,
  maxWidth: 8_192,
  maxHeight: 8_192,
  maxPixels: 40_000_000,
});

export const EVIDENCE_LIMITS = Object.freeze({
  maxPdfBytes: 20 * 1024 * 1024,
});

const FORMAT_BY_CONTENT_TYPE = Object.freeze({
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
});

export class MediaValidationError extends Error {
  constructor(code) {
    super(code);
    this.name = "MediaValidationError";
    this.code = code;
  }
}

function bytesFromUpload(upload) {
  const source = upload?.bytes;

  if (Buffer.isBuffer(source)) {
    return Buffer.from(source);
  }

  if (source instanceof Uint8Array) {
    return Buffer.from(source);
  }

  throw new MediaValidationError("MEDIA_BYTES_REQUIRED");
}

function normalizedContentType(upload) {
  const value = upload?.contentType ?? upload?.mimeType;
  if (typeof value !== "string") {
    throw new MediaValidationError("MEDIA_CONTENT_TYPE_REQUIRED");
  }

  return value.split(";", 1)[0].trim().toLowerCase();
}

function checksum(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function validatePositiveLimit(value, fallback) {
  return Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

function normalizedImageLimits(overrides = {}) {
  return Object.freeze({
    maxInputBytes: validatePositiveLimit(
      overrides.maxInputBytes,
      PRODUCT_IMAGE_LIMITS.maxInputBytes,
    ),
    maxOutputBytes: validatePositiveLimit(
      overrides.maxOutputBytes,
      PRODUCT_IMAGE_LIMITS.maxOutputBytes,
    ),
    maxWidth: validatePositiveLimit(overrides.maxWidth, PRODUCT_IMAGE_LIMITS.maxWidth),
    maxHeight: validatePositiveLimit(
      overrides.maxHeight,
      PRODUCT_IMAGE_LIMITS.maxHeight,
    ),
    maxPixels: validatePositiveLimit(
      overrides.maxPixels,
      PRODUCT_IMAGE_LIMITS.maxPixels,
    ),
  });
}

function assertDecodedImage(metadata, expectedFormat, limits) {
  if (!metadata || metadata.format !== expectedFormat) {
    throw new MediaValidationError("IMAGE_CONTENT_TYPE_MISMATCH");
  }

  if (
    !Number.isSafeInteger(metadata.width) ||
    !Number.isSafeInteger(metadata.height) ||
    metadata.width < 1 ||
    metadata.height < 1
  ) {
    throw new MediaValidationError("IMAGE_DIMENSIONS_INVALID");
  }

  if (
    metadata.width > limits.maxWidth ||
    metadata.height > limits.maxHeight ||
    metadata.width * metadata.height > limits.maxPixels
  ) {
    throw new MediaValidationError("IMAGE_DIMENSIONS_EXCEEDED");
  }

  if (Number.isSafeInteger(metadata.pages) && metadata.pages > 1) {
    throw new MediaValidationError("ANIMATED_IMAGE_NOT_ALLOWED");
  }
}

function isSharpFailure(error) {
  return error instanceof Error && error.name !== "MediaValidationError";
}

/**
 * Decodes an asserted JPEG, PNG, or WebP and emits a fresh JPEG. Sharp does not
 * preserve EXIF, XMP, IPTC, ICC, comments, GPS, or other source metadata unless
 * withMetadata/keepMetadata is explicitly requested; neither is used here.
 */
export async function sanitizeProductImage(upload, options = {}) {
  const limits = normalizedImageLimits(options);
  const bytes = bytesFromUpload(upload);
  const contentType = normalizedContentType(upload);
  const expectedFormat = FORMAT_BY_CONTENT_TYPE[contentType];

  if (!expectedFormat) {
    throw new MediaValidationError("IMAGE_CONTENT_TYPE_NOT_ALLOWED");
  }

  if (bytes.length < 1 || bytes.length > limits.maxInputBytes) {
    throw new MediaValidationError("IMAGE_INPUT_SIZE_INVALID");
  }

  try {
    const decodeOptions = Object.freeze({
      failOn: "error",
      limitInputPixels: limits.maxPixels,
      sequentialRead: true,
    });
    const metadata = await sharp(bytes, decodeOptions).metadata();
    assertDecodedImage(metadata, expectedFormat, limits);

    const result = await sharp(bytes, decodeOptions)
      .rotate()
      .flatten({ background: "#ffffff" })
      .toColourspace("srgb")
      .jpeg({ quality: 88, progressive: true, chromaSubsampling: "4:4:4" })
      .toBuffer({ resolveWithObject: true });

    if (result.data.length < 1 || result.data.length > limits.maxOutputBytes) {
      throw new MediaValidationError("IMAGE_OUTPUT_SIZE_INVALID");
    }

    const sanitizedMetadata = await sharp(result.data, {
      failOn: "error",
      limitInputPixels: limits.maxPixels,
    }).metadata();

    if (
      sanitizedMetadata.format !== "jpeg" ||
      sanitizedMetadata.exif !== undefined ||
      sanitizedMetadata.icc !== undefined ||
      sanitizedMetadata.xmp !== undefined ||
      sanitizedMetadata.iptc !== undefined
    ) {
      throw new MediaValidationError("IMAGE_SANITIZATION_FAILED");
    }

    return Object.freeze({
      kind: "image",
      bytes: result.data,
      contentType: "image/jpeg",
      filename: "product-image.jpg",
      extension: "jpg",
      width: result.info.width,
      height: result.info.height,
      byteLength: result.data.length,
      checksum: checksum(result.data),
    });
  } catch (error) {
    if (error instanceof MediaValidationError) {
      throw error;
    }

    if (isSharpFailure(error)) {
      throw new MediaValidationError("IMAGE_DECODE_FAILED");
    }

    throw error;
  }
}

function validatePdf(upload, options = {}) {
  const bytes = bytesFromUpload(upload);
  const maxPdfBytes = validatePositiveLimit(
    options.maxPdfBytes,
    EVIDENCE_LIMITS.maxPdfBytes,
  );

  if (bytes.length < 8 || bytes.length > maxPdfBytes) {
    throw new MediaValidationError("PDF_SIZE_INVALID");
  }

  if (!bytes.subarray(0, 5).equals(Buffer.from("%PDF-", "ascii"))) {
    throw new MediaValidationError("PDF_SIGNATURE_INVALID");
  }

  const trailerWindow = bytes.subarray(Math.max(0, bytes.length - 2_048));
  if (!trailerWindow.includes(Buffer.from("%%EOF", "ascii"))) {
    throw new MediaValidationError("PDF_TRAILER_INVALID");
  }

  return Object.freeze({
    kind: "pdf",
    bytes,
    contentType: "application/pdf",
    filename: "evidence.pdf",
    extension: "pdf",
    byteLength: bytes.length,
    checksum: checksum(bytes),
  });
}

export async function validateEvidenceUpload(upload, options = {}) {
  const contentType = normalizedContentType(upload);

  if (contentType === "application/pdf") {
    return validatePdf(upload, options);
  }

  if (Object.hasOwn(FORMAT_BY_CONTENT_TYPE, contentType)) {
    return sanitizeProductImage(upload, options);
  }

  throw new MediaValidationError("EVIDENCE_CONTENT_TYPE_NOT_ALLOWED");
}

export async function sanitizeImageUpload(upload, options = {}) {
  return sanitizeProductImage(upload, options);
}

export async function sanitizeEvidenceUpload(upload, options = {}) {
  const result = await validateEvidenceUpload(upload, options);
  if (result.kind !== "image") {
    return result;
  }

  return Object.freeze({ ...result, filename: "evidence-image.jpg" });
}
