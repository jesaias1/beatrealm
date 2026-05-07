"use client";

import { saveTimingOffsetMs } from "@/lib/fight/calibration";

type FightSettingsPanelProps = {
  timingOffsetMs: number;
  onTimingOffsetChange: (value: number) => void;
  disabled?: boolean;
};

export function FightSettingsPanel({
  timingOffsetMs,
  onTimingOffsetChange,
  disabled = false,
}: FightSettingsPanelProps) {
  function updateOffset(value: number) {
    onTimingOffsetChange(value);
    saveTimingOffsetMs(value);
  }

  return (
    <div className="border border-white/10 bg-black/35 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
            Timing
          </h2>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Offset hit judging for your device. Negative means earlier, positive means later.
          </p>
        </div>
        <span className="border border-[#21f7ff]/30 px-2 py-1 font-mono text-[10px] font-black text-[#21f7ff]">
          {timingOffsetMs}ms
        </span>
      </div>
      <input
        aria-label="Timing offset in milliseconds"
        type="range"
        min="-200"
        max="200"
        step="10"
        disabled={disabled}
        value={timingOffsetMs}
        onChange={(event) => updateOffset(Number(event.target.value))}
        className="mt-4 w-full accent-[#b7ff2a] disabled:opacity-50"
      />
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
        <span>-200</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => updateOffset(0)}
          className="text-zinc-400 underline-offset-4 hover:text-white hover:underline disabled:opacity-50"
        >
          Reset
        </button>
        <span>+200</span>
      </div>
    </div>
  );
}
