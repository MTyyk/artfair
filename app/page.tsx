"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import { artworksWithArtists } from "@/lib/mock-data";

const heroImages = [
  { src: "/artworks/artwork-1.png", w: 924, h: 1298 },
  { src: "/artworks/artwork-2.png", w: 998, h: 1478 },
  { src: "/artworks/artwork-3.png", w: 858, h: 1132 },
  { src: "/artworks/artwork-4.png", w: 1208, h: 1486 },
  { src: "/artworks/artwork-5.png", w: 664, h: 766 },
  { src: "/artworks/artwork-6.png", w: 1068, h: 1144 },
  { src: "/artworks/artwork-7.png", w: 814, h: 1480 },
];

const floatClasses = [
  "animate-[floatA_4s_ease-in-out_infinite]",
  "animate-[floatB_4.8s_ease-in-out_infinite]",
  "animate-[floatC_3.8s_ease-in-out_infinite]",
  "animate-[floatA_5.2s_ease-in-out_infinite]",
  "animate-[floatB_4.2s_ease-in-out_infinite]",
  "animate-[floatC_4.6s_ease-in-out_infinite]",
  "animate-[floatA_3.6s_ease-in-out_infinite]",
];

const positions = [
  { className: "top-20 left-16 w-40 xl:w-44" },
  { className: "top-8 left-[40%] w-32 xl:w-36" },
  { className: "top-10 right-24 w-28 xl:w-32" },
  { className: "top-32 right-4 w-48 xl:w-52" },
  { className: "bottom-24 right-16 w-36 xl:w-40" },
  { className: "bottom-16 left-[43%] w-40 xl:w-44" },
  { className: "top-[38%] left-4 w-32 xl:w-36" },
];

export default function HomePage() {
  const browseSectionRef = useRef<HTMLElement>(null);

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
      <section className="relative min-h-screen overflow-hidden bg-cream">
        <div
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/4 rounded-full bg-accent md:h-[540px] md:w-[540px]"
          aria-hidden="true"
        />

        {/* RC logo — top left */}
        <div className="absolute left-6 top-6 z-20 hidden md:block">
          <Link href="/" aria-label="Riga Contemporary">
            <svg
              width="62"
              height="116"
              viewBox="0 0 62 116"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-ink"
            >
              <text
                x="0"
                y="56"
                fontFamily="'Cormorant Garamond', serif"
                fontSize="68"
                fontWeight="700"
                fill="currentColor"
              >R</text>
              <text
                x="6"
                y="112"
                fontFamily="'Cormorant Garamond', serif"
                fontSize="68"
                fontWeight="700"
                fill="currentColor"
              >C</text>
            </svg>
          </Link>
        </div>

        {/* Artwork / Artist / Style — top center */}
        <div className="absolute inset-x-0 top-7 z-20 hidden md:flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={scrollToBrowse}
            className="font-sans text-sm tracking-wide text-ink hover:text-accent transition-colors"
          >
            Artwork
          </button>
          <Link
            href="/artists"
            className="font-sans text-sm tracking-wide text-ink hover:text-accent transition-colors"
          >
            Artist
          </Link>
          <Link
            href="/style"
            className="font-sans text-sm tracking-wide text-ink hover:text-accent transition-colors"
          >
            Style
          </Link>
        </div>

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

        <div className="absolute inset-x-4 top-[8.75rem] grid grid-cols-2 gap-3 opacity-95 md:hidden">
          {heroImages.slice(0, 4).map((img, index) => (
            <div
              key={img.src}
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

        <div className="pointer-events-none hidden md:block" aria-hidden="true">
          {heroImages.map((img, index) => (
            <div
              key={img.src}
              className={`absolute ${positions[index].className} animate-[heroFadeUp_0.7s_ease-out_both]`}
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              <div className={`overflow-hidden shadow-[0_30px_70px_rgba(26,26,26,0.14)] ${floatClasses[index]}`}
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
          ))}
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-24 pt-32 text-center md:justify-center md:px-8 md:pb-20 md:pt-24">
          <div className="w-[88vw] md:-translate-y-4">
            <h1
              className="font-serif font-light leading-[1.02] text-ink animate-[heroFadeUp_0.9s_ease-out_both]"
              style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)", animationDelay: "0.4s" }}
            >
              Fall in to the art.
              <br />
              Own the extraordinary.
            </h1>
            <p
              className="mt-5 font-sans text-[11px] uppercase tracking-[0.2em] text-ink-muted animate-[heroFadeUp_0.9s_ease-out_both]"
              style={{ animationDelay: "0.65s" }}
            >
              by Riga Contemporary art fair
            </p>

            {/* Mobile-only buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:hidden">
              <button
                type="button"
                onClick={scrollToBrowse}
                className="rounded-full border border-ink bg-ink px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:border-accent hover:bg-accent"
              >
                Artwork
              </button>
              <Link
                href="/artists"
                className="rounded-full border border-ink/20 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:text-accent"
              >
                Artist
              </Link>
              <Link
                href="/style"
                className="rounded-full border border-ink/20 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:text-accent"
              >
                Style
              </Link>
            </div>
          </div>
        </div>

        {/* Red doodle — lower center */}
        <div className="pointer-events-none absolute bottom-[18%] left-[12%] z-10 hidden md:block" aria-hidden="true">
          <svg width="480" height="130" viewBox="0 0 480 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 18 72 C 10 95 -8 98 2 74 C 12 50 42 46 48 68 C 54 90 36 112 58 98 C 82 82 108 76 142 88 C 168 97 192 80 228 84 C 264 88 292 76 330 88 C 362 98 392 82 424 72 C 444 65 462 58 478 50"
              stroke="#E8291C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="600"
              strokeDashoffset="600"
              style={{ animation: "drawStroke 1.4s ease-out 1.2s forwards" }}
            />
          </svg>
        </div>

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
        <ArtworkBrowseSection artworks={artworksWithArtists} showPageOffset={false} />
      </section>
    </div>
  );
}
