import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Artworks — Riga Contemporary Art Fair",
};

export default async function ArtworksPage() {
  const supabase = await createClient();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("*, artist:artists(id, name)")
    .order("created_at", { ascending: true });

  return <ArtworkBrowseSection artworks={artworks ?? []} />;
}
