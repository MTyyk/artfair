import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtistDetailPageClient from "./ArtistDetailPageClient";
import type { Artwork } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("artists")
    .select("name")
    .eq("id", id)
    .single();
  return {
    title: data ? `${data.name} — Riga Contemporary Art Fair` : "Artist",
  };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: artist } = await supabase
    .from("artists")
    .select("*, artworks(*)")
    .eq("id", id)
    .single();

  if (!artist) notFound();

  // Inject artist reference into each artwork for ArtworkCard
  const artworks: Artwork[] = (artist.artworks ?? []).map((a: Artwork) => ({
    ...a,
    artist: { id: artist.id, name: artist.name },
  }));

  return (
    <ArtistDetailPageClient
      artist={{ id: artist.id, name: artist.name, bio: artist.bio ?? undefined }}
      artworks={artworks}
    />
  );
}
