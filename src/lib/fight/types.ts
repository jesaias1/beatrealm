import type { HitMarker } from "@/lib/audio/hitMarkers";

export type FightGameState =
  | "idle"
  | "countdown"
  | "playing"
  | "paused"
  | "finished"
  | "failed";

export type FightDifficulty = "easy" | "normal" | "hard";

export type HitResult = "perfect" | "great" | "good" | "miss";

export type PromptStatus = "upcoming" | "active" | "hit" | "missed";

export type FightPrompt = HitMarker & {
  id: string;
  status: PromptStatus;
  judgedResult?: HitResult;
};

export type FightStats = {
  score: number;
  currentCombo: number;
  maxCombo: number;
  successfulHits: number;
  misses: number;
  perfects: number;
  greats: number;
  goods: number;
  totalJudged: number;
};

export type FightFeedback = {
  result: HitResult;
  offsetMs: number;
  label: string;
  id: number;
};

export type FightOutcome = "victory" | "survived" | "failed";

export type FightResult = {
  outcome: FightOutcome;
  rank: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  perfects: number;
  greats: number;
  goods: number;
  misses: number;
  successfulHits: number;
  totalPrompts: number;
};

