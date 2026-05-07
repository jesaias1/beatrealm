"use client";

import { useEffect, useState } from "react";
import { getResultsForRealm } from "@/lib/fight/localResults";
import type { StoredFightResult } from "@/lib/fight/results";

type RecentAttemptsPanelProps = {
  realmSlug: string;
  refreshKey?: number;
  limit?: number;
};

export function RecentAttemptsPanel({
  realmSlug,
  refreshKey = 0,
  limit = 4,
}: RecentAttemptsPanelProps) {
  const [results, setResults] = useState<StoredFightResult[]>([]);

  useEffect(() => {
    queueMicrotask(() => setResults(getResultsForRealm(realmSlug).slice(0, limit)));
  }, [limit, realmSlug, refreshKey]);

  return (
    <div className="border border-white/10 bg-black/35 p-4">
      <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
        Recent Attempts
      </h2>
      {results.length ? (
        <div className="mt-3 grid gap-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-white/10 bg-white/[0.03] p-2"
            >
              <span className="min-w-10 text-center text-lg font-black uppercase text-[#b7ff2a]">
                {result.rank}
              </span>
              <div className="min-w-0">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                  {result.difficulty} / {result.outcome}
                </p>
                <p className="text-sm font-black text-white">
                  {result.score.toLocaleString()} pts
                </p>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                {result.accuracy.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Your last rounds for this Realm will appear here.
        </p>
      )}
    </div>
  );
}
