export type AudioEnergy = {
  volume: number;
  bassEnergy: number;
  midEnergy: number;
  trebleEnergy: number;
  overallEnergy: number;
  isPeak: boolean;
  peakIntensity: number;
};

export const emptyAudioEnergy: AudioEnergy = {
  volume: 0,
  bassEnergy: 0,
  midEnergy: 0,
  trebleEnergy: 0,
  overallEnergy: 0,
  isPeak: false,
  peakIntensity: 0,
};

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function smoothValue(previous: number, next: number, amount = 0.22) {
  return previous + (next - previous) * amount;
}

export function averageFrequencyRange(
  frequencyData: Uint8Array,
  startRatio: number,
  endRatio: number,
) {
  const start = Math.max(0, Math.floor(frequencyData.length * startRatio));
  const end = Math.max(start + 1, Math.floor(frequencyData.length * endRatio));
  let total = 0;

  for (let index = start; index < end; index += 1) {
    total += frequencyData[index] ?? 0;
  }

  return clamp01(total / (end - start) / 255);
}

