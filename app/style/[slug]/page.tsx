import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import type { Metadata } from "next";

const SLUG_TO_LABEL: Record<string, string> = {
  "painting":       "Painting",
  "abstract":       "Abstract",
  "figurative":     "Figurative",
  "landscape":      "Landscape",
  "photography":    "Photography",
  "prints":         "Prints",
  "street-art-pop": "Street Art & Pop",
  "mixed-media":    "Mixed Media",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = SLUG_TO_LABEL[slug];
  if (!label) return {};
  return { title: `${label} — Riga Contemporary Art Fair` };
}

export default async function StyleCategoryPage({ params }: Props) {
  const { slug } = await params;
  const label = SLUG_TO_LABEL[slug];

  if (!label) notFound();

  const supabase = await createClient();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("*, artist:artists(id, name)")
    .contains("style_tags", [label])
    .order("seq", { ascending: true });

  return (
    <div className="bg-cream">
      <div className="pt-28 pb-4 px-5 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-light">{label}</h1>
        <p className="font-sans text-sm text-ink-muted mt-1">
          {artworks?.length ?? 0} work{artworks?.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ArtworkBrowseSection artworks={artworks ?? []} showPageOffset={false} />
    </div>
  );
}
