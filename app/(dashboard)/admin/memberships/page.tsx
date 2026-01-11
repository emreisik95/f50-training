import { createClient } from "@/lib/supabase/server";
import { MembershipsContent } from "@/components/admin/memberships-content";

interface Membership {
  id: string;
  member: { full_name: string };
  plan: { name: string };
  start_date: string;
  end_date: string;
  status: string;
}

export default async function MembershipsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("memberships")
    .select(`
      id,
      start_date,
      end_date,
      status,
      member:members(full_name),
      plan:membership_plans(name)
    `)
    .order("created_at", { ascending: false });

  const memberships = (data || []) as unknown as Membership[];

  return <MembershipsContent memberships={memberships} />;
}
