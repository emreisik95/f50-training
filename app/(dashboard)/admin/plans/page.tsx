import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";

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

export default async function PlansPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("plans")
    .select("*")
    .order("price", { ascending: true });

  const plans = (data || []) as Plan[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
          <p className="text-muted-foreground">
            Manage membership plans and pricing
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/plans/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Daily Limit</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  No plans found
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.type}</Badge>
                  </TableCell>
                  <TableCell>${plan.price}</TableCell>
                  <TableCell>{plan.validity_days} days</TableCell>
                  <TableCell>{plan.daily_checkin_limit}</TableCell>
                  <TableCell>
                    {plan.total_credits !== null ? plan.total_credits : "∞"}
                  </TableCell>
                  <TableCell>
                    {plan.includes_classes ? (
                      <Badge>Yes</Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
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
      </div>
    </div>
  );
}
