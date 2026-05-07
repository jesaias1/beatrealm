"use client";

import type { FightGameState } from "@/lib/fight/types";

type MobileHitPadProps = {
  gameState: FightGameState;
  combo: number;
  onHit: () => void;
};

export function MobileHitPad({ gameState, combo, onHit }: MobileHitPadProps) {
  const active = gameState === "playing";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/80 p-4 backdrop-blur md:hidden">
      <button
        type="button"
        disabled={!active}
        onPointerDown={(event) => {
          event.preventDefault();
          onHit();
        }}
        className="h-24 w-full border border-[#b7ff2a]/70 bg-[radial-gradient(circle_at_50%_50%,rgba(183,255,42,0.3),rgba(183,255,42,0.08)_45%,rgba(0,0,0,0.2))] font-mono text-2xl font-black uppercase tracking-[0.18em] text-white shadow-[0_0_28px_rgba(183,255,42,0.2)] transition active:scale-[0.98] disabled:opacity-45"
      >
        {active ? `Hit / x${combo}` : "Hit Pad"}
      </button>
    </div>
  );
}
