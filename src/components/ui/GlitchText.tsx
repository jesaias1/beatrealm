type GlitchTextProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlitchText({ children, className = "" }: GlitchTextProps) {
  return (
    <span className={`glitch-shadow relative inline-block ${className}`}>
      <span aria-hidden="true" className="absolute left-[2px] top-0 text-[#21f7ff]/60">
        {children}
      </span>
      <span aria-hidden="true" className="absolute -left-[2px] top-0 text-[#ff2a6d]/60">
        {children}
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}
