import type { RealmDraft, RealmGenre, RealmMood, RealmVisualStyle } from "@/types";

export type VisualStyleOption = {
  id: RealmVisualStyle;
  label: string;
  description: string;
  accent: string;
};

export type CoverPlaceholder = {
  id: string;
  label: string;
  gradient: string;
  accent: string;
  motif: "slash" | "orb" | "grid" | "ring" | "bars" | "void";
};

export const visualStyleOptions: VisualStyleOption[] = [
  {
    id: "glitch",
    label: "Glitch",
    description: "Distorted borders, scanlines, jitter accents.",
    accent: "#21f7ff",
  },
  {
    id: "dark",
    label: "Dark",
    description: "Black and grey pressure with a low contrast glow.",
    accent: "#b7ff2a",
  },
  {
    id: "rage",
    label: "Rage",
    description: "Aggressive red-orange energy and heavier frames.",
    accent: "#ff2a6d",
  },
  {
    id: "dreamy",
    label: "Dreamy",
    description: "Softer glow, floating elements, slower pulse.",
    accent: "#9bf6ff",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Monochrome, cleaner motion, thin edges.",
    accent: "#f6f6f0",
  },
];

export const moodOptions: RealmMood[] = [
  "dark",
  "aggressive",
  "sad",
  "dreamy",
  "futuristic",
  "underground",
  "cinematic",
  "weird",
];

export const genreOptions: RealmGenre[] = [
  "trap",
  "rage",
  "drill",
  "ambient",
  "electronic",
  "hyperpop",
  "experimental",
  "boom bap",
  "other",
];

export const coverPlaceholders: CoverPlaceholder[] = [
  {
    id: "circuit",
    label: "Night Circuit",
    gradient: "from-[#21f7ff] via-[#17171b] to-[#ff2a6d]",
    accent: "#21f7ff",
    motif: "grid",
  },
  {
    id: "ember",
    label: "Redline",
    gradient: "from-[#ffb000] via-[#ff2a6d] to-[#180607]",
    accent: "#ff2a6d",
    motif: "slash",
  },
  {
    id: "void",
    label: "Chrome Void",
    gradient: "from-[#f6f6f0] via-[#2a2a30] to-[#050505]",
    accent: "#f6f6f0",
    motif: "void",
  },
  {
    id: "halo",
    label: "Soft Halo",
    gradient: "from-[#9bf6ff] via-[#3b2c67] to-[#070617]",
    accent: "#9bf6ff",
    motif: "orb",
  },
  {
    id: "toxic",
    label: "Toxic Bass",
    gradient: "from-[#b7ff2a] via-[#202317] to-[#050505]",
    accent: "#b7ff2a",
    motif: "bars",
  },
  {
    id: "signal",
    label: "Signal Ring",
    gradient: "from-[#ff2a6d] via-[#15151a] to-[#21f7ff]",
    accent: "#ffb000",
    motif: "ring",
  },
];

export const initialRealmDraft: RealmDraft = {
  title: "Night Circuit",
  producerName: "demo",
  genre: "rage",
  mood: "aggressive",
  bpm: "148",
  visualStyle: "glitch",
  description: "A playable neon corridor built around hard drums and broken signal energy.",
  coverPlaceholderId: "circuit",
  audioFileNameMock: "night-circuit-demo.wav",
};

export function getCoverPlaceholder(id: string) {
  return (
    coverPlaceholders.find((cover) => cover.id === id) ?? coverPlaceholders[0]
  );
}

export function getVisualStyleOption(id: RealmVisualStyle) {
  return (
    visualStyleOptions.find((style) => style.id === id) ??
    visualStyleOptions[0]
  );
}
