import type { CoverPlaceholder } from "@/lib/realms/createOptions";
import type { RealmVisualStyle } from "@/types";

type CoverPlaceholderArtProps = {
  cover: CoverPlaceholder;
  visualStyle?: RealmVisualStyle;
  title?: string;
  producer?: string;
  compact?: boolean;
  imageUrl?: string;
};

const styleFrame: Record<RealmVisualStyle, string> = {
  glitch: "border-[#21f7ff]/55 shadow-[0_0_38px_rgba(33,247,255,0.16)]",
  dark: "border-white/15 shadow-[0_0_28px_rgba(183,255,42,0.08)]",
  rage: "border-[#ff2a6d]/70 shadow-[0_0_42px_rgba(255,42,109,0.22)]",
  dreamy: "border-[#9bf6ff]/50 shadow-[0_0_48px_rgba(155,246,255,0.16)]",
  minimal: "border-white/25 shadow-[0_0_16px_rgba(255,255,255,0.08)]",
};

function Motif({ cover }: { cover: CoverPlaceholder }) {
  if (cover.motif === "slash") {
    return (
      <>
        <span className="absolute -left-10 top-12 h-7 w-[150%] -rotate-12 bg-white/18" />
        <span className="absolute -right-10 bottom-16 h-4 w-[130%] -rotate-12 bg-black/35" />
      </>
    );
  }

  if (cover.motif === "orb") {
    return (
      <>
        <span className="absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 border border-white/25 bg-white/10 blur-sm" />
        <span className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 border border-white/35" />
      </>
    );
  }

  if (cover.motif === "ring") {
    return (
      <>
        <span className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 border-2 border-white/25" />
        <span className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 border border-black/55" />
      </>
    );
  }

  if (cover.motif === "bars") {
    return (
      <span className="absolute inset-x-10 top-10 flex h-40 items-end justify-between gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="w-full bg-white/24"
            style={{ height: `${28 + ((index * 23) % 82)}%` }}
          />
        ))}
      </span>
    );
  }

  if (cover.motif === "void") {
    return (
      <>
        <span className="absolute inset-8 border border-white/20 bg-black/25" />
        <span className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 bg-black/65" />
      </>
    );
  }

  return (
    <>
      <span className="absolute inset-7 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <span className="absolute bottom-10 left-10 h-16 w-28 border border-white/25 bg-black/20" />
    </>
  );
}

export function CoverPlaceholderArt({
  cover,
  visualStyle = "glitch",
  title,
  producer,
  compact = false,
  imageUrl,
}: CoverPlaceholderArtProps) {
  const showText = title || producer;
  const glitchLayer =
    visualStyle === "glitch"
      ? "after:absolute after:inset-x-0 after:top-1/3 after:h-3 after:bg-[#21f7ff]/25 before:absolute before:inset-x-0 before:bottom-1/4 before:h-2 before:bg-[#ff2a6d]/25"
      : "";
  const pulse =
    visualStyle === "dreamy"
      ? "animate-pulse-slow"
      : visualStyle === "rage"
        ? "animate-flicker"
        : "";

  return (
    <div
      className={`scanlines relative aspect-square overflow-hidden border bg-gradient-to-br ${cover.gradient} ${styleFrame[visualStyle]} ${glitchLayer} ${pulse}`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.22),transparent_25%),linear-gradient(135deg,rgba(255,255,255,0.2),transparent_36%)]" />
          <Motif cover={cover} />
        </>
      )}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-4 border border-black/35" />
      {showText ? (
        <div className={`${compact ? "inset-x-3 bottom-3" : "inset-x-6 bottom-6"} absolute`}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/70">
            {cover.label}
          </p>
          <h3 className={`${compact ? "text-sm" : "text-3xl"} mt-1 font-black uppercase leading-none text-white glitch-shadow`}>
            {title}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-200">
            by {producer}
          </p>
        </div>
      ) : null}
    </div>
  );
}
