import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { PersistedRealmView } from "@/components/realm/PersistedRealmView";
import { getCloudRealmBySlug } from "@/lib/realms/cloudRealmRepository";
import { getPersistedRealmBySlug } from "@/lib/realms/realmRepository";

export const dynamic = "force-dynamic";

type RealmPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RealmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const realm = (await getCloudRealmBySlug(slug)) ?? (await getPersistedRealmBySlug(slug));
  if (!realm) return { title: "Realm Not Found | BeatRealm" };

  const title = `${realm.title} by ${realm.producerName} | BeatRealm`;
  const description = `Enter this BeatRealm: play the beat, fight the boss, and try to beat the score. ${realm.genre} · ${realm.mood}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "music.song",
      ...(realm.coverUrl ? { images: [{ url: realm.coverUrl }] } : {}),
    },
    twitter: {
      card: realm.coverUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(realm.coverUrl ? { images: [realm.coverUrl] } : {}),
    },
  };
}

export default async function RealmPage({ params }: RealmPageProps) {
  const { slug } = await params;

  const cloudRealm = await getCloudRealmBySlug(slug);
  if (cloudRealm) {
    return (
      <AppShell compact>
        <PersistedRealmView realm={cloudRealm} />
      </AppShell>
    );
  }

  const localRealm = await getPersistedRealmBySlug(slug);
  if (localRealm) {
    return (
      <AppShell compact>
        <PersistedRealmView realm={localRealm} />
      </AppShell>
    );
  }

  notFound();
}
