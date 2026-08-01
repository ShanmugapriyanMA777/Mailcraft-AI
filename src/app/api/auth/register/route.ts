import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/db";
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { name, email, password } = parsed.data;

    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
    }

    if (!newUser) {
      return NextResponse.json({ error: "Registration failed, no user returned" }, { status: 500 });
    }

    const token = await createToken(newUser.id);
    await setSessionCookie(token);

    return NextResponse.json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
