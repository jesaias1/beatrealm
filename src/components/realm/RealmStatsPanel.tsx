"use client";

import { Gamepad2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CTAButton } from "@/components/ui/CTAButton";
import { getRealmFightStats } from "@/lib/fight/localResults";
import type { RealmFightStats } from "@/lib/fight/results";

type RealmStatsPanelProps = {
  realmSlug: string;
};

export function RealmStatsPanel({ realmSlug }: RealmStatsPanelProps) {
  const [stats, setStats] = useState<RealmFightStats | null>(null);

  useEffect(() => {
    queueMicrotask(() => setStats(getRealmFightStats(realmSlug)));
  }, [realmSlug]);

  const best = stats?.bestResult;

  return (
    <div className="mt-6 border border-white/10 bg-black/35 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#b7ff2a]">
            Beat Fighter Stats
          </p>
          {best ? (
            <p className="mt-2 text-sm text-zinc-300">
              Best local run: <strong className="text-white">{best.rank}</strong> /
              {" "}
              <strong className="text-white">{best.score.toLocaleString()}</strong> pts /
              {" "}
              {best.accuracy.toFixed(1)}% accuracy.
            </p>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">
              No fights yet. Enter Fight Mode and set the first score.
            </p>
          )}
        </div>
        <CTAButton href={`/realm/${realmSlug}/fight`} variant="secondary" icon={Gamepad2}>
          Fight This Realm
        </CTAButton>
      </div>
      {best ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label="Best Rank" value={best.rank} />
          <MiniStat label="Best Score" value={best.score.toLocaleString()} />
          <MiniStat label="Best Acc" value={`${best.accuracy.toFixed(1)}%`} />
          <MiniStat label="Attempts" value={String(stats?.attempts ?? 0)} />
        </div>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-3">
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black uppercase text-white">{value}</p>
    </div>
  );
}
