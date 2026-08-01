import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { checkGrammar, checkRateLimit } from "@/lib/ai";

const schema = z.object({
  email: z.string().min(1, "Email text is required").max(10000),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!checkRateLimit(user.id, 30)) {
      return NextResponse.json(
        { error: "Rate limit reached." },
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

    const corrected = await checkGrammar(parsed.data.email);
    return NextResponse.json({ result: corrected });
  } catch (err: any) {
    console.error("Grammar error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to check grammar" },
      { status: 500 }
    );
  }
}
