import type { Realm } from "@/types";
import type { RealmStorage, SaveRealmInput } from "./types";

const STORAGE_KEY = "beatrealm.realms.v1";

function readRealms(): Realm[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Realm[];
  } catch {
    return [];
  }
}

function writeRealms(realms: Realm[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(realms));
}

export const localRealmStorage: RealmStorage = {
  async saveRealm(input: SaveRealmInput) {
    const realms = readRealms();
    const realm: Realm = {
      ...input,
      id: input.id ?? crypto.randomUUID(),
    };
    const nextRealms = [
      realm,
      ...realms.filter((existing) => existing.id !== realm.id),
    ];

    writeRealms(nextRealms);
    return realm;
  },

  async listRealms() {
    return readRealms();
  },

  async getRealmBySlug(slug: string) {
    return readRealms().find((realm) => realm.slug === slug) ?? null;
  },

  async deleteRealm(id: string) {
    writeRealms(readRealms().filter((realm) => realm.id !== id));
  },
};
