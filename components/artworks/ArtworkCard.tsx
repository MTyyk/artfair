"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import type { Artwork } from "@/lib/types";
import { getThumbUrl } from "@/lib/image";

interface Props {
  artwork: Artwork;
  showFavorite?: boolean;
  layout?: "grid" | "list";
  priority?: boolean;
}

export default function ArtworkCard({ artwork, showFavorite = true, layout = "grid", priority = false }: Props) {
  const artistName = artwork.artist?.name ?? "";
  // If thumbnail 404s (not yet generated), fall back to original
  const [imgSrc, setImgSrc] = useState(getThumbUrl(artwork.image_url));
  const handleImgError = () => setImgSrc(artwork.image_url);

  if (layout === "list") {
    return (
      <Link
        href={`/artworks/${artwork.seq}`}
        prefetch={false}
        className="group block py-10 border-b border-ink/10"
      >
        {/* Large image — full column width, natural aspect ratio */}
        <div className="w-full overflow-hidden bg-ink/5">
          <Image
            src={imgSrc}
            alt={artwork.title}
            width={650}
            height={800}
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            priority={priority}
            sizes="(max-width: 768px) 100vw, 650px"
            onError={handleImgError}
          />
        </div>

        {/* Info below image */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-sans font-normal text-lg leading-tight">{artwork.title}</p>
            <p className="font-sans font-light text-base text-ink-muted mt-1">{artistName}</p>
            {artwork.technique && (
              <p className="font-sans text-sm text-ink-light mt-1">{artwork.technique}</p>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-3">
            {artwork.price ? (
              <p className="font-sans text-sm">€{artwork.price.toLocaleString()}</p>
            ) : null}
            {showFavorite && (
              <FavoriteButton artworkId={artwork.id} className="text-ink-light hover:text-accent" />
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/artworks/${artwork.seq}`} prefetch={false} className="group block">
      <div className="relative overflow-hidden bg-ink/5">
        <Image
          src={imgSrc}
          alt={artwork.title}
          width={600}
          height={750}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onError={handleImgError}
        />
      </div>
      <div className="mt-2 px-0.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="font-sans font-normal text-sm text-ink leading-snug">{artwork.title}</p>
          <p className="font-sans font-light text-sm text-ink-muted">{artistName}</p>
        </div>
        {showFavorite && (
          <FavoriteButton
            artworkId={artwork.id}
            className="flex-shrink-0 text-ink-light hover:text-accent"
          />
        )}
      </div>
    </Link>
  );
}
