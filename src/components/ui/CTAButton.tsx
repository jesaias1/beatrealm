import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type CTAButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  icon?: LucideIcon;
  type?: "button" | "submit";
};

const variants = {
  primary:
    "border-[#b7ff2a]/70 bg-[#b7ff2a] text-black shadow-[0_0_28px_rgba(183,255,42,0.2)] hover:bg-white",
  secondary:
    "border-[#21f7ff]/50 bg-[#101012] text-white hover:border-[#21f7ff] hover:bg-[#21f7ff]/10",
  ghost:
    "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-[#ff2a6d]/70 hover:bg-[#ff2a6d]/10",
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  disabled = false,
  icon: Icon,
  type = "button",
}: CTAButtonProps) {
  const className = `inline-flex min-h-12 items-center justify-center gap-2 border px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]}`;

  const content = (
    <>
      {Icon ? <Icon aria-hidden="true" size={17} strokeWidth={2.4} /> : null}
      <span>{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={className} disabled={disabled}>
      {content}
    </button>
  );
}
