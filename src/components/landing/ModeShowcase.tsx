import { Gamepad2, Sparkles } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export function ModeShowcase() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-2 lg:px-8">
      <div className="border border-white/10 bg-[#101012]/80 p-8 glow-border lg:p-12">
        <Gamepad2 className="text-[#b7ff2a]" size={38} />
        <h2 className="mt-8 text-4xl font-black uppercase text-white">
          Beat Fighter Mode
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-zinc-300">
          The core mini-game. Audio peaks automatically generate hit prompts. Dodge patterns, attack on the beat, and drain the boss&apos;s health. 
          Cloud Realms feature persistent global leaderboards where players compete for the highest score.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
          <span className="border border-white/10 px-3 py-1 text-[#b7ff2a]">Live</span>
          <span className="border border-white/10 px-3 py-1">Leaderboards</span>
          <span className="border border-white/10 px-3 py-1">Dynamic Timing</span>
        </div>
        <div className="mt-10">
          <CTAButton href="/realm/demo/fight" variant="secondary" icon={Gamepad2}>
            Preview Fight Screen
          </CTAButton>
        </div>
      </div>

      <div className="border border-dashed border-[#ff2a6d]/40 bg-black/30 p-8 lg:p-12">
        <Sparkles className="text-[#ff2a6d]" size={38} />
        <h2 className="mt-8 text-4xl font-black uppercase text-white">
          Remix Puzzle
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-zinc-300">
          Soon, you&apos;ll be able to upload stems instead of a single mix. Players will have to rebuild the beat loop by loop, placing kicks, snares, and melodies in the correct structural order.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
          <span className="border border-[#ff2a6d]/40 px-3 py-1 text-[#ff2a6d]">Phase 11</span>
          <span className="border border-white/10 px-3 py-1">Stem Uploads</span>
          <span className="border border-white/10 px-3 py-1">Loop Rearrangement</span>
        </div>
        <p className="mt-10 inline-flex border border-[#ff2a6d]/50 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#ff2a6d]">
          Coming later
        </p>
      </div>
    </section>
  );
}
