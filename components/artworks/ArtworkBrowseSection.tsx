"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ArtworkGrid from "./ArtworkGrid";
import MobileMenu from "@/components/layout/MobileMenu";
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
  const { t, lang, setLang } = useTranslation();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: t("artwork"), href: "/artworks" },
    { label: t("artist"), href: "/artists" },
    { label: t("style"), href: "/style" },
  ];

  return (
    <div className={showPageOffset ? "pt-20 pb-20" : "pb-20"}>

      {/* Combined navigation + controls bar — sticks to top while scrolling */}
      <div className="sticky top-0 z-40 relative flex items-center h-14 px-4 border-b border-ink/10 bg-cream/90 backdrop-blur-sm md:px-6">

        {/* Left: RC logo — self-start so it aligns to the bar top and hangs below */}
        <Link href="/" aria-label="Riga Contemporary" className="flex-shrink-0 self-start translate-y-[1px]">
          <Image
            src="/header_logo_with_background.svg"
            alt="Riga Contemporary"
            width={115}
            height={185}
            className="h-24 w-auto"
          />
        </Link>

        {/* Center: nav links, only visible on desktop (md and up) */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans font-light text-[1.5rem] tracking-wide transition-colors ${
                pathname.startsWith(link.href) ? "text-ink" : "text-ink hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Sort/Filter + grid/list toggle + language + hamburger */}
        <div className="ml-auto flex items-center gap-3">

          {/* Sort & Filter button */}
          <button className="flex items-center gap-2 font-sans font-light text-xs text-ink transition-colors hover:text-accent">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="1" x2="15" y2="1" stroke="currentColor" strokeWidth="1" />
              <line x1="2" y1="5.5" x2="13" y2="5.5" stroke="currentColor" strokeWidth="1" />
              <line x1="4" y1="10" x2="11" y2="10" stroke="currentColor" strokeWidth="1" />
            </svg>
            {t("sortFilter")}
          </button>

          {/* Grid view toggle */}
          <button
            onClick={() => setLayout("grid")}
            className={`transition-colors ${layout === "grid" ? "text-ink" : "text-ink-light hover:text-accent"}`}
            aria-label={t("gridView")}
            aria-pressed={layout === "grid"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="9.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
              <rect x="9.5" y="9.5" width="6" height="6" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>

          {/* List view toggle */}
          <button
            onClick={() => setLayout("list")}
            className={`transition-colors ${layout === "list" ? "text-ink" : "text-ink-light hover:text-accent"}`}
            aria-label={t("listView")}
            aria-pressed={layout === "list"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="4" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="6.5" width="15" height="4" stroke="currentColor" strokeWidth="1" />
              <rect x="0.5" y="12.5" width="15" height="3" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>

          {/* Language switcher — desktop only */}
          <div className="hidden md:flex items-center gap-1 font-sans text-xs tracking-wide ml-1">
            <button
              onClick={() => setLang("en")}
              className={`transition-colors ${lang === "en" ? "text-ink" : "text-ink-muted hover:text-ink"}`}
            >
              EN
            </button>
            <span className="text-ink-muted">/</span>
            <button
              onClick={() => setLang("lv")}
              className={`transition-colors ${lang === "lv" ? "text-ink" : "text-ink-muted hover:text-ink"}`}
            >
              LV
            </button>
          </div>

          {/* Hamburger — mobile only, opens the full-screen menu */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-[6px] p-1"
            aria-label={t("openMenu")}
          >
            <span className="w-6 h-0.5 bg-ink block" />
            <span className="w-6 h-0.5 bg-ink block" />
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Artwork grid */}
      <div className="mt-5">
        <ArtworkGrid artworks={artworks} layout={layout} />
      </div>
    </div>
  );
}
