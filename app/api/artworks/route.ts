import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_LIMIT = 50;

// GET /api/artworks?offset=0&limit=24
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0"));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") ?? "24")));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("id, seq, title, image_url, price, technique, size, year, artist_id, style_tags, artist:artists(id, name)")
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ artworks: data ?? [] });
}
