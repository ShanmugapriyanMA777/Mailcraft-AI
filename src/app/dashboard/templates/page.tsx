"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Search, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CATEGORIES = [
  "Leave Request",
  "Internship",
  "Job Application",
  "College",
  "Professor",
  "HR",
  "Complaint",
  "Appreciation",
  "Meeting Request",
  "Client",
  "Follow Up",
  "Resignation",
  "Invitation",
  "Thank You",
];

const FALLBACK: { category: string; title: string; content: string }[] = [
  {
    category: "Leave Request",
    title: "Sick Leave Request",
    content: "I would like to request sick leave for {days} day(s) starting from {date} due to a medical issue. I will ensure that my responsibilities are covered and will provide a medical certificate upon my return. Thank you for your understanding.",
  },
  {
    category: "Leave Request",
    title: "Casual Leave Request",
    content: "I would like to request casual leave for {days} day(s) on {date} for personal reasons. I will make sure to complete my pending tasks and hand over any urgent work to a colleague.",
  },
  {
    category: "Internship",
    title: "Internship Application",
    content: "I am writing to apply for the {role} internship position at {company}. As a {year} student at {university}, I am eager to apply my skills in {skills} to real-world projects.",
  },
  {
    category: "Internship",
    title: "Internship Follow-up",
    content: "I hope this message finds you well. I am following up on my internship application for the {role} position submitted on {date}. I remain very interested in joining {company} and would love to hear about next steps.",
  },
  {
    category: "Job Application",
    title: "Job Application Cover Letter",
    content: "I am excited to apply for the {role} position at {company}. With {years} years of experience in {field}, I am confident in my ability to contribute meaningfully to your team.",
  },
  {
    category: "Job Application",
    title: "Application Status Inquiry",
    content: "I hope you are doing well. I recently interviewed for the {role} position and wanted to inquire about the status of my application. I remain very enthusiastic about the opportunity.",
  },
  {
    category: "College",
    title: "Admission Inquiry",
    content: "I am writing to inquire about the admission process for the {program} program at {college}. Could you please share the application deadlines, required documents, and any upcoming information sessions?",
  },
  {
    category: "College",
    title: "Fee Related Query",
    content: "I hope this email finds you well. I would like to request clarification regarding the {semester} fee structure. Could you please share a detailed breakdown and the available payment methods?",
  },
  {
    category: "Professor",
    title: "Request for Recommendation",
    content: "I hope you are doing well. I am applying for {program} and would be grateful if you could provide a letter of recommendation. I have greatly enjoyed your course on {subject}.",
  },
  {
    category: "Professor",
    title: "Assignment Extension Request",
    content: "I hope this message finds you well. Due to {reason}, I would like to request a {days}-day extension on the {assignment}. I will ensure the work is completed to the best of my ability.",
  },
  {
    category: "HR",
    title: "HR Policy Clarification",
    content: "I would like to request clarification on the company policy regarding {topic}. Could you please share the relevant guidelines and any official documentation?",
  },
  {
    category: "HR",
    title: "Employee Onboarding Query",
    content: "I am excited to join {company} as a {role} on {date}. Could you please share the onboarding schedule, required documents, and any pre-joining reading material?",
  },
  {
    category: "Complaint",
    title: "Service Complaint",
    content: "I am writing to express my concern about {issue} encountered on {date}. I would appreciate a prompt resolution and look forward to your response.",
  },
  {
    category: "Complaint",
    title: "Product Quality Complaint",
    content: "I recently purchased {product} (order #{order_id}) and have encountered an issue with {issue}. I would like to request a replacement or refund at your earliest convenience.",
  },
  {
    category: "Appreciation",
    title: "Appreciation to Team",
    content: "I wanted to take a moment to thank the team for the outstanding work on {project}. Your dedication and collaboration made this achievement possible.",
  },
  {
    category: "Appreciation",
    title: "Customer Appreciation",
    content: "We sincerely appreciate your continued support of {company}. Your loyalty motivates us to keep delivering the best service possible.",
  },
  {
    category: "Meeting Request",
    title: "Internal Meeting Request",
    content: "I would like to schedule a meeting to discuss {topic}. Please let me know your availability over the next few days, and I will send a calendar invite.",
  },
  {
    category: "Meeting Request",
    title: "Client Meeting Request",
    content: "Thank you for your interest in working with us. I would love to schedule a discovery call to discuss your requirements and how we can help.",
  },
  {
    category: "Client",
    title: "Project Update to Client",
    content: "I hope you are doing well. I wanted to share a quick update on the {project}. We are currently on track and have completed {milestone}.",
  },
  {
    category: "Client",
    title: "Client Welcome",
    content: "Welcome to {company}! We are thrilled to have you on board. Your account manager will reach out shortly to walk you through the next steps.",
  },
  {
    category: "Follow Up",
    title: "Sales Follow-up",
    content: "I hope you are doing well. I am following up on our previous conversation about {product/service}. I would love to answer any questions you may have.",
  },
  {
    category: "Follow Up",
    title: "Payment Follow-up",
    content: "I hope this email finds you well. We would like to follow up regarding invoice #{invoice} which was due on {date}. Please let us know if there are any issues.",
  },
  {
    category: "Resignation",
    title: "Formal Resignation",
    content: "I am writing to formally resign from my position as {role} at {company}, effective {date}. I am grateful for the opportunities I have had during my time here.",
  },
  {
    category: "Resignation",
    title: "Short Notice Resignation",
    content: "Please accept this letter as formal notice of my resignation from {role}, effective {date}. I will do my best to wrap up my responsibilities during the transition period.",
  },
  {
    category: "Invitation",
    title: "Event Invitation",
    content: "We are delighted to invite you to {event} on {date} at {venue}. Your presence would mean a lot to us. Please RSVP by {rsvp_date}.",
  },
  {
    category: "Invitation",
    title: "Webinar Invitation",
    content: "We would like to invite you to our upcoming webinar on {topic} on {date}. Reserve your spot today — seating is limited.",
  },
  {
    category: "Thank You",
    title: "Thank You After Interview",
    content: "Thank you for taking the time to speak with me about the {role} position. I really enjoyed learning more about the team and am excited about the opportunity.",
  },
  {
    category: "Thank You",
    title: "Thank You for Support",
    content: "I wanted to express my sincere thanks for your support on {project}. Your guidance and feedback made a real difference.",
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<typeof FALLBACK>(FALLBACK);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        if (data.templates && data.templates.length > 0) {
          setTemplates(
            data.templates.map((t: any) => ({
              category: t.category,
              title: t.title,
              content: t.content,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUse = (content: string, title: string) => {
    try {
      sessionStorage.setItem("mailcraft_template", JSON.stringify({ content, title }));
      router.push("/dashboard");
    } catch {
      toast.error("Could not load template");
    }
  };

  const filtered = templates.filter((t) => {
    if (activeCategory && t.category !== activeCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
    );
  });

  const grouped = filtered.reduce<Record<string, typeof FALLBACK>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          Email Templates
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          Start with a curated template — selecting one will prefill the generator.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-9"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !activeCategory
                  ? "bg-brand-600 text-white"
                  : "bg-ink-100 text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c === activeCategory ? null : c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  c === activeCategory
                    ? "bg-brand-600 text-white"
                    : "bg-ink-100 text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-ink-500">
            No templates match your search.
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-ink-900 dark:text-ink-50">{cat}</h2>
              <Badge variant="secondary">{items.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((t, i) => (
                <Card key={`${cat}-${i}`} className="group flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-200">
                        <LayoutTemplate className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm">{t.title}</CardTitle>
                        <CardDescription className="text-xs">{t.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-xs text-ink-600 dark:text-ink-300 line-clamp-4 leading-relaxed">
                      {t.content}
                    </p>
                    <button
                      onClick={() => handleUse(t.content, t.title)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      Use template
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
