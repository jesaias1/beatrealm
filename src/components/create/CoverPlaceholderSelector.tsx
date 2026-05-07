import { coverPlaceholders } from "@/lib/realms/createOptions";
import type { RealmVisualStyle } from "@/types";
import { CoverPlaceholderArt } from "./CoverPlaceholderArt";

type CoverPlaceholderSelectorProps = {
  value: string;
  visualStyle: RealmVisualStyle;
  onChange: (value: string) => void;
};

export function CoverPlaceholderSelector({
  value,
  visualStyle,
  onChange,
}: CoverPlaceholderSelectorProps) {
  return (
    <fieldset>
      <legend className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
        Cover art mock
      </legend>
      <p className="mt-2 text-sm text-zinc-400">
        Pick built-in cover energy for now. Real cover uploads arrive in Phase 3.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {coverPlaceholders.map((cover) => {
          const active = cover.id === value;
          return (
            <button
              key={cover.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(cover.id)}
              className={`border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[#21f7ff] ${
                active
                  ? "border-[#b7ff2a] bg-[#b7ff2a]/10"
                  : "border-white/10 bg-black/30 hover:border-white/30"
              }`}
            >
              <CoverPlaceholderArt
                cover={cover}
                visualStyle={visualStyle}
                compact
              />
              <span className="mt-2 block font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-300">
                {cover.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
