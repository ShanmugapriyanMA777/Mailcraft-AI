"use client";

import { useEffect, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TONES, LENGTHS, LANGUAGES, type EmailResult } from "@/lib/ai";
import { EmailOutput } from "@/components/dashboard/email-output";
import { toast } from "sonner";

export default function GeneratorPage() {
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [topic, setTopic] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveAfter, setSaveAfter] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mailcraft_template");
      if (raw) {
        const t = JSON.parse(raw) as { content: string; title: string };
        if (t.content) {
          setTopic(t.title || t.content.slice(0, 60));
          setPurpose(t.content);
        }
        sessionStorage.removeItem("mailcraft_template");
      }
    } catch {}
  }, []);

  const handleGenerate = async (save = false) => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipientName || undefined,
          recipientRole: recipientRole || undefined,
          topic,
          purpose: purpose || undefined,
          keywords: keywords || undefined,
          tone,
          length,
          language,
          save,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to generate");
        return;
      }
      setResult(data.result);
      if (save) toast.success("Email generated and saved");
      else toast.success("Email generated");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          AI Email Generator
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Craft professional emails tailored to your tone, length, and language.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Details</CardTitle>
            <CardDescription>Tell us what you want to write about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., Sarah"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="recipientRole">Recipient Role</Label>
                <Input
                  id="recipientRole"
                  value={recipientRole}
                  onChange={(e) => setRecipientRole(e.target.value)}
                  placeholder="e.g., HR Manager"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Q2 Marketing Review"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Request a meeting"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., deadline, budget, results"
                rows={2}
                className="mt-1.5"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tone">Tone</Label>
                <Select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
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
                <Label htmlFor="length">Length</Label>
                <Select
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="mt-1.5"
                >
                  {LENGTHS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
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
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={() => handleGenerate(false)} loading={loading} size="lg">
                <Sparkles className="h-4 w-4" />
                Generate
              </Button>
              <Button
                onClick={() => handleGenerate(true)}
                loading={loading}
                size="lg"
                variant="secondary"
              >
                <Wand2 className="h-4 w-4" />
                Generate & Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <EmailOutput
            result={result}
            loading={loading}
            topic={topic}
            onRegenerate={() => handleGenerate(saveAfter)}
            onSave={() => handleGenerate(true)}
            showSave
          />
        </div>
      </div>
    </div>
  );
}
