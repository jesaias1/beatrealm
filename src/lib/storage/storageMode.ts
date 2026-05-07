import { isSupabaseConfigured } from "@/lib/supabase/env";

export type StorageMode = "local" | "cloud";

/**
 * Returns the current storage mode based on environment configuration.
 */
export function getStorageMode(): StorageMode {
  return isSupabaseConfigured() ? "cloud" : "local";
}
