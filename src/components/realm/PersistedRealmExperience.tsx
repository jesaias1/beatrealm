"use client";

import { ArrowLeft, Cloud, Gamepad2, HardDrive } from "lucide-react";
import { AudioEnergyDebug } from "@/components/audio/AudioEnergyDebug";
import { AudioReactiveCover } from "@/components/audio/AudioReactiveCover";
import { RealmAudioPlayer } from "@/components/audio/RealmAudioPlayer";
import { CTAButton } from "@/components/ui/CTAButton";
import { StatPill } from "@/components/ui/StatPill";
import { SharePanel } from "@/components/share/SharePanel";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAuth } from "@/hooks/useAuth";
import { useWaveformData } from "@/hooks/useWaveformData";
import type { PersistedRealm } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { CopyLinkButton } from "./CopyLinkButton";
import { RealmStatsPanel } from "./RealmStatsPanel";
import { CloudLeaderboard } from "./CloudLeaderboard";

type PersistedRealmExperienceProps = {
  realm: PersistedRealm;
};

export function PersistedRealmExperience({ realm }: PersistedRealmExperienceProps) {
  const player = useAudioPlayer(realm.audioUrl);
  const analyzer = useAudioAnalyzer(player.audioRef, player.isPlaying);
  const waveform = useWaveformData(realm.audioUrl, 96);
  const { user } = useAuth();
  const backgroundGlow = analyzer.energy.overallEnergy * 0.28;
  const isCloud = realm.source === "cloud";

  async function handleTogglePlay() {
    await analyzer.ensureAnalyzer();
    player.togglePlay();
  }

  return (
    <section
      className="relative grid min-h-[calc(100vh-84px)] items-center gap-8 overflow-hidden px-5 py-8 lg:grid-cols-[0.86fr_1.14fr] lg:px-8"
      style={{
        background: `radial-gradient(circle at 22% 28%, rgba(33,247,255,${backgroundGlow}), transparent 34%), radial-gradient(circle at 76% 20%, rgba(255,42,109,${backgroundGlow * 0.75}), transparent 30%)`,
      }}
    >
      <div className="mx-auto w-full max-w-xl">
        <AudioReactiveCover realm={realm} energy={analyzer.energy} />
      </div>

      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <StatusBadge 
            label={isCloud ? "Cloud Realm" : "Local Realm"} 
            variant={isCloud ? "cloud" : "local"} 
            icon={isCloud ? Cloud : HardDrive} 
          />
        </div>
        <h1 className="mt-3 text-6xl font-black uppercase leading-none text-white glitch-shadow">
          {realm.title}
        </h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-zinc-400">
          Produced by{" "}
          <Link href={`/producer/${realm.producerSlug || realm.producerName.toLowerCase()}`} className="text-[#21f7ff] hover:underline">
            {realm.producerName}
          </Link>
        </p>
        {realm.description ? (
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            {realm.description}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Mood" value={realm.mood} />
          <StatPill label="Genre" value={realm.genre} />
          <StatPill label="Style" value={realm.visualStyle} />
          <StatPill label="BPM" value={String(realm.bpm ?? "TBD")} />
        </div>

        <div className="mt-6">
          <RealmAudioPlayer
            audioRef={player.audioRef}
            audioUrl={realm.audioUrl}
            title={realm.title}
            producer={realm.producerName}
            isPlaying={player.isPlaying}
            isLoading={player.isLoading}
            error={player.error ?? analyzer.error}
            currentTime={player.currentTime}
            duration={player.duration || waveform.duration}
            progress={player.progress}
            volume={player.volume}
            muted={player.muted}
            peaks={waveform.peaks}
            waveformLoading={waveform.isLoading}
            waveformError={waveform.error}
            onTogglePlay={handleTogglePlay}
            onSeek={player.seek}
            onVolumeChange={player.setVolume}
            onToggleMute={player.toggleMute}
          />
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white">
            Show audio data
          </summary>
          <div className="mt-3">
            <AudioEnergyDebug energy={analyzer.energy} />
          </div>
        </details>

        <RealmStatsPanel realmSlug={realm.slug} />

        {isCloud ? (
          <CloudLeaderboard realmSlug={realm.slug} currentUserId={user?.id} />
        ) : null}

        <SharePanel realm={realm} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/dashboard" variant="ghost" icon={ArrowLeft}>
            Back to Dashboard
          </CTAButton>
          <CTAButton href={`/realm/${realm.slug}/fight`} variant="secondary" icon={Gamepad2}>
            Enter Fight Mode
          </CTAButton>
          <CopyLinkButton path={`/realm/${realm.slug}`} />
        </div>
      </div>
    </section>
  );
}
