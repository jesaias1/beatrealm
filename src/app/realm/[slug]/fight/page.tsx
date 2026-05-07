import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { PersistedFightPrepExperience } from "@/components/fight/PersistedFightPrepExperience";
import { getCloudRealmBySlug } from "@/lib/realms/cloudRealmRepository";
import { getPersistedRealmBySlug } from "@/lib/realms/realmRepository";

export const dynamic = "force-dynamic";

type FightPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: FightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const realm = (await getCloudRealmBySlug(slug)) ?? (await getPersistedRealmBySlug(slug));
  if (!realm) return { title: "Fight Not Found | BeatRealm" };

  const title = `Fight: ${realm.title} | BeatRealm`;
  const description = `Beat Fighter challenge on "${realm.title}" by ${realm.producerName}. ${realm.genre} · ${realm.mood}`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function FightPage({ params }: FightPageProps) {
  const { slug } = await params;

  const cloudRealm = await getCloudRealmBySlug(slug);
  if (cloudRealm) {
    return (
      <AppShell compact>
        <PersistedFightPrepExperience realm={cloudRealm} />
      </AppShell>
    );
  }

  const localRealm = await getPersistedRealmBySlug(slug);
  if (localRealm) {
    return (
      <AppShell compact>
        <PersistedFightPrepExperience realm={localRealm} />
      </AppShell>
    );
  }

  notFound();
}
