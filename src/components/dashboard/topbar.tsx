"use client";

import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200 bg-white/80 px-4 backdrop-blur-md dark:border-white/5 dark:bg-ink-900/40 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="lg:hidden grid h-9 w-9 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs text-ink-500 dark:text-ink-400">Welcome back</p>
          <h2 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
            {user?.name}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
