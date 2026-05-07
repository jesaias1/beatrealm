import type { Realm } from "@/types";

type CoverArtFrameProps = {
  realm?: Realm;
  title?: string;
  producer?: string;
  className?: string;
  intense?: boolean;
};

export function CoverArtFrame({
  realm,
  title = "Night Circuit",
  producer = "demo",
  className = "",
  intense = false,
}: CoverArtFrameProps) {
  const displayTitle = realm?.title ?? title;
  const displayProducer = realm?.producer.name ?? producer;
  const gradient = realm?.coverGradient ?? "from-[#21f7ff] via-[#17171b] to-[#ff2a6d]";

  return (
    <div
      className={`glow-border scanlines group relative aspect-square overflow-hidden border border-white/15 bg-gradient-to-br ${gradient} ${className}`}
    >
      <div className="absolute inset-4 border border-black/45 bg-black/20" />
      <div className="absolute left-6 top-6 h-16 w-16 border-l-2 border-t-2 border-[#b7ff2a]" />
      <div className="absolute bottom-6 right-6 h-16 w-16 border-b-2 border-r-2 border-[#ff2a6d]" />
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/25 to-transparent ${
          intense ? "animate-scan" : ""
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_0_38%,rgba(255,255,255,0.18)_39%,transparent_42%)] transition duration-500 group-hover:translate-x-6" />
      <div className="absolute inset-x-6 bottom-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#b7ff2a]">
          Realm 001
        </p>
        <h3 className="mt-2 text-3xl font-black uppercase leading-none text-white glitch-shadow">
          {displayTitle}
        </h3>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-200">
          by {displayProducer}
        </p>
      </div>
    </div>
  );
}
