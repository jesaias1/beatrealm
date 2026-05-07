"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getBestResultForRealm, saveFightResult } from "@/lib/fight/localResults";
import { isBetterResult, type StoredFightResult } from "@/lib/fight/results";
import { difficultyConfigs, judgeOffset } from "@/lib/fight/hitWindows";
import { rankFight } from "@/lib/fight/ranking";
import {
  accuracyFromStats,
  bossDamageForHit,
  emptyFightStats,
  missDamageForPrompt,
  scoreForHit,
} from "@/lib/fight/scoring";
import type {
  FightDifficulty,
  FightFeedback,
  FightGameState,
  FightOutcome,
  FightPrompt,
  FightResult,
  HitResult,
} from "@/lib/fight/types";
import { buildFightPrompts } from "@/lib/fight/prompts";

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
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
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
  const [prompts, setPrompts] = useState<FightPrompt[]>([]);
  const [stats, setStats] = useState(emptyFightStats);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(difficultyConfigs[difficulty].bossHealth);
  const [feedback, setFeedback] = useState<FightFeedback | null>(null);
  const [result, setResult] = useState<FightResult | null>(null);
  const [savedResult, setSavedResult] = useState<StoredFightResult | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [lastImpact, setLastImpact] = useState<HitResult | null>(null);
  const animationRef = useRef<number | null>(null);
  const feedbackIdRef = useRef(0);
  const promptsRef = useRef<FightPrompt[]>([]);
  const statsRef = useRef(emptyFightStats());
  const gameStateRef = useRef<FightGameState>("idle");
  const playerHealthRef = useRef(100);
  const bossHealthRef = useRef(difficultyConfigs[difficulty].bossHealth);
  const resultSavedRef = useRef(false);

  const preparedPrompts = useMemo(
    () => buildFightPrompts(peaks, duration, difficulty),
    [difficulty, duration, peaks],
  );

  const accuracy = accuracyFromStats(stats);
  const config = difficultyConfigs[difficulty];

  const clearFrame = useCallback(() => {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const commitPrompts = useCallback((nextPrompts: FightPrompt[]) => {
    promptsRef.current = nextPrompts;
    setPrompts(nextPrompts);
  }, []);

  const commitStats = useCallback((nextStats: ReturnType<typeof emptyFightStats>) => {
    statsRef.current = nextStats;
    setStats(nextStats);
  }, []);

  const finishGame = useCallback(
    (outcome: FightOutcome, forcedStats?: ReturnType<typeof emptyFightStats>) => {
      if (resultSavedRef.current) {
        return;
      }
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
        totalPrompts: promptsRef.current.length,
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
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
      clearFrame();
      setResult(finalResult);
      setSavedResult(stored);
      setIsNewBest(isBetterResult(stored, previousBest));
      setGameState(failed ? "failed" : "finished");
    },
    [audioRef, clearFrame, difficulty, duration, producerName, realmSlug, realmTitle],
  );

  const showFeedback = useCallback((resultLabel: HitResult, offsetSeconds: number) => {
    feedbackIdRef.current += 1;
    const label =
      resultLabel === "miss"
        ? "Miss"
        : `${resultLabel[0].toUpperCase()}${resultLabel.slice(1)}`;
    setFeedback({
      result: resultLabel,
      offsetMs: Math.round(offsetSeconds * 1000),
      label,
      id: feedbackIdRef.current,
    });
    setLastImpact(resultLabel);
    window.setTimeout(() => setLastImpact(null), 220);
  }, []);

  const applyMiss = useCallback(
    (prompt: FightPrompt) => {
      const damage = missDamageForPrompt(difficulty, prompt.intensity);
      const nextHealth = Math.max(0, playerHealthRef.current - damage);
      const nextStats = {
        ...statsRef.current,
        currentCombo: 0,
        misses: statsRef.current.misses + 1,
        totalJudged: statsRef.current.totalJudged + 1,
      };
      commitStats(nextStats);
      playerHealthRef.current = nextHealth;
      setPlayerHealth(nextHealth);
      showFeedback("miss", 0);
      if (nextHealth <= 0) {
        finishGame("failed", nextStats);
      }
    },
    [commitStats, difficulty, finishGame, showFeedback],
  );

  const judgeAttack = useCallback(() => {
    if (gameStateRef.current !== "playing") {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const currentTime = audio.currentTime + timingOffsetMs / 1000;
    const candidates = promptsRef.current
      .filter((prompt) => prompt.status === "upcoming" || prompt.status === "active")
      .map((prompt) => ({
        prompt,
        offset: currentTime - prompt.time,
        result: judgeOffset(currentTime - prompt.time, difficulty),
      }))
      .filter((candidate) => candidate.result)
      .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));

    const candidate = candidates[0];
    if (!candidate || !candidate.result) {
      showFeedback("miss", 0);
      return;
    }

    const resultLabel: HitResult = candidate.result;
    const nextPrompts = promptsRef.current.map((prompt) =>
      prompt.id === candidate.prompt.id
        ? { ...prompt, status: "hit" as const, judgedResult: resultLabel }
        : prompt,
    );
    commitPrompts(nextPrompts);

    const nextCombo = statsRef.current.currentCombo + 1;
    const nextStats = {
      ...statsRef.current,
      score: statsRef.current.score + scoreForHit(resultLabel, nextCombo),
      currentCombo: nextCombo,
      maxCombo: Math.max(statsRef.current.maxCombo, nextCombo),
      successfulHits: statsRef.current.successfulHits + 1,
      perfects:
        statsRef.current.perfects + (resultLabel === "perfect" ? 1 : 0),
      greats: statsRef.current.greats + (resultLabel === "great" ? 1 : 0),
      goods: statsRef.current.goods + (resultLabel === "good" ? 1 : 0),
      totalJudged: statsRef.current.totalJudged + 1,
    };
    commitStats(nextStats);
    const damage = bossDamageForHit(resultLabel, difficulty, candidate.prompt.intensity);
    const nextBossHealth = Math.max(0, bossHealthRef.current - damage);
    bossHealthRef.current = nextBossHealth;
    setBossHealth(nextBossHealth);
    showFeedback(resultLabel, candidate.offset);

    if (nextBossHealth <= 0) {
      finishGame("victory", nextStats);
    }
  }, [
    audioRef,
    commitPrompts,
    commitStats,
    difficulty,
    finishGame,
    showFeedback,
    timingOffsetMs,
  ]);

  const tick = useCallback(function runTick() {
    const audio = audioRef.current;
    if (!audio || gameStateRef.current !== "playing") {
      return;
    }

    const now = audio.currentTime + timingOffsetMs / 1000;
    const missedPrompts: FightPrompt[] = [];
    const nextPrompts = promptsRef.current.map((prompt) => {
      if (prompt.status !== "upcoming" && prompt.status !== "active") {
        return prompt;
      }
      const openingGrace = prompt.time < 3 ? 0.14 : 0;
      if (now > prompt.time + config.goodWindow + openingGrace) {
        const missed = { ...prompt, status: "missed" as const, judgedResult: "miss" as const };
        missedPrompts.push(missed);
        return missed;
      }
      if (Math.abs(now - prompt.time) <= config.goodWindow) {
        return { ...prompt, status: "active" as const };
      }
      return prompt;
    });

    if (missedPrompts.length > 0) {
      commitPrompts(nextPrompts);
      missedPrompts.forEach(applyMiss);
    } else {
      commitPrompts(nextPrompts);
    }

    const allJudged = nextPrompts.every(
      (prompt) => prompt.status === "hit" || prompt.status === "missed",
    );
    if (
      (audio.ended || (duration > 0 && now >= duration - 0.05) || allJudged) &&
      gameStateRef.current === "playing"
    ) {
      finishGame(bossHealthRef.current <= 0 ? "victory" : "survived");
      return;
    }

    animationRef.current = window.requestAnimationFrame(runTick);
  }, [
    applyMiss,
    audioRef,
    commitPrompts,
    config.goodWindow,
    duration,
    finishGame,
    timingOffsetMs,
  ]);

  const resetGame = useCallback(() => {
    clearFrame();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const freshStats = emptyFightStats();
    resultSavedRef.current = false;
    commitStats(freshStats);
    commitPrompts(preparedPrompts);
    playerHealthRef.current = 100;
    bossHealthRef.current = difficultyConfigs[difficulty].bossHealth;
    setPlayerHealth(100);
    setBossHealth(difficultyConfigs[difficulty].bossHealth);
    setFeedback(null);
    setResult(null);
    setSavedResult(null);
    setIsNewBest(false);
    setCountdown(null);
    setGameState("idle");
  }, [audioRef, clearFrame, commitPrompts, commitStats, difficulty, preparedPrompts]);

  const startFight = useCallback(async () => {
    resetGame();
    setGameState("countdown");
    const steps = ["3", "2", "1", "FIGHT"];
    for (const step of steps) {
      setCountdown(step);
      await new Promise((resolve) => window.setTimeout(resolve, step === "FIGHT" ? 420 : 650));
    }
    setCountdown(null);
    setGameState("playing");
    await onStartAudio();
  }, [onStartAudio, resetGame]);

  const pauseFight = useCallback(() => {
    if (gameStateRef.current !== "playing") {
      return;
    }
    audioRef.current?.pause();
    clearFrame();
    setGameState("paused");
  }, [audioRef, clearFrame]);

  const resumeFight = useCallback(async () => {
    if (gameStateRef.current !== "paused") {
      return;
    }
    setGameState("playing");
    await onStartAudio();
  }, [onStartAudio]);

  useEffect(() => {
    gameStateRef.current = gameState;
    if (gameState === "playing") {
      clearFrame();
      animationRef.current = window.requestAnimationFrame(tick);
    }
    return () => {
      if (gameState !== "playing") {
        clearFrame();
      }
    };
  }, [clearFrame, gameState, tick]);

  useEffect(() => {
    if (gameState === "idle") {
      commitPrompts(preparedPrompts);
    }
  }, [commitPrompts, gameState, preparedPrompts]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.code === "Space" || ["a", "s", "d", "f"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        judgeAttack();
      }
      if (event.key === "Escape" || event.key.toLowerCase() === "p") {
        event.preventDefault();
        if (gameStateRef.current === "playing") {
          pauseFight();
        } else if (gameStateRef.current === "paused") {
          resumeFight();
        }
      }
      if (event.key.toLowerCase() === "r" && ["finished", "failed"].includes(gameStateRef.current)) {
        event.preventDefault();
        startFight();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [judgeAttack, pauseFight, resumeFight, startFight]);

  useEffect(() => {
    return () => clearFrame();
  }, [clearFrame]);

  return {
    gameState,
    countdown,
    prompts,
    stats,
    accuracy,
    playerHealth,
    bossHealth: Math.max(0, Math.round((bossHealth / difficultyConfigs[difficulty].bossHealth) * 100)),
    rawBossHealth: bossHealth,
    feedback,
    result,
    savedResult,
    isNewBest,
    lastImpact,
    totalPrompts: prompts.length,
    startFight,
    pauseFight,
    resumeFight,
    resetGame,
    judgeAttack,
  };
}
