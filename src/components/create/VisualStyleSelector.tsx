import { visualStyleOptions } from "@/lib/realms/createOptions";
import type { RealmVisualStyle } from "@/types";

type VisualStyleSelectorProps = {
  value: RealmVisualStyle;
  onChange: (value: RealmVisualStyle) => void;
};

export function VisualStyleSelector({ value, onChange }: VisualStyleSelectorProps) {
  return (
    <fieldset>
      <legend className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
        Visual style
      </legend>
      <p className="mt-2 text-sm text-zinc-400">Choose how your Realm should feel.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-5">
        {visualStyleOptions.map((style) => {
          const active = style.id === value;
          return (
            <button
              key={style.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(style.id)}
              className={`border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[#21f7ff] ${
                active
                  ? "border-[#b7ff2a] bg-[#b7ff2a]/10 text-white"
                  : "border-white/10 bg-black/35 text-zinc-300 hover:border-white/30"
              }`}
            >
              <span className="block font-mono text-xs font-black uppercase tracking-[0.16em]">
                {style.label}
              </span>
              <span className="mt-2 block text-xs leading-5 text-zinc-400">
                {style.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
