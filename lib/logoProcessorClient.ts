/**
 * Client-side logo processing for immediate updates
 * This handles SVG color modifications for the Bento grid display
 */

/**
 * Change all fill colors in SVG to a specific color (client-side)
 */
export function changeSvgFillColorClient(svgString: string, newColor: string): string {
  // Create a temporary div to manipulate the SVG
  const div = document.createElement('div');
  div.innerHTML = svgString;

  // Find all elements with fill attribute
  const elements = div.querySelectorAll('[fill]');
  elements.forEach(element => {
    const currentFill = element.getAttribute('fill');
    if (currentFill && currentFill !== 'none' && currentFill !== 'transparent') {
      element.setAttribute('fill', newColor);
    }
  });

  // Find all style attributes containing fill
  const styledElements = div.querySelectorAll('[style*="fill"]');
  styledElements.forEach(element => {
    const style = element.getAttribute('style') || '';
    const newStyle = style.replace(/fill:\s*[^;}"]+/g, `fill: ${newColor}`);
    element.setAttribute('style', newStyle);
  });

  // Add fill to paths without fill attribute
  const paths = div.querySelectorAll('path:not([fill]), circle:not([fill]), rect:not([fill]), ellipse:not([fill]), polygon:not([fill])');
  paths.forEach(element => {
    element.setAttribute('fill', newColor);
  });

  return div.innerHTML;
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