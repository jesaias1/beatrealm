"use client";

import { useMemo } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyLinkButton } from "@/components/share/CopyLinkButton";
import {
  buildChallengeText,
  buildRealmShareText,
  getFightPath,
  getProducerPath,
  getRealmPath,
} from "@/lib/share/shareText";
import type { PersistedRealm } from "@/types";

type SharePanelProps = {
  realm: PersistedRealm;
};

export function SharePanel({ realm }: SharePanelProps) {
  const isCloud = realm.source === "cloud";

  const share = useMemo(() => {
    const origin = typeof window === "undefined" ? "" : window.location.origin;
    const realmUrl = `${origin}${getRealmPath(realm)}`;
    const fightUrl = `${origin}${getFightPath(realm)}`;
    const producerUrl = `${origin}${getProducerPath(realm)}`;

    return {
      realmUrl,
      fightUrl,
      producerUrl,
      realmText: `${buildRealmShareText(realm)} ${realmUrl}`,
      challengeText: `${buildChallengeText(realm)} ${fightUrl}`,
    };
  }, [realm]);

  return (
    <section className="mt-6 border border-white/10 bg-black/35 p-4 glow-border">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#21f7ff]">
            Share Realm
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase text-white">
            Send the portal.
          </h2>
          <div className="mt-3">
            <StatusBadge 
              label={isCloud ? "Public Cloud Link" : "Private Local Link"} 
              variant={isCloud ? "cloud" : "local"} 
            />
          </div>
          <p className={`mt-2 text-sm ${isCloud ? "text-[#b7ff2a]" : "text-zinc-500"}`}>
            {isCloud 
              ? "This link works everywhere. Share it." 
              : "This link only works on your local machine."}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <CopyLinkButton label="Copy Realm Link" value={share.realmUrl} />
            <CopyLinkButton label="Copy Challenge" value={share.challengeText} />
            <CopyLinkButton label="Copy Producer Link" value={share.producerUrl} />
            <CopyLinkButton label="Copy Fight Link" value={share.fightUrl} />
          </div>
        </div>

        <div className="relative overflow-hidden border border-[#ff2a6d]/25 bg-[radial-gradient(circle_at_16%_0%,rgba(33,247,255,0.18),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(255,42,109,0.2),transparent_30%),#08080a] p-5">
          <div className="absolute inset-0 scanlines opacity-50" aria-hidden="true" />
          <div className="relative">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#b7ff2a]">
              BeatRealm Challenge
            </p>
            <h3 className="mt-3 text-4xl font-black uppercase leading-none text-white glitch-shadow">
              {realm.title}
            </h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
              {realm.producerName} / {realm.genre} / {realm.mood}
            </p>
            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-300">
              {buildRealmShareText(realm)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
