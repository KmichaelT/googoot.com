"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { useBrand } from "@/lib/BrandContext";
import { extractColorsFromBase64Svg, generateColorName, sortColorsByBrightness } from "@/lib/colorExtractor";
import { Plus, X } from "lucide-react";

export interface BrandColor {
  hex: string;
  name: string;
  isPrimary?: boolean;
}

export interface BrandData {
  name: string;
  industry: string;
  personality: string;
  description: string;
  tagline?: string;
  colors: BrandColor[];
  logos: {
    fullColorLogo: string;  // Full color logo SVG
    flatColorLogo: string;  // Flat color logo SVG
    fullColorIcon: string;  // Full color icon SVG
    flatColorIcon: string;  // Flat color icon SVG
  };
  processedLogos?: {
    fullLogoWhiteBg: string;      // Full color logo on white
    flatLogoWhiteBg: string;       // Black logo on white
    flatLogoBlackBg: string;       // White logo on black
    fullIconWhiteBg: string;       // Full color icon on white
    flatIconWhiteBg: string;       // Black icon on white
    flatIconBlackBg: string;       // White icon on black
  };
}

export function BrandForm() {
  const { setBrandData, setIsGenerated, setGeneratedMockups, isGenerating, setIsGenerating, setCurrentView } = useBrand();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [personality, setPersonality] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");

  // Dynamic Colors
  const [colors, setColors] = useState<BrandColor[]>([
    { hex: "#000000", name: "Primary Color", isPrimary: true }
  ]);
  
  // Logos - updated to match logo generator interface
  const [logos, setLogos] = useState({
    fullColorLogo: "",
    flatColorLogo: "",
    fullColorIcon: "",
    flatColorIcon: ""
  });

  // Extract colors when full color logo is uploaded
  useEffect(() => {
    if (logos.fullColorLogo) {
      const extractedColors = extractColorsFromBase64Svg(logos.fullColorLogo);
      if (extractedColors.length > 0) {
        const sortedColors = sortColorsByBrightness(extractedColors);
        const newColors: BrandColor[] = sortedColors.map((hex, index) => ({
          hex,
          name: generateColorName(index),
          isPrimary: index === 0
        }));
        setColors(newColors);
      }
    }
  }, [logos.fullColorLogo]);

  const addCustomColor = () => {
    const newColor: BrandColor = {
      hex: "#000000",
      name: generateColorName(colors.length),
      isPrimary: false
    };
    setColors([...colors, newColor]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index);
      // Ensure we always have a primary color
      if (!newColors.some(c => c.isPrimary) && newColors.length > 0) {
        newColors[0].isPrimary = true;
      }
      setColors(newColors);
    }
  };

  const updateColor = (index: number, updates: Partial<BrandColor>) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], ...updates };

    // If setting a new primary, unset the old one
    if (updates.isPrimary) {
      newColors.forEach((color, i) => {
        if (i !== index) color.isPrimary = false;
      });
    }

    setColors(newColors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const brandData: BrandData = {
      name: brandName,
      industry,
      personality,
      description,
      tagline,
      colors,
      logos
    };

    // Process logos if available
    let processedLogos;
    if (logos.fullColorLogo && logos.fullColorIcon && logos.flatColorLogo && logos.flatColorIcon) {
      try {
        const logoProcessingResponse = await fetch('/api/process-logos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullColorLogo: logos.fullColorLogo,
            flatColorLogo: logos.flatColorLogo,
            fullColorIcon: logos.fullColorIcon,
            flatColorIcon: logos.flatColorIcon
          })
        });

        if (logoProcessingResponse.ok) {
          const logoResult = await logoProcessingResponse.json();
          if (logoResult.success) {
            processedLogos = logoResult.logos;
            brandData.processedLogos = processedLogos;
          }
        }
      } catch {
      }
    }

    try {
      // Store brand data in context for immediate showcase update
      setBrandData(brandData);
      setIsGenerated(true);
      setIsGenerating(true);

      // Call the API to generate mockups
      const response = await fetch('/api/generate-mockups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate mockups');
      }

      if (result.success) {
        setGeneratedMockups(result.mockups);
        // Switch to results view after successful generation
        setCurrentView('results');
      } else {
        throw new Error('Mockup generation failed');
      }

    } catch (error) {
      alert(`Failed to generate mockups: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="z-30 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Brand Information */}
      <div className="flex flex-col gap-10 rounded-lg border border-white/30 p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Brand Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="brand-name" className="text-sm text-white/80">
              Brand/Company Name
            </Label>
            <Input
              id="brand-name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="border-0 bg-[#5A5A5A] text-white placeholder:text-white/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm text-white/80">
              Industry/Niche
            </Label>
            <Input
              id="industry"
              placeholder="Tech, Manufacturing, Construction, Beauty, Healthcare, Food, etc."
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="border-0 bg-[#5A5A5A] text-white placeholder:text-white/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality" className="text-sm text-white/80">
              Brand Personality
            </Label>
            <Input
              id="personality"
              placeholder="Modern, Traditional, Playful, Serious, Luxury, Affordable, etc."
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="border-0 bg-[#5A5A5A] text-white placeholder:text-white/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-white/80">
              Brand Description
            </Label>
            <Textarea
              id="description"
              placeholder="What does your company do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none border-0 bg-[#5A5A5A] text-white placeholder:text-white/40"
              required
            />
          </div>
        </div>
      </div>

      {/* Brand Logo */}
      <div className="flex flex-col gap-10 rounded-lg border border-white/30 p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Brand Logo</h2>
          
          <FileUpload
            label="Full Color Logo (SVG)"
            description="Upload your complete logo in full color. Must be SVG format with transparent background."
            accept=".svg,image/svg+xml"
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, fullColorLogo: base64 }))}
          />

          <FileUpload
            label="Flat Color Logo (SVG)"
            description="Upload your logo in a single flat color (any color). Must be SVG format with transparent background."
            accept=".svg,image/svg+xml"
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, flatColorLogo: base64 }))}
          />

          <FileUpload
            label="Full Color Icon (SVG)"
            description="Upload your icon/mark in full color. Must be SVG format with transparent background."
            accept=".svg,image/svg+xml"
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, fullColorIcon: base64 }))}
          />

          <FileUpload
            label="Flat Color Icon (SVG)"
            description="Upload your icon in a single flat color (any color). Must be SVG format with transparent background."
            accept=".svg,image/svg+xml"
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, flatColorIcon: base64 }))}
          />

          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-sm text-white/80">
              Tagline/Slogan
            </Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="border-0 bg-[#5A5A5A] text-white placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="flex flex-col gap-10 rounded-lg border border-white/30 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Brand Colors</h2>
            <Button
              type="button"
              onClick={addCustomColor}
              size="sm"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Color
            </Button>
          </div>

          {colors.map((color, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white/80">
                  {color.name}
                  {color.isPrimary && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">Primary</span>
                  )}
                </Label>
                {colors.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeColor(index)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={color.name}
                    onChange={(e) => updateColor(index, { name: e.target.value })}
                    placeholder="Color name"
                    className="border-0 bg-[#5A5A5A] text-white placeholder:text-white/40"
                  />
                </div>
                <div className="w-20">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(index, { hex: e.target.value.toUpperCase() })}
                    className="w-full h-10 rounded border-0 bg-transparent cursor-pointer"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => updateColor(index, { isPrimary: !color.isPrimary })}
                  size="sm"
                  variant={color.isPrimary ? "default" : "outline"}
                  className={color.isPrimary
                    ? "bg-white text-black hover:bg-white/90"
                    : "border-white/30 bg-transparent text-white hover:bg-white/10"
                  }
                >
                  {color.isPrimary ? "Primary" : "Set Primary"}
                </Button>
              </div>
            </div>
          ))}

          <div className="text-sm text-white/60">
            Colors are automatically extracted from your full color logo. You can modify names and add custom colors.
          </div>
        </div>
      </div>

      <div className="md:col-span-2 lg:col-span-3 flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={loading || isGenerating}
          className="bg-white px-12 text-lg font-semibold text-[#6B6B6B] hover:bg-white/90"
        >
          {loading || isGenerating ? "Generating..." : "Generate Guide"}
        </Button>
      </div>
    </form>
  );
}