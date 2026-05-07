"use client";

type BossPhase = "phase1" | "phase2" | "rage" | "critical" | "defeated";

type BossPhaseBadgeProps = {
  bossHealth: number;
};

export function getBossPhase(bossHealth: number): BossPhase {
  if (bossHealth <= 0) {
    return "defeated";
  }
  if (bossHealth < 15) {
    return "critical";
  }
  if (bossHealth < 40) {
    return "rage";
  }
  if (bossHealth < 70) {
    return "phase2";
  }
  return "phase1";
}

const phaseMeta: Record<BossPhase, { label: string; className: string }> = {
  phase1: {
    label: "PHASE I",
    className: "border-[#21f7ff]/35 bg-[#21f7ff]/10 text-[#21f7ff]",
  },
  phase2: {
    label: "PHASE II",
    className: "border-[#b7ff2a]/40 bg-[#b7ff2a]/10 text-[#b7ff2a]",
  },
  rage: {
    label: "RAGE",
    className: "border-[#ff8a2a]/50 bg-[#ff8a2a]/12 text-[#ff8a2a]",
  },
  critical: {
    label: "CRITICAL",
    className: "border-[#ff2a6d]/60 bg-[#ff2a6d]/16 text-[#ff2a6d]",
  },
  defeated: {
    label: "DEFEATED",
    className: "border-white/35 bg-white/10 text-white",
  },
};

export function BossPhaseBadge({ bossHealth }: BossPhaseBadgeProps) {
  const phase = getBossPhase(bossHealth);
  const meta = phaseMeta[phase];

  return (
    <span
      className={`inline-flex items-center justify-center border px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
