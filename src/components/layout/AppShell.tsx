import Link from "next/link";
import { GrainOverlay } from "./GrainOverlay";
import { Logo } from "./Logo";
import { UserNav } from "./UserNav";

type AppShellProps = {
  children: React.ReactNode;
  compact?: boolean;
};

const navItems = [
  { href: "/create", label: "Create" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/realm/demo", label: "Demo Realm" },
  { href: "/producer/demo", label: "Producer" },
];

export function AppShell({ children, compact = false }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-[#f6f6f0]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(33,247,255,0.14),transparent_26%),radial-gradient(circle_at_78%_5%,rgba(255,42,109,0.14),transparent_24%),linear-gradient(180deg,#050505_0%,#0b0b0d_46%,#050505_100%)]"
      />
      <GrainOverlay />
      <header className="relative z-20 border-b border-white/10 bg-black/55 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Logo />
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-white/10 px-3 py-2 transition hover:border-[#21f7ff]/60 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <UserNav />
          </nav>
        </div>
      </header>
      <main className={`relative z-10 ${compact ? "" : "min-h-[calc(100vh-84px)]"}`}>
        {children}
      </main>
    </div>
  );
}
