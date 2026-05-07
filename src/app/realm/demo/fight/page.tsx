import { AppShell } from "@/components/layout/AppShell";
import { DemoFightPreview } from "@/components/demo/DemoFightPreview";
import { getDemoRealm } from "@/lib/realms/mockRealms";

export default function DemoFightPage() {
  const realm = getDemoRealm();

  return (
    <AppShell compact>
      <DemoFightPreview realm={realm} />
    </AppShell>
  );
}
