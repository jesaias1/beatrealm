"use client";

import type { AudioEnergy } from "@/lib/audio/energy";

type AudioEnergyDebugProps = {
  energy: AudioEnergy;
};

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 bg-white/10">
        <div
          className="h-full bg-[#21f7ff]"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function AudioEnergyDebug({ energy }: AudioEnergyDebugProps) {
  return (
    <div className="grid gap-3 border border-white/10 bg-black/45 p-4">
      <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#b7ff2a]">
        Audio data
      </p>
      <Meter label="volume" value={energy.volume} />
      <Meter label="bass" value={energy.bassEnergy} />
      <Meter label="mid" value={energy.midEnergy} />
      <Meter label="treble" value={energy.trebleEnergy} />
      <Meter label="overall" value={energy.overallEnergy} />
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        peak: {energy.isPeak ? "yes" : "no"} / {energy.peakIntensity.toFixed(2)}
      </p>
    </div>
  );
}
