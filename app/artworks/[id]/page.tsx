import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtworkDetailPageClient from "./ArtworkDetailPageClient";
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
    <ArtworkDetailPageClient
      artwork={artwork}
      prevArtwork={prevArtwork}
      nextArtwork={nextArtwork}
    />
  );
}
