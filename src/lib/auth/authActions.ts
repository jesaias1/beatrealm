"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthActionResult = { error?: string };

export async function signUp(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { error: "Cloud mode is not configured." };
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { error: "Cloud mode is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function signOut(): Promise<AuthActionResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { error: "Cloud mode is not configured." };
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }

  return {};
}
