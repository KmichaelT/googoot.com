"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { ColorInput } from "./ColorInput";
import { useBrand } from "@/lib/BrandContext";

export interface BrandData {
  name: string;
  industry: string;
  personality: string;
  description: string;
  tagline?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    light: string;
  };
  logos: {
    black: string;
    white: string;
    fullColor: string;
    icon: string;
  };
}

export function BrandForm() {
  const { setBrandData, setIsGenerated, setGeneratedMockups, isGenerating, setIsGenerating } = useBrand();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [brandName, setBrandName] = useState("NanoBanana");
  const [industry, setIndustry] = useState("Technology");
  const [personality, setPersonality] = useState("Modern, Innovative, Friendly");
  const [description, setDescription] = useState("A cutting-edge AI-powered brand generator that creates stunning mockups and brand guidelines using advanced machine learning technology.");
  const [tagline, setTagline] = useState("AI-Powered Brand Magic");
  
  // Colors
  const [primaryColor, setPrimaryColor] = useState("#ff6b35");
  const [secondaryColor, setSecondaryColor] = useState("#f7931e");
  const [accentColor, setAccentColor] = useState("#4ecdc4");
  const [darkColor, setDarkColor] = useState("#2c3e50");
  const [lightColor, setLightColor] = useState("#ecf0f1");
  
  // Logos
  const [logos, setLogos] = useState({
    black: "",
    white: "",
    fullColor: "",
    icon: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const brandData: BrandData = {
      name: brandName,
      industry,
      personality,
      description,
      tagline,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        dark: darkColor,
        light: lightColor
      },
      logos
    };

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
        console.log('Mockups generated successfully:', result.mockups);
      } else {
        throw new Error('Mockup generation failed');
      }

    } catch (error) {
      console.error('Error generating mockups:', error);
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
            label="Upload Main Logo"
            description="The full color version of your logo. Supports PNG, JPG, SVG formats."
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, fullColor: base64 }))}
          />

          <FileUpload
            label="Upload Main Logo in White"
            description="A flat white color on a transparent background. PNG recommended for transparency."
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, white: base64 }))}
          />

          <FileUpload
            label="Upload Main Logo in Black"
            description="A flat black color on a transparent background. PNG recommended for transparency."
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, black: base64 }))}
          />

          <FileUpload
            label="Upload Logo Mark (Icon)"
            description="The icon/mark version of your logo. PNG/JPG recommended for best AI results."
            onFileSelect={(file, base64) => setLogos(prev => ({ ...prev, icon: base64 }))}
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
          <h2 className="text-2xl font-semibold text-white">Brand Colors</h2>
          
          <ColorInput
            label="Primary Color"
            description="Pick and name a primary color."
            value={primaryColor}
            onChange={setPrimaryColor}
          />
          
          <ColorInput
            label="Secondary Color"
            description="Pick and name a secondary color."
            value={secondaryColor}
            onChange={setSecondaryColor}
          />
          
          <ColorInput
            label="Accent Color"
            description="Pick and name an accent color."
            value={accentColor}
            onChange={setAccentColor}
          />
          
          <ColorInput
            label="Dark Color (optional)"
            description="Pick and name a dark color if other than black."
            value={darkColor}
            onChange={setDarkColor}
          />
          
          <ColorInput
            label="Light Color (optional)"
            description="Pick and name a light color if other than white."
            value={lightColor}
            onChange={setLightColor}
          />
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