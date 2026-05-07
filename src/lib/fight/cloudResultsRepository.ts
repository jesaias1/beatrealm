import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { CloudFightResultRow } from "@/lib/realms/realmRepository.types";

export type SaveCloudFightResultInput = {
  realmId: string;
  userId: string;
  playerName?: string;
  difficulty: string;
  outcome: string;
  rank: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  perfects: number;
  greats: number;
  goods: number;
  misses: number;
  totalPrompts: number;
  durationSeconds?: number;
};

export async function saveCloudFightResult(
  input: SaveCloudFightResultInput,
): Promise<CloudFightResultRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("fight_results")
    .insert({
      realm_id: input.realmId,
      user_id: input.userId,
      player_name: input.playerName ?? null,
      difficulty: input.difficulty,
      outcome: input.outcome,
      rank: input.rank,
      score: input.score,
      accuracy: input.accuracy,
      max_combo: input.maxCombo,
      perfects: input.perfects,
      greats: input.greats,
      goods: input.goods,
      misses: input.misses,
      total_prompts: input.totalPrompts,
      duration_seconds: input.durationSeconds ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as CloudFightResultRow;
}

export async function getLeaderboard(
  realmId: string,
  limit = 50,
): Promise<CloudFightResultRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("fight_results")
    .select("*")
    .eq("realm_id", realmId)
    .order("score", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as CloudFightResultRow[];
}

export async function getCloudRealmIdBySlug(slug: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("realms")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return (data as { id: string }).id;
}
