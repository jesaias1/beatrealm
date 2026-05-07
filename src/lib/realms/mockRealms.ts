import type { Producer, Realm } from "@/types";

export const demoProducer: Producer = {
  id: "producer-demo",
  name: "demo",
  slug: "demo",
  bio: "A shadow-lane producer sketching beats that feel like late-night arcade cabinets and blown-out club speakers.",
  avatarTone: "from-cyan-300 via-lime-300 to-pink-500",
};

export const mockRealms: Realm[] = [
  {
    id: "realm-001",
    slug: "demo",
    title: "Night Circuit",
    producer: demoProducer,
    genre: "rage",
    mood: "aggressive",
    bpm: 148,
    visualStyle: "glitch",
    coverGradient: "from-[#21f7ff] via-[#17171b] to-[#ff2a6d]",
    accentColor: "#21f7ff",
    description: "A charged-up neon corridor built for the first demo Realm.",
    featured: true,
  },
  {
    id: "realm-002",
    slug: "static-veil",
    title: "Static Veil",
    producer: demoProducer,
    genre: "trap",
    mood: "underground",
    bpm: 136,
    visualStyle: "dark",
    coverGradient: "from-[#f5f5f0] via-[#303035] to-[#050505]",
    accentColor: "#b7ff2a",
    description: "Cold drums, broken glass edges, and a cover that keeps looking back.",
  },
  {
    id: "realm-003",
    slug: "low-health",
    title: "Low Health",
    producer: demoProducer,
    genre: "experimental",
    mood: "cinematic",
    bpm: 158,
    visualStyle: "rage",
    coverGradient: "from-[#ffb000] via-[#ff2a6d] to-[#120711]",
    accentColor: "#ff2a6d",
    description: "Boss-room drums with scorched edges and a countdown in the walls.",
  },
];

export function getDemoRealm() {
  return mockRealms[0];
}
