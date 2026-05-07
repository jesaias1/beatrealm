"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "@/lib/auth/authActions";

export default function LoginPage() {
  const { isCloudConfigured, user, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && user) {
    router.replace("/dashboard");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <AppShell>
      <section className="mx-auto flex min-h-[calc(100vh-84px)] max-w-md items-center px-5 py-12">
        {!isCloudConfigured ? (
          <div className="w-full border border-dashed border-[#21f7ff]/35 bg-black/35 p-8 text-center">
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#ff2a6d]">
              Cloud mode not configured
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase text-white">
              No Supabase connection
            </h1>
            <p className="mt-4 text-zinc-300">
              Set <span className="font-mono text-[#21f7ff]">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
              <span className="font-mono text-[#21f7ff]">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in{" "}
              <span className="font-mono">.env.local</span> to enable cloud mode and authentication.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full border border-white/10 bg-[#101012]/82 p-6 glow-border">
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#21f7ff]">
              Welcome back
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase text-white">Log In</h1>

            <label className="mt-6 block">
              <span className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-2 h-12 w-full border border-white/10 bg-black/45 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#21f7ff] focus:ring-2 focus:ring-[#21f7ff]"
              />
            </label>

            <label className="mt-4 block">
              <span className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="mt-2 h-12 w-full border border-white/10 bg-black/45 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#21f7ff] focus:ring-2 focus:ring-[#21f7ff]"
              />
            </label>

            {error ? (
              <p className="mt-4 border border-[#ff2a6d]/40 bg-[#ff2a6d]/10 px-3 py-2 text-sm text-[#ff2a6d]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full border border-[#b7ff2a]/70 bg-[#b7ff2a] px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
            >
              {submitting ? "Logging in..." : "Log In"}
            </button>

            <p className="mt-4 text-center text-sm text-zinc-400">
              No account?{" "}
              <a href="/signup" className="text-[#21f7ff] underline transition hover:text-white">
                Sign up
              </a>
            </p>
          </form>
        )}
      </section>
    </AppShell>
  );
}
