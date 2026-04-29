"use client";

import ArtworkCard from "@/components/artworks/ArtworkCard";
import { useTranslation } from "@/lib/i18n";
import type { Artwork } from "@/lib/types";
import ArtistDetailClient from "./ArtistDetailClient";

interface Props {
  artist: {
    id: string;
    name: string;
    bio?: string;
  };
  artworks: Artwork[];
}

export default function ArtistDetailPageClient({ artist, artworks }: Props) {
  const { t } = useTranslation();

  return (
    <div className="pt-16 pb-20">
      <div className="px-5 md:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-start md:justify-end gap-3">
        <div className="md:text-right">
          <p className="font-sans text-xs tracking-widest uppercase text-ink-muted mb-1">{t("by")}</p>
          <h1
            className="font-ivy font-light text-ink leading-tight"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
          >
            {artist.name}
          </h1>

          {artist.bio && <ArtistDetailClient bio={artist.bio} />}
        </div>
      </div>

      <div className="md:hidden -mx-0 overflow-x-auto pb-6 px-5">
        <div className="flex gap-3 w-max">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="w-44 shrink-0">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex gap-10 px-8">
        <div className="flex-1">
          <div className="columns-2 lg:columns-3 gap-4">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="break-inside-avoid mb-4">
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
          </div>
        </div>

        {artist.bio && (
          <div className="w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <h2 className="font-sans font-normal text-xl">{artist.name}</h2>
              <p className="font-sans text-sm text-ink-light leading-relaxed">{artist.bio}</p>
              <button className="font-sans text-xs tracking-widest uppercase border border-ink px-6 py-3 hover:bg-ink hover:text-cream transition-colors">
                {t("contactGallery")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}