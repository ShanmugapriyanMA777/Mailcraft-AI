import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { generateSubjects, checkRateLimit } from "@/lib/ai";

const schema = z.object({
  topic: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!checkRateLimit(user.id, 30)) {
      return NextResponse.json({ error: "Rate limit reached." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const subjects = await generateSubjects(parsed.data.topic);
    return NextResponse.json({ subjects });
  } catch (err: any) {
    console.error("Subjects error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate subjects" },
      { status: 500 }
    );
  }
}
