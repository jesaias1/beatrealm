import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CTAButton } from "@/components/ui/CTAButton";
import { RealmCard } from "@/components/realm/RealmCard";
import { CoverArtFrame } from "@/components/realm/CoverArtFrame";
import { demoProducer, mockRealms } from "@/lib/realms/mockRealms";

export default function ProducerDemoPage() {
  const featured = mockRealms.find((realm) => realm.featured) ?? mockRealms[0];

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div
              className={`flex size-32 items-center justify-center border border-white/15 bg-gradient-to-br ${demoProducer.avatarTone} font-mono text-4xl font-black text-black glow-border`}
            >
              BR
            </div>
            <p className="mt-8 font-mono text-xs font-black uppercase tracking-[0.28em] text-[#21f7ff]">
              Producer profile
            </p>
            <h1 className="mt-3 text-6xl font-black uppercase text-white">
              {demoProducer.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
              {demoProducer.bio}
            </p>
          </div>

          <div className="border border-white/10 bg-[#101012]/80 p-5 glow-border">
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#b7ff2a]">
              Featured Realm
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-[0.7fr_1fr] sm:items-center">
              <CoverArtFrame realm={featured} />
              <div>
                <h2 className="text-4xl font-black uppercase text-white">
                  {featured.title}
                </h2>
                <p className="mt-4 text-zinc-300">{featured.description}</p>
                <div className="mt-6">
                  <CTAButton href="/realm/demo" variant="secondary" icon={ExternalLink}>
                    Open Featured Realm
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {mockRealms.map((realm) => (
            <RealmCard key={realm.id} realm={realm} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
