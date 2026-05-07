"use client";

import { Copy, Plus } from "lucide-react";
import { useState } from "react";
import { CTAButton } from "@/components/ui/CTAButton";
import type { PersistedRealm } from "@/types";

type ProducerHeaderProps = {
  producerName: string;
  producerSlug: string;
  realms: PersistedRealm[];
};

export function ProducerHeader({ producerName, producerSlug, realms }: ProducerHeaderProps) {
  const [copied, setCopied] = useState(false);

  async function copyProfile() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/producer/${producerSlug}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
      <div>
        <div className="flex size-36 items-center justify-center border border-white/15 bg-gradient-to-br from-[#21f7ff] via-[#b7ff2a] to-[#ff2a6d] font-mono text-5xl font-black uppercase text-black glow-border">
          {producerName.slice(0, 2)}
        </div>
        <p className="mt-8 font-mono text-xs font-black uppercase tracking-[0.28em] text-[#21f7ff]">
          Producer Realm Home
        </p>
        <h1 className="mt-3 text-6xl font-black uppercase leading-none text-white glitch-shadow">
          {producerName}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
          Local BeatRealm profile for this producer. Real accounts and public following arrive after cloud storage.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/create" icon={Plus}>
            Create Realm
          </CTAButton>
          <button
            type="button"
            onClick={copyProfile}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-200 transition hover:border-[#21f7ff]/60 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
          >
            <Copy size={16} />
            {copied ? "Copied" : "Copy Profile"}
          </button>
        </div>
      </div>
      <div className="border border-white/10 bg-[radial-gradient(circle_at_18%_10%,rgba(33,247,255,0.18),transparent_30%),#101012] p-5 glow-border">
        <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#b7ff2a]">
          Local Catalog
        </p>
        <h2 className="mt-3 text-4xl font-black uppercase text-white">
          {realms.length ? `${realms.length} Realm${realms.length === 1 ? "" : "s"}` : "No Realms yet"}
        </h2>
        <p className="mt-4 text-zinc-300">
          Tracks, boss rooms, and local fight history tied to <span className="font-mono">{producerSlug}</span>.
        </p>
      </div>
    </section>
  );
}
