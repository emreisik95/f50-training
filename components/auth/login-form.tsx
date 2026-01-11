"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

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
        router.push(redirectTo);
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
          F50 Gym&apos;e Hoşgeldiniz
        </h1>
        <p className="text-white/60">Hesabınıza giriş yapın</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80">
            E-posta
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
            Şifre
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
            Şifrenizi mi unuttunuz?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold py-6"
          disabled={loading}
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>

        <div className="text-sm text-center text-white/60">
          Hesabınız yok mu?{" "}
          <Link href="/signup" className="text-brand-orange hover:underline">
            Kayıt ol
          </Link>
        </div>
      </form>
    </div>
  );
}
