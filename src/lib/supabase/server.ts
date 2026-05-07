import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./env";

/**
 * Creates a server-side Supabase client for API routes and server components.
 * Returns `null` if Supabase is not configured.
 *
 * Each call creates a fresh client — suitable for per-request usage in
 * Next.js API routes and server components.
 */
export function getSupabaseServerClient(authHeader?: string | null): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const options: Record<string, unknown> = {};
  if (authHeader) {
    options.global = {
      headers: { Authorization: authHeader },
    };
  }

  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), options);
}
