import { Plus, Disc3 } from "lucide-react";
import { CloudRealmManagement } from "@/components/dashboard/CloudRealmManagement";
import { DashboardAuthCTA } from "@/components/dashboard/DashboardAuthCTA";
import { LocalDataPanel } from "@/components/dashboard/LocalDataPanel";
import { AppShell } from "@/components/layout/AppShell";
import { FeaturedRealmHero } from "@/components/realm/FeaturedRealmHero";
import { RealmDiscoveryGrid } from "@/components/realm/RealmDiscoveryGrid";
import { CTAButton } from "@/components/ui/CTAButton";
import { PolishedEmptyState } from "@/components/ui/PolishedEmptyState";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { getDemoRealm, mockRealms } from "@/lib/realms/mockRealms";
import { listPersistedRealms } from "@/lib/realms/realmRepository";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const persistedRealms = await listPersistedRealms();
  const hasRealms = persistedRealms.length > 0;

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#b7ff2a]">
              Dashboard
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase text-white">
              Your Realms
            </h1>
          </div>
          <CTAButton href="/create" icon={Plus}>
            Create Realm
          </CTAButton>
        </div>

        <div className="mt-8">
          <OnboardingChecklist />
        </div>

        <DashboardAuthCTA />
        <CloudRealmManagement />

        <div className="mt-10">
          <h2 className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#b7ff2a]">
            Local Realms
          </h2>
        </div>

        {hasRealms ? (
          <>
            <p className="mt-3 max-w-2xl text-zinc-300">
              Local Realms saved in <span className="font-mono">data/realms.json</span>.
              Uploaded files are served from <span className="font-mono">public/uploads</span>.
            </p>
            <div className="mt-6">
              <FeaturedRealmHero
                persistedRealms={persistedRealms}
                demoRealm={getDemoRealm()}
              />
            </div>
            <RealmDiscoveryGrid
              persistedRealms={persistedRealms}
              fallbackRealms={mockRealms}
            />
            <LocalDataPanel realms={persistedRealms} />
          </>
        ) : (
          <>
            <div className="mt-6">
              <PolishedEmptyState
                icon={Disc3}
                title="No local Realms yet"
                description="Create your first Realm, enter the demo Realm, or try the demo fight while local storage waits for its first upload."
                actionHref="/create"
                actionLabel="Create Realm"
                actionIcon={Plus}
                secondaryHref="/realm/demo"
                secondaryLabel="Try Demo Realm"
                iconTone="acid"
              />
            </div>
            <div className="mt-10">
              <FeaturedRealmHero persistedRealms={[]} demoRealm={getDemoRealm()} />
            </div>
            <RealmDiscoveryGrid persistedRealms={[]} fallbackRealms={mockRealms} />
            <LocalDataPanel realms={[]} />
          </>
        )}
      </section>
    </AppShell>
  );
}
