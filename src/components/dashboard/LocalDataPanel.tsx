"use client";

import { Cloud, Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mergeFightResults } from "@/lib/fight/localResults";
import { buildLocalBackup, downloadBackup } from "@/lib/local/exportData";
import { parseBeatRealmBackup } from "@/lib/local/importData";
import type { PersistedRealm } from "@/types";
import { PublishLocalRealmButton } from "./PublishLocalRealmButton";

type LocalDataPanelProps = {
  realms: PersistedRealm[];
};

export function LocalDataPanel({ realms }: LocalDataPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const { user, isCloudConfigured } = useAuth();

  function handleExport() {
    downloadBackup(buildLocalBackup(realms));
    setStatus("Backup exported as JSON.");
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;

    try {
      const backup = parseBeatRealmBackup(await file.text());
      const response = await fetch("/api/local-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ realms: backup.realms }),
      });
      if (!response.ok) throw new Error("Metadata import failed.");
      const data = (await response.json()) as { importedCount: number };
      const mergedResults = mergeFightResults(backup.fightResults);
      setStatus(
        `Imported ${data.importedCount} Realm records and merged ${mergedResults.length} local fight results. Refresh if new Realms are not visible yet.`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Import failed.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="mt-10 border border-white/10 bg-[#101012]/80 p-5 glow-border">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#b7ff2a]">
            Local Data
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase text-white">
            Backup this machine&apos;s BeatRealm state.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
            Export includes Realm metadata and local fight results. Audio and cover
            image files are not embedded.
          </p>
          {status ? (
            <p className="mt-3 border border-[#21f7ff]/25 bg-[#21f7ff]/10 px-3 py-2 text-sm text-[#21f7ff]">
              {status}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-80">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#b7ff2a]/60 bg-[#b7ff2a] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
          >
            <Download size={16} />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-200 transition hover:border-[#21f7ff]/60 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
          >
            <Upload size={16} />
            Import JSON
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => handleImport(event.target.files?.[0])}
          />
        </div>
      </div>

      {/* Publish to Cloud */}
      {isCloudConfigured && realms.length > 0 ? (
        <div className="mt-5 border-t border-white/10 pt-5">
          <div className="flex items-center gap-2">
            <Cloud size={14} className="text-[#21f7ff]" />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#21f7ff]">
              Publish to Cloud
            </p>
          </div>
          {user ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {realms.map((realm) => (
                <div key={realm.id} className="border border-white/5 bg-black/20 p-3">
                  <p className="truncate text-sm font-black uppercase text-white">{realm.title}</p>
                  <p className="font-mono text-[10px] text-zinc-500">{realm.producerName}</p>
                  <PublishLocalRealmButton localRealmSlug={realm.slug} realmTitle={realm.title} />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">
              <a href="/login" className="text-[#21f7ff] underline hover:text-white">Log in</a>{" "}
              to publish local Realms to the cloud.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
