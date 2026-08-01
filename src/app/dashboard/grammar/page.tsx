"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailOutput } from "@/components/dashboard/email-output";
import { toast } from "sonner";

export default function GrammarPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFix = async () => {
    if (!input.trim()) {
      toast.error("Please paste an email to check");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to check grammar");
        return;
      }
      setOutput(data.result);
      toast.success("Grammar fixed");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = () => {
    if (output) {
      setInput(output);
      setOutput(null);
      toast.success("Replaced original text");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          Grammar Checker
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Fix grammar, improve vocabulary, and refine your email while preserving the original meaning.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Email</CardTitle>
            <CardDescription>Paste the email you'd like to check</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email text</Label>
              <Textarea
                id="email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your email here..."
                rows={14}
                className="mt-1.5 font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFix} loading={loading} size="lg">
                <CheckCircle2 className="h-4 w-4" />
                Fix Grammar
              </Button>
              {output && (
                <Button onClick={handleReplace} variant="secondary" size="lg">
                  <ArrowRight className="h-4 w-4" />
                  Replace Original
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <EmailOutput result={output} loading={loading} topic="Grammar check" />
        </div>
      </div>
    </div>
  );
}
