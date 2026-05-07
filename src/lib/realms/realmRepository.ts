import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PersistedRealm, RealmGenre, RealmMood, RealmVisualStyle } from "@/types";
import {
  getSafeExtension,
  validateAudioFile,
  validateCoverFile,
} from "./fileValidation";
import { slugify, withUniqueSuffix } from "./slugify";

const rootDir = process.cwd();
const dataDir = path.join(rootDir, "data");
const dataFile = path.join(dataDir, "realms.json");
const uploadRoot = path.join(rootDir, "public", "uploads");
const audioDir = path.join(uploadRoot, "audio");
const coverDir = path.join(uploadRoot, "covers");

type CreatePersistedRealmInput = {
  title: string;
  producerName: string;
  genre: RealmGenre;
  mood: RealmMood;
  bpm?: number;
  visualStyle: RealmVisualStyle;
  description?: string;
  coverPlaceholderId?: string;
  audioFile: File;
  coverFile?: File;
};

async function ensureStorage() {
  try {
    await mkdir(dataDir, { recursive: true });
    await mkdir(audioDir, { recursive: true });
    await mkdir(coverDir, { recursive: true });
  } catch (error: any) {
    // Ignore read-only file system errors (e.g., on Vercel)
    if (error.code !== "EROFS" && error.code !== "EPERM") {
      console.warn("Could not ensure storage directories:", error.message);
    }
  }
}

async function writeRealms(realms: PersistedRealm[]) {
  await ensureStorage();
  try {
    await writeFile(dataFile, `${JSON.stringify(realms, null, 2)}\n`, "utf8");
  } catch (error: any) {
    if (error.code !== "EROFS" && error.code !== "EPERM") {
      console.warn("Could not write local realms:", error.message);
    }
  }
}

async function savePublicFile(file: File, directory: string, publicBase: string) {
  await ensureStorage();
  const extension = getSafeExtension(file.name, file.type);
  const storedName = `${Date.now()}-${randomUUID()}.${extension}`;
  const storedPath = path.join(directory, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(storedPath, buffer);

  return `${publicBase}/${storedName}`;
}

export async function listPersistedRealms() {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as PersistedRealm[];
    return parsed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await writeRealms([]);
    }
    return [];
  }
}

export async function getPersistedRealmBySlug(slug: string) {
  const realms = await listPersistedRealms();
  return realms.find((realm) => realm.slug === slug) ?? null;
}

export async function listPersistedRealmsByProducer(producerSlug: string) {
  const realms = await listPersistedRealms();
  return realms.filter((realm) => realm.producerSlug === producerSlug);
}

export async function createPersistedRealm(input: CreatePersistedRealmInput) {
  const title = input.title.trim();
  const producerName = input.producerName.trim();

  if (!title) {
    throw new Error("Beat title is required.");
  }
  if (!producerName) {
    throw new Error("Producer name is required.");
  }

  const audioError = validateAudioFile(input.audioFile);
  if (audioError) {
    throw new Error(audioError);
  }

  if (input.coverFile) {
    const coverError = validateCoverFile(input.coverFile);
    if (coverError) {
      throw new Error(coverError);
    }
  }

  const realms = await listPersistedRealms();
  const slug = withUniqueSuffix(
    slugify(title),
    realms.map((realm) => realm.slug),
  );
  const now = new Date().toISOString();
  const audioUrl = await savePublicFile(input.audioFile, audioDir, "/uploads/audio");
  const coverUrl = input.coverFile
    ? await savePublicFile(input.coverFile, coverDir, "/uploads/covers")
    : undefined;

  const realm: PersistedRealm = {
    id: randomUUID(),
    slug,
    title,
    producerName,
    producerSlug: slugify(producerName),
    genre: input.genre,
    mood: input.mood,
    bpm: input.bpm,
    visualStyle: input.visualStyle,
    description: input.description?.trim() || undefined,
    audioUrl,
    audioOriginalName: input.audioFile.name,
    audioMimeType: input.audioFile.type,
    audioSize: input.audioFile.size,
    coverUrl,
    coverOriginalName: input.coverFile?.name,
    coverMimeType: input.coverFile?.type,
    coverSize: input.coverFile?.size,
    coverPlaceholderId: coverUrl ? undefined : input.coverPlaceholderId,
    createdAt: now,
    updatedAt: now,
  };

  await writeRealms([realm, ...realms]);
  return realm;
}

function normalizeImportedRealm(
  realm: PersistedRealm,
  existingSlugs: string[],
): PersistedRealm | null {
  if (
    !realm ||
    typeof realm.title !== "string" ||
    typeof realm.producerName !== "string" ||
    typeof realm.slug !== "string" ||
    typeof realm.audioUrl !== "string"
  ) {
    return null;
  }

  const slug = existingSlugs.includes(realm.slug)
    ? withUniqueSuffix(realm.slug, existingSlugs)
    : realm.slug;
  existingSlugs.push(slug);

  return {
    ...realm,
    id: realm.id || randomUUID(),
    slug,
    producerSlug: realm.producerSlug || slugify(realm.producerName),
    createdAt: realm.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function importPersistedRealms(importedRealms: PersistedRealm[]) {
  const existing = await listPersistedRealms();
  const existingSlugs = existing.map((realm) => realm.slug);
  const existingIds = new Set(existing.map((realm) => realm.id));
  const normalized = importedRealms
    .filter((realm) => !existingIds.has(realm.id))
    .map((realm) => normalizeImportedRealm(realm, existingSlugs))
    .filter((realm): realm is PersistedRealm => Boolean(realm));

  await writeRealms([...normalized, ...existing]);
  return normalized;
}

export async function deletePersistedRealm(slug: string) {
  const realms = await listPersistedRealms();
  const nextRealms = realms.filter((realm) => realm.slug !== slug);
  await writeRealms(nextRealms);
  return nextRealms.length !== realms.length;
}
