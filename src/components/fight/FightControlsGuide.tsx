"use client";

type FightControlsGuideProps = {
  onHit: () => void;
};

export function FightControlsGuide({ onHit }: FightControlsGuideProps) {
  return (
    <div className="grid gap-4 border border-white/10 bg-black/35 p-5">
      <div>
        <h2 className="text-3xl font-black uppercase text-white">Controls</h2>
        <div className="mt-4 grid gap-2 font-mono text-sm uppercase tracking-[0.14em] text-zinc-300">
          <p className="border border-white/10 p-3">Space = hit</p>
          <p className="border border-white/10 p-3">A/S/D/F = hit</p>
          <p className="border border-white/10 p-3">P or Escape = pause</p>
          <p className="border border-white/10 p-3">R = replay after finish</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onHit}
        className="min-h-24 border border-[#b7ff2a]/70 bg-[#b7ff2a] px-5 py-4 font-mono text-lg font-black uppercase tracking-[0.18em] text-black shadow-[0_0_30px_rgba(183,255,42,0.22)] transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
      >
        Hit
      </button>
    </div>
  );
}
