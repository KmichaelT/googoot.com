"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorPalette } from "@/components/color";
import { useBrand } from "@/lib/BrandContext";
import { createColorVariantSvg } from "@/lib/logoProcessorClient";
import { RefreshCw, Download } from "lucide-react";
import { useState } from "react";
import { downloadBentoGridScreenshot } from "@/lib/screenshotDownload";

export function BentoShowcase() {
  const { brandData, generatedMockups, isGenerating, setGeneratedMockups, setCurrentView } = useBrand();
  const [refreshingMockups, setRefreshingMockups] = useState<{ [key: string]: boolean }>({});

  const getMockupImage = (mockupId: string, fallbackSrc: string) => {
    if (generatedMockups && generatedMockups[mockupId]?.success && generatedMockups[mockupId].imageUrl) {
      return generatedMockups[mockupId].imageUrl!;
    }
    return fallbackSrc;
  };

  const refreshSingleMockup = async (mockupId: string) => {
    if (!brandData || refreshingMockups[mockupId]) return;

    setRefreshingMockups(prev => ({ ...prev, [mockupId]: true }));

    try {
      const response = await fetch('/api/regenerate-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mockupId, brandData })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.mockup) {
          setGeneratedMockups(prev => ({
            ...(prev || {}),
            [mockupId]: result.mockup
          }));
        }
      }
    } catch {
    } finally {
      setRefreshingMockups(prev => ({ ...prev, [mockupId]: false }));
    }
  };

  return (
    <section className="py-32">
      <div className="container mx-auto">
        {/* Header with Edit Brand and Download PDF buttons */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Brand Showcase</h2>
          <div className="flex gap-4">
            <Button
              onClick={() => downloadBentoGridScreenshot(brandData?.name)}
              size="lg"
              className="bg-white text-[#6B6B6B] hover:bg-white/90 px-6"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
            <Button
              onClick={() => setCurrentView('form')}
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 px-8"
            >
              Edit Brand
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12" data-bento-grid>
          {/* Mockup1 */}
          <div className="relative h-60 overflow-hidden rounded-lg md:col-span-2 md:row-span-2 md:h-[300px] lg:col-span-4 lg:h-full group">
            {(isGenerating || refreshingMockups['mockup1']) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {refreshingMockups['mockup1'] ? 'Refreshing...' : 'Generating...'}
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              onClick={() => refreshSingleMockup('mockup1')}
              disabled={isGenerating || refreshingMockups['mockup1']}
              className="absolute top-2 right-2 z-20 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 border-0 opacity-0 group-hover:opacity-100 transition-opacity"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 text-white ${refreshingMockups['mockup1'] ? 'animate-spin' : ''}`} />
            </Button>

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
          <Card className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-3 md:row-span-1 md:h-[300px] lg:col-span-4 bg-white border-0">
            {brandData?.logos.fullColorLogo ? (
              // Always use full color logo for main display
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandData.logos.fullColorLogo}
                alt="Main logo display"
                className="w-full h-full object-contain p-20"
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
          <div className="relative h-60 overflow-hidden rounded-lg md:col-span-2 md:row-span-2 md:h-[500px] lg:col-span-4 lg:h-full group">
            {(isGenerating || refreshingMockups['mockup2']) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {refreshingMockups['mockup2'] ? 'Refreshing...' : 'Generating...'}
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              onClick={() => refreshSingleMockup('mockup2')}
              disabled={isGenerating || refreshingMockups['mockup2']}
              className="absolute top-2 right-2 z-20 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 border-0 opacity-0 group-hover:opacity-100 transition-opacity"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 text-white ${refreshingMockups['mockup2'] ? 'animate-spin' : ''}`} />
            </Button>

            <Image
              src={getMockupImage('mockup2', '/Gemini_Generated_Image_993evx993evx993e.png')}
              alt="Product mockup"
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Icon on black background */}
          <div className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-2 md:row-span-1 md:h-[192px] lg:col-span-2 bg-black">
            {brandData?.logos.fullColorIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={createColorVariantSvg(brandData.logos.fullColorIcon, '#ffffff')}
                alt="White icon on black background"
                className="w-full h-full object-contain p-12"
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

          {/* Icon on white background */}
          <div className="relative col-span-1 h-60 overflow-hidden rounded-lg border md:col-span-2 md:row-span-1 md:h-[192px] lg:col-span-2 bg-white">
            {brandData?.logos.fullColorIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={createColorVariantSvg(brandData.logos.fullColorIcon, '#000000')}
                alt="Black icon on white background"
                className="w-full h-full object-contain p-12"
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
          <Card className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-3 md:row-span-1 md:h-[300px] lg:col-span-3 border-0 group">
            {(isGenerating || refreshingMockups['mockup3']) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {refreshingMockups['mockup3'] ? 'Refreshing...' : 'Generating...'}
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              onClick={() => refreshSingleMockup('mockup3')}
              disabled={isGenerating || refreshingMockups['mockup3']}
              className="absolute top-2 right-2 z-20 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 border-0 opacity-0 group-hover:opacity-100 transition-opacity"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 text-white ${refreshingMockups['mockup3'] ? 'animate-spin' : ''}`} />
            </Button>

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
                brandData?.colors || [
                  { hex: "#ff9700", name: "Color1", isPrimary: true },
                  { hex: "#ffc06e", name: "Color2", isPrimary: false },
                  { hex: "#000000", name: "Color3", isPrimary: false },
                  { hex: "#ffffff", name: "Color4", isPrimary: false },
                ]
              }
            />
          </div>

          {/* Mockup4 */}
          <Card className="relative col-span-1 h-60 overflow-hidden rounded-lg md:col-span-3 md:row-span-1 md:h-[300px] lg:col-span-4 border-0 group">
            {(isGenerating || refreshingMockups['mockup4']) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {refreshingMockups['mockup4'] ? 'Refreshing...' : 'Generating...'}
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              onClick={() => refreshSingleMockup('mockup4')}
              disabled={isGenerating || refreshingMockups['mockup4']}
              className="absolute top-2 right-2 z-20 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 border-0 opacity-0 group-hover:opacity-100 transition-opacity"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 text-white ${refreshingMockups['mockup4'] ? 'animate-spin' : ''}`} />
            </Button>

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