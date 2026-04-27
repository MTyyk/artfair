import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/recommendations?session_id=...
// Returns artworks with similar style_tags to those the session has viewed or saved.
// Falls back to recently added artworks for fresh sessions.
export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("session_id");
  const exclude_ids_param = req.nextUrl.searchParams.get("exclude");
  const excludeIds = exclude_ids_param ? exclude_ids_param.split(",") : [];

  const supabase = await createClient();

  // Collect viewed + favorited artworks for this session
  const [{ data: viewEvents }, { data: savedFavs }] = await Promise.all([
    session_id
      ? supabase
          .from("event_logs")
          .select("artwork_id")
          .eq("session_id", session_id)
          .eq("event_type", "view")
          .limit(20)
      : Promise.resolve({ data: [] }),
    session_id
      ? supabase
          .from("favorites")
          .select("artwork_id")
          .eq("session_id", session_id)
          .limit(20)
      : Promise.resolve({ data: [] }),
  ]);

  const interactedIds = [
    ...new Set([
      ...((viewEvents ?? []).map((r) => r.artwork_id)),
      ...((savedFavs ?? []).map((r) => r.artwork_id)),
    ]),
  ];

  if (interactedIds.length === 0) {
    // Fresh session: return recent artworks as fallback
    const { data: recent } = await supabase
      .from("artworks")
      .select("*, artist:artists(id, name)")
      .not("id", "in", excludeIds.length > 0 ? `(${excludeIds.map((id) => `'${id}'`).join(",")})` : "('')")
      .order("seq", { ascending: true })
      .limit(6);
    return NextResponse.json({ artworks: recent ?? [], basis: "recent" });
  }

  // Get style_tags from interacted artworks
  const { data: interactedArtworks } = await supabase
    .from("artworks")
    .select("style_tags")
    .in("id", interactedIds);

  const allTags = [
    ...new Set(
      (interactedArtworks ?? []).flatMap((a) => a.style_tags ?? [])
    ),
  ];

  if (allTags.length === 0) {
    // Interacted artworks have no tags: fallback to recent
    const { data: recent } = await supabase
      .from("artworks")
      .select("*, artist:artists(id, name)")
      .not("id", "in", `(${[...interactedIds, ...excludeIds].map((id) => `'${id}'`).join(",")})`)
      .order("seq", { ascending: true })
      .limit(6);
    return NextResponse.json({ artworks: recent ?? [], basis: "recent" });
  }

  // Find artworks that share any of those style tags, excluding already-interacted ones
  const allExclude = [...new Set([...interactedIds, ...excludeIds])];
  const { data: recommended } = await supabase
    .from("artworks")
    .select("*, artist:artists(id, name)")
    .overlaps("style_tags", allTags)
    .not("id", "in", `(${allExclude.map((id) => `'${id}'`).join(",")})`)
    .order("seq", { ascending: true })
    .limit(6);

  // If not enough results, pad with recent works
  let artworks = recommended ?? [];
  if (artworks.length < 3) {
    const padExclude = [...new Set([...allExclude, ...artworks.map((a) => a.id)])];
    const { data: padded } = await supabase
      .from("artworks")
      .select("*, artist:artists(id, name)")
      .not("id", "in", `(${padExclude.map((id) => `'${id}'`).join(",")})`)
      .order("seq", { ascending: true })
      .limit(6 - artworks.length);
    artworks = [...artworks, ...(padded ?? [])];
  }

  return NextResponse.json({ artworks, basis: "style" });
}
