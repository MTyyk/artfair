"use client";

import Link from "next/link";
import type { Artist } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Props {
  artists: Pick<Artist, "id" | "name">[];
}

export default function ArtistsPageClient({ artists }: Props) {
  const { t } = useTranslation();

  const grouped = artists.reduce<Record<string, typeof artists>>((acc, artist) => {
    const letter = artist.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(artist);
    return acc;
  }, {});

  const usedLetters = Object.keys(grouped).sort();

  return (
    <div className="pt-20 pb-20 px-5 md:px-8">
      <h1 className="font-serif text-3xl mb-10">{t("findArtist")}</h1>

      <div className="flex gap-10 md:gap-16">
        <div className="flex-1 space-y-12">
          {usedLetters.map((letter) => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="font-serif text-3xl text-ink/25 mb-5 leading-none">{letter}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
                {grouped[letter].map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.id}`}
                    className="font-sans text-sm text-ink hover:text-accent transition-colors"
                  >
                    {artist.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <nav
          className="hidden md:flex flex-col gap-1 shrink-0 sticky top-24 self-start"
          aria-label={t("alphabeticalIndex")}
        >
          {ALL_LETTERS.map((letter) => (
            <a
              key={letter}
              href={grouped[letter] ? `#letter-${letter}` : undefined}
              className={`font-sans text-xs w-5 text-center leading-5 transition-colors ${
                grouped[letter]
                  ? "text-ink hover:text-accent cursor-pointer"
                  : "text-ink/20 cursor-default pointer-events-none"
              }`}
            >
              {letter}
            </a>
          ))}
        </nav>
      </div>

      <div className="md:hidden mt-10 -mx-5 px-5 overflow-x-auto">
        <div className="flex gap-3 w-max pb-2">
          {ALL_LETTERS.map((letter) => (
            <a
              key={letter}
              href={grouped[letter] ? `#letter-${letter}` : undefined}
              className={`font-sans text-xs leading-none transition-colors ${
                grouped[letter]
                  ? "text-ink hover:text-accent"
                  : "text-ink/20 pointer-events-none"
              }`}
            >
              {letter}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}