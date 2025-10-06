import { NextRequest, NextResponse } from 'next/server';
import { BrandData } from '@/components/BrandForm';
import { createGeminiService } from '@/lib/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const brandData: BrandData = await request.json();

    // Validate required fields
    if (!brandData.name || !brandData.industry) {
      return NextResponse.json(
        { error: 'Missing required brand data' },
        { status: 400 }
      );
    }

    // Check if AI generation is enabled
    const enableRealGeneration = process.env.ENABLE_REAL_AI_GENERATION === 'true';

    if (!enableRealGeneration) {
      // Return mock data for testing
      return NextResponse.json({
        success: true,
        mockups: {
          mockup1: { success: true, imageUrl: '/Gemini_Generated_Image_720se3720se3720s.png' },
          mockup2: { success: true, imageUrl: '/Gemini_Generated_Image_993evx993evx993e.png' },
          mockup3: { success: true, imageUrl: '/Gemini_Generated_Image_4mc24w4mc24w4mc2.png' },
          mockup4: { success: true, imageUrl: '/Gemini_Generated_Image_to66flto66flto66.png' }
        }
      });
    }

    // Initialize Gemini service
    const geminiService = createGeminiService();

    if (!geminiService) {
      return NextResponse.json(
        { error: 'Gemini API service not available. Check API key configuration.' },
        { status: 500 }
      );
    }

    // Generate all mockups
    console.log('Generating mockups for:', brandData.name);
    const mockups = await geminiService.generateAllMockups(brandData);

    // Check if any mockups failed
    const hasErrors = Object.values(mockups).some(mockup => !mockup.success);
    const allFailed = Object.values(mockups).every(mockup => !mockup.success);

    if (hasErrors) {
      console.warn('Some mockups failed to generate:', mockups);
    }

    // If all mockups failed, fall back to placeholder images
    if (allFailed) {
      console.log('All mockups failed, using fallback images');
      return NextResponse.json({
        success: true,
        mockups: {
          mockup1: { success: true, imageUrl: '/Gemini_Generated_Image_720se3720se3720s.png' },
          mockup2: { success: true, imageUrl: '/Gemini_Generated_Image_993evx993evx993e.png' },
          mockup3: { success: true, imageUrl: '/Gemini_Generated_Image_4mc24w4mc24w4mc2.png' },
          mockup4: { success: true, imageUrl: '/Gemini_Generated_Image_to66flto66flto66.png' }
        },
        metadata: {
          brandName: brandData.name,
          generatedAt: new Date().toISOString(),
          hasErrors: false,
          fallbackUsed: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      mockups,
      metadata: {
        brandName: brandData.name,
        generatedAt: new Date().toISOString(),
        hasErrors
      }
    });

  } catch (error) {
    console.error('Mockup generation API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate mockups',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}