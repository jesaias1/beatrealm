"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { RefObject } from "react";
import { formatTime } from "@/hooks/useAudioPlayer";
import { WaveformDisplay } from "./WaveformDisplay";

type RealmAudioPlayerProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  audioUrl: string;
  title: string;
  producer: string;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  muted: boolean;
  peaks: number[];
  waveformLoading: boolean;
  waveformError?: string | null;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
};

export function RealmAudioPlayer({
  audioRef,
  audioUrl,
  title,
  producer,
  isPlaying,
  isLoading,
  error,
  currentTime,
  duration,
  progress,
  volume,
  muted,
  peaks,
  waveformLoading,
  waveformError,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
}: RealmAudioPlayerProps) {
  return (
    <section className="border border-white/10 bg-black/50 p-4 glow-border">
      <audio ref={audioRef} src={audioUrl} preload="metadata">
        <track kind="captions" />
      </audio>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#b7ff2a]">
            BeatRealm player
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase text-white">
            {title}
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
            by {producer}
          </p>
        </div>
        <button
          type="button"
          onClick={onTogglePlay}
          className="inline-flex size-16 items-center justify-center border border-[#b7ff2a]/70 bg-[#b7ff2a] text-black transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
        </button>
      </div>

      <div className="mt-5">
        <WaveformDisplay
          peaks={peaks}
          progress={progress}
          isLoading={waveformLoading}
          error={waveformError}
          onSeek={(ratio) => onSeek(ratio * duration)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMute}
            className="border border-white/10 p-2 text-zinc-200 transition hover:border-[#21f7ff]/50 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
            aria-label={muted ? "Unmute audio" : "Mute audio"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
              className="w-28 accent-[#b7ff2a]"
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-3 text-sm text-zinc-400">Loading audio...</p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-[#ff2a6d]">{error}</p> : null}
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        Space play/pause / arrows seek / M mute
      </p>
    </section>
  );
}
