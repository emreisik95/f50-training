import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-navy relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-brand-navy/90 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-28 items-center justify-center">
            <Link href="/" className="flex items-center -my-6">
              <Image
                src="/f50-logo.png"
                alt="F50 Training"
                width={220}
                height={220}
                className="h-40 w-auto"
                priority
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(245, 166, 35, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(245, 166, 35, 0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-6rem)]">
        <div className="relative z-10 w-full max-w-md">
          <Suspense
            fallback={
              <div className="text-white/60 text-center">Loading...</div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
