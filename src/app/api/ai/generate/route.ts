import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { generateEmail, checkRateLimit, TONES, LENGTHS, LANGUAGES } from "@/lib/ai";
import { supabase } from "@/db";

const schema = z.object({
  recipientName: z.string().optional(),
  recipientRole: z.string().optional(),
  topic: z.string().min(1, "Topic is required").max(500),
  purpose: z.string().optional(),
  keywords: z.string().optional(),
  tone: z.enum(TONES as [string, ...string[]]),
  length: z.enum(LENGTHS as [string, ...string[]]),
  language: z.enum(LANGUAGES as [string, ...string[]]),
  save: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!checkRateLimit(user.id, 30)) {
      return NextResponse.json(
        { error: "Rate limit reached. Please try again in a bit." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const result = await generateEmail(parsed.data);

    if (parsed.data.save) {
      await supabase.from('email_history').insert({
        user_id: user.id,
        topic: parsed.data.topic,
        subject: result.subject,
        recipient: parsed.data.recipientName || null,
        tone: parsed.data.tone,
        language: parsed.data.language,
        length: parsed.data.length,
        generated_email: result.full,
        feature: "generator",
      });
    }

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate email" },
      { status: 500 }
    );
  }
}
