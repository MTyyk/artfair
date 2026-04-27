"use client";

import Image from "next/image";
import SquiggleSVG from "@/components/SquiggleSVG";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import type { Artwork } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const heroImages = [
  { src: "/artworks/artwork-1.png", w: 944, h: 1298 },
  { src: "/artworks/artwork-2.png", w: 998, h: 1478 },
  { src: "/artworks/artwork-3.png", w: 858, h: 1132 },
  { src: "/artworks/artwork-4.png", w: 1208, h: 1486 },
  { src: "/artworks/artwork-5.png", w: 664, h: 766 },
  { src: "/artworks/artwork-6.png", w: 1068, h: 1144 },
  { src: "/artworks/artwork-7.png", w: 814, h: 1480 },
  { src: "/artworks/placeholder.jpg", w: 800, h: 1000 },
  { src: "/artworks/placeholder.jpg", w: 800, h: 1000 },
  { src: "/artworks/placeholder.jpg", w: 800, h: 1000 },
];

const floatClasses = [
  "animate-[floatA_4s_ease-in-out_infinite]",
  "animate-[floatB_4.8s_ease-in-out_infinite]",
  "animate-[floatC_3.8s_ease-in-out_infinite]",
  "animate-[floatA_5.2s_ease-in-out_infinite]",
  "animate-[floatB_4.2s_ease-in-out_infinite]",
  "animate-[floatC_4.6s_ease-in-out_infinite]",
  "animate-[floatA_3.6s_ease-in-out_infinite]",
  "animate-[floatB_4.4s_ease-in-out_infinite]",
  "animate-[floatC_5s_ease-in-out_infinite]",
  "animate-[floatA_4.7s_ease-in-out_infinite]",
];

// x, y = center of artwork as % of viewport width/height
// w = artwork width as % of viewport width
const positions = [
  { x: 13.55, y: 47,   w: 9.33 },
  { x: 25.69, y: 28,   w: 9 },
  { x: 55.38, y: 43,   w: 9.71 },
  { x: 91.51, y: 28,   w: 9.11 },
  { x: 31,    y: 48,   w: 8 },
  { x: 78.78, y: 52,   w: 9.85 },
  { x: 95.33, y: 73,   w: 6.95 },
  { x: 9.22,  y: 88,   w: 8.44 },
  { x: 69.02, y: 88,   w: 10 },
  { x: 69.42, y: 35,   w: 10.46 },
];

interface Props {
  artworks: Artwork[];
}

export default function HomeClient({ artworks }: Props) {
  const browseSectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let userInterrupted = false;
    const markInterrupted = () => {
      userInterrupted = true;
    };

    const timeoutId = window.setTimeout(() => {
      if (userInterrupted || window.scrollY > 24) {
        return;
      }

      browseSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 1800);

    window.addEventListener("wheel", markInterrupted, { passive: true });
    window.addEventListener("touchstart", markInterrupted, { passive: true });
    window.addEventListener("pointerdown", markInterrupted, { passive: true });
    window.addEventListener("keydown", markInterrupted);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("wheel", markInterrupted);
      window.removeEventListener("touchstart", markInterrupted);
      window.removeEventListener("pointerdown", markInterrupted);
      window.removeEventListener("keydown", markInterrupted);
    };
  }, []);

  const scrollToBrowse = () => {
    browseSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-cream">
      <section className="relative min-h-screen overflow-hidden bg-cream [contain:paint]">
        <div
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[40vh]"
          aria-hidden="true"
        >
          <Image
            src="/01_head_red_half_dot.svg"
            alt=""
            width={140}
            height={375}
            className="h-full w-auto"
          />
        </div>

        {/* RC logo — top left (desktop only, Header handles other pages) */}
        <div
          className="absolute z-20 hidden md:block"
          style={{ left: "5.25vw", top: "3.20vh", width: "4.375vw" }}
        >
          <Link href="/" aria-label="Riga Contemporary">
            <Image
              src="/header_logo.svg"
              alt="Riga Contemporary"
              width={95}
              height={167}
              className="w-full h-auto"
            />
          </Link>
        </div>

        {/* Artwork / Artist / Style — top center (desktop) */}
        <div className="absolute inset-x-0 top-[10vh] z-20 hidden md:flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={scrollToBrowse}
            className="[font-family:var(--font-jost)] text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:text-accent transition-colors"
          >
            Artwork
          </button>
          <Link
            href="/artists"
            className="[font-family:var(--font-jost)] text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:text-accent transition-colors"
          >
            Artist
          </Link>
          <Link
            href="/style"
            className="[font-family:var(--font-jost)] text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:text-accent transition-colors"
          >
            Style
          </Link>
        </div>

        {/* Mobile info card */}
        <div className="absolute left-5 right-5 top-20 z-10 pointer-events-none md:hidden">
          <div
            className="border border-ink/20 bg-cream p-5 shadow-sm"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            <p className="font-sans text-[10px] font-semibold uppercase leading-snug tracking-[0.22em]">
              Riga Contemporary
              <br />
              Art Fair
            </p>
            <div className="my-2.5 border-t border-ink/20" />
            <p className="font-sans text-[10px] uppercase tracking-[0.15em]">
              2–5 July 2026
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.15em]">
              Hanzas Perons, Riga
            </p>
          </div>
        </div>

        {/* Mobile hero images — 2×2 grid */}
        <div className="absolute inset-x-4 top-[8.75rem] grid grid-cols-2 gap-3 opacity-95 md:hidden">
          {heroImages.slice(0, 4).map((img, index) => (
            <div
              key={`${img.src}-${index}`}
              className={`overflow-hidden shadow-[0_18px_40px_rgba(26,26,26,0.12)] animate-[heroFadeUp_0.7s_ease-out_both] ${index > 1 ? "translate-x-6" : ""}`}
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              <Image
                src={img.src}
                alt=""
                width={img.w}
                height={img.h}
                className="h-auto w-full object-cover"
                priority={index < 2}
              />
            </div>
          ))}
        </div>

        {/* Desktop floating artwork images */}
        <div className="pointer-events-none hidden md:block" aria-hidden="true">
          {heroImages.map((img, index) => (
            <div
              key={`${img.src}-${index}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${positions[index].x}vw`,
                top: `${positions[index].y}vh`,
                width: `${positions[index].w}vw`,
              }}
            >
              <div
                className="animate-[heroFadeUp_0.7s_ease-out_both]"
                style={{ animationDelay: `${index * 0.18}s` }}
              >
                <div
                  className={`overflow-hidden shadow-[0_30px_70px_rgba(26,26,26,0.14)] ${floatClasses[index]}`}
                  style={{ animationDelay: `${index * 0.18 + 0.8}s` }}
                >
                  <Image
                    src={img.src}
                    alt=""
                    width={img.w}
                    height={img.h}
                    className="h-auto w-full object-cover"
                    priority={index < 3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Headline — CSS text on both mobile and desktop */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-24 pt-32 text-center md:justify-center md:px-8 md:pb-20 md:pt-24">
          <div className="w-[88vw] md:w-[54.69vw] md:-translate-y-4">
            <h1
              className="font-serif font-light leading-[1.02] text-ink animate-[heroFadeUp_0.9s_ease-out_both]"
              style={{
                fontSize: "clamp(2.75rem, 5.5vw, 7rem)",
                animationDelay: "0.4s",
              }}
            >
              Fall in to the art.
              <br />
              Own the extraordinary.
            </h1>

            {/* Mobile-only nav buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:hidden">
              <button
                type="button"
                onClick={scrollToBrowse}
                className="rounded-full border border-ink bg-ink px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:border-accent hover:bg-accent"
              >
                {t("artwork")}
              </button>
              <Link
                href="/artists"
                className="rounded-full border border-ink/20 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:text-accent"
              >
                {t("artist")}
              </Link>
              <Link
                href="/style"
                className="rounded-full border border-ink/20 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:text-accent"
              >
                {t("style")}
              </Link>
            </div>
          </div>
        </div>

        {/* Squiggle */}
        <div
          className="pointer-events-none absolute z-10 hidden md:block overflow-hidden"
          style={{ left: "20vw", top: "60vh", width: "30vw", height: "600px", clipPath: "inset(0)" }}
          aria-hidden="true"
        >
          <SquiggleSVG />
        </div>

        {/* Scroll arrow */}
        <button
          type="button"
          onClick={scrollToBrowse}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-bounce text-ink-muted transition-colors hover:text-ink"
          aria-label="Scroll to browse artworks"
        >
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="7" y1="0" x2="7" y2="16" stroke="currentColor" strokeWidth="1" />
            <path d="M1 11l6 7 6-7" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </button>
      </section>

      <section ref={browseSectionRef} id="browse" className="scroll-mt-20">
        <div id="home-browse-sentinel" className="h-px w-full" aria-hidden="true" />
        <ArtworkBrowseSection artworks={artworks} showPageOffset={false} />
      </section>
    </div>
  );
}
