"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/i18n";

// Dynamic import to avoid SSR issues with WebGL
const HeroOdyssey = dynamic(
  () => import("@/components/ui/hero-odyssey").then((mod) => mod.HeroOdyssey),
  { ssr: false }
);

export function Hero() {
  const { t } = useLanguage();
  const router = useRouter();

  const stats = [
    { value: "500+", label: t.hero.activeMembers },
    { value: "50+", label: t.hero.weeklyClasses },
    { value: "10+", label: t.hero.expertCoaches },
  ];

  return (
    <HeroOdyssey
      badge={t.hero.badge}
      headlineLine1={t.hero.headlineLine1}
      headlineLine2={t.hero.headlineLine2}
      subheadline={t.hero.subheadline}
      primaryButtonText={t.hero.startTraining}
      secondaryButtonText={t.hero.memberCheckin}
      onPrimaryClick={() => router.push("/signup")}
      onSecondaryClick={() => router.push("/my-qr")}
      stats={stats}
    />
  );
}
