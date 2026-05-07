"use client";

import { CoverPlaceholderArt } from "@/components/create/CoverPlaceholderArt";
import { getCoverPlaceholder } from "@/lib/realms/createOptions";
import type { AudioEnergy } from "@/lib/audio/energy";
import type { PersistedRealm, RealmVisualStyle } from "@/types";

type AudioReactiveCoverProps = {
  realm: PersistedRealm;
  energy: AudioEnergy;
};

const styleMultipliers: Record<RealmVisualStyle, { shake: number; glow: number; rotate: number }> = {
  glitch: { shake: 10, glow: 70, rotate: 1.2 },
  dark: { shake: 2, glow: 28, rotate: 0.25 },
  rage: { shake: 13, glow: 86, rotate: 1.4 },
  dreamy: { shake: 3, glow: 62, rotate: 0.8 },
  minimal: { shake: 1, glow: 16, rotate: 0.1 },
};

export function AudioReactiveCover({ realm, energy }: AudioReactiveCoverProps) {
  const cover = getCoverPlaceholder(realm.coverPlaceholderId ?? "circuit");
  const multipliers = styleMultipliers[realm.visualStyle];
  const scale = 1 + energy.bassEnergy * (realm.visualStyle === "minimal" ? 0.018 : 0.055);
  const shake = energy.isPeak ? energy.peakIntensity * multipliers.shake : 0;
  const rotate = (energy.midEnergy - 0.2) * multipliers.rotate;
  const glow = energy.overallEnergy * multipliers.glow;
  const scanOpacity = 0.12 + energy.trebleEnergy * 0.38;

  return (
    <div
      className="relative transition-transform duration-100"
      style={{
        transform: `translate(${shake}px, ${shake * -0.45}px) rotate(${rotate}deg) scale(${scale})`,
        filter: `drop-shadow(0 0 ${glow}px rgba(33,247,255,0.35))`,
      }}
    >
      <CoverPlaceholderArt
        cover={cover}
        visualStyle={realm.visualStyle}
        title={realm.title}
        producer={realm.producerName}
        imageUrl={realm.coverUrl}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.14),rgba(255,255,255,0.14)_1px,transparent_1px,transparent_8px)]"
        style={{ opacity: scanOpacity }}
      />
      {energy.isPeak ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#ff2a6d] mix-blend-screen"
          style={{ opacity: energy.peakIntensity * 0.45 }}
        />
      ) : null}
    </div>
  );
}
