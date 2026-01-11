import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, CreditCard, History } from "lucide-react";
import Link from "next/link";

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  internal_notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface Membership {
  id: string;
  status: string;
  start_at: string;
  end_at: string;
  remaining_credits: number | null;
  plans: { name: string; type: string } | null;
}

interface Checkin {
  id: string;
  scanned_at: string;
  result: string;
  reason: string | null;
}

interface PageParams {
  id: string;
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: memberData, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !memberData) {
    notFound();
  }

  const member = memberData as unknown as Member;

  // Get memberships
  const { data: membershipsData } = await supabase
    .from("memberships")
    .select("id, status, start_at, end_at, remaining_credits, plans(name, type)")
    .eq("member_id", id)
    .order("created_at", { ascending: false });

  const memberships = (membershipsData || []) as unknown as Membership[];

  // Get recent check-ins
  const { data: checkinsData } = await supabase
    .from("checkins")
    .select("id, scanned_at, result, reason")
    .eq("member_id", id)
    .order("scanned_at", { ascending: false })
    .limit(10);

  const checkins = (checkinsData || []) as unknown as Checkin[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/members">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {member.full_name}
            </h1>
            <p className="text-muted-foreground">{member.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/members/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{member.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={member.is_active ? "default" : "secondary"}>
                  {member.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {member.date_of_birth && (
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {new Date(member.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              )}
              {member.gender && (
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{member.gender}</p>
                </div>
              )}
            </div>
            {member.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{member.address}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {new Date(member.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.emergency_contact_name || member.emergency_contact_phone ? (
              <>
                {member.emergency_contact_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{member.emergency_contact_name}</p>
                  </div>
                )}
                {member.emergency_contact_phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{member.emergency_contact_phone}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No emergency contact set</p>
            )}
            {member.internal_notes && (
              <div>
                <p className="text-sm text-muted-foreground">Internal Notes</p>
                <p className="font-medium">{member.internal_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Memberships
              </CardTitle>
              <CardDescription>Active and past memberships</CardDescription>
            </div>
            <Button size="sm" asChild>
              <Link href={`/admin/members/${id}/membership/new`}>
                Add Membership
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {memberships.length === 0 ? (
              <p className="text-muted-foreground">No memberships</p>
            ) : (
              <div className="space-y-3">
                {memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{membership.plans?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(membership.start_at).toLocaleDateString()} -{" "}
                        {new Date(membership.end_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          membership.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {membership.status}
                      </Badge>
                      {membership.remaining_credits !== null && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {membership.remaining_credits} credits left
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Check-ins
            </CardTitle>
            <CardDescription>Last 10 check-in attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {checkins.length === 0 ? (
              <p className="text-muted-foreground">No check-ins yet</p>
            ) : (
              <div className="space-y-2">
                {checkins.map((checkin) => (
                  <div
                    key={checkin.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm">
                        {new Date(checkin.scanned_at).toLocaleString()}
                      </p>
                      {checkin.reason && (
                        <p className="text-xs text-muted-foreground">
                          {checkin.reason}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        checkin.result === "allowed" ? "default" : "destructive"
                      }
                    >
                      {checkin.result}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
