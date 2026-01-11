import { createClient } from "@/lib/supabase/server";
import { MembersContent } from "@/components/admin/members-content";

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

interface SearchParams {
  search?: string;
  page?: string;
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();

  let query = supabase
    .from("members")
    .select("id, full_name, email, phone, is_active, created_at", {
      count: "exact",
    })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const { data, count } = await query;
  const members = (data || []) as Member[];
  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <MembersContent
      members={members}
      totalPages={totalPages}
      currentPage={page}
      search={search}
    />
  );
}
