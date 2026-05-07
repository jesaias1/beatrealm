import { UploadCloud, Link as LinkIcon, Radio } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export function ProducerOnboardingSection() {
  return (
    <section className="border-t border-white/10 bg-[radial-gradient(ellipse_at_bottom,rgba(33,247,255,0.08),transparent_70%),#050505] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#21f7ff]">
          For Producers
        </p>
        <h2 className="mt-4 text-4xl font-black uppercase text-white sm:text-6xl">
          Give your beats a home.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
          Stop sharing static files. Create an interactive Realm, publish it to the cloud, and drop the link in your bio, Discord, or Reddit.
        </p>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3 text-left">
          <div className="border border-white/10 bg-black/40 p-6">
            <UploadCloud className="text-[#21f7ff]" size={28} />
            <h3 className="mt-5 text-xl font-black uppercase text-white">Upload & Polish</h3>
            <p className="mt-3 text-sm text-zinc-400">
              Set the mood, genre, and visual aesthetic. Upload your audio and let the engine do the rest.
            </p>
          </div>
          <div className="border border-white/10 bg-black/40 p-6">
            <Radio className="text-[#21f7ff]" size={28} />
            <h3 className="mt-5 text-xl font-black uppercase text-white">Local or Cloud</h3>
            <p className="mt-3 text-sm text-zinc-400">
              Create and test privately on your machine, then publish to our global Supabase cloud when ready.
            </p>
          </div>
          <div className="border border-white/10 bg-black/40 p-6">
            <LinkIcon className="text-[#21f7ff]" size={28} />
            <h3 className="mt-5 text-xl font-black uppercase text-white">Share Link</h3>
            <p className="mt-3 text-sm text-zinc-400">
              Every Cloud Realm gets a unique URL with fully optimized Open Graph meta tags for beautiful social sharing.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <CTAButton href="/create">
            Create Your First Realm
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
