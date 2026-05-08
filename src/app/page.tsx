"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { UploadCloud } from "lucide-react";
import { RealmAudioPlayer } from "@/components/audio/RealmAudioPlayer";

export default function Home() {
  const [audioFile, setAudioFile] = useState<{ url: string; name: string } | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      setAudioFile({ url, name: file.name.replace(/\.[^/.]+$/, "") });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      setAudioFile({ url, name: file.name.replace(/\.[^/.]+$/, "") });
    }
  };

  if (audioFile) {
    return <Visualizer url={audioFile.url} name={audioFile.name} onReset={() => setAudioFile(null)} />;
  }

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-84px)] items-center justify-center p-5">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative flex w-full max-w-2xl flex-col items-center justify-center gap-6 border-2 border-dashed border-white/20 bg-black/40 p-20 text-center transition hover:border-[#b7ff2a]/50 hover:bg-black/60"
        >
          <div className="rounded-full bg-white/5 p-5 text-[#b7ff2a]">
            <UploadCloud size={48} />
          </div>
          <div>
            <h1 className="font-mono text-xl font-black uppercase tracking-[0.2em] text-white">
              Drop Beat Here
            </h1>
            <p className="mt-2 text-sm text-zinc-400">MP3, WAV, or AAC</p>
          </div>
          <label className="cursor-pointer border border-[#b7ff2a]/60 bg-[#b7ff2a]/10 px-8 py-3 font-mono text-sm font-black uppercase tracking-[0.16em] text-[#b7ff2a] transition hover:bg-[#b7ff2a] hover:text-black">
            Select File
            <input type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
          </label>
        </div>
      </div>
    </AppShell>
  );
}

function Visualizer({ url, name, onReset }: { url: string; name: string; onReset: () => void }) {
  const player = useAudioPlayer(url, true);
  const analyzer = useAudioAnalyzer(player.audioRef, player.isPlaying);

  useEffect(() => {
    analyzer.ensureAnalyzer();
  }, [analyzer]);

  const energy = analyzer.energy;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505]">
      {/* Immersive Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-75"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(33,247,255,${energy.overallEnergy * 0.4}), transparent 50%), radial-gradient(circle at 50% 62%, rgba(255,42,109,${energy.bassEnergy * 0.3}), transparent 40%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />

      {/* Top Bar */}
      <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between p-5">
        <button
          onClick={onReset}
          className="border border-white/10 bg-black/50 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 transition hover:text-white"
        >
          Close
        </button>
        <h1 className="font-mono text-sm font-black uppercase tracking-widest text-white">
          {name}
        </h1>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Central Visualizer Block */}
      <div
        className="absolute left-1/2 top-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/50 transition-transform duration-75"
        style={{
          transform: `translate(-50%, -50%) scale(${1 + energy.bassEnergy * 0.25}) rotate(${(energy.midEnergy - 0.5) * 15}deg)`,
          boxShadow: `0 0 ${energy.overallEnergy * 60}px rgba(33,247,255,0.4)`,
        }}
      >
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]" />
        {energy.isPeak ? (
          <div className="absolute inset-0 bg-[#ff2a6d]/40 mix-blend-screen" />
        ) : null}
      </div>

      {/* Treble Flare */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 mix-blend-screen blur-3xl transition-all duration-75"
        style={{
          background: `rgba(183, 255, 42, ${energy.trebleEnergy * 0.4})`,
          transform: `scale(${1 + energy.trebleEnergy * 2})`,
        }}
      />

      {/* Audio Player pinned to bottom */}
      <div className="relative z-30 mt-auto w-full border-t border-white/10 bg-black/80 p-5 backdrop-blur-xl">
        <RealmAudioPlayer
          audioRef={player.audioRef}
          audioUrl={url}
          title={name}
          producer="Local File"
          isPlaying={player.isPlaying}
          isLoading={player.isLoading}
          error={player.error ?? analyzer.error}
          currentTime={player.currentTime}
          duration={player.duration}
          progress={player.progress}
          volume={player.volume}
          muted={player.muted}
          peaks={[]}
          waveformLoading={false}
          waveformError={null}
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
  );
}
