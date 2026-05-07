"use client";

import { getAllFightResults } from "@/lib/fight/localResults";
import type { StoredFightResult } from "@/lib/fight/results";
import type { PersistedRealm } from "@/types";

export type BeatRealmBackup = {
  version: 1;
  exportedAt: string;
  realms: PersistedRealm[];
  fightResults: StoredFightResult[];
  note: string;
};

export function buildLocalBackup(realms: PersistedRealm[]): BeatRealmBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    realms,
    fightResults: getAllFightResults(),
    note: "Audio and cover image binaries are not included. Uploaded files must already exist in public/uploads for imported Realm metadata to play.",
  };
}

export function downloadBackup(backup: BeatRealmBackup) {
  const blob = new Blob([`${JSON.stringify(backup, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `beatrealm-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
