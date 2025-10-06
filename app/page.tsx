import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BrandProvider } from "@/lib/BrandContext";
import { AppContent } from "@/components/AppContent";

export default function Home() {
  return (
    <BrandProvider>
      <div className="min-h-screen bg-[#6B6B6B]">
        <Header />
        <div className="mx-auto max-w-[1600px] px-6 py-12">
          <HeroSection />
          <AppContent />
        </div>
      </div>
    </BrandProvider>
  );
}