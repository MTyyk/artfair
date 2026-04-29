import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import { createClient } from "@/lib/supabase/server";
import type { Artwork } from "@/lib/types";

export const revalidate = 3600;

export const metadata = {
  title: "Artworks — Riga Contemporary Art Fair",
};

export default async function ArtworksPage() {
  const supabase = await createClient();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("id, seq, title, image_url, price, technique, size, year, artist_id, style_tags, artist:artists(id, name)")
    .order("created_at", { ascending: true })
    .range(0, 23);

  return <ArtworkBrowseSection artworks={(artworks ?? []) as unknown as Artwork[]} showPageOffset={false} />;
}
