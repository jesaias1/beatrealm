"use client";

import type { FightDifficulty, FightOutcome } from "./types";
import {
  isBetterResult,
  type RealmFightStats,
  type StoredFightResult,
} from "./results";

const STORAGE_KEY = "beatrealm.fightResults.v1";

type SaveFightResultInput = {
  realmSlug: string;
  realmTitle: string;
  producerName: string;
  difficulty: FightDifficulty;
  outcome: FightOutcome;
  rank: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  perfects: number;
  greats: number;
  goods: number;
  misses: number;
  totalPrompts: number;
  durationSeconds?: number;
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getAllFightResults() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredFightResult[]) : [];
  } catch {
    return [];
  }
}

function writeAllFightResults(results: StoredFightResult[]) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Local result persistence is optional; ignore storage failures.
  }
}

export function saveFightResult(input: SaveFightResultInput) {
  const result: StoredFightResult = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const nextResults = [result, ...getAllFightResults()].slice(0, 100);
  writeAllFightResults(nextResults);
  return result;
}

export function mergeFightResults(results: StoredFightResult[]) {
  const existing = getAllFightResults();
  const byId = new Map(existing.map((result) => [result.id, result]));

  for (const result of results) {
    if (
      result &&
      typeof result.id === "string" &&
      typeof result.realmSlug === "string" &&
      typeof result.score === "number"
    ) {
      byId.set(result.id, result);
    }
  }

  const merged = [...byId.values()]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 150);
  writeAllFightResults(merged);
  return merged;
}

export function getResultsForRealm(realmSlug: string) {
  return getAllFightResults()
    .filter((result) => result.realmSlug === realmSlug)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getBestResultForRealm(realmSlug: string) {
  return getResultsForRealm(realmSlug).reduce<StoredFightResult | null>(
    (best, result) => (isBetterResult(result, best) ? result : best),
    null,
  );
}

export function getRecentResults(limit = 8) {
  return getAllFightResults()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

export function clearResultsForRealm(realmSlug: string) {
  writeAllFightResults(
    getAllFightResults().filter((result) => result.realmSlug !== realmSlug),
  );
}

export function getRealmFightStats(realmSlug: string): RealmFightStats {
  const recentResults = getResultsForRealm(realmSlug);
  return {
    bestResult: getBestResultForRealm(realmSlug),
    recentResults: recentResults.slice(0, 5),
    attempts: recentResults.length,
  };
}
