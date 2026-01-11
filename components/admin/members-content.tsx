"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

interface MembersContentProps {
  members: Member[];
  totalPages: number;
  currentPage: number;
  search: string;
}

export function MembersContent({
  members,
  totalPages,
  currentPage,
  search: initialSearch,
}: MembersContentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/members?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t.admin.members.title}
          </h1>
          <p className="text-white/50">{t.admin.members.subtitle}</p>
        </div>
        <Button
          asChild
          className="bg-brand-orange hover:bg-brand-orange-hover text-white"
        >
          <Link href="/admin/members/new">
            <UserPlus className="h-4 w-4 mr-2" />
            {t.admin.members.addMember}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.members.searchPlaceholder}
            className="pl-10 bg-brand-navy border-white/10 text-white placeholder:text-white/40 focus:border-brand-orange"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="border-white/10 text-white hover:bg-white/10"
        >
          {t.admin.common.search}
        </Button>
      </form>

      {/* Table */}
      <Card className="bg-brand-navy border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">{t.admin.members.name}</TableHead>
                <TableHead className="text-white/70">{t.admin.members.email}</TableHead>
                <TableHead className="text-white/70">{t.admin.members.phone}</TableHead>
                <TableHead className="text-white/70">{t.admin.members.status}</TableHead>
                <TableHead className="text-white/70 w-[120px]">{t.admin.members.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-white/50"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <UserPlus className="h-8 w-8 text-white/30" />
                      <p>{t.admin.members.noMembers}</p>
                      <Button
                        asChild
                        size="sm"
                        className="mt-2 bg-brand-orange hover:bg-brand-orange-hover"
                      >
                        <Link href="/admin/members/new">
                          {t.admin.members.addMember}
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white">
                      {member.full_name}
                    </TableCell>
                    <TableCell className="text-white/70">{member.email}</TableCell>
                    <TableCell className="text-white/70">{member.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          member.is_active
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {member.is_active ? t.admin.members.active : t.admin.members.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                        >
                          <Link href={`/admin/members/${member.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-white/50 hover:text-brand-orange hover:bg-white/10"
                        >
                          <Link href={`/admin/members/${member.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/10 text-white hover:bg-white/10"
            >
              <Link
                href={`/admin/members?page=${currentPage - 1}${
                  initialSearch ? `&search=${initialSearch}` : ""
                }`}
              >
                {t.admin.common.previous}
              </Link>
            </Button>
          )}
          <span className="text-sm text-white/50 px-4">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/10 text-white hover:bg-white/10"
            >
              <Link
                href={`/admin/members?page=${currentPage + 1}${
                  initialSearch ? `&search=${initialSearch}` : ""
                }`}
              >
                {t.admin.common.next}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
