import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await supabase
      .from('email_history')
      .delete()
      .eq('id', id)
      .eq('userId', user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("History delete error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
