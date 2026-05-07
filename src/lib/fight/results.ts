import type { FightDifficulty, FightOutcome } from "./types";

export type StoredFightResult = {
  id: string;
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
  createdAt: string;
  durationSeconds?: number;
};

export type RealmFightStats = {
  bestResult: StoredFightResult | null;
  recentResults: StoredFightResult[];
  attempts: number;
};

export function isBetterResult(
  candidate: StoredFightResult,
  current: StoredFightResult | null,
) {
  if (!current) {
    return true;
  }

  if (candidate.score !== current.score) {
    return candidate.score > current.score;
  }

  return candidate.accuracy > current.accuracy;
}

