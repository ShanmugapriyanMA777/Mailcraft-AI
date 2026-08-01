"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmailOutput } from "@/components/dashboard/email-output";
import { LANGUAGES } from "@/lib/ai";
import { toast } from "sonner";

export default function TranslatePage() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("Spanish");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) {
      toast.error("Please paste an email to translate");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to translate");
        return;
      }
      setOutput(data.result);
      toast.success(`Translated to ${language}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          Translate
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Translate emails into 9 languages while keeping formatting intact.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Email</CardTitle>
            <CardDescription>Paste your email and choose a target language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Target language</Label>
              <Select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1.5"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email text</Label>
              <Textarea
                id="email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your email here..."
                rows={12}
                className="mt-1.5 font-mono text-sm"
              />
            </div>
            <Button onClick={handleTranslate} loading={loading} size="lg">
              <Languages className="h-4 w-4" />
              Translate
            </Button>
          </CardContent>
        </Card>

        <div>
          <EmailOutput result={output} loading={loading} topic={`Translation to ${language}`} />
        </div>
      </div>
    </div>
  );
}
