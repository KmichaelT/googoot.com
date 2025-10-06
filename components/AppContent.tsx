"use client";

import { BrandForm } from "@/components/BrandForm";
import { BentoShowcase } from "@/components/BentoShowcase";
import { useBrand } from "@/lib/BrandContext";

export function AppContent() {
  const { currentView } = useBrand();

  return (
    <div className="relative">
      {currentView === 'form' && (
        <section className="relative py-32">
          <div className="container mx-auto relative">
            <BrandForm />
          </div>
        </section>
      )}

      {currentView === 'results' && (
        <div className="relative">
          <BentoShowcase />
        </div>
      )}
    </div>
  );
}