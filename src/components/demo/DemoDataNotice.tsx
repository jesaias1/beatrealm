import { Info } from "lucide-react";
import Link from "next/link";

export function DemoDataNotice() {
  return (
    <div className="flex items-start gap-3 border border-[#ffb000]/30 bg-[#ffb000]/10 p-4">
      <Info size={18} className="mt-0.5 shrink-0 text-[#ffb000]" />
      <div>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#ffb000]">
          Demo Notice
        </p>
        <p className="mt-1 text-sm leading-6 text-[#ffb000]/90">
          This demo runs in visual-only mode.{" "}
          <Link href="/create" className="font-bold text-white transition hover:text-[#b7ff2a] hover:underline">
            Upload your own beat
          </Link>{" "}
          to unlock real audio-reactive playback and synchronized fight markers.
        </p>
      </div>
    </div>
  );
}
