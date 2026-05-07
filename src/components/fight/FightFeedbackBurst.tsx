"use client";

import type { FightFeedback } from "@/lib/fight/types";

type FightFeedbackBurstProps = {
  feedback: FightFeedback | null;
};

const colorByResult = {
  perfect: "text-[#b7ff2a]",
  great: "text-[#21f7ff]",
  good: "text-[#ffb000]",
  miss: "text-[#ff2a6d]",
};

export function FightFeedbackBurst({ feedback }: FightFeedbackBurstProps) {
  if (!feedback) {
    return null;
  }

  const timing =
    feedback.result === "miss"
      ? "Dropped prompt"
      : feedback.offsetMs < -18
        ? `${Math.abs(feedback.offsetMs)}ms early`
        : feedback.offsetMs > 18
          ? `${feedback.offsetMs}ms late`
          : "Dead center";

  return (
    <div
      key={feedback.id}
      className={`pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 animate-flicker text-center ${colorByResult[feedback.result]}`}
    >
      <p className="glitch-shadow text-6xl font-black uppercase leading-none">
        {feedback.label}
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-200">
        {timing}
      </p>
    </div>
  );
}
