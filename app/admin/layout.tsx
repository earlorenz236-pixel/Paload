import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Paload ko — Administrator Dashboard",
  description: "Secure management portal for Paload ko orders, payment verification, and customers.",
};

/**
 * Server-side guard component for the /admin route.
 * Strictly verifies the authenticated user session and ensures
 * the user has the 'admin' role in the database before any
 * dashboard content or data is rendered.
 */
const AUTHORIZED_ADMIN_EMAIL = "sylaselienorballesteros@gmail.com";

async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  // Instruct Next.js 16 to render per request rather than prerendering during build
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/admin-login?redirect=/admin");
  }

  // Strictly enforce authorized admin email
  const userEmail = user.email?.toLowerCase().trim();
  if (userEmail !== AUTHORIZED_ADMIN_EMAIL) {
    redirect("/admin-login?error=forbidden");
  }

  // Trusted database check for admin role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    // Authenticated user does not possess admin role in database
    redirect("/admin-login?error=forbidden");
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#060807] text-zinc-400">
          <div className="text-xs">Verifying administrator authorization...</div>
        </div>
      }
    >
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}
