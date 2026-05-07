"use client";

import { AudioReactiveCover } from "@/components/audio/AudioReactiveCover";
import type { AudioEnergy } from "@/lib/audio/energy";
import type { HitResult } from "@/lib/fight/types";
import type { PersistedRealm } from "@/types";
import { BossPhaseBadge, getBossPhase } from "./BossPhaseBadge";
import { FightFeedbackBurst } from "./FightFeedbackBurst";
import type { FightFeedback } from "@/lib/fight/types";

type BossStageProps = {
  realm: PersistedRealm;
  energy: AudioEnergy;
  bossHealth: number;
  feedback: FightFeedback | null;
  lastImpact: HitResult | null;
};

export function BossStage({
  realm,
  energy,
  bossHealth,
  feedback,
  lastImpact,
}: BossStageProps) {
  const phase = getBossPhase(bossHealth);
  const missFlash = lastImpact === "miss";
  const hitFlash = lastImpact && lastImpact !== "miss";
  const phaseIntensity =
    phase === "defeated"
      ? 0
      : phase === "critical"
        ? 1
        : phase === "rage"
          ? 0.85
          : phase === "phase2"
            ? 0.58
            : 0.32;
  const visualClass =
    realm.visualStyle === "minimal"
      ? "contrast-110"
      : realm.visualStyle === "dreamy"
        ? "blur-[0.2px]"
        : phase === "critical" || phase === "rage"
          ? "animate-glitch"
          : "";

  return (
    <div className={`scanlines relative min-h-[520px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,42,109,0.18),transparent_32%),linear-gradient(180deg,#121217,#050505)] glow-border ${visualClass}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(33,247,255,${energy.overallEnergy * (0.22 + phaseIntensity * 0.18)}), transparent 38%), radial-gradient(circle at 50% 62%, rgba(255,42,109,${phaseIntensity * 0.16}), transparent 34%)`,
          opacity: 0.8,
        }}
      />
      <div className="absolute inset-x-8 top-8 flex items-center justify-between gap-3 border border-white/10 bg-black/50 px-4 py-3">
        <BossPhaseBadge bossHealth={bossHealth} />
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
          {phase === "defeated"
            ? "Realm broken"
            : phase === "critical"
              ? "Unstable"
              : phase === "rage"
                ? "Pressure spike"
                : "Hit zone armed"}
        </p>
      </div>
      <div
        className="absolute left-1/2 top-[54%] w-[min(72vw,360px)] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150"
        style={{
          transform: `translate(-50%, -50%) scale(${phase === "defeated" ? 0.92 : 1 + energy.bassEnergy * (0.025 + phaseIntensity * 0.035)}) rotate(${(energy.midEnergy - 0.5) * phaseIntensity * 2.4}deg)`,
          filter: phase === "defeated" ? "grayscale(1) contrast(1.25)" : undefined,
        }}
      >
        <AudioReactiveCover realm={realm} energy={energy} />
      </div>
      <div
        className="absolute bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 border border-[#b7ff2a]/70 bg-[#b7ff2a]/15 shadow-[0_0_30px_rgba(183,255,42,0.22)]"
        style={{ opacity: phase === "defeated" ? 0.25 : 1 }}
      />
      {missFlash ? <div className="absolute inset-0 bg-[#ff2a6d]/24" /> : null}
      {hitFlash ? <div className="absolute inset-0 bg-[#b7ff2a]/12" /> : null}
      <FightFeedbackBurst feedback={feedback} />
    </div>
  );
}
