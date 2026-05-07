import { AppShell } from "@/components/layout/AppShell";
import { RealmCreateForm } from "@/components/create/RealmCreateForm";
import { GlitchText } from "@/components/ui/GlitchText";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="mb-12">
          <p className="font-mono text-xs font-black uppercase tracking-[0.34em] text-[#b7ff2a]">
            BeatRealm
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.92] text-white sm:text-7xl">
            <GlitchText>Upload beat. Fight boss.</GlitchText>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Turn any beat into a Hack & Slash arena. Upload your track to generate a playable level.
          </p>
        </div>
        
        <RealmCreateForm />
      </section>
    </AppShell>
  );
}
