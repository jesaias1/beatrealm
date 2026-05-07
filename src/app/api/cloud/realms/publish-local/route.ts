import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPersistedRealmBySlug } from "@/lib/realms/realmRepository";
import { createCloudRealm } from "@/lib/realms/cloudRealmRepository";
import { getSafeExtension } from "@/lib/realms/fileValidation";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
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

  try {
    const body = (await request.json()) as { localRealmSlug: string };
    if (!body.localRealmSlug) {
      return jsonError("localRealmSlug is required.", 400);
    }

    // 1. Load local Realm metadata
    const localRealm = await getPersistedRealmBySlug(body.localRealmSlug);
    if (!localRealm) {
      return jsonError("Local Realm not found.", 404);
    }

    // 2. Read local audio file
    const rootDir = process.cwd();
    const audioLocalPath = localRealm.audioUrl.startsWith("/")
      ? path.join(/* webpackIgnore: true */ /*turbopackIgnore: true*/ rootDir, "public", localRealm.audioUrl)
      : path.join(/* webpackIgnore: true */ /*turbopackIgnore: true*/ rootDir, localRealm.audioUrl);

    let audioBuffer: Buffer;
    try {
      audioBuffer = await readFile(audioLocalPath);
    } catch {
      return jsonError(
        `Local audio file not found at ${localRealm.audioUrl}. Cannot publish without the original audio file.`,
        400,
      );
    }

    // 3. Upload audio to Supabase Storage
    const audioExt = getSafeExtension(
      localRealm.audioOriginalName || "audio.mp3",
      localRealm.audioMimeType || "audio/mpeg",
    );
    const audioStoragePath = `${user.id}/${Date.now()}-${randomUUID()}.${audioExt}`;
    const { error: audioUploadError } = await admin.storage
      .from("realm-audio")
      .upload(audioStoragePath, audioBuffer, {
        contentType: localRealm.audioMimeType || "audio/mpeg",
        upsert: false,
      });
    if (audioUploadError) {
      return jsonError(`Audio upload failed: ${audioUploadError.message}`, 500);
    }
    const { data: audioPublicUrl } = admin.storage
      .from("realm-audio")
      .getPublicUrl(audioStoragePath);

    // 4. Upload cover if present
    let coverStoragePath: string | undefined;
    let coverPublicUrl: string | undefined;
    if (localRealm.coverUrl) {
      const coverLocalPath = localRealm.coverUrl.startsWith("/")
        ? path.join(/* webpackIgnore: true */ /*turbopackIgnore: true*/ rootDir, "public", localRealm.coverUrl)
        : path.join(/* webpackIgnore: true */ /*turbopackIgnore: true*/ rootDir, localRealm.coverUrl);

      try {
        const coverBuffer = await readFile(coverLocalPath);
        const coverExt = getSafeExtension(
          localRealm.coverOriginalName || "cover.jpg",
          localRealm.coverMimeType || "image/jpeg",
        );
        coverStoragePath = `${user.id}/${Date.now()}-${randomUUID()}.${coverExt}`;
        const { error: coverUploadError } = await admin.storage
          .from("realm-covers")
          .upload(coverStoragePath, coverBuffer, {
            contentType: localRealm.coverMimeType || "image/jpeg",
            upsert: false,
          });
        if (!coverUploadError) {
          const { data } = admin.storage
            .from("realm-covers")
            .getPublicUrl(coverStoragePath);
          coverPublicUrl = data.publicUrl;
        }
      } catch {
        // Cover file missing — proceed without cover
      }
    }

    // 5. Insert cloud Realm
    const cloudRealm = await createCloudRealm(
      {
        title: localRealm.title,
        producerName: localRealm.producerName,
        genre: localRealm.genre,
        mood: localRealm.mood,
        bpm: localRealm.bpm,
        visualStyle: localRealm.visualStyle,
        description: localRealm.description,
        coverPlaceholderId: localRealm.coverPlaceholderId,
        audioUrl: audioPublicUrl.publicUrl,
        audioPath: audioStoragePath,
        audioOriginalName: localRealm.audioOriginalName,
        audioMimeType: localRealm.audioMimeType,
        audioSize: localRealm.audioSize,
        coverUrl: coverPublicUrl,
        coverPath: coverStoragePath,
        coverOriginalName: localRealm.coverOriginalName,
        coverMimeType: localRealm.coverMimeType,
        coverSize: localRealm.coverSize,
      },
      user.id,
    );

    if (!cloudRealm) {
      return jsonError("Failed to create cloud Realm record.", 500);
    }

    return NextResponse.json({ realm: cloudRealm }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to publish.";
    return jsonError(message, 500);
  }
}
