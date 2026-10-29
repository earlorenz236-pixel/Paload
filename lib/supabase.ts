import { createClient as createBrowserClient } from "./supabase/client";
import type { Database } from "./database.types";

/**
 * Reusable client-side Supabase client for Paload ko.
 * Backed by @supabase/ssr createBrowserClient for automatic
 * cookie synchronization between browser and Next.js App Router.
 */
export const supabase = createBrowserClient();

export function getSupabaseClient() {
  return supabase;
}

export { createClient as createBrowserSupabaseClient } from "./supabase/client";
