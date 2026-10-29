import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/database.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, phoneNumber, password } = body;

    // 1. Basic validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Account Name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters long." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username may only contain letters, numbers, underscores, and dots." },
        { status: 400 }
      );
    }

    if (!phoneNumber || typeof phoneNumber !== "string" || !/^\d{11}$/.test(phoneNumber.trim())) {
      return NextResponse.json(
        { error: "Phone number must be exactly 11 digits (e.g. 09123456789)." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // 2. Enforce case-insensitive username uniqueness in database
    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id")
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another." },
        { status: 409 }
      );
    }

    // 3. Create user via Supabase Admin API with pre-confirmed email (bypasses SMTP rate limits)
    const internalEmail = `${cleanUsername}@customer.paloadko.ph`;
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name.trim(),
        full_name: name.trim(),
        username: cleanUsername,
        phone_number: phoneNumber.trim(),
      },
    });

    if (authError || !authData.user) {
      if (authError?.message?.toLowerCase().includes("already registered")) {
        return NextResponse.json(
          { error: "This username is already taken. Please choose another." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError?.message || "Failed to create user account." },
        { status: 400 }
      );
    }

    // 4. Ensure customer profile is recorded with 'customer' role
    await adminClient
      .from("profiles")
      .upsert({
        id: authData.user.id,
        account_name: name.trim(),
        username: cleanUsername,
        phone_number: phoneNumber.trim(),
        role: "customer",
      });

    // 5. Establish authenticated session cookies for the client
    const response = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        username: cleanUsername,
        name: name.trim(),
      },
    });

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

    await serverClient.auth.signInWithPassword({
      email: internalEmail,
      password: password,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
