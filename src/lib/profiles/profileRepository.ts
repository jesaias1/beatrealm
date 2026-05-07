import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeUsername, validateUsername } from "./username";

export type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = {
  username?: string;
  displayName?: string;
  bio?: string;
};

export type ProfileUpdateResult = {
  profile?: ProfileRow;
  error?: string;
};

export async function getProfileByUserId(userId: string): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as ProfileRow;
}

export async function getProfileByUsername(username: string): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error || !data) return null;
  return data as ProfileRow;
}

export async function isUsernameTaken(
  username: string,
  excludeUserId?: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  let query = supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase());

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data } = await query.maybeSingle();
  return Boolean(data);
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<ProfileUpdateResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Cloud mode is not configured." };
  }
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { error: "Cloud mode is not configured." };
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.username !== undefined) {
    const normalized = normalizeUsername(updates.username);
    const validation = validateUsername(normalized);
    if (!validation.valid) {
      return { error: validation.error };
    }
    const taken = await isUsernameTaken(normalized, userId);
    if (taken) {
      return { error: "This username is already taken." };
    }
    patch.username = normalized;
  }

  if (updates.displayName !== undefined) {
    const trimmed = updates.displayName.trim();
    if (trimmed.length > 60) {
      return { error: "Display name must be 60 characters or fewer." };
    }
    patch.display_name = trimmed || null;
  }

  if (updates.bio !== undefined) {
    const trimmed = updates.bio.trim();
    if (trimmed.length > 300) {
      return { error: "Bio must be 300 characters or fewer." };
    }
    patch.bio = trimmed || null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "This username is already taken." };
    }
    return { error: error.message };
  }

  return { profile: data as ProfileRow };
}
