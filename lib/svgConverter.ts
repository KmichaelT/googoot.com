/**
 * Server-side SVG to PNG conversion using Sharp
 */

import sharp from 'sharp';

/**
 * Convert SVG base64 string to PNG base64 string
 * @param svgBase64 - Base64 encoded SVG string (with or without data: prefix)
 * @param width - Output width in pixels (default: 1024)
 * @param height - Output height in pixels (default: 1024)
 * @returns Promise<string> - Base64 encoded PNG with data: prefix
 */
export async function convertSvgToPng(
  svgBase64: string,
  width: number = 1024,
  height: number = 1024
): Promise<string> {
  try {
    // Extract the SVG data from base64
    const svgData = svgBase64.startsWith('data:')
      ? svgBase64.split(',')[1]
      : svgBase64;

    // Decode base64 to SVG buffer
    const svgBuffer = Buffer.from(svgData, 'base64');

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(svgBuffer)
      .resize(width, height, {
        fit: 'inside',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      })
      .png({
        quality: 90,
        compressionLevel: 6
      })
      .toBuffer();

    // Convert to base64 with data: prefix
    const pngBase64 = pngBuffer.toString('base64');
    return `data:image/png;base64,${pngBase64}`;

  } catch (error) {
    throw new Error(`Failed to convert SVG to PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a base64 string is an SVG
 */
export function isSvgBase64(base64String: string): boolean {
  return base64String.startsWith('data:image/svg+xml') ||
         (base64String.includes('svg') && base64String.includes('<svg'));
}

/**
 * Get the MIME type from a base64 data URL
 */
export function getMimeTypeFromBase64(base64String: string): string {
  if (base64String.startsWith('data:')) {
    const match = base64String.match(/data:([^;]+)/);
    return match ? match[1] : 'application/octet-stream';
  }
  return 'application/octet-stream';
}