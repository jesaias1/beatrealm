"use client";

import type { ReactNode } from "react";
import { genreOptions, moodOptions, visualStyleOptions } from "@/lib/realms/createOptions";
import type { RealmFilterState, RealmSortMode } from "@/lib/realms/filters";
import type { RealmGenre, RealmMood, RealmVisualStyle } from "@/types";

type RealmFilterBarProps = {
  filters: RealmFilterState;
  onChange: (filters: RealmFilterState) => void;
};

const sortOptions: { value: RealmSortMode; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "title", label: "Title" },
  { value: "bestScore", label: "Best score" },
  { value: "mostAttempts", label: "Most attempts" },
];

export function RealmFilterBar({ filters, onChange }: RealmFilterBarProps) {
  return (
    <div className="grid gap-3 border border-white/10 bg-black/35 p-4 md:grid-cols-[1.3fr_repeat(4,1fr)]">
      <label className="grid gap-2">
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
          Search
        </span>
        <input
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Title or producer"
          className="min-h-11 border border-white/10 bg-black/50 px-3 font-mono text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#21f7ff]/70 focus:ring-2 focus:ring-[#21f7ff]/30"
        />
      </label>
      <Select label="Genre" value={filters.genre} onChange={(value) => onChange({ ...filters, genre: value as RealmGenre | "all" })}>
        <option value="all">All genres</option>
        {genreOptions.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
      </Select>
      <Select label="Mood" value={filters.mood} onChange={(value) => onChange({ ...filters, mood: value as RealmMood | "all" })}>
        <option value="all">All moods</option>
        {moodOptions.map((mood) => <option key={mood} value={mood}>{mood}</option>)}
      </Select>
      <Select label="Style" value={filters.visualStyle} onChange={(value) => onChange({ ...filters, visualStyle: value as RealmVisualStyle | "all" })}>
        <option value="all">All styles</option>
        {visualStyleOptions.map((style) => <option key={style.id} value={style.id}>{style.label}</option>)}
      </Select>
      <Select label="Sort" value={filters.sort} onChange={(value) => onChange({ ...filters, sort: value as RealmSortMode })}>
        {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </Select>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 border border-white/10 bg-black/50 px-3 font-mono text-sm uppercase text-white outline-none transition focus:border-[#21f7ff]/70 focus:ring-2 focus:ring-[#21f7ff]/30"
      >
        {children}
      </select>
    </label>
  );
}
