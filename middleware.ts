import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
const kioskRoutes = ["/scanner"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return supabaseResponse;
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if route is kiosk
  const isKioskRoute = kioskRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if not authenticated and trying to access protected route
  if (!user && !isPublicRoute && !isKioskRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Check role-based access for admin routes
  if (user && pathname.startsWith("/admin")) {
    const { data } = await supabase
      .from("staff_users")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    const staffUser = data as { role: string; is_active: boolean } | null;

    if (!staffUser || !staffUser.is_active) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
