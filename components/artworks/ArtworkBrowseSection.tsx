"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ArtworkGrid from "./ArtworkGrid";
import LanguageToggle from "@/components/layout/LanguageToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import type { Artwork } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const PAGE_SIZE = 24;

interface Props {
  artworks: Artwork[];
  showPageOffset?: boolean;
}

export default function ArtworkBrowseSection({
  artworks: initialArtworks,
  showPageOffset = true,
}: Props) {
  const { t } = useTranslation();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<Artwork[]>(initialArtworks);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // all scroll state lives in refs so the effect closure never goes stale
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const offsetRef = useRef(initialArtworks.length);
  const pathname = usePathname();

  const navLinks = [
    { label: t("artwork"), href: "/artworks" },
    { label: t("artist"), href: "/artists" },
    { label: t("style"), href: "/style" },
    { label: t("wishlist"), href: "/wishlist" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || isLoadingRef.current || !hasMoreRef.current) return;

        isLoadingRef.current = true;
        setIsLoading(true);
        try {
          const res = await fetch(`/api/artworks?offset=${offsetRef.current}&limit=${PAGE_SIZE}`);
          const { artworks: more } = await res.json();
          if (more?.length) {
            offsetRef.current += more.length;
            setItems(prev => [...prev, ...more]);
            if (more.length < PAGE_SIZE) hasMoreRef.current = false;
          } else {
            hasMoreRef.current = false;
          }
        } catch {
          hasMoreRef.current = false;
        } finally {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      },
      { rootMargin: "400px" }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []); // runs once — all mutable state accessed via refs

  return (
    <div className={showPageOffset ? "pt-20 pb-20" : "pb-20"}>

      {/* Combined navigation + controls bar — sticks to top while scrolling */}
      <div className="sticky top-0 z-40 relative flex items-center h-14 px-4 border-b border-ink/10 bg-cream/90 backdrop-blur-sm md:px-6">

        {/* Left: RC logo */}
        <Link href="/" aria-label="Riga Contemporary" className="flex-shrink-0 self-start translate-y-[1px]">
          <Image
            src="/header_logo_with_background.svg"
            alt="Riga Contemporary"
            width={115}
            height={185}
            className="h-24 w-auto"
          />
        </Link>

        {/* Center: nav links, desktop only */}
        <nav className="absolute top-1/2 -translate-y-1/2 hidden md:flex items-center gap-6 lg:gap-10" style={{ left: "calc(58% - 60px)" }}>
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

        {/* Right: layout toggle + language + hamburger */}
        <div className="ml-auto flex items-center gap-3">

          {/* Single layout toggle — icon shows current layout, click switches to the other */}
          <button
            onClick={() => setLayout(l => l === "grid" ? "list" : "grid")}
            className="text-ink hover:text-accent transition-colors"
            aria-label={layout === "grid" ? t("listView") : t("gridView")}
          >
            {layout === "grid" ? (
              <svg width="20" height="18" viewBox="0 0 77.3 67.3" fill="currentColor">
                <path d="M47.6,29.4H7.4c-.9,0-1.6-.6-1.6-1.3V6.5c0-.7.7-1.3,1.6-1.3h40.2c.9,0,1.6.6,1.6,1.3v21.6c0,.7-.7,1.3-1.6,1.3ZM9,26.8h36.9V7.8H9v19Z"/>
                <path d="M70.5,29.4h-11.5c-.9,0-1.6-.6-1.6-1.3V6.5c0-.7.7-1.3,1.6-1.3h11.5c.9,0,1.6.6,1.6,1.3v21.6c0,.7-.7,1.3-1.6,1.3ZM60.7,26.8h8.2V7.8h-8.2v19Z"/>
                <path d="M70.2,61.2H30c-.9,0-1.6-.6-1.6-1.3v-21.6c0-.7.7-1.3,1.6-1.3h40.2c.9,0,1.6.6,1.6,1.3v21.6c0,.7-.7,1.3-1.6,1.3ZM31.7,58.6h36.9v-19H31.7v19Z"/>
                <path d="M18.6,61.2H7.1c-.9,0-1.6-.6-1.6-1.3v-21.6c0-.7.7-1.3,1.6-1.3h11.5c.9,0,1.6.6,1.6,1.3v21.6c0,.7-.7,1.3-1.6,1.3ZM8.7,58.6h8.2v-19h-8.2v19Z"/>
              </svg>
            ) : (
              <svg width="20" height="18" viewBox="0 0 77.3 67.3" fill="currentColor">
                <path d="M58.7,22.2H18.6c-.9,0-1.6-.6-1.6-1.3V6.5c0-.7.7-1.3,1.6-1.3h40.2c.9,0,1.6.6,1.6,1.3v14.4c0,.7-.7,1.3-1.6,1.3ZM20.2,19.6h36.9V7.8H20.2v11.8Z"/>
                <path d="M58.7,46.1H18.6c-.9,0-1.6-.6-1.6-1.3v-19.6c0-.7.7-1.3,1.6-1.3h40.2c.9,0,1.6.6,1.6,1.3v19.6c0,.7-.7,1.3-1.6,1.3ZM20.2,43.5h36.9v-17H20.2v17Z"/>
                <path d="M58.7,64.8H18.6c-.9,0-1.6-.6-1.6-1.3v-14.4c0-.7.7-1.3,1.6-1.3h40.2c.9,0,1.6.6,1.6,1.3v14.4c0,.7-.7,1.3-1.6,1.3ZM20.2,62.2h36.9v-11.8H20.2v11.8Z"/>
              </svg>
            )}
          </button>

          {/* Language switcher — desktop only */}
          <LanguageToggle
            className="hidden md:flex items-center font-sans text-xs tracking-wide ml-1"
            buttonClassName="text-ink hover:text-accent transition-colors"
          />

          {/* Hamburger — mobile only */}
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

      {/* Artwork grid / list */}
      <div className="mt-5">
        <ArtworkGrid artworks={items} layout={layout} />
      </div>

      {/* Sentinel — IntersectionObserver watches this element */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
