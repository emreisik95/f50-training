"use client";

import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-white/80 hover:text-white hover:bg-white/10 text-lg"
    >
      <Globe className="h-5 w-5 mr-1" />
      {language.toUpperCase()}
    </Button>
  );
}
