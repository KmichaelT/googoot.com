import { BrandData } from "@/components/BrandForm";
import { generateMockupPrompt, getLogoForMockup, MOCKUP_TYPES } from "./mockupUtils";

export interface MockupGenerationRequest {
  mockupId: string;
  brandData: BrandData;
  logoFile?: string; // base64 encoded logo file
}

export interface MockupGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  private model: string = 'gemini-2.5-flash-image';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getMimeType(base64String: string): string {
    if (base64String.startsWith('data:image/svg+xml')) return 'image/svg+xml';
    if (base64String.startsWith('data:image/png')) return 'image/png';
    if (base64String.startsWith('data:image/jpeg')) return 'image/jpeg';
    if (base64String.startsWith('data:image/jpg')) return 'image/jpeg';
    if (base64String.startsWith('data:image/webp')) return 'image/webp';

    // Default to PNG for unknown formats
    return 'image/png';
  }

  async generateMockup(request: MockupGenerationRequest): Promise<MockupGenerationResponse> {
    try {
      const prompt = generateMockupPrompt(request.mockupId, request.brandData);
      const logoFile = getLogoForMockup(request.mockupId, request.brandData);

      // Always require a logo for proper mockup generation
      if (!logoFile || logoFile.length <= 50) {
        console.log(`Skipping mockup ${request.mockupId} - no valid logo file available`);
        return {
          success: false,
          error: 'No valid logo file available for this mockup type'
        };
      }

      // Build the request parts - always include both prompt and logo
      const parts: any[] = [
        { text: prompt },
        {
          inline_data: {
            mime_type: this.getMimeType(logoFile),
            data: logoFile.split(',')[1] // Remove data:image/... prefix
          }
        }
      ];

      console.log(`Generating mockup ${request.mockupId} with logo (${this.getMimeType(logoFile)})`);

      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Log the response for debugging
      console.log(`Gemini API Response for ${request.mockupId}:`, JSON.stringify(data, null, 2).substring(0, 500) + '...');

      // Extract the generated image from the response
      // The image can be in either format: inline_data (base64) or text
      const candidate = data.candidates?.[0];
      if (!candidate) {
        throw new Error('No candidate response from API');
      }

      // Check for image data in the response (Gemini uses camelCase: inlineData not inline_data)
      const imagePart = candidate.content?.parts?.find((part: any) => part.inlineData?.data);
      const textPart = candidate.content?.parts?.find((part: any) => part.text);

      if (imagePart?.inlineData?.data) {
        // We have an actual generated image!
        const mimeType = imagePart.inlineData.mimeType || 'image/png';
        const imageUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;

        return {
          success: true,
          imageUrl,
          description: textPart?.text || 'Generated mockup'
        };
      } else if (textPart?.text) {
        // Only text response, no image generated
        console.log('Text-only response:', textPart.text);
        throw new Error('No image data in response');
      } else {
        throw new Error('No valid response from API');
      }

    } catch (error) {
      console.error('Mockup generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateAllMockups(brandData: BrandData): Promise<Record<string, MockupGenerationResponse>> {
    const results: Record<string, MockupGenerationResponse> = {};

    // Generate all mockups in parallel, but only for those with valid logos
    const promises = MOCKUP_TYPES.map(async (mockup) => {
      const logoFile = getLogoForMockup(mockup.id, brandData);

      // Log which logo type is being used for each mockup
      console.log(`Mockup ${mockup.id} (${mockup.name}) requires ${mockup.logoType} logo:`, logoFile ? 'available' : 'missing');

      const result = await this.generateMockup({
        mockupId: mockup.id,
        brandData,
        logoFile: logoFile || undefined
      });
      return { mockupId: mockup.id, result };
    });

    const responses = await Promise.all(promises);

    responses.forEach(({ mockupId, result }) => {
      results[mockupId] = result;
    });

    return results;
  }
}

// Utility function to create a Gemini service instance
export function createGeminiService(): GeminiService | null {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not found. Set NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY environment variable.');
    return null;
  }

  return new GeminiService(apiKey);
}