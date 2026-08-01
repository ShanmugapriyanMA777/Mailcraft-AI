"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "blue" | "success";

const variants: Record<Variant, string> = {
  default: "bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-ink-50",
  secondary: "bg-ink-50 text-ink-600 dark:bg-ink-800 dark:text-ink-300",
  outline:
    "border border-ink-200 bg-white text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200",
  blue: "bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/30 dark:text-brand-200 dark:border-brand-800",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
