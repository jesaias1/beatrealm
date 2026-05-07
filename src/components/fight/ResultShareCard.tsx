"use client";

import type { FightDifficulty, FightResult } from "@/lib/fight/types";
import type { PersistedRealm } from "@/types";

type ResultShareCardProps = {
  realm: PersistedRealm;
  result: FightResult;
  difficulty: FightDifficulty;
  isNewBest: boolean;
};

export function ResultShareCard({
  realm,
  result,
  difficulty,
  isNewBest,
}: ResultShareCardProps) {
  return (
    <div className="relative overflow-hidden border border-[#21f7ff]/25 bg-[radial-gradient(circle_at_18%_10%,rgba(33,247,255,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(255,42,109,0.16),transparent_28%),#060607] p-5">
      <div className="absolute inset-0 scanlines opacity-50" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#21f7ff]">
              BeatRealm Result
            </p>
            <h3 className="mt-2 truncate text-3xl font-black uppercase text-white">
              {realm.title}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
              {realm.producerName} / {difficulty}
            </p>
          </div>
          <div className="text-right">
            {isNewBest ? (
              <p className="mb-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#b7ff2a]">
                New best
              </p>
            ) : null}
            <p className="text-6xl font-black uppercase leading-none text-[#b7ff2a]">
              {result.rank}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ShareStat label="Score" value={result.score.toLocaleString()} />
          <ShareStat label="Accuracy" value={`${result.accuracy.toFixed(1)}%`} />
          <ShareStat label="Combo" value={`x${result.maxCombo}`} />
        </div>
      </div>
    </div>
  );
}

function ShareStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/35 p-3">
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black uppercase text-white">{value}</p>
    </div>
  );
}
