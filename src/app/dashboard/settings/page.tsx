"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Bell, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { TONES, LANGUAGES } from "@/lib/ai";

type Prefs = {
  notifications: boolean;
  defaultTone: string;
  defaultLanguage: string;
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, refresh } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>({
    notifications: true,
    defaultTone: "Professional",
    defaultLanguage: "English",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mailcraft-prefs");
      if (stored) {
        setPrefs(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      localStorage.setItem("mailcraft-prefs", JSON.stringify(prefs));
      // Persist to server too (as part of preferences field)
      if (user) {
        await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: JSON.stringify(prefs) }),
        });
        await refresh();
      }
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Customize your MailCraft AI experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how MailCraft AI looks</CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Theme</Label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                theme === "light"
                  ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/20"
                  : "border-ink-200 hover:border-ink-300 dark:border-ink-800 dark:hover:border-ink-700"
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white shadow-sm">
                <Sun className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-ink-900 dark:text-ink-50">Light</div>
                <div className="text-xs text-ink-500 dark:text-ink-400">Clean & bright</div>
              </div>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                theme === "dark"
                  ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/20"
                  : "border-ink-200 hover:border-ink-300 dark:border-ink-800 dark:hover:border-ink-700"
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink-900 shadow-sm">
                <Moon className="h-5 w-5 text-blue-300" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-ink-900 dark:text-ink-50">Dark</div>
                <div className="text-xs text-ink-500 dark:text-ink-400">Easy on the eyes</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how MailCraft AI notifies you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-ink-200 p-4 dark:border-ink-800">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-200">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-ink-900 dark:text-ink-50">
                  In-app notifications
                </div>
                <div className="text-xs text-ink-500 dark:text-ink-400">
                  Show toast messages for AI generation status
                </div>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={prefs.notifications}
                onChange={(e) => setPrefs((p) => ({ ...p, notifications: e.target.checked }))}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-ink-200 transition-colors peer-checked:bg-brand-500 peer-focus:ring-2 peer-focus:ring-brand-500/30 dark:bg-ink-700">
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    prefs.notifications ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Defaults</CardTitle>
          <CardDescription>Set your preferred defaults for the email generator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="defaultTone">Default tone</Label>
            <Select
              id="defaultTone"
              value={prefs.defaultTone}
              onChange={(e) => setPrefs((p) => ({ ...p, defaultTone: e.target.value }))}
              className="mt-1.5"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="defaultLanguage">Default language</Label>
            <Select
              id="defaultLanguage"
              value={prefs.defaultLanguage}
              onChange={(e) => setPrefs((p) => ({ ...p, defaultLanguage: e.target.value }))}
              className="mt-1.5"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div>
        <Button onClick={save} loading={saving} size="lg">
          <Save className="h-4 w-4" />
          Save settings
        </Button>
      </div>
    </div>
  );
}
