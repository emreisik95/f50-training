"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function FooterCTA() {
  const { t } = useLanguage();

  return (
    <>
      {/* CTA Section */}
      <section className="py-24 bg-brand-navy relative overflow-hidden">
        {/* Background Glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245, 166, 35, 0.15) 0%, transparent 70%)",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              {t.footerCta.title}
            </h2>
            <p className="text-xl text-white/60 mb-10">
              {t.footerCta.subtitle}
            </p>
            <Button
              size="lg"
              asChild
              className="bg-brand-orange hover:bg-brand-orange-hover text-white text-lg px-10 py-6 shadow-lg shadow-brand-orange/25"
            >
              <Link href="/signup">
                {t.footerCta.joinToday}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4 -ml-5 -my-2">
                <Image
                  src="/f50-logo.png"
                  alt="F50 Training"
                  width={140}
                  height={140}
                  className="h-28 w-auto"
                />
              </Link>
              <p className="text-white/50 max-w-sm">
                {t.footerCta.tagline}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">{t.footerCta.quickLinks}</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-white/50 hover:text-brand-orange transition-colors"
                  >
                    {t.nav.features}
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-white/50 hover:text-brand-orange transition-colors"
                  >
                    {t.nav.pricing}
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-white/50 hover:text-brand-orange transition-colors"
                  >
                    {t.nav.testimonials}
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-white/50 hover:text-brand-orange transition-colors"
                  >
                    {t.nav.login}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">{t.footerCta.contact}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/50">
                  <MapPin className="h-4 w-4 text-brand-orange" />
                  123 Fitness Ave, Gym City
                </li>
                <li className="flex items-center gap-2 text-white/50">
                  <Phone className="h-4 w-4 text-brand-orange" />
                  +90 (555) 123-4567
                </li>
                <li className="flex items-center gap-2 text-white/50">
                  <Mail className="h-4 w-4 text-brand-orange" />
                  hello@f50.training
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} F50 Training. {t.footerCta.rights}
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                {t.footerCta.privacy}
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                {t.footerCta.terms}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
