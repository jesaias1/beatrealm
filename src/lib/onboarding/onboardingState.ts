"use client";

import { useEffect, useState } from "react";

export type OnboardingState = {
  createdRealm: boolean;
  openedRealm: boolean;
  playedFight: boolean;
  publishedCloud: boolean;
  sharedLink: boolean;
};

const defaultState: OnboardingState = {
  createdRealm: false,
  openedRealm: false,
  playedFight: false,
  publishedCloud: false,
  sharedLink: false,
};

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("beatrealm.onboarding.v1");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ ...defaultState, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  function markCompleted(key: keyof OnboardingState) {
    setState((current) => {
      if (current[key]) return current; // Already true
      const next = { ...current, [key]: true };
      try {
        window.localStorage.setItem("beatrealm.onboarding.v1", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function dismiss() {
    try {
      window.localStorage.setItem("beatrealm.onboarding.dismissed.v1", "true");
      setIsLoaded(false); // Quick way to hide it
    } catch {
      // ignore
    }
  }

  const isDismissed = typeof window !== "undefined" 
    ? window.localStorage.getItem("beatrealm.onboarding.dismissed.v1") === "true" 
    : false;

  const progress = Object.values(state).filter(Boolean).length;
  const total = Object.keys(state).length;
  const isComplete = progress === total;

  return {
    state,
    progress,
    total,
    isComplete,
    isLoaded: isLoaded && !isDismissed,
    markCompleted,
    dismiss,
  };
}
