import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-min-32-characters!"
);

const TOKEN_EXPIRY_SECONDS = 30; // Short-lived token for security

interface Member {
  id: string;
  full_name: string;
}

interface Membership {
  id: string;
  status: string;
  end_at: string;
  remaining_credits: number | null;
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get member associated with this user
    const { data, error: memberError } = await supabase
      .from("members")
      .select("id, full_name")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .single();

    const member = data as Member | null;

    if (memberError || !member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Check if member has active membership
    const { data: membershipData, error: membershipError } = await supabase
      .from("memberships")
      .select("id, status, end_at, remaining_credits")
      .eq("member_id", member.id)
      .eq("status", "active")
      .gte("end_at", new Date().toISOString())
      .order("end_at", { ascending: false })
      .limit(1)
      .single();

    const membership = membershipData as Membership | null;

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "No active membership found" },
        { status: 403 }
      );
    }

    // Check credit-based plans
    if (
      membership.remaining_credits !== null &&
      membership.remaining_credits <= 0
    ) {
      return NextResponse.json(
        { error: "No remaining credits" },
        { status: 403 }
      );
    }

    // Generate unique token ID for replay protection
    const jti = randomUUID();
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + TOKEN_EXPIRY_SECONDS;

    // Create JWT token
    const token = await new SignJWT({
      sub: member.id,
      memberName: member.full_name,
      membershipId: membership.id,
      jti,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(JWT_SECRET);

    return NextResponse.json({
      token,
      expiresAt: new Date(exp * 1000).toISOString(),
      memberId: member.id,
      memberName: member.full_name,
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
