"use client";

import { MouseEvent, useEffect, useRef } from "react";

type WaveformDisplayProps = {
  peaks: number[];
  progress: number;
  onSeek: (ratio: number) => void;
  isLoading?: boolean;
  error?: string | null;
  markers?: Array<{ time: number; intensity: number; type: string }>;
  duration?: number;
};

export function WaveformDisplay({
  peaks,
  progress,
  onSeek,
  isLoading = false,
  error,
  markers = [],
  duration = 0,
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);

    const barCount = peaks.length || 64;
    const gap = 2;
    const barWidth = Math.max(2, (rect.width - gap * (barCount - 1)) / barCount);
    const centerY = rect.height / 2;
    const playedX = rect.width * Math.max(0, Math.min(1, progress));

    for (let index = 0; index < barCount; index += 1) {
      const peak = peaks[index] ?? (0.25 + ((index * 17) % 50) / 100);
      const height = Math.max(5, peak * rect.height * 0.88);
      const x = index * (barWidth + gap);
      const y = centerY - height / 2;
      context.fillStyle = x <= playedX ? "#b7ff2a" : "rgba(255,255,255,0.18)";
      context.fillRect(x, y, barWidth, height);
    }

    markers.forEach((marker) => {
      if (!duration) {
        return;
      }
      const x = (marker.time / duration) * rect.width;
      context.fillStyle =
        marker.type === "bass"
          ? "#21f7ff"
          : marker.type === "peak"
            ? "#ff2a6d"
            : "#ffb000";
      context.fillRect(x, 0, Math.max(2, marker.intensity * 4), rect.height);
    });
  }, [duration, markers, peaks, progress]);

  function handleSeek(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    onSeek((event.clientX - rect.left) / rect.width);
  }

  return (
    <button
      type="button"
      onClick={handleSeek}
      className="relative block h-24 w-full border border-white/10 bg-black/45 p-3 text-left transition hover:border-[#21f7ff]/50 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
      aria-label="Seek through waveform"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {isLoading ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
          Building waveform
        </span>
      ) : null}
      {error ? (
        <span className="absolute inset-x-3 bottom-3 bg-black/70 px-2 py-1 text-xs text-[#ff2a6d]">
          {error}
        </span>
      ) : null}
    </button>
  );
}
