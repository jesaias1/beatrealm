"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

type LeaderboardEntry = {
  position: number;
  playerName: string;
  userId: string | null;
  score: number;
  accuracy: number;
  difficulty: string;
  maxCombo: number;
  rank: string;
  createdAt: string;
};

type CloudLeaderboardProps = {
  realmSlug: string;
  refreshKey?: number;
  currentUserId?: string;
};

const difficulties = ["all", "easy", "normal", "hard"] as const;

export function CloudLeaderboard({ realmSlug, refreshKey = 0, currentUserId }: CloudLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("difficulty", filter);

        const response = await fetch(`/api/cloud/leaderboards/${realmSlug}?${params.toString()}`);
        if (!response.ok) {
          if (response.status === 503) {
            setEntries([]);
            return;
          }
          throw new Error("Failed to load leaderboard.");
        }

        const data = (await response.json()) as { results: LeaderboardEntry[] };
        if (!cancelled) setEntries(data.results ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load leaderboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadLeaderboard();
    return () => { cancelled = true; };
  }, [realmSlug, refreshKey, filter]);

  if (loading) {
    return (
      <div className="mt-6 border border-white/10 bg-black/35 p-5">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-500 animate-pulse">
          Loading leaderboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 border border-[#ff2a6d]/30 bg-[#ff2a6d]/5 p-5">
        <p className="font-mono text-xs text-[#ff2a6d]">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border border-white/10 bg-black/35 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-[#ffb000]" />
          <h3 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#ffb000]">
            Cloud Leaderboard
          </h3>
        </div>
        <div className="flex gap-1">
          {difficulties.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setFilter(d)}
              className={`border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition ${
                filter === d
                  ? "border-[#ffb000]/50 bg-[#ffb000]/10 text-[#ffb000]"
                  : "border-white/10 bg-black/20 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">
          {filter !== "all"
            ? `No scores for "${filter}" difficulty yet.`
            : "No cloud scores yet. Be the first to fight this Realm."}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
                <th className="pb-2 pr-3">#</th>
                <th className="pb-2 pr-3">Player</th>
                <th className="pb-2 pr-3 text-right">Score</th>
                <th className="hidden pb-2 pr-3 text-right sm:table-cell">Acc</th>
                <th className="hidden pb-2 pr-3 sm:table-cell">Diff</th>
                <th className="hidden pb-2 pr-3 sm:table-cell">Rank</th>
                <th className="hidden pb-2 text-right md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const isCurrentUser = currentUserId && entry.userId === currentUserId;
                return (
                  <tr
                    key={`${entry.position}-${entry.createdAt}`}
                    className={`border-b border-white/5 ${isCurrentUser ? "bg-[#21f7ff]/5" : ""}`}
                  >
                    <td className="py-2 pr-3 font-mono text-xs font-black text-[#b7ff2a]">
                      {entry.position}
                    </td>
                    <td className={`py-2 pr-3 ${isCurrentUser ? "text-[#21f7ff]" : "text-white"}`}>
                      {entry.playerName}{isCurrentUser ? " (you)" : ""}
                    </td>
                    <td className="py-2 pr-3 text-right font-mono text-xs font-black text-white">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="hidden py-2 pr-3 text-right font-mono text-xs text-zinc-400 sm:table-cell">
                      {Number(entry.accuracy).toFixed(1)}%
                    </td>
                    <td className="hidden py-2 pr-3 font-mono text-[10px] uppercase text-zinc-400 sm:table-cell">
                      {entry.difficulty}
                    </td>
                    <td className="hidden py-2 pr-3 font-mono text-[10px] font-black uppercase text-[#21f7ff] sm:table-cell">
                      {entry.rank}
                    </td>
                    <td className="hidden py-2 text-right font-mono text-[10px] text-zinc-500 md:table-cell">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
