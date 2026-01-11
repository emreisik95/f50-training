"use client";

import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useLanguage();

  const testimonials = t.testimonials.reviews.map((review, index) => ({
    ...review,
    rating: 5,
  }));

  return (
    <section id="testimonials" className="py-24 bg-brand-navy-light">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-brand-navy border border-white/10 rounded-2xl p-8"
            >
              {/* Quote Icon */}
              <Quote className="h-10 w-10 text-brand-orange/30 mb-4" />

              {/* Quote Text */}
              <p className="text-white/80 leading-relaxed mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-brand-orange fill-brand-orange"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <span className="text-brand-orange font-bold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-white/50">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
