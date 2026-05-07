import { NextResponse } from "next/server";
import {
  createPersistedRealm,
  listPersistedRealms,
} from "@/lib/realms/realmRepository";
import { genreOptions, moodOptions, visualStyleOptions } from "@/lib/realms/createOptions";
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
  const realms = await listPersistedRealms();
  return NextResponse.json({ realms });
}

export async function POST(request: Request) {
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

    if (!title) {
      return jsonError("Beat title is required.", 400);
    }
    if (!producerName) {
      return jsonError("Producer name is required.", 400);
    }
    if (!isGenre(genre)) {
      return jsonError("Choose a valid genre.", 400);
    }
    if (!isMood(mood)) {
      return jsonError("Choose a valid mood.", 400);
    }
    if (!isVisualStyle(visualStyle)) {
      return jsonError("Choose a valid visual style.", 400);
    }
    if (!(audioFile instanceof File) || audioFile.size === 0) {
      return jsonError("Upload an audio file.", 400);
    }

    const bpm = bpmRaw ? Number(bpmRaw) : undefined;
    if (bpmRaw && (!Number.isFinite(bpm) || Number(bpm) <= 0)) {
      return jsonError("BPM must be a positive number.", 400);
    }

    const realm = await createPersistedRealm({
      title,
      producerName,
      genre,
      mood,
      bpm,
      visualStyle,
      description,
      coverPlaceholderId,
      audioFile,
      coverFile:
        coverFile instanceof File && coverFile.size > 0 ? coverFile : undefined,
    });

    return NextResponse.json({ realm }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create Realm.";
    return jsonError(message, 400);
  }
}
