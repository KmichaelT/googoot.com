import { NextRequest, NextResponse } from 'next/server';
import { BrandData } from '@/components/BrandForm';
import { createGeminiService } from '@/lib/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const { mockupId, brandData }: { mockupId: string; brandData: BrandData } = await request.json();

    // Validate required fields
    if (!mockupId || !brandData?.name || !brandData?.industry) {
      return NextResponse.json(
        { error: 'Missing required mockup ID or brand data' },
        { status: 400 }
      );
    }

    // Check if AI generation is enabled
    const enableRealGeneration = process.env.ENABLE_REAL_AI_GENERATION === 'true';

    if (!enableRealGeneration) {
      // Return mock data for testing with different fallback images
      const fallbackImages = {
        mockup1: '/Gemini_Generated_Image_720se3720se3720s.png',
        mockup2: '/Gemini_Generated_Image_993evx993evx993e.png',
        mockup3: '/Gemini_Generated_Image_4mc24w4mc24w4mc2.png',
        mockup4: '/Gemini_Generated_Image_to66flto66flto66.png'
      };

      return NextResponse.json({
        success: true,
        mockup: {
          success: true,
          imageUrl: fallbackImages[mockupId as keyof typeof fallbackImages] || fallbackImages.mockup1
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

    // Generate single mockup
    const mockup = await geminiService.generateMockup({
      mockupId,
      brandData
    });

    if (mockup.success) {
    } else {
    }

    return NextResponse.json({
      success: true,
      mockup,
      metadata: {
        mockupId,
        brandName: brandData.name,
        regeneratedAt: new Date().toISOString()
      }
    });

  } catch (error) {

    return NextResponse.json(
      {
        error: 'Failed to regenerate mockup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}