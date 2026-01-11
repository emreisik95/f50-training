"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [includesClasses, setIncludesClasses] = useState(false);
  const [hasCredits, setHasCredits] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const planData = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      description: (formData.get("description") as string) || null,
      price: parseFloat(formData.get("price") as string),
      validity_days: parseInt(formData.get("validity_days") as string),
      daily_checkin_limit: parseInt(formData.get("daily_checkin_limit") as string) || 1,
      total_credits: hasCredits
        ? parseInt(formData.get("total_credits") as string)
        : null,
      includes_classes: includesClasses,
    };

    const { error } = await (supabase as unknown as {
      from: (table: string) => {
        insert: (data: Record<string, unknown>) => Promise<{ error: Error | null }>;
      };
    })
      .from("plans")
      .insert(planData);

    if (error) {
      toast.error("Failed to create plan");
      setLoading(false);
      return;
    }

    toast.success("Plan created successfully");
    router.push("/admin/plans");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/plans">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Plan</h1>
          <p className="text-muted-foreground">
            Create a new membership plan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>
              Configure the membership plan settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Monthly Membership"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Plan Type *</Label>
              <select
                id="type"
                name="type"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="day_pass">Day Pass</option>
                <option value="entry_pack">Entry Pack (Credits)</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Plan description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="99.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validity_days">Validity (Days) *</Label>
                <Input
                  id="validity_days"
                  name="validity_days"
                  type="number"
                  required
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily_checkin_limit">Daily Check-in Limit</Label>
              <Input
                id="daily_checkin_limit"
                name="daily_checkin_limit"
                type="number"
                defaultValue={1}
                placeholder="1"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="has_credits">Credit-Based Plan</Label>
                <p className="text-sm text-muted-foreground">
                  Limit total entries instead of time-based
                </p>
              </div>
              <Switch
                id="has_credits"
                checked={hasCredits}
                onCheckedChange={setHasCredits}
              />
            </div>

            {hasCredits && (
              <div className="space-y-2">
                <Label htmlFor="total_credits">Total Credits *</Label>
                <Input
                  id="total_credits"
                  name="total_credits"
                  type="number"
                  required={hasCredits}
                  placeholder="10"
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="includes_classes">Includes Classes</Label>
                <p className="text-sm text-muted-foreground">
                  Members can book group classes
                </p>
              </div>
              <Switch
                id="includes_classes"
                checked={includesClasses}
                onCheckedChange={setIncludesClasses}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/plans">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Plan
          </Button>
        </div>
      </form>
    </div>
  );
}
