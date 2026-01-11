"use client";

import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { FooterCTA } from "@/components/landing/footer-cta";
import { LanguageProvider } from "@/lib/i18n";

export default function HomePage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-brand-navy">
        <Navigation />
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <FooterCTA />
      </div>
    </LanguageProvider>
  );
}
