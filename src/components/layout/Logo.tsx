import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
      aria-label="BeatRealm home"
    >
      <span className="relative flex size-9 items-center justify-center overflow-hidden border border-white/15 bg-[#101012] shadow-[0_0_28px_rgba(33,247,255,0.18)]">
        <span className="absolute inset-x-1 top-1 h-px bg-[#21f7ff]" />
        <span className="absolute inset-y-1 right-2 w-px bg-[#ff2a6d]" />
        <span className="font-mono text-sm font-black text-[#b7ff2a]">BR</span>
      </span>
      <span className="font-mono text-lg font-black uppercase tracking-[0.22em] text-white group-hover:glitch-shadow">
        BeatRealm
      </span>
    </Link>
  );
}
