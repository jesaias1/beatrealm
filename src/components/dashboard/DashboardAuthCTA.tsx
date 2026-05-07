"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function DashboardAuthCTA() {
  const { user, isCloudConfigured, isLoading } = useAuth();

  if (!isCloudConfigured || isLoading || user) return null;

  return (
    <div className="mt-6 flex items-center gap-3 border border-[#21f7ff]/20 bg-[#21f7ff]/5 px-4 py-3">
      <LogIn size={16} className="shrink-0 text-[#21f7ff]" />
      <p className="text-sm text-zinc-300">
        <Link
          href="/login"
          className="font-bold text-[#21f7ff] underline transition hover:text-white"
        >
          Log in
        </Link>{" "}
        or{" "}
        <Link
          href="/signup"
          className="font-bold text-[#21f7ff] underline transition hover:text-white"
        >
          sign up
        </Link>{" "}
        to create cloud-backed Realms and save fight results to the leaderboard.
      </p>
    </div>
  );
}
