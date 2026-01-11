import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LanguageProvider } from "@/lib/i18n";
import type { UserRole } from "@/lib/types/database.types";

interface StaffUser {
  role: UserRole;
  full_name: string;
  is_active: boolean;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch staff user info
  const { data, error } = await supabase
    .from("staff_users")
    .select("role, full_name, is_active")
    .eq("id", user.id)
    .single();

  const staffUser = data as StaffUser | null;

  if (error || !staffUser || !staffUser.is_active) {
    redirect("/unauthorized");
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="flex h-screen overflow-hidden bg-brand-navy">
          <Sidebar
            userRole={staffUser.role}
            userName={staffUser.full_name}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header
              userName={staffUser.full_name}
              userRole={staffUser.role}
            />
            <main className="flex-1 overflow-y-auto p-6 bg-brand-navy-light">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
