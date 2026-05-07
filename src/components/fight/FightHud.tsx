"use client";

import { Pause, Play } from "lucide-react";
import { HealthBar } from "./HealthBar";
import type { FightGameState } from "@/lib/fight/types";

type FightHudProps = {
  playerHealth: number;
  bossHealth: number;
  score: number;
  combo: number;
  accuracy: number;
  progress: number;
  gameState: FightGameState;
  onPause: () => void;
  onResume: () => void;
};

export function FightHud({
  playerHealth,
  bossHealth,
  score,
  combo,
  accuracy,
  progress,
  gameState,
  onPause,
  onResume,
}: FightHudProps) {
  return (
    <header className="grid gap-4 border-b border-white/10 bg-black/45 p-4 lg:grid-cols-[1fr_auto_1fr]">
      <HealthBar label="Player health" value={Math.round(playerHealth)} />
      <div className="grid grid-cols-3 gap-2 text-center sm:min-w-96">
        <div className="border border-white/10 bg-black/35 p-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Score
          </p>
          <p className="font-black text-white">{score}</p>
        </div>
        <div className="border border-white/10 bg-black/35 p-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Combo
          </p>
          <p className="font-black text-[#b7ff2a]">x{combo}</p>
        </div>
        <div className="border border-white/10 bg-black/35 p-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Accuracy
          </p>
          <p className="font-black text-white">{accuracy.toFixed(1)}%</p>
        </div>
      </div>
      <div className="grid gap-2">
        <HealthBar label="Boss health" value={Math.round(bossHealth)} tone="boss" />
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 border border-white/10 bg-black/50">
            <div className="h-full bg-[#21f7ff]" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <button
            type="button"
            onClick={gameState === "paused" ? onResume : onPause}
            className="border border-white/10 p-2 text-zinc-200 transition hover:border-[#21f7ff]/60 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
            aria-label={gameState === "paused" ? "Resume fight" : "Pause fight"}
          >
            {gameState === "paused" ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
