type HealthBarProps = {
  label: string;
  value: number;
  tone?: "player" | "boss";
};

export function HealthBar({ label, value, tone = "player" }: HealthBarProps) {
  const fill =
    tone === "boss"
      ? "from-[#ff2a6d] via-[#ffb000] to-[#ff2a6d]"
      : "from-[#21f7ff] via-[#b7ff2a] to-[#21f7ff]";

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between font-mono text-xs font-black uppercase tracking-[0.18em]">
        <span className="text-zinc-300">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-4 border border-white/15 bg-black/60 p-1">
        <div
          className={`h-full bg-gradient-to-r ${fill} shadow-[0_0_18px_rgba(255,255,255,0.16)]`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
