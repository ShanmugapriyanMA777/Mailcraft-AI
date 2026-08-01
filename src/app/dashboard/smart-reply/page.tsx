"use client";

import { useState } from "react";
import { MessageSquareReply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailOutput } from "@/components/dashboard/email-output";
import { toast } from "sonner";

const REPLY_TYPES = [
  { value: "Short", label: "Short" },
  { value: "Professional", label: "Professional" },
  { value: "Friendly", label: "Friendly" },
  { value: "Decline", label: "Decline" },
  { value: "Accept", label: "Accept" },
];

export default function SmartReplyPage() {
  const [input, setInput] = useState("");
  const [replyType, setReplyType] = useState("Professional");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!input.trim()) {
      toast.error("Please paste an incoming email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/smart-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input, replyType }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to generate reply");
        return;
      }
      setOutput(data.result);
      toast.success("Reply generated");
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
          Smart Reply
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Generate contextual replies to incoming emails in different styles.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Incoming Email</CardTitle>
            <CardDescription>Paste the email you want to reply to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Reply style</Label>
              <Tabs value={replyType} onValueChange={setReplyType} className="mt-2">
                <TabsList>
                  {REPLY_TYPES.map((r) => (
                    <TabsTrigger key={r.value} value={r.value}>
                      {r.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div>
              <Label htmlFor="email">Email text</Label>
              <Textarea
                id="email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste the incoming email here..."
                rows={12}
                className="mt-1.5 font-mono text-sm"
              />
            </div>
            <Button onClick={handleReply} loading={loading} size="lg">
              <MessageSquareReply className="h-4 w-4" />
              Generate Reply
            </Button>
          </CardContent>
        </Card>

        <div>
          <EmailOutput result={output} loading={loading} topic={`${replyType} reply`} />
        </div>
      </div>
    </div>
  );
}
