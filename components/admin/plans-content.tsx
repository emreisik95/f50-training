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
import { Plus, Package } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
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
        <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t.admin.plans.addPlan}
        </Button>
      </div>

      <Card className="bg-brand-navy border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">{t.admin.plans.name}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.price}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.duration}</TableHead>
                <TableHead className="text-white/70">{t.admin.plans.features}</TableHead>
                <TableHead className="text-white/70">{t.admin.common.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell colSpan={5} className="text-center py-12 text-white/50">
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
                    <TableCell className="text-white/70">
                      {plan.price.toLocaleString("tr-TR")} TL
                    </TableCell>
                    <TableCell className="text-white/70">
                      {plan.duration_days} {t.admin.plans.days}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {plan.features?.length || 0} {t.admin.plans.features.toLowerCase()}
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
