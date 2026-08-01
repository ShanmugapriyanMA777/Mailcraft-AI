"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Copy,
  Trash2,
  Download,
  FileType,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelative, truncate } from "@/lib/utils";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { TONES, LANGUAGES } from "@/lib/ai";

type HistoryItem = {
  id: string;
  topic: string;
  subject: string;
  recipient: string | null;
  tone: string | null;
  language: string | null;
  length: string | null;
  generatedEmail: string;
  feature: string | null;
  createdAt: string;
};

function copyText(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

function downloadItemPDF(item: HistoryItem) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 60;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - margin * 2;
  let y = margin;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  item.generatedEmail.split("\n").forEach((line, i) => {
    if (i === 0) {
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
      y += i === 0 ? 18 : 15;
    });
  });
  const fname = item.subject.replace(/[^a-z0-9]/gi, "_").slice(0, 40) || "email";
  doc.save(`${fname}.pdf`);
  toast.success("PDF downloaded");
}

async function downloadItemDOCX(item: HistoryItem) {
  const lines = item.generatedEmail.split("\n");
  const children: Paragraph[] = [];
  lines.forEach((line, i) => {
    if (line.trim() === "") {
      children.push(new Paragraph({ text: "" }));
    } else if (i === 0) {
      children.push(
        new Paragraph({ text: line, heading: HeadingLevel.HEADING_1 })
      );
    } else {
      children.push(new Paragraph({ children: [new TextRun({ text: line })] }));
    }
  });
  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  const fname = item.subject.replace(/[^a-z0-9]/gi, "_").slice(0, 40) || "email";
  saveAs(blob, `${fname}.docx`);
  toast.success("DOCX downloaded");
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tone, setTone] = useState("");
  const [language, setLanguage] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tone) params.set("tone", tone);
      if (language) params.set("language", language);
      const res = await fetch(`/api/history?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setItems(data.history);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [search, tone, language]);

  useEffect(() => {
    const t = setTimeout(fetchHistory, 200);
    return () => clearTimeout(t);
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this email from your history?")) return;
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          History
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          All your previously generated emails. Search, copy, and download anytime.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subject or topic..."
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="">All tones</option>
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">All languages</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-900/30">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-ink-900 dark:text-ink-50">
              No emails yet
            </h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              Your generated emails will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
                        {item.subject}
                      </h3>
                      {item.tone && <Badge variant="blue">{item.tone}</Badge>}
                      {item.language && (
                        <Badge variant="secondary">{item.language}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                      {truncate(item.topic, 100)} · {formatRelative(item.createdAt)}
                    </p>
                  </button>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyText(item.generatedEmail)}
                      aria-label="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadItemPDF(item)}
                      aria-label="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadItemDOCX(item)}
                      aria-label="Download DOCX"
                    >
                      <FileType className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <button
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                      className="grid h-10 w-10 place-items-center rounded-xl text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
                      aria-label="Expand"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expanded === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
                {expanded === item.id && (
                  <div className="mt-4 rounded-xl bg-ink-50 dark:bg-ink-800/50 p-4">
                    <pre className="whitespace-pre-wrap text-sm text-ink-700 dark:text-ink-200 font-sans leading-relaxed">
                      {item.generatedEmail}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
