import Image from "next/image";

export function HeroSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="order-1 flex flex-col lg:order-2 lg:items-start lg:text-left">
            <h1 className="my-6 text-pretty text-3xl font-semibold lg:text-5xl text-white">
              INSTANT BRAND GUIDE GENERATOR
            </h1>
            <p className="mb-8 max-w-xl text-white/80 lg:text-lg">
              Transform your logo and colors into a professional brand guide
              in seconds
            </p>
            <ul className="ml-4 space-y-4 text-left">
              <li className="flex items-center gap-3">
                <span className="text-white">✓</span>
                <p className="text-white/80">No design skills needed</p>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-white">✓</span>
                <p className="text-white/80">Professional results</p>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-white">✓</span>
                <p className="text-white/80">Ready in under a minute</p>
              </li>
            </ul>
          </div>

          <Image
            src="/hero-cover.webp"
            alt="Website components showcase"
            width={1200}
            height={600}
            priority
            className="order-2 max-h-96 w-full rounded-md object-cover lg:order-2"
          />
        </div>
      </div>
    </section>
  );
}