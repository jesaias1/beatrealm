import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { genreOptions, moodOptions, visualStyleOptions } from "@/lib/realms/createOptions";
import { getSafeExtension, validateAudioFile, validateCoverFile } from "@/lib/realms/fileValidation";
import { createCloudRealm } from "@/lib/realms/cloudRealmRepository";
import { listCloudRealms } from "@/lib/realms/cloudRealmRepository";
import type { RealmGenre, RealmMood, RealmVisualStyle } from "@/types";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isGenre(value: string): value is RealmGenre {
  return genreOptions.includes(value as RealmGenre);
}

function isMood(value: string): value is RealmMood {
  return moodOptions.includes(value as RealmMood);
}

function isVisualStyle(value: string): value is RealmVisualStyle {
  return visualStyleOptions.some((style) => style.id === value);
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const realms = await listCloudRealms();
  return NextResponse.json({ realms: realms ?? [] });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  // Authenticate user
  const authHeader = request.headers.get("authorization");
  const supabase = getSupabaseServerClient(authHeader);
  if (!supabase) {
    return jsonError("Cloud mode is not configured.", 503);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return jsonError("You must be logged in to create a cloud Realm.", 401);
  }

  try {
    const formData = await request.formData();
    const title = getString(formData, "title");
    const producerName = getString(formData, "producerName");
    const genre = getString(formData, "genre");
    const mood = getString(formData, "mood");
    const visualStyle = getString(formData, "visualStyle");
    const description = getString(formData, "description");
    const coverPlaceholderId = getString(formData, "coverPlaceholderId");
    const bpmRaw = getString(formData, "bpm");
    const audioFile = formData.get("audioFile");
    const coverFile = formData.get("coverFile");

    if (!title) return jsonError("Beat title is required.", 400);
    if (!producerName) return jsonError("Producer name is required.", 400);
    if (!isGenre(genre)) return jsonError("Choose a valid genre.", 400);
    if (!isMood(mood)) return jsonError("Choose a valid mood.", 400);
    if (!isVisualStyle(visualStyle)) return jsonError("Choose a valid visual style.", 400);
    if (!(audioFile instanceof File) || audioFile.size === 0) {
      return jsonError("Upload an audio file.", 400);
    }

    const audioError = validateAudioFile(audioFile);
    if (audioError) return jsonError(audioError, 400);

    if (coverFile instanceof File && coverFile.size > 0) {
      const coverError = validateCoverFile(coverFile);
      if (coverError) return jsonError(coverError, 400);
    }

    const bpm = bpmRaw ? Number(bpmRaw) : undefined;
    if (bpmRaw && (!Number.isFinite(bpm) || Number(bpm) <= 0)) {
      return jsonError("BPM must be a positive number.", 400);
    }

    // Upload to Supabase Storage
    const admin = getSupabaseAdminClient();
    if (!admin) return jsonError("Storage not configured.", 503);

    const audioExt = getSafeExtension(audioFile.name, audioFile.type);
    const audioStoredName = `${Date.now()}-${randomUUID()}.${audioExt}`;
    const audioPath = `${user.id}/${audioStoredName}`;
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    const { error: audioUploadError } = await admin.storage
      .from("realm-audio")
      .upload(audioPath, audioBuffer, {
        contentType: audioFile.type,
        upsert: false,
      });

    if (audioUploadError) {
      return jsonError(`Audio upload failed: ${audioUploadError.message}`, 500);
    }

    const { data: audioUrlData } = admin.storage
      .from("realm-audio")
      .getPublicUrl(audioPath);
    const audioUrl = audioUrlData.publicUrl;

    let coverUrl: string | undefined;
    let coverPath: string | undefined;

    if (coverFile instanceof File && coverFile.size > 0) {
      const coverExt = getSafeExtension(coverFile.name, coverFile.type);
      const coverStoredName = `${Date.now()}-${randomUUID()}.${coverExt}`;
      coverPath = `${user.id}/${coverStoredName}`;
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());

      const { error: coverUploadError } = await admin.storage
        .from("realm-covers")
        .upload(coverPath, coverBuffer, {
          contentType: coverFile.type,
          upsert: false,
        });

      if (coverUploadError) {
        return jsonError(`Cover upload failed: ${coverUploadError.message}`, 500);
      }

      const { data: coverUrlData } = admin.storage
        .from("realm-covers")
        .getPublicUrl(coverPath);
      coverUrl = coverUrlData.publicUrl;
    }

    const realm = await createCloudRealm(
      {
        title,
        producerName,
        genre: genre as RealmGenre,
        mood: mood as RealmMood,
        bpm,
        visualStyle: visualStyle as RealmVisualStyle,
        description,
        coverPlaceholderId,
        audioUrl,
        audioPath,
        audioOriginalName: audioFile.name,
        audioMimeType: audioFile.type,
        audioSize: audioFile.size,
        coverUrl,
        coverPath,
        coverOriginalName: coverFile instanceof File ? coverFile.name : undefined,
        coverMimeType: coverFile instanceof File ? coverFile.type : undefined,
        coverSize: coverFile instanceof File ? coverFile.size : undefined,
      },
      user.id,
    );

    if (!realm) {
      return jsonError("Failed to create cloud Realm.", 500);
    }

    return NextResponse.json({ realm }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create cloud Realm.";
    return jsonError(message, 400);
  }
}
