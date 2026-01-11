import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/admin/settings-content";

interface AdminProfile {
  full_name: string;
  email: string;
  role: string;
}

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile from admins table
  const { data: admin } = await supabase
    .from("admins")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single<AdminProfile>();

  const userData = {
    full_name: admin?.full_name || user.email?.split("@")[0] || "Admin",
    email: admin?.email || user.email || "",
    role: admin?.role || "admin",
  };

  return <SettingsContent user={userData} />;
}
