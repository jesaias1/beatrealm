"use client";

import { useState } from "react";
import { Cloud, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type PublishLocalRealmButtonProps = {
  localRealmSlug: string;
  realmTitle: string;
};

export function PublishLocalRealmButton({ localRealmSlug, realmTitle }: PublishLocalRealmButtonProps) {
  const { user, accessToken, isCloudConfigured } = useAuth();
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string; cloudSlug?: string } | null>(null);

  if (!isCloudConfigured || !user) return null;

  async function handlePublish() {
    if (!accessToken) return;
    setPublishing(true);
    setResult(null);

    try {
      const response = await fetch("/api/cloud/realms/publish-local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ localRealmSlug }),
      });

      if (response.ok) {
        const data = (await response.json()) as { realm: { slug: string } };
        setResult({
          type: "success",
          message: `"${realmTitle}" published to cloud.`,
          cloudSlug: data.realm.slug,
        });
      } else {
        const err = (await response.json()) as { error: string };
        setResult({ type: "error", message: err.error ?? "Failed to publish." });
      }
    } catch {
      setResult({ type: "error", message: "Failed to publish." });
    } finally {
      setPublishing(false);
    }
  }

  if (result?.type === "success") {
    return (
      <div className="mt-2 border border-[#b7ff2a]/30 bg-[#b7ff2a]/10 px-3 py-2">
        <p className="text-xs text-[#b7ff2a]">{result.message}</p>
        {result.cloudSlug ? (
          <a
            href={`/realm/${result.cloudSlug}`}
            className="mt-1 inline-flex items-center gap-1 text-xs text-[#21f7ff] underline hover:text-white"
          >
            <ExternalLink size={11} /> Open cloud Realm
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handlePublish}
        disabled={publishing}
        className="inline-flex items-center gap-1.5 border border-[#21f7ff]/40 bg-[#21f7ff]/10 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[#21f7ff] transition hover:bg-[#21f7ff]/20 disabled:opacity-50"
      >
        {publishing ? <Loader2 size={11} className="animate-spin" /> : <Cloud size={11} />}
        {publishing ? "Publishing..." : "Publish to Cloud"}
      </button>
      {result?.type === "error" ? (
        <p className="mt-1 text-xs text-[#ff2a6d]">{result.message}</p>
      ) : null}
    </div>
  );
}
