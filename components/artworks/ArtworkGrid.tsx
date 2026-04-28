import ArtworkCard from "./ArtworkCard";
import type { Artwork } from "@/lib/types";

interface Props {
  artworks: Artwork[];
  showFavorite?: boolean;
  layout?: "grid" | "list";
}

export default function ArtworkGrid({ artworks, showFavorite = true, layout = "grid" }: Props) {
  if (layout === "list") {
    return (
      <div className="flex flex-col divide-y divide-ink/10 px-4 md:px-6">
        {artworks.map((artwork, index) => (
          <ArtworkCard key={artwork.id} artwork={artwork} showFavorite={showFavorite} layout="list" priority={index < 4} />
        ))}
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 md:gap-4 px-4 md:px-6">
      {artworks.map((artwork, index) => (
        <div key={artwork.id} className="break-inside-avoid mb-3 md:mb-4">
          <ArtworkCard artwork={artwork} showFavorite={showFavorite} layout="grid" priority={index < 4} />
        </div>
      ))}
    </div>
  );
}
