"use client";

import { useState } from "react";

interface Props {
  bio: string;
}

export default function ArtistDetailClient({ bio }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-sans text-xs text-ink-muted hover:text-ink transition-colors"
      >
        About an artist
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
          <p className="font-sans text-sm text-ink-light leading-relaxed">{bio}</p>
          <button className="mt-6 font-sans text-xs tracking-widest uppercase border border-ink px-6 py-3 hover:bg-ink hover:text-cream transition-colors">
            Contact gallery
          </button>
        </div>
      )}
    </div>
  );
}
