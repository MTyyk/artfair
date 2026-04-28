"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Artwork } from "@/lib/types";
import { getSessionId } from "@/lib/session";
import { useTranslation } from "@/lib/i18n";
import FavoriteButton from "@/components/favorites/FavoriteButton";

interface Props {
  // IDs of artworks already shown on this page — excluded from recommendations
  excludeIds?: string[];
}

export default function RecommendedSection({ excludeIds = [] }: Props) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [basis, setBasis] = useState<"style" | "recent">("recent");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const sessionId = getSessionId();
    const params = new URLSearchParams();
    if (sessionId) params.set("session_id", sessionId);
    if (excludeIds.length > 0) params.set("exclude", excludeIds.join(","));

    fetch(`/api/recommendations?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setArtworks(data.artworks ?? []);
        setBasis(data.basis ?? "recent");
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || artworks.length === 0) return null;

  const heading = basis === "style" ? t("recommendedForYou") : t("discoverMore");

  return (
    <section className="border-t border-ink/10 pt-10 pb-16 px-4 md:px-6">
      <h2 className="font-ivy text-2xl font-light mb-6">{heading}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {artworks.map((artwork) => (
          <Link
            key={artwork.id}
            href={`/artworks/${artwork.seq}`}
            prefetch={false}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-ink/5 mb-2">
              <Image
                src={artwork.image_url}
                alt={artwork.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <FavoriteButton
                  artworkId={artwork.id}
                  className="text-white drop-shadow"
                />
              </div>
            </div>
            <p className="font-ivy text-sm leading-tight truncate">{artwork.title}</p>
            {artwork.artist && (
              <p className="font-sans text-[11px] text-ink-muted truncate mt-0.5">
                {artwork.artist.name}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
