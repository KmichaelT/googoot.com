"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ColorPalette } from "@/components/color";
import { useBrand } from "@/lib/BrandContext";

export function BentoShowcase() {
  const { brandData, isGenerated, generatedMockups, isGenerating } = useBrand();

  const getMockupImage = (mockupId: string, fallbackSrc: string) => {
    if (generatedMockups && generatedMockups[mockupId]?.success && generatedMockups[mockupId].imageUrl) {
      return generatedMockups[mockupId].imageUrl!;
    }
    return fallbackSrc;
  };

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          {/* Mockup1 */}
          <div className="relative h-60 overflow-hidden rounded-lg md:col-span-2 md:row-span-2 md:h-[300px] lg:col-span-4 lg:h-full">
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              </div>
            )}
            <Image
              src={getMockupImage('mockup1', '/Gemini_Generated_Image_720se3720se3720s.png')}
              alt="Brand mockup showcase"
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Main logo */}
          <Card
            className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-3 md:row-span-1 md:h-[300px] lg:col-span-4 bg-[#ff9700] border-0"
            style={{ backgroundColor: brandData?.colors.primary || "#ff9700" }}
          >
            {brandData?.logos.fullColor ? (
              <Image
                src={brandData.logos.fullColor}
                alt="Main logo display"
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
                className="object-contain p-20"
              />
            ) : (
              <Image
                src="/light-logo.svg"
                alt="Main logo display"
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
                className="object-contain p-20"
              />
            )}
          </Card>

          {/* Mockup2 */}
          <div className="relative h-60 overflow-hidden rounded-lg md:col-span-2 md:row-span-2 md:h-[500px] lg:col-span-4 lg:h-full">
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              </div>
            )}
            <Image
              src={getMockupImage('mockup2', '/Gemini_Generated_Image_993evx993evx993e.png')}
              alt="Product mockup"
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Icon on black */}
          <div
            className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-2 md:row-span-1 md:h-[192px] lg:col-span-2 bg-[#242424]"
            style={{ backgroundColor: brandData?.colors.dark || "#242424" }}
          >
            {brandData?.logos.white ? (
              <Image
                src={brandData.logos.white}
                alt="Icon on dark background"
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
                className="object-contain p-12"
              />
            ) : (
              <Image
                src="/icon-light.svg"
                alt="Icon on dark background"
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
                className="object-contain p-12"
              />
            )}
          </div>

          {/* Icon on white */}
          <div
            className="relative col-span-1 h-60 overflow-hidden rounded-lg border md:col-span-2 md:row-span-1 md:h-[192px] lg:col-span-2 bg-[#d7d7d7]"
            style={{ backgroundColor: brandData?.colors.light || "#d7d7d7" }}
          >
            {brandData?.logos.black ? (
              <Image
                src={brandData.logos.black}
                alt="Icon on light background"
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
                className="object-contain p-12"
              />
            ) : (
              <Image
                src="/icon-dark.svg"
                alt="Icon on light background"
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
                className="object-contain p-12"
              />
            )}
          </div>

          {/* Mockup3 */}
          <Card className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-3 md:row-span-1 md:h-[300px] lg:col-span-3 border-0">
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              </div>
            )}
            <Image
              src={getMockupImage('mockup3', '/Gemini_Generated_Image_4mc24w4mc24w4mc2.png')}
              alt="Business card mockup"
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </Card>

          {/* Color palette */}
          <div className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-3 md:row-span-2 md:h-[300px] lg:col-span-5">
            <ColorPalette
              colors={
                brandData
                  ? [
                      { hex: brandData.colors.primary, width: 30 },
                      { hex: brandData.colors.secondary, width: 30 },
                      { hex: brandData.colors.accent, width: 20 },
                      { hex: brandData.colors.dark, width: 10 },
                      { hex: brandData.colors.light, width: 10 },
                    ]
                  : [
                      { hex: "#ff9700", width: 30 },
                      { hex: "#ffc06e", width: 30 },
                      { hex: "#000000", width: 20 },
                      { hex: "#ffffff", width: 20 },
                    ]
              }
            />
          </div>

          {/* Mockup4 */}
          <Card className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-3 md:row-span-1 md:h-[300px] lg:col-span-4 border-0">
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              </div>
            )}
            <Image
              src={getMockupImage('mockup4', '/Gemini_Generated_Image_to66flto66flto66.png')}
              alt="Mobile app mockup"
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}