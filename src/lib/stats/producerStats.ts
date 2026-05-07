"use client";

import { getRealmStats } from "@/lib/stats/realmStats";
import type { PersistedRealm } from "@/types";

export type ProducerStats = {
  producerSlug: string;
  realmCount: number;
  totalAttempts: number;
  bestRank: string | null;
  bestScore: number;
  bestRealmTitle: string | null;
};

export function getProducerStats(producerSlug: string, realms: PersistedRealm[]): ProducerStats {
  const producerRealms = realms.filter((realm) => realm.producerSlug === producerSlug);
  const realmStats = producerRealms.map((realm) => ({
    realm,
    stats: getRealmStats(realm.slug),
  }));
  const best = realmStats
    .map((item) => item.stats.bestResult ? { realm: item.realm, result: item.stats.bestResult } : null)
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => b.result.score - a.result.score || b.result.accuracy - a.result.accuracy)[0];

  return {
    producerSlug,
    realmCount: producerRealms.length,
    totalAttempts: realmStats.reduce((sum, item) => sum + item.stats.attempts, 0),
    bestRank: best?.result.rank ?? null,
    bestScore: best?.result.score ?? 0,
    bestRealmTitle: best?.realm.title ?? null,
  };
}
