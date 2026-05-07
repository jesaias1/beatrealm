"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBestResultForRealm, saveFightResult } from "@/lib/fight/localResults";
import { isBetterResult, type StoredFightResult } from "@/lib/fight/results";
import { rankFight } from "@/lib/fight/ranking";
import { accuracyFromStats, emptyFightStats, scoreForHit } from "@/lib/fight/scoring";
import type { FightDifficulty, FightFeedback, FightGameState, FightOutcome, FightResult, HitResult } from "@/lib/fight/types";

type UseBeatFighterGameOptions = {
  audioRef: RefObject<HTMLAudioElement | null>;
  peaks: number[];
  duration: number;
  difficulty: FightDifficulty;
  realmSlug: string;
  realmTitle: string;
  producerName: string;
  timingOffsetMs: number;
  onStartAudio: () => Promise<void> | void;
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

export function useBeatFighterGame({
  audioRef,
  peaks,
  duration,
  difficulty,
  realmSlug,
  realmTitle,
  producerName,
  timingOffsetMs,
  onStartAudio,
}: UseBeatFighterGameOptions) {
  const [gameState, setGameState] = useState<FightGameState>("idle");
  const [countdown, setCountdown] = useState<string | null>(null);
  const [stats, setStats] = useState(emptyFightStats);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(1000); // Fixed boss health for Hack & Slash
  const [feedback, setFeedback] = useState<FightFeedback | null>(null);
  const [result, setResult] = useState<FightResult | null>(null);
  const [savedResult, setSavedResult] = useState<StoredFightResult | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [lastImpact, setLastImpact] = useState<HitResult | null>(null);
  
  const animationRef = useRef<number | null>(null);
  const feedbackIdRef = useRef(0);
  const statsRef = useRef(emptyFightStats());
  const gameStateRef = useRef<FightGameState>("idle");
  const bossHealthRef = useRef(1000);
  const resultSavedRef = useRef(false);

  const accuracy = accuracyFromStats(stats);

  const clearFrame = useCallback(() => {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const commitStats = useCallback((nextStats: ReturnType<typeof emptyFightStats>) => {
    statsRef.current = nextStats;
    setStats(nextStats);
  }, []);

  const finishGame = useCallback(
    (outcome: FightOutcome, forcedStats?: ReturnType<typeof emptyFightStats>) => {
      if (resultSavedRef.current) return;
      resultSavedRef.current = true;
      const nextStats = forcedStats ?? statsRef.current;
      const failed = outcome === "failed";
      const finalAccuracy = accuracyFromStats(nextStats);
      
      const finalResult: FightResult = {
        outcome,
        rank: rankFight(finalAccuracy, failed),
        score: nextStats.score,
        accuracy: finalAccuracy,
        maxCombo: nextStats.maxCombo,
        perfects: nextStats.perfects,
        greats: nextStats.greats,
        goods: nextStats.goods,
        misses: nextStats.misses,
        successfulHits: nextStats.successfulHits,
        totalPrompts: peaks.length,
      };

      const previousBest = getBestResultForRealm(realmSlug);
      const stored = saveFightResult({
        realmSlug,
        realmTitle,
        producerName,
        difficulty,
        outcome,
        rank: finalResult.rank,
        score: finalResult.score,
        accuracy: finalResult.accuracy,
        maxCombo: finalResult.maxCombo,
        perfects: finalResult.perfects,
        greats: finalResult.greats,
        goods: finalResult.goods,
        misses: finalResult.misses,
        totalPrompts: finalResult.totalPrompts,
        durationSeconds: duration,
      });

      if (audioRef.current) audioRef.current.pause();
      clearFrame();
      setResult(finalResult);
      setSavedResult(stored);
      setIsNewBest(isBetterResult(stored, previousBest));
      setGameState(failed ? "failed" : "finished");
    },
    [audioRef, clearFrame, difficulty, duration, peaks.length, producerName, realmSlug, realmTitle],
  );

  const showFeedback = useCallback((resultLabel: HitResult, offsetSeconds: number) => {
    feedbackIdRef.current += 1;
    const label = resultLabel === "miss" ? "Attack!" : `${resultLabel[0].toUpperCase()}${resultLabel.slice(1)}`;
    setFeedback({
      result: resultLabel,
      offsetMs: Math.round(offsetSeconds * 1000),
      label,
      id: feedbackIdRef.current,
    });
    setLastImpact(resultLabel);
    window.setTimeout(() => setLastImpact(null), 220);
  }, []);

  const judgeAttack = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    const audio = audioRef.current;
    if (!audio) return;

    const currentTime = audio.currentTime + timingOffsetMs / 1000;
    
    // Find closest peak
    let closestOffset = Infinity;
    for (const peak of peaks) {
      const offset = Math.abs(currentTime - peak);
      if (offset < closestOffset) {
        closestOffset = offset;
      }
    }

    let resultLabel: HitResult = "miss";
    if (closestOffset <= 0.1) resultLabel = "perfect";
    else if (closestOffset <= 0.2) resultLabel = "great";
    else if (closestOffset <= 0.3) resultLabel = "good";

    const nextCombo = resultLabel === "miss" ? 0 : statsRef.current.currentCombo + 1;
    const damage = resultLabel === "perfect" ? 40 : resultLabel === "great" ? 20 : resultLabel === "good" ? 10 : 2;

    const nextStats = {
      ...statsRef.current,
      score: statsRef.current.score + scoreForHit(resultLabel, nextCombo),
      currentCombo: nextCombo,
      maxCombo: Math.max(statsRef.current.maxCombo, nextCombo),
      successfulHits: statsRef.current.successfulHits + (resultLabel !== "miss" ? 1 : 0),
      perfects: statsRef.current.perfects + (resultLabel === "perfect" ? 1 : 0),
      greats: statsRef.current.greats + (resultLabel === "great" ? 1 : 0),
      goods: statsRef.current.goods + (resultLabel === "good" ? 1 : 0),
      misses: statsRef.current.misses + (resultLabel === "miss" ? 1 : 0),
      totalJudged: statsRef.current.totalJudged + 1,
    };
    
    commitStats(nextStats);
    
    const nextBossHealth = Math.max(0, bossHealthRef.current - damage);
    bossHealthRef.current = nextBossHealth;
    setBossHealth(nextBossHealth);
    showFeedback(resultLabel, closestOffset);

    if (nextBossHealth <= 0) {
      finishGame("victory", nextStats);
    }
  }, [audioRef, commitStats, finishGame, peaks, showFeedback, timingOffsetMs]);

  const tick = useCallback(function runTick() {
    const audio = audioRef.current;
    if (!audio || gameStateRef.current !== "playing") return;

    const now = audio.currentTime + timingOffsetMs / 1000;
    
    // Player health acts as a timer. If it hits 0 before boss dies, you fail.
    const remainingRatio = Math.max(0, 1 - (now / (duration || 30)));
    const nextPlayerHealth = Math.floor(remainingRatio * 100);
    setPlayerHealth(nextPlayerHealth);

    if (nextPlayerHealth <= 0 && bossHealthRef.current > 0) {
      finishGame("failed");
      return;
    }

    if (audio.ended || (duration > 0 && now >= duration - 0.05)) {
      finishGame(bossHealthRef.current <= 0 ? "victory" : "failed");
      return;
    }

    animationRef.current = window.requestAnimationFrame(runTick);
  }, [audioRef, duration, finishGame, timingOffsetMs]);

  const resetGame = useCallback(() => {
    clearFrame();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    resultSavedRef.current = false;
    commitStats(emptyFightStats());
    bossHealthRef.current = 1000;
    setBossHealth(1000);
    setPlayerHealth(100);
    setFeedback(null);
    setResult(null);
    setSavedResult(null);
    setIsNewBest(false);
    setCountdown(null);
    setGameState("idle");
  }, [audioRef, clearFrame, commitStats]);

  const startFight = useCallback(async () => {
    resetGame();
    setGameState("countdown");
    for (const step of ["3", "2", "1", "FIGHT"]) {
      setCountdown(step);
      await new Promise((resolve) => window.setTimeout(resolve, step === "FIGHT" ? 420 : 650));
    }
    setCountdown(null);
    setGameState("playing");
    await onStartAudio();
  }, [onStartAudio, resetGame]);

  const pauseFight = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    audioRef.current?.pause();
    clearFrame();
    setGameState("paused");
  }, [audioRef, clearFrame]);

  const resumeFight = useCallback(async () => {
    if (gameStateRef.current !== "paused") return;
    setGameState("playing");
    await onStartAudio();
  }, [onStartAudio]);

  useEffect(() => {
    gameStateRef.current = gameState;
    if (gameState === "playing") {
      clearFrame();
      animationRef.current = window.requestAnimationFrame(tick);
    }
    return () => { if (gameState !== "playing") clearFrame(); };
  }, [clearFrame, gameState, tick]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      if (event.code === "Space" || ["a", "s", "d", "f"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        judgeAttack();
      }
      if (event.key === "Escape" || event.key.toLowerCase() === "p") {
        event.preventDefault();
        if (gameStateRef.current === "playing") pauseFight();
        else if (gameStateRef.current === "paused") resumeFight();
      }
      if (event.key.toLowerCase() === "r" && ["finished", "failed"].includes(gameStateRef.current)) {
        event.preventDefault();
        startFight();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [judgeAttack, pauseFight, resumeFight, startFight]);

  useEffect(() => () => clearFrame(), [clearFrame]);

  return {
    gameState,
    countdown,
    prompts: [], // Unused in Hack & Slash
    stats,
    accuracy,
    playerHealth,
    bossHealth: Math.max(0, Math.round((bossHealth / 1000) * 100)),
    rawBossHealth: bossHealth,
    feedback,
    result,
    savedResult,
    isNewBest,
    lastImpact,
    totalPrompts: peaks.length,
    startFight,
    pauseFight,
    resumeFight,
    resetGame,
    judgeAttack,
  };
}
