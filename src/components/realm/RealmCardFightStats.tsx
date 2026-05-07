"use client";

import { useEffect, useState } from "react";
import { getRealmFightStats } from "@/lib/fight/localResults";
import type { RealmFightStats } from "@/lib/fight/results";

type RealmCardFightStatsProps = {
  realmSlug: string;
};

export function RealmCardFightStats({ realmSlug }: RealmCardFightStatsProps) {
  const [stats, setStats] = useState<RealmFightStats | null>(null);

  useEffect(() => {
    queueMicrotask(() => setStats(getRealmFightStats(realmSlug)));
  }, [realmSlug]);

  if (!stats?.attempts) {
    return (
      <p className="mt-3 border border-white/10 bg-black/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        Beat Fighter: no local attempts
      </p>
    );
  }

  return (
    <p className="mt-3 border border-[#b7ff2a]/25 bg-[#b7ff2a]/8 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#b7ff2a]">
      Best: {stats.bestResult?.rank ?? "-"} /{" "}
      {stats.bestResult?.score.toLocaleString() ?? "0"} / {stats.attempts} runs
    </p>
  );
}
