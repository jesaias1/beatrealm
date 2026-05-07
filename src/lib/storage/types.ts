import type { CreateRealmInput, PersistedRealm, Realm } from "@/types";

export type SaveRealmInput = Omit<Realm, "id"> & {
  id?: string;
};

export type RealmStorage = {
  saveRealm: (realm: SaveRealmInput) => Promise<Realm>;
  listRealms: () => Promise<Realm[]>;
  getRealmBySlug: (slug: string) => Promise<Realm | null>;
  deleteRealm: (id: string) => Promise<void>;
};

export type PersistedRealmStorage = {
  createRealm: (realm: CreateRealmInput) => Promise<PersistedRealm>;
  listRealms: () => Promise<PersistedRealm[]>;
  getRealmBySlug: (slug: string) => Promise<PersistedRealm | null>;
  deleteRealmBySlug: (slug: string) => Promise<boolean>;
};
