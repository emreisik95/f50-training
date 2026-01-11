"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Plan {
  id: string;
  name: string;
  price: number;
  validity_days: number;
  is_active: boolean;
  type: string;
  includes_classes: boolean;
}

interface PricingProps {
  plans: Plan[];
}

export function Pricing({ plans }: PricingProps) {
  const { t, language } = useLanguage();

  // Generate features based on plan type
  const getFeatures = (plan: Plan): string[] => {
    const baseFeatures = language === "tr"
      ? [
          `${plan.validity_days} gün geçerlilik`,
          "Mobil QR giriş",
        ]
      : [
          `${plan.validity_days} days validity`,
          "Mobile QR check-in",
        ];

    if (plan.includes_classes) {
      baseFeatures.push(language === "tr" ? "Grup dersleri dahil" : "Group classes included");
    }

    // Add more features based on plan type
    if (plan.type === "pro" || plan.type === "premium") {
      baseFeatures.push(
        language === "tr" ? "Tüm ekipman kullanımı" : "Full equipment access",
        language === "tr" ? "Sınırsız giriş" : "Unlimited entry"
      );
    }

    if (plan.type === "elite" || plan.type === "vip") {
      baseFeatures.push(
        language === "tr" ? "Özel antrenör indirimi" : "Personal trainer discount",
        language === "tr" ? "Öncelikli ders rezervasyonu" : "Priority class booking",
        language === "tr" ? "Misafir geçişleri" : "Guest passes"
      );
    }

    return baseFeatures;
  };

  // Fallback to static plans if no database plans
  const displayPlans = plans.length > 0
    ? plans.map((plan, index) => ({
        name: plan.name,
        price: plan.price,
        description: plan.type,
        features: getFeatures(plan),
        highlighted: index === 1, // Middle plan is highlighted
      }))
    : [
        {
          name: t.pricing.basic.name,
          price: 0,
          description: t.pricing.basic.description,
          features: t.pricing.basic.features,
          highlighted: false,
        },
        {
          name: t.pricing.pro.name,
          price: 0,
          description: t.pricing.pro.description,
          features: t.pricing.pro.features,
          highlighted: true,
        },
        {
          name: t.pricing.elite.name,
          price: 0,
          description: t.pricing.elite.description,
          features: t.pricing.elite.features,
          highlighted: false,
        },
      ];

  return (
    <section id="pricing" className="py-24 bg-brand-navy">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {displayPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-brand-navy-light to-brand-navy border-2 border-brand-orange scale-105 shadow-xl shadow-brand-orange/10"
                  : "bg-brand-navy-light border border-white/10"
              }`}
            >
              {/* Recommended Badge */}
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white hover:bg-brand-orange">
                  {t.pricing.recommended}
                </Badge>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-white/50 mb-4 capitalize">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-brand-orange">
                    {plan.price.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-white/50">{t.pricing.perMonth}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                asChild
                className={`w-full ${
                  plan.highlighted
                    ? "bg-brand-orange hover:bg-brand-orange-hover text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Link href="/signup">{t.pricing.getStarted}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
