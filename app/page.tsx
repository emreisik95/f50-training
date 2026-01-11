import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/components/landing/landing-page";

interface Plan {
  id: string;
  name: string;
  price: number;
  validity_days: number;
  is_active: boolean;
  type: string;
  includes_classes: boolean;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("plans")
    .select("id, name, price, validity_days, is_active, type, includes_classes")
    .eq("is_active", true)
    .order("price", { ascending: true })
    .limit(3);

  const plans = (data || []) as Plan[];

  return <LandingPage plans={plans} />;
}
