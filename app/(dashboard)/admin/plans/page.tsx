import { createClient } from "@/lib/supabase/server";
import { PlansContent } from "@/components/admin/plans-content";

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  validity_days: number;
  daily_checkin_limit: number;
  total_credits: number | null;
  includes_classes: boolean;
  is_active: boolean;
}

export default async function PlansPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("plans")
    .select("*")
    .order("price", { ascending: true });

  const plans = (data || []) as Plan[];

  return <PlansContent plans={plans} />;
}
