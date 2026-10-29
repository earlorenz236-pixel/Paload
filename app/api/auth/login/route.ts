import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/database.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json(
        { error: "Username or email is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim().toLowerCase();
    const adminClient = createAdminClient();

    // 1. Resolve username to the corresponding auth email identity
    let authEmail = cleanId;
    if (!cleanId.includes("@")) {
      const { data: resolvedEmail } = await (adminClient.rpc as any)(
        "get_auth_identifier_for_username",
        { p_username: cleanId }
      );

      if (resolvedEmail && typeof resolvedEmail === "string") {
        authEmail = resolvedEmail;
      } else {
        authEmail = `${cleanId}@customer.paloadko.ph`;
      }
    }

    // 2. Prepare HTTP response with cookie store
    const response = NextResponse.json({ success: true });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const serverClient = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // 3. Authenticate with Supabase Auth
    const { data, error } = await serverClient.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Invalid username or password." },
        { status: 401 }
      );
    }

    // 4. Fetch profile to return role and display name
    const { data: profile } = await adminClient
      .from("profiles")
      .select("account_name, username, role")
      .eq("id", data.user.id)
      .maybeSingle();

    const isAdmin =
      data.user.email?.toLowerCase().trim() === "sylaselienorballesteros@gmail.com" &&
      profile?.role === "admin";
    const effectiveRole = isAdmin ? "admin" : "customer";

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        username: profile?.username || cleanId,
        name: profile?.account_name || "",
        role: effectiveRole,
      },
    }, {
      headers: response.headers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
