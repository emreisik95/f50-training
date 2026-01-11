"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, User, QrCode, LogIn } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "#features", label: t.nav.features },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#testimonials", label: t.nav.testimonials },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-brand-navy/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-6 -my-4">
            <Image
              src="/f50-logo.png"
              alt="F50 Training"
              width={180}
              height={180}
              className="h-32 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-white/80 hover:text-brand-orange transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold text-lg px-6">
                  {t.nav.getStarted}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-brand-navy border-white/10 [&_[data-slot=dropdown-menu-item]]:text-white [&_[data-slot=dropdown-menu-item]]:focus:bg-white/10 [&_[data-slot=dropdown-menu-item]]:focus:text-brand-orange"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-white hover:!text-brand-orange cursor-pointer text-base py-2"
                  >
                    <LogIn className="h-5 w-5" />
                    {t.nav.staffLogin}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/my-qr"
                    className="flex items-center gap-2 text-white hover:!text-brand-orange cursor-pointer text-base py-2"
                  >
                    <QrCode className="h-5 w-5" />
                    {t.nav.memberCheckin}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 text-white hover:!text-brand-orange cursor-pointer text-base py-2"
                  >
                    <User className="h-5 w-5" />
                    {t.nav.signUp}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-white/80 hover:text-brand-orange transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-white/80 hover:text-brand-orange text-lg"
                >
                  <LogIn className="h-5 w-5" />
                  {t.nav.staffLogin}
                </Link>
                <Link
                  href="/my-qr"
                  className="flex items-center gap-2 text-white/80 hover:text-brand-orange text-lg"
                >
                  <QrCode className="h-5 w-5" />
                  {t.nav.memberCheckin}
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 text-white/80 hover:text-brand-orange text-lg"
                >
                  <User className="h-5 w-5" />
                  {t.nav.signUp}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
