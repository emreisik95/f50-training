"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, DollarSign, CheckCircle, UserPlus, Receipt, QrCode } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface DashboardContentProps {
  stats: {
    totalMembers: number;
    activeMemberships: number;
    todayCheckins: number;
  };
}

export function DashboardContent({ stats }: DashboardContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t.dashboard.title}
        </h1>
        <p className="text-white/50">{t.dashboard.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-brand-navy border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {t.dashboard.totalMembers}
            </CardTitle>
            <Users className="h-5 w-5 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalMembers}</div>
            <p className="text-xs text-white/50">{t.dashboard.allRegistered}</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-navy border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {t.dashboard.activeMemberships}
            </CardTitle>
            <CreditCard className="h-5 w-5 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.activeMemberships}</div>
            <p className="text-xs text-white/50">{t.dashboard.activeDesc}</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-navy border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {t.dashboard.todayCheckins}
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.todayCheckins}</div>
            <p className="text-xs text-white/50">{t.dashboard.checkinsDesc}</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-navy border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {t.dashboard.revenue}
            </CardTitle>
            <DollarSign className="h-5 w-5 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">--</div>
            <p className="text-xs text-white/50">{t.dashboard.thisMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-brand-navy border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t.dashboard.quickActions}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white justify-start"
              asChild
            >
              <Link href="/admin/members/new">
                <UserPlus className="mr-2 h-4 w-4" />
                {t.dashboard.addNewMember}
              </Link>
            </Button>
            <Button
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 justify-start"
              variant="outline"
              asChild
            >
              <Link href="/admin/payments/new">
                <Receipt className="mr-2 h-4 w-4" />
                {t.dashboard.recordPayment}
              </Link>
            </Button>
            <Button
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 justify-start"
              variant="outline"
              asChild
            >
              <Link href="/scanner">
                <QrCode className="mr-2 h-4 w-4" />
                {t.dashboard.openScanner}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-brand-navy border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t.dashboard.expiringMemberships}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/50">{t.dashboard.noExpiring}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
