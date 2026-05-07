"use client";

import { Copy, RotateCcw, Trophy } from "lucide-react";
import { useState } from "react";
import { CTAButton } from "@/components/ui/CTAButton";
import type { FightDifficulty, FightResult } from "@/lib/fight/types";
import {
  buildChallengeText,
  buildResultShareText,
} from "@/lib/share/shareText";
import type { PersistedRealm } from "@/types";
import { ResultShareCard } from "./ResultShareCard";

type FightResultScreenProps = {
  realm: PersistedRealm;
  result: FightResult;
  difficulty: FightDifficulty;
  isNewBest: boolean;
  onReplay: () => void;
  cloudSaveStatus?: "saved" | "not-logged-in" | "error" | "not-cloud" | null;
};

export function FightResultScreen({
  realm,
  result,
  difficulty,
  isNewBest,
  onReplay,
  cloudSaveStatus,
}: FightResultScreenProps) {
  const [copied, setCopied] = useState(false);
  const title =
    result.outcome === "victory"
      ? "Victory"
      : result.outcome === "failed"
        ? "Failed"
        : "Survived";

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-5 backdrop-blur">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-white/10 bg-[#101012] p-6 glow-border">
        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#b7ff2a]">
          Fight result
        </p>
        <h2 className="mt-3 text-6xl font-black uppercase leading-none text-white glitch-shadow">
          {title}
        </h2>
        <p className="mt-3 font-mono text-2xl font-black uppercase tracking-[0.18em] text-[#21f7ff]">
          Rank {result.rank}
        </p>
        {isNewBest ? (
          <p className="mt-3 inline-flex border border-[#b7ff2a]/40 bg-[#b7ff2a]/10 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-[#b7ff2a]">
            New personal best
          </p>
        ) : (
          <p className="mt-3 inline-flex border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
            Saved to local history
          </p>
        )}

        {/* Cloud save status */}
        {cloudSaveStatus === "saved" ? (
          <p className="mt-2 inline-flex items-center gap-2 border border-[#21f7ff]/40 bg-[#21f7ff]/10 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-[#21f7ff]">
            <Trophy size={13} />
            Saved to cloud leaderboard
          </p>
        ) : cloudSaveStatus === "not-logged-in" ? (
          <p className="mt-2 text-sm text-zinc-500">
            <a href="/login" className="text-[#21f7ff] underline hover:text-white">Log in</a>{" "}
            to submit to the leaderboard.
          </p>
        ) : cloudSaveStatus === "error" ? (
          <p className="mt-2 text-sm text-[#ff2a6d]">
            Cloud save failed. Result saved locally.
          </p>
        ) : null}

        <div className="mt-6">
          <ResultShareCard
            realm={realm}
            result={result}
            difficulty={difficulty}
            isNewBest={isNewBest}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Score" value={String(result.score)} />
          <Stat label="Accuracy" value={`${result.accuracy.toFixed(1)}%`} />
          <Stat label="Max combo" value={`x${result.maxCombo}`} />
          <Stat
            label="Hits"
            value={`${result.successfulHits}/${result.totalPrompts}`}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Perfect" value={String(result.perfects)} />
          <Stat label="Great" value={String(result.greats)} />
          <Stat label="Good" value={String(result.goods)} />
          <Stat label="Miss" value={String(result.misses)} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#b7ff2a]/70 bg-[#b7ff2a] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
          >
            <RotateCcw size={16} />
            Replay
          </button>
          <CTAButton href={`/realm/${realm.slug}`} variant="ghost">
            Back to Realm
          </CTAButton>
          <CopyButton
            label={copied ? "Copied" : "Copy Result"}
            onClick={() => copyText(buildResultShareText(realm, result))}
          />
          <CopyButton
            label="Copy Challenge"
            onClick={() =>
              copyText(`${buildChallengeText(realm)} ${window.location.origin}/realm/${realm.slug}/fight`)
            }
          />
          <CopyButton
            label="Copy Fight Link"
            onClick={() => copyText(`${window.location.origin}/realm/${realm.slug}/fight`)}
          />
          <CopyButton
            label="Copy Realm Link"
            onClick={() => copyText(`${window.location.origin}/realm/${realm.slug}`)}
          />
        </div>
      </section>
    </div>
  );
}

function CopyButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-200 transition hover:border-[#21f7ff]/60 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
    >
      <Copy size={16} />
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/45 p-3">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black uppercase text-white">{value}</p>
    </div>
  );
}
