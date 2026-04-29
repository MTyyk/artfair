"use client";

import { useRef } from "react";
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

  const grouped = artists.reduce<Record<string, typeof artists>>((acc, artist) => {
    const letter = artist.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(artist);
    return acc;
  }, {});

  const usedLetters = Object.keys(grouped).sort();

  function scrollToLetter(letter: string) {
    if (!grouped[letter] || !listRef.current) return;
    const el = listRef.current.querySelector(`#letter-${letter}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="pt-20 pb-20 px-5 md:px-8">
      <h1 className="font-sans font-light text-3xl mb-8 md:ml-[15vw]">{t("findArtist")}</h1>

      <div className="flex flex-col items-center">
        {/* Alphabet bar — same width as the list container */}
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
                grouped[letter]
                  ? "text-ink hover:text-accent cursor-pointer"
                  : "text-ink/20 cursor-default"
              }`}
            >
              {letter}
            </button>
          ))}
        </nav>

        {/* Scrollable artist list — fixed height, accent-colored scrollbar */}
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
  );
}
