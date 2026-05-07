import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CTAButton } from "@/components/ui/CTAButton";

export default function ProducerNotFound() {
  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8">
        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#ff2a6d]">
          Producer not found
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase text-white">
          No local Realms for this producer.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-zinc-300">
          Create a Realm with this producer name first, then the local profile
          page will appear here.
        </p>
        <div className="mt-8">
          <CTAButton href="/create" icon={Plus}>
            Create a Realm
          </CTAButton>
        </div>
      </section>
    </AppShell>
  );
}
