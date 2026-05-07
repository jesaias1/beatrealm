export type WaveformAnalysis = {
  peaks: number[];
  duration: number;
};

export function buildWaveformPeaks(audioBuffer: AudioBuffer, barCount = 96) {
  const channel = audioBuffer.getChannelData(0);
  const samplesPerBar = Math.max(1, Math.floor(channel.length / barCount));
  const peaks: number[] = [];

  for (let bar = 0; bar < barCount; bar += 1) {
    const start = bar * samplesPerBar;
    const end = Math.min(start + samplesPerBar, channel.length);
    let sum = 0;

    for (let index = start; index < end; index += 1) {
      sum += Math.abs(channel[index] ?? 0);
    }

    peaks.push(sum / Math.max(1, end - start));
  }

  const maxPeak = Math.max(...peaks, 0.01);
  return peaks.map((peak) => Math.min(1, peak / maxPeak));
}

export async function analyzeAudioBuffer(audioUrl: string, barCount = 96) {
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error("Unable to load audio for waveform.");
  }

  const arrayBuffer = await response.arrayBuffer();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    return {
      peaks: buildWaveformPeaks(audioBuffer, barCount),
      duration: audioBuffer.duration,
    } satisfies WaveformAnalysis;
  } finally {
    await audioContext.close();
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

