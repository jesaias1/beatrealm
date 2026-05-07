"use client";

import type { BeatRealmBackup } from "@/lib/local/exportData";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseBeatRealmBackup(raw: string): BeatRealmBackup {
  const parsed = JSON.parse(raw) as unknown;
  if (!isObject(parsed) || parsed.version !== 1) {
    throw new Error("This does not look like a BeatRealm Phase 7 backup.");
  }
  if (!Array.isArray(parsed.realms) || !Array.isArray(parsed.fightResults)) {
    throw new Error("Backup must include realms and fightResults arrays.");
  }

  return parsed as BeatRealmBackup;
}
