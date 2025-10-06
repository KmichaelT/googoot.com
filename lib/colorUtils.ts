/**
 * Color utility functions for determining lightness/darkness and contrast
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);

  return { r, g, b };
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  // Convert to 0-1 range
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Determine if a color is light or dark
 * @param hex - Hex color string
 * @param threshold - Luminance threshold (0-1), default 0.5
 * @returns true if light, false if dark
 */
export function isLightColor(hex: string, threshold: number = 0.5): boolean {
  const luminance = getRelativeLuminance(hex);
  return luminance > threshold;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.0 formula
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine which logo version to use based on background color
 * @param backgroundColor - Hex color of the background
 * @returns 'black' or 'white' for the logo color
 */
export function getContrastingLogoColor(backgroundColor: string): 'black' | 'white' {
  // For light backgrounds, use black logo
  // For dark backgrounds, use white logo
  return isLightColor(backgroundColor, 0.4) ? 'black' : 'white';
}

/**
 * Check if contrast ratio meets WCAG AA standard (4.5:1)
 */
export function meetsContrastStandard(hex1: string, hex2: string, standard: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(hex1, hex2);
  const requiredRatio = standard === 'AA' ? 4.5 : 7;
  return ratio >= requiredRatio;
}

/**
 * Get a descriptive name for the color's lightness level
 */
export function getColorLightnessDescription(hex: string): string {
  const luminance = getRelativeLuminance(hex);

  if (luminance > 0.9) return 'very light';
  if (luminance > 0.7) return 'light';
  if (luminance > 0.5) return 'medium-light';
  if (luminance > 0.3) return 'medium';
  if (luminance > 0.15) return 'medium-dark';
  if (luminance > 0.05) return 'dark';
  return 'very dark';
}

