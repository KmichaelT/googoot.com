import { BrandData } from "@/components/BrandForm";

export interface MockupType {
  id: string;
  name: string;
  logoType: keyof BrandData['logos'];
  colorApplication?: keyof BrandData['colors'];
  description: string;
}

export const MOCKUP_TYPES: MockupType[] = [
  {
    id: 'mockup1',
    name: 'Baseball Cap',
    logoType: 'fullColor',
    colorApplication: 'primary',
    description: 'Embroidered logo on cap'
  },
  {
    id: 'mockup2',
    name: 'Water Bottle',
    logoType: 'black',
    colorApplication: 'primary',
    description: 'Screen-printed logo on bottle'
  },
  {
    id: 'mockup3',
    name: 'Business Card',
    logoType: 'black',
    description: 'Debossed logo on business card'
  },
  {
    id: 'mockup4',
    name: 'iPhone App Icon',
    logoType: 'icon',
    colorApplication: 'primary',
    description: 'App icon on iPhone home screen'
  }
];

export function getLogoForMockup(mockupId: string, brandData: BrandData): string | null {
  const mockup = MOCKUP_TYPES.find(m => m.id === mockupId);
  if (!mockup) return null;

  return brandData.logos[mockup.logoType] || null;
}

export function getColorForMockup(mockupId: string, brandData: BrandData): string | null {
  const mockup = MOCKUP_TYPES.find(m => m.id === mockupId);
  if (!mockup || !mockup.colorApplication) return null;

  return brandData.colors[mockup.colorApplication] || null;
}

// Import detailed mockup specifications
const DETAILED_MOCKUP_SPECS = {
  mockup1: {
    subject: "Baseball cap",
    structure: "6-panel construction with cotton twill or canvas material, visible crown seams, curved brim with subtle horizontal stitch lines",
    logo: "embroidered on front center panel with white thread, maintain proportions and clarity",
    environment: "dark gray asphalt surface with visible texture and small aggregate stones, dramatic shadows under the hat",
    camera: "very low angle, near ground level, hat prominent in frame",
    lighting: "natural daylight with high contrast between hat and pavement",
    style: "professional photography, minimalist urban, sharp focus, background monochrome with deep blacks and grays"
  },
  mockup2: {
    subject: "Premium aluminum water bottle (20-24 oz, cylindrical, smooth matte powder coat finish)",
    logo: "screen-printed or laser-etched, centered vertically and horizontally on visible side, matte black ink, EXACT reproduction of original design",
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
    logo: "debossed treatment, adhere strictly to original design",
    camera: "straight-on position, 85mm lens, f/2.8 aperture, sharp focus on hand and card",
    lighting: "soft directional studio light from upper right with gentle shadows emphasizing edges",
    style: "minimalist high-resolution product shot with professional high contrast",
    aspectRatio: "4:5"
  },
  mockup4: {
    subject: "Black iPhone on circular wireless charging pad",
    device: "modern iPhone with rounded corners and black frame",
    screen: "soft gray gradient wallpaper from near-white at top to deeper gray at bottom",
    dock: "translucent gray bar with 4 icons: custom app (white glyph on warm yellow rounded-square iOS icon), Reminders (white notepad with blue/red/orange dots), Mail (blue background with white envelope), Messages (green background with white speech bubble)",
    charger: "circular wireless charging pad in white or light gray with clean edges, minimalist design",
    pose: "slight angle to reveal both screen and charging pad",
    environment: "neutral light gray background with subtle shadows beneath charging pad",
    lighting: "soft diffused lighting",
    style: "clean minimalist tech product photography"
  }
};

// Helper function to convert hex color to descriptive name
function hexToColorName(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '').toLowerCase();

  // Convert to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);

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

  const brandColor = mockup.colorApplication ? brandData.colors[mockup.colorApplication] : null;
  const colorName = brandColor ? hexToColorName(brandColor) : null;

  let prompt = `Create a professional product mockup: ${detailedSpec.subject}`;

  // Add brand context
  prompt += ` for ${brandData.name}, a ${brandData.industry} company with ${brandData.personality} personality.`;

  // Apply brand color with descriptive names
  if (colorName) {
    if (mockupId === 'mockup1') {
      prompt += ` Use ${colorName} as the cap color instead of the default color.`;
    } else if (mockupId === 'mockup2') {
      prompt += ` Use ${colorName} as the bottle color instead of the default color.`;
    } else if (mockupId === 'mockup3') {
      prompt += ` Use ${colorName} as an accent color in the business card design.`;
    } else if (mockupId === 'mockup4') {
      prompt += ` Use ${colorName} as the app icon background color instead of warm yellow.`;
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

  // Add logo instruction
  prompt += ` Apply the provided ${mockup.logoType} logo version to the mockup.`;

  return prompt;
}