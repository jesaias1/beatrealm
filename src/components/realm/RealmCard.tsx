import { Copy, Edit3, ExternalLink } from "lucide-react";
import type { PersistedRealm, Realm } from "@/types";
import { CTAButton } from "@/components/ui/CTAButton";
import { CoverArtFrame } from "./CoverArtFrame";
import { StatPill } from "@/components/ui/StatPill";
import { CoverPlaceholderArt } from "@/components/create/CoverPlaceholderArt";
import { getCoverPlaceholder } from "@/lib/realms/createOptions";
import { RealmCardFightStats } from "./RealmCardFightStats";

type RealmCardProps = {
  realm: Realm | PersistedRealm;
};

export function RealmCard({ realm }: RealmCardProps) {
  const isPersisted = "producerName" in realm;
  const producerName = isPersisted ? realm.producerName : realm.producer.name;
  const href = isPersisted ? `/realm/${realm.slug}` : "/realm/demo";
  const cover = isPersisted
    ? getCoverPlaceholder(realm.coverPlaceholderId ?? "circuit")
    : null;

  return (
    <article className="group border border-white/10 bg-[#101012]/88 p-4 transition duration-200 hover:-translate-y-1 hover:border-[#21f7ff]/50 hover:bg-[#15151a]">
      {isPersisted && cover ? (
        <div className="mb-4">
          <CoverPlaceholderArt
            cover={cover}
            visualStyle={realm.visualStyle}
            title={realm.title}
            producer={producerName}
            imageUrl={realm.coverUrl}
          />
        </div>
      ) : (
        <CoverArtFrame realm={realm as Realm} className="mb-4" />
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black uppercase leading-tight text-white">
            {realm.title}
          </h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
            {producerName}
          </p>
        </div>
        {realm.bpm ? (
          <span className="border border-white/10 px-2 py-1 font-mono text-xs text-[#b7ff2a]">
            {realm.bpm}
          </span>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatPill label="Mood" value={realm.mood} />
        <StatPill label="Genre" value={realm.genre} />
        <StatPill label="Style" value={realm.visualStyle} />
      </div>
      {isPersisted ? <RealmCardFightStats realmSlug={realm.slug} /> : null}
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <CTAButton href={href} variant="secondary" icon={ExternalLink}>
          Open Realm
        </CTAButton>
        <CTAButton href="/create" variant="ghost" icon={Edit3}>
          Edit
        </CTAButton>
        <CTAButton href={href} variant="ghost" icon={Copy}>
          Copy Link
        </CTAButton>
      </div>
    </article>
  );
}
