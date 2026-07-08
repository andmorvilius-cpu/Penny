"use client";

// App navigation: bottom tab bar on phones, sidebar on md+ screens.
// Client component because it uses usePathname() to highlight the active tab.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChartPie, Wallet, Settings } from "lucide-react";

const tabs = [
  { href: "/", label: "Calendar", icon: Calendar },
  { href: "/stats", label: "Stats", icon: ChartPie },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-stone-200/70 bg-white/60 p-6 backdrop-blur dark:border-stone-800 dark:bg-stone-900/60 md:flex">
        <div className="mb-8 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="text-2xl">🪙</span> Penny
        </div>
        <nav className="flex flex-col gap-1">
          {tabs.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(href)
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-stone-200/70 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-stone-800 dark:bg-stone-950/90 md:hidden">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              isActive(href)
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-stone-400 dark:text-stone-500"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
