import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/views
// Body: { session_id: string, artwork_id: string }
// Logs one view event per session+artwork combination
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id, artwork_id } = body;

  if (!session_id || !artwork_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.from("event_logs").insert({
    session_id,
    artwork_id,
    event_type: "view",
  });

  return NextResponse.json({ ok: true });
}
