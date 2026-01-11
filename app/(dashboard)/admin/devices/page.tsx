import { createClient } from "@/lib/supabase/server";
import { DevicesContent } from "@/components/admin/devices-content";

interface Device {
  id: string;
  name: string;
  location: string;
  status: string;
  last_seen: string;
}

export default async function DevicesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("devices")
    .select("id, name, location, status, last_seen")
    .order("created_at", { ascending: false });

  const devices = (data || []) as Device[];

  return <DevicesContent devices={devices} />;
}
