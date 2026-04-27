"use client";

import { useState } from "react";
import ArtworkGrid from "./ArtworkGrid";
import type { Artwork } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface Props {
  artworks: Artwork[];
  showPageOffset?: boolean;
}

export default function ArtworkBrowseSection({
  artworks,
  showPageOffset = true,
}: Props) {
  const { t } = useTranslation();
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  return (
    <div className={showPageOffset ? "pt-20 pb-20" : "pb-20"}>
      <div className="sticky top-20 z-30 flex items-center justify-between border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur-sm md:px-6">
        <button className="flex items-center gap-2 font-sans text-xs text-ink-light transition-colors hover:text-ink">
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="0" y1="1" x2="15" y2="1" stroke="currentColor" strokeWidth="1" />
            <line x1="2" y1="5.5" x2="13" y2="5.5" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="10" x2="11" y2="10" stroke="currentColor" strokeWidth="1" />
          </svg>
          {t("sortFilter")}
        </button>

        <div className="flex items-center gap-3">
          {/* Grid view */}
          <button
            onClick={() => setLayout("grid")}
            className={`transition-colors ${layout === "grid" ? "text-ink" : "text-ink-light hover:text-accent"}`}
            aria-label="Grid view"
            aria-pressed={layout === "grid"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="9.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9.5" y="9.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          {/* List view */}
          <button
            onClick={() => setLayout("list")}
            className={`transition-colors ${layout === "list" ? "text-ink" : "text-ink-light hover:text-accent"}`}
            aria-label="List view"
            aria-pressed={layout === "list"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="4" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="6.5" width="15" height="4" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="12.5" width="15" height="3" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-5">
        <ArtworkGrid artworks={artworks} layout={layout} />
      </div>
    </div>
  );
}
