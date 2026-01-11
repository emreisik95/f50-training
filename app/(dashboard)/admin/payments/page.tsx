import { createClient } from "@/lib/supabase/server";
import { PaymentsContent } from "@/components/admin/payments-content";

interface Payment {
  id: string;
  member: { full_name: string } | null;
  amount: number;
  payment_method: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Member {
  id: string;
  full_name: string;
}

export default async function PaymentsPage() {
  const supabase = await createClient();

  // Get payments with member info
  const { data: paymentsData } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      payment_method,
      status,
      notes,
      created_at,
      member:members(full_name)
    `)
    .order("created_at", { ascending: false });

  // Get all members for the dropdown
  const { data: membersData } = await supabase
    .from("members")
    .select("id, full_name")
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  const payments = (paymentsData || []) as unknown as Payment[];
  const members = (membersData || []) as Member[];

  return <PaymentsContent payments={payments} members={members} />;
}
