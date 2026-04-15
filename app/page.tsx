"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import { artworksWithArtists } from "@/lib/mock-data";

const heroArtworks = artworksWithArtists.slice(0, 8);

const positions = [
  { className: "top-20 left-16 w-40 xl:w-44", rotate: "-rotate-[5deg]" },
  { className: "top-8 left-[40%] w-32 xl:w-36", rotate: "rotate-[4deg]" },
  { className: "top-10 right-24 w-28 xl:w-32", rotate: "rotate-[7deg]" },
  { className: "top-32 right-4 w-48 xl:w-52", rotate: "-rotate-[3deg]" },
  { className: "bottom-24 right-16 w-40 xl:w-44", rotate: "rotate-[5deg]" },
  { className: "bottom-16 left-[43%] w-44 xl:w-48", rotate: "-rotate-[4deg]" },
  { className: "top-[38%] left-4 w-32 xl:w-36", rotate: "rotate-[3deg]" },
  { className: "bottom-24 left-10 w-28 xl:w-32", rotate: "-rotate-[7deg]" },
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
          {heroArtworks.slice(0, 4).map((artwork, index) => (
            <div
              key={artwork.id}
              className={`overflow-hidden shadow-[0_18px_40px_rgba(26,26,26,0.12)] ${
                index % 2 === 0 ? "-rotate-3" : "rotate-3"
              } ${index > 1 ? "translate-x-6" : ""}`}
            >
              <Image
                src={artwork.image_url}
                alt=""
                width={280}
                height={360}
                className="h-auto w-full object-cover"
                priority={index < 2}
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none hidden md:block" aria-hidden="true">
          {heroArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`absolute ${positions[index].className} overflow-hidden shadow-[0_30px_70px_rgba(26,26,26,0.14)] ${positions[index].rotate}`}
            >
              <Image
                src={artwork.image_url}
                alt=""
                width={260}
                height={340}
                className="h-auto w-full object-cover"
                priority={index < 3}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-24 pt-32 text-center md:justify-center md:px-8 md:pb-20 md:pt-24">
          <div className="max-w-3xl md:-translate-y-4">
            <h1
              className="font-serif font-light leading-[1.02] text-ink"
              style={{ fontSize: "clamp(2.75rem, 8vw, 5.75rem)" }}
            >
              Fall in to the art.
              <br />
              Own the extraordinary.
            </h1>
            <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              by Riga Contemporary art fair
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
