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
      // Add debugging info for Vercel
      const hasGeminiKey = !!process.env.GEMINI_API_KEY;
      const hasPublicKey = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      return NextResponse.json(
        {
          error: 'Gemini API service not available. Check API key configuration.',
          debug: {
            hasGeminiKey,
            hasPublicKey,
            envKeys: Object.keys(process.env).filter(k => k.includes('GEMINI'))
          }
        },
        { status: 500 }
      );
    }

    // Generate all mockups
    const mockups = await geminiService.generateAllMockups(brandData);

    // Check if any mockups failed
    const hasErrors = Object.values(mockups).some(mockup => !mockup.success);

    if (hasErrors) {
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
    // Enhanced error details for debugging
    return NextResponse.json(
      {
        error: 'Failed to generate mockups',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}