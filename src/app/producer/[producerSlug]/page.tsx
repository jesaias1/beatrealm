import { AppShell } from "@/components/layout/AppShell";
import { FeaturedRealmHero } from "@/components/realm/FeaturedRealmHero";
import { ProducerHeader } from "@/components/producer/ProducerHeader";
import { ProducerRealmGrid } from "@/components/producer/ProducerRealmGrid";
import { ProducerStatsPanel } from "@/components/producer/ProducerStatsPanel";
import { CTAButton } from "@/components/ui/CTAButton";
import { getDemoRealm } from "@/lib/realms/mockRealms";
import { listPersistedRealmsByProducer } from "@/lib/realms/realmRepository";
import { listCloudRealmsByProducer } from "@/lib/realms/cloudRealmRepository";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

type ProducerPageProps = {
  params: Promise<{ producerSlug: string }>;
};

export default async function ProducerPage({ params }: ProducerPageProps) {
  const { producerSlug } = await params;
  const localRealms = await listPersistedRealmsByProducer(producerSlug);
  const cloudRealms = await listCloudRealmsByProducer(producerSlug);
  const allRealms = [...(cloudRealms ?? []), ...localRealms];

  const producerName = allRealms[0]?.producerName ?? producerSlug.replaceAll("-", " ");

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <ProducerHeader
          producerName={producerName}
          producerSlug={producerSlug}
          realms={allRealms}
        />
        {allRealms.length ? (
          <>
            <ProducerStatsPanel producerSlug={producerSlug} realms={allRealms} />
            <div className="mt-10">
              <FeaturedRealmHero
                persistedRealms={allRealms}
                demoRealm={getDemoRealm()}
              />
            </div>
            <ProducerRealmGrid realms={allRealms} />
          </>
        ) : (
          <div className="mt-12 border border-dashed border-[#21f7ff]/35 bg-black/35 p-8">
            <h2 className="text-3xl font-black uppercase text-white">
              No Realms for this producer yet.
            </h2>
            <p className="mt-3 max-w-xl text-zinc-300">
              This profile shell is ready. Create a Realm with this producer name
              to light up the catalog, stats, and featured portal.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/create" icon={Plus}>
                Create Realm
              </CTAButton>
              <CTAButton href="/realm/demo" variant="secondary">
                Enter Demo Realm
              </CTAButton>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
