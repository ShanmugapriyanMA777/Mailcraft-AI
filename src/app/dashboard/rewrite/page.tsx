"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmailOutput } from "@/components/dashboard/email-output";
import { toast } from "sonner";

const STYLES = [
  "More Professional",
  "More Friendly",
  "More Formal",
  "More Polite",
  "Shorter",
  "Longer",
  "Simpler",
  "Stronger",
];

export default function RewritePage() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!input.trim()) {
      toast.error("Please paste an email to rewrite");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input, style }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to rewrite");
        return;
      }
      setOutput(data.result);
      toast.success("Email rewritten");
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
          Rewrite Email
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Refine your email's tone, length, and style in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Email</CardTitle>
            <CardDescription>Choose a style and paste your email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="style">Rewrite style</Label>
              <Select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="mt-1.5"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
            <Button onClick={handleRewrite} loading={loading} size="lg">
              <RefreshCw className="h-4 w-4" />
              Rewrite
            </Button>
          </CardContent>
        </Card>

        <div>
          <EmailOutput result={output} loading={loading} topic="Rewrite" />
        </div>
      </div>
    </div>
  );
}
