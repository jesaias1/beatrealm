"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

type CopyLinkButtonProps = {
  path: string;
};

export function CopyLinkButton({ path }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const origin = window.location.origin;
    await navigator.clipboard.writeText(`${origin}${path}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-200 transition hover:-translate-y-0.5 hover:border-[#ff2a6d]/70 hover:bg-[#ff2a6d]/10 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
    >
      <Copy aria-hidden="true" size={17} strokeWidth={2.4} />
      <span>{copied ? "Copied" : "Copy Link"}</span>
    </button>
  );
}
