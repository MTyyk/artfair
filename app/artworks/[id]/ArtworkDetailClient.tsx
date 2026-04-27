"use client";

import { useState } from "react";
import Image from "next/image";
import type { Artwork } from "@/lib/types";
import InterestModal from "@/components/artworks/InterestModal";
import { useTranslation } from "@/lib/i18n";

interface Props {
  artwork: Artwork;
}

export default function ArtworkDetailClient({ artwork }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [descLevel, setDescLevel] = useState<"simple" | "advanced">("simple");
  const { t } = useTranslation();

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
    <>
      {/* Description with optional level toggle */}
      {displayedDescription && (
        <div className="mb-8">
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
          <p className="font-sans text-sm text-ink-light leading-relaxed">
            {displayedDescription}
          </p>
        </div>
      )}

      {/* View */}
      <button
        onClick={() => setLightboxOpen(true)}
        className="flex items-center gap-3 group"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ink group-hover:text-accent transition-colors"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
        </svg>
        <span className="font-sans text-xs text-ink-light">{t("view")}</span>
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="flex items-center gap-3 group"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ink group-hover:text-accent transition-colors"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16,6 12,2 8,6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span className="font-sans text-xs text-ink-light">{t("share")}</span>
      </button>

      {/* Interested CTA */}
      <button
        onClick={() => setInterestOpen(true)}
        className="mt-2 w-full font-sans text-xs tracking-[0.18em] uppercase bg-ink text-cream py-4 hover:bg-accent transition-colors"
      >
        {t("interested")}
      </button>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl font-light leading-none transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
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
    </>
  );
}
