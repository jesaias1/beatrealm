"use client";

import type { PersistedRealm } from "@/types";
import { BeatFighterGame } from "./BeatFighterGame";

type PersistedFightPrepExperienceProps = {
  realm: PersistedRealm;
};

export function PersistedFightPrepExperience({
  realm,
}: PersistedFightPrepExperienceProps) {
  return <BeatFighterGame realm={realm} />;
}
