"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

type CopyLinkButtonProps = {
  label: string;
  value: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyLinkButton({
  label,
  value,
  copiedLabel = "Copied",
  className = "",
}: CopyLinkButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-200 transition hover:border-[#21f7ff]/60 hover:bg-[#21f7ff]/10 focus:outline-none focus:ring-2 focus:ring-[#21f7ff] ${className}`}
    >
      <Copy aria-hidden="true" size={16} />
      {status === "failed" ? "Copy Failed" : status === "copied" ? copiedLabel : label}
    </button>
  );
}
