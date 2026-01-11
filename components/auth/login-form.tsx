"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // If there's an explicit redirect, use it
        if (redirectTo) {
          router.push(redirectTo);
          router.refresh();
          return;
        }

        // Check if user is an admin
        const { data: admin } = await supabase
          .from("admins")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (admin) {
          // User is an admin, redirect to admin dashboard
          router.push("/admin");
        } else {
          // User is a member, redirect to member area
          router.push("/my-qr");
        }
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full bg-brand-navy-light border border-white/10 rounded-2xl p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {t.auth.login.title}
        </h1>
        <p className="text-white/60">{t.auth.login.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80">
            {t.auth.login.email}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="bg-brand-navy border-white/20 text-white placeholder:text-white/40 focus:border-brand-orange"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/80">
            {t.auth.login.password}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="bg-brand-navy border-white/20 text-white placeholder:text-white/40 focus:border-brand-orange"
          />
        </div>
        <div className="text-sm">
          <Link
            href="/forgot-password"
            className="text-brand-orange hover:underline"
          >
            {t.auth.login.forgotPassword}
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold py-6"
          disabled={loading}
        >
          {loading ? t.auth.login.signingIn : t.auth.login.signIn}
        </Button>

        <div className="text-sm text-center text-white/60">
          {t.auth.login.noAccount}{" "}
          <Link href="/signup" className="text-brand-orange hover:underline">
            {t.auth.login.signUp}
          </Link>
        </div>
      </form>
    </div>
  );
}
