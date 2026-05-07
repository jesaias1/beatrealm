"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, User } from "lucide-react";

export function UserNav() {
  const { user, isCloudConfigured, isLoading } = useAuth();

  if (!isCloudConfigured) {
    return null;
  }

  if (isLoading) {
    return (
      <span className="inline-flex h-9 items-center border border-white/10 px-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
        …
      </span>
    );
  }

  if (user) {
    return (
      <Link
        href="/account"
        className="inline-flex items-center gap-2 border border-[#b7ff2a]/40 bg-[#b7ff2a]/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#b7ff2a] transition hover:bg-[#b7ff2a]/20"
      >
        <User size={13} />
        {user.displayName || user.email.split("@")[0]}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-2 border border-[#21f7ff]/40 bg-[#21f7ff]/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#21f7ff] transition hover:bg-[#21f7ff]/20"
    >
      <LogIn size={13} />
      Log In
    </Link>
  );
}
