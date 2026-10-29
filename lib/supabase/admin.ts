import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

/**
 * Server-only Supabase client with the service role key.
 * Used exclusively inside server Route Handlers for administrative operations
 * such as creating pre-confirmed customer accounts without sending confirmation emails.
 * 
 * NEVER import this file into client components or browser modules.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient must only be invoked in a server environment.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin environment variables. Verify NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
