"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Artwork", href: "/artworks" },
  { label: "Artist", href: "/artists" },
  { label: "Style", href: "/style" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(pathname !== "/");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setShowHeader(true);
      return;
    }

    const updateVisibility = () => {
      const browseSentinel = document.getElementById("home-browse-sentinel");

      if (!browseSentinel) {
        setShowHeader(false);
        return;
      }

      setShowHeader(browseSentinel.getBoundingClientRect().top <= 96);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [pathname]);

  useEffect(() => {
    if (!showHeader) {
      setMenuOpen(false);
    }
  }, [showHeader]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-40 flex items-start justify-between bg-cream/90 px-5 py-4 backdrop-blur-sm transition-all duration-500 ${
          showHeader
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        {/* RC Logo */}
        <Link
          href="/"
          className="font-serif font-bold text-[2.2rem] leading-[0.9] tracking-tight text-ink hover:text-accent transition-colors"
          aria-label="Riga Contemporary"
        >
          R<br />C
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10 pt-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-sm tracking-wide transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-ink"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col gap-[5px] p-1 mt-1"
          aria-label="Open menu"
        >
          <span className="w-6 h-px bg-ink block" />
          <span className="w-6 h-px bg-ink block" />
          <span className="w-4 h-px bg-ink block self-end" />
        </button>
      </header>

      <MobileMenu open={showHeader && menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
