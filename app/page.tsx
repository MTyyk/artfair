import ArtworkBrowseSection from "@/components/artworks/ArtworkBrowseSection";
import HomeHero from "@/components/home/HomeHero";
import { createClient } from "@/lib/supabase/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch browse artworks and hero images in parallel
  const [{ data: artworks }, { data: heroFiles }] = await Promise.all([
    supabase
      .from("artworks")
      .select("*, artist:artists(id, name)")
      .order("seq", { ascending: true }),
    supabase.storage.from("hero-images").list("", { sortBy: { column: "name", order: "asc" } }),
  ]);

  // Build public URLs for hero images from the bucket
  const heroImageUrls = (heroFiles ?? []).map(
    (file) => `${SUPABASE_URL}/storage/v1/object/public/hero-images/${file.name}`
  );

  return (
    <div className="bg-cream">
      <HomeHero heroImages={heroImageUrls} />
      <section id="browse" className="scroll-mt-20">
        <div id="home-browse-sentinel" className="h-px w-full" aria-hidden="true" />
        <ArtworkBrowseSection artworks={artworks ?? []} showPageOffset={false} />
      </section>
    </div>
  );
}
