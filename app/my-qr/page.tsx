import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QRDisplay } from "@/components/checkin/qr-display";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default async function MyQRPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/my-qr");
  }

  // Check if user has member record
  const { data: member } = await supabase
    .from("members")
    .select("id, full_name")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  const memberData = member as { id: string; full_name: string } | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Dumbbell className="h-6 w-6" />
          <span className="font-bold">F50 Gym</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {memberData ? (
          <QRDisplay />
        ) : (
          <div className="text-center text-white">
            <h2 className="text-xl font-semibold mb-2">No Member Profile</h2>
            <p className="text-slate-300">
              You don&apos;t have a member profile linked to your account.
              Please contact the front desk.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
