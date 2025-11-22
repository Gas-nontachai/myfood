export const MEDIA_BUCKET = 'media';
export const MEDIA_PRODUCT_FOLDER = 'products';

export const MAX_PRODUCT_IMAGE_SIZE_MB = 5;
export const MAX_PRODUCT_IMAGE_SIZE_BYTES = MAX_PRODUCT_IMAGE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_PRODUCT_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jpg',
  'image/heic',
  'image/heif'
] as const;

export const PRODUCT_IMAGE_ACCEPT_ATTR = ACCEPTED_PRODUCT_IMAGE_MIME_TYPES.join(',');
