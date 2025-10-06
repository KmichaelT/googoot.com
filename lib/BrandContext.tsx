"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BrandData } from '@/components/BrandForm';

interface GeneratedMockup {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

type ViewState = 'form' | 'results';

interface BrandContextType {
  brandData: BrandData | null;
  setBrandData: (data: BrandData) => void;
  isGenerated: boolean;
  setIsGenerated: (generated: boolean) => void;
  generatedMockups: Record<string, GeneratedMockup> | null;
  setGeneratedMockups: (mockups: Record<string, GeneratedMockup> | ((prev: Record<string, GeneratedMockup> | null) => Record<string, GeneratedMockup>)) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedMockups, setGeneratedMockups] = useState<Record<string, GeneratedMockup> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('form');

  return (
    <BrandContext.Provider value={{
      brandData,
      setBrandData,
      isGenerated,
      setIsGenerated,
      generatedMockups,
      setGeneratedMockups,
      isGenerating,
      setIsGenerating,
      currentView,
      setCurrentView
    }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}