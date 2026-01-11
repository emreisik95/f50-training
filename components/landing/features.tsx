"use client";

import { QrCode, Calendar, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: QrCode,
      title: t.features.qrCheckin.title,
      description: t.features.qrCheckin.description,
    },
    {
      icon: Calendar,
      title: t.features.classBooking.title,
      description: t.features.classBooking.description,
    },
    {
      icon: Users,
      title: t.features.memberManagement.title,
      description: t.features.memberManagement.description,
    },
  ];

  return (
    <section id="features" className="py-24 bg-brand-navy-light">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-brand-navy border border-white/10 rounded-2xl p-8 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-orange/10 mb-6 group-hover:bg-brand-orange/20 transition-colors">
                <feature.icon className="h-7 w-7 text-brand-orange" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
