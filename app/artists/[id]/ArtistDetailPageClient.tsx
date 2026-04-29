"use client";

import ArtworkCard from "@/components/artworks/ArtworkCard";
import { useTranslation } from "@/lib/i18n";
import type { Artist, Artwork } from "@/lib/types";
import ArtistDetailClient from "./ArtistDetailClient";

interface Props {
  artist: Artist;
  artworks: Artwork[];
}

export default function ArtistDetailPageClient({ artist, artworks }: Props) {
  const { t } = useTranslation();
  const showInfoPanel = Boolean(artist.bio || artist.artsy_profile_url);

  return (
    <div className="pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="py-10 md:py-14 flex flex-col md:items-end gap-3">
          <div className="w-full md:max-w-[30rem] md:text-right">
            <p className="font-sans text-xs tracking-widest uppercase text-ink-muted mb-2">{t("by")}</p>
            <h1
              className="font-ivy font-light text-ink leading-[0.94]"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
            >
              {artist.name}
            </h1>

            {showInfoPanel ? (
              <ArtistDetailClient bio={artist.bio} artsyProfileUrl={artist.artsy_profile_url} />
            ) : null}
          </div>
        </div>

        <div className="md:hidden -mx-0 overflow-x-auto pb-6">
          <div className="flex gap-3 w-max">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="w-44 shrink-0">
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_20rem] gap-10">
          <div className="min-w-0">
            <div className="columns-2 lg:columns-3 gap-4">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="break-inside-avoid mb-4">
                  <ArtworkCard artwork={artwork} />
                </div>
              ))}
            </div>
          </div>

          {showInfoPanel ? (
            <aside className="w-80 shrink-0">
              <div className="sticky top-24 space-y-6">
                <p className="font-sans text-xs tracking-widest uppercase text-ink-muted">{t("aboutArtist")}</p>
                <h2 className="font-sans font-light text-[2rem] leading-none">{artist.name}</h2>
                {artist.bio ? (
                  <p className="font-sans text-sm text-ink-light leading-relaxed">{artist.bio}</p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  {artist.artsy_profile_url ? (
                    <a
                      href={artist.artsy_profile_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex font-sans text-xs tracking-widest uppercase border border-ink px-6 py-3 hover:bg-ink hover:text-cream transition-colors"
                    >
                      {t("viewOnArtsy")}
                    </a>
                  ) : null}
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}