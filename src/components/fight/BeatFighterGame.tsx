"use client";

import { ArrowLeft, Swords } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RealmAudioPlayer } from "@/components/audio/RealmAudioPlayer";
import { CTAButton } from "@/components/ui/CTAButton";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAuth } from "@/hooks/useAuth";
import { useBeatFighterGame } from "@/hooks/useBeatFighterGame";
import { useWaveformData } from "@/hooks/useWaveformData";
import { getTimingOffsetMs } from "@/lib/fight/calibration";
import { difficultyConfigs } from "@/lib/fight/hitWindows";
import type { FightDifficulty } from "@/lib/fight/types";
import type { PersistedRealm } from "@/types";
import { BossStage } from "./BossStage";
import { FightSettingsPanel } from "./FightSettingsPanel";
import { FightControlsGuide } from "./FightControlsGuide";
import { FightHud } from "./FightHud";
import { FightResultScreen } from "./FightResultScreen";
import { HitPromptTrack } from "./HitPromptTrack";
import { LocalBestPanel } from "./LocalBestPanel";
import { MobileHitPad } from "./MobileHitPad";
import { RecentAttemptsPanel } from "./RecentAttemptsPanel";
import { StatusBadge } from "@/components/ui/StatusBadge";

type BeatFighterGameProps = {
  realm: PersistedRealm;
};

const difficulties: FightDifficulty[] = ["easy", "normal", "hard"];

type CloudSaveStatus = "saved" | "not-logged-in" | "error" | "not-cloud" | null;

export function BeatFighterGame({ realm }: BeatFighterGameProps) {
  const [difficulty, setDifficulty] = useState<FightDifficulty>("normal");
  const [timingOffsetMs, setTimingOffsetMs] = useState(() => getTimingOffsetMs());
  const [historyVersion, setHistoryVersion] = useState(0);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<CloudSaveStatus>(null);
  const { user, accessToken, isCloudConfigured } = useAuth();
  const isCloudRealm = realm.source === "cloud";
  const player = useAudioPlayer(realm.audioUrl, false);
  const analyzer = useAudioAnalyzer(player.audioRef, player.isPlaying);
  const waveform = useWaveformData(realm.audioUrl, 128);
  const game = useBeatFighterGame({
    audioRef: player.audioRef,
    peaks: waveform.peaks,
    duration: player.duration || waveform.duration || 30,
    difficulty,
    realmSlug: realm.slug,
    realmTitle: realm.title,
    producerName: realm.producerName,
    timingOffsetMs,
    onStartAudio: async () => {
      await analyzer.ensureAnalyzer();
      await player.togglePlay();
    },
  });
  const activeDuration = player.duration || waveform.duration || 0;
  const canStart = !waveform.isLoading;

  // Cloud result saving
  const saveCloudResult = useCallback(async () => {
    if (!isCloudRealm || !isCloudConfigured) {
      setCloudSaveStatus("not-cloud");
      return;
    }
    if (!user || !accessToken) {
      setCloudSaveStatus("not-logged-in");
      return;
    }
    if (!game.result) return;

    try {
      const response = await fetch("/api/cloud/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          realmId: realm.id,
          difficulty,
          outcome: game.result.outcome,
          rank: game.result.rank,
          score: game.result.score,
          accuracy: game.result.accuracy,
          maxCombo: game.result.maxCombo,
          perfects: game.result.perfects,
          greats: game.result.greats,
          goods: game.result.goods,
          misses: game.result.misses,
          totalPrompts: game.result.totalPrompts,
          durationSeconds: activeDuration,
        }),
      });

      if (response.ok) {
        setCloudSaveStatus("saved");
      } else {
        setCloudSaveStatus("error");
      }
    } catch {
      setCloudSaveStatus("error");
    }
  }, [isCloudRealm, isCloudConfigured, user, accessToken, game.result, realm.id, difficulty, activeDuration]);

  const prevSavedResultRef = useRef(game.savedResult);
  const prevGameStateRef = useRef(game.gameState);

  // Use requestAnimationFrame to avoid synchronous setState in effect
  useEffect(() => {
    if (game.savedResult && game.savedResult !== prevSavedResultRef.current) {
      prevSavedResultRef.current = game.savedResult;
      queueMicrotask(() => setHistoryVersion((version) => version + 1));
      requestAnimationFrame(() => {
        void saveCloudResult();
      });
    }
    if (game.gameState === "countdown" && prevGameStateRef.current !== "countdown") {
      requestAnimationFrame(() => {
        setCloudSaveStatus(null);
      });
    }
    prevGameStateRef.current = game.gameState;
  }, [game.savedResult, saveCloudResult, game.gameState]);

  return (
    <section className="min-h-[calc(100vh-84px)] bg-[radial-gradient(circle_at_50%_10%,rgba(255,42,109,0.16),transparent_28%),linear-gradient(180deg,#08080a,#050505)] pb-32 md:pb-0">
      <FightHud
        playerHealth={game.playerHealth}
        bossHealth={game.bossHealth}
        score={game.stats.score}
        combo={game.stats.currentCombo}
        accuracy={game.accuracy}
        progress={player.progress}
        gameState={game.gameState}
        onPause={game.pauseFight}
        onResume={game.resumeFight}
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[0.74fr_1.26fr_0.72fr] lg:px-8">
        <aside className="grid content-start gap-4">
          <div className="border border-white/10 bg-black/40 p-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#ff2a6d]">
              Beat Fighter
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-none text-white glitch-shadow">
              {realm.title}
            </h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
              {realm.producerName}
            </p>
            <div className="mt-4">
              <StatusBadge 
                label={isCloudRealm ? "Cloud Realm" : "Local Realm"} 
                variant={isCloudRealm ? "cloud" : "local"} 
              />
            </div>
          </div>

          <div className="border border-white/10 bg-black/35 p-5">
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
              Difficulty
            </h2>
            <div className="mt-3 grid gap-2">
              {difficulties.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={game.gameState !== "idle"}
                  onClick={() => setDifficulty(item)}
                  className={`border px-3 py-3 text-left font-mono text-xs font-black uppercase tracking-[0.14em] transition focus:outline-none focus:ring-2 focus:ring-[#21f7ff] disabled:cursor-not-allowed disabled:opacity-50 ${
                    difficulty === item
                      ? "border-[#b7ff2a] bg-[#b7ff2a]/12 text-white"
                      : "border-white/10 bg-black/30 text-zinc-400 hover:border-white/30"
                  }`}
                >
                  {difficultyConfigs[item].label}
                </button>
              ))}
            </div>
          </div>

          <LocalBestPanel realmSlug={realm.slug} refreshKey={historyVersion} />

          <CTAButton href={`/realm/${realm.slug}`} variant="ghost" icon={ArrowLeft}>
            Back to Realm
          </CTAButton>
        </aside>

        <main className="grid gap-5">
          <div
            role="button"
            tabIndex={-1}
            aria-label="Beat Fighter stage hit area"
            onPointerDown={(event) => {
              if (game.gameState === "playing") {
                event.preventDefault();
                game.judgeAttack();
              }
            }}
          >
            <BossStage
              realm={realm}
              energy={analyzer.energy}
              bossHealth={game.bossHealth}
              feedback={game.feedback}
              lastImpact={game.lastImpact}
            />
          </div>
          <HitPromptTrack
            prompts={game.prompts}
            currentTime={player.currentTime + timingOffsetMs / 1000}
            duration={activeDuration}
          />
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
            onTogglePlay={() => {
              if (game.gameState === "playing") {
                game.pauseFight();
              } else if (game.gameState === "paused") {
                game.resumeFight();
              }
            }}
            onSeek={() => undefined}
            onVolumeChange={player.setVolume}
            onToggleMute={player.toggleMute}
          />
        </main>

        <aside className="grid content-start gap-4">
          {game.gameState === "idle" ? (
            <div className="border border-[#b7ff2a]/35 bg-black/40 p-5 glow-border">
              <Swords className="text-[#b7ff2a]" size={30} />
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                Start the fight
              </h2>
              <div className="mt-3 text-sm leading-6 text-zinc-300">
                <p>Hit prompts are generated from this Realm&apos;s audio peaks.</p>
                <div className="mt-3 border-l-2 border-[#b7ff2a] pl-3">
                  {isCloudRealm ? (
                    user ? (
                      <span className="text-[#b7ff2a]">Logged in. Score will submit to the global leaderboard.</span>
                    ) : (
                      <span className="text-[#ffb000]">Not logged in. Score will not submit to the global leaderboard.</span>
                    )
                  ) : (
                    <span className="text-zinc-400">Local Realm. Play for fun; global leaderboards require Cloud Realms.</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                disabled={!canStart}
                onClick={game.startFight}
                className="mt-5 w-full border border-[#b7ff2a]/70 bg-[#b7ff2a] px-5 py-4 font-mono text-sm font-black uppercase tracking-[0.16em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
              >
                {canStart ? "Start Fight" : "Loading Markers"}
              </button>
            </div>
          ) : null}
          {game.gameState === "paused" ? (
            <div className="border border-[#21f7ff]/35 bg-black/40 p-5">
              <h2 className="text-3xl font-black uppercase text-white">Paused</h2>
              <button
                type="button"
                onClick={game.resumeFight}
                className="mt-4 w-full border border-[#21f7ff]/60 bg-[#21f7ff]/10 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={game.startFight}
                className="mt-3 w-full border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-200 transition hover:border-[#ff2a6d]/50"
              >
                Restart Round
              </button>
            </div>
          ) : null}
          <FightSettingsPanel
            timingOffsetMs={timingOffsetMs}
            onTimingOffsetChange={setTimingOffsetMs}
            disabled={game.gameState !== "idle"}
          />
          <RecentAttemptsPanel
            realmSlug={realm.slug}
            refreshKey={historyVersion}
            limit={4}
          />
          <FightControlsGuide onHit={game.judgeAttack} />
        </aside>
      </div>

      {game.countdown ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70">
          <p className="glitch-shadow text-8xl font-black uppercase text-white">
            {game.countdown}
          </p>
        </div>
      ) : null}

      {game.result ? (
        <FightResultScreen
          realm={realm}
          result={game.result}
          difficulty={difficulty}
          isNewBest={game.isNewBest}
          onReplay={game.startFight}
          cloudSaveStatus={cloudSaveStatus}
        />
      ) : null}
      <MobileHitPad
        gameState={game.gameState}
        combo={game.stats.currentCombo}
        onHit={game.judgeAttack}
      />
    </section>
  );
}
