import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artistsWithArtworks } from "@/lib/mock-data";
import ArtworkCard from "@/components/artworks/ArtworkCard";
import ArtistDetailClient from "./ArtistDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return artistsWithArtworks.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const artist = artistsWithArtworks.find((a) => a.id === id);
  return {
    title: artist
      ? `${artist.name} — Riga Contemporary Art Fair`
      : "Artist",
  };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { id } = await params;
  const artist = artistsWithArtworks.find((a) => a.id === id);
  if (!artist) notFound();

  return (
    <div className="pt-16 pb-20">
      {/* Header: artist name */}
      <div className="px-5 md:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-start md:justify-end gap-3">
        <div className="md:text-right">
          <p className="font-sans text-xs tracking-widest uppercase text-ink-muted mb-1">by</p>
          <h1
            className="font-serif font-light text-ink leading-tight"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
          >
            {artist.name}
          </h1>

          {/* Mobile: bio accordion */}
          {artist.bio && <ArtistDetailClient bio={artist.bio} />}
        </div>
      </div>

      {/* Mobile: horizontal artwork scroll */}
      <div className="md:hidden -mx-0 overflow-x-auto pb-6 px-5">
        <div className="flex gap-3 w-max">
          {artist.artworks?.map((artwork) => (
            <div key={artwork.id} className="w-44 shrink-0">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: masonry grid + bio sidebar */}
      <div className="hidden md:flex gap-10 px-8">
        {/* Artwork grid */}
        <div className="flex-1">
          <div className="columns-2 lg:columns-3 gap-4">
            {artist.artworks?.map((artwork) => (
              <div key={artwork.id} className="break-inside-avoid mb-4">
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
          </div>
        </div>

        {/* Bio sidebar */}
        {artist.bio && (
          <div className="w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <h2 className="font-serif text-xl">{artist.name}</h2>
              <p className="font-sans text-sm text-ink-light leading-relaxed">
                {artist.bio}
              </p>
              <button className="font-sans text-xs tracking-widest uppercase border border-ink px-6 py-3 hover:bg-ink hover:text-cream transition-colors">
                Contact gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
