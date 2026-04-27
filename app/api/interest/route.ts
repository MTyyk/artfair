import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/interest
// Body: { session_id: string, artwork_id: string, contact_info?: string, notes?: string }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id, artwork_id, contact_info, notes } = body;

  if (!session_id || !artwork_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("interests").insert({
    session_id,
    artwork_id,
    contact_info: contact_info ?? null,
    notes: notes ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also log as an analytics event
  await supabase.from("event_logs").insert({
    session_id,
    artwork_id,
    event_type: "interest",
  });

  return NextResponse.json({ ok: true });
}
