"use client";

const STORAGE_KEY = "beatrealm.fightCalibration.v1";

export function getTimingOffsetMs() {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? Math.max(-200, Math.min(200, value)) : 0;
}

export function saveTimingOffsetMs(value: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    String(Math.max(-200, Math.min(200, Math.round(value)))),
  );
}
