import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import ArtworkDetailClient from "./ArtworkDetailClient";
import RecommendedSection from "@/components/artworks/RecommendedSection";
import type { Artwork } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("artworks")
    .select("title")
    .eq("seq", Number(id))
    .single();
  return {
    title: data ? `${data.title} — Riga Contemporary Art Fair` : "Artwork",
  };
}

export default async function ArtworkDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: artworkData }, { data: allData }] = await Promise.all([
    supabase
      .from("artworks")
      .select("*, artist:artists(id, name)")
      .eq("seq", Number(id))
      .single(),
    supabase
      .from("artworks")
      .select("seq, artist:artists(id, name)")
      .order("seq", { ascending: true }),
  ]);

  if (!artworkData) notFound();

  const artwork = artworkData as unknown as Artwork;
  const allArtworks = (allData ?? []) as unknown as Artwork[];

  const currentIndex = allArtworks.findIndex((a) => a.seq === Number(id));
  const prevArtwork = currentIndex > 0 ? allArtworks[currentIndex - 1] : null;
  const nextArtwork =
    currentIndex < allArtworks.length - 1 ? allArtworks[currentIndex + 1] : null;

  return (
    <div className="pt-16">
      <div className="flex flex-col md:flex-row md:min-h-[calc(100vh-4rem)]">
        {/* Image panel */}
        <div className="w-full md:w-[58%] bg-ink/5 flex items-center justify-center">
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            width={900}
            height={1100}
            className="w-full h-auto md:max-h-[90vh] md:w-auto md:mx-auto object-contain"
            priority
          />
        </div>

        {/* Details panel */}
        <div className="w-full md:w-[42%] px-6 py-10 md:py-14 md:px-10 flex flex-col border-l border-ink/10">
          <Link
            href={`/artists/${artwork.artist_id}`}
            className="flex items-center gap-2 mb-7 group"
          >
            <span className="font-sans text-xs text-ink-muted">⊕</span>
            <span className="font-sans text-sm text-ink group-hover:text-accent transition-colors">
              {artwork.artist?.name}
            </span>
          </Link>

          <h1 className="font-serif text-3xl md:text-[2rem] leading-tight mb-1">
            {artwork.title}
          </h1>
          <p className="font-sans text-sm text-ink-muted mb-6">{artwork.year}</p>

          <div className="space-y-1 mb-6 font-sans text-sm text-ink-light">
            <p>{artwork.technique}</p>
            <p>{artwork.size}</p>
          </div>

          {artwork.description && (
            <p className="font-sans text-sm text-ink-light leading-relaxed mb-8">
              {artwork.description}
            </p>
          )}

          <p className="font-serif text-2xl mb-8">
            €{artwork.price?.toLocaleString()}
          </p>

          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex items-center gap-3">
              <FavoriteButton
                artworkId={artwork.id}
                className="text-ink hover:text-accent"
              />
              <span className="font-sans text-xs text-ink-light">Save</span>
            </div>

            <ArtworkDetailClient artwork={artwork} />
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="border-t border-ink/10 flex">
        <div className="flex-1 border-r border-ink/10 p-6">
          {prevArtwork && (
            <Link
              href={`/artworks/${prevArtwork.seq}`}
              className="flex items-center gap-3 group"
            >
              <span className="font-sans text-xs text-ink-muted">‹ PREV</span>
              <span className="font-sans text-xs text-ink-light group-hover:text-ink transition-colors">
                {prevArtwork.artist?.name}
              </span>
            </Link>
          )}
        </div>
        <div className="flex-1 p-6 flex justify-end">
          {nextArtwork && (
            <Link
              href={`/artworks/${nextArtwork.seq}`}
              className="flex items-center gap-3 group"
            >
              <span className="font-sans text-xs text-ink-light group-hover:text-ink transition-colors">
                {nextArtwork.artist?.name}
              </span>
              <span className="font-sans text-xs text-ink-muted">NEXT ›</span>
            </Link>
          )}
        </div>
      </div>

      {/* Personalized recommendations — behavior-based (§4.5) */}
      <RecommendedSection excludeIds={[artwork.id]} />
    </div>
  );
}
