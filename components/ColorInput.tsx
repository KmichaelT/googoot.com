"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorInputProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  textColor?: string;
}

export function ColorInput({ label, description, value, onChange, textColor = "#fff" }: ColorInputProps) {
  const getContrastColor = (hex: string) => {
    // Simple contrast calculation
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000" : "#fff";
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-white/80">{label}</Label>
      <p className="text-xs text-white/60">{description}</p>
      <div className="flex gap-2">
        <Input
          placeholder="Color name (optional)"
          className="flex-1 border-0 bg-[#5A5A5A] text-white placeholder:text-white/40"
        />
        <div className="relative">
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div
            className="flex h-10 w-20 items-center justify-center rounded text-xs font-medium"
            style={{
              backgroundColor: value,
              color: getContrastColor(value),
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}