import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  avatar: z.string().optional(),
  preferences: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.avatar !== undefined) updates.avatar = parsed.data.avatar;
    if (parsed.data.preferences !== undefined) updates.preferences = parsed.data.preferences;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true });
    }

    await supabase.from('users').update(updates).eq('id', user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { data: full } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
    if (!full) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const valid = await verifyPassword(parsed.data.currentPassword, full.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await supabase.from('users').update({ password_hash: passwordHash }).eq('id', user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Password change error:", err);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
