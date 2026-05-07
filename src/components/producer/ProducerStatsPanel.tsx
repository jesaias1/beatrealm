"use client";

import { getProducerStats } from "@/lib/stats/producerStats";
import type { PersistedRealm } from "@/types";

type ProducerStatsPanelProps = {
  producerSlug: string;
  realms: PersistedRealm[];
};

export function ProducerStatsPanel({ producerSlug, realms }: ProducerStatsPanelProps) {
  const stats = getProducerStats(producerSlug, realms);

  return (
    <section className="mt-10 grid gap-3 sm:grid-cols-4">
      <Stat label="Realms" value={String(stats.realmCount)} />
      <Stat label="Attempts" value={String(stats.totalAttempts)} />
      <Stat label="Best Rank" value={stats.bestRank ?? "--"} />
      <Stat label="Best Score" value={stats.bestScore ? stats.bestScore.toLocaleString() : "0"} />
      {stats.bestRealmTitle ? (
        <p className="border border-[#b7ff2a]/25 bg-[#b7ff2a]/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#b7ff2a] sm:col-span-4">
          Best local run came from {stats.bestRealmTitle}
        </p>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/35 p-4">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black uppercase text-white">{value}</p>
    </div>
  );
}
