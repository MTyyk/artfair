"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import MobileMenu from "@/components/layout/MobileMenu";
import { DrawUnderline, useDrawUnderlineVariants } from "@/components/draw-random-underline";
import { gsap } from "gsap";

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
  const getSvgVariant = useDrawUnderlineVariants();
  const squiggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!squiggleRef.current) return;
    gsap.fromTo(
      squiggleRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.8, ease: "power2.inOut", delay: 0.5 }
    );
  }, []);

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

      {/* Artwork / Artist / Style / Wishlist — top center, desktop only */}
      <div className="absolute inset-x-0 top-[10vh] z-20 hidden md:flex items-center justify-center gap-10">
        <DrawUnderline getSvgVariant={getSvgVariant}>
          <button
            type="button"
            onClick={scrollToBrowse}
            className="font-sans font-light text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:font-normal transition-colors"
          >
            {t("artwork")}
          </button>
        </DrawUnderline>
        <DrawUnderline getSvgVariant={getSvgVariant}>
          <Link
            href="/artists"
            className="font-sans font-light text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:font-normal transition-colors"
          >
            {t("artist")}
          </Link>
        </DrawUnderline>
        <DrawUnderline getSvgVariant={getSvgVariant}>
          <Link
            href="/style"
            className="font-sans font-light text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:font-normal transition-colors"
          >
            {t("style")}
          </Link>
        </DrawUnderline>
        <DrawUnderline getSvgVariant={getSvgVariant}>
          <Link
            href="/wishlist"
            className="font-sans font-light text-[clamp(16px,_1.6vw,_32px)] tracking-wide text-ink hover:font-normal transition-colors"
          >
            {t("wishlist")}
          </Link>
        </DrawUnderline>
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

      {/* Red squiggly line — desktop (revealed via GSAP clip-path) */}
      <div
        ref={squiggleRef}
        className="pointer-events-none absolute z-0 hidden md:block"
        style={{ left: "20vw", top: "60vh", width: "30vw" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 652.27 448.86" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            fill="#ff152c"
            d="M50.52,57.97c18.63,12.96,31.53,30.94,42.79,50.33,2.75,4.73,6.53,11.58,3.48,17.01s-10.98,6.31-16.29,7.22c-6.35,1.09-13.22,1.49-19.62.55-4.32-.64-9.57-2.38-12.14-6.17-6.97-10.27,15.55-17.72,22.04-19.48,11.17-3.03,22.95-3.3,34.4-1.99,25.41,2.92,49.07,13.78,73.59,20.38,48.44,13.03,100.05,13.94,148.94,2.75,19.93-4.56,39.14-12.01,59.29-15.68,6.99-1.27,15.71-2.92,22.58-.26,4.62,1.79,6.77,5.56,5.36,10.3-1.89,6.36-6.71,11.95-11.05,16.79-5.79,6.46-12.2,12.36-18.83,17.94-13.16,11.08-27.68,19.82-41.97,29.31-7.84,5.21-15.61,10.67-22.61,16.99-5.5,4.97-11.05,10.79-13.62,17.89s-.13,14.08,3.31,20.28c4.7,8.48,12.41,15.18,21.02,19.49,10.3,5.16,21.96,6.96,33.39,6.98,10.56.02,21.52-1,31.67-4.08,8.46-2.57,16.77-6.89,22.08-14.18,2.48-3.42,3.93-6.79,3.34-11.05-.43-3.13-1.93-6.06-4.29-8.18-4.68-4.21-11.95-4.96-17.25-1.46-7.33,4.83-7.37,16.11-6.6,23.96.98,10.04,4.78,19.69,10.37,28.05,6.21,9.29,14.82,16.1,23.06,23.48,16.12,14.43,31.79,29.94,49.64,42.28,13.05,9.02,27.05,16.71,41.07,24.1,28.39,14.95,57.56,28.52,87.04,41.18,3.81,1.64,7.63,3.26,11.47,4.82,1.79.73,2.57-2.17.8-2.89-25.66-10.42-50.86-22.19-75.68-34.45-15.58-7.69-31.04-15.68-46.02-24.5-6.3-3.71-12.53-7.58-18.52-11.8-8.16-5.75-15.71-12.37-23.2-18.94-9.4-8.25-18.6-16.72-27.95-25.02-8.45-7.5-16.53-14.59-22.08-24.63-5.05-9.15-7.93-19.65-7.09-30.14.39-4.81,1.04-10.26,5.44-13.05,2.88-1.83,6.52-2.15,9.73-1s5.9,3.86,6.82,7.26c1.32,4.84-1.17,9.02-4.36,12.52-6.57,7.22-16.36,10.66-25.69,12.56-21.78,4.42-48.52,3.95-66.16-11.33-3.77-3.26-7.03-7.09-9.45-11.46-1.96-3.54-3.91-7.96-4.05-12.08-.24-7.28,5.17-13.79,9.95-18.68,13.08-13.4,29.9-22.79,45.5-32.88,13.71-8.87,26.7-19.39,38.08-31.11,5.02-5.17,10.05-10.77,13.46-17.17,2.08-3.9,4.06-9.09,1.72-13.33-2.52-4.58-8.08-6.39-12.95-6.83-8.14-.74-16.59.96-24.5,2.72-20.67,4.58-40.54,12.03-61.33,16.18-49.96,9.98-102.2,7.19-150.84-7.93-23.48-7.3-46.79-16.91-71.68-17.75-11.09-.38-22.42.94-32.83,4.95-7.25,2.79-20.68,8.47-18.55,18.45,1.83,8.58,13,10.91,20.31,11.27,5.95.29,11.94-.16,17.78-1.29,4.92-.95,10.62-2.12,14.41-5.66,8.04-7.49.81-19.04-3.53-26.37-5.27-8.88-10.9-17.56-17.5-25.51-7.04-8.48-15.16-15.92-24.2-22.21-1.59-1.1-3.09,1.49-1.51,2.59h0Z"
          />
        </svg>
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
