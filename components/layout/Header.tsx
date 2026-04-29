"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "@/lib/i18n";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(pathname !== "/");
  const { t } = useTranslation();

  const navLinks = [
    { label: t("artwork"), href: "/artworks" },
    { label: t("artist"), href: "/artists" },
    { label: t("style"), href: "/style" },
    { label: t("wishlist"), href: "/wishlist" },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // ArtworkBrowseSection has a built-in combined nav bar on these pages
    if (pathname === "/" || pathname === "/artworks") {
      setShowHeader(false);
      return;
    }
    setShowHeader(true);
  }, [pathname]);

  useEffect(() => {
    if (!showHeader) {
      setMenuOpen(false);
    }
  }, [showHeader]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-40 h-20 bg-cream flex items-start justify-between px-5 py-3 transition-all duration-500
          ${showHeader
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
          }`}
      >
        {/* RC Logo */}
        <Link href="/" aria-label="Riga Contemporary">
          <Image
            src="/header_logo.svg"
            alt="Riga Contemporary"
            width={95}
            height={167}
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav — absolutely centered in the header */}
        <nav className="absolute left-1/2 top-5 hidden md:flex items-center gap-6 lg:gap-10" style={{ transform: "translateX(calc(-50% + 300px))" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans font-light text-[1.5rem] tracking-wide transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-ink"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: language switcher (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-4 mt-1">
          {/* Language switcher — desktop only, shows active language; click to swap */}
          <LanguageToggle
            className="hidden md:flex items-center font-sans text-xs tracking-wide"
            buttonClassName="text-ink hover:text-accent transition-colors"
          />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-[6px] p-1"
            aria-label={t("openMenu")}
          >
            <span className="w-6 h-0.5 bg-ink block" />
            <span className="w-6 h-0.5 bg-ink block" />
          </button>
        </div>
      </header>

      <MobileMenu open={showHeader && menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
