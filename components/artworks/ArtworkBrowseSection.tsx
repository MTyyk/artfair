import ArtworkGrid from "./ArtworkGrid";
import type { Artwork } from "@/lib/types";

interface Props {
  artworks: Artwork[];
  showPageOffset?: boolean;
}

export default function ArtworkBrowseSection({
  artworks,
  showPageOffset = true,
}: Props) {
  return (
    <div className={showPageOffset ? "pt-20 pb-20" : "pb-20"}>
      <div className="sticky top-16 z-30 flex items-center justify-between border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur-sm md:px-6">
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
          Sort &amp; Filter
        </button>

        <div className="flex items-center gap-3 md:hidden">
          <button
            className="text-ink transition-colors hover:text-accent"
            aria-label="2-column grid"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="9.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9.5" y="9.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          <button
            className="text-ink-light transition-colors hover:text-accent"
            aria-label="Single column"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="9.5" width="15" height="6" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-5">
        <ArtworkGrid artworks={artworks} />
      </div>
    </div>
  );
}
