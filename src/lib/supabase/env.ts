/**
 * Supabase environment variable helpers.
 * Works in both client and server contexts.
 */

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

/**
 * Service role key — server-only. Never import this from client code.
 */
export function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

/**
 * Returns `true` when the minimum Supabase env vars are present,
 * meaning cloud mode can be enabled.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
