"use client";

import { CheckCircle2, ChevronRight, Circle, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useOnboarding } from "@/lib/onboarding/onboardingState";

export function OnboardingChecklist() {
  const { state, progress, total, isComplete, isLoaded, dismiss } = useOnboarding();

  if (!isLoaded || isComplete) return null;

  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="mb-10 border border-white/10 bg-[radial-gradient(ellipse_at_top_right,rgba(33,247,255,0.08),transparent_50%),#101012] p-5 glow-border">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#21f7ff]" />
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#21f7ff]">
              Welcome Producer
            </h2>
          </div>
          <p className="mt-2 text-xl font-black uppercase text-white">
            Get your first Realm running
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-48 overflow-hidden rounded-full bg-black/50 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#21f7ff] to-[#b7ff2a] transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-zinc-400">
              {progress}/{total} Completed
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="text-zinc-500 transition hover:text-white"
          aria-label="Dismiss checklist"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <ChecklistItem
          label="Create Realm"
          done={state.createdRealm}
          href="/create"
        />
        <ChecklistItem
          label="Open Realm"
          done={state.openedRealm}
          href="/dashboard"
        />
        <ChecklistItem
          label="Play Fight Mode"
          done={state.playedFight}
          href="/dashboard"
        />
        <ChecklistItem
          label="Publish to Cloud"
          done={state.publishedCloud}
          href="/dashboard"
        />
        <ChecklistItem
          label="Share Link"
          done={state.sharedLink}
          href="/dashboard"
        />
      </div>
    </div>
  );
}

function ChecklistItem({ label, done, href }: { label: string; done: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between border px-3 py-3 transition ${
        done
          ? "border-[#b7ff2a]/30 bg-[#b7ff2a]/5 text-[#b7ff2a]"
          : "border-white/5 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        {done ? (
          <CheckCircle2 size={14} className="shrink-0" />
        ) : (
          <Circle size={14} className="shrink-0 opacity-50" />
        )}
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.1em]">
          {label}
        </span>
      </div>
      {!done ? (
        <ChevronRight size={14} className="opacity-0 transition group-hover:opacity-100" />
      ) : null}
    </Link>
  );
}
