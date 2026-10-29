import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "../database.types";

export const AUTHORIZED_ADMIN_EMAIL = "sylaselienorballesteros@gmail.com";

/**
 * Middleware session handler and route guard.
 * Refreshes auth tokens on incoming requests and enforces server-side
 * role-based access control for /admin routes before any page renders.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Validate token against Supabase Auth server using getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Server-side route protection for /admin
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin-login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Strictly enforce authorized admin email
    const userEmail = user.email?.toLowerCase().trim();
    if (userEmail !== AUTHORIZED_ADMIN_EMAIL) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin-login";
      redirectUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }

    // Query trusted profile role from PostgreSQL database
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      // User has email but role is not admin in database
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin-login";
      redirectUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If already an authenticated administrator visits /admin-login, redirect to /admin
  if (pathname === "/admin-login" && user) {
    const userEmail = user.email?.toLowerCase().trim();
    if (userEmail === AUTHORIZED_ADMIN_EMAIL) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/admin";
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return supabaseResponse;
}
