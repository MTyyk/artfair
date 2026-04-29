"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: Props) {
  const { t, lang, setLang } = useTranslation();

  const navLinks = [
    { label: t("artwork"), href: "/artworks" },
    { label: t("artist"), href: "/artists" },
    { label: t("style"), href: "/style" },
  ];

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
          className="font-sans font-bold text-[2.2rem] leading-[0.9] tracking-tight text-ink"
        >
          R<br />C
        </Link>
        <button
          onClick={onClose}
          className="text-4xl font-light leading-none text-ink-light hover:text-ink transition-colors mt-1"
          aria-label={t("closeMenu")}
        >
          ×
        </button>
      </div>

      {/* Nav links — large serif, each in its own border-bottom row */}
      <nav className="flex-1 flex flex-col justify-center px-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-sans font-light text-ink hover:text-accent transition-colors border-b border-ink/10 py-6 leading-none"
            style={{ fontSize: "clamp(3rem, 14vw, 5rem)" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-8 py-8 flex items-end justify-between">
        <div>
          <p className="font-sans text-xs text-ink-muted tracking-widest uppercase">
            {t("rigaContemporaryArtFair")}
          </p>
          <p className="font-sans text-xs text-ink-muted mt-1">
            {t("eventDates")} · {t("eventVenue")}
          </p>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-2 font-sans text-sm tracking-wide">
          <button
            onClick={() => setLang("en")}
            className={`transition-colors ${lang === "en" ? "text-ink" : "text-ink-muted"}`}
          >
            EN
          </button>
          <span className="text-ink-muted">/</span>
          <button
            onClick={() => setLang("lv")}
            className={`transition-colors ${lang === "lv" ? "text-ink" : "text-ink-muted"}`}
          >
            LV
          </button>
        </div>
      </div>
    </div>
  );
}
