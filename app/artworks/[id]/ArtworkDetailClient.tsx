"use client";

import { useState } from "react";
import Image from "next/image";
import type { Artwork } from "@/lib/types";
import InterestModal from "@/components/artworks/InterestModal";

interface Props {
  artwork: Artwork;
}

export default function ArtworkDetailClient({ artwork }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: artwork.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* View (opens lightbox) */}
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
        <span className="font-sans text-xs text-ink-light">View</span>
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
        <span className="font-sans text-xs text-ink-light">Share</span>
      </button>

      {/* Interested CTA */}
      <button
        onClick={() => setInterestOpen(true)}
        className="mt-2 w-full font-sans text-xs tracking-[0.18em] uppercase bg-ink text-cream py-4 hover:bg-accent transition-colors"
      >
        Interested
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
