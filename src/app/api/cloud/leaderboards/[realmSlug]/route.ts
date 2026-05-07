import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

type RouteContext = {
  params: Promise<{ realmSlug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return jsonError("Cloud mode is not configured.", 503);

  const { realmSlug } = await context.params;
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty") ?? "";

  // Get realm ID
  const { data: realmRow } = await supabase
    .from("realms")
    .select("id")
    .eq("slug", realmSlug)
    .maybeSingle();

  if (!realmRow) return jsonError("Cloud Realm not found.", 404);
  const realmId = (realmRow as { id: string }).id;

  // Build query with profile join
  let query = supabase
    .from("fight_results")
    .select(`
      id, user_id, player_name, score, accuracy, difficulty,
      max_combo, rank, created_at,
      profiles:user_id(username, display_name)
    `)
    .eq("realm_id", realmId)
    .order("score", { ascending: false })
    .limit(50);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query;
  if (error) return jsonError(error.message, 500);

  type ResultRow = {
    id: string; user_id: string | null; player_name: string | null;
    score: number; accuracy: number; difficulty: string;
    max_combo: number; rank: string; created_at: string;
    profiles: { username: string | null; display_name: string | null } | null;
  };

  return NextResponse.json({
    realmSlug,
    realmId,
    results: ((data as unknown as ResultRow[]) ?? []).map((row, index) => ({
      position: index + 1,
      playerName: row.profiles?.display_name || row.profiles?.username || row.player_name || "Anonymous",
      userId: row.user_id,
      score: row.score,
      accuracy: row.accuracy,
      difficulty: row.difficulty,
      maxCombo: row.max_combo,
      rank: row.rank,
      createdAt: row.created_at,
    })),
  });
}
