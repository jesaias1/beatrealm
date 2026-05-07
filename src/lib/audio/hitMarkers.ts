export type HitMarker = {
  time: number;
  intensity: number;
  type: "peak" | "bass" | "energy";
};

export function generateHitMarkers(peaks: number[], duration: number) {
  if (!peaks.length || !Number.isFinite(duration) || duration <= 0) {
    return [];
  }

  const markers: HitMarker[] = [];
  const secondsPerPeak = duration / peaks.length;

  for (let index = 1; index < peaks.length - 1; index += 1) {
    const previous = peaks[index - 1] ?? 0;
    const current = peaks[index] ?? 0;
    const next = peaks[index + 1] ?? 0;
    const localJump = current - Math.max(previous, next * 0.72);

    if (current > 0.58 && localJump > 0.08) {
      markers.push({
        time: index * secondsPerPeak,
        intensity: current,
        type:
          current > 0.82 ? "peak" : index % 3 === 0 ? "bass" : "energy",
      });
    }
  }

  return markers
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 48)
    .sort((a, b) => a.time - b.time);
}
