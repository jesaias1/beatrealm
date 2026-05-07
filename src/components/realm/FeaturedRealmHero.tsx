"use client";

import { Copy, Gamepad2, Radio } from "lucide-react";
import { useMemo, useState } from "react";
import { CoverPlaceholderArt } from "@/components/create/CoverPlaceholderArt";
import { CoverArtFrame } from "@/components/realm/CoverArtFrame";
import { CTAButton } from "@/components/ui/CTAButton";
import { getCoverPlaceholder } from "@/lib/realms/createOptions";
import { getFightPath, getRealmPath } from "@/lib/share/shareText";
import { getFeaturedRealm, getRealmStats } from "@/lib/stats/realmStats";
import type { PersistedRealm, Realm } from "@/types";

type FeaturedRealmHeroProps = {
  persistedRealms: PersistedRealm[];
  demoRealm: Realm;
};

export function FeaturedRealmHero({ persistedRealms, demoRealm }: FeaturedRealmHeroProps) {
  const [copied, setCopied] = useState(false);
  const featured = useMemo(
    () => getFeaturedRealm(persistedRealms) ?? demoRealm,
    [demoRealm, persistedRealms],
  );
  const isPersisted = "producerName" in featured;
  const producerName = isPersisted ? featured.producerName : featured.producer.name;
  const stats = isPersisted ? getRealmStats(featured.slug) : null;
  const realmPath = getRealmPath(featured);
  const fightPath = getFightPath(featured);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${realmPath}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(33,247,255,0.16),transparent_28%),radial-gradient(circle_at_88%_30%,rgba(255,42,109,0.16),transparent_30%),#0b0b0d] p-5 glow-border">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          {isPersisted ? (
            <CoverPlaceholderArt
              cover={getCoverPlaceholder(featured.coverPlaceholderId ?? "circuit")}
              visualStyle={featured.visualStyle}
              title={featured.title}
              producer={producerName}
              imageUrl={featured.coverUrl}
            />
          ) : (
            <CoverArtFrame realm={featured} intense />
          )}
        </div>
        <div>
          <p className="inline-flex border border-[#b7ff2a]/30 bg-[#b7ff2a]/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#b7ff2a]">
            Featured Realm
          </p>
          <h2 className="mt-4 text-5xl font-black uppercase leading-none text-white glitch-shadow">
            {featured.title}
          </h2>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-zinc-400">
            {producerName} / {featured.genre} / {featured.mood} / {featured.visualStyle}
          </p>
          <p className="mt-5 max-w-2xl text-zinc-300">
            {isPersisted
              ? featured.description || "A local Realm ready for listening, fighting, and sharing."
              : featured.description}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Rank" value={stats?.bestRank ?? "--"} />
            <Stat label="Score" value={stats?.bestScore ? stats.bestScore.toLocaleString() : "0"} />
            <Stat label="Attempts" value={String(stats?.attempts ?? 0)} />
            <Stat label="Signal" value={isPersisted ? "Local" : "Demo"} />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CTAButton href={realmPath} icon={Radio}>
              Enter Realm
            </CTAButton>
            <CTAButton href={fightPath} variant="secondary" icon={Gamepad2}>
              Fight Boss
            </CTAButton>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-200 transition hover:border-[#21f7ff]/60 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
            >
              <Copy size={16} />
              {copied ? "Copied" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/35 p-3">
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-black uppercase text-white">{value}</p>
    </div>
  );
}
