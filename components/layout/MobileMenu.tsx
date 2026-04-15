"use client";

import Link from "next/link";
import { useEffect } from "react";

const navLinks = [
  { label: "Artwork", href: "/artworks" },
  { label: "Artist", href: "/artists" },
  { label: "Style", href: "/style" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      {/* Top bar */}
      <div className="px-5 py-4 flex items-start justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="font-serif font-bold text-[2.2rem] leading-[0.9] tracking-tight text-ink"
        >
          R<br />C
        </Link>
        <button
          onClick={onClose}
          className="text-3xl font-light leading-none text-ink-light hover:text-ink transition-colors mt-1"
          aria-label="Close menu"
        >
          ×
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col justify-center px-8 gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-serif text-5xl font-light text-ink hover:text-accent transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-8 py-8 border-t border-ink/10">
        <p className="font-sans text-xs text-ink-muted tracking-widest uppercase">
          Riga Contemporary Art Fair
        </p>
        <p className="font-sans text-xs text-ink-muted mt-1">
          2–5 July 2026 · Hanzas Perons, Riga
        </p>
      </div>
    </div>
  );
}
