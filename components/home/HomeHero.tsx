"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import MobileMenu from "@/components/layout/MobileMenu";

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

// Mobile: x/y = center as % of vw/vh, w = width as % of vw
const mobilePositions = [
  { x: 62, y: 17, w: 23 }, // top-right
  { x: 17, y: 33, w: 28 }, // left-middle
  { x: 84, y: 36, w: 20 }, // right-upper (smaller)
  { x: 80, y: 69, w: 24 }, // right-lower
  { x: 20, y: 80, w: 22 }, // bottom-left
];

// x, y = center of artwork as % of viewport width/height
// w = artwork width as % of viewport width
const positions = [
  { x: 13.55, y: 35.06, w: 9.33 },
  { x: 25.69, y:  8.17, w:  9 },
  { x: 55.38, y: 31.27, w:  9.71 },
  { x: 91.51, y: 16.27, w: 9.11 },
  { x: 78.78, y: 39.70, w: 9.85 },
  { x: 35,    y: 30, w: 8 },
  { x: 95.33, y: 61.19, w: 6.95 },
  { x: 9.22,  y: 75.78, w: 8.44 },
  { x: 69.02, y: 88.46, w: 10 },
  { x: 69.42, y: 14.42, w: 10.46 },
];

function scrollToBrowse() {
  const el = document.getElementById("browse");
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function HomeHero({ heroImages }: { heroImages: string[] }) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let userInterrupted = false;
    const markInterrupted = () => { userInterrupted = true; };

    const timeoutId = window.setTimeout(() => {
      if (userInterrupted || window.scrollY > 24) return;
      scrollToBrowse();
    }, 9000);

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

  return (
    <section className="relative min-h-screen overflow-hidden bg-cream">
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[40vh] hidden md:block"
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

      {/* Mobile top bar: RC logo + hamburger */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-5 md:hidden">
        <Link href="/" aria-label="Riga Contemporary">
          <Image
            src="/header_logo.svg"
            alt="Riga Contemporary"
            width={95}
            height={167}
            className="h-32 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-[6px] p-1 mt-2"
          aria-label="Open menu"
        >
          <span className="w-6 h-0.5 bg-ink block" />
          <span className="w-6 h-0.5 bg-ink block" />
        </button>
      </div>

      {/* RC logo — top left, desktop only */}
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

      {/* Artwork / Artist / Style — top center, desktop only */}
      <div className="absolute inset-x-0 top-[10vh] z-20 hidden md:flex items-center justify-center gap-10">
        <button
          type="button"
          onClick={scrollToBrowse}
          className="font-sans font-light text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:text-accent transition-colors"
        >
          {t("artwork")}
        </button>
        <Link
          href="/artists"
          className="font-sans font-light text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:text-accent transition-colors"
        >
          {t("artist")}
        </Link>
        <Link
          href="/style"
          className="font-sans font-light text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:text-accent transition-colors"
        >
          {t("style")}
        </Link>
      </div>

      {/* Mobile: 5 scattered artwork images */}
      <div className="pointer-events-none md:hidden" aria-hidden="true">
        {mobilePositions.map((pos, index) => {
          const src = heroImages[index];
          if (!src) return null;
          return (
            <div
              key={src}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}vw`, top: `${pos.y}vh` }}
            >
              <div
                className="animate-[heroFadeUp_0.7s_ease-out_both]"
                style={{ animationDelay: `${index * 0.18}s` }}
              >
                <div
                  className={`overflow-hidden shadow-[0_18px_40px_rgba(26,26,26,0.12)] ${floatClasses[index]}`}
                  style={{ animationDelay: `${index * 0.18 + 0.8}s` }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={0}
                    height={0}
                    sizes={`${pos.w}vw`}
                    style={{ width: "auto", height: "auto", maxWidth: `${pos.w}vw`, maxHeight: "22vh", display: "block" }}
                    priority={index < 2}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: floating artwork images */}
      <div className="pointer-events-none hidden md:block" aria-hidden="true">
        {positions.map((pos, index) => {
          const src = heroImages[index];
          if (!src) return null;
          return (
            <div
              key={src}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}vw`, top: `${pos.y}vh` }}
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
                    src={src}
                    alt=""
                    width={0}
                    height={0}
                    sizes={`${pos.w}vw`}
                    style={{ width: "auto", height: "auto", maxWidth: `${pos.w}vw`, maxHeight: "15vh", display: "block" }}
                    priority={index < 3}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-20 text-center md:px-8 md:pb-20 md:pt-24">
        <div className="w-[88vw] md:w-[54.69vw] md:-translate-y-4">
          <h1
            className="font-ivy leading-[1.02] text-hero-text animate-[heroFadeUp_0.9s_ease-out_both] text-[3.5rem] md:text-[clamp(2.75rem,_6vw,_7rem)]"
            style={{ animationDelay: "0.4s" }}
          >
            {/* Mobile: 4-line break */}
            <span className="md:hidden">
              {t("heroHeadlineMobile1")}<br />
              {t("heroHeadlineMobile2")}<br />
              {t("heroHeadlineMobile3")}<br />
              {t("heroHeadlineMobile4")}
            </span>
            {/* Desktop: original 2-line break */}
            <span className="hidden md:inline">
              {t("heroHeadlineLine1")}
              <br />
              {t("heroHeadlineLine2")}
            </span>
          </h1>
        </div>
      </div>

      {/* Red squiggly line — mobile */}
      <div
        className="pointer-events-none absolute z-0 md:hidden"
        style={{ left: "3vw", top: "52.5vh", width: "64.5vw", overflow: "hidden", transform: "rotate(15deg)", transformOrigin: "center", animation: "squiggle-reveal 700ms ease-out 500ms both" }}
        aria-hidden="true"
      >
        <Image
          src="/01_head_linijas_elements.svg"
          alt=""
          width={652}
          height={449}
          className="w-full h-auto"
        />
      </div>

      {/* Red squiggly line — desktop */}
      <div
        className="pointer-events-none absolute z-0 hidden md:block"
        style={{ left: "20vw", top: "60vh", width: "30vw", overflow: "hidden", animation: "squiggle-reveal 700ms ease-out 500ms both" }}
        aria-hidden="true"
      >
        <Image
          src="/01_head_linijas_elements.svg"
          alt=""
          width={652}
          height={449}
          className="w-full h-auto"
        />
      </div>

      <button
        type="button"
        onClick={scrollToBrowse}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-ink-muted transition-colors hover:text-ink"
        aria-label="Scroll to browse artworks"
      >
        <span className="font-sans text-[20px] text-ink-light md:hidden">
          {t("heroDiveIn")}
        </span>
        <svg
          width="28"
          height="16"
          viewBox="0 0 28 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-bounce"
        >
          <path d="M1 1l13 13L27 1" stroke="var(--color-ink-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  );
}
