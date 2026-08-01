import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { smartReply, checkRateLimit } from "@/lib/ai";

const REPLY_TYPES = [
  "Short",
  "Professional",
  "Friendly",
  "Decline",
  "Accept",
] as const;

const schema = z.object({
  email: z.string().min(1).max(10000),
  replyType: z.enum(REPLY_TYPES as unknown as [string, ...string[]]),
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

    const result = await smartReply(
      parsed.data.email,
      parsed.data.replyType as "Short" | "Professional" | "Friendly" | "Decline" | "Accept"
    );
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("Smart reply error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate reply" },
      { status: 500 }
    );
  }
}
