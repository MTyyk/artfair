"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { Artist } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Props {
  artists: Pick<Artist, "id" | "name">[];
}

export default function ArtistsPageClient({ artists }: Props) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const grouped = artists.reduce<Record<string, typeof artists>>((acc, artist) => {
    const letter = artist.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(artist);
    return acc;
  }, {});

  const usedLetters = Object.keys(grouped).sort();

  // Desktop: scroll inside the fixed-height container
  function scrollToLetter(letter: string) {
    if (!grouped[letter] || !listRef.current) return;
    setActiveLetter(letter);
    const el = listRef.current.querySelector(`#letter-${letter}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Mobile: scroll the page to the letter section
  function scrollToMobileLetter(letter: string) {
    if (!grouped[letter]) return;
    const el = document.getElementById(`m-letter-${letter}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Mobile: highlight active letter by observing the small h2 headings (not full sections)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLetter(entry.target.getAttribute("data-letter"));
          }
        });
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );

    usedLetters.forEach((letter) => {
      const el = document.getElementById(`m-heading-${letter}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [usedLetters]);

  return (
    <div className="pt-20 pb-20 px-5 md:px-8">

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden">
        <h1 className="font-sans font-light text-3xl mb-8 italic text-right">{t("findArtist")}</h1>
        <div className="flex gap-4">
          {/* Artist list — normal page scroll */}
          <div className="flex-1 space-y-12 pb-20 min-w-0">
            {usedLetters.map((letter) => (
              <div key={letter} id={`m-letter-${letter}`}>
                <h2 id={`m-heading-${letter}`} data-letter={letter} className="font-sans font-light text-3xl text-ink mb-5 leading-none">{letter}</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {grouped[letter].map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.id}`}
                      className="font-sans font-light text-base text-ink hover:text-accent transition-colors"
                    >
                      {artist.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Vertical sticky alphabet — fills remaining screen height, letters divide it equally */}
          <nav
            className="sticky top-24 self-start flex flex-col shrink-0 h-[calc(90vh-6rem)]"
            aria-label={t("alphabeticalIndex")}
          >
            {ALL_LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => scrollToMobileLetter(letter)}
                disabled={!grouped[letter]}
                className={`flex-1 font-sans font-light w-6 flex items-center justify-center transition-colors outline-none text-[clamp(9px,1.5vh,14px)] ${
                  activeLetter === letter
                    ? "text-accent"
                    : grouped[letter]
                    ? "text-ink [@media(hover:hover)]:hover:text-accent cursor-pointer"
                    : "text-ink/20 cursor-default"
                }`}
              >
                {letter}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:block">
        <h1 className="font-sans font-light text-3xl mb-8 md:ml-[15vw]">{t("findArtist")}</h1>

        <div className="flex flex-col items-center">
          {/* Horizontal alphabet bar */}
          <nav
            className="flex justify-between w-full md:w-[60vw] mb-6"
            aria-label={t("alphabeticalIndex")}
          >
            {ALL_LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                disabled={!grouped[letter]}
                className={`font-sans font-light text-base transition-colors ${
                  activeLetter === letter
                    ? "text-accent"
                    : grouped[letter]
                    ? "text-ink hover:text-accent cursor-pointer"
                    : "text-ink/20 cursor-default"
                }`}
              >
                {letter}
              </button>
            ))}
          </nav>

          {/* Scrollable artist list with red scrollbar */}
          <div
            ref={listRef}
            className="w-full md:w-[60vw] overflow-y-scroll h-[calc(100vh-280px)]
              [&::-webkit-scrollbar]:w-[3px]
              [&::-webkit-scrollbar-thumb]:bg-accent
              [&::-webkit-scrollbar-track]:bg-transparent
              pr-2"
          >
            <div className="space-y-12 pb-10">
              {usedLetters.map((letter) => (
                <div key={letter} id={`letter-${letter}`}>
                  <h2 className="font-sans font-light text-3xl text-ink mb-5 leading-none">{letter}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3">
                    {grouped[letter].map((artist) => (
                      <Link
                        key={artist.id}
                        href={`/artists/${artist.id}`}
                        className="font-sans font-light text-base text-ink hover:text-accent transition-colors"
                      >
                        {artist.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
