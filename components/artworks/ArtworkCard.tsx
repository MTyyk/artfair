import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import type { Artwork } from "@/lib/types";

interface Props {
  artwork: Artwork;
  showFavorite?: boolean;
  layout?: "grid" | "list";
  priority?: boolean;
}

export default function ArtworkCard({ artwork, showFavorite = true, layout = "grid", priority = false }: Props) {
  const artistName = artwork.artist?.name ?? "";

  if (layout === "list") {
    return (
      <Link
        href={`/artworks/${artwork.seq}`}
        prefetch={false}
        className="group flex items-center gap-4 py-4 hover:bg-ink/[0.02] transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden bg-ink/5">
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            fill
            sizes="64px"
            className="object-cover"
            priority={priority}
          />
        </div>
        {/* Metadata */}
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base leading-tight truncate">{artwork.title}</p>
          <p className="font-sans text-xs text-ink-muted mt-0.5">{artistName}</p>
          <p className="font-sans text-xs text-ink-light mt-0.5">{artwork.technique}</p>
        </div>
        {/* Price + save */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {artwork.price ? (
            <p className="font-sans text-sm">€{artwork.price.toLocaleString()}</p>
          ) : null}
          {showFavorite && (
            <FavoriteButton
              artworkId={artwork.id}
              className="text-ink-light hover:text-accent"
            />
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/artworks/${artwork.seq}`} prefetch={false} className="group block">
      <div className="relative overflow-hidden bg-ink/5">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          width={600}
          height={750}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
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
