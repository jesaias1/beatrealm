"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type CloudResult = {
  id: string;
  realmSlug: string;
  realmTitle: string;
  producerName: string;
  difficulty: string;
  rank: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  createdAt: string;
};

export function CloudResultHistory() {
  const { user, accessToken, isCloudConfigured } = useAuth();
  const [results, setResults] = useState<CloudResult[]>([]);
  const [loading, setLoading] = useState(
    () => !!(isCloudConfigured && user && accessToken),
  );

  useEffect(() => {
    if (!isCloudConfigured || !user || !accessToken) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/cloud/results/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = (await res.json()) as { results: CloudResult[] };
          if (!cancelled) setResults(data.results ?? []);
        }
      } catch { /* silent */ } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [isCloudConfigured, user, accessToken]);

  if (!isCloudConfigured || !user) return null;

  return (
    <div className="border border-white/10 bg-[#101012]/82 p-5 glow-border">
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-[#ffb000]" />
        <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#ffb000]">
          My Cloud Scores
        </h2>
      </div>

      {loading ? (
        <p className="mt-3 font-mono text-xs text-zinc-500 animate-pulse">
          Loading scores...
        </p>
      ) : results.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">
          No cloud scores yet. Fight a cloud Realm to submit your first score.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
                <th className="pb-2 pr-3">Realm</th>
                <th className="pb-2 pr-3">Diff</th>
                <th className="pb-2 pr-3">Rank</th>
                <th className="pb-2 pr-3 text-right">Score</th>
                <th className="hidden pb-2 pr-3 text-right sm:table-cell">Acc</th>
                <th className="hidden pb-2 text-right md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="py-2 pr-3">
                    <Link
                      href={`/realm/${r.realmSlug}`}
                      className="text-white underline decoration-zinc-700 hover:text-[#21f7ff]"
                    >
                      {r.realmTitle}
                    </Link>
                  </td>
                  <td className="py-2 pr-3 font-mono text-[10px] uppercase text-zinc-400">
                    {r.difficulty}
                  </td>
                  <td className="py-2 pr-3 font-mono text-[10px] font-black uppercase text-[#21f7ff]">
                    {r.rank}
                  </td>
                  <td className="py-2 pr-3 text-right font-mono text-xs font-black text-white">
                    {r.score.toLocaleString()}
                  </td>
                  <td className="hidden py-2 pr-3 text-right font-mono text-xs text-zinc-400 sm:table-cell">
                    {Number(r.accuracy).toFixed(1)}%
                  </td>
                  <td className="hidden py-2 text-right font-mono text-[10px] text-zinc-500 md:table-cell">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
