import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/db";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { email, newPassword } = parsed.data;
    const { data: user } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
    if (!user) {
      return NextResponse.json(
        { error: "No account with that email exists" },
        { status: 404 }
      );
    }
    const passwordHash = await hashPassword(newPassword);
    await supabase.from('users').update({ password_hash: passwordHash }).eq('id', user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
