import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@/lib/supabase/server";
import type { CheckinResult } from "@/lib/types/database.types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-min-32-characters!"
);

interface TokenPayload {
  sub: string;
  memberName: string;
  membershipId: string;
  jti: string;
  iat: number;
  exp: number;
}

interface Membership {
  id: string;
  status: string;
  end_at: string;
  remaining_credits: number | null;
  plan_id: string;
}

interface Plan {
  daily_checkin_limit: number;
}

async function logCheckin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  memberId: string,
  deviceId: string,
  result: CheckinResult,
  tokenJti: string,
  reason?: string
) {
  // Use raw query to bypass type checking issue
  const { error } = await supabase.rpc("log_checkin" as never, {
    p_member_id: memberId,
    p_device_id: deviceId,
    p_result: result,
    p_token_jti: tokenJti,
    p_reason: reason || null,
  } as never);

  if (error) {
    // Fallback: direct insert with type assertion
    await (supabase as unknown as { from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<unknown> } })
      .from("checkins")
      .insert({
        member_id: memberId,
        device_id: deviceId,
        result: result,
        reason: reason || null,
        token_jti: tokenJti,
      });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, deviceId } = await request.json();

    if (!token || !deviceId) {
      return NextResponse.json(
        { error: "Token and deviceId are required" },
        { status: 400 }
      );
    }

    // Verify JWT token
    let payload: TokenPayload;
    try {
      const { payload: verified } = await jwtVerify(token, JWT_SECRET);
      payload = verified as unknown as TokenPayload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          result: "denied",
          reason: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Check for token replay (already used)
    const { data: existingUse } = await supabase
      .from("checkin_token_uses")
      .select("jti")
      .eq("jti", payload.jti)
      .single();

    if (existingUse) {
      await logCheckin(supabase, payload.sub, deviceId, "denied", payload.jti, "Token already used");

      return NextResponse.json({
        success: false,
        result: "denied",
        reason: "Token already used",
        memberName: payload.memberName,
      });
    }

    // Verify member still has active membership
    const { data: membershipData } = await supabase
      .from("memberships")
      .select("id, status, end_at, remaining_credits, plan_id")
      .eq("id", payload.membershipId)
      .eq("status", "active")
      .single();

    const membership = membershipData as Membership | null;

    if (!membership) {
      await logCheckin(supabase, payload.sub, deviceId, "denied", payload.jti, "Membership no longer active");

      return NextResponse.json({
        success: false,
        result: "denied",
        reason: "Membership no longer active",
        memberName: payload.memberName,
      });
    }

    // Check daily check-in limit
    const today = new Date().toISOString().split("T")[0];
    const { count: todayCheckins } = await supabase
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .eq("member_id", payload.sub)
      .eq("result", "allowed")
      .gte("scanned_at", today);

    const { data: planData } = await supabase
      .from("plans")
      .select("daily_checkin_limit")
      .eq("id", membership.plan_id)
      .single();

    const plan = planData as Plan | null;

    if (plan && todayCheckins !== null && todayCheckins >= plan.daily_checkin_limit) {
      await logCheckin(supabase, payload.sub, deviceId, "denied", payload.jti, "Daily check-in limit reached");

      return NextResponse.json({
        success: false,
        result: "denied",
        reason: "Daily check-in limit reached",
        memberName: payload.memberName,
      });
    }

    // Mark token as used (replay protection)
    await (supabase as unknown as { from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<unknown> } })
      .from("checkin_token_uses")
      .insert({
        jti: payload.jti,
        member_id: payload.sub,
        device_id: deviceId,
        expires_at: new Date(payload.exp * 1000).toISOString(),
      });

    // Record successful check-in
    await logCheckin(supabase, payload.sub, deviceId, "allowed", payload.jti);

    // Decrement credits if applicable
    if (membership.remaining_credits !== null) {
      await supabase
        .from("memberships")
        .update({ remaining_credits: membership.remaining_credits - 1 } as never)
        .eq("id", membership.id);
    }

    return NextResponse.json({
      success: true,
      result: "allowed",
      memberName: payload.memberName,
      memberId: payload.sub,
    });
  } catch (error) {
    console.error("Check-in validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
