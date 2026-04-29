import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_LIMIT = 50;

function parseArtworkIds(idsParam: string | null): string[] {
  if (!idsParam) return [];

  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return Array.from(new Set(ids));
}

// GET /api/artworks?offset=0&limit=24
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = parseArtworkIds(searchParams.get("ids"));
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0"));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") ?? "24")));

  const supabase = await createClient();

  if (ids.length > 0) {
    const { data, error } = await supabase
      .from("artworks")
      .select("id, seq, title, image_url, price, technique, size, year, artist_id, style_tags, artist:artists(id, name)")
      .in("id", ids);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const artworksById = new Map((data ?? []).map((artwork) => [artwork.id, artwork]));
    const orderedArtworks = ids
      .map((id) => artworksById.get(id))
      .filter((artwork): artwork is NonNullable<typeof artwork> => Boolean(artwork));

    return NextResponse.json({ artworks: orderedArtworks });
  }

  const { data, error } = await supabase
    .from("artworks")
    .select("id, seq, title, image_url, price, technique, size, year, artist_id, style_tags, artist:artists(id, name)")
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ artworks: data ?? [] });
}
