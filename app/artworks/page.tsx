import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import { artworksWithArtists } from "@/lib/mock-data";

export const metadata = {
  title: "Artworks — Riga Contemporary Art Fair",
};

export default function ArtworksPage() {
  return <ArtworkBrowseSection artworks={artworksWithArtists} />;
}
