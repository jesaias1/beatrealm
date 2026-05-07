import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  getCloudRealmBySlug,
  deleteCloudRealmWithStorage,
  updateCloudRealm,
} from "@/lib/realms/cloudRealmRepository";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const { slug } = await context.params;
  const realm = await getCloudRealmBySlug(slug);

  if (!realm) {
    return jsonError("Cloud Realm not found.", 404);
  }

  return NextResponse.json({ realm });
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const authHeader = request.headers.get("authorization");
  const supabase = getSupabaseServerClient(authHeader);
  if (!supabase) return jsonError("Cloud mode is not configured.", 503);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return jsonError("Authentication required.", 401);

  const { slug } = await context.params;
  const realm = await getCloudRealmBySlug(slug);
  if (!realm) return jsonError("Cloud Realm not found.", 404);
  if (realm.ownerId !== user.id) return jsonError("You can only edit your own Realms.", 403);

  try {
    const body = (await request.json()) as {
      title?: string;
      genre?: string;
      mood?: string;
      bpm?: number | null;
      visualStyle?: string;
      description?: string | null;
      isPublic?: boolean;
    };

    const updated = await updateCloudRealm(realm.id, user.id, body);
    if (!updated) return jsonError("Failed to update Realm.", 500);

    return NextResponse.json({ realm: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update Realm.";
    return jsonError(message, 400);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
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
    return jsonError("Authentication required.", 401);
  }

  const { slug } = await context.params;
  const realm = await getCloudRealmBySlug(slug);
  if (!realm) {
    return jsonError("Cloud Realm not found.", 404);
  }

  if (realm.ownerId !== user.id) {
    return jsonError("You can only delete your own Realms.", 403);
  }

  const deleted = await deleteCloudRealmWithStorage(realm.id, user.id);
  if (!deleted) {
    return jsonError("Failed to delete Realm.", 500);
  }

  return NextResponse.json({ deleted: true });
}
