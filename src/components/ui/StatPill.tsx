type StatPillProps = {
  label: string;
  value: string;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="border border-white/10 bg-black/40 px-3 py-2">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-black uppercase text-white">{value}</p>
    </div>
  );
}
