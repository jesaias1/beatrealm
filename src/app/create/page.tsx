import { AppShell } from "@/components/layout/AppShell";
import { RealmCreateForm } from "@/components/create/RealmCreateForm";

export default function CreatePage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#21f7ff]">
          Realm editor
        </p>
        <h1 className="mt-3 text-5xl font-black uppercase text-white">
          Create a Realm
        </h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border border-[#21f7ff]/20 bg-[#21f7ff]/5 p-5">
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#21f7ff]">
              What you are making
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              A Realm is a playable music world powered by your beat. Once created, you get a portal link where listeners can play your track, watch audio-reactive visuals, and fight a boss synced to your sound.
            </p>
          </div>
          <div className="border border-white/10 bg-black/40 p-5">
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
              Pro tips
            </h2>
            <ul className="mt-2 list-inside list-disc text-sm leading-6 text-zinc-400">
              <li>Use a full exported beat for the best Fight Mode experience.</li>
              <li>Square cover art looks best.</li>
              <li>You can start local and publish to the cloud later.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <RealmCreateForm />
        </div>
      </section>
    </AppShell>
  );
}
