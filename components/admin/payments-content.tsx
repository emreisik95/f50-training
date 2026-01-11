"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

interface PaymentsContentProps {
  payments: Payment[];
  members: Member[];
}

export function PaymentsContent({ payments, members }: PaymentsContentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    member_id: "",
    amount: "",
    payment_method: "cash",
    notes: "",
  });

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: t.admin.payments.cash,
      card: t.admin.payments.card,
      transfer: t.admin.payments.transfer,
    };
    return labels[method] || method;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      refunded: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    const labels: Record<string, string> = {
      completed: t.admin.payments.completed,
      pending: t.admin.payments.pending,
      refunded: t.admin.payments.refunded,
    };
    return (
      <Badge className={styles[status] || styles.pending}>
        {labels[status] || status}
      </Badge>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("payments") as any).insert({
        member_id: formData.member_id,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        status: "completed",
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast.success("Ödeme kaydedildi");
      setOpen(false);
      setFormData({ member_id: "", amount: "", payment_method: "cash", notes: "" });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ödeme kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t.admin.payments.title}
          </h1>
          <p className="text-white/50">{t.admin.payments.subtitle}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange-hover text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t.admin.payments.addPayment}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-brand-navy border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>{t.admin.payments.addPayment}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70">{t.admin.payments.member}</Label>
                <Select
                  value={formData.member_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, member_id: value })
                  }
                >
                  <SelectTrigger className="bg-brand-navy-light border-white/10 text-white">
                    <SelectValue placeholder={t.admin.payments.selectMember} />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-navy border-white/10">
                    {members.map((member) => (
                      <SelectItem
                        key={member.id}
                        value={member.id}
                        className="text-white focus:bg-white/10 focus:text-white"
                      >
                        {member.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">{t.admin.payments.amount}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder={t.admin.payments.enterAmount}
                  className="bg-brand-navy-light border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">{t.admin.payments.method}</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_method: value })
                  }
                >
                  <SelectTrigger className="bg-brand-navy-light border-white/10 text-white">
                    <SelectValue placeholder={t.admin.payments.selectMethod} />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-navy border-white/10">
                    <SelectItem
                      value="cash"
                      className="text-white focus:bg-white/10 focus:text-white"
                    >
                      {t.admin.payments.cash}
                    </SelectItem>
                    <SelectItem
                      value="card"
                      className="text-white focus:bg-white/10 focus:text-white"
                    >
                      {t.admin.payments.card}
                    </SelectItem>
                    <SelectItem
                      value="transfer"
                      className="text-white focus:bg-white/10 focus:text-white"
                    >
                      {t.admin.payments.transfer}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">{t.admin.payments.notes}</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder={t.admin.payments.addNotes}
                  className="bg-brand-navy-light border-white/10 text-white"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  {t.admin.common.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.member_id || !formData.amount}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white"
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t.admin.common.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-brand-navy border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">{t.admin.payments.member}</TableHead>
                <TableHead className="text-white/70">{t.admin.payments.amount}</TableHead>
                <TableHead className="text-white/70">{t.admin.payments.method}</TableHead>
                <TableHead className="text-white/70">{t.admin.payments.date}</TableHead>
                <TableHead className="text-white/70">{t.admin.payments.status}</TableHead>
                <TableHead className="text-white/70">{t.admin.payments.notes}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell colSpan={6} className="text-center py-12 text-white/50">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="h-8 w-8 text-white/30" />
                      <p>{t.admin.payments.noPayments}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {payment.member?.full_name || "-"}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {payment.amount.toLocaleString("tr-TR")} TL
                    </TableCell>
                    <TableCell className="text-white/70">
                      {getMethodLabel(payment.payment_method)}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {new Date(payment.created_at).toLocaleDateString("tr-TR")}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-white/50 max-w-[200px] truncate">
                      {payment.notes || "-"}
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
