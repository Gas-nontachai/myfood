import crypto from 'node:crypto';
import sharp from 'sharp';
import { createAdminClient } from './supabaseAdmin';
import {
  ACCEPTED_PRODUCT_IMAGE_MIME_TYPES,
  MAX_PRODUCT_IMAGE_SIZE_BYTES,
  MAX_PRODUCT_IMAGE_SIZE_MB,
  MEDIA_BUCKET,
  MEDIA_PRODUCT_FOLDER
} from './constants/media';

const STORAGE_PUBLIC_PREFIX = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

export async function convertBufferToWebP(buffer: Buffer, quality = 80) {
  if (!buffer || buffer.length === 0) {
    throw new Error('ไม่พบข้อมูลไฟล์สำหรับแปลงรูป');
  }

  return sharp(buffer)
    .rotate() // auto-orient images from mobile devices
    .webp({ quality, effort: 4 })
    .toBuffer();
}

export function buildProductImagePath() {
  return `${MEDIA_PRODUCT_FOLDER}/${crypto.randomUUID()}.webp`;
}

export function extractMediaPathFromPublicUrl(url?: string | null) {
  if (!url) return null;
  const index = url.indexOf(STORAGE_PUBLIC_PREFIX);
  if (index === -1) return null;
  const path = url.slice(index + STORAGE_PUBLIC_PREFIX.length);
  return decodeURIComponent(path);
}

type UploadResult = {
  publicUrl: string;
  path: string;
};

function assertFileIsImage(file: File) {
  if (typeof file?.arrayBuffer !== 'function' || typeof file.size !== 'number') {
    throw new Error('ชนิดไฟล์ไม่ถูกต้อง');
  }

  if (file.size === 0) {
    throw new Error('กรุณาเลือกรูปภาพ');
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    throw new Error(`รูปภาพต้องมีขนาดไม่เกิน ${MAX_PRODUCT_IMAGE_SIZE_MB}MB`);
  }

  if (file.type && !ACCEPTED_PRODUCT_IMAGE_MIME_TYPES.includes(file.type as typeof ACCEPTED_PRODUCT_IMAGE_MIME_TYPES[number])) {
    throw new Error('รองรับเฉพาะไฟล์ PNG, JPG, HEIC หรือ WebP เท่านั้น');
  }
}

export async function uploadProductImageFile(file: File): Promise<UploadResult> {
  assertFileIsImage(file);

  const buffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await convertBufferToWebP(buffer);
  const path = buildProductImagePath();

  const admin = createAdminClient();
  const storage = admin.storage.from(MEDIA_BUCKET);

  const { error: uploadError } = await storage.upload(path, webpBuffer, {
    contentType: 'image/webp',
    cacheControl: '3600',
    upsert: true
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = storage.getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error('ไม่สามารถสร้างลิงก์สำหรับรูปภาพได้');
  }

  return { publicUrl: data.publicUrl, path };
}

export async function deleteMediaAtPath(path?: string | null) {
  if (!path) return;
  const admin = createAdminClient();
  const { error } = await admin.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}
