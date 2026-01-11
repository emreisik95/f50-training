"use client";

import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { FooterCTA } from "@/components/landing/footer-cta";
import { LanguageProvider } from "@/lib/i18n";

interface Plan {
  id: string;
  name: string;
  price: number;
  validity_days: number;
  is_active: boolean;
  type: string;
  includes_classes: boolean;
}

interface LandingPageProps {
  plans: Plan[];
}

export function LandingPage({ plans }: LandingPageProps) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-brand-navy">
        <Navigation />
        <Hero />
        <Features />
        <Pricing plans={plans} />
        <Testimonials />
        <FooterCTA />
      </div>
    </LanguageProvider>
  );
}
