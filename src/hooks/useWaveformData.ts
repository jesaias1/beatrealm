"use client";

import { useEffect, useState } from "react";
import { analyzeAudioBuffer } from "@/lib/audio/analyzeBuffer";

export function useWaveformData(audioUrl: string, barCount = 96) {
  const [peaks, setPeaks] = useState<number[]>([]);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWaveform() {
      setIsLoading(true);
      setError(null);

      try {
        const analysis = await analyzeAudioBuffer(audioUrl, barCount);
        if (!isMounted) {
          return;
        }
        setPeaks(analysis.peaks);
        setDuration(analysis.duration);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setPeaks([]);
        setDuration(0);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to generate waveform.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWaveform();

    return () => {
      isMounted = false;
    };
  }, [audioUrl, barCount]);

  return { peaks, duration, isLoading, error };
}
