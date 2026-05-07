"use client";

import { useEffect } from "react";
import { RealmAudioPlayer } from "@/components/audio/RealmAudioPlayer";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useWaveformData } from "@/hooks/useWaveformData";
import type { PersistedRealm } from "@/types";
import { AudioReactiveCover } from "@/components/audio/AudioReactiveCover";

export function RealmVisualizer({ realm }: { realm: PersistedRealm }) {
  const player = useAudioPlayer(realm.audioUrl, false);
  const analyzer = useAudioAnalyzer(player.audioRef, player.isPlaying);
  const waveform = useWaveformData(realm.audioUrl, 128);
  const activeDuration = player.duration || waveform.duration || 0;

  const energy = analyzer.energy;
  const visualClass =
    realm.visualStyle === "minimal"
      ? "contrast-110"
      : realm.visualStyle === "dreamy"
        ? "blur-[0.2px]"
        : "";

  return (
    <div className="relative min-h-[calc(100vh-84px)] overflow-hidden bg-[#050505] flex flex-col justify-end">
      {/* Immersive Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-75"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(33,247,255,${energy.overallEnergy * 0.4}), transparent 50%), radial-gradient(circle at 50% 62%, rgba(255,42,109,${energy.bassEnergy * 0.3}), transparent 40%)`,
        }}
      />
      <div className={`absolute inset-0 scanlines opacity-40 pointer-events-none ${visualClass}`} />
      
      {/* Central Visualizer */}
      <div
        className="absolute left-1/2 top-[45%] w-[min(75vw,480px)] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate(-50%, -50%) scale(${1 + energy.bassEnergy * 0.12}) rotate(${(energy.midEnergy - 0.5) * 6}deg)`,
        }}
      >
        <AudioReactiveCover realm={realm} energy={energy} />
      </div>

      {/* Treble Flare */}
      <div 
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 blur-3xl pointer-events-none mix-blend-screen"
        style={{
          background: `rgba(183, 255, 42, ${energy.trebleEnergy * 0.35})`,
          transform: `scale(${1 + energy.trebleEnergy * 1.5})`,
        }}
      />

      {/* Title / Info overlay */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h1 className="text-4xl font-black uppercase text-white glitch-shadow tracking-tight">
          {realm.title}
        </h1>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#b7ff2a] mt-2">
          {realm.producerName}
        </p>
      </div>

      {/* Audio Player pinned to bottom */}
      <div className="relative z-30 w-full border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <RealmAudioPlayer
            audioRef={player.audioRef}
            audioUrl={realm.audioUrl}
            title={realm.title}
            producer={realm.producerName}
            isPlaying={player.isPlaying}
            isLoading={player.isLoading}
            error={player.error ?? analyzer.error}
            currentTime={player.currentTime}
            duration={activeDuration}
            progress={player.progress}
            volume={player.volume}
            muted={player.muted}
            peaks={waveform.peaks}
            waveformLoading={waveform.isLoading}
            waveformError={waveform.error}
            onTogglePlay={async () => {
              await analyzer.ensureAnalyzer();
              player.togglePlay();
            }}
            onSeek={player.seek}
            onVolumeChange={player.setVolume}
            onToggleMute={player.toggleMute}
          />
        </div>
      </div>
    </div>
  );
}
