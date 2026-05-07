"use client";

import { useMemo, useState } from "react";
import { RealmCard } from "@/components/realm/RealmCard";
import { RealmFilterBar } from "@/components/realm/RealmFilterBar";
import {
  filterRealms,
  type RealmFilterState,
} from "@/lib/realms/filters";
import { getRealmStats } from "@/lib/stats/realmStats";
import type { PersistedRealm } from "@/types";

type ProducerRealmGridProps = {
  realms: PersistedRealm[];
};

const initialFilters: RealmFilterState = {
  query: "",
  genre: "all",
  mood: "all",
  visualStyle: "all",
  sort: "newest",
};

export function ProducerRealmGrid({ realms }: ProducerRealmGridProps) {
  const [filters, setFilters] = useState(initialFilters);
  const visibleRealms = useMemo(() => {
    const filtered = filterRealms(realms, filters) as PersistedRealm[];
    return [...filtered].sort((a, b) => {
      if (filters.sort === "title") {
        return a.title.localeCompare(b.title);
      }
      if (filters.sort === "bestScore") {
        return getRealmStats(b.slug).bestScore - getRealmStats(a.slug).bestScore;
      }
      if (filters.sort === "mostAttempts") {
        return getRealmStats(b.slug).attempts - getRealmStats(a.slug).attempts;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filters, realms]);

  return (
    <section className="mt-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#21f7ff]">
            Producer Realms
          </p>
          <h2 className="mt-2 text-4xl font-black uppercase text-white">
            Portals by track.
          </h2>
        </div>
      </div>
      <div className="mt-5">
        <RealmFilterBar filters={filters} onChange={setFilters} />
      </div>
      {visibleRealms.length ? (
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {visibleRealms.map((realm) => (
            <RealmCard key={realm.id} realm={realm} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-white/15 bg-black/30 p-8">
          <h3 className="text-3xl font-black uppercase text-white">
            No matching producer Realms.
          </h3>
          <p className="mt-3 text-zinc-400">Try a different filter or create a new Realm.</p>
        </div>
      )}
    </section>
  );
}
