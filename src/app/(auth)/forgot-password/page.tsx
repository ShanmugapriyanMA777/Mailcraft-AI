"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to reset password");
        return;
      }
      toast.success("Password updated! You can now log in.");
      setEmail("");
      setNewPassword("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
        Reset your password
      </h1>
      <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400">
        Enter your email and a new password to update your account.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="mt-1.5 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="newPassword">New password</Label>
          <div className="mt-1.5 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              id="newPassword"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="pl-9"
            />
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
