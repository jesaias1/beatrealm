"use client";

import { useEffect, useState } from "react";
import { getRealmFightStats } from "@/lib/fight/localResults";
import type { RealmFightStats } from "@/lib/fight/results";

type LocalBestPanelProps = {
  realmSlug: string;
  refreshKey?: number;
};

export function LocalBestPanel({ realmSlug, refreshKey = 0 }: LocalBestPanelProps) {
  const [stats, setStats] = useState<RealmFightStats | null>(null);

  useEffect(() => {
    queueMicrotask(() => setStats(getRealmFightStats(realmSlug)));
  }, [realmSlug, refreshKey]);

  const best = stats?.bestResult;

  return (
    <div className="border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
          Local Best
        </h2>
        <span className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
          Local only
        </span>
      </div>
      {best ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Rank" value={best.rank} />
          <Stat label="Score" value={best.score.toLocaleString()} />
          <Stat label="Acc" value={`${best.accuracy.toFixed(1)}%`} />
          <Stat label="Combo" value={`x${best.maxCombo}`} />
          <Stat label="Mode" value={best.difficulty} />
          <Stat label="Attempts" value={String(stats?.attempts ?? 0)} />
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          No local score yet. Start a fight and set the first mark.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-2">
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black uppercase text-white">{value}</p>
    </div>
  );
}
