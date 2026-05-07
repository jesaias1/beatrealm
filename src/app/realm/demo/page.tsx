import { AppShell } from "@/components/layout/AppShell";
import { DemoRealmExperience } from "@/components/demo/DemoRealmExperience";
import { getDemoRealm } from "@/lib/realms/mockRealms";

export default function DemoRealmPage() {
  const realm = getDemoRealm();

  return (
    <AppShell compact>
      <DemoRealmExperience realm={realm} />
    </AppShell>
  );
}
