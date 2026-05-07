import type { PersistedRealm, Realm, RealmGenre, RealmMood, RealmVisualStyle } from "@/types";

export type RealmListItem = PersistedRealm | Realm;

export type RealmSortMode = "newest" | "title" | "bestScore" | "mostAttempts";

export type RealmFilterState = {
  query: string;
  genre: RealmGenre | "all";
  mood: RealmMood | "all";
  visualStyle: RealmVisualStyle | "all";
  sort: RealmSortMode;
};

export function getRealmProducerName(realm: RealmListItem) {
  return "producerName" in realm ? realm.producerName : realm.producer.name;
}

export function filterRealms(realms: RealmListItem[], filters: RealmFilterState) {
  const query = filters.query.trim().toLowerCase();

  return realms.filter((realm) => {
    const matchesQuery =
      !query ||
      realm.title.toLowerCase().includes(query) ||
      getRealmProducerName(realm).toLowerCase().includes(query);
    const matchesGenre = filters.genre === "all" || realm.genre === filters.genre;
    const matchesMood = filters.mood === "all" || realm.mood === filters.mood;
    const matchesStyle =
      filters.visualStyle === "all" || realm.visualStyle === filters.visualStyle;

    return matchesQuery && matchesGenre && matchesMood && matchesStyle;
  });
}
