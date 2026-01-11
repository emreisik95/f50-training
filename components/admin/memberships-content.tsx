"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface Membership {
  id: string;
  member: { full_name: string };
  plan: { name: string };
  start_date: string;
  end_date: string;
  status: string;
}

interface MembershipsContentProps {
  memberships: Membership[];
}

export function MembershipsContent({ memberships }: MembershipsContentProps) {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      expired: "bg-red-500/20 text-red-400 border-red-500/30",
      cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    const labels: Record<string, string> = {
      active: t.admin.memberships.active,
      expired: t.admin.memberships.expired,
      cancelled: t.admin.memberships.cancelled,
      pending: t.admin.memberships.pending,
    };
    return (
      <Badge className={styles[status] || styles.pending}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t.admin.memberships.title}
          </h1>
          <p className="text-white/50">{t.admin.memberships.subtitle}</p>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t.admin.memberships.addMembership}
        </Button>
      </div>

      <Card className="bg-brand-navy border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">{t.admin.memberships.member}</TableHead>
                <TableHead className="text-white/70">{t.admin.memberships.plan}</TableHead>
                <TableHead className="text-white/70">{t.admin.memberships.startDate}</TableHead>
                <TableHead className="text-white/70">{t.admin.memberships.endDate}</TableHead>
                <TableHead className="text-white/70">{t.admin.memberships.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell colSpan={5} className="text-center py-12 text-white/50">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="h-8 w-8 text-white/30" />
                      <p>{t.admin.memberships.noMemberships}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                memberships.map((membership) => (
                  <TableRow key={membership.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {membership.member?.full_name || "-"}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {membership.plan?.name || "-"}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {new Date(membership.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {new Date(membership.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(membership.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
