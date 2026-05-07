/**
 * Service-role Supabase client for admin operations.
 * NEVER import this from client-side code.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "./env";

let adminClient: SupabaseClient | null = null;

/**
 * Returns a service-role Supabase client that bypasses RLS.
 * Returns `null` if either the URL or service role key is missing.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured() || !getSupabaseServiceRoleKey()) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
