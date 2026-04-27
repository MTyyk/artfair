import { createClient } from "@/lib/supabase/server";
import ArtistsPageClient from "./ArtistsPageClient";
import type { Artist } from "@/lib/types";

export const metadata = {
  title: "Artists — Riga Contemporary Art Fair",
};

export default async function ArtistsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("artists")
    .select("id, name")
    .order("name", { ascending: true });

  const artists: Pick<Artist, "id" | "name">[] = data ?? [];

  return <ArtistsPageClient artists={artists} />;
}
