"use client";

import { Play, Plus } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { GlitchText } from "@/components/ui/GlitchText";
import { CoverArtFrame } from "@/components/realm/CoverArtFrame";
import { FakeWaveform } from "@/components/realm/FakeWaveform";
import { StatPill } from "@/components/ui/StatPill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Realm } from "@/types";

export function HeroRealmDemo({ realm }: { realm: Realm }) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-12 px-5 py-12 lg:grid-cols-[1.03fr_0.97fr] lg:px-8">
      <div>
        <p className="font-mono text-xs font-black uppercase tracking-[0.34em] text-[#b7ff2a]">
          BeatRealm
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.92] text-white sm:text-7xl lg:text-8xl">
          <GlitchText>Turn your beat into a playable world.</GlitchText>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
          Upload a beat and cover art. BeatRealm creates an interactive music Realm with audio-reactive visuals, a boss-fight game mode, and shareable scores.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/demo" icon={Play}>
            Try Demo Realm
          </CTAButton>
          <CTAButton href="/create" variant="secondary" icon={Plus}>
            Create Your Realm
          </CTAButton>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <StatusBadge label="Local Ready" variant="local" />
          <StatusBadge label="Cloud Ready" variant="cloud" />
          <StatusBadge label="Phase 10" variant="demo" />
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-8 rounded-full bg-[#21f7ff]/10 blur-3xl" />
        <div className="relative border border-white/10 bg-[#101012]/80 p-4 glow-border">
          <CoverArtFrame realm={realm} intense />
          <div className="mt-4">
            <FakeWaveform bars={40} />
          </div>
          <div className="mt-4 flex items-center justify-between border border-white/10 bg-black/35 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Now entering
              </p>
              <p className="font-black uppercase text-white">{realm.title}</p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full border border-[#b7ff2a]/70 bg-[#b7ff2a] text-black shadow-[0_0_20px_rgba(183,255,42,0.2)]">
              <Play size={18} fill="currentColor" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatPill label="BPM" value="148" />
            <StatPill label="Boss" value="Lv.3" />
            <StatPill label="Score" value="???" />
          </div>
        </div>
      </div>
    </section>
  );
}
