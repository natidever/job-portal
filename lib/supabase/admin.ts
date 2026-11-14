import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * The public site's server-side Supabase client. It uses the secret key, which bypasses RLS, so it must
 * only ever run on the server (ADR 0002: demo first, auth last). When auth lands, server
 * code switches to a user-session client and RLS takes over.
 */
export type AdminClient = SupabaseClient<Database>;

let client: AdminClient | undefined;

export function createAdminClient(): AdminClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  }
  client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
