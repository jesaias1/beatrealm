"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
  averageFrequencyRange,
  clamp01,
  emptyAudioEnergy,
  smoothValue,
  type AudioEnergy,
} from "@/lib/audio/energy";

type SourceBundle = {
  context: AudioContext;
  analyser: AnalyserNode;
};

const sourceMap = new WeakMap<HTMLAudioElement, SourceBundle>();

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function useAudioAnalyzer(
  audioRef: RefObject<HTMLAudioElement | null>,
  isPlaying: boolean,
) {
  const [energy, setEnergy] = useState<AudioEnergy>(emptyAudioEnergy);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const previousEnergyRef = useRef<AudioEnergy>(emptyAudioEnergy);
  const recentVolumeRef = useRef(0);

  const ensureAnalyzer = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return null;
    }

    const existing = sourceMap.get(audio);
    if (existing) {
      if (existing.context.state === "suspended") {
        await existing.context.resume();
      }
      return existing;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setError("Web Audio is not available in this browser.");
      return null;
    }

    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.78;
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    const bundle = { context, analyser };
    sourceMap.set(audio, bundle);

    if (context.state === "suspended") {
      await context.resume();
    }

    return bundle;
  }, [audioRef]);

  useEffect(() => {
    let isMounted = true;
    const frequencyData = new Uint8Array(512);
    const timeData = new Uint8Array(512);

    async function start() {
      if (!isPlaying) {
        return;
      }

      const bundle = await ensureAnalyzer();
      if (!bundle || !isMounted) {
        return;
      }

      const analyser = bundle.analyser;

      function tick() {
        analyser.getByteFrequencyData(frequencyData);
        analyser.getByteTimeDomainData(timeData);

        let timeTotal = 0;
        for (let index = 0; index < timeData.length; index += 1) {
          const centered = ((timeData[index] ?? 128) - 128) / 128;
          timeTotal += centered * centered;
        }

        const rawVolume = clamp01(Math.sqrt(timeTotal / timeData.length) * 2.2);
        const bass = averageFrequencyRange(frequencyData, 0, 0.1);
        const mid = averageFrequencyRange(frequencyData, 0.1, 0.45);
        const treble = averageFrequencyRange(frequencyData, 0.45, 1);
        const overall = clamp01(rawVolume * 0.55 + bass * 0.2 + mid * 0.15 + treble * 0.1);
        const previous = previousEnergyRef.current;
        const smoothed: AudioEnergy = {
          volume: smoothValue(previous.volume, rawVolume),
          bassEnergy: smoothValue(previous.bassEnergy, bass),
          midEnergy: smoothValue(previous.midEnergy, mid),
          trebleEnergy: smoothValue(previous.trebleEnergy, treble),
          overallEnergy: smoothValue(previous.overallEnergy, overall),
          isPeak: false,
          peakIntensity: 0,
        };
        const peakIntensity = clamp01(smoothed.overallEnergy - recentVolumeRef.current - 0.08);
        smoothed.isPeak = peakIntensity > 0.08;
        smoothed.peakIntensity = peakIntensity;
        recentVolumeRef.current = smoothValue(recentVolumeRef.current, smoothed.overallEnergy, 0.08);
        previousEnergyRef.current = smoothed;

        if (isMounted) {
          setEnergy(smoothed);
          animationRef.current = window.requestAnimationFrame(tick);
        }
      }

      tick();
    }

    start();

    return () => {
      isMounted = false;
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [ensureAnalyzer, isPlaying]);

  return { energy, error, ensureAnalyzer };
}
