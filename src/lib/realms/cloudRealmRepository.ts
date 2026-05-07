import type { PersistedRealm } from "@/types";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { slugify, withUniqueSuffix } from "./slugify";
import type { CloudRealmInsert, CloudRealmRow } from "./realmRepository.types";

function rowToPersistedRealm(row: CloudRealmRow): PersistedRealm {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    producerName: row.producer_name,
    producerSlug: row.producer_slug,
    genre: row.genre as PersistedRealm["genre"],
    mood: row.mood as PersistedRealm["mood"],
    bpm: row.bpm ?? undefined,
    visualStyle: row.visual_style as PersistedRealm["visualStyle"],
    description: row.description ?? undefined,
    audioUrl: row.audio_url,
    audioOriginalName: row.audio_original_name ?? "",
    audioMimeType: row.audio_mime_type ?? "",
    audioSize: row.audio_size ?? 0,
    coverUrl: row.cover_url ?? undefined,
    coverOriginalName: row.cover_original_name ?? undefined,
    coverMimeType: row.cover_mime_type ?? undefined,
    coverSize: row.cover_size ?? undefined,
    coverPlaceholderId: row.cover_placeholder_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: "cloud",
    ownerId: row.owner_id,
    audioPath: row.audio_path,
    coverPath: row.cover_path ?? undefined,
    isPublic: row.is_public,
  };
}

export async function listCloudRealms(): Promise<PersistedRealm[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("realms")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error || !data) return null;
  return (data as CloudRealmRow[]).map(rowToPersistedRealm);
}

export async function getCloudRealmBySlug(slug: string): Promise<PersistedRealm | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("realms")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (error || !data) return null;
  return rowToPersistedRealm(data as CloudRealmRow);
}

export async function listCloudRealmsByProducer(producerSlug: string): Promise<PersistedRealm[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("realms")
    .select("*")
    .eq("producer_slug", producerSlug)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error || !data) return null;
  return (data as CloudRealmRow[]).map(rowToPersistedRealm);
}

export async function listCloudRealmsByOwner(userId: string): Promise<PersistedRealm[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("realms")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return null;
  return (data as CloudRealmRow[]).map(rowToPersistedRealm);
}

export async function createCloudRealm(
  input: CloudRealmInsert,
  userId: string,
): Promise<PersistedRealm | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const producerSlug = slugify(input.producerName);

  // Generate unique slug
  const { data: existing } = await supabase
    .from("realms")
    .select("slug")
    .like("slug", `${slugify(input.title)}%`);

  const existingSlugs = (existing ?? []).map((row: { slug: string }) => row.slug);
  const slug = withUniqueSuffix(slugify(input.title), existingSlugs);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("realms")
    .insert({
      owner_id: userId,
      slug,
      title: input.title.trim(),
      producer_name: input.producerName.trim(),
      producer_slug: producerSlug,
      genre: input.genre,
      mood: input.mood,
      bpm: input.bpm ?? null,
      visual_style: input.visualStyle,
      description: input.description?.trim() || null,
      audio_url: input.audioUrl,
      audio_path: input.audioPath,
      audio_original_name: input.audioOriginalName,
      audio_mime_type: input.audioMimeType,
      audio_size: input.audioSize,
      cover_url: input.coverUrl ?? null,
      cover_path: input.coverPath ?? null,
      cover_original_name: input.coverOriginalName ?? null,
      cover_mime_type: input.coverMimeType ?? null,
      cover_size: input.coverSize ?? null,
      cover_placeholder_id: input.coverPlaceholderId ?? null,
      is_public: true,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return rowToPersistedRealm(data as CloudRealmRow);
}

export async function deleteCloudRealm(id: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("realms")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId);

  return !error;
}

export type CloudRealmUpdate = {
  title?: string;
  genre?: string;
  mood?: string;
  bpm?: number | null;
  visualStyle?: string;
  description?: string | null;
  isPublic?: boolean;
};

export async function updateCloudRealm(
  id: string,
  userId: string,
  updates: CloudRealmUpdate,
): Promise<PersistedRealm | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) patch.title = updates.title.trim();
  if (updates.genre !== undefined) patch.genre = updates.genre;
  if (updates.mood !== undefined) patch.mood = updates.mood;
  if (updates.bpm !== undefined) patch.bpm = updates.bpm;
  if (updates.visualStyle !== undefined) patch.visual_style = updates.visualStyle;
  if (updates.description !== undefined) patch.description = updates.description?.trim() || null;
  if (updates.isPublic !== undefined) patch.is_public = updates.isPublic;

  const { data, error } = await supabase
    .from("realms")
    .update(patch)
    .eq("id", id)
    .eq("owner_id", userId)
    .select("*")
    .single();

  if (error || !data) return null;
  return rowToPersistedRealm(data as CloudRealmRow);
}

export async function deleteCloudRealmWithStorage(
  id: string,
  userId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  // Get realm to find storage paths
  const { data: realm } = await supabase
    .from("realms")
    .select("audio_path, cover_path")
    .eq("id", id)
    .eq("owner_id", userId)
    .maybeSingle();

  // Delete the DB row first
  const deleted = await deleteCloudRealm(id, userId);
  if (!deleted) return false;

  // Best-effort storage cleanup
  if (realm) {
    const row = realm as { audio_path: string; cover_path: string | null };
    if (row.audio_path) {
      await supabase.storage.from("realm-audio").remove([row.audio_path]).catch(() => {});
    }
    if (row.cover_path) {
      await supabase.storage.from("realm-covers").remove([row.cover_path]).catch(() => {});
    }
  }

  return true;
}
