/**
 * Cloudflare R2 Storage (S3-compatible) — Priority 4
 *
 * Handles file uploads to R2 and presigned URL generation.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Lazy-initialized S3 client — avoids crash at Next.js build time
let _s3Client: S3Client | null = null;
function getS3Client(): S3Client {
  if (!_s3Client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error("Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY env vars");
    }
    _s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _s3Client;
}

function getBucket(): string {
  return process.env.R2_BUCKET ?? "jet2pay-docs";
}

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Sanitize a filename: strip non-alphanumeric except dots and hyphens.
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9.\-]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 200);
}

/**
 * Validate file before upload.
 */
export function validateFile(
  mimeType: string,
  size: number
): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `File type '${mimeType}' not allowed. Accepted: PDF, JPG, PNG, WebP.`,
    };
  }
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size ${(size / 1024 / 1024).toFixed(1)}MB exceeds maximum of 10MB.`,
    };
  }
  return { valid: true };
}

/**
 * Upload a file to R2.
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  mimeType: string
): Promise<void> {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: body,
      ContentType: mimeType,
    })
  );
}

/**
 * Generate a presigned GET URL for an R2 object (1 hour TTL).
 */
export async function getPresignedUrl(
  key: string,
  expiresInSeconds = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: expiresInSeconds });
}
