import { ArrowRight, Wand2 } from "lucide-react";
import { FakeWaveform } from "@/components/realm/FakeWaveform";
import { StatPill } from "@/components/ui/StatPill";
import {
  getCoverPlaceholder,
  getVisualStyleOption,
} from "@/lib/realms/createOptions";
import type { RealmDraft, RealmVisualStyle } from "@/types";
import { CoverPlaceholderArt } from "./CoverPlaceholderArt";

type RealmLivePreviewProps = {
  draft: RealmDraft;
  coverImageUrl?: string;
  audioFileName?: string;
};

const previewShell: Record<RealmVisualStyle, string> = {
  glitch:
    "border-[#21f7ff]/40 bg-[#101012]/90 shadow-[0_0_52px_rgba(33,247,255,0.12)]",
  dark: "border-white/10 bg-[#09090a]/95 shadow-[0_0_34px_rgba(183,255,42,0.05)]",
  rage: "border-[#ff2a6d]/60 bg-[#140608]/95 shadow-[0_0_58px_rgba(255,42,109,0.18)]",
  dreamy:
    "border-[#9bf6ff]/35 bg-[#0b0a18]/90 shadow-[0_0_64px_rgba(155,246,255,0.14)]",
  minimal: "border-white/20 bg-[#0d0d0e]/95 shadow-[0_0_18px_rgba(255,255,255,0.06)]",
};

const styleAccent: Record<RealmVisualStyle, string> = {
  glitch: "from-[#21f7ff] via-[#b7ff2a] to-[#ff2a6d]",
  dark: "from-zinc-600 via-[#b7ff2a] to-zinc-900",
  rage: "from-[#ff2a6d] via-[#ffb000] to-[#ff2a6d]",
  dreamy: "from-[#9bf6ff] via-[#d8b4fe] to-[#ff2a6d]",
  minimal: "from-zinc-300 via-white to-zinc-500",
};

export function RealmLivePreview({
  draft,
  coverImageUrl,
  audioFileName,
}: RealmLivePreviewProps) {
  const cover = getCoverPlaceholder(draft.coverPlaceholderId);
  const visualStyle = getVisualStyleOption(draft.visualStyle);
  const title = draft.title.trim() || "Untitled Realm";
  const producer = draft.producerName.trim() || "unknown producer";
  const styleMotion =
    draft.visualStyle === "dreamy"
      ? "animate-pulse-slow"
      : draft.visualStyle === "rage" || draft.visualStyle === "glitch"
        ? "animate-flicker"
        : "";

  return (
    <aside className="lg:sticky lg:top-6">
      <div
        className={`relative overflow-hidden border p-4 glow-border ${previewShell[draft.visualStyle]}`}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${styleAccent[draft.visualStyle]}`}
        />
        <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          <Wand2 size={14} />
          <span>Live Realm preview</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          This preview is generated from your Realm settings.
        </p>

        <div className={`mt-5 ${styleMotion}`}>
          <CoverPlaceholderArt
            cover={cover}
            visualStyle={draft.visualStyle}
            title={title}
            producer={producer}
            imageUrl={coverImageUrl}
          />
        </div>

        <div className="mt-4">
          <FakeWaveform
            bars={draft.visualStyle === "minimal" ? 32 : 52}
            active={draft.visualStyle !== "minimal"}
          />
        </div>

        <div className="mt-5">
          <h2 className="text-4xl font-black uppercase leading-none text-white glitch-shadow">
            {title}
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
            by {producer}
          </p>
          {draft.description.trim() ? (
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              {draft.description}
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <StatPill label="Genre" value={draft.genre} />
          <StatPill label="Mood" value={draft.mood} />
          <StatPill label="BPM" value={draft.bpm.trim() || "TBD"} />
        </div>

        <div className="mt-5 flex items-center justify-between border border-white/10 bg-black/40 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Style
            </p>
          <p className="font-black uppercase text-white">{visualStyle.label}</p>
          {audioFileName ? (
            <p className="mt-1 max-w-[13rem] truncate font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              {audioFileName}
            </p>
          ) : null}
          </div>
          <span className="inline-flex items-center gap-2 border border-[#b7ff2a]/60 bg-[#b7ff2a] px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-black">
            Enter Realm
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </aside>
  );
}
