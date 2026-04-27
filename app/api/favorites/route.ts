import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/favorites
// Body: { session_id: string, artwork_id: string, action: "add" | "remove" }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id, artwork_id, action } = body;

  if (!session_id || !artwork_id || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = await createClient();

  if (action === "add") {
    await supabase.from("favorites").upsert(
      { session_id, artwork_id },
      { onConflict: "session_id,artwork_id", ignoreDuplicates: true }
    );
  } else {
    await supabase
      .from("favorites")
      .delete()
      .eq("session_id", session_id)
      .eq("artwork_id", artwork_id);
  }

  return NextResponse.json({ ok: true });
}

// GET /api/favorites?session_id=...
// Returns all artwork_ids saved by this session
export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("session_id");
  if (!session_id) return NextResponse.json({ ids: [] });

  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("artwork_id")
    .eq("session_id", session_id);

  return NextResponse.json({ ids: (data ?? []).map((r) => r.artwork_id) });
}
