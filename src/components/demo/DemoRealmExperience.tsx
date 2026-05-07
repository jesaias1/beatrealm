"use client";

import { ArrowLeft, Gamepad2, Play } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { CoverArtFrame } from "@/components/realm/CoverArtFrame";
import { FakeWaveform } from "@/components/realm/FakeWaveform";
import { StatPill } from "@/components/ui/StatPill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DemoDataNotice } from "./DemoDataNotice";
import type { Realm } from "@/types";
import { CopyLinkButton } from "@/components/realm/CopyLinkButton";

type DemoRealmExperienceProps = {
  realm: Realm;
};

export function DemoRealmExperience({ realm }: DemoRealmExperienceProps) {
  return (
    <section className="grid min-h-[calc(100vh-84px)] items-center gap-8 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="mx-auto w-full max-w-xl">
        <CoverArtFrame realm={realm} intense className="animate-pulse-slow" />
      </div>
      <div className="max-w-3xl">
        <StatusBadge label="Demo Realm" variant="demo" />
        <h1 className="mt-3 text-6xl font-black uppercase leading-none text-white glitch-shadow">
          {realm.title}
        </h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-zinc-400">
          Produced by {realm.producer.name}
        </p>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
          {realm.description}
        </p>
        
        <div className="mt-6">
          <DemoDataNotice />
        </div>

        <div className="mt-8">
          <FakeWaveform bars={64} />
        </div>
        
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Mood" value={realm.mood} />
          <StatPill label="Genre" value={realm.genre} />
          <StatPill label="Style" value={realm.visualStyle} />
          <StatPill label="BPM" value={String(realm.bpm ?? "TBD")} />
        </div>
        
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CTAButton disabled icon={Play}>
            Play
          </CTAButton>
          <CTAButton href="/realm/demo/fight" variant="secondary" icon={Gamepad2}>
            Enter Fight Mode
          </CTAButton>
          <CopyLinkButton path="/realm/demo" />
          <CTAButton href="/" variant="ghost" icon={ArrowLeft}>
            Back
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
