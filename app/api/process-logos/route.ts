import { NextRequest, NextResponse } from 'next/server';
import { processLogoVariations, LogoInput, ProcessingOptions } from '@/lib/logoProcessor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.fullColorLogo || !body.flatColorLogo || !body.fullColorIcon || !body.flatColorIcon) {
      return NextResponse.json(
        { error: 'All four logo variations are required' },
        { status: 400 }
      );
    }

    const logos: LogoInput = {
      fullColorLogo: body.fullColorLogo,
      flatColorLogo: body.flatColorLogo,
      fullColorIcon: body.fullColorIcon,
      flatColorIcon: body.flatColorIcon
    };

    const options: ProcessingOptions = {
      outputSize: body.outputSize || 1024,
      paddingPercent: body.paddingPercent || 20,
      logoSize: body.logoSize || 512,
      iconSize: body.iconSize || 256
    };


    // Process the logos
    const processedLogos = await processLogoVariations(logos, options);


    return NextResponse.json({
      success: true,
      logos: processedLogos
    });

  } catch (error) {

    return NextResponse.json(
      {
        error: 'Failed to process logo variations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}