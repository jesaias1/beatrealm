"use client";

import { useCallback, useEffect, useState } from "react";
import { Cloud, Gamepad2, Search } from "lucide-react";
import Link from "next/link";
import type { RealmGenre, RealmMood, RealmVisualStyle } from "@/types";
import { CoverArtFrame } from "@/components/realm/CoverArtFrame";
import { PolishedEmptyState } from "@/components/ui/PolishedEmptyState";

const genres: RealmGenre[] = ["trap", "rage", "drill", "ambient", "electronic", "hyperpop", "experimental", "boom bap", "other"];
const moods: RealmMood[] = ["dark", "aggressive", "sad", "dreamy", "futuristic", "underground", "cinematic", "weird"];
const visualStyles: RealmVisualStyle[] = ["glitch", "dark", "rage", "dreamy", "minimal"];
const sorts = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title A–Z" },
];

type DiscoveryRealm = {
  id: string;
  slug: string;
  title: string;
  producerName: string;
  producerSlug: string;
  genre: string;
  mood: string;
  bpm: number | null;
  visualStyle: string;
  description: string | null;
  coverUrl: string | null;
  coverPlaceholderId: string | null;
  createdAt: string;
  source: "cloud";
};

export function PublicRealmExplorer() {
  const [realms, setRealms] = useState<DiscoveryRealm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [sort, setSort] = useState("newest");

  const loadRealms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (genre) params.set("genre", genre);
      if (mood) params.set("mood", mood);
      if (visualStyle) params.set("visualStyle", visualStyle);
      params.set("sort", sort);
      params.set("limit", "24");

      const response = await fetch(`/api/cloud/discovery?${params.toString()}`);
      if (response.status === 503) {
        // Cloud not configured — silently show nothing
        setRealms([]);
        setTotal(0);
        return;
      }
      if (!response.ok) throw new Error("Failed to load.");

      const data = (await response.json()) as { realms: DiscoveryRealm[]; total: number };
      setRealms(data.realms ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [search, genre, mood, visualStyle, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadRealms();
    }, search ? 300 : 0); // Debounce search
    return () => clearTimeout(timer);
  }, [loadRealms, search]);

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2">
        <Cloud size={16} className="text-[#21f7ff]" />
        <h2 className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#21f7ff]">
          Public Cloud Realms
        </h2>
        {total > 0 ? (
          <span className="font-mono text-[10px] text-zinc-500">({total})</span>
        ) : null}
      </div>

      {/* Filters */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-6">
        <div className="relative md:col-span-2">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Realms..."
            className="w-full border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:ring-2 focus:ring-[#21f7ff]"
          />
        </div>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border border-white/10 bg-black/90 px-3 py-2.5 font-mono text-xs text-white outline-none focus:ring-2 focus:ring-[#21f7ff]"
        >
          <option value="">All genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border border-white/10 bg-black/90 px-3 py-2.5 font-mono text-xs text-white outline-none focus:ring-2 focus:ring-[#21f7ff]"
        >
          <option value="">All moods</option>
          {moods.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={visualStyle}
          onChange={(e) => setVisualStyle(e.target.value)}
          className="border border-white/10 bg-black/90 px-3 py-2.5 font-mono text-xs text-white outline-none focus:ring-2 focus:ring-[#21f7ff]"
        >
          <option value="">All styles</option>
          {visualStyles.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-white/10 bg-black/90 px-3 py-2.5 font-mono text-xs text-white outline-none focus:ring-2 focus:ring-[#21f7ff]"
        >
          {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <p className="mt-6 font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-500 animate-pulse">
          Searching cloud Realms...
        </p>
      ) : error ? (
        <div className="mt-6 border border-[#ff2a6d]/30 bg-[#ff2a6d]/5 p-4">
          <p className="text-sm text-[#ff2a6d]">{error}</p>
        </div>
      ) : realms.length === 0 ? (
        <div className="mt-6">
          <PolishedEmptyState
            icon={Search}
            title={search || genre || mood || visualStyle ? "No matching Realms" : "No Cloud Realms Yet"}
            description={
              search || genre || mood || visualStyle
                ? "Try adjusting your filters or search terms."
                : "The cloud is quiet. Be the first to publish a Realm to the global network."
            }
            iconTone="volt"
            actionHref="/create"
            actionLabel="Create Realm"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {realms.map((realm) => (
            <DiscoveryCard key={realm.id} realm={realm} />
          ))}
        </div>
      )}
    </section>
  );
}

function DiscoveryCard({ realm }: { realm: DiscoveryRealm }) {
  return (
    <article className="group border border-white/10 bg-[#101012]/80 transition hover:-translate-y-1 hover:border-[#21f7ff]/40">
      <div className="aspect-square overflow-hidden">
        <CoverArtFrame
          realm={{
            id: realm.id,
            slug: realm.slug,
            title: realm.title,
            producer: { id: "cloud", name: realm.producerName, slug: realm.producerSlug, bio: "", avatarTone: "from-cyan-300 via-lime-300 to-pink-500" },
            genre: realm.genre as RealmGenre,
            mood: realm.mood as RealmMood,
            bpm: realm.bpm ?? undefined,
            visualStyle: realm.visualStyle as RealmVisualStyle,
            coverGradient: "from-[#21f7ff] via-[#17171b] to-[#ff2a6d]",
            accentColor: "#21f7ff",
            description: realm.description ?? "",
          }}
        />
      </div>
      <div className="p-4">
        <Link href={`/realm/${realm.slug}`}>
          <h3 className="truncate text-lg font-black uppercase text-white transition group-hover:text-[#21f7ff]">
            {realm.title}
          </h3>
        </Link>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400">
          {realm.producerName} · {realm.genre} · {realm.mood}
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/realm/${realm.slug}`}
            className="inline-flex items-center gap-1 border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-zinc-300 transition hover:border-[#21f7ff]/50"
          >
            Enter Realm
          </Link>
          <Link
            href={`/realm/${realm.slug}/fight`}
            className="inline-flex items-center gap-1 border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-zinc-300 transition hover:border-[#ff2a6d]/50"
          >
            <Gamepad2 size={11} /> Fight
          </Link>
        </div>
      </div>
    </article>
  );
}
