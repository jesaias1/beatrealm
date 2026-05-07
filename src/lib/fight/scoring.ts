import { difficultyConfigs } from "./hitWindows";
import type { FightDifficulty, FightStats, HitResult } from "./types";

export const baseScoreByResult: Record<HitResult, number> = {
  perfect: 1000,
  great: 700,
  good: 400,
  miss: 0,
};

export const bossDamageByResult: Record<HitResult, number> = {
  perfect: 4,
  great: 3,
  good: 2,
  miss: 0,
};

export function comboMultiplier(combo: number) {
  return Math.min(4, 1 + Math.floor(combo / 8) * 0.35);
}

export function scoreForHit(result: HitResult, combo: number) {
  return Math.round(baseScoreByResult[result] * comboMultiplier(combo));
}

export function bossDamageForHit(
  result: HitResult,
  difficulty: FightDifficulty,
  intensity: number,
) {
  const config = difficultyConfigs[difficulty];
  return bossDamageByResult[result] * config.damageScale * (0.85 + intensity * 0.3);
}

export function missDamageForPrompt(
  difficulty: FightDifficulty,
  intensity: number,
) {
  const config = difficultyConfigs[difficulty];
  return config.missDamage * (0.75 + intensity * 0.55);
}

export function emptyFightStats(): FightStats {
  return {
    score: 0,
    currentCombo: 0,
    maxCombo: 0,
    successfulHits: 0,
    misses: 0,
    perfects: 0,
    greats: 0,
    goods: 0,
    totalJudged: 0,
  };
}

export function accuracyFromStats(stats: FightStats) {
  if (stats.totalJudged === 0) {
    return 100;
  }

  const weighted =
    stats.perfects * 1 + stats.greats * 0.75 + stats.goods * 0.5;
  return Math.round((weighted / stats.totalJudged) * 1000) / 10;
}
