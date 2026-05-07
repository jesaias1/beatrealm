"use client";

import {
  getAllFightResults,
  getBestResultForRealm,
  getRecentResults,
  getResultsForRealm,
} from "@/lib/fight/localResults";
import type { StoredFightResult } from "@/lib/fight/results";
import type { PersistedRealm } from "@/types";

export type LeaderboardEntry = StoredFightResult & {
  position: number;
};

export type RealmStats = {
  realmSlug: string;
  attempts: number;
  bestResult: StoredFightResult | null;
  bestScore: number;
  bestRank: string | null;
  bestAccuracy: number;
  recentAttempts: StoredFightResult[];
};

export type GlobalLocalStats = {
  totalAttempts: number;
  bestResults: LeaderboardEntry[];
  recentAttempts: StoredFightResult[];
};

export function getRealmStats(realmSlug: string): RealmStats {
  const results = getResultsForRealm(realmSlug);
  const bestResult = getBestResultForRealm(realmSlug);

  return {
    realmSlug,
    attempts: results.length,
    bestResult,
    bestScore: bestResult?.score ?? 0,
    bestRank: bestResult?.rank ?? null,
    bestAccuracy: bestResult?.accuracy ?? 0,
    recentAttempts: results.slice(0, 5),
  };
}

export function getBestResultsAcrossRealms(limit = 10): LeaderboardEntry[] {
  const byRealm = new Map<string, StoredFightResult>();

  for (const result of getAllFightResults()) {
    const current = byRealm.get(result.realmSlug);
    if (!current || result.score > current.score || (result.score === current.score && result.accuracy > current.accuracy)) {
      byRealm.set(result.realmSlug, result);
    }
  }

  return [...byRealm.values()]
    .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy)
    .slice(0, limit)
    .map((result, index) => ({ ...result, position: index + 1 }));
}

export function getRecentAttemptsAcrossRealms(limit = 10) {
  return getRecentResults(limit);
}

export function getGlobalLocalStats(): GlobalLocalStats {
  return {
    totalAttempts: getAllFightResults().length,
    bestResults: getBestResultsAcrossRealms(8),
    recentAttempts: getRecentAttemptsAcrossRealms(8),
  };
}

export function getFeaturedRealm(realms: PersistedRealm[]) {
  if (!realms.length) {
    return null;
  }

  const sortedByScore = [...realms].sort(
    (a, b) => getRealmStats(b.slug).bestScore - getRealmStats(a.slug).bestScore,
  );

  return sortedByScore[0] && getRealmStats(sortedByScore[0].slug).bestScore > 0
    ? sortedByScore[0]
    : [...realms].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
}
