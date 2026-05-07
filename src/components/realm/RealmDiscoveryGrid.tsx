"use client";

import { useMemo, useState } from "react";
import { RealmCard } from "@/components/realm/RealmCard";
import {
  filterRealms,
  getRealmProducerName,
  type RealmFilterState,
  type RealmListItem,
} from "@/lib/realms/filters";
import { getRealmStats } from "@/lib/stats/realmStats";
import type { PersistedRealm, Realm } from "@/types";
import { RealmFilterBar } from "./RealmFilterBar";

type RealmDiscoveryGridProps = {
  persistedRealms: PersistedRealm[];
  fallbackRealms: Realm[];
};

const initialFilters: RealmFilterState = {
  query: "",
  genre: "all",
  mood: "all",
  visualStyle: "all",
  sort: "newest",
};

export function RealmDiscoveryGrid({
  persistedRealms,
  fallbackRealms,
}: RealmDiscoveryGridProps) {
  const [filters, setFilters] = useState(initialFilters);
  const sourceRealms = persistedRealms.length ? persistedRealms : fallbackRealms;
  const isUsingFallback = persistedRealms.length === 0;

  const realms = useMemo(() => {
    const filtered = filterRealms(sourceRealms, filters);
    return [...filtered].sort((a, b) => {
      if (filters.sort === "title") {
        return a.title.localeCompare(b.title);
      }
      if (filters.sort === "bestScore") {
        return scoreFor(b) - scoreFor(a);
      }
      if (filters.sort === "mostAttempts") {
        return attemptsFor(b) - attemptsFor(a);
      }
      return createdAtFor(b) - createdAtFor(a);
    });
  }, [filters, sourceRealms]);

  return (
    <section className="mt-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-[#21f7ff]">
            Realm Discovery
          </p>
          <h2 className="mt-2 text-4xl font-black uppercase text-white">
            Browse the local underground.
          </h2>
        </div>
        {isUsingFallback ? (
          <p className="border border-[#ff2a6d]/30 bg-[#ff2a6d]/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#ff2a6d]">
            Demo fallback
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <RealmFilterBar filters={filters} onChange={setFilters} />
      </div>

      {realms.length ? (
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {realms.map((realm) => (
            <RealmCard key={realm.id} realm={realm} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-white/15 bg-black/30 p-8">
          <h3 className="text-3xl font-black uppercase text-white">
            No Realms match.
          </h3>
          <p className="mt-3 max-w-xl text-zinc-400">
            Loosen the filters or create a new Realm with a different mood signal.
          </p>
        </div>
      )}
    </section>
  );
}

function scoreFor(realm: RealmListItem) {
  return "producerName" in realm ? getRealmStats(realm.slug).bestScore : 0;
}

function attemptsFor(realm: RealmListItem) {
  return "producerName" in realm ? getRealmStats(realm.slug).attempts : 0;
}

function createdAtFor(realm: RealmListItem) {
  if ("createdAt" in realm) {
    return new Date(realm.createdAt).getTime();
  }
  return realm.featured ? Number.MAX_SAFE_INTEGER : getRealmProducerName(realm).length;
}
