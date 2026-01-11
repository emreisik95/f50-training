"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Hesap oluşturuldu! Lütfen e-postanızı doğrulayın.");
        router.push("/login");
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
        <h1 className="text-2xl font-bold text-white mb-2">Hesap Oluştur</h1>
        <p className="text-white/60">Bugün F50 Gym&apos;e katıl</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white/80">
            Ad Soyad
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Ahmet Yılmaz"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
            disabled={loading}
            className="bg-brand-navy border-white/20 text-white placeholder:text-white/40 focus:border-brand-orange"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80">
            E-posta
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={loading}
            className="bg-brand-navy border-white/20 text-white placeholder:text-white/40 focus:border-brand-orange"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white/80">
            Telefon
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+90 (555) 123-4567"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
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
            placeholder="Min. 8 karakter"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            minLength={8}
            disabled={loading}
            className="bg-brand-navy border-white/20 text-white placeholder:text-white/40 focus:border-brand-orange"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold py-6"
          disabled={loading}
        >
          {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
        </Button>

        <div className="text-sm text-center text-white/60">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-brand-orange hover:underline">
            Giriş yap
          </Link>
        </div>
      </form>
    </div>
  );
}
