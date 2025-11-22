import sharp from 'sharp';
import {
  buildProductImagePath,
  convertBufferToWebP,
  extractMediaPathFromPublicUrl
} from '../lib/media';

describe('media utilities', () => {
  it('converts a buffer into webp format', async () => {
    const sourceBuffer = await sharp({
      create: {
        width: 2,
        height: 2,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    })
      .png()
      .toBuffer();

    const result = await convertBufferToWebP(sourceBuffer);
    const metadata = await sharp(result).metadata();

    expect(metadata.format).toBe('webp');
  });

  it('buildProductImagePath generates a webp path in the products folder', () => {
    const path = buildProductImagePath();
    expect(path.startsWith('products/')).toBe(true);
    expect(path.endsWith('.webp')).toBe(true);
  });

  it('extractMediaPathFromPublicUrl returns relative storage path', () => {
    const url =
      'https://example.supabase.co/storage/v1/object/public/media/products/sample.webp';
    expect(extractMediaPathFromPublicUrl(url)).toBe('products/sample.webp');
  });
});
