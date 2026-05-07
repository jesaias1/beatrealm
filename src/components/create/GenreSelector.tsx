import { genreOptions } from "@/lib/realms/createOptions";
import type { RealmGenre } from "@/types";

type GenreSelectorProps = {
  value: RealmGenre;
  onChange: (value: RealmGenre) => void;
};

export function GenreSelector({ value, onChange }: GenreSelectorProps) {
  return (
    <fieldset>
      <legend className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
        Genre
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {genreOptions.map((genre) => (
          <button
            key={genre}
            type="button"
            aria-pressed={value === genre}
            onClick={() => onChange(genre)}
            className={`border px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-[#21f7ff] ${
              value === genre
                ? "border-[#ff2a6d] bg-[#ff2a6d]/12 text-white"
                : "border-white/10 bg-black/30 text-zinc-400 hover:border-white/30"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
