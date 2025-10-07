/**
 * Client-side logo processing for immediate updates
 * This handles SVG color modifications for the Bento grid display
 */

/**
 * Change all fill colors in SVG to a specific color (client-side)
 */
export function changeSvgFillColorClient(svgString: string, newColor: string): string {
  let modifiedSvg = svgString;

  // Remove all gradient definitions and replace them with solid color
  modifiedSvg = modifiedSvg.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  modifiedSvg = modifiedSvg.replace(/<linearGradient[\s\S]*?<\/linearGradient>/g, '');
  modifiedSvg = modifiedSvg.replace(/<radialGradient[\s\S]*?<\/radialGradient>/g, '');

  // Replace all fill attributes (including gradient references)
  modifiedSvg = modifiedSvg.replace(
    /fill="(?!none|transparent)([^"]*)"/g,
    `fill="${newColor}"`
  );

  // Replace fill in style attributes
  modifiedSvg = modifiedSvg.replace(
    /fill:\s*[^;}"]+/g,
    `fill: ${newColor}`
  );

  // Replace any CSS classes that might have fill
  modifiedSvg = modifiedSvg.replace(
    /\.([\w-]+)\s*\{\s*fill:[^}]+\}/g,
    `.$1 { fill: ${newColor}; }`
  );

  // Add fill to elements that don't have it
  const fillableElements = ['path', 'circle', 'rect', 'ellipse', 'polygon', 'polyline'];
  fillableElements.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)(?!.*fill=)([^>]*?)>`, 'gi');
    modifiedSvg = modifiedSvg.replace(regex, `<${tag}$1 fill="${newColor}"$2>`);
  });

  return modifiedSvg;
}

/**
 * Convert base64 data URL to modified SVG with new color
 */
export function createColorVariantSvg(base64Svg: string, color: string): string {
  try {
    // Extract the base64 data
    const base64Data = base64Svg.split(',')[1] || base64Svg;

    // Decode base64 to SVG string
    const svgString = atob(base64Data);

    // Change fill color
    const modifiedSvg = changeSvgFillColorClient(svgString, color);

    // Re-encode to base64
    const encodedSvg = btoa(modifiedSvg);

    return `data:image/svg+xml;base64,${encodedSvg}`;
  } catch {
    return base64Svg; // Return original if processing fails
  }
}

/**
 * Process logos for immediate display (creates SVG variations only)
 */
export interface ProcessedLogosClient {
  blackIcon: string;  // Black version of icon (SVG)
  whiteIcon: string;  // White version of icon (SVG)
  blackLogo: string;  // Black version of logo (SVG)
  whiteLogo: string;  // White version of logo (SVG)
}

export function processLogosForDisplay(logos: {
  fullColor: string;
  icon: string;
  black?: string;
  white?: string;
}): ProcessedLogosClient {
  // Use provided black/white versions if available, otherwise create from fullColor
  const blackLogo = logos.black || createColorVariantSvg(logos.fullColor, '#000000');
  const whiteLogo = logos.white || createColorVariantSvg(logos.fullColor, '#ffffff');
  const blackIcon = createColorVariantSvg(logos.icon, '#000000');
  const whiteIcon = createColorVariantSvg(logos.icon, '#ffffff');

  return {
    blackIcon,
    whiteIcon,
    blackLogo,
    whiteLogo
  };
}