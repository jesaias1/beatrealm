import type { FightDifficulty, HitResult } from "./types";

export type DifficultyConfig = {
  label: string;
  maxPrompts: number;
  minSpacing: number;
  perfectWindow: number;
  greatWindow: number;
  goodWindow: number;
  missDamage: number;
  bossHealth: number;
  damageScale: number;
};

export const difficultyConfigs: Record<FightDifficulty, DifficultyConfig> = {
  easy: {
    label: "Easy",
    maxPrompts: 42,
    minSpacing: 1.05,
    perfectWindow: 0.14,
    greatWindow: 0.25,
    goodWindow: 0.38,
    missDamage: 3,
    bossHealth: 90,
    damageScale: 1.35,
  },
  normal: {
    label: "Normal",
    maxPrompts: 64,
    minSpacing: 0.68,
    perfectWindow: 0.09,
    greatWindow: 0.17,
    goodWindow: 0.28,
    missDamage: 6,
    bossHealth: 100,
    damageScale: 1.08,
  },
  hard: {
    label: "Hard",
    maxPrompts: 92,
    minSpacing: 0.48,
    perfectWindow: 0.06,
    greatWindow: 0.12,
    goodWindow: 0.2,
    missDamage: 9,
    bossHealth: 120,
    damageScale: 0.95,
  },
};

export function judgeOffset(
  offsetSeconds: number,
  difficulty: FightDifficulty,
): HitResult | null {
  const config = difficultyConfigs[difficulty];
  const absoluteOffset = Math.abs(offsetSeconds);

  if (absoluteOffset <= config.perfectWindow) {
    return "perfect" satisfies HitResult;
  }
  if (absoluteOffset <= config.greatWindow) {
    return "great" satisfies HitResult;
  }
  if (absoluteOffset <= config.goodWindow) {
    return "good" satisfies HitResult;
  }

  return null;
}
