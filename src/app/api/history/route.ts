import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const tone = searchParams.get("tone") || "";
    const language = searchParams.get("language") || "";

    let query = supabase.from('email_history').select('*').eq('userId', user.id);
    if (search) {
      query = query.or(`subject.ilike.%${search}%,topic.ilike.%${search}%`);
    }
    if (tone) query = query.eq('tone', tone);
    if (language) query = query.eq('language', language);

    const { data: rows } = await query.order('created_at', { ascending: false }).limit(200);

    const history = (rows || []).map(row => ({
      ...row,
      userId: row.user_id,
      generatedEmail: row.generated_email,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ history });
  } catch (err) {
    console.error("History fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

const saveSchema = z.object({
  topic: z.string().min(1),
  subject: z.string().min(1),
  recipient: z.string().optional(),
  tone: z.string().optional(),
  language: z.string().optional(),
  length: z.string().optional(),
  generatedEmail: z.string().min(1),
  feature: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { data: saved } = await supabase
      .from('email_history')
      .insert({
        user_id: user.id,
        topic: parsed.data.topic,
        subject: parsed.data.subject,
        recipient: parsed.data.recipient,
        tone: parsed.data.tone,
        language: parsed.data.language,
        length: parsed.data.length,
        generated_email: parsed.data.generatedEmail,
        feature: parsed.data.feature,
      })
      .select()
      .single();

    const mappedSaved = {
      ...saved,
      userId: saved?.user_id,
      generatedEmail: saved?.generated_email,
      createdAt: saved?.created_at,
    };

    return NextResponse.json({ entry: mappedSaved });
  } catch (err) {
    console.error("History save error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
