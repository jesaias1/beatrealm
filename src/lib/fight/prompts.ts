import { generateHitMarkers, type HitMarker } from "@/lib/audio/hitMarkers";
import { difficultyConfigs } from "./hitWindows";
import type { FightDifficulty, FightPrompt } from "./types";

function fallbackMarkers(duration: number, difficulty: FightDifficulty) {
  const spacing = difficulty === "easy" ? 1.8 : difficulty === "hard" ? 0.95 : 1.25;
  const markers: HitMarker[] = [];
  for (let time = 1; time < Math.max(1, duration - 0.5); time += spacing) {
    markers.push({
      time,
      intensity: 0.55,
      type: time % 3 < 1 ? "bass" : "energy",
    });
  }
  return markers;
}

export function buildFightPrompts(
  peaks: number[],
  duration: number,
  difficulty: FightDifficulty,
) {
  const config = difficultyConfigs[difficulty];
  const generated = generateHitMarkers(peaks, duration);
  const sourceMarkers =
    generated.length >= 8 ? generated : fallbackMarkers(duration, difficulty);
  const sorted = [...sourceMarkers].sort((a, b) => b.intensity - a.intensity);
  const chosen: HitMarker[] = [];

  sorted.forEach((marker) => {
    if (chosen.length >= config.maxPrompts) {
      return;
    }
    const tooClose = chosen.some(
      (existing) => Math.abs(existing.time - marker.time) < config.minSpacing,
    );
    if (!tooClose) {
      chosen.push(marker);
    }
  });

  return chosen
    .sort((a, b) => a.time - b.time)
    .map(
      (marker, index): FightPrompt => ({
        ...marker,
        id: `prompt-${index}-${marker.time.toFixed(2)}`,
        status: "upcoming",
      }),
    );
}
