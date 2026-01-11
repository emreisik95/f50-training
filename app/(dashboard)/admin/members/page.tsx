import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye } from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage gym members and their profiles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/members/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search by name, email, or phone..."
            defaultValue={search}
            className="pl-10"
          />
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.full_name}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? "default" : "secondary"}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/members/${member.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/admin/members?page=${page - 1}${
                  search ? `&search=${search}` : ""
                }`}
              >
                Previous
              </Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/admin/members?page=${page + 1}${
                  search ? `&search=${search}` : ""
                }`}
              >
                Next
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
