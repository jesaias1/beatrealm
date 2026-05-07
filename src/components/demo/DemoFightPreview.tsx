"use client";

import { ArrowLeft, Swords, Play } from "lucide-react";
import { HealthBar } from "@/components/fight/HealthBar";
import { CTAButton } from "@/components/ui/CTAButton";
import { StatPill } from "@/components/ui/StatPill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Realm } from "@/types";
import { DemoDataNotice } from "./DemoDataNotice";

type DemoFightPreviewProps = {
  realm: Realm;
};

export function DemoFightPreview({ realm }: DemoFightPreviewProps) {
  return (
    <section className="min-h-[calc(100vh-84px)] bg-[radial-gradient(circle_at_50%_10%,rgba(255,42,109,0.16),transparent_28%),linear-gradient(180deg,#08080a,#050505)] px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusBadge label="Demo Preview" variant="demo" />
          <DemoDataNotice />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <HealthBar label="Player health" value={82} />
          <HealthBar label="Boss health" value={64} tone="boss" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr_0.72fr]">
          <aside className="grid content-start gap-3">
            <StatPill label="Combo" value="x18" />
            <StatPill label="Score" value="042900" />
            <StatPill label="Phase" value="Visual Mock" />
          </aside>

          <div className="scanlines relative min-h-[520px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,42,109,0.23),transparent_32%),linear-gradient(180deg,#121217,#050505)] glow-border">
            <div className="absolute inset-x-8 top-8 border border-[#ff2a6d]/40 bg-black/45 px-4 py-3 text-center font-mono text-xs font-black uppercase tracking-[0.22em] text-[#ff2a6d]">
              Boss signal detected
            </div>
            <div className="absolute left-1/2 top-1/2 flex size-56 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow items-center justify-center border border-[#ff2a6d]/60 bg-[#220711] shadow-[0_0_80px_rgba(255,42,109,0.22)]">
              <div className="size-36 rotate-45 border-4 border-[#ff2a6d] bg-black/45" />
              <Swords className="absolute text-[#b7ff2a]" size={58} />
            </div>
            <div className="absolute bottom-10 left-1/2 h-16 w-16 -translate-x-1/2 border border-[#21f7ff]/70 bg-[#21f7ff]/15 shadow-[0_0_30px_rgba(33,247,255,0.22)]" />
          </div>

          <aside className="grid content-start gap-4 border border-white/10 bg-black/35 p-5">
            <h2 className="text-3xl font-black uppercase text-white">
              {realm.title}
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-400">
              {realm.producer.name}
            </p>
            
            <div className="mt-4 grid gap-2 font-mono text-sm uppercase tracking-[0.14em] text-zinc-300">
              <p className="border border-white/10 p-3">Space = attack</p>
              <p className="border border-white/10 p-3">WASD = dodge</p>
            </div>
            
            <p className="mt-4 text-xs text-zinc-500">
              Upload an audio file in the Realm Creator to activate the real audio-reactive game engine.
            </p>

            <div className="mt-2 grid gap-3">
              <CTAButton disabled icon={Play}>
                Start Fight
              </CTAButton>
              <CTAButton href="/realm/demo" variant="ghost" icon={ArrowLeft}>
                Back to Realm
              </CTAButton>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
