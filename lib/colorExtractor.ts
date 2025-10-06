/**
 * Color extraction utility for extracting colors from SVG logos
 */

/**
 * Extract unique colors from SVG string
 */
export function extractColorsFromSvg(svgString: string): string[] {
  try {
    // Create a temporary div to parse SVG
    const div = document.createElement('div');
    div.innerHTML = svgString;

    const colors = new Set<string>();

    // Extract colors from fill attributes
    const elementsWithFill = div.querySelectorAll('[fill]');
    elementsWithFill.forEach(element => {
      const fill = element.getAttribute('fill');
      if (fill && fill !== 'none' && fill !== 'transparent' && !fill.startsWith('url(')) {
        colors.add(normalizeColor(fill));
      }
    });

    // Extract colors from style attributes
    const elementsWithStyle = div.querySelectorAll('[style*="fill"]');
    elementsWithStyle.forEach(element => {
      const style = element.getAttribute('style') || '';
      const fillMatches = style.match(/fill:\s*([^;}\"]+)/g);
      if (fillMatches) {
        fillMatches.forEach(match => {
          const color = match.replace('fill:', '').trim();
          if (color && color !== 'none' && color !== 'transparent' && !color.startsWith('url(')) {
            colors.add(normalizeColor(color));
          }
        });
      }
    });

    // Extract colors from CSS style blocks
    const styleElements = div.querySelectorAll('style');
    styleElements.forEach(styleElement => {
      const cssText = styleElement.textContent || '';
      extractColorsFromCSS(cssText, colors);
    });

    // Extract colors from stop-color in gradients
    const stopElements = div.querySelectorAll('stop[stop-color]');
    stopElements.forEach(element => {
      const stopColor = element.getAttribute('stop-color');
      if (stopColor && stopColor !== 'none' && stopColor !== 'transparent') {
        colors.add(normalizeColor(stopColor));
      }
    });

    // Convert to array and filter out invalid colors
    return Array.from(colors).filter(color => isValidColor(color));
  } catch {
    return [];
  }
}

/**
 * Extract colors from CSS text
 */
function extractColorsFromCSS(cssText: string, colors: Set<string>): void {
  // Match fill properties in CSS
  const fillMatches = cssText.match(/fill\s*:\s*([^;}]+)/g);
  if (fillMatches) {
    fillMatches.forEach(match => {
      const color = match.replace(/fill\s*:\s*/, '').trim();
      if (color && color !== 'none' && color !== 'transparent' && !color.startsWith('url(')) {
        colors.add(normalizeColor(color));
      }
    });
  }

  // Match stop-color properties in CSS
  const stopColorMatches = cssText.match(/stop-color\s*:\s*([^;}]+)/g);
  if (stopColorMatches) {
    stopColorMatches.forEach(match => {
      const color = match.replace(/stop-color\s*:\s*/, '').trim();
      if (color && color !== 'none' && color !== 'transparent') {
        colors.add(normalizeColor(color));
      }
    });
  }

  // Match hex colors directly in CSS
  const hexMatches = cssText.match(/#[0-9a-fA-F]{3,6}/g);
  if (hexMatches) {
    hexMatches.forEach(hex => {
      colors.add(normalizeColor(hex));
    });
  }
}

/**
 * Normalize color format to hex
 */
function normalizeColor(color: string): string {
  color = color.trim();

  // If already hex, return as is
  if (color.startsWith('#')) {
    return color.toUpperCase();
  }

  // Convert rgb() to hex
  const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  }

  // Convert named colors to hex (basic set)
  const namedColors: { [key: string]: string } = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'green': '#008000',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'gray': '#808080',
    'grey': '#808080'
  };

  const lowerColor = color.toLowerCase();
  if (namedColors[lowerColor]) {
    return namedColors[lowerColor];
  }

  return color;
}

/**
 * Check if color is valid hex format
 */
function isValidColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Extract colors from base64 SVG data URL
 */
export function extractColorsFromBase64Svg(base64Svg: string): string[] {
  try {
    // Extract the base64 data
    const base64Data = base64Svg.split(',')[1] || base64Svg;

    // Decode base64 to SVG string
    const svgString = atob(base64Data);

    return extractColorsFromSvg(svgString);
  } catch {
    return [];
  }
}

/**
 * Generate default color names
 */
export function generateColorName(index: number): string {
  const names = ['Color1', 'Color2', 'Color3', 'Color4', 'Color5', 'Color6', 'Color7', 'Color8'];
  return names[index] || `Color${index + 1}`;
}

/**
 * Sort colors by brightness (darkest first)
 */
export function sortColorsByBrightness(colors: string[]): string[] {
  return colors.sort((a, b) => {
    const brightnessA = getColorBrightness(a);
    const brightnessB = getColorBrightness(b);
    return brightnessA - brightnessB;
  });
}

/**
 * Calculate color brightness (0-255)
 */
function getColorBrightness(hex: string): number {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}