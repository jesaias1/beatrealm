"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    tagName === "button" ||
    tagName === "a" ||
    target.isContentEditable
  );
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function useAudioPlayer(audioUrl: string, enableKeyboard = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.9);
  const [muted, setMuted] = useState(false);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time)) {
      return;
    }

    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
    setCurrentTime(audio.currentTime);
  }, []);

  const setVolume = useCallback((value: number) => {
    const nextVolume = Math.max(0, Math.min(1, value));
    const audio = audioRef.current;
    if (audio) {
      audio.volume = nextVolume;
    }
    setVolumeState(nextVolume);
    if (nextVolume > 0) {
      setMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    const nextMuted = !muted;
    if (audio) {
      audio.muted = nextMuted;
    }
    setMuted(nextMuted);
  }, [muted]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    try {
      setError(null);
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setError("Playback was blocked. Try pressing play again.");
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.muted = muted;

    const element = audio;

    function handleLoadedMetadata() {
      setDuration(element.duration || 0);
      setIsLoading(false);
    }

    function handleTimeUpdate() {
      setCurrentTime(element.currentTime || 0);
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleWaiting() {
      setIsLoading(true);
    }

    function handleCanPlay() {
      setIsLoading(false);
    }

    function handleError() {
      setIsLoading(false);
      setError("Unable to load this audio file.");
    }

    element.addEventListener("loadedmetadata", handleLoadedMetadata);
    element.addEventListener("timeupdate", handleTimeUpdate);
    element.addEventListener("play", handlePlay);
    element.addEventListener("pause", handlePause);
    element.addEventListener("waiting", handleWaiting);
    element.addEventListener("canplay", handleCanPlay);
    element.addEventListener("error", handleError);

    return () => {
      element.removeEventListener("loadedmetadata", handleLoadedMetadata);
      element.removeEventListener("timeupdate", handleTimeUpdate);
      element.removeEventListener("play", handlePlay);
      element.removeEventListener("pause", handlePause);
      element.removeEventListener("waiting", handleWaiting);
      element.removeEventListener("canplay", handleCanPlay);
      element.removeEventListener("error", handleError);
    };
  }, [audioUrl, muted, volume]);

  useEffect(() => {
    if (!enableKeyboard) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        seek(currentTime - 5);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        seek(currentTime + 5);
      }
      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        toggleMute();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, enableKeyboard, seek, toggleMute, togglePlay]);

  return {
    audioRef,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    progress: duration > 0 ? currentTime / duration : 0,
    volume,
    muted,
    seek,
    setVolume,
    toggleMute,
    togglePlay,
  };
}
