import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import type { Artwork } from "@/lib/types";

interface Props {
  artwork: Artwork;
  showFavorite?: boolean;
}

export default function ArtworkCard({ artwork, showFavorite = true }: Props) {
  const artistName = artwork.artist?.name ?? "";

  return (
    <Link href={`/artworks/${artwork.id}`} className="group block">
      <div className="relative overflow-hidden bg-ink/5">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          width={600}
          height={750}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {showFavorite && (
          <div className="absolute top-2.5 right-2.5">
            <FavoriteButton
              artworkId={artwork.id}
              className="text-ink-light hover:text-accent"
            />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="font-sans text-xs text-ink leading-snug">{artwork.title}</p>
        <p className="font-sans text-xs text-ink-muted">{artistName}</p>
      </div>
    </Link>
  );
}
