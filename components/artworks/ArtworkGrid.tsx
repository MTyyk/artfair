import ArtworkCard from "./ArtworkCard";
import type { Artwork } from "@/lib/types";

interface Props {
  artworks: Artwork[];
  showFavorite?: boolean;
}

export default function ArtworkGrid({ artworks, showFavorite = true }: Props) {
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 md:gap-4 px-4 md:px-6">
      {artworks.map((artwork) => (
        <div key={artwork.id} className="break-inside-avoid mb-3 md:mb-4">
          <ArtworkCard artwork={artwork} showFavorite={showFavorite} />
        </div>
      ))}
    </div>
  );
}
