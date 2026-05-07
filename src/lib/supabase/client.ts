"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./env";

let browserClient: SupabaseClient | null = null;

/**
 * Returns a browser-side Supabase client, or `null` if env vars are missing.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(getSupabaseUrl(), getSupabaseAnonKey());
  }

  return browserClient;
}
