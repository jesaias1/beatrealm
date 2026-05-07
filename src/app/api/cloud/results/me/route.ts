import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const authHeader = request.headers.get("authorization");
  const supabase = getSupabaseServerClient(authHeader);
  if (!supabase) return jsonError("Cloud mode is not configured.", 503);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return jsonError("Authentication required.", 401);

  const admin = getSupabaseAdminClient();
  if (!admin) return jsonError("Cloud mode is not configured.", 503);

  const { data, error } = await admin
    .from("fight_results")
    .select(`
      id, realm_id, difficulty, outcome, rank, score, accuracy,
      max_combo, created_at,
      realms!inner(slug, title, producer_name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return jsonError(error.message, 500);
  }

  type JoinedRow = {
    id: string; realm_id: string; difficulty: string;
    outcome: string; rank: string; score: number;
    accuracy: number; max_combo: number; created_at: string;
    realms: { slug: string; title: string; producer_name: string };
  };

  return NextResponse.json({
    results: (data as unknown as JoinedRow[] ?? []).map((row) => ({
      id: row.id,
      realmSlug: row.realms.slug,
      realmTitle: row.realms.title,
      producerName: row.realms.producer_name,
      difficulty: row.difficulty,
      outcome: row.outcome,
      rank: row.rank,
      score: row.score,
      accuracy: row.accuracy,
      maxCombo: row.max_combo,
      createdAt: row.created_at,
    })),
  });
}
