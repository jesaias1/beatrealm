import { ArrowRight, Play, Swords } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CTAButton } from "@/components/ui/CTAButton";
import { CoverArtFrame } from "@/components/realm/CoverArtFrame";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDemoRealm } from "@/lib/realms/mockRealms";

export const dynamic = "force-dynamic";

export default function DemoLandingPage() {
  const realm = getDemoRealm();

  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
        <StatusBadge label="Demo Experience" variant="demo" />
        <h1 className="mt-6 text-5xl font-black uppercase leading-tight text-white sm:text-7xl">
          Try BeatRealm without an account.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          This built-in demo lets you experience the Realm interface and the Beat Fighter preview immediately. No upload or sign-up required.
        </p>

        <div className="mx-auto mt-12 max-w-sm text-left">
          <div className="border border-[#ffb000]/30 bg-[#101012] p-4 glow-border">
            <CoverArtFrame realm={realm} intense />
            <div className="mt-5 grid gap-3">
              <CTAButton href="/realm/demo" icon={Play}>
                Enter Demo Realm
              </CTAButton>
              <CTAButton href="/realm/demo/fight" variant="secondary" icon={Swords}>
                Preview Boss Fight
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-10 sm:flex-row">
          <p className="text-sm text-zinc-400">Ready to make your own?</p>
          <CTAButton href="/create" variant="ghost" icon={ArrowRight}>
            Create a Realm
          </CTAButton>
        </div>
      </section>
    </AppShell>
  );
}
