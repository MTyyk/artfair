"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ArtworkCard from "@/components/artworks/ArtworkCard";
import { getFavorites, subscribeToFavorites } from "@/lib/favorites";
import { useTranslation } from "@/lib/i18n";
import type { Artwork } from "@/lib/types";

export default function WishlistPageClient() {
  const { t } = useTranslation();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialFavorites = getFavorites();
    setFavoriteIds(initialFavorites);

    const unsubscribe = subscribeToFavorites((nextFavorites) => {
      setFavoriteIds(nextFavorites);
      const nextFavoriteIds = new Set(nextFavorites);
      setArtworks((currentArtworks) => currentArtworks.filter((artwork) => nextFavoriteIds.has(artwork.id)));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (favoriteIds.length === 0) {
      setArtworks([]);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);

    const params = new URLSearchParams({ ids: favoriteIds.join(",") });

    fetch(`/api/artworks?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setArtworks(data.artworks ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setArtworks([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [favoriteIds]);

  return (
    <div className="pt-28 pb-20 px-5 md:px-8">
      <div className="mx-auto max-w-[1700px]">
        <div className="border-b border-ink/10 pb-5 md:pb-6">
          <h1 className="font-sans font-light text-4xl md:text-5xl">{t("wishlist")}</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 md:py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
          </div>
        ) : artworks.length === 0 ? (
          <div className="max-w-xl py-10 md:py-14">
            <p className="font-sans text-base text-ink-light leading-relaxed">{t("wishlistEmpty")}</p>
            <Link
              href="/artworks"
              className="mt-6 inline-flex border border-ink px-6 py-3 font-sans text-xs tracking-widest uppercase transition-colors hover:bg-ink hover:text-cream"
            >
              {t("browseArtworks")}
            </Link>
          </div>
        ) : (
          <>
            <div className="md:hidden mt-8 -mx-5 overflow-x-auto px-5 pb-3">
              <div className="flex w-max gap-4">
                {artworks.map((artwork) => (
                  <div key={artwork.id} className="w-[min(72vw,18rem)] shrink-0">
                    <ArtworkCard artwork={artwork} />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:grid mt-10 grid-cols-4 gap-x-6 gap-y-10 pb-10">
              {artworks.map((artwork, index) => {
                const staggered = index % 4 === 1 || index % 4 === 3;

                return (
                  <div key={artwork.id} className={staggered ? "translate-y-8" : ""}>
                    <ArtworkCard artwork={artwork} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}