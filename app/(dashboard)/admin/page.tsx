import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

async function getDashboardStats() {
  const supabase = await createClient();

  const [membersResult, membershipsResult, todayCheckinsResult] =
    await Promise.all([
      supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("memberships")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("checkins")
        .select("*", { count: "exact", head: true })
        .gte("scanned_at", new Date().toISOString().split("T")[0])
        .eq("result", "allowed"),
    ]);

  return {
    totalMembers: membersResult.count ?? 0,
    activeMemberships: membershipsResult.count ?? 0,
    todayCheckins: todayCheckinsResult.count ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return <DashboardContent stats={stats} />;
}
