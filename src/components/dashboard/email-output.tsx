"use client";

import { useState } from "react";
import { Copy, Check, Download, Save, RefreshCw, FileText, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import type { EmailResult } from "@/lib/ai";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

function downloadAsPDF(email: EmailResult | string, topic: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 60;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - margin * 2;
  let y = margin;

  const fullText = typeof email === "string" ? email : email.full;
  const lines = fullText.split("\n");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  lines.forEach((line) => {
    const isSubject = lines.indexOf(line) === 0;
    if (isSubject) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
    }
    const wrapped = doc.splitTextToSize(line || " ", usableWidth);
    wrapped.forEach((w: string) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(w, margin, y);
      y += isSubject ? 18 : 15;
    });
  });

  const filename = (typeof email === "string" ? topic : email.subject)
    .replace(/[^a-z0-9]/gi, "_")
    .slice(0, 40);
  doc.save(`${filename}.pdf`);
  toast.success("PDF downloaded");
}

async function downloadAsDOCX(email: EmailResult | string, topic: string) {
  const fullText = typeof email === "string" ? email : email.full;
  const lines = fullText.split("\n");
  const isStructured = typeof email !== "string";
  const subjectLine = isStructured ? email.subject : lines[0];

  const children: Paragraph[] = [];
  if (isStructured) {
    children.push(
      new Paragraph({
        text: "Subject: " + subjectLine,
        heading: HeadingLevel.HEADING_1,
      })
    );
    fullText.split("\n").slice(1).forEach((line) => {
      if (line.trim() === "") {
        children.push(new Paragraph({ text: "" }));
      } else {
        children.push(new Paragraph({ children: [new TextRun({ text: line })] }));
      }
    });
  } else {
    lines.forEach((line) => {
      if (line.trim() === "") {
        children.push(new Paragraph({ text: "" }));
      } else if (lines.indexOf(line) === 0) {
        children.push(new Paragraph({ text: line, heading: HeadingLevel.HEADING_1 }));
      } else {
        children.push(new Paragraph({ children: [new TextRun({ text: line })] }));
      }
    });
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });
  const blob = await Packer.toBlob(doc);
  const filename = subjectLine.replace(/[^a-z0-9]/gi, "_").slice(0, 40) || topic.replace(/[^a-z0-9]/gi, "_");
  saveAs(blob, `${filename}.docx`);
  toast.success("DOCX downloaded");
}

export function EmailOutput({
  result,
  loading,
  topic,
  onSave,
  onRegenerate,
  showSave,
}: {
  result: EmailResult | string | null;
  loading: boolean;
  topic: string;
  onSave?: () => void;
  onRegenerate?: () => void;
  showSave?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generated Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-900/30">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-ink-900 dark:text-ink-50">
            No email generated yet
          </h3>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Fill in the form and hit Generate to see your email here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isStructured = typeof result !== "string";
  const text = isStructured ? result.full : result;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Generated Email</CardTitle>
          {isStructured && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="blue">{isStructured && "structured"}</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isStructured ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
                Subject
              </div>
              <div className="mt-1 text-sm font-semibold text-ink-900 dark:text-ink-50">
                {result.subject}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
                Greeting
              </div>
              <div className="mt-1 text-sm text-ink-700 dark:text-ink-200">
                {result.greeting}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
                Body
              </div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-ink-700 dark:text-ink-200 leading-relaxed">
                {result.body}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
                Closing
              </div>
              <div className="mt-1 text-sm text-ink-700 dark:text-ink-200">
                {result.closing}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
                Signature
              </div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-ink-700 dark:text-ink-200">
                {result.signature}
              </div>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm text-ink-700 dark:text-ink-200 leading-relaxed">
            {result}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-ink-200 pt-4 dark:border-ink-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              copyToClipboard(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            Copy
          </Button>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => downloadAsPDF(result, topic)}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadAsDOCX(result, topic)}
          >
            <FileType className="h-4 w-4" />
            DOCX
          </Button>
          {showSave && onSave && (
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


