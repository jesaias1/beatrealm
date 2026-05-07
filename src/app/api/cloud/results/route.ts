import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { saveCloudFightResult } from "@/lib/fight/cloudResultsRepository";
import { getProfileByUserId } from "@/lib/profiles/profileRepository";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

type ResultBody = {
  realmId: string;
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

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const authHeader = request.headers.get("authorization");
  const supabase = getSupabaseServerClient(authHeader);
  if (!supabase) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return jsonError("You must be logged in to save cloud fight results.", 401);
  }

  try {
    const body = (await request.json()) as ResultBody;

    if (!body.realmId || typeof body.realmId !== "string") {
      return jsonError("realmId is required.", 400);
    }
    if (typeof body.score !== "number") {
      return jsonError("score is required.", 400);
    }
    if (typeof body.accuracy !== "number") {
      return jsonError("accuracy is required.", 400);
    }

    // Resolve player name from profile
    const profile = await getProfileByUserId(user.id);
    const resolvedPlayerName =
      body.playerName || profile?.display_name || profile?.username || user.email?.split("@")[0] || "Anonymous";

    const saved = await saveCloudFightResult({
      realmId: body.realmId,
      userId: user.id,
      playerName: resolvedPlayerName,
      difficulty: body.difficulty,
      outcome: body.outcome,
      rank: body.rank,
      score: body.score,
      accuracy: body.accuracy,
      maxCombo: body.maxCombo,
      perfects: body.perfects,
      greats: body.greats,
      goods: body.goods,
      misses: body.misses,
      totalPrompts: body.totalPrompts,
      durationSeconds: body.durationSeconds,
    });

    if (!saved) {
      return jsonError("Failed to save fight result.", 500);
    }

    return NextResponse.json({ result: saved }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save fight result.";
    return jsonError(message, 400);
  }
}
