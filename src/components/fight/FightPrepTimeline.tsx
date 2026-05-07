"use client";

import { useMemo } from "react";
import { generateHitMarkers, type HitMarker } from "@/lib/audio/hitMarkers";
import { WaveformDisplay } from "@/components/audio/WaveformDisplay";

type FightPrepTimelineProps = {
  peaks: number[];
  duration: number;
  progress: number;
  isLoading: boolean;
  error?: string | null;
  onSeek: (time: number) => void;
};

export function FightPrepTimeline({
  peaks,
  duration,
  progress,
  isLoading,
  error,
  onSeek,
}: FightPrepTimelineProps) {
  const markers = useMemo(
    () => generateHitMarkers(peaks, duration),
    [duration, peaks],
  );

  return (
    <section className="border border-white/10 bg-black/40 p-4 glow-border">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#b7ff2a]">
            Fight prep timeline
          </p>
          <h2 className="mt-1 text-3xl font-black uppercase text-white">
            Generated hit markers
          </h2>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
          {markers.length} markers / no combat logic
        </p>
      </div>
      <WaveformDisplay
        peaks={peaks}
        progress={progress}
        isLoading={isLoading}
        error={error}
        markers={markers}
        duration={duration}
        onSeek={(ratio) => onSeek(ratio * duration)}
      />
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {(["peak", "bass", "energy"] as HitMarker["type"][]).map((type) => (
          <div key={type} className="border border-white/10 bg-black/35 p-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
              {type}
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {markers.filter((marker) => marker.type === type).length}
            </p>
          </div>
        ))}
      </div>
      {markers.length === 0 && !isLoading ? (
        <p className="mt-4 text-sm text-zinc-400">
          No strong markers found yet. Playback still works; future phases can
          use richer beat and transient detection.
        </p>
      ) : null}
    </section>
  );
}
