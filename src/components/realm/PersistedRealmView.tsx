import type { PersistedRealm } from "@/types";
import { PersistedRealmExperience } from "./PersistedRealmExperience";

type PersistedRealmViewProps = {
  realm: PersistedRealm;
};

export function PersistedRealmView({ realm }: PersistedRealmViewProps) {
  return <PersistedRealmExperience realm={realm} />;
}
