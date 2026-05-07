import type { LucideIcon } from "lucide-react";

type StatusBadgeProps = {
  label: string;
  variant?: "local" | "cloud" | "demo" | "future";
  icon?: LucideIcon;
};

const variants = {
  local: "border-zinc-600 bg-zinc-900/50 text-zinc-400",
  cloud: "border-[#21f7ff]/50 bg-[#21f7ff]/10 text-[#21f7ff]",
  demo: "border-[#ffb000]/50 bg-[#ffb000]/10 text-[#ffb000]",
  future: "border-[#ff2a6d]/50 bg-[#ff2a6d]/10 text-[#ff2a6d]",
};

export function StatusBadge({ label, variant = "local", icon: Icon }: StatusBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] ${variants[variant]}`}
    >
      {Icon ? <Icon size={12} strokeWidth={2.5} /> : null}
      {label}
    </div>
  );
}
