import { AppShell } from "@/components/layout/AppShell";
import { FeaturedRealmHero } from "@/components/realm/FeaturedRealmHero";
import { RealmDiscoveryGrid } from "@/components/realm/RealmDiscoveryGrid";
import { PublicRealmExplorer } from "@/components/discovery/PublicRealmExplorer";
import { HeroRealmDemo } from "@/components/landing/HeroRealmDemo";
import { ProductStorySection } from "@/components/landing/ProductStorySection";
import { ModeShowcase } from "@/components/landing/ModeShowcase";
import { ProducerOnboardingSection } from "@/components/landing/ProducerOnboardingSection";
import { getDemoRealm, mockRealms } from "@/lib/realms/mockRealms";
import { listPersistedRealms } from "@/lib/realms/realmRepository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const realm = getDemoRealm();
  const persistedRealms = await listPersistedRealms();

  return (
    <AppShell>
      <HeroRealmDemo realm={realm} />
      
      <ProductStorySection />
      
      <ModeShowcase />

      {/* Local Discovery Section */}
      <section className="border-t border-white/10 bg-[#050505] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#b7ff2a]">
              Local Realms
            </h2>
          </div>
          <FeaturedRealmHero persistedRealms={persistedRealms} demoRealm={realm} />
          <RealmDiscoveryGrid
            persistedRealms={persistedRealms}
            fallbackRealms={mockRealms}
          />
        </div>
      </section>

      <ProducerOnboardingSection />

      {/* Public Cloud Discovery */}
      <section className="border-t border-white/10 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PublicRealmExplorer />
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>BeatRealm</span>
          <span>Phase 10 — MVP Polish</span>
        </div>
      </footer>
    </AppShell>
  );
}
