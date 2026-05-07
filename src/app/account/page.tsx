"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileForm } from "@/components/account/ProfileForm";
import { CloudResultHistory } from "@/components/dashboard/CloudResultHistory";
import { CTAButton } from "@/components/ui/CTAButton";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth/authActions";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function AccountPage() {
  const { isCloudConfigured, user, isLoading } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push("/");
  }

  if (!isCloudConfigured) {
    return (
      <AppShell>
        <section className="mx-auto flex min-h-[calc(100vh-84px)] max-w-md items-center px-5 py-12">
          <div className="w-full border border-dashed border-[#21f7ff]/35 bg-black/35 p-8 text-center">
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#ff2a6d]">
              Cloud mode not configured
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase text-white">
              No Supabase connection
            </h1>
            <p className="mt-4 text-zinc-300">
              Accounts require cloud mode. Set Supabase environment variables in{" "}
              <span className="font-mono">.env.local</span> to enable.
            </p>
          </div>
        </section>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell>
        <section className="mx-auto flex min-h-[calc(100vh-84px)] max-w-md items-center justify-center px-5 py-12">
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-400 animate-pulse">
            Loading account...
          </p>
        </section>
      </AppShell>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-2xl px-5 py-12 lg:px-8">
        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#b7ff2a]">
          Account
        </p>
        <h1 className="mt-3 text-5xl font-black uppercase text-white">
          Your Profile
        </h1>

        <div className="mt-8">
          <ProfileForm />
        </div>

        {/* Cloud Result History */}
        <div className="mt-8">
          <CloudResultHistory />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/dashboard" variant="secondary">
            Dashboard
          </CTAButton>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#ff2a6d]/50 bg-[#ff2a6d]/10 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#ff2a6d] transition hover:bg-[#ff2a6d]/20 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
          >
            <LogOut size={16} />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </section>
    </AppShell>
  );
}
