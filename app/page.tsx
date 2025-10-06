import { BrandForm } from "@/components/BrandForm";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BentoShowcase } from "@/components/BentoShowcase";
import { BrandProvider } from "@/lib/BrandContext";

export default function Home() {
  return (
    <BrandProvider>
      <div className="min-h-screen bg-[#6B6B6B]">
        <Header />
        <div className="mx-auto max-w-[1600px] px-6 py-12">
          <HeroSection />

          <section className="relative py-32">
            <div className="container mx-auto relative">
              <BrandForm />
            </div>
          </section>

          <BentoShowcase />
        </div>
      </div>
    </BrandProvider>
  );
}