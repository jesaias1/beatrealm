import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getProfileByUserId, updateProfile } from "@/lib/profiles/profileRepository";

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

  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json({
      profile: {
        id: user.id,
        username: null,
        display_name: user.user_metadata?.display_name ?? null,
        bio: null,
        avatar_url: null,
        created_at: user.created_at,
        updated_at: user.created_at,
      },
    });
  }

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const authHeader = request.headers.get("authorization");
  const supabase = getSupabaseServerClient(authHeader);
  if (!supabase) return jsonError("Cloud mode is not configured.", 503);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return jsonError("Authentication required.", 401);

  try {
    const body = (await request.json()) as {
      username?: string;
      displayName?: string;
      bio?: string;
    };

    const result = await updateProfile(user.id, {
      username: body.username,
      displayName: body.displayName,
      bio: body.bio,
    });

    if (result.error) {
      return jsonError(result.error, 400);
    }

    return NextResponse.json({ profile: result.profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile.";
    return jsonError(message, 400);
  }
}
