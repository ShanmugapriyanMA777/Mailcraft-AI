"use client";

import { useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function SubjectsPage() {
  const [topic, setTopic] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to generate subjects");
        return;
      }
      setSubjects(data.subjects);
      toast.success("Subject lines generated");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copySubject = (s: string, idx: number) => {
    navigator.clipboard.writeText(s);
    setCopied(idx);
    toast.success("Subject copied");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          Subject Generator
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Generate 10 compelling email subject lines for any topic.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic</CardTitle>
          <CardDescription>What's your email about?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="topic" className="sr-only">
                Topic
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., New product launch, Project status update"
              />
            </div>
            <Button onClick={handleGenerate} loading={loading} size="lg">
              <Wand2 className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : subjects.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Subject Lines</CardTitle>
            <CardDescription>Click any subject to copy it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {subjects.map((s, i) => (
              <button
                key={i}
                onClick={() => copySubject(s, i)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-left text-sm transition-colors hover:border-brand-300 hover:bg-brand-50/50 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-700 dark:hover:bg-brand-900/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                    {i + 1}
                  </div>
                  <span className="truncate text-ink-800 dark:text-ink-100">{s}</span>
                </div>
                {copied === i ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-ink-400 group-hover:text-brand-500" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
