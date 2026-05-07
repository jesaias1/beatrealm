"use client";

import { useEffect, useState } from "react";
import { Cloud } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RealmCard } from "@/components/realm/RealmCard";
import type { PersistedRealm, Realm } from "@/types";

function cloudRealmToDisplayRealm(realm: PersistedRealm): Realm {
  return {
    id: realm.id,
    slug: realm.slug,
    title: realm.title,
    producer: {
      id: realm.ownerId ?? "cloud",
      name: realm.producerName,
      slug: realm.producerSlug,
      bio: "",
      avatarTone: "from-cyan-300 via-lime-300 to-pink-500",
    },
    genre: realm.genre,
    mood: realm.mood,
    bpm: realm.bpm,
    visualStyle: realm.visualStyle,
    coverGradient: "from-[#21f7ff] via-[#17171b] to-[#ff2a6d]",
    accentColor: "#21f7ff",
    description: realm.description ?? "",
  };
}

export function CloudRealmCards() {
  const { user, accessToken, isCloudConfigured } = useAuth();
  const [realms, setRealms] = useState<PersistedRealm[]>([]);
  const [loading, setLoading] = useState(
    () => !!(isCloudConfigured && user && accessToken),
  );

  useEffect(() => {
    if (!isCloudConfigured || !user || !accessToken) {
      return;
    }

    let cancelled = false;

    async function loadCloudRealms() {
      try {
        const response = await fetch("/api/cloud/realms", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          setRealms([]);
          return;
        }
        const data = (await response.json()) as { realms: PersistedRealm[] };
        if (!cancelled) {
          // Filter to user's own Realms
          setRealms(
            (data.realms ?? []).filter((r) => r.ownerId === user?.id),
          );
        }
      } catch {
        if (!cancelled) setRealms([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCloudRealms();
    return () => { cancelled = true; };
  }, [isCloudConfigured, user, accessToken]);

  if (!isCloudConfigured || !user) return null;

  if (loading) {
    return (
      <div className="mt-10 border border-[#21f7ff]/20 bg-black/35 p-5">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-500 animate-pulse">
          Loading cloud Realms...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <Cloud size={16} className="text-[#21f7ff]" />
        <h2 className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#21f7ff]">
          Cloud Realms
        </h2>
        <span className="font-mono text-[10px] text-zinc-500">
          ({realms.length})
        </span>
      </div>
      {realms.length > 0 ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {realms.map((realm) => (
            <RealmCard key={realm.id} realm={cloudRealmToDisplayRealm(realm)} />
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-dashed border-[#21f7ff]/20 bg-black/20 p-5">
          <p className="text-sm text-zinc-400">
            No cloud Realms yet. Create your first cloud-backed Realm to see it here.
          </p>
        </div>
      )}
    </div>
  );
}
