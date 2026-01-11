import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, DollarSign, CheckCircle } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const supabase = await createClient();

  // Get counts
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your gym operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              All registered members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Memberships
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMemberships}</div>
            <p className="text-xs text-muted-foreground">
              Currently active plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Check-ins
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCheckins}</div>
            <p className="text-xs text-muted-foreground">
              Members checked in today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/admin/members/new">Add New Member</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/admin/payments/new">Record Payment</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/scanner">Open Scanner</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expiring Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No memberships expiring in the next 7 days
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
