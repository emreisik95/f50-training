"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Edit } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

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

interface PlansContentProps {
  plans: Plan[];
}

export function PlansContent({ plans }: PlansContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t.admin.plans.title}
          </h1>
          <p className="text-white/50">{t.admin.plans.subtitle}</p>
        </div>
        <Button asChild className="bg-brand-orange hover:bg-brand-orange-hover text-white">
          <Link href="/admin/plans/new">
            <Plus className="h-4 w-4 mr-2" />
            {t.admin.plans.addPlan}
          </Link>
        </Button>
      </div>

      <Card className="bg-brand-navy border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">{t.admin.plans.name}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.type}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.price}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.duration}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.dailyLimit}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.credits}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.classes}</TableHead>
                <TableHead className="text-white/70">{t.admin.common.status}</TableHead>
                <TableHead className="text-white/70 w-[100px]">{t.admin.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell colSpan={9} className="text-center py-12 text-white/50">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-white/30" />
                      <p>{t.admin.plans.noPlans}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{plan.name}</TableCell>
                    <TableCell>
                      <Badge className="bg-brand-orange/20 text-brand-orange border-brand-orange/30">
                        {plan.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {plan.price.toLocaleString("tr-TR")} TL
                    </TableCell>
                    <TableCell className="text-white/70">
                      {plan.validity_days} {t.admin.plans.days}
                    </TableCell>
                    <TableCell className="text-white/70">{plan.daily_checkin_limit}</TableCell>
                    <TableCell className="text-white/70">
                      {plan.total_credits !== null ? plan.total_credits : "∞"}
                    </TableCell>
                    <TableCell>
                      {plan.includes_classes ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {t.admin.plans.yes}
                        </Badge>
                      ) : (
                        <span className="text-white/50">{t.admin.plans.no}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          plan.is_active
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {plan.is_active ? t.admin.plans.active : t.admin.plans.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <Link href={`/admin/plans/${plan.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
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
