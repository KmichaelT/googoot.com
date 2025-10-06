"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  label: string;
  description: string;
  onFileSelect: (file: File | null, base64: string) => void;
  accept?: string;
}

export function FileUpload({ label, description, onFileSelect, accept = ".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg" }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onFileSelect(file, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-white/80">{label}</Label>
      <p className="text-xs text-white/60">{description}</p>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-[#5A5A5A] px-4 py-3 text-sm text-white/40">
          {fileName || "Drag and drop file here"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          className="bg-[#4A4A4A] text-white hover:bg-[#3A3A3A]"
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
}