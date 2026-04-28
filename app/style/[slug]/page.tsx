import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import type { Metadata } from "next";
import type { Artwork } from "@/lib/types";
import StyleCategoryHeader from "./StyleCategoryHeader";
import { STYLE_CATEGORY_FILTER_LABELS } from "@/lib/styleCategories";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = STYLE_CATEGORY_FILTER_LABELS[slug as keyof typeof STYLE_CATEGORY_FILTER_LABELS];
  if (!label) return {};
  return { title: `${label} — Riga Contemporary Art Fair` };
}

export default async function StyleCategoryPage({ params }: Props) {
  const { slug } = await params;
  const label = STYLE_CATEGORY_FILTER_LABELS[slug as keyof typeof STYLE_CATEGORY_FILTER_LABELS];

  if (!label) notFound();

  const supabase = await createClient();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("id, seq, title, image_url, price, technique, size, year, artist_id, style_tags, artist:artists(id, name)")
    .contains("style_tags", [label])
    .order("seq", { ascending: true });

  return (
    <div className="bg-cream">
      <StyleCategoryHeader slug={slug} count={artworks?.length ?? 0} />
      <ArtworkBrowseSection artworks={(artworks ?? []) as unknown as Artwork[]} showPageOffset={false} />
    </div>
  );
}
