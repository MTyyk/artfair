"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import RecommendedSection from "@/components/artworks/RecommendedSection";
import InterestModal from "@/components/artworks/InterestModal";
import { useTranslation } from "@/lib/i18n";
import { getSessionId } from "@/lib/session";
import type { Artwork } from "@/lib/types";

type NavigationArtwork = Pick<Artwork, "seq"> & {
  artist?: Artwork["artist"];
};

interface Props {
  artwork: Artwork;
  prevArtwork: NavigationArtwork | null;
  nextArtwork: NavigationArtwork | null;
}

export default function ArtworkDetailPageClient({ artwork, prevArtwork, nextArtwork }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [descLevel, setDescLevel] = useState<"simple" | "advanced">("simple");
  const { t } = useTranslation();

  // Log one view per session+artwork
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId || !artwork.id) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, artwork_id: artwork.id }),
    }).catch(() => {/* silent */});
  }, [artwork.id]);

  const hasLevels = !!(artwork.description_beginner || artwork.description_advanced);
  const displayedDescription = hasLevels
    ? descLevel === "simple"
      ? artwork.description_beginner ?? artwork.description
      : artwork.description_advanced ?? artwork.description
    : artwork.description;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: artwork.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="md:h-screen md:overflow-hidden flex flex-col">
      <div className="flex-shrink-0 h-16" />
      <div className="flex flex-col md:flex-row md:flex-1 md:min-h-0 md:overflow-hidden">

        {/* Left column: image + actions pinned to bottom-right of image */}
        <div className="w-full md:w-[58%] flex items-center justify-center p-6 md:p-10">
          <div className="flex items-end gap-6">
            <Image
              src={artwork.image_url}
              alt={artwork.title}
              width={900}
              height={1100}
              className="h-auto max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain cursor-pointer"
              onClick={() => setLightboxOpen(true)}
              priority
            />

            {/* Actions pinned to bottom of image */}
            <div className="flex flex-col gap-5 pb-0.5">
              <div className="flex items-center gap-3 group">
                <FavoriteButton artworkId={artwork.id} className="text-ink hover:text-accent" />
                <span className="font-sans text-xs text-ink-light">{t("save")}</span>
              </div>

              <button onClick={() => setLightboxOpen(true)} className="flex items-center gap-3 group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink group-hover:text-accent transition-colors">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                </svg>
                <span className="font-sans text-xs text-ink-light">{t("view")}</span>
              </button>

              <button onClick={handleShare} className="flex items-center gap-3 group">
                <svg width="20" height="20" viewBox="0 0 46 47.5" fill="currentColor" className="text-ink group-hover:text-accent transition-colors">
                  <path d="M33,33c-1.2,0-2.3.4-3.2,1.1l-14.2-9c0-.4.1-.7.1-1.1s0-.7-.1-1.1l14.2-8.9c.9.7,2,1.1,3.2,1.1,2.9,0,5.3-2.4,5.3-5.3s-2.4-5.3-5.3-5.3-5.3,2.4-5.3,5.3,0,.8.1,1.1l-14.2,8.9c-.9-.7-2-1.1-3.2-1.1-2.9,0-5.3,2.4-5.3,5.3s2.4,5.3,5.3,5.3,2.3-.4,3.2-1.1l14.2,9c0,.4-.1.7-.1,1.1,0,2.9,2.4,5.3,5.3,5.3s5.3-2.4,5.3-5.3-2.4-5.3-5.3-5.3Z"/>
                </svg>
                <span className="font-sans text-xs text-ink-light">{t("share")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: artwork info */}
        <div className="w-full md:w-[42%] px-6 py-10 md:py-14 md:px-10 flex flex-col md:overflow-y-auto">

          {/* Artist link */}
          <Link href={`/artists/${artwork.artist_id}`} className="flex items-center gap-2 mb-6 group">
            <span className="font-sans text-sm text-ink-muted">⊕</span>
            <span className="font-sans text-base font-bold text-ink group-hover:text-accent transition-colors">
              {artwork.artist?.name}
            </span>
          </Link>

          <hr className="border-ink/15 mb-6" />

          {/* Title */}
          <h1 className="font-sans font-normal text-3xl md:text-[2rem] italic leading-tight mb-1">{artwork.title}</h1>
          {artwork.year && <p className="font-sans text-sm text-ink-muted mb-5">{artwork.year}</p>}

          {/* Technique, size, description */}
          <div className="space-y-1 font-sans text-sm text-ink-light">
            {artwork.technique && <p>{artwork.technique}</p>}
            {artwork.size && <p>{artwork.size}</p>}
          </div>

          {/* Description with optional level toggle */}
          {displayedDescription && (
            <div className="mt-4">
              {hasLevels && (
                <div className="flex gap-1 mb-3">
                  <button
                    onClick={() => setDescLevel("simple")}
                    className={`font-sans text-[10px] tracking-widest uppercase px-3 py-1 border transition-colors ${
                      descLevel === "simple"
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/20 text-ink-muted hover:border-ink"
                    }`}
                  >
                    {t("simple")}
                  </button>
                  <button
                    onClick={() => setDescLevel("advanced")}
                    className={`font-sans text-[10px] tracking-widest uppercase px-3 py-1 border transition-colors ${
                      descLevel === "advanced"
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/20 text-ink-muted hover:border-ink"
                    }`}
                  >
                    {t("inDepth")}
                  </button>
                </div>
              )}
              <p className="font-sans text-sm text-ink-light leading-relaxed">{displayedDescription}</p>
            </div>
          )}

          {/* Price */}
          <hr className="border-ink/15 mt-8" />
          <div className="flex items-center py-4">
            <span className="font-sans text-sm text-ink-muted w-24">Price</span>
            <span className="font-sans text-sm text-ink">
              {typeof artwork.price === "number"
                ? `€${artwork.price.toLocaleString("en-US")}`
                : t("priceOnRequest")}
            </span>
          </div>
          <hr className="border-ink/15" />

          {/* Enquire */}
          <div className="mt-14 pl-44">
            <button
              onClick={() => setInterestOpen(true)}
              className="flex items-center gap-4 group text-ink hover:text-accent transition-colors"
            >
              <svg
                viewBox="0 0 101.5 70.3"
                fill="currentColor"
                className="w-10 h-auto transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M86.2,38H5.9c-3.5,0-3.4-5.9,0-5.9h80.3L62,7.8c-3-3,.3-7.2,3.7-4.5l31.7,31.7-31.6,31.9c-3.4,2.5-6.8-1.6-3.7-4.5l24.2-24.3Z" />
              </svg>
              <span className="font-sans text-base">{t("interested")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="md:flex-shrink-0 border-t border-ink/10 flex">
        <div className="flex-1 border-r border-ink/10 p-6">
          {prevArtwork && (
            <Link href={`/artworks/${prevArtwork.seq}`} className="flex flex-col gap-1 group">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink-muted">‹ {t("prev")}</span>
              <span className="font-sans text-sm text-ink-light group-hover:text-ink transition-colors">
                {prevArtwork.artist?.name}
              </span>
            </Link>
          )}
        </div>
        <div className="flex-1 p-6 flex flex-col items-end gap-1">
          {nextArtwork && (
            <Link href={`/artworks/${nextArtwork.seq}`} className="flex flex-col items-end gap-1 group">
              <span className="font-sans text-[10px] tracking-widest uppercase text-ink-muted">{t("next")} ›</span>
              <span className="font-sans text-sm text-ink-light group-hover:text-ink transition-colors">
                {nextArtwork.artist?.name}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl font-light leading-none transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label={t("close")}
          >
            ×
          </button>
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            width={900}
            height={1100}
            className="max-h-screen max-w-full object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            priority
          />
        </div>
      )}

      {/* Interest Modal */}
      {interestOpen && (
        <InterestModal artwork={artwork} onClose={() => setInterestOpen(false)} />
      )}
    </div>
  );
}
