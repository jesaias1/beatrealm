import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CloudRealmRow } from "@/lib/realms/realmRepository.types";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return jsonError("Cloud mode is not configured.", 503);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const mood = searchParams.get("mood") ?? "";
  const visualStyle = searchParams.get("visualStyle") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const limit = Math.min(Number(searchParams.get("limit") ?? "24"), 100);
  const offset = Number(searchParams.get("offset") ?? "0");

  let query = supabase
    .from("realms")
    .select("*", { count: "exact" })
    .eq("is_public", true);

  if (search) {
    query = query.or(`title.ilike.%${search}%,producer_name.ilike.%${search}%`);
  }
  if (genre) {
    query = query.eq("genre", genre);
  }
  if (mood) {
    query = query.eq("mood", mood);
  }
  if (visualStyle) {
    query = query.eq("visual_style", visualStyle);
  }

  switch (sort) {
    case "title":
      query = query.order("title", { ascending: true });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return jsonError(error.message, 500);
  }

  const rows = (data ?? []) as CloudRealmRow[];

  return NextResponse.json({
    realms: rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      producerName: row.producer_name,
      producerSlug: row.producer_slug,
      genre: row.genre,
      mood: row.mood,
      bpm: row.bpm,
      visualStyle: row.visual_style,
      description: row.description,
      coverUrl: row.cover_url,
      coverPlaceholderId: row.cover_placeholder_id,
      createdAt: row.created_at,
      source: "cloud" as const,
    })),
    total: count ?? 0,
    limit,
    offset,
  });
}
