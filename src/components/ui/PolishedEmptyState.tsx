import type { LucideIcon } from "lucide-react";
import { CTAButton } from "./CTAButton";

type PolishedEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryIcon?: LucideIcon;
  iconTone?: "acid" | "hot" | "volt" | "ember" | "muted";
};

const tones = {
  acid: "text-[#b7ff2a] border-[#b7ff2a]/30 bg-[#b7ff2a]/5 shadow-[0_0_30px_rgba(183,255,42,0.15)]",
  hot: "text-[#ff2a6d] border-[#ff2a6d]/30 bg-[#ff2a6d]/5 shadow-[0_0_30px_rgba(255,42,109,0.15)]",
  volt: "text-[#21f7ff] border-[#21f7ff]/30 bg-[#21f7ff]/5 shadow-[0_0_30px_rgba(33,247,255,0.15)]",
  ember: "text-[#ffb000] border-[#ffb000]/30 bg-[#ffb000]/5 shadow-[0_0_30px_rgba(255,176,0,0.15)]",
  muted: "text-zinc-500 border-white/10 bg-white/[0.02]",
};

export function PolishedEmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  actionIcon,
  secondaryHref,
  secondaryLabel,
  secondaryIcon,
  iconTone = "muted",
}: PolishedEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-white/15 bg-[#101012]/60 px-5 py-12 text-center glow-border">
      <div className={`flex size-16 items-center justify-center border rounded-full ${tones[iconTone]}`}>
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="mt-5 text-2xl font-black uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
        {description}
      </p>
      
      {(actionHref && actionLabel) || (secondaryHref && secondaryLabel) ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {actionHref && actionLabel ? (
            <CTAButton href={actionHref} icon={actionIcon}>
              {actionLabel}
            </CTAButton>
          ) : null}
          {secondaryHref && secondaryLabel ? (
            <CTAButton href={secondaryHref} variant="ghost" icon={secondaryIcon}>
              {secondaryLabel}
            </CTAButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
