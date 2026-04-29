"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface Props {
  bio?: string;
  artsyProfileUrl?: string;
}

export default function ArtistDetailClient({ bio, artsyProfileUrl }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  if (!bio && !artsyProfileUrl) return null;

  return (
    <div className="md:hidden mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-sans text-xs text-ink-muted hover:text-ink transition-colors"
      >
        {t("aboutArtist")}
        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      {open && (
        <div className="mt-5 border-t border-ink/10 pt-5">
          {bio ? <p className="font-sans text-sm text-ink-light leading-relaxed">{bio}</p> : null}

          {artsyProfileUrl ? (
            <a
              href={artsyProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex font-sans text-xs tracking-widest uppercase border border-ink px-6 py-3 hover:bg-ink hover:text-cream transition-colors"
            >
              {t("viewOnArtsy")}
            </a>
          ) : null}

        </div>
      )}
    </div>
  );
}
