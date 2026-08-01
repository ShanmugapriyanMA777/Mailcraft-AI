"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  CheckCircle2,
  RefreshCw,
  Languages,
  LayoutTemplate,
  Wand2,
  MessageSquareReply,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

const items = [
  { href: "/dashboard", label: "Email Generator", icon: Mail, exact: true },
  { href: "/dashboard/grammar", label: "Grammar Checker", icon: CheckCircle2 },
  { href: "/dashboard/rewrite", label: "Rewrite Email", icon: RefreshCw },
  { href: "/dashboard/translate", label: "Translate", icon: Languages },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/subjects", label: "Subject Generator", icon: Wand2 },
  { href: "/dashboard/smart-reply", label: "Smart Reply", icon: MessageSquareReply },
  { href: "/dashboard/history", label: "History", icon: History },
];

const bottomItems: typeof items = [
  { href: "/dashboard/profile", label: "Profile", icon: User, exact: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: true },
];

export function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-ink-200 bg-white/80 backdrop-blur-md transition-transform duration-200 dark:border-white/5 dark:bg-ink-900/40 lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-200 px-5 dark:border-ink-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/30">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              MailCraft AI
            </span>
          </Link>
          <button
            className="lg:hidden text-ink-500"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between p-3">
          <nav className="space-y-0.5 overflow-y-auto scrollbar-thin">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                    : "text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="my-3 mx-3 h-px bg-ink-200 dark:bg-ink-800" />
            {bottomItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                    : "text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-ink-200 pt-3 dark:border-ink-800">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">
                  {user?.name}
                </div>
                <div className="truncate text-xs text-ink-500 dark:text-ink-400">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
