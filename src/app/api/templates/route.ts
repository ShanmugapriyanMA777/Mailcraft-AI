import { NextResponse } from "next/server";
import { supabase } from "@/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: rows } = await supabase.from('templates').select('*').order('category').order('title');
    const templates = (rows || []).map(row => ({
      ...row,
      createdAt: row.created_at
    }));
    return NextResponse.json({ templates });
  } catch (err) {
    console.error("Templates error:", err);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}
