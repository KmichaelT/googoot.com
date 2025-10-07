// Dynamic import for Sharp to work in serverless environment
let sharp: typeof import('sharp') | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  sharp = require('sharp');
} catch {
  // Sharp not available in this environment
}

export interface LogoInput {
  fullColorLogo: string;  // Base64 SVG
  flatColorLogo: string;  // Base64 SVG
  fullColorIcon: string;  // Base64 SVG
  flatColorIcon: string;  // Base64 SVG
}

export interface ProcessedLogos {
  // Main Logo Variations
  fullLogoWhiteBg: string;      // Full color logo on white background
  flatLogoWhiteBg: string;       // Black logo on white background
  flatLogoBlackBg: string;       // White logo on black background

  // Icon Variations
  fullIconWhiteBg: string;       // Full color icon on white background
  flatIconWhiteBg: string;       // Black icon on white background
  flatIconBlackBg: string;       // White icon on black background

  // Additional variations for future use
  fullLogoTransparent?: string;  // Original full color logo
  fullIconTransparent?: string;  // Original full color icon
}

export interface ProcessingOptions {
  outputSize?: number;           // Default: 2048
  paddingPercent?: number;        // Default: 20 (20% padding)
  logoSize?: number;              // Default: 2048 for logos (high resolution)
  iconSize?: number;              // Default: 1024 for icons (high resolution)
  dpi?: number;                  // Default: 300 for print quality
}

/**
 * Extract base64 data from data URL
 */
function extractBase64(dataUrl: string): string {
  if (dataUrl.includes(',')) {
    return dataUrl.split(',')[1];
  }
  return dataUrl;
}

/**
 * Add padding and background to SVG
 */
function addBackgroundToSvg(svgString: string, bgColor: string, paddingPercent: number = 20): string {
  // Remove XML declaration if present
  svgString = svgString.replace(/<\?xml[^?]*\?>/g, '');

  // Parse viewBox from SVG
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  let width = 100, height = 100;

  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(' ').map(Number);
    if (parts.length >= 4) {
      width = parts[2] || 100;
      height = parts[3] || 100;
    }
  } else {
    // Try to get width and height attributes
    const widthMatch = svgString.match(/width="([^"]+)"/);
    const heightMatch = svgString.match(/height="([^"]+)"/);
    if (widthMatch) width = parseFloat(widthMatch[1]);
    if (heightMatch) height = parseFloat(heightMatch[1]);
  }

  const padding = Math.max(width, height) * (paddingPercent / 100);
  const newWidth = width + (padding * 2);
  const newHeight = height + (padding * 2);

  // Extract the SVG content (everything inside the svg tags)
  const svgContent = svgString
    .replace(/<\?xml[^?]*\?>/g, '') // Remove XML declaration
    .replace(/<!DOCTYPE[^>]*>/g, '') // Remove DOCTYPE
    .replace(/<svg[^>]*>/, '') // Remove opening svg tag
    .replace(/<\/svg>/, ''); // Remove closing svg tag

  // Create new SVG with background
  const newSvg = `<svg width="${newWidth}" height="${newHeight}" viewBox="0 0 ${newWidth} ${newHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${newWidth}" height="${newHeight}" fill="${bgColor}"/>
    <g transform="translate(${padding}, ${padding})">
      ${svgContent}
    </g>
  </svg>`;

  return newSvg;
}

/**
 * Change all fill colors in SVG to a specific color, including gradients
 */
function changeSvgFillColor(svgString: string, newColor: string): string {
  // Remove XML declaration if present to avoid issues
  svgString = svgString.replace(/<\?xml[^?]*\?>/g, '');

  let modifiedSvg = svgString;

  // Remove all gradient definitions and replace them with solid color
  // This removes the entire <defs> section which contains gradients
  modifiedSvg = modifiedSvg.replace(/<defs>[\s\S]*?<\/defs>/g, '');

  // Replace all fill attributes (including gradient references) except for 'none' and 'transparent'
  modifiedSvg = modifiedSvg.replace(
    /fill="(?!none|transparent)([^"]*)"/g,
    `fill="${newColor}"`
  );

  // Replace fill in style attributes (including gradient references)
  modifiedSvg = modifiedSvg.replace(
    /fill:\s*(?!none|transparent)([^;}"]*)/g,
    `fill: ${newColor}`
  );

  // Replace class-based fills in CSS style blocks
  modifiedSvg = modifiedSvg.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/g,
    (match, cssContent) => {
      // Replace all fill properties in CSS classes
      const newCssContent = cssContent.replace(
        /fill:\s*(?!none|transparent)([^;}"]*)/g,
        `fill: ${newColor}`
      );
      return `<style>${newCssContent}</style>`;
    }
  );

  // Handle elements that use CSS classes for fills
  // Find all class names and replace their fill properties
  const classMatches = modifiedSvg.match(/class="([^"]+)"/g);
  if (classMatches) {
    classMatches.forEach(classAttr => {
      const className = classAttr.match(/class="([^"]+)"/)?.[1];
      if (className) {
        // Replace the class attribute with direct fill attribute
        const classSelector = new RegExp(`class="${className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        modifiedSvg = modifiedSvg.replace(classSelector, `fill="${newColor}"`);
      }
    });
  }

  // If no fill attribute exists, add it to path and shape elements
  const elementsNeedingFill = ['path', 'circle', 'rect', 'ellipse', 'polygon', 'polyline', 'text'];
  elementsNeedingFill.forEach(element => {
    const regex = new RegExp(`<${element}(?![^>]*fill=)([^>]*)>`, 'g');
    modifiedSvg = modifiedSvg.replace(regex, `<${element} fill="${newColor}"$1>`);
  });

  return modifiedSvg;
}

/**
 * Convert SVG to PNG using Sharp
 */
async function svgToPng(svgString: string, size: number = 2048, dpi: number = 300): Promise<Buffer> {
  if (!sharp) {
    throw new Error('Sharp is not available in this environment');
  }

  try {
    const buffer = Buffer.from(svgString);

    // Use higher density for better quality
    const density = Math.round(dpi * (size / 1000));

    return await sharp(buffer, {
      density: density  // Higher density for better quality SVG rendering
    })
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: sharp.kernel.lanczos3  // Better quality resizing
      })
      .png({
        quality: 100,
        compressionLevel: 6,  // Balance between file size and speed
        effort: 10  // Maximum effort for best quality
      })
      .toBuffer();
  } catch {
    throw new Error('Failed to convert SVG to PNG');
  }
}

/**
 * Convert buffer to base64 data URL
 */
function bufferToBase64DataUrl(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

/**
 * Process all logo variations
 */
export async function processLogoVariations(
  logos: LogoInput,
  options: ProcessingOptions = {}
): Promise<ProcessedLogos> {
  const {
    paddingPercent = 20,
    logoSize = 2048,  // High resolution for logos
    iconSize = 1024,  // High resolution for icons
    dpi = 300  // Print quality DPI
  } = options;

  try {
    // Decode base64 SVGs
    const fullLogoSvg = Buffer.from(extractBase64(logos.fullColorLogo), 'base64').toString();
    const flatLogoSvg = Buffer.from(extractBase64(logos.flatColorLogo), 'base64').toString();
    const fullIconSvg = Buffer.from(extractBase64(logos.fullColorIcon), 'base64').toString();
    const flatIconSvg = Buffer.from(extractBase64(logos.flatColorIcon), 'base64').toString();

    // Process Main Logo Variations
    // 1. Full color logo on white background
    const fullLogoWithWhiteBg = addBackgroundToSvg(fullLogoSvg, '#ffffff', paddingPercent);
    const fullLogoWhiteBgBuffer = await svgToPng(fullLogoWithWhiteBg, logoSize, dpi);

    // 2. Black logo on white background
    const blackLogo = changeSvgFillColor(flatLogoSvg, '#000000');
    const blackLogoWithWhiteBg = addBackgroundToSvg(blackLogo, '#ffffff', paddingPercent);
    const flatLogoWhiteBgBuffer = await svgToPng(blackLogoWithWhiteBg, logoSize, dpi);

    // 3. White logo on black background
    const whiteLogo = changeSvgFillColor(flatLogoSvg, '#ffffff');
    const whiteLogoWithBlackBg = addBackgroundToSvg(whiteLogo, '#000000', paddingPercent);
    const flatLogoBlackBgBuffer = await svgToPng(whiteLogoWithBlackBg, logoSize, dpi);

    // Process Icon Variations
    // 4. Full color icon on white background
    const fullIconWithWhiteBg = addBackgroundToSvg(fullIconSvg, '#ffffff', paddingPercent);
    const fullIconWhiteBgBuffer = await svgToPng(fullIconWithWhiteBg, iconSize, dpi);

    // 5. Black icon on white background
    const blackIcon = changeSvgFillColor(flatIconSvg, '#000000');
    const blackIconWithWhiteBg = addBackgroundToSvg(blackIcon, '#ffffff', paddingPercent);
    const flatIconWhiteBgBuffer = await svgToPng(blackIconWithWhiteBg, iconSize, dpi);

    // 6. White icon on black background
    const whiteIcon = changeSvgFillColor(flatIconSvg, '#ffffff');
    const whiteIconWithBlackBg = addBackgroundToSvg(whiteIcon, '#000000', paddingPercent);
    const flatIconBlackBgBuffer = await svgToPng(whiteIconWithBlackBg, iconSize, dpi);

    // Convert all buffers to base64 data URLs
    return {
      fullLogoWhiteBg: bufferToBase64DataUrl(fullLogoWhiteBgBuffer),
      flatLogoWhiteBg: bufferToBase64DataUrl(flatLogoWhiteBgBuffer),
      flatLogoBlackBg: bufferToBase64DataUrl(flatLogoBlackBgBuffer),
      fullIconWhiteBg: bufferToBase64DataUrl(fullIconWhiteBgBuffer),
      flatIconWhiteBg: bufferToBase64DataUrl(flatIconWhiteBgBuffer),
      flatIconBlackBg: bufferToBase64DataUrl(flatIconBlackBgBuffer),
      fullLogoTransparent: logos.fullColorLogo,
      fullIconTransparent: logos.fullColorIcon
    };

  } catch {
    throw new Error('Failed to process logo variations');
  }
}

/**
 * Download a base64 image
 */
export function downloadBase64Image(base64Data: string, filename: string): void {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Create a ZIP file of all logo variations (client-side)
 * Note: This requires a ZIP library like JSZip to be installed
 */
export async function createLogoZip(): Promise<Blob> {
  // This would require JSZip library
  // For now, we'll implement individual downloads
  throw new Error('ZIP creation not yet implemented. Use individual downloads.');
}