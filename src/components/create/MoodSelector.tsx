import { moodOptions } from "@/lib/realms/createOptions";
import type { RealmMood } from "@/types";

type MoodSelectorProps = {
  value: RealmMood;
  onChange: (value: RealmMood) => void;
};

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <fieldset>
      <legend className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
        Mood
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {moodOptions.map((mood) => (
          <button
            key={mood}
            type="button"
            aria-pressed={value === mood}
            onClick={() => onChange(mood)}
            className={`border px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-[#21f7ff] ${
              value === mood
                ? "border-[#21f7ff] bg-[#21f7ff]/12 text-white"
                : "border-white/10 bg-black/30 text-zinc-400 hover:border-white/30"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
