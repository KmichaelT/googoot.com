import { BrandData } from "@/components/BrandForm";
import { getContrastingLogoColor } from "./colorUtils";

export interface MockupType {
  id: string;
  name: string;
  logoType: 'icon' | 'logo';  // Changed to specify icon vs full logo
  logoColorType: 'fullColor' | 'flat' | 'smart';  // How to determine color
  colorApplication?: 'primary' | 'any';  // 'primary' uses primary color, 'any' uses first available
  description: string;
}

export const MOCKUP_TYPES: MockupType[] = [
  {
    id: 'mockup1',
    name: 'Baseball Cap',
    logoType: 'icon',  // Use icon for baseball cap
    logoColorType: 'fullColor',  // Use full color icon
    colorApplication: 'primary',
    description: 'Embroidered icon on cap'
  },
  {
    id: 'mockup2',
    name: 'Water Bottle',
    logoType: 'logo',  // Use full logo for bottle
    logoColorType: 'smart',  // Smart contrast based on bottle color
    colorApplication: 'primary',
    description: 'Screen-printed logo on bottle'
  },
  {
    id: 'mockup3',
    name: 'Business Card',
    logoType: 'logo',  // Use full logo for business card
    logoColorType: 'fullColor',  // Use full color logo
    colorApplication: 'primary',  // Primary color for background behind hand
    description: 'Full color logo on white business card'
  },
  {
    id: 'mockup4',
    name: 'iPhone App Icon',
    logoType: 'icon',  // Use icon for app
    logoColorType: 'smart',  // Smart contrast based on primary color
    colorApplication: 'primary',
    description: 'Icon on colored app background'
  }
];

export function getLogoForMockup(mockupId: string, brandData: BrandData): string | null {
  const mockup = MOCKUP_TYPES.find(m => m.id === mockupId);
  if (!mockup) return null;

  // If we have processed logos, use them preferentially
  if (brandData.processedLogos) {
    switch (mockupId) {
      case 'mockup1': // Baseball cap - full color icon
        return brandData.processedLogos.fullIconWhiteBg;

      case 'mockup2': // Water bottle - smart contrast logo
        if (mockup.colorApplication) {
          const bgColor = getColorForMockup(mockupId, brandData);
          if (bgColor) {
            // Debug the color contrast detection

            const logoColor = getContrastingLogoColor(bgColor);

            // If background is light, use black logo (on white background PNG)
            // If background is dark, use white logo (on black background PNG)
            return logoColor === 'black'
              ? brandData.processedLogos.flatLogoWhiteBg  // Black logo on white PNG
              : brandData.processedLogos.flatLogoBlackBg; // White logo on black PNG
          }
        }
        return brandData.processedLogos.flatLogoWhiteBg;

      case 'mockup3': // Business card - full color logo
        return brandData.processedLogos.fullLogoWhiteBg;

      case 'mockup4': // iPhone app - smart contrast icon
        if (mockup.colorApplication) {
          const bgColor = getColorForMockup(mockupId, brandData);
          if (bgColor) {
            const logoColor = getContrastingLogoColor(bgColor);

            // If background is light, use black icon (on white background PNG)
            // If background is dark, use white icon (on black background PNG)
            return logoColor === 'black'
              ? brandData.processedLogos.flatIconWhiteBg  // Black icon on white PNG
              : brandData.processedLogos.flatIconBlackBg; // White icon on black PNG
          }
        }
        return brandData.processedLogos.flatIconWhiteBg;

      default:
        return brandData.logos.fullColorLogo;
    }
  }

  // Fallback to original logos if no processed versions
  if (mockup.logoType === 'icon') {
    return brandData.logos.fullColorIcon || brandData.logos.fullColorLogo;
  } else {
    return brandData.logos.fullColorLogo || brandData.logos.flatColorLogo;
  }
}

export function getColorForMockup(mockupId: string, brandData: BrandData): string | null {
  const mockup = MOCKUP_TYPES.find(m => m.id === mockupId);
  if (!mockup || !mockup.colorApplication || !brandData.colors || brandData.colors.length === 0) return null;

  if (mockup.colorApplication === 'primary') {
    const primaryColor = brandData.colors.find(c => c.isPrimary);
    return primaryColor?.hex || brandData.colors[0]?.hex || null;
  }

  // For 'any', return the first available color
  return brandData.colors[0]?.hex || null;
}

// Import detailed mockup specifications
const DETAILED_MOCKUP_SPECS = {
  mockup1: {
    subject: "Baseball cap",
    structure: "6-panel construction with cotton twill or canvas material, visible crown seams, curved brim with subtle horizontal stitch lines",
    logo: "embroidered on front center panel with white thread. CRITICAL: Reproduce the provided logo design exactly without any modifications to text, shapes, or proportions. Maintain perfect clarity and original design integrity",
    environment: "dark gray asphalt surface with visible texture and small aggregate stones, dramatic shadows under the hat",
    camera: "very low angle, near ground level, hat prominent in frame",
    lighting: "natural daylight with high contrast between hat and pavement",
    style: "professional photography, minimalist urban, sharp focus, background monochrome with deep blacks and grays"
  },
  mockup2: {
    subject: "Premium aluminum water bottle (20-24 oz, cylindrical, smooth matte powder coat finish)",
    logo: "screen-printed or laser-etched, centered vertically and horizontally on visible side. CRITICAL: PRESERVE ORIGINAL DESIGN EXACTLY - no modifications to text, letterforms, shapes, or proportions. The logo must appear exactly as provided without any AI interpretation or stylistic changes. Maintain perfect fidelity to the source design",
    hardware: "black plastic or rubber cap with integrated carry loop, silver metal carabiner attached",
    pose: "positioned at 45-degree angle, leaning naturally between rocks",
    environment: "black volcanic or basalt rocks with rough weathered texture, stratification, cracks, and mineral veining",
    camera: "eye level with slight upward angle, 50-85mm equivalent focal length, bottle occupies ~40% of frame, f/5.6 aperture, shallow depth of field",
    lighting: "soft diffused daylight from upper left, even illumination on bottle and logo, subtle rock shadows, gentle rim light on rock edges",
    background: "clean minimalist smooth gradient from light blue-gray to darker gray with slight corner vignetting",
    style: "commercial product photography with high contrast, crisp clean logo edges"
  },
  mockup3: {
    subject: "Hand holding premium business card",
    hand: "fair skin tone entering from left side, holding card between thumb and middle finger, natural skin textures visible",
    card: "white matte stock with rounded corners",
    logo: "flat printed on card surface. CRITICAL: Display the provided logo exactly as designed without any modifications, embossing, or debossing effects. Use flat printing for perfect reproduction of original design",
    camera: "straight-on position, 85mm lens, f/2.8 aperture, sharp focus on hand and card",
    lighting: "soft directional studio light from upper right with gentle shadows emphasizing edges",
    style: "minimalist high-resolution product shot with professional high contrast",
    aspectRatio: "4:5"
  },
  mockup4: {
    subject: "Extreme close-up macro shot of iPhone Dynamic Island area with app icon display",
    aspectRatio: "16:9 horizontal format",
    framing: "TIGHT CROP: Frame showing ONLY the top 40% of iPhone screen - from the very top edge down to just below the first row of app icons. The bottom 60% of the phone must be completely cropped out of frame. ",
    device: "iPhone 15 Pro in Space Black, perfectly vertical orientation, fills 80% of frame width",
    screen: "Active iPhone screen with iOS home screen wallpaper: subtle gradient from light gray (#E5E5E7) at top to soft blue-gray (#D1D5DB) towards bottom of visible area",
    statusBar: "Top status bar clearly visible: Time '16:00' (white text, left), signal bars (3/4 full, white), WiFi icon (full strength, white), battery (90%, white). All elements sharp and legible",
    dynamicIsland: "Prominent black pill-shaped Dynamic Island cutout at top center, clearly defined against screen, housing front camera and sensors",
    appIcon: "Single app icon positioned in top-left of first app row, displaying the provided brand logo with iOS rounded corners and proper icon sizing. CRITICAL: Reproduce the provided logo design exactly without any modifications to elements, text, or proportions within the app icon format. Icon must be clearly visible and properly proportioned",
    background: "Solid color using the exact provided primary brand color behind the iPhone device, no gradients or patterns, perfectly even lighting across background",
    lighting: "Even studio lighting with no harsh shadows, soft fill light prevents any dark areas, screen appears bright and clearly readable",
    camera: "Macro lens perspective, 85mm equivalent, f/8 aperture for maximum sharpness, straight-on frontal angle with no tilt, focus plane perfectly aligned with screen surface",
    composition: "iPhone positioned dead center horizontally, tight vertical crop showing only top section from edge to first app row, no visible phone body below screen area",
    postProcessing: "Ultra-sharp detail on all text and UI elements, accurate color reproduction, no lens distortion, clean edges on Dynamic Island and app icon",
    criticalRequirements: "MUST show only top 40% of iPhone screen, Dynamic Island must be prominent and sharp, app icon must be clearly visible in top-left position, background color behind the iPhone device must match provided primary brand color exactly, no part of phone below first app row should be visible"
  }
};

// Helper function to convert hex color to descriptive name
function hexToColorName(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '').toLowerCase();

  // Convert to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Define color ranges for better AI understanding
  const colors = [
    { name: 'warm yellow', r: [240, 255], g: [190, 255], b: [0, 100] },
    { name: 'bright orange', r: [230, 255], g: [100, 180], b: [0, 50] },
    { name: 'vibrant red', r: [200, 255], g: [0, 80], b: [0, 80] },
    { name: 'deep blue', r: [0, 100], g: [0, 150], b: [150, 255] },
    { name: 'royal blue', r: [0, 80], g: [80, 150], b: [200, 255] },
    { name: 'forest green', r: [0, 100], g: [100, 200], b: [0, 100] },
    { name: 'emerald green', r: [0, 150], g: [150, 255], b: [100, 200] },
    { name: 'deep purple', r: [100, 200], g: [0, 100], b: [150, 255] },
    { name: 'soft pink', r: [200, 255], g: [150, 220], b: [150, 220] },
    { name: 'teal blue', r: [0, 100], g: [150, 220], b: [150, 220] },
    { name: 'warm brown', r: [100, 180], g: [50, 120], b: [0, 80] },
    { name: 'charcoal gray', r: [40, 100], g: [40, 100], b: [40, 100] },
    { name: 'silver gray', r: [150, 200], g: [150, 200], b: [150, 200] },
    { name: 'jet black', r: [0, 50], g: [0, 50], b: [0, 50] },
    { name: 'cream white', r: [240, 255], g: [240, 255], b: [220, 255] }
  ];

  // Find closest matching color
  for (const color of colors) {
    if (r >= color.r[0] && r <= color.r[1] &&
        g >= color.g[0] && g <= color.g[1] &&
        b >= color.b[0] && b <= color.b[1]) {
      return color.name;
    }
  }

  // Fallback to hex with descriptive context
  return `custom color (${hex})`;
}

export function generateMockupPrompt(mockupId: string, brandData: BrandData): string {
  const mockup = MOCKUP_TYPES.find(m => m.id === mockupId);
  const detailedSpec = DETAILED_MOCKUP_SPECS[mockupId as keyof typeof DETAILED_MOCKUP_SPECS];

  if (!mockup || !detailedSpec) return '';

  const brandColor = getColorForMockup(mockupId, brandData);
  const colorName = brandColor ? hexToColorName(brandColor) : null;

  let prompt = `Create a professional product mockup: ${detailedSpec.subject}`;

  // Add brand context
  prompt += ` for ${brandData.name}, a ${brandData.industry} company with ${brandData.personality} personality.`;

  // Apply brand color with descriptive names
  if (colorName) {
    if (mockupId === 'mockup1') {
      prompt += ` Use ${colorName} as the cap color. Apply the provided icon logo with embroidery effect.`;
    } else if (mockupId === 'mockup2') {
      const logoColor = brandColor ? getContrastingLogoColor(brandColor) : 'black';
      prompt += ` Use ${colorName} as the bottle color. Apply the provided logo with clean screen-printing - the logo should appear as ${logoColor} color for maximum contrast against the ${colorName} bottle.`;
    } else if (mockupId === 'mockup3') {
      prompt += ` The business card should be white. Use ${colorName} as the background color behind the hand holding the card. Apply the provided full color logo on the white card.`;
    } else if (mockupId === 'mockup4') {
      const iconColor = brandColor ? getContrastingLogoColor(brandColor) : 'white';
      prompt += ` Use ${colorName} as the background color behind the iPhone device. The iPhone should float against this ${colorName} background. Apply the provided icon to the app icon position - the icon should appear as ${iconColor} color for maximum contrast.`;
    }
  }

  // Add detailed specifications
  if ('structure' in detailedSpec) prompt += ` Structure: ${detailedSpec.structure}.`;
  if ('logo' in detailedSpec) prompt += ` Logo application: ${detailedSpec.logo}.`;
  if ('hardware' in detailedSpec) prompt += ` Hardware: ${detailedSpec.hardware}.`;
  if ('hand' in detailedSpec) prompt += ` Hand details: ${detailedSpec.hand}.`;
  if ('card' in detailedSpec) prompt += ` Card: ${detailedSpec.card}.`;
  if ('device' in detailedSpec) prompt += ` Device: ${detailedSpec.device}.`;
  if ('screen' in detailedSpec) prompt += ` Screen: ${detailedSpec.screen}.`;
  if ('dock' in detailedSpec) prompt += ` Dock: ${detailedSpec.dock}.`;
  if ('charger' in detailedSpec) prompt += ` Charger: ${detailedSpec.charger}.`;
  if ('pose' in detailedSpec) prompt += ` Positioning: ${detailedSpec.pose}.`;
  if ('environment' in detailedSpec) prompt += ` Environment: ${detailedSpec.environment}.`;
  if ('camera' in detailedSpec) prompt += ` Camera: ${detailedSpec.camera}.`;
  if ('lighting' in detailedSpec) prompt += ` Lighting: ${detailedSpec.lighting}.`;
  if ('background' in detailedSpec) prompt += ` Background: ${detailedSpec.background}.`;
  if ('style' in detailedSpec) prompt += ` Style: ${detailedSpec.style}.`;
  if ('aspectRatio' in detailedSpec) prompt += ` Aspect ratio: ${detailedSpec.aspectRatio}.`;

  // iPhone-specific specifications
  if ('framing' in detailedSpec) prompt += ` Framing: ${detailedSpec.framing}.`;
  if ('statusBar' in detailedSpec) prompt += ` Status Bar: ${detailedSpec.statusBar}.`;
  if ('dynamicIsland' in detailedSpec) prompt += ` Dynamic Island: ${detailedSpec.dynamicIsland}.`;
  if ('appIcon' in detailedSpec) prompt += ` App Icon: ${detailedSpec.appIcon}.`;
  if ('composition' in detailedSpec) prompt += ` Composition: ${detailedSpec.composition}.`;
  if ('postProcessing' in detailedSpec) prompt += ` Post-Processing: ${detailedSpec.postProcessing}.`;
  if ('criticalRequirements' in detailedSpec) prompt += ` Critical Requirements: ${detailedSpec.criticalRequirements}.`;

  // Add logo instruction
  prompt += ` Apply the provided ${mockup.logoType} logo version to the mockup.`;

  return prompt;
}