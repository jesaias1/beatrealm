"use client";

import type { FightPrompt } from "@/lib/fight/types";

type HitPromptTrackProps = {
  prompts: FightPrompt[];
  currentTime: number;
  duration: number;
};

const colorByStatus: Record<FightPrompt["status"], string> = {
  upcoming: "border-white/20 bg-white/10 text-zinc-300",
  active: "scale-125 border-[#b7ff2a] bg-[#b7ff2a]/45 text-white shadow-[0_0_28px_rgba(183,255,42,0.36)]",
  hit: "scale-90 border-[#21f7ff] bg-[#21f7ff]/45 text-white",
  missed: "scale-90 border-[#ff2a6d] bg-[#ff2a6d]/35 text-white",
};

export function HitPromptTrack({
  prompts,
  currentTime,
  duration,
}: HitPromptTrackProps) {
  const visible = prompts.filter(
    (prompt) => prompt.time > currentTime - 1.1 && prompt.time < currentTime + 3.2,
  );

  return (
    <div className="border border-white/10 bg-black/40 p-4">
      <div className="relative h-32 overflow-hidden border border-white/10 bg-[linear-gradient(90deg,rgba(33,247,255,0.06),rgba(183,255,42,0.08),rgba(255,42,109,0.06))]">
        <div className="absolute inset-y-5 left-1/2 w-20 -translate-x-1/2 border border-[#b7ff2a]/55 bg-[#b7ff2a]/8 shadow-[0_0_24px_rgba(183,255,42,0.28)]" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#b7ff2a] shadow-[0_0_18px_rgba(183,255,42,0.6)]" />
        <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#b7ff2a]/60 bg-black/45 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#b7ff2a]">
          Hit
        </div>
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
        {visible.map((prompt) => {
          const offset = prompt.time - currentTime;
          const left = 50 + offset * 22;
          const distance = Math.abs(offset);
          const opacity = prompt.status === "hit" || prompt.status === "missed"
            ? 0.55
            : Math.max(0.35, 1 - distance * 0.16);
          return (
            <div
              key={prompt.id}
              className={`absolute top-1/2 z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border font-mono text-[10px] font-black uppercase transition duration-100 ${colorByStatus[prompt.status]}`}
              style={{ left: `${left}%`, opacity }}
            >
              {prompt.type.slice(0, 1)}
              {prompt.status === "active" ? (
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-[#b7ff2a]">
                  NOW
                </span>
              ) : null}
            </div>
          );
        })}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
          <div
            className="h-full bg-[#21f7ff]"
            style={{ width: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%` }}
          />
        </div>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        Prompts move into the center hit zone. Space or tap when they cross.
      </p>
    </div>
  );
}
